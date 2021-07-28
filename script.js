      let chunks =[];
      let recordingPlayer = document.querySelector("#record");
      let videoPlayer = document.querySelector("video");
      let mediaRecorder;
      let isrecordingbtn = false;
      let captureImage = document.querySelector("#capture");
      let recordSpan = recordingPlayer.querySelector("span");
      let captureSpan = captureImage.querySelector("span");

      captureImage.addEventListener("click" , function(){
        captureSpan.classList.add("capture-animation") 
        setTimeout(function(){
            captureSpan.classList.remove("capture-animation")
        },1000)
        let canvas = document.createElement("canvas");
        // let canvas = document.createElement("canvas");

canvas.height = videoPlayer.videoHeight;
canvas.width = videoPlayer.videoWidth;
let tool = canvas.getContext("2d");

tool.drawImage(videoPlayer,0,0);

let Url = canvas.toDataURL();
let a = document.createElement("a");
a.href = Url;
a.download = "img.png";
a.click();
      })
      recordingPlayer.addEventListener("click",function(){

          if(isrecordingbtn){
              mediaRecorder.stop();
              isrecordingbtn = false;
              recordSpan.classList.remove("record-animation");
          }else{
              mediaRecorder.start();
              isrecordingbtn = true;
              recordSpan.classList.add("record-animation");
          }
      })
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
          mediaRecorder.addEventListener("dataavailable",function(e){
            chunks.push(e.data);
        })
          mediaRecorder.addEventListener("stop",function(e){
            let blob = new Blob(chunks,{type:"video/mp4"});
            chunks = [];
            let link = URL.createObjectURL(blob);

            let a = document.createElement("a");

            a.href = link;
            a.download = "video.mp4";
            a.click();
            
          });

        })
        .catch(function () {
          //if the permission is not accepted then catch will work which means if the function is not resolve then catch will work
          console.log("user have deined the premission of camera");
        });