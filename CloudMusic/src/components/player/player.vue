<template>
  <div class="player-box">
    <div class="player-wrap">
      <div class="mini-player" ref="miniPlay">
        <div class="mini-play-item flex">
          <div class="song-box" v-if="playlist.length > 0">
            <div class="song-img" @click="mediumScreen">
              <span class="song-medium-screen">
                <i :class="medium" aria-hidden="true"></i>
              </span>
              <img :src="currentSong.image" width="100%">
            </div>
            <div class="song-detail">
              <div class="song-des ellipsis">
                <span class="song-name">{{currentSong.name}} <span v-if="currentSong.alia">({{currentSong.alia}})</span></span> -
                <span class="singer ellipsis" v-for="(item, index) in currentSong.author" :key="index">
                  <router-link :to="'/artist/'+ item.id">{{item.name}}</router-link>
                  <span v-if="index !== currentSong.author.length -1" class="mark">/</span>
                </span>
              </div>
              <div class="song-duration">
                {{format(currentTime*1000)}} / {{format(currentSong.duration)}}
              </div>
            </div>
          </div>
        </div>
        <div class="mini-play-item width">
          <div class="control-box">
            <span class="like" v-if="playlist.length > 0">
              <i @click="clickLike(currentSong, $event)" class="fa" aria-hidden="true" :class="className(currentSong.id)"></i>
            </span>
            <div class="icon-control-box">
              <span class="icon-left" :class="disableCls">
                <i class="fa fa-step-backward" aria-hidden="true" @click="prev"></i>
              </span>
              <span class="icon-center" :class="disableCls">
                <i class="fa" :class="playIcon" aria-hidden="true" @click="togglePlaying"></i>
              </span>
              <span class="icon-right" :class="disableCls">
                <i class="fa fa-step-forward" aria-hidden="true" @click="next"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="mini-play-item flex">
          <div class="player-icon">
            <span class="play-mode" @click="changeMode">
              <i class="fa" aria-hidden="true" :class="iconMode"></i>
            </span>
            <span class="play-list" ref="playListContainer">
              <i class="fa fa-bars" aria-hidden="true" @click="clickPlayList"></i>
              <div class="play-list-container" v-show="playListFlog">
                <play-list-box :watchIndex="playListFlog"></play-list-box>
              </div>
            </span>
            <span class="play-sound">
              <i class="fa" aria-hidden="true" :class="volumClass" @click="cilckSound"></i>
              <div class="sound-box">
                <div class="sound-box-warp">
                   <sound-bar :percent="soundPercent" @soundChange="soundChange"></sound-bar>
                </div>
              </div>
            </span>
            <span class="screen">
              <i class="fa fa-arrows-alt" aria-hidden="true"></i>
            </span>
          </div>
        </div>
      </div>
      <progress-bar :percent="percent" @percentChange="onProgressBarChange" v-if="playlist.length > 0"></progress-bar>
    </div>
    <div class="alert-container" v-show="alertFlow">
      <alert :icon='alert.icon' :text="alert.text"></alert>
    </div>
    <audio ref="audio" :src="playingUrl" @timeupdate="updateTime" @play="ready" @error="error" @ended='end'></audio>
    <medium-screen ref="refMediumScreen" :MScreen="MScreen" :currentLyric="currentLyric" :currentLineNum="currentLineNum" @changeMScreen="onChangeMScreen"></medium-screen>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { durationStamp, shuffle } from 'common/js/util'
import { likeMixin } from 'common/js/mixin'
import { playMode } from 'common/js/config'
import Alert from 'base/alert/alert'
import ProgressBar from 'base/progress-bar/progress-bar'
import SoundBar from 'base/sound-bar/sound-bar'
import PlayListBox from 'base/play-list/play-list'
import MediumScreen from 'components/medium-screen/medium-screen'
import Lyric from 'common/js/lyric'

export default {
  name: 'player',
  mixins: [likeMixin],
  data () {
    return {
      playingUrl: '',
      currentTime: 0,
      songReady: false,
      soundPercent: 0.5,
      playListFlog: false,
      oldSoundPercent: '',
      MScreen: false,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'playlist',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    disableCls () {
      return this.songReady ? 'cursor' : 'disable'
    },
    playIcon () {
      return this.playing ? 'fa-pause-circle-o' : 'fa-play-circle-o'
    },
    percent () {
      var time = this.currentSong.duration / 1000
      return this.currentTime / time
    },
    volumClass () {
      if (this.soundPercent === 0) {
        return 'fa-volume-off'
      } else {
        return 'fa-volume-down'
      }
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'fa-list-ol' : this.mode === playMode.loop ? 'fa-retweet' : 'fa-random'
    },
    medium () {
      return this.MScreen ? 'fa fa-compress' : 'fa fa-expand'
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.asyncPlay()
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        if (this.playingUrl) {
          newPlaying ? audio.play() : audio.pause()
        }
      })
    },
    soundPercent (newPercent) {
      this.$refs.audio.volume = newPercent
    }
  },
  created () {
  },
  components: {
    Alert,
    ProgressBar,
    SoundBar,
    PlayListBox,
    MediumScreen
  },
  mounted () {
    document.addEventListener('click', this.handleDocumentClick)
    this.$refs.audio.volume = this.soundPercent
  },
  methods: {
    mediumScreen () {
      this.MScreen = !this.MScreen
    },
    changeMode () {
      // console.log(this.sequenceList)
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    clickPlayList () {
      this.playListFlog = !this.playListFlog
    },
    cilckSound () {
      if (this.soundPercent !== 0) {
        this.oldSoundPercent = this.soundPercent.toString().slice()
        this.soundPercent = 0
      } else {
        this.soundPercent = Number(this.oldSoundPercent)
      }
    },
    _getPlayUrls () {
      this.currentSong._playUrl().then((res) => {
        this.playingUrl = res
      })
    },
    _getLyrics () {
      this.currentSong._getLyric().then((res) => {
        if (this.currentSong.lyric !== res) {
          return
        }
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      // console.log(lineNum + '-' + txt)
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        this.$refs.refMediumScreen.lyricScrollEle()
      } else {
        this.$refs.refMediumScreen.lricScrollTo()
      }
      this.playingLyric = txt
    },
    async asyncPlay () {
      // console.log(0)
      await this._getPlayUrls()
      await this._getLyrics()
      await this.setTimeoutPlay()
    },
    setTimeoutPlay () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log(2)
        if (this.playingUrl) {
          // console.log(1)
          // console.log(this.playingUrl)
          this.$refs.audio.play()
        } else {
          this.next()
        }
      }, 1000)
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (date) {
      return durationStamp(date)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ]),
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = false
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.setPlayingState(!this.playing)
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.mode === playMode.loop) {
        this.loop()
        return
      } else {
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) { // 播放列表的最后一首
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.mode === playMode.loop) {
        this.loop()
        return
      } else {
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
      }
      this.songReady = false
    },
    loop () {
      this.$refs.audio.currentTime = 0
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
      this.$refs.audio.play()
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration / 1000 * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    soundChange (e) {
      this.soundPercent = e
      this.$refs.audio.volume = this.soundPercent
    },
    handleDocumentClick (e) {
      if (this.playListFlog && !this.$refs.miniPlay.contains(e.target)) {
        this.playListFlog = false
      }
    },
    onChangeMScreen () {
      this.MScreen = false
    }
  },
  destroyed () {
    document.removeEventListener('click', this.handleDocumentClick)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .player-box
    .player-wrap
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      background: $index-background
      border-top: 2px solid #2b2b2b
      width: 100%
      .mini-player
        display: flex
        align-items: center
        justify-content: space-between
        height: $player-height
        padding: 10px
        box-sizing: border-box
        .mini-play-item
          &.flex
            flex: 1
          &.width
            width: 200px
          .song-box
            display: flex
            align-items: center
            .song-img
              width: 42px
              height: 42px
              border-radius: 5px
              overflow: hidden
              position: relative
              cursor: pointer
              &:hover:before,&:hover .song-medium-screen
                opacity: 1
              &:before
                width: 100%
                height: 100%
                background: rgba(0,0,0,0.4)
                position: absolute
                content: ''
                opacity: 0
              .song-medium-screen
                position: absolute
                left: 50%
                top: 50%
                transform: translate(-50%, -50%)
                color: #fff
                font-size: $font-size-large
                opacity: 0
            .song-detail
              margin-left : 10px
              .song-des
                max-width: 500px;
                .singer
                  display: inline-block
                  max-width: 230px
                  vertical-align: middle
                  .mark
                    margin: 0 5px
                    display: inline-block
                .song-duration
                  margin-top: 5px
                .singer,.song-duration
                  font-size: $font-size-small
                  color: $color-i
           .control-box
             display: flex
             align-items: center
             .icon-control-box
               margin: 0 35px
               display: flex
               align-items: center
               font-size: $font-size-medium
               color: $color-main
               span
                 i
                   opacity: 0.8
                   &:hover
                     opacity: 1
                 &.disable
                   opacity: .5
                 &.icon-center
                   margin: 0 25px
                   font-size: $font-size-i-big
            .player-icon
              text-align: right
              span
                display: inline-block
                margin-left: 20px
                position: relative
                width: 15px
                text-align: center
                font-size: $font-size-medium
              span.play-sound
                &:hover
                  .sound-box
                    visibility: visible
                .sound-box
                  width: 30px
                  height: 100px
                  padding: 10px 0
                  box-sizing: border-box
                  border-radius: 5px
                  background: #292929
                  position: absolute
                  left: -8px
                  bottom: 25px
                  z-index: 999
                  visibility: hidden
                  .sound-box-warp
                    position: relative
                    height: 100%
                    &:after
                      position: absolute
                      content: ''
                      width: 0
                      height: 0
                      border-right: 10px solid transparent
                      border-left: 10px solid transparent
                      border-top: 10px solid #292929
                      bottom: -16px
                      left: 5px
  .play-list-container
    width: 420px
    position: fixed
    right: 0
    top: 76px
    bottom: $player-height
    background: #292929
    z-index: 99
</style>
