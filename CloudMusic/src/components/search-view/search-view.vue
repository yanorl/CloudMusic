<template>
  <div class="search-view-box">
    <div class="search-view-content">
      <div class="search-top clearfix">
        <div class="search-header">
          <div class="search-title">{{$route.params.name}}</div>
          <div class="search-tag">找到 {{songCount}} {{tabs[current].unit}}{{tabs[current].name}}</div>
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
      </div>
      <div class="search-tab-wrap">
        <scroll ref="scroll" :data="[...searchData]" class="search-tab-content">
          <div class="search-list">
            <div class="search-list-content" v-if="songCount">
              <div class="tab-item" v-if="current === 0">
                <search-single :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-single>
              </div>
               <div class="tab-item" v-if="current === 1">
                <search-singer :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-singer>
              </div>
               <div class="tab-item" v-if="current === 2">
                <search-album :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-album>
              </div>
               <div class="tab-item" v-if="current === 3">
                <search-mv :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-mv>
              </div>
               <div class="tab-item" v-if="current === 4">
                <search-song-list :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-song-list>
              </div>
               <div class="tab-item" v-if="current === 5">
                <search-user :searchData="searchData" @songCount="songCountFn" :query="$route.params.name"></search-user>
              </div>
              <div class="pagination-box">
                <pagination :totalCount="Number(songCount)" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
              </div>
            </div>
            <p class="none-text" v-if="songCount == 0">很抱歉，未能找到与<span>“{{$route.params.name}}”</span>相关的任何{{tabs[current].name}}！</p>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSingle from 'components/search-view/search-single/search-single'
import SearchSinger from 'components/search-view/search-singer/search-singer'
import SearchAlbum from 'components/search-view/search-album/search-album'
import SearchMv from 'components/search-view/search-mv/search-mv'
import SearchSongList from 'components/search-view/search-song-list/search-song-list'
import SearchUser from 'components/search-view/search-user/search-user'
import Scroll from 'base/scroll/Scroll'
import Pagination from 'base/pagination/pagination'
import { search } from 'api'
import { ERR_OK } from 'api/config'
import { debounce } from 'common/js/util'

export default {
  name: 'search-view',
  data () {
    return {
      songCount: '0',
      searchData: {
      },
      tabs: [
        {name: '单曲', unit: '首'},
        {name: '歌手', unit: '位'},
        {name: '专辑', unit: '张'},
        {name: '视频', unit: '个'},
        {name: '歌单', unit: '个'},
        // {name: '主播电台', unit: '个'},
        {name: '用户', unit: '位'}
      ],
      types: [
        {num: 1},
        {num: 100},
        {num: 10},
        {num: 1014},
        {num: 1000},
        // {num: 1009},
        {num: 1002}
      ],
      current: 0,
      limit: 100,
      currentPage: 1
    }
  },
  computed: {
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._search(1)
    }
  },
  created () {
    this._search(1)
    this.$watch('current', debounce((newCurrent) => {
      this._search(this.types[this.current].num)
    }, 1000))
  },
  components: {
    Scroll,
    Pagination,
    SearchSingle,
    SearchSinger,
    SearchAlbum,
    SearchMv,
    SearchSongList,
    SearchUser
  },
  methods: {
    _search (t, commonParams = {}) {
      const data = Object.assign({}, commonParams, {type: t, keywords: this.$route.params.name, limit: this.limit, timestamp: (new Date()).valueOf()})
      search(data).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.searchData = res.result
        }
      })
    },
    songCountFn (num) {
      this.songCount = num
    },
    getData (i) {
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this.scrollTop()
      this._search(this.types[this.current].num, {offset: offsetNum})
    },
    scrollTop () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    toggle (index) {
      // console.log(index + '---' + this.current)
      if (this.current !== index) {
        this.searchData = {}
        this.current = index
        this.songCount = '0'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-view-box
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
      .search-tab-wrap
        position: fixed
        left: $aisde-width
        width: 1200px
        bottom: $player-height
        top: 180px
        .search-tab-content
          height: 100%
          overflow: hidden
          .gray-tags
            color: $color-gray
            font-size: $font-size-small
          .link:hover
            color: #fff
          ul
            li.inline-block
              width: 20%
              height: 187px
              float: left
              padding: 0 15px 15px 0
              box-sizing: border-box
              .img-box
                border-radius: 10px
                overflow: hidden
                cursor: pointer
                position: relative
                color: #fff
                height: 120px
                .duration
                  position: absolute
                  right: 10px
                  bottom: 10px
                .number
                  position: absolute
                  right: 10px
                  top: 5px
                  display: flex
                  align-items: center
                  i
                    margin-right: 5px
                    color: #eee
                    font-size: $font-size-medium-x
              p
                margin-top: 5px
                cursor: pointer
                .tags
                  border: 1px solid #c52525
                  border-radius: 2px
                  color: #c52525
                  padding: 0 5px
                  font-size: $font-size-small
                &:hover
                  color: #fff
            li.block
              padding: 10px 60px 10px 34px
              cursor: pointer
              display: flex
              justify-content: space-between
              align-items: center
              &:nth-child(even)
                background: #202020
              &:hover
                background: #292929
              .list-left
                display: flex
                // justify-content: space-between
                align-items: center
                width: 350px
                .img-box
                  width: 60px
                  height: 60px
                  overflow: hidden
                  border-radius: 5px
                  margin-right: 10px
                  background: #999
                  display: flex
                  align-items: center
</style>
