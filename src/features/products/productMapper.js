/**
 * Convierte un producto "crudo" de Supabase (con sus joins) en el objeto
 * que usa la interfaz. Si cambia la base de datos, solo se toca este archivo.
 */
export function mapProduct(product) {
  const sortedImages = [...(product.product_images || [])]
    .sort((a, b) => a.position - b.position);

  const mainPrice = product.product_prices?.[0];

  // Imagen principal definida directamente en products
  const mainImage = product.image_url;

  // Galería adicional proveniente de product_images
  const galleryImages = sortedImages.map((image) => ({
    id: image.id,
    image_url: image.image_url,
    position: image.position,
  }));

  // La galería completa comienza con la imagen principal
  const gallery = [
    ...(mainImage
      ? [
          {
            id: `main-${product.id}`,
            image_url: mainImage,
            position: 0,
            isMain: true,
          },
        ]
      : []),
    ...galleryImages,
  ];

  return {
    id: product.id,
    sku: product.sku,

    name: product.name,
    slug: product.slug,

    shortDescription: product.short_description || "",
    description: product.description || "",

    image: mainImage,
    gallery,

    price: mainPrice?.price || 0,
    currency: mainPrice?.currency || "COP",

    createdAt: product.created_at,

    brandId: product.brand_id ?? null,

    badge: product.badge,
    badgeColor: product.product_badges?.color ?? "navy",
    featured: product.is_featured,

    rating: product.rating || 0,
    reviews: product.reviews || 0,

    discount: product.discount_percentage || 0,
    stock: product.stock || 0,

    categories:
      product.products_categories
        ?.map((item) => item.categories)
        .filter(Boolean) || [],

    attributes: product.attributes || [],
  };
}
