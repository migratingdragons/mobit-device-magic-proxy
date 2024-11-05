import fs from "fs";
import path from 'path';
import axios from "axios";
import http from 'http';
import https from 'https';
import { Config, Event, Context, Response } from "./types";

const RETRY_CONFIG = {
  attempts: 3,
  initialDelay: 1000,
  maxDelay: 4000,
  backoffFactor: 2
};

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

async function submitToEndpoint(url: string, data: any): Promise<boolean> {
    for (let attempt = 1; attempt <= RETRY_CONFIG.attempts; attempt++) {
        try {
            const response = await axios.post(url, data, AXIOS_CONFIG);
            console.log(`Successfully submitted to ${url} (Status: ${response.status})`);
            return true;
        } catch (error: any) {
            const delay = Math.min(
                RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1),
                RETRY_CONFIG.maxDelay
            );

            if (attempt === RETRY_CONFIG.attempts) {
                console.error(`Failed to send to ${url}: ${error.message}`);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                }
                return false;
            }

            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
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

        const results = await Promise.all(
            formConfig.destination_urls.map(async url => {
                const success = await submitToEndpoint(url, body);
                return { url, success };
            })
        );

        // Log results
        console.log(`Form namespace: ${formNamespace}`);
        console.log(`Submission ID: ${body.metadata.submission_id}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        results.forEach(({url, success}) => {
            console.log(`Endpoint ${url}: ${success ? 'Success' : 'Failed'}`);
        });

        // If any submissions failed, return error status
        if (results.some(r => !r.success)) {
            return {
                statusCode: 207,
                body: JSON.stringify({
                    message: "Partial success - some endpoints failed",
                    details: results
                })
            };
        }

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
