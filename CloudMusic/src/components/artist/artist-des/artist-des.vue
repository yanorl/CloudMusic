<template>
  <div class="artist-des-box">
    <div class="artist-des-list" v-for="(item, index) in des" :key="index">
      <div class="title">{{item.ti}}</div>
      <div class="content">
        <pre>{{item.txt}}</pre>
      </div>
    </div>
    <div class="artist-des-list">
      <div class="title">简介</div>
       <div class="content">
        <pre>{{briefDesc}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { artistDesc } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'artist-des',
  data () {
    return {
      des: [],
      briefDesc: ''
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
    this._artistDesc()
  },
  components: {
  },
  methods: {
    _artistDesc () {
      this.$isLoading(true)
      artistDesc({id: this.artistId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.des = res.introduction
          this.briefDesc = res.briefDesc
        }
        this.$isLoading(false)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .artist-des-box
    .artist-des-list
      margin-bottom: 30px
      .title
        margin-bottom: 20px
        color: $color-background
      .content
        pre
          white-space: pre-wrap
          font-size: $font-size-small
          color: $color-gray
          line-height: 2
</style>
