import { User, Index, DocumentListResponse, TaskResponse, TaskStatus, InstantRagResponse, InstantRagQueryResponse, WebhookListResponse, WebhookResponse, WebhookDeleteResponse, AuthenticationError, APIError, IQSuiteException } from "./types";
interface IQSuiteClientOptions {
    apiKey: string;
    baseUrl?: string;
    verifySsl?: boolean;
}
export declare class IQSuiteClient {
    private client;
    private baseUrl;
    constructor({ apiKey, baseUrl, verifySsl, }: IQSuiteClientOptions);
    private handleResponse;
    private handleError;
    private validateMimeType;
    getUser(): Promise<User>;
    listIndexes(): Promise<Index[]>;
    getDocuments(indexId: string): Promise<DocumentListResponse>;
    createIndex(document: Buffer | Blob, filename: string): Promise<TaskResponse>;
    addDocument(indexId: string, document: Buffer | Blob, filename: string): Promise<TaskResponse>;
    createIndexAndPoll(document: Buffer | Blob, filename: string, maxRetries?: number, pollInterval?: number): Promise<[TaskResponse, TaskStatus]>;
    addDocumentAndPoll(indexId: string, document: Buffer | Blob, filename: string, maxRetries?: number, pollInterval?: number): Promise<[TaskResponse, TaskStatus]>;
    getTaskStatus(taskId: string): Promise<TaskStatus>;
    retrieve(indexId: string, query: string): Promise<any>;
    search(indexId: string, query: string): Promise<any>;
    deleteDocument(indexId: string, documentId: string): Promise<any>;
    createInstantRag(context: string): Promise<InstantRagResponse>;
    queryInstantRag(indexId: string, query: string): Promise<InstantRagQueryResponse>;
    listWebhooks(): Promise<WebhookListResponse>;
    createWebhook(url: string, name: string, secret: string, enabled: boolean): Promise<WebhookResponse>;
    updateWebhook(webhookId: string, url: string, name: string, enabled: boolean): Promise<WebhookResponse>;
    deleteWebhook(webhookId: string): Promise<WebhookDeleteResponse>;
    private delay;
}
export { InstantRagQueryResponse, TaskStatus, TaskResponse, DocumentListResponse, User, Index, APIError, AuthenticationError, IQSuiteException };
