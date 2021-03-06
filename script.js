let chunks = [];
let body = document.querySelector("body");
let recordingPlayer = document.querySelector("#record");
let videoPlayer = document.querySelector("video");
let mediaRecorder;
let isrecordingbtn = false;
let captureImage = document.querySelector("#capture");
let recordSpan = recordingPlayer.querySelector("span");
let allFilters = document.querySelectorAll(".filter");
let captureSpan = captureImage.querySelector("span");
let zoomin = document.querySelector(".in");
let zoomout = document.querySelector(".out");
let currentZoom = 1;
let filter = "";
let galleryBtn = document.querySelector("#gallery")
for(let i = 0;i< allFilters.length;i++){
  allFilters[i].addEventListener("click",function(e){
    let previousFilter = document.querySelector(".filter-div");
    if(previousFilter){
      previousFilter.remove();
    }
    let color = e.currentTarget.style.backgroundColor;
    filter = color;
    let div = document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor = color;
    body.append(div);
  });
}

galleryBtn.addEventListener("click",function(){
  location.assign("gallery.html");
})
zoomin.addEventListener("click", function () {
  currentZoom = currentZoom + 0.1;
  if (currentZoom > 3) currentZoom = 3;

  videoPlayer.style.transform = `scale(${currentZoom})`;
});
zoomout.addEventListener("click", function () {
  currentZoom = currentZoom - 0.1;
  if (currentZoom < 1) currentZoom = 1;

  videoPlayer.style.transform = `scale(${currentZoom})`;
});

captureImage.addEventListener("click", function () {
  captureSpan.classList.add("capture-animation");
  setTimeout(function () {
    captureSpan.classList.remove("capture-animation");
  }, 1000);
  let canvas = document.createElement("canvas");
  // let canvas = document.createElement("canvas");

  canvas.height = videoPlayer.videoHeight;
  canvas.width = videoPlayer.videoWidth;
  let tool = canvas.getContext("2d");
  tool.translate(canvas.width / 2, canvas.height / 2);
  tool.scale(currentZoom, currentZoom);
  tool.translate(-canvas.width / 2, -canvas.height / 2);
  tool.drawImage(videoPlayer, 0, 0);

  if(filter != ""){
  tool.fillStyle = filter;
  tool.fillRect(0,0,canvas.width,canvas.height);
}

  let Url = canvas.toDataURL();
  saveMedia(Url);
  // let a = document.createElement("a");
  // a.href = Url;
  // a.download = "img.png";
  // a.click();
  // a.remove();

});
recordingPlayer.addEventListener("click", function () {
  let previousFilter = document.querySelector(".filter-div");
    if(previousFilter){
      previousFilter.remove();
    }
  currentZoom = currentZoom - 0.1;
  if(currentZoom < 1) currentZoom =1;

  videoPlayer.style.transform = `scale(${currentZoom})`;

  if (isrecordingbtn) {
    mediaRecorder.stop();
    isrecordingbtn = false;
    recordSpan.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    isrecordingbtn = true;
    recordSpan.classList.add("record-animation");
  }
  currentZoom = 1;
  videoPlayer.style.transform = `scale(${currentZoom})`;
});
// here we use navigator which is a inbuild object in web API then we go into navigator then mediadevices which consist of video audio etc
// and after that we use get usermedia in which this all help to take permission from user to on audio and camera;
let cameraToUse = navigator.mediaDevices.getUserMedia({
  //bydefault value is false;
  audio: true,
  video: true,
});
//as we have to wait for the permission we use promise and in promise we use media stream which is consist of audio video etc media
//it a object passed in the function;
cameraToUse
  .then(function (mediaStream) {
    //here we use srcObject to provide a src to videoPlayer to make it run properly;
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];
      // let link = URL.createObjectURL(blob);

      // let a = document.createElement("a");

      // a.href = link;
      // a.download = "video.mp4";
      // a.click();
      saveMedia(blob);
    });
  })
  .catch(function () {
    //if the permission is not accepted then catch will work which means if the function is not resolve then catch will work
    console.log("user have deined the premission of camera");
  });
