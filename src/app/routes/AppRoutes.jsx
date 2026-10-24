import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import ClientLayout from "@/layouts/ClientLayout.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import SellerLayout from "@/layouts/SellerLayout.jsx";
import HomePage from "@/pages/client/HomePage.jsx";
import ProductDetailPage from "@/pages/client/ProductDetailPage.jsx";
import CategoryPage from "@/pages/client/CategoryPage.jsx";
import LoginPage from "@/pages/auth/LoginPage.jsx";
import RegisterPage from "@/pages/auth/RegisterPage.jsx";
import SellerProductsPage from "@/pages/seller/SellerProductsPage.jsx";
import SellerProductFormPage from "@/pages/seller/SellerProductFormPage.jsx";
import AdminBadgesPage from "@/pages/admin/AdminBadgesPage.jsx";
import { ROLES } from "@/features/auth/roles";

export default function AppRoutes() {
  return (
    <Routes>

      {/* TIENDA (con Header y Footer) */}
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="categories/:slug" element={<CategoryPage />} />
      </Route>

      {/* AUTENTICACIÓN (pantalla completa) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* PANEL DE VENDEDOR: vendedores y administradores */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]} />}>
        <Route path="seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="products/new" element={<SellerProductFormPage />} />
          <Route path="products/:productId/edit" element={<SellerProductFormPage />} />
        </Route>
      </Route>

      {/* PANEL DE ADMINISTRACIÓN: solo administradores */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="badges" replace />} />
          <Route path="badges" element={<AdminBadgesPage />} />
        </Route>
      </Route>

    </Routes>
  );
}
