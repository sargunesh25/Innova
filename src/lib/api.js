const JSON_HEADERS = {
  Accept: 'application/json',
};

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });

  const body = await parseBody(response);

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body?.message || body?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export const api = {
  get: (path) => request(path),
  post: (path, data, options = {}) => request(path, { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  patch: (path, data, options = {}) => request(path, { method: 'PATCH', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  put: (path, data, options = {}) => request(path, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  del: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
};

export function withQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || Number.isNaN(value)) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          query.append(key, item);
        }
      });
      return;
    }
    query.append(key, value);
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}
