import SectionTitle from "@/shared/components/SectionTitle.jsx";
import CategoryList from "@/features/categories/components/CategoryList.jsx";

export default function FeaturedCategories() {
  return (
    <section className="max-w-7xl mx-auto py-20 px-4">

      <SectionTitle
        title="Directo de Lumo"
        subtitle="Calidad premium desde nuestra propia línea de producción"
      />

      <CategoryList />

    </section>
  );
}
