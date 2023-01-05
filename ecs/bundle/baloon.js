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

function makeBaloon(manager, renderer, positions, text, options) {
    let stabiley = positions[1]
    let textWidth = 0
    let textChunks = chunkString(text)
    let textSize = options?.textSize || 20
    let lineHeight = options?.lineHeight || textSize + 10
    let shapes = textChunks.map((str) => {
        let shapeText = new ShapeText(textSize, str)
        textWidth = Math.max(renderer.mesure(shapeText).width, textWidth)
        return shapeText
    })
    let boxes = createBodrededBoxColor(
        manager,
        positions[0],
        stabiley,
        textWidth + 10,
        shapes.length * lineHeight + 10,
        '#ffffffaa',
        { color: '#ffffff', width: 1 }
    )
    setAsociation(manager, ...boxes)
    shapes.map((shapeText, line) => {
        let entityText = manager.create()
        manager.asign(new Transform([positions[1] - textWidth - 20, stabiley + line * lineHeight + 5]), entityText)
        manager.asign(shapeText, entityText)
        manager.asign(new Renderer('#000000', null, 2), entityText)
        setAsociation(manager, entityText)
    })
    return stabiley
}