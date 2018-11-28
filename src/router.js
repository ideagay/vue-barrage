/**
 * Created by hyb on 2018/11/26.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: '/', component: () => import('@/pages/main.vue') }
    ]
});

export default router;