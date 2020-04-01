import Vue from 'vue'
import Loading from './v-loading.vue'

const LoadingConstructor = Vue.extend(Loading)
const LoadingComp = {
  vm: null,
  install: Vue => {
    Vue.directive(Loading.name, {
      inserted (el, binding) {
        const elem = window.getComputedStyle(el, null)
        el.style.position = elem['position'] === 'static' && 'relative'
        LoadingComp.vm = new LoadingConstructor().$mount()
        // 如果带修饰符fixed loading固定在屏幕中间
        // let val = binding.modifiers.fixed && 'fixed'
        // LoadingComp.vm.$el.style.position = val && val
        if (binding.modifiers.fixed) {
          LoadingComp.vm.$el.classList.add('fixed')
        }
      },
      update (el, binding) {
        const ele = window.getComputedStyle(el, null)
        // 添加判断，如果当前元素的高度小于60 则loading固定在整个屏幕中间 否则固定在当前元素中间
        if (!binding.modifiers.fixed && parseInt(ele['height']) < 60) {
          LoadingComp.vm.$el.classList.add('fixed')
        }
        if (binding.value) {
          el.appendChild(LoadingComp.vm.$el)
        } else if (el.contains(LoadingComp.vm.$el)) {
          el.removeChild(LoadingComp.vm.$el)
        }
        // LoadingComp.vm.$el.style.position = !binding.modifiers.fixed && (parseInt(ele['height']) < 60 ? 'fixed' : 'absolute')
        // binding.value ? el.appendChild(LoadingComp.vm.$el) : (el.contains(LoadingComp.vm.$el) ? el.removeChild(LoadingComp.vm.$el) : '')
      }
    })
  }
}
export default LoadingComp
