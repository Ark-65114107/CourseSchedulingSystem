import { getUserList } from "@/api/user/userManage.api";
import { defineStore } from "pinia";
import { roles } from "@/data/auth.js"



export const useUserManageStore = defineStore('userManageStore', {
    state: () => ({
        users: [],
        roles: [],
    }),
    actions: {
        getUsers(page, size) {
            return  getUserList().then(res => {
                if (res.code == 200) {
                    this.users = res.data
                    return 200
                }
            })
        },
        initRoles() {
            this.roles = roles
        },
        AddRole(value) {

        },
        EditRole(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.teachers, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            return true
        }
    },

})