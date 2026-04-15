window.addEventListener("DOMContentLoaded", () => {
    // This targets the cards as they are
    gsap.from(".card", {
        y: 100,              // Slide up from 100px lower than their CSS position
        rotation: -10,       // Start with a bit more tilt than the CSS has
        duration: 1.5,       // Take 1.5 seconds to settle
        stagger: 0.1,        // One by one
        ease: "expo.out",    // The "luxury" feeling curve (fast then slow)
    });
});

const nav = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  // If we scroll down more than 50px, hide the nav
  if (window.scrollY > lastScrollY && window.scrollY > 50) {
    nav.classList.add('hide');
  } 
  // If we scroll up, show the nav
  else {
    nav.classList.remove('hide');
  }
  
  lastScrollY = window.scrollY;
});
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
  } else {
    nav.style.backgroundColor = "transparent";
    nav.style.borderBottom = "none";
  }
});