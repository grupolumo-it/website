import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.userAgent);

/**
 * Buscador del encabezado del panel.
 * Al buscar lleva a targetPath?q=texto; esa pantalla filtra su listado con "q".
 * Atajo de teclado: Ctrl+K (⌘K en Mac).
 */
export default function PanelSearch({ placeholder, targetPath }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Si ya estamos en la pantalla de destino, el campo muestra la búsqueda activa
  const activeQuery =
    location.pathname === targetPath ? searchParams.get("q") ?? "" : "";

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const query = inputRef.current.value.trim();
    navigate(query ? `${targetPath}?q=${encodeURIComponent(query)}` : targetPath);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-md">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-lumo-gray-400 pointer-events-none"
      />

      {/* key: al cambiar la búsqueda desde la URL, el campo se actualiza */}
      <input
        key={activeQuery}
        ref={inputRef}
        type="text"
        defaultValue={activeQuery}
        placeholder={placeholder}
        aria-label={placeholder}
        onKeyDown={(event) => {
          if (event.key === "Escape") event.currentTarget.blur();
        }}
        className="w-full pl-10 pr-20 py-2.5 border border-lumo-gray-200 rounded-xl text-sm bg-lumo-gray-50 outline-none transition focus:bg-white focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10"
      />

      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-lumo-gray-500 bg-white border border-lumo-gray-200 rounded-md px-2 py-0.5 pointer-events-none">
        {IS_MAC ? "⌘ K" : "Ctrl K"}
      </kbd>
    </form>
  );
}
