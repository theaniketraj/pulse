import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Acquire VS Code API once
const vscode = acquireVsCodeApi();
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(<App vscode={vscode} />);

console.log('Rendering Pulse Dashboard');
function acquireVsCodeApi(): any {
  // @ts-ignore
  return window.acquireVsCodeApi();
}