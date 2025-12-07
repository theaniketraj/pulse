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
      expect.objectContaining({
        params: { query: "up" },
        timeout: 5000
      })
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

  test("query retries on network error", async () => {
    jest.useFakeTimers();
    const networkError = new Error("Network Error");
    // @ts-ignore
    networkError.isAxiosError = true;
    // @ts-ignore
    networkError.code = "ECONNRESET";

    const successResponse = {
      data: {
        status: "success",
        data: { result: [] },
      },
    };

    mockedAxios.get
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockResolvedValue(successResponse);

    // Mock isAxiosError to return true for our error
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    const promise = api.query("up");
    
    // Fast-forward time for retries
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(result).toEqual(successResponse.data);
    jest.useRealTimers();
  });

  test("query throws after max retries", async () => {
    jest.useFakeTimers();
    const networkError = new Error("Network Error");
    // @ts-ignore
    networkError.isAxiosError = true;
    // @ts-ignore
    networkError.code = "ECONNRESET";

    mockedAxios.get.mockRejectedValue(networkError);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    const promise = api.query("up");
    const expectPromise = expect(promise).rejects.toThrow("Network error");
    
    // Fast-forward time for retries
    await jest.runAllTimersAsync();

    await expectPromise;
    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    jest.useRealTimers();
  });

  test("query does not retry on 404", async () => {
    const error404 = {
      response: { status: 404, statusText: "Not Found" },
      isAxiosError: true,
      message: "Request failed with status code 404"
    };

    mockedAxios.get.mockRejectedValue(error404);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(api.query("up")).rejects.toThrow("Network error: Request failed with status 404: Not Found");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
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
      "http://localhost:9090/api/v1/alerts",
      expect.objectContaining({
        timeout: 5000
      })
    );
    expect(result).toEqual(mockResponse.data);
  });
});
