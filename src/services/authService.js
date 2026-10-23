import { supabase } from "../lib/supabase";


// ==============================
// REGISTRO
// ==============================

export async function registerUser(email, password, firstName, lastName) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}


// ==============================
// LOGIN
// ==============================

export async function loginUser(email, password) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}


// ==============================
// CERRAR SESIÓN
// ==============================

export async function logoutUser() {

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}


// ==============================
// OBTENER SESIÓN
// ==============================

export async function getCurrentSession() {

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function testSupabaseAuth() {
  const { data, error } = await supabase.auth.getSession();

  console.log("SUPABASE SESSION:", data);
  console.log("SUPABASE AUTH ERROR:", error);

  return { data, error };
}