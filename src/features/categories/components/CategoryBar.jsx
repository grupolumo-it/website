const categories = [
  'Skin Care',
  'Tecnología',
  'Hogar',
  'Limpieza y Salud'
]

export default function CategoryBar() {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-lumo-gray-100 sticky top-[80px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 space-x-8 overflow-x-auto no-scrollbar">

          <span className="text-sm font-bold text-lumo-navy whitespace-nowrap">
            Categorías:
          </span>

          <nav className="flex space-x-6">
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className="text-sm text-lumo-gray-500 hover:text-lumo-navy whitespace-nowrap font-medium transition-colors border-b-2 border-transparent hover:border-lumo-navy py-3"
              >
                {category}
              </a>
            ))}
          </nav>

        </div>
      </div>
    </div>
  )
}