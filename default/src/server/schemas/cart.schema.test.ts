import { describe, it, expect } from "vitest";
import {
  addToCartSchema,
  updateCartItemSchema,
  getCartByUserIdSchema,
} from "./cart.schema";

describe("getCartByUserIdSchema", () => {
  it("принимает непустой userId", () => {
    expect(() => getCartByUserIdSchema.parse({ userId: "user-1" })).not.toThrow();
  });

  it("отклоняет пустой userId", () => {
    expect(() => getCartByUserIdSchema.parse({ userId: "" })).toThrow();
  });
});

describe("addToCartSchema", () => {
  it("принимает валидные данные", () => {
    const input = { userId: "user-1", productVariantId: "variant-1", quantity: 2 };
    expect(() => addToCartSchema.parse(input)).not.toThrow();
  });

  it("отклоняет quantity = 0 (минимум 1)", () => {
    expect(() =>
      addToCartSchema.parse({ userId: "u", productVariantId: "v", quantity: 0 }),
    ).toThrow();
  });

  it("отклоняет дробное quantity", () => {
    expect(() =>
      addToCartSchema.parse({ userId: "u", productVariantId: "v", quantity: 1.5 }),
    ).toThrow();
  });

  it("отклоняет пустой productVariantId", () => {
    expect(() =>
      addToCartSchema.parse({ userId: "u", productVariantId: "", quantity: 1 }),
    ).toThrow();
  });
});

describe("updateCartItemSchema", () => {
  it("позволяет quantity = 0 (удаление позиции)", () => {
    const input = { cartItemId: "cart-item-1", quantity: 0 };
    expect(() => updateCartItemSchema.parse(input)).not.toThrow();
  });

  it("отклоняет отрицательное quantity", () => {
    expect(() =>
      updateCartItemSchema.parse({ cartItemId: "cart-item-1", quantity: -1 }),
    ).toThrow();
  });
});
