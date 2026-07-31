export function money(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString("en-IN")}`;
  }
}

export function compact(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return String(Math.round(amount));
  }
}

export function formatDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}