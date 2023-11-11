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
    section.scrollIntoView({ behavior: "smooth", block: "end" });
  });
});
