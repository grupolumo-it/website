/** Campo de texto multilínea con el mismo estilo que FormField. */
export default function FormTextarea({ id, label, value, onChange, rows = 4, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none resize-y focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10"
        {...props}
      />
    </div>
  );
}
