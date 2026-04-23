const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const logo = document.getElementById("logoPrincipal");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
  logo.classList.toggle("hide");
});