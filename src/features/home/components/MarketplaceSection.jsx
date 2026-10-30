import { Link } from "react-router-dom";
import FeaturedSellerCard from "@/features/home/components/FeaturedSellerCard.jsx";
import FlashOfferCard from "@/features/home/components/FlashOfferCard.jsx";
import TrendingStoresCard from "@/features/home/components/TrendingStoresCard.jsx";
import { COMMUNITY_CLAIM, SHOW_SAMPLE_CONTENT } from "@/features/home/homeContent";

/** Sección "Marketplace: El Boulevard Digital" del Inicio. */
export default function MarketplaceSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-lumo-navy mb-4">
            Marketplace: El Boulevard Digital
          </h2>

          <p className="text-lumo-gray-500 max-w-3xl mx-auto">
            Descubre el corazón del comercio moderno. Miles de productos seleccionados y
            gestionados por nuestra comunidad de empresarios independientes (LBOs) que
            están transformando la forma de comprar.
          </p>
        </div>

        <div className={SHOW_SAMPLE_CONTENT ? "grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch" : "max-w-md mx-auto"}>
          {SHOW_SAMPLE_CONTENT && (
            <div className="lg:col-span-2">
              <FeaturedSellerCard />
            </div>
          )}

          <div className="space-y-6">
            {SHOW_SAMPLE_CONTENT && <FlashOfferCard />}
            <TrendingStoresCard />
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-lumo-navy hover:bg-lumo-blue text-white font-semibold shadow-lg transition"
          >
            ¡Explorar la Marketplace!
            <i className="fa-solid fa-rocket" aria-hidden="true" />
          </Link>

          {SHOW_SAMPLE_CONTENT && (
            <p className="mt-4 text-xs text-lumo-gray-500">{COMMUNITY_CLAIM}</p>
          )}
        </div>

      </div>
    </section>
  );
}
