function register(name, handler) {
    const cur = this.cur.slice(0)
    const events = this.events
    cur.push(name)
    const eventName = cur.join('/')
    if (!events[eventName]) events[eventName] = []
    events[eventName].push(handler)
    this._registered.push([eventName, handler])
}

function destroy() {
    const events = this.events
    this._registered.forEach(registered => {
        const index = events[registered[0]].indexOf(registered[1])
        if (index > -1) {
            events[registered[0]].splice(index, 1)
        }
    })
}

function createTrigger(thisTarget, triggerDef = {}) {
    const events = thisTarget.events
    function trigger(name, payload) {
        let eventName = name
        if (triggerDef[eventName]) {
            eventName = [triggerDef[eventName], eventName].join('/')
        }
        if (!events[eventName]) {
            console.warn(`event ${eventName} is not defined`)
            return 
        }
        events[eventName].forEach((handler) => {
            handler(payload)
        })
    }
    return trigger.bind(thisTarget)
}

function create(def) {
    const newCur = this.cur.slice(0)
    const events = this.events || {}
    const ret =  {
        cur: newCur,
        _registered: [],
        events,
    }
    Object.assign(ret, {
        create: create.bind(ret),
        register: register.bind(ret),
        destroy: destroy.bind(ret),
    })
    let trigger
    if (def) {
        if (def.register) {
            newCur.push(def.register)
        }
        trigger = createTrigger(ret, def)
    }
    ret.trigger = trigger || createTrigger(ret)
    return ret
}

const retObj = {
    cur: [],
}
retObj.create = create.bind(retObj)

export default retObj