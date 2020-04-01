<template>
  <div class="edit-user-info-box">
    <form ref="form" class="left">
      <div class="form-group">
        <label for="labelName" class="form-type-info">昵称：</label>
        <div class="form-type">
          <input type="text" class="form-control" id="labelName" v-model="formArray.nickname" placeholder="请输入名称" value="formArray.nickname">
        </div>
      </div>
      <div class="form-group">
        <label for="labelSignature" class="form-type-info">介绍：</label>
        <div class="form-type">
          <textarea class="form-control" rows="4" id="labelSignature" v-model="formArray.signature" value="formArray.signature"></textarea>
        </div>
      </div>
      <div class="form-group radio">
        <span class="form-type-info"> 性别：</span>
        <div class="form-type">
          <label>
            <input type="radio" name="sex" v-model="formArray.gender" value="0" :checked="{'checked': formArray.gender === '0'}"> <span>保密</span>
          </label>
          <label>
            <input type="radio" name="sex" v-model="formArray.gender" value="1" :checked="{'checked': formArray.gender === '1'}"> <span>男</span>
          </label>
          <label>
            <input type="radio" name="sex" v-model="formArray.gender" value="2" :checked="{'checked': formArray.gender === '2'}"> <span>女</span>
          </label>
        </div>
      </div>
      <div class="form-group">
        <label for="labelBirthday" class="form-type-info">生日：</label>
        <div class="form-type">
          <input type="date" id="labelBirthday" value="formArray.birthday" v-model="formArray.birthday">
        </div>
      </div>
      <div class="form-group">
        <label class="form-type-info">地区：</label>
        <div class="form-type">
          <v-distpicker hide-area wrapper="selectAddress" :province="district.province" :city="district.city" @selected="onSelected"></v-distpicker>
        </div>
      </div>
      <div class="button-box">
        <button type="button" class="button-wrap botton-confix" @click="saveForm" :disabled="disabledButton">保存</button>
        <button type="button" class="button-wrap botton-close" @click="closeForm">取消</button>
      </div>
      <div v-show="loading" class="loading-container">
        <loading></loading>
      </div>
    </form>
    <div class="avatar-img">
      <img v-lazy="avatarUrl" alt="" width="100%">
    </div>
    <confirm ref="confirmDom" text='修改的信息尚未保存，是否保存离开' cancelBtnText="取消" confirmBtnText="保存" @confirm="saveForm"></confirm>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Confirm from 'base/confirm/confirm'
import VDistpicker from 'v-distpicker'
import { userDetail, userUpdate } from 'api'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { inquireDistrictMixin } from 'common/js/mixin'
import { timeStamp } from 'common/js/util'

export default {
  name: 'edit-user-info',
  data () {
    return {
      formArray: {
        nickname: '',
        signature: '',
        gender: '',
        birthday: '',
        province: '',
        city: ''
      },
      holdFormArray: {
        nickname: '',
        signature: '',
        gender: '',
        birthday: '',
        province: '',
        city: ''
      },
      avatarUrl: '',
      disabledButton: true,
      loading: false
    }
  },
  mixins: [inquireDistrictMixin],
  watch: {
    'formArray.birthday' (newDate) {
      this.formArray.birthday = timeStamp(this.formArray.birthday)
    },
    formArray: {
      handler (newData, oldData) {
        let boolean = this.isObjectValueEqual(newData, this.holdFormArray)
        if (boolean) {
          this.disabledButton = true
        } else {
          this.disabledButton = false
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this._userDetail()
  },
  components: {
    VDistpicker,
    Loading,
    Confirm
  },
  methods: {
    isObjectValueEqual (a, b) {
      // 取对象a和b的属性名
      var aProps = Object.getOwnPropertyNames(a)
      var bProps = Object.getOwnPropertyNames(b)
      // 判断属性名的length是否一致
      if (aProps.length !== bProps.length) {
        return false
      }
      // 循环取出属性名，再判断属性值是否一致
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        if (a[propName].toString() !== b[propName].toString()) { // 要转换为字符串
          return false
        }
      }
      return true
    },
    _userDetail () {
      userDetail({uid: this.user[0].profile.userId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.avatarUrl = res.profile.avatarUrl
          this.formArray.nickname = res.profile.nickname
          this.formArray.signature = res.profile.signature
          this.formArray.gender = res.profile.gender
          this.formArray.birthday = res.profile.birthday
          this.inquireDistrict(res.profile.province)
          this.inquireDistrict(res.profile.city)
          // 查询到的原始值
          this.holdFormArray.nickname = res.profile.nickname
          this.holdFormArray.signature = res.profile.signature
          this.holdFormArray.gender = res.profile.gender
          this.holdFormArray.birthday = timeStamp(res.profile.birthday)
          this.holdFormArray.province = res.profile.province
          this.holdFormArray.city = res.profile.city
        }
      })
    },
    _userUpdate () {
      this.loading = true
      this.formArray.birthday = this.dateReplace(this.formArray.birthday)
      userUpdate({nickname: this.formArray.nickname, signature: this.formArray.signature, gender: this.formArray.gender, birthday: this.formArray.birthday, province: this.formArray.province, city: this.formArray.city}).then((res) => {
        if (res.code === ERR_OK) {
          this.loading = false
          this.$toast('修改个人资料成功！')
        }
      })
    },
    dateReplace (time) {
      time = time.replace(/-/g, '/')
      return new Date(time).getTime()
    },
    onSelected (data) {
      this.formArray.province = data.province.code
      this.formArray.city = data.city.code
    },
    saveForm () {
      this._userUpdate()
    },
    closeForm () {
      if (this.disabledButton) {
        this.$router.go(-1)
      } else {
        this.showConfirm()
      }
    },
    showConfirm () {
      this.$refs.confirmDom.show()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .edit-user-info-box
    margin: 20px 0
    .form-group
      margin-bottom: 20px
      overflow: hidden
      .form-type-info
        float: left
        margin-right: 15px
        width: 80px
        text-align: right
      .form-type
        float: left
        input,textarea
          background: #2b2b2b
          border: 0
          width: 400px
          padding: 10px
          font-size: $font-size-small
        input[type='radio']
          width: initial
         label
           margin-right: 25px
           span
             margin-left: 5px
     .button-box
       margin: 30px 0 30px 95px
       .button-wrap
         display: inline-block
         padding: 5px 25px
         border: 1px solid
         border-radius: 20px
         cursor: pointer
         &:disabled
           opacity: 0.5
           cursor: not-allowed
       .botton-confix
         background: #d8100d
         border-color: #8a2d2c
         margin-right: 20px
         color: #fff
       .botton-close
         border-color: #565454
         background: none
    .avatar-img
      float: left
      margin-left: 50px
      width: 145px
      height: 145px
      border-radius: 5px
      overflow: hidden
</style>
