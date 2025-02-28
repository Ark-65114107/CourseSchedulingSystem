<template>
  <div class="background">
    <div class="RegisterContent">
      <span class="RegisterTitle">注册</span>

      <el-form
        class="RegisterForm"
        :model="data"
        :rules="inputRule"
        label-position="right"
        label-width="auto"
        ref="registerFormRef"
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
          <el-form-item label="确认密码" prop="comfirmPassword">
            <el-input
              v-model="comfirmPassword"
              placeholder="请确认密码"
              maxlength="25"
              show-password
            />
          </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="RegisterButton"
            @click="handleRegister(registerFormRef)"
            >注册</el-button
          >
          <el-row justify="space-between" class="bottomLink">
            <span>
              已经有账户了?返回
              <el-link :underline="false" @click="handleLogin">
                登录
              </el-link></span
            >
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { userRegister } from "@/api/user.api";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/store/authStore/index.js";
import { setToken } from "@/utils/token/setToken.js";
import router from "@/router";
import { getToken } from "@/utils/token/getToken";
export default {
  name: "Login",
  setup() {
    const authStore = useAuthStore();
    const registerFormRef = ref({});
    const data = reactive({
      username: "",
      password: "",
      comfirmPassword: "",
    });
    const inputRule = reactive({
      username: [
        { required: true, message: "用户名不能为空!", trigger: "blur" },
      ],
      password: [{ required: true, message: "密码不能为空!", trigger: "blur" }],
      comfirmPassword: [
        { required: true, message: "请确认密码!", trigger: "blur" },
        {
          required: true,
          message: "两次输入的密码不一致!",
          trigger: "blur",
          validator: (row, value, callback) => {
            if (data.password === value) {
              callback();
            } else {
              callback(new Error());
            }
          },
        },
      ],
    });

    const handleLogin = () => {
      router.push("/login");
    };

    const handleRegister = (formEl) => {
      formEl.validate((valid) => {
        if (valid) {
          userRegister(
            JSON.stringify({
              username: data.username,
              password: data.password,
            })
          )
            .then((res) => {
              if (res.meta.code === 200) {
                ElMessage.success("注册成功，请登录");
              }
              router.push("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    };

    return {
      data,
      ...toRefs(data),
      inputRule,
      registerFormRef,
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

.RegisterTitle {
  font-size: 160%;
  margin: 20px;
}

.RegisterContent {
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

.RegisterForm {
  height: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.RegisterButton {
  width: 100%;
  margin: 10px 0px;
}

a {
  all: unset;
}

.bottomLink {
  position: relative;
  bottom: 0px;
}

.el-form-item {
  width: 100%;
}

.el-input{
    width: 100%;
}
</style>