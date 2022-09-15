import { Component } from "./component";


function createComponentAdjust(adjust, drawer) {
    const component = new Component(drawer)

    let unsubscribe;

    component.watch((func) => {
        // console.log('watch ', func)
        unsubscribe = adjust.subscribe(func);
    }, () => {
        // console.log('unsubscribe ', unsubscribe)
        unsubscribe();
    })

    return component
}

export { createComponentAdjust }