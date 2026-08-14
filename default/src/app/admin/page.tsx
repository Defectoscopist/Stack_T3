"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Truck,
  RotateCcw,
  Shield,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

type AdminTab = "dashboard" | "products" | "orders" | "categories" | "brands" | "users";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  DELIVERING: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNING: "bg-orange-50 text-orange-700 border-orange-200",
  RETURNED: "bg-gray-50 text-gray-700 border-gray-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4 text-amber-500" />,
  DELIVERING: <Truck className="w-4 h-4 text-blue-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  RETURNING: <RotateCcw className="w-4 h-4 text-orange-500" />,
  RETURNED: <RotateCcw className="w-4 h-4 text-gray-500" />,
};

function getProductImageUrl(slug: string): string {
  return `/images/catalog/${slug}/main.jpg`;
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return "-";
  const parts = email.split("@");
  if (parts.length < 2) return email;
  const local = parts[0]!;
  const domain = parts.slice(1).join("@");
  const masked = local.length <= 2
    ? local[0] + "***"
    : local[0] + "***" + local[local.length - 1];
  return `${masked}@${domain}`;
}

// ===== Confirm Delete Modal =====
function ConfirmDeleteModal({
  title,
  itemName,
  onConfirm,
  onClose,
  isDeleting,
}: {
  title: string;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-1">Are you sure you want to delete</p>
          <p className="text-sm font-semibold text-gray-700 mb-6">&quot;{itemName}&quot;?</p>
          <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Confirm Action Modal =====
function ConfirmActionModal({
  title,
  message,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onClose,
  isPending,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClassName?: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                confirmClassName ?? "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isPending ? "Processing..." : confirmLabel}
            </button>
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "category" | "brand";
    id: string;
    name: string;
  } | null>(null);
  const [orderStatusConfirm, setOrderStatusConfirm] = useState<{
    orderId: string;
    status: string;
  } | null>(null);
  const [userRoleConfirm, setUserRoleConfirm] = useState<{
    userId: string;
    name: string;
    role: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = session?.user?.role === "ADMIN";

  // Redirect unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  // Queries
  const { data: dashboardStats, isLoading: statsLoading } = api.admin.getDashboardStats.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = api.admin.getAllProducts.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = api.admin.getAllOrders.useQuery({ limit: 100, offset: 0 }, {
    enabled: status === "authenticated",
  });

  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = api.admin.getAllCategories.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: brands, isLoading: brandsLoading, refetch: refetchBrands } = api.admin.getAllBrands.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = api.admin.getAllUsers.useQuery({ limit: 100, offset: 0 }, {
    enabled: status === "authenticated",
  });

  // Mutations
  const deleteProductMut = api.admin.deleteProduct.useMutation({ onSuccess: () => { void refetchProducts(); setDeleteConfirm(null); } });
  const deleteCategoryMut = api.admin.deleteCategory.useMutation({ onSuccess: () => { void refetchCategories(); setDeleteConfirm(null); } });
  const deleteBrandMut = api.admin.deleteBrand.useMutation({ onSuccess: () => { void refetchBrands(); setDeleteConfirm(null); } });
  const updateOrderStatusMut = api.admin.updateOrderStatus.useMutation({ onSuccess: () => { void refetchOrders(); setOrderStatusConfirm(null); } });
  const updateUserRoleMut = api.admin.updateUserRole.useMutation({ onSuccess: () => { void refetchUsers(); setUserRoleConfirm(null); } });

  const createProductMut = api.admin.createProduct.useMutation({ onSuccess: () => { void refetchProducts(); setShowAddProduct(false); } });
  const updateProductMut = api.admin.updateProduct.useMutation({ onSuccess: () => { void refetchProducts(); setEditingProduct(null); } });
  const createCategoryMut = api.admin.createCategory.useMutation({ onSuccess: () => { void refetchCategories(); setShowAddCategory(false); } });
  const createBrandMut = api.admin.createBrand.useMutation({ onSuccess: () => { void refetchBrands(); setShowAddBrand(false); } });

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "product") deleteProductMut.mutate({ id: deleteConfirm.id });
    else if (deleteConfirm.type === "category") deleteCategoryMut.mutate({ id: deleteConfirm.id });
    else if (deleteConfirm.type === "brand") deleteBrandMut.mutate({ id: deleteConfirm.id });
  };

  const handleConfirmOrderStatus = () => {
    if (!orderStatusConfirm) return;
    updateOrderStatusMut.mutate({
      orderId: orderStatusConfirm.orderId,
      status: orderStatusConfirm.status as any,
    });
  };

  const handleConfirmUserRole = () => {
    if (!userRoleConfirm) return;
    updateUserRoleMut.mutate({
      userId: userRoleConfirm.userId,
      role: userRoleConfirm.role as any,
    });
  };

  const filteredProducts = products?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  const tabs = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as AdminTab, label: "Products", icon: Package },
    { id: "orders" as AdminTab, label: "Orders", icon: ShoppingBag },
    { id: "categories" as AdminTab, label: "Categories", icon: Tags },
    { id: "brands" as AdminTab, label: "Brands", icon: Building2 },
    { id: "users" as AdminTab, label: "Users", icon: Users },
  ];

  const deleting =
    deleteProductMut.isPending || deleteCategoryMut.isPending || deleteBrandMut.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Manage your store</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <div>
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : dashboardStats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">${dashboardStats.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">${dashboardStats.revenueToday.toFixed(2)} today</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Total Orders</span>
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
                    <p className="text-xs text-gray-400 mt-1">{dashboardStats.ordersToday} placed today</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Products</span>
                      <Package className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Users</span>
                      <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Orders by Status
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(dashboardStats.ordersByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[status] ?? ""}`}>
                            {statusIcons[status]}
                            {status}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                      {Object.keys(dashboardStats.ordersByStatus).length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Top Selling Products
                    </h3>
                    <div className="space-y-3">
                      {dashboardStats.topProducts.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                            <span className="text-sm text-gray-700 truncate">{p.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 shrink-0 ml-2">{p.totalSold} sold</span>
                        </div>
                      ))}
                      {dashboardStats.topProducts.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">No sales data yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Orders
                    </h3>
                    <div className="space-y-3">
                      {dashboardStats.recentOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">#{o.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">{o.userName ?? "Unknown"}</p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-sm font-semibold text-gray-900">${o.total.toFixed(2)}</p>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${statusColors[o.status] ?? ""}`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                      {dashboardStats.recentOrders.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">No recent orders</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
                  />
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <ProductForm
                categories={categories ?? []}
                brands={brands ?? []}
                product={null}
                onSave={(data) => createProductMut.mutate(data)}
                onClose={() => setShowAddProduct(false)}
                isSaving={createProductMut.isPending}
              />
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <ProductForm
                categories={categories ?? []}
                brands={brands ?? []}
                product={editingProduct}
                onSave={(data) => updateProductMut.mutate(data)}
                onClose={() => setEditingProduct(null)}
                isSaving={updateProductMut.isPending}
              />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm?.type === "product" && (
              <ConfirmDeleteModal
                title="Delete Product"
                itemName={deleteConfirm.name}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteConfirm(null)}
                isDeleting={deleting}
              />
            )}

            {productsLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Brand</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Price Range</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts?.map((product) => {
                        const localImg = getProductImageUrl(product.slug);
                        const dbImg = product.productImages?.[0]?.url;
                        const totalStock = product.variants.reduce((sum: number, v: any) => sum + v.stock, 0);
                        const prices = product.variants.map((v: any) => Number(v.price));
                        return (
                          <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                  {dbImg ? (
                                    <img src={dbImg} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <img
                                      src={localImg}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                        (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-6 h-6 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>';
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                                  <p className="text-xs text-gray-400">Slug: {product.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{product.category?.name ?? "-"}</td>
                            <td className="px-4 py-3 text-gray-600">{product.brand?.name ?? "-"}</td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-gray-900">
                                ${Math.min(...prices).toFixed(2)}
                                {prices.length > 1 && ` - $${Math.max(...prices).toFixed(2)}`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm ${totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                                {totalStock} units
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                product.isActive ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                              }`}>
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => setEditingProduct(product)}
                                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ type: "product", id: product.id, name: product.name })}
                                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {!isAdmin && (
                                  <span className="text-[10px] text-gray-300">View only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {(!filteredProducts || filteredProducts.length === 0) && (
                  <div className="p-12 text-center text-gray-400 text-sm">
                    {searchQuery ? "No products match your search" : "No products yet"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Orders</h2>

            {/* Order status confirm modal */}
            {orderStatusConfirm && (
              <ConfirmActionModal
                title="Change Order Status"
                message={`Update order #${orderStatusConfirm.orderId.slice(-8).toUpperCase()} to "${orderStatusConfirm.status}"?`}
                confirmLabel="Update Status"
                onConfirm={handleConfirmOrderStatus}
                onClose={() => setOrderStatusConfirm(null)}
                isPending={updateOrderStatusMut.isPending}
              />
            )}

            {ordersLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">#{order.id.slice(-8).toUpperCase()}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] ?? ""}`}>
                            {statusIcons[order.status]}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{order.user?.name ?? "Unknown"} &middot; {order.user?.email ?? ""}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.orderItems.length} items</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.orderItems.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                            {item.productVariant?.product?.productImages?.[0]?.url ? (
                              <img src={item.productVariant.product.productImages[0].url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <img
                                src={getProductImageUrl(item.productVariant?.product?.slug ?? "")}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 truncate">{item.productVariant?.product?.name ?? "Product"}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <p className="text-xs text-gray-400">+{order.orderItems.length - 3} more items</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      {isAdmin ? (
                        <select
                          value={order.status}
                          onChange={(e) => setOrderStatusConfirm({ orderId: order.id, status: e.target.value })}
                          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="DELIVERING">Delivering</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="RETURNING">Returning</option>
                          <option value="RETURNED">Returned</option>
                        </select>
                      ) : (
                        <span className="text-xs font-medium text-gray-600">
                          Status: {order.status}
                        </span>
                      )}
                    </div>

                    {order.address && (
                      <div className="mt-3 text-xs text-gray-400 pt-3 border-t border-gray-50">
                        <span className="font-medium text-gray-500">Deliver to: </span>
                        {order.address.street}, {order.address.city}, {order.address.state} {order.address.postalCode}, {order.address.country}
                      </div>
                    )}
                  </div>
                ))}
                {(!orders || orders.length === 0) && (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">No orders yet</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeTab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              )}
            </div>

            {showAddCategory && (
              <SimpleForm
                title="New Category"
                fields={[
                  { name: "name", label: "Name", type: "text" },
                  { name: "description", label: "Description", type: "text" },
                  { name: "slug", label: "Slug", type: "text" },
                ]}
                onSave={(data) => createCategoryMut.mutate(data as any)}
                onClose={() => setShowAddCategory(false)}
                isSaving={createCategoryMut.isPending}
              />
            )}

            {deleteConfirm?.type === "category" && (
              <ConfirmDeleteModal
                title="Delete Category"
                itemName={deleteConfirm.name}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteConfirm(null)}
                isDeleting={deleting}
              />
            )}

            {categoriesLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories?.map((cat: any) => (
                  <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        {cat._count?.products ?? 0} products
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{cat.description}</p>
                    <p className="text-xs text-gray-400">Slug: {cat.slug}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteConfirm({ type: "category", id: cat.id, name: cat.name })}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== BRANDS ===== */}
        {activeTab === "brands" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddBrand(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Brand
                </button>
              )}
            </div>

            {showAddBrand && (
              <SimpleForm
                title="New Brand"
                fields={[
                  { name: "name", label: "Name", type: "text" },
                  { name: "description", label: "Description", type: "text" },
                  { name: "slug", label: "Slug", type: "text" },
                ]}
                onSave={(data) => createBrandMut.mutate(data as any)}
                onClose={() => setShowAddBrand(false)}
                isSaving={createBrandMut.isPending}
              />
            )}

            {deleteConfirm?.type === "brand" && (
              <ConfirmDeleteModal
                title="Delete Brand"
                itemName={deleteConfirm.name}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteConfirm(null)}
                isDeleting={deleting}
              />
            )}

            {brandsLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands?.map((brand: any) => (
                  <div key={brand.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        {brand._count?.products ?? 0} products
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{brand.description}</p>
                    <p className="text-xs text-gray-400">Slug: {brand.slug}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteConfirm({ type: "brand", id: brand.id, name: brand.name })}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Users</h2>

            {userRoleConfirm && (
              <ConfirmActionModal
                title={userRoleConfirm.role === "ADMIN" ? "Promote to Admin" : "Remove Admin"}
                message={`${userRoleConfirm.role === "ADMIN" ? "Promote" : "Demote"} "${userRoleConfirm.name}" to ${userRoleConfirm.role}?`}
                confirmLabel={userRoleConfirm.role === "ADMIN" ? "Make Admin" : "Remove Admin"}
                confirmClassName={userRoleConfirm.role === "ADMIN" ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-600 text-white hover:bg-gray-700"}
                onConfirm={handleConfirmUserRole}
                onClose={() => setUserRoleConfirm(null)}
                isPending={updateUserRoleMut.isPending}
              />
            )}

            {usersLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Orders</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user: any) => (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {user.image ? (
                                <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900">{user.name ?? "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{maskEmail(user.email)}</td>
                          <td className="px-4 py-3 text-gray-600">{user._count?.orders ?? 0}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "ADMIN" ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-600"
                            }`}>
                              {user.role === "ADMIN" ? <Shield className="w-3 h-3" /> : null}
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {user.role !== "ADMIN" ? (
                              <button
                                onClick={() => isAdmin && setUserRoleConfirm({ userId: user.id, name: user.name ?? "Unknown", role: "ADMIN" })}
                                disabled={!isAdmin}
                                title={!isAdmin ? "Admin only" : "Promote to admin"}
                                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                  isAdmin
                                    ? "text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                                    : "text-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                              >
                                Make Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => isAdmin && setUserRoleConfirm({ userId: user.id, name: user.name ?? "Unknown", role: "USER" })}
                                disabled={!isAdmin}
                                title={!isAdmin ? "Admin only" : "Remove admin role"}
                                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                  isAdmin
                                    ? "text-gray-500 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    : "text-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                              >
                                Remove Admin
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(!users || users.length === 0) && (
                  <div className="p-12 text-center text-gray-400 text-sm">No users found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Product Form Component (Create/Edit) =====
function ProductForm({
  categories,
  brands,
  product,
  onSave,
  onClose,
  isSaving,
}: {
  categories: any[];
  brands: any[];
  product: any | null;
  onSave: (data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const isEdit = product !== null;
  const existingVariant = product?.variants?.[0];

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [price, setPrice] = useState(existingVariant ? String(Number(existingVariant.price)) : "");
  const [stock, setStock] = useState(existingVariant ? String(existingVariant.stock) : "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [imageUrl, setImageUrl] = useState(
    product?.productImages?.[0]?.url ?? (product?.slug ? `/images/catalog/${product.slug}/main.jpg` : "")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSave({
        id: product.id,
        name: name || undefined,
        description: description || undefined,
        slug: slug || undefined,
        categoryId: categoryId || undefined,
        brandId: brandId || undefined,
        isActive,
        isFeatured,
        isBestSeller,
        ...(price ? { salePrice: parseFloat(price) } : {}),
        ...(stock ? { discountPercent: parseInt(stock) } : {}),
      });
    } else {
      onSave({
        name,
        description,
        slug,
        categoryId,
        brandId,
        isActive,
        isFeatured,
        isBestSeller,
        variants: [
          {
            price: parseFloat(price),
            stock: parseInt(stock),
            size: "ONE_SIZE",
          },
        ],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{isEdit ? "Edit Product" : "New Product"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Product Image */}
          {imageUrl && (
            <div className="flex justify-center mb-2">
              <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden relative">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select...</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select...</option>
                {brands.map((brand: any) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={!isEdit}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required={!isEdit}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Best Seller
            </label>
          </div>

          {/* Product Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/catalog/[slug]/main.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-[10px] text-gray-400 mt-1">Default: /images/catalog/{slug ?? "[slug]"}/main.jpg</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== Simple Form Component =====
function SimpleForm({
  title,
  fields,
  onSave,
  onClose,
  isSaving,
}: {
  title: string;
  fields: { name: string; label: string; type: string }[];
  onSave: (data: Record<string, string>) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                value={formData[field.name] ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          ))}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}