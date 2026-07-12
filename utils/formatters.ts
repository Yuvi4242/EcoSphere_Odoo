/**
 * Formats carbon values into appropriate units (kilograms or metric tonnes of CO2 equivalent)
 */
export function formatCarbon(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO2e`;
  }
  return `${kg.toFixed(0)} kg CO2e`;
}

/**
 * Formats values as percentage strings
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Formats standard Javascript Date objects or ISO strings into user-friendly layouts
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
