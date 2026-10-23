import ProductCard from "@/features/products/components/ProductCard.jsx";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";

export default function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-0">
        <p>Cargando productos...</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-0">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-lumo-navy">
          Productos Destacados
        </h2>
      </div>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}
