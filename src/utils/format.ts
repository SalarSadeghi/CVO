const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });

export function formatDateTime(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${numberFormatter.format(bytes)} بایت`;
  if (bytes < 1024 * 1024) return `${numberFormatter.format(bytes / 1024)} کیلوبایت`;
  return `${numberFormatter.format(bytes / 1024 / 1024)} مگابایت`;
}

export function formatConfidence(value?: number): string {
  return value === undefined ? "—" : new Intl.NumberFormat("fa-IR", { style: "percent", maximumFractionDigits: 0 }).format(value);
}
