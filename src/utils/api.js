// Backend bilan ishlash uchun yordamchi funksiyalar.

export const API_URL = import.meta.env.VITE_API_URL;

export const authHeaders = (initData) => ({
  'Authorization': `tma_${initData}`,
  'Content-Type': 'application/json',
});

/**
 * Backend xato javobini odamga o'qiladigan matnga aylantiradi.
 * Javob shakli: {detail: string|object|array, code: string, ...}
 */
export function errorMessage(data, fallback = "Noma'lum xatolik") {
  if (data === null || data === undefined) return fallback;
  if (typeof data === 'string') return data.trim() || fallback;

  const d = data.detail;
  if (typeof d === 'string' && d.trim()) return d;
  if (Array.isArray(d)) {
    const msgs = d
      .map((item) => item?.msg || (item && Object.values(item).join(' ')) || '')
      .filter(Boolean);
    if (msgs.length) return msgs.join('; ');
  }
  if (d && typeof d === 'object') {
    const msgs = Object.values(d).flat().map(String).filter(Boolean);
    if (msgs.length) return msgs.join('; ');
  }
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  return fallback;
}

/** Res (fetch Response) dan xato matnini olib beradi (faqat ochiq javoblar uchun). */
export async function readErrorMessage(res, fallback = "Noma'lum xatolik") {
  try {
    return errorMessage(await res.json(), fallback);
  } catch {
    return fallback;
  }
}

/** Standart so'rov: auth header + xato matnini qaytaradi. */
export async function apiFetch(path, { initData, method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(initData),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(await readErrorMessage(res));
    err.status = res.status;
    throw err;
  }
  return res.json();
}
