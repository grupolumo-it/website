import { Outlet } from "react-router-dom";
import Header from "@/layouts/components/Header.jsx";
import Footer from "@/layouts/components/Footer.jsx";

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
