<template>
  <div class="test-box">
    sssssss
  </div>
</template>

<script>
import { userRecord, userSubcount } from 'api'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'

export default {
  name: 'test',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this._userRecord()
    this._userSubcount()
  },
  components: {
  },
  methods: {
    _userRecord () {
      userRecord({uid: this.user[0].profile.userId, type: 0}).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
        }
      })
    },
    _userSubcount () {
      userSubcount({timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
