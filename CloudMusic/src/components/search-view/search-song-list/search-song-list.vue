<template>
  <div class="search-song-list-box">
    <div class="search-song-list-content">
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in searchData.playlists" :key="index" @click="clickItem(item.id)" class="block">
            <div class="list-left">
              <div class="img-box">
                <img :src="item.coverImgUrl" width="100%">
              </div>
              <div class="name">
                <span v-html="changeColor(item.name)"></span>
              </div>
            </div>
            <div class="gray-tags">
                {{item.trackCount}}首
            </div>
            <div class="gray-tags link" @click.stop="clickName(item.creator.userId)">
                by {{item.creator.nickname}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {searchTagsMixin} from 'common/js/mixin'

export default {
  name: 'search-album',
  data () {
    return {
    }
  },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    query: {
      type: String,
      default: ''
    }
  },
  mixins: [searchTagsMixin],
  computed: {
  },
  watch: {
    searchData (newValue, oldValue) {
      if (newValue) {
        this.$emit('songCount', newValue.playlistCount)
      }
    }
  },
  components: {
  },
  methods: {
    clickName (id) {
      this.$router.push('/user/' + id)
    },
    clickItem (id) {
      this.$router.push('/songListView/' + id)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
