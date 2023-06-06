import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashbordView.vue'
import PostsView from '../views/PostsView.vue';
import AddView from '../views/AddView.vue';
import PostView from '../views/PostView.vue'
import FavsView from '../views/FavsView.vue'
import ExchangeView from '../views/ExchangeView.vue'
import ChainView from '../views/ChainView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/posts',
    name: 'posts',
    component: PostsView
  },
  {
    path: '/new',
    name: 'add',
    component: AddView
  },
  {
    path: '/update/:id',
    name: 'update',
    component: AddView
  },
  {
    path: '/auth',
    name: 'Authoriztion',
    component: AuthView
  },
  {
    path: '/favs',
    name: 'Favs',
    component: FavsView
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: ExchangeView
  },
  {
    path: '/exchange-chain',
    name: 'Exchange-chain',
    component: ChainView
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostView,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/ali_front/',
  routes
})

export default router
