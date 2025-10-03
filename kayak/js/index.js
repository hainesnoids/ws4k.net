// Translations and most timing information from https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.1677-1-200910-I!!PDF-E.pdf
// WPM calculations from https://morsecode.world/international/timing

const morse = {
    "encoded": ".. - / .-- .. .-.. .-.. / -... . / -.-- --- ..- .-. / - .. -- . / ... --- --- -. --..-- / -.-. .- -. -. .. .-.-.- / - .... . .-. . .-..-. ... / ... --- / -- ..- -.-. .... / - --- / -.. --- .-.-.- / -.-- --- ..- .-. / ... .--. .. .-. .. - / -.-. .- -. / -. ..- .-. - ..- .-. . / - .... .. ... / -... .-. --- -.- . -. / ..- -. .. ...- . .-. ... . .-.-.- / .. / .-- .. .-.. .-.. / ... . . / -.-- --- ..- / ... --- --- -. .-.-.-",
    "timing": {
        "wpm": 24,
        "dashLength": 3,
        "dotLength": 1,
        "signalSpacing": 0.42,
        "letterSpacing": 3, // should be 3 (3.44)
        "wordSpacing": 7 // should be 7 (7.63)
    },
    "display": {
        "unknownCharacter": "#", // also ⚹
        "timeAtWhichMorseStarts": 200
    }
}
const audioSrc = 'raw/Kayak.mp3';

let audio,
    morseTree = {};

function step(i) { // https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
    return new Promise(resolve => setTimeout(resolve, (i * (60/(50 * morse.timing.wpm))) * 1000));
}

// text rendering

let currentCharacter = -1;
function swapCharacter(i) {
    const content = document.querySelector('.content');
    content.children[currentCharacter].innerText = i;
}
function insertCharacter(i='') {
    const content = document.querySelector('.content');
    const span = document.createElement('span');
    span.classList.add('letter');
    span.innerText = i;
    content.appendChild(span);
    currentCharacter++;
}
function getKeyByValue(object, value) { // https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
    return Object.keys(object).find(key => object[key] === value);
}
function decodeCharacter(i) {
    return getKeyByValue(morseTree,i) === undefined ? morse.display.unknownCharacter : getKeyByValue(morseTree,i)
}

// decoding

async function background() {
    // add button event
    document.querySelector('#start').addEventListener('click', main);

    // fetch morse tree
    morseTree = await fetch('js/morsetree.json')
        .then((response) => response.json())
}

function main() {
    // hide button
    document.querySelector('#start').style.display = 'none';
    // set up audio
    audio = new Audio(audioSrc);
    // begin
    audio.addEventListener('canplaythrough', () => {
        audio.play();
        setTimeout(() => {
            decode().then();
        },morse.display.timeAtWhichMorseStarts);
    })
}

async function decode() { // string level
    const thingsToDecode = morse.encoded.split('/');
    for (let i = 0; i < thingsToDecode.length; i++) { // word level
        const thisWord = thingsToDecode[i];
        const letters = thisWord.trim().split(' ');
        for (let j = 0; j < letters.length; j++) { // letter level
            let letter = '';
            insertCharacter();
            for (let k = 0; k < letters[j].length; k++) { // character level
                const character = letters[j][k];
                letter += character;
                swapCharacter(decodeCharacter(letter));
                if (character === '.') {
                    await step(morse.timing.dotLength);
                } else if (character === '-') {
                    await step(morse.timing.dashLength);
                } else {
                    await step(1);
                }
                await step(morse.timing.signalSpacing);
            }
            await step(morse.timing.letterSpacing);
        }
        await step(morse.timing.wordSpacing);
        insertCharacter(' ');
    }
    document.querySelector('footer').style.opacity = 1;
}
document.addEventListener('DOMContentLoaded', background);