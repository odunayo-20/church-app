export {};

declare global {
  interface Window {
    __NEXT_DATA__: Record<string, unknown>;
  }
}
