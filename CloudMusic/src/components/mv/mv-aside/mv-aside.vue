<template>
  <div class="mv-aside-box">
    <div class="aside-item" v-if="mvs.length > 0">
      <div class="title">
        <span>相似MV</span>
      </div>
      <ul class="clearfix">
        <li v-for="(item, index) in mvs" :key="index">
          <div class="img-box left" @click="clickMvs(item.id)">
            <img :src="item.cover" width="100%">
            <span class="number">
              <i class="fa fa-caret-right" aria-hidden="true"></i>
              <p>{{item.playCount | toNumber}}</p>
            </span>
            <span class="duration">
              {{formate(item.duration)}}
            </span>
          </div>
          <div class="des left">
            <p class="mv-name" @click="clickMvs(item.id)">{{item.name}}</p>
            <p class="artist-name ellipsis" @click="clickName(item.artistId)">{{item.artistName}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="aside-item relatedVideo" v-if="relatedVideo.length > 0">
      <div class="title">
        <span>相关推荐</span>
      </div>
      <ul class="clearfix">
        <li v-for="(item, index) in relatedVideo" :key="index">
          <div class="img-box left" @click="clickVideo(item.vid, item.type)">
            <img :src="item.coverUrl" width="100%">
            <span class="number">
              <i class="fa fa-caret-right" aria-hidden="true"></i>
              <p>{{item.playTime | toNumber}}</p>
            </span>
            <span class="duration">
              {{formate(item.durationms)}}
            </span>
          </div>
          <div class="des left">
            <p class="mv-name ellipsis" @click="clickVideo(item.vid, item.type)">
              <span class="tags" v-if="item.type == 0">mv</span>
              {{item.title}}</p>
            <p class="artist-name ellipsis" @click="clickName(item.creator[0].userId)"> <span v-if="item.type !== 0">by</span> {{item.creator[0].userName}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { durationStamp } from 'common/js/util'

export default {
  name: 'mv-aside',
  data () {
    return {
    }
  },
  props: {
    mvs: {
      types: Array,
      default: () => []
    },
    relatedVideo: {
      types: Array,
      default: () => []
    }
  },
  computed: {
  },
  methods: {
    formate (duration) {
      return durationStamp(duration)
    },
    clickMvs (id) {
      this.$emit('clickMvs', id)
    },
    clickName (id) {
      this.$emit('clickName', id)
    },
    clickVideo (id, type) {
      if (type === 0) {
        this.clickMvs(id)
      } else {
        this.$router.push({name: 'video', params: {id: id.toString()}})
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mv-aside-box
    .aside-item
      margin-bottom: 30px
      .title
        margin: 20px 0
        font-size: $font-size-medium
        i
          margin-right: 10px
      &.relatedVideo
        li
          font-size: $font-size-small
          .img-box
            width: 110px
          .des
            width: 170px
            span.tags
              border: 1px solid $color-main
              border-radius: 2px
              color: $color-main
              padding: 0 5px
      li
        margin-bottom: 20px
        overflow: hidden
        display: flex
        align-items: center
        .img-box
          width: 150px
          border-radius: 5px
          overflow: hidden
          cursor: pointer
          position: relative
          color: #fff
          margin-right: 10px
          .duration
            position: absolute
            right: 10px
            bottom: 10px
          .number
            position: absolute
            right: 10px
            top: 5px
            display: flex
            align-items: center
            i
              margin-right: 5px
              color: #eee
              font-size: $font-size-medium-x
        p
          cursor: pointer
          &.mv-name
            margin-bottom: 10px
          &.artist-name
            font-size: $font-size-small
            color: $color-gray
          &:hover
            color: #fff
 </style>
