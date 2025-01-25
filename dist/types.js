"use strict";
// types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = exports.AuthenticationError = exports.IQSuiteException = void 0;
// API Error Interfaces
/**
 * Base Exception Class for IQSuite
 */
class IQSuiteException extends Error {
    constructor(message) {
        super(message);
        this.name = 'IQSuiteException';
    }
}
exports.IQSuiteException = IQSuiteException;
/**
 * Authentication Error Class
 */
class AuthenticationError extends IQSuiteException {
    constructor(message = 'Invalid API key') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * General API Error Class
 */
class APIError extends IQSuiteException {
    constructor(message, statusCode, response) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.response = response;
    }
}
exports.APIError = APIError;
