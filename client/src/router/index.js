import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: { name: 'Dashboard' } },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('../views/Dashboard'),
    meta: {
      layout: 'DefaultLayout'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
