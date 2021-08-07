let req = indexedDB.open("Gallery",1);
let database;
let numberOfMedia = 0;

req.addEventListener("success",function(){
    database = req.result;
})
req.addEventListener("upgradeneeded",function(){
    let db = req.result;
    db.createObjectStore("media",{keyPath:"mId"});

})
req.addEventListener("error",function(){
    
})

function saveMedia(media){
    if(!database){
        return;
    }
    let data = {
        mId : Date.now(),
        mediaData: media
    }
    let tx = database.transaction("media","readwrite");
    let mediaObjectStore =tx.objectStore("media");

    mediaObjectStore.add(data);
}
function viewMedia(){
    let galleryContainer = document.querySelector(".gallery-container");
    let tx = database.transaction("media","readonly");
    let mediaObjectStore = tx.objectStore("media");

    let req = mediaObjectStore.openCursor();

    req.addEventListener("success", function(){

        cursor = req.result;
        if(cursor){
        numberOfMedia++;
        
        let mediaCard = document.createElement("div");
        mediaCard.classList.add("media-card");
        mediaCard.innerHTML=`<div class="media-card">
                             <div class="actual-media"></div>
                             <div class="media-buttons">
                             <div class ="media-download material-icons">file_download</div>
        <div data-mid = "${cursor.value.mId}" class="media-delete material-icons">delete_outline</div>
                      </div>
                      </div>`
                      
                      let data = cursor.value.mediaData;

                      let actualMediaDiv = mediaCard.querySelector(".actual-media");
                      let mediaDownload = document.querySelector(".media-download");
                      let mediaDelete = document.querySelector(".media-delete");
                      
                    //   mediaDelete.addEventListener("click", function (e) {
                    //       let mId = Number(e.currentTarget.getAttribute("data-mid"));
                    //       deleteMedia(mId);
                          
                    //       e.currentTarget.parentElement.parentElement.remove();
                    //     });
                        
                        let type = typeof data;
                        //image
        if(type == "string"){
            let img = document.createElement("img");
            img.src = data;
            
            
            // download
            actualMediaDiv.append(img);
        }
        //video
        else if(type == "object"){
            let video = document.createElement("video");
            let url = URL.createObjectURL(data);
            video.src = url;
            //download
            
            video.autoplay = true;
            video.controls = true;
            video.muted = true;
            video.loop = true;
            
            actualMediaDiv.append(video);
        }
        galleryContainer.append(mediaCard);
        cursor.continue();
    } else{
            if(numberOfMedia == 0){
                galleryContainer.innerText ="NO MEDIA PRESENT";
            }
        }
    })
 }
        
        