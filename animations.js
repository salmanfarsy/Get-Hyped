window.addEventListener("DOMContentLoaded", () => {
    // This targets the cards as they are
    gsap.from(".card", {
    y: 100,
    // (i) is the index of the card (0, 1, 2...)
    rotation: (i) => {
        const tilts = [10, -15, -18, 5]; // Manually set the "vibe" for each card
        return tilts[i % tilts.length]; // Cycle through them
    },
    duration: 1.8,
    stagger: 0,
    ease: "expo.out",
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

gsap.utils.toArray(".expertise_card").forEach((card, i, cards) => {
  const isLast = i === cards.length - 1;

  // Create a timeline for each card
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top 10%", // When card hits the sticky point
      endTrigger: ".expertise_section",
      end: "bottom bottom",
      scrub: true,
      pinSpacing: false,
    }
  });

  // If this isn't the last card, make it shrink as the NEXT one comes in
  if (!isLast) {
    tl.to(card, {
      scale: 0.9,      // Shrinks slightly
      opacity: 1,    // Fades out
      ease: "none"
    });
  }
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
// this is for the nav menu animation

const navItems = document.querySelectorAll('.nav_item');

navItems.forEach(item => {
  const wrapper = item.querySelector('.nav_item-wrapper');
  
  item.addEventListener('mouseenter', () => {
    // Kill any running animation to prevent fighting
    gsap.to(wrapper, {
      y: -47,
      duration: 0.5,
      ease: "back.out(1.7)",
      overwrite: true // Ensures smooth transition if you hover quickly
    });
  });

  item.addEventListener('mouseleave', () => {
    gsap.to(wrapper, {
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)", // Now it bounces at the bottom too!
      overwrite: true
    });
  });
});

// humberger animation
// Make sure this is at the very top of your JS
gsap.registerPlugin(); 

const menuToggle = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.close-menu');
const fullMenu = document.querySelector('.full-menu');

// Create the timeline
const menuTl = gsap.timeline({ 
  paused: true,
  onStart: () => {
    // Enable clicks when opening
    gsap.set(fullMenu, { pointerEvents: 'auto' });
  },
  onReverseComplete: () => {
    // Disable clicks when closed so you can click things behind it
    gsap.set(fullMenu, { pointerEvents: 'none' });
  }
});

// The Animation
menuTl.to(fullMenu, {
  autoAlpha: 1, // This handles both opacity and visibility:visible
  duration: 0.4,
  ease: "power2.inOut"
});

menuTl.from(".nav_menu-vertical .nav_item", {
  y: 40,
  opacity: 1,
  stagger: 0.1,
  duration: 0.4,
  ease: "back.out(1.7)"
}, "-=0.2");

// Event Listeners
menuToggle.addEventListener('click', () => {
  console.log("Menu opening..."); // Check your console to see if this prints
  menuTl.play();
});

closeBtn.addEventListener('click', () => {
  menuTl.reverse();
});

// logo animation at the footer
const footer = document.querySelector('.footer-top');
const logoSrc = "./assets/logo.svg"; // Path to your logo

let lastMouseX = 0;
let lastMouseY = 0;
const threshold = 200; // New logo every 50px of movement

footer.addEventListener("mousemove", (e) => {
  const rect = footer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Calculate distance from last logo spawn
  const distance = Math.hypot(x - lastMouseX, y - lastMouseY);

  if (distance > threshold) {
    createLogo(x, y);
    lastMouseX = x;
    lastMouseY = y;
  }
});

function createLogo(x, y) {

const colors = ['#f8b4f4', '#ff5c35', '#7B61FF', '#ffffff', '#75f0b6ff']; 
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const img = document.createElement("img");
  img.src = logoSrc;
  img.classList.add("trail-logo");
  
  // 2. Apply the random color to the logo's background
  img.style.backgroundColor = randomColor;
  img.src = logoSrc;
  img.classList.add("trail-logo");
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  footer.appendChild(img);

  // Create a timeline so we can control the "Stay" time
  const tl = gsap.timeline({
    onComplete: () => img.remove()
  });

  tl.fromTo(img, 
    { scale: 0, rotation: gsap.utils.random(-20, 20), opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
  );

  // This adds a "wait" period of 1 second before the next animation starts
  tl.to(img, {
    opacity: 0,
    scale: 0.8,
    y: -20,       // Slight float upward makes it feel more "ghostly"
    duration: 1.5, // Slow fade out
    delay: 1       // <--- CHANGE THIS to control how long it stays solid
  });
}


// work card arrow animation
const cards = document.querySelectorAll('.work-card');

cards.forEach(card => {
  const arrowInner = card.querySelector('.inner-arrow');
  
  const arrowTl = gsap.timeline({ paused: true });

  arrowTl
    // 1. Shoot out (top right)
    .to(arrowInner, {
      x: 30,
      y: -30,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    })
    // 2. Teleport (bottom left)
    .set(arrowInner, {
      x: -30,
      y: 30,
      opacity: 0
    })
    // 3. Slide back in
    .to(arrowInner, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(2)"
    });

  card.addEventListener('mouseenter', () => arrowTl.restart());
});


// work card section video autoplay and remove the poster
function handleMobileVideo() {
  const videos = document.querySelectorAll('video');
  const isMobile = window.innerWidth <= 768;

  videos.forEach(video => {
    if (isMobile) {
      // 1. Remove the poster to allow immediate playback
      video.removeAttribute('poster');
      
      // 2. Force the autoplay attributes
      video.setAttribute('autoplay', 'true');
      
      // 3. Manually trigger play (necessary for some mobile browsers)
      video.play().catch(error => {
        console.log("Autoplay was prevented, but poster is removed.");
      });
    }
  });
}

// Run on load
handleMobileVideo();

// Run on resize (optional, in case they flip their phone to landscape)
window.addEventListener('resize', handleMobileVideo);

// the footer badge animation
gsap.to(".footer-badge svg", {
  rotation: 20, // Rotate clockwise to 15 degrees
  scrollTrigger: {
    trigger: ".footer", // Starts animating when the footer enters
    start: "top bottom", 
    end: "bottom top",
    scrub: 1, // Smoothly follows the scrollbar
  }
});