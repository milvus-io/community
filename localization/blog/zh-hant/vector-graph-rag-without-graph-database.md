---
id: vector-graph-rag-without-graph-database.md
title: 我們在沒有圖形資料庫的情況下建立了圖形 RAG
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  開放原始碼向量圖形 RAG 只使用 Milvus 就能在 RAG 中加入多跳推理。87.8% Recall@5，每次查詢 2 次 LLM
  呼叫，不需要圖形資料庫。
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR：</em></strong> <em>Graph RAG 真的需要圖形資料庫嗎？不需要。將實體、關係和通道放入 Milvus。使用子圖擴充來取代圖遍歷，使用一個 LLM rerank 來取代多輪代理循環。這就是</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>向量圖 RAG</em></strong></a><strong><em>，</em></strong> <em>也是我們所建立的。此方法在三個多跳 QA 基準上達到 87.8% 的平均 Recall@5，並在單一 Milvus 實例上擊敗 HippoRAG 2。</em></p>
</blockquote>
<p>多跳問題是大多數 RAG 管道最終會撞到的牆。答案就在您的語料庫中，但它橫跨多個由問題從未提及的實體所連結的段落。常見的解決方法是新增圖形資料庫，這意味著要執行兩個系統，而不是一個。</p>
<p>我們不斷遇到這種情況，但又不想為了處理這個問題而運行兩個資料庫。因此，我們建立並開放源碼了<a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>，這是一個 Python 函式庫，僅使用<a href="https://milvus.io/docs">Milvus</a>（最廣泛採用的開源向量資料庫）就能為<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>帶來多跳推理功能。它以一個資料庫取代兩個資料庫，提供相同的多跳功能。</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">為什麼多跳問題會打破標準 RAG<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>多跳問題會破壞標準 RAG，因為答案取決於向量搜尋無法看到的實體關係。連接問題與答案的橋接實體通常不在問題本身中。</p>
<p>簡單的問題可以正常運作。您可以將文件分塊、嵌入、擷取最接近的匹配項目，然後提供給 LLM。「Milvus 支援哪些索引？」這個問題就存在於一個段落中，向量搜尋就可以找到它。</p>
<p>多跳問題不符合這種模式。以醫學知識庫中的問題為例，例如<em>「使用第一線糖尿病藥物應該注意哪些副作用？</em></p>
<p>回答這個問題需要兩個推理步驟。首先，系統必須知道二甲雙胍是治療糖尿病的第一線藥物。只有這樣，系統才能查詢二甲雙胍的副作用：腎功能監測、消化道不適、維生素 B12 缺乏。</p>
<p>「二甲双胍 」是桥梁实体。它將問題與答案連接起來，但問題從來沒有提到它。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這就是<a href="https://zilliz.com/learn/vector-similarity-search">Vector 類似性搜尋的</a>終點。它擷取與問題相似的段落、糖尿病治療指南和藥物副作用清單，但卻無法追蹤將這些段落連結在一起的實體關係。類似「二甲雙胍是治療糖尿病的第一線藥物」這樣的事實存在於這些關係中，而不是任何單一段落的文字中。</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">為什麼圖形資料庫和代理 RAG 不是解決方案？<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>解決多跳 RAG 的標準方法是圖表資料庫和迭代式代理循環。這兩種方法都行得通。兩者的成本都比大多數團隊想要為單一功能支付的費用還要高。</p>
<p>首先使用圖形資料庫。您可以從文件中抽取三元組，將它們儲存在圖形資料庫中，然後遍尋邊緣來尋找多跳連接。這意味著在<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>旁邊執行第二個系統，學習 Cypher 或 Gremlin，並保持圖形與向量儲存同步。</p>
<p>迭代代理循環是另一種方法。LLM 會擷取一批資料，進行推理，決定是否有足夠的上下文，如果沒有，就再擷取一次。<a href="https://arxiv.org/abs/2212.10509">IRCoT</a>(Trivedi et al., 2023) 每次查詢會呼叫 3-5 次 LLM。代理的 RAG 可能會超過 10，因為代理會決定何時停止。每次查詢的成本變得不可預測，而且每當代理程式執行額外輪次時，P99 延遲會激增。</p>
<p>兩者都不適合需要多跳推理而不需要重建堆疊的團隊。因此我們嘗試了其他方法。</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">什麼是向量圖表 RAG，向量資料庫內的圖表結構<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a>是一個開放原始碼的 Python 函式庫，僅使用<a href="https://milvus.io/docs">Milvus</a> 就能為<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>帶來多跳推理。它將圖形結構儲存為三個 Milvus 集合的 ID 參照。在 Milvus 中，遍歷變成了一連串的主鍵查詢，而不是針對圖形資料庫的 Cypher 查詢。一個 Milvus 就能同時完成這兩項工作。</p>
<p>它之所以有效，是因為知識圖表中的關係只是文字。三重關係<em>（即二甲雙胍，是治療 2 型糖尿病的第一線藥物）</em>是圖形資料庫中的有向邊緣。它也是一個句子：「二甲雙胍是治療 2 型糖尿病的第一線藥物」。您可以將這個句子嵌入為向量，然後儲存在<a href="https://milvus.io/docs">Milvus</a> 中，就像其他文字一樣。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>回答多跳查詢意味著從查詢提到的內容（例如「糖尿病」）到沒有提到的內容（例如「二甲雙胍」）之間的連結。這只有在儲存保留這些連線：哪個實體透過哪個關係連結到哪個實體時才行得通。純文字可搜尋，但不可跟蹤。</p>
<p>在 Milvus 中，為了保持連線的可追蹤性，我們賦予每個實體和每個關係一個獨特的 ID，然後將它們儲存在不同的集合中，這些集合透過 ID 來互相參照。一共有三個集合：<strong>實體</strong>(節點)、<strong>關係</strong>(邊緣)，以及<strong>段落</strong>(原始文字，LLM 需要它來產生答案)。每一行都有一個向量嵌入，因此我們可以對這三個集合中的任何一個進行語意搜尋。</p>
<p><strong>實體</strong>儲存重複的實體。每個實體都有一個唯一的 ID、一個用於<a href="https://zilliz.com/glossary/semantic-search">語義搜尋的</a> <a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>，以及一個它參與的關係 ID 的清單。</p>
<table>
<thead>
<tr><th>ID</th><th>名稱</th><th>嵌入</th><th>關係 ID</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>甲福明</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>2 型糖尿病</td><td>[0.34, ...]</td><td>[R01, R04］</td></tr>
<tr><td>e03</td><td>腎功能</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>關係</strong>儲存知識三元組。每個關係會記錄其主體和客體實體 ID、來自的段落 ID，以及完整關係文字的嵌入。</p>
<table>
<thead>
<tr><th>id</th><th>主體_id</th><th>物件 ID</th><th>文字</th><th>嵌入</th><th>passage_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>二甲雙胍是治療2型糖尿病的第一線藥物</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>服用二甲双胍的患者应监测肾功能</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Passages</strong>儲存原始文件塊，並參照從其中萃取的實體和關係。</p>
<p>這三個集合透過 ID 欄位互相指向：實體帶有其關係的 ID，關係帶有其主體和客體實體以及來源段落的 ID，而段落則帶有從中抽取出來的所有東西的 ID。這個 ID 參照的網路就是圖形。</p>
<p>遍歷只是一連串的 ID 查詢。您取得實體 e01 以取得它的<code translate="no">relation_ids</code> ，根據這些 ID 取得關係 r01 和 r02，讀取 r01 的<code translate="no">object_id</code> 以發現實體 e02，然後一直繼續。每一跳都是標準的 Milvus<a href="https://milvus.io/docs/get-and-scalar-query.md">主鍵查詢</a>。不需要 Cypher。</p>
<p>您可能會問，到 Milvus 的額外往返次數是否會增加？不會。子圖擴充需要花費 2-3 次基於 ID 的查詢，總時間為 20-30ms。LLM 呼叫需要 1-3 秒，這使得 ID 查詢在其旁邊變得無形。</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">向量圖 RAG 如何回答多跳查詢<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>檢索流程分四個步驟將多跳查詢轉換成接地的答案：<strong>種子檢索 → 子圖擴充 → LLM rerank → 生成答案。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們將探討糖尿病問題：<em>「使用第一線糖尿病藥物應該注意哪些副作用？」</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">步驟 1：種子擷取</h3><p>LLM 會從問題中擷取關鍵實體：「糖尿病」、「副作用」、「第一線藥物」。Milvus 中的向量搜尋可以直接找到最相關的實體和關係。</p>
<p>但二甲雙胍不在其中。問題中沒有提到它，所以向量搜尋找不到它。</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">步驟 2：子圖擴展</h3><p>這就是向量圖表 RAG 與標準 RAG 不同之處。</p>
<p>系統從種子實體一跳一跳地跟著 ID 參考。它會取得種子實體 ID，找出包含這些 ID 的所有關係，並將新的實體 ID 拉入子圖。預設：一跳。</p>
<p><strong>橋接實體 Metformin 進入子圖。</strong></p>
<p>「糖尿病 」有一個關係：<em>"二甲雙胍是治療 2 型糖尿病的第一線藥物。</em>沿著這條邊緣，二甲雙胍就進入了。一旦二甲雙胍進入子圖，它自己的關係也會隨之而來：<em>"服用二甲雙胍的患者應該監測腎臟功能」、「二甲雙胍可能會引起胃腸道不適」、「長期服用二甲雙胍可能會導致維生素 B12 缺乏」。</em></p>
<p>兩個原本分開的事實，現在透過圖表擴充的一跳連結在一起。問題從未提及的橋接實體現在可以被發現了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">步驟 3：LLM 重新排名</h3><p>圖表擴展會留下數十個候選關係。大部分都是雜訊。</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>系統將這些候選關係和原始問題傳送給 LLM：「哪些關係到糖尿病第一線藥物的副作用？這是一次沒有迭代的呼叫。</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>選取的關係涵蓋整個鏈條：糖尿病 → 甲福明 → 腎臟監測 / 胃腸道不適 / B12 缺乏症。</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">步驟 4：答案產生</h3><p>系統擷取所選關係的原始段落並傳送給 LLM。</p>
<p>LLM 會從完整的段落文字產生答案，而非經修剪的三元組。三元組是壓縮的摘要。它們缺乏 LLM 生成基礎答案所需的上下文、注意事項和具體內容。</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">觀看向量圖 RAG 的實作</h3><p>我們也建立了一個互動式前端，可視化每個步驟。點選左邊的步驟面板，圖形就會即時更新：橘色代表種子節點，藍色代表擴充節點，綠色代表選取的關係。這讓檢索流程變得具體而非抽象。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">為什麼一次重新排名能勝過多次迭代？<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的管道會對每個查詢進行兩次 LLM 呼叫：一次用於重排，一次用於生成。像 IRCoT 和 Agentic RAG 之類的迭代系統會執行 3 到 10 次以上的呼叫，因為它們會循環：retrieve、reason、retrieve again。我們跳過這個循環，因為向量搜尋和子圖擴充一次就能涵蓋語意相似性和結構連結，讓 LLM 有足夠的候選人在一次 rerank 中完成。</p>
<table>
<thead>
<tr><th>方法</th><th>每次查詢的 LLM 呼叫</th><th>延遲概況</th><th>相對 API 成本</th></tr>
</thead>
<tbody>
<tr><td>向量圖 RAG</td><td>2 (rerank + 生成)</td><td>固定、可預測</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>可變</td><td>~2-3x</td></tr>
<tr><td>代理 RAG</td><td>5-10+</td><td>無法預測</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>在生產中，API 成本大約降低 60%，回應速度提高 2-3 倍，且延遲時間可預測。當代理決定執行額外回合時，不會出現意外的峰值。</p>
<h2 id="Benchmark-Results" class="common-anchor-header">基準結果<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG 在三個標準多跳 QA 基準中平均 Recall@5 為 87.8%，符合或超越我們測試的所有方法，包括 HippoRAG 2，僅使用 Milvus 和 2 個 LLM 呼叫。</p>
<p>我們評估了 MuSiQue (2-4跳，最難)、HotpotQA (2跳，使用最廣泛) 和 2WikiMultiHopQA (2跳，跨文件推理)。指標是 Recall@5：正確的支援段落是否出現在前 5 個檢索結果中。</p>
<p>為了公平的比較，我們使用<a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG 儲存庫</a>中完全相同的預抽取三元組。沒有重新抽取，也沒有客製化的預處理。此比較將擷取演算法本身獨立出來。</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量圖 RAG</a>對比標準 (Naive) RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>向量圖形 RAG 將平均 Recall@5 從 73.4% 提升到 87.8%，改善了 19.6 個百分點。</p>
<ul>
<li>MuSiQue：最大增益 (+31.4 pp)。3-4 跳基準，最難的多跳問題，也正是子圖擴充影響最大的地方。</li>
<li>2WikiMultiHopQA：大幅提升 (+27.7 pp)。跨文件推理，子圖擴充的另一個甜蜜點。</li>
<li>HotpotQA: 增益較小 (+6.1 pp)，但標準 RAG 在此資料集上的得分已達 90.8%。上限很低。</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量圖 RAG</a>對比最新方法 (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG 在與 HippoRAG 2、IRCoT 和 NV-Embed-v2 的比較中取得 87.8% 的最高平均分。</p>
<p>依基準分類：</p>
<ul>
<li>HotpotQA: 平 HippoRAG 2 (兩者皆為 96.3%)</li>
<li>2WikiMultiHopQA: 領先 3.7 點 (94.1% vs 90.4%)</li>
<li>MuSiQue (最難)：落後 1.7 點 (73.0% vs 74.7%)</li>
</ul>
<p>Vector Graph RAG 在每次查詢只需呼叫 2 次 LLM、沒有圖形資料庫、也沒有 ColBERTv2 的情況下，就能達到這些數字。它運行在比較中最簡單的基礎架構上，但仍取得最高的平均值。</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">向量圖形 RAG</a>與其他圖形 RAG 方法的比較<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>不同的 Graph RAG 方法會針對不同的問題進行最佳化。Vector Graph RAG 針對生產多跳 QA 而建，具有可預測的成本和簡單的基礎架構。</p>
<table>
<thead>
<tr><th></th><th>微軟 GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>向量圖形 RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>基礎架構</strong></td><td>圖形 DB + 向量 DB</td><td>ColBERTv2 + 存儲圖形</td><td>向量 DB + 多輪代理</td><td><strong>僅 Milvus</strong></td></tr>
<tr><td><strong>每次查詢的 LLM 呼叫</strong></td><td>變化</td><td>中度</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>最適合</strong></td><td>全球語料摘要</td><td>細粒度學術檢索</td><td>複雜的開放式探索</td><td><strong>生產多跳 QA</strong></td></tr>
<tr><td><strong>擴充性問題</strong></td><td>昂貴的 LLM 索引</td><td>記憶體中的完整圖形</td><td>無法預測的延遲與成本</td><td><strong>可與 Milvus 擴充</strong></td></tr>
<tr><td><strong>設定複雜度</strong></td><td>高</td><td>中高</td><td>中</td><td><strong>低 (pip 安裝)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a>使用分層社群聚類來回答全局性的摘要問題，例如「這個語料庫的主要主題是什麼？這與多跳 QA 是不同的問題&quot;。</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a>（Gutierrez 等人，2025 年）使用 ColBERTv2 標記級匹配的認知啟發檢索。將完整圖形載入記憶體限制了可擴展性。</p>
<p><a href="https://arxiv.org/abs/2212.10509">IRCoT</a>之類的迭代式方法，以 LLM 成本和不可預測的延遲來換取基礎架構的簡易性。</p>
<p>Vector Graph RAG 針對生產多跳 QA：需要可預測成本與延遲的團隊，而不需要新增圖形資料庫。</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">何時使用 Vector Graph RAG 及主要使用案例<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG 適用於四種工作負載：</p>
<table>
<thead>
<tr><th>情境</th><th>為什麼適合</th></tr>
</thead>
<tbody>
<tr><td><strong>知識密集的文件</strong></td><td>包含交叉參考的法律編碼、包含藥物-基因-疾病鏈的生物醫學文獻、包含公司-個人-事件連結的財務檔案、包含 API 相依性圖表的技術文件</td></tr>
<tr><td><strong>2-4 跳問題</strong></td><td>單跳問題在標準 RAG 中運作良好。五跳或更多跳可能需要迭代方法。2-4 跳的範圍是 subgraph 擴充的甜蜜點。</td></tr>
<tr><td><strong>簡單部署</strong></td><td>一個資料庫、一個<code translate="no">pip install</code> 、無需學習圖形基礎架構</td></tr>
<tr><td><strong>成本與延遲敏感度</strong></td><td>每次查詢有兩個 LLM 呼叫，固定且可預測。在每天上千筆查詢的情況下，差異會逐漸增加。</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">開始使用向量圖形 RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> 在沒有參數的情況下，預設為<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>。它會建立一個本機<code translate="no">.db</code> 檔案，就像 SQLite。不需要啟動伺服器，也不需要設定任何東西。</p>
<p><code translate="no">add_texts()</code> <code translate="no">query()</code> 會執行完整的四步擷取流程：seed、expand、rerank、generate。</p>
<p>對於生產，只需交換一個 URI 參數。其餘的程式碼保持不變：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>匯入 PDF、網頁或 Word 檔案：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG 不需要圖形資料庫。Vector Graph RAG 儲存圖形結構為三個 Milvus 集合的 ID 參考，這將圖形遍歷轉換為主鍵查詢，並將每個多跳查詢保持在固定的兩個 LLM 呼叫。</p>
<p>一目了然：</p>
<ul>
<li>開放原始碼的 Python 函式庫。僅在 Milvus 上進行多跳推理。</li>
<li>以 ID 連結的三個集合。實體 (節點)、關係 (邊)、段落 (原始文字)。子圖擴充 (Subgraph Expansion) 依據 ID 來發現查詢未提及的橋接實體。</li>
<li>每個查詢有兩個 LLM 呼叫。一次重排，一次生成。無迭代。</li>
<li>在 MuSiQue、HotpotQA 和 2WikiMultiHopQA 中的平均 Recall@5 率為 87.8%，在三項中的兩項上與 HippoRAG 2 相匹配或優於 HippoRAG 2。</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">試試看</h3><ul>
<li>程式碼請參考<a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a></li>
<li>完整 API 和範例的<a href="https://zilliztech.github.io/vector-graph-rag">說明文件</a></li>
<li>加入<a href="https://slack.milvus.io/">Discord 上的</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://discord.com/invite/8uyFbECzPX">社群</a>，提出問題並分享回饋意見</li>
<li><a href="https://milvus.io/office-hours">預約 Milvus 辦公時間會議</a>，以瞭解您的使用案例</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>提供免費的 Milvus 管理層級。</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">常見問題<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">我可以只用向量資料庫做 Graph RAG 嗎？</h3><p>可以。向量圖形 RAG 儲存知識圖形結構 (實體、關係和它們的連結) 在三個 Milvus 資料集中，並透過 ID 相互參照連結。與其在圖形資料庫中橫越邊緣，不如在 Milvus 中使用主鍵查詢來擴展種子實體周圍的子圖形。這在三個標準多跳基準上達到 87.8% 的平均 Recall@5，而不需要任何圖形資料庫基礎架構。</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Vector Graph RAG 與 Microsoft GraphRAG 比較如何？</h3><p>它們解決不同的問題。Microsoft GraphRAG 使用階層式社群聚類（hierarchical community clustering）來進行全球語料庫總結（「這些文件的主要主題是什麼？Vector Graph RAG 則專注於多跳問題解答，目標是在各個段落之間串連特定的事實。Vector Graph RAG 每次查詢只需要 Milvus 和兩個 LLM 呼叫。Microsoft GraphRAG 需要圖形資料庫，而且索引成本較高。</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">哪些類型的問題可從多跳 RAG 中獲益？</h3><p>多跳 RAG 有助於處理答案取決於連接分散在多個段落中的資訊的問題，尤其是當問題中從未出現關鍵實體時。範例包括「第一線糖尿病藥物有哪些副作用？(需要發現二甲雙胍作為橋樑）、法律或法規文本中的交叉參考查詢，以及技術文件中的依賴鏈追溯。標準 RAG 可以很好地處理單一事實查詢。當推理路徑有兩到四個步驟長時，多跳 RAG 就會增加價值。</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">我需要手動抽取知識圖形三元組嗎？</h3><p>不需要。<code translate="no">add_texts()</code> 和<code translate="no">add_documents()</code> 會自動呼叫 LLM 來擷取實體和關係，將它們向量化，並儲存在 Milvus 中。您可以使用內建的<code translate="no">DocumentImporter</code> 從 URL、PDF 和 DOCX 檔案匯入文件。為了進行基準測試或遷移，該函式庫支援從 HippoRAG 等其他框架匯入預先萃取的三元組。</p>
