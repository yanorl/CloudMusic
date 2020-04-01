<template>
  <div class="search-user-box">
    <div class="search-user-content">
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in searchData.userprofiles" :key="index" @click="clickItem(item.userId)" class="block">
            <div class="list-left">
              <div class="img-box">
                <img v-lazy="item.avatarUrl" width="100%">
              </div>
              <div class="name">
                <span v-html="changeColor(item.nickname)"></span>
                <span v-if="item.gender" class="gender" :class="genderFormat(item.gender)+'-gender'">
                  <i class="fa" :class="genderFormat(item.gender)" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div class="gray-tags ellipsis signature">
              {{item.signature}}
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
        this.$emit('songCount', newValue.userprofileCount)
      }
    }
  },
  components: {
  },
  methods: {
    genderFormat (index) {
      if (index === 1) {
        return 'fa-mars'
      } else if (index === 2) {
        return 'fa-venus'
      }
    },
    clickItem (id) {
      this.$router.push('/user/' + id)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-user-box
    ul
      li
        .img-box
          border-radius: 50% !important
        .signature
          width: 300px
        .gender
          width: 20px
          height: 20px
          line-height: 20px
          display: inline-block
          border-radius: 50%
          font-size: $font-size-small
          text-align: center
          &.fa-mars-gender
            background: #3b6071
            color: #00a5f9
          &.fa-venus-gender
            background: #803352
            color: #f10865
</style>
