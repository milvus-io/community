---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: 我們使用 Milvus 對 20 多個嵌入式 API 進行了基準測試：7 個會讓您驚訝的發現
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: 最流行的嵌入式 API 並不是最快的。地理位置比模型架構更重要。有時候，20 美元/月的 CPU 勝過 200 美元/月的 API 呼叫。
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>可能每個 AI 開發人員都建立了一個 RAG 系統，並在他們的本地環境中完美運作...。</strong></p>
<p>您已經掌握了擷取的精確度、優化了向量資料庫，而且您的示範執行起來就像黃油一樣順暢。但當您部署到生產環境時，突然發現</p>
<ul>
<li><p>您 200 毫秒的本地查詢對實際使用者來說需要 3 秒。</p></li>
<li><p>不同地區的同事報告的效能完全不同</p></li>
<li><p>您為了「最佳精確度」而選擇的嵌入提供者成為您最大的瓶頸</p></li>
</ul>
<p>發生了什麼事？這就是沒有人設定基準的效能殺手：<strong>嵌入式 API 延遲</strong>。</p>
<p>當 MTEB 排名著迷於召回分數和模型大小時，他們忽略了您的使用者實際感受的指標 - 他們在看到任何回應之前要等多久。我們在真實環境中測試了所有主要的嵌入式提供商，發現延遲的差異極大，讓您對整個提供商選擇策略產生懷疑。</p>
<p><strong><em>劇透：最受歡迎的嵌入式 API 並不是最快的。地理位置比模型架構更重要。有時候，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>20</mi><mn>/月的</mn></mrow><annotation encoding="application/x-tex">CPU 勝過</annotation><mrow><mn>20/月的</mn></mrow><annotation encoding="application/x-tex">CPU 勝過</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">200</span><span class="mord">/月的</span></span></span></span>API 呼叫</em></strong><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><strong><em>。</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">為什麼嵌入式 API 延遲是 RAG 中隱藏的瓶頸<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在建立 RAG 系統、電子商務搜尋或推薦引擎時，嵌入模型是將文字轉換為向量的核心元件，可讓機器了解語意並執行有效率的相似性搜尋。雖然我們通常會為文件庫預先計算嵌入，但使用者查詢仍需要即時的嵌入 API 呼叫，才能在檢索前將問題轉化成向量，而這種即時延遲往往會成為整個應用程式鏈的效能瓶頸。</p>
<p>流行的嵌入基準 (例如 MTEB) 著重於召回準確度或模型大小，往往忽略了關鍵的效能指標 - API 延遲。使用 Milvus 的<code translate="no">TextEmbedding</code> Function，我們對北美和亞洲的主要嵌入式服務供應商進行了全面的實際測試。</p>
<p>嵌入延遲表現在兩個關鍵階段：</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">查詢時間的影響</h3><p>在典型的 RAG 工作流程中，當使用者提出問題時，系統必須</p>
<ul>
<li><p>透過嵌入式 API 呼叫將查詢轉換為向量</p></li>
<li><p>在 Milvus 中搜尋類似的向量</p></li>
<li><p>將結果和原始問題饋送至 LLM</p></li>
<li><p>產生並傳回答案</p></li>
</ul>
<p>許多開發人員假設 LLM 的答案產生是最慢的部分。然而，許多 LLM 的串流輸出能力會造成一種速度的錯覺 - 您很快就會看到第一個標記。實際上，如果您的嵌入式 API 呼叫需要數百毫秒甚至數秒的時間，它就會成為您回應鏈中的第一個、也是最顯著的一個瓶頸。</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">資料輸入的影響</h3><p>無論是從頭開始建立索引或執行例行更新，大量資料擷取都需要將數以千計或百萬計的文字區塊向量化。如果每次嵌入呼叫都經歷高延遲，您的整個資料管道就會顯著變慢，延遲產品發佈和知識庫更新。</p>
<p>這兩種情況都使得嵌入式 API 延遲成為生產 RAG 系統不可或缺的效能指標。</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">使用 Milvus 測量真實世界的嵌入式 API 延遲<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是開放原始碼的高效能向量資料庫，提供全新的<code translate="no">TextEmbedding</code> Function 介面。此功能可將 OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AI 以及更多提供者的熱門嵌入模型直接整合至您的資料管道，只需一次呼叫即可簡化向量搜尋管道。</p>
<p>使用這個全新的功能介面，我們測試了 OpenAI 和 Cohere 等美國模型供應商，以及 AliCloud 和 SiliconFlow 等亞洲供應商所提供的各種熱門嵌入 API，並對其進行基準測試，在實際部署情境中測量其端對端延遲。</p>
<p>我們的全面測試套件涵蓋各種模型配置：</p>
<table>
<thead>
<tr><th><strong>供應商</strong></th><th><strong>模型</strong></th><th><strong>尺寸</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>text-embedding-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>文字嵌入-3-小</td><td>1536</td></tr>
<tr><td>開放AI</td><td>文字嵌入-3-大</td><td>3072</td></tr>
<tr><td>AWS 基岩</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>文字嵌入-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>文字多語種嵌入-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>航行AI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>邏輯</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>邏輯</td><td>嵌入式多語言-v3.0</td><td>1024</td></tr>
<tr><td>隸キ豕</td><td>嵌入式英語-light-v3.0</td><td>384</td></tr>
<tr><td>隸キ豕</td><td>嵌入式多語言-light-v3.0</td><td>384</td></tr>
<tr><td>阿里雲 Dashscope</td><td>文字嵌入-v1</td><td>1536</td></tr>
<tr><td>阿里雲視頻</td><td>文字嵌入-v2</td><td>1536</td></tr>
<tr><td>阿里雲數碼頻道</td><td>文字嵌入-v3</td><td>1024</td></tr>
<tr><td>矽流</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>矽流</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>矽流</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>矽流</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>矽流</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-en-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 基準測試結果的主要發現<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在不同的批次大小、標記長度和網路條件下，測試了北美和亞洲的知名嵌入模型，測量了所有情況下的中位延遲。我們的研究結果揭示了重要的洞察力，這些洞察力將重塑您對嵌入式 API 選擇和最佳化的思考方式。讓我們來看看。</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1.全球網路效應比您想像的更重要</h3><p>網路環境可能是影響嵌入式 API 效能的最關鍵因素。相同的嵌入式 API 服務供應商在不同的網路環境下，效能可能會有很大的差異。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>當您的應用程式部署在亞洲，並存取部署在北美的 OpenAI、Cohere 或 VoyageAI 等服務時，網路延遲會顯著增加。我們的實際測試顯示，API 呼叫延遲普遍增加了<strong>3 到 4 倍</strong>！</p>
<p>相反地，當您的應用程式部署在北美，並存取亞洲服務 (例如 AliCloud Dashscope 或 SiliconFlow)，效能下降的情況會更加嚴重。特別是 SiliconFlow，在跨區域的情況下，延遲增加了<strong>近 100 倍</strong>！</p>
<p>這意味著您必須始終根據部署位置和用戶地理位置來選擇嵌入提供商--沒有網路背景的性能聲稱是毫無意義的。</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2.模型性能排名揭示了令人驚訝的結果</h3><p>我們全面的延遲測試顯示出明確的效能等級：</p>
<ul>
<li><p><strong>北美模型（延遲中值）</strong>：Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>亞洲機型 (中位延遲)：</strong>SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>這些排名挑戰了有關供應商選擇的傳統智慧。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>註：由於網路環境和伺服器地理區域對即時嵌入 API 延遲有顯著影響，我們分別比較了北美和亞洲模型的延遲。</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3.模型大小的影響因提供商而異</h3><p>我們觀察到一個普遍的趨勢，就是較大的模型比標準模型有較高的延遲，而標準模型比較小/精簡的模型有較高的延遲。但是，這種模式並不普遍，而且揭示了關於後端架構的重要啟示。舉例來說</p>
<ul>
<li><p><strong>Cohere 和 OpenAI</strong>在不同大小的模型之間表現出最小的效能差距</p></li>
<li><p><strong>VoyageAI</strong>根據模型大小顯示出明顯的效能差異</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這顯示 API 的回應時間取決於模型架構以外的多重因素，包括後端批次策略、請求處理最佳化，以及提供者特定的基礎架構。這個教訓很清楚：<em>不要相信模型大小或發行日期是可靠的效能指標，務必在您自己的部署環境中進行測試。</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4.令牌長度與批次大小造成複雜的權衡問題</h3><p>根據後端實施，特別是批次策略，代幣長度可能不會顯著影響延遲，直到批次大小增加。我們的測試發現了明顯的模式：</p>
<ul>
<li><p><strong>OpenAI 的延遲</strong>在小批量和大批量之間保持相當一致，這顯示出後端批次處理能力很強。</p></li>
<li><p><strong>VoyageAI</strong>顯示出明顯的代幣長度效應，意味著後端批次最佳化程度極低</p></li>
</ul>
<p>較大的批次大小會增加絕對延遲，但會改善整體吞吐量。在我們的測試中，從 batch=1 到 batch=10，延遲增加了 2×-5×，但總吞吐量卻大幅提升。這代表著大量處理工作流程的重要優化機會，您可以用個別請求的延遲來換取整體系統吞吐量的大幅提升。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>從 batch=1 到 10，延遲增加了 2×-5×</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5.API 可靠性帶來生產風險</h3><p>我們觀察到延遲有顯著的差異，尤其是 OpenAI 和 VoyageAI，為生產系統帶來不可預測性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>批次=1 時的延遲差異</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>批次=10 時的延遲差異</p>
<p>雖然我們的測試主要著重於延遲，但依賴任何外部 API 都會引發固有的故障風險，包括網路波動、供應商速率限制和服務中斷。如果供應商沒有明確的 SLA，開發人員應該實施強大的錯誤處理策略，包括重試、逾時和斷路，以維持生產環境中系統的可靠性。</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6.本地推理的競爭力令人驚訝</h3><p>我們的測試還顯示，在本機部署中型嵌入模型可以提供媲美雲 API 的效能，這對於有預算意識或對延遲敏感的應用程式來說是非常重要的發現。</p>
<p>舉例來說，透過 TEI (Text Embeddings Inference) 在 4c8g CPU 上部署開放原始碼<code translate="no">bge-base-en-v1.5</code> ，其延遲效能與 SiliconFlow 不相伯仲，提供了經濟實惠的本機推論替代方案。對於缺乏企業級 GPU 資源但仍需要高效能嵌入功能的個人開發人員和小型團隊而言，這項發現尤其重要。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEI 延遲</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7.Milvus 開銷微不足道</h3><p>由於我們使用 Milvus 來測試嵌入 API 的延遲，因此我們驗證 Milvus 的 TextEmbedding Function 所帶來的額外開銷非常小，幾乎可以忽略不计。我們的測量結果顯示，Milvus 的作業總共只增加 20-40 毫秒，而嵌入式 API 的呼叫則需要數百毫秒至數秒，這表示<strong>Milvus</strong>在總作業時間上只<strong>增加不到 5% 的開銷</strong>。效能瓶頸主要在於網路傳輸和嵌入式 API 服務供應商本身的處理能力，而非 Milvus 伺服器層。</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">提示：如何優化您的 RAG 嵌入性能<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>基於我們的綜合基準，我們推薦以下策略來優化您的 RAG 系統的嵌入性能：</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1.始終進行本地化測試</h3><p>不要盲目相信任何通用的基準報告（包括本報告！）。您應該始終在您的實際部署環境中測試模型，而不是僅僅依賴已公佈的基準。網路條件、地理上的接近程度以及基礎架構的差異，都會大幅影響實際效能。</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2.策略性地匹配您的供應商地區</h3><ul>
<li><p><strong>針對北美的部署</strong>：考慮使用 Cohere、VoyageAI、OpenAI/Azure 或 GCP Vertex AI，並自行進行效能驗證。</p></li>
<li><p><strong>亞洲部署</strong>：認真考慮亞洲模型供應商，如 AliCloud Dashscope 或 SiliconFlow，它們提供更好的區域性能</p></li>
<li><p><strong>針對全球受眾</strong>：實施多區域路由或選擇具有全球分散基礎架構的提供商，以盡量減少跨區域延遲罰則</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3.質疑預設提供商的選擇</h3><p>OpenAI 的嵌入模型非常受歡迎，許多企業和開發人員都選擇它們作為預設選項。然而，我們的測試顯示，儘管 OpenAI 在市場上大受歡迎，但其延遲和穩定性充其量只能算是一般。使用您自己的嚴格基準來挑戰「最佳」供應商的假設 - 受歡迎程度並不總是與您特定使用個案的最佳效能相關。</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4.優化批次和分塊組態</h3><p>一種配置並不適用於所有模型或使用個案。由於不同的後端架構和批次策略，不同提供商的最佳批次大小和分塊長度有很大差異。考慮特定應用程式需求的吞吐量與延遲的權衡，有系統地使用不同的配置進行實驗，找出最佳效能點。</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5.實施策略性快取</h3><p>對於高頻查詢，請同時快取查詢文字及其產生的嵌入（使用 Redis 等解決方案）。隨後的相同查詢可直接使用快取，將延遲時間縮短至幾毫秒。這是最具成本效益和影響力的查詢延遲最佳化技術之一。</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6.考慮本地推理部署</h3><p>如果您對資料擷取延遲、查詢延遲和資料隱私有極高的要求，或是 API 調用成本過高，請考慮在本機部署嵌入模型進行推論。標準 API 計劃通常會有 QPS 限制、不穩定的延遲，以及缺乏 SLA 保證 - 這些限制對於生產環境來說可能會造成問題。</p>
<p>對於許多個人開發人員或小型團隊而言，缺乏企業級 GPU 似乎是本地部署高效能嵌入模型的障礙。然而，這並不表示要完全放棄本機推論。結合<a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face 的 text-embeddings-inference</a> 等高效能推論引擎，即使在 CPU 上執行中小型的嵌入模型，也能達到相當不錯的效能，甚至可能優於高延遲的 API 呼叫，尤其是對於大規模的離線嵌入產生。</p>
<p>這種方法需要仔細考慮成本、效能和維護複雜度之間的權衡。</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Milvus 如何簡化嵌入式工作流程<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，Milvus 不只是一個高效能向量資料庫，它也提供方便的嵌入功能介面，可將 OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AI 等全球各地不同供應商的熱門嵌入模型，無縫整合至您的向量搜尋管道中。</p>
<p>Milvus 的功能超越向量儲存與擷取，可簡化嵌入式整合：</p>
<ul>
<li><p><strong>高效向量管理</strong>：Milvus 是專為大量向量集合所打造的高效能資料庫，提供可靠的儲存、彈性索引選項 (HNSW、IVF、RaBitQ、DiskANN 等)，以及快速精確的擷取功能。</p></li>
<li><p><strong>流暢的提供者切換</strong>：Milvus 提供<code translate="no">TextEmbedding</code> Function 介面，讓您可以使用 API 金鑰設定函式，立即切換提供者或模型，並測量實際效能，而無需複雜的 SDK 整合。</p></li>
<li><p><strong>端對端資料管道</strong>：使用原始文字呼叫<code translate="no">insert()</code> ，Milvus 會在一次操作中自動嵌入並儲存向量，大幅簡化您的資料管道程式碼。</p></li>
<li><p><strong>從文字到結果的一次呼叫</strong>：使用文字查詢呼叫<code translate="no">search()</code> ，Milvus 可處理嵌入、搜尋及傳回結果 - 所有這些都只需要一次 API 呼叫。</p></li>
<li><p><strong>與提供者無關的整合</strong>：Milvus 抽象了提供者的實作細節；只要設定一次您的功能和 API 金鑰，就可以開始使用。</p></li>
<li><p><strong>開放原始碼生態系統相容性</strong>：無論您是透過我們內建的<code translate="no">TextEmbedding</code> Function、本機推理或其他方法產生嵌入，Milvus 都能提供統一的儲存與擷取功能。</p></li>
</ul>
<p>這創造了一個簡化的「資料輸入、洞察輸出」體驗，Milvus 在內部處理向量產生，讓您的應用程式碼更直接、更易維護。</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">總結：您的 RAG 系統需要的效能真相<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 性能的隱形殺手並非大多數開發人員正在尋找的地方。當團隊傾注資源在提示工程和 LLM 最佳化時，嵌入 API 延遲會悄悄地破壞使用者體驗，其延遲可能比預期的還要嚴重 100 倍。我們的綜合基準揭露了殘酷的現實：受歡迎並不代表效能優異，在許多情況下，地理位置比演算法的選擇更重要，本地推論有時會勝過昂貴的雲 API。</p>
<p>這些發現突顯了 RAG 最佳化的重要盲點。跨區域延遲懲罰、出乎意料的供應商效能排名，以及本地推論令人驚訝的競爭力，這些都不是邊緣案例，而是影響實際應用程式的生產現實。瞭解並衡量嵌入式 API 的效能，對於提供反應迅速的使用者體驗而言至關重要。</p>
<p>嵌入式提供者的選擇是 RAG 效能拼圖的關鍵一環。透過在實際部署環境中進行測試、選擇適合地理位置的供應商，並考慮本地推論等替代方案，您可以消除面向使用者的延遲的主要來源，並建立真正反應迅速的 AI 應用程式。</p>
