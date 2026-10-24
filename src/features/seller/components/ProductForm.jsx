import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/shared/components/FormField.jsx";
import FormTextarea from "@/shared/components/FormTextarea.jsx";
import ImageUploader from "@/features/seller/components/ImageUploader.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/features/auth/roles";
import { useCategories } from "@/features/categories/hooks/useCategories";
import {
  getProductImageUrls,
  saveSellerProduct,
} from "@/features/seller/sellerProductService";

const EMPTY_VALUES = {
  name: "",
  sku: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "0",
  discount: "0",
  badge: "",
  isActive: true,
  isFeatured: false,
};

function toFormValues(product) {
  if (!product) return EMPTY_VALUES;

  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    shortDescription: product.short_description ?? "",
    description: product.description ?? "",
    price: String(product.product_prices?.[0]?.price ?? ""),
    stock: String(product.stock ?? 0),
    discount: String(product.discount_percentage ?? 0),
    badge: product.badge ?? "",
    isActive: product.is_active,
    isFeatured: product.is_featured,
  };
}

function toImageItems(product) {
  return getProductImageUrls(product).map((url) => ({
    id: crypto.randomUUID(),
    url,
    file: null,
  }));
}

function validate(values, items, categoryIds) {
  if (!values.name.trim()) return "El nombre es obligatorio.";
  if (!values.sku.trim()) return "El SKU es obligatorio.";

  const price = Number(values.price);
  if (!values.price || Number.isNaN(price) || price <= 0) {
    return "Ingresa un precio válido, mayor a 0.";
  }

  const stock = Number(values.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    return "El stock debe ser un número entero de 0 o más.";
  }

  const discount = Number(values.discount);
  if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
    return "El descuento debe ser un número entero entre 0 y 100.";
  }

  if (items.length === 0) return "Agrega al menos una imagen del producto.";
  if (categoryIds.length === 0) return "Selecciona al menos una categoría.";

  return null;
}

function translateError(error) {
  if (error?.code === "23505") {
    return "Ya existe un producto con ese SKU o esa dirección. Cambia el SKU e inténtalo de nuevo.";
  }

  if (error?.code === "42501" || error?.message?.includes("row-level security")) {
    return "No tienes permiso para guardar este producto. Verifica que tu tienda esté activa.";
  }

  return "No fue posible guardar el producto. Inténtalo de nuevo.";
}

function Section({ title, description, children }) {
  return (
    <section className="bg-white rounded-2xl border border-lumo-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-lumo-navy">{title}</h2>
        {description && <p className="text-sm text-lumo-gray-500 mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/**
 * Formulario para crear (initialProduct = null) o editar un producto.
 * Al cambiar de producto, usar key={product.id} para reiniciar el formulario.
 */
export default function ProductForm({ seller, initialProduct }) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();

  const [values, setValues] = useState(() => toFormValues(initialProduct));
  const [items, setItems] = useState(() => toImageItems(initialProduct));
  const [categoryIds, setCategoryIds] = useState(
    () => initialProduct?.products_categories?.map((item) => item.category_id) ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialProduct);
  const canFeature = role === ROLES.ADMIN;

  const update = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  function toggleCategory(categoryId) {
    setCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const problem = validate(values, items, categoryIds);
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);

    try {
      await saveSellerProduct({
        product: initialProduct,
        sellerId: seller.id,
        values,
        items,
        categoryIds,
        canFeature,
      });

      navigate("/seller/products");
    } catch (err) {
      console.error("Error guardando el producto:", err);
      setError(translateError(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      <Section title="Información del producto">
        <FormField
          id="name"
          label="Nombre"
          value={values.name}
          onChange={update("name")}
          placeholder="Ej. Crema hidratante facial"
        />

        <FormField
          id="sku"
          label="SKU (código interno)"
          value={values.sku}
          onChange={update("sku")}
          placeholder="Ej. CRE-HID-001"
        />

        <FormTextarea
          id="shortDescription"
          label="Descripción corta"
          value={values.shortDescription}
          onChange={update("shortDescription")}
          rows={2}
          placeholder="Una línea que resuma el producto"
        />

        <FormTextarea
          id="description"
          label="Descripción completa"
          value={values.description}
          onChange={update("description")}
          rows={5}
        />
      </Section>

      <Section
        title="Precio e inventario"
        description="El precio es el que paga el cliente. Si agregas un descuento, se muestra además el precio anterior tachado."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            id="price"
            label="Precio (COP)"
            type="number"
            min="0"
            step="any"
            value={values.price}
            onChange={update("price")}
          />

          <FormField
            id="stock"
            label="Stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={update("stock")}
          />

          <FormField
            id="discount"
            label="Descuento (%)"
            type="number"
            min="0"
            max="100"
            step="1"
            value={values.discount}
            onChange={update("discount")}
          />
        </div>

        <FormField
          id="badge"
          label="Etiqueta (opcional)"
          value={values.badge}
          onChange={update("badge")}
          placeholder="Ej. Nuevo, Oferta"
        />
      </Section>

      <Section title="Categorías" description="Elige al menos una. Define en qué secciones aparece el producto.">
        {loadingCategories && <p className="text-sm text-lumo-gray-500">Cargando categorías...</p>}
        {categoriesError && <p className="text-sm text-red-600">{categoriesError}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 border border-lumo-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-lumo-navy has-[:checked]:border-lumo-navy has-[:checked]:bg-lumo-gray-50"
            >
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="accent-[var(--color-lumo-navy)] w-4 h-4"
              />
              <span className="text-sm text-lumo-navy">{category.name}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Imágenes" description="Cárgalas desde tu dispositivo. Se suben al guardar el producto.">
        <ImageUploader items={items} onChange={setItems} disabled={saving} />
      </Section>

      <Section title="Publicación">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) =>
              setValues((current) => ({ ...current, isActive: event.target.checked }))
            }
            className="accent-[var(--color-lumo-navy)] w-4 h-4 mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium text-lumo-navy">Publicado</span>
            <span className="block text-xs text-lumo-gray-500">
              Si lo desmarcas, el producto queda oculto en la tienda pero no se borra.
            </span>
          </span>
        </label>

        {canFeature && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(event) =>
                setValues((current) => ({ ...current, isFeatured: event.target.checked }))
              }
              className="accent-[var(--color-lumo-navy)] w-4 h-4 mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium text-lumo-navy">Destacado en el inicio</span>
              <span className="block text-xs text-lumo-gray-500">
                Solo los administradores pueden destacar productos.
              </span>
            </span>
          </label>
        )}
      </Section>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-4">
        <Link
          to="/seller/products"
          className="text-sm font-medium text-lumo-gray-500 hover:text-lumo-navy"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-lumo-navy hover:bg-lumo-navy-light text-white font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>

    </form>
  );
}
