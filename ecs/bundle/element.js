import { ImageHash } from "../../fe/imageHash"
import { ShapeBox } from "../../shapes/box"
import { ShapeRounded } from "../../shapes/rounded-box"
import { Sprite } from "../../shapes/sprite"
import { ShapeText } from "../../shapes/text"
import { ShapeScale } from "../../shapes/scale"
import { Renderer } from "../drawers/render"
import { Selectable } from "../drawers/select_ecs"
import { Transform } from "../physics/transform"

export const planeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAyCAYAAABLXmvvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4wOGVynOEAAATWSURBVFhH5Zh/aJVVGMdP2c3dkfvBJtvK5trmnW0O7/TW3Q/Su2mRVkgxBtmv0R/iDzSdzMJ/HEszhywtkS2ixEjHIKVIRtG4G6zhMJTLiBYWLvzDUELm3RgX2f32PGfvfXvf3fd63/PeVX/0wmF3d8/zfM75nud9nnMmhPPnY3KtcO7uzHMJuc3Q6HTm7txr94FFLpD7NechnHkGUZiOtWkLpsi91lkIda9cAt5l8Pf5bl71SfUQzjy2sMwM5kEhbtC431koNa++4QL3VAys7XVALYS6dQa5TMSg/6bcm3WZjx8G1q0yyv2A+jrse5wfLHBH5IrHfwN2NUuwJvcz9sOoWZplDt8B3t0vwcF8NxeTU2rh7Fs36TKX5kI+XceN2X2bQqXZD2ffskeXud4LTE0CF87rYE3uJvvh7Fk+SGa39Wx+ecPsHocu62BN7l574exbbTQWDZlUwe+AWzd1sFZMWO50+2GTW37C5VFf8SFKKt7fSAQoo/3Wqth8y83v5y1j0cBnJ4G2VuAayb2G9lsDcw6Q7bzJHTDJzJCuTqD5ReBcD/BstZXc/Oql/Jw4mOkK86oihRkYpRUGX1hvGqMNPkyXZhuLyeZUqdx1rktocQa6d2zFF91dCAaDcaNzz1uY9ORgqMA9TT5fpQqu5mbP4NC6JyU00cOTGXouEKvdnN1ZqcA72he5phn849M1cpUJwf39GHy+3ih3cyrgq7GMnSzOwdG9eyxlDhL0yL5W/Ln8YQnmfk3QPqdgL8k824lojC1bjCPVVRjcWD+bWK81Ivh2i/zMK+2uW4WQJ0/PcD4eETjXCbztQKZLnq14XC7Lx07/bP+Vg8vmyJD+++GqCvRVLJ1bTLY4AY8ai0Yy8Ecry9BbWTz3ne5XBXtIqhkV8OcrSvBp5TITmGMQOF8F/g5VKyXwlyuK0Lm63ATWavd2FfCIqTbb2GPe34O+ShNY61g/2AUvIYniAiTb4+HyR9Dq+7thxCauZTfftZI+u+Kago0Vj9KrtNXvi5swbxkR9yWlkoG8F6lKPb40G6/U+OP8NLlHkoH1e5Eq+GZhFjbV1ViCtewuvRf8TSuZ7RSQSNFDaFi7xhLMhYig++8FvjCct1D2XtUVs/2Gp+pw57GMRHJfSQTmNma6F6kUELZtrKvFHyS51cS17PZYwV9NJLMdqdmmudaPqyWLLcHtmS4+j7VbgXv1A7sNqYc9eeFNvqqZhoULwhyUwTv9q2UzsVqxlt2/zAXzWTihzLG2uP5xz12tDIaXCzFC0790SYiLH9wnplami+sl2ZloyUqT/TiB3Hws8hrhjVYyswL8PVcyMg7R6Dj2hOigFB1HmgijVExEHxWnUS9C0Raxl/7OFYpbIZ+5JtjXeB7n0wx9/54RfIavIDxLrjQsH/2R/8VwmsbrNPQOgytiANvEjWiR+AlNdK15SYzha/EtxsTROTLyBY6vrido/E6Tn6bYUfr8a8yODfiowrMZpMHvm0kOY0ACDOB9MR7NoVV/Q5+3i4HoWfEhfX/OKnEM35VrsRksazfv7xvazyS+QsTAOCXa5GcC45Boio79w/92ws/CixZx0QTeJgJJZzwfBnKVxhX/H8DH0CN2a3vsxY7Ubg1Ku0B7HWCwktN8GP+X4CzOcKeL+Av4rxN4I4tgSwAAAABJRU5ErkJggg=='
export const createBoxColor = (manager, x, y, sx, sy, color, stroke) => {
    let entity = manager.create()
    manager.asign(new Transform([x, y]), entity)
    manager.asign(new ShapeBox(sx, sy), entity)
    manager.asign(new Renderer(color, stroke), entity)
    manager.asign(new ShapeRounded(5), entity)
    return entity
}

export const createBodrededBoxColor = (manager, x, y, sx, sy, color, stroke) => {
    let border = stroke.width - 1
    let boxBorder = createBoxColor(
        manager,
        x - border,
        y - border,
        sx + border * 2,
        sy + border * 2,
        null,
        { ...stroke, width: border + 2 })

    let box = createBoxColor(
        manager,
        x, y, sx, sy, color)

    return [box, boxBorder]
}

export const createSprite = (manager, x, y, element, sx, sy) => {
    let entity = manager.create()
    manager.asign(new Transform([x, y]), entity)
    if (sx && sy) {
        manager.asign(new ShapeBox(sx, sy), entity)
    }
    if (sx && !sy) {
        manager.asign(new ShapeScale(sx), entity)
    }
    let img = ImageHash.get(element || planeBase64)
    manager.asign(new Sprite(img), entity)
    manager.asign(new Renderer(), entity)
    return entity
}

export const makeSelectable = (manager, entity) => {
    manager.asign(new Selectable('#aaffbb'), entity)
    return entity
}
export const setLayer = (manager, entity, layer) => {
    manager.get(Renderer, entity)[0].layer = layer
}
export const createText = (manager, x, y, text, color, size, layer) => {
    let entity = manager.create()
    let shapeText = new ShapeText(size || 20, text)
    manager.asign(new Transform([x, y]), entity)
    manager.asign(shapeText, entity)
    manager.asign(new Renderer(color, null, layer), entity)
    return entity
}