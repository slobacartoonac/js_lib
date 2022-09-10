//written by Slobodan Zivkovic slobacartoonac@gmail.com
function MyAudio() {
    if (typeof AudioContext !== "undefined") {
        this.context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        this.context = new webkitAudioContext();
    } else {
        throw new Error('AudioContext not supported. :(');
    }
    this.context.resume()
    this.svolume = this.context.createGain();
    this.svolume.connect(this.context.destination);
    this.svolume.gain.value = 0.9;
    this.loaded = {};
    this.buffers = {};
    this.promises = {}
};

MyAudio.prototype.request = function (sid, url) {
    this.promises[sid] = new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = () => {
            var audioData = request.response;
            this.createSoundSource(audioData, sid);
            resolve((volume) => { this.play(sid, volume); })
        };
        request.onerror = () => { reject("error loading: " + sid + " " + url) }
        request.send();
    })

    return (volume) => this.promises[sid].then(el => { el(volume) })
}

MyAudio.prototype.play = function (name, volume = 1) {
    if (!this.promises[name]) {
        throw new Error("First load resource with " + name)
    }
    return this.promises[name].then(() => {
        var vol = this.context.createGain();
        vol.gain.value = volume;
        vol.connect(this.svolume);
        var soundSource = this.context.createBufferSource();
        soundSource.buffer = this.loaded[name];
        soundSource.connect(vol);
        soundSource.start(this.context.currentTime);
        var ret = { s: soundSource, v: vol, end: false };
        soundSource.onended = () => { ret.end = true };
        return ret;
    })
}

MyAudio.prototype.createSoundSource = function (audioData, sid) {
    this.context.decodeAudioData(audioData, (soundBuffer) => {
        this.loaded[sid] = soundBuffer;
    });
}

export { MyAudio }