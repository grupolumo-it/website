/** Nombre para mostrar del usuario: su nombre, o la parte inicial de su correo. */
export function getDisplayName(user) {
  return user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Cuenta";
}

export function getInitial(user) {
  return getDisplayName(user).charAt(0).toUpperCase();
}
