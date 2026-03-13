import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Link from "next/link";

type ProductCardProps = {
    name: string,
    description: string,
    price: string
    slug: string
}

export function ProductCard ({name, description, price, slug} : ProductCardProps) {
    return (
        <Link href={`/store/${slug}`} passHref className="block h-full">
            <Card className="cursor-pointer transition-transform hover:scale-[1.02]">
                <article className="flex h-full flex-col p-4">
                    <CardHeader className="p-0">
                        <CardTitle className="text-sm font-medium">{name}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-2 flex flex-1 flex-col justify-between p-0">
                        <p className="mt-1 line-clamp-2 text-xs text-white/60">
                            {description}
                        </p>
                        <p className="mt-3 text-sm font-semibold">{price} ₽</p>
                    </CardContent>
                </article>
            </Card>
        </Link>
    )
}