import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useSellerProducts } from "@/features/seller/hooks/useSellerProducts";
import {
  deleteSellerProduct,
  setProductActive,
} from "@/features/seller/sellerProductService";
import { formatCurrency } from "@/shared/utils/formatCurrency";

const ICON_BUTTON =
  "w-9 h-9 rounded-lg flex items-center justify-center text-lumo-gray-500 hover:text-lumo-navy hover:bg-lumo-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

export default function SellerProductsPage() {
  const { seller } = useOutletContext();
  const { products, loading, error, reload } = useSellerProducts(seller.id);

  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function runAction(productId, action) {
    setBusyId(productId);
    setActionError("");

    try {
      await action();
      reload();
    } catch (err) {
      console.error("Error en la acción sobre el producto:", err);
      setActionError("No fue posible completar la acción. Inténtalo de nuevo.");
    } finally {
      setBusyId(null);
    }
  }

  function handleDelete(product) {
    const confirmed = window.confirm(
      `¿Eliminar «${product.name}»? Esta acción no se puede deshacer.`
    );

    if (confirmed) runAction(product.id, () => deleteSellerProduct(product.id));
  }

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lumo-navy">Mis productos</h1>
          <p className="text-lumo-gray-500 mt-1">Administra lo que vendes en {seller.store_name}.</p>
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

      {loading && products.length === 0 ? (
        <p className="text-gray-500">Cargando tus productos...</p>
      ) : products.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
          <p className="text-lumo-gray-500">Todavía no tienes productos.</p>
          <Link
            to="/seller/products/new"
            className="inline-block mt-4 text-sm font-semibold text-lumo-navy hover:underline"
          >
            Crear tu primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-lumo-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-lumo-gray-500 border-b border-lumo-gray-100">
                <th className="px-5 py-4 font-medium">Producto</th>
                <th className="px-5 py-4 font-medium">Precio</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Estado</th>
                <th className="px-5 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-lumo-gray-100 last:border-0">

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
                        disabled={busyId === product.id}
                        onClick={() =>
                          runAction(product.id, () =>
                            setProductActive(product.id, !product.isActive)
                          )
                        }
                        aria-label={product.isActive ? "Ocultar" : "Publicar"}
                        className={ICON_BUTTON}
                      >
                        {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                      <button
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() => handleDelete(product)}
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
      )}

    </div>
  );
}
