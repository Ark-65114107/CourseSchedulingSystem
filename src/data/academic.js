


export const initialDepartmentTypes = ["院系","行政类","其它","科研机构"]




export const initialDepartments = [
    {
        id: "fac11111",
        code: "114514",
        name: "计算机科学与技术学院",
        ename: "School of Computer Science and Technology",
        abbr: "计科",
        type: "院系",
        teachingbuildingId: "",
        isEntity: true,
        isCourseOffering: true,
        isTeaching: true,
        isEnabled: true,
        isTeachingResearchOffice: true
    },
    {
        id: "fac22222",
        code: "222222",
        name: "水利水电学院",
        englishname: "slsdxy",
        abbr: "水专",
        isEntity: true,
        type: "院系",
        teachingbuildingId: "",
        isCourseOffering: true,
        isTeaching: true,
        isEnabled: true,
        isTeachingResearchOffice: false
    },
    {
        id: "fac33333",
        code: "12345",
        name: "教务处",
        englishname: "teachMe",
        abbr: "教÷",
        isEntity: true,
        type: "行政类",
        teachingbuildingId: "",
        isCourseOffering: false,
        isTeaching: false,
        isEnabled: true,
        isTeachingResearchOffice: false
    },
    {
        id: "gggraet",
        code: "114444",
        name: "学校领导",
        englishname: "boss",
        abbr: "",
        isEntity: true,
        type: "行政类",
        teachingbuildingId: "",
        isCourseOffering: false,
        isTeaching: false,
        isEnabled: true,
        isTeachingResearchOffice: false
    },
]


export const educationalLevels = [
    "专科", "中职", "本科", "专科(五年制)", "本科", "硕士", "博士"
]

export const initialMajors = [
    {
        id: "major1",
        abbr: "软工",
        duration: "3",
        name: "软件工程",
        ename: "",
        isEnabled: true,
        facultyId: "fac11111",
        educationalLevel: "本科"
    },
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
        name: "妊娠过程影像的研究与应用",
        ename: "orz-i",
        isEnabled: true,
        facultyId: "fac11111",
        educationalLevel: "专科"
    },
    {
        id: "major6",
        abbr: "",
        duration: "6",
        name: "海绵体材料技术应用",
        ename: "deer-pipe",
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
        id:"wlwjsyyzbyth21",
        name:"21物联网技术应用中本一体化",
        abbr:"21物联中本",
        duration:3,
        educationalLevel:"中职",
        classType:"中本班",
        counsellorId:"",
        headTeacherId:"",
        headTeacherName:"",
        monitorName:"",
        classAssistantName:"",
        enrollmentYear:"2021",
        graduationYear:"2024",
        isGraduated:true,
        size:34,
        maxSize:60,
        genderDistribution:"27/7",
        facultyId:"",
        facultyName:"",
        majorId:"",
        majorName:"",
        SpecializationId:"",
        campusName:"",
        hasAssignedClassroom:true,
        classroomId:"",
        remark:"",
        headTeacherPhoneNumber:"19557717091",
        graduationYearSemester:"",
        isExpanding:false,
        mentorId:""
    },
    {
        id:"rgzb241",
        name:"24软件工程中本一体化",
        abbr:"软工中本24-1",
        duration:3,
        educationalLevel:"本科",
        classType:"普通班",
        counsellorName:"",
        headTeacherName:"",
        headTeacherId:"",
        monitorName:"",
        classAssistantName:"",
        enrollmentYear:"2021",
        graduationYear:"2024",
        isGraduated:true,
        size:35,
        maxSize:60,
        genderDistribution:"28/7",
        facultyId:"",
        majorId:"",
        majorName:"",
        SpecializationId:"",
        campusName:"",
        hasAssignedClassroom:true,
        classroomId:"",
        remark:"",
        headTeacherPhoneNumber:"19557739619",
        graduationYearSemester:"",
        isExpanding:false,
        mentorId:""
    },
    {
        id:"wlwjsyyzbyth25",
        name:"25软件工程中本一体化",
        abbr:"软工中本24-1",
        duration:3,
        educationalLevel:"本科",
        classType:"普通班",
        counsellorName:"",
        headTeacherName:"",
        headTeacherId:"",
        monitorName:"",
        classAssistantName:"",
        enrollmentYear:"2021",
        graduationYear:"2024",
        isGraduated:true,
        size:31,
        maxSize:60,
        genderDistribution:"27/7",
        facultyId:"",
        majorId:"",
        majorName:"",
        SpecializationId:"",
        campusName:"",
        hasAssignedClassroom:true,
        classroomId:"",
        remark:"",
        headTeacherPhoneNumber:"19557717091",
        graduationYearSemester:"",
        isExpanding:false,
        mentorId:""
    },
    {
        id:"wlwjsyyzbyth26",
        name:"26软件工程中本一体化",
        abbr:"软工中本26-1",
        duration:3,
        educationalLevel:"本科",
        classType:"普通班",
        counsellorName:"",
        headTeacherName:"",
        headTeacherId:"",
        monitorName:"",
        classAssistantName:"",
        enrollmentYear:"2021",
        graduationYear:"2024",
        isGraduated:true,
        size:35,
        maxSize:60,
        genderDistribution:"28/7",
        facultyId:"",
        majorId:"",
        majorName:"",
        SpecializationId:"",
        campusName:"",
        hasAssignedClassroom:true,
        classroomId:"",
        remark:"",
        headTeacherPhoneNumber:"19557717091",
        graduationYearSemester:"",
        isExpanding:false,
        mentorId:""
    },
    {
        id:"wlwjsyyzbyth27",
        name:"27软件工程中本一体化",
        abbr:"软工中本27-1",
        duration:3,
        educationalLevel:"本科",
        classType:"普通班",
        counsellorName:"",
        counsellorId:"",
        headTeacherName:"",
        headTeacherId:"",
        monitorName:"",
        classAssistantName:"",
        enrollmentYear:"2021",
        graduationYear:"2024",
        isGraduated:true,
        size:34,
        maxSize:60,
        genderDistribution:"27/7",
        facultyId:"",
        majorId:"",
        majorName:"",
        SpecializationId:"",
        campusId:"",
        hasAssignedClassroom:true,
        classroomId:"",
        remark:"",
        headTeacherPhoneNumber:"19557717091",
        graduationYearSemester:"",
        isExpanding:false,
        mentorName:"",
        mentorId:""
    },
]


export const iniitialSpecializations = [
    {
        
    }
]