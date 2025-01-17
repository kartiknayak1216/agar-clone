const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
const spawnModal = new bootstrap.Modal(document.querySelector("#spawnModal"));

let wWidth = window.innerWidth;
let wHeight = window.innerHeight;

const canvas = document.querySelector("#the-canvas");
const context = canvas.getContext("2d");
canvas.height = wHeight;
canvas.width = wWidth;
let players = [];

window.addEventListener("load", () => {
  loginModal.show();
});

document.querySelector(".name-form").addEventListener("submit", (e) => {
  e.preventDefault();
  player.name = document.querySelector("#name-input").value;
  document.querySelector(".player-name").innerHTML = player.name;
  loginModal.hide();
  spawnModal.show();
});

document.querySelector(".start-game").addEventListener("click", (e) => {
  spawnModal.hide();
  Array.from(document.querySelectorAll(".hiddenOnStart")).forEach((el) =>
    el.removeAttribute("hidden")
  );
  init();
});
