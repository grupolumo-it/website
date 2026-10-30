import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Eye, EyeOff, Pencil, Trash2, X } from "lucide-react";
import { useBadges } from "@/features/badges/hooks/useBadges";
import BadgePill from "@/features/badges/components/BadgePill.jsx";
import { BADGE_COLORS, DEFAULT_BADGE_COLOR } from "@/features/badges/badgeColors";
import { normalizeText } from "@/shared/utils/normalizeText";
import {
  createBadge,
  deleteBadge,
  updateBadge,
} from "@/features/badges/badgeService";

const MAX_NAME_LENGTH = 40;

const ICON_BUTTON =
  "w-9 h-9 rounded-lg flex items-center justify-center text-lumo-gray-500 hover:text-lumo-navy hover:bg-lumo-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function translateError(error) {
  if (error?.code === "23505") {
    return "Ya existe una etiqueta con ese nombre (sin importar mayúsculas).";
  }

  if (error?.code === "23514") {
    return `El nombre debe tener entre 1 y ${MAX_NAME_LENGTH} caracteres.`;
  }

  return "No fue posible completar la acción. Inténtalo de nuevo.";
}

export default function AdminBadgesPage() {
  const { badges: allBadges, loading, error, reload } = useBadges();

  // Búsqueda del encabezado (?q=): filtra las etiquetas por nombre
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const badges = query
    ? allBadges.filter((badge) => normalizeText(badge.name).includes(normalizeText(query)))
    : allBadges;

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_BADGE_COLOR);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(DEFAULT_BADGE_COLOR);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  async function run(action) {
    setBusy(true);
    setActionError("");

    try {
      await action();
      reload();
      return true;
    } catch (err) {
      console.error("Error en la acción sobre la etiqueta:", err);
      setActionError(translateError(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!newName.trim()) {
      setActionError("Escribe el nombre de la etiqueta.");
      return;
    }

    const ok = await run(() => createBadge({ name: newName, color: newColor }));
    if (ok) setNewName("");
  }

  function startEditing(badge) {
    setEditingId(badge.id);
    setEditName(badge.name);
    setEditColor(badge.color ?? DEFAULT_BADGE_COLOR);
    setActionError("");
  }

  async function saveEditing(badge) {
    const name = editName.trim();

    if (!name) {
      setActionError("El nombre no puede quedar vacío.");
      return;
    }

    if (name === badge.name && editColor === badge.color) {
      setEditingId(null);
      return;
    }

    const ok = await run(() => updateBadge(badge.id, { name, color: editColor }));
    if (ok) setEditingId(null);
  }

  function handleDelete(badge) {
    const confirmed = window.confirm(
      `¿Eliminar la etiqueta «${badge.name}»? Los productos que la usan quedarán sin etiqueta.`
    );

    if (confirmed) run(() => deleteBadge(badge.id));
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold text-lumo-navy">Etiquetas de productos</h1>
      <p className="text-lumo-gray-500 mt-1 mb-8">
        Son las únicas etiquetas que los vendedores pueden elegir al crear un producto.
        Una etiqueta inactiva no se puede elegir, pero los productos que ya la tienen la conservan.
      </p>

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Nueva etiqueta. Ej. Nuevo, Oferta, Más vendido"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10"
        />

        <select
          value={newColor}
          onChange={(event) => setNewColor(event.target.value)}
          aria-label="Color de la etiqueta"
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none cursor-pointer focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10"
        >
          {Object.entries(BADGE_COLORS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={busy}
          className="px-6 py-3 rounded-xl bg-lumo-navy hover:bg-lumo-blue text-white text-sm font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          Agregar
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

      {loading && allBadges.length === 0 ? (
        <p className="text-gray-500">Cargando etiquetas...</p>
      ) : allBadges.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">Todavía no hay etiquetas. Agrega la primera arriba.</p>
        </div>
      ) : badges.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">No hay etiquetas que coincidan con «{query}».</p>
          <Link
            to="/admin/badges"
            className="inline-block mt-4 text-sm font-semibold text-lumo-navy hover:underline"
          >
            Ver todas las etiquetas
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-lumo-gray-500 border-b border-lumo-gray-100">
                <th className="px-5 py-4 font-medium">Etiqueta</th>
                <th className="px-5 py-4 font-medium">Estado</th>
                <th className="px-5 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {badges.map((badge) => {
                const isEditing = editingId === badge.id;
                const isActive = badge.status === "ACTIVE";

                return (
                  <tr key={badge.id} className="border-b border-lumo-gray-100 last:border-0">

                    <td className="px-5 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") saveEditing(badge);
                              if (event.key === "Escape") setEditingId(null);
                            }}
                            maxLength={MAX_NAME_LENGTH}
                            autoFocus
                            className="flex-1 min-w-0 border border-lumo-navy rounded-lg px-3 py-2 outline-none"
                          />

                          <select
                            value={editColor}
                            onChange={(event) => setEditColor(event.target.value)}
                            aria-label="Color de la etiqueta"
                            className="border border-lumo-navy rounded-lg px-2 py-2 bg-white outline-none cursor-pointer"
                          >
                            {Object.entries(BADGE_COLORS).map(([key, { label }]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <BadgePill name={badge.name} color={badge.color} />
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => saveEditing(badge)}
                              aria-label="Guardar"
                              className={ICON_BUTTON}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancelar"
                              className={ICON_BUTTON}
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => startEditing(badge)}
                              aria-label="Renombrar"
                              className={ICON_BUTTON}
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                run(() =>
                                  updateBadge(badge.id, {
                                    status: isActive ? "INACTIVE" : "ACTIVE",
                                  })
                                )
                              }
                              aria-label={isActive ? "Desactivar" : "Activar"}
                              className={ICON_BUTTON}
                            >
                              {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleDelete(badge)}
                              aria-label="Eliminar"
                              className={`${ICON_BUTTON} hover:text-red-500!`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
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
