import {api} from "~/trpc/server";

type ProductPageProps = {
    params: {slug: string}
}

export default async function ProductPage ({ params } : ProductPageProps) {
    const productVariant = await api.catalog.getProductBySlug({slug: params.slug})
    return (
        <main className="min-h-screen bg-black text-white">
            <h1 className="text-3xl font-semibold tracking-tight">
                {productVariant?.brand.toString()}
            </h1>
            <h2 className="text-3xl font-semibold tracking-tight">
                {productVariant?.category.toString()}
            </h2>
            <h3 className="text-3xl font-semibold tracking-tight">
                {productVariant?.name.toString()}
            </h3>
            <h4 className="text-3xl font-semibold tracking-tight">
                {productVariant?.description.toString()}
            </h4>
        </main>
    )
}