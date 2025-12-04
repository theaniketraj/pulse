import * as React from "react";

// Component to display logs
interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogClass = (log: string) => {
    if (log.includes("[ERROR]")) return "log-error";
    if (log.includes("[WARN]")) return "log-warn";
    if (log.includes("[INFO]")) return "log-info";
    return "";
  };

  return (
    <div className="log-viewer">
      {logs.length === 0 ? (
        <div className="log-empty">Waiting for logs...</div>
      ) : (
        <div className="log-list">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogClass(log)}`}>
              <span className="log-line-number">
                {(index + 1).toString().padStart(3, "0")}
              </span>
              <span className="log-content">{log}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
};

export default LogViewer;
