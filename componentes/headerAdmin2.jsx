"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { msgSessionClose } from "./messages/msgSessionClose";
import { borrarSesion } from "@/hooks/SessionUtil";
export default function HeaderAdmin2() {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };


    const handleCerrarSesion = async () => {
        const respuesta= (await msgSessionClose()).isConfirmed

        if (respuesta){
            borrarSesion()
            router.push("/")
        }
        
    };

    return (
        <div className="container-xxl position-relative p-0 bg-dark">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                <a href="/" className="navbar-brand p-0">
                    <h1 className="text-primary m-0">
                        <i className="fa fa-utensils me-3"></i>
                        <span style={{ fontWeight: "bold" }}>
                            <span style={{ color: "black" }}>Totos</span>
                            <span style={{ color: "white" }}> Wings</span>
                        </span>
                    </h1>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={handleToggleMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${showMenu ? "show" : ""}`}>
                    <div className="navbar-nav ml-auto">
                        <a href="/principal" className="nav-link">
                            Principal
                        </a>
                        <button
                            className="btn btn-light mx-2"
                            onClick={handleCerrarSesion}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
