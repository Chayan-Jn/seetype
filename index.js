import { uniqueWords } from "./text.js";  

let typing = false;
let n = uniqueWords.length;
const maxchar = 60; 
let line1 = document.querySelector('.line1');
let line2 = document.querySelector('.line2');
let line3 = document.querySelector('.line3');

let inputField = document.querySelector('.input');
let refreshButton = document.querySelector('.refresh');
let whole = document.querySelector('.whole');
let text = document.querySelector('.text');
let menu = document.querySelector('.menu');
let wpm = document.querySelector('.wpm')
let accuracy = document.querySelector('.accuracy')
const nav  = document.querySelector('.nav');
let time = document.querySelector('.time')
const phase1 = document.querySelector('.phase1');
const stats = document.querySelector('.stats');

let lines = []
let speed = 0
let acc = 0
let TotalCorrectTextLength = 0
let TotalTypedTextLength = 0

const TYPETIME = 30

function InitializeText() {
    let text1 = "", text2 = "", text3 = "";

    // Generate lines of text
    for (let i = 0; i < 10; i++) {
        let num = Math.floor(Math.random() * n);
        let w1 = uniqueWords[num] + " ";
        let w2 = uniqueWords[(num + 1) % n] + " ";
        let w3 = uniqueWords[(num + 2) % n] + " ";
        
        if ((text1.length + w1.length) < maxchar) text1 += w1;
        if ((text2.length + w2.length) < maxchar) text2 += w2;
        if ((text3.length + w3.length) < maxchar) text3 += w3;
    }

    text1 = text1.trim()
    text2 = text2.trim()
    text3 = text3.trim()

    // Set line texts
    line1.innerText = text1;
    line2.innerText = text2;
    line3.innerText = text3;   
    inputField.focus();

    return [text1, text2, text3];
}

function getNewText() {
    let newText = "";
    for (let i = 0; i < 13; i++) {
        let num = Math.floor(Math.random() * n);
        let w1 = uniqueWords[num] + " ";
        if ((newText.length + w1.length) < maxchar) newText += w1;
        else break;
    }
    return newText;
}

if(!typing){
    whole.style.opacity = "0.7";
    stats.style.display = "none"
    menu.style.display = "flex"
}

//  event listener functions to allow removal later 
let inputHandler, blurHandler, keydownHandler, refreshHandler;


function Restart(){
    if (!typing) {
        typing = true;
        whole.style.display = "flex"
        whole.style.opacity = "1";
        menu.style.display = "none"; 
        stats.style.display = "none"
        speed = 0
        acc = 0  
        inputField.value = ""
        TotalCorrectTextLength = 0;
        TotalTypedTextLength = 0;
        startTypingGame();
    }
}


menu.addEventListener('click', () => {
    Restart()
});
stats.addEventListener('click',()=>{
    Restart()
})

phase1.addEventListener('click', () => {
    nav.classList.toggle('fillph1');
    whole.classList.toggle('blue-whole');
    text.classList.toggle('blue-text');
    phase1.classList.toggle('phase1on');

});

function typingOver(){
    wpm.innerHTML = `WPM ${speed}`;
    accuracy.innerHTML =  `Accuracy ${acc} %`
    whole.style.display = "none"
    menu.style.display = "none"
    stats.style.display = "flex"
    typing = false;

    // Remove event listeners when game is over
    if (inputHandler) {
        inputField.removeEventListener('input', inputHandler);
        inputField.removeEventListener('blur', blurHandler);
        document.removeEventListener('keydown', keydownHandler);
        refreshButton.removeEventListener('click', refreshHandler);
    }
}

function startTypingGame() {

    
    let currentTime = TYPETIME;
    let currentLineIndex = 0;
    let iterator = 0; // To mark the next letter to be typed
    TotalCorrectTextLength = 0;
    TotalTypedTextLength = 0;

    // Timer interval
    const timeInterval = setInterval(() => {
        currentTime--;
        time.innerHTML = `${currentTime}`;

        if (currentTime <= 0) {
            clearInterval(timeInterval);
            time.innerHTML = "😸";
            typingOver();
            return;
        }
    }, 1000);

    // Initialize text lines
    lines = InitializeText();
    let lineElements = [line1, line2, line3];

    // Input handler
    inputHandler = (e) => {

        const typedText = e.target.value;
        const targetText = lines[currentLineIndex];
        let updatedText = "";

        if (targetText[iterator-1] === typedText[iterator-1]) TotalCorrectTextLength++;

        for (let i = 0; i < targetText.length; i++) {
            const typedLetter = typedText[i];
            const correctLetter = targetText[i];

    
            if (i < typedText.length) {
                
                if (typedLetter === correctLetter) {
                    updatedText += `<span class="correct">${typedLetter}</span>`;
                } else {
                    updatedText += `<span class="incorrect">${correctLetter}</span>`;
                }
            } 
            else {
                if (i == iterator) {
                    updatedText += `<span class="next-letter">${correctLetter}</span>`;
                } else {
                    updatedText += `<span class="default">${correctLetter}</span>`;
                }
            }
        }
        speed = Math.round( ((TotalCorrectTextLength)/5)*(60/TYPETIME))
        acc = Math.round((TotalCorrectTextLength/TotalTypedTextLength)*100)
        acc = acc>100?100 :acc; // to make sure if a letter is being retyped again & again , make sure acc remains less than 100%

        lineElements[currentLineIndex].innerHTML = updatedText;

        // Move to the next line when current line is typed
        if (typedText.length === targetText.length) {
            iterator = 0;
            currentLineIndex = (currentLineIndex + 1) % 2; // Rotate  the  lines
            inputField.value = "";

            if (currentLineIndex === 0) {
                lines.shift(); 
                lines.push(getNewText());

                lineElements[0].innerHTML = lineElements[1].innerHTML;
                lineElements[1].innerHTML = lines[1];
                lineElements[2].innerHTML = lines[2];
                currentLineIndex = 1;

            }
        }
    };

    // Blur handler to keep input field focused forever fr
    blurHandler = () => {
        setTimeout(() => inputField.focus(), 0);
    };

    // Keydown handler to track iterator
    keydownHandler = (e) => {
        if (e.key === 'Backspace') {
            if (iterator > 0) iterator--;
        } else {
            TotalTypedTextLength++;
            iterator++;
        }
    };

    // Refresh handler
    refreshHandler = () => {
        iterator = 0;
        lines = InitializeText();
        inputField.value = "";
        currentLineIndex = 0;
        TotalCorrectTextLength = 0;
        TotalTypedTextLength = 0;
        currentTime = TYPETIME;
    };

    // Remove any existing event listeners 
    inputField.removeEventListener('input', inputHandler);
    inputField.removeEventListener('blur', blurHandler);
    document.removeEventListener('keydown', keydownHandler);
    refreshButton.removeEventListener('click', refreshHandler);

    // Add new event listeners
    inputField.addEventListener('input', inputHandler);
    inputField.addEventListener('blur', blurHandler);
    document.addEventListener('keydown', keydownHandler);
    refreshButton.addEventListener('click', refreshHandler);

}