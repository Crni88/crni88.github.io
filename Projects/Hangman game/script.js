const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAggainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

let words = ["classroom"];

const correctLetters = [];
const wrongLetters = [];

async function getRandomWords() {
  const res = await fetch(
    "https://random-word-api.herokuapp.com/word?number=10"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      words = words.concat(data);
    });
}

let selectedWord = words[Math.floor(Math.random() * words.length)];
//Shows the hidden word
function displayWord() {
  wordEl.innerHTML = `
  ${selectedWord
    .split("")
    .map(
      (letter) =>
        `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
        </span>
        `
    )
    .join("")}
      `;
  const innerWord = wordEl.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You have have won! ";
    popup.style.display = "flex";
  }
}
//Update the wrong letters
function updateWrongLettersEl() {
  //Displays the wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map(
      (letter) =>
        `
        <span>${letter}</span>
        `
    )}
    `;
  //Draws the figure
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
  //Check if you lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Sorry you lost :(";
    popup.style.display = "flex";
  }
}
//show notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

//Keydown letter press
window.addEventListener("keydown", (e) => {
  //checks to see if the input is a letter
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key.toLowerCase();
    //checks to see if the word has this letter and if it does it a
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter); //Add it to correct letter array
        displayWord();
      } else {
        showNotification();
      }
    } else {
      //if the wrong letter arr doesn't already include the wrong letter, add it to the list
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

//Restart game and play again
playAggainBtn.addEventListener("click", () => {
  //Empty arr
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();
  updateWrongLettersEl();
  popup.style.display = "none";
});
getRandomWords();
displayWord();
