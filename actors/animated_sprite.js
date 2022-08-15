function AnimationSprite(images, ecs) {
    this.ecs = ecs
    this.images = images
    this.index = 0;
    this.tick = () => {
        this.ecs.image = this.images[(++this.index) % this.images.length]
    }
}

export { AnimationSprite }