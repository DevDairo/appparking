import axios from 'axios';

const BASE_URL = 'http://localhost:8085/appparking/api';

// ── PROPIETARIOS ──────────────────────────────────────────────────
export const getPropietarios = () =>
    axios.get(`${BASE_URL}/propietarios`).then(r => r.data);

export const crearPropietario = (data) =>
    axios.post(`${BASE_URL}/propietarios`, data).then(r => r.data);

export const actualizarPropietario = (data) =>
    axios.put(`${BASE_URL}/propietarios`, data).then(r => r.data);

export const eliminarPropietario = (id) =>
    axios.delete(`${BASE_URL}/propietarios?id=${id}`).then(r => r.data);

// ── PARQUEADEROS ──────────────────────────────────────────────────
export const getParqueaderos = () =>
    axios.get(`${BASE_URL}/parqueaderos`).then(r => r.data);

export const crearParqueadero = (data) =>
    axios.post(`${BASE_URL}/parqueaderos`, data).then(r => r.data);

export const actualizarParqueadero = (data) =>
    axios.put(`${BASE_URL}/parqueaderos`, data).then(r => r.data);

export const eliminarParqueadero = (id) =>
    axios.delete(`${BASE_URL}/parqueaderos?id=${id}`).then(r => r.data);

// ── MARCAS ────────────────────────────────────────────────────────
export const getMarcas = () =>
    axios.get(`${BASE_URL}/marcas`).then(r => r.data);

// ── CARROS ────────────────────────────────────────────────────────
export const getCarros = () =>
    axios.get(`${BASE_URL}/carros`).then(r => r.data);

export const crearCarro = (data) =>
    axios.post(`${BASE_URL}/carros`, data).then(r => r.data);

export const actualizarCarro = (data) =>
    axios.put(`${BASE_URL}/carros`, data).then(r => r.data);

export const eliminarCarro = (id) =>
    axios.delete(`${BASE_URL}/carros?id=${id}`).then(r => r.data);

// ── ESPACIOS ──────────────────────────────────────────────────────
export const getEspacios = () =>
    axios.get(`${BASE_URL}/espacios`).then(r => r.data);

export const crearEspacio = (data) =>
    axios.post(`${BASE_URL}/espacios`, data).then(r => r.data);

export const asignarCarro = (idEspacio, idCarro) =>
    axios.put(`${BASE_URL}/espacios?accion=asignar&idEspacio=${idEspacio}&idCarro=${idCarro}`).then(r => r.data);

export const liberarEspacio = (idEspacio) =>
    axios.put(`${BASE_URL}/espacios?accion=liberar&idEspacio=${idEspacio}`).then(r => r.data);

export const eliminarEspacio = (id) =>
    axios.delete(`${BASE_URL}/espacios?id=${id}`).then(r => r.data);
