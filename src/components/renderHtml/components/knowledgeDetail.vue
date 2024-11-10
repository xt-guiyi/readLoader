<!--
 * @Author: xt 1661219752@qq.com
 * @Date: 2024-05-08 11:26:13
 * @LastEditors: xt-guiyi 1661219752@qq.com
 * @LastEditTime: 2024-06-06 00:08:47
 * @FilePath: \NDEAPP\h5\readLoader\src\components\renderHtml\components\knowledgeDetail.vue
 * Copyright (c) 2024 by 正选信息, All Rights Reserved.
-->
<script setup>
import { ref, defineProps, nextTick } from 'vue';
// import roundClose from '@/assets/round-close.png'
// import roundClose from '@/assets/knowledge-title.png'
const show = ref(false);
const detailData = ref({});

const onDrawChange = () => {
    show.value = false;
    // nextTick(()=> {
    detailData.value = {};
    // })
};

const showKnowledgeDetail = data => {
    detailData.value = data;
    show.value = true;
};

defineExpose({
    showKnowledgeDetail,
});
</script>

<template>
    <div class="knowledge-detail no-menu">
        <van-overlay :show="show" @click.stop="onDrawChange" z-index="1000" :lock-scroll="false">
            <div class="wrapper" @click.stop v-if="show">
                <div class="block">
                    <div class="toolbar">
                        <div class="name">{{ detailData.knowledgeType.name }}</div>
                    </div>
                    <div class="close-wrap" @click.stop="onDrawChange"></div>
                    <div class="block-content">
                        <div class="content">
                            <div style="text-align: center;margin-top:22px">
                                <h2 class="title" :style="detailData.title.style"
                                    v-for="(item, index) in detailData.title.name" :key="index">
                                    {{ item }}
                                </h2>
                            </div>
                            <!-- TODP 这里应该有由detailData获取的数据渲染，现由type控制 -->
                            <div v-if="detailData.type == 1" :style="{ color: 'black' }">
                                <p class="paragraph" data-type="paragraph">
                                    交战的一方，在一定时间内对一定空域的控制权。战争中，能较长时间占有制空权，对战争的胜负会产生重大影响。
                                </p>
                                <p class="paragraph" data-type="paragraph">
                                    飞机参加战斗后，意大利军事家杜黑说：“今天，我们充分意识到制海权的重要，但是不久，制空权将变得同样重要。因为，只有获得制空权，我们才能利用空中观察的好处，居高临下地观察目标。这种好处，只有当我们拥有空中力量而使敌人停留在地面时，才能充分地享受……为了争夺空中优势，航空兵队伍将越来越大。
                                </p>
                            </div>
                            <div v-if="detailData.type == 2" :style="{ color: 'black' }">
                                <p class="paragraph" data-type="paragraph">
                                    抗美援朝战场上，不满周岁的我志愿军空军，面对的是当时世界上最强大的美国空中力量，两国空军作战实力相差悬殊。
                                </p>
                                <img class="img-full" @click="jumpDetail(detail2)" style="height: 200px"
                                    src="/html/catalog-1/imgs/29.png" data-type="img-full" />
                                <p class="paragraph" data-type="paragraph">
                                    参战的美军共有各型作战飞机1100余架，飞行员的飞行时间多在1000小时以上，许多飞行员参加过第二次世界大战，有丰富的空战经验。而志愿军空军共有各型作战飞机不足200架，飞行员的飞行时间仅有100多小时，在喷气式歼击机上只飞了20多个小时，没有进行过空战。
                                </p>
                                <p class="paragraph" data-type="paragraph">
                                    面对敌人“把你们炸回石器时代”的叫嚣，年轻的人民空军，不惧敌强我弱，血战长空。战争期间，共击落敌机330架、击伤95架，粉碎了美空军的“空中绞杀战”，建立起了让美空军胆寒的“米格走廊”，胜利完成了掩护交通运输线、配合地面部队作战等任务，打出了人民空军的威风，为后来人民空军的建设和发展奠定了坚实的基础。
                                </p>
                            </div>
                            <div v-if="detailData.type == 3" :style="{ color: 'black' }">
                                <p class="paragraph" data-type="paragraph">
                                    2021年以来，解放军常态环台岛组织轰炸机、侦察机、歼击机等开展巡航，常态抵近台岛周边组织多军兵种力量联合战备警巡，常态在台岛附近海空域组织联合对海突击、联合对陆打击、联合防空作战等实战化演练。实际出动飞机架次，比民进党当局炒作的数量只会多、不会少，目标十分明确，那就是以果断行动回击岛内外势力频繁勾连、挑战一个中国原则的恶劣行径，坚决捍卫国家主权和领土完整，切实维护两岸同胞共同福祉和台海地区和平稳定。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<style lang="less" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.knowledge-detail .block {
    width: 88%;
    height: 80%;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 10px;
    background: linear-gradient(180deg, #5d92ee 1%, #2e70e1 100%);
    position: relative;

    .toolbar {
        position: absolute;
        top: -25px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99;

        .name {
            width: 150px;
            height: 64px;
            line-height: 64px;
            overflow: hidden;
            color: #ffffff;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-radius: 20px;
            font-family: Alimama DongFangDaKai;
            font-size: 26px;
            font-weight: normal;
            text-align: center;
            background: #82dcf6;
            box-shadow: 0px 3px 2px 0px rgba(0, 88, 114, 0.2), inset 0px -8px 10px 0px rgba(0, 75, 97, 0.1);
            text-shadow: 0 0 2px #1690B3, 0 0 2px #1690B3, 0 0 2px #1690B3,
                0 0 2px #1690B3, 0 0 2px #1690B3, 0 0 2px #1690B3, 0 0 2px #1690B3,
                0 0 2px #1690B3, 0 0 2px #1690B3;
            position: relative;
            padding-left: 25px;
            padding-right: 25px;

            &::before {
                content: '';
                background: #ffffff;
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 50%;
                position: absolute;
                top: calc(50% - 5px);
                left: 10px;
                box-shadow: 0px 3px 2px 0px rgba(0, 88, 114, 0.2), inset 0px -8px 10px 0px rgba(0, 75, 97, 0.1);
            }

            &::after {
                content: '';
                background: #ffffff;
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 50%;
                position: absolute;
                top: calc(50% - 5px);
                right: 10px;
                box-shadow: 0px 3px 2px 0px rgba(0, 88, 114, 0.2), inset 0px -8px 10px 0px rgba(0, 75, 97, 0.1);
            }
        }
    }

    .close-wrap {
        position: absolute;
        top: -16px;
        right: -10px;
        width: 50px;
        height: 50px;
        background-image: url('@/assets/round-close.png');
        background-size: 50px 50px;
        background-repeat: no-repeat;
        z-index: 100;
    }

    .block-content {
        height: 100%;
        background: white;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
    }

    .content {
        flex: 1;
        margin-bottom: 20px;
        overflow-y: scroll;
        margin-top: 22px;

        p {
            padding: 0 22px 0 22px !important;
        }

        .title {
            font-family: zihunbiantaoti;
            font-size: 34px;
            line-height: 1.2;
            position: relative;
            // padding-left: 10px;
            // padding-right: 10px;
            display: inline-block;
            padding-bottom: 4px;
            padding-left: 6px;
            padding-right: 10px;
            margin-bottom: 0px;
            margin-left: 0;
            margin-right: 0;
            margin-top: 0;
            background-image: url('@/assets/knowledge-title-decor.svg');
            background-position: center 15px;
            background-repeat: no-repeat;
            background-size: 98% 35px;
            // &::after {
            //   content: '';
            //   background-image: url('@/assets/knowledge-title-decor.svg');
            //   background-size: 100%;
            //   position: absolute;
            //   left: 0;
            //   right: 0;
            //   bottom: 0;
            //   display: block;
            //   width: 100%;
            //   height: 55%;
            // }
        }
    }
}
</style>
