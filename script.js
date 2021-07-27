let body = document.querySelector("body");
let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let allFilters = document.querySelectorAll(".filter");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let filter = "";
let zoomInBtn = document.querySelector(".zoom-in");
let zoomOutBtn = document.querySelector(".zoom-out");
let height = 90;

//-----------zoom-in-work---------------------
zoomInBtn.addEventListener("click", function () {
  height += 35;
  if (height <= 160) {
    videoPlayer.style.height = `${height}%`;
    videoPlayer.style.top = 0;
  } else {
    height = 160;
  }
});

// ---------------zoom-out-work-------------------------
zoomOutBtn.addEventListener("click", function () {
  height -= 35;
  if (height >= 89) {
    videoPlayer.style.height = `${height}%`;
    videoPlayer.style.top = `2rem`;
  } else {
    height = 90;
    videoPlayer.style.top = `2rem`;
  }
});

// -------------Processing Filter---------------
for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let previousFilter = document.querySelector(".filter-div");
    if (previousFilter) previousFilter.remove();
    let color = e.currentTarget.style.backgroundColor;
    filter = color;
    let div = document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor = color;
    body.append(div);
  });
}

// ---------Capture Button work--------------------
captureBtn.addEventListener("click", function () {
  let innerSpan = captureBtn.querySelector("span");
  innerSpan.classList.add("capture-animation");
  setTimeout(function () {
    innerSpan.classList.remove("capture-animation");
  }, 1000);


  let canvas = document.createElement("canvas");
  canvas.width = videoPlayer.videoWidth;
  canvas.height = videoPlayer.videoHeight;
  let tool = canvas.getContext("2d");
  tool.drawImage(videoPlayer, 0, 0);

  if (filter != "") {
    tool.fillStyle = filter;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }

  let url = canvas.toDataURL();  
  canvas.remove();

  let a = document.createElement("a");
  a.href = url;
  a.download = "image.png";
  a.click();
  a.remove();
});

// ------------Record Button work--------------
recordBtn.addEventListener("click", function () {
  let innerSpan = recordBtn.querySelector("span");

  let previousFilter = document.querySelector(".filter-div");
  if (previousFilter) previousFilter.remove();
  filter = "";

  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    innerSpan.classList.remove("record-animation");
  } else {
    innerSpan.classList.add("record-animation");
    mediaRecorder.start();
    isRecording = true;
  }
});

let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});

promiseToUseCamera
  .then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];
      let link = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = link;
      a.download = "video.mp4";
      a.click();
      a.remove();
    });
  })
  .catch(function () {
    console.log("user has denied the access of camera");
  });
