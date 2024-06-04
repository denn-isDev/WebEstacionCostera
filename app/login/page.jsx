"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { inicio_sesion } from '@/hooks/Autentication';
import { useRouter } from 'next/navigation'
import { estaSesion } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import HeaderAlt from '@/componentes/headerAlt';
import { useState } from 'react';
export default function Inicio_sesion() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        usuario: Yup.string().required('Ingrese un usuario'),
        clave: Yup.string().required('Ingrese su clave')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const sendData = async (data) => {
        setLoading(true);
        const credentials = { "usuario": data.usuario, "clave": data.clave };

        const response = await inicio_sesion(credentials);
        try {
            if (response.code === 200) {
                setLoading(false);
                mensajes("Has ingresado al sistema!", "Bienvenido", "success");
                router.replace("/principal");
            } else {
                setLoading(false);
                if (response.code === 400) {
                    mensajes("Error al iniciar sesión: Credenciales incorrectas", "La contraseña ingresada es incorrecta", "error");
                } else {
                    mensajes("Error al iniciar sesión!", "Algo salió mal", "error");
                }
            }
        } catch (error) {
            setLoading(false);
            mensajes("Error al iniciar sesión!", "Algo salió mal", "error");
        }
    };


    return (
        <div className='bg-dark'>
            <HeaderAlt />
            <div className="container bg-dark">
                <div
                    className="px-4 py-5 px-md-5 text-center text-lg-start bg-dark"
                    style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
                >
                    <div className="container bg-dark">
                        <div className="row gx-lg-5 align-items-center">
                            <h1 className="my-5 display-3 fw-bold ls-tight text-light text-center mx-auto">
                                Iniciar Sesion
                            </h1>

                            <div className="col-lg-6 mb-5 mb-lg-0 mx-auto">
                                <div className="card">
                                    <div className="card-body py-5 px-md-5">
                                        <form onSubmit={handleSubmit(sendData)}>
                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("usuario")}
                                                    type="usuario"
                                                    name="usuario"
                                                    id="usuario"
                                                    className={`form-control ${errors.usuario ? "is-invalid" : ""
                                                        }`}
                                                />
                                                <label className="form-label">Usuario</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.usuario?.message}
                                                </div>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("clave")}
                                                    type="password"
                                                    name="clave"
                                                    id="clave"
                                                    className={`form-control ${errors.clave ? "is-invalid" : ""
                                                        }`}
                                                />
                                                <label className="form-label">Clave</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.clave?.message}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark btn-block mb-4"
                                                    disabled={loading} // Desactivar el botón mientras está cargando
                                                >
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        "Iniciar Sesión"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
