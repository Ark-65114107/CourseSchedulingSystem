
import { useAuthStore } from '@/store/authStore'
import { getToken } from '@/utils/token/getToken'
import path from 'path'
import { createRouter, createWebHistory } from 'vue-router'



const routes = [
  {
    path: '/',
    redirect: "/login",
    meta: {
      title: "跳转中...",
      requiresAuth: false,
      requireLogin: false,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/Login/Login.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
      requireLogin: false,
    }
  },

  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/errors/404.vue")
  },
  {
    path: "/403",
    component: () => import("@/views/errors/403.vue")
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const whiteList = ['/login', '/404', '403', '/']


router.beforeEach((to, from, next) => {
  console.log("to:", to);
  const hasToken = getToken()
  const authStore = useAuthStore()
  if (to.path == "/login" && hasToken) {
    next('/home')
  }
  if (whiteList.includes(to.path)) {
    next()
  } else {
    if (Object.keys(authStore.routes).length == 0 && hasToken) {
        authStore.setRoutes().then(() => {
          next({...to,replace:true})
        }
      )
    } else {
      if (hasToken && router.hasRoute(to.name)) {
        console.log("gogogo");
        next()
      } else {
        next('/login')
      }
    }
  }

})

export default router
