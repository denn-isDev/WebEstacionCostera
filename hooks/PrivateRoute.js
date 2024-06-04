import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { getToken } from './SessionUtil';

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la página
    if (!getToken()) {
      // Si no está autenticado, redirige a la página de inicio de sesión
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default PrivateRoute;