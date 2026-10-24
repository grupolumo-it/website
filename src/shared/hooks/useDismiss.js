import { useEffect } from "react";

/**
 * Cierra un menú desplegable al hacer click fuera de él o al presionar Escape.
 * ref: contenedor del menú (botón + panel) · open: si está abierto · onClose: cómo cerrarlo
 */
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!ref.current?.contains(event.target)) onClose();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, open, onClose]);
}
