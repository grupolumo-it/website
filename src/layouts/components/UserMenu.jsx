import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ITEM_CLASSES =
  "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-lumo-gray-600 " +
  "hover:bg-lumo-gray-50 hover:text-lumo-navy transition-colors text-left cursor-pointer";

function getDisplayName(user) {
  return user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Cuenta";
}

/**
 * Ícono de usuario con menú desplegable.
 * - Sin sesión: Iniciar sesión / Crear cuenta.
 * - Con sesión: nombre del usuario y Cerrar sesión.
 */
export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cierra el menú al hacer click fuera o al presionar Escape
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);

    try {
      await logout();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  return (
    <div ref={containerRef} className="relative">

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={isAuthenticated ? "Menú de cuenta" : "Iniciar sesión o registrarse"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="text-lumo-gray-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110  hover:text-lumo-navy transition-colors cursor-pointer"
      >
        <User size={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-4 w-56 bg-white border border-lumo-gray-200 rounded-2xl shadow-lg py-2 z-50"
        >
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 border-b border-lumo-gray-100 mb-1">
                <p className="text-xs text-lumo-gray-400">Hola,</p>
                <p className="text-sm font-semibold text-lumo-navy truncate">
                  {getDisplayName(user)}
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className={ITEM_CLASSES}
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={ITEM_CLASSES}
              >
                <LogIn size={16} />
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={ITEM_CLASSES}
              >
                <UserPlus size={16} />
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      )}

    </div>
  );
}
