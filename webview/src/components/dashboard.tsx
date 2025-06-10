import * as React from 'react';
import MetricChart from './MetricChart';
import LogViewer from './LogViewer';
import AlertPanel from './AlertPanel';
import { usePulseData } from '../hooks/usePulseData';
import { useAlerts } from '../hooks/useAlerts';

// Main dashboard component
const Dashboard: React.FC = () => {
  const { metrics, logs } = usePulseData();
  const { alerts } = useAlerts();

  return (
    <div className="dashboard">
      <MetricChart metrics={metrics} />
      <LogViewer logs={logs} />
      <AlertPanel alerts={alerts} />
    </div>
  );
};

export default Dashboard;