import fs from "fs";
import path from 'path';
import axios from "axios";
import http from 'http';
import https from 'https';
import { Config, Event, Context, Response } from "./types";

const AXIOS_CONFIG = {
    timeout: 29000, // 29 second timeout (Lambda max is 30s)
    maxContentLength: 10485760, // 10MB
    maxBodyLength: 10485760, // 10MB
    decompress: true, // Handle gzip responses
    headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        'Connection': 'keep-alive'
    },
    validateStatus: (status: number) => status >= 200 && status < 400,
    maxRedirects: 5,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true })
};

async function retryRequest(url: string, data: any, retries = 3): Promise<any> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.post(url, data, AXIOS_CONFIG);
            return response;
        } catch (error) {
            if (attempt === retries - 1) throw error;
            
            const waitTime = Math.min(1000 * Math.pow(2, attempt), 8000); // Max 8 second wait
            console.log(`Request failed, retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

const config: Config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

export const lambdaHandler = async (event: Event, context: Context): Promise<Response> => {
    // Tell Lambda not to wait for the event loop to be empty before returning
    context.callbackWaitsForEmptyEventLoop = false;
    
    try {
        const body = JSON.parse(event.body);
        const formNamespace = body.metadata.form_namespace;
        console.log(JSON.stringify(event.body));

        const formConfig = config.find((c) => formNamespace.startsWith(c.form_namespace));
        if (!formConfig) {
            console.error(`Form namespace not found: ${formNamespace}`);
            return {
                statusCode: 404,
                body: JSON.stringify({ 
                    error: "Form namespace not found in configuration",
                    namespace: formNamespace
                }),
            };
        }

        // Return success immediately
        const response: Response = {
            statusCode: 200,
            body: JSON.stringify({ message: "Request accepted for processing" }),
        };

        // Process the webhooks in the background
        Promise.all(
            formConfig.destination_urls.map(async url => {
                try {
                    const response = await retryRequest(url, body);
                    console.log(`Successfully sent to ${url}`);
                    console.log(`Status: ${response.status}`);
                    return response;
                } catch (error: any) {
                    console.error(`Failed to send to ${url}:`, error.message);
                    if (error.response) {
                        console.error('Response status:', error.response.status);
                        console.error('Response data:', error.response.data);
                    }
                    throw error; // Re-throw to be caught by the outer catch
                }
            })
        ).then(responses => {
            console.log(`Namespace: ${formNamespace}`);
            console.log(`Submission ID: ${body.metadata.submission_id}`);
            console.log(`Datetime: ${new Date().toISOString()}`);
            responses.forEach((response, index) => {
                console.log(`Destination ${index + 1} status: ${response.status}`);
            });
        }).catch(err => {
            console.error('Background processing error:', {
                message: err.message,
                code: err.code,
                status: err.response?.status,
                data: err.response?.data
            });
        });

        return response;
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: "Internal server error",
                    message: err.message
                }),
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Unknown error occurred" }),
        };
    }
};
