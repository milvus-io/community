---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: vLLM 語意路由器 + Milvus：語意路由和快取如何以聰明的方式建立可擴充的 AI 系統
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: 瞭解 vLLM、Milvus 和語意路由如何優化大型模型推論、降低運算成本，以及在可擴充部署中提升 AI 效能。
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>大多數的 AI 應用程式都依賴單一模型來處理每個要求。但這種方法很快就會遇到限制。大型模型功能強大但成本高昂，即使用於簡單的查詢也是如此。小型模型更便宜、更快速，但無法處理複雜的推理。當流量激增時，例如您的 AI 應用程式突然在一夜之間擁有上千萬使用者，這種單一模型適用於所有設定的低效率就顯得非常痛苦。延遲飆升、GPU 開支爆炸，昨天還運作良好的模型開始喘不過氣來。</p>
<p>而我的朋友，<em>您</em>，這個應用程式背後的工程師，必須快速解決問題。</p>
<p>想像一下部署多個不同大小的模型，並讓您的系統自動為每個要求選擇最佳的模型。簡單的提示會轉到較小的機型；複雜的查詢則會轉到較大的機型。這就是<a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router</strong></a>背後的理念<a href="https://github.com/vllm-project/semantic-router"><strong>-</strong></a>根據意義而非端點來引導請求的路由機制。它會分析每項輸入的語意內容、複雜性和意圖，以選擇最適合的語言模型，確保每項查詢都由最適合的模型處理。</p>
<p>為了更有效率，Semantic Router 與<a href="https://milvus.io/"><strong>Milvus</strong></a> 搭配使用，<a href="https://milvus.io/"><strong>Milvus</strong></a> 是一個開放原始碼向量資料庫，可作為<strong>語意快取層</strong>。在重新計算回應之前，它會檢查是否已經處理過語意相似的查詢，如果發現，就會立即擷取快取結果。結果是：回應速度更快、成本更低、擷取系統能智慧地擴充而非浪費。</p>
<p>在本篇文章中，我們將深入探討<strong>vLLM Semantic Router</strong>的運作方式、<strong>Milvus</strong>如何為其快取層提供動力，以及此架構如何應用於實際的 AI 應用程式。</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">什麼是語意路由器？<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>語意路由器</strong>（<strong>Semantic Router</strong>）的核心是一個系統，它可以根據特定請求的意義、複雜性和意圖來決定<em>哪個模型</em>應該處理該請求。它不是將所有內容路由到一個模型，而是將請求智能地分配到多個模型，以平衡精確度、延遲和成本。</p>
<p>在架構上，它建構在三個關鍵層上：<strong>語意路由</strong> <strong>層</strong> <strong>(</strong> <strong>Semantic Routing</strong> <strong>)</strong>、<strong>模型混合層 (Mixture of Models, MoM)</strong> 以及<strong>快取層 (Cache Layer</strong>)。</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">語意路由層</h3><p><strong>語意路由層</strong>是系統的大腦。它會分析每個輸入--它在詢問什麼、有多複雜、需要哪一種推理--以選擇最適合該工作的模型。例如，一個簡單的事實查詢可能會轉到一個輕量級的模型，而一個多步驟的推理查詢則會轉到一個較大的模型。即使流量和查詢多樣性增加，這種動態路由也能保持系統的回應能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">混合模型 (MoM) 層</h3><p>第二層是混合<strong>模型 (MoM)</strong>，它將不同大小和功能的多種模型整合到一個統一的系統中。它的靈感來自<a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong>架構，但不是在單一大型模型中挑選「專家」，而是在多個獨立模型中運作。此設計可減少延遲、降低成本，並避免被鎖定在任何單一模型供應商。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">快取層：Milvus 的與眾不同之處</h3><p>最後，由<a href="https://milvus.io/">Milvus Vector Database 驅動</a>的<strong>快取層</strong> <a href="https://milvus.io/">扮演</a>系統記憶體的角色。在執行新的查詢之前，它會檢查之前是否處理過語意相似的請求。如果是，它會立即擷取快取結果，節省運算時間並提昇吞吐量。</p>
<p>傳統的快取記憶體系統依賴於記憶體中的鍵值儲存，透過精確的字串或模板來匹配請求。當查詢是重複且可預測時，這種方式很有效。但真正的使用者很少會把相同的東西輸入兩次。一旦措辭發生變化，即使是輕微的變化，快取記憶體也無法識別為相同的意圖。久而久之，快取的命中率就會下降，而效能的提升也會因為語言的自然偏移而消失。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為了解決這個問題，我們需要能夠理解<em>意思</em>的快取，而不只是匹配字詞。這就是<strong>語意檢索的</strong>用武之地。語義檢索不是比較字串，而是比較內嵌--捕捉語義相似性的高維向量表示。但挑戰在於規模。在單一機器上對數百萬或數十億向量進行粗暴搜尋（時間複雜度為 O(N-d)），在計算上是非常昂貴的。記憶體成本會爆炸，水平擴充性也會崩潰，而且系統也很難處理突發的流量尖峰或長尾查詢。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus</strong>是專為大規模語意搜尋而設計的分散式向量資料庫，可提供快取層所需的水平擴充能力與容錯能力。它可以跨節點有效率地儲存嵌入資料，即使在大規模的情況下，也能以最低的延遲執行<a href="https://zilliz.com/blog/ANN-machine-learning">近似最近鄰</a>(ANN) 搜尋。有了正確的相似性臨界值和備援策略，Milvus 可確保穩定、可預測的效能，讓快取層成為整個路由系統的彈性語意記憶體。</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">開發人員如何在生產中使用 Semantic Router + Milvus<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>vLLM Semantic Router</strong>和<strong>Milvus</strong>的組合在速度、成本和可重用性都非常重要的實際生產環境中大放異采。</p>
<p>其中有三種常見的應用場景：</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1.客戶服務問答</h3><p>面向客戶的機器人每天都要處理大量重複的查詢 - 密碼重設、帳號更新、遞送狀態。這個領域對成本和延遲都很敏感，因此非常適合語意路由。路由器會將例行問題傳送給較小、速度較快的模型，並將複雜或含糊不清的問題升級到較大的模型進行更深入的推理。同時，Milvus 會快取先前的問答對，因此當類似的查詢出現時，系統可以立即重複使用過去的答案，而不是重新產生。</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2.程式碼輔助</h3><p>在開發者工具或 IDE 輔助工具中，許多查詢都會重疊 - 順序幫助、API 查詢、小型除錯提示。透過分析每個提示的語意結構，路由器可動態選擇適當的模型大小：簡單任務使用輕量級模型，多步驟推理則使用能力更強的模型。Milvus 透過快取相似的編碼問題及其解決方案，將先前的使用者互動變成可重用的知識庫，進一步提升回應能力。</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3.企業知識庫</h3><p>企業查詢往往會隨著時間重複進行-政策查詢、合規性參考、產品常見問題。使用 Milvus 作為語意快取層，可以有效地儲存和檢索常見問題及其答案。這可將冗餘計算減至最少，同時保持跨部門和跨區域回應的一致性。</p>
<p>在引擎蓋下，<strong>Semantic Router + Milvus</strong>管道採用<strong>Go</strong>和<strong>Rust</strong>實作，以提供高效能和低延遲。它集成在閘道層，可持續監控關鍵指標（如命中率、路由延遲和模型性能），以便實時微調路由策略。</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">如何在語意路由器中快速測試語意快取<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>在大规模部署语义缓存之前，验证其在受控设置中的表现是非常有用的。在本節中，我們將進行一次快速的本地測試，展示Semantic Router是如何將<strong>Milvus</strong>用作其語義快取的。您將看見相似的查詢是如何即時進入快取記憶體的，而新的或不同的查詢則會觸發模型生成--證明快取邏輯是如何運作的。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><ul>
<li>容器環境：Docker + Docker Compose</li>
<li>向量資料庫：Milvus 服務</li>
<li>LLM + 嵌入：專案下載於本機</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.部署Milvus向量資料庫</h3><p>下載部署檔案</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>啟動 Milvus 服務</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2.複製專案</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3.下載本機模型</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4.組態修改</h3><p>注意：將 semantic_cache 類型修改為 milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>修改 Mmilvus 配置 注意：填入剛部署的 Milvusmilvus 服務</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5.啟動專案</h3><p>注意：建議修改一些 Dockerfile 的依賴到國內來源</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6.測試請求</h3><p>注意：共兩個請求 (無快取和快取命中) 第一個請求：</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>第二次請求：</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>本測試展示了 Semantic Router 的語意快取功能。透過利用 Milvus 作為向量資料庫，它能夠有效地匹配語義類似的查詢，從而在用戶提出相同或類似的問題時改善回應時間。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著人工智慧工作負載的成長，成本最佳化變得非常重要，vLLM Semantic Router 與<a href="https://milvus.io/">Milvus</a>的結合提供了智慧型擴充的實用方法。透過將每個查詢路由到正確的模型，並使用分散式向量資料庫快取語義上相似的結果，此設定可減少計算開銷，同時在不同的使用個案中保持快速一致的回應。</p>
<p>簡而言之，您將得到更聰明的擴充 - 不需要蠻力，更需要智慧。</p>
<p>如果您想進一步探討這個問題，請加入我們<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>的對話，或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上開啟問題。您也可以預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours 課程</a>，由 Milvus 背後的團隊提供一對一的指導、見解和技術深究。</p>
