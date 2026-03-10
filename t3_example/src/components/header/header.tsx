import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export function Header() {
    return (
    <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
            <Link href="/" className="text-x1 font-bold">
                My Store
            </Link>
            <nav className="flex items-center gap-6">
                <Link href="/products">
                    Products
                </Link>

                <Button variant="outline" size="icon">
                    <ShoppingCart className="h-5 w-5"/>
                    <Badge className="ml-1">0</Badge>
                </Button>
            </nav>
        </div>
    </header>
    )
}