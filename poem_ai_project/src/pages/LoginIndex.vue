<template>
  <div class="login-register-container">
    <!-- 左侧图片 -->
    <div class="left-img">
      <img :src="imgsrc" alt="背景图" />
    </div>

    <!-- 右侧表单 -->
    <div class="right-form">
      <div class="form-card">
        <transition name="fade-slide" mode="out-in">
          <div class="form-content" :key="isLogin ? 'login' : 'register'">
            <h2 class="form-title">{{ isLogin ? '欢迎回来' : '创建账户' }}</h2>
            <p class="form-subtitle">
              {{ isLogin ? '请登录您的账号' : '请填写注册信息' }}
            </p>

            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="0"
              class="form-box"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="form.username"
                  placeholder="账号"
                  clearable
                  size="large"
                  :prefix-icon="User"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="密码"
                  show-password
                  clearable
                  size="large"
                  :prefix-icon="Lock"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="submit-btn"
                  size="large"
                  @click="handleSubmit"
                >
                  {{ isLogin ? '登录' : '注册' }}
                </el-button>
              </el-form-item>

              <div class="switch-text">
                {{ isLogin ? '没有账号？' : '已有账号？' }}
                <el-button type="text" @click="isLogin = !isLogin">
                  切换到{{ isLogin ? '注册' : '登录' }}
                </el-button>
              </div>
            </el-form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import imgsrc from '@/assets/1.jpg'
import { login, register } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isLogin = ref(true)

const form = reactive({
  username: '',
  password: ''
})

const formRef = ref<FormInstance>()

const rules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度应为 3-12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度应为 6-16 个字符', trigger: 'blur' }
  ]
}
const router = useRouter()
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      if (isLogin.value) {
        const res = await login(form)
        const userstore = useUserStore()
        userstore.getinfo(res.data.msg)
        router.push({ name: 'HomeIndex' })
        ElMessage.success('登录成功')
      } else {
        await register(form)
        ElMessage.success('注册成功')
        isLogin.value = true
      }
    }
  })
}

watch(isLogin, (val) => {
  if (!val) {
    form.username = ''
    form.password = ''
  }
})
</script>

<style scoped lang="less">
.login-register-container {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .left-img {
    flex: 1;
    background-color: #f5f5f5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .right-form {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;

    .form-card {
      position: relative; /* 关键：让内容绝对定位 */
      background: #fff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 420px;
      min-height: 380px; /* 固定高度，防止跳动 */
      overflow: hidden;

      .form-content {
        position: absolute; /* 固定位置，切换不影响高度 */
        width: calc(100% - 80px);
      }

      .form-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 6px;
      }

      .form-subtitle {
        font-size: 14px;
        color: #888;
        margin-bottom: 24px;
      }

      .submit-btn {
        width: 100%;
        background: linear-gradient(135deg, #409eff, #66b1ff);
        border: none;
        transition: all 0.3s;
        font-size: 16px;
        font-weight: bold;

        &:hover {
          background: linear-gradient(135deg, #66b1ff, #409eff);
        }
      }

      .switch-text {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
      }
    }
  }
}

/* 淡入淡出+位移动画 */
.-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
