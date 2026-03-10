<template>
  <div>
    <UserRanking :item="userRanking">创作排行榜</UserRanking>
    <UserRanking>敬请期待</UserRanking>
  </div>
</template>

<script setup lang="ts">
import { activeUser } from '@/api/user'
import { ref } from 'vue'

const userRanking = ref()

async function render() {
  const res = await activeUser()
  userRanking.value = res.data.msg
}

render()
</script>

<style scoped lang="less"></style>
