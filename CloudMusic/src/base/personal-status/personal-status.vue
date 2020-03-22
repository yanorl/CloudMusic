<template>
  <transition name="personal-status-fade">
    <div class="personal-status-box" v-show="showFlag" @click.stop>
      <div class="personal-status-wrapper">
        <div class="personal-status-content">
          <span class="icon-close" @click="hide"><i class="fa fa-times" aria-hidden="true"></i></span>
          <div class="personal-top">
            <span class="icon-phone">
              <i class="fa fa-mobile" aria-hidden="true"></i>
            </span>
          </div>
          <div class="login-type" v-if="typeLogin">
            <login @registeredPage="registeredPage" @hide="hide" :agreeCheck="agreeCheck"></login>
          </div>
          <div class="reg-typ" v-if="!typeLogin">
            <registered @registeredPage="registeredPage"></registered>
          </div>
          <div class="personal-icon">
            <ul>
              <li>
                <span><i class="fa fa-qq" aria-hidden="true"></i></span>
              </li>
              <li>
                <span><i class="fa fa-weixin" aria-hidden="true"></i></span>
              </li>
              <li>
                <span><i class="fa fa-weibo" aria-hidden="true"></i></span>
              </li>
              <li>
                <span><i class="fa fa-wanyi" aria-hidden="true">易</i></span>
              </li>
            </ul>
          </div>
          <div class="agree-box" v-if="typeLogin">
            <div class="agree-wrap">
              <label>
                <input type="checkbox" class="checkbox" v-model="agreeCheck" value="true">
                <span>同意</span>
              </label>
              <span class="books">《服务条款》《隐私政策》《儿童隐私政策》</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import login from 'components/login/login'
import Registered from 'components/registered/registered'
export default {
  name: 'personal-status',
  data () {
    return {
      showFlag: false,
      inputFirst: 'tel',
      inputSecond: 'password',
      typeLogin: true,
      agreeCheck: []
    }
  },
  created () {
  },
  components: {
    login,
    Registered
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    registeredPage () {
      // this.placeholder.second = '设置登录密码, 不少于6位'
      this.typeLogin = !this.typeLogin
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .personal-status-box
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 998
    &.personal-fade-enter-active
      animation: personal-fadein 0.3s
    .personal-status-wrapper
      width: 375px
      min-height: 530px
      background: #fff
      animation: personal-zoom 0.3s
      .personal-status-content
        padding: 70px 45px 0 45px
        position: relative
        overflow: hidden
        span.icon-close
          position: absolute
          top: 12px
          left: 12px
          cursor: pointer
        .personal-top
          background: url('background.jpg') no-repeat center
          width: 100%
          height: 65px
          margin: 0 auto
          position: relative
          .icon-phone
            position: absolute
            font-size: 85px
            color: #f78386
            top: -15px
            width: 100%
            text-align: center
        .personal-icon
          margin-top: 20px
          ul
            display: flex
            justify-content: space-around
            li
              width: 40px
              height: 40px
              text-align: center
              line-height: 45px
              border: 1px solid $color-background
              border-radius: 50%
              font-size: $font-size-large
              cursor: pointer
              &:hover
                background: rgba(0,0,0,0.05)
        .agree-box
          margin: 40px 0
          font-size: $font-size-small
          .books
            color: #678db1
  @keyframes personal-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes personal-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
