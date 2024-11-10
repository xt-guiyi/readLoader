<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-28 13:11:43
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\components\editAnnotationsCard.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved. 
-->
<script setup>
import { ref, defineProps, nextTick } from 'vue';
const text = ref('');
const props = defineProps({
  target: {
    type: String,
    default: '歼击机，属于战斗机的一种，即用于在空中消灭敌机和其它飞航式空袭兵器的军用飞机。第二次世界大战时期曾广泛称为驱逐机。',
  },
  link: {
    type: String,
    required: '',
  },
});

const emits = defineEmits(['onConfirm']);
const onConfirm = () => {
  console.log(11);
  emits('onConfirm', text.value);
  nextTick(()=> {
    text.value = ''
  })
};
</script>

<template>
  <div class="edit-annotations-card">
    <div class="edit-target">
      <!-- <van-text-ellipsis style="flex: 1; width: 100%;" :content="props.target" /> -->
      <div class="elipsis-tartget">
        {{props.target}}
      </div>
      <img class="arrow-down" src="@/assets/arrow-down.svg" />
    </div>
    <div class="edit-content">
      <textarea placeholder="请输入批注" v-model.trim="text"></textarea>
      <div class="confirm">
        <van-button v-show="text.length" type="primary" style="width: 86px; height: 36px" @click="onConfirm">确定</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.edit-annotations-card {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.edit-target {
  font-size: 14px;
  line-height: 16px;
  position: relative;
  padding-left: 8px;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    width: 0px;
    height: 14px;
    border: 2px solid #333333;
    position: absolute;
    top: 4px;
    left: 0;
  }
  .arrow-down {
    width: 26px;
    height: 26px;
  }
}

.edit-content {
  flex: 1;
  margin-top: 10px;
  border-radius: 10px;
  background: rgb(249, 246, 246);
  display: flex;
  flex-direction: column;
  textarea {
    flex: 1;
    border: 1px solid transparent; /* 边框透明 */
    padding: 10px; /* 设置内边距 */
    resize: none; /* 禁止用户调整文本框大小 */
    background: rgb(249, 246, 246);
    resize: none; /* 禁止用户调整文本框大小 */
    overflow: hidden; /* 隐藏滚动条 */
    font-size: 14px;
  }

  .confirm {
    margin-top: 6px;
    margin-bottom: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
  }
}

.elipsis-tartget {
  width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
}
</style>
