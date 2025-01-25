"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IQSuiteException = exports.AuthenticationError = exports.APIError = exports.IQSuiteClient = void 0;
const axios_1 = __importStar(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const types_1 = require("./types");
Object.defineProperty(exports, "AuthenticationError", { enumerable: true, get: function () { return types_1.AuthenticationError; } });
Object.defineProperty(exports, "APIError", { enumerable: true, get: function () { return types_1.APIError; } });
Object.defineProperty(exports, "IQSuiteException", { enumerable: true, get: function () { return types_1.IQSuiteException; } });
const utils_1 = require("./utils");
const SUPPORTED_MIME_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/bmp",
]);
class IQSuiteClient {
    constructor({ apiKey, baseUrl = "https://iqsuite.ai/api/v1", verifySsl = true, }) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
        const headers = new axios_1.AxiosHeaders({
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        });
        const httpsAgent = verifySsl
            ? undefined
            : new (require("https").Agent)({
                rejectUnauthorized: false,
            });
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            headers,
            httpsAgent,
        });
        this.client.interceptors.request.use((config) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${apiKey}`;
            }
            return config;
        });
    }
    handleResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = response.data;
            if (data.error) {
                throw new types_1.APIError(`API error: ${data.error}`, response.status, response);
            }
            if (data.data) {
                return data.data;
            }
            return data;
        });
    }
    handleError(error) {
        var _a, _b;
        if (axios_1.default.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const message = ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.error) || error.message;
            if (status === 401) {
                throw new types_1.AuthenticationError("Invalid API key");
            }
            if (status === 422) {
                const errorMessage = ((_b = error.response.data) === null || _b === void 0 ? void 0 : _b.message) || message;
                throw new types_1.APIError(`Validation error: ${errorMessage}`, status, error.response);
            }
            throw new types_1.APIError(`HTTP ${status} error: ${message}`, status, error.response);
        }
        else if (error instanceof types_1.IQSuiteException) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new types_1.APIError(`Network error: ${error.message}`);
        }
        throw new types_1.APIError(`An unknown error occurred`);
    }
    validateMimeType(filename) {
        const mimeType = (0, utils_1.getMimeType)(filename);
        if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
            throw new Error(`Unsupported file type: ${mimeType}. Supported types are: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, TIFF, BMP`);
        }
        return mimeType;
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get("/user");
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    listIndexes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get("/index");
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    getDocuments(indexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get("/index/get-all-documents", {
                    params: { index: indexId },
                });
                return yield this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    createIndex(document, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mimeType = this.validateMimeType(filename);
                const formData = new form_data_1.default();
                formData.append("document", document, {
                    filename,
                    contentType: mimeType,
                });
                const response = yield this.client.post("/index/create", formData, {
                    headers: formData.getHeaders(),
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    addDocument(indexId, document, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mimeType = this.validateMimeType(filename);
                const formData = new form_data_1.default();
                formData.append("document", document, {
                    filename,
                    contentType: mimeType,
                });
                formData.append("index", indexId);
                const response = yield this.client.post("/index/add-document", formData, {
                    headers: formData.getHeaders(),
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    createIndexAndPoll(document_1, filename_1) {
        return __awaiter(this, arguments, void 0, function* (document, filename, maxRetries = 5, pollInterval = 5000) {
            try {
                const response = yield this.createIndex(document, filename);
                const taskId = response.task_id;
                let retries = 0;
                while (retries < maxRetries) {
                    const status = yield this.getTaskStatus(taskId);
                    if (status.status === "completed") {
                        return [response, status];
                    }
                    else if (status.status === "failed") {
                        throw new types_1.APIError(`Task failed with status: ${status.status}`);
                    }
                    yield this.delay(pollInterval);
                    retries++;
                }
                throw new types_1.APIError(`Maximum retries (${maxRetries}) reached while polling task status`);
            }
            catch (error) {
                if (error instanceof types_1.IQSuiteException) {
                    throw error;
                }
                throw new types_1.APIError(`Error in createIndexAndPoll: ${error}`);
            }
        });
    }
    addDocumentAndPoll(indexId_1, document_1, filename_1) {
        return __awaiter(this, arguments, void 0, function* (indexId, document, filename, maxRetries = 5, pollInterval = 5000) {
            try {
                const response = yield this.addDocument(indexId, document, filename);
                const taskId = response.task_id;
                if (!taskId) {
                    throw new types_1.APIError("Task ID is undefined");
                }
                let retries = 0;
                while (retries < maxRetries) {
                    const status = yield this.getTaskStatus(taskId);
                    if (status.status === "completed") {
                        return [response, status];
                    }
                    else if (status.status === "failed") {
                        throw new types_1.APIError(`Task failed with status: ${status.status}`);
                    }
                    yield this.delay(pollInterval);
                    retries++;
                }
                throw new types_1.APIError(`Maximum retries (${maxRetries}) reached while polling task status`);
            }
            catch (error) {
                if (error instanceof types_1.IQSuiteException) {
                    throw error;
                }
                throw new types_1.APIError(`Error in addDocumentAndPoll: ${error}`);
            }
        });
    }
    getTaskStatus(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get(`/create-index/task-status/${taskId}`);
                return yield this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    retrieve(indexId, query, document_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    index: indexId,
                    query,
                };
                if (document_id !== undefined) {
                    payload.document_id = document_id;
                }
                const response = yield this.client.post("/index/retrieve", payload);
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    search(indexId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post("/index/search", {
                    index: indexId,
                    query,
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    deleteDocument(indexId, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post("/index/delete-document", {
                    index: indexId,
                    document: documentId,
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    createInstantRag(context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post("/index/instant/create", {
                    context,
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    queryInstantRag(indexId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post("/index/instant/query", {
                    index: indexId,
                    query,
                });
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    listWebhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get("/webhooks");
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    createWebhook(url, name, secret, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    url,
                    name,
                    enabled,
                    secret,
                };
                const response = yield this.client.post("/webhooks", payload);
                return yield this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    updateWebhook(webhookId, url, name, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    webhook_id: webhookId,
                    url,
                    name,
                    enabled,
                };
                const response = yield this.client.post("/webhooks/update", payload);
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    deleteWebhook(webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = { webhook_id: webhookId };
                const response = yield this.client.post("/webhooks/delete", payload);
                return this.handleResponse(response);
            }
            catch (error) {
                throw this.handleError(error);
            }
        });
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.IQSuiteClient = IQSuiteClient;
