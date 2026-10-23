import { supabase } from "@/shared/lib/supabase";
import { mapProduct } from "@/features/products/productMapper";

// Columnas y relaciones que se piden en cada consulta de productos
const PRODUCT_SELECT = `
  *,
  product_prices(*),
  product_images(*),
  attributes(*),
  products_categories(
    categories(*)
  )
`;

async function fetchProducts(query) {
  const { data, error } = await query;

  if (error) throw error;

  return data.map(mapProduct);
}

export async function getProducts() {
  return fetchProducts(
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
  );
}

export async function getFeaturedProducts() {
  return fetchProducts(
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(5)
  );
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;

  return mapProduct(data);
}

/**
 * Productos activos de una categoría, junto con los datos de la categoría.
 * Devuelve { category: null, products: [] } si el slug no existe.
 */
export async function getProductsByCategorySlug(slug) {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      products_categories(
        products(
          *,
          product_prices(*)
        )
      )
    `)
    .eq("slug", slug)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (error) throw error;

  if (!data) return { category: null, products: [] };

  const { products_categories, ...category } = data;

  const products = (products_categories || [])
    .map((item) => item.products)
    .filter((product) => product?.is_active)
    .map(mapProduct)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { category, products };
}
