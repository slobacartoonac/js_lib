interface MySchema {
    tag?: string,
    text?: string,
    style?: { [name: string]: string }
    className?: string,
    onClick?: (event?: any) => void,
    callback?: (event?: any) => void,
    removeIn?: number,
    remove?: boolean,
    children?: MySchema[]
}

export { MySchema }