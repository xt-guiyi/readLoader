<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-11 16:28:26
 * @FilePath: \readLoader\src\components\drawer.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, defineProps } from 'vue';
const show = ref(false);
const props = defineProps({
  show: {
    type: Boolean,
    required: false,
  },
});

const emits = defineEmits(['onDrawChanged']);
const onDrawChanged = () => {
  emits('onDrawChanged', false);
};
</script>

<template>
  <van-overlay :show="props.show" @click="onDrawChanged" z-index="1000" duration="0.3" :lock-scroll="false"  >
    <div class="wrapper" @click.stop>
      <slot name="default" />
    </div>
  </van-overlay>
</template>

<style lang="less" scoped>
.wrapper {
  height: 100vh;
  width: 266px;
  background-color: #fff;
}

.block {
  width: 100%;
  height: 120px;
}
</style>
