// types.ts

// User Interface
export interface User {
    id: number;
    name?: string;
    email?: string;
    [key: string]: any;
}

// Index Interface
export interface Index {
    id: string;
    name?: string;
    created_at?: Date;
    document_count?: number;
    [key: string]: any;
}

// Document Interface
export interface Document {
    id: string;
    filename: string;
    created_at?: Date;
    updated_at?: Date;
    [key: string]: any;
}

// Document List Data Interface
export interface DocumentListData {
    documents: Document[];
    index: string;
    [key: string]: any;
}

// Document List Response Interface
export interface DocumentListResponse {
    data: DocumentListData;
}

// Task Status Interface
export interface TaskStatus {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    task_id?: string;
    index_id?: string;
    [key: string]: any;
}

// Task Response Data Interface
export interface TaskResponseData {
    message: string;
    task_id: string;
    check_status: string;
    [key: string]: any;
}

// Task Response Interface
export interface TaskResponse {
    task_id: any;
    data: TaskResponseData;
}

// Instant RAG Response Interface
export interface InstantRagResponse {
    message: string;
    id: string;
    query_url: string;
}

// Source Document Interface
export interface SourceDocument {
    id: string;
    file_name: string;
}

// Instant RAG Query Response Interface
export interface InstantRagQueryResponse {
    uuid: string;
    total_tokens: number;
    answer: string;
    source_documents?: SourceDocument[];
}

// Webhook Interface
export interface Webhook {
    id: string;
    name: string;
    enabled: string;
    created_at: string;
    updated_at: string;
}

// Webhook List Response Interface
export interface WebhookListResponse {
    data: Webhook[];
}

// Webhook Response Interface
export interface WebhookResponse {
    webhook: Webhook;
}

// Webhook Delete Response Interface
export interface WebhookDeleteResponse {
    data: { [key: string]: string };
}

// Retrieve and Search Response Interfaces
// Assuming the structure based on typical API responses.
// You may need to adjust these based on your actual API responses.

export interface RetrieveResponse {
    results: any[]; // Replace 'any' with actual type if known
    [key: string]: any;
}

export interface SearchResponse {
    results: any[]; // Replace 'any' with actual type if known
    [key: string]: any;
}

// API Error Interfaces

/**
 * Base Exception Class for IQSuite
 */
export class IQSuiteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IQSuiteException';
    }
}

/**
 * Authentication Error Class
 */
export class AuthenticationError extends IQSuiteException {
    constructor(message: string = 'Invalid API key') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

/**
 * General API Error Class
 */
export class APIError extends IQSuiteException {
    statusCode?: number;
    response?: any;

    constructor(message: string, statusCode?: number, response?: any) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.response = response;
    }
}

export interface TaskResponse {
    data: TaskResponseData;
}