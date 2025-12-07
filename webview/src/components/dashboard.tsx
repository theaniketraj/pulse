import * as React from "react";
import MetricChart from "./MetricChart";
import LogViewer from "./LogViewer";
import AlertPanel from "./AlertPanel";
import { useVitalsData } from "../hooks/useVitalsData";
import { useAlerts } from "../hooks/useAlerts";

interface DashboardProps {
  vscode: any;
}

// Main dashboard component
const Dashboard: React.FC<DashboardProps> = ({ vscode }) => {
  const { metrics, kpis: fetchedKpis, logs, loading, error } = useVitalsData(vscode);
  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts(vscode);
  
  const [prometheusUrl, setPrometheusUrl] = React.useState<string>('');
  const [isDemoMode, setIsDemoMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Request Prometheus URL from extension
    vscode.postMessage({ command: 'getPrometheusUrl' });
    
    // Listen for response
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'prometheusUrl') {
        setPrometheusUrl(message.url);
        setIsDemoMode(message.isDemoMode);
      }
    };
    
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [vscode]);

  const handleConfigurePrometheus = () => {
    vscode.postMessage({ command: 'configurePrometheus' });
  };

  // KPI data
  const kpis = [
    { label: "Request Rate", value: fetchedKpis?.requestRate || "0/s" },
    { label: "Error Rate", value: fetchedKpis?.errorRate || "0%" },
    { label: "Avg Latency", value: fetchedKpis?.avgLatency || "0ms" },
    { label: "Active Alerts", value: alerts?.length || 0 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Vitals</h1>
        </div>
        <div className="header-actions">
          {isDemoMode && (
            <div className="demo-mode-badge" title="Using demo Prometheus with sample metrics">
              <span className="demo-icon">🎯</span>
              <span className="demo-text">Demo Mode</span>
              <button 
                className="connect-btn" 
                onClick={handleConfigurePrometheus}
                title="Connect to your own Prometheus instance"
              >
                Connect Prometheus
              </button>
            </div>
          )}
          <div className="live-badge">
            <span className="live-dot"></span>
            Live
          </div>
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
