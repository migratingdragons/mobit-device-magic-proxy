import fs from "fs";
import path from 'path';
import axios from "axios";
import { Config, Event, Context, Response } from "./types";

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
            formConfig.destination_urls.map(url => 
                axios.post(url, body, {
                    maxRedirects: 5,
                    validateStatus: function (status) {
                        return status >= 200 && status < 400; // Accept redirects as valid
                    }
                }).then(response => {
                    console.log(`Destination URL: ${url}`);
                    console.log(`Initial status: ${response.status}`);
                    if (response.request && response.request._redirectable) {
                        const redirects = response.request._redirectable._redirectCount;
                        console.log(`Redirects followed: ${redirects}`);
                        if (redirects > 0) {
                            console.log(`Final URL after redirects: ${response.request.res.responseUrl}`);
                        }
                    }
                    return response;
                })
            )
        ).then(responses => {
            console.log(`Namespace: ${formNamespace}`);
            console.log(`Submission ID: ${body.metadata.submission_id}`);
            console.log(`Datetime: ${new Date().toISOString()}`);
            responses.forEach((response, index) => {
                const status = response.status;
                const statusText = response.statusText;
                console.log(`Destination ${index + 1} final status: ${status} (${statusText})`);
                console.log(`Success: ${status >= 200 && status < 300 ? "Yes" : "No"}`);
            });
        }).catch(err => {
            console.error('Background processing error:', err);
            if (err.response) {
                console.error(`Response status: ${err.response.status}`);
                console.error(`Response data:`, err.response.data);
            }
            if (err.request) {
                console.error('Request was made but no response received');
            }
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
