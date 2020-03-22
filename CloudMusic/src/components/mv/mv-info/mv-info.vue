<template>
  <div class="mv-info-box">
    <div class="title" @click="clickTitle">
      <i class="fa fa-angle-left" aria-hidden="true"></i>
      <span>{{title}}</span>
    </div>
    <div class="video-box">
      <video class="video-wrap" :src="url" controls="controls" width="100%" height="100%" :poster="details.posterImg">
        your browser does not support the video tag
      </video>
    </div>
    <div class="mv-info">
      <div class="mv-info-title">
        <p class="mv-name ellipsis">{{details.name}}</p>
        <template v-for="(item, index) in details.artists">
          <span class="artist-Name gray" @click="clickName(item.id)" :key='index'>{{item.name}}</span>
          <span v-if="details.artists.length - 1 !== index" :key='item.id'> / </span>
        </template>
      </div>
      <div class="mv-tag">
        <p>发布：<span>{{details.publishTime}}</span></p>
        <p>播放：<span>{{details.playCount | toNumber}}</span>次</p>
      </div>
      <div class="mv-des">
        <h4>{{details.briefDesc}}</h4>
        <p>{{details.desc}}</p>
      </div>
    </div>
    <div class="mv-buttom">
      <ul class="clearfix">
        <li @click="clickLike">
          <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>
          <span>{{details.likeCount}}</span>
        </li>
        <li :class="{'gray' : subed}" @click="clickFavorite">
          <i class="fa fa-calendar-plus-o" :class="subscribed" aria-hidden="true"></i>
          <span>
            <template v-if="subed">已</template>收藏 ( {{details.subCount}} )</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mv-info',
  data () {
    return {
    }
  },
  props: {
    details: {
      types: Object,
      default: () => {}
    },
    subed: {
      types: String,
      default: ''
    },
    url: {
      types: String,
      default: ''
    },
    title: {
      types: String,
      default: ''
    }
  },
  computed: {
    subscribed () {
      return this.subed ? 'fa-calendar-check-o' : 'fa-calendar-plus-o'
    }
  },
  methods: {
    clickTitle () {
      let type = this.$route.name
      if (type === 'mv') {
        console.log('mv')
      } else if (type === 'video') {
        console.log('video')
      }
    },
    clickLike () {

    },
    clickName (id) {
      this.$emit('clickName', id)
    },
    clickFavorite () {
      this.$emit('clickFavorite')
    }

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mv-info-box
    .title
      margin: 20px 0
      font-size: $font-size-medium
      cursor: pointer
      &:hover
        color: #fff
      i
        margin-right: 10px
    .video-box
      border-radius: 10px
      overflow: hidden
      .video-wrap
        &:focus
          outline: none
    .mv-info
      .mv-info-title
        margin: 20px 0 0 0
        .mv-name
          font-size: $font-size-large
        .artist-Name
          color: $color-gray
          cursor: pointer
          &:hover
            color: #fff
      .mv-tag
        margin: 10px 0
        color: #4e4e4e
        font-size: $font-size-small
        p
          display: inline-block
          margin-right: 25px
      .mv-des
        line-height: 2
        p
          text-indent: 2em
    .mv-buttom
      margin: 30px 0
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
 </style>
