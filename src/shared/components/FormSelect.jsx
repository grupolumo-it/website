/** Lista desplegable con el mismo estilo que FormField. options: [{ value, label }] */
export default function FormSelect({ id, label, value, onChange, options, children, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none cursor-pointer focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {children}
    </div>
  );
}
