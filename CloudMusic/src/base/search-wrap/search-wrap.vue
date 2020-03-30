<template>
  <div class="search-wrap-box">
    <label>
      <div class="search-wrap">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input type="text" class="search" v-model="query" :placeholder="placeholder"  @keyup.enter="submit">
        <span class="clear">
          <i class="fa fa-times-circle" aria-hidden="true" @click="clear" v-show="query"></i>
        </span>
      </div>
    </label>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
  name: 'search-wrap',
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  components: {
  },
  methods: {
    clear () {
      this.query = ''
    },
    submit () {
      this.$emit('performSearch', this.query)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
    .search-wrap
        padding: 10px 25px 10px 15px
        border-radius: 20px
        background: #414141
        position: relative
        input
          background: #414141
          border: 0
        .clear
          position: absolute
          margin-left: 5px
</style>
