<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-21 17:50:44
 * @FilePath: \readLoader\src\components\renderHtml\components\ImagePreview.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, defineProps,computed, watch } from 'vue';
const props = defineProps({
  show: {
    type: Boolean,
    required: false,
  },
  imgList: {
    type: Array,
    required: false,
	default: ()=> []
  },
});
const show = ref(false);

watch(()=> props.show, (newValue,oldValue)=> {
	show.value = newValue
})

const emits = defineEmits(['onDrawChange']);
const onDrawChange = () => {
  emits('onDrawChange', false);
};
const textList = computed(() => {
  return props.imgList.map(item => item.name);
});
const imgList = computed(() => {
  return props.imgList.map(item => item.url);
});


const currentImageDescription = ref(0);
const onImagePositionChanged = index => {
  currentImageDescription.value = index;
};
</script>

<template>
  <van-image-preview
    v-model:show="show"
    :images="imgList"
    :close-on-click-image="false"
    :showIndex="false"
    @change="onImagePositionChanged"
	@close="onDrawChange"
    overlayClass="custom-image-preview"
  >
    <template #image="{ src, style, onLoad }">
        <img :src="src"  :style="[{ width: '100%',zIndex:100,position: 'relative' }, style]" @load="onLoad" />
        <div class="img-full-description" style="transform: scaleX(0.9); color: white;z-index: 10;">
          {{ textList[currentImageDescription] }}
        </div>
    </template>
  </van-image-preview>
</template>

<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-style {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
