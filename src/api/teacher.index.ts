/**
 * 获取教师数据
 * 用于获取教师的基本信息，包括姓名、总课程数、今日课程数、本周课程数、在岗状态和学期状态
 * @returns {Promise<Object>} 教师信息对象
 */
import axios from 'axios';

export async function fetchTeacherData() {
  // 获取时
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // 检查是否有token和username
  if (!token || !username) {
    console.warn('未找到token或username，将返回模拟数据');
    return getMockData();
  }

  try {
    // 使用更具体的API路径
    const response = await axios.get('/api/teacher/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        username: username
      }
    });

    // 检查响应是否有效
    if (response && response.data) {
      console.log('成功获取教师数据:', response.data);
      return response.data;
    } else {
      console.warn('API返回了空数据，将使用模拟数据');
      return getMockData();
    }
  } catch (error) {
    console.error('获取教师数据失败:', error);
    // 返回模拟数据
    return getMockData();
  }
}

// 抽取模拟数据到单独的函数
function getMockData() {
  return new Promise((resolve) => {
    console.log('正在返回模拟数据...');
    setTimeout(() => {
      const mockData = {
        name: "张教授",
        totalCourses: 6,
        todayCourses: 2,
        weekCourses: 12,
        workStatus: "在岗",
        semesterStatus: "进行中",
      };
      console.log('模拟数据:', mockData);
      resolve(mockData);
    }, 300); // 模拟网络延迟
  });
}