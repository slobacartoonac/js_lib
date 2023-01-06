import { ShapeText } from "../../shapes/text";
import { Renderer } from "../drawers/render";
import { Transform } from "../physics/transform";
import { createBodrededBoxColor } from "./element";
import { chunkString } from "./tools";

//chunkString
//chunkStringLong
function baloonElement() {

}
function setAsociation(manager, ...boxes) {
    boxes.forEach(box => manager.asign(new baloonElement(), box))
}

export function createTextBaloon(manager, renderer, positions, text, options) {
    let entities = []
    let textWidth = 0
    let textChunks = chunkString(text)
    let textSize = options?.textSize || 20
    let lineHeight = options?.lineHeight || textSize + 10
    let background = options?.background || '#ffffffaa'
    let borderColor = options?.borderColor || '#ffffff'
    let borderWidth = options?.borderWidth || 1
    let anchor = options?.anchor || [0, 0]
    let paddingX = options?.paddingX || options?.padding || 10
    let paddingY = options?.paddingY || options?.padding || 10
    let shapes = textChunks.map((str) => {
        let shapeText = new ShapeText(textSize, str)
        textWidth = Math.max(renderer.mesure(shapeText).width, textWidth)
        return shapeText
    })
    let boxWidth = textWidth + paddingX * 2
    let boxHeight = shapes.length * lineHeight + paddingY * 2
    let posX = positions[0] - boxWidth * anchor[0]
    let posY = positions[1] - boxHeight * anchor[1]
    let boxes = createBodrededBoxColor(
        manager,
        posX,
        posY,
        boxWidth,
        boxHeight,
        background,
        { color: borderColor, width: borderWidth }
    )
    entities.push(...boxes)
    setAsociation(manager, ...boxes)
    shapes.map((shapeText, line) => {
        let entityText = manager.create()
        manager.asign(new Transform([posX + paddingX, posY + paddingY + line * lineHeight]), entityText)
        manager.asign(shapeText, entityText)
        manager.asign(new Renderer('#000000', null, 2), entityText)
        entities.push(entityText)
        setAsociation(manager, entityText)
    })
    return entities
}