import * as React from 'react';

// Hook to fetch metrics and logs from the extension
export function usePulseData() {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [logs, setLogs] = React.useState<string[]>([]);

    React.useEffect(() => {
        const vscode = acquireVsCodeApi();

        // Request metrics from the extension
        vscode.postMessage({ command: 'fetchMetrics', query: 'up' });

        // Handle messages from the extension
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'updateMetrics') {
                setMetrics(message.data);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return { metrics, logs };
}

function acquireVsCodeApi(): { postMessage: (msg: any) => void } {
    if (typeof window !== 'undefined' && (window as any).acquireVsCodeApi) {
        return (window as any).acquireVsCodeApi();
    }
    // Fallback for non-VS Code environments (no-op)
    return {
        postMessage: () => {},
    };
}