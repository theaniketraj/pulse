import * as React from "react";

// Hook to fetch metrics and logs from the extension
export function useData(vscode: any) {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!vscode) return;

    setLoading(true);
    setError(null);

    // Initial fetch
    vscode.postMessage({ command: "fetchMetrics", query: "up" });
    vscode.postMessage({ command: "fetchLogs" });

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      vscode.postMessage({ command: "fetchMetrics", query: "up" });
      vscode.postMessage({ command: "fetchLogs" });
    }, 5000);

    // Handle messages from the extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === "updateMetrics") {
        setMetrics(message.data);
        setLoading(false);
      } else if (message.command === "updateLogs") {
        setLogs(message.data);
      } else if (message.command === "error") {
        setError(message.message);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [vscode]);

  return { metrics, logs, loading, error };
}
