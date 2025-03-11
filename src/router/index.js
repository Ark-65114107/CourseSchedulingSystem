
import { useAuthStore } from '@/store/authStore'
import { getToken } from '@/utils/token/getToken'
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
    path: '/register',
    name: 'register',
    component: () => import("@/views/Login/Register.vue"),
    meta: {
      title: "注册",
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

const whiteList = ['/login', '/register', '/404', '403', '/']


router.beforeEach((to, from, next) => {
  console.log("to:", to);
  console.log("route:", router);
  const hasToken = getToken()
  const authStore = useAuthStore()
  if (to.path == "/login" && hasToken) {
    return next('/home')
  } else {
    if (whiteList.includes(to.path)) {
      return next()
    } else {
      if (Object.keys(authStore.routes).length == 0 && hasToken) {
        return authStore.setRoutes().then(() => {
          return next({ ...to, replace: true })
        }
        )
      } else {
        if (hasToken && router.hasRoute(to.name)) {
          return next()
        } else {

          return next('/404')
        }
      }
    }
  }


})

export default router
