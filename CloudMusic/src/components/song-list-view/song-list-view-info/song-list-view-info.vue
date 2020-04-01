<template>
  <div class="song-list-view-info-box" v-if="songlistViewArray">
    <div class="song-list-view-info">
      <div class="song-list-view-img">
        <img v-lazy="songlistViewArray.coverImgUrl" width="100%">
      </div>
      <div class="song-list-view-details">
        <div class="title">
          <span>歌单</span>
          <h4>{{songlistViewArray.name}}</h4>
          <b v-if="MyList" @click="plusInfo(songlistViewArray.id)">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </b>
        </div>
        <div class="song-list-view-creator">
          <div class="avatar-img cursor" @click="itemClick(creator.userId)">
            <img v-lazy="creator.avatarUrl" width="100%">
          </div>
          <span class="creator-name cursor" @click="itemClick(creator.userId)">{{creator.nickname}}</span>
          <span class="create-time">{{normalDate(songlistViewArray.createTime)}} 创建</span>
        </div>
        <div class="song-list-view-button clearfix">
          <ul>
            <li @click="clickPlay" :class="songlistViewArray.trackCount ? 'active' : 'disabled'">
              <i class="fa fa-play-circle-o" aria-hidden="true"></i>
              <span>全部播放</span>
              <b>+</b>
            </li>
            <li :class="{'disabled': MyList, 'gray' : songlistViewArray.subscribed}" @click="clickFavorite">
              <i class="fa fa-calendar-plus-o" :class="subscribed" aria-hidden="true"></i>
              <span>
                <template v-if="songlistViewArray.subscribed">已</template>收藏 ( {{songlistViewArray.subscribedCount}} )</span>
            </li>
            <li v-if="songlistViewArray.privacy === 10">
              <i class="fa fa-lock" aria-hidden="true"></i>
              <span>
                隐私
              </span>
            </li>
          </ul>
        </div>
        <template v-if="songlistViewArray.tags">
          <p>标签：
            <span class="tags"  v-if="songlistViewArray.tags.length > 0">{{forArray(songlistViewArray.tags)}}</span>
            <span class="tags"  v-if="!songlistViewArray.tags.length" @click="plusTag">添加标签</span>
          </p>
        </template>
        <p>
          <span>歌曲数:
            <span class="num">{{songlistViewArray.trackCount}}</span>
          </span>
          <span>播放数:
            <span class="num">{{songlistViewArray.playCount | toNumber}}</span>
          </span>
        </p>
        <p >
          <pre>简介：<span v-if="songlistViewArray.description"><span v-if="elliFlog">{{songlistViewArray.description | subStr}}</span><span v-if="!elliFlog">{{songlistViewArray.description}}</span>
              <i v-if="songlistViewArray.description.length > 20" @click="changeElli" class="fa" :class="{'fa-caret-down': elliFlog , 'fa-caret-up' : !elliFlog}" aria-hidden="true"></i>
            </span> <span class="tags" v-if="!songlistViewArray.description" @click="plusInfo(songlistViewArray.id)">添加简介</span>
            </pre>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { timeStamp } from 'common/js/util'
import { mapGetters } from 'vuex'

export default {
  name: 'song-list-view-info',
  props: {
    songlistViewArray: {
      type: Object,
      default: () => {}
    },
    creator: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      elliFlog: true
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this.elliFlog = true
    }
  },
  computed: {
    subscribed () {
      return this.songlistViewArray.subscribed ? 'fa-calendar-check-o' : 'fa-calendar-plus-o'
    },
    ...mapGetters([
      'user'
    ]),
    MyList () {
      if (this.user.length > 0) {
        return this.creator.userId === this.user[0].profile.userId
      }
    }
  },
  components: {
  },
  methods: {
    forArray (array) {
      let other = array.map((d, i) => {
        return d
      })
      return other.join(' / ')
    },
    normalDate (date) {
      if (date) {
        return timeStamp(date)
      }
    },
    changeElli () {
      this.elliFlog = !this.elliFlog
    },
    itemClick (id) {
      this.$router.push({name: 'user', params: {userId: id}})
    },
    clickPlay () {
      if (this.songlistViewArray.trackCount) {
        this.$emit('clickPlay')
      }
    },
    clickFavorite () {
      if (this.creator.userId !== this.user[0].profile.userId) {
        if (this.songlistViewArray.subscribed) {
          this.$emit('cancelSubscribed')
        } else {
          this.$emit('confimSubscribed')
        }
      }
    },
    plusTag () {
      this.$emit('plusTag')
    },
    plusInfo (id) {
      this.$router.push('/editPlaylistInfo/' + id)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 .song-list-view-info
   margin-bottom: 30px
   padding-top: 15px
   display: flex
   font-size: $font-size-small
   margin: 0 34px
   .song-list-view-img
     width: 195px
     height: 195px
     border-radius: 10px
     overflow: hidden
     margin-right: 30px
   .song-list-view-details
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
     .song-list-view-creator
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
         &:hover
           color: #89b7e4
       .create-time
         color: #7b7b7b
     .song-list-view-button
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
