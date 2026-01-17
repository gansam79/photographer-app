import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container">
        <div className="row gy-5">
          
          <div className="col-lg-12">
            <div className="footer-brand">
              <Link to="/" className="logo d-flex align-items-center mb-3">
                <span className="sitename"> The Patil Photography & Film's</span>
              </Link>
              <p className="tagline">Preserving Pure Emotion in Every Frame.</p>

              <div className="social-links mt-4">
                <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Dribbble"><i className="bi bi-dribbble"></i></a>
              </div>
            </div>
          </div>

    
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-bottom-content">
                <p className="mb-0">© <span className="sitename">The Patil Photography & Film's</span>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;