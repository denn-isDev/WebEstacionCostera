import React from 'react';
import Header from '@/componentes/header';

export default function Home() {
  return (
    <div className='bg-dark'>
      <Header />
      <div className='bg-dark'>
        <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://i.ibb.co/Dp96zmg/TOTO-S-COMBOS-20240130-102632-0000.png" className="d-block mx-auto" alt="Imagen 1" />
            </div>
            <div className="carousel-item">
              <img src="https://i.ibb.co/d2JjtLq/MEN-20240201-233054-0000.jpg" className="d-block mx-auto" alt="Imagen 2" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
  