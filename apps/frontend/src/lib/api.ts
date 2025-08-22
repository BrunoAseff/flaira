interface ApiRequestOptions {
  body?: Record<string, any>;
  params?: Record<string, string>;
  auth?: boolean;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
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

const makeRequest = async <T = any>(
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

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? data?.data : undefined,
      error: response.ok ? undefined : data?.message || 'Request failed',
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const api = {
  get: <T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ) => makeRequest<T>('GET', endpoint, options),

  post: <T = any>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('POST', endpoint, options),

  put: <T = any>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('PUT', endpoint, options),

  patch: <T = any>(endpoint: string, options: ApiRequestOptions = {}) =>
    makeRequest<T>('PATCH', endpoint, options),

  delete: <T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ) => makeRequest<T>('DELETE', endpoint, options),
};
