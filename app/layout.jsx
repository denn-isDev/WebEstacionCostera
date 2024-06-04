"use client";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "@/componentes/footer";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }) => {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <html lang="en">
        <body className={inter.className}>
            <div className="container-fluid min-vh-100 bg-dark p-0">
              <main className="bg-dark p-3">{children}</main>
            </div>
            <footer className="bg-dark">
              <Footer />
            </footer>
        </body>
      </html>
    </>
  );
};

export default Layout;


