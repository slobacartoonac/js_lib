export function chunkString(str) {
    return str.split(/\r?\n/);
}

export function chunkStringLong(str, len) {
    let rows = str.split(/\r?\n/);
    let ret = []
    for (let row of rows) {
        if (row.length < len) {
            ret.push(row)
            continue
        }
        let parts = row.split(" ")
        let retPart = ""
        for (let part of parts) {
            if (part.length > len) {
                part = part.slice(0, len - 4)
                part += "..."
            }
            if (retPart.length + part.length > len) {
                ret.push(retPart.slice(1))
                retPart = ""
            }
            retPart += " " + part
        }
        if (retPart.length) {
            ret.push(retPart.slice(1))
        }

    }
    return ret
}