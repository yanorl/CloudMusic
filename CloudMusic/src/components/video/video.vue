<template>
  <div class="video-view-box">
    <div class="mv-view-box">
      <scroll class="mv-wrap" ref="scroll" :data="[...details]">
        <div class="mv-content">
          <div class="mv-middel left">
            <mv-info :details="details" :title="title" :subed="subed" :url="url" @clickName="clickName" @clickFavorite="clickFavorite"></mv-info>
            <div class="mv-review-box" ref="Review">
              <review @scrollTop="scrollToElement"></review>
            </div>
          </div>
          <div class="mv-aside right">
            <mv-aside :mvs="mvs" :relatedVideo="relatedVideo" @clickMvs="clickMvs" @clickName="clickName"></mv-aside>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import Review from 'components/video/review/review'
import MvInfo from 'components/mv/mv-info/mv-info'
import MvAside from 'components/mv/mv-aside/mv-aside'
import { videoDetail, videoUrl, relatedAllvideo, videoSub, mvSublist } from 'api'
import { ERR_OK } from 'api/config'
import VideoClass from 'common/js/videoClass'
import { timeStamp } from 'common/js/util'

export default {
  name: 'video-view',
  data () {
    return {
      details: {},
      mvs: [],
      relatedVideo: [],
      subed: '',
      url: '',
      title: '视频详情'
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._all()
    }
  },
  computed: {
  },
  created () {
    this._all()
  },
  components: {
    Scroll,
    Review,
    MvInfo,
    MvAside
  },
  methods: {
    _all () {
      this.$isLoading(true)
      Promise.all([this._mvSublist(), this._videoUrl(), this._videoDetail(), this._relatedAllvideo()]).then((result) => {
        this.$isLoading(false)
      }).catch((error) => {
        this.$isLoading(false)
        console.log(error)
      })
    },
    _mvSublist () {
      mvSublist({timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.subed = res.data.some(({vid}) => vid === this.$route.params.id)
        }
      })
    },
    _videoUrl () {
      videoUrl({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.url = res.urls[0].url
        }
      })
    },
    _videoDetail () {
      videoDetail({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.details = this._normalize(res.data)
          // this.subed = res.subed
        }
      })
    },
    _normalize (item) {
      // console.log(item)
      return {...new VideoClass({
        url: item.brs,
        posterImg: item.coverUrl,
        name: item.title,
        artists: [{'name': item.creator.nickname, 'id': item.creator.userId}],
        publishTime: timeStamp(item.publishTime),
        playCount: item.playTime,
        briefDesc: item.briefDesc,
        desc: item.desc,
        likeCount: item.praisedCount,
        subCount: item.subscribeCount
      })}
    },
    _relatedAllvideo () {
      relatedAllvideo({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.relatedVideo = res.data
        }
      })
    },
    _videoSub (t) {
      videoSub({t, id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          if (t === 1) {
            this.$toast('视频收藏成功！')
          } else if (t === 2) {
            this.$toast('视频取消收藏成功!')
          }
        }
      })
    },
    clickFavorite () {
      if (this.subed) {
        this._videoSub(2)
      } else {
        this._videoSub(1)
      }
    },
    clickName (id) {
      this.$router.push({name: 'artist', params: {id: id.toString()}})
    },
    clickLike () {
    },
    clickVideo (id, type) {
      if (type === 0) {
        this.clickMvs(id)
      } else {
        this.$router.push({name: 'video', params: {id: id.toString()}})
      }
    },
    clickMvs (mvid) {
      this.$router.push({name: 'mv', params: {mvid: mvid.toString()}})
    },
    scrollToElement () {
      this.$refs.scroll.scrollToElement(this.$refs.Review, 0)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mv-view-box
    width: 100%
    height: 100%
    background: #1b1a1a
    position: fixed
    top: 76px
    .mv-wrap
      height: 100%
      overflow: hidden
      .mv-content
        width: 980px
        margin: 0 auto
        overflow: hidden
        padding-bottom: 20px
        .title
          margin: 20px 0
          font-size: $font-size-medium
          i
            margin-right: 10px
        .mv-middel
          width: 640px
        .mv-aside
          width: 300px
</style>
