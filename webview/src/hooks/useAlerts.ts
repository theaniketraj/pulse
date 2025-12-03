import * as React from 'react';

// Hook to manage alerts
export function useAlerts(vscode: any) {
    const [alerts, setAlerts] = React.useState<Array<{ message: string; value: number }>>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!vscode) return;

        setLoading(true);

        // Initial fetch
        vscode.postMessage({ command: 'fetchAlerts' });

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            vscode.postMessage({ command: 'fetchAlerts' });
        }, 5000);

        // Handle alert messages from the extension
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'updateAlerts') {
                // Transform Prometheus alerts response to our format
                const rawAlerts = message.data?.data?.alerts || [];
                const formattedAlerts = rawAlerts.map((alert: any) => ({
                    message: alert.labels.alertname || 'Unknown Alert',
                    value: alert.state,
                    details: alert.annotations?.description || alert.annotations?.summary
                }));
                setAlerts(formattedAlerts);
                setLoading(false);
            } else if (message.command === 'alertError') {
                setError(message.message);
                setLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            clearInterval(interval);
        };
    }, [vscode]);

    return { alerts, loading, error };
}
