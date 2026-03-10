<template>
  <div class="liked-poem-card" @click="goToPoem">
    <el-card shadow="hover" class="poem-card">
      <div class="card-header">
        <div class="title-section">
          <h3 class="poem-title">{{ poem.title }}</h3>
          <div class="author-info">
            <span class="author">作者：{{ poem.nickname }}</span>
            <span class="like-time">{{ formatDate(poem.created_at) }}</span>
          </div>
        </div>
        <div class="like-icon">
          <span style="color: #8b5cf6; font-size: 20px;">❤️</span>
        </div>
      </div>

      <div class="card-content">
        <div class="poem-content">
          <pre>{{ poem.content }}</pre>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/format'

interface Poem {
  poem_id: number
  title: string
  content: string
  created_at: string
  nickname: string
  likes_count?: number
  comment_count?: number
}

interface Props {
  poem: Poem
}

const props = defineProps<Props>()
const router = useRouter()

const goToPoem = () => {
  router.push({
    name: 'ArticleIndex',
    params: {
      poem_id: props.poem.poem_id
    }
  })
}
</script>

<style lang="less" scoped>
.liked-poem-card {
  // margin-bottom: 24px; // 移除底部边距，使用grid gap控制间距

  .poem-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(139, 92, 246, 0.1);
    background: linear-gradient(135deg, #ffffff, #fafafa);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    height: 420px; // 固定卡片高度
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 
        0 20px 40px rgba(139, 92, 246, 0.15),
        0 8px 16px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.3);
    }

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .card-header {
    padding: 20px 24px;
    background: linear-gradient(135deg, #fef3f2, #fdf2f8, #f8fafc);
    border-bottom: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    flex-shrink: 0; // 头部高度固定，不压缩

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 24px;
      right: 24px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
    }

    .title-section {
      flex: 1;
      min-width: 0;

      .poem-title {
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #1e293b, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 12px 0;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        overflow: hidden;
      }

      .author-info {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 14px;

        .author {
          color: #6366f1;
          font-weight: 600;
          padding: 4px 12px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .like-time {
          color: #64748b;
          font-weight: 500;
          font-style: italic;
        }
      }
    }

    .like-icon {
      flex-shrink: 0;
      opacity: 0.9;
      transform: scale(1.2);
      filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
    }
  }

  .card-content {
    padding: 24px;
    background: linear-gradient(135deg, #ffffff, #fefefe);
    position: relative;
    flex: 1; // 占据剩余空间
    overflow: hidden; // 隐藏溢出内容

    &::before {
      content: '"';
      position: absolute;
      top: 8px;
      left: 8px;
      font-size: 48px;
      color: rgba(139, 92, 246, 0.15);
      font-family: serif;
      line-height: 1;
    }

    &::after {
      content: '"';
      position: absolute;
      bottom: 8px;
      right: 16px;
      font-size: 48px;
      color: rgba(139, 92, 246, 0.15);
      font-family: serif;
      line-height: 1;
    }

    .poem-content {
      position: relative;
      z-index: 1;
      height: 100%; // 占满剩余空间
      display: flex;
      align-items: center;

      pre {
        font-family: 'STKaiti', '楷体', 'KaiTi', 'Microsoft YaHei', serif;
        font-size: 16px;
        line-height: 1.8;
        color: #2d3748;
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        line-clamp: 5;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        padding: 16px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 12px;
        border: 1px solid rgba(139, 92, 246, 0.1);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

}

// 响应式设计
@media (max-width: 768px) {
  .liked-poem-card {
    // margin-bottom: 16px; // 移除，使用grid gap

    .poem-card {
      border-radius: 12px;
      height: 380px; // 移动端稍微降低高度
    }

    .card-header {
      padding: 16px 20px;

      &::after {
        left: 20px;
        right: 20px;
      }

      .title-section {
        .poem-title {
          font-size: 18px;
        }

        .author-info {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .author {
            font-size: 13px;
            padding: 3px 10px;
          }

          .like-time {
            font-size: 12px;
          }
        }
      }

      .like-icon {
        transform: scale(1);
      }
    }

    .card-content {
      padding: 20px;

      &::before {
        font-size: 36px;
        top: 4px;
        left: 4px;
      }

      &::after {
        font-size: 36px;
        bottom: 4px;
        right: 12px;
      }

      .poem-content pre {
        font-size: 15px;
        line-height: 1.6;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        padding: 12px;
      }
    }
  }
}
</style>
