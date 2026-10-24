import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LABELS } from "@/features/auth/roles";
import { getDisplayName, getInitial } from "@/features/auth/userDisplay";
import { useDismiss } from "@/shared/hooks/useDismiss";

const ITEM_CLASSES =
  "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-lumo-gray-600 " +
  "hover:bg-lumo-gray-50 hover:text-lumo-navy transition-colors text-left cursor-pointer";

/**
 * Usuario del panel: avatar con inicial, nombre y rol, con menú desplegable.
 * links: accesos extra, [{ to, label, Icon }] (por ejemplo, cambiar de panel).
 */
export default function PanelUserMenu({ links = [] }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useDismiss(containerRef, open, () => setOpen(false));

  async function handleLogout() {
    setOpen(false);
    navigate("/"); // primero salimos del panel, para que no nos mande a /login

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
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-lumo-gray-50 transition cursor-pointer"
      >
        <span className="w-9 h-9 rounded-full bg-lumo-blue/10 text-lumo-blue font-semibold flex items-center justify-center">
          {getInitial(user)}
        </span>

        <span className="hidden sm:block text-left leading-tight">
          <span className="block text-sm font-semibold text-lumo-navy">{getDisplayName(user)}</span>
          <span className="block text-xs text-lumo-gray-500">{ROLE_LABELS[role] ?? ""}</span>
        </span>

        <ChevronDown size={16} className="hidden sm:block text-lumo-gray-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-60 bg-white border border-lumo-gray-200 rounded-2xl shadow-lg py-2 z-50"
        >
          {links.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={ITEM_CLASSES}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <button type="button" role="menuitem" onClick={handleLogout} className={ITEM_CLASSES}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}

    </div>
  );
}
