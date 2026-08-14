import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { OrderService } from "./order.service";
import type { db } from "~/server/db";

/**
 * Мок Prisma-клиента: подменяем только те методы, которые реально использует
 * OrderService, и записываем вызовы, чтобы проверить бизнес-логику.
 */
interface FakeTx {
  order: {
    create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  };
  productVariant: {
    update: (args: {
      where: { id: string };
      data: { stock: { decrement: number } };
    }) => Promise<{ id: string }>;
  };
}

function makeFakePrisma(
  variants: { id: string; price: { toNumber(): number }; stock: number }[],
) {
  const stock = new Map(variants.map((v) => [v.id, v.stock]));
  const createdOrders: Record<string, unknown>[] = [];
  const stockDecrements: { id: string; qty: number }[] = [];

  const tx: FakeTx = {
    order: {
      create: async ({ data }) => {
        const order = { id: "order-1", ...data };
        createdOrders.push(order);
        return order;
      },
    },
    productVariant: {
      update: async ({ where, data }) => {
        stockDecrements.push({ id: where.id, qty: data.stock.decrement });
        stock.set(where.id, stock.get(where.id)! - data.stock.decrement);
        return { id: where.id };
      },
    },
  };

  return {
    createdOrders,
    stockDecrements,
    prisma: {
      productVariant: {
        findMany: async ({ where }: { where: { id: { in: string[] } } }) =>
          variants.filter((v) => where.id.in.includes(v.id)),
      },
      $transaction: async <T>(fn: (tx: FakeTx) => Promise<T>) => fn(tx),
    } as unknown as typeof db,
  };
}

const item = (productVariantId: string, quantity: number) => ({
  productVariantId,
  quantity,
});

describe("OrderService.createOrder", () => {
  beforeEach(() => {
    // simulateStatusProgression запускает setTimeout; заглушаем, чтобы тесты
    // не оставляли фоновых таймеров.
    vi.stubGlobal("setTimeout", () => 0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("создаёт заказ, считает общую сумму из цены вариантов на сервере", async () => {
    const fake = makeFakePrisma([
      { id: "v1", price: { toNumber: () => 50 }, stock: 10 },
      { id: "v2", price: { toNumber: () => 30 }, stock: 5 },
    ]);
    const service = new OrderService(fake.prisma);

    const order = await service.createOrder({
      userId: "user-1",
      addressId: "addr-1",
      items: [item("v1", 2), item("v2", 1)],
    });

    // Сумма считается сервером из БД-цены, а не из ввода клиента
    expect(order.total).toBe(130);
  });

  it("списывает сток с вариантов в транзакции", async () => {
    const fake = makeFakePrisma([
      { id: "v1", price: { toNumber: () => 50 }, stock: 10 },
      { id: "v2", price: { toNumber: () => 30 }, stock: 5 },
    ]);
    const service = new OrderService(fake.prisma);

    await service.createOrder({
      userId: "user-1",
      addressId: "addr-1",
      items: [item("v1", 2), item("v2", 1)],
    });

    expect(fake.stockDecrements).toEqual([
      { id: "v1", qty: 2 },
      { id: "v2", qty: 1 },
    ]);
  });

  it("объединяет одинаковые варианты в одну позицию", async () => {
    const fake = makeFakePrisma([{ id: "v1", price: { toNumber: () => 10 }, stock: 100 }]);
    const service = new OrderService(fake.prisma);

    await service.createOrder({
      userId: "user-1",
      addressId: "addr-1",
      items: [item("v1", 2), item("v1", 3)],
    });

    expect(fake.stockDecrements).toEqual([{ id: "v1", qty: 5 }]);
  });

  it("кидает CONFLICT при нехватке стока", async () => {
    const fake = makeFakePrisma([{ id: "v1", price: { toNumber: () => 10 }, stock: 1 }]);
    const service = new OrderService(fake.prisma);

    await expect(
      service.createOrder({
        userId: "user-1",
        addressId: "addr-1",
        items: [item("v1", 5)],
      }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("кидает NOT_FOUND, если вариант не существует", async () => {
    const fake = makeFakePrisma([]);
    const service = new OrderService(fake.prisma);

    await expect(
      service.createOrder({
        userId: "user-1",
        addressId: "addr-1",
        items: [item("missing-variant", 1)],
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});