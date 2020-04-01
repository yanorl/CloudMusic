<template>
  <div class="user-record-list-box">
    <div class="user-record-list-wrap">
      <div class="user-record-list-content">
        <div class="tab-box clearfix">
          <ul>
            <li @click="clickItem(1)" :class="{'acitve': index === 1 }">最近一周</li>
            <li @click="clickItem(0)" :class="{'acitve': index === 0 }">所有时间</li>
          </ul>
        </div>
        <div v-if="songList.items" v-loading="loading">
          <p class="none-text" v-if="!songList.items.length">没有听歌排行数据</p>
          <div>
            <song-list :songList="songList.items" :thead="songList.thead"></song-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userRecord } from 'api'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import SongListClass from 'common/js/songListClass'
import SongList from 'base/song-list/song-list'

export default {
  name: 'user-record-list',
  data () {
    return {
      userRecord: {},
      songList: [],
      index: 1,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this._userRecord(1)
    console.log(this.$route.path)
  },
  components: {
    SongList
  },
  methods: {
    _userRecord (types) {
      this.loading = true
      userRecord({uid: this.$route.params.userId, type: types}).then((res) => {
        if (res.code === ERR_OK) {
          if (types === 1) {
            this.loading = false
            this.userRecord = this._normalizeRecord(res.weekData)
            if (this.userRecord.datas) {
              this.songList = this.userRecord.datas
            }
          } else {
            this.loading = false
            this.userRecord = this._normalizeRecord(res.allData)
            if (this.userRecord.datas) {
              this.songList = this.userRecord.datas
            }
          }
        }
      })
    },
    _normalizeRecord (list) {
      let map = {
        datas: {
          thead: false, // thead: false 表示不需要表头 true表示需要表头
          items: []
        }
      }
      list.forEach((item, index) => {
        let that = this
        map.datas.items.push(new SongListClass({
          id: item.song.id,
          mvId: item.song.mv,
          author: item.song.ar,
          name: item.song.name,
          alia: item.song.alia[0],
          album: [item.song.al],
          duration: item.song.dt,
          playCount: item.playCount,
          image: item.song.al.picUrl,
          st: item.song.privilege.st,
          source: { name: '听歌排行', router: that.$route.path }
        }))
      })
      return map
    },
    clickItem (num) {
      this._userRecord(num)
      this.index = num
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .user-record-list-content
    margin-top: 10px
    .tab-box
      border-bottom: 2px solid #262626
      ul
        li
          padding: 10px 0 10px 30px
          float: left
          cursor: pointer
          &.acitve
            font-weight: bold
            color: #fff
</style>
