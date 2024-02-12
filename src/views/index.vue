<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import wx from 'weixin-js-sdk'

import { useRoute, useRouter } from 'vue-router'
import type { GroupOrderInfo, GroupSharingCardInfo, PlayItem } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'
import GroupPlayItem from '@/components/GroupPlayItem.vue'
import CardDescDetail from '@/components/Card/CardDescDetail.vue'

import play1 from '@/assets/play1.png'
import play2 from '@/assets/play2.png'
import play3 from '@/assets/play3.png'

import DownArrow from '@/assets/downArrow.png'
import RightArrow from '@/assets/rightArrow.png'
import { getGroupSharingData, getInitSDKAuthConfig, getSharedGroupData, getWxOpenId } from '@/services'

// import { useGroupStateStore } from '@/stores'
import { localStorage } from '@/utils/local-storage'
import { useWXStateStore } from '@/stores'
import { getLoginInfo } from '@/utils/index'

const wxAppID = 'wx65b4e85b0e8a6b93'
const wxStateStore = useWXStateStore()
const router = useRouter()
const route = useRoute()
const shopName = ref('门店名称')
const groupSharingStatus = ref('开团中')
const curGroupOrderInfo = ref<GroupOrderInfo | null>(null)

const groupShareUserName = computed(() => {
  const query = route.query
  return query.shareUser || ''
})

const isSharedGroup = computed(() => {
  const query = route.query
  if (query.groupOrderId)
    return true

  return false
})

if (route.query && route.query.groupOrderId)
  localStorage.set('groupOrderId', route.query.groupOrderId) // TODO:后续改为跳转/StudentInfo路由时带groupOrderId参数

const firstTitle = computed(() => {
  // 区分已发起拼团和未发起的情况（管理员初始配置）
  if (isSharedGroup.value)
    return '参与拼团'

  return '发起拼团'
})

const secondTitle = computed(() => {
  if (!isSharedGroup.value)
    return '快呼唤您的小伙伴一起参加吧'

  return groupShareUserName.value ? `${groupShareUserName.value} 邀请您来参与拼团啦！` : ''
})

const cardList = ref<GroupSharingCardInfo[]>([
])
// const { setGroupBuyingCardInfo } = useGroupStateStore()

// const curSharedGroupInfo = ref()

const curSelectedCard = ref<GroupSharingCardInfo | null>(null)

// const scrollRef = ref(null)
const showCardDetailSheetOption = ref({
  show: false,
})

const playList = computed<PlayItem[]>(() => {
  if (curSelectedCard.value) {
    return [{
      imgUrl: play1,
      title: '开团/参团',
      subTitle: '拼团享低价',
    }, {
      imgUrl: play2,
      title: '邀请新用户参团',
      subTitle: '分享优惠多',
    }, {
      imgUrl: play3,
      title: `${curSelectedCard.value.number}人成团`,
      subTitle: '',
    }]
  }
  return [{
    imgUrl: play1,
    title: '开团/参团',
    subTitle: '拼团享低价',
  }, {
    imgUrl: play2,
    title: '邀请新用户参团',
    subTitle: '分享优惠多',
  }, {
    imgUrl: play3,
    title: `*人成团`,
    subTitle: '',
  }]
})

function clickDetail(curCard: GroupSharingCardInfo) {
  console.log('click---')
  showCardDetailSheetOption.value = { show: true }
  curSelectedCard.value = curCard
}

let scrollIns

// onMounted(() => {
//   console.log('scrollRef.value', scrollRef.value)
//   scrollIns = new BScroll(scrollRef.value, {
//     probeType: 3,
//     scrollX: true,
//     click: true,
//   })

//   scrollIns.on('scrollStart', () => {
//     console.log('scrollStart-')
//   })
//   scrollIns.on('scroll', ({ y }) => {
//     console.log('scrolling-', y)
//   })
//   scrollIns.on('scrollEnd', (pos) => {
//     console.log(pos)
//   })
//   console.log('scroll', -(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth))
//   scrollIns.scrollTo(-(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth) / 2, 0)
// })

// 发起拼团
function handleCreateGroup() {
  router.push('/StudentInfo')
}
// 参团
function handleJoinGroup() {
  router.push('/StudentInfo')
}

function changeCard(cardIndex: number) {
  console.log('changeCard', cardIndex)
  curSelectedCard.value = cardList.value[cardIndex]
}

watchEffect(async () => {
  const query = route.query
  console.log('routeParams', query)
  if (query.groupOrderId) {
    const { data: { data } } = await getSharedGroupData(query.groupOrderId as string)
    console.log('getSharedGroupData', data)
    curGroupOrderInfo.value = data
    cardList.value = [data.groupBuyingInfo].map(item => ({
      ...item,
      width: 618,
    }))
    shopName.value = data.groupBuyingInfo.storeName
    curSelectedCard.value = data.groupBuyingInfo
  }
  else {
    const { data: { data } } = await getGroupSharingData()
    console.log('getGroupSharingData', data)
    cardList.value = data.map(item => ({
      ...item,
      width: 618,
    }))
    if (cardList.value.length) {
      shopName.value = cardList.value[0].storeName
      curSelectedCard.value = cardList.value[0]
    }

    nextTick(() => {
      if (scrollIns)
        scrollIns.refresh()
    })
  }
})

watch(curSelectedCard, (newVal) => {
  if (newVal)
    // setGroupBuyingCardInfo(newVal)
    localStorage.set('cardInfo', JSON.stringify(newVal))
})

// 微信相关
// 用户授权，回调，获取openID
function getWxAuth() {
  // 官方参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
  const code: string = route.query.code as string
  if (!code) {
    // 微信授权，授权后重定向到本页面
    const localUrl = window.location.href
    console.log(localUrl)
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxAppID}&redirect_uri=${localUrl}&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect`
  }
  else {
    // 如果已经授权，获取code参数，通过后端获取openID，返回前端，保存本地缓存
    getWxOpenId({ code })
      .then((res) => {
        console.log('getWxOpenId', res)
        const { data: { code, data } } = res
        // openID保存本地
        // wxStateStore.setOpenId('obPGK6JKCgHgBY2xWoadDxZmSGpo')
        if (code === 200) {
          // 测试openId obPGK6JKCgHgBY2xWoadDxZmSGpo
          console.log(`---授权成功，openID:${data}\n`)
          wxStateStore.setOpenId(data)
        }
        else {
          // 抛出错误
          console.log(`---获取openID失败:${JSON.stringify(res)}\n`)
        }
      }).catch((err: any) => {
        console.log(`---获取openID失败err:${JSON.stringify(err)}\n`)
      })
  }
}

// 初始化wx JSSDK
function initWxConfig() {
  // 后端获取access_token和ticket，返回签名信息，初始化wx.config
  getInitSDKAuthConfig({
    url: document.URL,
  }).then((res) => {
    console.log('getInitSDKAuthConfig', res)
    const { data: { code, data } } = res
    if (code === 200) {
      console.log(`---获取 ticket成功，返回结果:${JSON.stringify(data)}\n`)

      // 官方参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1
      // 初始化验证jssdk
      wx.config({
        debug: true, // 这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
        appId: wxAppID, // 必填，公众号的唯一标识
        timestamp: Number(data.timestamp), // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
      })

      // 通过ready接口处理成功验证
      wx.ready(() => {
        console.log(`---初始化wx.config成功\n`)
        wxStateStore.setWx(wx)
        let shareLink = `${window.location.origin}${window.location.pathname}`
        const loginInfo = getLoginInfo()
        if (loginInfo.name)
          shareLink += `?shareUser=${loginInfo.name}`

        if (route.query.groupOrderId)
          shareLink += `&groupOrderId=${route.query.groupOrderId}`

        console.log('shareLink', shareLink)

        wx.checkJsApi({
          jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res: any) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseWXPay":true},"errMsg":"checkJsApi:ok"}
            console.log(`---检查wx.checkJsApi[chooseWXPay]成功：${JSON.stringify(res)}}\n`)
          },
        })

        // 自定义分享
        wx.updateAppMessageShareData({
          imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
          link: shareLink,
          desc: '拼团活动期间，用户可在公众号网页发起拼团',
          title: '邀好友一起拼',
          success() {
            alert('设置分享成功')
          },
        })

        wx.updateTimelineShareData({
          imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
          link: `${window.location.origin}${window.location.pathname}`,
          title: '邀好友一起拼',
          success() {
            alert('设置分享成功')
          },
        })
      })

      // 通过error接口处理失败验证
      wx.error((err: any) => {
        console.log(`---wx接口失败：${JSON.stringify(err)}}\n`)
      })
    }
    else {
      // 抛出错误
      console.log(`---获取ticket失败，返回结果:${JSON.stringify(res)}\n`)
    }
  }).catch((err: any) => {
    console.log(`---获取ticket失败err，返回结果:${JSON.stringify(err)}\n`)
  })
}

// 微信相关处理逻辑
if (!wxStateStore.openId) {
  // 如果未存，则要通过授权，回调页面，获取code，然后获取openID，保存本地
  getWxAuth()
}

// 初始化wx的jssdk的config
initWxConfig()
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
      <div class="cardContainertest">
        <van-swipe class="my-swipe" indicator-color="white" @change="changeCard">
          <van-swipe-item v-for="(item, index) in cardList" :key="index">
            <GroupSharingCard
              class="sharingCard" :is-active-style="true" :card-info="item"
              @detail-click="clickDetail(item)"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="content">
      <div class="contentTitle">
        <div class="firstTitle">
          {{ firstTitle }}
        </div>
        <div class="secondTitle">
          {{ secondTitle }}
        </div>
      </div>
      <div class="joinGroup">
        <JoinGroupAvatarList
          v-if="curSelectedCard" :number="curSelectedCard.number"
          :current-number="curGroupOrderInfo?.currentNumber" :is-support-add="true"
        />
        <div v-if="!isSharedGroup" class="createGrougBtnList">
          <div class="singleBuyBtn">
            <div class="price">
              ￥{{ curSelectedCard?.price }}
            </div>
            <div class="desc">
              单独购买
            </div>
          </div>
          <div class="createGroupBtn" @click="handleCreateGroup">
            <div class="price">
              ￥{{ curSelectedCard?.groupBuyingPrice }}
            </div>
            <div class="desc">
              发起拼团
            </div>
          </div>
        </div>
        <div v-if="isSharedGroup && curGroupOrderInfo" class="btnList">
          <template v-if="curSelectedCard && (Date.now() > new Date(curSelectedCard.endTime).getTime())">
            <div class="groupTips">
              该拼团已结束！
            </div>
            <div class="joinGroupBtn" @click="() => { }">
              <div class="desc">
                我知道了
              </div>
            </div>
          </template>
          <template
            v-if="curSelectedCard && (Date.now() <= new Date(curSelectedCard.endTime).getTime()) && curGroupOrderInfo.currentNumber === curSelectedCard.number"
          >
            <div class="groupTips">
              当前团已满员！
            </div>
            <div class="joinGroupBtn" @click="() => { }">
              <div class="desc">
                前往活动主页发起新团
              </div>
            </div>
          </template>
          <template
            v-if="curSelectedCard && (Date.now() <= new Date(curSelectedCard.endTime).getTime()) && curGroupOrderInfo.currentNumber < curSelectedCard.number"
          >
            <div v-if="curGroupOrderInfo.isInOrder" class="groupTips">
              您已在团中！
            </div>
            <div v-if="curGroupOrderInfo.isInOrder" class="joinGroupBtn" @click="() => { }">
              <div class="desc">
                邀请好友
              </div>
            </div>
            <div v-if="!curGroupOrderInfo.isInOrder" class="joinGroupBtn" @click="handleJoinGroup">
              <div class="desc">
                立即参团
              </div>
              <div class="price">
                ￥{{ curSelectedCard.groupBuyingPrice }}
              </div>
            </div>
          </template>
          <!-- <div class="groupTips">
            该拼团已结束
          </div>
          <div class="joinGroupBtn" @click="handleJoinGroup">
            <div class="desc">
              立即参团
            </div>
            <div class="price">
              ￥{{ curSelectedCard?.groupBuyingPrice }}
            </div>
          </div> -->
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

    .cardContainertest {
      white-space: nowrap;
      width: 100%;
      // overflow-x: scroll;
      height: 336px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
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
      height: 385px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 37px;

      .createGrougBtnList {
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
      }

      .btnList {
        margin-top: 51px;
        // height: 88px;
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        .groupTips {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
          margin-bottom: 29px;
        }

        .joinGroupBtn {
          display: flex;
          // flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 637px;
          height: 88px;
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

:deep(.van-swipe-item) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.van-swipe__indicator) {
  width: 10px;
  height: 10px;
}

:deep(.van-swipe) {
  height: 100%;
}
</style>
