import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { ProductService } from "~/server/services/product.service";
import { getMobileUserId, parseBearer } from "~/server/mobile/token";
import * as ProductSchemas from "~/server/schemas/product.schema";

const productService = new ProductService(db);

export async function GET(req: Request) {
  // Bearer auth for the mobile client.
  const token = parseBearer(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getMobileUserId(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 12);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const input = {
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
    search: url.searchParams.get("search") ?? undefined,
    images: true,
    variants: true,
    isActive: true,
    isFeatured: false,
    brandId: null,
    categoryId: null,
  } satisfies z.infer<typeof ProductSchemas.getProductsSchema>;

  const products = await productService.getProducts(input);
  return NextResponse.json({ products });
}