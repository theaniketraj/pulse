import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Acquire VS Code API once
const vscode = acquireVsCodeApi();

console.log('Rendering Pulse Dashboard');
const rootElement = document.getElementById('root');
function acquireVsCodeApi(): any {
  // @ts-ignore
  return window.acquireVsCodeApi();
}