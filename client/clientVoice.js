const talk = document.getElementById("talk");
const restart = document.getElementById("restart");
const requestPreview = document.getElementById("request");
const responsePreview = document.getElementById("response");
responsePreview.disabled = true;
requestPreview.disabled = true;

//Setting up socket.io connection to server
const socketio = io.connect("http://Your-Hosted-Domain");
socketio.on("connected", function (data) {
  if (data.connected) {
    talk.disabled = false;
    requestPreview.innerHTML = "Press Talk to start...";
    setTimeout(() => {
      responsePreview.innerHTML = "";
    }, 1000);
  }
});

socketio.on("connect_error", (err) => {
  responsePreview.innerHTML = "Connection/server error";
  console.log(`connect_error due to ${err.message}`);
});

//handeling the speech recognition
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let content = "";

recognition.onstart = function () {
  requestPreview.innerHTML = "Listening...";
};

recognition.onend = () => {
  socketio.emit("request", content);
  responsePreview.innerHTML = "Requesting...";
};

recognition.onerror = function () {
  socketio.emit("summary-response", "an error occured");
};

recognition.onresult = function (event) {
  let currentIndex = event.resultIndex;

  let transcript = event.results[currentIndex][0].transcript;

  content += transcript;

  requestPreview.innerHTML = content;
};

talk.onclick = (event) => {
  talk.disabled = true;
  requestPreview.innerHTML = "";
  responsePreview.innerHTML = "";

  if (content.length) {
    content = "";
  }

  recognition.start();
};

socketio.on("summary-response", function (data) {
  if (data) {
    speakResponse(data);
  }
  responsePreview.innerHTML = data;
});

// Getting response from server
socketio.on("brief-response", function (data) {
  if (!data) {
    data = "an error occured";
    responsePreview.innerHTML = data;
  }
});

//handeling the speech synthesis
const synth = window.speechSynthesis;
const speakResponse = function (text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

//restart button click
restart.onclick = () => {
  requestPreview.innerHTML = "Press Talk to start...";
  responsePreview.innerHTML = "";
  talk.disabled = false;
  recognition.abort();
  speechSynthesis.pause();
  socketio.emit("stop", {});
};
