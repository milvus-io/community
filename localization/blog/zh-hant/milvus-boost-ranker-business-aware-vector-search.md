---
id: milvus-boost-ranker-business-aware-vector-search.md
title: 如何使用 Milvus Boost Ranker 進行商業感知矢量搜尋
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: 瞭解 Milvus Boost Ranker 如何讓您在向量相似性之上建立業務規則 - 提升官方文件、降級陳舊內容、增加多樣性。
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>向量搜尋根據嵌入相似度來排列結果 - 向量越接近，結果越高。有些系統加入了基於模型的重新排序器 (BGE、Voyage、Cohere) 來改善排序。但這兩種方法都無法處理生產中的基本需求：<strong>業務情境與語意相關性同樣重要，有時甚至更重要。</strong></p>
<p>電子商務網站需要先顯示官方商店的庫存產品。內容平台則希望將最近的公告放在最前面。企業知識庫需要將權威文件放在最前面。當排名僅依賴向量距離時，這些規則就會被忽略。結果可能是相關的，但並不適當。</p>
<p><a href="https://milvus.io/intro">Milvus</a>2.6 中引入的<strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong> 可以解決這個問題。它可以讓您使用元資料規則調整搜尋結果的排名 - 不需要重建索引，也不需要改變模型。這篇文章涵蓋了它如何運作、何時使用，以及如何用程式碼實作。</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">什麼是 Boost Ranker？<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker 是 Milvus 2.6.2 中一個輕量級的、基於規則的重新排名功能</strong>，可以使用標量元資料欄位調整<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋結果</a>。與呼叫外部 LLM 或嵌入服務的基於模型的 reranker 不同，Boost Ranker 完全在 Milvus 內使用簡單的過濾與加權規則運作。沒有外部依賴，延遲開銷最小 - 適合即時使用。</p>
<p>您可以透過<a href="https://milvus.io/docs/manage-functions.md">Function API</a> 進行設定。向量搜尋傳回一組候選結果後，Boost Ranker 會應用三種操作：</p>
<ol>
<li><strong>過濾：</strong>找出符合特定條件的結果 (例如：<code translate="no">is_official == true</code>)</li>
<li><strong>Boost：</strong>將其分數乘以設定的權重</li>
<li><strong>洗牌：</strong>可選<strong>擇</strong>添加一個小的隨機因子 (0-1) 以引入多樣性</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">引擎蓋下的運作方式</h3><p>Boost Ranker 在 Milvus 內執行，作為後處理步驟：</p>
<ol>
<li><strong>向量搜尋</strong>- 每個區段都會傳回具有 ID、相似度分數和元資料的候選人。</li>
<li><strong>應用規則</strong>- 系統過濾匹配記錄，並使用配置的權重和可選的<code translate="no">random_score</code> 來調整它們的分數。</li>
<li><strong>合併與排序</strong>-<strong>合併</strong>所有候選人，並根據更新的分數重新排序，以產生最終的 Top-K 結果。</li>
</ol>
<p>由於 Boost Ranker 只會對已擷取的候選人進行操作，而非整個資料集，因此額外的計算成本可以忽略不计。</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">什麼時候應該使用 Boost Ranker？<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">提升重要結果</h3><p>最常見的使用案例：在語義搜尋上層疊加簡單的業務規則。</p>
<ul>
<li><strong>電子商務：</strong>推廣來自旗艦店、官方賣家或付費促銷的商品。將近期銷售額或點擊率高的商品推高。</li>
<li><strong>內容平台：</strong>透過<code translate="no">publish_time</code> 欄位優先處理最近發表的內容，或提升來自已驗證帳號的文章。</li>
<li><strong>企業搜尋：</strong>優先推送<code translate="no">doctype == &quot;policy&quot;</code> 或<code translate="no">is_canonical == true</code> 的文件。</li>
</ul>
<p>所有都可透過篩選器 + 權重進行設定。無需改變嵌入模型，無需重建索引。</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">降級而不移除</h3><p>Boost Ranker 也可以降低某些結果的排名 - 比硬過濾更柔和的替代方式。</p>
<ul>
<li><strong>低庫存產品：</strong>如果<code translate="no">stock &lt; 10</code> ，稍微降低其權重。仍然可以找到，但不會佔據頂部位置。</li>
<li><strong>敏感內容：</strong>降低標記內容的權重，而非完全移除。限制曝光率，但不會硬性審查。</li>
<li><strong>陳舊文件：</strong> <code translate="no">year &lt; 2020</code> 的文件會被降級，因此較新的內容會先出現。</li>
</ul>
<p>使用者仍可透過捲動或更精確的搜尋找到被降級的結果，但它們不會排擠更相關的內容。</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">使用受控制的隨機性增加多樣性</h3><p>當許多結果都有相似的分數時，Top-K 在不同的查詢中看起來就會完全相同。Boost Ranker 的<code translate="no">random_score</code> 參數引入了輕微的變化：</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>：控制整體的隨機性，以提高可重複性</li>
<li><code translate="no">field</code>：通常是主索引鍵<code translate="no">id</code> ，確保相同的記錄每次都得到相同的隨機值。</li>
</ul>
<p>這對於<strong>多樣化推薦</strong>(防止相同的項目總是出現在第一位) 和<strong>探索</strong>(結合固定的商業權重與小隨機擾動) 非常有用。</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">將 Boost Ranker 與其他排名器結合</h3><p>Boost Ranker 是透過 Function API 與<code translate="no">params.reranker = &quot;boost&quot;</code> 設定的。關於結合它，有兩點需要知道：</p>
<ul>
<li><strong>限制：</strong>在混合（多向量）搜索中，Boost Ranker 不能作為頂層排名器。但它可以用在每個個別的<code translate="no">AnnSearchRequest</code> 內，在合併之前調整結果。</li>
<li><strong>常見組合：</strong><ul>
<li><strong>RRF + Boost：</strong>使用 RRF 合併多模式結果，然後應用 Boost 來進行以元資料為基礎的微調。</li>
<li><strong>模型排序器 + Boost：</strong>使用基於模型的排序器進行語意品質，然後應用 Boost 進行業務規則。</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">如何設定 Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker 是透過 Function API 來設定的。若要更複雜的邏輯，請結合<code translate="no">FunctionScore</code> 來一起套用多個規則。</p>
<h3 id="Required-Fields" class="common-anchor-header">必填欄位</h3><p>建立<code translate="no">Function</code> 物件時：</p>
<ul>
<li><code translate="no">name</code>：任何自訂名稱</li>
<li><code translate="no">input_field_names</code>：必須是空列表<code translate="no">[]</code></li>
<li><code translate="no">function_type</code>：設定為<code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>：必須是<code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">關鍵參數</h3><p><strong><code translate="no">params.weight</code> (必填)</strong></p>
<p>應用於匹配記錄分數的乘數。如何設定取決於度量：</p>
<table>
<thead>
<tr><th>度量類型</th><th>提升結果</th><th>降低結果</th></tr>
</thead>
<tbody>
<tr><td>越高越好 (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>較低為佳 (L2/Euclidean)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (選用)</strong></p>
<p>選擇哪些記錄的分數會被調整的條件：</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>只有匹配的記錄會受到影響。其他所有記錄都會保持原始分數。</p>
<p><strong><code translate="no">params.random_score</code> (選用)</strong></p>
<p>為多樣性加入介於 0 和 1 之間的隨機值。詳情請參閱上述隨機性部分。</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">單一規則與多重規則</h3><p><strong>單一規則</strong>- 當您有一個業務約束 (例如，提升官方文件)，直接將排名器傳到<code translate="no">search(..., ranker=ranker)</code> 。</p>
<p><strong>多重規則</strong>- 當您需要數個約束 (優先處理庫存貨品 + 降級低評級產品 + 增加隨機性)，請建立多個<code translate="no">Function</code> 物件，並將它們與<code translate="no">FunctionScore</code> 結合。 您可以設定：</p>
<ul>
<li><code translate="no">boost_mode</code>：每個規則如何與原始分數結合 (<code translate="no">multiply</code> 或<code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>：多個規則如何互相結合 (<code translate="no">multiply</code> 或<code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">實作：優先處理官方文件<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們來看看一個具體的範例：讓官方文件在文件搜尋系統中排名較前。</p>
<h3 id="Schema" class="common-anchor-header">模式</h3><p>一個稱為<code translate="no">milvus_collection</code> 的集合，包含這些欄位：</p>
<table>
<thead>
<tr><th>欄位</th><th>欄位類型</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>主索引鍵</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>文件文字</td></tr>
<tr><td><code translate="no">embedding</code></td><td>浮動向量 (3072)</td><td>語意向量</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>來源：「官方」、「社群 」或 「票據」</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> 如果<code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p><code translate="no">source</code> 和<code translate="no">is_official</code> 欄位是 Boost Ranker 用來調整排名的元資料。</p>
<h3 id="Setup-Code" class="common-anchor-header">設定程式碼</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">比較結果：使用和不使用 Boost Ranker</h3><p>首先，在沒有 Boost Ranker 的情況下執行基線搜尋。然後將 Boost Ranker 加入<code translate="no">filter: is_official == true</code> 和<code translate="no">weight: 1.2</code> ，並進行比較。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">結果</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>主要的改變：文件<code translate="no">id=2</code> (官方) 從第四名躍升到第二名，因為它的分數乘以 1.2。社群文章和票券記錄並沒有被移除 - 只是排名較低。這就是 Boost Ranker 的重點：以語義搜尋為基礎，然後在其上層疊商業規則。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a>提供您一種方式，讓您可以在向量搜尋結果中注入商業邏輯，而無須碰觸您的嵌入或重建索引。提升官方內容、降級陳舊的搜尋結果、增加可控的多樣性 - 所有這些都可以透過<a href="https://milvus.io/docs/manage-functions.md">Milvus Function API</a> 中簡單的過濾器 + 權重設定來達成。</p>
<p>無論您是在建立 RAG 管道、推薦系統或企業搜尋，Boost Ranker 都能幫助您縮小語義相似性與對使用者實際有用性之間的差距。</p>
<p>如果您正在研究搜尋排名，並想要討論您的使用個案：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，與其他建立搜尋與檢索系統的開發人員交流。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的 Milvus Office Hours 免費課程</a>，與團隊一起探討您的排序邏輯。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理 Milvus) 有免費的層級可供您開始使用。</li>
</ul>
<hr>
<p>團隊開始使用 Boost Ranker 時會遇到的幾個問題：</p>
<p><strong>Boost Ranker 可以取代 Cohere 或 BGE 等基於模型的 reranker 嗎？</strong>他們解決的是不同的問題。基於模型的 reranker 會依據語意品質對結果重新評分 - 他們擅長判斷「哪個文件能真正回答問題」。Boost Ranker 會根據業務規則調整評分 - 它會決定「哪個相關文件應該先出現」。實際上，您通常需要兩者兼具：先用模型排名器來判斷語意相關性，然後再用 Boost Ranker 來判斷商業邏輯。</p>
<p><strong>Boost Ranker 會顯著增加延遲時間嗎？</strong>不會。它會在已經擷取的候選集（通常是向量搜尋的 Top-K）上運作，而不是整個資料集。操作是簡單的篩選與乘法，因此相較於向量搜尋本身，其開銷可以忽略不计。</p>
<p><strong>如何設定權重值？</strong>先從小幅度調整開始。對於 COSINE 相似度 (越高越好)，1.1-1.3 的權重通常足以明顯改變排名，而不會完全取代語意相關性。使用您的實際資料進行測試 - 如果相似度較低的提升結果開始佔優，請降低權重。</p>
<p><strong>我可以結合多個 Boost Ranker 規則嗎？</strong>可以。建立多個<code translate="no">Function</code> 物件，並使用<code translate="no">FunctionScore</code> 將其合併。您可以透過<code translate="no">boost_mode</code> （每個規則如何與原始分數結合）和<code translate="no">function_mode</code> （規則如何彼此結合）來控制規則的互動方式 - 兩者都支援<code translate="no">multiply</code> 和<code translate="no">add</code> 。</p>
