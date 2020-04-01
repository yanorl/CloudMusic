<template>
  <div class="recommend-box">
    <scroll ref="scroll" :data="musicList && videoList && newSongList && recommendMvList && recommendDjList" class="recommend-wrap">
      <div class="recommend-content">
        <banner></banner>
        <music-list :musicList="musicList" :musicTitle="musicTitle"></music-list>
        <video-list :videoList="videoList" :videoTitle="videoTitle"></video-list>
        <new-song-list :newSongList="newSongList" :newSongTitle="newSongTitle"></new-song-list>
        <music-list :musicList="recommendMvList" :musicTitle="recommendMvTitle" :listNum="listNum"></music-list>
        <new-song-list :newSongList="recommendDjList" :newSongTitle="recommendDjTitle" :listType="listType"></new-song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import { personalized, privatecontent, newsong, recommendMv, recommendDj } from 'api'
import { ERR_OK } from 'api/config'
import Banner from 'base/banner/banner'
import MusicList from 'base/music-list/music-list'
import VideoList from 'base/video-list/video-list'
import NewSongList from 'base/new-song-list/new-song-list'
import Scroll from 'base/scroll/Scroll'

export default {
  name: 'recommend',
  data () {
    return {
      musicList: [],
      musicTitle: '推荐歌单',
      videoList: [],
      videoTitle: '',
      newSongList: [],
      newSongTitle: '最新音乐',
      recommendMvList: [],
      recommendMvTitle: '推荐MV',
      listNum: 'mv',
      recommendDjList: [],
      recommendDjTitle: '推荐电台',
      listType: 'dj'
    }
  },
  created () {
    this.$isLoading(true)
    Promise.all([this._personalized(), this._privatecontent(), this._newsong(), this._recommendMv(), this._recommendDj()]).then((result) => {
      this.$isLoading(false)
    }).catch((error) => {
      this.$isLoading(false)
      console.log(error)
    })
    // this._personalized()
    // this._privatecontent()
    // this._newsong()
    // this._recommendMv()
    // this._recommendDj()
  },
  components: {
    Banner,
    MusicList,
    VideoList,
    NewSongList,
    Scroll
  },
  methods: {
    _personalized () {
      personalized({ limit: 10 }).then((res) => {
        if (res.code === ERR_OK) {
          this.musicList = res.result
        }
      })
    },
    _privatecontent () {
      privatecontent().then((res) => {
        if (res.code === ERR_OK) {
          this.videoTitle = res.name
          this.videoList = res.result
        }
      })
    },
    _newsong () {
      newsong().then((res) => {
        if (res.code === ERR_OK) {
          this.newSongList = res.result
        }
      })
    },
    _recommendMv () {
      recommendMv().then((res) => {
        if (res.code === ERR_OK) {
          this.recommendMvList = res.result
        }
      })
    },
    _recommendDj () {
      recommendDj().then((res) => {
        if (res.code === ERR_OK) {
          this.recommendDjList = res.djRadios
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend-box
    width: 1040px
    position: fixed
    left: $aisde-width
    right: 0
    margin: auto
    bottom: $player-height
    top: 76px
    z-index: 1
    .recommend-wrap
      height: 100%
      overflow: hidden
      .recommend-content
        margin-top: 15px
        padding-bottom: 80px
</style>
