import { createRouter, createWebHistory } from 'vue-router';
import Main from './pages/Main.vue';
import CRUD from './pages/CRUD.vue';

const routes = [
  { path: '/', component: Main },
  { path: '/crud', component: CRUD }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;