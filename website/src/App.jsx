import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'

// Lazy load components
const About = lazy(() => import('./pages/About'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Stories = lazy(() => import('./pages/Stories'))
const Contact = lazy(() => import('./pages/Contact'))
const Films = lazy(() => import('./pages/Films'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Quote = lazy(() => import('./pages/Quote'))
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  console.log('App component rendering');
  useEffect(() => {
    console.log('App useEffect running');
    // Initialize AOS globally
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
    // Initialize scroll top button
    const toggleScrolled = () => {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    };

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    // Scroll top functionality
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      const toggleScrollTop = () => {
        if (scrollTop) {
          window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
      };
      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
    }

    return () => {
      document.removeEventListener('scroll', toggleScrolled);
      window.removeEventListener('load', toggleScrolled);
    };
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center', fontSize: '20px' }}>Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/service-details" element={<ServiceDetails />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/project-details" element={<ProjectDetails />} />
            <Route path="/films" element={<Films />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App