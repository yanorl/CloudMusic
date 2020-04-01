<template>
  <transition name="toast-fade">
    <div class="toast" v-show="show">
      <div class="toast-wrapper">
        <div class="toast-content">
          <i class="fa" :class="icon" aria-hidden="true"></i>
          <span class="text">{{message}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      show: false,
      message: '',
      icon: 'fa-check-circle'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .toast
    position: fixed
    top: 50%
    transform: translate(-50%,-50%)
    z-index: 9999999
    left: 50%
    &.toast-fade-enter-active
      animation: toast-fadein 0.3s
      .toast-content
        animation: toast-zoom 0.3s
    .toast-wrapper
      .toast-content
        min-width: 300px
        border-radius: 10px
        padding: 0 20px
        color: #fff
        overflow: hidden
        background-color: #000
        text-align: center
        i
          font-size: $font-size-i-big
          vertical-align: sub
        .text
          font-size: $font-size-medium
          display: inline-block
          padding: 19px 15px
          line-height: 22px
          text-align: center
          border-bottom: 2px solid #1d1b1c

  @keyframes toast-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes toast-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
