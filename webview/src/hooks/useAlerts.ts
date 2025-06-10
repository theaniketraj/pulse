import * as React from 'react';

// Hook to manage alerts
export function useAlerts() {
    const [alerts, setAlerts] = React.useState<Array<{ message: string; value: number }>>([]);

    React.useEffect(() => {
        const vscode = acquireVsCodeApi();

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

// Implementation for VS Code Webview API acquisition
function acquireVsCodeApi(): {
    postMessage: (message: any) => void;
    setState: (state: any) => void;
    getState: () => any;
} {
    if (typeof window !== 'undefined' && (window as any).acquireVsCodeApi) {
        return (window as any).acquireVsCodeApi();
    }
    // Fallback mock for non-webview environments
    return {
        postMessage: () => {},
        setState: () => {},
        getState: () => undefined,
    };
}

