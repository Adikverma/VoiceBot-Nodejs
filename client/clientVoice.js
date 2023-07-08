const talk = document.getElementById("talk");
const restart = document.getElementById("restart");
const requestPreview = document.getElementById("request");
const responsePreview = document.getElementById("response");
responsePreview.disabled = true;
requestPreview.disabled = true;

//webkit models
//stt
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let content = "";

//tts
let speech = new SpeechSynthesisUtterance();
speech.lang = "en";
let voices = [];

//Setting up socket.io connection to server
const socketio = io.connect("/");
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

recognition.onstart = function () {
  requestPreview.innerHTML = "Listening...";
};

recognition.onend = () => {
  if (!content) {
    requestPreview.innerHTML = "No Speech Detected";
  } else {
    socketio.emit("request", content);
    responsePreview.innerHTML = "Requesting...";
    setTimeout(() => {
      if (responsePreview.textContent == "Requesting...")
        responsePreview.textContent = "Timeout";
    }, 5000);
  }
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

talk.onclick = () => {
  talk.disabled = true;
  requestPreview.innerHTML = "";
  responsePreview.innerHTML = "";

  if (content.length) {
    content = "";
  }

  recognition.start();
};

// Getting response from server
socketio.on("summary-response", function (data) {
  if (
    responsePreview.textContent != "Timeout" &&
    responsePreview.textContent != ""
  ) {
    responsePreview.innerHTML = data;
    speech.text = data;
    window.speechSynthesis.speak(speech);
  }
});

//handeling the speech synthesis

//on voice select
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  let voiceSelect = document.querySelector("#voices");
  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
};

document.querySelector("#rate").addEventListener("input", () => {
  const rate = document.querySelector("#rate").value;
  speech.rate = rate;

  document.querySelector("#rate-label").innerHTML = rate;
});

document.querySelector("#volume").addEventListener("input", () => {
  const volume = document.querySelector("#volume").value;
  speech.volume = volume;

  document.querySelector("#volume-label").innerHTML = volume;
});

document.querySelector("#pitch").addEventListener("input", () => {
  const pitch = document.querySelector("#pitch").value;
  speech.pitch = pitch;

  document.querySelector("#pitch-label").innerHTML = pitch;
});

document.querySelector("#voices").addEventListener("change", () => {
  speech.voice = voices[document.querySelector("#voices").value];
});

document.querySelector("#pause").addEventListener("click", () => {
  window.speechSynthesis.pause();
});

document.querySelector("#resume").addEventListener("click", () => {
  window.speechSynthesis.resume();
});

document.querySelector("#start").addEventListener("click", () => {
  window.speechSynthesis.cancel();

  speech.text = responsePreview.innerHTML;

  window.speechSynthesis.speak(speech);
});

document.querySelector("#reset").addEventListener("click", () => {
  //stop speak
  window.speechSynthesis.cancel();

  //reset voice
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  let voiceSelect = document.querySelector("#voices");
  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );

  //reset meters
  document.querySelector("#pitch").value = 1;
  document.querySelector("#pitch-label").innerHTML = 1;

  document.querySelector("#volume").value = 1;
  document.querySelector("#volume-label").innerHTML = 1;

  document.querySelector("#rate").value = 1;
  document.querySelector("#rate-label").innerHTML = 1;
});

//restart button click
restart.onclick = () => {
  requestPreview.innerHTML = "Press Talk to start...";
  responsePreview.innerHTML = "";
  talk.disabled = false;
  window.speechSynthesis.cancel();
};
