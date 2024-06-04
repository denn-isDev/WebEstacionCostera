"use client";
import HeaderAdmin from "@/componentes/headerAdmin";
import { enviar, enviarRecursos, obtenerRecursos } from "@/hooks/Conexion";
import { obtenerExternalUser, getToken } from "@/hooks/SessionUtil";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import mensajes from "@/componentes/Mensajes";
import Swal from "sweetalert2";
import PrivateRoute from "@/hooks/PrivateRoute";

export default function Principal() {
  const [ventas, setventas] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    const token = getToken();
    const externalUser = obtenerExternalUser();

    try {
      const response = await obtenerRecursos(`listar/last/ventas`, token);
      setventas(response.data);
      //console.log(response);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        // console.log(external);
        const token = getToken();
        const data = {};
        const response = await enviarRecursos(`darbaja/venta/${external}`, data, token);
        // console.log(response);
        if (response.code === 200) {
          mensajes("Venta eliminada correctamente", "Venta eliminada", "success");
          fetchData();
        }
      }
    });
  };

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
                {Array.isArray(ventas) && ventas.length > 0 ? (
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
                        {ventas.filter(venta => venta.estado === true).map((venta, index) => (
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
}
