/**
 * Reglas de contraseña. Se usa en el formulario de registro
 * y puede reutilizarse en "cambiar contraseña".
 */
export function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    hasMinLength,
    hasLetter,
    hasNumber,
    isValid: hasMinLength && hasLetter && hasNumber,
  };
}
