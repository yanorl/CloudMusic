<template>
  <div class="search-album-box">
    <div class="search-album-content">
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in searchData.albums" :key="index" @click="clickItem(item.id)" class="block">
            <div class="list-left">
              <div class="img-box">
                <img :src="item.picUrl" width="100%">
              </div>
              <div class="name">
                <span v-html="changeColor(item.name)"></span>
              </div>
            </div>
            <div class="name">
                <span v-html="changeColor(item.artist.name)"></span>
                <span v-if="item.artist.alias.length" class="gray">
                  (<span v-for="(list, i) in item.artist.alias" :key="i" v-html="changeColor(list)"></span>)
                </span>
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
        this.$emit('songCount', newValue.albumCount)
      }
    }
  },
  components: {
  },
  methods: {
    clickItem (id) {
      this.$router.push('/album/' + id)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
