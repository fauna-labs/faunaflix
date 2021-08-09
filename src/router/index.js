import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
// import OktaLogin from '@/views/OktaLogin.vue'
import Show from '@/views/Show.vue'

// import { OktaAuth } from '@okta/okta-auth-js'
// import OktaVue from '@okta/okta-vue'

// const oktaAuth = new OktaAuth({
//   clientId: process.env.VUE_APP_CLIENT_ID,
//   issuer: process.env.VUE_APP_ISSUER,
//   redirectUri: window.location.protocol + '//' + window.location.host + process.env.VUE_APP_REDIRECT_URI,
//   scopes: ['openid', 'profile', 'email'],
//   pkce: true,
// })

// Vue.use(OktaVue, {
//   oktaAuth,
//   onAuthRequired: () => {
//     router.push('/login')
//   }
// })

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // {
  //   path: process.env.VUE_APP_REDIRECT_URI,
  //   component: OktaLogin
  // },
  {
    path: '/show/:id',
    name: 'show',
    component: Show,
    // meta: {
    //   requiresAuth: true
    // }
  },
  {
    path: '/episode/:id',
    name: 'episode',
    component: Show,
    // meta: {
    //   requiresAuth: true
    // }
  }    
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
