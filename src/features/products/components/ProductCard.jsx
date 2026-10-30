import { Link } from "react-router-dom";
import BadgePill from "@/features/badges/components/BadgePill.jsx";
import { formatCurrency } from "@/shared/utils/formatCurrency";

export default function ProductCard({ product }) {
  const {
    name,
    slug,
    image,
    shortDescription,
    description,
    price,
    currency,
    badge,
    badgeColor,
  } = product;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-soft hover:shadow-lg transition-shadow duration-300 group">

      {/* Imagen */}
      <div className="relative overflow-hidden rounded-xl">
        <Link to={`/products/${slug}`}>
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        {badge && (
          <BadgePill name={badge} color={badgeColor} className="absolute top-3 left-3" />
        )}
      </div>

      {/* Información */}
      <div className="px-2 pt-4 pb-2">
        <Link to={`/products/${slug}`}>
          <h3 className="text-sm font-semibold text-lumo-navy line-clamp-1">
            {name}
          </h3>
        </Link>

        <p className="text-xs text-lumo-gray-500 mt-1 line-clamp-2 min-h-8">
          {shortDescription || description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-bold text-lumo-navy">
            {formatCurrency(price, currency)}
          </span>

          <button
            type="button"
            aria-label="Agregar al carrito"
            className="w-9 h-9 rounded-full bg-lumo-navy hover:bg-lumo-blue text-white flex items-center justify-center transition cursor-pointer"
          >
            <i className="fa-solid fa-cart-shopping text-xs" aria-hidden="true" />
          </button>
        </div>
      </div>

    </div>
  );
}
