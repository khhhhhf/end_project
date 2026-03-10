<template>
  <div>
    <div class="comment-header">
      <div class="comment-avatar">
        <img
          :src="
            item.avatar_url != 'default_avatar.png'
              ? baseURL + item.avatar_url
              : imgUrl
          "
          alt=""
        />
      </div>
      <div class="comment-info">
        <div class="comment-author">{{ item.nickname }}</div>
        <div class="comment-time">{{ item.created_at }}</div>
      </div>
    </div>
    <div class="comment-content">{{ item.content }}</div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import type { NewComment } from '@/types'
import imgUrl from '@/assets/image.png'
import { baseURL } from '@/utils/request'

defineProps<{
  item: NewComment
}>()
</script>
<style lang="less" scoped>
.comment-header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  min-height: 70px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.comment-info {
  flex: 1;
}

.comment-author {
  font-weight: 500;
  color: #4a148c;
  margin-bottom: 3px;
}

.comment-time {
  font-size: 0.8rem;
  color: #9c27b0;
  opacity: 0.7;
}

.comment-content {
  line-height: 1.6;
  color: #333;
  margin-bottom: 10px;
  padding-left: 50px;
  box-sizing: border-box;
}
</style>
