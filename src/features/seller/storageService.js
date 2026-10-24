import { supabase } from "@/shared/lib/supabase";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGES_PER_PRODUCT = 6;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Devuelve un mensaje de error, o null si el archivo es válido. */
export function validateImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "formato no permitido (usa JPG, PNG o WEBP).";
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `pesa más de ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
}

/**
 * Sube una imagen a product-images/<folder>/<uuid>.<ext>
 * La carpeta es el id de la tienda: las políticas de Storage solo permiten
 * escribir en la carpeta de la propia tienda.
 */
export async function uploadProductImage(folder, file) {
  const path = `${folder}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return { path, url: data.publicUrl };
}

/** Ruta dentro del bucket a partir de una URL pública (null si la imagen es externa). */
export function getStoragePathFromUrl(url) {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url ? url.indexOf(marker) : -1;

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

/**
 * Borra del Storage las imágenes que estén en nuestro bucket.
 * Las URLs externas se ignoran. Si falla, solo se registra: no es crítico.
 */
export async function removeProductImages(urls) {
  const paths = urls.map(getStoragePathFromUrl).filter(Boolean);

  if (paths.length === 0) return;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove(paths);

  if (error) console.error("No se pudieron borrar imágenes del Storage:", error);
}
