const API_BASE_URL = '/api';

// Fast in-memory cache for public GET requests to eliminate latency
const clientCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute client-side cache

export function clearClientCache() {
  clientCache.clear();
}

/**
 * Universal API Request Handler
 */
export async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('rh_token');
  const isAdminContext = (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) || Boolean(token) || Boolean(options.bypassCache);

  // Clear client cache on any modifying mutation (POST, PUT, DELETE)
  if (method !== 'GET') {
    clientCache.clear();
  }

  // Check client cache for GET requests ONLY on public, unauthenticated routes
  const isPublicGet = method === 'GET' && !isAdminContext;
  if (isPublicGet) {
    const cached = clientCache.get(endpoint);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isAdminContext && {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'x-admin-request': '1'
    }),
    ...options.headers
  };

  // If body is FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const timeoutMs = options.timeout || (method === 'POST' && options.body instanceof FormData ? 60000 : 35000);
  let signal = options.signal;
  let timeoutId = null;
  if (!signal) {
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      signal = AbortSignal.timeout(timeoutMs);
    } else if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      signal = controller.signal;
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }
  }

  const config = {
    ...options,
    headers,
    signal,
    ...(isAdminContext ? { cache: 'no-store' } : {})
  };

  let finalEndpoint = endpoint;
  if (isAdminContext && method === 'GET') {
    const separator = finalEndpoint.includes('?') ? '&' : '?';
    finalEndpoint = `${finalEndpoint}${separator}_t=${Date.now()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${finalEndpoint}`, config);

    // Handle session expiry
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('rh_token');
      localStorage.removeItem('rh_user');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      throw new Error('Your session has expired or authentication is required. Please log in again.');
    }

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Failed to parse server response as JSON');
      }
    } else {
      const rawText = await response.text();
      if (!response.ok) {
        // Strip HTML tags if server returned an HTML error page
        const stripped = rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        throw new Error(stripped ? `Server error (${response.status}): ${stripped.slice(0, 150)}` : `Server error with HTTP ${response.status}`);
      }
      data = { success: true, text: rawText };
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    // Save to client cache
    if (isPublicGet) {
      clientCache.set(endpoint, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS
      });
    }

    return data;
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      const timeoutError = new Error('The server took too long to respond (request timed out). Please check your connection and try again.');
      console.error(`API Timeout [${endpoint}]:`, timeoutError.message);
      throw timeoutError;
    }
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export default apiRequest;
