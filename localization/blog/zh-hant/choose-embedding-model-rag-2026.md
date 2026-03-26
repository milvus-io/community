---
id: choose-embedding-model-rag-2026.md
title: 如何為 2026 年的 RAG 選擇最佳嵌入模型：10 個模型對標
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: 我們在跨模式、跨語言、長文件和維度壓縮任務上測試了 10 種嵌入模型。看看哪一個適合您的 RAG 管道。
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR：</strong>我們測試了 10 種<a href="https://zilliz.com/ai-models">嵌入模型</a>，涵蓋公開基準所遺漏的四種生產情境：跨模態檢索、跨語言檢索、關鍵資訊檢索和尺寸壓縮。沒有任何單一模型可以贏得一切。Gemini Embedding 2 是最佳的全才。開放原始碼的 Qwen3-VL-2B 在跨模式任務上勝過封閉原始碼的 API。如果您需要壓縮尺寸以節省儲存空間，請選擇 Voyage Multimodal 3.5 或 Jina Embeddings v4。</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">為什麼 MTEB 不夠用來選擇嵌入模型？<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>大多數的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>原型都以 OpenAI 的 text-embedding-3-small 開始。它便宜、容易整合，而且對於英文文字擷取來說，它已經很好用了。但生產型的 RAG 很快就會超越它。您的管道會擷取圖片、PDF、多語言文件，純文字<a href="https://zilliz.com/ai-models">嵌入模型</a>已經不夠用了。</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB 排行榜</a>告訴您有更好的選擇。問題何在？MTEB 只測試單一語言的文字檢索。它並不包括跨模式檢索 (針對圖片集的文字查詢)、跨語言搜尋 (中文查詢尋找英文文件)、長文件精確度，也不包括當您為了節省<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a>的儲存空間而截斷<a href="https://zilliz.com/glossary/dimension">嵌入尺寸</a>時所損失的品質。</p>
<p>那麼您應該使用哪種嵌入模型呢？這取決於您的資料類型、語言、文件長度，以及您是否需要尺寸壓縮。我們建立了一個名為<strong>CCKM</strong>的基準，並測試了在 2025 年到 2026 年間發行的 10 種模型，測試的範圍正是這些維度。</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">什麼是 CCKM 基準？<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong>(跨模式、跨語言、關鍵資訊、MRL) 測試標準基準所遺漏的四種能力：</p>
<table>
<thead>
<tr><th>維度</th><th>測試內容</th><th>為何重要</th></tr>
</thead>
<tbody>
<tr><td><strong>跨模式檢索</strong></td><td>在出現近乎相同的分心物時，將文字描述與正確的影像相匹配</td><td><a href="https://zilliz.com/learn/multimodal-rag">多模態 RAG</a>管道需要在相同向量空間中嵌入文字和影像</td></tr>
<tr><td><strong>跨語言檢索</strong></td><td>從中文查詢找出正確的英文文件，反之亦然</td><td>生產知識庫通常是多語言的</td></tr>
<tr><td><strong>關鍵資訊檢索</strong></td><td>找出埋藏在 4K-32K 字元文件中的特定事實 (大海撈針)</td><td>RAG 系統經常處理長文件，例如合約和研究論文</td></tr>
<tr><td><strong>MRL 尺寸壓縮</strong></td><td>測量當您將內嵌截斷到 256 維時，模型會損失多少品質</td><td>更少的維度 = 更低的向量資料庫儲存成本，但要付出什麼品質代價？</td></tr>
</tbody>
</table>
<p>MTEB 沒有涵蓋這些。MMEB 增加了多模態，但跳過了硬負值，因此模型得分很高，卻無法證明它們能處理細微的區別。CCKM 旨在涵蓋它們遺漏的部分。</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">我們測試了哪些嵌入模型？Gemini Embedding 2、Jina Embeddings v4 及其他<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>我們測試了 10 種模型，涵蓋 API 服務和開源選項，加上 CLIP ViT-L-14 作為 2021 年的基準。</p>
<table>
<thead>
<tr><th>型號</th><th>來源</th><th>參數</th><th>尺寸</th><th>模式</th><th>關鍵特徵</th></tr>
</thead>
<tbody>
<tr><td>雙子座嵌入 2</td><td>谷歌</td><td>未公開</td><td>3072</td><td>文字/影像/視訊/音訊/PDF</td><td>全模式、最廣覆蓋</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>文字/影像/PDF</td><td>MRL + LoRA 適配器</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>未公開</td><td>1024</td><td>文字/圖片/視訊</td><td>平衡各種任務</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>阿里巴巴 Qwen</td><td>2B</td><td>2048</td><td>文字/圖像/視頻</td><td>開放源碼、輕量級多模態</td></tr>
<tr><td>吉納 CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>文字/影像</td><td>現代化 CLIP 架構</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>未公開</td><td>固定式</td><td>文字</td><td>企業檢索</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>未公開</td><td>3072</td><td>文字</td><td>最廣泛使用</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>文字</td><td>開放原始碼，100 種以上語言</td></tr>
<tr><td>mxbai-embed-large</td><td>混合麵包 AI</td><td>335M</td><td>1024</td><td>文字</td><td>輕量級，以英文為主</td></tr>
<tr><td>Nomic-embed-text</td><td>Nomic AI</td><td>137M</td><td>768</td><td>文字</td><td>超輕量級</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>文字/影像</td><td>基線</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">跨模式檢索：哪些模型可以處理文字到影像的搜尋？<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您的 RAG 管道在處理文字的同時也處理圖片，則嵌入模型需要將兩種模式放置在相同的<a href="https://zilliz.com/glossary/vector-embeddings">向量空間</a>中。想想電子商務圖片搜尋、混合圖片與文字的知識庫，或是任何文字查詢需要找到正確圖片的系統。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我們從 COCO val2017 中取得 200 個圖像-文字對。對於每張圖片，GPT-4o-mini 都會產生詳細的描述。然後，我們為每張圖片寫了 3 個硬負值 - 與正確的描述只差一或兩個細節。模型必須在 200 張圖片和 600 個分心物中找到正確的匹配。</p>
<p>資料集中的一個範例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>復古的棕色皮箱上貼著加州和古巴的旅遊貼紙，放在金屬行李架上，背景是藍色的天空 - 用作跨模態檢索基準的測試影像。</span> </span></p>
<blockquote>
<p><strong>正確的描述：</strong>這張圖片的特色是棕色的復古皮革行李箱，上面貼有各種旅行貼紙，包括「加州」、「古巴」和「紐約」，在晴朗藍天的映照下，行李箱被放置在金屬行李架上。</p>
<p><strong>硬負片：</strong>同樣的句子，但 「加州 」變成了 「佛羅里達」，「藍天 」變成了 「陰天」。模特必須真正理解圖像細節，才能區分這些。</p>
</blockquote>
<p><strong>評分：</strong></p>
<ul>
<li>為所有圖片和所有文字產生<a href="https://zilliz.com/glossary/vector-embeddings">嵌入</a>（200 個正確描述 + 600 個硬性否定）。</li>
<li><strong>文字到影像 (t2i)：</strong>每個描述搜尋 200 張圖片，找出最接近的匹配。如果頂端結果是正確的，就得一分。</li>
<li><strong>Image-to-text (i2t)：</strong>每張圖片搜尋所有 800 個文字，找出最接近的符合項目。只有當頂端結果是正確的描述，而不是硬負值時，才會得分。</li>
<li><strong>最終得分：</strong>hard_avg_R@1 = (t2i 準確度 + i2t 準確度) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>橫條圖顯示跨模式檢索排名：Qwen3-VL-2B 以 0.945 領先，Gemini Embed 2 以 0.928 緊隨其後，Voyage MM-3.5 以 0.900 緊隨其後，Jina CLIP v2 以 0.873 緊隨其後，CLIP ViT-L-14 以 0.768 緊隨其後。</span> </span></p>
<p>阿里巴巴 Qwen 團隊的開源 2B 參數模型 Qwen3-VL-2B 排在第一位，領先所有封閉源 API。</p>
<p><strong>模態差距</strong>解釋了大部分的差異。嵌入模型將文字和圖像映射到相同的向量空間，但實際上這兩種模態往往會聚集在不同的區域。模態差距量測這兩個群集之間的 L2 距離。差距越小 = 跨模態檢索越容易。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>可視化比較大模態差距 (0.73，文字和影像嵌入叢集相距甚遠) 和小模態差距 (0.25，叢集重疊) - 較小的差距使跨模態匹配更容易</span> </span></p>
<table>
<thead>
<tr><th>模式</th><th>得分 (R@1)</th><th>模態差距</th><th>參數</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (開放原始碼)</td></tr>
<tr><td>雙子座嵌入 2</td><td>0.928</td><td>0.73</td><td>未知 (封閉)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>未知（已關閉）</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwen 的模態差距為 0.25 - 大約是 Gemini 的 0.73 的三分之一。在<a href="https://milvus.io/">Milvus</a> 這樣的<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫中</a>，較小的模態差距表示您可以將文字和影像嵌入資料儲存在同一<a href="https://milvus.io/docs/manage-collections.md">個集合</a>中，並直接在兩者之間進行<a href="https://milvus.io/docs/single-vector-search.md">搜尋</a>。如果差距太大，跨模式<a href="https://zilliz.com/glossary/similarity-search">相似性搜尋的</a>可靠性就會降低，您可能需要重新排序的步驟來補償。</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">跨語言檢索：哪些模型能使不同語言的意義一致？<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>多語言知識庫在生產中很常見。使用者用中文提出問題，但答案卻在英文文件中，或相反的情況。嵌入模型需要對齊跨語言的意義，而不僅僅是一種語言內的意義。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我們建立了 166 個中英文平行句對，分為三種難度等級：</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>跨語言難度級別：Easy tier 映射直譯如 I love you；Medium tier 映射意譯句子如 This 道菜太咸了 to This dish is too salty with hard negatives；Hard tier 映射中文成語如畫蛇添足 to gilding the lily with semantically different hard negatives。</span> </span></p>
<p>每種語言也有 152 個硬負面分心詞。</p>
<p><strong>評分：</strong></p>
<ul>
<li>產生所有中文文字 (166 個正確 + 152 個分心詞) 和所有英文文字 (166 個正確 + 152 個分心詞) 的嵌入。</li>
<li><strong>中文 → 英文：</strong>每個中文句子搜尋 318 個英文文字，以尋找正確的翻譯。</li>
<li><strong>英文 → 中文：</strong>反過來也是一樣。</li>
<li><strong>最終得分：</strong>hard_avg_R@1 = (zh→en 準確度 + en→zh 準確度) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>橫條圖顯示跨語言擷取排名：Gemini Embed 2 以 0.997 分領先，其次是 Qwen3-VL-2B 的 0.988 分、Jina v4 的 0.985 分、Voyage MM-3.5 的 0.982 分，再往下是 mxbai 的 0.120 分。</span> </span></p>
<p>Gemini Embedding 2 得分 0.997，是所有測試機種中最高的。Gemini Embedding 2 是唯一一個在 Hard tier 獲得 1.000 高分的模型，在 Hard tier 中，像「畫蛇添足」→「錦上添花」這樣的詞對需要跨語言的真正<a href="https://zilliz.com/glossary/semantic-search">語義</a>理解，而不是模式匹配。</p>
<table>
<thead>
<tr><th>模式</th><th>得分 (R@1)</th><th>容易</th><th>中</th><th>困難 (成語)</th></tr>
</thead>
<tbody>
<tr><td>雙子星嵌入 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-large</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>前 7 個模型的總分都是 0.93 - 真正的差異發生在 Hard tier (中文成語)。nomic-embed-text 和 mxbai-embed-large，都是以英文為重點的輕量級模型，在跨語言任務上的得分接近零。</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">關鍵資訊檢索：模型能在 32K 代碼的文件中找到針頭嗎？<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 系統通常會處理冗長的文件 - 法律合約、研究論文、包含<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料的</a>內部報告。問題是嵌入模型是否仍能找到埋藏在數千個字元周圍文字中的一個特定事實。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我們將不同長度 (4K 到 32K 字元) 的維基百科文章當成乾草堆，並在不同的位置插入單一捏造的事實 - 針 - 在開始、25%、50%、75% 和結束的位置。模型必須根據查詢嵌入來判斷哪個版本的文件包含這根針。</p>
<p><strong>範例：</strong></p>
<ul>
<li><strong>針：</strong>「Meridian Corporation 在 2025 年第三季的季度營收為 8.473 億美元」。</li>
<li><strong>查詢：</strong>「Meridian Corporation 的季度收入是多少？」</li>
<li><strong>Haystack：</strong>一篇 32,000 字的維基百科文章，內容是關於光合作用的，針就藏在裡面某個地方。</li>
</ul>
<p><strong>評分：</strong></p>
<ul>
<li>為查詢、有針的文件和沒有針的文件產生嵌入。</li>
<li>如果查詢與包含針的文件更相似，則將其計為命中。</li>
<li>所有文件長度與針狀位置的平均精確度。</li>
<li><strong>最終指標：</strong>overall_accuracy 和 degradation_rate（從最短的文件到最長的文件，精確度下降的程度）。</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>按文件長度顯示大海撈針精確度的熱圖：Gemini Embed 2 在 32K 以內的所有長度中得分 1.000；前 7 個模型在其上下文視窗中得分完美；mxbai 和 nomic 在 4K+ 時準確度急劇下降。</span> </span></p>
<p>Gemini Embedding 2 是唯一在 4K-32K 完整範圍內進行測試的機型，它在每個長度上都獲得滿分。本測試中沒有其他機型的上下文視窗達到 32K。</p>
<table>
<thead>
<tr><th>機型</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>整體</th><th>降級</th></tr>
</thead>
<tbody>
<tr><td>雙子星嵌入 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-大型</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina 嵌入 v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage 多式聯運 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>嵌入式文字 (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-"表示文件長度超出模型的上下文視窗。</p>
<p>前 7 個模型的得分完全符合其上下文視窗。BGE-M3 在 8K 時開始下滑 (0.920)。輕量級模型 (mxbai 和 nomic) 在僅僅 4K 字元（大約 1,000 個字元）時就降至 0.4-0.6。對於 mxbai 而言，這個下降部分反映了它的 512 字元上下文視窗截斷了大部分的文件。</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRL 尺寸壓縮：256 維度會損失多少品質？<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka Representation Learning (MRL)</strong>是一種訓練技術，可以讓向量的前 N 個維度本身變得有意義。將一個 3072 維的向量截短至 256 維，它仍能保持大部分的語意品質。更少的維度意味著<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a>的儲存和記憶體成本更低 - 從 3072 維到 256 維，儲存空間減少了 12 倍。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>顯示 MRL 尺寸截斷的插圖：全品質的 3072 維、95% 的 1024 維、90% 的 512 維、85% 的 256 維 - 256 維可節省 12 倍的儲存空間。</span> </span></p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我們使用 STS-B 基準中的 150 個句子對，每個句子對都有一個人類註解的相似性分數 (0-5)。對於每個模型，我們以完整的維度產生嵌入，然後截斷為 1024、512 和 256。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>STS-B 資料範例顯示具有人類相似性評分的句子對：A girl is styling her hair vs A girl is brushing her hair 得 2.5 分；A group of men play soccer on the beach vs A group of boys are playing soccer on the beach 得 3.6 分。</span> </span></p>
<p><strong>計分：</strong></p>
<ul>
<li>在每個維度層級，計算每個句子對的嵌入之間的<a href="https://zilliz.com/glossary/cosine-similarity">余弦相似度</a>。</li>
<li>使用<strong>Spearman's ρ</strong>(rank correlation) 比較模型的相似度排名與人類的排名。</li>
</ul>
<blockquote>
<p><strong>什麼是 Spearman ρ？</strong>它測量兩個排序的一致程度。如果人類將 A 排序為最相似，B 排序第二，C 排序最不相似 - 而模型的余弦相似度產生相同的順序 A &gt; B &gt; C - 那麼 ρ 接近 1.0。ρ 為 1.0 表示完全一致。ρ 為 0 表示沒有相關性。</p>
</blockquote>
<p><strong>最終指標：</strong>spearman_rho（越高越好）和 min_viable_dim（質量維持在全維表現 5% 以內的最小維度）。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>點陣圖顯示 MRL 全尺寸 vs 256 尺寸品質：Voyage MM-3.5 以 +0.6% 的變化領先，Jina v4 +0.5%，而 Gemini Embed 2 則顯示 -0.6% 的變化在最下方。</span> </span></p>
<p>如果您打算透過截斷維度來降低<a href="https://milvus.io/">Milvus</a>或其他向量資料庫的儲存成本，這個結果很重要。</p>
<table>
<thead>
<tr><th>模型</th><th>ρ (全尺寸)</th><th>ρ (256 dim)</th><th>衰減</th></tr>
</thead>
<tbody>
<tr><td>航程多模式 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>嵌入式文字 (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>雙子座嵌入 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage 和 Jina v4 領先，因為兩者都明確以 MRL 作為訓練目標。維度壓縮與模型大小關係不大，重要的是模型是否經過訓練。</p>
<p>關於 Gemini 得分的說明：MRL 排名反映的是模型在截斷後的品質保持程度，而非其全尺寸檢索的優異程度。Gemini 的全維檢索能力很強 - 跨語言和關鍵資訊的結果已經證明了這一點。它只是沒有針對縮小進行最佳化。如果您不需要縮小維度，這個指標就不適用於您。</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">您應該使用哪種嵌入模型？<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>沒有任何單一模型可以贏得一切。以下是完整的計分卡：</p>
<table>
<thead>
<tr><th>模型</th><th>參數</th><th>跨模式</th><th>跨語言</th><th>關鍵資訊</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>雙子星嵌入 2</td><td>未公開</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>航程多式聯運 3.5</td><td>未披露</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>吉納嵌入式 v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-大型</td><td>未披露</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>未公開</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>嵌入式文字</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-"表示模型不支援該模式或能力。CLIP 是供參考的 2021 基線。</p>
<p>以下是最突出的部分：</p>
<ul>
<li><strong>跨模式：</strong>Qwen3-VL-2B (0.945) 第一，Gemini (0.928) 第二，Voyage (0.900) 第三。開放原始碼的 2B 模型擊敗了所有封閉原始碼的 API。決定因素是模式差距，而非參數數量。</li>
<li><strong>跨語言：</strong>Gemini (0.997) 遙遙領先 - 這是唯一一個在成語級對齊上獲得滿分的模型。前 8 個模型都達到 0.93。純英文的輕量級模型得分接近零。</li>
<li><strong>關鍵資訊：</strong>API 和大型開放原始碼模型在 8K 以內得分完美。低於 335M 的模型在 4K 時開始下降。Gemini 是唯一能以滿分處理 32K 的模型。</li>
<li><strong>MRL 尺寸壓縮：</strong>Voyage (0.880) 和 Jina v4 (0.833) 領先，在 256 維時損失不到 1%。Gemini (0.668) 排在最後 - 在全尺寸時表現強勁，但未針對截斷進行最佳化。</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">如何選擇：決策流程圖</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>嵌入模型選擇流程圖：開始 → 需要圖片或視訊？→ 是：需要自行託管？→ 是：Qwen3-VL-2B, No: Gemini Embedding 2.無影像 → 需要節省儲存空間？→ 是：Jina v4 或 Voyage，否：需要多語言？→ 是：Gemini Embedding 2，否：OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">最佳全能型產品：雙子座嵌入式 2</h3><p>總的來說，Gemini Embedding 2 是本基準中整體性能最強的機型。</p>
<p><strong>優勢：</strong>在跨語言 (0.997) 和關鍵資訊檢索 (1.000 跨所有長度，最大 32K)方面排名第一。跨模式 (0.928) 排名第二。最廣泛的模式涵蓋範圍 - 五種模式 (文字、圖片、視訊、音訊、PDF)，而大多數模型最多只能涵蓋三種模式。</p>
<p><strong>弱點：</strong>在 MRL 壓縮中排名最末 (ρ = 0.668)。在跨模組方面被開放原始碼的 Qwen3-VL-2B 擊敗。</p>
<p>如果您不需要維度壓縮，Gemini 在跨語言 + 長文件檢索的組合上並沒有真正的競爭對手。但對於跨模式精確度或儲存最佳化，專門的模型會做得更好。</p>
<h2 id="Limitations" class="common-anchor-header">限制<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>我們沒有把所有值得考慮的模型都包括在內 - NVIDIA 的 NV-Embed-v2 和 Jina 的 v5-text 都在名單上，但沒有進入這一輪。</li>
<li>我們著重於文字和圖像模式；視訊、音訊和 PDF 嵌入 (儘管有些機型聲稱支援) 並未包括在內。</li>
<li>程式碼檢索和其他特定領域的情況不在範圍內。</li>
<li>樣本規模相對較小，因此模型之間的緊密排名差異可能屬於統計噪音。</li>
</ul>
<p>這篇文章的結果在一年內就會過時。新機型不斷出貨，排行榜也會隨著每次發佈而重新洗牌。更持久的投資是建立您自己的評估管道 - 定義您的資料類型、查詢模式、文件長度，並在新模型出現時透過您自己的測試來執行。像 MTEB、MMTEB 和 MMEB 這樣的公開基準值得監督，但最終的決定應該來自您自己的資料。</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">我們的基準程式碼在 GitHub 上是開放原始碼的</a>- fork 它並將其調整為您的使用情況。</p>
<hr>
<p>一旦您選定了嵌入模型，您就需要一個地方來儲存和大規模搜尋這些向量。<a href="https://milvus.io/">Milvus</a>是全球最廣泛採用的開放原始碼向量資料庫，<a href="https://github.com/milvus-io/milvus">GitHub 上有 43K+ 顆星星</a>，就是為了這個目的而建立的 - 它支援 MRL 截斷維度、混合多模態集合、結合密集與稀疏向量的混合搜尋，<a href="https://milvus.io/docs/architecture_overview.md">並可從一台筆記型電腦擴充至數十億個向量</a>。</p>
<ul>
<li>使用<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門指南</a>開始使用，或使用<code translate="no">pip install pymilvus</code> 安裝。</li>
<li>加入<a href="https://milvusio.slack.com/">Milvus Slack</a>或<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>，詢問有關嵌入模型整合、向量索引策略或生產擴充的問題。</li>
<li><a href="https://milvus.io/office-hours">預約免費的 Milvus Office Hours 會話</a>，了解您的 RAG 架構 - 我們可以在模型選擇、集合模式設計和效能調整方面提供協助。</li>
<li>如果您想跳過基礎架構的工作，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理的 Milvus) 提供免費的層級來開始使用。</li>
</ul>
<hr>
<p>工程師為生產 RAG 選擇嵌入模型時會遇到的幾個問題：</p>
<p><strong>問：即使我現在只有文字資料，我應該使用多模態嵌入模型嗎？</strong></p>
<p>這取決於您的發展藍圖。如果您的管道可能會在未來 6-12 個月內加入圖片、PDF 或其他模式，那麼從 Gemini Embedding 2 或 Voyage Multimodal 3.5 之類的多模式模型開始，可以避免日後痛苦的遷移 - 您不需要重新嵌入整個資料集。如果您有信心在可預見的未來只使用文字，則 OpenAI 3-large 或 Cohere Embed v4 等以文字為重點的模式會讓您獲得更高的性價比。</p>
<p><strong>問：在向量資料庫中，MRL 維度壓縮實際上可以節省多少儲存空間？</strong></p>
<p>從 3072 個維度到 256 個維度，每個向量的儲存空間減少了 12 倍。對於一個有 1 億向量、使用 float32 的<a href="https://milvus.io/">Milvus</a>資料庫而言，大約是 1.14 TB → 95 GB。關鍵是並非所有模型都能很好地處理截斷 - Voyage Multimodal 3.5 和 Jina Embeddings v4 在 256 維時的品質損失不到 1%，而其他模型則會大幅降低。</p>
<p><strong>問：Qwen3-VL-2B 真的比 Gemini Embedding 2 更適合跨模組搜尋嗎？</strong></p>
<p>在我們的基準上，是的 - Qwen3-VL-2B 的得分是 0.945，而 Gemini 的得分是 0.928。主要原因是 Qwen 的模態差距較小（0.25 對 0.73），這表示文字與圖像<a href="https://zilliz.com/glossary/vector-embeddings">嵌入</a>在向量空間中的聚類較接近。儘管如此，Gemini 涵蓋五種模式，而 Qwen 涵蓋三種模式，因此如果您需要音訊或 PDF 嵌入，Gemini 是唯一的選擇。</p>
<p><strong>問：我可以直接在 Milvus 中使用這些嵌入模型嗎？</strong></p>
<p>可以。所有這些模型都會輸出標準的浮點向量，您可以將它<a href="https://milvus.io/docs/insert-update-delete.md">插入 Milvus</a>並使用<a href="https://zilliz.com/glossary/cosine-similarity">余弦相似度</a>、L2 距離或內乘積進行搜尋。<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>適用於任何嵌入模型 - 使用模型的 SDK 產生向量，然後儲存並在 Milvus 中搜尋。對於 MRL 截斷的向量，只要在<a href="https://milvus.io/docs/manage-collections.md">建立</a>集合時，將集合的維度設定為您的目標值 (例如 256)。</p>
