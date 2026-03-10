export function splitPoemIntoArray(poem: string): string[] {
  // 使用正则表达式分割，同时过滤可能的空字符串
  return poem.split(/。/).filter((line) => line.trim() !== '')
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 计算时间差
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    // 超过一周显示具体日期
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }
}
