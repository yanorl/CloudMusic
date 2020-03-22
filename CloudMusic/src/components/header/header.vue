<template>
  <div class="header-box">
    <div class="header-aside">
      <span class="previous cursor" @click="previous">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
      </span>
      <span class="next cursor" @click="next">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
      </span>
    </div>
    <div class="header-wrap">
      <div class="nav-box">
        <ul v-if="topLink">
          <li v-for="(item, index) in navList" :key="index">
            <router-link :to="item.link">{{item.text}}</router-link>
          </li>
        </ul>
      </div>
      <search></search>
    </div>
  </div>
</template>

<script>
import Search from 'components/search/search'
export default {
  data () {
    return {
      navList: [
        {
          text: '个性推荐',
          link: '/recommend'
        },
        {
          text: '歌单',
          link: '/test'
        },
        {
          text: '主播电台',
          link: '/test'
        },
        {
          text: '排行榜',
          link: '/test'
        },
        {
          text: '歌手',
          link: '/test'
        },
        {
          text: '歌手',
          link: '/最新音乐'
        }
      ]
    }
  },
  computed: {
    topLink () {
      return this.navList.some((d, i) => {
        return d.link === this.$route.path
      })
    }
  },
  components: {
    Search
  },
  methods: {
    next () {
      this.$router.go(1)
    },
    previous () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .header-box
    position: relative
    z-index: 2
    .header-aside
      float: left
      width: $aisde-width
      background: $header-asid-background
      text-align: right
      padding: 20px 0 16px
      span
        display:inline-block
        margin: 0 14px
        i
          font-size: $font-size-i-big
          line-height: 40px
    .header-wrap
      padding: 20px 0 16px
      overflow: hidden
      background: #202020
      .nav-box
        line-height: 40px
        height: 40px
        float: left
        li
          float: left
          a
            display: block
            padding: 0 20px
            text-align: center
          .router-link-active
              color: $color
              font-weight: bold
</style>
