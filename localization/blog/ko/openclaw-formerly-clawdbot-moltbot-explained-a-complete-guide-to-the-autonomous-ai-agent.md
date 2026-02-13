---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: '오픈클로(이전의 클로봇 및 몰트봇) 설명: 자율 AI 에이전트에 대한 완벽한 가이드'
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
desc: 'OpenClaw(클로봇/몰트봇)에 대한 전체 가이드 - 작동 방식, 설정 안내, 사용 사례, 몰트북 및 보안 경고.'
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (이전의 Moltbot 및 Clawdbot)는 컴퓨터에서 실행되는 오픈 소스 AI 에이전트로, 이미 사용 중인 메시징 앱(WhatsApp, Telegram, Slack, Signal 등)을 통해 연결하여 셸 명령, 브라우저 자동화, 이메일, 일정 및 파일 작업 등 사용자를 대신하여 작업을 수행합니다. 하트비트 스케줄러가 설정 가능한 간격으로 깨어나서 메시지 없이 실행할 수 있습니다. 2026년 1월 말 출시 후 일주일 만에 <a href="https://github.com/openclaw/openclaw">100,000개</a> 이상의 GitHub 별을 획득하여 GitHub 역사상 가장 빠르게 성장하는 오픈소스 리포지토리 중 하나가 되었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw를 특별하게 만드는 것은 그 조합입니다: MIT 라이선스, 오픈 소스, 로컬 우선(디스크에 마크다운 파일로 저장된 메모리와 데이터), 휴대용 스킬 포맷을 통한 커뮤니티 확장성. 한 개발자의 에이전트는 잠자는 동안 이메일을 통해 4,200달러의 자동차 구매 할인을 협상했고, 다른 개발자는 보험 거부에 대한 법적 반박을 요청하지 않고 제기했으며, 다른 사용자는 백만 명이 넘는 AI 에이전트가 사람이 보는 가운데 자율적으로 상호작용하는 소셜 네트워크인 <a href="https://moltbook.com/">몰트북을</a> 구축하는 등 흥미로운 AI 실험이 진행되고 있는 곳이기도 하죠.</p>
<p>이 가이드에서는 OpenClaw의 정의, 작동 방식, 실생활에서 사용할 수 있는 기능, 몰트북과의 관계, 관련 보안 위험 등 사용자가 알아야 할 모든 것을 자세히 설명합니다.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">OpenClaw란 무엇인가요?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">오픈클로</a> (이전의 클로봇 및 몰트봇)는 컴퓨터에서 실행되며 채팅 앱에 상주하는 자율적인 오픈소스 AI 어시스턴트입니다. 사용자가 이미 사용하고 있는 WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage, Signal 등 어떤 앱을 통해든 이 어시스턴트에게 말을 걸면 응답합니다. 하지만 ChatGPT나 Claude의 웹 인터페이스와 달리 OpenClaw는 단순히 질문에 대답만 하는 것이 아닙니다. 셸 명령을 실행하고, 브라우저를 제어하고, 파일을 읽고 쓰고, 캘린더를 관리하고, 이메일을 보낼 수 있으며, 이 모든 것이 문자 메시지로 트리거됩니다.</p>
<p>데이터에 대한 제어권을 포기하거나 호스팅 서비스에 의존하지 않고 어디서나 메시지를 보낼 수 있는 개인 AI 비서를 원하는 개발자와 파워 유저를 위해 만들어졌습니다.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">OpenClaw의 주요 기능</h3><ul>
<li><p><strong>멀티채널 게이트웨이</strong> - 단일 게이트웨이 프로세스를 통해 WhatsApp, Telegram, Discord, iMessage를 지원합니다. 확장 패키지로 매터모스트 등을 추가하세요.</p></li>
<li><p><strong>다중 에이전트 라우팅</strong> - 에이전트, 워크스페이스 또는 발신자별로 세션을 격리할 수 있습니다.</p></li>
<li><p><strong>미디어 지원</strong> - 이미지, 오디오, 문서를 주고받을 수 있습니다.</p></li>
<li><p><strong>웹 제어 UI</strong> - 채팅, 설정, 세션 및 노드를 위한 브라우저 대시보드.</p></li>
<li><p><strong>모바일 노드</strong> - iOS와 안드로이드 노드를 캔버스 지원과 페어링합니다.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">OpenClaw는 무엇이 다른가요?</h3><p><strong>OpenClaw는 자체 호스팅됩니다.</strong></p>
<p>OpenClaw의 게이트웨이, 도구, 메모리는 공급업체가 호스팅하는 SaaS가 아닌 사용자의 컴퓨터에 상주합니다. OpenClaw는 대화, 장기 기억, 스킬을 작업 공간과 <code translate="no">~/.openclaw</code> 에 일반 마크다운 및 YAML 파일로 저장합니다. 사용자는 텍스트 편집기에서 이를 검사하고, Git으로 백업하거나 그립하거나 삭제할 수 있습니다. AI 모델은 모델 블록을 구성하는 방식에 따라 클라우드 호스팅(Anthropic, OpenAI, Google) 또는 로컬(Ollama, LM Studio 또는 기타 OpenAI 호환 서버를 통해)이 될 수 있습니다. 모든 추론을 하드웨어에 유지하려면 OpenClaw를 로컬 모델만 가리키면 됩니다.</p>
<p><strong>완전히 자율적인 OpenClaw</strong></p>
<p>게이트웨이는 구성 가능한 하트비트로 백그라운드 데몬(Linux의 경우<code translate="no">systemd</code>, macOS의 경우 <code translate="no">LaunchAgent</code> )으로 실행되며, 기본적으로 30분마다, Anthropic OAuth의 경우 1시간마다 실행됩니다. 각 하트비트마다 에이전트는 작업 영역의 <code translate="no">HEARTBEAT.md</code> 에서 체크리스트를 읽고, 조치가 필요한 항목이 있는지 판단한 후 사용자에게 메시지를 보내거나 <code translate="no">HEARTBEAT_OK</code> (게이트웨이가 자동으로 삭제)로 응답합니다. 웹훅, 크론 작업, 팀원 메시지 등의 외부 이벤트도 상담원 루프를 트리거합니다.</p>
<p>상담원에게 얼마나 많은 자율성을 부여할지는 구성에서 선택할 수 있습니다. 도구 정책 및 실행 승인은 고위험 작업을 관리합니다. 이메일 읽기는 허용하지만 보내기 전에 승인이 필요하거나 파일 읽기는 허용하지만 삭제를 차단할 수 있습니다. 이러한 가드레일을 비활성화하면 요청 없이 실행됩니다.</p>
<p><strong>OpenClaw는 오픈 소스입니다.</strong></p>
<p>핵심 게이트웨이는 MIT 라이선스를 받았습니다. 완전히 읽을 수 있고, 포크가 가능하며, 감사할 수 있습니다. 이는 맥락에서 중요합니다: Anthropic은 Claude Code의 클라이언트의 난독화를 제거한 개발자를 상대로 DMCA를 제기했고, OpenAI의 Codex CLI는 Apache 2.0이지만 웹 UI와 모델은 폐쇄적이며, Manus는 완전히 폐쇄적입니다.</p>
<p>에코시스템은 개방성을 반영합니다. <a href="https://github.com/openclaw/openclaw">수백 명의 기여자가</a> 스킬(YAML 프론트매터와 자연어 지침이 포함된 모듈식 <code translate="no">SKILL.md</code> 파일)을 구축하여 ClawHub(에이전트가 자동으로 검색할 수 있는 스킬 레지스트리), 커뮤니티 리포지토리 또는 직접 URL을 통해 공유하고 있습니다. 이 형식은 이식성이 뛰어나며 클로드 코드 및 커서 규칙과 호환됩니다. 스킬이 존재하지 않는 경우에는 상담원에게 작업을 설명하여 초안을 작성하도록 할 수 있습니다.</p>
<p>로컬 소유권, 커뮤니티 주도의 진화, 자율적인 운영이 결합된 이 점이 개발자들이 열광하는 이유입니다. AI 툴을 완전히 제어하고자 하는 개발자에게는 이 점이 중요합니다.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">OpenClaw의 내부 작동 방식<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>하나의 프로세스, 모든 것이 내부에</strong></p>
<p><code translate="no">openclaw gateway</code> 을 실행하면 게이트웨이라는 수명이 긴 단일 Node.js 프로세스가 시작됩니다. 이 프로세스는 채널 연결, 세션 상태, 에이전트 루프, 모델 호출, 도구 실행, 메모리 지속성 등 전체 시스템입니다. 관리할 별도의 서비스가 없습니다.</p>
<p>하나의 프로세스 안에 5개의 하위 시스템이 있습니다:</p>
<ol>
<li><p><strong>채널 어댑터</strong> - 플랫폼당 하나씩(WhatsApp의 경우 베일리스, 텔레그램의 경우 그램Y 등). 인바운드 메시지를 공통 형식으로 정규화하고, 답장을 다시 직렬화합니다.</p></li>
<li><p><strong>세션 관리자</strong> - 발신자 신원 및 대화 컨텍스트를 확인합니다. DM은 메인 세션으로 축소되고, 그룹 대화는 자체 세션으로 축소됩니다.</p></li>
<li><p><strong>대기열</strong> - 세션별로 실행을 직렬화합니다. 실행 도중에 메시지가 도착하면 다음 차례를 위해 메시지를 보류, 삽입 또는 수집합니다.</p></li>
<li><p><strong>에이전트 런타임</strong> - 컨텍스트(AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, 일일 로그, 대화 기록)를 수집한 다음 에이전트 루프(모델 호출 → 도구 호출 실행 → 결과 피드백 → 완료될 때까지 반복)를 실행합니다.</p></li>
<li><p><strong>컨트롤 플레인</strong> - WebSocket API의 <code translate="no">:18789</code>. CLI, macOS 앱, 웹 UI 및 iOS/Android 노드는 모두 여기에서 연결됩니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 모델은 로컬에서 실행될 수도 있고 실행되지 않을 수도 있는 외부 API 호출입니다. 라우팅, 도구, 메모리, 상태 등 다른 모든 것은 머신의 하나의 프로세스 안에 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>간단한 요청의 경우 이 루프는 몇 초 만에 완료됩니다. 다단계 도구 체인은 더 오래 걸립니다. 이 모델은 로컬에서 실행될 수도 있고 아닐 수도 있는 외부 API 호출이지만 라우팅, 도구, 메모리, 상태 등 다른 모든 것은 머신의 한 프로세스 안에 있습니다.</p>
<p><strong>클로드 코드와 동일한 루프, 다른 셸</strong></p>
<p>에이전트 루프(입력 → 컨텍스트 → 모델 → 도구 → 반복 → 응답)는 Claude Code에서 사용하는 것과 동일한 패턴입니다. 모든 진지한 에이전트 프레임워크는 이 패턴을 일부 실행합니다. 다른 점은 이를 감싸는 방식입니다.</p>
<p>Claude Code는 입력만 하면 실행되고 종료되는 <strong>CLI로</strong> 래핑합니다. OpenClaw는 12개 이상의 메시징 플랫폼에 연결된 <strong>영구 데몬으로</strong> 래핑하며, 하트비트 스케줄러, 채널 간 세션 관리, 실행 사이에 지속되는 메모리를 통해 사용자가 책상에 없을 때에도 지속됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>모델 라우팅 및 페일오버</strong></p>
<p>OpenClaw는 모델에 구애받지 않습니다. <code translate="no">openclaw.json</code> 에서 공급자를 구성하면 게이트웨이가 인증 프로필 로테이션과 공급자가 다운될 때 지수 백오프를 사용하는 폴백 체인을 통해 그에 따라 라우팅합니다. 그러나 OpenClaw는 시스템 지침, 대화 기록, 도구 스키마, 스킬 및 메모리와 같은 대규모 프롬프트를 수집하기 때문에 모델 선택이 중요합니다. 이러한 컨텍스트 부하 때문에 대부분의 배포에서는 프론티어 모델을 기본 오케스트레이터로 사용하고 저렴한 모델은 하트비트와 하위 에이전트 작업을 처리합니다.</p>
<p><strong>클라우드와 로컬의 장단점</strong></p>
<p>게이트웨이의 관점에서 볼 때 클라우드 모델과 로컬 모델은 모두 OpenAI 호환 엔드포인트라는 점에서 동일하게 보입니다. 차이점은 바로 장단점입니다.</p>
<p>클라우드 모델(Anthropic, OpenAI, Google)은 강력한 추론, 넓은 컨텍스트 창, 안정적인 도구 사용을 제공합니다. 기본 오케스트레이터의 기본 선택입니다. 사용량에 따라 비용이 달라집니다. 라이트 사용자는 월 5~20달러, 하트비트가 빈번하고 프롬프트가 많은 액티브 에이전트는 일반적으로 월 50~150달러, 최적화되지 않은 파워 유저는 수천 달러의 비용이 청구되는 것으로 보고되었습니다.</p>
<p>Ollama 또는 기타 OpenAI 호환 서버를 통한 로컬 모델은 토큰당 비용이 들지 않지만 하드웨어가 필요하며, OpenClaw는 최소 64,000개의 컨텍스트 토큰이 필요하기 때문에 실행 가능한 옵션이 좁아집니다. 14B 매개변수에서는 모델이 간단한 자동화를 처리할 수 있지만 다단계 에이전트 작업에는 한계가 있으며, 커뮤니티 경험에 따르면 안정적인 임계값은 32B 이상으로 최소 24GB의 VRAM이 필요합니다. 추론이나 확장된 컨텍스트에서 프론티어 클라우드 모델과 일치하지는 않지만 완전한 데이터 로컬리티와 예측 가능한 비용을 확보할 수 있습니다.</p>
<p><strong>이 아키텍처의 이점</strong></p>
<p>모든 것이 하나의 프로세스를 통해 실행되므로 게이트웨이는 단일 제어 표면입니다. 어떤 모델을 호출할지, 어떤 도구를 허용할지, 얼마나 많은 컨텍스트를 포함할지, 얼마나 많은 자율성을 부여할지 등 모든 것이 한 곳에서 구성됩니다. 채널은 모델에서 분리되어 있어, 텔레그램을 Slack으로 바꾸거나 클라우드를 Gemini로 바꾸어도 다른 것은 변경되지 않습니다. 채널 배선, 도구, 메모리는 인프라에 그대로 유지되며, 모델에 대한 종속성만 지적할 수 있습니다.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">OpenClaw를 실행하려면 실제로 어떤 하드웨어가 필요하나요?</h3><p>1월 말에는 개발자들이 여러 대의 Mac Mini를 개봉하는 모습이 담긴 게시물이 퍼졌는데, 한 사용자는 책상 위에 40대를 올려놓기도 했습니다. 심지어 구글 딥마인드의 로건 킬패트릭도 주문에 관한 글을 올렸지만, 실제 하드웨어 요구 사항은 훨씬 더 적습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>공식 문서에는 최소 요구 사항이 기본 채팅을 위한 2GB RAM과 2개의 CPU 코어, 브라우저 자동화를 원할 경우 4GB로 명시되어 있습니다. 월 5달러의 VPS로 이 정도는 충분히 처리할 수 있습니다. Pulumi를 사용하여 AWS 또는 Hetzner에 배포하거나, 소형 VPS의 Docker에서 실행하거나, 먼지가 쌓인 오래된 노트북을 사용할 수도 있습니다. Mac Mini 트렌드는 기술적 요구 사항이 아니라 사회적 증거에 의해 주도되었습니다.</p>
<p><strong>그렇다면 사람들은 왜 전용 하드웨어를 구매했을까요? 두 가지 이유, 즉 고립성과 지속성 때문입니다.</strong> 자율 에이전트 셸에 액세스 권한을 부여할 때 문제가 발생하면 물리적으로 플러그를 뽑을 수 있는 컴퓨터가 필요합니다. 또한 OpenClaw는 구성 가능한 일정에 따라 깨어나 사용자를 대신하여 작동하기 때문에 전용 디바이스는 항상 켜져 있고 항상 준비되어 있습니다. 플러그를 뽑을 수 있는 컴퓨터에서 물리적으로 격리되어 클라우드 서비스의 가용성에 의존하지 않고 가동할 수 있다는 점이 매력적입니다.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">OpenClaw를 설치하고 빠르게 시작하는 방법<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Node 22 이상이</strong> 필요합니다. 확실하지 않은 경우 <code translate="no">node --version</code> 에서 확인하세요.</p>
<p><strong>CLI를 설치합니다:</strong></p>
<p>macOS/Linux에서:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>Windows(PowerShell)에서:</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>온보딩 마법사를 실행합니다:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>인증, 게이트웨이 구성 및 선택적으로 메시징 채널(WhatsApp, Telegram 등) 연결 과정을 안내합니다. <code translate="no">--install-daemon</code> 플래그는 게이트웨이를 백그라운드 서비스로 등록하여 자동으로 시작되도록 합니다.</p>
<p><strong>게이트웨이가 실행 중인지 확인합니다:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>대시보드를 엽니다:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>그러면 <code translate="no">http://127.0.0.1:18789/</code> 에서 제어 UI가 열립니다. 테스트만 하려는 경우에는 채널 설정이 필요 없이 바로 여기에서 상담원과 채팅을 시작할 수 있습니다.</p>
<p><strong>초기에 알아두면 좋을 몇 가지 사항이 있습니다.</strong> 게이트웨이를 데몬이 아닌 포그라운드에서 실행하려는 경우(디버깅에 유용) 그렇게 할 수 있습니다:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>그리고 서비스 계정으로 실행하거나 컨테이너에서 실행하는 등 OpenClaw가 구성 및 상태를 저장하는 위치를 사용자 지정해야 하는 경우 중요한 세 가지 환경 변수가 있습니다:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - 내부 경로 확인을 위한 기본 디렉토리</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - 상태 파일이 있는 위치를 재정의합니다.</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - 는 특정 설정 파일을 가리킵니다.</p></li>
</ul>
<p>게이트웨이가 실행되고 대시보드가 로드되면 설정이 완료된 것입니다. 이제 메시징 채널을 연결하고 스킬 승인을 설정해야 할 텐데, 다음 섹션에서 이 두 가지를 모두 다루겠습니다.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">OpenClaw는 다른 AI 에이전트와 어떻게 다른가요?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>기술 커뮤니티에서는 OpenClaw를 "손이 달린 클로드"라고 부릅니다. 이는 생생한 묘사이지만 아키텍처의 차이점을 놓치고 있습니다. 현재 여러 AI 제품이 '손'을 가지고 있습니다. Anthropic에는 <a href="https://claude.com/blog/claude-code">Claude Code와</a> <a href="https://claude.com/blog/cowork-research-preview">Cowork가</a> 있고, OpenAI에는 <a href="https://openai.com/codex/">Codex와</a> <a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT 에이전트가</a> 있으며, <a href="https://manus.im/">Manus도</a> 존재합니다. 실제로 중요한 차이점은 다음과 같습니다:</p>
<ul>
<li><p><strong>에이전트가 실행되는 위치</strong> (사용자 컴퓨터와 제공업체의 클라우드)</p></li>
<li><p><strong>에이전트와 상호 작용하는 방식</strong> (메시징 앱, 터미널, IDE, 웹 UI)</p></li>
<li><p><strong>상태 및 장기 메모리의 소유자</strong> (로컬 파일 대 제공자 계정)</p></li>
</ul>
<p>크게 보면 OpenClaw는 하드웨어에 상주하며 채팅 앱을 통해 대화하는 로컬 우선 게이트웨이인 반면, 다른 게이트웨이는 대부분 터미널, IDE 또는 웹/데스크톱 앱에서 구동하는 호스팅된 에이전트입니다.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>클로드 코드</th><th>OpenAI 코덱스</th><th>ChatGPT 에이전트</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>오픈 소스</td><td>예. MIT 라이선스에 따른 핵심 게이트웨이;</td><td>아니요.</td><td>아니요.</td><td>아니요.</td><td>아니요. 비공개 소스 SaaS</td></tr>
<tr><td>인터페이스</td><td>메시징 앱(왓츠앱, 텔레그램, 슬랙, 디스코드, 시그널, 아이메시지 등)</td><td>터미널, IDE 통합, 웹 및 모바일 앱</td><td>터미널 CLI, IDE 통합, 코덱스 웹 UI</td><td>ChatGPT 웹 및 데스크톱 앱(macOS 에이전트 모드 포함)</td><td>웹 대시보드, 브라우저 운영자, Slack 및 앱 통합</td></tr>
<tr><td>주요 초점</td><td>도구 및 서비스 전반의 개인 + 개발자 자동화</td><td>소프트웨어 개발 및 DevOps 워크플로우</td><td>소프트웨어 개발 및 코드 편집</td><td>범용 웹 작업, 리서치 및 생산성 워크플로</td><td>비즈니스 사용자를 위한 리서치, 콘텐츠 및 웹 자동화</td></tr>
<tr><td>세션 메모리</td><td>디스크의 파일 기반 메모리(마크다운 + 로그), 시맨틱/장기 메모리 추가 플러그인(옵션)</td><td>기록이 있는 프로젝트별 세션 및 계정의 선택적 클로드 메모리</td><td>CLI/편집기의 세션별 상태, 내장된 장기 사용자 메모리 없음</td><td>ChatGPT의 계정 수준 메모리 기능으로 지원되는 작업별 "에이전트 실행"(활성화된 경우)</td><td>실행 전반에 걸친 클라우드 측 계정 범위 메모리, 반복 워크플로우에 맞게 조정됨</td></tr>
<tr><td>배포</td><td>머신 또는 VPS에서 상시 실행되는 게이트웨이/데몬, LLM 제공업체에 호출</td><td>개발자의 머신에서 CLI/IDE 플러그인으로 실행되며, 모든 모델 호출은 Anthropic의 API로 이동합니다.</td><td>CLI는 로컬에서 실행되며, 모델은 OpenAI의 API 또는 코덱스 웹을 통해 실행됩니다.</td><td>OpenAI에서 완전히 호스팅; 에이전트 모드는 ChatGPT 클라이언트에서 가상 작업 공간을 회전시킵니다.</td><td>마누스가 완전히 호스팅하며, 에이전트는 마누스의 클라우드 환경에서 실행됩니다.</td></tr>
<tr><td>대상 고객</td><td>자체 인프라 운영에 익숙한 개발자 및 고급 사용자</td><td>터미널 및 IDE에서 작업하는 개발자 및 DevOps 엔지니어</td><td>터미널/IDE에서 코딩 에이전트를 원하는 개발자</td><td>최종 사용자 작업에 ChatGPT를 사용하는 지식 근로자 및 팀</td><td>웹 중심 워크플로우를 자동화하는 비즈니스 사용자 및 팀</td></tr>
<tr><td>비용</td><td>무료 + 사용량에 따른 API 호출</td><td>$20-200/월</td><td>$20-200/월</td><td>$20-200/월</td><td>39-199/월(크레딧)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">OpenClaw의 실제 적용 사례<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw의 실질적인 가치는 범위에서 비롯됩니다. Milvus 커뮤니티를 위해 배포한 지원 봇부터 시작하여 사람들이 이 도구로 구축한 흥미로운 사례 몇 가지를 소개합니다.</p>
<p><strong>Slack에서 Milvus 커뮤니티를 위한 AI 지원 봇을 구축한 Zilliz 지원팀</strong></p>
<p>Zilliz 팀은 OpenClaw를 <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Milvus 커뮤니티 도</a>우미로 Slack 워크스페이스에 연결했습니다. 설정하는 데 20분 정도 걸렸습니다. 이제 Milvus에 대한 일반적인 질문에 답변하고, 오류를 해결하며, 사용자에게 관련 문서를 안내합니다. 비슷한 방법을 시도해보고 싶으시다면 OpenClaw를 Slack에 연결하는 방법에 대한 전체 <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">단계별 튜토리얼을</a> 작성했습니다.</p>
<ul>
<li><strong>OpenClaw 튜토리얼:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack으로 OpenClaw를 설정하는 단계별 가이드</a></li>
</ul>
<p><strong>잠자는 동안 4,200달러의 자동차 구매 할인을 협상하는 데 도움을 준 에이전트를 구축한 AJ Stuyvenberg</strong></p>
<p>소프트웨어 엔지니어인 AJ Stuyvenberg는 2026년형 현대 팰리세이드 구매를 OpenClaw에 맡겼습니다. 에이전트는 지역 딜러의 재고를 스크랩하고 전화번호와 이메일을 사용하여 문의 양식을 작성한 다음 며칠 동안 딜러끼리 경쟁하는 PDF 견적을 전달하고 서로 상대방의 가격을 깎아달라고 요청했습니다. 최종 결과는 스티커보다 낮은 <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4,200달러였고</a>, 스투이벤버그는 서류에 서명만 하고 돌아갔습니다. 그는 "자동차 구매의 고통스러운 부분을 AI에 아웃소싱하는 것은 매우 신선하고 좋았습니다."라고 썼습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>호몰드의 에이전트는 이전에 종결된 보험 분쟁을 즉시 해결해 주었습니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>호몰드라는 사용자는 레모네이드 보험에서 보험금 청구를 거절당했습니다. 그의 OpenClaw는 거부 이메일을 발견하고 명시적인 허가 없이 정책 문구를 인용한 반박 이메일을 작성하여 보냈습니다. Lemonade는 조사를 재개했습니다. 그는 트위터에 &quot;내 @openclaw가 실수로 Lemonade Insurance와 싸움을 시작했어요.&quot;라며 &quot;고마워요, AI.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">몰트북: AI 에이전트를 위해 OpenClaw로 구축한 소셜 네트워크<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 예는 개별 사용자의 작업을 자동화하는 OpenClaw를 보여줍니다. 하지만 이러한 에이전트 수천 명이 서로 상호작용하면 어떻게 될까요?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>2026년 1월 28일, 기업가 매트 슐리히트는 OpenClaw에서 영감을 받아 AI 에이전트만 게시할 수 있는 Reddit 스타일의 플랫폼인 <a href="https://moltbook.com/">몰트북을</a> 출시했습니다. 성장은 빨랐습니다. 72시간 만에 32,000명의 상담원이 등록했습니다. 일주일 만에 150만 명을 돌파했습니다. 첫 주에 백만 명이 넘는 사람들이 방문했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>보안 문제도 그에 못지않게 빠르게 발생했습니다. 출시 4일 후인 1월 31일, <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media는</a> Supabase 데이터베이스의 잘못된 구성으로 인해 플랫폼의 전체 백엔드가 공개 인터넷에 노출되었다고 <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">보도했습니다</a>. 보안 연구원 제임스슨 오라일리가 이 결함을 발견했고, <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz는</a> 이를 <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">독립적으로 확인하고</a> 150만 개의 상담원 API 키, 35,000개 이상의 이메일 주소, 수천 개의 비공개 메시지를 포함한 모든 테이블에 대한 인증되지 않은 읽기 및 쓰기 액세스 권한을 포함한 전체 범위를 문서화했습니다.</p>
<p>몰트북이 새로운 기계 행동을 나타내는 것인지, 아니면 훈련 데이터에서 공상과학 소설 속 인물을 재현하는 에이전트를 나타내는 것인지는 아직 논란의 여지가 있습니다. 자율 에이전트가 지속적인 컨텍스트를 유지하고, 공유 플랫폼에서 조율하며, 명시적인 지시 없이 구조화된 결과물을 생성하는 기술 데모는 덜 모호합니다. OpenClaw 또는 이와 유사한 프레임워크로 구축하는 엔지니어에게는 대규모 에이전트 AI의 기능과 보안 문제를 실시간으로 미리 살펴볼 수 있는 기회입니다.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">OpenClaw의 기술적 위험 및 프로덕션 고려 사항<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>중요한 곳에 OpenClaw를 배포하기 전에 실제로 무엇을 실행하고 있는지 이해해야 합니다. 이 에이전트는 셸 액세스, 브라우저 제어, 사용자 요청 없이 반복적으로 이메일을 보낼 수 있는 기능을 갖춘 에이전트입니다. 이는 매우 강력하지만 공격 표면이 방대하고 프로젝트가 아직 초기 단계입니다.</p>
<p><strong>인증 모델에 심각한 구멍이 있었습니다.</strong> 2026년 1월 30일, 디풋퍼스트의 마브 레빈은 모든 웹사이트가 하나의 악성 링크를 통해 인증 토큰을 탈취하고 사용자의 컴퓨터에서 RCE를 얻을 수 있는 크로스 사이트 웹소켓 하이재킹 버그인 <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8)을 공개했습니다. 한 번의 클릭으로 전체 액세스 권한이 부여됩니다. 이 버그는 <code translate="no">2026.1.29</code> 에서 패치되었지만 당시 일반 HTTP를 통해 21,000개 이상의 OpenClaw 인스턴스가 공개 인터넷에 노출된 것을 Censys에서 발견했습니다. <strong>이전 버전을 실행 중이거나 네트워크 구성을 잠그지 않았다면 먼저 이를 확인하세요.</strong></p>
<p><strong>스킬은 낯선 사람의 코드일 뿐이며 샌드박스는 없습니다.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Cisco의 보안팀은</a> 리포지토리에서 1위를 차지했던 "Elon이라면 어떻게 할까요?"라는 스킬을 분석했습니다. 이 기술은 프롬프트 인젝션을 사용하여 안전 검사를 우회하고 사용자 데이터를 공격자가 제어하는 서버로 유출하는 단순한 멀웨어였습니다. 이 한 가지 기술에서 9개의 취약점을 발견했는데, 그 중 2개는 치명적이었습니다. 여러 플랫폼(클로드, 코파일럿, 일반 에이전트 스킬 리포지토리)에 걸쳐 31,000개의 에이전트 스킬을 감사한 결과 26%에서 최소 한 가지 이상의 취약점이 발견되었습니다. 2월 첫째 주에만 230개 이상의 악성 스킬이 ClawHub에 업로드되었습니다. <strong>직접 작성하지 않은 모든 스킬은 신뢰할 수 없는 종속 요소처럼 취급하여 포크하고 읽은 다음 설치하세요.</strong></p>
<p><strong>하트비트 루프는 여러분이 요청하지 않은 일을 해줄 것입니다.</strong> 인트로의 호몰드 사례(상담원이 보험 거부 사례를 발견하고 판례를 조사한 후 자율적으로 법적 반박문을 보낸 사례)는 기능 데모가 아니라 법적 책임의 위험에 대한 사례입니다. 에이전트는 사람의 승인 없이 법적 대응에 전념했습니다. 그때는 잘 해결되었습니다. 항상 그렇지는 않습니다. <strong>결제, 삭제 또는 외부 커뮤니케이션과 관련된 모든 작업에는 사람이 직접 개입하는 게이트가 필요합니다.</strong></p>
<p><strong>주의를 기울이지 않으면 API 비용이 빠르게 증가합니다.</strong> 대략적인 수치: 하루에 몇 번의 하트비트가 발생하는 가벼운 설정의 경우 Sonnet 4.5에서 월 $18-36이 소요됩니다. Opus에서 매일 12회 이상 확인하면 월 270~540달러가 소요됩니다. HN의 한 사용자는 중복 API 호출과 장황한 로깅으로 한 달에 70달러를 소모하고 있었는데, 구성을 정리한 후 거의 제로로 줄였습니다. <strong>공급자 수준에서 지출 알림을 설정하세요.</strong> 하트비트 간격을 잘못 설정하면 API 예산이 하룻밤 사이에 고갈될 수 있습니다.</p>
<p>배포하기 전에 이 과정을 거치는 것이 좋습니다:</p>
<ul>
<li><p>일상적인 드라이버가 아닌 전용 VM 또는 컨테이너와 같은 격리된 환경에서 실행하세요.</p></li>
<li><p>설치하기 전에 모든 스킬을 포크하고 감사하세요. 소스를 읽어보세요. 전부 다요.</p></li>
<li><p>에이전트 구성뿐만 아니라 공급자 수준에서 하드 API 지출 한도를 설정하세요.</p></li>
<li><p>결제, 삭제, 이메일 전송 등 외부에서 이루어지는 모든 되돌릴 수 없는 작업을 사람의 승인 후에 차단합니다.</p></li>
<li><p>2026.1.29 이상으로 고정하고 보안 패치를 최신 상태로 유지하세요.</p></li>
</ul>
<p>네트워크 구성에 대해 정확히 알지 못한다면 공용 인터넷에 노출하지 마세요.</p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw는 2주 만에 175,000개의 GitHub 스타를 돌파하여 GitHub 역사상 가장 빠르게 성장하는 오픈소스 리포지토리 중 하나가 되었습니다. 실제 채택이 이루어지고 있으며 그 밑바탕에 깔린 아키텍처에 주목할 필요가 있습니다.</p>
<p>기술적 관점에서 볼 때, OpenClaw는 완전 오픈 소스(MIT), 로컬 우선(머신에 마크다운 파일로 저장된 메모리), 자율 예약(프롬프트 없이 작동하는 하트비트 데몬) 등 대부분의 AI 에이전트가 갖지 못한 세 가지를 모두 갖추고 있습니다. Slack, Telegram, WhatsApp과 같은 메시징 플랫폼과 바로 통합되며, 간단한 SKILL.md 시스템을 통해 커뮤니티에서 구축한 스킬을 지원합니다. 이러한 조합은 상시 대기 어시스턴트를 구축하는 데 매우 적합합니다: 연중무휴 24시간 질문에 답변하는 Slack 봇, 잠자는 동안 이메일을 분류하는 받은 편지함 모니터, 공급업체에 종속되지 않고 자체 하드웨어에서 실행되는 자동화 워크플로 등을 구축하는 데 적합합니다.</p>
<p>하지만 OpenClaw를 강력하게 만드는 아키텍처는 부주의하게 배포할 경우 위험할 수도 있습니다. 몇 가지 유의해야 할 사항이 있습니다:</p>
<ul>
<li><p><strong>격리하여 실행하세요.</strong> 기본 머신이 아닌 전용 기기나 가상 머신을 사용하세요. 문제가 발생하면 물리적으로 도달할 수 있는 킬 스위치가 있어야 합니다.</p></li>
<li><p><strong>설치하기 전에 스킬을 감사하세요.</strong> Cisco에서 분석한 커뮤니티 스킬의 26%에 적어도 하나의 취약점이 포함되어 있었습니다. 신뢰할 수 없는 것은 포크하고 검토하세요.</p></li>
<li><p><strong>공급자 수준에서 API 지출 한도를 설정하세요.</strong> 잘못 구성된 하트비트는 하룻밤 사이에 수백 달러를 소진할 수 있습니다. 배포하기 전에 경고를 구성하세요.</p></li>
<li><p><strong>되돌릴 수 없는 작업을 차단하세요.</strong> 결제, 삭제, 외부 커뮤니케이션: 이러한 작업은 자율 실행이 아닌 사람의 승인이 필요해야 합니다.</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack으로 OpenClaw를 설정하는 단계별 가이드</a> - OpenClaw를 사용하여 Slack 워크스페이스에서 Milvus 기반 AI 지원 봇을 구축하세요.</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 및 Milvus: 장기 메모리로 프로덕션 준비된 AI 에이전트 구축</a> - Milvus로 에이전트에 지속적이고 시맨틱한 메모리를 제공하는 방법</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">바닐라 RAG 구축 중단: DeepSearcher로 에이전틱 RAG 도입</a> - 실습 오픈 소스 구현을 통해 에이전틱 RAG가 기존 검색보다 뛰어난 성능을 발휘하는 이유</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Milvus 및 LangGraph를 사용한 에이전트 RAG</a> - 튜토리얼: 검색 시기를 결정하고, 문서 관련성을 평가하고, 쿼리를 다시 작성하는 에이전트 구축하기</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Spring Boot 및 Milvus를 사용한 프로덕션 지원 AI 어시스턴트 구축</a> - 시맨틱 검색 및 대화 메모리를 갖춘 엔터프라이즈 AI 어시스턴트를 구축하기 위한 풀스택 가이드</p></li>
</ul>
