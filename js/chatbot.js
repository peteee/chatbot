var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
//var recognition = new SpeechRecognition();
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

/**
 * Switches | Boolean
 */
let weHaveAMatch = false;
let definitionInProgress = false;

// for new recorded words & phrases
let travellingKeyword = '';

let diagnostic = document.querySelector('.output');
let hints = document.querySelector('.hints');

// hints.innerHTML = 'Click button and say something or type a message';

let micBtn = document.getElementById("record");
//.document.body.

const myAnswer = document.getElementById("answer");
const myQuestionBox = document.getElementById("command");

// Robot elements
let robotMouth = document.getElementById("mouth");

// Time function
// we add an additional 0 for numbers smaller than 10 
function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

micBtn.onclick = function() {
    recognition.start();
    console.log('Ready to receive a command.');
}

function patternTest(pattern, command) {
    let result = pattern.test(command.toLowerCase());
    //weHaveAMatch = (result) ? true : false;
    return result;
}

function animateMouth(sentence) {
    robotMouth.classList.add("speak");
    let wordCount = sentence.split(" ").length;
    let speakTimer = wordCount * 500; //each word lasts half a second (=500ms)
    setTimeout(function(){
        //do stuff
        robotMouth.classList.remove("speak");
    }, speakTimer);
}

//asking an initial question or greeting
initialQuestion = "Hey, how are you today?";
myAnswer.innerHTML = initialQuestion;
let utterance = new SpeechSynthesisUtterance(initialQuestion);
speechSynthesis.speak(utterance);
animateMouth(initialQuestion);

function parseCommand(command) {
    console.log(command);
    myQuestionBox.value = "";

    if(patternTest(/the time/g, command) || patternTest(/what time/g, command)) {
        let today = new Date(),
            h = today.getHours(),
            m = today.getMinutes()//,
            //s = checkTime(today.getSeconds());

        //let timeToRead =  "It is now "+ h + " o'clock, " + m + " minutes and " + s + " seconds";
        let timeToRead =  "It is now "+ h + " o'clock and " + m + " minutes";

        myAnswer.innerHTML = timeToRead;
        let utterance0 = new SpeechSynthesisUtterance(timeToRead);
        speechSynthesis.speak(utterance0);
        weHaveAMatch = true;
        animateMouth(timeToRead);
    } 
    if(patternTest(/i like pizza/g, command)) {
        console.log("Yay! Yummy :P");
        hints.innerHTML = '<img src="https://api.pizzahut.io/v1/content/en-ca/ca-1/images/pizza/pizza.supreme-lovers.3706cdc20b0752ac212c0d68a310fb18.1.jpg">'
        weHaveAMatch = true;
        //animateMouth("Yay! Yummy :P");
    }

    // Look for "i like pizza"
    // let pattern1 = /i like pizza/g;
    // let result1 = pattern1.test(command.toLowerCase());
    // if(result1) {
    //     console.log("Yay! Yummy :P");
    //     hints.innerHTML = '<img src="https://api.pizzahut.io/v1/content/en-ca/ca-1/images/pizza/pizza.supreme-lovers.3706cdc20b0752ac212c0d68a310fb18.1.jpg">'

    // }

    if(patternTest(/i like cake/g, command)) {
        hints.innerHTML = '<img src="https://stordfkenticomedia.blob.core.windows.net/df-us/rms/media/recipemediafiles/recipes/retail/x17/rainbow-cake760x580.jpg?ext=.jpg">';
        let utterance = new SpeechSynthesisUtterance("Yummy cake");
        speechSynthesis.speak(utterance);
        weHaveAMatch = true;
        animateMouth("Yummy cake");
    }

    if(patternTest(/vegas/g, command)) {
        top.location.href = "https://www.expedia.ca/Cheap-Flights-To-Las-Vegas.d178276.Travel-Guide-Flights"
        let utterance2 = new SpeechSynthesisUtterance("Have a safe trip");
        speechSynthesis.speak(utterance2);
        weHaveAMatch = true;
        animateMouth("Have a safe trip");
    }

    if(patternTest(/my favourite show on youtube/g, command)) {
        console.log("VIDEO")
        hints.innerHTML = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/EorJ8cEzsZo?start=1&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        weHaveAMatch = true;
    }

    if(patternTest(/i like red/g, command)) {
        let myBG = document.querySelector("body");
        myBG.style.backgroundColor = "red";
        weHaveAMatch = true;
    }

    if(patternTest(/my name is/g, command)) {
        //console.log(command.substring(0, 10));
        //console.log(command.substring(11));
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let personName = capitalizeFirstLetter(command.substring(11));
        let greeting = "Hi there " + personName; 
        let utterance = new SpeechSynthesisUtterance(greeting);
        speechSynthesis.speak(utterance);
        myAnswer.innerHTML = greeting;
        weHaveAMatch = true;
        animateMouth(greeting);

        /**
         * storing to DB
         */

        //1st attempt: localStorage
        localStorage.setItem("name", personName);
        
        //2nd attempt: MariaDB
        // async function storeUser() {
        //     const response = await fetch("views/chatbot.php?store-user=" + personName);
        //     const jsonData = await response.json();
        //     console.log(jsonData);
        //     if(jsonData[0].error) alert("User exists");
        // }
        // storeUser();
    }

    if(patternTest(/who am i/g, command) 
    || patternTest(/what's my name/g, command) 
    || patternTest(/do you remember me/g, command)) {
        
        //// 1st attempt: localStorage
        let personName = localStorage.getItem("name");
        let greeting = "You are " + personName + ".";
        let utterance = new SpeechSynthesisUtterance(greeting);
        speechSynthesis.speak(utterance);
        myAnswer.innerHTML = greeting;
        weHaveAMatch = true;
        animateMouth(greeting);

        
        //2nd attempt: MariaDB
        // async function getUser() {
        //     const response = await fetch("views/chatbot.php?get-user");
        //     const jsonData = await response.json();
        //     console.log(jsonData);
        //     //if(jsonData[0].error) alert("User exists");
        //     // let personName = ...
        //     let personName = jsonData[0].name;
        //     let greeting = "You are " + personName + ".";
        //     let utterance = new SpeechSynthesisUtterance(greeting);
        //     speechSynthesis.speak(utterance);
        //     myAnswer.innerHTML = greeting;
        //     weHaveAMatch = true;
        //     animateMouth(greeting);
        // }
        // getUser();

    }

    if(patternTest(/please record the term/g, command)) {
        let newKeyword = command.substring(23);
        console.log(newKeyword);
        travellingKeyword = newKeyword;
        definitionInProgress = true;
        console.log('Ready to receive a definition. Click button or type...');
        
        let instructions = "Ok, cool. I am ready to receive a definition!";
        let utterance = new SpeechSynthesisUtterance(instructions);
        speechSynthesis.speak(utterance);
        myAnswer.innerHTML = instructions;
        weHaveAMatch = true;
        animateMouth(instructions);
        
    }

    if(!weHaveAMatch) {
        for (const [key, value] of Object.entries(localStorage)) {
            //console.log(key.substring(0, 5), value);
            if(key.substring(0, 5)==="term-") {
                let regex = new RegExp(key.substring(6), "g");
                if(patternTest(regex, command)) {
                    let utterance = new SpeechSynthesisUtterance(value);
                    speechSynthesis.speak(utterance);
                    myAnswer.innerHTML = value;
                    weHaveAMatch = true;
                    animateMouth(value);
                    break;
                }
            }
        }
    }
    
    (async function callDB() {
        const response = await fetch("views/chatbot.php?q=" + command);
        const jsonData = await response.json();
        console.log(jsonData);

        if(jsonData.length !== 0) {
            let currentAnswer = jsonData[0].answers;

            let utterance = new SpeechSynthesisUtterance(currentAnswer);
            speechSynthesis.speak(utterance);
            myAnswer.innerHTML = currentAnswer;
            weHaveAMatch = true;
            animateMouth(currentAnswer);

            // reset match variable
            weHaveAMatch = false;
        } else {
            callJSONData();
        }

    })();

    async function callJSONData() {
        const response = await fetch("data/data.json");
        const jsonData = await response.json();
        console.log(jsonData);
        // window.myJSON = jsonData;
        // //window.myJSON[0].queries[0].answer;
        jsonData[0].queries.forEach((item, index) => {
            //console.log(item.question + " : " + item.answer);
            let regex = new RegExp(item.question, "g");
            if(patternTest(regex, command)) {
                // alert("success");
                // alert(item.answer);
                let currentAnswer;
                let randomize = Math.floor(Math.random() * item.answer.length)
                console.log("randomizer number: " + randomize);
                if(item.answer.length > 1) {
                    currentAnswer = item.answer[randomize]
                } else {
                    currentAnswer = item.answer[0];
                }
                let utterance = new SpeechSynthesisUtterance(currentAnswer);
                speechSynthesis.speak(utterance);
                myAnswer.innerHTML = currentAnswer;
                weHaveAMatch = true;
                animateMouth(currentAnswer);
            }
            // if(item.question === command) {
            //     alert("success");
            //     alert(item.answer);
            // }
        });

        ////If we don't have a match
        if(!weHaveAMatch) {
            currentAnswer = "Sorry, what is " + command;
            let utterance = new SpeechSynthesisUtterance(currentAnswer);
            speechSynthesis.speak(utterance);
            myAnswer.innerHTML = currentAnswer;
            animateMouth(currentAnswer);
        }
        // reset match variable
        weHaveAMatch = false;

    }

    // callJSONData();

}

function parseDefinition(definition) {
    if(definition == " " || definition == "") {
        let askText = "Please give me some input on: " + travellingKeyword;
        let utterance = new SpeechSynthesisUtterance(askText);
        speechSynthesis.speak(utterance);
        myAnswer.innerHTML = askText;
        animateMouth(askText);
    } else {
        myQuestionBox.value = "";

        // PHP & SQL
        // (async function storeToDB() {
        //     const response = await fetch("views/chatbot.php?record=" + definition + "&keyword=" + travellingKeyword);
        //     const jsonData = await response.json();
        //     console.log(jsonData);
        //     if(jsonData[0].status === "DATA SAVED") {
        //         let confirmText = "Cool, now I know what " + travellingKeyword + " is.";
        //         let utterance = new SpeechSynthesisUtterance(confirmText);
        //         speechSynthesis.speak(utterance);
        //         myAnswer.innerHTML = confirmText;
        //         animateMouth(confirmText);
        //     }
        //     definitionInProgress = false;
        //     // reset match variable
        //     weHaveAMatch = false;
        // })();

        // JavaScript ONLY Solution (fall-back solution)
        localStorage.setItem(`term-${travellingKeyword}`, definition);
        let confirmText = "Cool, now I know what " + travellingKeyword + " is.";
        let utterance = new SpeechSynthesisUtterance(confirmText);
        speechSynthesis.speak(utterance);
        myAnswer.innerHTML = confirmText;
        animateMouth(confirmText);
        definitionInProgress = false;
        // reset match variable
        weHaveAMatch = false;
    }
}

recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    let text = event.results[0][0].transcript;
    diagnostic.textContent = 'Result received: ' + text + '.';
    console.log('Confidence: ' + event.results[0][0].confidence);
    (!definitionInProgress) ? parseCommand(text) : parseDefinition(text); //null

}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    diagnostic.textContent = "Sorry, I didn't recognise that.";
}

recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}