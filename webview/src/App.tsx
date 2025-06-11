import * as React from 'react';
import './styles.css';

interface AppProps {
  vscode: any; // Replace with proper type if using TypeScript
}

const App: React.FC<AppProps> = ({ vscode }) => {
  React.useEffect(() => {
    // Example: Post message to extension
    vscode.postMessage({ command: 'fetchMetrics' });
  }, [vscode]);

  return (
    <div>
      <h1>Pulse Dashboard</h1>
      {/* Add your dashboard content */}
    </div>
  );
};

export default App;