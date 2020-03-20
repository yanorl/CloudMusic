<template>
  <div class="mv-box">
    <div class="mv-content">
    dss
     <!--  <scroll class="mv-wrap" ref="scroll" :data="[...mvDetails]">
      </scroll> -->
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import { mvDetail } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'test',
  data () {
    return {
      mvDetails: {}
    }
  },
  created () {
    this._mvDetail()
  },
  components: {
    Scroll
  },
  methods: {
    _mvDetail () {
      mvDetail({mvid: this.$route.params.mvid, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.mvDetails = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mv-box
    .mv-content
      width: 100%
      height: 100%
      background: #1b1a1a
      position: fixed
      top: 76px
      z-index: 999
</style>
