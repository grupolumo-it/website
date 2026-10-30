import { supabase } from "@/shared/lib/supabase";

/** Marcas activas. */
export async function getBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("status", "ACTIVE")
    .order("name");

  if (error) throw error;

  return data;
}
