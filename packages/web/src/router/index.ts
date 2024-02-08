import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/rules'
    },
    {
      path: '/player',
      component: () => import('@/pages/player/index.vue')
    },
    {
      path: '/rules',
      component: () => import('@/pages/rules/index.vue')
    }
  ]
});

export default router;