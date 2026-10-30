import { supabase } from "@/shared/lib/supabase";

/**
 * Un cliente solicita abrir su tienda. Queda PENDING hasta que un ADMIN la apruebe.
 * La función de la base de datos valida todo (solo clientes, una solicitud por usuario).
 */
export async function requestStore({ storeName, description, taxId }) {
  const { data, error } = await supabase.rpc("request_seller_account", {
    p_store_name: storeName.trim(),
    p_description: description.trim() || null,
    p_tax_id: taxId.trim() || null,
  });

  if (error) throw error;

  return data;
}

/** Todas las tiendas con los datos de su dueño (solo ADMIN). */
export async function listStoresForAdmin() {
  const { data, error } = await supabase.rpc("admin_list_sellers");

  if (error) throw error;

  return data;
}

/** Cambia el estado de una tienda (solo ADMIN). Al activarla, su dueño pasa a SELLER. */
export async function setStoreStatus(storeId, status) {
  const { error } = await supabase.rpc("set_seller_status", {
    p_seller_id: storeId,
    p_status: status,
  });

  if (error) throw error;
}

/**
 * Tiendas activas más destacadas, para el Inicio. Es público: usa la vista
 * sellers_public, que no incluye datos internos (NIT, estado...).
 */
export async function getTrendingStores(limit = 3) {
  const { data, error } = await supabase
    .from("sellers_public")
    .select("id, store_name, logo_url, description, rating")
    .order("rating", { ascending: false, nullsFirst: false })
    .order("store_name")
    .limit(limit);

  if (error) throw error;

  return data;
}
