<template>
  <div class="artist-info-box" v-if="songlistViewArray">
    <div class="artist-info">
      <div class="artist-img">
        <img :src="songlistViewArray.img1v1Url" width="100%">
      </div>
      <div class="artist-details">
        <div class="title">
          <h4>{{songlistViewArray.name}}</h4>
        </div>
        <div class="artist-creator">
          <span class="create-time" v-for="(item, index) in songlistViewArray.alias" :key="index">{{item}}</span>
        </div>
        <div class="artist-button clearfix">
          <ul>
            <li @click="clickFavorite" :class="{'gray' : songlistViewArray.followed}">
              <i class="fa fa-calendar-plus-o" :class="subscribed" aria-hidden="true"></i>
              <span>
                <template v-if="songlistViewArray.followed">已</template>收藏</span>
            </li>
            <li @click="itemClick(songlistViewArray.accountId)">
              <i class="fa fa-user-o" aria-hidden="true"></i>
              <span>个人主页</span>
            </li>
          </ul>
        </div>
        <p>
          <span>单曲数:
            <span class="num">{{songlistViewArray.musicSize}}</span>
          </span>
          <span>专辑数:
            <span class="num">{{songlistViewArray.albumSize}}</span>
          </span>
          <span>MV数:
            <span class="num">{{songlistViewArray.mvSize}}</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'artist-info',
  props: {
    songlistViewArray: {
      type: Object,
      default: () => {}
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
      return this.songlistViewArray.followed ? 'fa-calendar-check-o' : 'fa-calendar-plus-o'
    }
  },
  components: {
  },
  methods: {
    itemClick (id) {
      this.$router.push({name: 'user', params: {userId: id}})
    },
    clickFavorite () {
      if (this.songlistViewArray.followed) {
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
 .artist-info
   margin-bottom: 30px
   padding-top: 15px
   display: flex
   font-size: $font-size-small
   margin: 0 34px
   .artist-img
     width: 195px
     height: 195px
     border-radius: 10px
     overflow: hidden
     margin-right: 30px
   .artist-details
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
     .artist-creator
       margin-bottom :18px
       display: flex
       align-items: center
       .avatar-img
         width: 25px
         height: 25px
         border-radius: 50%
         overflow: hidden
         display: inline-block
       .creator-name
         margin: 0 5px
         color: #72ade7
       .create-time
         color: #7b7b7b
     .artist-button
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
     p
       margin-bottom: 5px
       position: relative
       .tags
         color: #72ade7
       .num
         color: #7b7b7b
         margin-right: 5px
       pre
         margin-top: 0
         white-space: pre-line
         padding-right: 20px
         i
           position: absolute
           top: 0
           right: 0
           font-size: 18px
           cursor: pointer
</style>
