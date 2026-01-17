import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoryModal from "../components/StoryModal";

const storiesData = [
  {
    id: "komal-kunal",
    title: "Aanya & Rohit",
    location: "The Golden Leaf Resort, Dhule",
    cardImage: "/assets/img/HomePage/16.webp",
    shortDesc:
      "Aanya and Rohit's journey began with an effortless connection that grew into something truly special...",
    description:
      "Aanya and Rohit's journey is a beautiful blend of warmth, destiny, and heartfelt moments. What began as a simple connection slowly grew into a bond filled with trust, understanding, and companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "riya-kunal",
    title: "Riya & Kunal",
    location: "Pune",
    cardImage: "/assets/img/HomePage/128.webp",
    shortDesc:
      "Riya and Kunal's love story began with a simple conversation that felt unexpectedly special...",
    description:
      "What started as friendship soon blossomed into a relationship built on trust, laughter, and shared dreams.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
   ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
  {
    id: "aarav-meera",
    title: "Aarav & Meera",
    location: "Mumbai",
    cardImage: "/assets/img/HomePage/7.webp",
    shortDesc:
      "Aarav and Meera found comfort and connection in each other from the very beginning...",
    description:
      "Their story is filled with warmth, understanding, and moments that define true companionship.",
    images: [
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
        "/assets/img/HomePage/11.webp",
        "/assets/img/HomePage/18.webp",
    ],
  },
];

const Stories = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    try {
      document.body.className = "Stories-page";
    } catch (error) {
      console.error('Error in Stories useEffect:', error);
    }
    return () => (document.body.className = "");
  }, []);

  const openStory = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/128.webp')"}}>
        <div className="container position-relative">
          <h1>Stories</h1>
          <p>Real love stories captured through our lens</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Stories</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        {/* Intro */}
        <section className="portfolio-intro pb-0">
          <div
            className="container section-title text-center portfolioHeader"
            data-aos="fade-up"
          >
            <h2 className="mb-3">Moments That Become Forever</h2>
            <p>Beyond rituals and celebrations, we capture genuine emotions and meaningful moments—crafted into timeless love stories.
            </p>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="projects section pt-3">
          <div className="container">
            <div className="row gy-4">
              {storiesData.map((story, index) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={story.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="project-card">
                    <div className="project-image">
                      <img
                        src={story.cardImage}
                        alt={story.title}
                        className="img-fluid"
                      />
                    </div>

                    <div className="project-info">
                      <h4 className="project-title">{story.title}</h4>
                      <p className="project-description">{story.shortDesc}</p>

                      <a
                        href="#"
                        className="cta-link"
                        onClick={(e) => {
                          e.preventDefault();
                          openStory(story);
                        }}
                      >
                        View Story <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedStory && (
          <StoryModal
            show={showModal}
            onHide={() => setShowModal(false)}
            story={selectedStory}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export default Stories;
