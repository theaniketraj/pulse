import * as React from 'react';
import './App.css';
import Dashboard from './components/dashboard';

interface AppProps {
  vscode: any;
}

const App: React.FC<AppProps> = ({ vscode }) => {
  return (
    <div className="app">
      <h1>Pulse Dashboard</h1>
      <Dashboard vscode={vscode} />
    </div>
  );
};

export default App;