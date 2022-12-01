// written by Slobodan Zivkovic slobacartoonac@gmail.com
function TouchKeyboard(div) {
    this.debug = false;
    this.console_error = false;
    this.throw_error = false;
    this.last_error = ''
    this.clear()

    let input = document.createElement("input")
    div.appendChild(
        input
    )
    this.input = input
    input.style.position = "absolute"
    input.style.top = 0;
    input.style.left = 0;
    input.style.opacity = 0;
    input.size = 1;
    input.addEventListener('input', (e) => {
        if ("" == e.target.value) {
            input.blur()
        }
        this.triger("type", e.target.value)
    }, false)
    input.addEventListener("keypress", (event) => {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.triger("submit", input.value)
            input.value = ""
            this.triger("type", input.value)
            input.blur()
        }
    })
}
/*eslint-disable */
TouchKeyboard.prototype.sub = function (ev, func) {
    if (this.events[ev]) this.events[ev].push(func)
}

TouchKeyboard.prototype.onType = function (func) {
    this.events.type.push(func)
}
TouchKeyboard.prototype.onSubmit = function (func) {
    this.events.submit.push(func)
}
TouchKeyboard.prototype.onClear = function (func) {
    this.events.clear.push(func)
}
TouchKeyboard.prototype.focus = function () {
    this.input.focus()
}

TouchKeyboard.prototype.unsub = function (ev, func) {
    if (this.events[ev])
        this.events[ev] = this.events[ev].filter(fu => fu !== func)
}
TouchKeyboard.prototype.clearEvlent = function (ev) {
    if (this.events[ev]) this.events[ev] = []
}
TouchKeyboard.prototype.clear = function () {
    this.events = {
        type: [],
        submit: [],
        clear: [],
    }
}
TouchKeyboard.prototype.triger = function (ev, args) {
    if (this.events[ev])
        this.events[ev].forEach(func => {
            try {
                func(args)
            }
            catch (e) {
                if (this.console_error) console.log(e)
                this.last_error = 'Error: ' + e.name +
                    ' ' + e.foo +
                    ' ' + e.message +
                    ' ' + e.stack
                if (this.throw_error) throw e
            }
        })
}

export default TouchKeyboard