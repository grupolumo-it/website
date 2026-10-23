export default function ProductAttributes({ attributes = [] }) {
  if (attributes.length === 0) return null;

  return (
    <div className="mt-20">

      <h2 className="text-2xl font-bold text-lumo-navy mb-6">
        Especificaciones
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="bg-gray-50 rounded-xl p-5">

            <p className="text-sm font-semibold text-lumo-navy mb-3">
              {attribute.type}
            </p>

            <div className="text-sm text-gray-600">
              {typeof attribute.content === "object" ? (
                Object.entries(attribute.content).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-medium">{key}</span>
                    <span>{value}</span>
                  </div>
                ))
              ) : (
                <p>{attribute.content}</p>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
