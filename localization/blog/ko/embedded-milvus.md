---
id: embedded-milvus.md
title: 임베디드 Milvus를 사용하여 Python으로 Milvus를 즉시 설치 및 실행하기
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: Python 사용자 친화적인 Milvus 버전으로 더욱 유연하게 설치할 수 있습니다.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>표지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/soothing-rain/">알렉스 가오와</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 공동 집필했습니다.</p>
</blockquote>
<p>Milvus는 AI 애플리케이션을 위한 오픈 소스 벡터 데이터베이스입니다. 소스 코드에서 빌드하는 방법, Docker Compose/Helm/APT/YUM/Ansible로 Milvus를 설치하는 방법 등 다양한 설치 방법을 제공합니다. 사용자는 운영 체제와 환경 설정에 따라 설치 방법 중 하나를 선택할 수 있습니다. 그러나 Milvus 커뮤니티의 많은 데이터 과학자와 AI 엔지니어들은 Python으로 작업하며 현재 사용 가능한 설치 방법보다 훨씬 간단한 설치 방법을 갈망하고 있습니다.</p>
<p>따라서 Milvus 2.1과 함께 Python 사용자 친화적인 버전인 임베디드 Milvus를 출시하여 커뮤니티의 더 많은 Python 개발자에게 힘을 실어드리고자 합니다. 이 문서에서는 임베디드 Milvus가 무엇인지 소개하고 설치 및 사용 방법에 대한 지침을 제공합니다.</p>
<p><strong>건너뛰기:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">임베디드 Milvus 개요</a><ul>
<li><a href="#When-to-use-embedded-Milvus">임베디드 Milvus는 언제 사용하나요?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Milvus의 다양한 모드 비교</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">임베디드 Milvus 설치 방법</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">임베디드 Milvus 시작 및 중지</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">임베디드 Milvus 개요<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">임베디드 Mil</a> vus를 사용하면 Python으로 Milvus를 빠르게 설치하고 사용할 수 있습니다. Milvus 인스턴스를 빠르게 불러올 수 있으며, 원할 때마다 Milvus 서비스를 시작 및 중지할 수 있습니다. 임베디드 Milvus를 중지하더라도 모든 데이터와 로그는 유지됩니다.</p>
<p>임베디드 Milvus 자체에는 내부 종속성이 없으며 etcd, MinIO, Pulsar 등과 같은 타사 종속성을 사전 설치 및 실행할 필요가 없습니다.</p>
<p>임베디드 Milvus로 수행하는 모든 작업과 이를 위해 작성하는 모든 코드는 독립형, 클러스터, 클라우드 버전 등 다른 Milvus 모드로 안전하게 마이그레이션할 수 있습니다. 이는 임베디드 Milvus의 가장 큰 특징 중 하나인 <strong>"한 번 작성하면 어디서나 실행"을</strong> 반영합니다.</p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">임베디드 Milvus는 언제 사용하나요?</h3><p>임베디드 Milvus와 <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus는</a> 서로 다른 목적을 위해 만들어졌습니다. 다음 시나리오에서는 임베디드 Milvus를 선택하는 것을 고려할 수 있습니다:</p>
<ul>
<li><p><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">여기에</a> 제공된 방법으로 Milvus를 설치하지 않고 Milvus를 사용하려는 경우.</p></li>
<li><p>머신에서 장기간 실행되는 Milvus 프로세스를 유지하지 않고 Milvus를 사용하려는 경우.</p></li>
<li><p>별도의 Milvus 프로세스 및 etcd, MinIO, Pulsar 등과 같은 기타 필수 구성 요소를 시작하지 않고 Milvus를 빠르게 사용하고자 하는 경우.</p></li>
</ul>
<p>임베디드 Milvus를 사용하지 <strong>않는</strong> 것이 좋습니다:</p>
<ul>
<li><p>프로덕션 환경에서.<em>(프로덕션 환경에서 Milvus를 사용하려면 Milvus 클러스터 또는 완전 관리형 Milvus 서비스인 <a href="https://zilliz.com/cloud">Zilliz 클라우드를</a> 고려하세요</em>.)</p></li>
<li><p>성능에 대한 요구가 높은 경우.<em>(상대적으로 임베디드 Milvus는 최상의 성능을 제공하지 못할 수</em> 있습니다.)</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Milvus의 다양한 모드 비교</h3><p>아래 표는 독립형, 클러스터, 임베디드 Milvus, 그리고 완전 관리형 Milvus 서비스인 Zilliz Cloud의 여러 Milvus 모드를 비교한 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>비교</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">임베디드 Milvus는 어떻게 설치하나요?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>임베디드 Milvus를 설치하기 전에 먼저 Python 3.6 이상을 설치했는지 확인해야 합니다. 임베디드 Milvus는 다음 운영 체제를 지원합니다:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>요구 사항을 충족하는 경우 <code translate="no">$ python3 -m pip install milvus</code> 을 실행하여 임베디드 Milvus를 설치할 수 있습니다. 명령에 버전을 추가하여 특정 버전의 임베디드 Milvus를 설치할 수도 있습니다. 예를 들어 2.1.0 버전을 설치하려면 <code translate="no">$ python3 -m pip install milvus==2.1.0</code> 을 실행합니다. 나중에 임베디드 Milvus의 새 버전이 출시되면 <code translate="no">$ python3 -m pip install --upgrade milvus</code> 을 실행하여 임베디드 Milvus를 최신 버전으로 업그레이드할 수도 있습니다.</p>
<p>이전에 이미 파이밀버스를 설치한 적이 있는 기존 Milvus 사용자로서 임베디드 Milvus를 설치하고자 하는 경우 <code translate="no">$ python3 -m pip install --no-deps milvus</code> 을 실행할 수 있습니다.</p>
<p>설치 명령을 실행한 후 다음 명령을 실행하여 <code translate="no">/var/bin/e-milvus</code> 아래에 임베디드 Milvus용 데이터 폴더를 만들어야 합니다:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">임베디드 Milvus 시작 및 중지<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>설치가 완료되면 서비스를 시작할 수 있습니다.</p>
<p>임베디드 Milvus를 처음 실행하는 경우 먼저 Milvus를 가져와서 임베디드 Milvus를 설정해야 합니다.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>이전에 임베디드 Milvus를 성공적으로 실행한 후 다시 시작하려면 Milvus를 가져온 후 <code translate="no">milvus.start()</code> 를 바로 실행하면 됩니다.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>임베디드 Milvus 서비스가 성공적으로 시작되었다면 다음과 같은 출력을 확인할 수 있습니다.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>서비스가 시작되면 다른 터미널 창을 열고 &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot;의 예제 코드를 실행하여 임베드된 Milvus를 사용해 볼 수 있습니다!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>임베디드 밀버스 사용이 끝나면 다음 명령을 실행하거나 Ctrl-D를 눌러 서비스를 정상적으로 종료하고 환경 변수를 정리하는 것이 좋습니다.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">다음 단계<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1의 공식 출시와 함께 새로운 기능을 소개하는 블로그 시리즈를 준비했습니다. 이 블로그 시리즈에서 자세히 읽어보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">문자열 데이터를 사용해 유사도 검색 애플리케이션을 강화하는 방법</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">임베디드 Milvus를 사용하여 Python으로 Milvus 즉시 설치 및 실행하기</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 늘리기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기(2부)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a></li>
</ul>
