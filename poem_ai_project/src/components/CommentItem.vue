<template>
  <div class="body">
    <CommentsKh :item="top">
      <el-button class="repeat" @click="repeatcomment"
        ><el-icon><i-ep-ChatLineRound /></el-icon>回复</el-button
      >
    </CommentsKh>
    <div class="erji-comment">
      <CommentsKh
        v-for="item in item.replies"
        :key="item.comment_id"
        :item="item"
      >
      </CommentsKh>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { NewComment } from '@/types'

const emit = defineEmits(['change'])

const props = defineProps<{
  item: NewComment
}>()
const top = { ...props.item }
top.replies = []

function repeatcomment() {
  emit(
    'change',
    props.item.comment_id,
    props.item.nickname,
    props.item.comment_id
  )
}
</script>
<style lang="less" scoped>
.erji-comment {
  margin-left: 20%;
}
.repeat {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 6px; /* 图标与文字的间距，可选 */
  margin-left: 45px;
}

.body {
  background-color: #f9f5ff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-radius: 20px;
}
</style>
