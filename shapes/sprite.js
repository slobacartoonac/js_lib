import { AnimationSprite } from "../actors/animated_sprite"

function Sprite(image) {
	this.image = image
	this.animation = null
	this.setAnimation = (images) => {
		this.animation = new AnimationSprite(images, this)
	}
	this.tick = () => {
		this.animation && this.animation.tick()
	}
}

export { Sprite }