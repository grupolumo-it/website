import {
  Leaf,
  Cpu,
  House,
  Apple,
  Shirt,
  Dumbbell,
  PawPrint,
  Glasses,
  Tag,
  Heart,
  Sparkles,
  BookOpen,
  Gamepad2,
  Car,
  Utensils,
  Baby,
  Gift,
  Smartphone,
  Laptop,
  Watch,
  Camera,
  Headphones,
  Wrench,
  Palette,
} from "lucide-react";

/**
 * La columna "icon" de la tabla categories es texto. Aquí se traduce ese texto
 * a un ícono de Lucide. Acepta nombres simples ("leaf") y también el formato
 * de Font Awesome ("fa-solid fa-leaf"). Si no lo reconoce, usa un ícono genérico.
 *
 * Para soportar un ícono nuevo: impórtalo arriba y agrégalo a este objeto.
 */
const icons = {
  leaf: Leaf,
  cpu: Cpu,
  microchip: Cpu,
  house: House,
  home: House,
  "house-chimney": House,
  apple: Apple,
  "apple-whole": Apple,
  shirt: Shirt,
  tshirt: Shirt,
  dumbbell: Dumbbell,
  paw: PawPrint,
  "paw-print": PawPrint,
  pawprint: PawPrint,
  glasses: Glasses,
  heart: Heart,
  "heart-pulse": Heart,
  sparkles: Sparkles,
  "spray-can-sparkles": Sparkles,
  "wand-magic-sparkles": Sparkles,
  "pump-soap": Sparkles,
  soap: Sparkles,
  "hand-sparkles": Sparkles,
  broom: Sparkles,
  book: BookOpen,
  "book-open": BookOpen,
  gamepad: Gamepad2,
  car: Car,
  utensils: Utensils,
  baby: Baby,
  gift: Gift,
  smartphone: Smartphone,
  mobile: Smartphone,
  laptop: Laptop,
  watch: Watch,
  camera: Camera,
  headphones: Headphones,
  wrench: Wrench,
  palette: Palette,
  tag: Tag,
};

const STYLE_TOKENS = new Set([
  "fa", "fas", "far", "fab",
  "fa-solid", "fa-regular", "fa-brands", "fa-light", "fa-thin",
]);

export function getCategoryIcon(name) {
  const tokens = String(name || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token && !STYLE_TOKENS.has(token));

  for (const token of tokens) {
    const key = token.replace(/^fa-/, "").replace(/_/g, "-");
    if (icons[key]) return icons[key];
  }

  return Tag;
}
