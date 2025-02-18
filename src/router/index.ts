import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatsView from '../components/CatsView.vue'
import CatDetails from '@/components/CatDetails.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cats',
      name: 'cats',
      component: () => CatsView
    },
    {
      path: '/cats/:name',
      name: 'cat-details',
      component: () => CatDetails
    }
  ]
})

export default router
