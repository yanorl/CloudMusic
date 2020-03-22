<template>
  <div id="app" @click="changeSearchStatus">
    <my-header></my-header>
    <router-view/>
  </div>
</template>

<script>
import MyHeader from 'components/header/header'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'App',
  created () {
  },
  computed: {
    ...mapGetters([
      'searchStatus'
    ])
  },
  components: {
    MyHeader
  },
  methods: {
    changeSearchStatus () {
      if (this.searchStatus === true) {
        this.searchFlag(false)
      }
    },
    ...mapMutations({
      searchFlag: 'SET_SEARCH_STATUS'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
#app
  overflow: hidden
  height: 100%
</style>
