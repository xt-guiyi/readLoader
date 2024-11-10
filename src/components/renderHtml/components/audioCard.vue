<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-27 17:37:44
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\components\audioCard.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
-->
<script setup>
import { ref, defineProps } from 'vue';
import pause from '@/assets/pause-2.svg'
import play from '@/assets/play-2.svg'
const props = defineProps({
  audioPlayStatus: {
    type: Boolean,
    required: false,
  },
  src: {
    type: String,
    required: '',
  },
  name: {
    type: String,
    required: '',
  },
  description: {
    type: String,
    required: '',
  },
});

const emits = defineEmits(['notifyAudioStatusChange']);
const onDrawChange = () => {
  emits('', false);
};

const notifyAudioStatusChange = () => {
    emits('notifyAudioStatusChange')
};
</script>

<template>
  <div class="audio-wraper">
    <div class="audio-card">
    <img class="auio-img" :src="src" />
    <div class="introduce">
      <div class="nam">{{ name }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <img :class="[props.audioPlayStatus ? 'controler-play' : 'controler' ]" @click="notifyAudioStatusChange" :src="props.audioPlayStatus ? pause : play" />
  </div>
  </div>
</template>

<style lang="less" scoped>
.audio-wraper {
    box-sizing: border-box;
    width: 268px;
    margin: 0 auto;
}
.audio-card {
  height: 72px;
  border-radius: 5px;
  opacity: 1;
  background: #eeeeee;
  display: flex;
  align-items: center;
  padding-left: 12px;
  padding-right: 20px;
}

.auio-img {
  width: 48px;
  height: 48px;
}
.introduce {
  flex: 1;
  height: 44px;
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 1;

  .nam {
    font-family: Source Han Sans;
    font-size: 17px;
    font-weight: 350;
    color: rgba(0, 0, 0, 0.9);
  }
  .description {
    font-family: Source Han Sans;
    font-size: 14px;
    font-weight: 350;
    color: #999999;
  }
}

.controler {
  width: 12px;
  height: 16px;
}

.controler-play {
  width: 12px;
  height: 16px;
}
</style>
