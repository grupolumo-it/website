import { supabase } from "@/shared/lib/supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "ACTIVE")
    .order("name");

  if (error) throw error;

  return data;
}
