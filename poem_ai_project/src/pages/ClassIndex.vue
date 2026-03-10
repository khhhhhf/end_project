<template>
  <div class="class-index-container">
    <h2>分类</h2>
    <p>分类ID: {{ route.params.them_id }}</p>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style lang="less" scoped>
.class-index-container {
  padding: 20px;
}
</style>
