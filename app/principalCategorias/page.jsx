"use client";
import HeaderAdmin from "@/componentes/headerAdmin";
import { enviar, enviarRecursos, obtenerRecursos } from "@/hooks/Conexion";
import { obtenerExternalUser, getToken } from "@/hooks/SessionUtil";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import mensajes from "@/componentes/Mensajes";
import Swal from "sweetalert2";
import HeaderAdminProducts from "@/componentes/headerAdminProducts";
import HeaderAdminCategorias from "@/componentes/headerAdminCategorias";
import PrivateRoute from "@/hooks/PrivateRoute";
export default function Principal() {
    const [categorias, setcategorias] = useState([]);
    const router = useRouter();

    const fetchData = async () => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        try {
            const response = await obtenerRecursos(`listar/categorias`, token);
            setcategorias(response.data);
            //console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEliminar = async (external) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la categoria. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(external);
                const token = getToken();
                const data = {};
                const response = await enviarRecursos(`darbaja/categoria/${external}`, data, token);
                // console.log(response);
                if (response.code === 200) {
                    mensajes("categoria eliminada correctamente", "categoria eliminada", "success");
                    fetchData();
                }
            }
        });
    };

    return (
        <PrivateRoute>
            <div className="bg-dark">
                <HeaderAdminCategorias />
                <div className="container">
                    <div className="col text-center">
                        <div className="bg-dark p-3" style={{ fontWeight: 'bold' }}>
                            <h1 className="text-white"><strong>Categorias</strong></h1>
                        </div>
                        <div className="mt-3">
                            <div
                                className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                                style={{ maxHeight: "100 vh" }}
                            >
                                {Array.isArray(categorias) && categorias.length > 0 ? (
                                    <div>
                                        <table className="table table-dark">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Nombre</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categorias.map((categoria, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{categoria.nombre}</td>
                                                        <td>
                                                            {categoria.external_id && (
                                                                <button className="btn btn-outline-danger" onClick={() => handleEliminar(categoria.external_id)} style={{ margin: "0 10px" }}>
                                                                    Eliminar categoria
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No se encontraron categorias</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
