const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: options.cache ?? "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export const api = {
  categories: () => apiFetch("/categories/"),
  occasions: () => apiFetch("/occasions/"),
  products: (query = "") => apiFetch(`/products/${query}`),
  product: (slug) => apiFetch(`/products/${slug}/`),
  galleryCategories: () => apiFetch("/gallery-categories/"),
  galleryItems: (query = "") => apiFetch(`/gallery-items/${query}`),
  storeInfo: () => apiFetch("/store-info/"),
  deliveryZones: () => apiFetch("/delivery-zones/"),
  staticPage: (slug) => apiFetch(`/static-pages/${slug}/`),
  checkout: (payload) =>
    apiFetch("/orders/checkout/", { method: "POST", body: JSON.stringify(payload) }),
  customOrderRequest: (payload) =>
    apiFetch("/orders/custom-order-requests/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
