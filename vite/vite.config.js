import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url';
// import pkg from './package.json' assert {type: "json"}
import react from '@vitejs/plugin-react'
import bioxidePlugin from '../lib/vite-plugin.js'
const _dirname = dirname(fileURLToPath(import.meta.url));


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [bioxidePlugin(true), react()],
  server: {
    proxy: {
        '/rest': {
            target: 'https://xspace.hyperpaas-inc.com/',
            // target: 'http://10.131.8.252:7001',
            // target: 'http://10.131.7.236:7001',
            changeOrigin: true,
            // pathRewrite: { '^/rest': '/studio-test/rest' },
        },
    }
  },
  build: {
    rollupOptions: {
        external: [
            'react',
            'react-dom',
            '@hp-veiw/antd'
        ],
        output: {
            globals: {
                react: 'React',
                'react-dom': 'ReactDom',
                '@hp-veiw/antd': 'antd'
            },
            amd: {
                id: 'vite-test'
            }
        },
    },
    lib: {
        entry: './src/app.tpl',
        name: 'MyLib',
        // the proper extensions will be added
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'amd', 'umd'],
    }
  },
  resolve: {
      alias: {
          '@': resolve(_dirname, './src')
      }
  }
})
