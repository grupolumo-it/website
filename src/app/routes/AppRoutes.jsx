import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import ClientLayout from "@/layouts/ClientLayout.jsx";
import HomePage from "@/pages/client/HomePage.jsx";
import ProductDetailPage from "@/pages/client/ProductDetailPage.jsx";
import LoginPage from "@/pages/auth/LoginPage.jsx";
import RegisterPage from "@/pages/auth/RegisterPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* TIENDA (con Header y Footer) */}
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
      </Route>

      {/* AUTENTICACIÓN (pantalla completa) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* ÁREA PRIVADA: requiere iniciar sesión.
          TODO: restringir por rol (seller / admin) y reemplazar por sus layouts. */}
      <Route element={<ProtectedRoute />}>
        <Route path="seller" element={<h1>Dashboard Seller</h1>} />
        <Route path="admin" element={<h1>Dashboard Admin</h1>} />
      </Route>

    </Routes>
  );
}
