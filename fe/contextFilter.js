function imageIsLoaded(img, callback){
    console.log("loadi image", img)
    if (img.complete) {
        callback(img)
      } else {
        img.onload = function() {
            callback(img)
        };
        
        img.onerror = function(err) {
          console.log('Image failed to load.', img, err);
          callback(null)
        };
      }
}
// color sprite into color and return image
function contextFilter(image, color, callback) {
    var res = new Image();
    imageIsLoaded(image, function(img){
        if(!img){
            return callback(null)
        }
        var canvas = document.createElement("canvas")
        var context = canvas.getContext("2d");

        var w = img.naturalWidth
        var h = img.naturalHeight

        canvas.width = w
        canvas.height = h

        context.drawImage(img,
            0,
            0,
            w,
            h,
            0,
            0,
            w,
            h);
    
        context.globalCompositeOperation = "darken";
    
        context.fillStyle = color
        context.fillRect(0, 0, w, h);
    
        context.globalCompositeOperation = "destination-in";
    
        context.drawImage(img,
            0,
            0,
            w,
            h,
            0,
            0,
            w,
            h);
    
        var dataURL = canvas.toDataURL("image/png");
        
        res.src = dataURL;
        imageIsLoaded(res, function(resLoaded){
            if(!resLoaded){
                return callback(null)
            }
            callback({canvas, context, image: resLoaded})
        })
    })
    return res;
}

export { contextFilter }