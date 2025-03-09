import request from "@/utils/request"


export const getUserList = (page, size) => {
    return request.get("getuserList", {
        params: {
            pageNum: page,
            size: size,
            isAbort: true

        }
    })
}