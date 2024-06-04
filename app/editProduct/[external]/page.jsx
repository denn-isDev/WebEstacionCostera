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
import HeaderAdminProducts2 from '@/componentes/headerAdminProducts2';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import PrivateRoute from '@/hooks/PrivateRoute';

export default function Page({ params }) {
    const { external } = params;
    const router = useRouter();
    const [categorias, setCategorias] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');


    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Ingrese un nombre'),
        descripcion: Yup.string(),
        //costo: Yup.number().typeError('Ingrese un costo válido').positive('Ingrese un costo positivo'),
        precio: Yup.number().typeError('Ingrese un precio válido').positive('Ingrese un precio positivo').required('Ingrese un precio'),
        categoria: Yup.string().required('Seleccione una categoría'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState, setValue} = useForm(formOptions);
    const { errors } = formState;

    const sendData = async (data) => {
        const persona=obtenerExternalUser();
        const externalUserWithoutQuotes = persona.replace(/"/g, '');
        const productData = {
            persona: externalUserWithoutQuotes,
            nombre: data.nombre,
            descripcion: data.descripcion || "default",
            costo: data.costo ? data.costo.toString() : "0",
            precio: data.precio.toString(),
            categoria: data.categoria,
        };

        try {
            const token = getToken();
            //console.log(data)
            const response = await enviarRecursos(`modificar/producto/${external}`, productData, token);
            //console.log(response);
            if (response.code === 200) {
                mensajes("Producto editado correctamente", "Producto editado", "success");
                router.replace("/principalProducts");
            } else {
                mensajes("Error al crear el producto", "Algo salió mal", "error");
            }
        } catch (error) {
            // console.error(error);
        }
    };

    const fetchData = async () => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        try {
            const response = await obtenerRecursos(`listar/categorias`, token);
            const response2 = await obtenerRecursos(`obtener/productos/${external}`, token);
            setValue("nombre", response2.data.nombre);
            setValue("descripcion", response2.data.descripcion);
            setValue("costo", response2.data.costo);
            setValue("precio", response2.data.precio);
            setSelectedCategory(response2.data.categoria.external_id);

            setCategorias(response.data);


        } catch (error) {
            // console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <PrivateRoute>
        <div className='bg-dark'>
            <HeaderAdminProducts2 />
            <div className="container bg-dark">
                <div
                    className="px-4 py-5 px-md-5 text-center text-lg-start bg-dark"
                    style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
                >
                    <div className="container bg-dark">
                        <div className="row gx-lg-5 align-items-center">
                            <h1 className="my-5 display-3 fw-bold ls-tight text-light text-center mx-auto">
                                Editar Producto
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

                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("descripcion")}
                                                    type="text"
                                                    name="descripcion"
                                                    id="descripcion"
                                                    className={`form-control ${errors.descripcion ? "is-invalid" : ""
                                                        }`}
                                                    
                                                />
                                                <label className="form-label">Descripción</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.descripcion?.message}
                                                </div>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("costo")}
                                                    type="number"
                                                    name="costo"
                                                    id="costo"
                                                    step="0.01"
                                                    className={`form-control ${errors.costo ? "is-invalid" : ""}`}
                                                    
                                                />

                                                <label className="form-label">Costo</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.costo?.message}
                                                </div>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    {...register("precio")}
                                                    type="number"
                                                    name="precio"
                                                    id="precio"
                                                    step="0.01"
                                                    className={`form-control ${errors.precio ? "is-invalid" : ""
                                                        }`}
                                                    
                                                />
                                                <label className="form-label">Precio</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.precio?.message}
                                                </div>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <select
                                                    {...register("categoria")}
                                                    name="categoria"
                                                    id="categoria"
                                                    defaultValue={selectedCategory}
                                                    className={`form-select ${errors.categoria ? "is-invalid" : ""
                                                        }`}
                                                    
                                                >

                                                    <option value="">Seleccione una categoría</option>
                                                    {categorias && categorias.map((categoria) => (
                                                        <option key={categoria.external_id} value={categoria.external_id}>
                                                            {categoria.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label className="form-label">Categoría</label>
                                                <div className="alert alert-danger invalid-feedback">
                                                    {errors.categoria?.message}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <Link href="/principalProducts" className='btn btn-outline-dark btn-block mb-4' style={{marginRight:"2em"}}>
                                                    Volver
                                                </Link>
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark btn-block mb-4"
                                                >
                                                    Editar Producto
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
