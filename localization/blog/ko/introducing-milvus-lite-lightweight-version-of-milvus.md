---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Milvus 라이트: Milvus의 경량 버전 소개'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: 초고속 유사도 검색을 위한 유명한 Milvus 벡터 데이터베이스의 경량 버전인 Milvus Lite의 속도와 효율성을 경험해 보세요.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>중요 참고 사항</em></strong></p>
<p><em>2024년 6월에 Milvus Lite를 업그레이드하여 AI 개발자가 더 빠르게 애플리케이션을 구축하는 동시에 Kurbernetes, Docker, 관리형 클라우드 서비스 등 다양한 배포 옵션에서 일관된 경험을 보장할 수 있도록 했습니다. 또한 Milvus Lite는 다양한 AI 프레임워크 및 기술과 통합되어 벡터 검색 기능을 통해 AI 애플리케이션 개발을 간소화합니다. 자세한 내용은 다음 참조 자료를 참조하세요:</em></p>
<ul>
<li><p><em>Milvus Lite 출시 블로그: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Milvus Lite 설명서: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Milvus Lite GitHub 리포지토리: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus는</a> 수십억 개의 규모로 심층 신경망 및 기타 머신 러닝(ML) 모델에서 생성된 임베딩 벡터를 색인, 저장 및 쿼리하기 위해 특별히 구축된 오픈 소스 벡터 데이터베이스입니다. 대규모 데이터 세트에서 유사도 검색을 수행해야 하는 많은 기업, 연구자, 개발자들이 즐겨 사용하고 있습니다.</p>
<p>그러나 일부 사용자들은 Milvus 정식 버전이 너무 무겁거나 복잡하다고 느낄 수 있습니다. 이 문제를 해결하기 위해 Milvus 커뮤니티에서 가장 활발하게 활동하는 기여자 중 한 명인 <a href="https://github.com/matrixji">Bin Ji는</a> Milvus의 경량 버전인 Milvus <a href="https://github.com/milvus-io/milvus-lite">Lite를</a> 만들었습니다.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Milvus Lite란 무엇인가요?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>앞서 언급했듯이 Milvus <a href="https://github.com/milvus-io/milvus-lite">Lite는</a> 많은 장점과 이점을 제공하는 Milvus의 간소화된 대안입니다.</p>
<ul>
<li>무게를 추가하지 않고도 Python 애플리케이션에 통합할 수 있습니다.</li>
<li>독립형 Milvus는 임베디드 Etcd 및 로컬 스토리지와 함께 작동하는 기능 덕분에 다른 종속성이 필요하지 않습니다.</li>
<li>Python 라이브러리로 가져와서 명령줄 인터페이스(CLI) 기반 독립형 서버로 사용할 수 있습니다.</li>
<li>Google Colab 및 Jupyter Notebook과 원활하게 작동합니다.</li>
<li>데이터 손실의 위험 없이 작업을 안전하게 마이그레이션하고 다른 Milvus 인스턴스(독립형, 클러스터형, 완전 관리형 버전)로 코드를 작성할 수 있습니다.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Milvus Lite는 언제 사용해야 하나요?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>특히 다음과 같은 상황에서 Milvus Lite가 가장 유용합니다:</p>
<ul>
<li><a href="https://milvus.io/docs/install_standalone-operator.md">밀버스 오퍼레이터</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">헬름</a>, <a href="https://milvus.io/docs/install_standalone-docker.md">도커 컴포즈와</a> 같은 컨테이너 기술 및 도구 없이 밀버스를 사용하고 싶을 때.</li>
<li>Milvus를 사용하기 위해 가상 머신이나 컨테이너가 필요하지 않은 경우.</li>
<li>Milvus 기능을 Python 애플리케이션에 통합하려는 경우.</li>
<li>빠른 실험을 위해 Colab 또는 Notebook에서 Milvus 인스턴스를 스핀업하려는 경우.</li>
</ul>
<p><strong>참고</strong>: 프로덕션 환경이나 고성능, 강력한 가용성 또는 높은 확장성이 필요한 경우에는 Milvus Lite를 사용하지 않는 것이 좋습니다. 대신, 프로덕션 환경에서는 <a href="https://github.com/milvus-io/milvus">Milvus 클러스터</a> 또는 <a href="https://zilliz.com/cloud">Zilliz Cloud의 완전 관리형 Milvus를</a> 사용하는 것을 고려하세요.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Milvus Lite는 어떻게 시작하나요?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Milvus Lite를 설치, 구성 및 사용하는 방법을 살펴보겠습니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>Milvus Lite를 사용하려면 다음 요구 사항을 완료했는지 확인하세요:</p>
<ul>
<li>Python 3.7 이상 버전 설치.</li>
<li>아래 나열된 검증된 운영 체제 중 하나 사용:<ul>
<li>Ubuntu &gt;= 18.04(x86_64)</li>
<li>CentOS &gt;= 7.0(x86_64)</li>
<li>MacOS &gt;= 11.0(Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>참고</strong>:</p>
<ol>
<li>Milvus Lite는 <code translate="no">manylinux2014</code> 을 기본 이미지로 사용하므로 Linux 사용자를 위해 대부분의 Linux 배포판과 호환됩니다.</li>
<li>아직 완전히 검증되지는 않았지만 Windows에서도 Milvus Lite를 실행할 수 있습니다.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Milvus Lite 설치</h3><p>Milvus Lite는 PyPI에서 사용할 수 있으므로 <code translate="no">pip</code> 을 통해 설치할 수 있습니다.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>다음과 같이 PyMilvus를 사용하여 설치할 수도 있습니다:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Milvus Lite 사용 및 시작</h3><p>프로젝트 저장소의 예제 폴더에서 <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">예제 노트북을</a> 다운로드합니다. Milvus Lite를 사용할 수 있는 두 가지 옵션이 있습니다: Python 라이브러리로 가져오거나 CLI를 사용해 컴퓨터에서 독립형 서버로 실행하는 것입니다.</p>
<ul>
<li>Milvus Lite를 Python 모듈로 시작하려면 다음 명령을 실행하세요:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus Lite를 일시 중단하거나 중지하려면 <code translate="no">with</code> 문을 사용합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>CLI 기반 독립 실행형 서버로 Milvus Lite를 시작하려면 다음 명령을 실행합니다:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Lite를 시작한 후 PyMilvus 또는 원하는 다른 도구를 사용하여 독립형 서버에 연결할 수 있습니다.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">디버그 모드에서 Milvus Lite 시작하기</h3><ul>
<li>디버그 모드에서 Milvus Lite를 Python 모듈로 실행하려면 다음 명령을 실행하세요:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>독립 실행형 서버를 디버그 모드로 실행하려면 다음 명령을 실행합니다:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">데이터 및 로그 유지</h3><ul>
<li>모든 관련 데이터와 로그를 포함할 Milvus Lite용 로컬 디렉터리를 만들려면 다음 명령을 실행합니다:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>독립형 서버에서 생성된 모든 데이터와 로그를 로컬 드라이브에 유지하려면 다음 명령을 실행합니다:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Milvus Lite 구성</h3><p>Milvus Lite 구성은 Python API 또는 CLI를 사용하여 Milvus 인스턴스를 설정하는 것과 유사합니다.</p>
<ul>
<li>Python API를 사용하여 Milvus Lite를 구성하려면 기본 설정과 추가 설정 모두에 <code translate="no">MilvusServer</code> 인스턴스의 <code translate="no">config.set</code> API를 사용합니다:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>CLI를 사용하여 Milvus Lite를 구성하려면 기본 설정의 경우 다음 명령을 실행합니다:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>또는 추가 설정의 경우 다음을 실행합니다.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>구성 가능한 모든 항목은 Milvus 패키지와 함께 제공되는 <code translate="no">config.yaml</code> 템플릿에 있습니다.</p>
<p>Milvus Lite 설치 및 구성 방법에 대한 자세한 기술 정보는 <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">문서를</a> 참조하세요.</p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite는 Milvus의 기능을 컴팩트한 형식으로 원하는 사용자에게 탁월한 선택입니다. 연구자, 개발자 또는 데이터 과학자라면 이 옵션을 살펴볼 가치가 있습니다.</p>
<p>밀버스 라이트는 또한 오픈 소스 커뮤니티의 훌륭한 추가 기능으로, 기여자들의 뛰어난 작업을 보여줍니다. 빈 지의 노력 덕분에 이제 더 많은 사용자가 Milvus를 사용할 수 있게 되었습니다. 앞으로 빈지를 비롯한 Milvus 커뮤니티의 다른 구성원들이 어떤 혁신적인 아이디어를 내놓을지 기대가 됩니다.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">계속 연락주세요!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 설치 또는 사용에 문제가 발생하면 <a href="https://github.com/milvus-io/milvus-lite/issues/new">여기에서 문제를</a> 제기하거나 <a href="https://twitter.com/milvusio">트위터</a> 또는 <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의하실 수 있습니다. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 전체 커뮤니티와 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 근무 시간을</a> 확인해 보세요!</p>
