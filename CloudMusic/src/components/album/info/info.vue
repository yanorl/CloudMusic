<template>
  <div class="info-box" v-if="infoData">
    <div class="view-info">
      <div class="view-img">
        <img v-lazy="infoData.picUrl" width="100%">
      </div>
      <div class="view-details">
        <div class="title">
          <span>专辑</span>
          <h4>{{infoData.name}}</h4>
        </div>
        <div class="view-button clearfix">
          <ul>
            <li @click="clickPlay" :class="listLength? 'active' : 'disabled'">
              <i class="fa fa-play-circle-o" aria-hidden="true"></i>
              <span>全部播放</span>
              <b>+</b>
            </li>
            <li :class="{'gray' : albumDynamic.isSub}" @click="clickFavorite">
              <i class="fa fa-calendar-plus-o" :class="subscribed" aria-hidden="true"></i>
              <span>
                <template v-if="albumDynamic.isSub">已</template>收藏 ( {{albumDynamic.subCount}} )</span>
            </li>
          </ul>
        </div>
        <div class="view-creator">
          <p>歌手:
            <span v-for="(item, index) in infoData.artists" :key="index" class="creator-name">
              <b @click="itemClick(item.id)" class="cursor">{{item.name}}</b>
              <i v-if="infoData.artists.length - 1 > index"> / </i>
            </span>
          </p>
          <p class="create-time">时间: <span class="gray">{{normalDate(infoData.publishTime)}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeStamp } from 'common/js/util'

export default {
  name: 'info',
  props: {
    infoData: {
      type: Object,
      default: () => {}
    },
    albumDynamic: {
      type: Object,
      default: () => {}
    },
    listLength: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    subscribed () {
      return this.albumDynamic.isSub ? 'fa-calendar-check-o' : 'fa-calendar-plus-o'
    }
  },
  components: {
  },
  methods: {
    normalDate (date) {
      if (date) {
        return timeStamp(date)
      }
    },
    itemClick (id) {
      this.$router.push({name: 'artist', params: {id: id}})
    },
    clickPlay () {
      if (this.listLength) {
        this.$emit('clickPlay')
      }
    },
    clickFavorite () {
      if (this.albumDynamic.isSub) {
        this.$emit('cancelSubscribed')
      } else {
        this.$emit('confimSubscribed')
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 .view-info
   margin-bottom: 30px
   padding-top: 15px
   display: flex
   font-size: $font-size-small
   margin: 0 34px
   .view-img
     width: 195px
     height: 195px
     border-radius: 10px
     overflow: hidden
     margin-right: 30px
   .view-details
     flex: 1
     .title
       margin-bottom: 15px
       span
         color: $color-main
         padding: 3px 5px
         border: 1px solid $color-main
         border-radius: 5px
         margin-right: 10px
         vertical-align: super
       h4
         font-size: $font-size-large-x
         display: inline-block
         margin-right: 10px
       i
         font-size: $font-size-large-x
         color: $color-gray
     .view-button
       margin-bottom: 15px
       ul
         li
           padding: 5px 15px
           font-size: $font-size
           float: left
           border-radius: 15px
           border: 1px solid
           margin-right: 10px
           &.disabled
             color: #292929
           &.gray
             border: 1px solid #666
             color: #666
           i
             font-size: $font-size-large
             vertical-align: middle
           b
             font-size: $font-size-medium
           &.active
             background: #d8100d
             border-color: #8a2d2c
             color: #fff
             span
               min-width: 70px
               display: inline-block
      .view-creator
        p
          margin-bottom: 10px
          b
            color: #72ade7
            &:hover
              color: #89b7e4
</style>
