export interface ConfigItem {
    name: string;
    form_namespace: string;
    destination_urls: string[];
}

export type Config = ConfigItem[];

export interface Event {
    body: string;
    resource: string;
    path: string;
    httpMethod: string;
    isBase64Encoded: boolean;
    queryStringParameters: any;
    pathParameters: any;
    stageVariables: any;
    headers: any;
    requestContext: any;
}

export interface Context {
    // Add any necessary context properties
}

export interface Response {
    statusCode: number;
    body: string;
}
