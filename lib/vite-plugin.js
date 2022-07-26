import complier from '../src/index.js'
import babel from '@babel/core'
export default function (dev) {
    return {
      name: 'transform-bioxide',
      transform(src, id) {
        if (/\.tpl$/.test(id)) {
          const res = babel.transformSync(
            complier(src, { dev, resolve: (name) => { return `./${name.slice(4)}.tpl` }}),
            { presets: ["@babel/preset-react"], sourceMaps: true }
          )
          return { code: res.code }
        }
      }
    }
}