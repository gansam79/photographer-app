import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const Films = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = "portfolio-page";

    fetch("/api/films")
      .then(res => res.json())
      .then(data => {
        const activeFilms = data.filter(f => f.status === "Active");
        setFilms(activeFilms);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      document.body.className = "";
    };
  }, []);

  // Initialize GLightbox
  useEffect(() => {
    if (!loading && window.GLightbox) {
      // Destroy existing lightbox instance if any?
      // Usually safe to just init
      const lightbox = window.GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
      });
    }
  }, [loading, films]);

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
            <div className="section-title text-center portfolioHeader" data-aos="fade-up">
              <h2>A Cinematic Journey of Love</h2>
              <p className="text-muted mt-2">
                Cinematic love stories crafted to capture the emotion, joy, and beauty of your wedding day—preserving every precious moment for a lifetime.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-gold-500" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="films-grid">
                {films.length > 0 ? films.map((film) => {
                  const videoId = getYouTubeId(film.youtubeUrl);
                  if (!videoId) return null;
                  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                  return (
                    <a
                      key={film._id}
                      href={film.youtubeUrl}
                      className="glightbox film-card shadow-sm"
                      data-gallery="films"
                      data-title={film.title}
                      data-description={film.category}
                    >
                      <div className="film-thumb">
                        <img src={thumbnail} alt={film.title} />

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
                      <div className="mt-2 text-center">
                        <h5 className="text-sm font-semibold mb-0">{film.title}</h5>
                        <p className="text-xs text-muted">{film.category}</p>
                      </div>
                    </a>
                  );
                }) : (
                  <div className="col-12 text-center">
                    <p>No films found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Films;
