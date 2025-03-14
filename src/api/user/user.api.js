import request from "@/utils/request"

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
    return request.get('getUserInfo')
}

export const getNavs = ()=>{
    return request.get('getNav')
}   

