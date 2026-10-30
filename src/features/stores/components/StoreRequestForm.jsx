import { useState } from "react";
import FormField from "@/shared/components/FormField.jsx";
import FormTextarea from "@/shared/components/FormTextarea.jsx";
import { requestStore } from "@/features/stores/storeService";

const INITIAL_VALUES = { storeName: "", description: "", taxId: "" };

function translateError(error) {
  // Los mensajes de la base de datos para estos casos ya están en español
  if (error?.code === "P0001" || error?.code === "42501") return error.message;

  return "No fue posible enviar tu solicitud. Inténtalo de nuevo.";
}

/** Formulario para que un cliente solicite abrir su tienda. */
export default function StoreRequestForm({ onSuccess }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!values.storeName.trim()) {
      setError("El nombre de la tienda es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      await requestStore(values);
      onSuccess();
    } catch (err) {
      console.error("Error solicitando la tienda:", err);
      setError(translateError(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      <FormField
        id="storeName"
        label="Nombre de tu tienda"
        value={values.storeName}
        onChange={update("storeName")}
        maxLength={60}
        placeholder="Ej. Natural Glow"
      />

      <FormTextarea
        id="description"
        label="Cuéntanos qué vas a vender (opcional)"
        value={values.description}
        onChange={update("description")}
        rows={4}
        maxLength={500}
      />

      <FormField
        id="taxId"
        label="NIT o documento fiscal (opcional)"
        value={values.taxId}
        onChange={update("taxId")}
        maxLength={30}
      >
        <p className="text-xs text-lumo-gray-500 mt-2">
          Solo lo ve el equipo de Lumo para revisar tu solicitud.
        </p>
      </FormField>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 rounded-xl bg-lumo-navy hover:bg-lumo-blue text-white font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        {saving ? "Enviando..." : "Enviar solicitud"}
      </button>

    </form>
  );
}
