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
  return axios.get(`${API_BASE_URL}/downloads/file/${fileId}`, {
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
      if (fileNameMatch.length === 2) fileName = fileNameMatch[1]
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
  return axios.get(`${API_BASE_URL}/downloads/schedule`, {
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