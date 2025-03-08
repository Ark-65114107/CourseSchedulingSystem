import { getTaskListApi } from "@/api/task.api";
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
                    this.taskNum = response.data.total
                    this.tasks = response.data.campuses
                    return 200
                }
            }).catch(error => {
                return error
            })
        },
    }
})
