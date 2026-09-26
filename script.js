function trackPortfolioVisit() {
    const VISITOR_ALERT_URL =
        "https://portfolio-visitor-alert.ntaiymcs.workers.dev";

    if (window.location.protocol === "file:") {
        return;
    }

    const visitData = {
        page: window.location.pathname,
        referrer: document.referrer || "Direct visit",
        screen: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language || "Unknown",
        timezone:
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone || "Unknown"
    };

    fetch(VISITOR_ALERT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(visitData),
        keepalive: true
    }).catch(() => { });
}

trackPortfolioVisit();


const slides = document.querySelectorAll(".photo-slide");
const slideDots = document.getElementById("slideDots");

let currentSlide = 0;

function showSlide(index) {
    if (slides.length === 0) {
        return;
    }

    slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
    });

    if (slideDots) {
        const dots = slideDots.querySelectorAll(".slide-dot");

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }
}

function createSlideDots() {
    if (!slideDots || slides.length === 0) {
        return;
    }

    slides.forEach(function (slide, index) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slide-dot";
        dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

        dot.addEventListener("click", function () {
            currentSlide = index;
            showSlide(currentSlide);
        });

        slideDots.appendChild(dot);
    });
}

function nextSlide() {
    if (slides.length === 0) {
        return;
    }

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function previousSlide() {
    if (slides.length === 0) {
        return;
    }

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

createSlideDots();
showSlide(currentSlide);

if (slides.length > 1) {
    setInterval(nextSlide, 5000);
}


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
        nextSlide();
    }

    if (event.key === "ArrowLeft") {
        previousSlide();
    }
});


const navigationLinks = document.querySelectorAll(
    'a[href^="#"]'
);

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
    'header a[href^="#"]'
);

window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(function (link) {
        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {
            link.classList.add("active");
        }
    });
});


const images = document.querySelectorAll("img");

images.forEach(function (image) {
    image.addEventListener("error", function () {
        image.style.display = "none";
    });
});