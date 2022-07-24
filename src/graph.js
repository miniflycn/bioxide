import Code from './nodes/code.js'

function buildObj(obj) {
    const code = new Code
    code.addCode('{')
    code.indent++
    Object.keys(obj).forEach(key => {
        const value = typeof obj[key] === 'object' ?
            buildObj(obj[key]) : 'undefined'
        code.addBlock(`${key}: ${value},`)
    })
    code.indent--
    code.addLine('}')

    return code.toString()
}

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
        return buildObj(obj) 
    }
}