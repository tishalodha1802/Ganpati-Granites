import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initWebGL } from './webgl.js'

gsap.registerPlugin(ScrollTrigger)

document.addEventListener('DOMContentLoaded', () => {
  // Init 3D Scene
  initWebGL();

  // Hero Animations (Advanced Stagger Text Reveal)
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Reset opacity manually in case CSS had it hidden
  gsap.set('.hero-title', { opacity: 1 }); 

  heroTimeline
    .fromTo('.word', 
      { y: 150, rotationZ: 5 }, 
      { y: 0, rotationZ: 0, duration: 1.2, stagger: 0.1, delay: 0.2 }
    )
    .to('.hero-subtitle', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
    .to('.explore-btn', { y: 0, opacity: 1, duration: 1 }, '-=0.8');

  // About Section Scroll Animation (Professional)
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 90%', // Start animation earlier
      end: 'center 40%', // Extend the end point to make the scroll take longer
      scrub: 2.5, // Increase scrub value to make the animation feel "slower" and smoother
    }
  });

  aboutTl
    .from('.about-image', { x: -300, opacity: 0, duration: 1, ease: 'power2.out' })
    .from('.about-text-content', { x: 300, opacity: 0, duration: 1, ease: 'power2.out' }, '<') // '<' makes them start at the exact same time
    .from('.signature', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');

  // About Image Parallax
  gsap.to('.image-inner', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: '10%',
    ease: 'none'
  });

  // Collections Gallery Parallax Scroll Animation
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    
    // Fade & Slide up
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
      y: 100,
      opacity: 0,
      duration: 1,
      delay: (i % 3) * 0.15,
      ease: 'power3.out'
    });

    // Inner Image Parallax
    const img = item.querySelector('img');
    gsap.to(img, {
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: 30, // Parallax movement distance
      ease: 'none'
    });
  });

  // Enquiry Section Animation
  gsap.from('.enquiry-form', {
    scrollTrigger: {
      trigger: '.enquiry',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
});
