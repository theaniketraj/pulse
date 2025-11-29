import * as React from 'react';

// Component to display alerts
interface AlertPanelProps {
  alerts: Array<{ message: string; value: number; details?: string }>;
  loading?: boolean;
  error?: string | null;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, loading, error }) => {
  if (loading) return <div className="alert-panel">Loading alerts...</div>;
  if (error) return <div className="alert-panel error">Error: {error}</div>;

  return (
    <div className="alert-panel">
      <h2>Alerts</h2>
      {alerts.length === 0 ? (
        <p>No active alerts</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index} className={`alert ${alert.value === 1 ? 'firing' : 'pending'}`}>
              <div className="alert-header">
                <span className="alert-name">{alert.message}</span>
                <span className="alert-state">{alert.value === 1 ? 'FIRING' : 'PENDING'}</span>
              </div>
              {alert.details && <div className="alert-details">{alert.details}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertPanel;