import * as React from 'react';
import Dashboard from './components/Dashboard';

// Main app component for the dashboard
const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Pulse Dashboard</h1>
      <Dashboard />
    </div>
  );
};

export default App;