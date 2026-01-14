import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const filmsData = [
  { id: 1, youtubeUrl: "https://www.youtube.com/watch?v=urjgpjDPKcI" },
  { id: 2, youtubeUrl: "https://www.youtube.com/watch?v=AP2dbnvNExo" },
  { id: 3, youtubeUrl: "https://www.youtube.com/watch?v=3afVyp02zts" },
  { id: 4, youtubeUrl: "https://www.youtube.com/watch?v=NmMNsNe63LA" },
  { id: 5, youtubeUrl: "https://www.youtube.com/watch?v=883-sTHsKCY" },
  { id: 6, youtubeUrl: "https://www.youtube.com/watch?v=wFxTjQhpmxo" },
];

// Extract YouTube ID
const getYouTubeId = (url) => {
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const Films = () => {
  useEffect(() => {
    document.body.className = "portfolio-page";

    if (window.GLightbox) {
      window.GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
      });
    }

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />

      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{ backgroundImage: "url('/assets/img/HomePage/84.webp')" }}
        >
          <div className="container position-relative text-center">
            <h1>Our Films</h1>
            <p>
              Capturing life’s most precious moments through cinematic
              storytelling
            </p>
                    <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Films</li>
            </ol>
          </nav>
          </div>

        </div>

        {/* Films Section */}
        <section className="section py-5">
           <div className="container">
          <div className="section-title text-center portfolioHeader"  data-aos="fade-up">
              <h2>A Cinematic Journey of Love</h2>
              <p className="text-muted mt-2">
               Cinematic love stories crafted to capture the emotion, joy, and beauty of your wedding day—preserving every precious moment for a lifetime.
              </p>
            </div>

            <div className="films-grid">
              {filmsData.map((film) => {
                const videoId = getYouTubeId(film.youtubeUrl);
                const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                return (
                  <a
                    key={film.id}
                    href={film.youtubeUrl}
                    className="glightbox film-card shadow-sm"
                    data-gallery="films"
                  >
                    <div className="film-thumb">
                      <img src={thumbnail} alt="Wedding Film" />

                      <div className="film-overlay">
                        <div className="play-btn">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
       </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Films;
