import { ShoppingCart, Truck } from "lucide-react";
import UserMenu from "@/layouts/components/UserMenu.jsx";

const buttons = [
  { Icon: ShoppingCart, label: "Carrito" },
  { Icon: Truck, label: "Pedidos" },
];

export default function HeaderActions() {
  return (
    <div className="flex items-center space-x-5">

      {buttons.map(({ Icon, label }) => (
        <button
          key={label}
          aria-label={label}
          className="text-lumo-gray-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110  hover:text-lumo-navy transition-colors cursor-pointer"
        >
          <Icon size={20} />
        </button>
      ))}

      <UserMenu />

    </div>
  );
}
