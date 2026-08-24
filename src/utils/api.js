import { API_BASE } from './constants';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const api = {
  // public
  createApplication: (payload) => request('/applications', { method: 'POST', body: payload }),
  track: (code) => request(`/applications/track/${encodeURIComponent(code)}`),

  // connector
  registerConnector: (payload) => request('/connectors/register', { method: 'POST', body: payload }),
  loginConnector: (payload) => request('/connectors/login', { method: 'POST', body: payload }),
  getConnectorApps: (agentCode) => request(`/connectors/${encodeURIComponent(agentCode)}/applications`),

  // admin
  adminLogin: (payload) => request('/admin/login', { method: 'POST', body: payload }),
  getAllApplications: (token) => request('/admin/applications', { headers: { 'x-admin-auth': token } }),
  getAllConnectors: (token) => request('/admin/connectors', { headers: { 'x-admin-auth': token } }),
  updateStatus: (id, fileStatus, token) => request(`/admin/applications/${id}/status`, { method: 'PATCH', body: { fileStatus }, headers: { 'x-admin-auth': token } })
};
