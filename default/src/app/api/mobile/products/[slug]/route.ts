import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { ProductService } from "~/server/services/product.service";
import { getMobileUserId, parseBearer } from "~/server/mobile/token";

const productService = new ProductService(db);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const token = parseBearer(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getMobileUserId(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const product = await productService.getProductBySlug({ slug });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}