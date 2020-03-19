<template>
  <div class="login-box">
    <div class="personal-form">
      <div class="login-wrap">
        <div class="form-wrap">
          <div class="form-content">
            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)">
                <ValidationProvider vid="tel" name="tels" rules="required|tel" v-slot="{ errors }">
                  <div class="form-group">
                    <label for="firstLabel">
                      <span class="icon-form">
                        <i class="fa fa-phone-square" aria-hidden="true"></i>
                      </span>
                    </label>
                    <input type="tel" autocomplete="off" @focus="clearError" required="required" class="form-control" id="firstLabel" v-model="formTel" :placeholder="placeholder.tel">
                    <div class="error-box" v-if="errors[0]">
                      <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                      <span class="error-text">{{ errors[0] }}</span>
                    </div>
                  </div>
                </ValidationProvider>
                <ValidationProvider vid="password" name="passwords" rules="required|min:6|max:16" v-slot="{ errors }">
                  <div class="form-group">
                    <div class="form-group-left">
                      <label for="secondLabel">
                        <span class="icon-form">
                          <i class="fa fa-lock" aria-hidden="true"></i>
                        </span>
                      </label>
                      <input type="password" autocomplete="off" @focus="clearError" required="required" class="form-control" id="secondLabel" v-model="formPassword" :placeholder="placeholder.password">
                    </div>
                    <span class="reset-password">
                      重设密码
                    </span>
                    <div class="error-box" v-if="errors[0]">
                      <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                      <span class="error-text">{{ errors[0] }}</span>
                    </div>
                  </div>
                </ValidationProvider>
                <div class="json-error" v-if="jsonError">
                  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                  <span class="error-text">{{ jsonError }}</span>
                </div>
                <button type="submit" class="btn" :class="{'disabled': disabledButton}" :disabled="disabledButton">
                  <span v-if="!disabledButton">登陆</span>
                  <i v-if="disabledButton" class="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                </button>
              </form>
            </ValidationObserver>
          </div>
        </div>
        <div class="btn-tex"><span @click="registeredPage">注册</span></div>
      </div>
    </div>
     <transition name="fade">
    <div class="agree-content" v-if="showFlag">
      <div class="agree-text">请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》</div>
    </div>
  </transition>
  </div>
</template>

<script>
import { loginPhone } from 'api'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  props: {
    agreeCheck: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      formTel: '',
      formPassword: '',
      placeholder: {
        tel: '请输入手机号',
        password: '请输入密码'
      },
      errorText: '',
      jsonError: '',
      disabledButton: false,
      showFlag: false
    }
  },
  created () {
  },
  components: {
  },
  methods: {
    onSubmit () {
      if (this.agreeCheck.length > 0) {
        console.log(this.agreeCheck.length)
        this.disabledButton = true
        loginPhone({phone: this.formTel, password: this.formPassword}).then((res) => {
          this.disabledButton = false
          if (res.code === ERR_OK) {
            let array = []
            array.push(res)
            this.setUser(array)
            // console.log(res.bindings[0])
            this.$router.go(0)
          } else {
            this.jsonError = res.message
          }
        }).catch((error) => {
          this.disabledButton = false
          this.jsonError = error.message
        })
      } else {
        this.showFlag = true
        var that = this
        setTimeout(function () {
          that.showFlag = false
        }, 1000)
      }
    },
    clearError () {
      this.jsonError = ''
    },
    ...mapActions([
      'setUser'
    ]),
    hide () {
      this.$emit('hide')
    },
    registeredPage () {
      this.$emit('registeredPage')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
.fade-enter-active, .fade-leave-active
  transition: opacity .5s
.fade-enter, .fade-leave-to
  opacity: 0
.login-box
  position: relative
  .agree-content
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    background: #000
    padding: 20px 10px
    width: 100%
    border-radius: 10px
    color: #fff
    line-height: 1.8
  .personal-form
    .btn
      width: 100%
      padding: 10px
      background: $color-main
      border-radius: 5px
      color: #fff
      margin-top: 10px
      &.disabled
        opacity: 0.2
    .btn-tex
      margin: 15px 0
      text-align: center
      color: #4f4f4f
      span
        cursor: pointer
    .json-error
      position: absolute
      bottom: 50px
      right: 0
      font-size: $font-size-small
      color: $color-main
    .form-wrap
      position: relative
      overflow: hidden
      .form-content
        margin-top: 40px
        border-radius: 5px
        .form-group
          border: 1px solid #e1e1e1
          padding: 13px 10px
          position: relative
          display: flex
          margin-bottom: 30px
          .error-box
            position: absolute
            bottom: -25px
            font-size: $font-size-small
            color: $color-main
          .form-group-left
            flex: 1
          .reset-password
            cursor: pointer
          input
            width: 100%
            height: 20px
            padding:0 10px 0 25px
            box-sizing: border-box
            border: none
            font-weight: bold
            color: #000
          label
            position: absolute
            .icon-form
              font-size: $font-size-medium-x
</style>
