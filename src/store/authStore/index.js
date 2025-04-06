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
                // if (res.meta.code === 200) {
                //     this.routes = res.data.routes
                // }
                this.routes = {
                    path: '/home',
                    name: 'content',
                    redirect: "/home/index",
                    componentUrl: "/layout/content/content.vue",
                    meta: {
                        title: "首页",
                        requiresAuth: false,
                        requireLogin: true,
                    },
                    children: [{
                        name: "task",
                        path: '/home/task',
                        redirect: '/home/task/scheduleManagement',
                        meta: {
                            title: "排课管理",
                            requiresAuth: false,
                            requireLogin: true,
                        },
                        children: [{
                            name: 'scheduleManagement',
                            path: '/home/task/scheduleManagement',
                            componentUrl: "/schedule/ScheduleManagement.vue",
                            meta: {
                                title: "排课任务",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'scheduleBuilder',
                            path: '/home/task/scheduleBuilder',
                            componentUrl: "/schedule/scheduleBuilder/scheduleBuilder.vue",
                            redirect: "/home/task/scheduleBuilder/addclass",
                            meta: {
                                title: "创建排课任务",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                            children: [{
                                name: 'addClass',
                                path: '/home/task/scheduleBuilder/addclass',
                                componentUrl: "/schedule/scheduleBuilder/AddClass.vue",
                                meta: {
                                    title: "选择班级",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'setCourse',
                                path: '/home/task/scheduleBuilder/setcourse',
                                componentUrl: "/schedule/scheduleBuilder/SetCourse.vue",
                                meta: {
                                    title: "课程选择",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'setCourseHour',
                                path: '/home/task/scheduleBuilder/setcoursehour',
                                componentUrl: "/schedule/scheduleBuilder/SetCourseHour.vue",
                                meta: {
                                    title: "学时设置",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'setTeachingClass',
                                path: '/home/task/scheduleBuilder/setteachingclass',
                                componentUrl: "/schedule/scheduleBuilder/SetTeachingClass.vue",
                                meta: {
                                    title: "教学班设置",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'teacherAssignment',
                                path: '/home/task/scheduleBuilder/teacherassignment',
                                componentUrl: "/schedule/scheduleBuilder/TeacherAssignment.vue",
                                meta: {
                                    title: "教师安排",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'scheduleSetting',
                                path: '/home/task/scheduleBuilder/schedulesetting',
                                componentUrl: "/schedule/scheduleBuilder/ScheduleSetting.vue",
                                meta: {
                                    title: "排课设置",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'scheduleBuild',
                                path: '/home/task/scheduleBuilder/scheduleBuild',
                                componentUrl: "/schedule/scheduleBuilder/ScheduleBuild.vue",
                                meta: {
                                    title: "课表编辑",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            {
                                name: 'scheduleViewer',
                                path: '/home/task/scheduleBuilder/scheduleViewer',
                                componentUrl: "/schedule/scheduleBuilder/ScheduleViewer.vue",
                                meta: {
                                    title: "课表查看",
                                    requiresAuth: false,
                                    requireLogin: true,
                                },
                            },
                            ]
                        },
                        {
                            name: 'showSchedule',
                            path: '/home/task/showSchedule',
                            componentUrl: "/schedule/ShowSchedule.vue",
                            meta: {
                                title: "查看课表",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },

                        ]
                    },
                    {
                        name: "index",
                        path: '/home/index',
                        componentUrl: "/index/index.vue",
                        meta: {
                            title: "首页",
                            requiresAuth: false,
                            requireLogin: true,
                        },
                        children: [{
                            name: "fillInformation",
                            path: "/home/index/fillInformation",
                            componentUrl: "/index/FillInformation.vue",
                            meta: {
                                title: "填写信息",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        }],

                    },
                    {
                        name: 'management',
                        path: '/home/management',
                        redirect: '/home/management/accountManagement',
                        meta: {
                            title: "系统管理",
                            requiresAuth: true,
                            requireLogin: true,
                        },
                        children: [{
                            name: 'AccountManagement',
                            path: '/home/management/accountManagement',
                            componentUrl: "/management/AccountManagement.vue",
                            meta: {
                                title: "账号管理",
                                requiresAuth: true,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'Rolemanagement',
                            path: '/home/management/rolemanagement',
                            componentUrl: "/management/Rolemanagement.vue",
                            meta: {
                                title: "角色管理",
                                requiresAuth: true,
                                requireLogin: true,
                            },
                        },
                        ]
                    },
                    {
                        name: "set",
                        path: '/home/set',
                        redirect: '/home/set/campus',
                        meta: {
                            title: "数据管理",
                            requiresAuth: false,
                            requireLogin: true,
                        },
                        children: [{
                            name: 'campus',
                            path: '/home/set/campus',
                            componentUrl: "/basicData/Campus.vue",
                            meta: {
                                title: "校区管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'semester',
                            path: '/home/set/semester',
                            componentUrl: "/basicData/Semester.vue",
                            meta: {
                                title: "学期管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'grade',
                            path: '/home/set/grade',
                            componentUrl: "/basicData/Grade.vue",
                            meta: {
                                title: "年级管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'classroom',
                            path: '/home/set/classroom',
                            componentUrl: "/basicData/Classroom.vue",
                            meta: {
                                title: "教室管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'student',
                            path: '/home/set/student',
                            componentUrl: "/basicData/Student.vue",
                            meta: {
                                title: "学生管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'teacher',
                            path: '/home/set/teacher',
                            componentUrl: "/basicData/Teacher.vue",

                            meta: {
                                title: "教师管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'class',
                            path: '/home/set/class',
                            componentUrl: "/basicData/Class.vue",
                            meta: {
                                title: "班级管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'course',
                            path: '/home/set/course',
                            componentUrl: "/basicData/Course.vue",
                            meta: {
                                title: "课程管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'department',
                            path: '/home/set/department',
                            componentUrl: "/basicData/Department.vue",

                            meta: {
                                title: "部门管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },
                        {
                            name: 'major',
                            path: '/home/set/major',
                            componentUrl: "/basicData/Major.vue",
                            meta: {
                                title: "专业管理",
                                requiresAuth: false,
                                requireLogin: true,
                            },
                        },

                        ]
                    },
                    {
                        name: "user",
                        path: '/home/user',
                        componentUrl: "/userInfo/userInfo.vue",
                        meta: {
                            title: "用户信息",
                            requiresAuth: false,
                            requireLogin: true,
                        },
                    },

                    ]
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
                if (res) {
                    if (res.code === 200) {
                        this.userInfo = res.data
                    }
                }
            })
        },
        getNavs() {
            return getNavs().then(res => {
                if (res) {
                    if (res.code === 200) {
                        this.navs = res.data.navs
                    }
                }
            })
        }
    }
})

