import { defineStore } from "pinia";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { EditArray } from "@/hooks/input/useEdit";
import {
    initialClassrooms,
    initialTeachingBuildings,
    initialclassroomTypes
} from "@/data/locations"

import { addCampusApi, deleteCampusApi, getCampusByQueryApi, getCampusListApi, updateCampusApi } from "@/api/basicData/campus.api";
import { ElMessage } from "element-plus";
import { getClassroomListApi } from "@/api/basicData/classroom.api";
import { getGradeByQueryApi } from "@/api/basicData/grade.api";
import { getAllTeachingBuildingApi, getTeachingBuildingByQueryApi } from "@/api/basicData/teachingbuilding.api";



export const useLocationStore = defineStore('location', {
    state: () => ({
        campuses: [],
        campusNum: 0,
        teachingbuildings: [],
        teachingbuildingNum:0,
        classrooms: [],
        classroomNum: 0,
        classroomtypes: [],
        classroomMap: new Map(),
        classroomNameMap: new Map(),
        classroomTypeMap: new Map(),
        classroomTypeNameMap: new Map(),
        campusMap: new Map(),
        campusNameMap: new Map(),
        teachingbuildingMap: new Map(),
        teachingbuildingNameMap: new Map(),
        locationDataInitiate: false
    }),
    actions: {
        initLocationDatas() {
            if (!this.locationDataInitiate) {
                this.getCampus()
                this.initTeachingBuildings()
                this.initClassrooms()
                this.initClassroomTypes()
                this.locationDataInitiate = true
            }
        },


        getCampus() {
            getAllTeachingBuildingApi().then(res => {
                if (res) {
                    if(res.meta.code == 200) {
                        let teachingbuildings = res.data;
                        teachingbuildings.foreach((teachingbuilding)=>{
                            if(!this.campuses.includes(teachingbuilding.campusId))[
                                this.campuses.push(teachingbuilding.campusId)
                            ]
                        })
                    }
                }
            })
        },

        getTeachingBuilding(parm = { page: 1, size: 5 }) {
            return getTeachingBuildingListApi(parm).then(res => {
                if (res.meta.code === 200) {
                    this.teachingbuildingNum = res.total
                    this.teachingbuildings = res.data
                    return 200
                }
            }).catch(error => {
                return error
            })
        },

        //查询keyword对象,如{keyName1:keyValue1,keyName2:keyValue2}...]
        getTeachingBuildingByQuery(keyword, page = 1, size = 5) {
            return getTeachingBuildingByQueryApi({ keyword, page, size }).then(res => {
                if (res.meta.code == 200) {
                    this.teachingbuildings = res.data
                    this.teachingbuildingNum = res.total
                    return 200
                }
                if (res.meta.code == 400) {
                    this.teachingbuildings = res.data
                    this.teachingbuildingNum = res.total
                    return 400
                }
            }).catch(error => {
                return error
            })
        },
        //查询keyword对象,如{keyName1:keyValue1,keyName2:keyValue2}...]
        getCampusByQuery(keyword, page = 1, size = 5) {
            return getCampusByQueryApi({ keyword, page, size }).then(res => {
                if (res.meta.code == 200) {
                    this.campuses = res.data.res
                    this.campusNum = res.data.total
                    this.campusNameMap = new Map(this.campuses.map(c => [c.id, c.name]))
                    this.campusMap = new Map(this.campuses.map(c => [c.id, c]))
                    return 200
                }
                if (res.meta.code == 400) {
                    this.campuses = res.data.res
                    this.campusNum = res.data.total
                    this.campusNameMap = new Map(this.campuses.map(c => [c.id, c.name]))
                    this.campusMap = new Map(this.campuses.map(c => [c.id, c]))
                    return 400
                }

            }).catch(error => {
                return error
            })
        },


        getClassroom(parm = { page: 1, size: 5 }) {
            return getClassroomListApi(parm).then(response => {
                console.log(response);
                if (response.meta.code === 200) {
                    this.classroomNum = response.data.total
                    this.classrooms = response.data.classrooms
                    this.classroomNameMap = new Map(this.classrooms.map(c => [c.id, c.name]))
                    this.classroomMap = new Map(this.classrooms.map(c => [c.id, c]))
                    return 200
                }
            }).catch(error => {
                return error
            })
        },
        getClassroomsByCampus(campusId) {
            return this.classrooms.filter((classroom) => {
                return classroom.campusId == campusId
            })
        },
        getClassroomsByBuilding(BuildingId) {
            return this.classrooms.filter((classroom) => {
                return classroom.teachingbuildingId == BuildingId
            })
        },
        getClassroomsByType(TypeId) {
            return this.classrooms.filter((classroom) => {
                return classroom.typeId == TypeId
            })
        },

        getClassroomsByBuildingAndType(BuildingId, typeId) {
            return this.classrooms.filter((classroom) => {
                return classroom.teachingbuildingId == BuildingId && classroom.typeId == typeId
            })
        },
        getClassroomsByCampusAndType(campusId, typeId) {
            return this.classrooms.filter((classroom) => {
                return classroom.campusId == campusId && classroom.typeId == typeId
            })
        },



        initCampuses() {
            this.initTeachingBuildings()
            this.getCampus()
        },
        AddCampus(value, pageInfo) {
            return addCampusApi(value).then(res => {
                if (res.meta.code === 200) {
                    console.log(res);
                    if (pageInfo.page) {
                        pageInfo.page = 1
                    }
                    this.getCampus(pageInfo)
                    ElMessage.success(res.data.msg)
                    return true
                }
                return false
            }).catch(error => {
                console.log(error);
                ElMessage.error(error)
                return false
            })
        },

        EditCampus(obj, pageInfo) {
            return updateCampusApi(obj).then(res => {
                if (res.meta.code === 200) {
                    console.log(res);
                    this.getCampus(pageInfo)
                    ElMessage.success(res.data.msg)
                    return true
                }
                return false
            }, error => {
                console.log(error);
                return false
            })
        },
        DeleteCampus(value) {
            return deleteCampusApi(value).then(res => {
                if (res.meta.code === 200) {
                    console.log(res);
                    this.getCampus()
                    ElMessage.success(res.data.msg)
                    return true
                }
                return false
            }, error => {
                console.log(error);
                return false
            })
        },



        initTeachingBuildings() {
            this.teachingbuildings = initialTeachingBuildings;
        },

        AddTeachingBuilding(value) {
            this.teachingbuildings.push(value)
        },

        EditTeachingBuilding(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.teachingbuildings, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            return true
        },
        initClassrooms() {
            this.getClassroom({ page: 1, size: 5 })
            this.classroomtypes = initialclassroomTypes;
            this.classroomNameMap = new Map(this.classrooms.map(c => [c.id, c.name]))
        },
        AddClassroom(value) {
            this.classrooms.push(value)
        },
        EditClassroom(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.classrooms, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            return true
        },
        initClassroomTypes() {
            this.classroomtypes = initialclassroomTypes
            this.classroomTypeMap = new Map(this.classroomtypes.map(c => [c.id, c]))
            this.classroomTypeNameMap = new Map(this.classroomtypes.map(c => [c.id, c.name]))
        },
        AddType(value) {
            this.classroomtypes.push(value)
        },
        EditType(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.classroomtypes, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            return true
        },






        // Add(value) {
        //     this.campuses.push(value)
        // },
        // edit(obj) {
        //     if (obj) {
        //         for (const key of Object.keys(obj)) {
        //             if (key == "id") continue
        //             EditArray(this.campuses, key, obj[key], obj.id)
        //         }
        //     }
        //     else {
        //         return false
        //     }
        //     return true
        // },
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