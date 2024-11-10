<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt 1661219752@qq.com
 * @LastEditTime: 2024-05-29 14:38:50
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\renderHtml.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from 'vue';
import audioCard from './components/audioCard.vue';
import imageSwiper from './components/imageSwiper.vue';
import imageSwitch from './components/imageSwitch.vue';
import knowledgeDetail from './components/knowledgeDetail.vue';
import underlinePanelDetail from './components/underlinePanelDetail.vue';
import editAnnotationsCard from './components/editAnnotationsCard.vue';
import imagePreview from './components/ImagePreview.vue';
import annotationsTips from './components/annotationsTips.vue';
import mp3Url from '/html/catalog-1/imgs/1.mp3';
import { showToast } from 'vant';
import SimplePlayer from 'xgplayer';
import { Events } from 'xgplayer';
import MobilePreset from 'xgplayer/es/presets/mobile';
import 'xgplayer/dist/index.min.css';
import markHook from '@/hooks/markHook.js';
import SuperGif from 'libgif';
import gif1 from '/html/catalog-1/imgs/1.gif';
import gif2 from '/html/catalog-1/imgs/2.gif';
import gif4 from '/html/catalog-1/imgs/4.gif';
import gif3 from '/html/catalog-1/imgs/30.gif';

SimplePlayer.defaultPreset = MobilePreset;
const props = defineProps({
  audioPlayStatus: {
    type: Boolean,
    required: false,
  },
  fontSize: {
    type: Number || String,
    default: 18,
  },
  lineHeight: {
    type: Number || String,
    default: 1.9,
  },
  volumeSize: {
    type: Number || String,
    default: 1,
  },
  moveMark: {
    type: String,
    default: '',
  },
  annotations: {
    type: Array,
    default: () => {},
  },
});

const emits = defineEmits(['onAudioStatusChanged', 'onAnnotationsAdded', 'goGame', 'onAnnotationsChanged']);

// 图片切换数据
const imageSwitch1 = ref({
  description: '预警-500',
  srcList: ['/html/catalog-1/imgs/27.jpg', '/html/catalog-1/imgs/22.jpg', '/html/catalog-1/imgs/23.jpg'],
});

// 播放器
onMounted(() => {
  let player = new SimplePlayer({
    id: 'mse',
    url: '/html/catalog-1/imgs/1.mp4',
    poster: '/html/catalog-1/imgs/34.png',
    // height: '200px',
    width: '100%',
    fluid: true,
    videoFillMode: 'fill',
    playsinline: true,
    playbackRate: false,
    fullScreen: {
      // disable: true,
    },
    commonStyle: {
      // 进度条底色
      progressColor: '#999999',
      // 播放完成部分进度条底色
      playedColor: '#FFFFFF',
      // 缓存部分进度条底色
      cachedColor: '#999999',
      // 进度条滑块样式
      sliderBtnStyle: {
        background: 'none',
      },
      // 音量颜色
      volumeColor: '',
    },
  });
  player.on(Events.PLAY, () => {
    console.log('PLAY');
    notifyAudioStatusChange(false);
  });
});

//  跳转知识科普
const detail1 = ref({
  knowledgeType: { name: '知识链接' },
  title: { name: ['制空权'], style: { color: '#001F55' } },
  type: 1,
});

const detail2 = ref({
  knowledgeType: { name: '国防实例' },
  title: { name: ['人民空军雏鹰展翅'], style: { color: '#001F55' } },
  type: 2,
});

const detail3 = ref({
  knowledgeType: { name: '新闻链接' },
  title: { name: ['我军常态抵近台岛', '战备警巡'], style: { color: '#001F55' } },
  type: 3,
});
const knowledgeDetailRef = ref(null);
const jumpDetail = data => {
  console.log(data);
  knowledgeDetailRef.value.showKnowledgeDetail(data);
};

// 图片预览
const showDraw = ref(false);
const imgList = ref([]);

const onDrawChange = status => {
  showDraw.value = status;
};

const onPreviewImage = (url, text) => {
  imgList.value = [
    {
      url: url,
      name: text,
    },
  ];
  showDraw.value = true;
};

// 显示提示
const showAnnotationsTips = ref(false);
const showUnderlinePanel = ref(false);
const tipType = ref(null);
const position = ref('up');
const tipsX = ref(0);
const tipsY = ref(0);
const annotationsTipsContent = ref('');
const underlineMarkParams = ref(null);

const onAnnotationsTipsDrawChange = status => {
  showAnnotationsTips.value = status;
  if (!showAnnotationsTips.value) {
    tipType.value = null;
    position.value = 'up';
    tipsX.value = 0;
    tipsY.value = 0;
  }
};

const onShowAnnotations = (e, type, content) => {
  console.log(e, type, e.clientX, e.clientY);
  tipsX.value = e.clientX;
  tipsY.value = e.clientY;
  tipType.value = type;
  const middle = window.innerHeight / 2;
  position.value = e.clientY > middle ? 'down' : 'up';
  if (type == 1) {
    annotationsTipsContent.value =
      '攻击机，也叫强击机，是作战飞机的一种。主要用于从低空、超低空突击敌战术或浅近战役纵深内的目标，直接支援地面部队作战。';
  } else if (type == 2) {
    annotationsTipsContent.value = content;
  }
  showAnnotationsTips.value = true;
};

const cancelAnnotationMark = (type, content) => {
  console.log(type, content);
  if (type == 2) {
    const annotationItem = props.annotations.find(item => item.detail == content);
    umMarkAction({
      selectedData: annotationItem.selectedData,
      selectedText: annotationItem.digest,
      removeItem: annotationItem,
      type,
    });
  }
};

const onShowUnderlinePanel = (e, params) => {
  tipsX.value = e.clientX;
  tipsY.value = e.clientY;
  const middle = window.innerHeight / 2;
  position.value = e.clientY > middle ? 'down' : 'up';
  underlineMarkParams.value = params;
  showUnderlinePanel.value = true;
};

const onUnderlineChange = status => {
  showUnderlinePanel.value = status;
  if (!showUnderlinePanel.value) {
    tipType.value = null;
    position.value = 'up';
    tipsX.value = 0;
    tipsY.value = 0;
  }
};

const cancelUnderlineMark = () => {
  umMarkAction(underlineMarkParams.value);
  underlineMarkParams.value = null;
};
// 音频控制
let audio = null;
const palyAction = async () => {
  await audio.play();
  notifyAudioStatusChange(true);
  document.removeEventListener('click', palyAction);
};

async function createAudio() {
  // 创建音频元素
  audio = new Audio(mp3Url);
  audio.preload = true;
  audio.autoplay = false;
  // audio.volume = 1;
  // 将音频元素添加到页面中
  document.body.appendChild(audio);
  // 播放音频
  try {
    await palyAction();
  } catch (error) {
    console.log(error);
    // document.addEventListener('click', palyAction);
  }
}
createAudio();

// 添加播放完成事件监听器
audio.addEventListener('ended', function () {
  // 处理播放完成事件
  emits('onAudioStatusChanged', false);
});

// 通知播放状态变化
const notifyAudioStatusChange = value => {
  emits('onAudioStatusChanged', value);
};

// 监听播放请求
watch(
  () => props.audioPlayStatus,
  (newValue, oldValue) => {
    console.log('监听播放请求', newValue);
    if (newValue) {
      audio.play();
    } else {
      audio.pause();
    }
  }
);

// 监听声音控制
watch(
  () => props.volumeSize,
  (newValue, oldValue) => {
    console.log('volumeSize', newValue);
    // showToast(`提示内容:${newValue}`);
    audio.volume = newValue;
  }
);

// 监听字体控制
watch(
  () => props.fontSize,
  (newValue, oldValue) => {
    console.log('fontSize', newValue);
    setFontSize();
  }
);
// 监听行距控制
watch(
  () => props.lineHeight,
  (newValue, oldValue) => {
    console.log('lineHeight', newValue);
    setLineHeight();
  }
);

// 设置全局字体大小
function setFontSize(size) {
  document.body.style.fontSize = props.fontSize + 'px';
}

// 设置全局行距
function setLineHeight(lineHeight) {
  document.body.style.lineHeight = props.lineHeight;
}

// // 菜单操作 ->复制， 划线，批注编辑

const {
  selectedText,
  menuController,
  markAction,
  umMarkAction,
  moveMarkPosition,
  showEditAnnotations,
  annotationsContent,
  onEditAnnotationsConfirm,
} = markHook(emits, props, { onShowAnnotations, onShowUnderlinePanel });

const sss = () => {
  document.querySelector('html').scrollTop = 0;
};
const goGame = () => {
  notifyAudioStatusChange(false);
  emits('goGame');
};

const gif1Ref = ref();
const gif2Ref = ref();
const gif3Ref = ref();
const gif4Ref = ref();
onMounted(() => {
  const superGif1 = new SuperGif({
    gif: gif1Ref.value,
    auto_play: false,
    loop_mode: false,
    progressbar_height: 0,
    max_width: '280',
  });
  const superGif2 = new SuperGif({
    gif: gif2Ref.value,
    auto_play: false,
    loop_mode: false,
    progressbar_height: 0,
    max_width: '280',
  });
  const superGif3 = new SuperGif({
    gif: gif3Ref.value,
    auto_play: false,
    loop_mode: false,
    progressbar_height: 0,
    max_width: '280',
  });
  const superGif4 = new SuperGif({
    gif: gif4Ref.value,
    auto_play: false,
    loop_mode: false,
    progressbar_height: 0,
    max_width: '280',
  });
  const p1 = new Promise((r, j) => {
    superGif1.load(r);
  });
  const p2 = new Promise((r, j) => {
    superGif2.load(r);
  });
  const p3 = new Promise((r, j) => {
    superGif3.load(r);
  });
  const p4 = new Promise((r, j) => {
    superGif4.load(r);
  });
  var completeHide1 = false;
  var completeHide2 = false;
  var completeHide3 = false;
  var completeHide4 = false;
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio == 1) {
          if (entry.target.dataset.gif == 'gif1Ref' && completeHide1) {
            p1.then(() => superGif1.play());
            completeHide1 = false;
          } else if (entry.target.dataset.gif == 'gif2Ref' && completeHide2) {
            p2.then(() => superGif2.play());
            completeHide2 = false;
          } else if (entry.target.dataset.gif == 'gif3Ref' && completeHide3) {
            p3.then(() => superGif3.play());
            completeHide3 = false;
          } else if (entry.target.dataset.gif == 'gif4Ref' && completeHide4) {
            p4.then(() => superGif4.play());
            completeHide4 = false;
          }
        } else if (!entry.isIntersecting && entry.intersectionRatio == 0) {
          console.log(111);

          if (entry.target.dataset.gif == 'gif1Ref') {
            p1.then(() => superGif1.move_to(1));
            completeHide1 = true;
          } else if (entry.target.dataset.gif == 'gif2Ref') {
            p2.then(() => superGif2.move_to(1));
            completeHide2 = true;
          } else if (entry.target.dataset.gif == 'gif3Ref') {
            p3.then(() => superGif3.move_to(1));
            completeHide3 = true;
          } else if (entry.target.dataset.gif == 'gif4Ref') {
            p4.then(() => superGif4.move_to(1));
            completeHide4 = true;
          }
        }
      });
    },
    { threshold: [0, 1] }
  );
  const elements = document.querySelectorAll('.observe-container');
  elements.forEach(element => {
    observer.observe(element);
  });
});

onMounted(() => {
  const element1 = document.getElementById('slide-client-1');
  const element2 = document.getElementById('slide-client-2');
  const element3 = document.getElementById('slide-client-3');
  let startX;
  let currentX = 0;
  const slideTouchstart = element => {
    return e => {
      const touch = e.touches[0];
      startX = touch.clientX - currentX;
      element.style.transition = ``;
    };
  };

  const slideTouchMove = element => {
    return e => {
      const touch = e.touches[0];
      currentX = touch.clientX - startX;
      // 确保 currentX 不为负值
      if (currentX < 0) {
        currentX = 0;
      }

      element.classList.remove('slide-animate');
      element.style.transform = `translateX(${currentX}px)`;
    };
  };

  const slideTouchEnd = (call, element) => {
    return e => {
      const elementWidth = element.offsetWidth;
      // 可选：在触摸结束时执行其他操作
      if (currentX > elementWidth * 0.6) {
        // 继续滚动到元素的宽度
        element.style.transition = `transform 0.5s ease`;
        element.style.transform = `translateX(${elementWidth}px)`;
        setTimeout(() => {
          if (call) call();
        }, 500);
        setTimeout(() => {
          element.style.transform = `translateX(0px)`;
          currentX = 0;
        }, 1000);
      } else {
        // 返回原点
        element.style.transition = `transform 0.5s ease`;
        element.style.transform = `translateX(0px)`;
        currentX = 0;
      }
      element.classList.add('slide-animate');
    };
  };
  element1.addEventListener('touchstart', slideTouchstart(element1));
  element2.addEventListener('touchstart', slideTouchstart(element2));
  element3.addEventListener('touchstart', slideTouchstart(element3));

  element1.addEventListener('touchmove', slideTouchMove(element1));
  element2.addEventListener('touchmove', slideTouchMove(element2));
  element3.addEventListener('touchmove', slideTouchMove(element3));

  element1.addEventListener('touchend', slideTouchEnd(jumpDetail.bind(this, detail1.value), element1));
  element2.addEventListener('touchend', slideTouchEnd(jumpDetail.bind(this, detail2.value), element2));
  element3.addEventListener('touchend', slideTouchEnd(jumpDetail.bind(this, detail3.value), element3));
});
defineExpose({ moveMarkPosition });
</script>

<template>
  <div class="render-html-container">
    <div class="html-wrap">
      <!-- TODO 以下应该根据配置文件渲染出来，这里先写为固定项 -->
      <div class="compound-group no-mark no-menu">
        <img style="width: 288px; padding: 0px" class="img-center no-menu" src="/html/catalog-1/imgs/1.svg" data-type="img-full" />
        <img
          style="width: 56px; padding: 0px; position: absolute; right: -10px; top: 72px"
          class="plane-img no-menu"
          src="@/assets/plane-2.png"
          data-type="img-full"
        />
        <audioCard
          class="no-mark no-menu"
          style="margin-top: 32px"
          :audioPlayStatus="audioPlayStatus"
          :src="'/html/catalog-1/imgs/2.png'"
          @notifyAudioStatusChange="notifyAudioStatusChange"
          name="中国空军进行曲"
          description="中国人民解放军军乐团"
          data-type="audio"
        />
      </div>
      <div class="paragraph-group" style="background-color: #f0f9ff">
        <div class="no-mark no-menu" style="margin: 0 auto; text-align: center; overflow: height; margin-top: 22px">
          <span style="background: #004fea; color: #ffffff; padding: 10px 16px 10px 16px">什么是空军？</span>
        </div>
        <p id="count-8" data-count="8" class="paragraph" data-type="paragraph" style="padding-left: 10px; padding-right: 10px">
          空军，是以航空兵为主体，遂行空中斗争、空对地斗争和地对空斗争的军种。空军的基本任务是国土防空，支援陆军、海军作战，主要武器装备有歼击机、轰炸机、歼击轰炸机、侦察机、电子对抗飞机和空中加油机等。
        </p>
      </div>
      <div class="compound-group no-mark no-menu" style="text-align: center">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -34px; top: -46px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />
        <h3 class="section-title no-menu no-mark" style="margin: 30px 0 0 0">1.军种概况</h3>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -34px; top: -10px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <p id="count-1" class="paragraph" data-type="paragraph" data-count="1">
        1911年9月，意大利发动对土耳其的战争。土耳其还没有飞机时，意大利已经建立了一个隶属于陆军的飞机连，拥有约20架军用飞机和32名飞行员。
      </p>
      <!-- TODO 绑定事件的数据需要在渲染的时候去通过bind绑定，这里先给定默认数据 -->
      <!-- 根据某个字段去判断需不需要加跳转 -->
      <div class="slide-container no-menu">
        <!-- 制空权 -->
        <div id="slide-client-1" class="slide-client slide-animate">
          <img style="width: 106px; height: 75px" class="plane" src="@/assets/plane-5.png" data-type="img-full" />
          <div class="slide-description">
            <div class="type">知识链接</div>
            <div class="title">制空权</div>
          </div>
        </div>
      </div>
      <p id="count-2" class="paragraph" data-type="paragraph" data-count="2">
        <!-- <mark>111</mark> -->
        11月1日，意军飞行员驾驶“鸽”式飞机，向土军阵地投下4颗各重2千克的“西佩利”式榴弹，这是飞机作战史上的首次轰炸行动。
      </p>
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -20px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />
        <p id="count-3" class="paragraph" data-type="paragraph" data-count="3">
          第二次世界大战期间，空军迅速发展，各交战国生产的军用飞机总数达到70余万架，建立了庞大的歼击、强击、战术轰炸、战略轰炸等航空部队，以支援陆军、海军作战，实施战略轰炸、防空作战等多项任务，航空兵成为战争中的重要兵种。
        </p>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 4px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <p id="count-33" class="paragraph" data-type="paragraph" data-count="3">
        进入21世纪，美、俄等国的战略飞机都具有远程机动和打击能力，在加油机的支援下，可连续飞行10多个小时，甚至可以直接到达万余千米以外的地方执行作战任务。
      </p>
      <div class="observe-container img-right-wrapper no-menu" data-gif="gif1Ref">
        <img ref="gif1Ref" width="382" height="248" :rel:animated_src="gif1" />
      </div>
      <div class="compound-group no-mark no-menu" style="text-align: center">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -26px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />
        <h3 class="section-title no-menu no-mark" style="margin: 30px 0 0 0">2.我国空军主要历程</h3>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; top: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <p id="count-4" data-count="4" class="paragraph" data-type="paragraph">
        1949年11月11日，中国人民解放军空军领导机构在北京成立，空军正式成为中国人民解放军的独立军种。随后，歼击、轰炸、强击、侦察、运输航空兵、空降兵部队和一批院校相继组建。
      </p>
      <img
        class="img-center no-menu"
        @click="onPreviewImage('/html/catalog-1/imgs/9.png', '中国人民解放军空军军旗')"
        style="width: 286px; margin-top: 22px"
        src="/html/catalog-1/imgs/9.png"
        data-type="img-center"
      />
      <div class="img-full-description" style="transform: scale(0.9)">中国人民解放军空军军旗</div>
      <p id="count-5" data-count="5" class="paragraph" data-type="paragraph">人民空军成立不久，就开赴抗美援朝战场，保家卫国。</p>
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -26px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />
        <p id="count-6" data-count="6" class="paragraph" data-type="paragraph">20世纪60年代至70年代，逐步发展成为一支国土防空型的空军。</p>
        <p id="count-7" data-count="7" class="paragraph" data-type="paragraph">90年代以来，空军进入快速发展时期，陆续列装了新的战机。</p>
        <p id="count-77" data-count="7" class="paragraph" data-type="paragraph">
          70多年来，人民空军从无到有、从弱到强，胸怀凌云壮志，搏击万里长空，用战斗巡航守卫祖国蓝天，用航迹丈量祖国的大好河山。
        </p>

        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <div
        class="paragraph-group-img"
        style="
          background-image: url('/html/catalog-1/imgs/10.png');
          background-size: 90%;
          background-clip: content-box;
          overflow: hidden;
          min-height: 283px;
        "
      >
        <p id="count-88" data-count="8" class="paragraph" data-type="paragraph" style="padding: 0px; margin-top: 110px">
          今天的人民空军，不断提高战略预警、空中打击、防空反导、信息对抗、空降作战、战略投送和综合保障能力，向着空天一体、攻防兼备的战略目标迈进，努力建设一支强大的人民空军。
        </p>
      </div>
      <div class="slide-container no-menu">
        <div id="slide-client-2" class="slide-client slide-animate">
          <img style="width: 106px; height: 75px" class="plane" src="@/assets/plane-6.png" data-type="img-full" />
          <div class="slide-description">
            <div class="type">国防实例</div>
            <div class="title" style="font-size: 20px">人民空军雏鹰展翅</div>
          </div>
        </div>
      </div>
      <div class="compound-group no-mark no-menu" style="text-align: center; margin-top: 20px">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -26px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />
        <h3 class="section-title no-menu no-mark" style="margin: 30px 0 0 0">3.人民空军基本构成</h3>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <p id="count-9" data-count="9" class="paragraph" data-type="paragraph">
        人民空军主要由航空兵、地面防空兵、空降兵、雷达兵，以及通信兵、电子对抗兵等其他专业勤务部队组成。
      </p>
      <p id="count-10" data-count="10" class="paragraph" data-type="paragraph">
        航空兵是空军的主要兵种，主要装备有各型歼击机、歼击轰炸机、强击机、轰炸机等作战飞机，以及侦察机、运输机、电子干扰机、预警机、加油机等专业飞机。
      </p>
      <img
        class="img-full-no-padding no-menu"
        src="/html/catalog-1/imgs/13.png"
        @click="onPreviewImage('/html/catalog-1/imgs/35.jpg')"
        data-type="img-full"
      />
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -26px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />
        <p id="count-11" data-count="11" class="paragraph" data-type="paragraph">
          歼击航空兵，是以歼击机为基本装备，以截击、空战为主要手段执行作战任务的航空兵，是空中作战的主要力量，能够在各种气象条件下歼灭敌空中战机和其他航空兵器。
        </p>
      </div>

      <img
        class="img-full no-menu"
        src="/html/catalog-1/imgs/14.png"
        @click="onPreviewImage('/html/catalog-1/imgs/14.png', '2012年2月17日，中国空军轰-6战机飞越雪域高原，飞行员视角')"
        data-type="img-full"
      />
      <div class="img-full-description" style="transform: scale(0.9); margin-bottom: 14px">
        2012年2月17日，中国空军轰-6战机飞越雪域高原，飞行员视角
      </div>
      <div class="slide-container no-menu">
        <div id="slide-client-3" class="slide-client slide-animate">
          <img style="width: 106px; height: 75px" class="plane" src="@/assets/plane-7.png" data-type="img-full" />
          <div class="slide-description">
            <div class="type">新闻链接</div>
            <div class="title" style="font-size: 22px; line-height: 28px">我军常态抵近<br/>台岛战备警巡</div>
          </div>
        </div>
      </div>
      <p id="count-12" data-count="12" class="paragraph" data-type="paragraph">
        强击航空兵，是以强击机为基本装备，主要遂行低空、超低空突击地面和水面小型、活动目标任务的航空兵，是航空火力支援的主要力量。在空中进攻作战和支援陆、海作战中，具有重要作用。
      </p>
      <div class="compound-group no-mark no-menu" style="text-align: center; margin-top: 20px">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -26px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />
        <h3 class="section-title no-menu no-mark" style="margin: 30px 0 0 0">4.空军武器装备</h3>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>
      <p id="count-13" data-count="13" class="paragraph" data-type="paragraph">
        空军作战的主要武器装备（军用飞机），包括战斗机、轰炸机、武装直升机、侦察机、军用无人机、攻击机<img
          style="width: 16px; height: 16px"
          @click="
            e => {
              onShowAnnotations(e, 1);
            }
          "
          src="/html/catalog-1/imgs/mark-yellow.png"
        />、预警机和运输机、空中加油机等。
      </p>
      <img class="img-center no-menu" style="width: 100%; margin-top: 22px" src="/html/catalog-1/imgs/3.gif" data-type="img-center" />
      <div class="img-full-description" style="transform: scale(0.9)">歼-15舰载战斗机在辽宁舰滑跃起飞</div>
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; bottom: -50px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />
        <p id="count-14" data-count="14" class="paragraph" data-type="paragraph">
          歼击机，也叫战斗机，是航空兵空中作战的主要机种。歼击机可以携带对空、对地导弹等武器，它的主要任务是与敌方飞机进行空战，拦截敌方轰炸机和导弹，还可执行对地攻击任务。
        </p>
      </div>

      <img class="img-full no-menu" style="margin-top: 20px" src="/html/catalog-1/imgs/18.gif" @click="goGame" data-type="img-full" />
      <div class="compound-group">
        <p id="count-15" data-count="15" class="paragraph" data-type="paragraph">
          轰炸机，以导弹、炸弹、鱼雷为基本武器，从空中对地面（水面或水下）目标实施轰炸的作战飞机。既可以实施常规武器打击，也可以实施核武器打击，具有突击力强、航程远、载弹量大、机动性高等特点。6N首次亮相，为国产新型远程战略轰炸机，可以进行空中受油。两型轰炸机能够实施远程奔袭、大区域巡航、防区外打击，人民空军战略威慑和战略打击能力全面提升。
        </p>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>

      <!-- 图片轮播占位 -->
      <imageSwiper class="no-mark no-menu" />
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -20px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />

        <p id="count-16" data-count="16" class="paragraph" data-type="paragraph">
          预警机，用于搜索、监视空中或海上目标，并可指挥引导己方飞机遂行作战任务的军用飞机。预警-500是我国新一代中型预警指挥机，最大起飞重量可达77吨。它能做到360度无死角探测几百千米以内的目标。
        </p>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>

      <!-- 图片切换占位 -->
      <image-switch :list="imageSwitch1" class="no-mark no-menu" />
      <p id="count-17" data-count="17" class="paragraph" data-type="paragraph">
        运输机，专门用于运送军事人员、武器装备和军用物资的军用飞机，具有较大的载重量和续航能力，能实施空运、空降、空投，保障地面部队从空中实施快速机动。运-20大型喷气式运输机，代号“鲲鹏”，是我国自主研发的新一代重型军用运输机。2013年1月26日首飞成功；2014年11月，首次亮相珠海航展；2016年7月6日，正式装备部队。
      </p>
      <div class="img-left-wrapper compound-group no-mark no-menu">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -40px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />

        <!-- <img
          class="img-left no-menu"
          style="width: 100%"
          src="/html/catalog-1/imgs/19.png"
          @click="onPreviewImage('/html/catalog-1/imgs/30.png', '运-20大型喷气式运输机')"
          data-type="img-right"
        /> -->
        <div class="observe-container no-menu" data-gif="gif3Ref">
          <img ref="gif3Ref" width="300" height="204" :rel:animated_src="gif3" src="/html/catalog-1/imgs/30.gif" />
        </div>
        <div class="img-left-description" style="transform: scale(0.9)">运-20大型喷气式运输机</div>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-2.png"
          data-type="img-full"
        />
      </div>
      <p id="count-18" data-count="18" class="paragraph" data-type="paragraph">
        空中加油机，飞行中的飞机及直升机补加燃油的军用飞机。作用：使受油机增大航程，延长续航时间，增加有效载重，以提高航空兵的作战能力。运油-20，是我国自主研制生产的首款大型加油机，起飞重量约为220吨，能载油100多吨，可以同时为3架飞机进行空中加油。
      </p>
      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; top: -60px"
          class="plane-img no-menu"
          src="@/assets/plane-4.png"
          data-type="img-full"
        />
        <div class="observe-container no-menu" data-gif="gif2Ref">
          <img ref="gif2Ref" width="300" height="204" :rel:animated_src="gif2" src="/html/catalog-1/imgs/7.png" />
        </div>
        <div class="img-full-description" style="transform: scaleX(0.9); margin-bottom: 22px; margin-top: 22px">
          空军运油-20加油机为歼-20隐形战斗机和歼-16战斗机，进行空中加油
        </div>
        <img
          style="width: 86px; padding: 0px; position: absolute; right: -36px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-1.png"
          data-type="img-full"
        />
      </div>

      <!-- 视频占位 -->
      <div class="video-full no-mark no-menu" style="margin-top: 36px">
        <div id="mse"></div>
      </div>
      <p id="count-19" data-count="19" class="paragraph" style="margin-top: 0px" data-type="paragraph">
        军用无人机，利用无线电遥控设备或自备的程序控制装置操纵的飞机，可以用于执行战场侦察、通信中继、电子对抗等任务。翼龙无人机，是由中航工业研制的一种中低空、军民两用、长航时多用途无人机，可执行监视、侦查及对地攻击等任务，也可用于维稳、反恐、边界巡逻等。此外，广泛应用于民用和科学研究等领域，如灾情监视、缉私查毒、环境保护等。
      </p>

      <div class="compound-group">
        <img
          style="width: 86px; padding: 0px; position: absolute; left: -20px; bottom: 0px"
          class="plane-img no-menu"
          src="@/assets/plane-3.png"
          data-type="img-full"
        />
        <div class="observe-container no-menu" data-gif="gif4Ref">
          <img ref="gif4Ref" width="342" height="204" :rel:animated_src="gif4" src="/html/catalog-1/imgs/32.png" />
        </div>
        <div class="img-full-description" style="transform: scaleX(0.9)">无侦-10无人机</div>
      </div>
      <img class="img-full copy-rights no-menu" style="width: 100%" src="/html/catalog-1/imgs/36.png" data-type="img-full" />
    </div>
  </div>
  <!-- 知识科普 -->
  <knowledgeDetail ref="knowledgeDetailRef" />
  <!-- 图片预览 -->
  <imagePreview :imgList="imgList" :show="showDraw" @onDrawChange="onDrawChange" />
  <!-- 批注 -->
  <van-popup round @close="sss" v-model:show="showEditAnnotations" position="bottom" :style="{ height: '240px' }">
    <editAnnotationsCard @onConfirm="onEditAnnotationsConfirm" :target="annotationsContent" />
  </van-popup>
  <annotationsTips
    :show="showAnnotationsTips"
    :tipType="tipType"
    :position="position"
    :x="tipsX"
    :y="tipsY"
    :content="annotationsTipsContent"
    @onDrawChange="onAnnotationsTipsDrawChange"
    @cancelMark="cancelAnnotationMark"
  />
  <underline-panel-detail
    :show="showUnderlinePanel"
    :position="position"
    :x="tipsX"
    :y="tipsY"
    @cancelMark="cancelUnderlineMark"
    @onDrawChange="onUnderlineChange"
  />
</template>

<style lang="less">
.render-html-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-image: url('@/assets/theme-down.jpg');
  background-repeat: no-repeat;
  background-size: contain;
  background-size: 100% 100%;
}

.html-wrap {
  height: calc(100% - 40px);
  width: 100%;
  margin-bottom: 22px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.compound-group {
  position: relative;
}

.video-full {
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding: 0 42px 0 42px;
}
// 图片样式
.img-full {
  box-sizing: border-box;
  width: 100%;
  min-height: 50px;
  padding: 0 42px 0 42px;
}

.img-full-no-padding {
  box-sizing: border-box;
  width: 100%;
  min-height: 50px;
  padding: 0 42px 0 42px;
}

.img-full-description {
  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  color: #3d3d3d;
  user-select: none;
  -webkit-user-select: none;
  padding-left: 22px;
  padding-right: 22px;
}

.img-center {
  box-sizing: border-box;
  // min-height: 50px;
  display: block;
  margin: 0 auto;
  padding: 0 42px 0 42px;
  width: 100%;
}

.img-right-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-right: 42px;
}

.img-right {
  max-width: 90% !important;
}

.img-left-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.img-left {
  max-width: calc(90% - 42px) !important;
  padding-left: 42px;
}
.img-left-description {
  max-width: 90% !important;
  font-family: 思源黑体;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  color: #3d3d3d;
}

.section-title {
  text-align: center;
  height: 35px;
  line-height: 35px;
  position: relative;
  display: inline-block;
  padding: 0 18px 0 18px;
  &::after {
    content: '';
    background: #004fea;
    width: 4px;
    height: 60%;
    display: block;
    position: absolute;
    right: 0;
    top: 20%;
  }
  &::before {
    content: '';
    background: #004fea;
    width: 4px;
    height: 60%;
    display: block;
    position: absolute;
    left: 0;
    top: 20%;
  }
}

// 标题样式
h1,
h2,
h3,
h4,
h5 {
  white-space: pre-wrap;
  margin: 22px 22px 22px 22px;
  text-align: center;
}
// 段落样式
p {
  line-break: auto;
}
.paragraph {
  text-indent: 2em;
  padding: 0 42px 0 42px;
}

.paragraph-group {
  margin: 22px 42px 0 42px;
  border-radius: 12px;
  overflow: hidden;
}

.paragraph-group-img {
  background-repeat: no-repeat;
  background-position: center top;
  box-sizing: border-box;
  padding-left: 42px;
  padding-right: 42px;
}

// 下划线实线样式
.underlined-text {
  text-decoration: underline;
  text-decoration-color: black; /* 下划线颜色为蓝色 */
  text-decoration-skip-ink: auto;
  text-underline-offset: 6px;
}
// 下划线虚线样式
.underlined-dashed-text {
  text-decoration: underline;
  text-decoration-style: dashed; /* 下划线样式为虚线 */
  text-decoration-color: #d11320; /* 下划线颜色为蓝色 */
  text-decoration-skip-ink: auto;
  text-underline-offset: 6px;
}
mark {
  background: none;
  // color: black;
}

.jsgif {
  display: flex;
  justify-content: center;
}

.jsgif_toolbar {
  display: none;
}

.copy-rights {
  margin: 12px 0 0px 0;
}

@keyframes slideAnimation {
  0% {
    transform: translateX(0%);
  }
  40% {
    transform: translateX(35px);
  }

  80% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(0%);
  }
}

.slide-container {
  width: 78%;
  height: 129px;
  border-radius: 10px;
  opacity: 1;
  background: #2e70e1;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  line-height: 38px;
  text-align: center;
  color: white;
  .slide-animate {
    animation: slideAnimation 4s infinite;
    animation-delay: 3s; /* 延迟 3 秒开始动画 */
  }
  .slide-client {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url('@/assets/slide-client-white.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // transition: transform 0.5s linear;
    .plane {
      position: absolute;
      top: calc(50% - 38px);
      left: 44px;
    }
  }

  .slide-description {
    position: absolute;
    right: 0;
    top: 22.2px;
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .type {
      width: 132px;
      height: 34px;
      background: #2e70e1;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      line-height: 34px;
      text-align: center;
      font-size: 24px;
    }
    .title {
      max-width: 168px;
      margin-top: 10px;
      margin-right: 10px;
      font-family: Source Han Serif CN;
      font-size: 36px;
      font-weight: bold;
      line-height: 38px;
      text-align: right;
      color: #2e70e1;
    }
  }
}
</style>
