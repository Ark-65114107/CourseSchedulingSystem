import { getUserList } from "@/api/userManage.api";
import { defineStore } from "pinia";


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
        }
    }
})