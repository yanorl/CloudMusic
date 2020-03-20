<template>
  <div class="artist-mv-box">
    <div class="artist-mv-content">
      <ul class="clearfix">
        <li v-for="(item, index) in artists" :key="index" @click="clickItem(item.id)">
          <div class="img-box">
            <img :src="item.imgurl" width="100%">
            <span class="number">
                <i class="fa fa-caret-right" aria-hidden="true"></i>
                <p>{{item.playCount | toNumber}}</p>
              </span>
              <span class="duration">
                {{formate(item.duration)}}
              </span>
          </div>
          <p class="ellipsis">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="pagination-box" v-if="artists.length">
      <pagination :totalCount="totalCount" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
    </div>
  </div>
</template>

<script>
import Pagination from 'base/pagination/pagination'
import { artistMv } from 'api'
import { ERR_OK } from 'api/config'
import { durationStamp } from 'common/js/util'

export default {
  name: 'artist-mv',
  data () {
    return {
      artists: [],
      currentPage: 1,
      limit: 20
    }
  },
  props: {
    artistId: {
      type: String,
      default: ''
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
  },
  created () {
    this._artistMv()
  },
  components: {
    Pagination
  },
  methods: {
    _artistMv (commonParams = {}) {
      const data = Object.assign({}, commonParams, {id: this.artistId, limit: this.limit, timestamp: (new Date()).valueOf()})
      artistMv(data).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.artists = res.mvs
        }
      })
    },
    clickItem (id) {
      this.$router.push({name: 'mv', params: {mId: id}})
    },
    getData (i) {
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this._artistMv({offset: offsetNum})
    },
    formate (duration) {
      return durationStamp(duration)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .artist-mv-box
    .artist-mv-content
      li
        width: 20%
        float: left
        padding: 0 15px 15px 0
        box-sizing: border-box
        min-height: 226px
        .img-box
          border-radius: 10px
          overflow: hidden
          cursor: pointer
          position: relative
          color: #fff
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
          &:hover
            color: #fff
</style>
