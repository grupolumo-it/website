import { Navigate, useParams } from "react-router-dom";

/** Los enlaces antiguos /categories/<slug> llevan al catálogo filtrado por esa categoría. */
export default function CategoryRedirect() {
  const { slug } = useParams();

  return <Navigate to={`/catalog?categoria=${encodeURIComponent(slug)}`} replace />;
}
