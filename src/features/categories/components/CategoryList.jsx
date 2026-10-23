import CategoryCard from "@/features/categories/components/CategoryCard.jsx";
import { useCategories } from "@/features/categories/hooks/useCategories";

export default function CategoryList() {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <p className="text-center text-lumo-gray-500">Cargando categorías...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex justify-center flex-wrap gap-8 md:gap-16">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
