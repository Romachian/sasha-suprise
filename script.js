const PHOTO_LIST = [
"assets/quiz/1.jpg",
"assets/quiz/2.jpg",
"assets/quiz/3.jpg",
"assets/quiz/4.jpg",
"assets/quiz/5.jpg",
"assets/quiz/6.jpg",
"assets/quiz/7.jpg",
"assets/quiz/8.jpg",
"assets/quiz/9.jpg",
"assets/quiz/10.jpg"
];

const steps = [...document.querySelectorAll(".step")];
const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");
const restartBtn = document.getElementById("restartBtn");
const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");

let deck = [];
let opened = [];
let moves = 0;
let matchedPairs = 0;
let lockBoard = false;

function showStep(n){
steps.forEach(step => step.classList.remove("active"));
document.querySelector(`.step[data-step="${n}"]`)?.classList.add("active");
window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(arr){
for(let i = arr.length - 1; i > 0; i--){
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}

function buildDeck(){
const duplicated = [...PHOTO_LIST, ...PHOTO_LIST];

deck = shuffle(
duplicated.map((src, index) => ({
id: index,
src,
key: src,
matched: false
}))
);
}

function renderBoard(){
grid.innerHTML = "";

deck.forEach(card => {
const button = document.createElement("button");
button.className = "photo-card";
button.type = "button";
button.setAttribute("aria-label", "Открыть карточку");
button.dataset.id = card.id;

button.innerHTML = `
<div class="photo-inner">
<div class="photo-front">💗</div>
<div class="photo-back">
<img src="${card.src}" alt="Фото карточки" loading="lazy">
</div>
</div>
`;

button.addEventListener("click", () => flipCard(card.id));
grid.appendChild(button);
});
}

function resetGame(){
buildDeck();
renderBoard();
opened = [];
moves = 0;
matchedPairs = 0;
lockBoard = false;
movesEl.textContent = "0";
finishBtn.disabled = true;
}

function flipCard(id){
if(lockBoard) return;

const card = deck.find(c => c.id === id);
const element = document.querySelector(`.photo-card[data-id="${id}"]`);

if(!card || !element) return;
if(card.matched) return;
if(opened.some(item => item.id === id)) return;

element.classList.add("flipped");
opened.push({ id: card.id, key: card.key, el: element, ref: card });

if(opened.length === 2){
moves++;
movesEl.textContent = String(moves);
lockBoard = true;

const [first, second] = opened;

if(first.key === second.key){
first.ref.matched = true;
second.ref.matched = true;

first.el.classList.remove("flipped");
second.el.classList.remove("flipped");

first.el.classList.add("matched");
second.el.classList.add("matched");

matchedPairs++;
opened = [];
lockBoard = false;

if(matchedPairs === PHOTO_LIST.length){
finishBtn.disabled = false;
}
} else {
setTimeout(() => {
first.el.classList.remove("flipped");
second.el.classList.remove("flipped");
opened = [];
lockBoard = false;
}, 850);
}
}
}

startBtn?.addEventListener("click", () => {
showStep(2);
resetGame();
});

finishBtn?.addEventListener("click", () => {
showStep(3);
});

restartBtn?.addEventListener("click", () => {
showStep(1);
resetGame();
});

const heartsRoot = document.querySelector(".hearts");

function spawnHeart(){
const el = document.createElement("div");
el.className = "heart-float";
el.textContent = Math.random() > 0.2 ? "💗" : "💝";

const left = Math.random() * 100;
const size = 14 + Math.random() * 18;
const duration = 6 + Math.random() * 6;
const drift = (Math.random() * 160 - 80).toFixed(0);

el.style.left = `${left}vw`;
el.style.fontSize = `${size}px`;
el.style.animationDuration = `${duration}s`;
el.style.setProperty("--drift", `${drift}px`);

heartsRoot.appendChild(el);
setTimeout(() => el.remove(), duration * 1000);
}

setInterval(spawnHeart, 500);