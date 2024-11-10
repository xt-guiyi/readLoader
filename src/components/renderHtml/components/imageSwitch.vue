<!--
 * @Author: xt-guiyi 1661219752@qq.com
 * @Date: 2024-05-16 09:17:59
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-06-06 00:07:36
 * @Description:
 * qq
-->
<template>
    <div class="image-switch" v-if="list">
        <div class="image-cintainer">
            <img class="image-content" :src="list.srcList[imageIdex]" @click="onPreviewImage" />
            <div class="description">{{ list.description }}</div>
        </div>
        <van-tabs v-model:active="imageIdex" type="card" title-inactive-color="#3D3D3D" title-active-color="white">
            <van-tab title="左视图" />
            <van-tab title="正视图" />
            <van-tab title="右视图" />
        </van-tabs>
        <van-image-preview v-model:show="showDraw" :images="list.srcList" :close-on-click-image="false"
            :showIndex="false" overlayClass="custom-image-preview">
            <template #image="{ src, style, onLoad }">
                <!-- <div :style="[{ width: '100%',height:'100%' }, style]" @load="onLoad"> -->
                <img :src="src" :style="[{ width: '100%', height: '100%', zIndex: 100, position: 'relative' }, style]"
                    @load="onLoad" />
                <div class="img-full-description" style="transform: scaleX(0.9); color: white;z-index:10">
                    {{ list.description }}
                </div>
                <!-- </div> -->
            </template>
        </van-image-preview>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import imagePreview from './ImagePreview.vue';
const props = defineProps({
    list: {
        type: Object,
        required: () => { },
    },
});
const imageIdex = ref(1);
const showDraw = ref(false);

const onDrawChange = status => {
    showDraw.value = status;
};

const onPreviewImage = () => {
    showDraw.value = true;
};


</script>
<style lang="less" scoped>
.image-switch {
    padding: 0 42px 0px 42px;
}

.image-cintainer {
    width: 100%;

    .image-content {
        height: 208px;
        width: 100%;
        background: red;
    }

    .description {
        text-align: center;
        font-family: 思源黑体;
        font-size: 12px;
        font-weight: normal;
        line-height: 38px;
        color: #3d3d3d;
    }
}

.image-switch :deep(.van-tabs__wrap) {
    height: 38px !important;
}

.image-switch :deep(.van-tabs__nav) {
    height: 38px !important;
    border: 1px solid #eeeeee !important;
    border-radius: 20px !important;
    background: #eeeeee !important;
    margin: 0 !important;
}

.image-switch :deep(.van-tab--card) {
    border: none !important;
}

.image-switch :deep(.van-tab--active) {
    border-radius: 20px !important;
}
</style>
