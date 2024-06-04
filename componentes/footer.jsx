import React from 'react';

const Footer = () => {
  return (
    <div className="container-fluid bg-dark text-light">
      <div className="container py-5">
        <div className="row g-5 justify-content-center">
          <div className="col-lg-3 col-md-6 text-center">
            <h4 className="section-title ff-secondary text-primary fw-normal mb-4">Contáctanos</h4>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Calle Azuay entre av. Emiliano Ortega y Macará</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>Pedidos a: 0982763941</p>
            <div className="d-flex justify-content-center pt-2">
              <a className="btn btn-outline-light btn-social" href="https://www.instagram.com/totos_wings_loja?igsh=MWx5aHpnMHVoMGQ5aw==" style={{ marginRight: '10px' }}>Instagram <i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center">
            <h4 className="section-title ff-secondary text-primary fw-normal mb-4">Atendemos</h4>
            <h5 className="text-light fw-normal">Lunes - Sábado</h5>
            <p>11:00 am a 23:00 pm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
