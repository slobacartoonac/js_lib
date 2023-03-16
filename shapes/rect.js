function GetRect(vertices) {
    let rt = new [vertices[0], vertices[1], vertices[0], vertices[1]];
    for (var i = 2; i < vertices.length; i += 2) {
        if (vertices[i] > rt[0])
            rt[0] = vertices[i];
        if (vertices[i] < rt[2])
            rt[2] = vertices[i];
        if (vertices[i] > rt[1])
            rt[1] = vertices[i + 1];
        if (vertices[i + 1] < rt[3])
            rt[3] = vertices[i + 1];
    }
    return rt;
}

export { GetRect }