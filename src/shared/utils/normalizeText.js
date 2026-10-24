/** Minúsculas y sin tildes, para comparar textos al buscar ("Café" = "cafe"). */
export function normalizeText(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
