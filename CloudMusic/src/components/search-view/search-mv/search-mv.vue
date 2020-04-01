<template>
  <div class="search-mv-box">
    <div class="search-mv-content">
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in searchData.videos" :key="index" class="inline-block">
            <div class="img-box" @click="clickItem(item.type, item.vid)">
              <img v-lazy="item.coverUrl" width="100%">
              <span class="number">
                <i class="fa fa-caret-right" aria-hidden="true"></i>
                <p>{{item.playTime | toNumber}}</p>
              </span>
              <span class="duration">
                {{formate(item.durationms)}}
              </span>
            </div>
            <p class="ellipsis" >
              <span v-if="item.type === 0" class="tags">mv</span>
              <span v-html="changeColor(item.title)"></span>
            </p>
            <p class="ellipsis gray-tags">
              <span v-if="item.type === 1">by</span>
              <span v-html="changeColor(item.creator[0].userName)" @click="clickName(item.userId)"></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {searchTagsMixin} from 'common/js/mixin'
import { durationStamp } from 'common/js/util'

export default {
  name: 'search-mv',
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
        this.$emit('songCount', newValue.videoCount)
      }
    }
  },
  components: {
  },
  methods: {
    forArray (array, link) {
      let html = ''
      let length = Number(array.length - 1)
      for (let item in array) {
        html += `<span class="routerLink cursor" data-id="${array[item].userId}" data-link="${link}">${array[item].userName}</span>`
        if (length !== Number(item)) {
          html += '<b> / </b>'
        }
      }
      return html
    },
    clickItem (type, id) {
      let parm
      if (type === 0) {
        parm = '/mv/'
      } else if (type === 1) {
        parm = '/video/'
      }
      this.$router.push(parm + id)
    },
    clickName (type, id) {
      let parm
      if (type === 0) {
        parm = '/artist/'
      } else if (type === 1) {
        parm = '/user/'
      }
      this.$router.push(parm + id)
    },
    formate (duration) {
      return durationStamp(duration)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-mv-box
    padding: 20px 43px
    overflow: hidden
</style>
