---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: 使用 Slack 设置 OpenClaw（前身为 Clawdbot/Moltbot）的分步指南
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: 使用 Slack 设置 OpenClaw 的分步指南。在 Mac 或 Linux 机器上运行自主托管的人工智能助手--无需云。
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>如果你本周在科技 Twitter、Hacker News 或 Discord 上看到过这些内容，你就一定见过。龙虾表情符号🦞、完成任务的截图，还有一个大胆的说法：人工智能不仅会<em>说话，</em>而且真的<em>会</em> <em>说话</em>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>周末，事情变得更奇怪了。企业家马特-施利克（Matt Schlicht）推出了<a href="https://moltbook.com">Moltbook--一个</a>类似于Reddit的社交网络，在这里只有人工智能Agent可以发帖，人类只能观看。几天之内，就有超过 150 万个 Agents 注册。他们组建社区、辩论哲学、抱怨人类操作符，甚至创立了自己的宗教 "Crustafarianism"。是的，真的。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>欢迎加入 OpenClaw 热潮。</p>
<p>这股热潮如此真实，以至于 Cloudflare 的股价飙升了 14%，而这仅仅是因为开发人员使用其基础设施来运行应用程序。据报道，由于人们为他们的新人工智能员工购买专用硬件，Mac Mini 的销量激增。GitHub 仓库呢？短短几周内就超过了<a href="https://github.com/openclaw/openclaw">15 万颗星</a>。</p>
<p>因此，我们自然要向你展示如何建立自己的 OpenClaw 实例--并将其连接到 Slack，这样你就可以在自己最喜欢的消息应用程序中管理你的 AI 助手了。</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">什么是 OpenClaw？<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a>（原名 Clawdbot/Moltbot）是一个开源的自主人工智能代理，可在用户机器上本地运行，并通过 WhatsApp、Telegram 和 Discord 等消息应用执行现实世界中的任务。它通过连接 Claude 或 ChatGPT 等 LLMs，自动执行数字工作流程--例如管理电子邮件、浏览网页或安排会议。</p>
<p>简而言之，它就像一个全天候的数字助理，能够思考、响应并真正完成工作。</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">将 OpenClaw 设置为基于 Slack 的人工智能助理<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>想象一下，在您的 Slack 工作区中有一个机器人，它可以立即回答有关您产品的问题，帮助调试用户问题，或为队友指出正确的文档，而无需任何人停下手中的工作。对我们来说，这可能意味着为 Milvus 社区提供更快的支持：一个机器人可以回答常见问题（"如何创建 Collections？"），帮助排查错误，或按需总结发布说明。对你的团队来说，这可能是新工程师入职、处理内部常见问题或自动执行重复的 DevOps 任务。使用案例非常广泛。</p>
<p>在本教程中，我们将介绍基础知识：在机器上安装 OpenClaw 并将其连接到 Slack。安装完成后，您将拥有一个可正常工作的人工智能助手，随时可以根据需要进行定制。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li><p>Mac 或 Linux 机器</p></li>
<li><p><a href="https://console.anthropic.com/">Anthropic API 密钥</a>（或 Claude Code CLI 访问权限）</p></li>
<li><p>一个可以安装应用程序的 Slack 工作区</p></li>
</ul>
<p>就是这样。让我们开始吧。</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">第一步：安装 OpenClaw</h3><p>运行安装程序：</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>出现提示时，选择 "<strong>是 "</strong>继续。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然后，选择<strong>快速启动</strong>模式。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">第 2 步：选择 LLM</h3><p>安装程序会要求你选择一个模型提供商。我们使用 Anthropic 和 Claude Code CLI 进行身份验证。</p>
<ol>
<li>选择<strong>Anthropic</strong>作为提供商  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>根据提示在浏览器中完成验证。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>选择<strong>anthropic/claude-opus-4-5-20251101</strong>作为默认模型  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">第 3 步：设置 Slack</h3><p>在要求选择频道时，选择<strong>Slack</strong>。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>继续为你的机器人命名。我们把自己的机器人命名为 "Clawdbot_Milvus"。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，你需要创建一个 Slack 应用程序并获取两个令牌。方法如下  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 创建 Slack 应用程序</strong></p>
<p>访问<a href="https://api.slack.com/apps?new_app=1">Slack API 网站</a>，从头开始创建一个新的应用程序。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>为其命名并选择要使用的工作区。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 设置机器人权限</strong></p>
<p>在侧边栏中，单击<strong>OAuth &amp; Permissions</strong>。向下滚动到<strong>机器人令牌范围</strong>，然后添加机器人需要的权限。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 启用套接字模式</strong></p>
<p>点击侧边栏中的<strong>套接字模式</strong>并将其打开。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这将生成一个<strong>应用程序级令牌</strong>（以<code translate="no">xapp-</code> 开头）。将其复制到安全的地方。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 启用事件订阅</strong></p>
<p>转到 "<strong>事件订阅</strong>"并将其打开。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然后选择机器人应订阅的事件。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 安装应用程序</strong></p>
<p>点击侧边栏中的 "<strong>安装应用程序</strong>"，然后<strong>请求</strong>安装（如果您是工作区管理员，则可直接安装）。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>批准后，您将看到您的<strong>机器人用户 OAuth 令牌</strong>（以<code translate="no">xoxb-</code> 开头）。将其也复制下来。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_20_a4a6878dbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">第4步：配置OpenClaw</h3><p>回到OpenClaw CLI：</p>
<ol>
<li><p>输入您的<strong>机器人用户OAuth令牌</strong>(<code translate="no">xoxb-...</code>)</p></li>
<li><p>输入<strong>应用程序级令牌</strong>(<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>选择机器人可以访问的 Slack 频道  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>暂时跳过技能配置--您可以稍后再添加  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>选择<strong>重新启动</strong>以应用更改</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">步骤 5：试用</h3><p>前往 Slack，给你的机器人发送一条消息。如果一切设置正确，OpenClaw 就会响应，并准备好在你的机器上运行任务。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">提示</h3><ol>
<li>运行<code translate="no">clawdbot dashboard</code> ，通过网络界面管理设置  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>如果出错，请查看日志了解错误详情  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">注意事项<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw功能强大，因此您必须小心谨慎。"实际操作 "意味着它可以在你的机器上执行真正的命令。这就是关键所在，但它也有风险。</p>
<p><strong>好消息是</strong></p>
<ul>
<li><p>它是开源的，所以代码是可审计的</p></li>
<li><p>它在本地运行，因此你的数据不在别人的服务器上</p></li>
<li><p>你可以控制它的权限</p></li>
</ul>
<p><strong>坏消息</strong></p>
<ul>
<li><p>提示注入是一个真正的风险--恶意信息可能会诱使机器人运行非预期命令</p></li>
<li><p>诈骗者已经伪造了OpenClaw软件仓库和令牌，所以下载时一定要小心。</p></li>
</ul>
<p><strong>我们的建议</strong></p>
<ul>
<li><p>不要在主计算机上运行。使用虚拟机、备用笔记本电脑或专用服务器。</p></li>
<li><p>不要授予超出需要的权限。</p></li>
<li><p>先不要在生产中使用。这是新产品。把它当作实验来对待。</p></li>
<li><p>坚持使用官方资源：<a href="https://x.com/openclaw">@openclaw</a>on X 和<a href="https://github.com/openclaw">OpenClaw</a>。</p></li>
</ul>
<p>一旦赋予 LLM 执行命令的能力，就不存在 100% 安全的问题。这不是 OpenClaw 的问题，而是 Agents 人工智能的本质。聪明点就行。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步是什么？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜您您现在拥有了一个运行在自己基础设施上的本地人工智能助手，可以通过 Slack 访问。您的数据仍然属于您，而您已经有了一个不知疲倦的助手，随时准备自动处理重复性工作。</p>
<p>在这里，你可以</p>
<ul>
<li><p>安装更多<a href="https://docs.molt.bot/skills">技能</a>，扩展 OpenClaw 的功能</p></li>
<li><p>设置计划任务，使其主动工作</p></li>
<li><p>连接 Telegram 或 Discord 等其他消息平台</p></li>
<li><p>探索<a href="https://milvus.io/">Milvus</a>生态系统的人工智能搜索功能</p></li>
</ul>
<p><strong>有问题或想分享您正在构建的功能？</strong></p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社区</a>，与其他开发人员进行交流</p></li>
<li><p>预约<a href="https://milvus.io/office-hours">Milvus 办公时间</a>，与团队进行现场问答</p></li>
</ul>
<p>快乐黑客🦞</p>
