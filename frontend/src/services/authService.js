import api from './api';

export const registrar = (datos) => api.post('/auth/register', datos);
export const iniciarSesion = (datos) => api.post('/auth/login', datos);
export const obtenerPerfil = () => api.get('/users/me');