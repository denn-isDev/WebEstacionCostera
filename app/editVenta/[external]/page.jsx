"use client";
import React, { useEffect, useState } from 'react';
import HeaderAdmin2 from '@/componentes/headerAdmin2';
import { obtenerExternalUser, getToken } from '@/hooks/SessionUtil';
import { obtenerRecursos, enviarRecursos } from '@/hooks/Conexion';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import mensajes from '@/componentes/Mensajes';
import PrivateRoute from '@/hooks/PrivateRoute';
import { FcMoneyTransfer } from "react-icons/fc";
export default function Page({ params }) {
    const { external } = params;
    const [details, setDetails] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [venta, setVenta] = useState([]);
    const [detailsAux2, setDetailsAux2] = useState([]);
    const [selectedProductDescription, setSelectedProductDescription] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExtraValue, setSelectedExtraValue] = useState(0);
    const [selectRestante, setSelectRestante] = useState(false);
    const [restante, setRestante] = useState(0);

    const fetchData = async () => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        try {
            const response = await obtenerRecursos(`listar/productos`, token);
            // console.log(response);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDetails();
    }, []);

    const cargarTotalInicial = (ventaData, details) => {
        // Calcular el subtotal
        const subtotal = details.reduce((subtotal, detail) => {
            return subtotal + (detail.cantidad * detail.precio);
        }, 0);

        // Calcular el subtotal incrementado con el valor extra
        const subtotalConExtra = subtotal + parseFloat(selectedExtraValue);

        // Calcular el total de la venta
        const totalVenta = parseFloat(ventaData.total);

        // Establecer el valor extra
        setSelectedExtraValue((totalVenta - subtotalConExtra).toFixed(2));
    };

    const fetchDetails = async () => {
        const token = getToken();
        try {
            const response = await obtenerRecursos(`obtener/venta/${external}`, token);
            setVenta(response.data);

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

            setDetails(updatedDetails);
            setSelectedPaymentMethod(response.data.metodo || 'Efectivo');
            cargarTotalInicial(response.data, updatedDetails);
        } catch (error) {
            console.error(error);
        }
    };



    const handleSaveDetails = async () => {
        const selectedProductData = selectedProduct ? products.find(product => product.external_id === selectedProduct) : null;

        if (!selectedProduct) {
            mensajes("Debe seleccionar un producto para cada detalle", "Error", "error");
            return;
        }

        if (quantity <= 0) {
            mensajes("Debe ingresar una cantidad mayor a 0 para cada detalle", "Error", "error");
            return;
        }

        console.log(selectedProduct);
        const newDetail = {
            cantidad: quantity,
            precio: selectedProductData ? selectedProductData.precio : null,
            nombre: selectedProductData ? selectedProductData.nombre : null,
            producto: selectedProductData ? selectedProductData.external_id : null,
            descripcion: selectedProductData ? selectedProductData.descripcion : null,
            metodoPago: selectedPaymentMethod,
        };

        setDetails([...details, newDetail]);
        setModalOpen(false);
        setSelectedProduct(null);
        setQuantity(0);
    };
    const handleDeleteDetail = (index) => {
        const updatedDetails = [...details];
        updatedDetails.splice(index, 1);
        setDetails(updatedDetails);
    };

    const route = useRouter();

    const calculateSubtotal = () => {
        const subtotal = details.reduce((subtotal, detail) => {
            return subtotal + (detail.cantidad * detail.precio);
        }, 0);
        return (subtotal + parseFloat(selectedExtraValue)).toFixed(2);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const guardarVenta = async () => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        if (details.length === 0) {
            mensajes("Debes agregar al menos un detalle para guardar la venta", "Error", "error");
            return;
        }

        if (calculateSubtotal() < 0) {
            mensajes("El valor extra no puede ser mayor al total", "Error", "error");
            return;
        }

        const detailaux = details.map((detail) => ({
            cantidad: detail.cantidad,
            producto: detail.producto,
            precio: detail.precio,
        }));

        const externalUserWithoutQuotes = externalUser.replace(/"/g, '');
        const fechasistema = new Date().toISOString();
        const fechaLocal = new Date(fechasistema).toLocaleString("es-EC", { timeZone: "America/Guayaquil" });
        const soloFecha = fechaLocal.split(",")[0]; // Tomar solo la parte de la fecha
        const soloHora = fechaLocal.split(",")[1]; // Tomar solo la parte de la hora
        const fechaBD = soloFecha.split("/").reverse().join("-"); // Convertir la fecha al formato "xxxx-xx-xx"
        const data = {
            fecha: fechaBD,
            hora: soloHora,
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
            metodo: selectedPaymentMethod,
            persona: externalUserWithoutQuotes,
            detalles: detailaux,
        };

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción editará la venta. ¿Deseas continuar?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = getToken();
                console.log(JSON.stringify(data));
                const response = await enviarRecursos(`modificar/DetalleVenta/${external}`, data, token);
                if (response.code === 200) {
                    mensajes("Venta editada correctamente", "Venta Editada", "success");
                    route.push('/principal');
                }
            }
        });
    };


    const filteredProducts = products.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        const extra = document.getElementById('extra');
        extra.addEventListener('input', (e) => {
            const value = e.target.value.trim() === '' ? 0 : parseFloat(e.target.value);
            setSelectedExtraValue(value);
        });
    }, []);

    const handleRestante = () => {
        setSelectRestante(true);
    }

    const calculateVuelto = () => {
        return (restante - calculateTotal()).toFixed(2);
    }

    return (
        <PrivateRoute>
            <div className='bg-dark col text-center'>
                <HeaderAdmin2 />
                <div className="bg-dark p-3" style={{ fontWeight: 'bold' }}>
                    <h1 className="text-white"><strong>Editar Venta</strong></h1>
                    <button className="btn btn-outline-secondary" onClick={() => setModalOpen(true)} style={{ marginRight: '10px' }}>
                        Agregar Detalle
                    </button>
                    <button className="btn btn-outline-success" onClick={guardarVenta}>
                        Guardar Venta
                    </button>
                </div>
                <div className="d-flex justify-content-center flex-wrap">
                    <div className="form-group mb-3 me-md-3">
                        <label htmlFor="paymentMethod" style={{ color: "white", marginBottom: "5px" }}>Método de Pago:</label>
                        <select
                            id="paymentMethod"
                            className="form-control"
                            style={{ minWidth: '200px', maxWidth: '300px' }} // Establece un ancho mínimo y máximo para el select
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        >
                            <option value="Transferencia">Transferencia</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de credito">Tarjeta de crédito</option>
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="paymentMethod" style={{ color: "white", marginBottom: "5px" }}>Valor extra:</label>
                        <input
                            type="number"
                            id="extra"
                            className="form-control"
                            placeholder="Valor Extra"
                            value={selectedExtraValue}
                            style={{ minWidth: '200px', maxWidth: '300px', marginLeft:"5px" }} // Establece un ancho mínimo y máximo para el input
                        />
                    </div>
                    <div className="form-group mb-3" style={{ minWidth: '50px', maxWidth: '50px', marginLeft: "20px" }} onClick={handleRestante}>
                        <FcMoneyTransfer size={77} />
                    </div>
                </div>
                <div className="container">
                    {selectedProductDescription && (
                        Swal.fire({
                            title: 'Descripción del producto seleccionado',
                            text: selectedProductDescription,
                            icon: 'info',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            setSelectedProductDescription('');
                        })
                    )}
                    <div
                        className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                        style={{ maxHeight: "100vh" }}
                    >
                        <div className="d-flex justify-content-center">
                            <div>
                                <p>Subtotal: ${calculateSubtotal()}</p>
                            </div>
                            <div style={{ marginLeft: "2em" }}>
                                <p>Total: ${calculateTotal()}</p>
                            </div>
                            <div style={{ marginLeft: "2em" }}>
                                <p>Numero: {venta.numero}</p>
                            </div>
                        </div>
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Descripcion</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Valor</th>
                                    <th>Acciones</th>
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
                                        <td>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDeleteDetail(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {modalOpen && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"><strong>Agregar Detalle</strong></h5>
                                </div>
                                <div className="modal-body ">
                                    <div className="form-group">
                                        <label htmlFor="quantity">Cantidad:</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="search">Buscar Producto:</label>
                                        <input
                                            type="text"
                                            id="search"
                                            className="form-control"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                                        <label htmlFor="product">Producto:</label>
                                        <div className="d-grid gap-2">
                                            {filteredProducts.map((product, index) => (
                                                <button
                                                    key={`${product.external_id}-${index}`}
                                                    className={`btn ${selectedProduct === product.external_id ? 'btn-success' : 'btn-outline-light'}`}
                                                    style={{ color: '#000' }}  // Agrega este estilo para mantener el color del texto visible
                                                    onClick={() => {
                                                        setSelectedProduct(product.external_id);
                                                        Swal.fire({
                                                            title: product.nombre,
                                                            html: `Descripción: ${product.descripcion}<br/><strong>Precio: ${product.precio}</strong>`,
                                                            icon: 'info',
                                                            confirmButtonText: 'OK'
                                                        });
                                                    }}
                                                >
                                                    {`${product.nombre}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-outline-success" onClick={handleSaveDetails}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                                            value={calculateTotal()}
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
};