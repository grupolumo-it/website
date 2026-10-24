import { useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useSellerProducts } from "@/features/seller/hooks/useSellerProducts";
import {
  deleteSellerProducts,
  setProductsActive,
} from "@/features/seller/sellerProductService";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { normalizeText } from "@/shared/utils/normalizeText";

const ICON_BUTTON =
  "w-9 h-9 rounded-lg flex items-center justify-center text-lumo-gray-500 hover:text-lumo-navy hover:bg-lumo-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const BULK_BUTTON =
  "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-lumo-gray-200 text-sm font-medium text-lumo-navy hover:bg-lumo-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

export default function SellerProductsPage() {
  const { seller } = useOutletContext();
  const { products: allProducts, loading, error, reload } = useSellerProducts(seller.id);

  // Búsqueda del encabezado (?q=): filtra por nombre o SKU.
  // "products" son los que se están viendo; la selección y las acciones en lote solo los consideran a ellos.
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const products = query
    ? allProducts.filter((product) =>
        normalizeText(`${product.name} ${product.sku}`).includes(normalizeText(query))
      )
    : allProducts;

  const [selected, setSelected] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  // Solo cuentan los seleccionados que siguen en la lista
  const selectedIds = products
    .filter((product) => selected.has(product.id))
    .map((product) => product.id);

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;
  const hasSelection = selectedIds.length > 0;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((product) => product.id)));
  }

  function toggleOne(productId) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  async function run(action) {
    setBusy(true);
    setActionError("");

    try {
      await action();
      setSelected(new Set());
    } catch (err) {
      console.error("Error en la acción sobre los productos:", err);
      setActionError("No fue posible completar la acción. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
      reload(); // también tras un fallo: puede haberse aplicado en parte
    }
  }

  function handleSetActive(ids, isActive) {
    run(() => setProductsActive(ids, isActive));
  }

  function handleDelete(ids, message) {
    if (window.confirm(message)) run(() => deleteSellerProducts(ids));
  }

  function handleBulkDelete() {
    const count = selectedIds.length;

    handleDelete(
      selectedIds,
      count === 1
        ? "¿Eliminar el producto seleccionado? Esta acción no se puede deshacer."
        : `¿Eliminar los ${count} productos seleccionados? Esta acción no se puede deshacer.`
    );
  }

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lumo-navy">Mis productos</h1>
          <p className="text-lumo-gray-500 mt-1">
            {query ? (
              <>
                {products.length === 1 ? "1 resultado" : `${products.length} resultados`} para «{query}».{" "}
                <Link to="/seller/products" className="font-medium text-lumo-navy hover:underline">
                  Quitar filtro
                </Link>
              </>
            ) : (
              <>Administra lo que vendes en {seller.store_name}.</>
            )}
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-lumo-navy hover:bg-lumo-navy-light text-white text-sm font-semibold transition"
        >
          <Plus size={18} />
          Nuevo producto
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

      {loading && allProducts.length === 0 ? (
        <p className="text-gray-500">Cargando tus productos...</p>
      ) : allProducts.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">Todavía no tienes productos.</p>
          <Link
            to="/seller/products/new"
            className="inline-block mt-4 text-sm font-semibold text-lumo-navy hover:underline"
          >
            Crear tu primer producto
          </Link>
        </div>
      ) : products.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">No hay productos que coincidan con «{query}».</p>
          <Link
            to="/seller/products"
            className="inline-block mt-4 text-sm font-semibold text-lumo-navy hover:underline"
          >
            Ver todos mis productos
          </Link>
        </div>
      ) : (
        <>
          {/* Barra de acciones en lote */}
          <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-lumo-gray-200 px-5 py-3 mb-4">

            <label className="flex items-center gap-3 cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(element) => {
                  if (element) element.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                disabled={busy}
                className="accent-[var(--color-lumo-navy)] w-4 h-4"
              />
              <span className="text-sm font-medium text-lumo-navy">Seleccionar todos</span>
            </label>

            <span className="text-sm text-lumo-gray-500 mr-auto">
              {hasSelection
                ? `${selectedIds.length} de ${products.length} seleccionados`
                : `${products.length} productos`}
            </span>

            <button
              type="button"
              disabled={!hasSelection || busy}
              onClick={() => handleSetActive(selectedIds, true)}
              className={BULK_BUTTON}
            >
              <Eye size={16} />
              Publicar
            </button>

            <button
              type="button"
              disabled={!hasSelection || busy}
              onClick={() => handleSetActive(selectedIds, false)}
              className={BULK_BUTTON}
            >
              <EyeOff size={16} />
              Ocultar
            </button>

            <button
              type="button"
              disabled={!hasSelection || busy}
              onClick={handleBulkDelete}
              className={`${BULK_BUTTON} hover:bg-red-50! hover:text-red-600! hover:border-red-200!`}
            >
              <Trash2 size={16} />
              Eliminar
            </button>

          </div>

          <div className="bg-white rounded-2xl border border-lumo-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-lumo-gray-500 border-b border-lumo-gray-100">
                  <th className="pl-5 py-4 w-10"><span className="sr-only">Seleccionar</span></th>
                  <th className="px-5 py-4 font-medium">Producto</th>
                  <th className="px-5 py-4 font-medium">Precio</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Estado</th>
                  <th className="px-5 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-lumo-gray-100 last:border-0 ${
                      selected.has(product.id) ? "bg-lumo-gray-50" : ""
                    }`}
                  >

                    <td className="pl-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleOne(product.id)}
                        disabled={busy}
                        aria-label={`Seleccionar ${product.name}`}
                        className="accent-[var(--color-lumo-navy)] w-4 h-4"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-lumo-navy truncate">{product.name}</p>
                          <p className="text-xs text-lumo-gray-400">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-lumo-navy whitespace-nowrap">
                      {formatCurrency(product.price, product.currency)}
                    </td>

                    <td className="px-5 py-4">
                      <span className={product.stock === 0 ? "text-red-500 font-medium" : "text-lumo-navy"}>
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          product.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.isActive ? "Publicado" : "Oculto"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/seller/products/${product.id}/edit`}
                          aria-label="Editar"
                          className={ICON_BUTTON}
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleSetActive([product.id], !product.isActive)}
                          aria-label={product.isActive ? "Ocultar" : "Publicar"}
                          className={ICON_BUTTON}
                        >
                          {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            handleDelete(
                              [product.id],
                              `¿Eliminar «${product.name}»? Esta acción no se puede deshacer.`
                            )
                          }
                          aria-label="Eliminar"
                          className={`${ICON_BUTTON} hover:text-red-500!`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}
