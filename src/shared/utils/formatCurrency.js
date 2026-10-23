/**
 * Formatea un valor como moneda (por defecto pesos colombianos, sin decimales).
 * formatCurrency(49900) -> "$ 49.900"
 */
export function formatCurrency(amount, currency = "COP") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency || "COP",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}
