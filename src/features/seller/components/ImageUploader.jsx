import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGES_PER_PRODUCT,
  validateImageFile,
} from "@/features/seller/storageService";

/**
 * Selector de imágenes desde el dispositivo.
 * - items: [{ id, url, file }]  (file existe solo en imágenes nuevas, aún sin subir)
 * - La primera imagen es la principal del producto.
 * Las imágenes se suben al guardar el producto, no al elegirlas.
 */
export default function ImageUploader({ items, onChange, disabled }) {
  const inputRef = useRef(null);
  const previewUrls = useRef([]);
  const [error, setError] = useState("");

  // Libera las vistas previas temporales al salir de la pantalla
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = ""; // permite volver a elegir el mismo archivo

    setError("");

    const accepted = [];
    const problems = [];

    for (const file of files) {
      const problem = validateImageFile(file);
      if (problem) problems.push(`${file.name}: ${problem}`);
      else accepted.push(file);
    }

    const available = MAX_IMAGES_PER_PRODUCT - items.length;

    if (accepted.length > available) {
      problems.push(`Máximo ${MAX_IMAGES_PER_PRODUCT} imágenes por producto.`);
    }

    if (problems.length > 0) setError(problems.join(" "));

    const added = accepted.slice(0, Math.max(available, 0)).map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.push(url);
      return { id: crypto.randomUUID(), url, file };
    });

    if (added.length > 0) onChange([...items, ...added]);
  }

  function removeItem(id) {
    const item = items.find((current) => current.id === id);
    if (item?.file) URL.revokeObjectURL(item.url);

    setError("");
    onChange(items.filter((current) => current.id !== id));
  }

  function makeMain(id) {
    const item = items.find((current) => current.id === id);
    onChange([item, ...items.filter((current) => current.id !== id)]);
  }

  return (
    <div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative group aspect-square rounded-xl overflow-hidden border border-lumo-gray-200 bg-gray-50"
          >
            <img src={item.url} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />

            {index === 0 && (
              <span className="absolute top-2 left-2 bg-lumo-navy text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Principal
              </span>
            )}

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              disabled={disabled}
              aria-label="Quitar imagen"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-lumo-gray-600 hover:text-red-500 shadow flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
              <X size={16} />
            </button>

            {index > 0 && (
              <button
                type="button"
                onClick={() => makeMain(item.id)}
                disabled={disabled}
                className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white text-lumo-navy text-xs font-medium py-1.5 rounded-lg shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <Star size={14} />
                Hacer principal
              </button>
            )}
          </div>
        ))}

        {items.length < MAX_IMAGES_PER_PRODUCT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="aspect-square rounded-xl border-2 border-dashed border-lumo-gray-300 hover:border-lumo-navy text-lumo-gray-500 hover:text-lumo-navy flex flex-col items-center justify-center gap-2 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <ImagePlus size={28} />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        )}

      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <p className="text-xs text-lumo-gray-500 mt-3">
        JPG, PNG o WEBP · máximo {MAX_IMAGE_SIZE_MB} MB cada una · hasta {MAX_IMAGES_PER_PRODUCT} imágenes.
        La primera es la imagen principal.
      </p>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

    </div>
  );
}
