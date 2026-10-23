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
