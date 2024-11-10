<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-07 19:30:43
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-29 11:41:14
 * @FilePath: \NDEAPP\h5\readLoader\src\pages\reader\reader.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, watch ,onMounted,nextTick} from 'vue';
import drawer from '../../components/drawer.vue';
import renderHtml from '../../components/renderHtml/renderHtml.vue';
import fontsizeIcon from '@/assets/fontsize-setting.svg'
import fontsizeActiveIcon from '@/assets/fontsize-setting-active.svg'
import lineheightActiveIcon from '@/assets/lineheight-setting-active.svg'
import lineheightIcon from '@/assets/lineheight-setting.svg'
import playIcon from '@/assets/play.svg'
import pauseIcon from '@/assets/pause.svg'
import { showToast } from 'vant';
import {detectOS} from '@/utils/common.js'
import androidToolbarBack from '@/assets/theme-top.jpg'
import iosToolbarBack from '@/assets/theme-ios-top.jpg'
const os = detectOS();
const renderHtmlRef = ref(null);
const showBottomMenu = ref(false);
const showDraw = ref(false);
const showAudioBall = ref(false);
const showVolumeController = ref(false);
const audioPlayStatus = ref(false);
const closeAudioBall = ref(false);
const selectedMenuIndex = ref(null);
const sliderValue1 = ref(180);
const sliderValue2 = ref(190);
const sliderValue3 = ref(100);
const fontSize = ref(18);
const lineHeight = ref(18);
const volumeSize = ref(1);
const activeTabsItem = ref(0);
const selectedTopicItem = ref('0-0');
const moveMark = ref('');
// const topStatus = ref(30)

onMounted(() => {
//  nextTick(()=> {
  // showToast(window.getParams().statusbar)
  // const appParams = window.getParams()
  // if(appParams.statusbar) {
  //   topStatus.value = appParams.
  // }
  // topStatus.value = window.readBookcontainerStatusHeight
//  })
})
const catalogs = ref([
  {
    unit: '第一单元 中华文化',
    content: [
      {
        topic: '第 1 课 人民空军与蓝天利剑',
      },
      {
        topic: '第 2 课 加快武器装备现代化',
      },
    ],
  },
  {
    unit: '第二单元 第一书记话国防',
    content: [
      {
        topic: '第 3 课 弘扬“两弹一星”精神',
      },
      {
        topic: '第 4 课 坚定扛起时代重任',
      },
      {
        topic: '第 5 课 勠力强武兴武',
      },
      {
        topic: '第 6 课 建强武装阵地',
      },
    ],
  },
  {
    unit: '第三单元 学术交流',
    content: [
      {
        topic: '第 7 课 推动新时代高校国防教育',
      },
      {
        topic: '第 8 课 新时代高校国防教育',
      },
      {
        topic: '第 9 课 融入课程教学理论与实践研究',
      },
      {
        topic: '第 10 课 深化新时代高校国防教育',
      },
    ],
  },
  {
    unit: '第四单元 工作研究',
    content: [
      {
        topic: '第 11 课 学习新思想 展现新作为',
      },
      {
        topic: '第 12 课 立足北部边疆民族地区实际',
      },
      {
        topic: ' 第 13 课 奋力开创全民国防教育新局面',
      },
      {
        topic: '第 14 课 立足地区实际目标',
      },
    ],
  },
]);
// 格式
// [
//   {
//     digest: '歼击机，也叫战斗机，是航空兵空歼击机，也叫战斗机，是航空兵空',
//     detail: '歼击机，属于战斗机的一种，即用于在空中消灭敌机和其它飞航式空袭兵器的军用飞在空中消灭敌机和其它飞航式空袭兵器的军用飞',
//     unit: '第一单元',
//     topic: '第 1 课',
//     time: '2021.05.09',
//   },
// ]
const annotations = ref([]);
const annotationsCache = localStorage.getItem('annotations')
if(annotationsCache) {
  annotations.value = JSON.parse(annotationsCache)
}
let timer = null;
// toolbar 控制
const back = () => {
  try {
    window.webkit.messageHandlers.sendMessage.postMessage(JSON.stringify({
      action: 'back',
      data: null
    })); //ios
  } catch (e) {}
  try {
    window.Android.postMessage(JSON.stringify({
      action: 'back',
      data: null
    }));
    //andorid
  } catch (e) {}
};

const onSharePanelChanged = () => {
  try {
    window.webkit.messageHandlers.sendMessage.postMessage(JSON.stringify({
      action: 'share',
      data: null
    })); //ios
  } catch (e) {}
  try {
    window.Android.postMessage(JSON.stringify({
      action: 'share',
      data: null
    })); //andorid
  } catch (e) {}
};

const goGame = () => {
  console.log(123)
  try {
    window.webkit.messageHandlers.sendMessage.postMessage(JSON.stringify({
      action: 'game-plane-battle',
      data: null
    })); //ios
  } catch (e) {}
  try {
    window.Android.postMessage(JSON.stringify({
      action: 'game-plane-battle',
      data: null
    })); //andorid
  } catch (e) {}
};


const onTopChanged = () => {
  onAudioChanged();
  onMenuChange();
};

const onCatalogChanged = () => {
    showDraw.value = !showDraw.value;
    try {
    window.webkit.messageHandlers.sendMessage.postMessage(JSON.stringify({
      action: 'toolbar-color',
      data: showDraw.value  ?  'white' : '#d0f3f5'
    })); //ios
  } catch (e) {}
};

// 小球控制
// 显示小球
const onAudioChanged = () => {
  showAudioBall.value = !showAudioBall.value;
};

// 播放状态变化
const onAudioStatusChanged = value => {
  console.log('播放状态变化', value);
  if (typeof value == 'boolean') {
    audioPlayStatus.value = value;
  } else {
    audioPlayStatus.value = !audioPlayStatus.value;
  }
  if (audioPlayStatus.value) closeAudioBall.value = false;
};

// 是否显示声音控制
const onVolumeControllerChanged = value => {
  console.log('onVolumeControllerChanged', value);
  if (typeof value == 'boolean') {
    showVolumeController.value = value;
  } else {
    showVolumeController.value = !showVolumeController.value;
    clearInterval(timer);
    timer = setTimeout(() => {
      onVolumeControllerChanged(false);
    }, 1500);
  }
};

watch(sliderValue3, (newValue, oldValue) => {
  volumeSize.value = newValue / 100;
  clearInterval(timer);
  timer = setTimeout(() => {
    onVolumeControllerChanged(false);
  }, 1500);
});

// 关闭小球
const onAudioBallClosed = value => {
  closeAudioBall.value = !closeAudioBall.value;
  audioPlayStatus.value = false;
};

// 左侧菜单控制
const onTopicItemSelected = index => {
  selectedTopicItem.value = index;
  // TODO 隐藏菜单，切换课题
};

const onAnnotationsItemSelected = (index, item) => {
  console.log(index, item);
  // TODO 隐藏菜单，切换课题, 锚点到指定位置
  showDraw.value = !showDraw.value;
  // 这里不用切换课题，只有一个课题
  renderHtmlRef.value.moveMarkPosition(item.digest);
};

const onDrawChanged = status => {
  showDraw.value = status;
  try {
    window.webkit.messageHandlers.sendMessage.postMessage(JSON.stringify({
      action: 'toolbar-color',
      data: showDraw.value  ?  'white' : '#d0f3f5'
    })); //ios
  } catch (e) {}
};

// 添加批注
const onAnnotationsAdded = obj => {
  annotations.value.push(obj);
  localStorage.setItem('annotations', JSON.stringify(annotations.value))
};

const onAnnotationsChanged = obj => {
  annotations.value = annotations.value.filter(item => item.digest != obj.digest)
  if(annotations.value.length > 0) {
    localStorage.setItem('annotations',JSON.stringify(annotations.value))
  }else {
    localStorage.removeItem('annotations')
  }
};


// 底部菜单控制
const onMenuChange = () => {
  showBottomMenu.value = !showBottomMenu.value;
};

const onContentTouched = () => {
  showAudioBall.value = false;
  showBottomMenu.value = false;
};

const onMenuItemChange = type => {
  selectedMenuIndex.value = type;
};

const onSliderChange = value => {
  if (selectedMenuIndex.value == 1) {
    // 字体大小
    fontSize.value = (value / 10).toFixed(1);
    console.log('字体大小:', fontSize.value, 'px');
  } else if (selectedMenuIndex.value == 2) {
    // 行距大小
    lineHeight.value = (value / 100).toFixed(1);
    console.log('行距大小:', lineHeight.value, '倍');
  }
};
</script>

<template>
  <div class="read-loader-container">
    <!-- toolbar -->
    <div class="toolbar no-menu"  :style="{paddingTop: os != 'iOS' ? '50px' : '0px',  backgroundImage: `url(${ os != 'iOS' ? androidToolbarBack : iosToolbarBack})`,}" >
      <div class="toolbar-arrow" @click="back">
        <img style="width: 18px; height: 30px" src="../../assets/arrowLeft.png" />
      </div>
      <div class="operations">
        <div class="operations-item" @click="onSharePanelChanged">
          <img style="width: 20px; height: 20px" src="../../assets/share.png" />
        </div>
        <div class="operations-item" @click="onTopChanged">
          <img style="width: 20px; height: 20px" src="../../assets/menu.png" />
        </div>
        <div class=" menu operations-item" @click="onCatalogChanged">
              目录
        </div>
      </div>

    </div>

    <!-- 内容 -->
    <div class="content" :style="{height: os != 'iOS' ? 'calc(100vh - 100px)' : 'calc(100vh - 50px)'}" @touchstart="onContentTouched()">
      <renderHtml
        ref="renderHtmlRef"
        :audioPlayStatus="audioPlayStatus"
        :fontSize="fontSize"
        :lineHeight="lineHeight"
        :volumeSize="volumeSize"
        :moveMark="moveMark"
        :annotations="annotations"
        @onAudioStatusChanged="onAudioStatusChanged"
        @onAnnotationsAdded="onAnnotationsAdded"
        @onAnnotationsChanged="onAnnotationsChanged"
        @goGame="goGame"
      />
    </div>
    <!-- 左侧菜单 -->
    <div class="left-menu no-menu" >
      <drawer :show="showDraw" @onDrawChanged="onDrawChanged" >
        <van-tabs v-model:active="activeTabsItem" color="#0095FF" title-active-color="#0095FF" :style="{paddingTop: os != 'iOS' ? '45px' : '0'}">
          <van-tab :title="'目录'">
            <div class="catalog-wrapper">
              <div class="unit-item" v-for="(item, index) in catalogs" :key="index">
                <div class="unit-text">{{ item.unit }}</div>
                <div
                  class="topic-item"
                  :class="[selectedTopicItem === `${index}-${contentIndex}` ? 'topic-item-activate' : '']"
                  v-for="(contentItem, contentIndex) in item.content"
                  :key="contentIndex"
                  @click="onTopicItemSelected(`${index}-${contentIndex}`)"
                >
                  {{ contentItem.topic }}
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'批注'">
            <div class="annotations-wraper">
              <div class="annotations-item" v-for="(item, index) in annotations" :key="index" @click="onAnnotationsItemSelected(index, item)">
                <div class="digest">{{ item.digest }}</div>
                <div class="detail">{{ item.detail }}</div>
                <div class="aside">
                  <div>
                    <span class="unit">{{ item.unit }}</span>
                    <span class="separate">·</span>
                    <span class="topic">{{ item.topic }}</span>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </drawer>
    </div>
    <!-- 右侧音频小球 -->
    <div class="right-audio-ball no-menu" v-if="!closeAudioBall" :class="[showAudioBall ? '' : 'right-audio-ball-hidden']">
      <div class="audio-ball-wraper">
        <img class="dics" :class="[showAudioBall && audioPlayStatus ? 'rotateAnimation' : '']" src="../../assets/dics.svg" />
        <img :class="[audioPlayStatus ? 'play' : 'pause' ]" @click="onAudioStatusChanged(null)" :src="audioPlayStatus ? pauseIcon : playIcon" />
        <img v-if="os != 'iOS'" class="ring" @click="onVolumeControllerChanged(null)" src="../../assets/ring.svg" />
        <img class="close" @click="onAudioBallClosed" src="../../assets/close.svg" />
      </div>
    </div>
    <!-- 音量控制@change="onVolumeChange " -->
    <div class="volume-controller no-menu" style="" v-if="showVolumeController">
      <van-slider v-model="sliderValue3" reverse bar-height="20px" :min="0" :max="100" vertical />
    </div>
    <!-- 底部功能菜单 -->
    <div class="bottom-menu no-menu" :class="[showBottomMenu ? '' : 'bottom-menu-hidden']">
      <div class="bottom-operate-area" v-if="selectedMenuIndex">
        <div class="slider-wrapper">
          <van-slider
            v-show="selectedMenuIndex == 1"
            class="bottom-operation-area-slider"
            v-model="sliderValue1"
            :min="180"
            :max="260"
            @change="onSliderChange"
          />
          <van-slider
            v-show="selectedMenuIndex == 2"
            class="bottom-operation-area-slider"
            v-model="sliderValue2"
            :min="190"
            :max="250"
            @change="onSliderChange"
          />
        </div>
        <div class="slider-description">
          <div class="slider-text">小</div>
          <div class="slider-text"></div>
          <div class="slider-text">大</div>
        </div>
      </div>
      <div class="bottom-menu-area">
        <div class="bottom-menu-item" :class="[selectedMenuIndex == 1 ? 'bottom-menu-item-active' : '']" @click="onMenuItemChange(1)">
          <img
            class="bottom-menu-item-icon"
            :src="selectedMenuIndex != 1 ? fontsizeIcon : fontsizeActiveIcon"
          />
          <div class="bottom-menu-item-description">字号</div>
        </div>
        <div class="bottom-menu-item" :class="[selectedMenuIndex == 2 ? 'bottom-menu-item-active' : '']" @click="onMenuItemChange(2)">
          <img
            class="bottom-menu-item-icon"
            data-original-src="./lineheight-setting.svg"
            data-active-src="./lineheight-setting-active.svg"
            :src="selectedMenuIndex != 2 ? lineheightIcon : lineheightActiveIcon"
          />
          <div class="bottom-menu-item-description">行距</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 样式区域 */
.read-loader-container {
  position: relative;
  height: 100%;
  width: 100vw;
  overflow: hidden;
}

/* toolbar样式 */
.toolbar {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-image: url('@/assets/theme-top.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 50px 34px 0 34px;
  .toolbar-arrow {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .operations {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
    .operations-item {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu {
      width: 64px;
      height: 32px;
      border-radius: 100px;
      opacity: 1;
      background: #DCF0FF;
      z-index: 0;
      text-align: center;
      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      color: #0095FF;
    }
  }


}

/* 内容样式 */
.content {
  height: calc(100vh - 100px);
  width: 100%;
}

/* 左侧菜单样式 */
.left-menu {
  .catalog-wrapper {
    height: calc(100vh - 80px);
    padding: 24px;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    /* 隐藏滚动条但保留滚动功能 */
    &::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }

    .unit-item {
      &:not(:first-child) {
        margin-top: 50px;
      }
      .unit-text {
        font-family: 思源黑体;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
      }
      .topic-item {
        font-family: 思源黑体;
        font-weight: 400;
        font-size: 16px;
        margin-top: 14px;
        margin-bottom: 14px;
      }
      .topic-item-activate {
        color: #0095ff;
      }
    }
  }

  .annotations-wraper {
    height: calc(100vh - 80px);
    padding: 24px;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    /* 隐藏滚动条但保留滚动功能 */
    &::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }
    .annotations-item {
      &:not(:first-child) {
        margin-top: 36px;
      }
      .digest {
        font-family: 思源黑体;
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .detail {
        font-family: Source Han Sans;
        font-size: 16px;
        font-weight: normal;
        line-height: 24px;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; //需要显示的行数
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .aside {
        display: flex;
        justify-content: space-between;
        .unit,
        .separate,
        .topic,
        .time {
          font-family: Source Han Sans;
          font-size: 12px;
          font-weight: normal;
          line-height: 20px;
          letter-spacing: 0em;
          color: #999999;
        }
        .separate {
          margin-left: 3px;
          margin-right: 3px;
        }
      }
    }
  }
}

/* 右侧音频小球 */
.right-audio-ball {
  position: absolute;
  right: 12px;
  top: 14%;
  // width: 170px;
  height: 55px;
  border-radius: 30px;
  opacity: 1;
  background: #f4f4f4;
  transition: all 0.3s ease-out;
  transform: translateX(0px);
  z-index: 10;
  .audio-ball-wraper {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 4px;
    .dics {
      height: 90%;
    }
    .pause {
      margin-left: 10px;
      height: 16px;
      width: 24px;
    }
    .play {
      margin-left: 10px;
      height: 24px;
      width: 24px;
    }
    .ring {
      margin-left: 10px;
      margin-right: 10px;
      height: 24px;
      width: 24px;
    }
    .close {
      margin-left: 6px;
      margin-right: 16px;
      height: 24px;
      width: 24px;
    }
  }
}

.right-audio-ball-hidden {
  transform: translateX(calc(170px + 10%));
}

.volume-controller {
  height: 200px;
  position: absolute;
  right: 12px;
  top: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部功能菜单 */
.bottom-menu {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  transition: all 0.3s ease-out;
  z-index: 100;
}

.bottom-menu-hidden {
  /* 初始状态下隐藏元素 */
  transform: translateY(165px);
}

/* 进度条 */
.bottom-operate-area {
  padding-top: 28px;
  padding-bottom: 0px;
  position: relative;
  .slider-wrapper {
    padding-left: 48px;
    padding-right: 48px;
    &::before {
      content: '';
      position: absolute;
      left: 45px;
      top: 24px;
      width: 4px;
      height: 12px;
      background: #dcdcdc;
      z-index: 1;
    }
    &::after {
      content: '';
      position: absolute;
      right: 45px;
      top: 24px;
      width: 4px;
      height: 12px;
      background: #dcdcdc;
      z-index: 1;
    }
    .bottom-operation-area-slider {
      height: 4px;
    }
  }

  .slider-description {
    padding-left: 36px;
    padding-right: 42px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    // padding-right: 4px;
    .slider-text {
      font-family: Source Han Sans;
      font-size: 14px;
      line-height: 1.5;
      font-weight: normal;
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:nth-child(3) {
        text-align: right;
      }
    }
  }
}

.bottom-menu-area {
  height: 92px;
  display: flex;
  justify-content: space-around;
  /* 菜单项 */

  .bottom-menu-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    // background-color: yellow;

    .bottom-menu-item-icon {
      width: 30px;
      height: 30px;
      opacity: 1;
    }

    .bottom-menu-item-description {
      margin-top: 5px;
      font-family: Source Han Sans;
      font-size: 14px;
      line-height: 1.5;
      font-weight: normal;
    }
  }
}

.bottom-menu-item-active {
  color: #0095ff;
}

.rotateAnimation {
  animation: rotate 5s linear infinite; /* 使用rotate动画，持续5秒，线性过渡，无限循环 */
  animation-delay: 0.3s; /* 延迟开始动画 */
}

@keyframes rotate {
  from {
    transform: rotate(0deg); /* 起始角度为0度 */
  }
  to {
    transform: rotate(360deg); /* 终止角度为360度 */
  }
}

.bottom-menu :deep(.van-slider__button-wrapper) {
  z-index: 100;
}

.left-menu :deep(.van-tab) {
  flex: 0 0 86px !important;
  font-size: 18px!important;
}
.left-menu :deep(.van-tabs__nav) {
  border-bottom: 1px solid black;
  &::after {
    height: 1px;
    width: 100%;
    content: '';
    position: absolute;
    bottom: 16px;
    background: #e8e8e8;
  }
}
</style>
