"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPinned,
  ShoppingBag,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  PENDING: {
    icon: <Clock className="w-5 h-5" />,
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  DELIVERING: {
    icon: <Truck className="w-5 h-5" />,
    label: "Delivering",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  COMPLETED: {
    icon: <CheckCircle className="w-5 h-5" />,
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  CANCELLED: {
    icon: <XCircle className="w-5 h-5" />,
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  RETURNING: {
    icon: <RotateCcw className="w-5 h-5" />,
    label: "Returning",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  RETURNED: {
    icon: <RotateCcw className="w-5 h-5" />,
    label: "Returned",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: order, isLoading, refetch } = api.order.getOrderById.useQuery(
    { id: orderId },
    { enabled: !!orderId }
  );

  const cancelMutation = api.order.cancelOrder.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-6">This order doesn't exist or you don't have access to it.</p>
          <Link href="/profile" className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] ?? statusConfig.PENDING!;
  const canCancel = order.status === "PENDING" || order.status === "DELIVERING";
  const canRequestReturn = order.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/profile" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Items ({order.orderItems.length})
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                      {item.productVariant?.product?.productImages?.[0]?.url ? (
                        <Image
                          src={item.productVariant.product.productImages[0].url}
                          alt={item.productVariant.product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {item.productVariant?.product?.name ?? "Product"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.productVariant?.size && `Size: ${item.productVariant.size}`}
                        {item.productVariant?.size && item.productVariant?.color ? " / " : ""}
                        {item.productVariant?.color && `Color: ${item.productVariant.color}`}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">${Number(item.price).toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPinned className="w-5 h-5" />
                  Delivery Address
                </h2>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p className="font-medium text-gray-900">{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                  <p>{order.address.country}</p>
                  <p className="text-gray-400">{order.address.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${Number(order.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{Number(order.total) > 50 ? "Free" : "$9.99"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">${(Number(order.total) * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(Number(order.total) + (Number(order.total) > 50 ? 0 : 9.99) + Number(order.total) * 0.08).toFixed(2)}</span>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Order ID</span>
                    <span className="font-mono">{order.id}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Updated</span>
                    <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Actions</h2>
              {canCancel && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this order?")) {
                      cancelMutation.mutate({ orderId: order.id });
                    }
                  }}
                  disabled={cancelMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
              {canRequestReturn && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Request Return
                </button>
              )}
              <Link
                href="/shop"
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}