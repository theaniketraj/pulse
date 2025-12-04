import * as React from "react";

// Component to display alerts
interface AlertPanelProps {
  alerts: Array<{ message: string; value: number; details?: string }>;
  loading?: boolean;
  error?: string | null;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, loading, error }) => {
  if (loading) return <div className="alert-status">Loading alerts...</div>;
  if (error) return <div className="alert-status error">Error: {error}</div>;

  return (
    <div className="alert-panel">
      {alerts.length === 0 ? (
        <div className="alert-empty">
          <span className="codicon codicon-check"></span>
          No active alerts. System is healthy.
        </div>
      ) : (
        <div className="alert-list">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-card ${
                alert.value === 1 ? "firing" : "pending"
              }`}
            >
              <div className="alert-indicator"></div>
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-name">{alert.message}</span>
                  <span className="alert-badge">
                    {alert.value === 1 ? "FIRING" : "PENDING"}
                  </span>
                </div>
                {alert.details && (
                  <div className="alert-details">{alert.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
