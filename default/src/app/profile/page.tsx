"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  Edit3,
  Plus,
  Home,
  MapPinned,
} from "lucide-react";

type Tab = "orders" | "addresses" | "settings";

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4 text-amber-500" />,
  DELIVERING: <Truck className="w-4 h-4 text-blue-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  RETURNING: <RotateCcw className="w-4 h-4 text-orange-500" />,
  RETURNED: <RotateCcw className="w-4 h-4 text-gray-500" />,
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  DELIVERING: "Delivering",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNING: "Returning",
  RETURNED: "Returned",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  DELIVERING: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNING: "bg-orange-50 text-orange-700 border-orange-200",
  RETURNED: "bg-gray-50 text-gray-700 border-gray-200",
};

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    },
  });

  const { data: orders, isLoading: ordersLoading } = api.order.getOrdersByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: status === "authenticated" }
  );

  const { data: addresses, refetch: refetchAddresses } = api.address.getAddresses.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const createAddress = api.address.createAddress.useMutation({
    onSuccess: () => {
      void refetchAddresses();
    },
  });

  const onSaveAddress = async (data: AddressForm) => {
    setIsSavingAddress(true);
    try {
      await createAddress.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        street: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.zipCode,
        country: data.country,
        phone: data.phone,
      });
      setIsSavingAddress(false);
      setShowAddressForm(false);
      reset();
    } catch (error) {
      console.error("Failed to save address:", error);
      setIsSavingAddress(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to Your Account</h1>
          <p className="text-gray-500 mb-8">
            Sign in to view your profile, orders, and manage your addresses.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => signIn("github")}
              className="w-full bg-gray-900 text-white rounded-full py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
            <button
              onClick={() => signIn("google")}
              className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <button
              onClick={() => signIn("vk")}
              className="w-full bg-[#0077FF] text-white rounded-full py-3 font-semibold hover:bg-[#0066DD] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C2.879 0 0 2.879 0 8.316v7.368C0 21.121 2.879 24 8.316 24h7.368C21.121 24 24 21.121 24 15.684V8.316C24 2.879 21.121 0 15.684 0zm3.812 17.285h-1.594c-.482 0-.631-.372-1.463-1.197-.731-.686-1.04-.762-1.226-.762-.283 0-.366.103-.366.613v1.01c0 .393-.12.613-1.133.613-1.66 0-3.5-1.002-4.797-2.873-1.833-2.327-2.35-4.062-2.35-4.433 0-.186.083-.358.613-.358h1.592c.462 0 .634.186.788.634.566 1.58 1.546 3.003 1.943 3.003.151 0 .214-.062.214-.4v-2.539c0-.904-.525-.979-.525-.979s.413-.317.972-.317h1.76c.413 0 .545.214.545.676v2.882c0 .427.186.565.303.565.245 0 .538-.138.827-.427.903-1.028 1.57-2.573 1.57-2.573.084-.165.214-.31.469-.31h1.595c.483 0 .593.234.483.648-.138.69-2.142 3.907-2.142 3.907-.172.262-.241.393 0 .676.165.241.717.703 1.089 1.129.552.634.986 1.175 1.113 1.548.13.393-.069.613-.524.613z"/>
              </svg>
              Sign in with VK
            </button>
            <button
              onClick={() => signIn("yandex")}
              className="w-full bg-[#FC3F1D] text-white rounded-full py-3 font-semibold hover:bg-[#E0381A] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.39 5.114c.786 0 1.348.246 1.687.738.34.492.51 1.23.51 2.214v1.624c0 .984-.17 1.722-.51 2.214-.34.492-.901.738-1.688.738-.786 0-1.355-.246-1.707-.738-.352-.492-.528-1.23-.528-2.214V8.066c0-.984.176-1.722.528-2.214.352-.492.921-.738 1.707-.738zm-3.377 10.102l.682-1.706c.454-.084.869-.19 1.245-.32.84.983 1.706 1.475 2.596 1.475s1.73-.387 2.32-1.16c.589-.754.884-1.82.884-3.197V7.994c0-1.373-.295-2.443-.884-3.209-.59-.766-1.391-1.148-2.404-1.148-1.414 0-2.455.634-3.125 1.902-.444-.564-1.073-.851-1.887-.851-.935 0-1.648.318-2.14.954-.492.635-.738 1.49-.738 2.564v10.516h1.94V8.927c0-.648.112-1.126.336-1.435.224-.31.532-.464.923-.464.447 0 .828.19 1.144.57.316.38.474.909.474 1.586v5.54h1.739l.155.492z"/>
              </svg>
              Sign in with Yandex
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner / Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user?.name ?? "Profile"}
                  width={72}
                  height={72}
                  className="rounded-full object-cover w-[72px] h-[72px] border-2 border-gray-100"
                />
              ) : (
                <div className="w-[72px] h-[72px] bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-100">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {user?.name ?? "User"}
              </h1>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {orders?.length ?? 0} orders
                </span>
              </div>
            </div>

            {/* Sign Out */}
            <div className="shrink-0">
              {showSignOutConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Confirm Sign Out
                  </button>
                  <button
                    onClick={() => setShowSignOutConfirm(false)}
                    className="px-4 py-2 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 -mb-px">
            {[
              { id: "orders" as Tab, label: "Order History", icon: Package },
              { id: "addresses" as Tab, label: "Addresses", icon: MapPin },
              { id: "settings" as Tab, label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>
              <Link
                href="/shop"
                className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
              >
                Continue Shopping
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                    </div>
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                      className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                statusColors[order.status] ?? "bg-gray-50 text-gray-700 border-gray-200"
                              }`}
                            >
                              {statusIcons[order.status]}
                              {statusLabels[order.status] ?? order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${Number(order.total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 ml-4">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Order Details (Expanded) */}
                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-100 px-4 sm:px-6 py-4 bg-gray-50/50">
                        {/* Delivery Address */}
                        {order.address && (
                          <div className="mb-4 flex items-start gap-2 text-sm text-gray-600">
                            <MapPinned className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-700">Deliver to: </span>
                              {order.address.street}, {order.address.city},{" "}
                              {order.address.state} {order.address.postalCode},{" "}
                              {order.address.country}
                            </div>
                          </div>
                        )}

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                            >
                              <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                                {item.productVariant?.product?.productImages?.[0]?.url ? (
                                  <Image
                                    src={item.productVariant.product.productImages[0].url}
                                    alt={item.productVariant.product.name}
                                    width={56}
                                    height={56}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.productVariant?.product?.name ?? "Product"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.productVariant?.size && `Size: ${item.productVariant.size}`}
                                  {item.productVariant?.size && item.productVariant?.color ? " / " : ""}
                                  {item.productVariant?.color && `Color: ${item.productVariant.color}`}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  ${Number(item.price).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="mt-4 flex items-center gap-3">
                          {(order.status === "PENDING" || order.status === "DELIVERING") && (
                            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                              <XCircle className="w-4 h-4" />
                              Cancel Order
                            </button>
                          )}
                          {order.status === "COMPLETED" && (
                            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
                              <RotateCcw className="w-4 h-4" />
                              Request Return
                            </button>
                          )}
                          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                            Need Help?
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Start shopping to see your orders here.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                  <ShoppingBag className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Addresses</h2>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">New Address</h3>
                  <button
                    onClick={() => { setShowAddressForm(false); reset(); }}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSaveAddress)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        {...register("firstName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        {...register("lastName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      {...register("address")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        {...register("city")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        {...register("state")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        {...register("zipCode")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-xs mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        {...register("country")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                      />
                      {errors.country && (
                        <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dynamic Addresses */}
                {addresses && addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">{addr.firstName} {addr.lastName}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p>{addr.country}</p>
                        <p className="flex items-center gap-1 mt-1 text-gray-400">
                          <Phone className="w-3 h-3" />
                          {addr.phone}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* Empty State */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center justify-center min-h-[160px]">
                      <MapPin className="w-8 h-8 text-gray-300 mb-2" />
                      <span className="text-sm text-gray-400">No addresses saved yet</span>
                    </div>
                  </>
                )}

                {/* Add Address Card */}
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center min-h-[160px] hover:border-gray-400 hover:bg-gray-50/50 transition-all group cursor-pointer"
                >
                  <Plus className="w-8 h-8 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-gray-600 mt-2 transition-colors">
                    Add New Address
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>

            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={user?.name ?? ""}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                        placeholder="Your name"
                      />
                      <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
                        Save
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </div>
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email ?? ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Preferences
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-700">Email Notifications</span>
                      <p className="text-xs text-gray-400">Receive order updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-700">SMS Notifications</span>
                      <p className="text-xs text-gray-400">Receive shipping updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-100 p-6">
                <h3 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Irreversible actions that affect your account.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}