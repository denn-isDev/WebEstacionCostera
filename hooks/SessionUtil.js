export const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const get = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const saveToken = (key) => {
  localStorage.setItem("token", key);
};

export const getToken = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem("token");
  } else {
    throw new Error("Error: localStorage no está disponible en este entorno.");
  }
};

export const borrarSesion = () => {
  localStorage.clear();
};

export const estaSesion = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== "null";
};

export const obtenerExternalUser = () => {
  return localStorage.getItem("external_id");
};

export const obtenerRolUser = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem("rol");
  } else {
    throw new Error("Error: localStorage no está disponible en este entorno.");
  }
};

export const getUserId = () => {
  return localStorage.getItem('id');
};
