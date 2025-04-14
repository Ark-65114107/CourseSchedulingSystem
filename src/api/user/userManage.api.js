import request from "@/utils/request"


export const getUserList = () => {
    return request.get("showUserList", {
    })
}

export const updateUserStatus = (username,enabled) => {
    return request("updateUserStatus", {
        method:"post",
        data:{
            username,
            enabled
        },
    })
}

