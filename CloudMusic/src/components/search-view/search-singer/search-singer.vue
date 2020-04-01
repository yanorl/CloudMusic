<template>
  <div class="search-singer-box">
    <div class="search-singer-content">
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in searchData.artists" :key="index" @click="clickItem(item.id)" class="block">
            <div class="list-left">
              <div class="img-box">
              <img v-lazy="item.img1v1Url" width="100%">
            </div>
            <div class="name">
              <span v-html="changeColor(item.name)"></span>
              <span v-if="item.alia" class="gray">
               (<span v-for="(list, i) in item.alia" :key="i" v-html="changeColor(list)"></span>)
              </span>
            </div>
            </div>
            <!-- <div class="icon-box"><i class="fa fa-user-o" aria-hidden="true"></i></div> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {searchTagsMixin} from 'common/js/mixin'

export default {
  name: 'search-singer',
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
        this.$emit('songCount', newValue.artistCount)
      }
    }
  },
  components: {
  },
  methods: {
    clickItem (id) {
      this.$router.push('/artist/' + id)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
