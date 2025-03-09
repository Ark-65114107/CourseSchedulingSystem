import request from "@/utils/request"

//获取路由
export const getRoutes = ()=>{
    return request.get('getRoutes')
}   