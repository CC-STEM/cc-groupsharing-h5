<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageView from '@/components/PageView.vue'
import Podium from '@/assets/podium.png'
import Gold from '@/assets/gold.png'
import Silver from '@/assets/silver.png'
import Copper from '@/assets/copper.png'
import type { RecommendRankItem } from '@/typing'
import RankTip from '@/assets/rankTip.png'
import IpLogo from '@/assets/ip.png'
import RankFirst from '@/assets/first.png'
import RankSecond from '@/assets/second.png'
import RankThird from '@/assets/third.png'
import { getUserRecommendRank } from '@/services/api'

const getRandomAvatar = () => new URL(`../assets/avatar/${Math.floor(1 + Math.random() * 17)}.jpg`, import.meta.url).href
const goldAvatar = getRandomAvatar()
const silverAvatar = getRandomAvatar()
const copperAvatar = getRandomAvatar()
const showShareArrowOverlay = ref(false)
const showFetchLoading = ref(false)
const route = useRoute()

const curRank = ref<RecommendRankItem[]>([
])

function inviteOther() {
  showShareArrowOverlay.value = true
}

const goldInfo = computed(() => curRank.value.find(item => item.no === 1) || null)
const silverInfo = computed(() => curRank.value.find(item => item.no === 2) || null)
const copperInfo = computed(() => curRank.value.find(item => item.no === 3) || null)
const rankImgList = [RankFirst, RankSecond, RankThird]
const myRankInfo = computed<RecommendRankItem | null>(() => {
  return curRank.value.find(item => item.currentUser) || null
})

function safeName(info: RecommendRankItem) {
  return `${info.nickName.slice(0, 1)}**` + `(${info.mobile.slice(-4)})`
}

watchEffect(async () => {
  showFetchLoading.value = false
  const { data: { data: rankList } } = await getUserRecommendRank(route.query.groupBuyingId as string)
  curRank.value = rankList
  showFetchLoading.value = true
  // console.log('res2', res2)
})
</script>

<template>
  <PageView :has-nav-bar="true" title="推荐好友排名" style="background: linear-gradient(181deg, #FFFED8, #FFFFFF);">
    <div class="recommendContainer">
      <div class="podiumBg">
        <img class="podium" :src="Podium" alt="">
        <div class="gold">
          <img class="rankImg" :src="Gold" alt="">
          <div class="avatar" style="border: 3px solid #f4e21a;">
            <img v-if="goldInfo" :src="goldAvatar" alt="">
          </div>
          <div v-if="goldInfo" class="msg">
            <div class="phone">
              {{ safeName(goldInfo) }}
            </div>
            <div class="num">
              {{ goldInfo.count }}人
            </div>
          </div>
        </div>
        <div class="silver">
          <img class="rankImg" :src="Silver" alt="">
          <div class="avatar" style="border: 3px solid #BEC8E4;">
            <img v-if="silverInfo" :src="silverAvatar" alt="">
          </div>
          <div v-if="silverInfo" class="msg">
            <div class="phone">
              {{ safeName(silverInfo) }}
            </div>
            <div class="num">
              {{ silverInfo.count }}人
            </div>
          </div>
        </div>
        <div class="copper">
          <img class="rankImg" :src="Copper" alt="">
          <div class="avatar" style="border: 3px solid #F5B98D;">
            <img v-if="copperInfo" :src="copperAvatar" alt="">
          </div>
          <div v-if="copperInfo" class="msg">
            <div class="phone">
              {{ safeName(copperInfo) }}
            </div>
            <div class="num">
              {{ copperInfo.count }}人
            </div>
          </div>
        </div>
      </div>
      <div class="rankContent">
        <div class="rankHeader">
          <div class="rankTitle">
            排行
          </div>
          <div class="userTitle">
            用户
          </div>
          <div class="recommendTitle">
            <img :src="RankTip" alt="">
            <div class="">
              推荐人数
            </div>
          </div>
        </div>
        <div class="rankList">
          <div v-for="(item, index) in curRank" :key="index" class="rankItem">
            <div class="numBox">
              <img v-if="index <= 2" class="rankNumImg" :src="rankImgList[index]" alt="">
              <div v-else class="rankNum">
                {{ index + 1 }}
              </div>
            </div>
            <div class="rankUser">
              <img class="userImg" :src="IpLogo" alt="">
              <div class="username">
                {{ item.nickName }}
              </div>
            </div>
            <div class="recommendValue">
              {{ item.count }}
            </div>
          </div>
        </div>
      </div>
      <div class="myRank">
        <div class="myInfo">
          <img :src="IpLogo" alt="">
          <div>
            <span>{{ myRankInfo?.nickName }}</span>
            <span>(1234)</span>
          </div>
        </div>
        <div class="myRecommed">
          <span>推荐量</span>
          <span v-if="myRankInfo">{{ myRankInfo?.count }}</span>
        </div>
        <div class="myRankValue">
          <span @click="inviteOther">推荐好友</span>
        </div>
      </div>
    </div>
  </PageView>
  <van-overlay z-index="1000" :show="showShareArrowOverlay" @click="showShareArrowOverlay = false">
    <img src="@/assets/shareArrow.png" class="shareArrow" alt="">
  </van-overlay>
</template>

<style lang="less" scoped>
.recommendContainer {
  width: 100vw;
  height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .podiumBg {
    margin-top: 170px;
    width: 630px;
    height: 268px;
    position: relative;

    img.podium {
      width: 100%;
      height: 100%;
    }

    .rankImg {
      width: 100%;
      height: 100%
    }

    .avatar {
      position: absolute;
      top: -90px;
      left: -24px;
      width: 106px;
      height: 106px;
      background: #FFFFFF;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .msg {
      width: 162px;
      height: 69px;
      position: absolute;
      top: 116px;
      left: -54px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .phone {
        white-space: nowrap;
        width: 100%;
        height: 31px;
        font-family: PingFang SC;
        font-weight: 800;
        font-size: 32px;
        color: #686B6E;
      }

      .num {
        width: auto;
        height: 26px;
        font-family: DIN;
        font-weight: bold;
        font-size: 36px;
        color: #686B6E;
      }
    }

    .gold {
      width: 59px;
      height: 78px;
      position: absolute;
      left: 290px;
      top: -32px;
    }

    .silver {
      width: 59px;
      height: 78px;
      position: absolute;
      top: 28px;
      left: 78px;

      // .rankImg {
      //   width: 100%;
      //   height: 100%
      // }

      // .avatar {
      //   position: absolute;
      //   top: -90px;
      //   left: -24px;
      //   width: 106px;
      //   height: 106px;
      //   background: #FFFFFF;
      //   border-radius: 50%;
      //   border: 3px solid #BEC8E4;
      // }
    }

    .copper {
      width: 59px;
      height: 78px;
      position: absolute;
      left: 491px;
      top: 28px;

      // .rankImg {
      //   width: 100%;
      //   height: 100%
      // }

      // .avatar {
      //   position: absolute;
      //   top: -90px;
      //   left: -24px;
      //   width: 106px;
      //   height: 106px;
      //   background: #FFFFFF;
      //   border-radius: 50%;
      //   border: 3px solid #F5B98D;
      // }
    }
  }

  .rankContent {
    width: 100%;
    // background: #FFFFFF;
    border-radius: 20px;
    max-height: 836px;
    margin-top: 50px;
    position: relative;
    // display: flex;
    // flex-direction: column;

    .rankHeader {
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 26px;
      color: #B3B3B3;

      .recommendTitle {
        display: flex;
        align-items: center;

        img {
          width: 25px;
          height: 25px;
        }
      }
    }

    .rankList {
      height: calc(100vh - 762px);
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
    }

    .rankItem {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 22px 0px;

      .numBox {
        width: 25%;
        display: flex;
        justify-content: center;

        .rankNumImg {
          width: 54px;
          height: 54px;
        }

        .rankNum {
          font-family: DIN;
          font-weight: bold;
          font-size: 28px;
          color: #161616;
        }
      }

      .rankUser {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: left;

        .userImg {
          width: 70px;
          height: 70px;
          background: #FFFFFF;
          border-radius: 20px;
          margin-right: 27px;
        }

        .username {
          font-family: PingFang SC;
          font-weight: 500;
          font-size: 28px;
          color: #1A1A1A;
        }
      }

      .recommendValue {
        width: 25%;
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 28px;
        color: #1A1A1A;
        display: flex;

      }
    }

  }

  .myRank {
    width: 100%;
    height: 161px;

    background: #FFCE25;
    border-radius: 20px 20px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 28px;
    color: #FFFFFF;
    position: absolute;
    bottom: 0px;

    .myInfo {
      margin-left: 38px;
      display: flex;
      align-items: center;

      img {
        width: 70px;
        height: 70px;
        margin-right: 28px;
      }
    }

    .myRecommed {
      margin-left: 122px;
      display: flex;
      align-items: center;

      span:first-child {
        margin-right: 18px;
      }
    }

    .myRankValue {
      width: 185px;
      height: 82px;
      background: #FF5400;
      border-radius: 41px;
      display: flex;
      align-items: center;
      justify-content: center;

      // span:first-child {
      //   margin-right: 20px;
      // }
    }
  }
}
</style>
