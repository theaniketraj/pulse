import * as React from 'react';

// Component to display alerts
interface AlertPanelProps {
  alerts: Array<{ message: string; value: number }>;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  return (
    <div className="alert-panel">
      <h2>Alerts</h2>
      {alerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index} className="alert">
              {alert.message} (Value: {alert.value})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertPanel;