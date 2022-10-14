runFunctionWhen((gameType) => {
    console.log("When", gameType)
}, when(state.gameType, (gameType) => gameType == 'online'))

function runFunctionWhen(...[fun, ...when]) {
    let test = () => when.filter(({ result }) => !result).length === 0
    let unsubs = when.map(({ sub }) =>
        sub(() => {
            if (test()) fun(...when.map(({ value }) => value))
        })
    )
    return () => {
        when.map(({ unsub }) => unsub())
        unsubs.forEach((unsub) => unsub())
    }
}

function when(adjust, test) {
    let sub = adjust.subscribe
    let ret = { adjust, test, result: false, sub, value: adjust.last_value, unsub: () => { } }
    let makeResult = (val) => { ret.result = test(val); ret.value = val }
    ret.unsub = sub(makeResult)
    return ret
}