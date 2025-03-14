import { defineStore } from "pinia";
import { getRoutes } from "@/api/auth/routes.api";
import router from "@/router";
import { getUserInfo, getNavs } from "@/api/user/user.api";
import { getToken } from "@/utils/token/getToken";
const modules = import.meta.glob('../../views/**/**')

export const useAuthStore = defineStore('auth', {
    state: () => ({
        routes: {},
        userInfo: {},
        navs: [],

    }),
    actions: {
        Logout() {
            localStorage.clear()
            sessionStorage.clear()
            this.$reset()
        },
        setRoutes() {
            return getRoutes().then(res => {
                if (res.meta.code === 200) {
                    this.routes = res.data.routes
                }
            }).then(() => {
                const childrens = this.setRouterList(this.routes.children)
                router.addRoute({
                    path: this.routes.path,
                    name: this.routes.name,
                    meta: this.routes.meta,
                    redirect: this.routes.redirect,
                    component: modules[`../../views${this.routes.componentUrl}`],
                    children: childrens
                })
                return 200
            })
        },
        setRouterList(data) {
            let res = []
            data.forEach((c) => {
                if (c.path == "/home/user") {
                    res.push({
                        name: c.name,
                        path: c.path,
                        meta: c.meta,
                        component: modules[`../../views${c.componentUrl}`],
                    })
                }
                else {
                    const childrens = []
                    c.children.forEach((c2) => {
                        if (c2.name == "scheduleBuilder") {
                            let children3 = []
                            c2.children.forEach((c3) => {
                                children3.push({
                                    name: c3.name,
                                    path: c3.path,
                                    meta: c3.meta,
                                    component: modules[`../../views${c3.componentUrl}`],
                                })
                            })
                            childrens.push({
                                name: c2.name,
                                path: c2.path,
                                meta: c2.meta,
                                redirect: c2.redirect,
                                component: modules[`../../views${c2.componentUrl}`],
                                children: children3
                            })
                        } else {
                            childrens.push({
                                name: c2.name,
                                path: c2.path,
                                meta: c2.meta,
                                component: modules[`../../views${c2.componentUrl}`]
                            })
                        }

                    })
                    if (c.path == "/home/index") {
                        res.push({
                            path: c.path,
                            name: c.name,
                            meta: c.meta,
                            redirect: c.redirect,
                            component: modules[`../../views${c.componentUrl}`],
                            children: childrens
                        })
                    } else {
                        res.push({
                            path: c.path,
                            name: c.name,
                            meta: c.meta,
                            redirect: c.redirect,
                            children: childrens
                        })
                    }


                }
            })
            return res

        },

        getUserInfo() {
            return getUserInfo().then(res => {
                this.userInfo = res.data
            })
        },
        getNavs() {
            return getNavs().then(res => {
                this.navs = res.data.navs
            })
        }
    }
})

