<template>
  <div class="artist-box">
    <scroll ref="scroll" :data="[...songlistViewArray] && [...songList]" class="artist-wrap" :pullup="pullup" :beforeScroll="beforeScroll"  @scrollToEnd="albumsMore">
      <div class="artist-content">
        <artist-info :songlistViewArray="songlistViewArray" @cancelSubscribed="showConfirmFavorite" @confimSubscribed="confimSubscribed"></artist-info>
        <div class="tab-box clearfix">
          <ul>
            <li v-for="(item, index) in tabs" :key="index" :class="{'current': current === index}" @click="toggle(index)">
              <div class="tab-wrap">
                {{item.name}}
              </div>
            </li>
          </ul>
        </div>
        <div class="tab-content" v-if="current === 0">
          <div class="tab-item clearfix">
            <div class="tab-img left">
              <img :src="require('common/image/top-50.png')" width="100%">
            </div>
            <div class="tab-content-list letf" :class="{'hotSongs': hotFlow}">
              <div class="title">
                <span>热门50首</span>
                <span class="icon-box">
                  <i class="fa fa-play-circle-o"></i>
                  <i class="fa fa-calendar-plus-o"></i>
                </span>
              </div>
              <song-list v-if="current === 0" :songList="filteredSongList" :showLoading="showLoading" :enabled="false" ref="songLists"></song-list>
            </div>
            <div class="mores" v-if="hotFlow">
              <span @click="changeHot">查看全部50首 ></span>
            </div>
          </div>
          <div class="tab-item clearfix" v-for="(list, i) in hotAlbums" :key="i">
            <div class="tab-img left" @click="ClickAlbum(list.id)">
              <img :src="list.picUrl" width="100%">
              <p>{{normalDate(list.publishTime)}}</p>
            </div>
            <div class="tab-content-list letf">
              <div class="title">
                <span @click="ClickAlbum(list.id)">{{list.name}}</span>
                <span class="icon-box">
                  <i class="fa fa-play-circle-o"></i>
                  <i class="fa fa-calendar-plus-o"></i>
                </span>
              </div>
              <artist-albums :albumsId="list.id"></artist-albums>
            </div>
          </div>
        </div>
        <div class="tab-content" v-if="current === 1">
          <artist-mv :artistId="$route.params.id" :totalCount="songlistViewArray.mvSize"></artist-mv>
        </div>
        <div class="tab-content" v-if="current === 2">
          <artist-des :artistId="$route.params.id"></artist-des>
        </div>
        <div class="tab-content" v-if="current === 3">
          <artist-similar :artistId="$route.params.id"></artist-similar>
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
import { artists, artistSub, artistAlbum } from 'api'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/loading'
import artistInfo from 'components/artist/artist-info/artist-info'
import artistAlbums from 'components/artist/artist-albums/artist-albums'
import artistDes from 'components/artist/artist-des/artist-des'
import artistSimilar from 'components/artist/artist-similar/artist-similar'
import artistMv from 'components/artist/artist-mv/artist-mv'
import SongList from 'base/song-list/song-list'
import Confirm from 'base/confirm/confirm'
import Alert from 'base/alert/alert'
import SongListClass from 'common/js/songListClass'
import { mapActions } from 'vuex'
import { timeStamp } from 'common/js/util'

export default {
  name: 'artist',
  data () {
    return {
      songlistViewArray: {},
      songList: {},
      hotAlbums: [],
      showLoading: true,
      current: 0,
      tabs: [
        {name: '专辑', total: false},
        {name: 'MV', total: true},
        {name: '歌手详情', total: false},
        {name: '相似歌手', total: false}
      ],
      alertFlow: false,
      hotFlow: true,
      alert: {
        icon: 'fa-check-circle',
        text: '收藏成功！'
      },
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      page: 0,
      limit: 20
    }
  },
  computed: {
    filteredSongList () {
      if (this.songList.datas) {
        return this.songList.datas.items
      }
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._artists()
      this.current = 0
      this.hotAlbums = []
      this.scrollTop()
    }
  },
  created () {
    this._artists()
    this._artistAlbum()
  },
  components: {
    Scroll,
    Loading,
    SongList,
    artistInfo,
    artistAlbums,
    artistDes,
    artistSimilar,
    artistMv,
    Confirm,
    Alert
  },
  methods: {
    showConfirmFavorite () {
      this.$refs.confirmFavorite.show()
    },
    _artistSub (t) {
      let that = this
      artistSub({t, id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          if (t === 1) {
            that.alert.text = '收藏成功！'
          } else if (t === 2) {
            that.alert.text = '歌手取消收藏成功!'
          }
          that.alertFlow = true
          setTimeout(() => {
            that.alertFlow = false
            that._artists()
          }, 1500)
        }
      })
    },
    _artists () {
      artists({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.songlistViewArray = res.artist
          this.songList = this._normalizeSongList(res.hotSongs)
          // console.log(this.songList)
          if (this.$refs.songLists) {
            this.$refs.songLists.disable()
          }
        }
      })
    },
    _artistAlbum (commonParams = {}) {
      const data = Object.assign({}, {id: this.$route.params.id, limit: this.limit}, commonParams)
      artistAlbum(data).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.hasMore = res.more
          let list = res.hotAlbums
          list.forEach((item) => {
            this.hotAlbums.push(item)
          })
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
          source: { name: that.songlistViewArray.name, router: that.$route.path }
        }))
      })
      return map
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
      this._artistSub(1)
      this._artists()
    },
    cancelSubscribed () {
      this._artistSub(2)
      this._artists()
    },
    changeHot () {
      this.hotFlow = false
      this.$refs.scroll.refresh()
    },
    normalDate (date) {
      if (date) {
        return timeStamp(date)
      }
    },
    albumsMore () {
      if (this.current === 0) {
        if (!this.hasMore) {
          return
        }
        this.page++
        let offsetNum = (this.page - 1) * this.limit
        this._artistAlbum({offset: offsetNum})
      }
    },
    ClickAlbum (id) {
      console.log(id)
      this.$router.push('/album/' + id)
    },
    ...mapActions([
      'selectPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .artist-box
    position: fixed
    left: $aisde-width
    width: 1200px
    bottom: $player-height
    top: 76px
    z-index: 1
    .artist-wrap
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
      .tab-content
        padding: 25px 34px
        .tab-item
          margin-bottom: 50px
          .tab-img
            img
              width: 180px
              height: 180px
              margin:0 60px 5px 0
              overflow: hidden
              border-radius: 10px
          .tab-content-list
            .title
              margin-bottom: 10px
              span
                margin-right: 25px
                i
                  margin-right: 15px
                  cursor: pointer
                  &:hover
                    color: #fff
            &.hotSongs
              max-height: 380px
              overflow: hidden
          .mores
            text-align: right
            font-size: $font-size-small
            span
              display: inline-block
              padding: 10px
              margin-right: 30px
              cursor: pointer
              &:hover
                color: #fff
</style>
