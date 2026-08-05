// ===============================
// SELECT ELEMENTS
// ===============================
const navLinks = document.querySelectorAll("header nav a");
const logoLink = document.querySelector(".logo");
const sections = document.querySelectorAll("section");
const header = document.querySelector("header");
const barsBox = document.querySelector(".bars-box");
const menuIcon = document.getElementById("menu-icon");
const navBar = document.querySelector("header nav");

// ===============================
// NAVIGATION ANIMATION HANDLER
// ===============================
// Transition duration (ms) - kept in one place so JS timing always matches
// the CSS animation timing (bars/header/section) instead of drifting apart.
const TRANSITION_DELAY = 800;

// Track in-flight timers so a fast second click can cancel the first
// transition instead of letting both finish and leave two sections
// marked "active" (which made them render on top of each other).
let headerTimer = null;
let barsTimer = null;
let sectionTimer = null;

const activePage = (clickedLink, index) => {
  clearTimeout(headerTimer);
  clearTimeout(barsTimer);
  clearTimeout(sectionTimer);

  // Animated bar + header refresh effect
  if (header) {
    header.classList.remove("active");
    headerTimer = setTimeout(() => header.classList.add("active"), TRANSITION_DELAY);
  }
  if (barsBox) {
    barsBox.classList.remove("active");
    barsTimer = setTimeout(() => barsBox.classList.add("active"), TRANSITION_DELAY);
  }

  // Reset nav link states
  navLinks.forEach((link) => link.classList.remove("active"));
  if (clickedLink) clickedLink.classList.add("active");

  // Hide all sections
  sections.forEach((section) => section.classList.remove("active"));
  // Delay before showing target section
  sectionTimer = setTimeout(() => {
    if (sections[index]) sections[index].classList.add("active");
  }, TRANSITION_DELAY);

  // Close menu in mobile view
  navBar.classList.remove("show");
  menuIcon.classList.remove("bx-x");
};

// ===============================
// NAVIGATION LINKS CLICK HANDLER
// ===============================
navLinks.forEach((link, idx) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (!link.classList.contains("active")) {
      activePage(link, idx);
    }
  });
});

// ===============================
// LOGO CLICK => HOME SECTION
// ===============================
if (logoLink && navLinks.length > 0) {
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (!navLinks[0].classList.contains("active")) {
      activePage(navLinks[0], 0);
    }
  });
}

// ===============================
// RESPONSIVE MENU TOGGLE
// ===============================
if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navBar.classList.toggle("show");
  });
}

// ===============================
// RESUME SECTION SWITCHER
// ===============================
const resumeBtns = document.querySelectorAll(".resume-btn");
resumeBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const resumeDetails = document.querySelectorAll(".resume-detail");

    resumeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    resumeDetails.forEach((detail) => detail.classList.remove("active"));
    if (resumeDetails[idx]) resumeDetails[idx].classList.add("active");
  });
});

// ===============================
// PORTFOLIO CAROUSEL LOGIC
// ===============================
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const imgSlide = document.querySelector(".portfolio-carousel .img-slide");
const portfolioDetails = document.querySelectorAll(".portfolio-detail");
const totalSlides = portfolioDetails.length;
let index = 0;

const activePortfolio = () => {
  const offset = `calc(${index * -100}% - ${index * 2}rem)`;
  imgSlide.style.transform = `translateX(${offset})`;

  portfolioDetails.forEach((d) => d.classList.remove("active"));
  portfolioDetails[index].classList.add("active");

  arrowLeft.classList.toggle("disabled", index === 0);
  arrowRight.classList.toggle("disabled", index === totalSlides - 1);
};

if (arrowRight && arrowLeft && imgSlide) {
  arrowRight.addEventListener("click", () => {
    if (index < totalSlides - 1) {
      index++;
      activePortfolio();
    }
  });
  arrowLeft.addEventListener("click", () => {
    if (index > 0) {
      index--;
      activePortfolio();
    }
  });
}

// ===============================
// CONTACT FORM HANDLER
// ===============================
// There's no backend to receive this form, so instead of letting the
// browser submit to action="" (which reloads the page and silently
// discards everything typed), we build a mailto: link from the fields
// and hand off to the visitor's own email client.
const contactForm = document.querySelector(".contact-box form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input");
    const [nameField, emailField, phoneField, subjectField] = inputs;
    const messageField = contactForm.querySelector("textarea");

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const phone = phoneField ? phoneField.value.trim() : "";
    const subject = subjectField ? subjectField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";

    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:debdipak8101@gmail.com?subject=${encodeURIComponent(
      subject || "Portfolio Contact"
    )}&body=${encodeURIComponent(body)}`;

    let statusEl = contactForm.querySelector(".form-status");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.className = "form-status";
      contactForm.appendChild(statusEl);
    }
    statusEl.textContent = "Opening your email app to send this message...";

    window.location.href = mailtoLink;
  });
}

// ===============================
// ANIMATED CURSOR EFFECT
// ===============================
const cursor = document.createElement("div");
cursor.classList.add("cursor-dot");
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.pageX}px`;
  cursor.style.top = `${e.pageY}px`;
});
