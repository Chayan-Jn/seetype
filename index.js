import { uniqueWords } from "./text.js";

let n = uniqueWords.length

let line1 = document.querySelector('.line1')
let line2 = document.querySelector('.line2')
let line3 = document.querySelector('.line3')
let inputField = document.querySelector('.input');

let text1 = ""
let text2 = ""
let text3 = ""
const maxchar = 75
for(let i=0;i<13;i++){
    let num = Math.floor(Math.random()*n)

    let w1=uniqueWords[num] + " "
    let w2=uniqueWords[(num+1)%n] + " "
    let w3=uniqueWords[(num+2)%n] + " "
    if((text1.length + w1.length) <maxchar) text1+=w1
    if ((text2.length + w2.length) <maxchar) text2 += w2;   
    if ((text3.length + w3.length) <maxchar) text3 += w3;
    
}
line1.innerText = text1
line2.innerText = text2
line3.innerText = text3


inputField.focus();


inputField.addEventListener('input',(e)=>{
    let typedText = e.target.value; 
    let targetText = text1; 
    let lineToCheck = line1
    let updatedText = ""; 


    for (let i = 0; i < targetText.length; i++) {

        const typedLetter = typedText[i]; 
        const correctLetter = targetText[i]; 
        if (i < typedText.length) {
            updatedText += (typedLetter === correctLetter
                ? `<span class="correct">${typedLetter}</span>`
                : `<span class="incorrect">${correctLetter}</span>`);
        } else {
            updatedText += `<span class="default">${correctLetter}</span>`;
        }

    }
    lineToCheck.innerHTML = updatedText;

})


