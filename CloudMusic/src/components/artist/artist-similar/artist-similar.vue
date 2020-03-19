<template>
  <div class="artist-similar-box">
    <div class="artist-similar-content">
      <ul class="clearfix">
        <li v-for="(item, index) in artists" :key="index" @click="clickItem(item.id)">
          <div class="img-box">
            <img :src="item.img1v1Url" width="100%">
          </div>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { simiArtist } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'artist-similar',
  data () {
    return {
      artists: []
    }
  },
  props: {
    artistId: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  created () {
    this._simiArtist()
  },
  components: {
  },
  methods: {
    _simiArtist () {
      simiArtist({id: this.artistId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.artists = res.artists
        }
      })
    },
    clickItem (id) {
      this.$router.push({name: 'artist', params: {userId: id}})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .artist-similar-box
    .artist-similar-content
      li
        width: 172px
        height: 200px
        float: left
        padding: 0 15px 15px 0
        .img-box
          width: 172px
          height: 172px
          border-radius: 10px
          overflow: hidden
          cursor: pointer
        p
          margin-top: 5px
          cursor: pointer
          &:hover
            color: #fff
</style>
