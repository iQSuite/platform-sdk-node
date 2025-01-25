export interface User {
    id: number;
    name?: string;
    email?: string;
    [key: string]: any;
}
export interface Index {
    id: string;
    name?: string;
    created_at?: Date;
    document_count?: number;
    [key: string]: any;
}
export interface Document {
    id: string;
    filename: string;
    created_at?: Date;
    updated_at?: Date;
    [key: string]: any;
}
export interface DocumentListData {
    documents: Document[];
    index: string;
    [key: string]: any;
}
export interface DocumentListResponse {
    data: DocumentListData;
}
export interface TaskStatus {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    task_id?: string;
    index_id?: string;
    [key: string]: any;
}
export interface TaskResponseData {
    message: string;
    task_id: string;
    check_status: string;
}
export interface InstantRagResponse {
    message: string;
    id: string;
    query_url: string;
}
export interface SourceDocument {
    id: string;
    file_name: string;
}
export interface InstantRagQueryResponse {
    uuid: string;
    total_tokens: number;
    retrieval_response: string;
    query: string;
    credits_cost: number;
}
export interface Webhook {
    id: string;
    name: string;
    enabled: string;
    created_at: string;
    updated_at: string;
}
export interface WebhookListResponse {
    data: Webhook[];
}
export interface WebhookResponse {
    webhook: Webhook;
}
export interface WebhookDeleteResponse {
    data: {
        [key: string]: string;
    };
}
export interface RetrieveResponse {
    results: any[];
    [key: string]: any;
}
export interface SearchResponse {
    results: any[];
    [key: string]: any;
}
/**
 * Base Exception Class for IQSuite
 */
export declare class IQSuiteException extends Error {
    constructor(message: string);
}
/**
 * Authentication Error Class
 */
export declare class AuthenticationError extends IQSuiteException {
    constructor(message?: string);
}
/**
 * General API Error Class
 */
export declare class APIError extends IQSuiteException {
    statusCode?: number;
    response?: any;
    constructor(message: string, statusCode?: number, response?: any);
}
export interface TaskResponse {
    data: TaskResponseData;
}
