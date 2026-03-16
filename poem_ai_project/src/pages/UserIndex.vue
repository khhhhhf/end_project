<template>
  <div class="user-center-container">
    <!-- 现代化顶部导航栏 -->
    <div class="modern-header">
      <div class="header-content">
        <!-- 左侧区域：返回按钮 -->
        <div class="header-left">
          <button class="back-btn" @click="goBack">
            <el-icon class="back-icon">
              <i-ep-ArrowLeft />
            </el-icon>
            <span class="back-text">返回</span>
          </button>
        </div>

        <!-- 右侧区域：个人中心标题 -->
        <div class="header-right">
          <div class="page-header">
            <div class="page-icon">
              <el-icon>
                <i-ep-UserFilled />
              </el-icon>
            </div>
            <h1 class="page-title">个人中心</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 个人信息卡片 -->
      <CardItem title="个人信息">
        <div class="user-info-section">
          <!-- 左侧头像和基本信息 -->
          <div class="user-basic-info">
            <div class="avatar-section">
              <el-avatar :size="120" :src="userAvatarUrl" class="user-avatar" />
              <el-button
                type="primary"
                size="small"
                @click="showEditDialog = true"
                class="edit-btn"
              >
                编辑资料
              </el-button>
            </div>
            <div class="basic-info">
              <h2 class="username">{{ userStore.userinfo.username }}</h2>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">{{
                    userStats.totalCreations
                  }}</span>
                  <span class="stat-label">创作数量</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.totalLikes }}</span>
                  <span class="stat-label">获得点赞</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.likedPoems }}</span>
                  <span class="stat-label">点赞诗篇</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧详细信息 -->
          <div class="user-detail-info">
            <div class="info-grid">
              <div class="info-item">
                <label>用户ID</label>
                <span>{{ userStore.userinfo.user_id }}</span>
              </div>
              <div class="info-item">
                <label>昵称</label>
                <span>{{ editForm.username || userStore.userinfo.username }}</span>
              </div>
              <div class="info-item">
                <label>个人简介</label>
                <span>{{
                  userInfo.bio || '这个人很懒，什么都没有留下...'
                }}</span>
              </div>
              <div class="info-item">
                <label>创作偏好</label>
                <span>{{ userInfo.preference || '古典诗词' }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardItem>

      <!-- Tab切换区域 -->
      <CardItem title="我的内容">
        <el-tabs v-model="activeTab" class="user-tabs">
          <el-tab-pane label="我的创作" name="creations">
            <div class="content-grid" v-loading="creationsLoading">
              <CardKh
                v-for="poem in userCreations"
                :key="poem.poem_id"
                :item="poem"
                width="100%"
              >
                <div class="poem-meta">
                  <p class="poem-stats">
                    <span>点赞：{{ poem.likes_count }}</span>
                    <span>评论：{{ poem.comment_count }}</span>
                  </p>
                  <p class="poem-date">{{ formatDate(poem.created_at) }}</p>
                </div>
              </CardKh>
              <div v-if="userCreations.length === 0" class="empty-state">
                <el-empty description="还没有创作任何诗篇">
                  <el-button type="primary" @click="goToCreate"
                    >开始创作</el-button
                  >
                </el-empty>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-wrapper" v-if="userCreations.length > 0">
              <el-pagination
                v-model:current-page="creationsPagination.currentPage"
                v-model:page-size="creationsPagination.pageSize"
                :page-sizes="[6, 12, 18]"
                :background="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="creationsPagination.total"
                @size-change="handleCreationsPageSizeChange"
                @current-change="handleCreationsPageChange"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane label="点赞诗篇" name="liked">
            <div class="liked-poems-list" v-loading="likedLoading">
              <LikedPoemCard
                v-for="poem in displayedLikedPoems"
                :key="poem.poem_id"
                :poem="poem"
              />
              <div v-if="likedPoems.length === 0" class="empty-state">
                <el-empty description="还没有点赞任何诗篇">
                  <el-button type="primary" @click="goToPoetryCenter"
                    >去发现好诗</el-button
                  >
                </el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </CardItem>

      <!-- 编辑个人信息对话框 -->
      <el-dialog
        v-model="showEditDialog"
        title="编辑个人信息"
        width="500px"
        :before-close="handleEditDialogClose"
      >
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editRules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="editForm.bio"
              type="textarea"
              :rows="3"
              placeholder="介绍一下自己吧..."
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="创作偏好" prop="preference">
            <el-select v-model="editForm.preference" placeholder="选择创作偏好">
              <el-option label="古典诗词" value="古典诗词" />
              <el-option label="现代诗歌" value="现代诗歌" />
              <el-option label="自由诗" value="自由诗" />
              <el-option label="格律诗" value="格律诗" />
              <el-option label="词牌" value="词牌" />
            </el-select>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              accept="image/*"
            >
              <el-avatar :size="60" :src="editForm.avatarUrl" />
              <div class="upload-text">点击更换头像</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showEditDialog = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleSaveUserInfo"
              :loading="saveLoading"
            >
              保存
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'
import { formatDate } from '@/utils/format'
import {
  getLikedPoemsByUserId,
  updateUserInfo,
  renderProfile,
  renderCreate
} from '@/api/user'
import LikedPoemCard from '@/components/LikedPoemCard.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { create } from '@/types'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const activeTab = ref('creations')
const showEditDialog = ref(false)
const creationsLoading = ref(false)
const likedLoading = ref(false)
const saveLoading = ref(false)

// 用户信息
const userInfo = reactive({
  bio: '',
  preference: '',
  registerTime: ''
})

// 用户统计数据
const userStats = reactive({
  totalCreations: 0,
  totalLikes: 0,
  likedPoems: 0
})

// 用户创作列表
const userCreations = ref<create[]>([])
const creationsPagination = reactive({
  currentPage: 1,
  pageSize: 6,
  total: 0
})

// 点赞诗篇列表
const likedPoems = ref<create[]>([])
const maxDisplayCount = ref(3) // 默认最多显示3个

// 编辑表单
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  username: '',
  bio: '',
  preference: '',
  avatarUrl: ''
})

const editRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应为 2-20 个字符', trigger: 'blur' }
  ],
  bio: [{ max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }]
}

// 计算属性
const userAvatarUrl = computed(() => {
  return userStore.userinfo.avatar_url
    ? baseURL + userStore.userinfo.avatar_url
    : ''
})

// 根据屏幕大小和数据长度计算显示的点赞诗篇
const displayedLikedPoems = computed(() => {
  return likedPoems.value.slice(0, maxDisplayCount.value)
})

// 方法
const goBack = () => {
  // 检查是否有历史记录，如果有则返回上一页，否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'HomeIndex' })
  }
}

const goToCreate = () => {
  router.push({ name: 'HomeAiCreationCenter' })
}

const goToPoetryCenter = () => {
  router.push({ name: 'PoetryCenter' })
}

const handleEditDialogClose = () => {
  showEditDialog.value = false
  // 重置表单
  editForm.username = userStore.userinfo.username
  editForm.bio = userInfo.bio
  editForm.preference = userInfo.preference
  editForm.avatarUrl = userAvatarUrl.value
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义上传方法
const handleAvatarUpload = async (options: { file: File }) => {
  const { file } = options
  const formData = new FormData()
  formData.append('file', file)
  formData.append('user_id', userStore.userinfo.user_id.toString())

  try {
    const res = await updateUserInfo(formData)
    if (res.data.code === 0) {
      // 更新头像 URL
      const newAvatarUrl = res.data.msg
      editForm.avatarUrl = baseURL + newAvatarUrl
      // 更新 store 中的头像
      userStore.userinfo.avatar_url = newAvatarUrl
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(res.data.msg || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败，请重试')
  }
}

const handleSaveUserInfo = async () => {
  if (!editFormRef.value) return

  editFormRef.value.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true
      try {
        const formData = new FormData()
        formData.append('user_id', userStore.userinfo.user_id.toString())
        formData.append('nickname', editForm.username)
        formData.append('user_description', editForm.bio)

        const res = await updateUserInfo(formData)
        if (res.data.code === 0) {
          userInfo.bio = editForm.bio
          userInfo.preference = editForm.preference
          ElMessage.success('保存成功')
          showEditDialog.value = false
        } else {
          ElMessage.error(res.data.msg || '保存失败')
        }
      } catch {
        ElMessage.error('保存失败，请重试')
      } finally {
        saveLoading.value = false
      }
    }
  })
}

// 分页处理
const handleCreationsPageSizeChange = (size: number) => {
  creationsPagination.pageSize = size
  loadUserCreations()
}

const handleCreationsPageChange = (page: number) => {
  creationsPagination.currentPage = page
  loadUserCreations()
}

// 响应式调整显示数量
const updateDisplayCount = () => {
  const width = window.innerWidth
  if (width >= 1200) {
    maxDisplayCount.value = 3 // 大屏幕显示3个
  } else if (width >= 768) {
    maxDisplayCount.value = 2 // 中屏幕显示2个
  } else {
    maxDisplayCount.value = 1 // 小屏幕显示1个
  }
}

// 数据加载方法
const loadUserCreations = async () => {
  creationsLoading.value = true
  try {
    const res = await renderCreate(userStore.userinfo.user_id)
    if (res.data.code === 0) {
      // 后端返回的是完整列表，前端进行分页处理
      const allCreations = res.data.msg
      userCreations.value = allCreations
      creationsPagination.total = allCreations.length

      // 更新统计数据：创作数量
      userStats.totalCreations = allCreations.length
    } else {
      userCreations.value = []
      creationsPagination.total = 0
      userStats.totalCreations = 0
    }
  } catch {
    userCreations.value = []
    creationsPagination.total = 0
    userStats.totalCreations = 0
    ElMessage.error('加载创作列表失败')
  } finally {
    creationsLoading.value = false
  }
}

const loadLikedPoems = async () => {
  likedLoading.value = true
  try {
    const res = await getLikedPoemsByUserId(userStore.userinfo.user_id)

    // 将API返回的数据转换为前端期望的格式
    likedPoems.value = res.data.msg.map(
      (item: {
        poem_id: number
        title: string
        content: string
        like_time: string
        nickname: string
      }) => ({
        poem_id: item.poem_id,
        title: item.title,
        content: item.content,
        created_at: item.like_time,
        nickname: item.nickname,
        likes_count: 0, // API中没有这个字段，先设为0
        comment_count: 0 // API中没有这个字段，先设为0
      })
    )

    // 更新统计数据：点赞诗篇数量
    userStats.likedPoems = likedPoems.value.length
  } catch {
    likedPoems.value = []
    userStats.likedPoems = 0
    ElMessage.error('加载点赞列表失败')
  } finally {
    likedLoading.value = false
  }
}

const loadUserStats = async () => {
  try {
    // 调用 renderProfile 接口获取用户信息和获赞统计
    const res = await renderProfile(userStore.userinfo.user_id)
    if (res.data.code === 0) {
      // 更新统计数据：获得点赞数
      userStats.totalLikes = res.data.msg.total_poem_likes || 0
      // 其他统计数据由各自的加载函数更新：
      // - totalCreations 由 loadUserCreations 更新
      // - likedPoems 由 loadLikedPoems 更新
    }
  } catch {
    console.error('加载用户统计失败')
  }
}

const loadUserInfo = async () => {
  try {
    const res = await renderProfile(userStore.userinfo.user_id)
    if (res.data.code === 0) {
      userInfo.bio = res.data.msg.user_description || ''
      userInfo.preference = userInfo.preference || '古典诗词'
    }
    // 初始化编辑表单
    editForm.username = res.data.msg.nickname || userStore.userinfo.username
    editForm.bio = userInfo.bio
    editForm.preference = userInfo.preference
    editForm.avatarUrl = userAvatarUrl.value
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 页面初始化
onMounted(() => {
  loadUserInfo()
  loadUserStats()
  loadUserCreations()
  loadLikedPoems()

  // 初始化显示数量
  updateDisplayCount()

  // 监听窗口大小变化
  window.addEventListener('resize', updateDisplayCount)
})

// 页面销毁时清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', updateDisplayCount)
})
</script>

<style lang="less" scoped>
.user-center-container {
  min-height: 100vh;
  width: 100%;
  max-width: none;
  padding: 0;
  margin: 0;
  background-color: #eeeafb;
  box-sizing: border-box;

  // 现代化顶部导航栏样式
  .modern-header {
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    margin-bottom: 24px;

    .header-content {
      max-width: 1500px;
      margin: 0 auto;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        // background: #f8fafc;
        // border: 1px solid #e2e8f0;
        // border-radius: 10px;
        background: transparent;
        border: none;
        color: #475569;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        &:hover {
          // background: #f1f5f9;
          // border-color: #cbd5e1;
          color: #334155;
          transform: translateY(-2px);
          // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .back-icon {
          font-size: 16px;
          color: #64748b;
        }

        .back-text {
          color: #475569;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .page-header {
        display: flex;
        align-items: center;
        gap: 16px;

        .page-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 26px;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(139, 92, 246, 0.5);
          }
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.2;
          background: linear-gradient(135deg, #1e293b, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
  }

  // 主要内容区域
  .main-content {
    padding: 0 20px 20px 20px;
  }

  // 确保CardItem组件撑满宽度
  :deep(.el-card) {
    width: 100% !important;
    max-width: none !important;
  }

  .user-info-section {
    display: flex;
    gap: 40px;
    align-items: flex-start;

    .user-basic-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 200px;

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;

        .user-avatar {
          border: 4px solid #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
          }
        }

        .edit-btn {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border: none;
          border-radius: 20px;
          padding: 8px 20px;
          font-weight: 500;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;

          &:hover {
            background: linear-gradient(135deg, #7c3aed, #9333ea);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
          }
        }
      }

      .basic-info {
        text-align: center;
        margin-top: 20px;

        .username {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
        }

        .user-stats {
          display: flex;
          gap: 30px;

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .stat-number {
              font-size: 20px;
              font-weight: bold;
              color: #8a2be2;
            }

            .stat-label {
              font-size: 12px;
              color: #666;
              margin-top: 4px;
            }
          }
        }
      }
    }

    .user-detail-info {
      flex: 1;

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;

          label {
            font-weight: 600;
            color: #666;
            font-size: 14px;
          }

          span {
            color: #333;
            font-size: 16px;
            padding: 8px 12px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
        }
      }
    }
  }

  .user-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 30px;
    }

    :deep(.el-tabs__item) {
      font-size: 16px;
      font-weight: 500;
    }

    :deep(.el-tabs__item.is-active) {
      color: #8a2be2;
    }

    :deep(.el-tabs__active-bar) {
      background-color: #8a2be2;
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    min-height: 200px;

    .poem-meta {
      .poem-stats {
        display: flex;
        justify-content: space-between;
        color: #666;
        font-size: 14px;
        margin: 10px 0 5px 0;
      }

      .poem-date,
      .poem-author {
        color: #999;
        font-size: 12px;
        margin: 0;
      }
    }
  }

  .liked-poems-list {
    min-height: 200px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;

    // 根据屏幕大小调整网格列数
    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  // 编辑对话框样式
  :deep(.el-dialog) {
    border-radius: 16px;
  }

  .avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .upload-text {
      font-size: 12px;
      color: #8a2be2;
    }

    &:hover .upload-text {
      text-decoration: underline;
    }
  }
}

// 确保在大屏幕上也撑满
@media (min-width: 1200px) {
  .user-center-container {
    max-width: none;
    width: 100%;
  }
}
</style>
