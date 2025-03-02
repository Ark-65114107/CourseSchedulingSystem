
import { defineStore } from "pinia";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { EditArray } from "@/hooks/input/useEdit";
import {
    initialEthnicities,
    initialTeachers,
    initialFacultyTypes
} from "@/data/personnel.js"
import { getTeacherListApi } from "@/api/teacher.api";


export const usePersonnelStore = defineStore('personnel', {
    state: () => ({
        teachers: [],
        teacherNum:0,
        facultyTypes: [],
        ethnicities: [],
        teacherMap: new Map(),
        teacherNameMap: new Map(),
        facultyTypeMap: new Map(),
        ethnicityNameMap: new Map(),
        PersonnelDataInitiate: false
    }),
    actions: {
        initPersonnelDatas() {
            if (!this.PersonnelDataInitiate) {
                this.initEthnicities()
                this.initinitialFacultyTypes()
                this.PersonnelDataInitiate = true
            }
        },
        // getClassroomsByCampus(campusId) {
        //     return this.classrooms.filter((classroom) => {
        //         return classroom.campusId == campusId
        //     })
        // },

        // getClassroomsByCampusAndType(campusId, typeId) {
        //     return this.classrooms.filter((classroom) => {
        //         return classroom.campusId == campusId && classroom.typeId == typeId
        //     })
        // },

        getTeachers(param) {
            return getTeacherListApi(param).then(res => {
                console.log("t",res);
                if (res.meta.code == 200) {
                    this.teacherNum = res.data.total
                    this.teachers = res.data.teachers
                    return 200
                }
            })
        },

        initTeachers() {
            this.initEthnicities()
            this.getTeachers({page:1,size:5})
            this.teacherMap = new Map(this.teachers.map(c => [c.id, c]))
            this.teacherNameMap = new Map(this.teachers.map(c => [c.id, c.name]))
        },
        AddTeacher(value) {
            this.teachers.push(value)
        },

        EditTeacher(obj) {
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

        initEthnicities() {
            this.ethnicities = initialEthnicities;
            this.ethnicityNameMap = new Map(this.ethnicities.map(c => [c.id, c.name]))
        },
        AddEthnicity(value) {
            this.ethnicities.push(value)
        },

        EditEthnicity(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.ethnicities, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            return true
        },
        initinitialFacultyTypes() {
            this.facultyTypes = initialFacultyTypes;
            this.facultyTypeMap = new Map(this.facultyTypes.map(c => [c.id, c.name]))
        },
        AddFacultyType(value) {
            this.facultyTypes.push(value)
        },

        EditFacultyType(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.facultyTypes, key, obj[key], obj.id)
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