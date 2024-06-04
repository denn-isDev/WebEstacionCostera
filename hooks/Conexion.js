// let URL = "http://localhost:3000/totos/";
let URL = "https://wings-vjhy.onrender.com/totos/";

//simn simn
export function url_api() {
  return URL;
}

export async function simple_obtener(recurso) {
  const response = await fetch(URL + recurso);
  return await response.json();
}

export async function obtenerRecursos(recurso, token) {
  const headers = {
    Accept: "application/json",
    "content-type": "application/json",
    "token-wings": token,
  };

  const response = await fetch(URL + recurso, {
    method: "GET",
    headers: headers,
    cache: 'no-store',
  });
  return await response.json();
}

export async function login(recurso, data) {
  const headers = {
    Accept: "application/json",
  };
  const urlCompleta = URL + recurso;
  try {
    const response = await fetch(urlCompleta, {
      method: "POST",
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

export async function enviar(recurso, data) {
  const headers = {
    Accept: "application/json",
  };
  const urlCompleta = URL + recurso;
  try {
    const response = await fetch(urlCompleta, {
      method: "POST",
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

export async function enviarArchivos(recurso, data, key = '') {
  let headers = {};
  if (key !== '') {
    headers = {
      Accept: "application/json",
      "token-wings": key,
    };
  } else {
    headers = {
      Accept: "application/json",
    };
  }

  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  try {
    const response = await fetch(URL + recurso, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

export async function enviarRecursos(recurso, data, key = '') {
  let headers = {};
  if (key !== '') {
    headers = {
      Accept: "application/json",
      "token-wings": key,
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
  try {
    const response = await fetch(URL + recurso, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}
