/*
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-07 19:30:43
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-05-15 17:28:01
 * @FilePath: \readLoader\vite.config.js
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pxtoviewport from 'postcss-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css:{
    postcss:{
      plugins:[
        // pxtoviewport({
        //   unitToConvert: 'px',
        //   viewportWidth: 430,
        //   unitPrecision: 5,
        //   propList: ['*'],
        //   viewportUnit: 'vw',
        //   fontViewportUnit: 'vw',
        //   selectorBlackList: [],
        //   minPixelValue: 1,
        //   mediaQuery: false,
        //   replace: true,
        //   exclude: [/node_modules/],
        //   landscape: false,
        //   landscapeUnit: 'vw',
        //   landscapeWidth: 568
        // })
      ]
    }
  }
})