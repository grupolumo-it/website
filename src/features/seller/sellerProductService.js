import { supabase } from "@/shared/lib/supabase";
import {
  removeProductImages,
  uploadProductImage,
} from "@/features/seller/storageService";

// ---------- utilidades ----------
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// El slug es la dirección pública del producto: nombre + sufijo corto para no repetirse
function makeSlug(name) {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slugify(name) || "producto"}-${suffix}`;
}

/** Todas las URLs de imágenes de un producto crudo (principal + galería). */
export function getProductImageUrls(product) {
  const gallery = [...(product?.product_images || [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => image.image_url);

  return [...new Set([product?.image_url, ...gallery].filter(Boolean))];
}

// ---------- lectura ----------
export async function listSellerProducts(sellerId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, sku, image_url, stock, is_active, created_at, product_prices(price, currency)"
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    image: product.image_url,
    stock: product.stock ?? 0,
    isActive: product.is_active,
    price: product.product_prices?.[0]?.price ?? 0,
    currency: product.product_prices?.[0]?.currency ?? "COP",
  }));
}

/** Producto "crudo" con precio, galería y categorías, para el formulario de edición. */
export async function getSellerProduct(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_prices(*),
      product_images(*),
      products_categories(category_id)
    `)
    .eq("id", productId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// ---------- acciones rápidas ----------
export async function setProductActive(productId, isActive) {
  const { data, error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId)
    .select("id");

  if (error) throw error;
  if (!data?.length) throw new Error("No tienes permiso para modificar este producto.");
}

export async function deleteSellerProduct(productId) {
  // Guardamos las URLs antes de borrar para limpiar también el Storage
  const { data: product } = await supabase
    .from("products")
    .select("image_url, product_images(image_url)")
    .eq("id", productId)
    .maybeSingle();

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .select("id");

  if (error) throw error;
  if (!data?.length) throw new Error("No tienes permiso para eliminar este producto.");

  await removeProductImages(getProductImageUrls(product));
}

// ---------- guardar (crear o editar) ----------
async function savePrice(productId, amount, currentPrice) {
  if (currentPrice?.id) {
    const { error } = await supabase
      .from("product_prices")
      .update({ price: amount })
      .eq("id", currentPrice.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("product_prices")
    .insert({ product_uuid: productId, price: amount, currency: "COP", country: "CO" });

  if (error) throw error;
}

async function replaceCategories(productId, categoryIds) {
  const { error: deleteError } = await supabase
    .from("products_categories")
    .delete()
    .eq("product_id", productId);

  if (deleteError) throw deleteError;

  if (categoryIds.length === 0) return;

  const { error } = await supabase
    .from("products_categories")
    .insert(categoryIds.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    })));

  if (error) throw error;
}

// La imagen principal vive en products.image_url; el resto en product_images (posición 1, 2, 3...)
async function replaceGallery(productId, urls) {
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_uuid", productId);

  if (deleteError) throw deleteError;

  if (urls.length === 0) return;

  const { error } = await supabase
    .from("product_images")
    .insert(urls.map((url, index) => ({
      product_uuid: productId,
      image_url: url,
      position: index + 1,
    })));

  if (error) throw error;
}

/**
 * Crea o edita un producto con su precio, categorías e imágenes.
 *
 * - product: producto crudo (si se edita) o null (si se crea)
 * - items: imágenes en orden, la primera es la principal.
 *          Cada una es { url } (ya subida) o { file } (archivo nuevo por subir)
 *
 * Si algo falla al crear, se deshace lo hecho (producto e imágenes subidas).
 * Devuelve el id del producto.
 */
export async function saveSellerProduct({
  product,
  sellerId,
  values,
  items,
  categoryIds,
  canFeature,
}) {
  const isEdit = Boolean(product);
  const folder = product?.seller_id ?? sellerId;

  // 1) Subir las imágenes nuevas
  const results = await Promise.allSettled(
    items.map((item) =>
      item.file
        ? uploadProductImage(folder, item.file)
        : Promise.resolve({ url: item.url })
    )
  );

  const uploadedUrls = results
    .map((result, index) =>
      result.status === "fulfilled" && items[index].file ? result.value.url : null
    )
    .filter(Boolean);

  const failed = results.find((result) => result.status === "rejected");

  if (failed) {
    await removeProductImages(uploadedUrls);
    throw failed.reason;
  }

  const finalUrls = results.map((result) => result.value.url);

  // 2) Guardar el producto y lo que depende de él
  const row = {
    name: values.name.trim(),
    sku: values.sku.trim(),
    short_description: values.shortDescription.trim() || null,
    description: values.description.trim() || null,
    image_url: finalUrls[0],
    stock: Number(values.stock),
    discount_percentage: Number(values.discount),
    badge: values.badge.trim() || null,
    is_active: values.isActive,
  };

  let productId = product?.id ?? null;
  let createdProductId = null;
  let rowWritten = false;

  try {
    if (isEdit) {
      if (canFeature) row.is_featured = values.isFeatured;

      const { data, error } = await supabase
        .from("products")
        .update(row)
        .eq("id", productId)
        .select("id");

      if (error) throw error;
      if (!data?.length) throw new Error("No tienes permiso para editar este producto.");
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({
          ...row,
          slug: makeSlug(values.name),
          seller_id: sellerId,
          is_featured: canFeature ? values.isFeatured : false,
        })
        .select("id")
        .single();

      if (error) throw error;

      productId = data.id;
      createdProductId = data.id;
    }

    rowWritten = true;

    await savePrice(productId, Number(values.price), product?.product_prices?.[0]);
    await replaceCategories(productId, categoryIds);
    await replaceGallery(productId, finalUrls.slice(1));
  } catch (error) {
    if (createdProductId) {
      // Producto nuevo a medias: se deshace por completo
      await supabase.from("products").delete().eq("id", createdProductId);
      await removeProductImages(uploadedUrls);
    } else if (!rowWritten) {
      await removeProductImages(uploadedUrls);
    }
    // Si se editó y falló un paso posterior, las imágenes nuevas ya están en uso:
    // no se borran. Al volver a guardar se completa el resto.
    throw error;
  }

  // 3) Limpiar del Storage las imágenes que el vendedor quitó
  if (isEdit) {
    const removed = getProductImageUrls(product).filter(
      (url) => !finalUrls.includes(url)
    );
    await removeProductImages(removed);
  }

  return productId;
}
