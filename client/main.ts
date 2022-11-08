import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.config.productionTip = false;

Vue.use(VueToast, {
  position: 'top',
});

Vue.directive('my-click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
