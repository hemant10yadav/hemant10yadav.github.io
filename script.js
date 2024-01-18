// Scroll progress.
const scrollProgress = document.getElementById("scroll-progress");
const height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener("scroll", () => {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop;
  scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});

// Scroll Event
const sectionLinks = document.querySelectorAll("nav a");
sectionLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    sectionLinks.forEach((link) => link.classList.remove("active"));
    e.target.classList.add("active");
    const section = document.querySelector(e.target.hash);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Highlight nav item

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('nav h4 a');
  const sections = document.querySelectorAll('section');

  function setActiveTab() {
    let currentSection = null;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 100) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Set active tab on page load
  setActiveTab();

  window.addEventListener('scroll', setActiveTab);
});