export default interface Serve {
  enabled: boolean;
  port: number;
  bind?: string;
  mapping: Record<string, string>;
}
