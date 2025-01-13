---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Milvus에 기여하는 방법: 개발자를 위한 빠른 시작하기'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus는</strong></a> 고차원 벡터 데이터를 관리하도록 설계된 오픈 소스 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스입니다</a>. 지능형 검색 엔진, 추천 시스템 또는 검색 증강 세대<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>와 같은 차세대 AI 솔루션을 구축할 때 Milvus는 손끝에서 사용할 수 있는 강력한 도구입니다.</p>
<p>하지만 Milvus를 진정으로 발전시키는 것은 첨단 기술뿐만 아니라 그 뒤에 있는 활기차고 열정적인 <a href="https://zilliz.com/community">개발자 커뮤니티입니다</a>. 오픈 소스 프로젝트인 Milvus는 여러분과 같은 개발자의 기여 덕분에 번창하고 발전하고 있습니다. 커뮤니티의 모든 버그 수정, 기능 추가, 성능 향상은 Milvus의 속도와 확장성, 안정성을 더욱 향상시킵니다.</p>
<p>오픈소스에 대한 열정이 있거나, 배우고자 하는 열망이 있거나, AI에 지속적인 영향을 미치고 싶다면 Milvus는 기여하기에 완벽한 곳입니다. 이 가이드는 개발 환경 설정부터 첫 풀 리퀘스트 제출까지 모든 과정을 안내합니다. 또한 직면할 수 있는 일반적인 문제를 강조하고 이를 극복하기 위한 솔루션도 제공합니다.</p>
<p>시작할 준비가 되셨나요? 함께 Milvus를 더욱 개선해 보세요!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Milvus 개발 환경 설정하기<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>가장 먼저 해야 할 일은 개발 환경을 설정하는 것입니다. Milvus를 로컬 컴퓨터에 설치하거나 Docker를 사용할 수 있습니다. 두 방법 모두 간단하지만 모든 것을 실행하려면 몇 가지 서드파티 종속성을 설치해야 합니다.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">로컬에서 Milvus 구축하기</h3><p>처음부터 무언가를 구축하는 것을 좋아한다면 로컬 머신에서 Milvus를 쉽게 구축할 수 있습니다. Milvus는 <code translate="no">install_deps.sh</code> 스크립트에 모든 종속성을 번들링하여 쉽게 만들 수 있습니다. 다음은 빠른 설정입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Docker로 Milvus 빌드하기</h3><p>미리 빌드된 컨테이너에서 명령을 실행하거나 개발 컨테이너를 스핀업하여 보다 실무적인 접근 방식을 사용하는 두 가지 방법이 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>플랫폼 참고 사항:</strong> Linux를 사용하는 경우 컴파일 문제가 거의 발생하지 않습니다. 하지만 Mac 사용자, 특히 M1 칩을 사용하는 경우 컴파일 과정에서 몇 가지 문제가 발생할 수 있습니다. 하지만 걱정하지 마세요. 가장 일반적인 문제를 해결하는 데 도움이 되는 가이드가 있으니까요.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: OS 구성</em></p>
<p>전체 설정 가이드는 공식 <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus 개발 가이드에서</a> 확인하세요.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">일반적인 문제와 해결 방법</h3><p>때때로 Milvus 개발 환경 설정이 계획대로 원활하게 진행되지 않을 수 있습니다. 걱정하지 마세요. 일반적인 문제와 이를 빠르게 해결하는 방법을 간략하게 정리해 보았습니다.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">홈브루: 사이드밴드 패킷을 읽는 동안 예기치 않은 연결 해제</h4><p>Homebrew를 사용 중인데 다음과 같은 오류가 발생하면 다음과 같이 해결하세요:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>해결 방법:</strong> <code translate="no">http.postBuffer</code> 크기를 늘립니다:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Homebrew를 설치한 후에도 <code translate="no">Brew: command not found</code> 오류가 발생하면 Git 사용자 구성을 설정해야 할 수 있습니다:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: 자격 증명 가져오기 오류</h4><p>Docker로 작업할 때 이 오류가 표시될 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>수정하세요:</strong><code translate="no">~/.docker/config.json</code> 을 열고 <code translate="no">credsStore</code> 필드를 제거하세요.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: 'imp'라는 이름의 모듈 없음</h4><p>Python에서 이 오류가 발생하는 경우 Python 3.12에서 일부 이전 종속성에서 여전히 사용하는 <code translate="no">imp</code> 모듈이 제거되었기 때문입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>수정하세요:</strong> Python 3.11로 다운그레이드하세요:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">코난: 인식할 수 없는 인수 또는 명령을 찾을 수 없음</h4><p><strong>문제:</strong> <code translate="no">Unrecognized arguments: --install-folder conan</code> 이 표시되면 호환되지 않는 코난 버전을 사용하고 있을 가능성이 높습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>수정:</strong> 코난 1.61로 다운그레이드하세요:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>문제:</strong> <code translate="no">Conan command not found</code> 이 표시되면 Python 환경이 제대로 설정되지 않은 것입니다.</p>
<p><strong>수정:</strong> 파이썬의 bin 디렉터리를 <code translate="no">PATH</code> 에 추가하세요:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM에 추가하세요: 선언되지 않은 식별자 'kSecFormatOpenSSL' 사용</h4><p>이 오류는 일반적으로 LLVM 종속성이 오래되었음을 의미합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>해결 방법:</strong> 해결 방법: LLVM 15를 재설치하고 환경 변수를 업데이트하세요:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>전문가 팁</strong></p>
<ul>
<li><p>항상 도구 버전과 종속성을 다시 확인하세요.</p></li>
<li><p>그래도 문제가 해결되지 않는다면<a href="https://github.com/milvus-io/milvus/issues"> Milvus GitHub 이슈 페이지에서</a> 답변을 찾거나 도움을 요청하세요.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">C++와 Go 통합을 위한 VS 코드 구성하기</h3><p>VS Code에서 C++와 Go를 함께 사용하는 것은 생각보다 쉽습니다. 올바른 설정으로 Milvus의 개발 프로세스를 간소화할 수 있습니다. 아래 구성으로 <code translate="no">user.settings</code> 파일을 조정하기만 하면 됩니다:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>이 구성의 기능은 다음과 같습니다:</p>
<ul>
<li><p><strong>환경 변수:</strong> 빌드 및 테스트 중 라이브러리를 찾는 데 중요한 <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, <code translate="no">RPATH</code> 의 경로를 설정합니다.</p></li>
<li><p><strong>Go 도구 통합:</strong> Go의 언어 서버(<code translate="no">gopls</code>)를 활성화하고 서식 지정용 <code translate="no">gofumpt</code> 및 린팅용 <code translate="no">golangci-lint</code> 등의 도구를 구성합니다.</p></li>
<li><p><strong>테스트 설정:</strong> <code translate="no">testTags</code> 을 추가하고 테스트 실행 시간 제한을 10분으로 늘립니다.</p></li>
</ul>
<p>이 설정이 추가되면 C++와 Go 워크플로 간의 원활한 통합을 보장합니다. 지속적인 환경 조정 없이 Milvus를 빌드하고 테스트하는 데 적합합니다.</p>
<p><strong>전문가 팁</strong></p>
<p>설정 후 빠른 테스트 빌드를 실행하여 모든 것이 제대로 작동하는지 확인하세요. 뭔가 이상하다고 느껴지면 경로와 VS Code의 Go 확장 버전을 다시 확인하세요.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Milvus 배포<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 <a href="https://milvus.io/docs/install-overview.md">라이트</a><strong>, 독립형</strong>, <strong>배포의</strong> <a href="https://milvus.io/docs/install-overview.md">세 가지 배포 모드를</a>지원합니다 <strong>.</strong></p>
<ul>
<li><p>Milvus<a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Lite는</strong></a> Python 라이브러리이자 초경량 버전의 Milvus입니다. Python 또는 노트북 환경에서의 신속한 프로토타이핑과 소규모 로컬 실험에 적합합니다.</p></li>
<li><p>Milvus<strong>Standalone은</strong> 클라이언트-서버 모델을 사용하는 Milvus의 단일 노드 배포 옵션입니다. Milvus는 MySQL에 해당하며, Milvus Lite는 SQLite와 유사합니다.</p></li>
<li><p>Milvus<strong>Distributed는</strong> 대규모 벡터 데이터베이스 시스템이나 벡터 데이터 플랫폼을 구축하는 기업 사용자에게 이상적인 Milvus의 분산 모드입니다.</p></li>
</ul>
<p>이 모든 배포는 세 가지 핵심 구성 요소에 의존합니다:</p>
<ul>
<li><p><strong>Milvus:</strong> 모든 작업을 구동하는 벡터 데이터베이스 엔진.</p></li>
<li><p><strong>Etcd:</strong> Milvus의 내부 메타데이터를 관리하는 메타데이터 엔진.</p></li>
<li><p><strong>MinIO:</strong> 데이터 지속성을 보장하는 스토리지 엔진.</p></li>
</ul>
<p><strong>분산</strong> 모드에서 실행할 경우, Milvus는 Pub/Sub 메커니즘을 사용하여 분산 메시지 처리를 위한 <strong>Pulsar를</strong> 통합하여 처리량이 많은 환경에 맞게 확장할 수 있습니다.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus 독립형</h3><p>스탠드얼론 모드는 단일 인스턴스 설정에 맞게 조정되어 테스트 및 소규모 애플리케이션에 적합합니다. 시작하는 방법은 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus 분산(이전의 Milvus 클러스터)</h3><p>대규모 데이터 세트와 트래픽이 많은 경우, 분산 모드는 수평적 확장성을 제공합니다. 이 모드는 여러 Milvus 인스턴스를 하나의 응집력 있는 시스템으로 결합합니다. Kubernetes에서 실행되며 전체 Milvus 스택을 관리하는 <strong>Milvus Operator를</strong> 사용하면 배포가 쉬워집니다.</p>
<p>단계별 안내가 필요하신가요? <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus 설치 가이드를</a> 확인하세요.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">엔드투엔드(E2E) 테스트 실행하기<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 배포가 실행되고 나면 E2E 테스트를 통해 간편하게 기능을 테스트할 수 있습니다. 이러한 테스트는 설정의 모든 부분을 포괄하여 모든 것이 예상대로 작동하는지 확인합니다. 테스트 실행 방법은 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>자세한 지침과 문제 해결 팁은 <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus 개발 가이드를</a> 참조하세요.</p>
<p><strong>전문가 팁</strong></p>
<p>Milvus를 처음 사용하는 경우, 프로덕션 수준의 워크로드를 위한 분산 모드로 확장하기 전에 Milvus Lite 또는 독립 실행형 모드로 시작하여 기능을 익히세요.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">코드 제출하기<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>축하합니다! 모든 단위 및 E2E 테스트를 완료(또는 필요에 따라 디버깅 및 재컴파일)하셨군요. 첫 번째 빌드에는 다소 시간이 걸릴 수 있지만 향후 빌드는 훨씬 빨라질 것이므로 걱정할 필요가 없습니다. 모든 것이 통과되면 변경 사항을 제출하고 Milvus에 기여할 준비가 된 것입니다!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">풀 리퀘스트(PR)를 이슈에 연결하기</h3><p>Milvus에 대한 모든 PR은 관련 이슈에 연결되어야 합니다. 이를 처리하는 방법은 다음과 같습니다:</p>
<ul>
<li><p><strong>기존 이슈를 확인합니다:</strong><a href="https://github.com/milvus-io/milvus/issues"> Milvus 이슈 트래커를</a> 살펴보고 변경 사항과 관련된 이슈가 이미 있는지 확인하세요.</p></li>
<li><p><strong>새 이슈를 만듭니다:</strong> 관련 이슈가 없는 경우 새 이슈를 열고 해결 중인 문제 또는 추가하려는 기능을 설명하세요.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">코드 제출하기</h3><ol>
<li><p><strong>리포지토리 포크:</strong><a href="https://github.com/milvus-io/milvus"> Milvus</a> 리포지토리를 GitHub 계정으로 포크하여 시작하세요.</p></li>
<li><p><strong>브랜치 만들기:</strong> 로컬에서 포크를 복제하고 변경 사항을 위한 새 브랜치를 만듭니다.</p></li>
<li><p><strong>서명된 서명으로 커밋하기:</strong> 커밋에 <code translate="no">Signed-off-by</code> 서명이 포함되어 오픈 소스 라이선스를 준수하는지 확인하세요:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>이 단계는 여러분의 기여가 개발자 출처 인증서(DCO)에 부합함을 인증합니다.</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>유용한 리소스</strong></h4><p>자세한 단계와 모범 사례는<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvus 기여 가이드를</a> 참조하세요.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">기여 기회<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 설치 및 실행하신 것을 축하드립니다! 배포 모드를 살펴보고, 테스트를 실행하고, 코드를 자세히 살펴보기도 하셨을 것입니다. 이제 레벨 업을 할 차례입니다. <a href="https://github.com/milvus-io/milvus">Milvus에</a> 기여하여 AI와 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터의</a> 미래를 만드는 데 도움을 주세요.</p>
<p>Milvus 커뮤니티에는 여러분의 스킬셋에 상관없이 여러분을 위한 자리가 있습니다! 복잡한 문제를 해결하는 것을 좋아하는 개발자든, 깔끔한 문서나 엔지니어링 블로그를 작성하는 것을 좋아하는 기술 작가든, 배포를 개선하고자 하는 Kubernetes 애호가든, 여러분이 영향력을 발휘할 수 있는 방법이 있습니다.</p>
<p>아래의 기회를 살펴보고 자신에게 딱 맞는 기회를 찾아보세요. 모든 기여는 Milvus를 발전시키는 데 도움이 되며, 누가 알겠어요? 여러분의 다음 풀리퀘스트가 다음 혁신의 물결에 힘을 실어줄지도 모릅니다. 무엇을 망설이고 계신가요? 지금 바로 시작하세요! 🚀</p>
<table>
<thead>
<tr><th>프로젝트</th><th>적합한 대상</th><th>가이드라인</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">MILVUS</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">MILVUS-SDK-GO</a></td><td>Go 개발자</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP 개발자</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>다른 언어에 관심이 있는 개발자</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">파이밀버스에 기여하기</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>쿠버네티스 애호가</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">밀버스-독스</a>, <a href="https://github.com/milvus-io/community">밀버스-io/커뮤니티/블로그</a></td><td>기술 작가</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">밀버스 문서에 기여하기</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">밀버스-인사이트</a></td><td>웹 개발자</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">마지막 한마디<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 간편하게 빌드를 시작할 수 있는 Python(PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a>, <a href="https://milvus.io/docs/install-node.md">Node.js</a>등 다양한 <a href="https://milvus.io/docs/install-pymilvus.md">SDK를</a> 제공합니다. Milvus에 기여하는 것은 단순히 코드를 제공하는 것뿐만 아니라 활기차고 혁신적인 커뮤니티에 참여하는 것입니다.</p>
<p>Milvus 개발자 커뮤니티에 오신 것을 환영하며 즐거운 코딩을 즐겨보세요! 여러분들이 어떤 결과물을 만들어낼지 기대됩니다.</p>
<h2 id="Further-Reading" class="common-anchor-header">더 읽어보기<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Milvus AI 개발자 커뮤니티 가입하기</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스란 무엇이며 어떻게 작동하나요?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite 대 독립형 대 분산형: 어떤 모드가 나에게 적합할까요? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Milvus로 AI 앱 구축하기: 튜토리얼 및 노트북</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">GenAI 앱을 위한 최고 성능의 AI 모델 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG란 무엇인가요?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">생성적 AI 리소스 허브 | 질리즈</a></p></li>
</ul>
