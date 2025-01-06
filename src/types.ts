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
    created_at?: Date;
    updated_at?: Date;
    [key: string]: any;
}

export interface DocumentListResponse {
    documents: Document[];
    index: string;
    [key: string]: any;
}

export interface TaskStatus {
    status: string;
    task_id?: string;
    [key: string]: any;
}

export interface TaskResponse {
    message: string;
    task_id: string;
    check_status: string;
    [key: string]: any;
}

export class IQSuiteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IQSuiteException';
    }
}

export class AuthenticationError extends IQSuiteException {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

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