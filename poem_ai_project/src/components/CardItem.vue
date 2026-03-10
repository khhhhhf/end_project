<template>
  <el-card :style="{ width: '100%', maxWidth: props.width + 'px' }">
    <template #header>
      <div class="card-header">
        <span>{{ props.title }}</span>
      </div>
    </template>
    <slot></slot>
    <slot name="empty"></slot>
  </el-card>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    width?: number
  }>(),
  {
    title: '嘻嘻嘻',
    width: 1500
  }
)
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 40px;
}
.card-header {
  font-weight: 700;
}
:deep(.el-card__body) {
  min-height: 240px;
}
</style>
