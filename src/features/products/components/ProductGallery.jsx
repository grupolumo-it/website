import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ARROW_CLASSES =
  "absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 " +
  "hover:bg-white shadow-md flex items-center justify-center text-lumo-navy " +
  "cursor-pointer transition-all duration-200 hover:scale-105";

/**
 * Galería de imágenes del producto: imagen grande, flechas y miniaturas.
 * Al cambiar de producto, usar key={product.id} para reiniciar la selección.
 */
export default function ProductGallery({ gallery = [], mainImage, name, badge }) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  const hasGallery = gallery.length > 1;

  function changeImage(direction) {
    if (!hasGallery) return;

    const currentIndex = gallery.findIndex(
      (image) => image.image_url === selectedImage
    );
    const current = currentIndex >= 0 ? currentIndex : 0;

    const nextIndex =
      direction === "next"
        ? (current + 1) % gallery.length
        : (current - 1 + gallery.length) % gallery.length;

    setSelectedImage(gallery[nextIndex].image_url);
  }

  return (
    <div>

      {/* Imagen principal */}
      <div className="relative bg-gray-50 rounded-3xl overflow-hidden">

        <img
          src={selectedImage || mainImage}
          alt={name}
          className="w-full aspect-square object-cover"
        />

        {hasGallery && (
          <>
            <button
              type="button"
              onClick={() => changeImage("prev")}
              aria-label="Imagen anterior"
              className={`${ARROW_CLASSES} left-4`}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={() => changeImage("next")}
              aria-label="Imagen siguiente"
              className={`${ARROW_CLASSES} right-4`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {badge && (
          <span className="absolute top-5 left-5 bg-lumo-navy text-white text-xs font-semibold px-4 py-2 rounded-full">
            {badge}
          </span>
        )}

      </div>

      {/* Miniaturas */}
      {gallery.length > 0 && (
        <div className="flex gap-4 mt-4 overflow-x-auto">
          {gallery.map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={() => setSelectedImage(image.image_url)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                selectedImage === image.image_url
                  ? "border-lumo-navy"
                  : "border-transparent"
              }`}
            >
              <img
                src={image.image_url}
                alt={`${name} ${index + 1}`}
                className="w-full h-full cursor-pointer object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
