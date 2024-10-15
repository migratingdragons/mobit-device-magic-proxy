export interface ConfigItem {
    name: string;
    form_namespace: string;
    destination_url: string;
}

export type Config = ConfigItem[];

export interface Event {
    body: string | any;
}

export interface Response {
    statusCode: number;
    body: string;
}
