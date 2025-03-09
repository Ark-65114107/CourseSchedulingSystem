/**
 * 获取可下载文件列表
 * @returns {Promise<Array>} 文件数组
 */
export async function fetchDownloadFiles() {
    // 直接返回模拟数据，不发送实际请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "教学任务书模板.docx",
            type: "document",
          },
          {
            id: 2,
            name: "教师手册2025版.pdf",
            type: "document",
          },
          {
            id: 3,
            name: "课程表导入模板.xlsx",
            type: "spreadsheet",
          },
        ])
      }, 300) // 模拟网络延迟
    })
  }
  
  /**
   * 下载指定文件
   * @param {number} fileId - 文件ID
   * @returns {Promise<Object>} 下载结果
   */
  export async function downloadFile(fileId: number) {
    // 模拟下载文件
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`模拟下载文件ID: ${fileId}`)
        alert(`文件下载已开始，文件ID: ${fileId}`)
        resolve({ success: true })
      }, 500)
    })
  }
  
  /**
   * 下载课表
   * @param {string} format - 下载格式，'excel'或'pdf'
   * @returns {Promise<Object>} 下载结果
   */
  export async function downloadSchedule(format = "excel") {
    // 模拟下载课表
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`模拟下载课表，格式: ${format}`)
        alert(`课表下载已开始，格式: ${format}`)
        resolve({ success: true })
      }, 500)
    })
  }
  
  