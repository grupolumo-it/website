import { Link, useParams } from "react-router-dom";
import ProductGrid from "@/features/products/components/ProductGrid.jsx";
import { useProductsByCategory } from "@/features/products/hooks/useProductsByCategory";

export default function CategoryPage() {
  const { slug } = useParams();
  const { category, products, loading, error } = useProductsByCategory(slug);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-gray-500">Cargando productos...</p>
      </section>
    );
  }

  if (error || !category) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-lumo-navy">
          Categoría no encontrada
        </h1>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link
          to="/"
          className="inline-block mt-6 text-sm font-semibold text-lumo-navy hover:underline"
        >
          ← Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      {/* Ruta de navegación */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-lumo-navy transition-colors">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-lumo-navy font-medium">{category.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-lumo-navy">{category.name}</h1>
        <p className="text-gray-500 mt-2">
          {products.length === 1
            ? "1 producto"
            : `${products.length} productos`}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">
          Todavía no hay productos en esta categoría.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}

    </section>
  );
}
