import ProductCard from "@/features/products/components/ProductCard.jsx";

export default function ProductGrid({ products, columnsClass = "lg:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnsClass} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
