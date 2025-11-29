import * as React from 'react';
import MetricChart from './MetricChart';
import LogViewer from './LogViewer';
import AlertPanel from './AlertPanel';
import { usePulseData } from '../hooks/usePulseData';
import { useAlerts } from '../hooks/useAlerts';

interface DashboardProps {
  vscode: any;
}

// Main dashboard component
const Dashboard: React.FC<DashboardProps> = ({ vscode }) => {
  const { metrics, logs, loading, error } = usePulseData(vscode);
  const { alerts } = useAlerts();

  return (
    <div className="dashboard">
      <MetricChart metrics={metrics} loading={loading} error={error} />
      <LogViewer logs={logs} />
      <AlertPanel alerts={alerts} />
    </div>
  );
};

export default Dashboard;