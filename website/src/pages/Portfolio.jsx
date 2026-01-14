import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const portfolioImages = [
  "assets/img/HomePage/7.webp",
  "assets/img/HomePage/16.webp",
  "assets/img/HomePage/128.webp",
  "assets/img/HomePage/18.webp",
  "assets/img/HomePage/3.webp",
  "assets/img/HomePage/11.webp",
  "assets/img/HomePage/84.webp",
  "assets/img/HomePage/Turning-Real-Emotions-into-Everlasting-Art-Photo.jpg",
  "assets/img/HomePage/7.webp",
  "assets/img/HomePage/16.webp",
  "assets/img/HomePage/128.webp",
  "assets/img/HomePage/18.webp",
];

const Portfolio = () => {
  useEffect(() => {
    try {
      document.body.className = "services-page";

      // Initialize GLightbox
      if (window.GLightbox) {
        window.GLightbox({
          selector: ".glightbox",
          loop: true,
          touchNavigation: true,
          keyboardNavigation: true,
        });
      }
    } catch (error) {
      console.error('Error in Portfolio useEffect:', error);
    }

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/11.webp')"}}>
        <div className="container position-relative">
          <h1>Portfolio</h1>
          <p>Explore our collection of stunning photography and cinematic works</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Portfolio</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        {/* Intro Section */}
        <section className="portfolio-intro pb-0">
          <div
            className="container section-title portfolioHeader"
            data-aos="fade-up"
          >
            <h2>Experience Our Art</h2>
            <p>
              With an unwavering passion for storytelling and a keen eye for
              detail, we've curated a portfolio that beautifully embodies our
              creative vision. Our work spans diverse cultures, stunning
              destinations, and unique traditions, each moment preserved with
              elegance and soul.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="portfolio-gallery pt-3">
          <div
            className="container"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="gallery-grid">
              {portfolioImages.map((image, index) => (
                <div
                  key={index}
                  className="gallery-item"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <a
                    href={image}
                    className="glightbox"
                    data-gallery="portfolio"
                  >
                    <img src={image} alt={`Portfolio ${index + 1}`} className="img-fluid" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
};

export default Portfolio;
