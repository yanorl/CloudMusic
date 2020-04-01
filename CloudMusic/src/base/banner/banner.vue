<template>
  <div class="banner-box">
    <div class="banner-wrap">
      <swiper :options="swiperOption" v-if="BannerList.length > 0">
        <swiper-slide v-for="(item, index) of BannerList" :key="index">
          <img v-lazy="item.pic">
          <div class="title" :class="item.titleColor" v-if="item.typeTitle">
            {{item.typeTitle}}
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { TypeBanner } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'banner',
  data () {
    return {
      BannerList: [],
      swiperOption: {
        effect: 'coverflow',
        slidesPerView: 2,
        centeredSlides: true,
        initialSlide: 1,
        loop: true,
        loopedSlides: 0,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        coverflowEffect: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: true
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  created () {
    this._TypeBanner()
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
  },
  methods: {
    _TypeBanner () {
      TypeBanner().then((res) => {
        if (res.code === ERR_OK) {
          this.BannerList = res.banners
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .banner-wrap
    width: 100%
    margin: 15px 0 25px
    --swiper-theme-color: $color-main
    --swiper-pagination-color: $color-main /* 两种都可以 */
    .swiper-slide
      background-position: center
      background-size: cover
      width: 520px
      img
        width: 520px
        height: 202px
        border-radius: 15px
      .title
        position: absolute
        color: #fff
        right: 0
        padding: 5px 10px
        border-radius: 10px 0 10px 0
        bottom: 3px
        &.red
          background: red
        &.blue
          background: blue
    .swiper-pagination
      bottom: 10px
</style>
