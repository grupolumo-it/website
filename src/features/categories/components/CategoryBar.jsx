import { NavLink } from "react-router-dom";
import { useCategories } from "@/features/categories/hooks/useCategories";

const LINK_BASE =
  "text-sm whitespace-nowrap font-medium transition-colors border-b-2 py-3";

export default function CategoryBar() {
  const { categories } = useCategories();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-lumo-gray-100 sticky top-[80px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 space-x-8 overflow-x-auto no-scrollbar">

          <span className="text-sm font-bold text-lumo-navy whitespace-nowrap">
            Categorías:
          </span>

          <nav className="flex space-x-6">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/categories/${category.slug}`}
                className={({ isActive }) =>
                  `${LINK_BASE} ${
                    isActive
                      ? "text-lumo-navy border-lumo-navy"
                      : "text-lumo-gray-500 border-transparent hover:text-lumo-navy hover:border-lumo-navy"
                  }`
                }
              >
                {category.name}
              </NavLink>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
}
