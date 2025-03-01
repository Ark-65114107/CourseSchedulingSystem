import { getUserList } from "@/api/userManage.api";
import { defineStore } from "pinia";
import { roles } from "@/data/auth.js"



export const useUserManageStore = defineStore('userManageStore',{
    state:()=>({
        users:[],
        roles:[],
    }),
    actions:{
        getUsers(page,size){
            getUserList(page,size).then(res=>{
                this.users = res.data.users
            })
        },
        initRoles() {
            this.roles = roles
        },
        AddRole(value) {
            this.roles.push(value)
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