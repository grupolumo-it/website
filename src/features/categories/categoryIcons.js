/**
 * La columna "icon" de la tabla categories es texto. Aquí se traduce a las clases
 * de Font Awesome. Acepta el formato de Font Awesome ("fa-solid fa-leaf", "fa-leaf")
 * y nombres simples ("leaf"). Si está vacío, usa un ícono genérico.
 *
 * Si algún nombre no existe en Font Awesome, el ícono se verá vacío:
 * revisa el nombre en https://fontawesome.com/icons (versión gratuita, estilo "solid").
 */
const ALIASES = {
  cpu: "microchip",
  home: "house",
  "house-chimney": "house",
  apple: "apple-whole",
  tshirt: "shirt",
  "t-shirt": "shirt",
  "paw-print": "paw",
  pawprint: "paw",
  sparkles: "wand-magic-sparkles",
  book: "book-open",
  mobile: "mobile-screen",
  smartphone: "mobile-screen",
};

// Prefijos de estilo de Font Awesome: no son el nombre del ícono
const STYLE_TOKENS = new Set([
  "fa", "fas", "far", "fab",
  "fa-solid", "fa-regular", "fa-brands", "fa-light", "fa-thin",
]);

const DEFAULT_ICON = "fa-solid fa-tag";

export function getCategoryIconClass(value) {
  const tokens = String(value || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const names = tokens.filter((token) => !STYLE_TOKENS.has(token));

  const rawName = (names[0] ?? "").replace(/^fa-/, "").replace(/_/g, "-");

  if (!rawName) return DEFAULT_ICON;

  const style = tokens.some((t) => t === "fa-regular" || t === "far")
    ? "fa-regular"
    : tokens.some((t) => t === "fa-brands" || t === "fab")
      ? "fa-brands"
      : "fa-solid";

  return `${style} fa-${ALIASES[rawName] ?? rawName}`;
}
