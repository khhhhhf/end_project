import { globalIgnores } from 'eslint/config'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from '@vue/eslint-config-prettier'
import globals from 'globals' // 新增导入 globals

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // 使用完整的 Prettier 配置
  prettierConfig,

  // 新增环境配置部分,解决console未定义问题
  {
    // 添加浏览器环境配置
    languageOptions: {
      globals: {
        ...globals.browser, // 导入浏览器全局变量
        ...globals.node, // 同时导入 Node.js 全局变量
        ElMessage: 'readonly', //不然会报错
        ElMessageBox: 'readonly'
      }
    }
  },

  // 规则配置
  {
    rules: {
      // 覆盖 Prettier 默认配置
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ],
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index']
        }
      ],
      'vue/no-setup-props-destructure': ['off'],
      'no-undef': 'error' // 保持 no-undef 规则为警告级别
    }
  }
)
