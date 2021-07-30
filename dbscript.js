let req = indexedDB.open("Gallery",1);
let database;


req.addEventListener("success",function(){
    database = req.result;
})
req.addEventListener("upgradeneeded",function(){
    let db = req.result;
    db.createObjectStore("media",{keyPath:"mId"});

})
req.addEventListener("error",function(){
    
})