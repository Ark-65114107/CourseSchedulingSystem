<template>
  <div class="background">
    <div class="LoginContent">
      <span class="LoginTitle">登录</span>
      <div>
        <el-form
          class="LoginForm"
          :model="data"
          :rules="inputRule"
          label-position="right"
          label-width="auto"
          ref="loginFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="username"
              placeholder="请输入用户名"
              maxlength="20"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="password"
              placeholder="请输入密码"
              maxlength="25"
              show-password
            />
          </el-form-item>

          <el-form-item prop="rememberme">
            <el-checkbox v-model="rememberme"> 记住我 </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="LoginButton"
              @click="handleLogin(loginFormRef)"
              >登录</el-button
            >
          </el-form-item>

          

          <el-row justify="space-between" class="bottomLink">
            <el-link :underline="false">
              忘记密码?
            </el-link>

            <el-link :underline="false"  @click="handleRegister">
              注册
            </el-link>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { userLogin } from "@/api/user/user.api";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/store/authStore/index.js";
import { setToken } from "@/utils/token/setToken.js";
import router from "@/router";
import { getToken } from "@/utils/token/getToken";
import { errorMessages } from 'vue/compiler-sfc';
export default {
  name: "Login",
  setup() {
    const authStore = useAuthStore();
    const loginFormRef = ref({});
    const data = reactive({
      username: "",
      password: "",
      rememberme: false,
    });
    const inputRule = reactive({
      username: [
        { required: true, message: "用户名不能为空!", trigger: "blur" },
      ],
      password: [{ required: true, message: "密码不能为空!", trigger: "blur" }],
      rememberme: [{ required: false }],
    });

    const handleLogin = (formEl) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          userLogin({
            username: data.username,
            password: data.password,
            rememberme: data.rememberme,
          })
            .then((res) => {
              if (res.meta.code == 200) {
                sessionStorage.clear();
                localStorage.clear();
                setToken(res.data.token);
                authStore.getUserInfo();
                ElMessage.success("登录成功!");
              }
              if (res.meta.code == 402) {
                ElMessage.error("请检查用户名或密码!");
              }
            })
            .then(() => {
              if (getToken()) {
                router.push("/home/index");
              }
            })
            .catch((error) => {
              console.log(error);
              ElMessage.error()
            });
        }
      });
    };

    const handleRegister = () => {
      router.push("/register");
    };

    return {
      data,
      ...toRefs(data),
      inputRule,
      loginFormRef,
      handleLogin,
      handleRegister,
    };
  },
};
// this.$router.push({ name: 'content' })
</script>

<style scoped>
.background {
  height: 100%;
  width: 100%;
  /* background-image: url("@/assets/Login_bk.jpg"); */
  background: #f2f6fc;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
}

.LoginTitle {
  font-size: 160%;
  margin: 20px;
}

.LoginContent {
  height: 400px;
  width: 360px;
  background: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  box-shadow: 6px 6px 1px #c0c4cc;
}

.LoginForm {
  min-width: 300px;
}

.LoginButton {
  width: 100%;
  margin: 10px 0px;
}

a {
  all: unset;
}

.bottomLink{
  position: relative;
  bottom: 0px;
}
.el-input{
  width: 100%;
}
</style>