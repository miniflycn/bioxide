import '@testing-library/jest-dom'
import React, { createElement } from 'react'
import ReactDOM from 'react-dom'
import {render, fireEvent, screen} from '@testing-library/react'
import complie from '../src/index.js'
import { transformSync } from "@babel/core";
import { readFileSync } from 'fs'

function build(name) {
    const ncode = complie(readFileSync(`./design/${name}.tpl`, 'utf-8'))
    const { code } = transformSync(ncode, {
        presets: ["@babel/preset-react"],
        plugins: ["@babel/plugin-transform-modules-commonjs"]
    })

    const mod = { exports: {} }
    const req = function (name) {
        if (name === 'react') return React
        throw new Error(`Cannot load ${name}`)
    }
    ;(new Function('module', 'exports', 'require', code))(mod, mod.exports, req)
    return mod.exports.default
}

describe('bioxide template', () => {
    it('design/el.tpl', () => {
        const Fn = build('el')
        const res = render(createElement(Fn, {
            className: 'test',
            a: 1,
            b: 2
        }))
        expect(screen.getByText(/a/))
            .toHaveClass('my-p')
        expect(screen.getByText(/b/))
            .toHaveClass('test')
        expect(screen.getByText(/c/))
            .toHaveClass('test')
        expect(screen.getByText(/d/))
            .toHaveClass('test')
        expect(screen.getByText(/e/))
            .toHaveAttribute('data-abc')
    })
})