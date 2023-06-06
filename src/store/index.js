import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: null,
    hash: null,
    email: null,
    name: null,
    role: null,
  },
  getters: {
    getHash(state){
      return state.hash;
    },
    getEmail(state){
      return state.email;
    },
    getLogged(state){
      return state.logged;
    },
    getName(state){
      return state.name;
    },
    getRole(state){
      return state.role;
    },
  },
  mutations: {
    setHash(state, hash){
      state.hash = hash;
    },
    setEmail(state, email){
      state.email = email;
    },
    setLogged(state, logged){
      state.logged = logged;
    },
    setName(state, name){
      state.name = name;
    },
    setRole(state, role){
      state.role = role;
    },
  },
  actions: {
  },
  modules: {
  }
})
