# Lumo

Marketplace / e-commerce con tres tipos de usuario: **cliente**, **vendedor** y **administrador**.

**Stack:** React 19 · Vite · Tailwind CSS 4 · React Router 7 · Supabase (Auth + PostgreSQL) · Lucide (íconos)

## Cómo correrlo

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
# edita .env con la URL y la clave anon de tu proyecto de Supabase
npm run dev
```

Otros comandos: `npm run build` (producción) y `npm run lint`.

> Nunca subas el archivo `.env` a Git (ya está en `.gitignore`). La clave anon es pública
> por diseño, pero solo es segura si cada tabla de Supabase tiene **RLS** (Row Level Security) activo.

## Estructura del proyecto

El código se organiza **por funcionalidad (feature)**: cada feature agrupa sus componentes,
hooks y llamadas a Supabase. Así, para tocar "productos" casi todo está en una sola carpeta.

```
src/
├── app/                  Arranque de la app
│   ├── App.jsx           Router + (futuros) providers globales
│   └── routes/           Definición de rutas
├── features/             Lógica de negocio, una carpeta por funcionalidad
│   ├── auth/             Sesión y registro/login: context (AuthProvider), hooks (useAuth), components, authService
│   ├── products/         ProductCard, ProductDetail, hooks, productService, productMapper
│   └── categories/       CategoryList, CategoryBar, categoryService, categoryThemes
├── pages/                Una página por ruta. Solo ensamblan features (sin lógica pesada)
│   ├── client/           HomePage, ProductDetailPage
│   └── auth/             RegisterPage
├── layouts/              Marcos de página (ClientLayout con Header y Footer)
├── shared/               Reutilizable en cualquier feature
│   ├── components/       SectionTitle, FormField...
│   ├── utils/            formatCurrency...
│   └── lib/              Cliente de Supabase
├── index.css             Tailwind + tokens de diseño (colores lumo-*)
└── main.jsx
```

## Convenciones

- **Imports con alias `@`**: `import X from "@/features/products/..."` (apunta a `src/`). Evita los `../../../`.
- **Nombres**: carpetas en minúscula; componentes en `PascalCase.jsx`; el resto en `camelCase.js`.
- **Los componentes no llaman a Supabase directamente**: usan hooks (`useProduct`) que usan servicios (`productService`).
- **Los datos de la BD se transforman en `productMapper.js`**, así si cambia la tabla solo se edita ese archivo.
- **Colores**: usa siempre los tokens de `index.css` (`text-lumo-navy`, `bg-lumo-navy-light`...). No escribas hexadecimales en los componentes.
- **Íconos**: solo `lucide-react`.
- **Precios**: siempre con `formatCurrency()`.
- **Una carpeta nueva solo cuando hay un archivo para meter** (no dejar carpetas ni archivos vacíos).

## Pendiente / siguiente

- [x] `AuthContext` + `useAuth`, página de login y `ProtectedRoute` (requiere sesión)
- [ ] Restringir `/seller` y `/admin` por **rol** (falta definir dónde se guarda el rol en Supabase)
- [ ] Carrito (`features/cart`)
- [ ] Conectar `CategoryList` y `CategoryBar` a `categoryService.getCategories()`
- [ ] `SellerLayout` / `AdminLayout` y sus páginas
- [ ] Footer real y búsqueda funcional
