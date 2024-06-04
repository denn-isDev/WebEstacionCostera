"use client";
import React, { useEffect, useState } from 'react';
import HeaderAdmin2 from '@/componentes/headerAdmin2';
import { obtenerRecursos } from '@/hooks/Conexion';
import { getToken } from '@/hooks/SessionUtil';
import PrivateRoute from '@/hooks/PrivateRoute';
import { FcMoneyTransfer } from "react-icons/fc";

export default function Page({ params }) {
    const { external } = params;
    const [details, setDetails] = useState([]);
    const [venta, setVenta] = useState([]);
    const [selectedExtraValue, setSelectedExtraValue] = useState(0);
    const [selectRestante, setSelectRestante] = useState(false);
    const [restante, setRestante] = useState(0);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        const token = getToken();
        try {
            const response = await obtenerRecursos(`obtener/venta/${external}`, token);
            const updatedDetails = [];

            for (let i = 0; i < response.data.detalle.length; i++) {
                const response2 = await obtenerRecursos(`obtener/productos/${response.data.detalle[i].producto}`, token);
                const detalleActualizado = {
                    ...response.data.detalle[i],
                    nombre: response2.data.nombre,
                    descripcion: response2.data.descripcion,
                };
                updatedDetails.push(detalleActualizado);
            }
            setVenta(response.data);
            setDetails(updatedDetails);
            cargarTotalInicial(response.data, updatedDetails);
        } catch (error) {
            // console.error(error);
        }
    };

    const cargarTotalInicial = (ventaData, details) => {
        // Calcular el subtotal
        const subtotal = details.reduce((subtotal, detail) => {
            return subtotal + detail.cantidad * detail.precio;
        }, 0);

        // Calcular el subtotal incrementado con el valor extra
        const subtotalConExtra = subtotal + parseFloat(selectedExtraValue);

        // Calcular el total de la venta
        const totalVenta = parseFloat(ventaData.total);

        // Establecer el valor extra
        setSelectedExtraValue(totalVenta - subtotalConExtra);
    };

    const handleRestante = () => {
        setSelectRestante(true);
    }

    const calculateVuelto = () => {
        return (restante - (venta.total || 0)).toFixed(2);
    }

    return (
        <PrivateRoute>
            <div className='bg-dark col text-center'>
                <HeaderAdmin2 />
                <div className="d-flex flex-column align-items-center justify-content-center bg-dark p-3 text-center" style={{ fontWeight: 'bold' }}>
                    <div  className="d-flex" style={{ marginBottom: '20px' }}>
                        <h1 className="text-white mb-0"><strong>Detalles de Venta</strong></h1>
                        <div className="form-group d-inline-block" style={{ marginLeft: '10px' }} onClick={handleRestante}>
                            <FcMoneyTransfer size={50} />
                        </div>
                    </div>
                </div>
                <div className="container" style={{ marginTop: '2em' }}>
                    <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded" style={{ maxHeight: '100vh' }}>
                        <div className="d-flex justify-content-center">
                            <div>
                                <p>Subtotal: ${venta.subtotal}</p>
                            </div>
                            <div style={{ marginLeft: '2em' }}>
                                <p>Total: ${venta.total}</p>
                            </div>
                            <div style={{ marginLeft: '2em' }}>
                                <p>Número: {venta.numero}</p>
                            </div>
                            <div style={{ marginLeft: '2em' }}>
                                <p>Método de pago: {venta.metodo}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="form-group" style={{ marginBottom: '2em', marginRight: '1em' }}>
                                <div className="form-group" style={{ marginBottom: '1em' }}>
                                    <label htmlFor="paymentMethod" style={{ color: 'white', marginBottom: '5px' }}>Valor extra: </label>
                                    <input
                                        type="number"
                                        id="extra"
                                        className="form-control"
                                        placeholder="Valor Extra"
                                        value={selectedExtraValue !== 0 ? selectedExtraValue.toFixed(2) : ''}
                                        style={{ width: '100%', maxWidth: '300px' }}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Costo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((detail, index) => (
                                    <tr key={index}>
                                        <td>{detail.nombre !== undefined ? detail.nombre : detail.producto}</td>
                                        <td>{detail.descripcion}</td>
                                        <td>{detail.cantidad}</td>
                                        <td>{detail.precio}</td>
                                        <td>{detail.cantidad * detail.precio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {selectRestante && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"><strong>Vueltos</strong></h5>
                                </div>
                                <div className="modal-body ">
                                    <div className="form-group">
                                        <label htmlFor="restante">Valor con el que pago:</label>
                                        <input
                                            type="number"
                                            id="restante"
                                            className="form-control"
                                            value={restante}
                                            onChange={(e) => setRestante(parseFloat(e.target.value))}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="restante">Total de la venta:</label>
                                        <input
                                            type="number"
                                            id="restante"
                                            className="form-control"
                                            value={venta.total}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="restante">Vuelto:</label>
                                        <input
                                            type="number"
                                            id="restante"
                                            className="form-control"
                                            value={calculateVuelto()}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-success" onClick={() => setSelectRestante(false)}>Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PrivateRoute>
    );
}
