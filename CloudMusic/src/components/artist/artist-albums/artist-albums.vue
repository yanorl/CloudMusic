<template>
  <div class="artist-albums-box">
    <div class="artist-albums-content" :class="{'mores': moreFlow}">
      <song-list :songList="filteredSongList" :enabled="false" ref="songLists"></song-list>
    </div>
    <div class="mores" v-if="moreFlow">
      <span @click="changeHot">查看全部 ></span>
    </div>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import SongListClass from 'common/js/songListClass'
import { album } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'artist-albums',
  data () {
    return {
      songList: {},
      moreFlow: false
    }
  },
  props: {
    albumsId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    filteredSongList () {
      if (this.songList.datas) {
        return this.songList.datas.items
      }
    }
  },
  created () {
    this._album()
  },
  components: {
    SongList
  },
  methods: {
    _album () {
      album({id: this.albumsId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongList(res.songs)
          this.albumName = res.album.name
          if (res.songs.length > 10) {
            this.moreFlow = true
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
          source: { name: that.albumName, router: that.$route.path }
        }))
      })
      return map
    },
    changeHot () {
      this.moreFlow = false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .artist-albums-box
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
    .artist-albums-content
      &.mores
        height: 350px
        overflow: hidden
</style>
