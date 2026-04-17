---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: 엔드투엔드 요청 추적을 위해 Milvus로 OpenTelemetry를 설정하는 방법
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  OpenTelemetry 추적을 통해 Milvus 벡터 데이터베이스 성능을 모니터링하세요. Docker 설정, Python 클라이언트, 예거
  시각화 및 디버깅 팁이 포함된 전체 자습서입니다.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스로</a> AI 기반 애플리케이션을 구축할 때, 애플리케이션이 확장됨에 따라 시스템 성능을 이해하는 것이 매우 중요해집니다. 단일 검색 요청이 여러 구성 요소에서 벡터 인덱싱, 유사성 계산, 데이터 검색 등 여러 내부 작업을 트리거할 수 있습니다. 적절한 통합 가시성이 없으면 속도 저하나 장애를 진단하는 것은 건초 더미에서 바늘을 찾는 것과 같습니다.</p>
<p><strong>분산 추적은</strong> 요청이 시스템을 통과할 때 추적하여 내부에서 어떤 일이 일어나고 있는지 완벽하게 파악함으로써 이 문제를 해결합니다.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry(OTEL)</strong></a> 는 애플리케이션에서 추적, 메트릭, 로그를 수집하는 데 도움이 되는 <a href="https://www.cncf.io/">CNCF(Cloud Native Computing Foundation)</a> 의 지원을 받는 오픈 소스 통합 가시성 프레임워크입니다. 벤더 중립적이며 널리 채택되고 있으며 널리 사용되는 모니터링 도구와 원활하게 작동합니다.</p>
<p>이 가이드에서는 AI 애플리케이션을 위해 구축된 고성능 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus에</strong></a> 엔드투엔드 추적을 추가하는 방법을 보여드립니다. 클라이언트 요청부터 내부 데이터베이스 작업까지 모든 것을 추적하여 성능 최적화와 디버깅을 훨씬 쉽게 하는 방법을 배우게 됩니다.</p>
<p>또한 <a href="https://github.com/jaegertracing/jaeger-ui"><strong>예거를</strong></a> 활용하여 추적 데이터를 시각화하여 벡터 데이터베이스 운영에 대한 강력한 인사이트를 제공합니다.</p>
<h2 id="What-Well-Build" class="common-anchor-header">구축할 내용<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>이 튜토리얼이 끝나면 다음과 같이 구성된 완전한 추적 파이프라인을 갖추게 됩니다:</p>
<ol>
<li><p>OpenTelemetry 추적이 활성화된<strong>Milvus 벡터 데이터베이스</strong> </p></li>
<li><p>트레이스 시각화 및 분석을 위한<strong>Jaeger</strong> </p></li>
<li><p>모든 Milvus 작업을 자동으로 추적하는<strong>Python 클라이언트</strong> </p></li>
<li><p>클라이언트 요청부터 데이터베이스 작업까지<strong>엔드투엔드 가시성</strong> 제공</p></li>
</ol>
<p>예상 설정 시간: 15~20분</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">빠른 시작(5분)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 작동하는 것을 보고 싶으신가요? 가장 빠른 방법은 다음과 같습니다:</p>
<ol>
<li>데모 리포지토리를 복제하세요:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>서비스를 시작합니다:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>30초 기다린 다음 예거 UI를 확인합니다: <code translate="no">http://localhost:16686</code></p></li>
<li><p>Python 예제를 실행합니다:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>예거를 새로고침하고 <code translate="no">standalone</code> (Milvus) 및 <code translate="no">milvus-client</code> 서비스에서 흔적을 찾습니다.</li>
</ol>
<p>트레이스가 나타나면 모든 것이 작동하는 것입니다! 이제 이 모든 것이 어떻게 결합되는지 알아봅시다.</p>
<h2 id="Environment-Setup" class="common-anchor-header">환경 설정<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>필요한 것은 다음과 같습니다:</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (벡터 데이터베이스)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (트레이스 시각화)</p></li>
<li><p><strong>Python 3.7+</strong> (클라이언트 개발)</p></li>
<li><p><strong>Docker 및 Docker Compose</strong> (컨테이너 오케스트레이션)</p></li>
</ul>
<p>이 버전들은 함께 테스트되었지만, 최신 버전에서도 정상적으로 작동합니다.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Milvus 및 Jaeger 설정하기<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>적절한 네트워킹 및 구성으로 두 서비스를 실행하기 위해 Docker Compose를 사용하겠습니다.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Docker Compose 구성</h3><p><code translate="no">docker-compose.yaml</code> 파일을 만듭니다:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>참고:</strong> 예제 구성 파일 <code translate="no">embedEtcd.yaml</code> 및 <code translate="no">milvus.yaml</code> 은 <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a> 에서 확인할 수 있습니다.</p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Milvus 추적 구성</h3><p>추적 구성으로 <code translate="no">configs/milvus.yaml</code> 을 생성합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>구성 설명:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> 모든 요청을 추적합니다(개발에는 유용하지만 프로덕션에서는 0.1 이하 사용).</p></li>
<li><p><code translate="no">secure: false</code> TLS 비활성화(프로덕션에서는 활성화)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> 내부 통신에 Docker 서비스 이름 사용</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">서비스 시작</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Milvus에서 Jaeger로 추적 전달 확인</h3><p>서비스가 실행되면 Milvus 독립형에서 추적 데이터가 전송되어 Jaeger에서 수신되는지 확인할 수 있습니다.</p>
<ul>
<li><p>브라우저를 열고 Jaeger UI를 방문합니다: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p><strong>검색</strong> 패널(왼쪽 상단)에서 <strong>서비스</strong> 드롭다운을 선택하고 <code translate="no">standalone</code> 을 선택합니다. 서비스 목록에 <code translate="no">standalone</code> 이 표시되면 Milvus의 기본 제공 OpenTelemetry 구성이 작동하고 있으며 추적 데이터를 Jaeger에 성공적으로 푸시했다는 의미입니다.</p></li>
<li><p><strong>트레이스 찾기를</strong> 클릭하여 내부 Milvus 구성 요소에서 생성된 트레이스 체인(예: 모듈 간 gRPC 상호 작용)을 탐색합니다.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">추적 데이터가 표시되지 않는 경우:</h3><ul>
<li><p><code translate="no">milvus.yaml</code> 의 <code translate="no">trace</code> 블록이 올바르게 구성되었는지, 예거가 문제 없이 실행되고 있는지 다시 확인하세요.</p></li>
<li><p>Milvus 컨테이너 로그를 검사하여 추적 초기화와 관련된 오류가 있는지 확인합니다.</p></li>
<li><p>추적 보고가 잠시 지연될 수 있으므로 몇 초간 기다렸다가 Jaeger UI를 새로고침하세요.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Python 클라이언트 설정 및 종속성<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 모든 Milvus 작업을 자동으로 추적하도록 Python 클라이언트를 설정해 보겠습니다.</p>
<p>먼저 <code translate="no">requirements.txt</code> 파일을 생성합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 다음을 통해 종속성을 설치합니다:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>이렇게 하면 Python 환경이 Milvus 백엔드에 대한 gRPC 호출을 추적할 수 있는 준비가 완료됩니다.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Python에서 OpenTelemetry 초기화하기<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Python 애플리케이션 내에서 추적을 구성해 보겠습니다. 이 스니펫은 gRPC 계측으로 OTEL을 설정하고 추적기를 준비합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>여기서 <code translate="no">GrpcInstrumentorClient()</code> 은 기본 gRPC 스택에 연결되므로 계측을 위해 클라이언트 코드를 수동으로 수정할 필요가 없습니다. <code translate="no">OTLPSpanExporter()</code> 은 로컬 예거 인스턴스로 추적 데이터를 전송하도록 구성됩니다.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">추적을 사용한 완전한 Milvus Python 예제 만들기<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 실제 Milvus 작업을 통해 추적을 시연하는 포괄적인 예제를 만들어 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">추적 출력 보기<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Python 클라이언트가 추적 데이터를 전송하면 Jaeger로 돌아갑니다: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p><code translate="no">milvus-client</code> 서비스를 선택하여 Python 클라이언트의 Milvus 연산에 해당하는 추적 스팬을 확인합니다. 이렇게 하면 시스템 경계를 넘어 성능을 분석하고 상호 작용을 추적하기가 훨씬 쉬워집니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">다른 언어의 예제<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Python 외에도 다른 언어로 Milvus 추적을 구현할 수 있습니다:</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>: 제로 코드 계측을 위해 OpenTelemetry Java 에이전트 <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go를</strong></a> 사용하세요: 기본 통합을 위해 OpenTelemetry Go SDK를 활용하세요 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: JavaScript SDK로 gRPC 호출 자동 계측</p>
<p>각 예제는 유사한 패턴을 따르지만 언어별 OpenTelemetry 라이브러리를 사용합니다.</p>
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
    </button></h2><p>Milvus 작업에 대한 엔드투엔드 추적을 성공적으로 구현했습니다! 달성한 내용은 다음과 같습니다:</p>
<ul>
<li><p>✅ <strong>인프라</strong>: 적절한 네트워킹으로 Milvus와 Jaeger를 설정했습니다.</p></li>
<li><p>✅ <strong>서버 측 추적</strong>: 자동으로 추적을 내보내도록 Milvus 구성</p></li>
<li><p>✅ <strong>클라이언트 측 추적</strong>: OpenTelemetry를 사용한 계측된 Python 클라이언트</p></li>
<li><p>✅ <strong>시각화</strong>: 예거를 사용하여 시스템 성능 분석</p></li>
<li><p>✅ <strong>프로덕션 준비</strong>: 구성 모범 사례 학습</p></li>
</ul>
<p>Milvus SDK 소스 코드를 변경하지 않고도 모두 작동합니다. 몇 가지 구성 설정만 하면 추적 파이프라인이 간단하고 효과적이며 프로덕션에 바로 사용할 수 있습니다.</p>
<p>로그와 메트릭을 통합하여 AI 네이티브 벡터 데이터베이스 배포를 위한 완벽한 모니터링 솔루션을 구축하면 한 단계 더 발전할 수 있습니다.</p>
<h2 id="Learn-More" class="common-anchor-header">자세히 알아보기<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Milvus 설명서: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>Python용 OpenTelemetry: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>예거 설명서: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Milvus OpenTelemetry 통합 데모(Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
