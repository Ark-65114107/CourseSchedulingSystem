import request from "@/utils/request"
import axios from "axios"

//发送登录请求
export const userLogin = (param)=>{
    return request.post('login',{
        ...param
    })
}


export const userRegister = (param)=>{
    return request.post('register',{
        ...param
    })
}   
export const getUserInfo = ()=>{
    // return request.get('getUserInfo')
    return axios.get("")
}

export const getNavs = ()=>{
    return request.get('getNav')
}   

