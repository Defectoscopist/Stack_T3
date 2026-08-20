import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { OrderService } from "./order.service";
import type { db } from "~/server/db";

interface FakeVariant {
  id: string;
  price: { toNumber(): number };
  stock: number;
  stockReserved: number;
}

interface FakeTx {
  order: {
    create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  };
  productVariant: {
    update: (args: { where: { id: string }; data: { stockReserved?: { increment: number } } }) => Promise<{ id: string }>;
  };
}

function makeFakePrisma(variants: FakeVariant[]) {
  const stockReserved = new Map(variants.map((v) => [v.id, v.stockReserved]));
  const createdOrders: Record<string, unknown>[] = [];
  const reserveSteps: { id: string; qty: number }[] = [];

  const tx: FakeTx = {
    order: {
      create: async ({ data }) => {
        const order = { id: "order-1", ...data };
        createdOrders.push(order);
        return order;
      },
      update: async ({ where, data }) => ({ id: where.id, ...data }),
    },
    productVariant: {
      update: async ({ where, data }) => {
        const qty = data.stockReserved?.increment ?? 0;
        reserveSteps.push({ id: where.id, qty });
        stockReserved.set(where.id, stockReserved.get(where.id)! + qty);
        return { id: where.id };
      },
    },
  };

  return {
    createdOrders,
    reserveSteps,
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

const checkoutInput = (items: { productVariantId: string; quantity: number }[]) => ({
  firstName: "John",
  lastName: "Doe",
  street: "Main St 1",
  city: "NYC",
  state: "NY",
  postalCode: "10001",
  country: "US",
  phone: "1234567890",
  items,
});

describe("OrderService.checkout", () => {
  beforeEach(() => {
    vi.stubGlobal("setTimeout", () => 0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("считает общую сумму из цены вариантов на сервере и резервирует сток", async () => {
    const fake = makeFakePrisma([
      { id: "v1", price: { toNumber: () => 50 }, stock: 10, stockReserved: 0 },
      { id: "v2", price: { toNumber: () => 30 }, stock: 5, stockReserved: 0 },
    ]);
    const service = new OrderService(fake.prisma);

    const result = await service.checkout(checkoutInput([item("v1", 2), item("v2", 1)]), "user-1", "addr-1");

    // Сумма из БД-цены, а не из ввода
    expect(result.order.total).toBe(130);
    // Резерв (hold), без списания stock
    expect(fake.reserveSteps).toEqual([
      { id: "v1", qty: 2 },
      { id: "v2", qty: 1 },
    ]);
    // PaymentIntent создан (симуляция, без Stripe-ключей)
    expect(result.order.paymentIntentId).toMatch(/^sim_pi_/);
    expect(result.simulated).toBe(true);
  });

  it("объединяет одинаковые варианты в одну позицию и резервирует суммарно", async () => {
    const fake = makeFakePrisma([{ id: "v1", price: { toNumber: () => 10 }, stock: 100, stockReserved: 0 }]);
    const service = new OrderService(fake.prisma);

    await service.checkout(checkoutInput([item("v1", 2), item("v1", 3)]), "user-1", "addr-1");

    expect(fake.reserveSteps).toEqual([{ id: "v1", qty: 5 }]);
  });

  it("кидает CONFLICT при нехватке стока (с учётом уже зарезервированного)", async () => {
    const fake = makeFakePrisma([{ id: "v1", price: { toNumber: () => 10 }, stock: 5, stockReserved: 4 }]);
    const service = new OrderService(fake.prisma);

    await expect(
      service.checkout(checkoutInput([item("v1", 5)]), "user-1", "addr-1"),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("кидает NOT_FOUND, если вариант не существует", async () => {
    const fake = makeFakePrisma([]);
    const service = new OrderService(fake.prisma);

    await expect(
      service.checkout(checkoutInput([item("missing-variant", 1)]), "user-1", "addr-1"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
describe("OrderService payment lifecycle", () => {
  // A stateful in-memory mock sufficient for confirm/finalize/release.
  interface Variant {
    id: string;
    stock: number;
    stockReserved: number;
  }
  interface OrderRow {
    id: string;
    userId: string;
    paymentStatus: string | null;
    paymentIntentId: string | null;
    orderItems: { productVariantId: string; reserved: number }[];
  }

  function mockPaymentPrisma(
    variants: Variant[],
    orders: OrderRow[],
  ) {
    const varById = new Map(variants.map((v) => [v.id, { ...v }]));
    const orderRows: OrderRow[] = [...orders];

    const tx = {
      order: {
        findFirst: async ({ where }: { where: { id?: string; paymentIntentId?: string } }) =>
          orderRows.find((o) =>
            (where.id !== undefined && o.id === where.id) ||
            (where.paymentIntentId !== undefined && o.paymentIntentId === where.paymentIntentId),
          ) ?? null,
        findMany: async ({ where }: { where?: { paymentStatus?: string | null; holdExpiresAt?: unknown } }) => {
          const all = orderRows.slice();
          if (where?.paymentStatus !== undefined) {
            return all.filter((o) => o.paymentStatus === where.paymentStatus);
          }
          return all;
        },
        update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
          const idx = orderRows.findIndex((o) => o.id === where.id);
          Object.assign(orderRows[idx]!, data);
          return orderRows[idx]!;
        },
      },
      productVariant: {
        update: async ({
          where,
          data,
        }: {
          where: { id: string };
          data: { stockReserved?: { decrement?: number; increment?: number }; stock?: { decrement: number } };
        }) => {
          const v = varById.get(where.id)!;
          if (data.stockReserved?.decrement) v.stockReserved -= data.stockReserved.decrement;
          if (data.stockReserved?.increment) v.stockReserved += data.stockReserved.increment;
          if (data.stock?.decrement) v.stock -= data.stock.decrement;
          return { id: v.id };
        },
      },
    };

    return {
      variantById: varById,
      orders: orderRows,
      prisma: {
        order: {
          findFirst: tx.order.findFirst,
        },
        $transaction: async <T>(fn: (t: typeof tx) => Promise<T>) => fn(tx),
      } as unknown as typeof db,
    };
  }

  const pendingOrder = (opts: { id?: string; pi?: string }) =>
    ({
      id: opts.id ?? "order-1",
      userId: "user-1",
      paymentStatus: "PENDING_PAYMENT",
      paymentIntentId: opts.pi ?? "pi_123",
      orderItems: [{ productVariantId: "v1", reserved: 2 }],
    }) as OrderRow;

  beforeEach(() => vi.stubGlobal("setTimeout", () => 0));
  afterEach(() => vi.unstubAllGlobals());

  it("finalizePaidOrder переводит заказ в PAID и перемещает hold→sold", async () => {
    const mock = mockPaymentPrisma(
      [{ id: "v1", stock: 10, stockReserved: 2 }],
      [pendingOrder({ pi: "pi_123" })],
    );
    const service = new OrderService(mock.prisma);

    const order = await service.finalizePaidOrder("pi_123");
    expect(order?.paymentStatus).toBe("PAID");
    // hold снят и продан
    expect(mock.variantById.get("v1")?.stockReserved).toBe(0);
    expect(mock.variantById.get("v1")?.stock).toBe(8);
  });

  it("finalizePaidOrder идемпотентен (второй вызов не меняет заказ)", async () => {
    const mock = mockPaymentPrisma(
      [{ id: "v1", stock: 10, stockReserved: 2 }],
      [pendingOrder({ pi: "pi_123" })],
    );
    const service = new OrderService(mock.prisma);
    await service.finalizePaidOrder("pi_123");
    const snapshot = mock.orders[0]!.paymentStatus;

    const again = await service.finalizePaidOrder("pi_123");
    expect(again?.paymentStatus).toBe("PAID");
    expect(mock.orders[0]!.paymentStatus).toBe(snapshot);
  });

  it("releaseExpiredHolds списывает только впросроченные резервы", async () => {
    const mock = mockPaymentPrisma(
      [{ id: "v1", stock: 10, stockReserved: 2 }],
      [pendingOrder({ id: "order-1", pi: "pi_expired" })],
    );
    const service = new OrderService(mock.prisma);

    const released = await service.releaseExpiredHolds();

    expect(released).toBeGreaterThan(0);
    expect(mock.variantById.get("v1")?.stockReserved).toBe(0);
    expect(mock.orders[0]!.paymentStatus).toBe("FAILED");
  });
});