import { Link, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/features/seller/components/ProductForm.jsx";
import { useSellerProduct } from "@/features/seller/hooks/useSellerProduct";

function PageShell({ title, children }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/seller/products"
        className="inline-flex items-center gap-2 text-sm text-lumo-gray-500 hover:text-lumo-navy transition mb-6"
      >
        <ArrowLeft size={16} />
        Volver a mis productos
      </Link>

      <h1 className="text-3xl font-bold text-lumo-navy mb-8">{title}</h1>

      {children}
    </div>
  );
}

function NewProduct() {
  const { seller } = useOutletContext();

  return (
    <PageShell title="Nuevo producto">
      <ProductForm seller={seller} initialProduct={null} />
    </PageShell>
  );
}

function EditProduct({ productId }) {
  const { seller } = useOutletContext();
  const { product, loading, error } = useSellerProduct(productId);

  if (loading) {
    return (
      <PageShell title="Editar producto">
        <p className="text-gray-500">Cargando producto...</p>
      </PageShell>
    );
  }

  if (error || !product) {
    return (
      <PageShell title="Producto no encontrado">
        <p className="text-gray-500">
          {error || "Este producto no existe o no tienes permiso para editarlo."}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Editar producto">
      <ProductForm key={product.id} seller={seller} initialProduct={product} />
    </PageShell>
  );
}

/** Sirve para /seller/products/new y /seller/products/:productId/edit */
export default function SellerProductFormPage() {
  const { productId } = useParams();

  return productId ? <EditProduct productId={productId} /> : <NewProduct />;
}
