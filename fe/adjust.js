function Adjust(type) {
    this.subs = {};
    this.last_id = 0;
    this.value = null;
    this.type = type

    this.subscribe = (func) => {
        if (this.value) {
            func(this.value)
        }
        this.subs[this.last_id] = func
        let unsub = this.last_id++;
        return () => this.unsubscribe(unsub)
    }

    this.unsubscribe = (id) => {
        delete this.subs[id]
    }

    this.publish = (arg) => {
        if(!arg.constructor){
            throw Error(`arg ${arg} is not an object`)
        }
        if (this.type && this.type.name !== arg.constructor.name) {
            throw Error(`arg ${arg} type ${arg.constructor.name} is not type of ${this.type.name}`)
        }
        this.value = arg;
        Object.values(this.subs).forEach((func) => {
            func(arg);
        });
    }
}

export { Adjust }