const board = document.getElementById("gameBoard");
const livesDisplay = document.getElementById("livesDisplay");
const winMessage = document.getElementById("winMessage");
const gameOver = document.getElementById("gameOver");

const emojis = [
    "🌿",
    "🌹",
    "🌺",
    "🙃",
    "🧐",
    "👾",
    "🫠",
    "🤠",
    "👑",
    "🍄",
    "🪷",
    "🌻",
    "🫧",
    "🍕",
    "🧆",
    "🍉",
    "🌯",
    "🧩"
];
let livesLeft = 10;
let lockBoard = false;
let cardOne = null;
let cardTwo = null;

function drawCards(difficulty) {
    let pairs, columns, rows, emojiSize;

    if (difficulty === "easy") {
        pairs = 6;
        columns = 4;
        rows = 3;
        emojiSize = "2.5rem";
    }

    if (difficulty === "medium") {
        pairs = 12;
        columns = 6;
        rows = 4;
        emojiSize = "2rem";
    }

    if (difficulty === "hard") {
        pairs = 18;
        columns = 6;
        rows = 6;
        emojiSize = "1.5rem";
    }

    let chosen = emojis.slice(0, pairs);
    let cards = [...chosen, ...chosen];

    cards.sort(() => Math.random() - 0.5);

    board.innerHTML = "";

    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;

    const paddingX = 20;
    const paddingY = 20;
    const gap = 10;

    const totalColumnGap = gap * (columns - 1);
    const cardWidth = (boardWidth - paddingX - totalColumnGap) / columns;

    const totalRowGap = gap * (rows - 1);
    const cardHeight = (boardHeight - paddingY - totalRowGap) / rows;

    board.style.gridTemplateColumns = `repeat(${columns}, ${cardWidth}px)`;
    board.style.gridTemplateRows = `repeat(${rows}, ${cardHeight}px)`;

    cards.forEach((symbol) => {
        let card = document.createElement("div");
        card.classList.add("card");

        let cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        let cardFront = document.createElement("div");
        cardFront.classList.add("card-front");

        let cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.textContent = symbol;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        //card.textContent = "";
        card.setAttribute("emoji-symbol", symbol);
        card.addEventListener("click", flipCards);
        board.appendChild(card);
    });

    document.querySelectorAll(".card-back").forEach((back) => {
        back.style.fontSize = emojiSize;
    });
}

function flipCards() {
    if (lockBoard) return;
    if (this === cardOne) return;
    if (this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.querySelector(".card-inner .card-back").textContent = this.getAttribute("emoji-symbol");

    if (!cardOne) {
        cardOne = this;
    } else {
        cardTwo = this;
        matchCards();
    }
}

function matchCards() {
    lockBoard = true;
    const isMatch = cardOne.getAttribute("emoji-symbol") === cardTwo.getAttribute("emoji-symbol");
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    resetBoard();

    const flippedCards = document.querySelectorAll(".card.flipped");
    if (flippedCards.length === document.querySelectorAll(".card").length) {
        endGame(true);
    }
}

function unflipCards() {
    livesLeft--;
    livesDisplay.textContent = `Lives Left: ${livesLeft}`;

    setTimeout(() => {
        cardOne.classList.remove("flipped");
        cardOne.querySelector(".card-back").textContent = "";
        cardTwo.classList.remove("flipped");
        cardTwo.querySelector(".card-back").textContent = "";
        resetBoard();
    }, 1000);

    if (livesLeft === 0) {
        endGame(false);
    }
}

function resetBoard() {
    [cardOne, cardTwo, lockBoard] = [null, null, false];
}

function endGame(isWin) {
    board.style.display = "none";

    if (isWin) {
        winMessage.style.display = "block";
    } else {
        gameOver.style.display = "block";
    }

    document.querySelector("#backButton a").style.visibility = "hidden";
}

function replay() {
    window.location.href = "play.html";
}

function main() {
    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get("difficulty") || window.gameDifficulty || "easy";

    if (difficulty === "easy") {
        livesLeft = 10;
    } else if (difficulty === "medium") {
        livesLeft = 15;
    } else if (difficulty === "hard") {
        livesLeft = 30;
    }

    livesDisplay.textContent = `Lives Left: ${livesLeft}`;
    drawCards(difficulty);

    document.getElementById("livesDisplay").style.visibility = "visible";
    document.querySelector("#backButton a").style.visibility = "visible";
}

main();
