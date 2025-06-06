---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: 如何使用 Milvus 設定 OpenTelemetry 以進行端對端要求追蹤
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  使用 OpenTelemetry 追踪功能監控 Milvus 向量資料庫效能。完整的教學包含 Docker 設定、Python 用戶端、Jaeger
  可視化和除錯技巧。
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
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>當使用<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫</a>建立人工智能驅動的應用程式時，隨著應用程式的擴充，了解系統效能變得非常重要。單一搜尋請求可能會觸發跨越不同元件的多個內部作業 - 向量索引、相似性計算和資料擷取。如果沒有適當的可觀察性，診斷速度變慢或故障就像大海撈針。</p>
<p><strong>分散式追蹤</strong>解決了這個問題，當請求流經系統時會被追蹤，讓您完整地了解引擎蓋下發生了什麼事。</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a>是由<a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a>支持的開放<a href="https://www.cncf.io/">原始</a>碼可觀察性框架，可協助您從應用程式中收集軌跡、度量指標和日誌。它不受供應商影響，被廣泛採用，並可與常用的監控工具無縫配合。</p>
<p>在本指南中，我們將教您如何將端對端追蹤功能新增至<a href="https://milvus.io/"><strong>Milvus</strong></a>，這是專為 AI 應用程式打造的高效能向量資料庫。您將學會追蹤從客戶端請求到內部資料庫作業的一切，讓效能最佳化和除錯變得更容易。</p>
<p>我們也會使用<a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a>來視覺化追蹤資料，讓您對向量資料庫的作業有更深入的了解。</p>
<h2 id="What-Well-Build" class="common-anchor-header">我們要建立什麼<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>本教學結束時，您將擁有一個完整的追蹤管道，包括</p>
<ol>
<li><p>啟用OpenTelemetry追蹤的<strong>Milvus向量資料庫</strong></p></li>
<li><p>用於追蹤可視化和分析的<strong>Jaeger</strong></p></li>
<li><p>可自動追蹤所有 Milvus 作業的<strong>Python 用戶端</strong></p></li>
<li><p>從客戶<strong>端</strong>要求到資料庫運作的<strong>端對端可視性</strong></p></li>
</ol>
<p>預計設定時間：15-20 分鐘</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">快速啟動 (5 分鐘)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>想先看看它的運作嗎？這裡是最快的路徑：</p>
<ol>
<li>克隆演示資源庫：</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>啟動服務：</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>等待 30 秒，然後在 Jaeger UI 檢查：<code translate="no">http://localhost:16686</code></p></li>
<li><p>執行Python範例：</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>刷新 Jaeger 並尋找<code translate="no">standalone</code> (Milvus) 和<code translate="no">milvus-client</code> 服務的痕跡。</li>
</ol>
<p>如果看到蹤跡出現，就表示一切正常！現在讓我們來了解這一切是如何結合起來的。</p>
<h2 id="Environment-Setup" class="common-anchor-header">環境設定<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是您所需要的：</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong>(向量資料庫)</p></li>
<li><p><strong>Jaeger 1.46.0</strong>(軌跡可視化)</p></li>
<li><p><strong>Python 3.7+</strong>(用戶端開發)</p></li>
<li><p><strong>Docker 和 Docker Compose</strong>(容器協調)</p></li>
</ul>
<p>這些版本已經一起測試過；不過，較新的版本也應該可以正常運作。</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">設定 Milvus 和 Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>我們會使用 Docker Compose 以適當的網路和設定來執行這兩個服務。</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Docker Compose 配置</h3><p>建立<code translate="no">docker-compose.yaml</code> 檔案：</p>
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
<p><strong>注意：</strong>配置文件<code translate="no">embedEtcd.yaml</code> 和<code translate="no">milvus.yaml</code> 的範例可以在以下網址找到<a href="https://github.com/topikachu/milvus-py-otel">： https://github.com/topikachu/milvus-py-otel。</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Milvus 追蹤組態</h3><p>使用追蹤組態建立<code translate="no">configs/milvus.yaml</code> ：</p>
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
<p>配置說明：</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> 追蹤每個請求（對開發很有用，但在生產中使用 0.1 或更低的版本）</p></li>
<li><p><code translate="no">secure: false</code> 停用 TLS (在生產中啟用)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> 使用 Docker 服務名稱作為內部通訊</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">啟動服務</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">驗證從 Milvus 到 Jaeger 的追蹤傳輸</h3><p>一旦服務開始執行，您就可以驗證追蹤資料是否從 Milvus standalone 發出並由 Jaeger 接收。</p>
<ul>
<li><p>打開瀏覽器，訪問Jaeger UI：<code translate="no">http://localhost:16686/search</code></p></li>
<li><p>在<strong>Search</strong>面板（左上角），選擇<strong>Service（服務</strong>）下拉選項，然後選擇<code translate="no">standalone</code> 。如果您在服務清單中看到<code translate="no">standalone</code> ，這表示 Milvus 的內置 OpenTelemetry 配置正在工作，並已成功將跟蹤資料推送到 Jaeger。</p></li>
<li><p>點擊<strong>Find Traces</strong>探索由 Milvus 內部元件產生的追蹤鏈（例如模組間的 gRPC 互動）。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">如果沒有顯示追蹤資料</h3><ul>
<li><p>仔細檢查<code translate="no">milvus.yaml</code> 中的<code translate="no">trace</code> 區塊配置是否正確，以及 Jaeger 運行是否沒有問題。</p></li>
<li><p>檢查 Milvus 容器日誌，看看是否有與 Trace 初始化相關的錯誤。</p></li>
<li><p>等待幾秒鐘，刷新 Jaeger UI；追蹤報告可能會出現短暫延遲。</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Python 用戶端設定與相依性<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們設定 Python 用戶端，以自動追蹤所有 Milvus 作業。</p>
<p>首先，建立<code translate="no">requirements.txt</code> 檔案：</p>
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
<p>然後透過以下方式安裝相依性：</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>這可確保您的 Python 環境已準備好追蹤對 Milvus 後端的 gRPC 呼叫。</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">在 Python 中初始化 OpenTelemetry<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>現在，讓我們在 Python 應用程式中設定追蹤。此片段使用 gRPC instrumentation 設定 OTEL 並準備一個追蹤器。</p>
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
<p>在這裡，<code translate="no">GrpcInstrumentorClient()</code> 掛鉤到底層 gRPC 堆疊，因此您不需要手動修改用戶端程式碼來進行儀器化。<code translate="no">OTLPSpanExporter()</code> 已設定為傳送追蹤資料到您本機的 Jaeger 實例。</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">完整的 Milvus Python 追蹤範例<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們建立一個完整的範例，用實際的 Milvus 操作來示範追蹤：</p>
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
<h2 id="Viewing-Trace-Output" class="common-anchor-header">檢視追蹤輸出<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦你的Python用戶端發送了追蹤資料，返回到Jaeger： <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>選擇<code translate="no">milvus-client</code> 服務，檢視與您的 Python 用戶端 Milvus 操作對應的追蹤跨度。這讓分析效能和追蹤跨系統邊界的互動變得更容易。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">其他語言的範例<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>除了 Python 之外，您還可以用其他語言實作 Milvus 追蹤：</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>Java</strong></a>：使用 OpenTelemetry Java Agent 進行零程式碼監測<a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>：利用 OpenTelemetry Go SDK 進行本機整合 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>：使用 JavaScript SDK 自動儀器 gRPC 呼叫</p>
<p>每個範例都遵循類似的模式，但使用特定語言的 OpenTelemetry 函式庫。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>您已成功地實作 Milvus 作業的端對端追蹤！以下是您的成果：</p>
<ul>
<li><p>✅<strong>基礎架構</strong>：使用適當的網路設定 Milvus 和 Jaeger</p></li>
<li><p>✅<strong>伺服器端追蹤</strong>：設定 Milvus 自動匯出追蹤資料</p></li>
<li><p>✅<strong>客戶端追蹤</strong>：使用 OpenTelemetry 測量 Python 用戶端</p></li>
<li><p>✅<strong>可視化</strong>：使用 Jaeger 分析系統效能</p></li>
<li><p>✅<strong>生產準備</strong>：學習最佳配置實務</p></li>
</ul>
<p>所有工作都不需要修改 Milvus SDK 原始碼。只需要幾個組態設定，您的追蹤管道就可以啟用--簡單、有效，並已準備好投入生產。</p>
<p>您可以進一步整合日誌和指標，為您的 AI 原生向量資料庫部署建立完整的監控解決方案。</p>
<h2 id="Learn-More" class="common-anchor-header">瞭解更多<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Milvus 文件<a href="https://milvus.io/docs">：https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry for Python:<a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Jaeger 文件<a href="https://www.jaegertracing.io/docs/">: https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Milvus OpenTelemetry 整合示範 (Python):<a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
