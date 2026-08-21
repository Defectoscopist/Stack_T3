import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";

const DEFAULT_API_URL = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;
const ENV_MOBILE_TOKEN = process.env.EXPO_PUBLIC_MOBILE_TOKEN;
const TOKEN_KEY = "shop.mobileToken";
const CART_KEY = "shop.cart";

/**
 * The backend returns relative image paths (e.g. /images/catalog/...). React
 * Native <Image> requires an absolute URL, so we prepend the API origin.
 * Already-absolute URLs (https://...) pass through unchanged.
 */
function resolveImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Swatch colors for variant.color (mirrors web ProductCard.tsx).
const colorMap: Record<string, string> = {
  "White/Black": "#e5e7eb",
  "Red/White": "#ef4444",
  Black: "#1f2937",
  White: "#f9fafb",
  "White/Blue": "#3b82f6",
  "Black/Green": "#22c55e",
  "White/Gold": "#fbbf24",
  "Black/Silver": "#6b7280",
  "Navy/Red": "#1e40af",
  Silver: "#d1d5db",
  "Grey/Blue": "#64748b",
  Purple: "#a855f7",
  "Gold/Black": "#f59e0b",
  Grey: "#9ca3af",
  Blue: "#3b82f6",
  Red: "#ef4444",
  Navy: "#1e3a5f",
  Green: "#22c55e",
  Pink: "#ec4899",
  "Grey Mix": "#a3a3a3",
  Olive: "#808000",
  Khaki: "#c3b091",
  Beige: "#f5f5dc",
  Brown: "#8b4513",
  "Dark Blue": "#1e3a8a",
  Yellow: "#eab308",
  Orange: "#f97316",
  "Multi-color": "#6366f1",
  "Black/Red": "#991b1b",
  "Red/Black": "#b91c1c",
  Multi: "#8b5cf6",
};

function getSwatchColor(color: string | null): string {
  if (!color) return "#ccc";
  const normalized = color.trim();
  if (colorMap[normalized]) return colorMap[normalized];
  const lower = normalized.toLowerCase();
  if (colorMap[lower]) return colorMap[lower];
  return lower;
}

/** Distinct colors across a product's variants, preserving order. */
function getColorOptions(
  variants: { color: string | null }[],
): (string | null)[] {
  const seen = new Set<string>();
  const colors: (string | null)[] = [];
  for (const v of variants) {
    const key = v.color ?? "\u0000none";
    if (seen.has(key)) continue;
    seen.add(key);
    colors.push(v.color);
  }
  return colors;
}

type Product = {
  id: string;
  name: string;
  description: string;
  salePrice: number | null;
  originalPrice: number | null;
  discountPercent: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  imagesUrl: string[];
  variants: { id: string; price: number; stock: number; color: string | null; size: string }[];
  averageRating: number;
  category?: { name: string };
};

type Order = {
  id: string;
  status: string;
  paymentStatus?: string;
  total: string | number;
  createdAt: string;
  orderItems: { quantity: number }[];
};

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
};

type Tab = "catalog" | "orders" | "cart" | "profile";

type CartItem = {
  product: Product;
  variantId: string;
  quantity: number;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

const emptyCheckoutForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

async function readStoredToken() {
  if (Platform.OS === "web") return globalThis.localStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function storeToken(token: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

async function removeStoredToken() {
  if (Platform.OS === "web") {
    globalThis.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [mobileToken, setMobileToken] = useState<string | null>(ENV_MOBILE_TOKEN ?? null);
  const [tokenInput, setTokenInput] = useState(ENV_MOBILE_TOKEN ?? "");
  const [tokenReady, setTokenReady] = useState(Boolean(ENV_MOBILE_TOKEN));
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("catalog");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/mobile/products?limit=20`, {
        headers: mobileToken ? { Authorization: `Bearer ${mobileToken}` } : {},
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = (await response.json()) as { products: Product[] };
      setProducts(data.products);
    } catch {
      setError("Не удалось загрузить каталог. Проверь адрес API и соединение.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mobileToken]);

  const loadOrders = useCallback(async () => {
    if (!mobileToken) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/mobile/orders?limit=20`, {
        headers: { Authorization: `Bearer ${mobileToken}` },
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = (await response.json()) as { orders: Order[] };
      setOrders(data.orders);
    } catch {
      setError("Не удалось загрузить заказы. Проверь авторизацию и соединение.");
    }
  }, [mobileToken]);

  const cancelOrder = async (orderId: string) => {
    if (!mobileToken) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/mobile/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${mobileToken}` },
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Order cancellation failed");
      await loadOrders();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Не удалось отменить заказ.");
    }
  };

  const loadProfile = useCallback(async () => {
    if (!mobileToken) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/mobile/profile`, {
        headers: { Authorization: `Bearer ${mobileToken}` },
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = (await response.json()) as { user: Profile };
      setProfile(data.user);
    } catch {
      setError("Не удалось загрузить профиль. Проверь авторизацию и соединение.");
    }
  }, [mobileToken]);

  useEffect(() => {
    if (ENV_MOBILE_TOKEN) return;
    void readStoredToken().then((storedToken) => {
      if (storedToken) {
        setMobileToken(storedToken);
        setTokenInput(storedToken);
      }
      setTokenReady(true);
    });
  }, []);

  useEffect(() => {
    if (tokenReady && mobileToken) void loadProducts();
  }, [loadProducts, mobileToken, tokenReady]);

  useEffect(() => {
    void AsyncStorage.getItem(CART_KEY).then((storedCart) => {
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart) as CartItem[]);
        } catch {
          void AsyncStorage.removeItem(CART_KEY);
        }
      }
      setCartReady(true);
    });
  }, []);

  useEffect(() => {
    if (cartReady) void AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  const refresh = () => {
    setRefreshing(true);
    const refreshRequest = tab === "catalog" ? loadProducts() : tab === "orders" ? loadOrders() : tab === "profile" ? loadProfile() : Promise.resolve();
    void refreshRequest.finally(() => setRefreshing(false));
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedVariantId) return;
    setCart((current) => {
      const existing = current.find((item) => item.variantId === selectedVariantId);
      if (existing) {
        return current.map((item) => item.variantId === selectedVariantId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.product.variants.find((variant) => variant.id === selectedVariantId)?.stock ?? item.quantity) }
          : item);
      }
      return [...current, { product: selectedProduct, variantId: selectedVariantId, quantity: 1 }];
    });
    setSelectedProduct(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
    return sum + (variant?.price ?? 0) * item.quantity;
  }, 0);

  const updateCartQuantity = (variantId: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.variantId !== variantId) return [item];
      const stock = item.product.variants.find((variant) => variant.id === variantId)?.stock ?? item.quantity;
      const quantity = Math.min(Math.max(item.quantity + delta, 0), stock);
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const updateCheckoutField = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm((current) => ({ ...current, [field]: value }));
  };

  const submitCheckout = async () => {
    if (!mobileToken || cart.length === 0) {
      setCheckoutMessage("Для оформления нужен mobile token и непустая корзина.");
      return;
    }
    const missingField = (Object.keys(emptyCheckoutForm) as (keyof CheckoutForm)[])
      .find((field) => !checkoutForm[field].trim());
    if (missingField) {
      setCheckoutMessage("Заполни все поля доставки.");
      return;
    }
    if (checkoutForm.postalCode.trim().length < 5) {
      setCheckoutMessage("Индекс должен содержать минимум 5 символов.");
      return;
    }
    if (checkoutForm.phone.replace(/\D/g, "").length < 10) {
      setCheckoutMessage("Телефон должен содержать минимум 10 цифр.");
      return;
    }
    setPlacingOrder(true);
    setCheckoutMessage(null);
    try {
      const response = await fetch(`${API_URL}/api/mobile/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mobileToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutForm,
          items: cart.map((item) => ({ productVariantId: item.variantId, quantity: item.quantity })),
        }),
      });
      const data = (await response.json()) as { error?: string; simulated?: boolean; order?: { id: string } };
      if (!response.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.simulated && data.order?.id) {
        const confirmation = await fetch(`${API_URL}/api/mobile/orders/${data.order.id}/confirm`, {
          method: "POST",
          headers: { Authorization: `Bearer ${mobileToken}` },
        });
        if (!confirmation.ok) {
          const confirmationData = (await confirmation.json()) as { error?: string };
          throw new Error(confirmationData.error ?? "Payment confirmation failed");
        }
      }
      setCart([]);
      setCheckoutOpen(false);
      setCheckoutForm(emptyCheckoutForm);
      setCheckoutMessage(data.simulated ? "Заказ оплачен в demo-режиме." : "Заказ создан. Ожидаем оплату.");
      setTab("orders");
      void loadOrders();
    } catch (checkoutError) {
      setCheckoutMessage(checkoutError instanceof Error ? checkoutError.message : "Не удалось оформить заказ.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const disconnect = async () => {
    if (ENV_MOBILE_TOKEN) {
      setTokenError("При запуске через EXPO_PUBLIC_MOBILE_TOKEN отключение управляется env.");
      return;
    }
    await removeStoredToken();
    setMobileToken(null);
    setTokenInput("");
    setTokenReady(true);
    setProducts([]);
    setOrders([]);
    setCart([]);
    await AsyncStorage.removeItem(CART_KEY);
    setTab("catalog");
  };

  const connectToken = async () => {
    const nextToken = tokenInput.trim();
    if (!nextToken) {
      setTokenError("Вставь Bearer-токен, чтобы открыть каталог.");
      return;
    }
    setTokenError(null);
    try {
      const response = await fetch(`${API_URL}/api/mobile/products?limit=1`, {
        headers: { Authorization: `Bearer ${nextToken}` },
      });
      if (!response.ok) throw new Error("Token rejected");
      await storeToken(nextToken);
      setMobileToken(nextToken);
    } catch {
      setTokenError("Токен не принят. Проверь его и адрес API.");
    }
  };

  if (!tokenReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#d96b3b" size="large" />
        <Text style={styles.muted}>Проверяем сессию</Text>
      </View>
    );
  }

  if (!mobileToken) {
    return (
      <View style={styles.authScreen}>
        <StatusBar style="light" />
        <Text style={styles.kicker}>SHOP / MOBILE</Text>
        <Text style={styles.authTitle}>Открой свою коллекцию</Text>
        <Text style={styles.authDescription}>Вставь mobile Bearer-токен, чтобы подключить каталог и заказы.</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setTokenInput}
          placeholder="Bearer token"
          placeholderTextColor="#8b877e"
          secureTextEntry
          style={styles.input}
          value={tokenInput}
        />
        {tokenError ? <Text style={styles.formMessage}>{tokenError}</Text> : null}
        <Pressable onPress={connectToken} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Подключить</Text>
        </Pressable>
        <Text style={styles.authHint}>Токен хранится локально в SecureStore.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#d96b3b" size="large" />
        <Text style={styles.muted}>Загружаем коллекцию</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.kicker}>SHOP / MOBILE</Text>
        <Text style={styles.title}>Новая форма движения</Text>
        <Text style={styles.subtitle}>Подборка одежды и экипировки на каждый день.</Text>
      </View>

      {selectedProduct ? (
        <FlatList
          contentContainerStyle={styles.detail}
          data={[selectedProduct]}
          keyExtractor={(product) => product.id}
          renderItem={({ item }) => {
            const colorOptions = getColorOptions(item.variants);
            // Active color: user choice, else the first color with stock.
            const activeColor =
              selectedColor ??
              item.variants.find((v) => v.color && v.stock > 0)?.color ??
              item.variants[0]?.color ??
              null;
            // Sizes/stock for the active color only.
            const colorVariants = activeColor
              ? item.variants.filter((v) => v.color === activeColor)
              : item.variants;
            const selectedVariant =
              item.variants.find((variant) => variant.id === selectedVariantId) ??
              colorVariants.find((v) => v.stock > 0) ??
              colorVariants[0];
            const hasStock = item.variants.some((v) => v.stock > 0);
            const lowestPrice = Math.min(...item.variants.map((v) => v.price));
            const displayPrice =
              item.isOnSale && item.salePrice ? item.salePrice : lowestPrice;
            const originalPrice =
              item.isOnSale && item.originalPrice
                ? item.originalPrice
                : lowestPrice;
            const pickColor = (color: string | null) => {
              setSelectedColor(color);
              const firstInColor = item.variants.find((v) => v.color === color && v.stock > 0) ?? item.variants.find((v) => v.color === color);
              setSelectedVariantId(firstInColor?.id ?? null);
            };
            return (
              <View>
                <Pressable onPress={() => setSelectedProduct(null)} style={styles.backButton}>
                  <Text style={styles.backText}>← Каталог</Text>
                </Pressable>
                {resolveImageUrl(item.imagesUrl[0]) ? <Image source={{ uri: resolveImageUrl(item.imagesUrl[0])! }} style={styles.detailImage} /> : <View style={styles.detailImage} />}
                {item.isFeatured || item.isBestSeller ? (
                  <View style={styles.badgeRow}>
                    {item.isFeatured ? <Text style={styles.featuredBadge}>Featured</Text> : null}
                    {item.isBestSeller ? <Text style={styles.bestsellerBadge}>Best Seller</Text> : null}
                  </View>
                ) : null}
                <Text style={styles.detailKicker}>{item.category?.name ?? "SHOP EDIT"}</Text>
                <Text style={styles.detailTitle}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${displayPrice.toFixed(2)}</Text>
                  {item.isOnSale && originalPrice > displayPrice ? (
                    <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
                  ) : null}
                  {item.isOnSale && item.discountPercent ? (
                    <Text style={styles.saleBadge}>-{item.discountPercent}%</Text>
                  ) : null}
                </View>
                {colorOptions.length > 0 ? (
                  <>
                    <Text style={styles.optionLabel}>Цвет</Text>
                    <View style={styles.colorList}>
                      {colorOptions.map((color) => (
                        <Pressable
                          key={color ?? "none"}
                          onPress={() => pickColor(color)}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: getSwatchColor(color) },
                            activeColor === color && styles.colorSwatchSelected,
                          ]}
                        >
                          <Text style={styles.colorSwatchText}>{color ?? "—"}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                ) : null}
                <Text style={styles.optionLabel}>Размер</Text>
                <View style={styles.variantList}>
                  {colorVariants.map((variant) => (
                    <Pressable key={variant.id} disabled={variant.stock < 1} onPress={() => setSelectedVariantId(variant.id)} style={[styles.variant, selectedVariant?.id === variant.id && styles.selectedVariant, variant.stock < 1 && styles.disabledVariant]}>
                      <Text style={[styles.variantText, selectedVariant?.id === variant.id && styles.selectedVariantText]}>{variant.size}{variant.stock < 1 ? " (нет)" : ""}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable disabled={!selectedVariant || selectedVariant.stock < 1 || !hasStock} onPress={addToCart} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>{!hasStock ? "Нет в наличии" : selectedVariant?.stock ? "Добавить в корзину" : "Нет в наличии"}</Text>
                </Pressable>
              </View>
            );
          }}
        />
      ) : null}

      {checkoutOpen && !selectedProduct ? (
        <ScrollView contentContainerStyle={styles.checkoutForm}>
          <Pressable onPress={() => setCheckoutOpen(false)} style={styles.backButton}>
            <Text style={styles.backText}>← Корзина</Text>
          </Pressable>
          <Text style={styles.detailKicker}>CHECKOUT</Text>
          <Text style={styles.detailTitle}>Куда отправить заказ?</Text>
          <Text style={styles.description}>Итого к оплате: ${cartTotal.toFixed(2)}</Text>
          {(Object.keys(emptyCheckoutForm) as (keyof CheckoutForm)[]).map((field) => (
            <TextInput
              key={field}
              autoCapitalize="words"
              keyboardType={field === "phone" ? "phone-pad" : "default"}
              onChangeText={(value) => updateCheckoutField(field, value)}
              placeholder={{ firstName: "Имя", lastName: "Фамилия", street: "Адрес", city: "Город", state: "Регион", postalCode: "Индекс", country: "Страна", phone: "Телефон" }[field]}
              placeholderTextColor="#8b877e"
              style={styles.input}
              value={checkoutForm[field]}
            />
          ))}
          {checkoutMessage ? <Text style={styles.formMessage}>{checkoutMessage}</Text> : null}
          <Pressable disabled={placingOrder} onPress={submitCheckout} style={styles.primaryButton}>
            {placingOrder ? <ActivityIndicator color="#fff8ed" /> : <Text style={styles.primaryButtonText}>Подтвердить заказ</Text>}
          </Pressable>
        </ScrollView>
      ) : null}

      {!selectedProduct && !checkoutOpen ? <View style={styles.tabs}>
        <Pressable onPress={() => setTab("catalog")} style={[styles.tab, tab === "catalog" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "catalog" && styles.activeTabText]}>Каталог</Text>
        </Pressable>
        <Pressable onPress={() => { setTab("orders"); void loadOrders(); }} style={[styles.tab, tab === "orders" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "orders" && styles.activeTabText]}>Заказы</Text>
        </Pressable>
        <Pressable onPress={() => setTab("cart")} style={[styles.tab, tab === "cart" && styles.cartTab]}>
          <Text style={[styles.tabText, tab === "cart" && styles.cartTabText]}>Корзина {cartCount ? `(${cartCount})` : ""}</Text>
        </Pressable>
        <Pressable onPress={() => { setTab("profile"); void loadProfile(); }} style={[styles.tab, tab === "profile" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "profile" && styles.activeTabText]}>Профиль</Text>
        </Pressable>
      </View> : null}

      {error && !checkoutOpen ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={loadProducts} style={styles.retryButton}>
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}

      {!selectedProduct && !checkoutOpen && tab === "catalog" ? <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(product) => product.id}
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={refreshing} tintColor="#d96b3b" />}
        renderItem={({ item }) => {
          const price = item.salePrice ?? item.variants[0]?.price ?? 0;
          const image = item.imagesUrl[0];
          return (
            <Pressable onPress={() => { setSelectedProduct(item); setSelectedVariantId(item.variants[0]?.id ?? null); }} style={styles.product}>
              {image ? <Image source={{ uri: resolveImageUrl(image)! }} style={styles.productImage} /> : <View style={styles.imagePlaceholder} />}
              <View style={styles.productBody}>
                <View style={styles.productHeading}>
                  <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                  <Text style={styles.rating}>{item.averageRating ? `${item.averageRating.toFixed(1)} *` : "NEW"}</Text>
                </View>
                <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.muted}>Каталог пока пуст.</Text>}
      /> : !selectedProduct && !checkoutOpen && tab === "orders" ? <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(order) => order.id}
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={refreshing} tintColor="#d96b3b" />}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <View style={styles.productHeading}>
              <Text style={styles.productName}>Заказ #{item.id.slice(-6)}</Text>
              <Text style={styles.orderStatus}>{item.status}</Text>
            </View>
            <Text style={styles.description}>{new Date(item.createdAt).toLocaleDateString("ru-RU")}</Text>
            <Text style={styles.price}>${Number(item.total).toFixed(2)}</Text>
            <Text style={styles.description}>{item.orderItems.reduce((sum, orderItem) => sum + orderItem.quantity, 0)} товара</Text>
            {item.paymentStatus === "PENDING_PAYMENT" || item.status === "PAID" ? (
              <Pressable onPress={() => void cancelOrder(item.id)} style={styles.cancelOrderButton}>
                <Text style={styles.removeButtonText}>Отменить заказ</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>Заказов пока нет.</Text>}
      /> : !selectedProduct && !checkoutOpen && tab === "cart" ? <FlatList
        contentContainerStyle={styles.list}
        data={cart}
        keyExtractor={(item) => item.variantId}
        renderItem={({ item }) => {
          const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
          return <View style={styles.cartItem}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.description}>{variant?.size ?? "ONE_SIZE"} · {item.quantity} шт.</Text>
            <Text style={styles.price}>${((variant?.price ?? 0) * item.quantity).toFixed(2)}</Text>
            <View style={styles.quantityRow}>
              <Pressable onPress={() => updateCartQuantity(item.variantId, -1)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </Pressable>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
              <Pressable onPress={() => updateCartQuantity(item.variantId, 1)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
              <Pressable onPress={() => updateCartQuantity(item.variantId, -item.quantity)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Удалить</Text>
              </Pressable>
            </View>
          </View>;
        }}
        ListEmptyComponent={<Text style={styles.muted}>Корзина пуста.</Text>}
        ListFooterComponent={cart.length > 0 ? <View style={styles.checkoutBar}><Text style={styles.price}>Итого ${cartTotal.toFixed(2)}</Text><Pressable onPress={() => { setCheckoutMessage(null); setCheckoutOpen(true); }} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Перейти к оформлению</Text></Pressable></View> : null}
      /> : !selectedProduct && !checkoutOpen && tab === "profile" ? <ScrollView contentContainerStyle={styles.profile}>
        <Text style={styles.detailKicker}>ACCOUNT</Text>
        <Text style={styles.detailTitle}>Твой SHOP</Text>
        <View style={styles.profilePanel}>
          <Text style={styles.profileLabel}>Состояние подключения</Text>
          <Text style={styles.profileValue}>{profile?.name ?? "Покупатель"}</Text>
          <Text style={styles.description}>{profile?.email ?? "Email не указан"}</Text>
          <Text style={styles.description}>Роль: {profile?.role ?? "USER"}</Text>
          <Text style={styles.description}>Каталог, заказы и checkout используют одну mobile-сессию.</Text>
        </View>
        <Pressable onPress={() => void disconnect()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Отключить токен</Text>
        </Pressable>
      </ScrollView> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4efe7",
  },
  header: {
    backgroundColor: "#172a27",
    paddingHorizontal: 22,
    paddingTop: 64,
    paddingBottom: 28,
  },
  tabs: {
    backgroundColor: "#172a27",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  tab: {
    borderColor: "#49605a",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  activeTab: {
    backgroundColor: "#e9a36d",
    borderColor: "#e9a36d",
  },
  tabText: {
    color: "#c5d0c7",
    fontSize: 14,
    fontWeight: "700",
  },
  activeTabText: {
    color: "#172a27",
  },
  cartTab: {
    backgroundColor: "#fff8ed",
    borderColor: "#fff8ed",
  },
  cartTabText: {
    color: "#172a27",
  },
  kicker: {
    color: "#e9a36d",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: "#fff8ed",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12,
  },
  subtitle: {
    color: "#c5d0c7",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  list: {
    gap: 14,
    padding: 16,
    paddingBottom: 28,
  },
  detail: {
    padding: 16,
    paddingBottom: 32,
  },
  checkoutForm: {
    padding: 16,
    paddingBottom: 32,
  },
  profile: {
    padding: 16,
    paddingBottom: 32,
  },
  profilePanel: {
    backgroundColor: "#fffaf2",
    borderColor: "#e4d9ca",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 22,
    padding: 18,
  },
  profileLabel: {
    color: "#6e716b",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  profileValue: {
    color: "#172a27",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#b65c37",
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: "#b65c37",
    fontSize: 15,
    fontWeight: "800",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingBottom: 14,
  },
  backText: {
    color: "#b65c37",
    fontSize: 15,
    fontWeight: "700",
  },
  detailImage: {
    backgroundColor: "#e7ded2",
    borderRadius: 8,
    height: 300,
    width: "100%",
  },
  detailKicker: {
    color: "#b65c37",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 20,
    textTransform: "uppercase",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  featuredBadge: {
    backgroundColor: "#172a27",
    borderRadius: 6,
    color: "#fff8ed",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  bestsellerBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 6,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  detailTitle: {
    color: "#172a27",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 8,
  },
  optionLabel: {
    color: "#172a27",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 24,
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  originalPrice: {
    color: "#8a8a86",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "line-through",
  },
  saleBadge: {
    backgroundColor: "#22c55e",
    borderRadius: 6,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  colorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  colorSwatch: {
    alignItems: "center",
    borderColor: "#c9bdae",
    borderWidth: 1,
    justifyContent: "center",
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  colorSwatchSelected: {
    borderColor: "#172a27",
    borderWidth: 2,
  },
  colorSwatchText: {
    color: "#172a27",
    fontSize: 13,
    fontWeight: "700",
  },
  variantList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  variant: {
    borderColor: "#c9bdae",
    borderWidth: 1,
    minWidth: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedVariant: {
    backgroundColor: "#172a27",
    borderColor: "#172a27",
  },
  disabledVariant: {
    opacity: 0.35,
  },
  variantText: {
    color: "#172a27",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  selectedVariantText: {
    color: "#fff8ed",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#b65c37",
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#fff8ed",
    fontSize: 15,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#fffaf2",
    borderColor: "#d8ccbd",
    borderRadius: 6,
    borderWidth: 1,
    color: "#172a27",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  formMessage: {
    color: "#7d3020",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  cartItem: {
    backgroundColor: "#fffaf2",
    borderColor: "#e4d9ca",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  quantityRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  quantityButton: {
    alignItems: "center",
    borderColor: "#c9bdae",
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  quantityButtonText: {
    color: "#172a27",
    fontSize: 18,
    fontWeight: "700",
  },
  quantityValue: {
    color: "#172a27",
    fontSize: 15,
    fontWeight: "800",
    minWidth: 18,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: "auto",
    paddingVertical: 8,
  },
  removeButtonText: {
    color: "#b65c37",
    fontSize: 13,
    fontWeight: "700",
  },
  cancelOrderButton: {
    alignSelf: "flex-start",
    borderColor: "#d8ccbd",
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkoutBar: {
    paddingTop: 8,
  },
  product: {
    backgroundColor: "#fffaf2",
    borderColor: "#e4d9ca",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  order: {
    backgroundColor: "#fffaf2",
    borderColor: "#e4d9ca",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  orderStatus: {
    color: "#b65c37",
    fontSize: 12,
    fontWeight: "800",
  },
  productImage: {
    backgroundColor: "#e7ded2",
    height: 210,
    width: "100%",
  },
  imagePlaceholder: {
    backgroundColor: "#e7ded2",
    height: 210,
  },
  productBody: {
    padding: 16,
  },
  productHeading: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  productName: {
    color: "#172a27",
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
  },
  rating: {
    color: "#b65c37",
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    color: "#6e716b",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },
  price: {
    color: "#172a27",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#f4efe7",
    flex: 1,
    justifyContent: "center",
  },
  authScreen: {
    backgroundColor: "#172a27",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  authTitle: {
    color: "#fff8ed",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 16,
  },
  authDescription: {
    color: "#c5d0c7",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  authHint: {
    color: "#8da198",
    fontSize: 13,
    marginTop: 18,
    textAlign: "center",
  },
  muted: {
    color: "#6e716b",
    fontSize: 15,
    marginTop: 12,
  },
  errorBox: {
    backgroundColor: "#f8ddd0",
    margin: 16,
    padding: 14,
  },
  errorText: {
    color: "#7d3020",
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#b65c37",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryText: {
    color: "#fff8ed",
    fontWeight: "700",
  },
});
