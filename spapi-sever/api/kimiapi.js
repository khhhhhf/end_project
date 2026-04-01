const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: "sk-XK1NL8DvfvoZNp3s6s2po15EWgBtC29TiukSU3cXnZfTemb4", // 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
  baseURL: "https://api.moonshot.cn/v1",
})
//ai生成意向
async function generatePoetryPrompt(userTheme) {
  const completion = await client.chat.completions.create({
    model: "moonshot-v1-8k",
    messages: [
      {
        role: "system",
        content: `你是一个诗歌创作助手，请严格按照以下 JSON 格式响应：
        {
          "creativeDirections": [
            {
              "themeVariant": "主题变体",
              "imagery": ["意象1", "意象2"],
              "rhetoric": "修辞手法",
              "emotion": "情感基调"
            }
          ],
          "guidingQuestions": ["问题1", "问题2"],
          "styleSuggestions": ["风格1", "风格2"]
        }
        要求：
        1. 生成3个creativeDirections
        2. 每个方向包含2-3个意象
        3. 使用中文但字段名保持英文
        4. 避免Markdown格式
        当前主题：${userTheme}`
      },
      {
        role: "user",
        content: "请生成结构化创作提示"
      }
    ],
    temperature: 0.5,  // 适当降低温度保证格式
    response_format: { type: "json_object" }  // 关键参数
  });

  return parseResponse(completion.choices[0].message.content);
}

// JSON 解析保障函数
function parseResponse(text) {
  try {
    // 处理可能存在的 Markdown 代码块
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('解析失败，启用备用方案:', e);
    return {
      error: "格式解析失败",
      original: text
    };
  }
}

// 原子级校验函数
async function judgeFlyingFlowerWord(word, sentence) {
  const maxRetries = 3;
  let retries = 0;

  // 严格预处理
  const strictPreprocess = (str) => {
    // 保留原始空格用于错误检测
    return str
      .replace(/[，。！？；、]/g, '') // 仅移除中文标点
      .normalize("NFKC") // 统一unicode格式
      .replace(/\s+/g, ' '); // 标准化空格
  };

  // 军事级校验提示
  const militaryGradePrompt = `您是国家级的古诗校验系统，请执行原子级校验：

<校验标准>
1. 双重必要条件：
   √ 字：必须包含目标字且位置与权威版本一致
   √ 句：必须与《全唐诗》《宋词三百首》等权威版本逐字一致

2. 立即拒绝的情况：
   × 任何字形差异（窗≠牕≠牎≠窓）
   × 通假字/异体字（云≠雲）
   × 字序/字数变化（即使语义通顺）
   × 标点/空格改变字符合并（如"床前明 月光"）

<验证流程>
1. 字形校验：逐字比对unicode编码
2. 字序校验：确认字词顺序
3. 完整性校验：诗句必须完整

<武器级示例>
✅ 通过：
字：床 | 句：床前明月光（李白《静夜思》原句）
❌ 拒绝：
字：床 | 句：窗前明月光（U+5E8A→U+7A97）
字：明 | 句：床前名月光（U+540D→U+660E）

请输出严格JSON：{"result":1|2} 无需解释`;

  while (retries < maxRetries) {
    try {
      const completion = await client.chat.completions.create({
        model: "moonshot-v1-128k",
        messages: [
          {
            role: "system",
            content: militaryGradePrompt
          },
          {
            role: "user",
            content: `[校验任务]
目标字：${strictPreprocess(word)}
输入句：${strictPreprocess(sentence)}`
          }
        ],
        temperature: 0,
        max_tokens: 50,
        top_p: 0.01,
        frequency_penalty: 1.2,
        response_format: { type: "json_object" }
      });

      // 特种兵式响应解析
      try {
        const response = JSON.parse(completion.choices[0].message.content);
        if (response.result === 1) {
          // 二次确认（防止误判）
          if (strictPreprocess(sentence).includes(strictPreprocess(word))) {
            return 1;
          }
          return 2;
        }
        return response.result;
      } catch {
        throw new Error("非法响应格式");
      }
    } catch (e) {
      // 错误处理保持不变...
    }
  }
  return 2; // 默认拒绝
}

async function getPoemRelatedResponse(poemContent, userQuestion) {
  if (!userQuestion) {
    throw new Error('用户提问不能为空，请提供有效的问题。');
  }
  try {
    const completion = await client.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content: `你是一个助手，会依据给定的诗歌内容回答用户的问题。以下是诗歌的描述：${poemContent}，回答要精简明了`
        },
        {
          role: "user",
          content: userQuestion
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('调用 OpenAI API 时发生错误:', error);
    throw new Error('无法获取有效的回复，请稍后再试。');
  }
}


//ai判断是否
module.exports = {  
  generatePoetryPrompt,
  judgeFlyingFlowerWord,
  getPoemRelatedResponse
}