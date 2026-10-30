import FeaturedCategories from "@/features/categories/components/FeaturedCategories.jsx";
import FeaturedProducts from "@/features/products/components/FeaturedProducts.jsx";
import MarketplaceSection from "@/features/home/components/MarketplaceSection.jsx";

export default function HomePage() {
  return (
    <>
      <FeaturedCategories />
      <FeaturedProducts />
      <MarketplaceSection />
    </>
  );
}
