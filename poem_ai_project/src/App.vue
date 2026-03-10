<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView v-slot="{ Component }">
      <Transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </el-config-provider>
</template>

<style scoped>
/* 进入和离开时的动画过渡 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

/* 初始进入状态：透明 + 稍微下移 */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 离开结束状态：透明 + 稍微上移 */
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
