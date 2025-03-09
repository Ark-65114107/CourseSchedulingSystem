/**
 * 获取通知数据
 * 用于获取系统通知，包括通知ID、内容、时间等信息
 * @returns {Promise<Array>} 通知数组
 */
export async function fetchNotificationData() {
    // 直接返回模拟数据，不发送实际请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            content: "关于2025年春季学期教学任务的通知",
            time: "2025-03-08 10:00",
          },
          {
            id: 2,
            content: "请及时完成本学期教学评估工作",
            time: "2025-03-07 14:30",
          },
          {
            id: 3,
            content: "教师培训活动将于下周三下午2点在第一会议室举行",
            time: "2025-03-06 09:15",
          },
        ])
      }, 300) // 模拟网络延迟
    })
  }
  
  