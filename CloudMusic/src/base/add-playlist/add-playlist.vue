<template>
  <div class="add-playlist-box">
    <pop-ups ref="popUps" text="收藏到歌单">
      <div class="add-playlist-wrap clearfix">
        <div class="add-playlist-content">
          <ul>
            <li class="item" @click="createList">
              <div class="img-box">
                <span class="icon">+</span>
              </div>
              <div class="content">
                <div class="name">新建歌单</div>
              </div>
            </li>
          </ul>
          <div class="add-playlist-midden">
            <scroll ref="scroll" class="add-playlist-scroll" :data="createdListres">
              <div>
                <ul>
                  <li class="item" v-for="(item, index) in createdListres" :key="index" @click="clickItem(item.id)">
                    <div class="img-box">
                      <img v-lazy="item.coverImgUrl" alt="" width='100%'>
                    </div>
                    <div class="content">
                      <div class="name">{{item.name}}</div>
                      <div class="des"> <span>{{item.trackCount}}</span> 首音乐</div>
                    </div>
                  </li>
                </ul>
              </div>
            </scroll>
          </div>
        </div>
      </div>
    </pop-ups>
    <creat-playlist ref="creatPlaylist" @successCreat="successCreat" v-if="showPlaylist"></creat-playlist>
  </div>
</template>

<script>
import PopUps from 'base/pop-ups/pop-ups'
import Scroll from 'base/scroll/Scroll'
import creatPlaylist from 'base/creat-playlist/creat-playlist'
import { playlistMixin } from 'common/js/mixin'
import { playlistTracks } from 'api'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'

export default {
  name: 'add-playlist',
  data () {
    return {
      showPlaylist: false
    }
  },
  props: {
    tracks: {
      type: Array,
      default: () => []
    }
  },
  mixins: [playlistMixin],
  watch: {
  },
  computed: {
  },
  created () {
    // this._playlistTracks()
  },
  components: {
    creatPlaylist,
    PopUps,
    Scroll
  },
  methods: {
    _playlistTracks (id) {
      playlistTracks({op: 'add', pid: id, tracks: this.tracks.join(',')}).then((res) => {
        if (res.code === ERR_OK) {
          this.setWatchSongListUpdata(!this.WatchSongListUpdata)
          this.$refs.popUps.close()
          this.$emit('success')
        }
      })
    },
    clickItem (id) {
      this._playlistTracks(id)
    },
    showPop () {
      this.$refs.popUps.show()
    },
    createList () {
      let that = this
      that.showPlaylist = true
      that.$nextTick(() => {
        that.$refs.creatPlaylist.createList()
      })
    },
    successCreat (id) {
      console.log(id)
      this._playlistTracks(id)
      this.setWatchPlayListUpdata(!this.WatchPlayListUpdata)
    },
    ...mapMutations({
      setWatchPlayListUpdata: 'SET_WATCH_PLAY_LIST_UPDATA',
      setWatchSongListUpdata: 'SET_WATCH_SONG_LIST_UPDATA'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .add-playlist-wrap
    .add-playlist-content
      font-size: $font-size-small
      height: 400px
      ul
        li.item
          padding: 10px
          display: flex
          align-items: center
          cursor: pointer
          text-align: left
          .img-box
            width: 60px
            height: 60px
            line-height: 60px
            border-radius: 5px
            margin-right: 10px
            background: #373737
            overflow: hidden
            text-align: center
            .icon
              font-size: $font-size-big
              color: $color-main
      .add-playlist-midden
        height: 330px
        .add-playlist-scroll
          height: 100%
          overflow: hidden
          li.item
            &:hover
              background: #444
</style>
