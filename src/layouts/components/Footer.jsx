export default function Footer() {
  return (
    <footer className="bg-lumo-gray-100 border-t border-lumo-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center text-sm text-lumo-gray-500">
        © {new Date().getFullYear()} Lumo. Todos los derechos reservados.
      </div>
    </footer>
  );
}
