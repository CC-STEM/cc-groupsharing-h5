<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BScroll from '@better-scroll/core'
import { useRouter } from 'vue-router'
import type { Avatar, Card, PlayItem } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'
import GroupPlayItem from '@/components/GroupPlayItem.vue'
import CardDescDetail from '@/components/Card/CardDescDetail.vue'

import Avatar1 from '@/assets/pic1.jpg'
import Avatar2 from '@/assets/pic2.jpg'
import Avatar3 from '@/assets/pic5.jpg'
import play1 from '@/assets/play1.png'
import play2 from '@/assets/play2.png'
import play3 from '@/assets/play3.png'

import DownArrow from '@/assets/downArrow.png'
import RightArrow from '@/assets/rightArrow.png'

const router = useRouter()
const shopName = ref('门店名称AAA')
const groupSharingStatus = ref('开团中')
const cardList = ref<Card[]>([{
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}, {
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}, {
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}])

const curSelectedCard = ref<Card | null>(null)

const avatarList = ref<Avatar[]>([{
  url: Avatar1,
}, {
  url: Avatar2,
}, {
  url: Avatar3,
}])

const scrollRef = ref(null)
const showCardDetailSheetOption = ref({
  show: false,
})

const playList: PlayItem[] = [{
  imgUrl: play1,
  title: '开团/参团',
  subTitle: '拼团享低价',
}, {
  imgUrl: play2,
  title: '邀请新用户参团',
  subTitle: '分享优惠多',
}, {
  imgUrl: play3,
  title: '2人成团',
  subTitle: '',
}]

function clickDetail(curCard: Card) {
  console.log('click---')
  showCardDetailSheetOption.value = { show: true }
  curSelectedCard.value = curCard
}

onMounted(() => {
  const scrollIns = new BScroll(scrollRef.value, {
    probeType: 3,
    scrollX: true,
    click: true,
  })

  scrollIns.on('scrollStart', () => {
    console.log('scrollStart-')
  })
  scrollIns.on('scroll', ({ y }) => {
    console.log('scrolling-', y)
  })
  scrollIns.on('scrollEnd', (pos) => {
    console.log(pos)
  })
  console.log('scroll', -(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth))
  scrollIns.scrollTo(-(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth) / 2, 0)
})
</script>

<template>
  <div class="container">
    <div class="header">
      <img class="adImg" src="@/assets/ad.png">
      <div class="sharingBar">
        <div class="left">
          <span>{{ shopName }}</span>
        </div>
        <div class="right">
          <span>{{ groupSharingStatus }}</span>
        </div>
      </div>
      <div ref="scrollRef" class="cardContainer">
        <div class="subContainer">
          <GroupSharingCard
            v-for="(item, index) in cardList" :key="index" class="sharingCard"
            :is-active-style="item.isActiveStyle" :course-num="item.courseNum" :end-time="item.endTime"
            :width="item.width" :name="item.name" :detail="item.detail" :part-num="item.partNum" :price="item.price"
            @detail-click="clickDetail(item)"
          />
        </div>
      </div>
      <div class="shareBtn">
        分享
      </div>
    </div>
    <div class="content">
      <div class="contentTitle">
        <div class="firstTitle">
          参与拼团
        </div>
        <div class="secondTitle">
          王梓峰 邀请您来参与拼团啦!
        </div>
      </div>
      <div class="joinGroup">
        <JoinGroupAvatarList :avatar-list="avatarList" :is-support-add="true" />
        <div class="btnList">
          <div class="singleBuyBtn">
            <div class="price">
              ￥88.00
            </div>
            <div class="desc">
              单独购买
            </div>
          </div>
          <div class="createGroupBtn">
            <div class="price">
              ￥55.00
            </div>
            <div class="desc">
              发起拼团
            </div>
          </div>
          <div v-if="false" class="joinGroupBtn">
            <div class="desc">
              立即参团
            </div>
            <div class="price">
              ￥55.00
            </div>
          </div>
        </div>
      </div>
      <div class="joinGroupPlay">
        <div class="top">
          <div class="name">
            拼团玩法 <img class="downArrow" :src="DownArrow" alt="">
          </div>
          <div class="orders" @click="() => { router.push('/Order') }">
            我的拼团订单 <img class="rightArrow" :src="RightArrow" alt="">
          </div>
        </div>
        <div class="playContent">
          <GroupPlayItem
            v-for="(item, index) in playList" :key="index" :img-url="item.imgUrl" :title="item.title"
            :sub-title="item.subTitle"
          />
        </div>
      </div>
      <div class="joinGroupRule">
        <div class="top">
          <div class="name">
            拼团规则 <img class="downArrow" :src="DownArrow" alt="">
          </div>
        </div>
        <div class="ruleContent">
          1．发团：拼团活动期间，用户可在微信公众号、小程序等发起拼团。
          <br>
          2．参团：参加朋友发起的拼团。
          <br>
          3．限量：每个拼团活动进行期间，每位用户限参团一次。若拼团失败后可重新开团或参团。多个拼团在规定时间内满足拼团成功，视第一个完成的拼团订单为有效订单。
          <br>
          4．拼团人数：拼团人数可大于拼团要求人数。即拼团成功后，新参与者可继续参与拼团，直到倒计时结束。
          <br>
          5．成功：规定时间内团购人数满足拼团要求人数（包括团长），视为拼团成功。
          <br>
          6．失败：逾期人数未满足要求人数即为拼团失败，系统将发起退款，退款将于1—5个工作日原路返回。
        </div>
      </div>
      <div class="contentFooter">
        本活动最终解释权归XXXX所有
      </div>
    </div>
    <CardDescDetail
      v-if="curSelectedCard" v-model:show-option="showCardDetailSheetOption"
      :cur-selected-card="curSelectedCard"
    />
  </div>
</template>

<style lang="less" scoped>
:deep(.van-action-sheet) {
  align-items: center;

  .detailTitle {
    max-width: 618px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #000000;
    margin-top: 39px;
    margin-bottom: 25px;
  }

  .detailDesc {
    max-width: 618px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
    margin-bottom: 97px;
  }
}

:deep(.van-action-sheet__header) {
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
  margin-top: 50px;
  margin-bottom: 43px;
}

:deep(.van-action-sheet__cancel) {
  width: 622px;
  height: 88px;
  // background: linear-gradient(90deg, #FABC4F, #FF3A05);
  border: 1px solid #FF3E07;
  // border-image: linear-gradient(0deg, #FF3E07, #FAB84D) 1 1;
  border-radius: 44px;

  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FF460C;
}

.container {
  width: 750px;
  // width: 100vw;
  height: 2281px;
  position: relative;
  background-image: url('@/assets/shareBackgroundTop.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .header {
    height: 30%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .adImg {
      width: 100%;
    }

    .sharingBar {
      width: 695px;
      height: 71.6px;
      background: #FFFFFF;
      border-radius: 36px;
      display: flex;

      .left {
        position: relative;
        width: 500px;
        height: 100%;
        background: #E43E12;
        border-bottom-left-radius: 36px;
        border-top-left-radius: 36px;
        display: flex;
        align-items: center;

        span {
          margin-left: 40px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #FFFFFF;
        }
      }

      .left::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: -35px;
        border-width: 71.6px 35px;
        border-style: solid;
        border-color: #E43E12 transparent transparent transparent;
      }

      .right {
        height: 100%;
        width: calc(100% - 500px);
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 36px;
          font-family: youshe;
          font-weight: 400;
          color: #E43E12;
        }
      }
    }

    .cardContainer {
      white-space: nowrap;
      width: 100%;
      overflow-x: scroll;
      height: 336px;

      .subContainer {
        float: left;
        // position: absolute;
        height: 336px;
        display: flex;
        // float: left;
        align-items: center;

        // margin: auto;
        // left: -50%;
        // justify-content: center;
        .sharingCard {
          margin: 0 15px;
        }
      }
    }

    .shareBtn {
      position: absolute;
      top: 104px;
      right: 0px;
      width: 87px;
      height: 47px;
      background: linear-gradient(90deg, #FFBD4A, #FFAA25, #FF4F0A);
      box-shadow: 0px 1px 25px 2px rgba(0, 0, 0, 0.26);
      border-top-left-radius: 24px;
      border-bottom-left-radius: 24px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      line-height: 47px;
    }
  }

  .content {
    height: 70%;
    background-image: url('@/assets/shareBackground.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .contentTitle {
      padding-top: 40px;
      padding-bottom: 27px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .firstTitle {
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #FFFFFF;
      }

      .secondTitle {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #FFFFFF;
      }
    }

    .joinGroup {
      width: 700px;
      height: 324px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 37px;

      .btnList {
        margin-top: 51px;
        height: 88px;
        width: auto;
        display: flex;

        .singleBuyBtn {
          width: 320px;
          height: 88px;
          // background: linear-gradient(90deg, #FABC4F, #FF3A05);
          border: 1px solid #FF3E07;
          // border-image: linear-gradient(0deg, #FF3E07, #FAB84D) 1 1;
          border-radius: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          margin-right: 12px;

          .price {
            // height: 28px;
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FF460C;
            // margin-bottom: 12px;
          }

          .desc {
            // height: 23px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FF460C;
          }
        }

        .createGroupBtn {
          width: 320px;
          height: 88px;
          background: linear-gradient(179deg, #FFE691, #FF3A05);
          border-radius: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;

          .price {
            // height: 28px;
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FFFFFF;
          }

          .desc {
            // height: 23px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
        }

        .joinGroupBtn {
          display: flex;
          // flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 637px;
          // height: 88px;
          background: linear-gradient(179deg, #FFE691, #FF3A05);
          border-radius: 44px;

          .price {
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FFFFFF;
          }

          .desc {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
      }
    }

    .joinGroupPlay {
      width: 700px;
      height: 330px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 24px;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      align-items: center;

      .top {
        margin-top: 39px;
        width: 648px;
        display: flex;
        justify-content: space-between;

        .name {
          height: 31px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;

          .downArrow {
            width: 40px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -30px;
          }
        }

        .orders {
          // height: 27px;
          // line-height: 27px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;
          margin-right: 26px;

          .rightArrow {
            // width: 20px;
            // height: 20px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      .playContent {
        margin-top: 54px;
        width: 648px;
        display: flex;
        justify-content: space-between;
      }
    }

    .joinGroupRule {
      width: 700px;
      height: 669px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 24px;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      align-items: center;

      .top {
        margin-top: 39px;
        margin-bottom: 53px;
        width: 648px;
        display: flex;
        justify-content: space-between;

        .name {
          height: 31px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;

          .downArrow {
            width: 40px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -30px;
          }
        }
      }

      .ruleContent {
        width: 648px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }

    .contentFooter {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #E43E12;
    }
  }
}
</style>
