<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="header-left">
        <el-icon size="24" color="#8a2be2"><i-ep-Setting /></el-icon>
        <h2 class="admin-title">后台管理系统</h2>
      </div>
      <div class="header-right">
        <el-button @click="$router.push('/home-index/poetry-center')">返回前台</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="admin-tabs">
      <!-- 1. 用户创作管理 -->
      <el-tab-pane label="用户创作审核" name="user-poems">
        <el-table :data="userPoems" v-loading="loading" style="width: 100%" border>
          <el-table-column prop="poem_id" label="ID" width="80" />
          <el-table-column prop="nickname" label="作者" width="120" />
          <el-table-column prop="title" label="标题" width="180" />
          <el-table-column prop="content" label="内容">
            <template #default="scope">
              <div class="poem-content-cell">{{ scope.row.content }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="发布时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-popconfirm title="确定删除这篇诗作吗？" @confirm="handleDelete(scope.row.poem_id)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 2. 发布经典诗歌 -->
      <el-tab-pane label="发布经典诗歌" name="post-classic">
        <div class="post-form-container">
          <el-form :model="classicForm" label-width="100px" class="classic-form">
            <el-form-item label="诗歌标题">
              <el-input v-model="classicForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="原作者">
              <el-input v-model="classicForm.author" placeholder="请输入原作者（如：李白）" />
            </el-form-item>
            <el-form-item label="所属分类">
              <el-select v-model="classicForm.theme_id" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="item in themes"
                  :key="item.theme_id"
                  :label="item.theme_name"
                  :value="item.theme_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="诗歌内容">
              <el-input
                v-model="classicForm.content"
                type="textarea"
                :rows="8"
                placeholder="请输入诗歌内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePostClassic" :loading="submitting">立即发布</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="form-tip">
            <p><strong>注意：</strong> 管理员发布的诗歌将进入“经典收录”板块，<code>user_id</code> 为空。</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getAllUserPoems, deletePoem, postClassicPoem } from '@/api/articledetail'
import { getarticleclass } from '@/api/articleclass'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import type { Theme } from '@/types'

const activeTab = ref('user-poems')
const loading = ref(false)
const submitting = ref(false)
const userPoems = ref([])
const themes = ref<Theme[]>([])

const classicForm = reactive({
  title: '',
  author: '',
  theme_id: '',
  content: ''
})

async function fetchUserPoems() {
  loading.value = true
  try {
    const res = await getAllUserPoems()
    userPoems.value = res.data.msg
  } finally {
    loading.value = false
  }
}

async function fetchThemes() {
  const res = await getarticleclass()
  themes.value = res.data.msg
}

async function handleDelete(id: number) {
  await deletePoem(id)
  ElMessage.success('删除成功')
  fetchUserPoems()
}

async function handlePostClassic() {
  if (!classicForm.title || !classicForm.content || !classicForm.theme_id) {
    return ElMessage.warning('请填写完整信息')
  }
  submitting.value = true
  try {
    await postClassicPoem(classicForm)
    ElMessage.success('发布经典诗歌成功')
    resetForm()
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  classicForm.title = ''
  classicForm.author = ''
  classicForm.theme_id = ''
  classicForm.content = ''
}

onMounted(() => {
  fetchUserPoems()
  fetchThemes()
})
</script>

<style scoped lang="less">
.admin-container {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 120px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .admin-title {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
}

.poem-content-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  color: #666;
}

.post-form-container {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  gap: 40px;
}

.classic-form {
  flex: 1;
}

.form-tip {
  width: 240px;
  padding: 20px;
  background: #fdf6ec;
  border-radius: 8px;
  border-left: 4px solid #e6a23c;
  height: fit-content;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

:deep(.el-tabs__item.is-active) {
  color: #8a2be2;
}
:deep(.el-tabs__active-bar) {
  background-color: #8a2be2;
}
</style>
