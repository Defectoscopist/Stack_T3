import { Card } from "../ui/card";

type Product = {
    name: string;
    images?: {url: string}[]
    variant?: {price : number}[]

}

export function ProductCard({ product }: { product: Product }) {
    const image = product.images?.[0]?.url;
    const price = product.variant?.[0]?.price;

    return (
        <Card className="p-4">
            <img
            src={image}
            alt={product.name}
            className="aspect-square object-cover rounded-md"
            />

            <h3 className="mt-3 font-semibold">
                {product.name}
            </h3>
            <p className="text-muted-foreground">
                ${price}
            </p>
        </Card>
    )
}