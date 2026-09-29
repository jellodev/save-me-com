declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = "G-9L0QSMPWWT";

export function track(event: string, params?: Record<string, string>) {
  window.gtag?.("event", event, params);
}
