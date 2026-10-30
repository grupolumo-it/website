import { Link } from "react-router-dom";
import { FLASH_OFFER } from "@/features/home/homeContent";

/** "Oferta Relámpago". CONTENIDO DE EJEMPLO: ver homeContent.js */
export default function FlashOfferCard() {
  return (
    <div className="relative overflow-hidden bg-lumo-navy text-white rounded-3xl p-6">

      <i
        aria-hidden="true"
        className="fa-solid fa-bolt absolute -right-3 -bottom-4 text-8xl text-white/5"
      />

      <h3 className="relative text-lg font-semibold">{FLASH_OFFER.title}</h3>

      <p className="relative mt-2 text-sm text-white/80">{FLASH_OFFER.text}</p>

      <Link
        to="/catalog"
        className="relative inline-block mt-5 px-5 py-2 rounded-full bg-white text-lumo-navy text-sm font-semibold hover:bg-lumo-gray-100 transition"
      >
        Ver Ofertas
      </Link>

    </div>
  );
}
