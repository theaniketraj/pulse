import * as React from 'react';

// Hook to fetch metrics and logs from the extension
export function usePulseData(vscode: any) {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [logs, setLogs] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!vscode) return;

        setLoading(true);
        setError(null);

        // Request metrics and logs from the extension
        vscode.postMessage({ command: 'fetchMetrics', query: 'up' });
        vscode.postMessage({ command: 'fetchLogs' });

        // Handle messages from the extension
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'updateMetrics') {
                setMetrics(message.data);
                setLoading(false);
            } else if (message.command === 'updateLogs') {
                setLogs(message.data);
            } else if (message.command === 'error') {
                setError(message.message);
                setLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [vscode]);

    return { metrics, logs, loading, error };
}