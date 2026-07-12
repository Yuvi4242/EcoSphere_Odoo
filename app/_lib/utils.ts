// Tiny utility for className merging without clsx/tailwind-merge dependency
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Format number with commas
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Format date string
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Is date past today?
export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

// Average of numeric array
export function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
