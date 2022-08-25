function Adjust() {
    this.subs = {};
    this.last_id = 0;
    this.last_value = null;

    this.subscribe = (func) => {
        if (this.last_value) {
            func(this.last_value)
        }
        this.subs[this.last_id] = func
        let unsub = this.last_id++;
        return () => this.unsubscribe(unsub)
    }

    this.unsubscribe = (id) => {
        delete this.subs[id]
    }

    this.publish = (arg) => {
        this.last_value = arg;
        Object.values(this.subs).forEach((func) => {
            func(arg);
        });
    }
}

export { Adjust }