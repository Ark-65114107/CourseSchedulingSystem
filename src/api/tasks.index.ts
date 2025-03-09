/**
 * 获取待办任务列表
 * @returns {Promise<Array>} 待办任务数组
 */
export async function fetchTasks() {
    // 直接返回模拟数据，不发送实际请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "完成教学任务书提交",
            status: "pending",
          },
          {
            id: 2,
            title: "审核学生选课申请",
            status: "pending",
          },
          {
            id: 3,
            title: "填写教学周报",
            status: "pending",
          },
        ])
      }, 300) // 模拟网络延迟
    })
  }
  
  /**
   * 处理待办任务
   * @param {number} taskId - 任务ID
   * @returns {Promise<Object>} 处理结果
   */
  export async function handleTask(taskId: number) {
    // 模拟处理任务
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `任务 ${taskId} 已处理` })
      }, 300)
    })
  }
  
  