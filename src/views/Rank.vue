<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import PageView from '@/components/PageView.vue'
import { getUserRecommendRank } from '@/services/api'

import type { RecommendRankItem } from '@/typing'
import RankTip from '@/assets/rankTip.png'
import IpLogo from '@/assets/ip.png'
import RankFirst from '@/assets/first.png'
import RankSecond from '@/assets/second.png'
import RankThird from '@/assets/third.png'

const route = useRoute()

const curRank = ref<RecommendRankItem[]>([])
const showFetchLoading = ref(false)
const rankImgList = [RankFirst, RankSecond, RankThird]
const myRankInfo = computed<RecommendRankItem | null>(() => {
  return curRank.value.find(item => item.currentUser) || null
})

watchEffect(async () => {
  showFetchLoading.value = false
  const { data: { data: rankList } } = await getUserRecommendRank(route.query.groupBuyingId as string)
  curRank.value = rankList
  showFetchLoading.value = true
  // console.log('res2', res2)
})
</script>

<template>
  <PageView :has-nav-bar="true" title="排行榜">
    <div class="rankContainer">
      <div class="rankContent">
        <div class="rankHeader">
          <div class="rankTitle">
            排名
          </div>
          <div class="userTitle">
            用户
          </div>
          <div class="recommendTitle">
            <img :src="RankTip" alt="">
            <div class="">
              推荐量
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
        <div class="myRank">
          <div class="myInfo">
            <img :src="IpLogo" alt="">
            <div>{{ myRankInfo?.nickName }}</div>
          </div>
          <div class="myRecommed">
            <span>推荐量</span>
            <span v-if="myRankInfo">{{ myRankInfo?.count }}</span>
          </div>
          <div class="myRankValue">
            <span>排名</span>
            <span v-if="myRankInfo">{{ myRankInfo?.no }}</span>
          </div>
        </div>
      </div>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.rankContainer {
  width: 100%;
  height: 1448px;
  background: #E8E8E8;
  background-image: url('@/assets/RankBg.png');
  background-repeat: no-repeat;
  background-size: 100% 474px;
  display: flex;
  justify-content: center;

  .rankContent {
    width: 700px;
    background: #FFFFFF;
    border-radius: 20px;
    max-height: 1172px;
    margin-top: 251px;
    position: relative;
    // display: flex;
    // flex-direction: column;

    .rankHeader {
      height: 106px;
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
      height: 900px;
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

    .myRank {
      width: 100%;
      height: 118px;

      background: #FF3E0A;
      border-radius: 20px;
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
        display: flex;
        align-items: center;

        span:first-child {
          margin-right: 20px;
        }
      }
    }
  }

}
</style>
