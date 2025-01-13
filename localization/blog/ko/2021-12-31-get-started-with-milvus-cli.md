---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Milvus_CLI 시작하기
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: 이 문서에서는 Milvus_CLI를 소개하고 일반적인 작업을 완료하는 데 도움을 줍니다.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>정보 폭증의 시대에 우리는 음성, 이미지, 동영상 및 기타 비정형 데이터를 끊임없이 생산하고 있습니다. 이 방대한 양의 데이터를 어떻게 효율적으로 분석할 수 있을까요? 신경망의 등장으로 비정형 데이터도 벡터로 담을 수 있게 되었고, Milvus 데이터베이스는 벡터 데이터의 저장, 검색, 분석을 완성하는 데 도움을 주는 기본적인 데이터 서비스 소프트웨어입니다.</p>
<p>그렇다면 어떻게 하면 Milvus 벡터 데이터베이스를 빠르게 사용할 수 있을까요?</p>
<p>일부 사용자들은 API를 외우기 어렵다고 불평하며 Milvus 데이터베이스를 조작할 수 있는 간단한 명령줄이 있었으면 좋겠다는 의견을 제시해 왔습니다.</p>
<p>이에 Milvus 벡터 데이터베이스 전용 커맨드 라인 도구인 Milvus_CLI를 소개하게 되어 기쁘게 생각합니다.</p>
<p>Milvus_CLI는 Milvus를 위한 편리한 데이터베이스 CLI로, 셸에서 대화형 명령을 사용하여 데이터베이스 연결, 데이터 가져오기, 데이터 내보내기, 벡터 계산을 지원합니다. 최신 버전의 Milvus_CLI에는 다음과 같은 기능이 있습니다.</p>
<ul>
<li><p>Windows, Mac, Linux를 포함한 모든 플랫폼 지원</p></li>
<li><p>pip를 통한 온라인 및 오프라인 설치 지원</p></li>
<li><p>휴대성이 뛰어나 어디서나 사용 가능</p></li>
<li><p>Python용 Milvus SDK를 기반으로 구축됨</p></li>
<li><p>도움말 문서 포함</p></li>
<li><p>자동 완성 지원</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">설치<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI는 온라인 또는 오프라인으로 설치할 수 있습니다.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Milvus_CLI 온라인 설치</h3><p>다음 명령을 실행하여 pip로 Milvus_CLI를 온라인으로 설치합니다. Python 3.8 이상이 필요합니다.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Milvus_CLI 오프라인 설치</h3><p>Milvus_CLI를 오프라인으로 설치하려면 먼저 릴리스 페이지에서 최신 타르볼을 <a href="https://github.com/milvus-io/milvus_cli/releases">다운로드하세요</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>타르볼을 다운로드한 후 다음 명령어를 실행하여 Milvus_CLI를 설치합니다.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Milvus_CLI가 설치된 후 <code translate="no">milvus_cli</code> 을 실행합니다. <code translate="no">milvus_cli &gt;</code> 프롬프트가 나타나면 명령줄이 준비되었음을 나타냅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>M1 칩이 탑재된 Mac 또는 Python 환경이 없는 PC를 사용하는 경우 휴대용 애플리케이션을 대신 사용하도록 선택할 수 있습니다. 이렇게 하려면 사용 중인 OS에 해당하는 릴리스 페이지에서 파일을 <a href="https://github.com/milvus-io/milvus_cli/releases">다운로드하고</a> <code translate="no">chmod +x</code> 을 실행하여 실행 가능한 파일로 만든 다음 <code translate="no">./</code> 을 실행하여 실행합니다.</p>
<h4 id="Example" class="common-anchor-header"><strong>예제</strong></h4><p>다음 예는 <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> 을 실행 가능한 파일로 만들어 실행합니다.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">사용법<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Milvus에 연결하기</h3><p>Milvus에 연결하기 전에 서버에 Milvus가 설치되어 있는지 확인하세요. 자세한 내용은 <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus 독립형 설치</a> 또는 <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Milvus 클러스터 설치를</a> 참조하세요.</p>
<p>Milvus가 로컬 호스트에 기본 포트로 설치된 경우 <code translate="no">connect</code> 을 실행합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>그렇지 않은 경우 Milvus 서버의 IP 주소로 다음 명령을 실행합니다. 다음 예에서는 <code translate="no">172.16.20.3</code> 을 IP 주소로, <code translate="no">19530</code> 을 포트 번호로 사용합니다.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">컬렉션 만들기</h3><p>이 섹션에서는 컬렉션을 만드는 방법을 소개합니다.</p>
<p>컬렉션은 엔티티로 구성되며 RDBMS의 테이블과 유사합니다. 자세한 내용은 <a href="https://milvus.io/docs/v2.0.x/glossary.md">용어집을</a> 참조하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">예제</h4><p>다음 예제에서는 <code translate="no">car</code> 라는 컬렉션을 만듭니다. <code translate="no">car</code> 컬렉션에는 <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code>, <code translate="no">brand</code> 의 네 개의 필드가 있습니다. 기본 키 필드는 <code translate="no">id</code> 입니다. 자세한 내용은 <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">컬렉션 만들기를</a> 참조하세요.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">컬렉션 나열하기</h3><p>다음 명령을 실행하여 이 Milvus 인스턴스의 모든 컬렉션을 나열합니다.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>다음 명령을 실행하여 <code translate="no">car</code> 컬렉션의 세부 정보를 확인합니다.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">두 벡터 사이의 거리 계산하기</h3><p>다음 명령을 실행하여 <code translate="no">car</code> 컬렉션으로 데이터를 가져옵니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p><code translate="no">query</code> 을 실행하고 메시지가 표시되면 컬렉션 이름으로 <code translate="no">car</code> 을, 쿼리 표현식으로 <code translate="no">id&gt;0</code> 을 입력합니다. 다음 그림과 같이 기준을 충족하는 엔티티의 ID가 반환됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p><code translate="no">calc</code> 을 실행하고 벡터 배열 간의 거리를 계산하라는 메시지가 표시되면 적절한 값을 입력합니다.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">컬렉션 삭제하기</h3><p>다음 명령을 실행하여 <code translate="no">car</code> 컬렉션을 삭제합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">더 보기<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI는 앞의 함수에 국한되지 않습니다. <code translate="no">help</code> 을 실행하면 Milvus_CLI에 포함된 모든 명령과 각 설명을 볼 수 있습니다. <code translate="no">&lt;command&gt; --help</code> 을 실행하면 지정된 명령의 세부 정보를 볼 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>또한 참조하세요:</strong></p>
<p>Milvus 문서 아래의<a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLI 명령 참조</a> </p>
<p>Milvus_CLI가 Milvus 벡터 데이터베이스를 쉽게 사용하는 데 도움이 되기를 바랍니다. Milvus_CLI는 계속 최적화될 것이며, 여러분의 의견을 환영합니다.</p>
<p>궁금한 점이 있으시면 언제든지 GitHub에 <a href="https://github.com/zilliztech/milvus_cli/issues">이슈를 제출해</a> 주세요.</p>
