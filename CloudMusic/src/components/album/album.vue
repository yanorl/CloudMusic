<template>
  <div class="album-view-box" v-if='songList.datas'>
    <scroll ref="scroll" :data="songList.datas.items" class="album-view-wrap">
      <div class="albumt-view-content">
        <info :infoData="infoData" :listLength="songList.datas.items.length" :albumDynamic="albumDynamic" @clickPlay="showConfirmPlay" @cancelSubscribed="showConfirmFavorite" @confimSubscribed="confimSubscribed"></info>
        <div class="tab-box clearfix">
          <ul>
            <li v-for="(item, index) in tabs" :key="index" :class="{'current': current === index}" @click="toggle(index)">
              <div class="tab-wrap">
                {{item.name}} <span v-if="item.total">({{albumDynamic.commentCount}})</span>
              </div>
            </li>
          </ul>
        </div>
        <song-list v-if="current === 0" :songList="songList.datas.items" :query="query" :thead="thead" :showLoading="showLoading" :enabled="false" ref="songLists"></song-list>
        <div ref="Review">
          <review v-if="current === 1" @scrollTop="scrollToElement"></review>
        </div>
        <div class="des" v-if="current === 2">
          <div class="des-content">
            <template v-if="infoData.description">
              <div class="专辑介绍">简介</div>
              <p>
                <pre>{{infoData.description}}</pre>
              </p>
            </template>
            <template v-else>
              <p>暂无介绍</p>
            </template>
          </div>
        </div>
      </div>
    </scroll>
    <confirm ref="confirmPlay" text="'播放全部'将会替换当前的播放列表，是否继续" cancelBtnText="取消" confimBtnText="继续" @confirm="confirmClick"></confirm>
    <confirm ref="confirmFavorite" text="确定不再收藏该歌单" cancelBtnText="取消" confimBtnText="确定" @confirm="cancelSubscribed"></confirm>
    <div class="alert-container" v-show="alertFlow">
      <alert :icon='alert.icon' :text="alert.text"></alert>
    </div>
  </div>
</template>

<script>
import { album, albumDynamic, albumSub } from 'api'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/loading'
import Review from 'components/album/review/review'
import Info from 'components/album/info/info'
import SongList from 'base/song-list/song-list'
import Confirm from 'base/confirm/confirm'
import Alert from 'base/alert/alert'
import SongListClass from 'common/js/songListClass'
import { mapActions } from 'vuex'

export default {
  name: 'song-list-view',
  data () {
    return {
      infoData: {},
      songList: {},
      albumDynamic: {},
      showLoading: true,
      query: '',
      thead: '',
      current: 0,
      tabs: [
        {name: '歌曲列表', total: false},
        {name: '评论', total: true},
        {name: '专辑详情', total: false}
      ],
      alertFlow: false,
      alert: {
        icon: 'fa-check-circle',
        text: '收藏成功！'
      }
    }
  },
  computed: {
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._album()
      this.current = 0
      this.scrollTop()
    }
  },
  created () {
    this._album()
  },
  components: {
    Scroll,
    Loading,
    Review,
    SongList,
    Confirm,
    Info,
    Alert
  },
  methods: {
    showConfirmPlay () {
      this.$refs.confirmPlay.show()
    },
    showConfirmFavorite () {
      this.$refs.confirmFavorite.show()
    },
    _albumSub (t) {
      let that = this
      albumSub({t, id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          if (t === 1) {
            that.alert.text = '收藏成功！'
          } else if (t === 2) {
            that.alert.text = '歌单取消收藏成功!'
          }
          that.alertFlow = true
          setTimeout(() => {
            that.alertFlow = false
            that._album()
          }, 1500)
        }
      })
    },
    _album () {
      album({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.infoData = res.album
          this.songList = this._normalizeSongList(res.songs)
          // console.log(this.songList)
          if (this.$refs.songLists) {
            this.$refs.songLists.disable()
          }
          if (this.songList.datas) {
            this.thead = this.songList.datas.thead
          }
        }
      })
      albumDynamic({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.albumDynamic = res
        }
      })
    },
    _normalizeSongList (list) {
      let that = this
      let map = {
        datas: {
          thead: true, // thead: false 表示不需要表头 true表示需要表头
          items: []
        }
      }
      list.forEach((item, index) => {
        map.datas.items.push(new SongListClass({
          id: item.id,
          mvId: item.mv,
          name: item.name,
          alia: item.alia[0],
          author: item.ar,
          album: [item.al],
          duration: item.dt,
          image: item.al.picUrl,
          st: item.privilege.st,
          source: { name: that.infoData.name, router: that.$route.path }
        }))
      })
      return map
    },
    clear () {
      this.query = ''
    },
    scrollTop () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    scrollToElement () {
      this.$refs.scroll.scrollToElement(this.$refs.Review, 0)
    },
    toggle (index) {
      this.current = index
    },
    confirmClick () {
      this.selectPlay({
        list: this.songList.datas.items,
        index: 0
      })
    },
    confimSubscribed () {
      this._albumSub(1)
      this._album()
    },
    cancelSubscribed () {
      this._albumSub(2)
      this._album()
    },
    ...mapActions([
      'selectPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .album-view-box
    position: fixed
    left: $aisde-width
    width: 1200px
    bottom: $player-height
    top: 76px
    z-index: 1
    .album-view-wrap
      height: 100%
      overflow: hidden
      .des-content
        margin: 20px 34px
        .title
          margin-bottom: 20px
          color: $color-background
        pre
          white-space: pre-wrap
          font-size: $font-size-small
          color: $color-gray
          line-height: 2
      .tab-box
        border-bottom: 1px solid #262626
        margin:  35px 34px 0
        ul
          li
            display: inline-block
            margin-right: 30px
            padding: 5px 0
            cursor: pointer
            span
              font-size: $font-size-small
            &.current
              border-bottom: 1px solid $color-main
              color: $color-main
            &:last-child
              margin-right: 0
            .search-wrap-box
              input
                border: none
                background: none
                width: 90px
</style>
