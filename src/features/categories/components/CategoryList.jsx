import {
  Leaf,
  Cpu,
  House,
  Apple,
  Shirt,
  Dumbbell,
  PawPrint,
  Glasses,
} from "lucide-react";
import CategoryCard from "@/features/categories/components/CategoryCard.jsx";

// TODO: reemplazar por getCategories() (categoryService) cuando la tabla
// "categories" tenga los campos de ícono y tema.
const categories = [
  { name: "Bienestar", icon: Leaf, theme: "emerald" },
  { name: "Tecnología", icon: Cpu, theme: "blue" },
  { name: "Hogar", icon: House, theme: "orange" },
  { name: "Nutrición", icon: Apple, theme: "red" },
  { name: "Moda", icon: Shirt, theme: "pink" },
  { name: "Deportes", icon: Dumbbell, theme: "amber" },
  { name: "Mascotas", icon: PawPrint, theme: "amber" },
  { name: "Accesorios", icon: Glasses, theme: "indigo" },
];

export default function CategoryList() {
  return (
    <div className="flex justify-center flex-wrap gap-8 md:gap-16">
      {categories.map((category) => (
        <CategoryCard key={category.name} category={category} />
      ))}
    </div>
  );
}
