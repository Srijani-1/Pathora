const API_BASE_URL = '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Ensure endpoint starts with / if it doesn't, but avoid //
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Something went wrong');
    }

    return response.json();
}
