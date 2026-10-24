import { supabase } from "@/shared/lib/supabase";

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

  if (error) throw error;

  return data;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
}

/**
 * Avisa cada vez que la sesión cambia (login, logout, token renovado).
 * Devuelve una función para dejar de escuchar.
 */
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => data.subscription.unsubscribe();
}

/**
 * Rol del usuario con sesión iniciada ("ADMIN", "SELLER" o "CLIENT").
 * Usa la función current_user_role() de la base de datos, la misma que
 * aplican las políticas RLS, así que frontend y base de datos coinciden.
 * Devuelve null si no hay sesión o el usuario no tiene rol asignado.
 */
export async function getCurrentUserRole() {
  const { data, error } = await supabase.rpc("current_user_role");

  if (error) throw error;

  return data;
}
