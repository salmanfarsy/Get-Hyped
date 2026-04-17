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

gsap.utils.toArray(".expertise_card").forEach((card, i) => {
  gsap.to(card, {
    scale: 1,
    opacity: 1,
    scrollTrigger: {
      trigger: card,
      start: "top 10%", // When the card is sticky
      endTrigger: ".expertise_section",
      end: "bottom bottom",
      scrub: true,
      pinSpacing: false,
    }
  });
});
const workCards = document.querySelectorAll('.work-card');

workCards.forEach(card => {
  const video = card.querySelector('video');

  card.addEventListener('mouseenter', () => {
    // 1. Play the video
    video.play();
  });

  card.addEventListener('mouseleave', () => {
    // 2. Pause the video
    video.pause();
    
    // 3. This is the magic part:
    // Calling .load() resets the video element entirely, 
    // which forces the 'poster' image to show up again.
    video.load(); 
  });
});

const slider = document.querySelector('.logo-marquee-wrapper');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
});

slider.addEventListener('mouseup', () => {
  isDown = false;
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // Scroll speed
  slider.scrollLeft = scrollLeft - walk;
});
// Register GSAP (Make sure you have the CDN in your HTML)
const allBoxes = document.querySelectorAll('.logo-item');
const marqueeTrack = document.querySelector('.logo-track');

allBoxes.forEach(box => {
  // 1. When you click and hold ANY box
  box.addEventListener('mousedown', () => {
    
    allBoxes.forEach((item, index) => {
      // Create a unique "messy" tilt for every box
      const randomRot = gsap.utils.random(-6, 6);
      const randomScale = gsap.utils.random(0.92, 0.98);
      const randomY = gsap.utils.random(-10, 10);

      gsap.to(item, {
        rotation: randomRot,
        scale: randomScale,
        y: randomY,
        duration: 0.4,
        ease: "back.out(1.7)", // Gives it that "pop" feel
        overwrite: true
      });
    });
    
    // Optional: Slow down the marquee while holding
    gsap.to(marqueeTrack, { timeScale: 0.2, duration: 0.5 });
  });

  // 2. When you let go (anywhere on the screen)
  window.addEventListener('mouseup', () => {
    allBoxes.forEach((item) => {
      gsap.to(item, {
        rotation: 0,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)", // The "jiggle" when released
        overwrite: true
      });
    });
    
    // Resume marquee speed
    gsap.to(marqueeTrack, { timeScale: 1, duration: 0.5 });
  });
});


// here is the brand track logic for the scroll
const track = document.querySelector(".logo-track");
const boxes = document.querySelectorAll(".logo-item");

// 1. Calculate the exact width of one set (the "loop point")
// We divide by 2 because you have two identical sets of logos.
const loopWidth = track.offsetWidth / 2;

// 2. The Automatic Scroll
let scrollTween = gsap.to(track, {
  x: -loopWidth,
  duration: 30,
  ease: "none",
  repeat: -1,
  modifiers: {
    // This is the "magic" that prevents the gap. 
    // It keeps the 'x' value between 0 and -loopWidth.
    x: gsap.utils.unitize(x => parseFloat(x) % loopWidth)
  }
});

// 3. The Draggable Logic
Draggable.create(track, {
  type: "x",
  trigger: ".logo-marquee-wrapper",
  onPress: () => {
    // Stop the auto-scroll when grabbing
    scrollTween.pause();
  },
  onDrag: function() {
    // Ensure the drag also loops seamlessly
    gsap.set(this.target, {
      x: this.x % loopWidth
    });
  },
  onRelease: () => {
    // Resume auto-scroll when letting go
    scrollTween.play();
  }
});