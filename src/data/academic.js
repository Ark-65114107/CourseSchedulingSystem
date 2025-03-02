


export const initialDepartmentTypes = ["院系", "行政类", "其它", "科研机构"]




// export const initialDepartments = 




export const initialMajors = [
    
    {
        id: "major2",
        abbr: "物联网",
        duration: "3",
        name: "物联网技术应用",
        ename: "",
        isEnabled: false,
        facultyId: "fac11111",
        educationalLevel: "本科"
    },
    {
        id: "major3",
        abbr: "网安",
        duration: "3",
        name: "网络安全",
        ename: "",
        isEnabled: true,
        facultyId: "fac11111",
        educationalLevel: "本科"
    },
    {
        id: "major4",
        abbr: "",
        duration: "5",
        name: "母猪产后护理",
        ename: "",
        isEnabled: true,
        facultyId: "fac22222",
        educationalLevel: "专科"
    },
    {
        id: "major5",
        abbr: "",
        duration: "6",
        name: "计算机网络技术",
        ename: "",
        isEnabled: true,
        facultyId: "fac11111",
        educationalLevel: "专科"
    },
    {
        id: "major6",
        abbr: "",
        duration: "6",
        name: "电子商务",
        ename: "e",
        isEnabled: true,
        facultyId: "fac11111",
        educationalLevel: "专科"
    },
]

export const iniitialclasstypies = [
    "普通班级",
    "中本班",
]

export const initialClassses = [
    {
        id: "wlwjsyyzbyth21",
        name: "21物联网技术应用中本一体化",
        abbr: "21物联中本",
        classType: "中本班",
        counsellorId: "",
        headTeacherId: "",
        headTeacherName: "",
        monitorName: "",
        classAssistantName: "",
        educationalLevelId:"4",
        gradeId:"21pt",
        size: 34,
        maxSize: 60,
        genderDistribution: "27/7",
        facultyId: "fac11111",
        facultyName: "",
        majorId: "major2",
        majorName: "物联网技术应用",
        SpecializationId: "",
        campusName: "南浔校区",
        hasAssignedClassroom: true,
        classroomId: "",
        remark: "",
        headTeacherPhoneNumber: "19557717091",
        graduationYearSemester: "",
        isExpanding: false,
        mentorId: ""
    },
    
]

//专业方向
export const iniitialSpecializations = [
    {
        id: "sp1",
        code: "001",
        name: "方向1",
        grade: "2021",
        facultyId: "fac11111",
        majorId: "major1"
    },
    {
        id: "sp114",
        code: "0012",
        name: "方向114",
        grade: "2022",
        facultyId: "fac11111",
        majorId: "major1"
    },
    {
        id: "sp514",
        code: "0014",
        name: "方向awa",
        grade: "2023",
        facultyId: "fac11111",
        majorId: "major1"
    },
    {
        id: "sp514",
        code: "00514",
        name: "qwq",
        grade: "2021",
        facultyId: "fac11111",
        majorId: "major1"
    },
    {
        id: "sp2",
        code: "002",
        name: "方向2",
        grade: "2022",
        facultyId: "fac11111",
        majorId: "major2"
    },
    {
        id: "sp3",
        code: "003",
        name: "方向3",
        grade: "2021",
        facultyId: "fac22222",
        majorId: "major3"
    },
    {
        id: "sp4",
        code: "004",
        name: "方向4",
        grade: "2021",
        facultyId: "fac22222",
        majorId: "major3"
    },
    {
        id: "sp5",
        code: "005",
        name: "方向5",
        grade: "2021",
        facultyId: "fac22222",
        majorId: "major3"
    },
]

export const initialCourseCategories = [
    {
        id: "1",
        name: "实习实训(必修)"
    },
    {
        id: "2",
        name: "专业基础课(必修)"
    },
    {
        id: "3",
        name: "专业核心课(必修)"
    },
    {
        id: "4",
        name: "专业课(选修)"
    },
    {
        id: "5",
        name: "公共课(选修)"
    },
    {
        id: "6",
        name: "公共基础课(必修)"
    },
]
export const initialCourseAttributes = [
    {
        id: "1",
        name: "必修"
    },
    {
        id: "2",
        name: "公共选修课"
    },
    {
        id: "3",
        name: "公共基础课"
    },
    {
        id: "4",
        name: "实习实训"
    },
    {
        id: "5",
        name: "专业核心课"
    },
    {
        id: "6",
        name: "专业选修课"
    },
    {
        id: "7",
        name: "任选"
    },
    {
        id: "8",
        name: "限选"
    },
    {
        id: "9",
        name: "其它"
    }
]

export const initialCourseTypes = [
    {
        id: "A",
        name: "A类(纯理论课)"
    },
    {
        id: "B",
        name: "B类((理论+实践)课)"
    },
    {
        id: "C",
        name: "C类(纯实践课)"
    },
]

export const initialCourseNatures = [
    {
        id: "1",
        name: "必修课"
    },
    {
        id: "2",
        name: "实习实训"
    },
    {
        id: "3",
        name: "公共基础课"

    },
    {
        id: "4",
        name: "公共必修课"
    },
    {
        id: "5",
        name: "公共选修课"
    },
    {
        id: "6",
        name: "专业选修课"
    },
    {
        id: "7",
        name: "专业拓展课"
    },
]
export const iniitialCourses = [
    {
        id: "course1",
        code: "10086",
        name: "高等数学",
        ename: "LowUnequlMath",
        courseCategoryId: "1",
        courseAttributeId: "1",
        courseTypeId: "A",
        courseNatureId: "1",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 100,
        theoreticalHours: 30,
        laboratoryHours: 30,
        computerLabHours: 30,
        practicalHours: 10,
        otherHours: 0,
        weeklyClassHours: 4,
        credits: 7,
        isPurelyPractical: false,
    },
    {
        id: "course2",
        code: "10087",
        name: "高等嘤语",
        ename: "eeeeeeeeenglish",
        courseCategoryId: "2",
        courseAttributeId: "1",
        courseTypeId: "B",
        courseNatureId: "2",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 90,
        theoreticalHours: 30,
        laboratoryHours: 30,
        computerLabHours: 30,
        practicalHours: 0,
        otherHours: 0,
        weeklyClassHours: 4,
        credits: 7,
        isPurelyPractical: false,
    },
    {
        id: "course3",
        code: "10088",
        name: "C井程序设计",
        ename: "cPlusPlusPlusPlus",
        courseCategoryId: "3",
        courseAttributeId: "1",
        courseTypeId: "C",
        courseNatureId: "1",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 120,
        theoreticalHours: 30,
        laboratoryHours: 40,
        computerLabHours: 30,
        practicalHours: 10,
        otherHours: 10,
        weeklyClassHours: 4,
        credits: 11,
        isPurelyPractical: false,
    },
    {
        id: "course4",
        code: "10089",
        name: "军事理论",
        ename: "Booooooooooooooom",
        courseCategoryId: "4",
        courseAttributeId: "3",
        courseTypeId: "B",
        courseNatureId: "4",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 100,
        theoreticalHours: 30,
        laboratoryHours: 30,
        computerLabHours: 30,
        practicalHours: 10,
        otherHours: 0,
        weeklyClassHours: 4,
        credits: 7,
        isPurelyPractical: true,
    },
    {
        id: "course5",
        code: "10234",
        name: "保安绊线点位教学",
        ename: "ggggggggive me a corpse",
        courseCategoryId: "5",
        courseAttributeId: "1",
        courseTypeId: "A",
        courseNatureId: "1",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 100,
        theoreticalHours: 30,
        laboratoryHours: 30,
        computerLabHours: 30,
        practicalHours: 10,
        otherHours: 0,
        weeklyClassHours: 4,
        credits: 7,
        isPurelyPractical: false,
    },
    {
        id: "course6",
        code: "100346",
        name: "uzi跳枪教学",
        ename: "otto",
        courseCategoryId: "6",
        courseAttributeId: "2",
        courseTypeId: "A",
        courseNatureId: "4",
        facultyId: "",
        isEnabled: true,
        totalClassHours: 100,
        theoreticalHours: 30,
        laboratoryHours: 30,
        computerLabHours: 30,
        practicalHours: 10,
        otherHours: 0,
        weeklyClassHours: 4,
        credits: 7,
        isPurelyPractical: false,
    },
]


// export const iniitialGrades = 


export const initialEducationalLevels = [
    {
        id: "1",
        name: "专科",
        max: 2,
        gradeNames: [
            "大一",
            "大二",
            "大三"
        ]
    }, {
        id: "2",
        name: "中职",
        max: 2,
        gradeNames: [
            "中职一年级",
            "中职二年级",
            "中职三年级"
        ]
    }, {
        id: "3",
        name: "专科(五年制)",
        max: 4,
        gradeNames: [
            "中职一年级",
            "中职二年级",
            "中职三年级",
            "大一",
            "大二"
        ]
    }, {
        id: "4",
        name: "本科",
        max: 3,
        gradeNames: [
            "大一",
            "大二",
            "大三",
            "大四",
        ]
    }
]


export const iniitialSemesters = [
    {
        id: "s1",
        name: "2024-2025-1",
        academicYear: "2024-2025",
        semester: 1,
        startDate: "",
        endDate: ""
    },
    {
        id: "s2",
        name: "2024-2025-2",
        academicYear: "2024-2025",
        semester: 2,
        startDate: "",
        endDate: ""
    },
    {
        id: "s3",
        name: "2023-2024-1",
        academicYear: "2023-2024",
        semester: 1,
        startDate: "",
        endDate: ""

    },
    {
        id: "s4",
        name: "2023-2024-2",
        academicYear: "2023-2024",
        semester: 2,
        startDate: "",
        endDate: ""
    },

]

export const semesterOrders = [
    "第一学期", "第二学期", "第三学期", "第四学期"
]