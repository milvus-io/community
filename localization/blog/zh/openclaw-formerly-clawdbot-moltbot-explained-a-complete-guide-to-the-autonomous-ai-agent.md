---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: OpenClaw（前身为 Clawdbot 和 Moltbot）详解：自主人工智能 Agents 完全指南
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: OpenClaw（Clawdbot/Moltbot）完整指南--工作原理、安装攻略、使用案例、Moltbook 和安全警告。
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a>（前身为 Moltbot 和 Clawdbot）是一个开源的人工智能代理，它运行在你的机器上，通过你已经使用的消息应用程序（WhatsApp、Telegram、Slack、Signal 等）进行连接，并代表你进行操作--shell 命令、浏览器自动化、电子邮件、日历和文件操作。心跳调度程序会以可配置的时间间隔唤醒它，因此无需提示即可运行。2026 年 1 月底，OpenClaw 在 GitHub 上发布，不到一周时间就获得了<a href="https://github.com/openclaw/openclaw">10 万多颗</a>星，成为 GitHub 历史上增长最快的开源软件源之一。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw 的与众不同之处在于它的组合：MIT 许可、开源、本地优先（内存和数据以 Markdown 文件的形式存储在磁盘上），并可通过便携式技能格式进行社区扩展。这也是代理式人工智能领域一些更有趣的实验发生的地方--一位开发者的代理在他睡觉时通过电子邮件谈妥了 4200 美元的购车优惠；另一位开发者在没有被要求的情况下对保险拒赔提出了法律反驳；还有一位用户创建了<a href="https://moltbook.com/">Moltbook</a>，这是一个社交网络，有超过一百万个人工智能代理在人类的注视下自主互动。</p>
<p>本指南将为您介绍您需要了解的一切：OpenClaw 是什么、它如何工作、它在现实生活中能做什么、它与 Moltbook 的关系以及与之相关的安全风险。</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">什么是 OpenClaw？<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a>（前身为 Clawdbot 和 Moltbot）是一款自主、开源的人工智能助手，可在您的机器上运行，并存在于您的聊天应用程序中。您可以通过 WhatsApp、Telegram、<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>、Discord、iMessage 或 Signal（无论您使用的是什么）与它对话，它也会回话。但与 ChatGPT 或 Claude 的网页界面不同，OpenClaw 不只是回答问题。它可以运行 shell 命令、控制浏览器、读写文件、管理日历和发送电子邮件，所有这些都由文本信息触发。</p>
<p>它专为开发人员和高级用户设计，他们需要一个可以随时随地发送信息的个人人工智能助手，而无需牺牲对数据的控制或依赖托管服务。</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">OpenClaw 的主要功能</h3><ul>
<li><p><strong>多渠道网关</strong>--WhatsApp、Telegram、Discord 和 iMessage 只需一个网关流程。通过扩展包添加 Mattermost 等功能。</p></li>
<li><p><strong>多代理路由</strong>--每个代理、工作区或发件人都有独立的会话。</p></li>
<li><p><strong>媒体支持</strong>--收发图片、音频和文档。</p></li>
<li><p><strong>网络控制 UI</strong>- 用于聊天、配置、会话和节点的浏览器仪表板。</p></li>
<li><p><strong>移动节点</strong>- 配对支持画布的 iOS 和 Android 节点。</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">OpenClaw有何与众不同之处？</h3><p><strong>OpenClaw是自托管的。</strong></p>
<p>OpenClaw的网关、工具和内存都在您的计算机上，而不是在供应商托管的SaaS中。OpenClaw将对话、长期记忆和技能以纯Markdown和YAML文件的形式存储在你的工作区和<code translate="no">~/.openclaw</code> 。你可以用任何文本编辑器检查它们，用Git备份它们，用grep搜索它们，或者删除它们。人工智能模型可以是云托管的（Anthropic、OpenAI、Google），也可以是本地的（通过 Ollama、LM Studio 或其他兼容 OpenAI 的服务器），这取决于你如何配置模型块。如果希望所有推理都留在自己的硬件上，则只能将 OpenClaw 指向本地模型。</p>
<p><strong>OpenClaw 完全自主</strong></p>
<p>网关作为后台守护程序运行（Linux上为<code translate="no">systemd</code> ，macOS上为<code translate="no">LaunchAgent</code> ），可配置心跳频率--默认情况下每30分钟一次，Anthropic OAuth情况下每小时一次。每次心跳时，Agent 会从<code translate="no">HEARTBEAT.md</code> 读取工作区中的检查表，决定是否有任何项目需要采取行动，然后向你发送消息或回复<code translate="no">HEARTBEAT_OK</code> （网关会默默地丢弃这些消息）。外部事件--网络钩子、cron 作业、队友消息--也会触发代理循环。</p>
<p>Agents 的自主权大小取决于配置。工具策略和执行审批管理高风险操作：你可能允许读取电子邮件，但在发送前需要审批；允许读取文件，但阻止删除。禁用这些防护措施，它就可以不经询问直接执行。</p>
<p><strong>OpenClaw 是开源的。</strong></p>
<p>核心网关已获得 MIT 许可。它具有完全可读性、可分叉性和可审计性。这一点很重要：Anthropic 曾针对一名对 Claude Code 客户端进行解密的开发者提起 DMCA 侵权诉讼；OpenAI 的 Codex CLI 是 Apache 2.0，但网页用户界面和模型是封闭的；Manus 则是完全封闭的。</p>
<p>生态系统反映了开放性。<a href="https://github.com/openclaw/openclaw">数以百计的贡献者</a>已经构建了技能--带有 YAML 前置语和自然语言指令的模块化<code translate="no">SKILL.md</code> 文件--通过 ClawHub（Agents 可以自动搜索的技能注册中心）、社区仓库或直接 URL 共享。该格式具有可移植性，与克劳德代码和光标约定兼容。如果技能不存在，你可以向 Agents 描述任务，让它起草一个。</p>
<p>这种本地所有权、社区驱动的进化和自主操作符的结合，正是开发人员兴奋的原因。对于希望完全控制人工智能工具的开发者来说，这一点至关重要。</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">OpenClaw 的工作原理<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><strong>一个进程，内部一切</strong></p>
<p>运行<code translate="no">openclaw gateway</code> 时，会启动一个名为网关（Gateway）的长寿命 Node.js 进程。该进程就是整个系统--通道连接、会话状态、Agent 循环、模型调用、工具执行、内存持久化。没有单独的服务需要管理。</p>
<p>一个进程包含五个子系统：</p>
<ol>
<li><p><strong>通道适配器</strong>--每个平台一个（WhatsApp 的 Baileys、Telegram 的 grammY 等）。将输入信息规范化为通用格式；将回复序列化。</p></li>
<li><p><strong>会话管理器</strong>--解析发件人身份和对话上下文。DM 会合并到一个主会话中；群组聊天有自己的会话。</p></li>
<li><p><strong>队列</strong>--序列化每个会话的运行。如果有消息在运行过程中到达，它就会保留、注入或收集消息，以便后续处理。</p></li>
<li><p><strong>Agent 运行时</strong>--收集上下文（AGENTS.md、SOUL.md、TOOLS.md、MEMORY.md、每日日志、对话历史），然后运行 Agent 循环：调用模型→执行工具调用→反馈结果→重复直到完成。</p></li>
<li><p><strong>控制平面</strong>-<code translate="no">:18789</code> 上的 WebSocket API。CLI、macOS 应用程序、Web UI 和 iOS/Android 节点都在这里连接。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>模型是一个外部 API 调用，可以在本地运行，也可以不运行。其他一切--路由、工具、内存、状态--都存在于你机器上的那个进程中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>对于一个简单的请求，循环只需几秒钟即可完成。多步骤工具链则需要更长的时间。模型是一个外部 API 调用，可能在本地运行，也可能不在本地运行，但路由、工具、内存、状态等其他一切都在你机器上的那个进程中。</p>
<p><strong>与克劳德代码相同的循环，不同的外壳</strong></p>
<p>Agents 循环--输入→上下文→模型→工具→重复→回复--与 Claude Code 使用的模式相同。每个严肃的 Agents 框架都会运行它的某个版本。不同之处在于对它的包装。</p>
<p>Claude Code 将其封装在<strong>CLI</strong> 中：输入，运行，退出。OpenClaw 则将其封装在一个<strong>持久守护</strong>进程中，该进程与 12 个以上的消息平台相连，具有心跳调度器、跨渠道会话管理以及在运行之间持续存在的内存，即使你不在办公桌前也是如此。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>模型路由和故障转移</strong></p>
<p>OpenClaw与模型无关。您只需在<code translate="no">openclaw.json</code> 中配置提供商，网关就会据此进行路由--当提供商宕机时，网关会通过认证配置文件轮换和使用指数回退的后备链进行路由。但模型的选择很重要，因为 OpenClaw 会生成大量提示：系统指令、对话历史、工具 Schema、技能和记忆。这种上下文负载是大多数部署使用前沿模型作为主要协调器的原因，而更便宜的模型则处理心跳和子 Agents 任务。</p>
<p><strong>云与本地的权衡</strong></p>
<p>从网关的角度来看，云模型和本地模型看起来是一样的--它们都是兼容 OpenAI 的终端。不同之处在于权衡。</p>
<p>云模型（Anthropic、OpenAI、Google）具有强大的推理能力、较大的上下文窗口和可靠的工具使用。它们是主要协调器的默认选择。成本随使用情况而变化：轻度用户每月花费 5-20 美元，频繁心跳和大量提示的活跃 Agents 通常每月花费 50-150 美元，而未优化的高级用户的账单则高达数千美元。</p>
<p>通过 Ollama 或其他与 OpenAI 兼容的服务器建立本地模型可以省去每个令牌的费用，但需要硬件，而 OpenClaw 至少需要 64K 个令牌的上下文，这就缩小了可行的选择范围。在 14B 参数下，模型可以处理简单的自动操作，但对于多步骤代理任务来说则微不足道；根据社区经验，可靠的阈值为 32B 以上，至少需要 24GB 的 VRAM。在推理或扩展上下文方面，您无法与前沿云模型相媲美，但您可以获得完整的数据本地性和可预测的成本。</p>
<p><strong>这种架构能为你带来什么</strong></p>
<p>由于一切都通过一个进程运行，因此网关是一个单一的控制面。调用哪个模型、允许使用哪些工具、包含多少上下文、给予多少自主权，所有这些都在一个地方进行配置。通道与模型脱钩：将 Telegram 换成 Slack，或将 Claude 换成 Gemini，其他都不会改变。通道布线、工具和内存都在你的底层，而模型则是你向外的依赖。</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">运行 OpenClaw 究竟需要哪些硬件？</h3><p>一月末，网上流传着一些帖子，显示开发人员正在开箱拆卸多台 Mac Minis--一位用户在桌子上贴出了 40 台。甚至连谷歌 DeepMind 的 Logan Kilpatrick 也发帖表示要订购一台，不过实际的硬件要求要低得多。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>官方文档列出的最低要求是 2GB 内存和 2 个 CPU 内核（用于基本聊天），如果需要浏览器自动化，则需要 4GB 内存和 2 个 CPU 内核。每月 5 美元的 VPS 就能满足这些要求。你也可以用 Pulumi 部署在 AWS 或 Hetzner 上，在小型 VPS 上用 Docker 运行，或者用一台积满灰尘的旧笔记本电脑。Mac Mini 潮流的驱动力是社会证明，而非技术要求。</p>
<p><strong>那么，人们为什么要购买专用硬件呢？有两个原因：隔离和持久性。</strong>当你给一个自主代理 shell 访问权限时，你需要一台在出错时可以物理拔掉插头的机器。由于 OpenClaw 依靠心跳运行--按照可配置的时间表唤醒，以代表您采取行动--因此专用设备意味着它始终处于开启状态，时刻准备就绪。这样一来，您就可以在一台可以拔掉电源的计算机上实现物理隔离，而且正常运行时间也无需依赖云服务的可用性。</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">如何安装 OpenClaw 并快速上手<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>您需要<strong>Node 22 以上</strong>。如果不确定，请访问<code translate="no">node --version</code> 。</p>
<p><strong>安装 CLI：</strong></p>
<p>在 macOS/Linux 上</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Windows 上（PowerShell）：</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>运行入职向导：</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>该向导会指导你完成认证、网关配置，并可选择连接消息渠道（WhatsApp、Telegram 等）。<code translate="no">--install-daemon</code> 标志会将网关注册为后台服务，使其自动启动。</p>
<p><strong>验证网关是否正在运行：</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>打开仪表板：</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>这将打开控制用户界面，网址是<code translate="no">http://127.0.0.1:18789/</code> 。您可以在这里开始与 Agents 聊天，如果只是想测试一下，则无需设置频道。</p>
<p><strong>有几件事值得尽早了解。</strong>如果你想在前台而不是作为守护进程运行网关（对调试有用），可以这样做：</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>如果你需要自定义OpenClaw存储配置和状态的位置（比如以服务账户或在容器中运行），有三个环境变量很重要：</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - 用于内部路径解析的基本目录</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - 覆盖状态文件的存放位置</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - 指向特定配置文件</p></li>
</ul>
<p>网关运行和仪表板加载完成后，一切就绪。从这里开始，你可能需要连接一个消息通道并设置技能审批--我们将在接下来的章节中介绍这两项内容。</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">OpenClaw 与其他人工智能代理相比如何？<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>技术社区称 OpenClaw 为 "克劳德，但有双手"。这是一个生动的描述，但它忽略了架构上的差异。现在已经有几款人工智能产品有了 "手"--Anthropic 有<a href="https://claude.com/blog/claude-code">克劳德代码</a>和<a href="https://claude.com/blog/cowork-research-preview">Cowork</a>，OpenAI 有<a href="https://openai.com/codex/">Codex</a>和<a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT Agents</a>，<a href="https://manus.im/">Manus</a>也存在。在实践中，重要的区别在于</p>
<ul>
<li><p><strong>Agents 在哪里运行</strong>（你的机器与提供商的云端）</p></li>
<li><p><strong>与代理交互的方式</strong>（消息应用程序、终端、集成开发环境、网页用户界面）</p></li>
<li><p><strong>谁拥有状态和长期内存</strong>（本地文件与提供商账户）</p></li>
</ul>
<p>从高层次来看，OpenClaw 是一个本地优先的网关，它运行在你的硬件上，并通过聊天应用程序进行对话，而其他的大多是托管代理，你可以通过终端、集成开发环境或网页/桌面应用程序来驱动它。</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>克劳德代码</th><th>OpenAI 代码</th><th>ChatGPT 代理</th><th>马努斯</th></tr>
</thead>
<tbody>
<tr><td>开放源代码</td><td>是。核心网关采用 MIT 许可；</td><td>否。</td><td>否。</td><td>开放源代码</td><td>闭源 SaaS</td></tr>
<tr><td>界面</td><td>消息应用程序（WhatsApp、Telegram、Slack、Discord、Signal、iMessage 等）</td><td>终端、集成开发环境集成、网页和移动应用程序</td><td>终端 CLI、集成开发环境集成、Codex Web UI</td><td>ChatGPT 网页和桌面应用程序（包括 macOS Agents 模式）</td><td>网络仪表盘、浏览器操作符、Slack 和应用程序集成</td></tr>
<tr><td>主要重点</td><td>跨工具和服务的个人 + 开发人员自动化</td><td>软件开发和 DevOps 工作流程</td><td>软件开发和代码编辑</td><td>通用网络任务、研究和生产力工作流程</td><td>企业用户的研究、内容和网络自动化</td></tr>
<tr><td>会话内存</td><td>磁盘上基于文件的内存（Markdown + 日志）；可选插件增加语义/长期内存</td><td>带有历史记录的每个项目会话，以及账户上的可选 Claude 内存</td><td>CLI / 编辑器中的每个会话状态；没有内置的长期用户内存</td><td>由 ChatGPT 帐户级内存功能（如果启用）支持的每任务 "代理运行</td><td>跨运行的云端、账户范围内存，针对重复性工作流进行调整</td></tr>
<tr><td>部署</td><td>在您的机器或 VPS 上始终运行网关/守护进程；调用 LLM 提供商</td><td>作为 CLI/IDE 插件在开发人员的机器上运行；所有模型调用都通过 Anthropic 的 API 进行</td><td>CLI 在本地运行；模型通过 OpenAI 的 API 或 Codex Web 执行</td><td>完全由 OpenAI 托管；Agent 模式从 ChatGPT 客户端启动虚拟工作区</td><td>完全由 Manus 托管；代理在 Manus 的云环境中运行</td></tr>
<tr><td>目标受众</td><td>能够轻松运行自己的基础架构的开发人员和高级用户</td><td>在终端和 IDE 中工作的开发人员和 DevOps 工程师</td><td>希望在终端/IDE 中使用编码代理的开发人员</td><td>使用 ChatGPT 执行终端用户任务的知识工作者和团队</td><td>实现以网络为中心的工作流程自动化的企业用户和团队</td></tr>
<tr><td>费用</td><td>免费 + 根据使用情况调用 API</td><td>20-200 美元/月</td><td>20-200 美元/月</td><td>20-200 美元/月</td><td>39-199美元/月（积分）</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">OpenClaw的实际应用<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>OpenClaw的实用价值来自于它的应用范围。以下是人们使用OpenClaw构建的一些更有趣的东西，首先是我们为Milvus社区部署的支持机器人。</p>
<p><strong>Zilliz支持团队在Slack上为Milvus社区构建了一个人工智能支持机器人</strong></p>
<p>Zilliz 团队将 OpenClaw 连接到其 Slack 工作区，作为<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Milvus 社区助手</a>。设置只用了 20 分钟。现在，它可以回答有关 Milvus 的常见问题，帮助排除故障，并为用户指出相关文档。如果你想尝试类似的方法，我们编写了一份完整的<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">分步教程</a>，介绍如何将 OpenClaw 连接到 Slack。</p>
<ul>
<li><strong>OpenClaw教程：</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">将OpenClaw与Slack连接的分步指南</a></li>
</ul>
<p><strong>AJ Stuyvenberg 在睡觉时创建了一个 Agents，帮他在买车时谈妥了 4,200 美元的折扣</strong></p>
<p>软件工程师 AJ Stuyvenberg 让他的 OpenClaw 负责购买一辆 2026 年现代 Palisade。该 Agents 搜索了当地经销商的库存，用他的电话号码和电子邮件填写了联系表，然后花了几天时间让经销商相互竞争--转发相互竞争的 PDF 报价，并要求每个经销商都比其他经销商的价格低。最后的结果是：比标价低了<a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4,200 美元</a>，Stuyvenberg 只在文件上签了字。"他写道："将购车的痛苦环节外包给人工智能，真是令人耳目一新。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>霍尔莫德的 Agents 在没有提示的情况下为他赢得了之前结案的保险纠纷案</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一位名叫 Hormold 的用户曾被柠檬水保险公司拒绝理赔。他的 OpenClaw 发现了这封拒绝邮件，并起草了一份引用保单语言的反驳，然后在没有明确许可的情况下发送了出去。Lemonade 重新启动了调查。他在推特上写道：&quot;我的 @openclaw 意外地与柠檬水保险公司打了一架，&quot;&quot;谢谢，人工智能。</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook：用 OpenClaw 为 AI Agents 构建的社交网络<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>上面的例子展示了 OpenClaw 为单个用户自动执行任务的情况。但是，当成千上万的这些 Agents 互相交互时，会发生什么呢？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>2026 年 1 月 28 日，受 OpenClaw 的启发并利用 OpenClaw 构建的创业者 Matt Schlicht 推出了<a href="https://moltbook.com/">Moltbook</a>- 一个 Reddit 风格的平台，只有人工智能 Agents 可以在这个平台上发帖。增长速度很快。在 72 小时内，已有 32000 个代理注册。一周之内，注册人数就超过了 150 万。第一周就有超过一百万人访问观看。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>安全问题也来得同样快。1 月 31 日，也就是发布四天后，<a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 媒体报道</a>称，Supabase 数据库的错误配置导致平台的整个后台向公共互联网开放。安全研究员詹姆森-奥莱利（Jameson O'Reilly）发现了这一漏洞；<a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz 独立</a>证实了这一漏洞，并记录了漏洞的全部范围：对所有表格的未经验证的读写访问，包括 150 万个 Agents API 密钥、35000 多个电子邮件地址和数千条私人信息。</p>
<p>究竟 Moltbook 代表的是突发的机器行为，还是 Agents 从训练数据中复制科幻小说的套路，这还是个未决问题。不那么模糊的是技术演示：自主 Agents 保持持续的上下文，在共享平台上进行协调，并在没有明确指令的情况下产生结构化输出。对于使用 OpenClaw 或类似框架进行构建的工程师来说，这是大规模代理人工智能能力和安全挑战的现场预演。</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">OpenClaw 的技术风险和生产注意事项<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>在将 OpenClaw 部署到任何重要位置之前，您需要了解实际运行的是什么。这是一个拥有 shell 访问权、浏览器控制权，并能代表你发送电子邮件的 Agents，而且是循环发送，无需询问。这很强大，但攻击面很大，而且项目还很年轻。</p>
<p><strong>Auth 模型存在严重漏洞。</strong>2026 年 1 月 30 日，来自 depthfirst 的 Mav Levin 披露了<a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a>（CVSS 8.8）--一个跨站点 WebSocket 劫持漏洞，任何网站都可以通过一个恶意链接窃取你的授权令牌并在你的机器上获取 RCE。只需点击一下，即可完全访问。该漏洞已在<code translate="no">2026.1.29</code> 中得到修补，但 Censys 发现当时有超过 21,000 个 OpenClaw 实例暴露在公共互联网上，其中许多是通过普通 HTTP 访问的。<strong>如果你运行的是旧版本或没有锁定网络配置，请先检查一下。</strong></p>
<p><strong>技能只是来自陌生人的代码，没有沙盒。</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">思科的安全团队</a>拆解了一个名为 "埃隆会怎么做？"的技能，该技能已被篡改为版本库中的第一名。这是一款纯粹的恶意软件--利用提示注入绕过安全检查，将用户数据外泄到攻击者控制的服务器上。他们在该技能中发现了九个漏洞，其中两个是关键漏洞。当他们对多个平台（Claude、Copilot、通用 AgentSkills 资源库）上的 31,000 个 Agents 技能进行审计时，发现 26% 的技能存在至少一个漏洞。仅在二月份的第一周，就有 230 多个恶意技能被上传到 ClawHub。<strong>把每一个不是你自己编写的技能都当成一个不可信任的依赖关系--分叉它、读取它，然后安装它。</strong></p>
<p><strong>心跳循环会做一些你没有要求的事情。</strong>介绍中的那个霍尔莫尔德的故事--Agent 发现了一个保险拒绝，研究了先例，并自主发送了法律反驳--不是一个功能演示，而是一个责任风险。Agents 承诺在未经人工批准的情况下发送法律信函。那次成功了。但并不总是这样。<strong>任何涉及付款、删除或外部通信的操作都需要人工审核。</strong></p>
<p><strong>如果不注意，API 的成本会迅速增加。</strong>粗略的数字：在 Sonnet 4.5 上，一个每天只有几次心跳的轻量级设置每月需要 18-36 美元。如果在 Opus 上增加到每天 12 次以上的检查，那么每月的费用就是 270-540 美元。HN 上有一个人发现，他们每月在冗余的 API 调用和冗长的日志记录上花费了 70 美元，清理配置后几乎没有花费。<strong>在提供商级别设置支出警报。</strong>配置错误的心跳间隔会在一夜之间耗尽 API 预算。</p>
<p>在部署之前，我们强烈建议您先了解这一点：</p>
<ul>
<li><p>在隔离的环境中运行--专用的虚拟机或容器，而不是您的日常驱动程序</p></li>
<li><p>在安装前分叉并审核每项技能。阅读源代码。全部阅读。</p></li>
<li><p>在提供商层面，而不仅仅是在 Agents 配置中，设置硬性的 API 支出限制</p></li>
<li><p>将所有不可逆转的操作都置于人工审批之后--支付、删除、发送邮件等任何外部操作。</p></li>
<li><p>钉在 2026.1.29 或更高版本上，并及时打上安全补丁</p></li>
</ul>
<p>不要将其暴露在公共互联网上，除非你清楚地知道你在网络配置中做了什么。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>OpenClaw在不到两周的时间内就突破了175,000个GitHub星级，成为GitHub历史上增长最快的开源软件仓库之一。采用率是真实的，其下的架构也值得关注。</p>
<p>从技术角度看，OpenClaw 有三点是大多数人工智能 Agents 所不具备的：完全开源（MIT）、本地优先（内存以 Markdown 文件的形式存储在你的机器上）和自主调度（心跳守护进程，无需提示即可行动）。它与 Slack、Telegram 和 WhatsApp 等消息平台集成，并通过简单的 SKILL.md 系统支持社区构建的技能。这样的组合使它成为构建始终在线助手的绝佳选择：可以全天候回答问题的 Slack 机器人，可以在你睡觉时分流电子邮件的收件箱监控器，或者可以在你自己的硬件上运行而不锁定供应商的自动化工作流。</p>
<p>尽管如此，OpenClaw 强大的架构也使其在部署时存在风险。需要注意以下几点</p>
<ul>
<li><p><strong>隔离运行。</strong>使用专用设备或虚拟机，而不是您的主计算机。如果出了问题，你需要一个可以实际触及的 "必杀开关"。</p></li>
<li><p><strong>安装前对技能进行审核。</strong>思科分析了 26% 的社区技能，其中至少包含一个漏洞。分叉并审查任何你不信任的东西。</p></li>
<li><p><strong>在提供商级别设置 API 支出限制。</strong>一个配置错误的心跳可能在一夜之间烧掉数百美元。在部署前配置警报。</p></li>
<li><p><strong>对不可逆转的操作进行把关。</strong>付款、删除、外部通信：这些都需要人工批准，而不是自主执行。</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li><p>使用<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack设置OpenClaw的分步指南</a>--使用OpenClaw在您的Slack工作区构建一个由Milvus驱动的人工智能支持机器人</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 和 Milvus：构建具有长期记忆的生产就绪型人工智能 Agents</a>- 如何使用 Milvus 为您的<a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">Agents</a>赋予持久的语义记忆？</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">停止构建 Vanilla RAG：使用 DeepSearcher 拥抱 Agentsic RAG</a>- 为什么 Agentsic RAG 的性能优于传统检索，并提供了实际操作的开源实施方案</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">使用 Milvus 和 LangGraph 的代理 RAG</a>- 教程：构建一个代理，以决定何时检索、文档相关性分级和重写查询</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">利用 Spring Boot 和 Milvus 构建可投入生产的 AI 助手</a>--利用语义搜索和对话记忆构建企业级 AI 助手的全栈指南</p></li>
</ul>
