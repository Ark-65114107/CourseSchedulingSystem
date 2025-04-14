import axios from 'axios' // 假设你使用axios进行HTTP请求

const API_BASE_URL = 'http://' // 根据你的实际后端URL配置

/**
 * 获取可下载文件列表
 * @returns {Promise<Array>} 文件数组
 */
export async function fetchDownloadFiles() {
  // 替换为实际API调用
  return axios.get(`${API_BASE_URL}/files/download`)
    .then(response => response.data)
    .catch(error => {
      console.error('获取下载文件列表失败:', error)
      throw error
    })
}

/**
 * 下载指定文件
 * @param {number} fileId - 文件ID
 * @returns {Promise<Object>} 下载结果
 */
export async function downloadFile(fileId: number) {
  // 实际下载文件的API调用
  return axios.get(`${API_BASE_URL}/downloads/file/`, {
    responseType: 'blob' // 指定响应类型为blob
  }).then(response => {
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    // 从响应头获取文件名，如果有的话
    const contentDisposition = response.headers['content-disposition']
    let fileName = `file-${fileId}`
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
      if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1]
    }

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, fileName }
  }).catch(error => {
    console.error(`下载文件 ${fileId} 失败:`, error)
    throw error
  })
}

/**
 * 下载课表
 * @param {string} format - 下载格式，'excel'或'pdf'
 * @returns {Promise<Object>} 下载结果
 */
export async function downloadSchedule(format = "excel") {
  // 实际下载课表的API调用
  return axios.get(`${API_BASE_URL}/files/download/课表下载.xlsx`, {
    params: { format },
    responseType: 'blob' // 指定响应类型为blob
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `schedule.${format}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, format }
  }).catch(error => {
    console.error(`下载课表(${format}格式)失败:`, error)
    throw error
  })
}

/**
 * 下载教学任务书模板
 * @returns {Promise<Object>} 下载结果
 */
export async function downloadTeachingTaskTemplate() {
  return axios.get(`${API_BASE_URL}/files/download/教学任务书模板.docx`, {
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '教学任务书模板.docx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, fileName: '教学任务书模板.docx' }
  }).catch(error => {
    console.error('下载教学任务书模板失败:', error)
    throw error
  })
}

/**
 * 下载教师手册
 * @returns {Promise<Object>} 下载结果
 */
export async function downloadTeacherManual() {
  return axios.get(`${API_BASE_URL}/files/download/教师手册2025版.pdf`, {
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '教师手册2025版.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, fileName: '教师手册2025版.pdf' }
  }).catch(error => {
    console.error('下载教师手册失败:', error)
    throw error
  })
}

/**
 * 下载课程表导入模板
 * @returns {Promise<Object>} 下载结果
 */
export async function downloadScheduleImportTemplate() {
  return axios.get(`${API_BASE_URL}/files/download/课程表导入模板.xlsx`, {
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '课程表导入模板.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, fileName: '课程表导入模板.xlsx' }
  }).catch(error => {
    console.error('下载课程表导入模板失败:', error)
    throw error
  })
}

/**
 * 下载各种系统模板文件
//  * @param {string} fileType - 文件类型: 'teachingTask', 'teacherManual', 'scheduleImport'
//  * @returns {Promise<Object>} 下载结果
 */
// export async function downloadTemplateFile(fileType: string) {
//   // 文件类型与文件名和API路径的映射
//   const fileMap = {
//     teachingTask: {
//       fileName: '教学任务书模板.docx',
//       path: '/downloads/templates/teaching-task'
//     },
//     teacherManual: {
//       fileName: '教师手册2025版.pdf',
//       path: '/downloads/manuals/teacher'
//     },
//     scheduleImport: {
//       fileName: '课程表导入模板.xlsx',
//       path: '/downloads/templates/schedule-import'
//     }
//   };

//   if (!fileMap[fileType]) {
//     throw new Error(`未知的文件类型: ${fileType}`);
//   }

//   const { fileName, path } = fileMap[fileType];

//   return axios.get(`${API_BASE_URL}${path}`, {
//     responseType: 'blob'
//   }).then(response => {
//     const url = window.URL.createObjectURL(new Blob([response.data]))
//     const link = document.createElement('a')
//     link.href = url
//     link.setAttribute('download', fileName)
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)

//     return { success: true, fileName }
//   }).catch(error => {
//     console.error(`下载${fileName}失败:`, error)
//     throw error
//   })
// }