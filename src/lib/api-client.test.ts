import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApi } from './api-client';

describe('fetchApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call fetch with the given endpoint and default options', async () => {
    const mockResponse = { ok: true } as Response;
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const result = await fetchApi('/api/test');

    expect(fetchSpy).toHaveBeenCalledWith('/api/test', {
      cache: 'no-store',
      headers: expect.any(Headers),
    });
    expect(result).toBe(mockResponse);
  });

  it('should set Content-Type to application/json when body is present and no Content-Type is set', async () => {
    const mockResponse = { ok: true } as Response;
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
    const mockResponse = { ok: true } as Response;
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
    const mockResponse = { ok: true } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/data');

    const calledHeaders = vi.mocked(global.fetch).mock.calls[0][1]
      ?.headers as Headers;
    expect(calledHeaders.has('Content-Type')).toBe(false);
  });

  it('should merge custom options with defaults (cache: no-store)', async () => {
    const mockResponse = { ok: true } as Response;
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await fetchApi('/api/test', { method: 'DELETE' });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      cache: 'no-store',
      method: 'DELETE',
      headers: expect.any(Headers),
    });
  });
});
