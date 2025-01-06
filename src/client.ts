import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  User,
  Index,
  DocumentListResponse,
  TaskResponse,
  TaskStatus,
  AuthenticationError,
  APIError,
} from "./types";

interface IQSuiteClientOptions {
  apiKey: string;
  baseUrl?: string;
  verifySsl?: boolean;
}

export class IQSuiteClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor({
    apiKey,
    baseUrl = "https://iqsuite.test/api/v1",
    verifySsl = true,
  }: IQSuiteClientOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, "");

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

    return data.data || data;
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
      const formData = new FormData();
      formData.append(
        "document",
        new Blob([document], { type: "application/pdf" }),
        filename
      );

      const response = await this.client.post("/index/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      const formData = new FormData();
      formData.append(
        "document",
        new Blob([document], { type: "application/pdf" }),
        filename
      );
      formData.append("index", indexId);

      const response = await this.client.post("/index/add-document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return this.handleResponse<TaskResponse>(response);
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
}
export { AuthenticationError };

