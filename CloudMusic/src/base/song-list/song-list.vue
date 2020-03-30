<template>
  <div class="song-list-box">
    <div class="song-list-wrap" :class="{'fixed': enabled}">
      <scroll ref="scroll" :data="songList" class="list-box">
        <table class="table-box">
          <thead v-if="thead">
            <tr>
              <th width="125"></th>
              <th>音乐标题</th>
              <th width="215">歌手</th>
              <th width="285">专辑</th>
              <th width="130">时长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in songList" :key="index" @dblclick="selectItem(item, index)" @click="clickItem(index)" :class="{'clickIndex': currentClick === index}">
              <td class="gray" width="100">
                <span class="index-box">
                  <template v-if="playCurrent(item.id)">
                    <i class="fa color-main" :class="playing ? 'fa-volume-up' : 'fa-volume-off'" aria-hidden="true"></i>
                  </template>
                  <template v-else>
                    {{index | plusZero}}
                  </template>
                </span>
                <span class="icon-box">
                  <i @click="clickLike(item, $event)" class="fa" aria-hidden="true" :class="className(item.id)"></i>
                </span>
              </td>
              <td v-if="item.name" class="name" :class="{'gray': item.st !== 0}" :title="titleDes(item.name, item.alia)">
                <span v-html="changeColor(item.name, 'name')" :class="{'color-main': playCurrent(item.id)}"></span>
                <span class="alia gray" v-if="item.alia" v-html="changeColor(item.alia, 'alia')"></span>
                <span class="iconMv" v-if="item.mvId">
                  <i class="color-main fa fa-play-circle-o" aria-hidden="true"></i>
                </span>
              </td>
              <td v-if="item.author && thead" v-html="changeColor(item.author,'author')" @click="addComment($event)"></td>
              <td v-if="item.album && thead" v-html="changeColor(item.album, 'album')" @click="addComment($event)"></td>
              <td class="gray" v-if="item.duration && thead">{{formate(item.duration)}}</td>
              <td v-if="item.playCount" class="gray" width="130">{{item.playCount}} 次 {{item.fee}}</td>
              <td class="gray" v-if="item.duration && !item.playCount && !thead" align="right" >{{formate(item.duration)}}</td>
            </tr>
          </tbody>
        </table>
      </scroll>
    </div>
    <div class="not-data" v-if="thead && query && songList.length === 0">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
    <div class="not-data" v-show="!songList.length && showLoading && !query">
      <p>赶快去收藏你喜欢的音乐</p>
    </div>
    <div class="alert-container" v-show="alertFlow">
      <alert :icon='alert.icon' :text="alert.text"></alert>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import NoResult from 'base/no-result/no-result'
import { mapGetters, mapActions } from 'vuex'
import { likeMixin, searchTagsMixin } from 'common/js/mixin'
import { durationStamp } from 'common/js/util'

export default {
  name: 'song-list',
  props: {
    songList: {
      type: Array,
      default: () => []
    },
    showLoading: {
      type: Boolean,
      default: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    thead: {
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: ''
    }
  },
  mixins: [likeMixin, searchTagsMixin],
  data () {
    return {
      likeBoolean: false,
      currentClick: -1
    }
  },
  computed: {
    ...mapGetters([
      'playListRouter',
      'currentIndex',
      'playing',
      'currentSong'
    ])
  },
  components: {
    Scroll,
    NoResult
  },
  methods: {
    formate (duration) {
      return durationStamp(duration)
    },
    disable () {
      this.$refs.scroll.disable()
    },
    titleDes (name, alia) {
      if (alia) {
        return name + '' + alia
      } else {
        return name
      }
    },
    clickItem (index) {
      this.currentClick = index
    },
    playCurrent (index) {
      if (this.currentSong.id === index && this.playListRouter === this.$route.path) {
        return true
      } else {
        return false
      }
    },
    ...mapActions([
      'selectPlay',
      'savePlayListRouter'
    ]),
    selectItem (item, index) {
      console.log(item)
      if (item.st === 0) {
        this.selectPlay({
          list: this.songList,
          index
        })
        this.savePlayListRouter(this.$route.path)
      } else {
        this.alertFlow = true
        this.alert.icon = 'fa-times-circle'
        this.alert.text = '因合作方要求，该资源暂时下架>_<'
        setTimeout(() => {
          this.alertFlow = false
        }, 1500)
      }
    },
    addComment (event) {
      this.routerLink(event.target.dataset.id, event.target.dataset.link)
    },
    routerLink (id, link) {
      switch (link) {
        case 'name':
          break
        case 'alia':
          break
        case 'author':
          this.$router.push('/artist/' + id)
          break
        case 'album':
          this.$router.push('/album/' + id)
          break
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .song-list-box
    .not-data
      text-align: center
      margin: 35px
    .fixed
       position: fixed
       left: $aisde-width
       width: 1200px
       bottom: $player-height
       top: 135px
       z-index: 1
    .song-list-wrap
       .list-box
         height: 100%
         overflow: hidden
         table.table-box
           border: none
           border-collapse: collapse
           width: 100%
           max-width: 100%
           white-space: nowrap
           text-align: left
           font-size: $font-size-small
           tr
             height: 35px
             line-height: 35px
           thead
             th
               font-weight: normal
               color: #6e6e6e
           tbody
             tr
               &.clickIndex
                 background: #3e3d3d !important
               &:nth-child(even)
                 background: #202020
               &:hover
                 background: #292929
               .index-box,.icon-box
                 margin-right: 15px
                 font-size: $font-size-small
                 color: #7b7b7b
                 min-width: 17px
                 display: inline-block
                 text-align: center
                 i
                   font-size: $font-size
               .icon-box,.iconMv
                  i
                    // margin-right: 10px
                    cursor: pointer
                    // &.active
                    //   color: $color-main
               td
                 text-overflow: ellipsis
                 overflow: hidden
                 white-space: nowrap
                 padding-right: 5px
                 &.name span
                   // display: inline-block
                   margin-left: 5px
                 &:first-child
                   padding-left: 34px
</style>
