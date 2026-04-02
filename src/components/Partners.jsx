import React from 'react';
import './Partners.css';

const Partners = () => {
  const partners = [
    "QUANTUM LABS",
    "AEROCORE",
    "BIO-SYNTH",
    "LITHIUM_X",
    "NEUROFLOW"
  ];

  return (
    <div className="partners container">
      <div className="partners-list">
        {partners.map((partner, index) => (
          <div key={index} className="partner-logo">{partner}</div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
