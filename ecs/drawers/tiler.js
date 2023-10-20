export function TileRenderEngine() {

}

TileRenderEngine.render = function(image, x, y, tx,ty){
    for(let iy = 0; iy<y; iy+=ty){
        for(let ix = 0; ix<x; ix+=tx){
            let fx = Math.min(tx,x-ix)
            let fy = Math.min(ty,y-iy)
            this.context.drawImage(image, ix, iy, fx, fy)
        }
    }
}