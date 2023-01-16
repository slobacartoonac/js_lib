export function findQuad(x, a, h, k) {
    return a * (x - h) * (x - h) + k
}

export function quadraticByX(a, h, k) {
    return function inner(x) {
        return findQuad(x, a, h, k)
    }
}