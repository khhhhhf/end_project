<template>
  <div class="poetry-app">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header-icon">
        <el-icon size="22"><i-ep-EditPen /></el-icon>
      </div>
      <div>
        <h2 class="page-title">AI 创作中心</h2>
        <p class="page-subtitle">输入灵感，让 AI 为你提供创作方向，完成你的诗歌作品</p>
      </div>
    </div>

    <el-row :gutter="24">
      <!-- 左侧 -->
      <el-col :xs="24" :md="12" style="display:flex; flex-direction:column;">

        <!-- 灵感生成 -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-dot"></span>
            <span class="panel-label">输入灵感关键词</span>
          </div>
          <el-input
            v-model="inspiration"
            type="textarea"
            :rows="4"
            placeholder="例如：春天、离别、月夜……输入你的创作灵感"
            resize="none"
          />
          <el-button
            class="action-btn"
            type="primary"
            @click="generateIdeas"
            :loading="loading"
            :disabled="inspiration === '' || loading"
            ref="sclg"
          >
            <el-icon v-if="!loading"><i-ep-MagicStick /></el-icon>
            生成创作灵感
          </el-button>
        </div>

        <!-- 提交作品 -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-dot"></span>
            <span class="panel-label">提交你的作品</span>
          </div>
          <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            label-width="0"
            class="submit-form"
          >
            <el-form-item prop="title">
              <el-input
                v-model="form.title"
                placeholder="作品名称"
              />
            </el-form-item>
            <el-form-item prop="theme_id">
              <el-select
                v-model="form.theme_id"
                placeholder="请选择诗篇分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in articleclasslist"
                  :key="item.theme_id"
                  :label="item.theme_name"
                  :value="item.theme_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="content">
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="5"
                placeholder="在这里写下你的诗歌作品..."
                resize="none"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="action-btn" type="primary" @click="submitWork">
                <el-icon><i-ep-Upload /></el-icon>
                提交作品
              </el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-col>

      <!-- 右侧：AI 灵感结果 -->
      <el-col :xs="24" :md="12" style="display:flex; flex-direction:column;">
        <div class="result-panel" v-loading="loading">

          <div class="result-section">
            <div class="result-section-title">
              <el-icon><i-ep-Compass /></el-icon>
              创作方向
              <span class="sample-badge" v-show="show">示例</span>
            </div>
            <div class="direction-cards">
              <div class="direction-card" v-for="(item, index) in anser" :key="index">
                <div class="direction-name">{{ item.themeVariant }}</div>
                <div class="direction-row">
                  <span class="direction-key">意象</span>
                  <span class="direction-val">{{ item.imagery.join(' · ') }}</span>
                </div>
                <div class="direction-row">
                  <span class="direction-key">修辞</span>
                  <span class="direction-val">{{ item.rhetoric }}</span>
                </div>
                <div class="direction-row">
                  <span class="direction-key">情感</span>
                  <span class="direction-val">{{ item.emotion }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="result-section">
            <div class="result-section-title">
              <el-icon><i-ep-QuestionFilled /></el-icon>
              引导问题
            </div>
            <div class="tag-list">
              <el-tag
                v-for="tag in question"
                :key="tag"
                class="result-tag"
                round
              >{{ tag }}</el-tag>
            </div>
          </div>

          <div class="result-section">
            <div class="result-section-title">
              <el-icon><i-ep-MagicStick /></el-icon>
              风格建议
            </div>
            <div class="tag-list">
              <el-tag
                v-for="tag in styleTags"
                :key="tag"
                class="style-tag"
                type="success"
                round
              >{{ tag }}</el-tag>
            </div>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getarticleclass } from '@/api/articleclass'
import type { Theme } from '@/types'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'
import { aicrete, postPoem } from '../../api/articledetail'
import { useUserStore } from '@/stores'

const inspiration = ref('')

const articleclasslist = ref<Theme[]>([])

async function getclass() {
  const res = await getarticleclass()
  articleclasslist.value = res.data.msg
}

getclass()

const loading = ref(false)

const show = ref(true)
//生成灵感
const question = ref(['如何在诗中描绘冬日的静谧美？'])
const styleTags = ref(['抒情', '叙事', '写景', '哲理'])
const anser = ref([
  {
    themeVariant: '山水间的宁静',
    imagery: ['清澈的溪流', '翠绿的山峦', '悠闲的白云'],
    rhetoric: '拟人',
    emotion: '平和'
  },
  {
    themeVariant: '山水的壮阔',
    imagery: ['雄伟的山峰', '奔腾的瀑布', '广阔的天空'],
    rhetoric: '夸张',
    emotion: '豪迈'
  }
])

const generateIdeas = async () => {
  show.value = false
  loading.value = true
  const res = await aicrete(inspiration.value)
  styleTags.value = res.data.msg.styleSuggestions
  question.value = res.data.msg.guidingQuestions
  anser.value = res.data.msg.creativeDirections.slice(0, 2)

  loading.value = false
  console.log(res)
}

//校验

const formRef = ref<FormInstance>()
const form = ref({
  title: '',
  theme_id: '',
  content: ''
})

// 校验规则
const rules = {
  title: [{ required: true, message: '请填写作品名称', trigger: 'blur' }],
  theme_id: [{ required: true, message: '请选择诗篇分类', trigger: 'change' }],
  content: [{ required: true, message: '请填写作品内容', trigger: 'blur' }]
}

const userstore = useUserStore()
const submitWork = async () => {
  await formRef.value?.validate()
  await postPoem({
    ...form.value,
    author: userstore.userinfo.username,
    user_id: userstore.userinfo.user_id
  })
  ElMessage.success('提交作品成功')
  formRef.value?.resetFields()
}
</script>

<style scoped lang="less">
.poetry-app {
  padding-bottom: 40px;
}

/* 页面标题 */
.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;

  .page-header-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #8a2be2, #b06ae0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 6px 18px rgba(138, 43, 226, 0.3);
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 4px;
  }

  .page-subtitle {
    font-size: 13px;
    color: #888;
    margin: 0;
  }
}

/* 左侧面板 */
.panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  &:last-child {
    margin-bottom: 0;
    flex: 1;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    .panel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #8a2be2;
      flex-shrink: 0;
    }

    .panel-label {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
  }

  :deep(.el-textarea__inner) {
    border-radius: 10px;
    font-size: 14px;
    border-color: #e4e0f0;
    &:focus {
      border-color: #8a2be2;
      box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.1);
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: 10px;
    border-color: #e4e0f0;
    &.is-focus {
      border-color: #8a2be2 !important;
      box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.1) !important;
    }
  }
}

.submit-form {
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }
  :deep(.el-form-item__error) {
    font-size: 12px;
    color: #ff4d4f;
  }
}

.action-btn {
  width: 100%;
  margin-top: 12px;
  height: 42px;
  background: linear-gradient(135deg, #8a2be2, #a855f7);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #7a1fd2, #9340e8);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(138, 43, 226, 0.35);
  }

  &.is-disabled {
    background: linear-gradient(135deg, #8a2be2, #a855f7);
    opacity: 0.55;
    color: #fff;
  }
}

/* 左右等高 */
:deep(.el-row) {
  align-items: stretch;
}

:deep(.el-col) {
  display: flex;
  flex-direction: column;
}

.left-col {
  display: flex;
  flex-direction: column;
}

/* 右侧结果面板 */
.result-panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex: 1;

  .result-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .result-section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #444;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0eaff;

    .el-icon {
      color: #8a2be2;
    }

    .sample-badge {
      margin-left: 6px;
      font-size: 11px;
      font-weight: 400;
      color: #aaa;
      background: #f5f5f5;
      padding: 1px 6px;
      border-radius: 4px;
    }
  }
}

/* 创作方向卡片 */
.direction-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.direction-card {
  background: linear-gradient(135deg, #faf7ff, #f5f0ff);
  border: 1px solid #e8deff;
  border-radius: 12px;
  padding: 14px 16px;

  .direction-name {
    font-size: 14px;
    font-weight: 600;
    color: #8a2be2;
    margin-bottom: 8px;
  }

  .direction-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 13px;

    .direction-key {
      color: #999;
      flex-shrink: 0;
      width: 28px;
    }

    .direction-val {
      color: #444;
      line-height: 1.5;
    }
  }
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-tag {
  background: #f0eaff;
  border-color: #d4b8ff;
  color: #6a1fbf;
  font-size: 13px;
}

.style-tag {
  font-size: 13px;
}
</style>
