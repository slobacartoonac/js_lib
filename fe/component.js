function Component(renderer) {
    this.renderer = renderer
    this.parent = null
    this.div = null
    this.mount = (parent) => {
        // console.log("_mount")
        this.unparent()
        this.parent = parent
        this.reparent()
    }
    this.unmount = () => {
        // console.log("_unmount")
        this.removeWatch(this.update)
        this.unparent()
    }
    this.unparent = () => {
        if (this.div?.parentNode) {
            // console.log("unparent")
            this.div.parentNode.removeChild(this.div);
        }
    }
    this.reparent = () => {
        if (this.parent && this.div) {
            // console.log("this.parent.appendChild(this.div)", this.parent)
            this.parent.appendChild(this.div)
        }
    }
    this.update = (...args) => {
        // console.log("update")
        var newRender = this.renderer(...args)
        // console.log("renderer")
        this.unparent()
        this.div = newRender
        // console.log("this.div = newRender", newRender)
        this.reparent()
    }

    this.render
    this.watch = (addWatch, removeWatch) => {
        this.addWatch = addWatch
        this.removeWatch = removeWatch
        this.addWatch(this.update)
    }

}

export { Component }