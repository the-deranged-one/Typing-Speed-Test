const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const resultElement = document.getElementById("result");
const sentenceElement = document.getElementById("sentence");
let startTime;
let currentSentence = "";
let correctCount = 0;
let incorrectCount = 0;

async function fetchRandomWords() {
    try {
        const response = await fetch("https://random-word-api.herokuapp.com/word?number=10"); // Fetch 10 random words
        const words = await response.json();
        return words.join(' ');
    } catch (error) {
        console.error("Failed to fetch random words:", error);
        return "Error fetching words"; // Fallback in case of error
    }
}

async function startGame() {
    currentSentence = await fetchRandomWords(); // Fetch random words from the API
    sentenceElement.innerHTML = ''; // Clear previous sentence display
    correctCount = 0;
    incorrectCount = 0;

    currentSentence.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        sentenceElement.appendChild(span);
    });

    startTime = new Date().getTime();
    startButton.style.display = "none"; // Hide the start button
    restartButton.style.display = "none"; // Hide the restart button until the game ends
    resultElement.textContent = "";

    document.addEventListener('keydown', checkInput);
}

function checkInput(event) {
    const currentIndex = document.querySelectorAll('#sentence .correct, #sentence .incorrect').length;

    if (event.key === currentSentence[currentIndex]) {
        document.querySelectorAll('#sentence span')[currentIndex].classList.add('correct');
        correctCount++;
    } else if (event.key !== "Shift" && event.key !== "CapsLock") {
        document.querySelectorAll('#sentence span')[currentIndex].classList.add('incorrect');
        incorrectCount++;
    }

    // Move to the next character even if incorrect
    if (currentIndex + 1 === currentSentence.length) {
        endGame();
    }
}

function endGame() {
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000 / 60; // time in minutes

    const totalCharsTyped = correctCount + incorrectCount; // Total characters typed
    const wordCountEquivalent = totalCharsTyped / 5; // Word count equivalent
    const wpm = (wordCountEquivalent / timeTaken).toFixed(2);

    // Calculate accuracy
    const accuracy = totalCharsTyped > 0 ? ((correctCount / totalCharsTyped) * 100).toFixed(2) : 0;

    resultElement.innerHTML = `Words per minute: ${wpm}<br>Accuracy: ${accuracy}%`;

    restartButton.style.display = "inline-block"; // Show the restart button
    document.removeEventListener('keydown', checkInput);
}

function restartGame() {
    startGame(); // Directly call startGame to restart the game
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
