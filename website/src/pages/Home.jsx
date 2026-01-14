import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoryModal from '../components/StoryModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  console.log('Home component rendering');
  const slides = [
    {
      image: '/assets/img/slider/hero6.jpg',
      title: 'Where Dreams Meet Reality',
      subtitle: 'Capturing your most precious moments with elegance and grace.'
    },
    {
      image: '/assets/img/slider/4.jpg',
      title: 'Timeless Moments Captured',
      subtitle: 'Preserving the beauty of your special day forever.'
    },
    {
      image: '/assets/img/slider/11.jpg',
      title: 'Elegant Photography & Films',
      subtitle: 'Transforming your love story into cinematic memories.'
    }
  ];
  const storyData = {
    "komal-kunal": {
      title: "Aanya & Rohit",
      subtitle: "The Golden Leaf Resort, Dhule",
      description: `
        Aanya and Rohit's journey is a beautiful blend of warmth, destiny, and heartfelt moments. What began as a simple connection slowly grew into a bond filled with trust, understanding, and companionship. Their love strengthened through shared dreams, thoughtful conversations, and unwavering support. Together, they continue to create memories that reflect a deep, genuine, and lifelong commitment.
      `,
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
      ]
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  useEffect(() => {
    let preloaderTimeout;
    let aosTimeout;
    try {
      // Set body class
      document.body.className = 'index-page';
      
      // Hide preloader after component mounts
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloaderTimeout = setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.style.display = 'none';
          }
        }, 500);
      }
      
      // Initialize AOS if available
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
        
        // Refresh AOS after a short delay to ensure all elements are rendered
        aosTimeout = setTimeout(() => {
          if (window.AOS) {
            window.AOS.refresh();
          }
        }, 100);
      }
      
      // Fetch Instagram posts
      const fetchInstagramPosts = async () => {
        const accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || 'YOUR_INSTAGRAM_ACCESS_TOKEN';
        const accountId = process.env.REACT_APP_INSTAGRAM_ACCOUNT_ID || 'YOUR_INSTAGRAM_ACCOUNT_ID';
        if (accessToken === 'YOUR_INSTAGRAM_ACCESS_TOKEN' || accountId === 'YOUR_INSTAGRAM_ACCOUNT_ID') {
          console.log('Please set your Instagram access token and account ID in environment variables');
          return;
        }
        try {
          const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${accessToken}`);
          const data = await response.json();
          if (data.data) {
            setInstagramPosts(data.data.filter(post => post.media_type === 'IMAGE').slice(0, 6));
          }
        } catch (error) {
          console.error('Error fetching Instagram posts:', error);
        }
      };
      fetchInstagramPosts();
      
      // Initialize other vendor libraries
      if (typeof window !== 'undefined') {
        // Initialize GLightbox
        if (window.GLightbox) {
          const lightbox = window.GLightbox({
            selector: '.glightbox'
          });
        }
      }
    } catch (error) {
      console.error('Error in Home useEffect:', error);
    }
    
    return () => {
      if (preloaderTimeout) clearTimeout(preloaderTimeout);
      if (aosTimeout) clearTimeout(aosTimeout);
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero dark-background">
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            loop={true}
            navigation={true}
            className="hero-slider"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="hero-video-container">
                  <img src={slide.image} className="img-fluid " alt="" />
                  <div className="hero-overlay"></div>
                </div>

                <div className="container hfull" data-aos="fade-up" data-aos-delay="100">
                  <div className="row justify-content-center text-center">
                    <div className="col-lg-8">
                      <div className="hero-content">
                        <h1 data-aos="fade-up" data-aos-delay="200">{slide.title}</h1>
                        <p data-aos="fade-up" data-aos-delay="300">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              
              <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right" data-aos-delay="200">
                <div className="content section-title">
                  <h2 className="section-heading mb-4 text-center section-title" data-aos="fade-up">
                    Preserving Pure Emotion in Every Frame
                  </h2>

                  <p className="description-text my-3 text-left">
                    Welcome to <span>The Patil Photography & Film's,</span> where every love story is transformed
                    into an elegant visual masterpiece. We believe that every couple shares a unique bond, and our 
                    passion lies in capturing the emotions, details, and unspoken moments that define your journey.
                  </p>

                  <p className="description-text mb-3 text-left">
                    With a refined blend of creativity and authenticity, we preserve heartfelt smiles, gentle glances, 
                    and the timeless charm that unfolds throughout your special day. From grand celebrations to intimate 
                    memories, our craft is dedicated to telling stories that reflect your love, connection, and personality.
                  </p>

                  <p className="description-text mb-3 text-left">
                    Explore our curated gallery — a world of emotions, artistry, and real moments captured with soul 
                    and sincerity. Let us narrate your story through our lens, where every frame becomes a cherished 
                    memory, preserved forever with elegance.
                  </p>

                  <div className="cta-section text-lg-start" data-aos="fade-up" data-aos-delay="450">
                    <Link to="/portfolio" className="cta-link">
                      Explore Our Services
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay="200">
                <div className="image-section mx-5 my-5">
                  <div className="main-image">
                    <img src="/assets/img/HomePage/7.webp" alt="showcase" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials section">
          <div className="container section-title" data-aos="fade-up">
            <h2>From the Hearts of Our Couples</h2>
          </div>

          <div className="container">
            <div className="testimonial-masonry">
              
              <div className="testimonial-item" data-aos="fade-up">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "Every picture from our wedding felt like a movie scene. <strong>The Patil Photography</strong> team
                    captured not just our moments but our emotions. Their attention to detail, lighting, and storytelling is
                    pure luxury. We'll treasure these memories forever."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="/assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Riya & Kunal</h3>
                      <span className="position">Mumbai</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-item highlight" data-aos="fade-up" data-aos-delay="100">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "<strong>The Patil Photography and Film's</strong> made our wedding look like a film — every frame
                    spoke of love, grace, and timelessness. Their professionalism, creativity, and luxury touch made our big
                    day unforgettable."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="/assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Simran & Dev</h3>
                      <span className="position">Nashik</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-item" data-aos="fade-up" data-aos-delay="200">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "From the first meeting to our final album, everything was seamless and classy. The team made us feel
                    so comfortable, and the final photos were beyond beautiful — elegant, cinematic, and full of heart. It
                    truly felt like we were part of an exclusive experience."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="/assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Aarav & Meera</h3>
                      <span className="position">Pune</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="container px-5 pt-4" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-center Quite py-2">
            "Love's journey is written in small moments — the smiles, the glances, the warmth —
            each deserving to be held forever."
          </h2>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section pt-3">
          <div className="container section-title text-center" data-aos="fade-up">
            <h2>Our Latest Love Stories</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                Every couple carries a beautiful story of their own, and it's our privilege to capture those 
                timeless moments meant to be cherished for generations.
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              
              {/* Project Cards */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/16.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Aanya & Rohit</h4>
                    <p className="project-description">
                      Aanya and Rohit's journey began in Mumbai, where an unexpected meeting grew into a deep, 
                      effortless connection Their contrasting personalities.....
                    </p>
                    <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/128.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Riya & Kunal</h4>
                    <p className="project-description">
                      Riya and Kunal's love story began with a simple conversation that felt unexpectedly special. 
                      What started as friendship soon blossomed into a deep....
                    </p>
                  <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/7.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Aarav & Meera</h4>
                    <p className="project-description">
                      Aarav and Meera's story began with a connection that felt instantly comforting. Their shared values, 
                      effortless conversations, and genuine care brought....
                    </p>
                     <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/18.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Aanya & Rohit</h4>
                    <p className="project-description">
                      Aanya and Rohit's bond began with a warm connection that instantly felt special...
                    </p>
                    <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="100">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/3.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Mehr & Kashyap</h4>
                    <p className="project-description">
                      A friendship that turned into love, built on trust and understanding...
                    </p>
             <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="100">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="project-card">
                  <div className="project-image">
                    <img src="/assets/img/HomePage/11.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Komal & Kunal</h4>
                    <p className="project-description">
                      Meant to be together, their journey is filled with warmth and beautiful memories...
                    </p>
             <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <a href="#" className="cta-link" onClick={(e) => { e.preventDefault(); setSelectedStory('komal-kunal'); setShowModal(true); }}>
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="d-flex justify-content-center">
              <Link to="/projects" className="submit-btn">
                <span>View All Stories</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Instagram Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="container section-title" data-aos="fade-up">
              <h2>As Seen on Instagram</h2>
            </div>
            <div className="container">
              <div className="row g-3">
                {instagramPosts.map(post => (
                  <div key={post.id} className="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                      <img src={post.media_url} alt={post.caption || 'Instagram post'} className="img-fluid rounded shadow-sm" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <StoryModal show={showModal} onHide={() => setShowModal(false)} story={storyData[selectedStory]} />

      <Footer />

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </>
  );
};

export default Home;