import React from 'react';

const WHATSAPP_LINK = "https://wa.me/5511994131968"; 
const INSTAGRAM_LINK = "https://www.instagram.com/plfragrances?igsh=MTU0am91bjVsM3JjZg%3D%3D&utm_source=qr";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="footer-button whatsapp">
          Entrar em Contato via WhatsApp
        </a>
        <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="footer-button instagram">
          Siga-nos no Instagram
        </a>
      </div>
    </footer>
  );
}

export default Footer;