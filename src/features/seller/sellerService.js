import { supabase } from "@/shared/lib/supabase";

/** Tienda del usuario con sesión (null si no tiene). */
export async function getMySeller(userId) {
  const { data, error } = await supabase
    .from("sellers")
    .select("id, store_name, status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}
