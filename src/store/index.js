import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: 'lflix',
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    faunaSecret: ''
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
    setSecret(state, secret) {
      state.faunaSecret = secret;
    },
    logout(state) {
      state.faunaSecret = '';
    }
  },
  getters: {

  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
