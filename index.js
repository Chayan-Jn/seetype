import { uniqueWords } from "./text.js";  
let n = uniqueWords.length;
let line1 = document.querySelector('.line1');
let line2 = document.querySelector('.line2');
let line3 = document.querySelector('.line3');
let inputField = document.querySelector('.input');

let text1 = "";
let text2 = "";
let text3 = "";
const maxchar = 75;

// Generate lines
for(let i = 0; i < 13; i++){     
    let num = Math.floor(Math.random() * n);
    let w1 = uniqueWords[num] + " ";
    let w2 = uniqueWords[(num+1) % n] + " ";
    let w3 = uniqueWords[(num+2) % n] + " ";
    
    if((text1.length + w1.length) < maxchar) text1 += w1;     
    if((text2.length + w2.length) < maxchar) text2 += w2;        
    if((text3.length + w3.length) < maxchar) text3 += w3;      
} 

// Set line texts
line1.innerText = text1;
line2.innerText = text2;
line3.innerText = text3;   
inputField.focus();  

// Game state variables
let lines = [text1, text2, text3];
let lineElements = [line1, line2, line3];
let currentLineIndex = 0;
let TotalCorrectTextLength = 0;
let TotalTypedTextLength = 0;
let TotalTextLength = 0;
let onloop = false


function getNewText(){
    let newtext = ""
    for(let i=0;i<13;i++){
        let num = Math.floor(Math.random() * n);
        let w1 = uniqueWords[num] + " ";

        if((newtext.length + w1.length) < maxchar) newtext += w1; 
        else break;
    }
    return newtext;
}



inputField.addEventListener('input', (e) => {
    const typedText = e.target.value;
    const targetText = lines[currentLineIndex];
    let updatedText = "";



    for (let i = 0; i < targetText.length; i++) {
        const typedLetter = typedText[i];
        const correctLetter = targetText[i];


        if (i < typedText.length) {
            if (typedLetter === correctLetter) {
                updatedText += `<span class="correct">${typedLetter}</span>`;
            } else {
                updatedText += `<span class="incorrect">${correctLetter}</span>`;
                
            }
        } else {
            updatedText += `<span class="default">${correctLetter}</span>`;
            
        }
    }
    lineElements[currentLineIndex].innerHTML = updatedText;
    if (typedText.length === targetText.length) {

        TotalTypedTextLength += typedText.length;
        TotalCorrectTextLength += targetText.length;
        currentLineIndex = (currentLineIndex + 1) % 2;
        inputField.value = "";
        if (currentLineIndex === 0) {
            if(onloop!=true){
                TotalTextLength += text1.length + text2.length 
                onloop=true
            }
            else TotalTextLength += text2.length

            // removing first line and adding a new
            lines.shift(); 
            lines.push(getNewText());

            // rotation
            lineElements[0].innerHTML = lineElements[1].innerHTML;
            lineElements[1].innerHTML = lines[1];
            lineElements[2].innerHTML = lines[2];
            currentLineIndex = 1;     
        }
        inputField.value = "";  


    }
}

);