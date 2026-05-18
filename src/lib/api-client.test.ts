import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApi } from './api-client';

describe('fetchApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ── Tests básicos (comportamiento original) ─────────────────────────────

  it('should call fetch with the given endpoint and default options', async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const result = await fetchApi('/api/test');

    expect(fetchSpy).toHaveBeenCalledWith('/api/test', {
      cache: 'no-store',
      headers: expect.any(Headers),
    });
    expect(result).toBe(mockResponse);
  });

  it('should set Content-Type to application/json when body is present and no Content-Type is set', async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/test', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });

    const calledHeaders = vi.mocked(global.fetch).mock.calls[0][1]
      ?.headers as Headers;
    expect(calledHeaders.get('Content-Type')).toBe('application/json');
  });

  it('should NOT override Content-Type if already set by the caller', async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/upload', {
      method: 'POST',
      body: 'raw-body',
      headers: { 'Content-Type': 'text/plain' },
    });

    const calledHeaders = vi.mocked(global.fetch).mock.calls[0][1]
      ?.headers as Headers;
    expect(calledHeaders.get('Content-Type')).toBe('text/plain');
  });

  it('should NOT set Content-Type when there is no body', async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/data');

    const calledHeaders = vi.mocked(global.fetch).mock.calls[0][1]
      ?.headers as Headers;
    expect(calledHeaders.has('Content-Type')).toBe(false);
  });

  it('should merge custom options with defaults (cache: no-store)', async () => {
    const mockResponse = { ok: true, status: 200 } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/test', { method: 'DELETE' });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      cache: 'no-store',
      method: 'DELETE',
      headers: expect.any(Headers),
    });
  });

  // ── Tests de retry con refresh de token ─────────────────────────────────

  it('should refresh token and retry on 401 for non-auth endpoints', async () => {
    const successResponse = { ok: true, status: 200 } as Response;

    vi.spyOn(global, 'fetch')
      // 1ra llamada: petición original → 401
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response)
      // 2da llamada: POST /api/auth/refresh → 200
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response)
      // 3ra llamada: retry de la petición original → 200
      .mockResolvedValueOnce(successResponse);

    const result = await fetchApi('/api/proveedores');

    expect(result).toBe(successResponse);
    expect(global.fetch).toHaveBeenCalledTimes(3);

    // Verificar que la 2da llamada fue al endpoint de refresh
    const secondCall = vi.mocked(global.fetch).mock.calls[1];
    expect(secondCall[0]).toBe('/api/auth/refresh');
    expect((secondCall[1] as RequestInit).method).toBe('POST');
  });

  it('should dispatch session-expired if refresh fails', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    vi.spyOn(global, 'fetch')
      // 1ra llamada: petición original → 401
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response)
      // 2da llamada: POST /api/auth/refresh → 401 (falla)
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response);

    const result = await fetchApi('/api/proveedores');

    expect(result.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'session-expired' })
    );
  });

  it('should NOT retry on 401 for auth endpoints (login)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test', password: 'test' }),
    });

    // Solo 1 llamada: no intenta refresh
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on 401 for auth endpoints (logout)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await fetchApi('/api/auth/logout', { method: 'POST' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on 401 for auth endpoints (refresh)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await fetchApi('/api/auth/refresh', { method: 'POST' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return response directly for non-401 errors', async () => {
    const errorResponse = { ok: false, status: 500 } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(errorResponse);

    const result = await fetchApi('/api/proveedores');

    expect(result).toBe(errorResponse);
    // Solo 1 llamada: no intenta refresh para 500
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should queue concurrent refresh attempts (only one refresh call)', async () => {
    let refreshCallCount = 0;

    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url === '/api/auth/refresh') {
        refreshCallCount++;
        // Simular latencia del refresh
        await new Promise((r) => setTimeout(r, 50));
        return { ok: true, status: 200 } as Response;
      }

      // Primera llamada a cualquier endpoint retorna 401,
      // las siguientes retornan 200 (post-refresh)
      if (refreshCallCount === 0) {
        return { ok: false, status: 401 } as Response;
      }
      return { ok: true, status: 200 } as Response;
    });

    // Lanzar 3 peticiones simultáneas que todas recibirán 401
    const results = await Promise.all([
      fetchApi('/api/proveedores'),
      fetchApi('/api/usuarios'),
      fetchApi('/api/compliance'),
    ]);

    // Todas deben haber tenido éxito después del refresh
    results.forEach((r) => expect(r.ok).toBe(true));

    // Solo debe haberse hecho UN refresh, no tres
    expect(refreshCallCount).toBe(1);
  });
});
