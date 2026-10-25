export default function SearchBar() {
  return (

    <div className="hidden md:flex flex-grow justify-center max-w-xl mx-4">
      <div className="relative w-full">

        <input id="global-search-input"
          className="w-full pl-5 pr-12 py-2.5 border border-lumo-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lumo-navy/10 focus:border-lumo-navy bg-lumo-gray-50 transition-all placeholder-lumo-gray-400 font-sans"
          placeholder="Search products, brands and more..." type="text" />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><i
          className="fa-solid fa-magnifying-glass text-lumo-gray-400 text-sm"></i></div>

      </div>
    </div>
  )
}