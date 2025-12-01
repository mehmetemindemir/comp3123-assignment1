import axios from 'axios';
import { getToken } from './auth';

const API_BASE = (() => {
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
  if (typeof window === 'undefined') return 'http://localhost:8092/gbc-service/comp3123';
  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol;
  const isProdHost = host === 'gbc-app.meddemir.com';
  const targetHost = isProdHost ? 'gbc-api.meddemir.com' : host;
  const port = isProdHost ? '' : ':8092';
  return `${protocol}//${targetHost}${port}/gbc-service/comp3123`;
})();

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function request(path, { method = 'GET', payload, auth = false } = {}) {
  try {
    const res = await client.request({
      url: path,
      method,
      data: payload
    });

    const data = res.data || {};
    if (data.status === false) {
      const detail = data.message || data.error || data.errors?.[0]?.msg;
      throw new Error(detail || 'Request failed');
    }
    return data;
  } catch (err) {
    const resp = err.response;
    const data = resp?.data || {};
    const detail = data.message || data.error || data.errors?.[0]?.msg;
    const statusText = resp ? `${resp.status} ${resp.statusText}` : err.message;
    throw new Error(detail || statusText || 'Request failed');
  }
}

export function signup(payload) {
  return request('/user/signup', { method: 'POST', payload });
}

export function login(payload) {
  return request('/user/login', { method: 'POST', payload });
}

export function listEmployees() {
  return request('/emp/employees', { auth: true });
}

export function searchEmployees(params) {
  const query = new URLSearchParams(params).toString();
  return request(`/emp/employees/search?${query}`, { auth: true });
}

export function createEmployee(payload) {
  return request('/emp/employees', { method: 'POST', payload, auth: true });
}

export function updateEmployee(id, payload) {
  return request(`/emp/employees/${id}`, { method: 'PUT', payload, auth: true });
}

export function deleteEmployee(id) {
  return request(`/emp/employees?eid=${id}`, { method: 'DELETE', auth: true });
}

export function getEmployee(id) {
  return request(`/emp/employees/${id}`, { auth: true });
}

export async function uploadEmployeePhoto(id, file) {
  const formData = new FormData();
  formData.append('photo', file);
  try {
    const res = await client.post(`/emp/employees/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    const resp = err.response;
    const data = resp?.data || {};
    const detail = data.message || data.error || data.errors?.[0]?.msg;
    const statusText = resp ? `${resp.status} ${resp.statusText}` : err.message;
    throw new Error(detail || statusText || 'Upload failed');
  }
}
