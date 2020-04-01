<template>
  <div class="play-list-item-box">
    <table class="table-box">
      <thead>
        <tr>
          <th width="20"></th>
          <th class="gray">共 {{switchesData.length}} 首</th>
          <th width="95" :class="grayClass">
            <div v-if="type === 'sequence'" @click="addPlaylist">
              <i aria-hidden="true" class="fa fa-calendar-plus-o"></i>
              <span>收藏全部</span>
            </div>
          </th>
          <th width="30"></th>
          <th width="85" :class="grayClass">
            <span @click="clearAll">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
              <span>清空</span>
            </span>
          </th>
        </tr>
      </thead>
      <div class="fixed">
        <scroll ref="scroll" :data="switchesData" class="scrollTr">
          <tbody>
            <tr v-for="(item, index) in switchesData" :key="index" ref="trGroup" @click="clickItem(index)" @dblclick="selectItem(item, index)">
              <td width="15">
                <span class="status" v-if="playCurrent(item.id) && type === 'sequence'">
                  <i class="fa color-main" :class="playing ? 'fa-play' : 'fa-pause'" aria-hidden="true"></i>
                </span></td>
              <td v-if="item.name" class="name" :class="{'gray': item.st !== 0}" :title="titleDes(item.name, item.alia)">
                <div class="table-name">
                  <span :class="{'color-main': playCurrent(item.id) && type === 'sequence'}">{{item.name}}</span>
                  <span class="alia gray" v-if="item.alia">{{item.alia}}</span>
                  <span class="iconMv" v-if="item.mvId">
                    <i class="color-main fa fa-play-circle-o" aria-hidden="true"></i>
                  </span>
                </div>
              </td>
              <td :title="item.author" :class="playCurrent(item.id) && type === 'sequence' ? 'color-main' : 'author'">
                <div class="author-name">
                  <span v-for="(i, index) in item.author" :key="index">
                    <router-link :to="'/artist/'+ i.id">{{i.name}}</router-link>
                    <b v-if="item.author.length - 1 !== index"> / </b>
                  </span>
                </div>
              </td>
              <td class="links" width="25">
                <span class="link">
                  <i class="fa fa-link" aria-hidden="true"></i>
                </span>
              </td>
              <td class="time" :title="item.duration">
                {{format(item.duration)}}
              </td>
            </tr>
          </tbody>
        </scroll>
      </div>
    </table>
    <div class="tips gray" v-if="!switchesData.length">
      <p>你还没有{{tipText}}任何歌曲！</p>
      <p>去首页 <router-link to="/recommend">发现音乐</router-link>
      </p>
    </div>
    <add-playlist :tracks="tracks" ref="addPlaylists" @success="addFlows"></add-playlist>
  </div>
</template>

<script>
import AddPlaylist from 'base/add-playlist/add-playlist'
import Scroll from 'base/scroll/Scroll'
import { durationStamp } from 'common/js/util'

export default {
  name: 'play-list-item',
  props: {
    switchesData: {
      types: Array,
      default: () => []
    },
    currentIndex: {
      types: Number,
      default: -1
    },
    playing: {
      types: Boolean,
      default: false
    },
    currentSong: {
      types: Number,
      default: -1
    },
    type: {
      types: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    grayClass () {
      return !this.switchesData.length ? 'gray' : ''
    },
    tipText () {
      return this.type === 'sequence' ? '播放' : '添加'
    },
    tracks () {
      return this.switchesData.map((item) => {
        return item.id
      })
    }
  },
  created () {
  },
  components: {
    Scroll,
    AddPlaylist
  },
  methods: {
    addPlaylist () {
      this.$refs.addPlaylists.showPop()
    },
    addFlows () {
      this.$toast('已收藏到歌单')
    },
    playCurrent (id) {
      if (this.currentSong.id === id) {
        return true
      } else {
        return false
      }
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
    selectItem (song, index) {
      this.$emit('selectItem', this.type, song, index)
      this.scrollTop()
    },
    clearAll () {
      if (this.switchesData.length > 0) {
        this.$emit('clearAll', this.type)
      }
    },
    scrollElement () {
      let index = this.switchesData.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      if (index >= 0) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollToElement(this.$refs.trGroup[index - 6], 0)
        })
      }
    },
    scrollTop () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    format (date) {
      return durationStamp(date)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .fixed
    position: fixed
    top: 189px
    bottom: $player-height
    .scrollTr
      height: 100%
      overflow: hidden
      position: relative
.play-list-item-box
  .tips
    text-align: center
    margin-top: 80px
    font-size: $font-size-small
  table.table-box
    border: none
    border-collapse: collapse
    width: 100%
    max-width: 100%
    text-align: left
    font-size: $font-size-small
    table-layout:fixed
    word-break:break-all
    tr
      height: 35px
      line-height: 35px
    thead
      th
        border-bottom: 2px solid #313131
    tbody
      tr
        &.clickIndex
          background: #3e3d3d !important
        &:nth-child(even)
          background: #2d2d2d
        &:hover
          td
            background: #333
            color: #fff
            &.author, &.links, &.time
              color: #fff
        td
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
          padding-right: 5px
          &.color-main
            a
              color: $color-main
          .table-name
            width: 185px
            text-overflow: ellipsis
            overflow: hidden
          .author-name
            width: 90px
            text-overflow: ellipsis
            overflow: hidden
          &.author
            color: $color-gray
          &.links, &.time
            color: #4e4e4e
          .status
            text-align: center
            display: block
            padding-left: 5px
            i
              transform: scale(0.6)
</style>
