import { handleLocalApiRequest } from './localApiEngine';

export function setupApiInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch.bind(window);

  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' 
      ? input 
      : input instanceof URL 
        ? input.toString() 
        : input.url;

    // Check if request is targeting an API route
    if (urlStr.includes('/api/')) {
      const method = init?.method || 'GET';
      const headers: Record<string, string> = {};

      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((v, k) => { headers[k] = v; });
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([k, v]) => { headers[k] = v; });
        } else {
          Object.assign(headers, init.headers);
        }
      }

      let body = init?.body || null;

      // In Tauri / standalone mode or if relative path, try Express server first if available,
      // but fallback immediately to localApiEngine if server returns HTML (SPA fallback) or network fails.
      try {
        // If Express server is running on port 3000
        const isTauri = !!(window as any).__TAURI_INTERNALS__ || !!(window as any).__TAURI__;
        
        let targetUrl = urlStr;
        if (isTauri && urlStr.startsWith('/api/')) {
          targetUrl = `http://localhost:3000${urlStr}`;
        }

        const networkRes = await originalFetch(targetUrl, init);
        const contentType = networkRes.headers.get('content-type') || '';

        // If the server responded with valid JSON, return the network response directly
        if (networkRes.ok && contentType.includes('application/json')) {
          return networkRes;
        }

        // If server returned 404 HTML (SPA fallback) or HTML page, fallback to embedded API engine
        if (contentType.includes('text/html') || networkRes.status === 404) {
          const localRes = await handleLocalApiRequest(urlStr, method, headers, body);
          return new Response(JSON.stringify(localRes.data), {
            status: localRes.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return networkRes;
      } catch (err) {
        // Network error (e.g. server offline in standalone Tauri app) -> fallback to local API engine
        const localRes = await handleLocalApiRequest(urlStr, method, headers, body);
        return new Response(JSON.stringify(localRes.data), {
          status: localRes.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e1) {
    try {
      Object.defineProperty(Object.getPrototypeOf(window), 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e2) {
      console.warn('[MedOcupa ERP] Could not safely redefine window.fetch:', e2);
    }
  }

  console.log('[MedOcupa ERP] Embedded Local API Interceptor & Engine initialized.');
}
