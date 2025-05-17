---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: Milvus 2.6 預覽：記憶體減少 72% 但不影響調用，速度比 Elasticsearch 快 4 倍
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: 獨家先睹即將推出的 Milvus 2.6 的創新功能，重新定義向量資料庫的效能與效率。
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>在本週，我們分享了 Milvus 一系列令人振奮的創新，這些創新突破了向量資料庫技術的界限：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">真實世界中的向量搜尋：如何有效篩選而不損害回復率 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie - Vector DBs 值得真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
</ul>
<p>現在，當我們結束 Milvus Week 系列時，我很興奮地讓您先睹為快 Milvus 2.6 - 我們 2025 年產品路線圖的重要里程碑，目前正在開發中，以及這些改進將如何改變 AI 驅動的搜尋。這次即將推出的版本將所有這些創新技術以及更多的技術整合在一起，並橫跨三個關鍵領域：<strong>成本效益最佳化</strong>、<strong>進階搜尋功能</strong>，以及將向量搜尋推廣至 100 億向量以上規模<strong>的全新架構</strong>。</p>
<p>讓我們深入瞭解 Milvus 2.6 於今年 6 月推出時，您可以期待的一些主要改進，首先可能是最直接的影響：大幅降低記憶體使用量和成本，以及超快的效能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">降低成本：大幅降低記憶體使用量，同時提升效能<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>依賴昂貴的記憶體是將向量搜尋擴大至數十億筆記錄的最大障礙之一。Milvus 2.6 將引入多項關鍵優化功能，在提升效能的同時大幅降低基礎架構成本。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1 位量化：記憶體消耗降低 72%，QPS 提升 4 倍，且不會造成召回損失</h3><p>記憶體消耗一直是大型向量資料庫的致命傷。雖然向量量化並非新鮮事物，但大多數現有方法都為了節省記憶體而犧牲了太多的搜尋品質。Milvus 2.6 將在生產環境中引入<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQ 1 位元量化</a>，正面解決這個挑戰。</p>
<p>我們的實作之所以特別，在於我們所建立的可調整 Refine 最佳化功能。透過實施具有 RaBitQ 量化功能的主索引，再加上 SQ4/SQ6/SQ8 Refine 選項，我們在記憶體使用量與搜尋品質 (~95% 召回率) 之間達到了最佳平衡。</p>
<p>我們的初步基準顯示出令人期待的結果：</p>
<table>
<thead>
<tr><th><strong>效能</strong> <strong>指標</strong></th><th><strong>傳統 IVF_FLAT</strong></th><th><strong>僅 RaBitQ (1 位元)</strong></th><th><strong>RaBitQ (1 位元) + SQ8 精煉</strong></th></tr>
</thead>
<tbody>
<tr><td>記憶體佔用空間</td><td>100% (基線)</td><td>3% (減少 97%)</td><td>28% (減少 72%)</td></tr>
<tr><td>召回品質</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>查詢吞吐量 (QPS)</td><td>236</td><td>648 (快 2.7 倍)</td><td>946 (快 4 倍)</td></tr>
</tbody>
</table>
<p><em>表：在 AWS m6id.2xlarge 上以 1M 768 維向量進行的 VectorDBBench 評估測試</em></p>
<p>這裡真正的突破不只是記憶體的減少，而是在不影響精確度的情況下，同時達到 4 倍的吞吐量改善。這表示您將能夠使用減少 75% 的伺服器來服務相同的工作負載，或在現有基礎架構上處理多 4 倍的流量。</p>
<p>對於在<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> 上使用完全管理式 Milvus 的企業用戶，我們正在開發自動化的設定檔，可根據您特定的工作負載特性和精確度需求，動態調整 RaBitQ 參數。</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">全文搜尋速度比 Elasticsearch 快 400</h3><p>向量資料庫的<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文</a>檢索功能已成為建立混合式檢索系統的必要條件。自從<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> 推出 BM25 以來，我們收到了熱烈的反饋，並要求在規模上提供更好的效能。</p>
<p>Milvus 2.6 將大幅提升 BM25 的效能。我們在 BEIR 資料集上的測試顯示，在召回率相等的情況下，吞吐量比 Elasticsearch 高出 3-4倍。對於某些工作負載，改善幅度可高達 7 倍的 QPS。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖：Milvus 與 Elasticsearch 在 JSON Path Index 吞吐量上的比較：複雜篩選的延遲時間降低 99</p>
<p>現代的 AI 應用程式很少會單獨依賴向量相似性，它們幾乎都會結合向量搜尋與元資料篩選。當這些篩選條件變得越來越複雜 (尤其是巢狀 JSON 物件)，查詢效能可能會迅速惡化。</p>
<p>Milvus 2.6 將為巢狀 JSON 路徑引入目標索引機制，允許您在 JSON 欄位內的特定路徑 (例如 $meta.<code translate="no">user_info.location</code>) 上建立索引。Milvus 不會掃描整個物件，而是直接從預先建立的索引中查找值。</p>
<p>在我們使用 100 M+ 記錄進行的評估中，JSON 路徑索引將過濾延遲從<strong>140 毫秒</strong>(P99: 480 毫秒) 降低到僅<strong>1.5</strong>毫秒 (P99: 10 毫秒)--降低了 99%，將以前不切實際的查詢轉變為即時回應。</p>
<p>這項功能對於下列情況特別有價值</p>
<ul>
<li><p>具有複雜使用者屬性篩選功能的推薦系統</p></li>
<li><p>以各種標籤篩選文件的 RAG 應用程式</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">下一代搜尋：從基本向量相似性到生產級檢索<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>對於現代的 AI 應用程式而言，光是向量搜尋是不夠的。使用者需要傳統資訊檢索的精確度，並結合向量嵌入的語意理解。Milvus 2.6 將推出多項先進的搜尋功能，以彌補這方面的不足。</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">透過多語言分析器提供更佳的全文檢索功能</h3><p>全文搜尋是高度依賴語言的...Milvus 2.6 將會引入一個支援多語言的全新文字分析管道：</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> 分析器/標記化配置可觀察的語法支援</p></li>
<li><p>針對日語和韓語等亞洲語言的 Lindera tokenizer</p></li>
<li><p>ICU tokenizer 可提供全面的多語言支援</p></li>
<li><p>用於定義特定語言標記規則的粒度化語言配置</p></li>
<li><p>支援自訂字典整合的增強型 Jieba</p></li>
<li><p>擴充篩選器選項，以進行更精確的文字處理</p></li>
</ul>
<p>對於全球應用程式而言，這意味著更好的多語言搜尋，而無需專門的每種語言索引或複雜的變通。</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">詞組匹配：捕捉詞序中的語義細節</h3><p>詞序傳達了關鍵字搜尋經常遺漏的關鍵意義區別。試試比較「機器學習技術」與「學習機器技術」- 相同的字詞，卻有完全不同的意義。</p>
<p>Milvus 2.6 將新增<strong>短語匹配</strong>功能，讓使用者比全文搜尋或精確字串匹配更能控制字詞順序和鄰近程度：</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">slop</code> 參數將提供彈性的字詞接近度控制-0 需要精確的連續匹配，而較高的值則允許短語的微小變化。</p>
<p>此功能對於下列情況特別有價值</p>
<ul>
<li><p>法律文件檢索，其中精確的措辭具有法律意義</p></li>
<li><p>詞彙順序可區分不同概念的技術內容檢索</p></li>
<li><p>必須精確匹配特定技術詞組的專利資料庫</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">時間感知衰減功能：自動優先處理新鮮內容</h3><p>資訊的價值通常會隨著時間而遞減。新聞文章、產品發佈和社群文章都會隨著時間而變得不重要，但傳統的搜尋演算法卻對所有內容一視同仁，不論時間戳記。</p>
<p>Milvus 2.6 將為時間感知排名引入<strong>衰減函數 (Decay Functions</strong>)，可根據文件年齡自動調整相關性得分。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您可以設定</p>
<ul>
<li><p><strong>函數類型</strong>：指數 (快速衰減)、高斯 (逐漸衰減) 或線性 (持續衰減)</p></li>
<li><p><strong>衰減速率</strong>：相關性隨時間遞減的速度</p></li>
<li><p><strong>起始點</strong>：測量時間差異的參考時間戳</p></li>
</ul>
<p>這種對時間敏感的重新排序將確保最先出現的是最新且與上下文最相關的結果，這對新聞推薦系統、電子商務平台和社群媒體饋送（social media feeds）至關重要。</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">資料輸入，資料輸出：從原始文字到向量搜尋一步到位</h3><p>向量資料庫最大的開發痛點之一，就是原始資料與向量嵌入之間的斷層。Milvus 2.6 將透過全新的<strong>Function</strong>介面，將第三方嵌入模型直接整合至您的資料管道，大幅簡化這個工作流程。只需一次呼叫，即可簡化向量搜尋管道。</p>
<p>您可以</p>
<ol>
<li><p><strong>直接插入原始資料</strong>：將文字、影像或其他內容提交至 Milvus</p></li>
<li><p><strong>設定向量化的嵌入提供者</strong>：Milvus 可以連接嵌入模型服務，例如 OpenAI、AWS Bedrock、Google Vertex AI 和 Hugging Face。</p></li>
<li><p><strong>使用自然語言查詢</strong>：使用文字查詢而非向量嵌入進行搜尋</p></li>
</ol>
<p>這將創造一個簡化的「資料進入、資料輸出」體驗，Milvus 會在內部處理向量的產生，讓您的應用程式碼更直接。</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">架構演進：擴充至數千億向量<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>一個好的資料庫不僅要有好的功能，還必須在生產中經過實戰考驗，以大規模的方式提供這些功能。</p>
<p>Milvus 2.6 將會引進一個基本的架構變革，能夠以符合成本效益的方式擴充至數千億向量。最大的亮點是全新的冷熱分層儲存架構，可根據存取模式智慧地管理資料放置，自動將熱資料移至高效能記憶體/SSD，同時將冷資料放置在更經濟的物件儲存中。這種方法可以大幅降低成本，同時在最重要的地方維持查詢效能。</p>
<p>此外，新的<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">串流節點 (Streaming Node</a>) 將可直接整合至 Kafka 和 Pulsar 等串流平台，以及新建立的<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>，以實現即時向量處理，讓新資料可立即搜尋，而不會出現批次延遲。</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">敬請期待 Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 目前正在積極開發中，並將於今年六月推出。我們很高興能帶給您這些突破性的效能最佳化、進階的搜尋功能，以及全新的架構，協助您以更低的成本建立可擴充的 AI 應用程式。</p>
<p>與此同時，我們歡迎您對這些即將推出的功能提出意見。什麼最讓您興奮？哪些功能對您的應用程式影響最大？加入我們<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道的</a>對話，或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 追蹤我們的進展。</p>
<p>想要在 Milvus 2.6 發佈時第一時間知道嗎？在<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a>或<a href="https://twitter.com/milvusio"> X</a>上關注我們，獲得最新更新。</p>
