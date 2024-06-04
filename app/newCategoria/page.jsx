"use client";
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { estaSesion, obtenerExternalUser } from '@/hooks/SessionUtil';
import { getToken } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import { obtenerRecursos, enviarRecursos } from '@/hooks/Conexion';
import HeaderAlt from '@/componentes/headerAlt';
import HeaderAdminCategorias from '@/componentes/headerAdminCategorias';
import Link from 'next/link';
import HeaderAdminCategorias2 from '@/componentes/headerAdminCategorias2';
import PrivateRoute from '@/hooks/PrivateRoute';
export default function Page() {
    const router = useRouter();
    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Ingrese un nombre'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const sendData = async (data) => {
        const productData = {
            nombre: data.nombre,
        };

        try {
            const token = getToken();
            //console.log(data)
            const response = await enviarRecursos(`guardar/categorias`, productData, token);
            //console.log(response);
            if (response.code === 200) {
                mensajes("Categoria creada correctamente", "Categoria creada", "success");
                router.replace("/principalCategorias");
            } else {
                mensajes("Error al crear la categoria", "Algo salió mal", "error");
            }
        } catch (error) {
            // console.error(error);
        }
    };


    return (
        <PrivateRoute>
        <div className='bg-dark'>
            <HeaderAdminCategorias2 />
            <div className="container bg-dark">
                <div
                    className="px-4 py-5 px-md-5 text-center text-lg-start bg-dark"
                    style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
                >
                    <div className="container bg-dark">
                        <div className="row gx-lg-5 align-items-center">
                            <h1 className="my-5 display-3 fw-bold ls-tight text-light text-center mx-auto">
                                Crear Categoria
                            </h1>

                            <div className="col-lg-6 mb-5 mb-lg-0 mx-auto">
                                <div className="card">
                                    <div className="card-body py-5 px-md-5">
                                        <form onSubmit={handleSubmit(sendData)}>
                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("nombre")}
                                                    type="text"
                                                    name="nombre"
                                                    id="nombre"
                                                    className={`form-control ${errors.nombre ? "is-invalid" : ""
                                                        }`}
                                                />
                                                <label className="form-label">Nombre</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.nombre?.message}
                                                </div>
                                            </div>


                                            <div className="text-center">
                                                <Link href="/principalCategorias" className='btn btn-outline-dark btn-block mb-4' style={{ marginRight: "2em" }}>
                                                    Volver
                                                </Link>
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark btn-block mb-4"
                                                >
                                                    Crear Categoria
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
        </PrivateRoute>
    );
}
