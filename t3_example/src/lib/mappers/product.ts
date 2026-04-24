import type { ProductCardUI } from "~/types/product";

export const mapProductToCard = (product: any): ProductCardUI => {
    const variants = product.variant ?? []

    const mappedVariants = variants.map((v: any) => ({
        id: v.id,
        color: v.color ?? null,
        colorHex: v.colorHex ?? "#999",
        images: v.images?.map((img: any) => img.url) ?? [],
        price: Number(v.price),
    }));

    const minPrice = mappedVariants.length > 0 ? Math.min(...mappedVariants.map((v: any) => v.price)) : 0;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        variants: mappedVariants,
        minPrice,
    };
}