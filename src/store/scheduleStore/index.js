import { getTaskByQueryApi, getTaskListApi } from "@/api/schedule/task/task.api";
import { defineStore } from "pinia";


export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        tasks: [],
        taskNum: 1
    }),
    getters: {},
    actions: {
        getTask(parm = { page: 1, size: 5 }) {
            this.tasks = [{
                id: "dsfdffelpsycongrooghngfh",
                name: "2024上半学期",
                semester: "2024-2025-1",
                creater: "admin",
                createTime: "2025-3-8-14:10:56",
                isEnabled: false,
              },
            ]
            // return getTaskListApi(parm).then(response => {
            //     if (response.meta.code === 200) {
            //         this.taskNum = response.total
            //         this.tasks = response.data
            //         return 200
            //     }
            // }).catch(error => {
            //     return error
            // })
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
