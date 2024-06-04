"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { enviarRecursos, obtenerRecursos } from "@/hooks/Conexion";
import { obtenerExternalUser, getToken } from "@/hooks/SessionUtil";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import mensajes from "@/componentes/Mensajes";
import Swal from "sweetalert2";
import PrivateRoute from "@/hooks/PrivateRoute";
import HeaderAdmin from '@/componentes/headerAdmin';
import React from 'react';

const Principal = () => {
    const [ventas, setVentas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    const MAX_PAGES = 3;

    const fetchData = async (page) => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        try {
            const response = await obtenerRecursos(`/listar/paginacion/ventas?page=${page}`, token);
            setVentas(response.data.ventas);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleEliminar = async (external) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la venta. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = getToken();
                const data = {};
                const response = await enviarRecursos(`darbaja/venta/${external}`, data, token);
                if (response.code === 200) {
                    mensajes("Venta eliminada correctamente", "Venta eliminada", "success");
                    const updatedTotalPages = Math.ceil((totalPages - 1) / MAX_PAGES) * MAX_PAGES; 
                    if (ventas.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        fetchData(currentPage);
                    }
                    setTotalPages(updatedTotalPages);
                }
            }
        });
    };


    const handleClickPage = (page) => {
        setCurrentPage(page);
    };

    let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES / 2));
    let endPage = Math.min(totalPages, startPage + MAX_PAGES - 1);

    if (endPage - startPage < MAX_PAGES - 1) {
        startPage = Math.max(1, endPage - MAX_PAGES + 1);
    }

    return (
        <PrivateRoute>
            <div className="bg-dark">
                <HeaderAdmin />
                <div className="container">
                    <div className="col text-center">
                        <div className="bg-dark p-3" style={{ fontWeight: 'bold' }}>
                        <h1 className="text-white"><strong>Ventas Generadas</strong></h1>
                        </div>
                        <div className="mt-3">
                            <div
                                className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                                style={{ maxHeight: "100vh" }}
                            >
                                <div className="mb-3">
                                    
                                    <div className='d-flex justify-content-center mt-4'>
                                        <nav aria-label="...">
                                            <ul className="pagination pagination-lg">
                                                {startPage !== 1 && (
                                                    <li className="page-item">
                                                        <span className="page-link" onClick={() => handleClickPage(1)}>1</span>
                                                    </li>
                                                )}
                                                {startPage !== 1 && (
                                                    <li className="page-item">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                )}
                                                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                                                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                        <span className="page-link" onClick={() => handleClickPage(page)}>{page}</span>
                                                    </li>
                                                ))}
                                                {endPage !== totalPages && (
                                                    <li className="page-item">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                )}
                                                {endPage !== totalPages && (
                                                    <li className="page-item">
                                                        <span className="page-link" onClick={() => handleClickPage(totalPages)}>{totalPages}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    </div>

                                </div>

                                {ventas.length > 0 ? (
                                    <div>
                                        <table className="table table-dark">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Numero</th>
                                                    <th>Fecha</th>
                                                    <th>Hora</th>
                                                    <th>Subtotal</th>
                                                    <th>Total</th>
                                                    <th>Detalle</th>
                                                    <th>Editar</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ventas.map((venta, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{venta.numero}</td>
                                                        <td>{venta.fecha}</td>
                                                        <td>{venta.hora}</td>
                                                        <td>{venta.subtotal}$</td>
                                                        <td>{venta.total}$</td>
                                                        <td>
                                                            {venta.external_id && (
                                                                <Link href={`viewDetails/${venta.external_id}`} passHref>
                                                                    <button className="btn btn-outline-secondary">Ver Detalle</button>
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {venta.external_id && (
                                                                <Link href={`editVenta/${venta.external_id}`} passHref>
                                                                    <button className="btn btn-outline-success">Editar Venta</button>
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {venta.external_id && (
                                                                <button className="btn btn-outline-danger" onClick={() => handleEliminar(venta.external_id)} style={{ margin: "0 10px" }}>
                                                                    Eliminar Venta
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No se encontraron ventas</p>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </PrivateRoute>
    );
};

export default Principal;
