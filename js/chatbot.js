var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let weHaveAMatch = false;

let diagnostic = document.querySelector('.output');
let hints = document.querySelector('.hints');

hints.innerHTML = 'Click button and say something or type a message';

let micBtn = document.getElementById("record");
//.document.body.

const myAnswer = document.getElementById("answer");
const myQuestionBox = document.getElementById("command");

micBtn.onclick = function() {
    recognition.start();
    console.log('Ready to receive a command.');
}

function patternTest(pattern, command) {
    let result = pattern.test(command.toLowerCase());
    weHaveAMatch = (result) ? true : false;
    return result;
}

function parseCommand(command) {
    console.log(command);
    myQuestionBox.value = "";

    if(patternTest(/i like pizza/g, command)) {
        console.log("Yay! Yummy :P");
        hints.innerHTML = '<img src="https://api.pizzahut.io/v1/content/en-ca/ca-1/images/pizza/pizza.supreme-lovers.3706cdc20b0752ac212c0d68a310fb18.1.jpg">'
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
    }

    if(patternTest(/vegas/g, command)) {
        top.location.href = "https://www.expedia.ca/Cheap-Flights-To-Las-Vegas.d178276.Travel-Guide-Flights"
        let utterance2 = new SpeechSynthesisUtterance("Have a safe trip");
        speechSynthesis.speak(utterance2);
    }

    if(patternTest(/my favourite show on youtube/g, command)) {
        console.log("VIDEO")
        hints.innerHTML = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/EorJ8cEzsZo?start=1&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }

    if(patternTest(/i like red/g, command)) {
        let myBG = document.querySelector("body");
        myBG.style.backgroundColor = "red";
    }

    (async function callJSONData() {
        const response = await fetch("data/data.json");
        const jsonData = await response.json();
        console.log(jsonData);
        // window.myJSON = jsonData;
        // //window.myJSON[0].queries[0].answer;
        jsonData[0].queries.forEach((item, index) => {
            console.log(item.question + " : " + item.answer);
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
            }
            // if(item.question === command) {
            //     alert("success");
            //     alert(item.answer);
            // }



        });
        // if(!weHaveAMatch) {
        //     currentAnswer = "Sorry, I don't know...";
        //     let utterance = new SpeechSynthesisUtterance(currentAnswer);
        //     speechSynthesis.speak(utterance);
        //     myAnswer.innerHTML = currentAnswer;
        // }
        // weHaveAMatch = false;
    })();
    // callJSONData();

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
    parseCommand(text);

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