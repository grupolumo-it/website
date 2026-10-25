import { Link } from "react-router-dom";
import SearchBar from "@/layouts/components/SearchBar.jsx";
import HeaderActions from "@/layouts/components/HeaderActions.jsx";
import CategoryBar from "@/features/categories/components/CategoryBar.jsx";

export default function Header() {
  return (
    /* Header Container */
    <header>

      {/* Main-header */}
      <div className="bg-white border-b border-lumo-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-base">

            {/* Logo (left) */}
            <div className="flex-shrink-0">
              <a href="/#homepage" className="text-2xl font-bold text-lumo-navy tracking-tight">Lumo</a>
            </div>

            {/* Search Bar (Centered) */}
            <SearchBar />

            {/* Navigation and Icons (Right) */}
            <HeaderActions />

          </div>
        </div>
      </div>

      {/* Sub-header (Floating Categories) */}
      <CategoryBar />

    </header>
  );
}
