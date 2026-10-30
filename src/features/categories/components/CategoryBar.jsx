import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCategories } from "@/features/categories/hooks/useCategories";

const LINK_BASE =
  "text-sm whitespace-nowrap font-medium transition-colors border-b-2 py-3";

export default function CategoryBar() {
  const { categories } = useCategories();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  // La categoría activa es la que está filtrando el catálogo
  const activeSlug = pathname === "/catalog" ? searchParams.get("categoria") : null;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-lumo-gray-100 sticky top-[80px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 space-x-8 overflow-x-auto no-scrollbar">

          <span className="text-sm font-bold text-lumo-navy whitespace-nowrap">
            Categorías:
          </span>

          <nav className="flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/catalog?categoria=${encodeURIComponent(category.slug)}`}
                className={`${LINK_BASE} ${
                  activeSlug === category.slug
                    ? "text-lumo-navy border-lumo-navy"
                    : "text-lumo-gray-500 border-transparent hover:text-lumo-navy hover:border-lumo-navy"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
}
