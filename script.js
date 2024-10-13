const htmlElement = document.getElementsByTagName("html")[0];
let currentZoom = 100;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};

const timerStart = document.querySelector(".timerStart");

function playTimer() {
  timerStart.style.backgroundColor = "#dd9f9b";
  timerStart.style.color = "#FFFFFF";
  timerStart.textContent = "stop";
  const timerCountdown = document.querySelector(".timerCountdown");
  timerCountdown.style.color   = "#dd9f9b";
  if (timerCountdown) {
    let time = timerCountdown.textContent;
    let a = time?.split(':') || ['0', '0'];
    let minutes = (+a[0]);
    let seconds = (+a[1]);
    let totalSeconds = minutes * 60 + seconds;
    let myVar = setInterval(() => myTimer(), 1000);
    
    function myTimer() {
      if (totalSeconds <= 0) {
        myStopFunction();
      }
      let displayMinutes = Math.floor(totalSeconds / 60);
      let displaySeconds = totalSeconds % 60;
      timerCountdown.innerHTML = zeroPad(displayMinutes, 2) + ':' + zeroPad(displaySeconds, 2);
      totalSeconds--;
    }
    
    function myStopFunction() {
      clearInterval(myVar);
    }
    
    function zeroPad(num, places) {
      let zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }
  }
}

function hideElement(elementName) {
  elementName.classList.add("hidden");
}

timerStart.addEventListener("click", () => playTimer());

const timerExit = document.querySelector(".timerExit");
timerExit.addEventListener("click", () => {
  const timer = document.querySelector(".timer");
  hideElement(timer);
});

const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

let currentExpression = '';

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'absolute';
  canvas.style.left = '43em';
  canvas.style.top = '13em';
  //canvas.classList.add("hidden"); //unhide this for demo
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    
    if (resizedDetections.length > 0) {
      const expressions = resizedDetections[0].expressions; 
      const dominantExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b); 
      
      console.log(`Current Expression: ${dominantExpression}`);
      currentExpression = dominantExpression; 
    }

    if (currentExpression === "sad" || currentExpression === "happy") {
      canvas.classList.add("hidden"); 
      if(currentZoom!=200){
        currentZoom += 50; 
        
        htmlElement.style.fontSize = currentZoom + "%";
      }
    }
  }, 450);
});

startVideo();

const audio = new Audio('./fromTheStart.mp3');

spotifyPlayer.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});