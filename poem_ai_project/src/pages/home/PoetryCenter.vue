<template>
  <div class="poetry-center-container">
    <CardItem title="诗歌分类">
      <div class="body">
        <CardKh
          width="85%"
          style="margin-left: 30px"
          :item="item"
          v-for="item in articleclasslist"
          :key="item.theme_id"
        >
          <p>{{ item.theme_description }}</p></CardKh
        >
      </div>
    </CardItem>

    <CardItem title="诗词创作">
      <div>
        <el-menu
          v-if="articleclasslist.length > 0"
          :default-active="String(form.theme_id)"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="item in articleclasslist"
            :key="item.theme_id"
            :index="String(item.theme_id)"
          >
            {{ item.theme_name }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="body" v-loading="loading">
        <CardKh
          width="100%"
          :item="item"
          v-for="item in fydata"
          :key="item.theme_id"
        >
          <p class="likecom">
            <span>点赞：{{ item.likes_count }}</span>
            <span>评论：{{ item.comment_count }}</span>
          </p>
        </CardKh>
      </div>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="form.currentPage4"
          v-model:page-size="form.pageSize4"
          :page-sizes="[4, 8, 12]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalnum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </CardItem>
  </div>
</template>

<script setup lang="ts">
import { getarticleclass, getpoemsall } from '@/api/articleclass'
import type { Theme } from '@/types'
import { ref } from 'vue'

const handleSelect = (key: string) => {
  form.value.theme_id = +key
  fenye()
}

const articleclasslist = ref<Theme[]>([])

async function getclass() {
  const res = await getarticleclass()
  articleclasslist.value = res.data.msg
  form.value.theme_id = articleclasslist.value[0].theme_id
  fenye()
}

getclass()
//分页
const form = ref({
  pageSize4: 4,
  currentPage4: 1,
  theme_id: 0
})

//分页数据
const fydata = ref()
const totalnum = ref()
const loading = ref(false)

async function fenye() {
  loading.value = true
  const res = await getpoemsall(form.value)
  loading.value = false
  fydata.value = res.data.msg.list
  totalnum.value = res.data.msg.pagination.totalCount
}

const handleSizeChange = (val: number) => {
  fenye()
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  fenye()
  console.log(`current page: ${val}`)
}
</script>

<style scoped lang="less">
.likecom {
  display: flex;
  justify-content: space-between;
  color: gray;
}
:deep(.el-select__wrapper) {
  margin-left: 30px;
  text-align: center;
}
.el-menu {
  justify-content: center;
  border: none;
}
.poetry-center-container {
  min-height: 400px;
  border-radius: 16px;

  .body {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 20px;
  }
}
@media (max-width: 768px) {
  .poetry-center-container {
    padding: 20px;
  }
}
.demo-pagination-block {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
