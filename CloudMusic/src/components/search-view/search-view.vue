<template>
  <div class="search-view-box" v-if="searchData.datas">
    <scroll ref="scroll" :data="searchData.datas.items" class="search-view-wrap">
      <div class="search-view-content">
        <div class="search-header">
          <div class="search-title">{{$route.params.name}}</div>
          <div class="search-tag">{{searchTag}}</div>
        </div>
        <div class="search-tabs clearfix">
          <ul>
            <li v-for="(item, index) in tabs" :key="index" :class="{'current': current === index}" @click="toggle(index)">
              <div class="tab-wrap">
                {{item.name}} <span v-if="item.total">({{songlistViewArray.commentCount}})</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="search-tab-content">
          <div class="tab-item" v-if="current === 0">
            <div class="search-list" v-if="searchData.datas.items.length > 0">
              <song-list :songList="filteredSongList" :query="$route.params.name" :thead="thead" :showLoading="showLoading" :enabled="false" ref="songLists"></song-list>
            </div>
            <div class="pagination-box" v-if="searchData.datas.items.length > 0">
              <pagination :totalCount="songCount" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
            </div>
            <p class="none-text" v-if="!searchData.datas.items.length">很抱歉，未能找到相关搜索结果！</p>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/Scroll'
import Pagination from 'base/pagination/pagination'
import { search, checkMusic } from 'api'
import { ERR_OK } from 'api/config'
import SongListClass from 'common/js/songListClass'

export default {
  name: 'search-view',
  data () {
    return {
      tagText: '找到',
      searchTag: '',
      songCount: '0',
      searchData: [],
      tabs: [
        {name: '单曲'},
        {name: '歌手'},
        {name: '专辑'},
        {name: '视频'},
        {name: '歌词'},
        {name: '歌单'},
        {name: '主播电台'},
        {name: '用户'}
      ],
      current: 0,
      thead: '',
      showLoading: true,
      limit: 100,
      currentPage: 1
    }
  },
  computed: {
    filteredSongList: function () { // 筛选数组里面的对象的值是否与搜索框输入的值相等，相等就返回该对象
      if (this.searchData.datas) {
        return this.searchData.datas.items.filter((list) => {
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
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._search(1)
    }
  },
  created () {
    this._search(1)
  },
  components: {
    Scroll,
    SongList,
    Pagination
  },
  methods: {
    _search (t, commonParams = {}) {
      const data = Object.assign({}, commonParams, {type: t, keywords: this.$route.params.name, limit: this.limit, timestamp: (new Date()).valueOf()})
      search(data).then((res) => {
        if (res.code === ERR_OK) {
          this.searchData = this._normalizeSongList(res.result.songs)
          this.songCount = res.result.songCount
          this.searchTag = this.tagText + this.songCount + '首单曲'
          if (this.$refs.songLists) {
            this.$refs.songLists.disable()
          }
          if (this.searchData.datas) {
            this.thead = this.searchData.datas.thead
          }
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
      list.forEach(async (item, index) => {
        let itemSt
        try {
          await that._checkMusic(item.id)
          itemSt = 0
        } catch (e) {
          itemSt = 1
        }
        map.datas.items.push(new SongListClass({
          id: item.id,
          mvId: item.mvid,
          name: item.name,
          // alia: item.alias,
          author: item.artists,
          album: [item.album],
          duration: item.duration,
          image: item.album.artist.img1v1Url,
          st: itemSt,
          source: { name: '搜索页', router: '/search/' + that.$route.params.name }
        }))
      })
      return map
    },
    _checkMusic (id) {
      return Promise.resolve(checkMusic({id, timestamp: (new Date()).valueOf()}))
    },
    getData (i) {
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this.scrollTop()
      this._search(1, {offset: offsetNum})
    },
    scrollTop () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    toggle (index) {
      this.current = index
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-view-box
    position: fixed
    left: $aisde-width
    width: 1200px
    bottom: $player-height
    top: 76px
    z-index: 1
    .search-view-wrap
      height: 100%
      overflow: hidden
      .search-view-content
        padding-bottom: 20px
        .search-header
          padding: 20px 34px
          .search-title
            font-size: $font-size-large-x
            display: inline-block
          .search-tag
            display: inline-block
            color: #7b7b7b
            font-size: $font-size-small
        .search-tabs
          border-bottom: 1px solid #262626
          margin:  5px 34px 0
          ul
            li
              display: inline-block
              margin-right: 30px
              padding: 5px 0
              cursor: pointer
              span
                font-size: $font-size-small
              &:hover
                color: #fff
              &.current
                border-bottom: 1px solid $color-main
                color: $color-main
              &:last-child
                margin-right: 0
</style>
