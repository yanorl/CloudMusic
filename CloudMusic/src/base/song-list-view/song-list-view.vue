<template>
  <div class="song-list-view-box">
    <scroll ref="scroll" :data="creator && songList.items" class="song-list-view-wrap">
      <div class="song-list-view-content">
        <song-list-view-info :songlistViewArray="songlistViewArray" :creator="creator" @clickPlay="showConfirmPlay" @cancelSubscribed="showConfirmFavorite" @confimSubscribed="confimSubscribed" @plusTag="plusTag"></song-list-view-info>
        <div class="tab-box clearfix">
          <ul>
            <li v-for="(item, index) in tabs" :key="index" :class="{'current': current === index}" @click="toggle(index)">
              <div class="tab-wrap">
                {{item.name}} <span v-if="item.total">({{songlistViewArray.commentCount}})</span>
              </div>
            </li>
            <li class="right" v-if="current === 0">
              <div class="search-wrap-box">
                <label>
                  <div class="search-wrap">
                    <i class="fa fa-search" aria-hidden="true" v-show="!query"></i>
                    <input type="text" class="search" v-model="query" placeholder="搜索歌单音乐">
                    <span class="clear">
                      <i class="fa fa-times-circle" aria-hidden="true" @click="clear" v-show="query"></i>
                    </span>
                  </div>
                </label>
              </div>
            </li>
          </ul>
        </div>
        <song-list v-if="current === 0" :songList="filteredSongList" :query="query" :thead="thead" :showLoading="showLoading" :enabled="false" ref="songLists"></song-list>
        <review v-if="current === 1" @scrollTop="scrollTop"></review>
        <subscribers-list v-if="current === 2" :subscribedCount="songlistViewArray.subscribedCount" @scrollTop="scrollTop"></subscribers-list>
      </div>
    </scroll>
    <category-label ref="CategoryLabel" @updateSongList="updateSongList"></category-label>
    <confirm ref="confirmPlay" text="'播放全部'将会替换当前的播放列表，是否继续" cancelBtnText="取消" confimBtnText="继续" @confirm="confirmClick"></confirm>
    <confirm ref="confirmFavorite" text="确定不再收藏该歌单" cancelBtnText="取消" confimBtnText="确定" @confirm="cancelSubscribed"></confirm>
  </div>
</template>

<script>
import { songlistView, playlistSubscribe, tagsUpdate } from 'api'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/loading'
import Review from 'base/song-list-view/review/review'
import SubscribersList from 'base/subscribers-list/subscribers-list'
// import { } from common/js/util'
import SongListViewInfo from 'base/song-list-view/song-list-view-info/song-list-view-info'
import SongList from 'base/song-list/song-list'
import Confirm from 'base/confirm/confirm'
import categoryLabel from 'base/category-label/category-label'
import SongListClass from 'common/js/songListClass'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'song-list-view',
  data () {
    return {
      songlistViewArray: {},
      creator: {},
      songList: {},
      showLoading: true,
      query: '',
      thead: '',
      current: 0,
      tabs: [
        {name: '歌曲列表', total: false},
        {name: '评论', total: true},
        {name: '收藏', total: false}
      ]
    }
  },
  computed: {
    filteredSongList: function () { // 筛选数组里面的对象的值是否与搜索框输入的值相等，相等就返回该对象
      if (this.songList.datas) {
        return this.songList.datas.items.filter((list) => {
          var array = Object.values(list)
          var boolean = array.some((d, i) => {
            if (array[i] && array[i].toString().match(this.query)) {
              return true
            }
          })
          return boolean
          // return list.author.match(this.query)
        })
      }
    },
    ...mapGetters([
      'watchSongListUpdata'
    ])
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._songlistView()
      this.current = 0
      this.scrollTop()
    },
    watchSongListUpdata (newDate, oldDate) {
      if (newDate !== oldDate) {
        this._songlistView()
      }
    }
  },
  created () {
    this._songlistView()
  },
  components: {
    Scroll,
    Loading,
    Review,
    SongList,
    SongListViewInfo,
    SubscribersList,
    Confirm,
    categoryLabel
  },
  methods: {
    showConfirmPlay () {
      this.$refs.confirmPlay.show()
    },
    showConfirmFavorite () {
      this.$refs.confirmFavorite.show()
    },
    _playlistSubscribe (t) {
      let that = this
      playlistSubscribe({t, id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          if (t === 1) {
            that.$toast("收藏成功！")
          } else if (t === 2) {
            that.$toast("歌单取消收藏成功")
          }
      })
    },
    _songlistView () {
      songlistView({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.songlistViewArray = res.playlist
          this.creator = res.playlist.creator
          this.songList = this._normalizeSongList(res.playlist.tracks, res.privileges)
          // console.log(this.songList)
          if (this.$refs.songLists) {
            this.$refs.songLists.disable()
          }
          if (this.songList.datas) {
            this.thead = this.songList.datas.thead
          }
        }
      })
    },
    _normalizeSongList (list, privilegeArray) {
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
          st: privilegeArray[index].st,
          source: { name: that.songlistViewArray.name, router: that.$route.path }
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
      this._playlistSubscribe(1)
      this._songlistView()
    },
    cancelSubscribed () {
      this._playlistSubscribe(2)
      this._songlistView()
    },
    plusTag () {
      this.$refs.CategoryLabel.showPop()
    },
    updateSongList (data) {
      console.log(data.toString())
      tagsUpdate({id: this.songlistViewArray.id, tags: data.join(';')}).then((res) => {
        if (res.code === ERR_OK) {
          this.$refs.CategoryLabel.popUpsClose()
          this._songlistView()
        }
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .song-list-view-box
    position: fixed
    left: $aisde-width
    width: 1200px
    bottom: $player-height
    top: 76px
    z-index: 1
    .song-list-view-wrap
      height: 100%
      overflow: hidden
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
