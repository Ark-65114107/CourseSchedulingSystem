<template>
  <hr>
  <div class="index">
    <img src="@/assets/logo3.jpg" alt="logo3">
  </div>
  <hr>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="教师信息" name="first">
      <div class="teacherinf">
        <ul>
          <li v-for="user in users" :key="user.content">{{ user.content }}</li>
        </ul>
      </div>
    </el-tab-pane>
    <el-tab-pane label="本周课表" name="second">
      <table></table>
    </el-tab-pane>
    <el-tab-pane label="信息检索" name="third">Role</el-tab-pane>
    <el-tab-pane label="帮助文档" name="fourth">
      <div class="help">

         一、系统概述
        高校排课系统是一个用于高效管理和自动排课的工具，支持教师、课程、教室和学生信息管理，同时提供自动排课和手动排课功能，确保教学资源合理分配。

        ---

         二、数据管理

         1. 教师信息管理
        - 功能：添加、编辑、删除、查询教师信息。
        - 操作：进入“数据管理” > “教师信息管理”，点击相应按钮完成操作。

         2. 课程信息管理
        - 功能：添加、编辑、删除、查询课程信息。
        - 操作：进入“数据管理” > “课程信息管理”，点击相应按钮完成操作。

         3. 教室信息管理
        - 功能：添加、编辑、删除、查询教室信息。
        - 操作：进入“数据管理” > “教室信息管理”，点击相应按钮完成操作。

         4. 学生信息管理
        - 功能：添加、编辑、删除、查询学生信息。
        - 操作：进入“数据管理” > “学生信息管理”，点击相应按钮完成操作。

        ---

         三、排课管理

         1. 自动排课
        - 功能：根据预设规则自动生成课程表。
        - 操作：进入“排课管理” > “自动排课”，设置规则后点击“生成课程表”。

         2. 手动排课
        - 功能：手动分配课程、教师、教室和时间。
        - 操作：进入“排课管理” > “手动排课”，选择课程、教师、教室和时间后保存。

         3. 课程表查询
        - 功能：查询教师、学生、教室的课程表。
        - 操作：进入“排课管理” > “课程表查询”，选择查询类型并输入条件后点击“查询”。

        ---

         四、系统管理

         1. 用户管理
        - 功能：添加、编辑、删除、查询用户信息。
        - 操作：进入“系统管理” > “用户管理”，点击相应按钮完成操作。

         2. 权限设置
        - 功能：定义角色权限并为用户分配角色。
        - 操作：进入“系统管理” > “权限设置”，设置角色权限并分配角色。

         3. 数据备份与恢复
        - 功能：备份系统数据或恢复备份数据。
        - 操作：进入“系统管理” > “数据备份与恢复”，点击“备份”或“恢复”按钮。

         4. 系统日志
        - 功能：查看和查询系统操作日志。
        - 操作：进入“系统管理” > “系统日志”，输入查询条件后点击“查询”。

        ---

         五、常见问题

        1. 如何修改密码？
           - 登录后，点击用户名 > 修改密码，输入新密码并保存。

        2. 排课时提示“教室冲突”怎么办？
           - 检查教室使用情况，选择其他未占用的教室或调整课程时间。

        3. 如何导出课程表？
           - 在“课程表查询”页面，选择导出格式（如Excel、PDF）并点击“导出”。

        4. 提示“权限不足”怎么办？
           - 联系管理员检查权限设置。

        ---

         六、技术支持
        - 邮箱：support@university.edu
        - 电话：010-12345678
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup name="index">
import { ref, computed } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

// 定义一个响应式的时间变量
const currentTime = ref(updateCurrentTime())
// 使用计算属性动态更新时间
const users = computed(() => [
  { content: `当前时间: ${currentTime.value}` },
  { content: "教师姓名: ''" },
  { content: "本周课程总数: '' " },
  { content: "学期状态: '' " },
  { content: "在岗状态: '' " },
])

// 更新时间的函数
function updateCurrentTime() {
  const now = new Date(); // 获取当前时间
  return now.toLocaleTimeString(); // 返回格式化的时间字符串
}

// 每秒更新一次时间，并触发Vue的响应式更新
setInterval(() => {
  currentTime.value = updateCurrentTime() // 更新响应式变量
}, 1000);
</script>

<style >
.index {
  display: flex;
  justify-content: center;
  align-items: center;
}
.index img {
  width: 50%;
  height: 200px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.teacherinf ul {
  list-style-type: none;
  margin: 10px;
}
.teacherinf li {
  margin: 30px;
}
.el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}

/* 新增帮助文档的样式 */
.help {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 20px;
}

.help h1, .help h2, .help h3 {
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 10px;
}

.help h1 {
  font-size: 16px;
}

.help h2 {
  font-size: 12px;
}

.help h3 {
  font-size: 10px;
}

.help p {
  margin-bottom: 15px;
}

.help ul {
  list-style-type: disc;
  margin-left: 20px;
  margin-bottom: 15px;
}

.help li {
  margin-bottom: 5px;
}

.help hr {
  border: none;
  border-bottom: 1px solid #ddd;
  margin: 20px 0;
}
</style>