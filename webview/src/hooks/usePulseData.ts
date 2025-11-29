import * as React from 'react';

// Hook to fetch metrics and logs from the extension
export function usePulseData(vscode: any) {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [logs, setLogs] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!vscode) return;

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
    }, [vscode]);

    return { metrics, logs };
}