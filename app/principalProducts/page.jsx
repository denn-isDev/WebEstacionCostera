"use client";
import HeaderAdminProducts from "@/componentes/headerAdminProducts";
import { enviarRecursos, obtenerRecursos } from "@/hooks/Conexion";
import { obtenerExternalUser, getToken } from "@/hooks/SessionUtil";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import mensajes from "@/componentes/Mensajes";
import Swal from "sweetalert2";
import PrivateRoute from "@/hooks/PrivateRoute";

export default function Principal() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtrosActivos, setFiltrosActivos] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        try {
            const response = await obtenerRecursos(`listar/productos`, token);
            setProductos(response.data);

            const categoriasResponse = await obtenerRecursos(`listar/categorias`, token);
            setCategorias(categoriasResponse.data);
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
            text: 'Esta acción eliminará el producto. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = getToken();
                const data = {};
                const response = await enviarRecursos(`darbaja/producto/${external}`, data, token);
                if (response.code === 200) {
                    mensajes("Producto eliminado correctamente", "Producto eliminado", "success");
                    fetchData();
                }
            }
        });
    };
    const productosFiltrados = productos.filter((producto) => {
        const nombreProducto = producto.nombre ? producto.nombre.toLowerCase() : '';
        const categoriaProducto = producto.categoria && producto.categoria.nombre ? producto.categoria.nombre.toLowerCase() : '';
    
        return (
            (filtrosActivos || producto.estado === true) &&
            (filtroNombre === '' || nombreProducto.includes(filtroNombre.toLowerCase())) &&
            (filtroCategoria === '' || categoriaProducto === filtroCategoria.toLowerCase())
        );
    });

    return (
        <PrivateRoute>
            <div className="bg-dark">
                <HeaderAdminProducts />
                <div className="container">
                    <div className="col text-center">
                        <div className="bg-dark p-3" style={{ fontWeight: 'bold' }}>
                            <h1 className="text-white"><strong>Productos Generados</strong></h1>
                        </div>
                        <div className="mt-3">
                            <div
                                className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                                style={{ maxHeight: "100vh"  }}
                            >
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre de producto"
                                        value={filtroNombre}
                                        onChange={(e) => setFiltroNombre(e.target.value)}
                                    />
                                    <div className="row mt-3">
                                        <div className="col">
                                            <select
                                                className="form-select"
                                                value={filtroCategoria}
                                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                            >
                                                <option key="" value="">Seleccionar Categoría</option>
                                                {categorias.map((categoria) => (
                                                    <option key={categoria.external_id} value={categoria.nombre}>
                                                        {categoria.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
                                    <div>
                                        <table className="table table-dark">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Nombre</th>
                                                    <th>Descripcion</th>
                                                    <th>Costo</th>
                                                    <th>Precio</th>
                                                    <th>Categoria</th>
                                                    <th>Editar</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productosFiltrados.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{producto.nombre}</td>
                                                        <td>{producto.descripcion}</td>
                                                        <td>{producto.costo}$</td>
                                                        <td>{producto.precio}$</td>
                                                        <td>{producto.categoria && producto.categoria.nombre ? producto.categoria.nombre : "default"}</td>
                                                        <td>
                                                            {producto.external_id && (
                                                                <Link href={`editProduct/${producto.external_id}`} passHref>
                                                                    <button className="btn btn-outline-success">Editar Productos</button>
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {producto.external_id && (
                                                                <button className="btn btn-outline-danger" onClick={() => handleEliminar(producto.external_id)} style={{ margin: "0 10px" }}>
                                                                    Eliminar Producto
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No se encontraron productos</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
