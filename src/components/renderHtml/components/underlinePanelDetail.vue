<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-05-17 18:54:01
 * @FilePath: \readLoader\src\components\renderHtml\components\annotationsTips.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
const props = defineProps({
  show: {
    type: Boolean,
    required: false,
  },
  position: {
    type: String ,
    required: false,
  },
  x: {
    type:  Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  },
});
const blockRef = ref(null)
const emits = defineEmits(['onDrawChange','cancelMark']);
const onDrawChange = () => {
  emits('onDrawChange', false);
};

watch(() => props.show, (newVal,oldVal)=> {
  if(newVal) {
    nextTick(()=> {
      if(props.position === 'down') {
        console.log(newVal, blockRef.value.clientHeight)
        blockRef.value.style.top = `${props.y - 20 -  blockRef.value.clientHeight}px`;
        blockRef.value.style.left = `${props.x  - (blockRef.value.clientWidth /2)}px`;
      }else {
        blockRef.value.style.top = `${props.y + 20}px`;
        blockRef.value.style.left = `${props.x  - (blockRef.value.clientWidth /2)}px`;
      }
    })
  }else {
    blockRef.value.style.top = `-10000px`;
    blockRef.value.style.left = `-10000px`;
  }
})

const cancelUnderline = () => {
  emits('cancelMark');
}

</script>

<template>
  <van-overlay @click="onDrawChange" :show="props.show" z-index="1001" duration="0.3">
    <div class="wrapper" >
      <div id="underlineTipsWrap" class="block" ref="blockRef" :style="{position: 'fixed', }">
        <div class="triangle" v-if="props.position === 'up'" ></div>
        <div class="content">
          <a href="#" style="font-size: 14px;text-align: right;" @click="cancelUnderline">取消划线</a>
        </div>
        <div class="triangle rotate-triangle" v-if="props.position === 'down'"></div>
     </div>
    </div>
  </van-overlay>
</template>

<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  .content {
    font-size: 14px;
    background: #FFE8BB;
    border-radius: 8px;
    padding: 6px;
    width:60px;
  }
  .triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 15px 15px 15px;
    border-color: transparent transparent #FFE8BB transparent;
  }
  .rotate-triangle {
    transform: rotate(180deg);
  }
}

</style>
