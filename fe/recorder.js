var recordedChunks = [];

var time = 0;

export const record3sec = (timeout) => new Promise(function (res, rej) {
    var canvas = document.getElementsByTagName("canvas")[0];
    var stream = canvas.captureStream(30);

    let mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9"
    });

    mediaRecorder.start(time);

    mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
    }

    mediaRecorder.onstop = function (event) {
        var blob = new Blob(recordedChunks, {
            "type": "video/webm"
        });
        var url = URL.createObjectURL(blob);
        res(url);
    }
    if(timeout)
        setTimeout(()=>mediaRecorder.stop(), timeout)
});

export const takeScreenshot = (type, download) => {
    var canvas = document.getElementsByTagName("canvas")[0];
    var imgUrl = canvas.toDataURL(type || 'png');
    if(download){            
        // Create an anchor element
        var a = document.createElement('a');
        
        // Set the href attribute to the image URL
        a.href = imgUrl;
        
        // Set the download attribute to force download
        a.download = 'image.' + type || 'png'
        
        // Trigger a click event on the anchor element
        a.click();
    }
    return imgUrl;
}