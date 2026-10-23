import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/shared/components/FormField.jsx";

/**
 * Campo de contraseña con botón para mostrar/ocultar.
 * Los children se muestran debajo (ej. requisitos).
 */
export default function PasswordField({ children, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      required
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lumo-navy"
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      }
    >
      {children}
    </FormField>
  );
}
