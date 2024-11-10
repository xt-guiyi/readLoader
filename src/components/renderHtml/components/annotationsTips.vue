<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-28 13:36:08
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\components\annotationsTips.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
-->
<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from 'vue';
const props = defineProps({
  show: {
    type: Boolean,
    required: false,
  },
  tipType: {
    type:  Number,
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
  content: {
    type:  String,
    required: false,
  }
});
const blockRef = ref(null)
const emits = defineEmits(['onDrawChange','cancelMark']);
const onDrawChange = () => {
  emits('onDrawChange', false);
};

watch(() => props.show, (newVal,oldVal)=> {
    if(newVal) {
        nextTick(()=> {
            if(props.position == 'down') {
                const dom = document.querySelector('#annotatonsTipsWrap')
                console.log(newVal, blockRef.value.clientHeight)

            blockRef.value.style.top = `${props.y - 20 -  blockRef.value.clientHeight}px`;
        }else {
            blockRef.value.style.top = `${props.y + 20}px`;
        }
        })
   }else {
        blockRef.value.style.top = `-10000px`;
   }
})

const cancelAnnotation = () => {
  emits('cancelMark',2,props.content);
}
// onMounted(()=> {
//     console.log('12323')
// })
</script>

<template>
  <van-overlay @click="onDrawChange" :show="props.show" z-index="1001" duration="0.3">
    <div class="wrapper" >
      <div id="annotatonsTipsWrap" class="block" ref="blockRef" :style="{position: 'fixed', }">
        <div class="triangle" v-if="props.position == 'up'" :style="{borderColor: `transparent transparent ${props.tipType == 1 ? '#ffe8bb' : '#F8DCDE'} transparent`}"></div>
        <div class="content-wrap" :style="{backgroundColor: props.tipType == 1 ? '#ffe8bb' : '#F8DCDE'}">
            <p class="paragraph content">
                {{props.content}}
            </p>
            <div  v-if="props.tipType == 2" style="text-align: right;width:100%;padding-right: 22px;padding-bottom: 10px;box-sizing: border-box;" >
              <a href="#" style="font-size: 14px;text-align: right;" @click="cancelAnnotation">取消批注</a>
            </div>
        </div>
        <div class="triangle rotate-triangle" v-if="props.position == 'down'" :style="{borderColor: `transparent transparent ${props.tipType == 1 ? '#ffe8bb' : '#F8DCDE'} transparent`}"></div>
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
  width: 80%;
  display: flex;
  flex-direction: column;
  background: transparent;
  align-items: center;
  .triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 15px 15px 15px;
    border-color: transparent transparent #ffe8bb transparent;
  }
  .rotate-triangle {
    transform: rotate(180deg);
  }
  .content-wrap {
    width: 100%;
    background-color: #ffe8bb;
    border-radius: 4px;
    font-family: 思源黑体;
    font-size: 16px;
    font-weight: normal;
    line-height: 30px;
    letter-spacing: 0px;
  }
  .content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8; //需要显示的行数
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 22px;
    margin-bottom: 22px;
    padding: 0 12px 0 12px!important;
  }
}
</style>
