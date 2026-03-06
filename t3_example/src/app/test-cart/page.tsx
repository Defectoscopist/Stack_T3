"use client";

import { clear } from "console";
import { api } from "~/trpc/react";

export default function CartTest() {
    
    const cartQuery = api.cart.getCart.useQuery();

    const addItem = api.cart.addItem.useMutation({
        onSuccess: () => cartQuery.refetch()
    })

    const removeItem = api.cart.removeItem.useMutation({
        onSuccess: () => cartQuery.refetch()
    })

    const clearCart = api.cart.clearCart.useMutation({
        onSuccess: () => cartQuery.refetch()
    })

    const testProductId: string = "cmmdd5k5t0007i7xchk0s3ego"

    return (
        <div style = {{padding: 40}}>
            <h1>Add to Cart Test</h1>
            <button onClick={() => addItem.mutate({variantId: testProductId, quantity: 1})}>
                Add Item
            </button>

            <h2>Cart Content:</h2>
            <pre>
                {JSON.stringify(cartQuery.data, null, 2)}
            </pre>

            <h3>Remove Item Test</h3>
            <button onClick={() => removeItem.mutate({variantId: testProductId})}>
                Remove Item
            </button>

            <h4>Clear cart Test</h4>
            <button onClick={() => clearCart.mutate()}>
                Clear cart
            </button>
        </div>
    )

}