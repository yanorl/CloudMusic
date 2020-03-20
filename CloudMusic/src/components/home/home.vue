<template>
  <div id="home">
    <div class="wrap-box">
      <div class="aside-box">
        <my-aside></my-aside>
      </div>
      <div class="wrap-content">
        <router-view/>
      </div>
    </div>
    <my-play></my-play>
  </div>
</template>

<script>
import MyAside from 'components/aside/aside'
import MyPlay from 'components/player/player'

export default {
  name: 'App',
  created () {
  },
  computed: {
  },
  components: {
    MyAside,
    MyPlay
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.wrap-box,.aside-box
  height: 100%
.wrap-box
  display: flex
  .aside-box
    width: $aisde-width
  .wrap-content
    flex: 1
</style>
