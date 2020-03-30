<template>
  <div class="search-result-box">
    <scroll ref="scroll" :data="searchResult.artists && searchResult.songs && searchResult.albums && searchResult.mvs" class="search-result-wrap">
      <div class="search-result-content">
        <!-- 歌手 -->
        <div class="list-type" v-if="searchResult.artists">
          <div class="list-type-title">
            <i class="fa fa-user" aria-hidden="true"></i>
            <span>歌手</span>
          </div>
          <ul>
            <li v-for="item in searchResult.artists" :key="item.id" @click="selectItem('/artist/', item.id)">
              <span v-html='changeColor(item.name)'></span>
            </li>
          </ul>
        </div>
        <!-- 单曲 -->
        <div class="list-type" v-if="searchResult.songs">
          <div class="list-type-title">
            <i class="fa fa-music" aria-hidden="true"></i>
            <span>单曲</span>
          </div>
          <ul>
            <li v-for="item in searchResult.songs" :key="item.id" @click="clickSong(item.id)">
              <span v-html='changeColor(item.name)'>
              </span>
              <b v-if="item.alias[0]">({{item.alias[0]}})</b>
              <i>-</i>
              <span v-for="list in item.artists" :key="list.id" v-html='changeColor(list.name)'></span>
            </li>
          </ul>
        </div>
        <!-- 专辑 -->
        <div class="list-type" v-if="searchResult.albums">
          <div class="list-type-title">
            <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
            <span>专辑</span>
          </div>
          <ul>
            <li v-for="item in searchResult.albums" :key="item.id" @click="selectItem('/album/', item.id)">
              <span v-html='changeColor(item.name)'></span>
              <i>-</i>
              <span v-html='changeColor(item.artist.name)'></span>
            </li>
          </ul>
        </div>
        <!--视频 -->
        <div class="list-type" v-if="searchResult.mvs">
          <div class="list-type-title">
            <i class="fa fa-youtube-play" aria-hidden="true"></i>
            <span>视频</span>
          </div>
          <ul>
            <li v-for="item in searchResult.mvs" :key="item.id" @click="selectItem('/mv/', item.id)">
              <span v-html='changeColor(item.name)'></span>
              <i>-</i>
              <span v-html='changeColor(item.artistName)'></span>
            </li>
          </ul>
        </div>
        <div class="no-result-wrapper">
          <loading v-show="hasMore" title=""></loading>
          <no-result v-show="!hasMore && Object.keys(searchResult).length == 0" title="抱歉，暂无搜索结果"></no-result>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { searchSuggest, songDetail } from 'api'
import { ERR_OK } from 'api/config'
import NoResult from 'base/no-result/no-result'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/Scroll'

export default {
  name: 'search-result',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchResult: [],
      songs: {},
      privileges: '',
      hasMore: false
    }
  },
  watch: {
    query (newQuery) {
      this._searchSuggest()
    }
  },
  created () {},
  components: {
    NoResult,
    Loading,
    Scroll
  },
  methods: {
    _searchSuggest () {
      this.hasMore = true
      let querys = this.query.trim()
      if (querys) {
        searchSuggest({ keywords: querys }).then((res) => {
          if (res.code === ERR_OK) {
            this.hasMore = false
            this.searchResult = res.result
          }
        })
      }
    },
    _songDetail (id) {
      songDetail({ids: id}).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = res.songs[0]
          this.privileges = res.songs[0].privileges
          this.$emit('clickSong', this.songs, this.privileges)
        }
      })
    },
    selectItem (parm, id) {
      this.$emit('select')
      this.$router.push(parm + id)
    },
    clickSong (id) {
      this._songDetail(id)
    }
  },
  computed: {
    changeColor () {
      return function (value) {
        if (this.query && this.query.length > 0) {
          const result = value.replace(new RegExp(this.query, 'g'), `<p style="display: inline-block; color: #94d9ff;">${this.query}</p>`)
          return result
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-result-box
    position: fixed
    top: 76px
    width: 360px
    bottom: $player-height
    margin: 20px 0
    .search-result-wrap
      height: 100%
      overflow: hidden
      .list-type
        .list-type-title
          margin: 20px 0 10px 15px
        ul li
          padding: 10px 25px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          cursor: pointer
          &:hover
            background: #444
            color: #fff
          span
            margin: 0 3px
            display: inline-block
          b
            font-size: $font-size-small
            color: #7b7b7b
            margin-left: 3px
      .no-result-wrapper
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
</style>
