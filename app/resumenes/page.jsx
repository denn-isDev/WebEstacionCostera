"use client";
import HeaderAdmin from "@/componentes/headerAdmin";
import { enviarRecursos, obtenerRecursos } from "@/hooks/Conexion";
import { obtenerExternalUser, getToken } from "@/hooks/SessionUtil";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import HeaderResumenes from "@/componentes/headerResumenes";
import PrivateRoute from "@/hooks/PrivateRoute";

const Principal = () => {
    const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
    const [filtroFechaFin, setFiltroFechaFin] = useState("");
    const [totalVentas, setTotalVentas] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo');

    const handleFiltrarVentas = async () => {
        if (!filtroFechaInicio || !filtroFechaFin) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, selecciona ambas fechas para filtrar las ventas.',
            });
            return;
        }

        const token = getToken();

        try {
            const data = { fechaInicio: filtroFechaInicio, fechaFin: filtroFechaFin, metodo: selectedPaymentMethod };
            // console.log(data);
            const response = await enviarRecursos('filtrarVentasPorFecha', data, token);

            if (response.code === 200) {
                const ventasFiltradas = response.data;
                const totalFiltrado = ventasFiltradas.reduce((total, venta) => total + venta.total_ventas, 0);

                setTotalVentas(totalFiltrado);
                setChartData(crearDatosGrafico(ventasFiltradas, selectedPaymentMethod));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al filtrar las ventas. Por favor, inténtalo de nuevo.',
                });
            }
        } catch (error) {
            // console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error interno del servidor',
                text: 'Hubo un problema al filtrar las ventas. Por favor, inténtalo de nuevo.',
            });
        }
    };

    const crearDatosGrafico = (ventasFiltradas, selectedPaymentMethod) => {
        const fechas = ventasFiltradas.map((venta) => venta.fecha);
        const totales = ventasFiltradas.map((venta) => venta.total_ventas);

        let backgroundColor;
        let borderColor;

        switch (selectedPaymentMethod) {
            case 'Transferencia':
                backgroundColor = 'rgba(255, 255, 0, 0.2)'; // Amarillo
                borderColor = 'rgba(255, 255, 0, 1)';
                break;
            case 'Efectivo':
                backgroundColor = 'rgba(75, 192, 192, 0.2)'; // Azul
                borderColor = 'rgba(75, 192, 192, 1)';
                break;
            case 'Tarjeta de credito':
                backgroundColor = 'rgba(169, 169, 169, 0.2)'; // Gris
                borderColor = 'rgba(169, 169, 169, 1)';
                break;
            default:
                backgroundColor = 'rgba(144, 238, 144, 0.1)'; // Verde claro con opacidad (Valor por defecto)
                borderColor = 'rgba(144, 238, 144, 1)'; // Verde claro sólido
                break;
        }

        return {
            labels: fechas,
            datasets: [{
                label: 'Total Ventas',
                data: totales,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            }],
        };
    };

    return (
        <PrivateRoute>
            <div className="bg-dark">
                <HeaderResumenes />
                <div className="container">
                    <div className="col text-center">
                        <div className="bg-dark p-3" style={{ fontWeight: 'bold' }}>
                            <h1 className="text-white"><strong>Resumen de Ventas</strong></h1>
                        </div>
                        <div className="mt-3">
                            <div className="mb-3 row align-items-center">
                                <div className="col-md-4 mb-3">
                                    <label className="text-white">Fecha Inicio:</label>
                                    <input type="date" className="form-control" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="text-white">Fecha Fin:</label>
                                    <input type="date" className="form-control" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="text-white">Método de Pago:</label>
                                    <select
                                        className="form-control"
                                        value={selectedPaymentMethod}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    >
                                        <option value="Ninguna">General</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta de credito">Tarjeta de crédito</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <div className="d-flex justify-content-center align-items-end h-100">
                                        <button className="btn btn-primary" onClick={handleFiltrarVentas}>
                                            Generar Resumen
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-white">Total Ventas: {totalVentas}$</p>
                            </div>

                            {chartData && (
                                <Bar data={chartData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default Principal;