import * as vscode from 'vscode';

// Retrieves configuration settings from VS Code
export function getConfig(key: string): string | undefined {
  return vscode.workspace.getConfiguration('Pulse').get(key);
}