import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/features/auth/context/AuthProvider.jsx";
import AppRoutes from "@/app/routes/AppRoutes.jsx";

// Aquí se agregarán más providers globales (CartProvider...) cuando existan.
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
