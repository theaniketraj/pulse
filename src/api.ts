import axios from "axios";
import * as vscode from "vscode";

export class PrometheusApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash if present
  }

  /**
   * Fetches alerts from the Prometheus API.
   * @returns The JSON response from Prometheus alerts endpoint.
   */
  public async getAlerts(): Promise<any> {
    try {
      const url = `${this.baseUrl}/api/v1/alerts`;
      const response = await axios.get(url);

      if (response.data.status !== "success") {
        throw new Error(`Prometheus API error: ${response.data.error}`);
      }

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch alerts:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetches metrics from the Prometheus API.
   * @param query The PromQL query string.
   * @returns The JSON response from Prometheus.
   */
  public async query(query: string): Promise<any> {
    if (!query) {
      throw new Error("Query cannot be empty");
    }

    try {
      const url = `${this.baseUrl}/api/v1/query`;
      const response = await axios.get(url, {
        params: { query },
      });

      if (response.data.status !== "success") {
        throw new Error(`Prometheus API error: ${response.data.error}`);
      }

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch metrics:", error);
      // Re-throw with a user-friendly message if possible
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }
}

export enum MessageTypes {
  TRIGGER_ALERT = "TRIGGER_ALERT",
  UPDATE_METRICS = "UPDATE_METRICS",
  UPDATE_LOGS = "UPDATE_LOGS",
}

export function sendMessageToWebview(webview: vscode.Webview, message: any) {
  webview.postMessage(message);
}
