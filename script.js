document.addEventListener('DOMContentLoaded', () => {
    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    if (hamburger && navLinks) {
      // Toggle menu on hamburger click
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
  
      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
  
        if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }
  
    // Hero section functionality
    const gridImages = document.querySelectorAll('.grid-image');
    const textSpans = document.querySelectorAll('.hero-text span');
  
    // Add event listeners for each image
    gridImages.forEach((image) => {
      image.addEventListener('mouseenter', () => {
        // Scale and elevate the hovered image
        image.style.zIndex = '10';
        image.style.transform = 'scale(1.2)';
        image.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  
        // Make text fill transparent, keep border, and move behind
        textSpans.forEach((span) => {
          span.style.color = 'transparent'; // Hide text fill
          span.style.transform = `translateZ(-200px) rotate(${span.style.getPropertyValue('--rotate') || '0deg'})`;
          span.parentElement.style.zIndex = '0'; // Send text behind images
        });
      });
  
      image.addEventListener('mouseleave', () => {
        // Reset image styles
        image.style.zIndex = '1';
        image.style.transform = 'scale(1)';
        image.style.boxShadow = 'none';
  
        // Reset text styles
        textSpans.forEach((span) => {
          span.style.color = 'white'; // Restore text fill
          span.style.transform = `rotate(${span.style.getPropertyValue('--rotate') || '0deg'})`; // Reset to original rotation
          span.parentElement.style.zIndex = '3'; // Bring text back to front
        });
      });
    });
  });
