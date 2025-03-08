import { getTaskByQueryApi, getTaskListApi } from "@/api/task.api";
import { defineStore } from "pinia";


export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        tasks: [],
        taskNum: 0
    }),
    getters: {},
    actions: {
        getTask(parm = { page: 1, size: 5 }) {
            return getTaskListApi(parm).then(response => {
                if (response.meta.code === 200) {
                    this.taskNum = response.total
                    this.tasks = response.data
                    return 200
                }
            }).catch(error => {
                return error
            })
        },
        getTaskByQuery(keyword, page = 1, size = 5) {
            return getTaskByQueryApi({ keyword, page, size }).then(res => {
                if (res.meta.code == 200) {
                    this.tasks = res.data.res
                    this.taskNum = res.data.total
                    return 200
                }
                if (res.meta.code == 400) {
                    this.tasks = res.data.res
                    this.taskNum = res.data.total
                    return 400
                }

            }).catch(error => {
                return error
            })
        },

    }
})
