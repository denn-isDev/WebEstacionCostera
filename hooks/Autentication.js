import { enviar, login } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await login('iniciar_sesion', data);
  if (sesion && sesion.code === 200 && sesion.data.usuario) {
    save('external_id',sesion.data.external_id)
    saveToken(sesion.data.token);
    save('user', sesion.data.usuario);
    save('rol', sesion.data.rol);
  }

  return sesion;
}