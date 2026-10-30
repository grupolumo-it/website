import { FEATURED_SELLER } from "@/features/home/homeContent";

/** "Empresario del mes". CONTENIDO DE EJEMPLO: ver homeContent.js */
export default function FeaturedSellerCard() {
  return (
    <div className="h-full bg-lumo-gray-50 border border-lumo-gray-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">

      <div className="w-44 h-44 flex-shrink-0 rounded-2xl bg-amber-500 -rotate-3 shadow-lg flex items-center justify-center text-white text-5xl font-bold">
        {FEATURED_SELLER.initials}
      </div>

      <div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white px-3 py-1 rounded-full">
          Empresario del mes
        </span>

        <h3 className="mt-3 text-2xl font-semibold text-lumo-navy">
          {FEATURED_SELLER.name}
        </h3>

        <p className="mt-2 text-sm italic text-lumo-gray-500">
          “{FEATURED_SELLER.quote}”
        </p>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lumo-navy">
          Visitar su tienda
          <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
        </span>
      </div>

    </div>
  );
}
