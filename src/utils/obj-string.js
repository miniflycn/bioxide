import Code from '../nodes/code.js'

export default function buildObj(obj) {
    const code = new Code
    code.addCode('{')
    code.indent++
    Object.keys(obj).forEach(key => {
        const value = typeof obj[key] === 'object' ?
            buildObj(obj[key]) : typeof obj[key] === 'undefined' ? 'undefined' : `"${obj[key]}"`
        code.addBlock(`${key}: ${value},`)
    })
    code.indent--
    code.addLine('}')

    return code.toString()
}