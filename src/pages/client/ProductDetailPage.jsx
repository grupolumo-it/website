import { useParams } from "react-router-dom";
import ProductDetail from "@/features/products/components/ProductDetail.jsx";
import { useProduct } from "@/features/products/hooks/useProduct";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-gray-500">Cargando producto...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-lumo-navy">
          Producto no encontrado
        </h1>
        <p className="text-gray-500 mt-2">{error}</p>
      </section>
    );
  }

  return <ProductDetail product={product} />;
}
