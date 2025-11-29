import * as React from 'react';

// Hook to manage alerts
export function useAlerts() {
    const [alerts, setAlerts] = React.useState<Array<{ message: string; value: number }>>([]);

    React.useEffect(() => {
        // Handle alert messages from the extension
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.command === 'triggerAlert') {
                setAlerts(prev => [...prev, message.data]);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return { alerts };
}
