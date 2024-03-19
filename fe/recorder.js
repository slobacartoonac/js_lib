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

export const takeScreenshot = (type) => {
    var canvas = document.getElementsByTagName("canvas")[0];
    return canvas.toDataURL(type || 'png');
}