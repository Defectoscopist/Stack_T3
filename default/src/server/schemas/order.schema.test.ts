import { describe, it, expect } from "vitest";
import {
  checkoutSchema,
  createOrderSchema,
  orderStatusSchema,
  orderItemInputSchema,
} from "./order.schema";

const validItem = { productVariantId: "variant-1", quantity: 1 };

describe("orderStatusSchema", () => {
  it("принимает валидные статусы", () => {
    for (const status of ["PENDING", "DELIVERING", "COMPLETED", "CANCELLED", "RETURNING", "RETURNED"]) {
      expect(() => orderStatusSchema.parse(status)).not.toThrow();
    }
  });

  it("отклоняет неизвестный статус", () => {
    expect(() => orderStatusSchema.parse("SHIPPED")).toThrow();
  });
});

describe("orderItemInputSchema", () => {
  it("принимает валидную позицию", () => {
    expect(() => orderItemInputSchema.parse(validItem)).not.toThrow();
  });

  it("отклоняет quantity = 0", () => {
    expect(() => orderItemInputSchema.parse({ productVariantId: "v", quantity: 0 })).toThrow();
  });
});

describe("createOrderSchema", () => {
  it("принимает заказ минимум с одной позицией", () => {
    const input = {
      userId: "user-1",
      addressId: "address-1",
      items: [validItem],
    };
    expect(() => createOrderSchema.parse(input)).not.toThrow();
  });

  it("отклоняет заказ без позиций", () => {
    const input = { userId: "u", addressId: "a", items: [] };
    expect(() => createOrderSchema.parse(input)).toThrow();
  });

  it("объединяет одинаковые productVariantId (на уровне схемы — дубликаты допустимы)", () => {
    const input = { userId: "u", addressId: "a", items: [validItem, validItem] };
    expect(() => createOrderSchema.parse(input)).not.toThrow();
  });
});

describe("checkoutSchema", () => {
  const base = {
    firstName: "John",
    lastName: "Doe",
    street: "Main St 1",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    phone: "1234567890",
    items: [validItem],
  };

  it("принимает валидные данные", () => {
    expect(() => checkoutSchema.parse(base)).not.toThrow();
  });

  it("отклоняет пустой firstName", () => {
    expect(() => checkoutSchema.parse({ ...base, firstName: "" })).toThrow();
  });

  it("отклоняет короткий почтовый индекс", () => {
    expect(() => checkoutSchema.parse({ ...base, postalCode: "123" })).toThrow();
  });

  it("отклоняет короткий номер телефона", () => {
    expect(() => checkoutSchema.parse({ ...base, phone: "123" })).toThrow();
  });
});
