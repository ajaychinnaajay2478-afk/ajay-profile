// ==================================
// AJAY P. - PORTFOLIO JAVASCRIPT
// ==================================


// 1. ANIMATED TYPING EFFECT

const typingText = document.getElementById("typingText");

const words = [
    "ECE Student",
    "Tech Explorer",
    "Cricket Lover",
    "Future Innovator"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (deleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    let delay = deleting ? 45 : 100;

    if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        delay = 1500;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
    }

    setTimeout(typeEffect, delay);
}

typeEffect();


// 2. ANIMATED STAR BACKGROUND

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let animationFrame;
let lastFrameTime = 0;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createStars();
}

function createStars() {
    const numberOfStars = Math.min(
        150,
        Math.floor((window.innerWidth * window.innerHeight) / 7000)
    );

    stars = [];

    for (let i = 0; i < numberOfStars; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.8 + 0.3,
            speed: Math.random() * 0.35 + 0.08,
            opacity: Math.random() * 0.7 + 0.2,
            twinkle: Math.random() * 0.02 + 0.003,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }
}

function drawStars(timestamp = 0) {
    // Limit animation work to roughly 30 frames per second.
    if (timestamp - lastFrameTime < 33) {
        animationFrame = requestAnimationFrame(drawStars);
        return;
    }

    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(170, 220, 255, ${star.opacity})`;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00e5ff";

        ctx.fill();

        if (!reducedMotion.matches) {
            star.y += star.speed;
            star.opacity += star.twinkle * star.direction;

            if (star.opacity >= 1 || star.opacity <= 0.2) {
                star.direction *= -1;
            }

            // Stars reappear at the top after leaving the screen.
            if (star.y > window.innerHeight) {
                star.y = 0;
                star.x = Math.random() * window.innerWidth;
            }
        }
    }

    ctx.shadowBlur = 0;

    animationFrame = requestAnimationFrame(drawStars);
}

function startStarAnimation() {
    cancelAnimationFrame(animationFrame);

    if (reducedMotion.matches) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Show a static star background for reduced-motion users.
        for (const star of stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(170, 220, 255, 0.65)";
            ctx.fill();
        }

        return;
    }

    lastFrameTime = 0;
    animationFrame = requestAnimationFrame(drawStars);
}

window.addEventListener("resize", () => {
    resizeCanvas();
    startStarAnimation();
});

reducedMotion.addEventListener("change", startStarAnimation);

resizeCanvas();
startStarAnimation();


// 3. MOBILE NAVIGATION MENU

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});


// 4. SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    // Fallback for older browsers.
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


// 5. ACTIVE NAVIGATION LINK

const pageSections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navigationLinks.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            "#" + entry.target.id
                        );
                    });
                }
            });
        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    pageSections.forEach(section => {
        sectionObserver.observe(section);
    });
}


// 6. AUTOMATIC COPYRIGHT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// 7. PROFILE CARD TILT EFFECT

const profileCard = document.querySelector(".profile-card");

const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
);

if (profileCard && canHover.matches && !reducedMotion.matches) {

    const heroVisual = document.querySelector(".hero-visual");

    heroVisual.addEventListener("mousemove", event => {
        const rect = profileCard.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;

        profileCard.style.animation = "none";

        profileCard.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener("mouseleave", () => {
        profileCard.style.animation = "";
        profileCard.style.transform = "";
    });
}

console.log("Welcome to Ajay P.'s Portfolio! 🚀");
