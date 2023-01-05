let images = {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function ImageHash() {
}
ImageHash.get = (image) => {
    if (images[image]) {
        return images[image]
    }
    images[image] = new Image()
    images[image].src = image
    return images[image]
}

export { ImageHash }