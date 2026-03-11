<template>
  <div class="poetry-app">
    <!-- 顶部导航栏 -->
    <el-header class="app-header">
      <div class="header-content">
        <span class="back" @click="$router.go(-1)"
          ><el-icon><i-ep-ArrowLeft /></el-icon>返回</span
        >
        <h1 class="app-title">诗韵</h1>
        <h1>AI Poetry Assistant</h1>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="app-main">
      <div class="content-container">
        <div class="left">
          <!-- 诗歌展示区 -->
          <section class="poetry-display">
            <div class="poetry-card">
              <div class="poetry-header">
                <h2 class="poetry-title">{{ poem.title }}</h2>
                <div class="poetry-meta">
                  <span>{{ poem.author }}</span>
                </div>
              </div>

              <div class="poetry-content">
                <p
                  v-for="(line, index) in poem?.content"
                  :key="index"
                  class="poetry-line"
                >
                  {{ line }}
                </p>
              </div>

              <div class="poetry-actions">
                <button
                  class="like-btn"
                  :class="{ liked: isLiked }"
                  @click="handleLike"
                  :disabled="likeLoading"
                >
                  <el-icon>
                    <i-ep-StarFilled v-if="isLiked" /><i-ep-Star v-else
                  /></el-icon>
                  <span>{{ likesCount }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- ai解读 -->
          <div class="interaction-area">
            <!-- AI对话框 -->
            <section class="ai-chatbox">
              <div class="chat-header">
                <h3>AI 诗歌解读</h3>
                <p>与AI探讨这首诗的意境</p>
              </div>

              <div class="chat-messages">
                <div
                  v-for="(msg, index) in chatMessages"
                  :key="index"
                  :class="[
                    'message',
                    msg.sender === 'ai' ? 'ai-message' : 'user-message'
                  ]"
                >
                  <div
                    class="avatar"
                    :class="msg.sender === 'ai' ? 'ai-avatar' : 'user-avatar'"
                  >
                    {{ msg.sender === 'ai' ? 'AI' : '我' }}
                  </div>
                  <div class="message-content">{{ msg.content }}</div>
                </div>
              </div>
              <div class="chat-input">
                <el-input
                  v-model="newMessage"
                  placeholder="输入你的问题或想法..."
                  @keyup.enter="sendMessage"
                  clearable
                ></el-input>
                <el-button
                  type="primary"
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  v-loading="loading"
                >
                  <el-icon><i-ep-Position /></el-icon>
                  发送
                </el-button>
              </div>
            </section>
          </div>
        </div>

        <!-- 评论区 -->
        <section class="comments-section">
          <h3>全部评论({{ commentslength }})</h3>
          <div class="comments-list">
            <CommentItem
              @change="changebtnmsg"
              @reply="ispd = true"
              :item="item"
              v-for="item in comments"
              :key="item.comment_id"
            ></CommentItem>
          </div>
          <h3 class="comments-title">诗歌评论</h3>

          <div class="comment-input">
            <el-input
              v-model="repeadcomment"
              @blur="bluer"
              type="textarea"
              :placeholder="ispd ? '分享你对这首诗的感受...' : msg"
              :rows="3"
              clearable
            ></el-input>
            <el-button
              @mousedown="docomment"
              type="primary"
              style="margin-top: 10px"
            >
              {{ ispd ? '发表评论' : '回复评论' }}
            </el-button>
          </div>
        </section>
      </div>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="app-footer">
      <p>诗韵 &copy; {{ new Date().getFullYear() }} | 让诗歌走进生活</p>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { getPoemp, poemdetai } from '@/api/articleclass'
import {
  addcomment,
  getPoemRelated,
  replycomment,
  toggleLike
} from '@/api/articledetail'
import type { Comment, NewComment, Poem } from '@/types'
import { splitPoemIntoArray } from '@/utils/format'
import { ref, nextTick } from 'vue'
import { useUserStore } from '@/stores'

const props = defineProps<{
  poem_id: string
}>()

const userStore = useUserStore()
const isLiked = ref(false)
const likesCount = ref(0)
const likeLoading = ref(false)

async function handleLike() {
  if (likeLoading.value) return
  likeLoading.value = true
  try {
    await toggleLike(userStore.userinfo.user_id, props.poem_id)
    isLiked.value = !isLiked.value
    likesCount.value += isLiked.value ? 1 : -1
  } finally {
    likeLoading.value = false
  }
}

// 聊天消息类型
interface ChatMessage {
  sender: 'ai' | 'user'
  content: string
  timestamp: Date
}

const poem = ref<Poem>({
  title: '春江花月夜',
  author: '张若虚',
  likes_count: 0,
  content: ''
})

// 评论相关
const commentslength = ref<number>()
const comments = ref<NewComment[]>()

function classifyComments(comments?: readonly Comment[]): NewComment[] {
  const roots: NewComment[] = []
  if (!comments?.length) return roots

  // 创建 Map，并初始化 replies
  const map = new Map<number, NewComment>()
  for (const c of comments) {
    map.set(c.comment_id, { ...c, replies: [] })
  }

  // 构建父子关系
  for (const c of comments) {
    const node = map.get(c.comment_id)!
    if (c.parent_comment_id == null) {
      roots.push(node)
    } else {
      const parent = map.get(c.parent_comment_id)
      if (parent) parent.replies.push(node)
      else roots.push(node) // 如果父级不存在，兜底到根
    }
  }

  return roots
}

//渲染当前页面
async function renderdetail() {
  const res = await poemdetai(userStore.userinfo.user_id, props.poem_id)
  desc.value =
    '这首歌的题目是' +
    res.data.msg[0].title +
    '内容是' +
    res.data.msg[0].content
  res.data.msg[0].content = splitPoemIntoArray(res.data.msg[0].content)
  poem.value = res.data.msg[0]
  likesCount.value = res.data.msg[0].likes_count ?? 0
  isLiked.value = !!res.data.msg[0].is_liked
}
renderdetail()

//获取评论相关
async function rendercomments() {
  const res1 = await getPoemp(props.poem_id)
  comments.value = res1.data.msg.comments
  commentslength.value = res1.data.msg.commentCount || 0
  comments.value = classifyComments(res1.data.msg.comments)
}
rendercomments()
// 聊天相关

const chatMessages = ref<ChatMessage[]>([
  {
    sender: 'ai',
    content: '快来和我进行对话吧！！！',
    timestamp: new Date()
  }
])

// 发送消息
const desc = ref<string>('')
const newMessage = ref('')

const loading = ref(false)
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMsg = newMessage.value.trim()

  // 保存用户消息到历史记录
  chatMessages.value.push({
    sender: 'user',
    content: userMsg,
    timestamp: new Date()
  })

  newMessage.value = '' // 清空输入框
  scrollChatToBottom()
  loading.value = true
  const res = await getPoemRelated(userMsg, desc.value)
  loading.value = false
  //ai请求
  chatMessages.value.push({
    sender: 'ai',
    content: res.data.msg,
    timestamp: new Date()
  })
  scrollChatToBottom()
}

// 滚动聊天到最新消息
const scrollChatToBottom = () => {
  nextTick(() => {
    const chatContainer = document.querySelector(
      '.chat-messages'
    ) as HTMLElement
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })
}

//评论按钮
const ispd = ref(true)
const msg = ref('回复评论')
const parent_comment_id = ref<number>()
function changebtnmsg(a: number, b: string, c: number) {
  repeadcomment.value = ''
  ispd.value = false
  msg.value = '回复' + b + '的评论'
  parent_comment_id.value = c
}

//回复失去焦点
function bluer() {
  if (!ispd.value) {
    ispd.value = true
    repeadcomment.value = ''
  }
}

//回复发表评论
const repeadcomment = ref<string>('')
async function docomment() {
  if (repeadcomment.value.trim() == '') {
    ElMessage({
      message: '评论内容不能为空',
      grouping: true,
      type: 'error'
    })
  } else {
    //判断回复还是发表
    if (ispd.value) {
      //发表
      ElMessage({
        message: '发表成功',
        type: 'success'
      })
      await addcomment({
        poem_id: props.poem_id,
        content: repeadcomment.value,
        user_id: '1'
      })
    } else {
      //回复
      await replycomment({
        poem_id: props.poem_id,
        user_id: '1',
        content: repeadcomment.value,
        parent_comment_id: parent_comment_id.value
      })
      ispd.value = true
      ElMessage({
        message: '回复成功',
        type: 'success'
      })
    }
    repeadcomment.value = ''
    rendercomments()
  }
}
</script>

<style scoped lang="less">
.poetry-app {
  background: url(../assets/1.png) no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.app-header {
  background: linear-gradient(135deg, #6a1b9a, #8e24aa);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(106, 27, 154, 0.2);
}

.header-content {
  color: #fff;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-style: italic;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 2px;
}

/* 主内容 */
.app-main {
  flex: 1;
  padding: 30px 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px;
  display: flex;

  .left {
    flex: 2;
  }
}

/* 诗歌展示 */
.poetry-card {
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(106, 27, 154, 0.08);
  border: 1px solid #f0e6f7;
}

.poetry-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e1bee7;
}

.poetry-title {
  color: #8a2be2;
  font-size: 2rem;
  margin-bottom: 10px;
}

.poetry-meta {
  color: #8a2be2;
  font-size: 1.1rem;
  opacity: 0.9;
}

.poetry-content {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ba68c8;
}

.poetry-line {
  text-align: center;
  font-size: 1.3rem;
  line-height: 2;
  margin: 0;
  color: #8a2be2;
  transition: transform 0.3s ease;
}

.poetry-line:hover {
  transform: translateX(5px);
}

/* 点赞按钮 */
.poetry-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px dashed #e1bee7;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 50px;
  border: 2px solid #e1bee7;
  background: #fff;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;

  .el-icon {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  &:hover {
    border-color: #8a2be2;
    color: #8a2be2;
    background: #f9f4ff;

    .el-icon {
      transform: scale(1.2);
    }
  }

  &.liked {
    border-color: #8a2be2;
    background: linear-gradient(135deg, #8a2be2, #a855f7);
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #7a1fd2, #9340e8);
      color: #fff;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

/* AI 聊天框 */
.ai-chatbox {
  margin-top: 20px;
  height: 450px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(106, 27, 154, 0.08);
}

.chat-header {
  background: linear-gradient(135deg, #8e24aa, #9c27b0);
  color: #fff;
  padding: 18px 20px;
}

.chat-header h3 {
  margin: 0 0 5px;
  font-size: 1.2rem;
}

.chat-header p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.chat-messages {
  height: 260px;
  overflow-y: auto;
  padding: 20px;
  background-color: #fcfaff;
  text-align: right;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #ce93d8;
  border-radius: 3px;
}

.message {
  text-align: left;
  margin-bottom: 18px;
}

.ai-message {
  align-self: flex-start;
  max-width: 85%;
}

.user-message {
  max-width: 85%;
  margin-left: auto;
  display: inline-block;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.ai-avatar {
  background-color: #ba68c8;
}

.user-avatar {
  background-color: #7b1fa2;
  margin-left: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.6;
}

.ai-message .message-content {
  background-color: #f3e5f5;
  color: #4a148c;
  border-top-left-radius: 4px;
}

.user-message .message-content {
  background-color: #9c27b0;
  color: white;
  border-top-right-radius: 4px;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #f0e6f7;
}

.chat-input .el-input {
  flex: 1;
  margin-right: 10px;
}

/* 评论区 */
.comments-section {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(106, 27, 154, 0.08);
}

.comments-title {
  color: #6a1b9a;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.comments-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #9c27b0;
  margin-right: 10px;
  border-radius: 2px;
}

.comment-input {
  margin-bottom: 25px;
}

.comments-list {
  max-height: 480px;
  overflow-y: auto;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-thumb {
  background-color: #ce93d8;
  border-radius: 3px;
}

/* 页脚 */
.app-footer {
  background-color: #8a2be2;
  color: #fff;
  text-align: center;
  padding: 15px 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 992px) {
  .content-container {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .header-content {
    flex-direction: column;
    padding: 15px 10px;
  }

  .app-title {
    margin-bottom: 10px;
  }

  .poetry-card {
    padding: 20px 15px;
  }

  .poetry-title {
    font-size: 1.6rem;
  }

  .poetry-line {
    font-size: 1.1rem;
  }

  .chat-messages {
    height: 300px;
  }
}
:deep(.el-loading-mask) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-loading-spinner) {
  transform: scale(0.6); /* 缩小加载动画 */
}

:deep(.el-loading-spinner .el-loading-text) {
  font-size: 12px;
}
.back {
  cursor: pointer;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中，按需选用 */
}
</style>
