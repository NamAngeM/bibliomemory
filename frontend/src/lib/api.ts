import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for auth endpoints to avoid loops
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/register');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);
                }
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Redirect based on current path
                if (typeof window !== 'undefined') {
                    const path = window.location.pathname;
                    if (path.includes('/establishment')) {
                        window.location.href = '/establishment/login';
                    } else if (path.includes('/student')) {
                        window.location.href = '/student/login';
                    } else if (!path.includes('/login')) {
                        // window.location.href = '/admin/login'; // Désactivé temporairement
                    }
                }
            }
        }

        // If it's a 401 on a non-auth endpoint and we either failed refresh or had no refresh token
        if (error.response?.status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (!path.includes('/login')) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                if (path.includes('/establishment')) {
                    window.location.href = '/establishment/login';
                } else if (path.includes('/student')) {
                    window.location.href = '/student/login';
                } else {
                    // window.location.href = '/admin/login'; // Désactivé temporairement
                }
            }
        }

        return Promise.reject(error);
    }
);

// Document API
export const documentsApi = {
    // Public endpoints
    getAll: (params?: Record<string, unknown>) => api.get('/documents', { params }),
    getBySlug: (slug: string) => api.get(`/documents/${slug}`),
    getRecent: () => api.get('/documents/recent'),
    getPopular: () => api.get('/documents/popular'),
    getPublicStats: () => api.get('/documents/statistics/public'),
    recordView: (id: string) => api.post(`/documents/${id}/view`),

    // Admin endpoints
    getAllAdmin: (status?: string) => api.get('/documents/admin/all', { params: { status } }),
    getPending: () => api.get('/documents/admin/pending'),
    getById: (id: string) => api.get(`/documents/admin/${id}`),
    getAdminStats: () => api.get('/documents/admin/statistics'),
    update: (id: string, data: Record<string, unknown>) => api.put(`/documents/admin/${id}`, data),
    approve: (id: string) => api.post(`/documents/admin/${id}/approve`),
    reject: (id: string, reason: string) => api.post(`/documents/admin/${id}/reject`, { reason }),
    archive: (id: string) => api.post(`/documents/admin/${id}/archive`),
    delete: (id: string) => api.delete(`/documents/admin/${id}`),
};

// Auth API
export const authApi = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
        api.post('/auth/register', data),
    refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
    getProfile: () => api.get('/auth/profile'),
};

// Upload API
export const uploadApi = {
    uploadDocument: (formData: FormData) =>
        api.post('/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getPresignedUrl: (documentId: string) => api.get(`/upload/presigned/${documentId}`),
};

// Workflow API
export const workflowApi = {
    submitByStudent: (formData: FormData) =>
        api.post('/workflow/student/submit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    submitByEstablishment: (formData: FormData) =>
        api.post('/workflow/establishment/submit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getPendingForEstablishment: () => api.get('/workflow/establishment/pending'),
    validate: (id: string) => api.post(`/workflow/establishment/${id}/validate`),
    reject: (id: string, reason: string) => api.post(`/workflow/establishment/${id}/reject`, { reason }),
    publish: (id: string) => api.post(`/workflow/admin/${id}/publish`),
    getMyDocuments: () => api.get('/workflow/student/my-documents'),
};

// Metadata API
export const metadataApi = {
    getInstitutions: () => api.get('/metadata/institutions'),
    createInstitution: (data: Record<string, unknown>) => api.post('/metadata/institutions', data),
    updateInstitution: (id: string, data: Record<string, unknown>) => api.put(`/metadata/institutions/${id}`, data),
    deleteInstitution: (id: string) => api.delete(`/metadata/institutions/${id}`),
    getCycles: () => api.get('/metadata/cycles'),
    getFields: () => api.get('/metadata/fields'),
    getFaculties: (institutionId: string) => api.get(`/metadata/institutions/${institutionId}/faculties`),
    getSupervisors: () => api.get('/metadata/supervisors'),
};

export default api;
