
/* =====================================================
   GRACE HORIZON INTERNATIONAL SCHOOL
   HERO TEXT ANIMATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // The words that will appear automatically
    const words = [
        "Flourish.",
        "Grow.",
        "Shine.",
        "Excel.",
        "Thrive.",
        "Lead."
    ];

    // Find the changing word in the hero section
    const changingWord = document.querySelector(".changing-word");

    if (!changingWord) return;

    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    const typingSpeed = 110;
    const deletingSpeed = 65;
    const pauseAfterWord = 2200;
    const pauseBeforeNextWord = 350;

    function animateWords() {

        const currentWord = words[wordIndex];

        if (isDeleting) {
            letterIndex--;
        } else {
            letterIndex++;
        }

        changingWord.textContent = currentWord.substring(
            0,
            letterIndex
        );

        let nextDelay = isDeleting
            ? deletingSpeed
            : typingSpeed;

        // When a word is fully typed
        if (!isDeleting && letterIndex === currentWord.length) {
            isDeleting = true;
            nextDelay = pauseAfterWord;
        }

        // When the word has been deleted
        else if (isDeleting && letterIndex === 0) {
            isDeleting = false;

            wordIndex = (wordIndex + 1) % words.length;

            nextDelay = pauseBeforeNextWord;
        }

        setTimeout(animateWords, nextDelay);
    }

    // Start with Flourish visible
    changingWord.textContent = words[0];
    letterIndex = words[0].length;
    isDeleting = true;

    // Wait before changing the first word
    setTimeout(animateWords, pauseAfterWord);

});

/* ==========================================
   AUTOMATIC HERO IMAGE SLIDESHOW
   ========================================== */

const heroSlides = document.querySelectorAll(".hero-slide");

let currentSlide = 0;

if (heroSlides.length > 1) {

    // Start with the first photograph
    heroSlides.forEach((slide, index) => {
        slide.classList.toggle("active", index === 0);
    });

    // Automatically change every 5 seconds
    setInterval(() => {

        heroSlides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % heroSlides.length;

        heroSlides[currentSlide].classList.add("active");

    }, 5000);

}

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    // =====================================
    // GALLERY ELEMENTS
    // =====================================

    const galleryItems = [
        ...document.querySelectorAll(".gallery-item")
    ];

    const filterButtons = document.querySelectorAll(".filter-btn");

    const emptyMessage = document.querySelector(
        ".gallery-empty-message"
    );

    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");

    const closeButton = document.querySelector(".lightbox-close");
    const previousButton = document.querySelector(".lightbox-prev");
    const nextButton = document.querySelector(".lightbox-next");

    let visibleItems = [...galleryItems];
    let currentIndex = 0;
    let lastFocusedElement = null;


    // =====================================
    // FILTER GALLERY
    // =====================================

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            galleryItems.forEach(item => {

                const category = item.dataset.category;

                const shouldShow =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                item.hidden = !shouldShow;
            });

            visibleItems = galleryItems.filter(item => !item.hidden);

            if (emptyMessage) {
                emptyMessage.hidden = visibleItems.length > 0;
            }

            closeLightbox();
        });
    });


    // =====================================
    // DISPLAY A PHOTO
    // =====================================

    function displayPhoto(index) {

        if (!visibleItems.length) return;

        currentIndex = (
            index + visibleItems.length
        ) % visibleItems.length;

        const item = visibleItems[currentIndex];

        const image = item.querySelector("img");
        const title = item.querySelector(".gallery-overlay h3");

        if (!image) return;

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;

        lightboxCaption.textContent = title
            ? title.textContent
            : image.alt;
    }


    // =====================================
    // OPEN PHOTO VIEWER
    // =====================================

    function openLightbox(item) {

        if (!lightbox || !lightboxImage) return;

        visibleItems = galleryItems.filter(
            galleryItem => !galleryItem.hidden
        );

        const index = visibleItems.indexOf(item);

        if (index === -1) return;

        lastFocusedElement = document.activeElement;

        displayPhoto(index);

        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("lightbox-open");

        closeButton?.focus();
    }


    // =====================================
    // CLOSE PHOTO VIEWER
    // =====================================

    function closeLightbox() {

        if (!lightbox) return;

        if (lightbox.hidden) return;

        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("lightbox-open");

        lightboxImage.removeAttribute("src");

        if (lastFocusedElement &&
            typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }


    // =====================================
    // CLICK TO EXPAND PHOTOGRAPHS
    // =====================================

    galleryItems.forEach(item => {

        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");

        const image = item.querySelector("img");

        item.setAttribute(
            "aria-label",
            "Enlarge photo: " + (image?.alt || "School photo")
        );

        item.addEventListener("click", () => {
            openLightbox(item);
        });

        item.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(item);
            }
        });
    });


    // =====================================
    // VIEWER BUTTONS
    // =====================================

    closeButton?.addEventListener("click", closeLightbox);

    previousButton?.addEventListener("click", () => {
        displayPhoto(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        displayPhoto(currentIndex + 1);
    });


    // =====================================
    // CLOSE WHEN CLICKING OUTSIDE IMAGE
    // =====================================

    lightbox?.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }
    });


    // =====================================
    // KEYBOARD CONTROLS
    // =====================================

    document.addEventListener("keydown", event => {

        if (!lightbox || lightbox.hidden) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            displayPhoto(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            displayPhoto(currentIndex - 1);
        }

        if (event.key === "Tab") {
            const controls = [
                closeButton,
                previousButton,
                nextButton
            ].filter(Boolean);

            const first = controls[0];
            const last = controls[controls.length - 1];

            if (event.shiftKey &&
                document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                       document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });


    // =====================================
    // REPORT MISSING IMAGE FILES
    // =====================================

    galleryItems.forEach(item => {

        const image = item.querySelector("img");

        if (!image) return;

        image.addEventListener("error", () => {
            console.error("Image could not load:", image.getAttribute("src"));
        });

        if (image.complete && image.naturalWidth === 0) {
            console.error("Image could not load:", image.getAttribute("src"));
        }
    });

});
