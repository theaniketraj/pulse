import axios from "axios";
import { PrometheusApi } from "../api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PrometheusApi", () => {
  let api: PrometheusApi;

  beforeEach(() => {
    api = new PrometheusApi("http://localhost:9090");
    jest.clearAllMocks();
  });

  test("query throws error for empty query", async () => {
    await expect(api.query("")).rejects.toThrow("Query cannot be empty");
  });

  test("query constructs correct URL and returns data", async () => {
    const mockResponse = {
      data: {
        status: "success",
        data: { result: [] },
      },
    };

    // Setup the mock to return our response
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await api.query("up");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:9090/api/v1/query",
      { params: { query: "up" } }
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("query handles API errors", async () => {
    const mockErrorResponse = {
      data: {
        status: "error",
        error: "invalid query",
      },
    };

    mockedAxios.get.mockResolvedValue(mockErrorResponse);

    await expect(api.query("bad_query")).rejects.toThrow(
      "Prometheus API error: invalid query"
    );
  });

  test("getAlerts fetches alerts correctly", async () => {
    const mockResponse = {
      data: {
        status: "success",
        data: { alerts: [] },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await api.getAlerts();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:9090/api/v1/alerts"
    );
    expect(result).toEqual(mockResponse.data);
  });
});
