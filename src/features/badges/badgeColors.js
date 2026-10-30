// Colores disponibles para las etiquetas de producto.
// La clave ("navy", "purple"...) es la que se guarda en product_badges.color.
export const BADGE_COLORS = {
  navy: { label: "Azul marino", className: "bg-lumo-navy text-white" },
  purple: { label: "Morado", className: "bg-lumo-purple-dark text-white" },
  amber: { label: "Naranja", className: "bg-amber-600 text-white" },
  green: { label: "Verde", className: "bg-green-600 text-white" },
  red: { label: "Rojo", className: "bg-red-600 text-white" },
  gray: { label: "Gris", className: "bg-lumo-gray-500 text-white" },
};

export const DEFAULT_BADGE_COLOR = "navy";

export function getBadgeColorClass(color) {
  return (BADGE_COLORS[color] ?? BADGE_COLORS[DEFAULT_BADGE_COLOR]).className;
}
