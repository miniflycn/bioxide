import objString from './utils/obj-string.js'

export default class Graph {
    constructor() {
        this.properties = []
    }

    add(property) {
        if (this.properties.indexOf(property) < 0) {
            this.properties.push(property)
        }
    }

    create(name) {
        const res = {}
        this.properties.filter(v => {
            return v.indexOf(name) === 0
        }).forEach(property => {
            const keys = property.split('.')
            let current = res
            for (let i = 1, l = keys.length; i < l; i++) {
                if (i === l - 1) {
                    current[keys[i]] = undefined
                } else {
                    if (!(keys[i] in current)) {
                        current[keys[i]] = {}
                    }
                    current = current[keys[i]]
                }
            }
        })

        // console.log(`${name} === `, res)

        return res
    }

    build(name) {
        const obj = this.create(name)
        return objString(obj) 
    }
}