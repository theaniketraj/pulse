// Simple logging utility for debugging
export function log(message: string, ...args: any[]) {
  console.log(`[Pulse Dashboard] ${message}`, ...args);
}

export function error(message: string, ...args: any[]) {
  console.error(`[Pulse Dashboard] ERROR: ${message}`, ...args);
}