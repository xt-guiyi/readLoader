<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 19:26:09
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-06-06 00:06:30
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\components\imageSwiper.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
-->
<template>
    <div style="margin: 0 32px 0 32px;">
        <swiper :modules="modules" slidesPerView="auto" :loop="false" :centeredSlides="true" :initialSlide="1">
            <swiper-slide class="swiper-slide" v-for="(item, index) in cardList" :key="index">
                <img :src="item.url" alt style="width: 100%" @click="toJump(item.url)" />
                <div class="img-full-description" style="transform: scaleX(0.9); margin-top: 6px">
                    {{ item.name }}
                </div>
            </swiper-slide>
        </swiper>
        <van-image-preview v-model:show="showDraw" :images="imgList" :close-on-click-image="false" :showIndex="false"
            @change="onImagePosititonchange" overlayClass="custom-image-preview">
            <template #image="{ src, style, onLoad }">
                <img :src="src" :style="[{ width: '100%', zIndex: 100, position: 'relative' }, style]" @load="onLoad" />
                <div class="img-full-description" style="transform: scaleX(0.9); color: white;z-index: 10;">
                    {{ currentImageDescription }}
                </div>
            </template>
        </van-image-preview>
    </div>
</template>

<script setup>
import imagePreview from './ImagePreview.vue';
import SwiperClass from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { ref, defineProps, computed } from 'vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
const modules = ref([Pagination, Autoplay]);
const showDraw = ref(false);
const scrList = ref('');

const toJump = status => {
    scrList.value = status;
    showDraw.value = true;
};

const cardList = [
    {
        url: '/html/catalog-1/imgs/26.png',
        name: '国庆70周年阅兵式上的轰-6N',
    },
    {
        url: '/html/catalog-1/imgs/24.png',
        name: '国庆70周年阅兵式上的轰-6N',
    },
    {
        url: '/html/catalog-1/imgs/25.png',
        name: '国庆70周年阅兵式上的轰-6N',
    },
];

const imgList = computed(() => {
    return cardList.map(item => item.url);
});

const textList = computed(() => {
    return cardList.map(item => item.name);
});

const currentImageDescription = ref(textList.value[0]);
const onImagePosititonchange = index => {
    currentImageDescription.value = textList.value[index];
};
</script>
<style lang="less" scoped>
.swiper-slide {
    width: 70% !important;
    margin: 0 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 190px;

    img {
        height: 160px;
        transition: all 0.3s ease;
    }
}

.swiper-slide-prev {
    img {
        height: 128px !important;
    }
}

.swiper-slide-next {
    img {
        height: 128px !important;
    }
}
</style>
