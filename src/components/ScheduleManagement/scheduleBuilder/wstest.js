import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('ws');
const port = 8092;

const wss = new WebSocket.Server({ port });

// 生成未排课程数据
const generateUnassignedCourses = () => {
  const courses = [
    "数学必修课",
    "物理实验课",
    "英语精读",
    "化学专题研讨",
    "编程实践",
    "艺术鉴赏"
  ];
  
  const reasons = [
    "教师时间冲突",
    "教室资源不足",
    "学生选课人数不足",
    "课程时间冲突",
    "设备未就绪"
  ];

  // 随机选择3-5门未排课程
  return Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => {
    return {
      courseName: courses[Math.floor(Math.random() * courses.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      conflictDetails: {
        timeSlot: `周${['一','二','三','四','五'][Math.floor(Math.random()*5)]} ${Math.floor(Math.random()*6+1)}-${Math.floor(Math.random()*6+7)}节`,
        requiredTeacher: `${['张','王','李','陈','刘'][Math.floor(Math.random()*5)]}老师`
      }
    };
  });
};

wss.on('connection', (ws) => {
  let timers = [];
  let progressInterval = null;

  const cleanup = () => {
    timers.forEach(clearTimeout);
    timers = [];
    clearInterval(progressInterval);
  };
  const sendWithRandomDelay = (data, delayRange = [300, 3000]) => {
    const delay = Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0];
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
          // 安全处理 data.data
          const dataContent = data.data ? JSON.stringify(data.data) : '(无数据)';
          console.log(`发送 index ${data.index}: ${dataContent.slice(0, 60)}...`);
        }
        resolve();
      }, delay);
      timers.push(timer);
    });
  };

  ws.on('message', async (data) => {
   
    try {

      const { stage } = JSON.parse(data);
      if (stage !== 0) return;

      // 阶段1：初始化
      await sendWithRandomDelay({ index: 1 }, [100, 500]);

      // 阶段2：进度更新
      let progress = 0;
      while (progress < 100) {
        const increment = Math.min(
          100 - progress,
          Math.floor(10 + Math.random() * 25)
        );
        progress += increment;
        await sendWithRandomDelay({
          index: 2,
          data: { progress: Math.min(progress, 100) }
        }, [500, 2000]);
        if (progress >= 100) break;
      }

      // 阶段3-5
      await sendWithRandomDelay({ index: 3 });
      await sendWithRandomDelay({ index: 4 });
      
      // 修改后的阶段5：未排课程
      await sendWithRandomDelay({
        index: 5,
        data: {
          unassignedCount: 0, // 实际值根据生成的课程数量计算
          courses: generateUnassignedCourses(),
          timestamp: new Date().toISOString()
        }
      });

      // 阶段6：错误信息
      await sendWithRandomDelay({
        index: 6,
        data: { errorMessage: "排课失败：存在未解决的课程冲突" }
      });

    } catch (e) {
      ws.send(JSON.stringify({
        index: 6,
        data: { errorMessage: `请求处理失败: ${e.message}` }
      }));
    }
  });

  ws.on('close', cleanup);
  ws.on('error', cleanup);
});

console.log(`WebSocket 服务运行中：ws://localhost:${port}`);