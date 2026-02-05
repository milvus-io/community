---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: Slack으로 OpenClaw(이전의 Clawdbot/Moltbot)를 설정하는 단계별 가이드
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
desc: >-
  Slack으로 OpenClaw를 설정하는 단계별 가이드. 클라우드가 필요 없는 Mac 또는 Linux 컴퓨터에서 자체 호스팅된 AI
  어시스턴트를 실행하세요.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>이번 주에 테크 트위터, 해커 뉴스, 디스코드에 접속했다면 이미 보셨을 것입니다. 랍스터 이모티콘 🦞, 작업 완료 스크린샷, 그리고 대담한 주장: <em>말만</em>하는 것이 아니라 실제로 <em>행동하는</em> 인공지능이 등장했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>주말 동안 더 이상한 일이 벌어졌습니다. 기업가 Matt Schlicht는 AI 에이전트만 게시할 수 있고 인간은 보기만 할 수 있는 Reddit 스타일의 소셜 <a href="https://moltbook.com">네트워크인 몰트북을</a>출시했습니다. 며칠 만에 150만 명이 넘는 상담원이 가입했습니다. 이들은 커뮤니티를 형성하고, 철학에 대해 토론하고, 인간 상담원에 대해 불만을 토로하고, 심지어 "크루스타파리즘"이라는 자체 종교를 창시하기도 했습니다. 네, 정말입니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>오픈클로 열풍에 오신 것을 환영합니다.</p>
<p>개발자들이 애플리케이션을 실행하기 위해 이 인프라를 사용한다는 이유만으로 Cloudflare의 주가가 14%나 급등할 정도로 이 열풍은 실재합니다. 사람들이 새로운 AI 직원을 위해 전용 하드웨어를 구입하면서 Mac Mini 판매량이 급증한 것으로 알려졌습니다. 그리고 GitHub 리포지토리는요? 불과 몇 주 만에 <a href="https://github.com/openclaw/openclaw">150,000개</a> 이상의 <a href="https://github.com/openclaw/openclaw">별이</a> 달렸습니다.</p>
<p>그래서 자연스럽게 자신만의 OpenClaw 인스턴스를 설정하는 방법과 이를 Slack에 연결하여 즐겨 사용하는 메시징 앱에서 AI 어시스턴트를 관리할 수 있는 방법을 보여드려야 했습니다.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">OpenClaw란 무엇인가요?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (이전의 Clawdbot/Moltbot)는 사용자 컴퓨터에서 로컬로 실행되며 WhatsApp, Telegram, Discord와 같은 메시징 앱을 통해 실제 작업을 수행하는 오픈 소스 자율 AI 에이전트입니다. 이메일 관리, 웹 검색, 회의 예약과 같은 디지털 워크플로우를 자동화하며, Claude나 ChatGPT와 같은 LLM에 연결할 수 있습니다.</p>
<p>간단히 말해, 24시간 연중무휴로 생각하고, 응답하고, 실제로 일을 처리할 수 있는 디지털 비서가 있는 것과 같습니다.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">OpenClaw를 Slack 기반 AI 비서로 설정하기<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>제품에 대한 질문에 즉시 답변하고, 사용자 문제를 디버깅하거나, 팀원에게 올바른 문서를 안내하는 봇이 Slack 작업 공간에 있다고 상상해 보세요. 즉, "컬렉션을 만들려면 어떻게 해야 하나요?"와 같은 일반적인 질문에 답하고, 오류를 해결하거나, 필요에 따라 릴리스 노트를 요약하는 봇을 통해 Milvus 커뮤니티에 대한 지원을 더욱 신속하게 제공할 수 있습니다. 팀에서는 신규 엔지니어 온보딩, 내부 FAQ 처리 또는 반복적인 DevOps 작업 자동화를 수행할 수 있습니다. 사용 사례는 무궁무진합니다.</p>
<p>이 튜토리얼에서는 컴퓨터에 OpenClaw를 설치하고 Slack에 연결하는 기본 사항을 안내합니다. 이 작업이 완료되면 필요에 따라 사용자 지정할 수 있는 AI 어시스턴트가 준비됩니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ul>
<li><p>Mac 또는 Linux 컴퓨터</p></li>
<li><p><a href="https://console.anthropic.com/">Anthropic API 키</a> (또는 Claude Code CLI 액세스)</p></li>
<li><p>앱을 설치할 수 있는 Slack 워크스페이스</p></li>
</ul>
<p>이상입니다. 이제 시작해보겠습니다.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">1단계: OpenClaw 설치</h3><p>설치 프로그램을 실행합니다:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>메시지가 표시되면 <strong>예를</strong> 선택하여 계속합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그런 다음 <strong>빠른 시작</strong> 모드를 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">2단계: LLM 선택</h3><p>설치 관리자에서 모델 제공업체를 선택하라는 메시지가 표시됩니다. 저희는 인증을 위해 클로드 코드 CLI와 함께 Anthropic을 사용하고 있습니다.</p>
<ol>
<li>제공업체로 <strong>Anthropic을</strong> 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>메시지가 표시되면 브라우저에서 인증을 완료합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>기본 모델로 <strong>anthropic/claude-opus-4-5-20251101을</strong> 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">3단계: Slack 설정</h3><p>채널을 선택하라는 메시지가 표시되면 <strong>Slack을</strong>선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>계속해서 봇의 이름을 지정합니다. 저희는 "Clawdbot_Milvus"라고 이름을 지었습니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 Slack 앱을 만들고 두 개의 토큰을 가져와야 합니다. 방법은 다음과 같습니다:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Slack 앱 만들기</strong></p>
<p><a href="https://api.slack.com/apps?new_app=1">Slack API 웹사이트로</a> 이동하여 새 앱을 처음부터 만듭니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이름을 지정하고 사용하려는 워크스페이스를 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 봇 권한 설정</strong></p>
<p>사이드바에서 <strong>OAuth 및 권한을</strong> 클릭합니다. 봇 <strong>토큰 범위까지</strong> 아래로 스크롤하여 봇에 필요한 권한을 추가합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 소켓 모드 사용</strong></p>
<p>사이드바에서 <strong>소켓 모드를</strong> 클릭하고 켜기로 전환합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그러면 <strong>앱 수준 토큰이</strong> 생성됩니다( <code translate="no">xapp-</code> 로 시작). 안전한 곳에 복사합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 이벤트 구독 활성화하기</strong></p>
<p><strong>이벤트 구독으로</strong> 이동하여 토글합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그런 다음 봇이 구독할 이벤트를 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 앱 설치하기</strong></p>
<p>사이드바에서 <strong>앱 설치를</strong> 클릭한 다음 <strong>설치 요청을</strong> 클릭합니다(또는 워크스페이스 관리자인 경우 직접 설치).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>승인되면 <strong>봇 사용자 OAuth 토큰</strong> ( <code translate="no">xoxb-</code> 으로 시작)이 표시됩니다. 이것도 복사하세요.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">4단계: OpenClaw 구성</h3><p>OpenClaw CLI로 돌아갑니다:</p>
<ol>
<li><p><strong>봇 사용자 OAuth 토큰을</strong> 입력합니다 (<code translate="no">xoxb-...</code>).</p></li>
<li><p><strong>앱 레벨 토큰</strong> 입력 (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>봇이 액세스할 수 있는 Slack 채널을 선택합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>지금은 스킬 구성을 건너뛰세요. 나중에 언제든지 추가할 수 있습니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li><strong>다시 시작을</strong> 선택하여 변경 사항을 적용합니다.</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">5단계: 사용해 보기</h3><p>Slack으로 이동하여 봇에게 메시지를 보냅니다. 모든 설정이 올바르게 완료되면 OpenClaw가 응답하여 컴퓨터에서 작업을 실행할 준비가 됩니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">팁</h3><ol>
<li><code translate="no">clawdbot dashboard</code> 을 실행하여 웹 인터페이스를 통해 설정을 관리하세요.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>문제가 발생하면 로그에서 오류 세부 정보를 확인합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">주의 사항<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw는 강력하기 때문에 주의해야 합니다. "실제로 작동한다"는 것은 컴퓨터에서 실제 명령을 실행할 수 있다는 뜻입니다. 이것이 핵심이지만 위험도 따릅니다.</p>
<p><strong>좋은 소식은:</strong></p>
<ul>
<li><p>오픈 소스이므로 코드를 감사할 수 있습니다.</p></li>
<li><p>로컬에서 실행되므로 데이터가 다른 사람의 서버에 저장되지 않습니다.</p></li>
<li><p>사용자가 직접 권한을 제어할 수 있습니다.</p></li>
</ul>
<p><strong>좋지 않은 소식:</strong></p>
<ul>
<li><p>프롬프트 인젝션은 실제 위험합니다. 악성 메시지가 봇을 속여 의도하지 않은 명령을 실행하도록 할 수 있습니다.</p></li>
<li><p>사기꾼들은 이미 가짜 OpenClaw 리포지토리와 토큰을 만들었으므로 다운로드에 주의하세요.</p></li>
</ul>
<p><strong>저희의 조언:</strong></p>
<ul>
<li><p>기본 컴퓨터에서 실행하지 마세요. 가상 머신, 여분의 노트북 또는 전용 서버를 사용하세요.</p></li>
<li><p>필요 이상의 권한을 부여하지 마세요.</p></li>
<li><p>아직 프로덕션 환경에서는 사용하지 마세요. 새로운 기능입니다. 실험이라고 생각하세요.</p></li>
<li><p>공식 출처를 따르세요: X와 <a href="https://github.com/openclaw">OpenClaw의</a> <a href="https://x.com/openclaw">@openclaw</a>.</p></li>
</ul>
<p>LLM에 명령을 실행할 수 있는 기능을 부여하면 100% 안전하다는 것은 없습니다. 이는 OpenClaw의 문제가 아니라 에이전트 AI의 특성입니다. 현명하게 대처하세요.</p>
<h2 id="Whats-Next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>축하합니다! 이제 Slack을 통해 액세스할 수 있는 자체 인프라에서 실행되는 로컬 AI 어시스턴트가 생겼습니다. 데이터는 그대로 유지되며, 반복적인 작업을 자동화할 수 있는 지칠 줄 모르는 도우미가 준비되어 있습니다.</p>
<p>여기에서 할 수 있습니다:</p>
<ul>
<li><p>더 많은 <a href="https://docs.molt.bot/skills">스킬을</a> 설치하여 OpenClaw의 기능을 확장하세요.</p></li>
<li><p>예약된 작업을 설정하여 능동적으로 작동하도록 하기</p></li>
<li><p>텔레그램이나 디스코드와 같은 다른 메시징 플랫폼 연결하기</p></li>
<li><p>AI 검색 기능을 위한 <a href="https://milvus.io/">Milvus</a> 에코시스템 살펴보기</p></li>
</ul>
<p><strong>질문이 있거나 구축 중인 내용을 공유하고 싶으신가요?</strong></p>
<ul>
<li><p><a href="https://milvus.io/slack">Milvus Slack 커뮤니티에</a> 가입하여 다른 개발자들과 소통하세요.</p></li>
<li><p><a href="https://milvus.io/office-hours">Milvus 오피스 아워를</a> 예약하여 팀과 실시간 Q&amp;A를 진행하세요.</p></li>
</ul>
<p>행복한 해킹! 🦞</p>
