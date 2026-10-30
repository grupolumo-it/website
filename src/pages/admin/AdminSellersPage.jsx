import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Ban, Check, RotateCcw, X } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAdminStores } from "@/features/stores/hooks/useAdminStores";
import { setStoreStatus } from "@/features/stores/storeService";
import { STORE_STATUS } from "@/features/stores/storeStatus";
import { normalizeText } from "@/shared/utils/normalizeText";

const FILTERS = [
  { key: "PENDING", label: "Pendientes" },
  { key: "ACTIVE", label: "Activos" },
  { key: "SUSPENDED", label: "Suspendidos" },
  { key: "REJECTED", label: "Rechazados" },
  { key: "ALL", label: "Todos" },
];

const BUTTON =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const BUTTON_STYLES = {
  approve: "border-green-200 text-green-600 hover:bg-green-50",
  danger: "border-red-200 text-red-600 hover:bg-red-50",
  neutral: "border-lumo-gray-200 text-lumo-navy hover:bg-lumo-gray-50",
};

// Qué acciones tiene cada estado
function getActions(status) {
  switch (status) {
    case "PENDING":
      return [
        { label: "Aprobar", Icon: Check, to: "ACTIVE", style: "approve", confirm: (name) => `¿Aprobar la tienda «${name}»? Su dueño pasará a ser vendedor.` },
        { label: "Rechazar", Icon: X, to: "REJECTED", style: "danger", confirm: (name) => `¿Rechazar la solicitud de «${name}»?` },
      ];
    case "ACTIVE":
      return [
        { label: "Suspender", Icon: Ban, to: "SUSPENDED", style: "danger", confirm: (name) => `¿Suspender «${name}»? No podrá editar sus productos mientras esté suspendida.` },
      ];
    default:
      return [
        { label: "Reactivar", Icon: RotateCcw, to: "ACTIVE", style: "neutral", confirm: (name) => `¿Reactivar «${name}»? Su dueño volverá a ser vendedor.` },
      ];
  }
}

function translateError(error) {
  // Los mensajes de la base de datos para estos casos ya están en español
  if (error?.code === "P0001" || error?.code === "42501") return error.message;

  return "No fue posible completar la acción. Inténtalo de nuevo.";
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ownerName(store) {
  return [store.owner_first_name, store.owner_last_name].filter(Boolean).join(" ") || "Sin nombre";
}

export default function AdminSellersPage() {
  const { user } = useAuth();
  const { stores, loading, error, reload } = useAdminStores();

  const [filter, setFilter] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  // Búsqueda del encabezado (?q=): tienda, dueño o correo
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const counts = { ALL: stores.length };
  for (const store of stores) counts[store.status] = (counts[store.status] ?? 0) + 1;

  // Mientras no elijas un filtro: Pendientes si hay solicitudes, y si no, Todos
  const activeFilter = filter ?? ((counts.PENDING ?? 0) > 0 ? "PENDING" : "ALL");

  const visible = stores
    .filter((store) => activeFilter === "ALL" || store.status === activeFilter)
    .filter(
      (store) =>
        !query ||
        normalizeText(`${store.store_name} ${ownerName(store)} ${store.owner_email}`).includes(
          normalizeText(query)
        )
    );

  async function handleAction(store, action) {
    if (!window.confirm(action.confirm(store.store_name))) return;

    setBusy(true);
    setActionError("");

    try {
      await setStoreStatus(store.id, action.to);
    } catch (err) {
      console.error("Error cambiando el estado de la tienda:", err);
      setActionError(translateError(err));
    } finally {
      setBusy(false);
      reload();
    }
  }

  return (
    <div>

      <h1 className="text-3xl font-bold text-lumo-navy">Vendedores</h1>
      <p className="text-lumo-gray-500 mt-1 mb-8">
        {query ? (
          <>
            Resultados para «{query}».{" "}
            <Link to="/admin/sellers" className="font-medium text-lumo-navy hover:underline">
              Quitar filtro
            </Link>
          </>
        ) : (
          "Revisa las solicitudes de tienda y administra a los vendedores."
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
              activeFilter === key
                ? "bg-lumo-navy border-lumo-navy text-white"
                : "bg-white border-lumo-gray-200 text-lumo-gray-600 hover:border-lumo-navy hover:text-lumo-navy"
            }`}
          >
            {label} <span className="opacity-70">({counts[key] ?? 0})</span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

      {loading && stores.length === 0 ? (
        <p className="text-gray-500">Cargando vendedores...</p>
      ) : visible.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">
            {query
              ? `No hay vendedores que coincidan con «${query}».`
              : activeFilter === "PENDING"
                ? "No hay solicitudes pendientes."
                : "No hay vendedores en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-lumo-gray-500 border-b border-lumo-gray-100">
                <th className="px-5 py-4 font-medium">Tienda</th>
                <th className="px-5 py-4 font-medium">Dueño</th>
                <th className="px-5 py-4 font-medium">Registro</th>
                <th className="px-5 py-4 font-medium">Productos</th>
                <th className="px-5 py-4 font-medium">Estado</th>
                <th className="px-5 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((store) => {
                const status = STORE_STATUS[store.status];
                const isOwnStore = store.user_id === user?.id;

                return (
                  <tr key={store.id} className="border-b border-lumo-gray-100 last:border-0 align-top">

                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-semibold text-lumo-navy">{store.store_name}</p>
                      {store.description && (
                        <p className="text-xs text-lumo-gray-500 mt-1 line-clamp-2">{store.description}</p>
                      )}
                      {store.tax_id && (
                        <p className="text-xs text-lumo-gray-400 mt-1">NIT / documento: {store.tax_id}</p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-lumo-navy">{ownerName(store)}</p>
                      <p className="text-xs text-lumo-gray-400">{store.owner_email}</p>
                    </td>

                    <td className="px-5 py-4 text-lumo-navy whitespace-nowrap">
                      {formatDate(store.created_at)}
                    </td>

                    <td className="px-5 py-4 text-lumo-navy">{store.products_count}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          status?.className ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {status?.label ?? store.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {isOwnStore ? (
                          <span className="text-xs text-lumo-gray-400">Tu tienda</span>
                        ) : (
                          getActions(store.status).map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              disabled={busy}
                              onClick={() => handleAction(store, action)}
                              className={`${BUTTON} ${BUTTON_STYLES[action.style]}`}
                            >
                              <action.Icon size={14} />
                              {action.label}
                            </button>
                          ))
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
