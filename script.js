document.addEventListener('DOMContentLoaded', () => {

    // --- 0. 4-SECOND LOADING SCREEN ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 4000); // Wait exactly 4 seconds
    }
    
    // --- 1. SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset slightly before entering screen
    });

    // Make sure elements start observing
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 1.5 SHOWCASE HORIZONTAL CAROUSEL ---
    const showcaseTrack = document.querySelector('.showcase-carousel-track');
    const showcaseSlides = document.querySelectorAll('.showcase-slide');
    const showcasePrevBtn = document.querySelector('.prev-showcase-btn');
    const showcaseNextBtn = document.querySelector('.next-showcase-btn');
    
    let showcaseIndex = 0;

    const updateShowcaseCarousel = () => {
        if (!showcaseTrack || showcaseSlides.length === 0) return;
        
        // Remove active class from all slides and add to active one
        showcaseSlides.forEach((slide, index) => {
            if (index === showcaseIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Center active slide
        const wrapper = showcaseTrack.parentElement;
        if (wrapper) {
            const wrapperWidth = wrapper.getBoundingClientRect().width;
            const activeSlide = showcaseSlides[showcaseIndex];
            const slideWidth = activeSlide.getBoundingClientRect().width;
            
            // Calculate slide offset relative to track using offsetLeft
            const slideLeft = activeSlide.offsetLeft;
            
            // Translate track
            const translateX = (wrapperWidth / 2) - (slideLeft + slideWidth / 2);
            showcaseTrack.style.transform = `translateX(${translateX}px)`;
        }
    };

    if (showcasePrevBtn && showcaseNextBtn && showcaseSlides.length > 0) {
        showcaseNextBtn.addEventListener('click', () => {
            if (showcaseIndex < showcaseSlides.length - 1) {
                showcaseIndex++;
            } else {
                showcaseIndex = 0; // Wrap around
            }
            updateShowcaseCarousel();
        });

        showcasePrevBtn.addEventListener('click', () => {
            if (showcaseIndex > 0) {
                showcaseIndex--;
            } else {
                showcaseIndex = showcaseSlides.length - 1; // Wrap around
            }
            updateShowcaseCarousel();
        });

        // Initialize carousel
        updateShowcaseCarousel();
        
        // Re-center on resize
        window.addEventListener('resize', updateShowcaseCarousel);
        
        // Re-center when window is fully loaded (images are complete)
        window.addEventListener('load', updateShowcaseCarousel);
        
        // Also wait briefly for fonts/images to layout correctly and update
        setTimeout(updateShowcaseCarousel, 100);

        // Auto-scroll logic (every 5 seconds)
        let showcaseAutoSlide = setInterval(() => {
            showcaseNextBtn.click();
        }, 5000);

        const resetShowcaseInterval = () => {
            clearInterval(showcaseAutoSlide);
            showcaseAutoSlide = setInterval(() => {
                showcaseNextBtn.click();
            }, 5000);
        };

        // Reset timer on click controls
        showcaseNextBtn.addEventListener('click', resetShowcaseInterval);
        showcasePrevBtn.addEventListener('click', resetShowcaseInterval);

    }


    // --- 2. SERVICES INTERACTIVE ACCORDION & PREVIEW PANEL ---
    const serviceItems = document.querySelectorAll('.service-item');
    const previewImg = document.getElementById('service-preview-img');
    const browserUrlText = document.querySelector('.browser-url');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;

            // Remove active state from other items
            serviceItems.forEach(i => i.classList.remove('active'));

            // Set current item as active
            item.classList.add('active');

            // Retrieve data fields
            const newImage = item.getAttribute('data-image');
            const newLink = item.getAttribute('data-link');

            if (previewImg && newImage) {
                // Fade out current preview image
                previewImg.style.opacity = '0';
                previewImg.style.transform = 'scale(0.98)';

                setTimeout(() => {
                    // Update preview and fade back in
                    previewImg.src = newImage;
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = 'scale(1)';
                }, 300);
            }

            if (browserUrlText && newLink) {
                // Update URL text to match the vercel deployment link
                const cleanUrl = newLink.replace('https://', '');
                browserUrlText.textContent = cleanUrl;
            }
        });
    });


    // --- 3. CLIENTS FEEDBACK CAROUSEL ---
    const track = document.querySelector('.feedback-track');
    const slides = Array.from(document.querySelectorAll('.feedback-slide'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;

    const updateSliderPosition = () => {
        if (!track) return;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSliderPosition();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Loop to end
            }
            updateSliderPosition();
        });

        // Auto-slide testimonials every 6 seconds
        let autoSlide = setInterval(() => {
            nextBtn.click();
        }, 6000);

        // Clear interval on user click interaction
        const resetInterval = () => {
            clearInterval(autoSlide);
            autoSlide = setInterval(() => {
                nextBtn.click();
            }, 6000);
        };

        nextBtn.addEventListener('click', resetInterval);
        prevBtn.addEventListener('click', resetInterval);
    }

    // --- 4. CONTACT FORM FRONTEND LOCAL STORAGE STORAGE & RESET ---
    const contactForm = document.getElementById('insta-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            // Retrieve field inputs
            const nameVal = document.getElementById('user-name').value;
            const emailVal = document.getElementById('user-email').value;
            const messageVal = document.getElementById('user-message').value;

            // Formulate submission object for Web3Forms
            const submission = {
                access_key: "058cff5b-a1a2-4d9f-888d-655c3d1b48ee",
                name: nameVal,
                email: emailVal,
                message: messageVal
            };

            // Send data to Web3Forms API to email it directly to you
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(submission)
            }).then(response => {
                if (!response.ok) {
                    console.error("Failed to send submission to Web3Forms.");
                } else {
                    console.log("Submission successfully sent to your email!");
                }
            }).catch(err => {
                console.error("Error communicating with server:", err);
            });

            // Empty/clean form inputs
            contactForm.reset();
            
            // Alert user that message was sent
            alert("Thank you! Your message has been sent successfully.");
        });
    }
});
