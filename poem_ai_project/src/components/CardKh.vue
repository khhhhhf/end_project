<template>
  <div>
    <div class="card" :style="{ width }" @click="tz">
      <el-card shadow="hover">
        <img :src="imgg" alt="" />
        <div class="bottom">
          <h3>{{ (item as Theme).theme_name || (item as create).title }}</h3>
          <slot></slot>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { ref,reactive } from 'vue';
import type { create, Theme } from '@/types'
import { baseURL } from '@/utils/request'
import imgsrc from '@/assets/bj.jpg'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const imgg = computed(() => {
  return (pp.item as Theme).theme_image
    ? baseURL + (pp.item as Theme).theme_image
    : imgsrc
})

interface Props {
  width?: string
  item: Theme | create
}
const pp = defineProps<Props>()

const router = useRouter()
function tz() {
  if ((pp.item as Theme).theme_id) {
    router.push({
      name: 'ClassIndex',
      params: {
        them_id: (pp.item as Theme).theme_id
      }
    })
  } else {
    router.push({
      name: 'ArticleIndex',
      params: {
        poem_id: (pp.item as create).poem_id
      }
    })
  }
}
</script>
<style lang="less" scoped>
.card {
  margin-top: 20px;
  .el-card {
    border-radius: 20px;
    :deep(.el-card__body) {
      padding: 0px;
    }
    .bottom {
      height: 120px;
      padding: 20px;
      box-sizing: border-box;
      h3 {
        margin: 0px;
      }
    }
  }
  img {
    width: 100%;
    height: 180px;
  }
}
</style>
