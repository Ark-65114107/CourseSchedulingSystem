
import { defineStore } from "pinia";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { EditArray } from "@/hooks/input/useEdit";
import {
    initialDepartments,
    initialDepartmentTypes,
    initialMajors,
    initialEducationalLevels,
    initialClassses,
    iniitialclasstypies,
    iniitialCourses,
    initialCourseNatures,
    initialCourseTypes,
    initialCourseAttributes,
    initialCourseCategories,
    iniitialSpecializations,
    iniitialGrades,
    iniitialSemesters,
} from "@/data/academic"
import getAcademicYears from "@/utils/getAcademicYears";


export const useAcademicStore = defineStore('academic', {
    state: () => ({
        departments: [],//部门
        departmentTypes: [],//部门类别

        classes: [],//班级
        classTypies: [],//班级类型

        majors: [],//专业
        specializations: [],//专业方向

        courses: [],//课程
        courseNatures: [],//课程属性
        courseTypes: [],//课程类型
        courseAttributes: [],//课程性质
        courseCategories: [],//课程类别

        grades: [],//年级
        educationalLevels: [],//学段

        semesters: [],//学期

        academicYears: [],//学年


        departmentMap: new Map(),
        departmentNameMap: new Map(),
        departmentTypeMap: new Map(),
        majorMap: new Map(),
        majorNameMap: new Map(),
        classMap: new Map(),
        classNameMap: new Map(),
        courseNameMap: new Map(),
        courseNatureNameMap: new Map(),
        courseTypeNameMap: new Map(),
        courseAttributeNameMap: new Map(),
        courseCategoryNameMap: new Map(),
        gradeNameMap: new Map(),
        gradeMap: new Map(),
        specializationNameMap: new Map(),
        educationalLevelMap: new Map(),
        educationalLevelNameMap: new Map(),
        semesterNameMap: new Map(),
        AcademicDatainitiate: false
    }),
    getters: {
        faculties: (state) => {
            return state.departments.filter(d => {
                return d.type == "院系"
            })
        },
    },
    actions: {
        initAcademicDatas() {
            if (!this.AcademicDatainitiate) {
                this.initDepartments()
                this.initDepartmentTypes()
                this.initMajors()
                this.initClasses()
                this.initCourses()
                this.initGrades()
                this.initSpecializations()
                this.initEducationalLevels()
                this.initSemesters()
                this.classTypies = iniitialclasstypies
                this.academicYears = getAcademicYears()
                this.AcademicDatainitiate = true
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
        getMajorsByfaculty(facultyId) {
            return this.majors.filter((major) => {
                return major.facultyId == facultyId
            })
        },
        getGradesByEducationId(Id) {
            return this.grades.filter((grade) => {
                return grade.educationalLevelId == Id
            })
        },


        initDepartments() {
            this.departments = initialDepartments;
            this.departmentMap = new Map(this.departments.map(c => [c.id, c]))
            this.departmentNameMap = new Map(this.departments.map(c => [c.id, c.name]))
        },
        AddDepartment(value) {
            this.departments.push(value)
            this.departmentMap = new Map(this.departments.map(c => [c.id, c]))
            this.departmentNameMap = new Map(this.departments.map(c => [c.id, c.name]))
        },

        EditDepartment(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.departments, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.departmentMap = new Map(this.departments.map(c => [c.id, c]))
            this.departmentNameMap = new Map(this.departments.map(c => [c.id, c.name]))
            return true
        },

        initDepartmentTypes() {
            this.departmentTypes = initialDepartmentTypes;
            this.departmentTypeMap = new Map(this.departmentTypes.map(c => [c.id, c]))
        },
        AddDepartmentType(value) {
            this.departmentTypes.push(value)
            this.departmentTypeMap = new Map(this.departmentTypes.map(c => [c.id, c]))
        },

        EditDepartmentType(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.departmentTypes, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.departmentTypeMap = new Map(this.departmentTypes.map(c => [c.id, c]))
            return true
        },
        initMajors() {
            this.majors = initialMajors;
            this.majorNameMap = new Map(this.majors.map(c => [c.id, c.name]))
            this.majorMap = new Map(this.majors.map(c => [c.id, c]))
        },
        AddMajor(value) {
            this.majors.push(value)
            this.majorNameMap = new Map(this.majors.map(c => [c.id, c.name]))
            this.majorMap = new Map(this.majors.map(c => [c.id, c]))
        },

        EditMajor(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.majors, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.majorNameMap = new Map(this.majors.map(c => [c.id, c.name]))
            this.majorMap = new Map(this.majors.map(c => [c.id, c]))
            return true
        },

        initSpecializations() {
            this.specializations = iniitialSpecializations;
            this.specializationNameMap = new Map(this.specializations.map(c => [c.id, c.name]))
        },
        AddSpecialization(value) {
            this.specializations.push(value)
            this.specializationNameMap = new Map(this.specializations.map(c => [c.id, c.name]))
        },

        Editspecialization(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.specializations, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.specializationNameMap = new Map(this.specializations.map(c => [c.id, c.name]))
            return true
        },
        initEducationalLevels() {
            this.educationalLevels = initialEducationalLevels;
            this.educationalLevelNameMap = new Map(this.educationalLevels.map(c => [c.id, c.name]))
            this.educationalLevelMap = new Map(this.educationalLevels.map(c => [c.id, c]))
        },
        AddEducationalLevel(value) {
            this.educationalLevels.push(value)
            this.educationalLevelNameMap = new Map(this.educationalLevels.map(c => [c.id, c.name]))
            this.educationalLevelMap = new Map(this.educationalLevels.map(c => [c.id, c]))
        },


        EditEducationalLevel(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.educationalLevels, key, obj[key], obj.id)
                }
                this.educationalLevelNameMap = new Map(this.educationalLevels.map(c => [c.id, c.name]))
                this.educationalLevelMap = new Map(this.educationalLevels.map(c => [c.id, c]))
            }
            else {
                return false
            }

            return true
        },

        initGrades() {
            this.grades = iniitialGrades;
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
        },
        AddGrade(value) {
            this.grades.push(value)
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
        },

        EditGrade(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.grades, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
            return true
        },
        initGrades() {
            this.grades = iniitialGrades;
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
            this.gradeMap = new Map(this.grades.map(c => [c.id, c]))
        },
        AddGrade(value) {
            this.grades.push(value)

            this.gradeMap = new Map(this.grades.map(c => [c.id, c]))
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
        },

        EditGrade(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.grades, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
            this.gradeMap = new Map(this.grades.map(c => [c.id, c]))
            return true
        },
        initSemesters() {
            this.semesters = iniitialSemesters;
            this.semesterNameMap = new Map(this.semesters.map(c => [c.id, c.name]))
        },
        AddSemester(value) {
            this.semesters.push(value)
            this.semesterNameMap = new Map(this.semesters.map(c => [c.id, c.name]))
        },

        EditSemester(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.semesters, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.gradeNameMap = new Map(this.grades.map(c => [c.id, c.name]))
            return true
        },

        initClasses() {
            this.classes = initialClassses;
            this.classNameMap = new Map(this.classes.map(c => [c.id, c.name]))
            this.classMap = new Map(this.classes.map(c => [c.id, c]))
        },
        AddClass(value) {
            this.classes.push(value)
            this.classNameMap = new Map(this.classes.map(c => [c.id, c.name]))
            this.classMap = new Map(this.classes.map(c => [c.id, c]))
        },

        EditClass(obj, oldId) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") {
                        if (obj.id != oldId) {
                            this.classes.filter((c) => {
                                return c.id == oldId
                            })[0].id = obj.id
                            continue
                        }
                        continue
                    }
                    EditArray(this.classes, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.classNameMap = new Map(this.classes.map(c => [c.id, c.name]))
            this.classMap = new Map(this.classes.map(c => [c.id, c]))
            return true
        },




        initCourses() {
            this.courses = iniitialCourses;
            this.courseAttributes = initialCourseAttributes
            this.courseCategories = initialCourseCategories
            this.courseNatures = initialCourseNatures
            this.courseTypes = initialCourseTypes
            this.courseNameMap = new Map(this.courses.map(c => [c.id, c.name]))
            this.courseAttributeNameMap = new Map(this.courseAttributes.map(c => [c.id, c.name]))
            this.courseCategoryNameMap = new Map(this.courseCategories.map(c => [c.id, c.name]))
            this.courseNatureNameMap = new Map(this.courseNatures.map(c => [c.id, c.name]))
            this.courseTypeNameMap = new Map(this.courseTypes.map(c => [c.id, c.name]))
        },
        AddCourse(value) {
            this.courses.push(value)
            this.courseNameMap = new Map(this.courses.map(c => [c.id, c.name]))
        },

        EditCourse(obj) {
            if (obj) {
                for (const key of Object.keys(obj)) {
                    if (key == "id") continue
                    EditArray(this.courses, key, obj[key], obj.id)
                }
            }
            else {
                return false
            }
            this.courseNameMap = new Map(this.courses.map(c => [c.id, c.name]))
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