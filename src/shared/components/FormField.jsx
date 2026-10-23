const INPUT_CLASSES =
  "w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none " +
  "focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10";

/**
 * Campo de formulario reutilizable: label + input.
 * - rightSlot: elemento posicionado a la derecha dentro del input (ej. ícono de ojo).
 * - children: contenido debajo del input (ej. requisitos de contraseña).
 */
export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  rightSlot,
  children,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`${INPUT_CLASSES} ${rightSlot ? "pr-12" : ""}`}
          {...inputProps}
        />
        {rightSlot}
      </div>

      {children}
    </div>
  );
}
