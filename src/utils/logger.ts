// Simple logging utility for debugging
export function log(message: string, ...args: any[]) {
  console.log(`[Vitals] ${message}`, ...args);
}

export function error(message: string, ...args: any[]) {
  console.error(`[Vitals] ERROR: ${message}`, ...args);
}