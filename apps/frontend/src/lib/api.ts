import type { ApiResponse } from '@/types/api';
import { isCustomBackendResponse, isBetterAuthResponse } from '@/types/api';

interface ApiRequestOptions {
  body?: Record<string, any>;
  params?: Record<string, string>;
  auth?: boolean;
  headers?: Record<string, string>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const buildUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
  }
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

const makeRequest = async <T>(
  method: string,
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, params, auth = false, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (auth) {
    requestOptions.credentials = 'include';
  }

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(buildUrl(endpoint, params), requestOptions);

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (isCustomBackendResponse<T>(data)) {
      return {
        status: data.status,
        code: data.code,
        data: data.data,
        message: data.message,
        errors: data.errors,
        ok: data.status === 'ok',
        error: data.message,
      };
    }

    if (isBetterAuthResponse<T>(data)) {
      return {
        status: response.ok ? 'ok' : 'error',
        code: response.status,
        data: data as T,
        ok: response.ok,
        error: response.ok ? undefined : 'Request failed',
      };
    }

    if (!data) {
      return {
        status: response.ok ? 'ok' : 'error',
        code: response.status,
        ok: response.ok,
        error: response.ok ? undefined : 'Request failed',
      };
    }

    return {
      status: response.ok ? 'ok' : 'error',
      code: response.status,
      data: data as T,
      ok: response.ok,
      error: response.ok ? undefined : 'Request failed',
    };
  } catch (error) {
    return {
      status: 'error',
      code: 0,
      ok: false,
      error: error instanceof Error ? error.message : 'Network error',
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const api = {
  get: <T>(endpoint: string, options: Omit<ApiRequestOptions, 'body'> = {}) =>
    makeRequest<T>('GET', endpoint, options),

  post: <T>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('POST', endpoint, options),

  put: <T>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('PUT', endpoint, options),

  patch: <T>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('PATCH', endpoint, options),

  delete: <T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ) => makeRequest<T>('DELETE', endpoint, options),
};
