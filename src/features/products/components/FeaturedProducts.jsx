import { Link } from "react-router-dom";
import ProductGrid from "@/features/products/components/ProductGrid.jsx";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";

export default function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <p className="text-center text-lumo-gray-500">Cargando productos...</p>
      </section>
    );
  }

  return (
    <section aria-label="Productos destacados" className="max-w-6xl mx-auto px-4 pb-20">

      {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

      <ProductGrid products={products} />

      <div className="mt-12 text-center">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-lumo-navy text-lumo-navy font-semibold hover:bg-lumo-navy hover:text-white transition"
        >
          Explorar nuestro catálogo completo
          <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
        </Link>
      </div>

    </section>
  );
}
