---
name: thesis-expression-refiner
description: Refine thesis, paper, report, and graduation-project prose that sounds formulaic, generic, repetitive, or overly AI-written into more concrete, natural academic writing. Use when the user asks to lower template-like phrasing, reduce stiff AI-sounding language, rewrite introductions, significance, research status, system design, testing, summaries, or acknowledgements, or wants prompt guidance for external writing assistants while preserving facts, citations, and the writer's real project details.
---

# Thesis Expression Refiner

## Overview

Use this skill to revise Chinese academic prose so it reads more like grounded student writing and less like generic template text. Preserve facts, sources, and project-specific details. Do not promise plagiarism scores, AI-detection scores, or bypass results.

## Workflow

### 1. Lock the factual boundary

Before rewriting, identify:

- what claims must stay unchanged
- what project details are real and should be emphasized
- what citations, tables, figures, or test data must not be altered
- what section the text belongs to, such as background, significance, system design, testing, summary, or acknowledgement

If the draft lacks concrete project facts, ask for them or reuse only details already established in the conversation or files.

### 2. Diagnose high-template patterns

Scan for these common problems:

- stock openings such as "随着...的发展"
- abstract big-picture claims with little project grounding
- repeated parallel noun phrases joined by `和` or `与`
- repeated verb-object chains such as "提高...、增强...、促进..."
- too many short sentences stacked one after another
- sentence lengths that are too uniform from start to finish
- heavy use of connectors such as "与此同时" "此外" "综上所述"
- excessive sequence markers such as "首先、其次、最后" when the content is not truly procedural
- overuse of degree adverbs and inflated modifiers such as "深入、精准、全面、系统、充分"
- heavy quotation-mark usage that turns ordinary concepts into fake jargon
- mechanically complete subject-verb-object sentences with little variation
- paragraphs that talk about "the system" in general terms without naming actual modules
- research-status text that sounds copied from a generic review

### 3. Rewrite for specificity first, variety second

Apply these rules in order:

1. Replace generic statements with project facts.
2. State what this project actually does before stating why it matters.
3. Rebuild the paragraph from its ideas when the original structure feels too smooth or too formulaic.
4. Merge related short sentences when they clearly belong together.
5. Break one overloaded sentence into two when it contains too many parallel structures.
6. Reduce repeated `A与B` or `A、B、C` structures unless the list is necessary.
7. Keep only one strong action chain per sentence.
8. Vary sentence openings so multiple sentences do not all begin with the same pattern.
9. Mix shorter and longer sentences so paragraph rhythm is less uniform.
10. Remove unsupported intensifiers and replace empty abstract nouns with concrete claims.
11. Prefer direct wording over inflated wording.

### 4. Use text reconstruction when needed

If a paragraph still sounds obviously generated after light editing, do not keep polishing the same sentence skeleton. Instead:

1. extract the factual points
2. keep any real data, citations, or project details
3. discard the old sentence order
4. rewrite the paragraph from scratch in a new order
5. check that the final paragraph still says the same thing

Treat this as reconstruction, not synonym replacement.

### 5. Keep the right academic tone

Target style:

- natural and readable
- modest and evidence-based
- concrete rather than grand
- formal but not stiff
- closer to a student's real project report than to a marketing article

Avoid:

- slang
- exaggerated praise
- invented metrics, experiments, or literature
- pretending AI-generated content is human-authored evidence
- removing citations that are still needed

### 6. Support a plain student voice when explicitly requested

If the user explicitly asks for writing that sounds like a plain, less polished, or more student-like voice, shift the output in this direction:

- use simpler and more familiar wording
- keep sentences direct and easy to follow
- reduce heavy abstract phrasing
- keep claims modest
- let the paragraph sound more like a real undergraduate project report

Still avoid:

- slang
- grammatical errors on purpose
- fake incompetence
- damaging factual accuracy just to sound less formal

Useful cues:

- "改得朴实一点"
- "像本科生自己写的"
- "别太书面"
- "少一点官方腔"
- "更接地气一点"

## Style Controls That Usually Help

### Sentence rhythm

Do:

- combine two overly short sentences when they belong to one idea
- split one overpacked sentence when it has too many clauses
- let paragraph rhythm vary naturally
- let sentence length and sentence form change across the paragraph instead of staying flat

Avoid:

- one sentence per line of thought with identical length
- a full paragraph made only of smooth medium-length sentences

### Complexity and expressiveness

Do:

- increase lexical variety when the draft repeats the same high-frequency words
- choose more specific verbs and nouns when they improve meaning
- allow moderate unpredictability in phrasing as long as the paragraph stays clear
- create dynamic movement by varying sentence length, clause count, and sentence form

Avoid:

- replacing clear wording with obscure wording just to sound advanced
- forcing complexity into every sentence
- keeping all sentences at the same density and rhythm

### Modifier control

Do:

- keep modifiers only when they add real meaning
- replace vague praise with concrete description

Avoid:

- "深入、全面、系统、精准、充分" without evidence
- repeated "有效提升、进一步增强、持续促进" chains

### Connector control

Do:

- use natural semantic transitions
- keep sequence markers only when the content is truly stepwise

Avoid:

- forcing every paragraph into "首先、其次、最后"
- starting several consecutive sentences with the same connector

### Quotation-mark control

Do:

- keep quotation marks for direct quotations or genuinely special terms

Avoid:

- adding quotation marks just to make ordinary concepts look professional
- turning common words into pseudo-academic labels

## Section-Specific Rewrite Guidance

### Background

Do:

- move quickly from broad context to the specific problem
- mention what existing platforms still lack
- connect the problem to the actual features in the project

Prefer:

- "现有诗词平台大多偏重展示，用户创作和互动支持相对不足。"
- "本项目在分类浏览之外加入了 AI 创作、评论回复和排行榜模块。"

Avoid:

- three full sentences of macro background before reaching the project
- repeating the same "发展/提升/推动" pattern

### Significance

Do:

- separate application value, cultural value, and engineering value
- name concrete modules instead of repeating "the system improves experience"

Prefer:

- "用户可以在同一平台中完成浏览、创作、评论和问答。"
- "项目还覆盖了前后端联调、数据库设计和 AI 接口接入。"

### Research Status

Do:

- compare existing poetry platforms and general AI tools
- state limits plainly

Useful sentence templates:

- "现有研究多围绕……展开。"
- "已有平台在……方面较成熟，但在……方面仍显不足。"
- "通用型工具提供了基础能力，但放到本场景中仍存在……问题。"

### System Design and Implementation

Do:

- anchor every paragraph to real modules, tables, routes, or interfaces
- explain why the chosen structure fits the project size

Prefer:

- framework names
- table names such as `users`, `poems`, `likes`, `comments`
- actual functions such as login, AI inspiration, comment reply, ranking, admin publishing

### Testing

Do:

- describe tested flows and observed behavior
- keep quantitative claims only if real measurements exist

Avoid:

- invented response times
- invented concurrency numbers
- vague claims like "the system performs excellently"

### Summary and Outlook

Do:

- summarize what was actually completed
- keep future work tied to the current project

Prefer:

- "后续可以补充统一鉴权中间件。"
- "后续可以增加诗篇编辑和推荐功能。"

## Detection-Aware but Integrity-Safe Heuristics

When a user is worried that text sounds overly machine-generated, explain the issue in writing terms rather than promising score changes. Useful concepts:

- **predictability**: text feels too expected because it uses high-frequency wording and over-regular structure
- **rhythmic uniformity**: sentence length and paragraph cadence barely change

Safe writing responses:

- increase specificity
- increase lexical variety where repetition is obvious
- reduce empty abstractions
- vary sentence rhythm
- vary sentence form and sentence length
- remove repeated patterns
- reconstruct paragraphs from ideas instead of only swapping words

Do not claim these heuristics will guarantee any detector outcome.

## External-Assistant Prompt Pattern

If the user explicitly wants a prompt for an external assistant such as Doubao, generate a prompt that asks it to:

- preserve facts and citations
- reduce stock openings and empty macro statements
- reduce repeated `和/与` noun-pair structures
- reduce repeated verb-object chains
- reduce uniform sentence rhythm and over-regular paragraph structure
- improve lexical richness without changing facts
- increase sentence-form variation so the paragraph has more natural rhythm
- remove unnecessary degree adverbs and empty modifiers
- reduce fake-academic quotation marks and overused sequence markers
- merge short sentences into smoother longer sentences when appropriate
- split overpacked sentences when they become too patterned
- reconstruct the paragraph if light editing is not enough
- keep the text sounding like a real student's thesis draft
- avoid inventing data, references, or functions

Good external prompt shape:

```text
请在不改变原意、不增删事实、不删除引用位置的前提下，重写下面这段论文文字。
要求：
1. 减少模板化表达和空泛套话；
2. 少用“随着…发展”“与此同时”“综上所述”等固定开头；
3. 避免连续出现“和/与”并列双名词结构；
4. 避免连续出现“提升…增强…促进…”这类雷同动宾句式；
5. 减少“首先、其次、最后”等过度线性的连接方式，除非内容本身就是步骤说明；
6. 减少“深入、全面、系统、精准、充分”等没有依据的修饰词；
7. 减少无必要的引号和假大空名词化表达；
8. 适当合并过短的句子，也可以拆开过于工整的长句，让句长有变化；
9. 在不影响清晰度的前提下，提高词汇变化，避免整段反复使用同一类高频表达；
10. 让句式和句长有波动，不要每一句都同样整齐；
11. 如果局部修改后仍然很模板化，请打散原有句序，只保留核心事实后重新组织段落；
12. 多写项目里的真实模块、流程和实现细节；
13. 保持本科论文语气，正式但不要僵硬；
14. 不要编造数据、文献和功能。
```

## Output Pattern

Unless the user asks otherwise, return:

1. the revised passage
2. a short note on what changed
3. any factual gaps that still need the user's confirmation

For long sections, revise paragraph by paragraph rather than rewriting the whole chapter in one undifferentiated block.

## Guardrails

- Do not present the skill as a way to bypass academic-integrity systems.
- Do not guarantee any plagiarism or AI-detection score.
- Do not fabricate references, test results, survey data, or implementation details.
- Do not remove necessary citations merely to make text look more original.
- If the user asks for deception or detector evasion, pivot to improving originality, specificity, and citation hygiene instead.

## Example User Requests

- "把这段研究背景改得别那么像 AI 写的。"
- "帮我把系统测试这部分写得像本科论文一点。"
- "把这一段改自然一些，多带一点我的项目细节。"
- "给我一段可以发给豆包的改写提示词，但不要改动事实。"
- "把这段改得像普通大学生自己写的，朴实一点。"
