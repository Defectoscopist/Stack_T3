"use client";

import { clear } from "console";
import { string } from "zod/v4";
import { api } from "~/trpc/react";

export default function ProductTest() {
    
    let getAll = api.product.getAll.useQuery();
   
    const testProductSlug: string = "iris-4k"

    const getProductBySlug = api.product.getBySlug.useQuery({
        slug: testProductSlug
    })

    const testProductId: string = "cmmdd5k69000di7xc8y1plwj0" 

    const getProductById = api.product.getById.useQuery({
        id: testProductId
    })

    return (
        <div style = {{padding: 40}}>
            <h1>Get All Products</h1>
            <pre>
                {JSON.stringify(getAll.data, null, 2)}
            </pre>

            <h2>Product By Slug:</h2>
            <pre>
                {JSON.stringify(getProductBySlug.data, null, 2)}
            </pre>

            <h3>Product By Id:</h3>
            <pre>
                {JSON.stringify(getProductById.data, null, 2)}
            </pre>
        </div>
    )

}