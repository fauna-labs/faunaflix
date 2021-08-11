// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { Auth0Plugin } from "@/auth";

Vue.config.productionTip = false

const auth0Domain = process.env.VUE_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.VUE_APP_AUTH0_CLIENT_ID;
Vue.use(Auth0Plugin, {
  domain: auth0Domain,
  clientId: auth0ClientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
