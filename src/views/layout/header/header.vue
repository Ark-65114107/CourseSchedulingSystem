<template>
  <el-header>
    <router-link to="/" class="logotitle">
      <img src="/src/assets/logo.png" alt="" class="logo" />
      <el-text class="titleText">高校排课系统</el-text>
    </router-link>

    <div class="userInfo">
      <el-dropdown size="large">
        <span class="username">
          <el-icon><User /></el-icon>
          {{ username }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUsereInfo">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- <el-link
          :underline="false"
          @click="this.$router.push({ name: 'AccountManagement' })"
          class="ToAccountManage"
        >
          <span>账户管理</span>
        </el-link>
        <el-link
          :underline="false"
          @click="this.$router.push({ name: 'login' })"
          class="Logout"
        >
          <span>退出登录</span>
        </el-link> -->
    </div>
  </el-header>
</template>

<script>
import { ElMessage } from "element-plus";
import router from "@/router";
import { useAuthStore } from "@/store/authStore";
import { onBeforeMount, onMounted, ref } from "vue";
export default {
  name: "theHeader",
  setup() {
    const username = ref();
    onMounted(() => {
      useAuthStore()
        .getUserInfo()
        .then(() => {
          username.value = useAuthStore().userInfo.username;
        });
    });
    const handleLogout = () => {
      useAuthStore().Logout();
      ElMessage({
        message: "登出成功!",
        type: "success",
      });
      router.push("/login");
    };

    const handleUsereInfo = ()=>{
      router.push("/home/user")
    }

    return {
      handleLogout,
      handleUsereInfo,
      username,
    };
  },
};
</script>

<style scoped>
.el-header {
  height: 8%;
  background: rgb(50.8, 116.6, 184.5);
  display: flex;
  justify-content: space-between;
  color: white;
}
.logo {
  height: 70%;
  margin: auto 20px auto 0px;
}

.logotitle {
  color: white;
  height: 100%;
  display: flex;
  text-decoration: none;
  white-space: nowrap;
}

.userInfo {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.titleText{
  color: white;
  font-size: 22px;
  font-weight: bold;
}

.username {
  margin: 0px 10px;
  color: white;
}

.ToAccountManage,
.Logout {
  all: unset;
  margin-right: 10px;
}
</style>