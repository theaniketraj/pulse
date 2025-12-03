import * as React from "react";
import MetricChart from "./MetricChart";
import LogViewer from "./LogViewer";
import AlertPanel from "./AlertPanel";
import { usePulseData } from "../hooks/usePulseData";
import { useAlerts } from "../hooks/useAlerts";

interface DashboardProps {
  vscode: any;
}

// Main dashboard component
const Dashboard: React.FC<DashboardProps> = ({ vscode }) => {
  const { metrics, logs, loading, error } = usePulseData(vscode);
  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts(vscode);

  // Mock KPI data for now
  const kpis = [
    { label: "Request Rate", value: "1.2k/s" },
    { label: "Error Rate", value: "0.05%" },
    { label: "Avg Latency", value: "45ms" },
    { label: "Active Alerts", value: alerts?.length || 0 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Pulse</h1>
        </div>
        <div className="live-badge">
          <span className="live-dot"></span>
          Live
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* KPI Section */}
        <div className="kpi-section">
          {kpis.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="card area-chart">
          <div className="card-header">System Metrics</div>
          <div className="card-body">
            <MetricChart metrics={metrics} loading={loading} error={error} />
          </div>
        </div>

        {/* Logs Area */}
        <div className="card area-logs">
          <div className="card-header">Live Logs</div>
          <div className="card-body" style={{ padding: 0 }}>
            <LogViewer logs={logs} />
          </div>
        </div>

        {/* Alerts Area */}
        <div className="card area-alerts">
          <div className="card-header">Active Alerts</div>
          <div className="card-body">
            <AlertPanel
              alerts={alerts}
              loading={alertsLoading}
              error={alertsError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
