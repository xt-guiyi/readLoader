/*
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-07 19:30:43
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-05-17 18:14:13
 * @FilePath: \readLoader\src\main.js
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
 */
import { createApp } from 'vue'

import 'swiper/css'
import 'vant/lib/index.css';
import './style.css'
import '@/assets/font/font.css'
import App from './App.vue'
import { Slider } from 'vant';
import { Overlay } from 'vant';
import { Tab, Tabs } from 'vant';
import { ShareSheet } from 'vant';
import { Icon } from 'vant';
import { Popup } from 'vant';
import { Button } from 'vant';
import { Toast } from 'vant';
import { ImagePreview } from 'vant';
const app = createApp(App);

app.use(Slider);
app.use(Overlay);
app.use(Tab);
app.use(Tabs);
app.use(ShareSheet);
app.use(Icon);
app.use(Popup);
app.use(Button);
app.use(Toast);
app.use(ImagePreview);
app.mount('#app')
