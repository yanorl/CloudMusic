<template>
  <div class="search-single-box">
    <div class="search-single-content">
      <div class="search-list" v-if="songList.datas">
        <song-list :songList="songList.datas.items" :query="query" :thead="thead" :showLoading="showLoading" :enabled="false" ref="songLists"></song-list>
      </div>
    </div>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import { checkMusic } from 'api'
import SongListClass from 'common/js/songListClass'

export default {
  name: 'search-single',
  data () {
    return {
      songList: {},
      showLoading: true
    }
  },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    query: {
      type: String,
      default: ''
    }
  },
  computed: {
    thead () {
      if (this.songList && this.songList.datas) {
        return this.songList.datas.thead
      }
    }
  },
  watch: {
    searchData (newValue, oldValue) {
      if (newValue) {
        this.songList = this._normalizeSongList(newValue.songs)
        this.$emit('songCount', newValue.songCount)
      }
    }
  },
  components: {
    SongList
  },
  methods: {
    _normalizeSongList (list) {
      if (list && list.length) {
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
      }
    },
    _checkMusic (id) {
      return Promise.resolve(checkMusic({id, timestamp: (new Date()).valueOf()}))
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
