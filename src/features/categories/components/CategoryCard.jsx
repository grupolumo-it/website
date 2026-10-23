import { categoryThemes } from "@/features/categories/categoryThemes";

export default function CategoryCard({ category }) {
  const theme = categoryThemes[category.theme];
  const Icon = category.icon;

  return (
    <div className="flex flex-col items-center group cursor-pointer">

      <div
        className={`
          w-20 h-20 rounded-full bg-white shadow-soft border-lumo-gray-100
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:-translate-y-2 hover:shadow-xl hover:scale-105
          ${theme.bg} ${theme.border}
        `}
      >
        <Icon
          size={28}
          className={`
            text-lumo-navy transition-all duration-300
            group-hover:scale-110 ${theme.icon}
          `}
        />
      </div>

      <span
        className={`
          mt-4 text-sm font-semibold text-lumo-navy
          transition-all duration-300 ${theme.text}
        `}
      >
        {category.name}
      </span>

    </div>
  );
}
