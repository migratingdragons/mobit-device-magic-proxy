import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Config, Event, Response } from './types';

const config: Config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

export async function processRequest(event: Event): Promise<Response> {
    try {
        const body = event.body;
        const formNamespace = body.metadata.form_namespace;

        const formConfig = config.find((c) => c.form_namespace === formNamespace);
        if (!formConfig) {
            throw new Error("Form namespace not found in configuration");
        }

        const response = await axios.post(formConfig.destination_url, body, {
            maxRedirects: 5,
        });

        console.log(`Namespace: ${formNamespace}`);
        console.log(`Submission ID: ${body.metadata.submission_id}`);
        console.log(`Datetime: ${new Date().toISOString()}`);
        console.log(`Status: ${response.status === 200 ? "Success" : "Fail"}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Request processed successfully" }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
}