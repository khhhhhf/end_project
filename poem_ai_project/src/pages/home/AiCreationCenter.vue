<template>
  <div class="poetry-app">
    <el-row :gutter="20">
      <!-- 左侧 -->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <h3>创作灵感</h3>
          <el-input
            v-model="inspiration"
            type="textarea"
            :rows="4"
            placeholder="请输入创作灵感..."
          />
          <el-button
            style="width: 100%; margin-top: 10px"
            type="primary"
            class="full-btn"
            @click="generateIdeas"
            :disabled="inspiration === '' || loading"
            ref="sclg"
          >
            生成诗歌灵感
          </el-button>
        </el-card>

        <el-form
          class="box-card"
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="0"
        >
          <el-form-item>
            <h3>创作方向</h3>
          </el-form-item>
          <el-form-item prop="title">
            <el-input
              v-model="form.title"
              placeholder="在这里输入作品名称..."
              style="margin-bottom: 10px; width: 50%"
            />
          </el-form-item>

          <el-form-item prop="theme_id">
            <el-select
              v-model="form.theme_id"
              placeholder="请选择诗篇分类"
              style="width: 100%; margin-bottom: 10px"
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
              placeholder="在这里提交您的诗歌作品..."
            />
          </el-form-item>

          <el-form-item>
            <el-button
              style="width: 100%"
              type="primary"
              class="full-btn"
              @click="submitWork"
            >
              提交你的作品
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 右侧 -->
      <el-col :xs="24" :md="12">
        <el-card v-loading="loading" class="right">
          <div class="direction">
            <h3>创作方向 <span v-show="show">（示例）</span></h3>
            <el-card
              shashidow="never"
              v-for="(item, index) in anser"
              :key="index"
            >
              <h4>{{ item.themeVariant }}</h4>
              <p>{{ item.imagery.join(',') }}</p>
              <p>修辞：{{ item.rhetoric }}</p>
              <p>情感：{{ item.emotion }}</p>
            </el-card>
            <el-card shadow="never">
              <h3>引导问题</h3>
              <el-tag
                v-for="tag in question"
                :key="tag"
                type="info"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </el-card>
            <el-card shadow="never">
              <h3>风格建议</h3>
              <el-tag
                v-for="tag in styleTags"
                :key="tag"
                type="info"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </el-card>
          </div>
        </el-card>
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
* {
  padding: 0;
  margin: 0;
}

:deep(.el-form-item__error) {
  color: #ff4d4f; /* 红色提示 */
  font-size: 14px; /* 字体大小 */
  font-weight: 500; /* 字体粗细 */
  margin-top: -4px; /* 与输入框的间距 */
  line-height: 1; /* 提高可读性 */
}

.el-button {
  background-color: #8a2be2;
  border: none;
}
.right {
  height: 615px;
}
.box-card {
  background-color: #fff;
  &:first-child {
    margin-bottom: 20px;
  }
}
.el-select-dropdown .el-select-dropdown__item {
  box-sizing: border-box;
  padding-left: 10px !important;
}
.el-form {
  padding: 30px;
}

.el-form-item {
  h3 {
    color: black;
  }
  margin-bottom: 13px;
  .el-form-item__content {
    line-height: 30px;
  }
}
.el-card__body {
  h3 {
    margin-bottom: 4px;
  }
  h4 {
    color: #8a2be2;
  }
  p {
    margin-top: 8px;
  }
  .el-tag {
    margin-right: 10px;
  }
}
:deep(.full-btn.is-disabled) {
  background-color: #8a2be2;
  color: #fff;
}
</style>
