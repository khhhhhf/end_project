<template>
  <div class="game">
    <CardItem title="飞花令" :width="600">
      <div class="content">
        <header>
          本轮关键字: <span class="key">{{ key }}</span>
        </header>
        <main>
          <div class="inputgame">
            <input
              ref="gameinput"
              v-model.trim="textcenter"
              type="text"
              placeholder="请输入包含"
            />

            <el-icon v-show="xs === 1"><i-ep-Select /></el-icon>
            <el-icon v-show="xs === 2"><i-ep-Close /></el-icon>
          </div>
          <div>
            <el-button v-loading="loading" @click="startgame" type="primary">{{
              !ispd ? '开始游戏' : '提交'
            }}</el-button>
            <el-button @click="changekey" :disabled="ispd">换一个字</el-button>
          </div>
          <div class="sj">时间还剩余 {{ timer }}s</div>
        </main>
        <Transition name="gameover">
          <div v-if="showGameover" class="gameover">回答错误 gameover</div>
        </Transition>
      </div>
    </CardItem>
    <CardItem title="AI绘画" :width="600">
      <template #empty>
        <div class="empty">敬请期待</div>
      </template>
    </CardItem>
  </div>
</template>
<script setup lang="ts">
import { searchfhl } from '@/api/user'
import { ref, onMounted } from 'vue'

const gameinput = ref()

onMounted(() => {
  gameinput.value.focus()
})

const arr = ['月', '秋', '山', '水', '春', '日', '沙', '夏', '秋', '冬']
const key = ref(arr[0])
const textcenter = ref('')
const timer = ref(30)
const ispd = ref(false)
const xs = ref(0)
const loading = ref(false)
const showGameover = ref(false)

function changekey() {
  key.value = arr[Math.floor(Math.random() * arr.length)]
}

let n: number | null = null

function gameOver() {
  showGameover.value = true
  textcenter.value = ''
  timer.value = 30
  if (n) clearInterval(n)
  ispd.value = false
  setTimeout(() => {
    showGameover.value = false
  }, 2000) // 2 秒后消失
}

async function startgame() {
  if (ispd.value) {
    if (textcenter.value === '') {
      ElMessage.warning('输入内容不能为空')
      return
    }
    loading.value = true
    const res = await searchfhl({
      keyword: key.value,
      content: textcenter.value
    })
    xs.value = res.data.msg
    loading.value = false
    if (xs.value === 1) {
      timer.value = 30
    } else {
      gameOver()
    }
    setTimeout(() => {
      xs.value = 0
    }, 1000)
  } else {
    ispd.value = true
    n = setInterval(() => {
      timer.value--
      if (timer.value === 0) {
        gameOver()
      }
    }, 1000)
  }
}
</script>
<style lang="less" scoped>
.empty {
  color: skyblue;
  font-weight: 700;
  height: 230px;
  line-height: 240px;
  font-size: 40px;
}
.gameover-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.gameover-enter-active {
  transition: all 0.5s ease;
}
.gameover-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.gameover-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.gameover-leave-active {
  transition: all 0.5s ease;
}
.gameover-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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
.game {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
  .content {
    position: relative;
    .gameover {
      position: absolute;
      top: 10px;
      left: 50%;
      margin-left: -100px;
      background-color: #eeeafb;
      width: 200px;
      height: 40px;
      border-radius: 20px;
      color: red;
      line-height: 40px;
      // margin: 20px auto;
    }
    .key {
      display: inline-block;
      border-radius: 10px;
      line-height: 30px;
      color: purple;
      font-weight: 700;
      width: 40px;
      height: 30px;
      background-color: #eeeafb;
    }
    .inputgame {
      position: relative;
      input {
        width: 400px;
        height: 40px;
        border-radius: 10px;
        margin: 20px auto;
        border: purple 2px solid;
        font-size: 18px;
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
      .el-icon {
        color: red;
        position: absolute;
        right: 100px;
        font-size: 20px;
        top: 35px;
      }
    }
    .sj {
      margin-top: 20px;
      color: #8a2be2;
    }
  }
}
</style>
