<template>
  <transition name="slide">
    <div class="medium-screen-box" v-show="MScreen">
      <scroll class="medium-wrap" ref="scroll" :data="Object.entries(commentsData)">
        <div class="medium-content">
          <div class="top">
            <div class="phonograph left">
              <div class="cd-wrapper" :class="playClass">
                <div class="arm"></div>
                <div class="cd">
                  <img width="100%" height="100%" :src="currentSong.image">
                </div>
              </div>
              <div class="icon-box">
                <span class="like">
                  <i @click="clickLike(currentSong, $event)" class="fa" aria-hidden="true" :class="className(currentSong.id)"></i>
                </span>
                <span class="like" @click="addPlaylist">
                  <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div class="lyrics-box left">
              <div class="title-box">
                <span class="title">{{currentSong.name}}</span>
                <span class="sound-quality">标准音质</span>
              </div>
              <div class="des">
                <p>专辑：
                  <span v-for="(item, index) in currentSong.album" :key="index">
                    <b @click="routerLink('/album/' + item.id)">{{item.name}}</b>
                  </span>
                </p>
                <p>歌手：
                  <span v-for="(item, index) in currentSong.author" :key="index">
                    <b @click="routerLink('/artist/' + item.id)">{{item.name}}</b>
                  </span>
                </p>
                <p>来源：
                  <span v-if="currentSong.source">
                    <b @click="routerLink(currentSong.source.router)">{{currentSong.source.name}}</b>
                  </span>
                </p>
              </div>
              <div class="lyric-wrapper" @mouseenter="closeMediumScroll" @mouseleave="openMediumScroll">
                <scroll class="lyricScroll" ref="lyricList" :data="currentLyric && currentLyric.lines">
                  <div class="lyric-content">
                    <div v-if="currentLyric">
                      <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
                    </div>
                  </div>
                </scroll>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="review-wrap left">
              <div class="title">
                听友评论 <span>(已有{{total}}条评论)</span>
              </div>
              <div class="review-trigger" @click="changeReviewFlase">
                <div class="left">
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                  <span>发表评论</span>
                </div>
                <div class="right icon-box">
                  <span cl><i aria-hidden="true" class="fa fa-smile-o"></i></span>
                  <span>@</span>
                </div>
              </div>
              <div class="review-form" v-show="reviewFlow">
                <div class="review-form-content">
                  <div class="review-form-title">
                    <span class="close" @click="changeReviewTrue">X</span>
                    <div class="title">{{currentSong.name}}</div>
                  </div>
                  <review-form ref="reviewForm" :rp="rp" :commentId="commentId" @tips="tips" @commentControl="_commentControl"></review-form>
                </div>
              </div>
              <div class="review-list-wrap">
                <div class="review-list-content">
                  <template v-if="hotComments.length > 0 || comments.length > 0">
                    <review-list :commentsData="hotComments" reviewTitle="精彩评论" @rpName="rpName" type="0" @updateReview="_commentReview" :resourcesId="currentSong.id.toString()"></review-list>
                    <review-list :commentsData="comments" :reviewTitle="formatReviewTitle" @rpName="rpName" type="0" @updateReview="_commentReview" :resourcesId="currentSong.id.toString()"></review-list>
                    <div class="pagination-box">
                      <pagination :totalCount="commentsData.total" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
                    </div>
                  </template>
                  <template v-else>
                    <p class="none-text">{{noneText}}</p>
                  </template>
                </div>
              </div>
            </div>
            <div class="other right">
              <div class="other-item simiPlaylist" v-if="simiPlaylists.length > 0">
                <div class="title">包含这首歌的歌单</div>
                <ul>
                  <li v-for="(item, index) in simiPlaylists" :key="index" class="clearfix" @click="routerLink('/songListView/' + item.id)">
                    <span class="img-box left">
                      <img :src="item.coverImgUrl" width="100%">
                    </span>
                    <div class="content left">
                      <div class="name ellipsis">{{item.name}}</div>
                      <span class="author">
                        <i class="fa fa-caret-right" aria-hidden="true"></i>
                        {{item.playCount | toNumber}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="other-item simiSong" v-if="simiSongs.length > 0">
                <div class="title">相似歌曲</div>
                <ul>
                  <li v-for="(item, index) in simiSongs" :key="index" class="clearfix" @click="clickSongs(item)">
                    <span class="img-box left">
                      <img :src="item.album.picUrl" width="100%">
                    </span>
                    <div class="content left">
                      <div class="name ellipsis">{{item.name}}
                        <span v-if="item.alias.length > 0">( {{item.alias[0]}} )</span>
                      </div>
                      <span class="author">
                        {{changeName(item.artists)}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="other-item simiUseras" v-if="simiUseras.length > 0">
                <div class="title">喜欢这首歌的人</div>
                <ul>
                  <li v-for="(item, index) in simiUseras" :key="index" class="clearfix" @click="routerLink('/user/' + item.userId)">
                    <span class="img-box left radius">
                      <img :src="item.avatarUrl" width="100%">
                    </span>
                    <div class="content left">
                      <div class="name ellipsis">{{item.nickname}}
                        <span v-if="item.gender" class="gender" :class="genderFormat(item.gender)+'-gender'">
                          <i class="fa" :class="genderFormat(item.gender)" aria-hidden="true"></i>
                        </span>
                      </div>
                      <span class="author">
                        {{item.recommendReason}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <add-playlist :tracks="[currentSong.id]" ref="addPlaylists" @success="addFlows"></add-playlist>
      <div class="alert-container" v-show="AddFlow">
        <alert text="已收藏到歌单"></alert>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Scroll from 'base/scroll/Scroll'
import Alert from 'base/alert/alert'
import ReviewForm from 'base/review-form/review-form'
import ReviewList from 'base/review/review-list/review-list'
import Pagination from 'base/pagination/pagination'
import AddPlaylist from 'base/add-playlist/add-playlist'
import { likeMixin, reviewMixin } from 'common/js/mixin'
import { commentMusic, simiPlaylist, simiSong, simiUser } from 'api'
import { ERR_OK } from 'api/config'
import { forArray } from 'common/js/util'
import SongListClass from 'common/js/songListClass'

export default {
  name: 'medium-screen',
  mixins: [likeMixin, reviewMixin],
  props: {
    MScreen: {
      type: Boolean,
      default: false
    },
    currentLyric: {
      type: Object,
      default: () => {}
    },
    currentLineNum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      AddFlow: false,
      reviewFlow: false,
      simiPlaylists: [],
      simiSongs: [],
      simiUseras: []
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong !== oldSong) {
        this._commentReview()
        this._simiPlaylist()
        this._simiSong()
        this._simiUser()
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'playing'
    ]),
    playClass () {
      return this.playing ? 'play' : 'pause'
    },
    total () {
      return this.commentsData.total ? this.commentsData.total : 0
    }
  },
  created () {
  },
  components: {
    Scroll,
    Alert,
    ReviewList,
    Pagination,
    ReviewForm,
    AddPlaylist
  },
  methods: {
    addPlaylist () {
      this.$refs.addPlaylists.showPop()
    },
    lyricScrollEle () {
      let lineEl = this.$refs.lyricLine[this.currentLineNum - 5]
      this.$refs.lyricList.scrollToElement(lineEl, 1000)
    },
    lricScrollTo () {
      this.$refs.lyricList.scrollTo(0, 0, 1000)
    },
    _commentReview (commonParams = {}, boolean) {
      const data = Object.assign({}, commonParams, {id: this.currentSong.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentMusic(data).then((res) => {
        if (res.code === ERR_OK) {
          this.commentsData = res
          this.comments = res.comments
          if (boolean) {
            this.hotComments = res.topComments
          } else {
            this.hotComments = res.hotComments
          }
        }
      })
    },
    _commentControl (commonParams) {
      const data = Object.assign({}, commonParams, {id: this.currentSong.id, type: 0, timestamp: (new Date()).valueOf()})
      this.commentControlFn(data, true)
    },
    closeMediumScroll () {
      this.$refs.scroll.disable()
      this.$refs.scroll.refresh()
    },
    openMediumScroll () {
      this.$refs.scroll.enable()
      this.$refs.scroll.refresh()
    },
    _simiPlaylist () {
      simiPlaylist({id: this.currentSong.id}).then((res) => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.simiPlaylists = res.playlists
        }
      })
    },
    _simiSong () {
      simiSong({id: this.currentSong.id}).then((res) => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.simiSongs = res.songs
        }
      })
    },
    _simiUser () {
      simiUser({id: this.currentSong.id}).then((res) => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.simiUseras = res.userprofiles
        }
      })
    },
    changeName (array) {
      if (array) {
        return forArray(array)
      }
    },
    genderFormat (index) {
      if (index === 1) {
        return 'fa-mars'
      } else if (index === 2) {
        return 'fa-venus'
      }
    },
    routerLink (data) {
      this.$router.push(data)
      this.$emit('changeMScreen')
    },
    clickSongs (item) {
      this.insertSong(new SongListClass({
        id: item.id,
        mvId: item.mvid,
        name: item.name,
        alia: item.alias[0],
        author: item.artists,
        album: [item.album],
        duration: item.duration,
        image: item.album.picUrl,
        st: item.privilege.st
        // source: item.album.name
      }))
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    ...mapActions([
      'insertSong'
    ]),
    changeReviewFlase () {
      this.closeMediumScroll()
      this.reviewFlow = true
    },
    changeReviewTrue () {
      this.openMediumScroll()
      this.reviewFlow = false
    },
    otherRp () {
      this.changeReviewFlase()
    },
    clickAlbum (id) {
      console.log(id)
    },
    addFlows () {
      let that = this
      that.addFlow = true
      setTimeout(() => {
        that.addFlow = false
      }, 2000)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  .slide-enter, .slide-leave-to
    transform: translate3d(0, 100%, 0)
  .medium-screen-box
    width: 100%
    height: calc(100% - 60px)
    background: #202020
    position: fixed
    top: 0
    z-index: 2
    .title
      font-size: $font-size-medium
      margin-bottom: 15px
    .medium-wrap
      height: 100%
      overflow: hidden
      .medium-content
        width: 980px
        margin: 0 auto
        .top
          margin: 50px 0
          overflow: hidden
          .phonograph
            margin: 0 50px
            .icon-box
              margin-top: 30px
              .like
                display: inline-block
                width: 40px
                height: 40px
                line-height: 40px
                text-align: center
                background: #2a2a2a
                border-radius: 50%
                margin: 0 15px
                i
                  font-size: $font-size-medium
            .cd-wrapper
              background: url('images/turntable.png') no-repeat
              background-position-y: 85px
              width: 310px
              height: 395px
              position: relative
              &.play
                .arm
                  transform: rotate(33deg)
                  transform-origin: top left
                  transition: transform 1s
                .cd
                  animation: rotate 20s linear infinite
              &.pause
                .arm
                  transition: all 1s
                .cd
                  animation: rotate 20s linear infinite
                  animation-play-state: paused
              .arm
                background: url('images/arm.png') no-repeat
                width: 166px
                height: 72px
                position: absolute
                right: 5px
              .cd
                position: absolute
                left: 50px
                top: 135px
                width: 210px
                height: 210px
                overflow: hidden
                border-radius: 50%
          .lyrics-box
            margin: 30px 5px 0 35px
            width: 530px
            box-sizing: content-box
            .title-box
              .title
                font-size: $font-size-large
              .sound-quality
                display: inline-block
                font-size: $font-size-small
                vertical-align: text-bottom
                border: 1px solid $color-main
                padding: 2px 3px
                margin-left: 5px
                border-radius: 3px
                color: $color-main
                position: relative
                &:before
                  content: ''
                  position: absolute
                  width: 0
                  height: 0
                  border-left: 3px solid transparent
                  border-right: 3px solid transparent
                  border-bottom: 3px solid #c52526
                  left: 50%
                  transform: translate(-50%, 0)
                  top: -4px
            .des
              margin: 30px 0 0
              width: 100%
              overflow: hidden
              white-space: nowrap
              p
                display: inline-block
                margin-right: 30px
                b
                  color: #72ade7
                  margin-right: 10px
                  font-weight: normal
                  cursor: pointer
                  &:hover
                    color: #90bce6
                &:last-child
                  margin-right: 0
            .lyric-wrapper
              font-size: $font-size-small
              padding: 10px 0
              overflow: hidden
              box-sizing: content-box
              height: 350px
              .lyricScroll
                height: 100%
                overflow: hidden
                p
                  font-size: $font-size
                  // margin: 10px 0
                  color: $color-i
                  min-height: 30px
                  line-height: 30px
                  &.current
                    color: $color-background
        .bottom
          margin-bottom: 50px
          overflow: hidden
          .other
            flex: 1
            width: 260px
            .other-item
              margin-bottom: 30px
              li
                padding: 5px
                border-radius: 5px
                &:hover
                  background: #444
                .img-box
                  display: inline-block
                  width: 50px
                  height: 50px
                  border-radius: 5px
                  overflow: hidden
                .radius
                  border-radius: 50%
                .content
                  margin-left: 10px
                  width: 190px
                  height: 50px
                  overflow: hidden
                  display: flex
                  flex-direction: column
                  justify-content: center
                  .gender
                    width: 20px
                    height: 20px
                    line-height: 20px
                    display: inline-block
                    border-radius: 50%
                    font-size: $font-size-small
                    text-align: center
                    &.fa-mars-gender
                      background: #3b6071
                      color: #00a5f9
                    &.fa-venus-gender
                      background: #803352
                      color: #f10865
                  span
                    font-size: $font-size-small
                    color: #787878
          .review-wrap
            width: 665px
            .title
              span
                margin-left: 15px
                font-size: $font-size-small
            .review-trigger
              height: 30px
              line-height: 30px
              background: #2f2f2f
              padding: 0 10px
              border-radius: 5px
              margin: 15px 0
              .icon-box
                span
                  margin-left: 5px
                  i
                    font-size: $font-size-medium
                    vertical-align: middle
    .review-form
      position: fixed
      left: 50%
      transform: translate(-50%, -80%)
      .review-form-content
        background: #292929
        width: 500px
        padding: 20px 15px
        border-radius: 10px
        .review-form-title
          font-size: $font-size-medium
          text-align: center
          position: relative
          .close
            position: absolute
            left: 0
            top: 50%
            transform: translate(0, -50%)
            color: #565656
            cursor: pointer
        .button-wrap
          background: $color-main
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
