export type ProductVariantUI = {
    id: string;
    color: string | null;
    colorHex: string | null;
    images: string[];
    price: number;
}

export type ProductCardUI = {
    id: string;
    name: string;
    slug: string;
    variants: ProductVariantUI[];
    minPrice: number;
}