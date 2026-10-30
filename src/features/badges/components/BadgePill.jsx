import { getBadgeColorClass } from "@/features/badges/badgeColors";

/** Etiqueta de producto (ej. "NEW ARRIVAL") con el color que definió el administrador. */
export default function BadgePill({ name, color, className = "" }) {
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${getBadgeColorClass(color)} ${className}`}
    >
      {name}
    </span>
  );
}
