---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: '벡터 데이터베이스와 대화하기: 자연어를 통한 밀버스 관리'
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP 서버는 MCP를 통해 Milvus를 클로드 코드, 커서와 같은 AI 코딩 어시스턴트와 직접 연결합니다. 자연어를 통해
  Milvus를 관리할 수 있습니다.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>AI 어시스턴트에게 <em>"내 벡터 데이터베이스의 모든 컬렉션 보여줘"</em> 또는 <em>"이 텍스트와 유사한 문서 찾아줘"</em> 라고 말하면 실제로 작동했으면 좋겠다고 생각한 적이 있나요?</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP 서버는</strong></a> 모델 컨텍스트 프로토콜(MCP)을 통해 Milvus 벡터 데이터베이스를 Claude Desktop 및 Cursor IDE와 같은 AI 코딩 어시스턴트에 직접 연결하여 이를 가능하게 합니다. <code translate="no">pymilvus</code> 코드를 작성하는 대신 자연어 대화를 통해 전체 Milvus를 관리할 수 있습니다.</p>
<ul>
<li><p>Milvus MCP 서버 없이: pymilvus SDK로 Python 스크립트를 작성하여 벡터 검색하기</p></li>
<li><p>Milvus MCP 서버 사용 시: "내 컬렉션에서 이 텍스트와 유사한 문서 찾아줘."</p></li>
</ul>
<p>👉 <strong>GitHub 리포지토리:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> (관리형 Milvus)를 사용 중이신 분들을 위한 내용도 준비되어 있습니다. 이 블로그 말미에는 Zilliz Cloud와 원활하게 작동하는 관리형 옵션인 <strong>Zilliz MCP 서버에</strong> 대해서도 소개합니다. 지금 바로 시작해보겠습니다.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Milvus MCP 서버의 이점<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP 서버는 AI 어시스턴트에게 다음과 같은 기능을 제공합니다:</p>
<ul>
<li><p>벡터 컬렉션<strong>목록 및 탐색</strong> </p></li>
<li><p>시맨틱 유사성을 사용하여<strong>벡터 검색</strong> </p></li>
<li><p>사용자 정의 스키마로<strong>새 컬렉션 생성</strong> </p></li>
<li><p>벡터 데이터<strong>삽입 및 관리</strong> </p></li>
<li><p>코드 작성 없이<strong>복잡한 쿼리 실행</strong> </p></li>
<li><p>그리고 더 많은 기능</p></li>
</ul>
<p>마치 데이터베이스 전문가와 대화하듯 자연스러운 대화를 통해 이 모든 것이 가능합니다. 전체 기능 목록은 <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">이 리포지토리를</a> 확인하세요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">빠른 시작 가이드<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p><strong>필수:</strong></p>
<ul>
<li><p>Python 3.10 이상</p></li>
<li><p>실행 중인 Milvus 인스턴스(로컬 또는 원격)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">UV 패키지 관리자</a> (권장)</p></li>
</ul>
<p><strong>지원되는 AI 애플리케이션:</strong></p>
<ul>
<li><p>클로드 데스크톱</p></li>
<li><p>커서 IDE</p></li>
<li><p>모든 MCP 호환 애플리케이션</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">사용할 기술 스택</h3><p>이 튜토리얼에서는 다음 기술 스택을 사용합니다:</p>
<ul>
<li><p><strong>언어 런타임:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>패키지 관리자:</strong> UV</p></li>
<li><p><strong>IDE:</strong> 커서</p></li>
<li><p><strong>MCP 서버:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> 클로드 3.7</p></li>
<li><p><strong>벡터 데이터베이스:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">1단계: 종속성 설치</h3><p>먼저 UV 패키지 관리자를 설치합니다:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>또는:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>설치를 확인합니다:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">2단계: Milvus 설정</h3><p><a href="https://milvus.io/">Milvus는</a> <a href="https://zilliz.com/">Zilliz에서</a> 만든 AI 워크로드 전용 오픈 소스 벡터 데이터베이스입니다. 수백만에서 수십억 개의 벡터 레코드를 처리하도록 설계된 이 데이터베이스는 GitHub에서 36,000개 이상의 별을 획득했습니다. 이러한 기반을 바탕으로 Zilliz는 클라우드 네이티브 아키텍처로 사용성, 비용 효율성, 보안을 위해 설계된 Milvus의 완전 관리형 <a href="https://zilliz.com/cloud">서비스인 Zilliz Cloud도</a>제공합니다.</p>
<p>Milvus 배포 요구 사항은 <a href="https://milvus.io/docs/prerequisite-docker.md">문서 사이트에서 이 가이드를</a> 참조하세요.</p>
<p><strong>최소 요구 사항:</strong></p>
<ul>
<li><p><strong>소프트웨어:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB 이상</p></li>
<li><p><strong>디스크:</strong> 100GB 이상</p></li>
</ul>
<p>배포 YAML 파일을 다운로드합니다:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvus를 시작합니다:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 인스턴스는 <code translate="no">http://localhost:19530</code> 에서 사용할 수 있습니다.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">3단계: MCP 서버 설치</h3><p>MCP 서버를 복제하고 테스트합니다:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Cursor에 서버를 등록하기 전에 종속성을 설치하고 로컬에서 확인하는 것이 좋습니다:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>서버가 성공적으로 시작되면 AI 도구를 구성할 준비가 된 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">4단계: AI 어시스턴트 구성하기</h3><p><strong>옵션 A: Claude 데스크톱</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header"><code translate="no">[claude.ai/download](http://claude.ai/download)</code> 에서 클로드 데스크톱을 설치합니다.</h4></li>
<li><p>구성 파일을 엽니다:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>이 구성을 추가합니다:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>클로드 데스크톱 재시작</li>
</ol>
<p><strong>옵션 B: 커서 IDE</strong></p>
<ol>
<li><p>커서 설정 → 기능 → MCP를 엽니다.</p></li>
<li><p>새 글로벌 MCP 서버를 추가합니다( <code translate="no">.cursor/mcp.json</code>).</p></li>
<li><p>이 구성을 추가합니다:</p></li>
</ol>
<p>참고: 실제 파일 구조에 맞게 경로를 조정하세요.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>매개변수</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> 는 UV 실행 파일의 경로입니다.</li>
<li><code translate="no">--directory</code> 는 복제된 프로젝트의 경로</li>
<li><code translate="no">--milvus-uri</code> 는 Milvus 서버 엔드포인트입니다.</li>
</ul>
<ol start="4">
<li>커서를 다시 시작하거나 창을 다시 로드합니다.</li>
</ol>
<p><strong>전문가 팁:</strong> macOS/Linux의 경우 <code translate="no">which uv</code>, Windows의 경우 <code translate="no">where uv</code> 로 <code translate="no">uv</code> 경로를 찾으세요.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">5단계: 실제로 보기</h3><p>구성이 완료되면 다음 자연어 명령을 사용해 보세요:</p>
<ul>
<li><p><strong>데이터베이스를 탐색합니다:</strong> "내 Milvus 데이터베이스에 어떤 컬렉션이 있나요?"</p></li>
<li><p><strong>새 컬렉션을 만듭니다:</strong> "제목(문자열), 내용(문자열), 임베딩을 위한 768차원 벡터 필드가 있는 'articles'라는 컬렉션을 만듭니다."</p></li>
<li><p><strong>유사한 콘텐츠 검색하기:</strong> "내 문서 컬렉션에서 '머신 러닝 애플리케이션'과 가장 유사한 문서 5개를 찾아보세요."</p></li>
<li><p><strong>데이터 삽입하기:</strong> "제목이 'AI 트렌드 2024'이고 내용이 '인공지능은 계속 진화하고...'인 새 문서를 문서 컬렉션에 추가하세요."</p></li>
</ul>
<p><strong>30분 이상의 코딩이 필요했던 작업을 이제 대화 몇 초면 끝낼 수 있습니다.</strong></p>
<p>상용구를 작성하거나 API를 학습할 필요 없이 Milvus를 실시간으로 제어하고 자연어로 액세스할 수 있습니다.</p>
<h2 id="Troubleshooting" class="common-anchor-header">문제 해결<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP 도구가 나타나지 않으면 AI 애플리케이션을 완전히 재시작하고 <code translate="no">which uv</code> 으로 UV 경로를 확인한 다음 <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code> 으로 서버를 수동으로 테스트하세요.</p>
<p>연결 오류의 경우 Milvus가 <code translate="no">docker ps | grep milvus</code> 로 실행 중인지 확인하고 <code translate="no">localhost</code> 대신 <code translate="no">127.0.0.1</code> 을 사용하여 포트 19530에 액세스할 수 있는지 확인합니다.</p>
<p>인증 문제가 발생하면 Milvus에 인증이 필요한 경우 <code translate="no">MILVUS_TOKEN</code> 환경 변수를 설정하고 시도 중인 작업에 대한 권한을 확인합니다.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">관리형 대안: 질리즈 MCP 서버<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>오픈 소스 <strong>Milvus MCP 서버는</strong> Milvus의 로컬 또는 자체 호스팅 배포를 위한 훌륭한 솔루션입니다. 그러나 Milvus 개발자가 구축한 완전 관리형 엔터프라이즈급 <a href="https://zilliz.com/cloud">서비스인 Zilliz Cloud를</a>사용하는 경우, 특별히 설계된 대안인 <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP 서버가</strong></a> 있습니다.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud는</a> 확장 가능하고 성능이 뛰어나며 안전한 클라우드 네이티브 벡터 데이터베이스를 제공하여 자체 Milvus 인스턴스를 관리하는 데 따른 오버헤드를 제거합니다. 질리즈 <strong>MCP 서버는</strong> 질리즈 클라우드와 직접 통합되어 MCP 호환 도구로서의 기능을 제공합니다. 즉, 클라우드를 사용하든, 커서를 사용하든, 다른 MCP 인식 환경을 사용하든, 이제 AI 어시스턴트가 자연어를 사용하여 Zilliz Cloud 작업 공간을 쿼리, 관리 및 오케스트레이션할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>상용구 코드가 필요 없습니다. 전환 탭이 없습니다. REST 또는 SDK 호출을 수동으로 작성할 필요가 없습니다. 요청만 말하면 나머지는 어시스턴트가 알아서 처리합니다.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 질리즈 MCP 서버 시작하기</h3><p>자연어의 편리함으로 프로덕션에 바로 사용할 수 있는 벡터 인프라를 준비했다면, 몇 단계만 거치면 시작할 수 있습니다:</p>
<ol>
<li><p>무료 티어를 이용할 수 있는<a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud에 가입</strong></a> 하세요.</p></li>
<li><p>GitHub<a href="http://github.com/zilliztech/zilliz-mcp-server">리포지토리에서<strong>Zilliz MCP 서버를 설치합니다</strong> </a>.</p></li>
<li><p><strong>MCP 호환 어시스턴트</strong> (클로드, 커서 등)가 Zilliz Cloud 인스턴스에 연결되도록<strong>구성합니다</strong>.</p></li>
</ol>
<p>이렇게 하면 프로덕션급 인프라를 갖춘 강력한 벡터 검색을 이제 일반 영어를 통해 액세스할 수 있다는 두 가지 장점을 모두 누릴 수 있습니다.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">마무리<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>지금까지 Milvus를 말 그대로 <em>대화할</em> 수 있는 자연어 친화적인 벡터 데이터베이스로 전환하는 방법을 배웠습니다. 더 이상 컬렉션을 실행하거나 검색을 실행하기 위해 SDK 문서를 뒤지거나 상용구를 작성할 필요가 없습니다.</p>
<p>Milvus를 로컬에서 실행하든 Zilliz Cloud를 사용하든, MCP 서버는 AI 어시스턴트가 전문가처럼 벡터 데이터를 관리할 수 있는 툴박스를 제공합니다. 원하는 작업만 입력하면 나머지는 Claude나 Cursor가 알아서 처리합니다.</p>
<p>이제 AI 개발 도구를 실행하고 "어떤 컬렉션이 있나요?"라고 물어보고 실제로 작동하는 모습을 확인해 보세요. 다시는 수작업으로 벡터 쿼리를 작성하고 싶지 않을 것입니다.</p>
<ul>
<li><p>로컬 설정? 오픈 소스<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP 서버를</a> 사용하세요.</p></li>
<li><p>관리형 서비스를 선호하시나요? 질리즈 클라우드에 가입하고<a href="https://github.com/zilliztech/zilliz-mcp-server"> 질리즈 MCP 서버를</a> 사용하세요.</p></li>
</ul>
<p>도구가 준비되었습니다. 이제 인공지능에게 타이핑을 맡기세요.</p>
