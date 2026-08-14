import { describe, it, expect } from "vitest";
import {
  paginationSchema,
  getProductsSchema,
  productVariantOutputSchema,
} from "./product.schema";

describe("paginationSchema", () => {
  it("применяет дефолтные значения limit=1000 и offset=0", () => {
    const result = paginationSchema.parse({});
    expect(result.limit).toBe(1000);
    expect(result.offset).toBe(0);
  });

  it("принимает валидные значения", () => {
    const result = paginationSchema.parse({ limit: 20, offset: 10 });
    expect(result).toEqual({ limit: 20, offset: 10 });
  });

  it("отклоняет неположительный limit", () => {
    expect(() => paginationSchema.parse({ limit: 0 })).toThrow();
  });

  it("отклоняет нецелочисленный limit", () => {
    expect(() => paginationSchema.parse({ limit: 5.5 })).toThrow();
  });
});

describe("getProductsSchema", () => {
  it("принимает валидный запрос с дефолтами", () => {
    const result = getProductsSchema.parse({ search: "t-shirt" });
    expect(result).toMatchObject({ limit: 1000, offset: 0, images: true, variants: true });
  });

  it("принимает пустой поиск (опциональное поле)", () => {
    expect(() => getProductsSchema.parse({})).not.toThrow();
  });

  it("отклоняет отрицательный minPrice", () => {
    expect(() => getProductsSchema.parse({ minPrice: -5 })).toThrow();
  });
});

describe("productVariantOutputSchema", () => {
  it("принимает валидный вариант продукта", () => {
    const variant = {
      id: "variant-1",
      price: 19.99,
      stock: 5,
      color: "Black",
      size: "M",
      imagesUrl: ["/images/1.jpg"],
    };
    expect(() => productVariantOutputSchema.parse(variant)).not.toThrow();
  });

  it("отклоняет некорректный размер (не из enum Size)", () => {
    const variant = {
      id: "variant-1",
      price: 19.99,
      stock: 5,
      color: null,
      size: "WRONG_SIZE",
      imagesUrl: [],
    };
    expect(() => productVariantOutputSchema.parse(variant)).toThrow();
  });

  it("отклоняет отрицательную цену", () => {
    const variant = {
      id: "variant-1",
      price: -1,
      stock: 5,
      color: null,
      size: "M",
      imagesUrl: [],
    };
    expect(() => productVariantOutputSchema.parse(variant)).toThrow();
  });
});
