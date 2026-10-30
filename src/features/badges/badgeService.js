import { supabase } from "@/shared/lib/supabase";

/**
 * Etiquetas de producto.
 * Los vendedores solo ven las activas (lo aplica la base de datos);
 * los administradores ven todas.
 */
export async function getBadges({ onlyActive = false } = {}) {
  let query = supabase
    .from("product_badges")
    .select("id, name, status, color")
    .order("name");

  if (onlyActive) query = query.eq("status", "ACTIVE");

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

export async function createBadge({ name, color }) {
  const { error } = await supabase
    .from("product_badges")
    .insert({ name: name.trim(), color });

  if (error) throw error;
}

export async function updateBadge(badgeId, changes) {
  const { data, error } = await supabase
    .from("product_badges")
    .update(changes)
    .eq("id", badgeId)
    .select("id");

  if (error) throw error;
  if (!data?.length) throw new Error("No tienes permiso para modificar esta etiqueta.");
}

export async function deleteBadge(badgeId) {
  const { data, error } = await supabase
    .from("product_badges")
    .delete()
    .eq("id", badgeId)
    .select("id");

  if (error) throw error;
  if (!data?.length) throw new Error("No tienes permiso para eliminar esta etiqueta.");
}
