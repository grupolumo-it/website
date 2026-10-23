import ProductGallery from "@/features/products/components/ProductGallery.jsx";
import ProductAttributes from "@/features/products/components/ProductAttributes.jsx";
import { formatCurrency } from "@/shared/utils/formatCurrency";

const LOW_STOCK_THRESHOLD = 5;

function StockStatus({ stock }) {
  if (stock <= 0) {
    return <p className="text-red-500 font-semibold">Producto agotado</p>;
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <p className="text-orange-500 font-semibold">
        ¡Solo quedan {stock} unidades!
      </p>
    );
  }

  return <p className="text-green-600 font-semibold">Disponible</p>;
}

export default function ProductDetail({ product }) {
  const discount = product.discount || 0;

  const originalPrice =
    discount > 0 ? product.price / (1 - discount / 100) : null;

  const isOutOfStock = product.stock <= 0;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* GALERÍA */}
        <ProductGallery
          key={product.id}
          gallery={product.gallery}
          mainImage={product.image}
          name={product.name}
          badge={product.badge}
        />

        {/* INFORMACIÓN */}
        <div className="flex flex-col justify-center">

          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-bold text-lumo-navy">
            {product.name}
          </h1>

          {product.sku && (
            <p className="text-sm text-gray-400 mt-2">SKU: {product.sku}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-5">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold text-lumo-navy">
              {product.rating?.toFixed(1)}
            </span>
            <span className="text-gray-500">({product.reviews} reseñas)</span>
          </div>

          <p className="text-gray-600 leading-relaxed mt-6">
            {product.description}
          </p>

          {/* Precio */}
          <div className="mt-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-4xl font-bold text-lumo-navy">
                {formatCurrency(product.price, product.currency)}
              </span>

              {originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(originalPrice, product.currency)}
                </span>
              )}
            </div>

            {discount > 0 && (
              <p className="text-sm text-green-600 font-semibold mt-2">
                Ahorras {discount}%
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="mt-6">
            <StockStatus stock={product.stock} />
          </div>

          {/* Botón */}
          <div className="mt-8">
            <button
              type="button"
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl font-semibold transition ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-lumo-navy hover:bg-lumo-navy-light text-white"
              }`}
            >
              {isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
            </button>
          </div>

        </div>
      </div>

      <ProductAttributes attributes={product.attributes} />

    </section>
  );
}
