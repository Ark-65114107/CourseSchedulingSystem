
import { defineStore } from "pinia";
import { roles } from "@/data/auth.js"


export const usePermissionStore = defineStore('permission', {
    state: () => ({
        roles:[]
    }),
    actions: {
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
        },
       
       
        HandleArrayDelete(deleteValue) {
            ElMessageBox.confirm(
                "确认删除吗?",
                "警告",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(
                () => {
                    this.campuses = ArrayDelete(this.campuses, deleteValue)
                }
            ).catch(() => {
                console.log("canceled...")
            }
            )
        },



        HandleSingleDelete(value) {
            ElMessageBox.confirm(
                "确认删除吗?",
                "警告",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(
                () => {
                    this.campuses = SingleDelete(this.campuses, value)
                }
            )


        }
    }


})