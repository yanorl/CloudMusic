<template>
  <div class="mv-box">
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
import Review from 'components/mv/review/review'
import MvInfo from 'components/mv/mv-info/mv-info'
import MvAside from 'components/mv/mv-aside/mv-aside'
import { mvDetail, mvUrl, simiMv, relatedAllvideo, mvSub } from 'api'
import { ERR_OK } from 'api/config'
import VideoClass from 'common/js/videoClass'

export default {
  name: 'mv',
  data () {
    return {
      details: {},
      mvs: [],
      relatedVideo: [],
      subed: '',
      url: '',
      title: 'MV详情'
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
      Promise.all([this._simiMv(), this._relatedAllvideo(), this._mvUrl(), this._mvDetail()]).then((result) => {
        this.$isLoading(false)
      }).catch((error) => {
        this.$isLoading(false)
        console.log(error)
      })
    },
    _mvUrl () {
      mvUrl({id: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.url = res.data.url
          // console.log(res)
        }
      })
    },
    _mvDetail () {
      mvDetail({mvid: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.details = this._normalize(res.data)
          // console.log(this.details)
          this.subed = res.subed
        }
      })
    },
    _normalize (item) {
      // console.log(item)
      return {...new VideoClass({
        url: item.brs,
        posterImg: item.cover,
        name: item.name,
        artists: item.artists,
        publishTime: item.publishTime,
        playCount: item.playCount,
        briefDesc: item.briefDesc,
        desc: item.desc,
        likeCount: item.likeCount,
        subCount: item.subCount
      })}
    },
    _simiMv () {
      simiMv({mvid: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.mvs = res.mvs
        }
      })
    },
    _relatedAllvideo () {
      relatedAllvideo({id: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.relatedVideo = res.data
        }
      })
    },
    _mvSub (t) {
      mvSub({t, mvid: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          if (t === 1) {
            this.$toast('视频收藏成功！')
          } else if (t === 2) {
            this.$toast('视频取消收藏成功')
          }
        }
      })
    },
    clickFavorite () {
      if (this.subed) {
        this._mvSub(2)
      } else {
        this._mvSub(1)
      }
    },
    clickName (parm) {
      this.$router.push(parm)
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
    height: calc(100% - 76px)
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
