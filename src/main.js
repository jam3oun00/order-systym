/* eslint-disable */
import Vue from "vue";
import "./plugins/axios";
import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";
import axios from "axios";
import globalMixin from "@/mixins/index";

import router from "./router";
import store from "./store";
import App from "./App.vue";
import VueQuagga from "vue-quaggajs";
import VuejsDialog from "vuejs-dialog";
// register component 'v-quagga'
// Global Components
import "./global-components";

// 3rd party plugins
import "@/libs/portal-vue";
import "@/libs/toastification";
import "./registerServiceWorker";

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(VueQuagga);
Vue.mixin(globalMixin);

// Composition API
Vue.use(VueCompositionAPI);

import "vuejs-dialog/dist/vuejs-dialog.min.css";

Vue.use(VuejsDialog);

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
