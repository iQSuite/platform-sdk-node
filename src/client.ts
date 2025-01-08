import axios, {
  AxiosInstance,
  AxiosResponse,
  RawAxiosRequestHeaders,
  AxiosHeaders,
} from "axios";
import {
  User,
  Index,
  DocumentListResponse,
  TaskResponse,
  TaskStatus,
  InstantRagResponse,
  InstantRagQueryResponse,
  AuthenticationError,
  APIError,
} from "./types";

interface IQSuiteClientOptions {
  apiKey: string;
  baseUrl?: string;
  verifySsl?: boolean;
}

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

export class IQSuiteClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor({
    apiKey,
    baseUrl = "https://iqsuite.ai/api/v1",
    verifySsl = true,
  }: IQSuiteClientOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, "");

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: new AxiosHeaders({
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      httpsAgent: verifySsl
        ? undefined
        : new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
    });
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<T> {
    const data = response.data;

    if (data.error) {
      throw new APIError(`API error: ${data.error}`, response.status, response);
    }

    return data;
  }

  private handleError(error: any): never {
    if (error.response) {
      if (error.response.status === 401) {
        throw new AuthenticationError("Invalid API key");
      }

      if (error.response.status === 422) {
        const errorMessage = error.response.data?.message || error.message;
        throw new APIError(
          `Validation error: ${errorMessage}`,
          error.response.status,
          error.response
        );
      }

      throw new APIError(
        `HTTP ${error.response.status} error: ${error.message}`,
        error.response.status,
        error.response
      );
    }

    throw new APIError(`Network error: ${error.message}`);
  }

  private getMimeType(filename: string): string {
    const extension = filename.toLowerCase().split(".").pop();
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      tiff: "image/tiff",
      bmp: "image/bmp",
    };

    const mimeType = mimeTypes[extension || ""];
    if (!mimeType) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    return mimeType;
  }

  async getUser(): Promise<User> {
    try {
      const response = await this.client.get("/user");
      return this.handleResponse<User>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listIndexes(): Promise<Index[]> {
    try {
      const response = await this.client.get("/index");
      return this.handleResponse<Index[]>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDocuments(indexId: string): Promise<DocumentListResponse> {
    try {
      const response = await this.client.get("/index/get-all-documents", {
        params: { index: indexId },
      });
      return this.handleResponse<DocumentListResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createIndex(
    document: Buffer | Blob,
    filename: string
  ): Promise<TaskResponse> {
    try {
      const mimeType = this.getMimeType(filename);
      if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
        throw new Error(
          `Unsupported file type: ${mimeType}. Supported types are: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, TIFF, BMP`
        );
      }

      const formData = new FormData();
      formData.append(
        "document",
        new Blob([document], { type: mimeType }),
        filename
      );

      const headers = new AxiosHeaders({
        "Content-Type": "multipart/form-data",
        Authorization: this.client.defaults.headers["Authorization"] as string,
      });

      const response = await this.client.post("/index/create", formData, {
        headers,
      });
      return this.handleResponse<TaskResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addDocument(
    indexId: string,
    document: Buffer | Blob,
    filename: string
  ): Promise<TaskResponse> {
    try {
      const mimeType = this.getMimeType(filename);
      if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
        throw new Error(
          `Unsupported file type: ${mimeType}. Supported types are: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, TIFF, BMP`
        );
      }

      const formData = new FormData();
      formData.append(
        "document",
        new Blob([document], { type: mimeType }),
        filename
      );
      formData.append("index", indexId);

      const headers = new AxiosHeaders({
        "Content-Type": "multipart/form-data",
        Authorization: this.client.defaults.headers["Authorization"] as string,
      });

      const response = await this.client.post("/index/add-document", formData, {
        headers,
      });
      return this.handleResponse<TaskResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createIndexAndPoll(
    document: Buffer | Blob,
    filename: string,
    maxRetries: number = 5,
    pollInterval: number = 5000
  ): Promise<[TaskResponse, TaskStatus]> {
    try {
      const response = await this.createIndex(document, filename);
      const taskId = response.data.task_id;

      let retries = 0;
      while (retries < maxRetries) {
        const status = await this.getTaskStatus(taskId);
        if (status.status === "completed") {
          return [response, status];
        } else if (status.status === "failed") {
          throw new APIError(`Task failed with status: ${status.status}`);
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        retries++;
      }

      throw new APIError(
        `Maximum retries (${maxRetries}) reached while polling task status`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addDocumentAndPoll(
    indexId: string,
    document: Buffer | Blob,
    filename: string,
    maxRetries: number = 5,
    pollInterval: number = 5000
  ): Promise<[TaskResponse, TaskStatus]> {
    try {
      const response = await this.addDocument(indexId, document, filename);
      const taskId = response.data.task_id;

      let retries = 0;
      while (retries < maxRetries) {
        const status = await this.getTaskStatus(taskId);
        if (status.status === "completed") {
          return [response, status];
        } else if (status.status === "failed") {
          throw new APIError(`Task failed with status: ${status.status}`);
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        retries++;
      }

      throw new APIError(
        `Maximum retries (${maxRetries}) reached while polling task status`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const response = await this.client.get(
        `/create-index/task-status/${taskId}`
      );
      return this.handleResponse<TaskStatus>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async chat(indexId: string, query: string): Promise<any> {
    try {
      const response = await this.client.post("/index/retrieve", {
        index: indexId,
        query,
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async search(indexId: string, query: string): Promise<any> {
    try {
      const response = await this.client.post("/index/search", {
        index: indexId,
        query,
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDocument(indexId: string, documentId: string): Promise<any> {
    try {
      const response = await this.client.post("/index/delete-document", {
        index: indexId,
        document: documentId,
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createInstantRag(context: string): Promise<InstantRagResponse> {
    try {
      const response = await this.client.post("/index/instant/create", {
        context,
      });
      return this.handleResponse<InstantRagResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async queryInstantRag(
    indexId: string,
    query: string
  ): Promise<InstantRagQueryResponse> {
    try {
      const response = await this.client.post("/index/instant/query", {
        index: indexId,
        query,
      });
      return this.handleResponse<InstantRagQueryResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export { AuthenticationError, APIError };
