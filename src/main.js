import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import money from 'v-money';
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;
Vue.config.productionTip = false;
Vue.use(Toast);
Vue.use(money, {precision: 0})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
