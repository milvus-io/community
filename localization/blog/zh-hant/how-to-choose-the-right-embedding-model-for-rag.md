---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 從 Word2Vec 到 LLM2Vec：如何為 RAG 選擇正確的嵌入模型
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: 本部落格將帶您了解如何在實務中評估嵌入式，以便您選擇最適合您的 RAG 系統。
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>大型語言模型功能強大，但也有眾所皆知的弱點：幻覺。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a>是解決這個問題最有效的方法之一。RAG 並非完全依賴模型的記憶，而是從外部來源擷取相關知識，並將其納入提示中，以確保答案以真實資料為基礎。</p>
<p>RAG 系統通常由三個主要部分組成：LLM 本身、<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>(例如用於儲存和搜尋資訊的<a href="https://milvus.io/">Milvus</a>) 以及嵌入模型。嵌入模型將人類語言轉換為機器可讀取的向量。將它視為自然語言與資料庫之間的翻譯器。這個翻譯器的品質決定了擷取內容的相關性。做對了，使用者就能看到精確、有用的答案。如果做錯，即使是最好的基礎架構也會產生雜訊、錯誤和浪費運算。</p>
<p>這就是了解嵌入模型如此重要的原因。有許多模型可供選擇，從早期的 Word2Vec 到現代基於 LLM 的模型，例如 OpenAI 的文字嵌入系列。每種方法都有自己的優缺點。本指南將為您釐清雜亂的資訊，並教您如何在實務中評估嵌入，讓您可以選擇最適合您的 RAG 系統。</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">嵌入式是什麼，為什麼重要？<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>在最簡單的層面上，嵌入式將人類的語言轉換成機器可以理解的數字。每個字、句子或文件都會映射到一個高維向量空間，向量之間的距離可以捕捉它們之間的關係。意思相近的文字往往會聚集在一起，而毫不相干的內容則會相距較遠。這就是語意搜尋得以實現的原因 - 尋找意義，而不只是匹配關鍵字。</p>
<p>嵌入模型的運作方式不盡相同。它們通常可分為三類，每類都有其優點和缺點：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>稀疏向量</strong></a>（如 BM25）著重於關鍵字頻率和文件長度。它們對於明確的匹配很有幫助，但對於同義詞和上下文則視而不見--「AI」和「人工智慧」看起來毫無關聯。</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>密集向量</strong></a>（如 BERT 所產生的<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>向量</strong></a>）則能捕捉更深層的語意。即使沒有共用關鍵字，他們也能看出「Apple 發表新電話」與「iPhone 產品上市」有關。其缺點是較高的計算成本和較低的可解釋性。</p></li>
<li><p><strong>混合模型</strong>（例如 BGE-M3）則結合了兩者。它們可以同時產生稀疏、稠密或多向量表示法 - 保留關鍵字搜尋的精確度，同時也能捕捉語意上的細微差異。</p></li>
</ul>
<p>實際上，選擇取決於您的使用情況：稀疏向量代表速度和透明度，密集向量代表更豐富的意義，而混合向量則代表您想要兩者兼得。</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">評估嵌入模型的八大關鍵因素<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 上下文視窗</strong></h3><p><a href="https://zilliz.com/glossary/context-window"><strong>上下文視窗</strong></a>決定了模型一次可處理的文字量。由於一個符記大約是 0.75 個字，這個數字直接限制了模型在建立嵌入時可以「看到」多長的段落。大的視窗可以讓模型捕捉到較長文件的整體意義；小的視窗則會迫使您將文字切成較小的片段，冒著失去有意義的上下文的風險。</p>
<p>舉例來說，OpenAI 的<a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>text-embedding-ada-002</em></a>支援高達 8,192 個標記，足以涵蓋整篇研究論文，包括摘要、方法與結論。相比之下，只有 512 個代碼視窗的模型 (例如<em>m3e-base</em>)，需要頻繁截斷，這可能會導致關鍵細節的遺失。</p>
<p>啟示：如果您的使用個案涉及長文件，例如法律文件或學術論文，請選擇具有 8K 以上代幣視窗的模型。對於較短的文字，例如客戶支援聊天，2K 的標記視窗可能就足夠了。</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header"><strong>#2</strong>標記化單元</h3><p>在產生嵌入式之前，必須先將文字分割成較小的區塊，稱為<strong>標記</strong>。如何進行標記化會影響模型處理罕見字、專業詞彙和專門領域的能力。</p>
<ul>
<li><p><strong>子字標記化 (BPE)：</strong>將單字分割成較小的部分 (例如：「unhappiness」→「un」+「happiness」)。這是現代 LLM（例如 GPT 和 LLaMA）的預設設定，對於詞彙量不足的詞彙效果很好。</p></li>
<li><p><strong>WordPiece：</strong>BERT 所使用的 BPE 的改良版，旨在更好地平衡詞彙覆蓋率與效率。</p></li>
<li><p><strong>字級標記化：</strong>僅以整字分割。它很簡單，但在處理罕見或複雜的術語時很吃力，因此不適合技術領域。</p></li>
</ul>
<p>對於醫學或法律等專業領域，以子字為基礎的模型通常是最好的--它們可以正確處理<em>心肌梗塞</em>或<em>代位權等術語</em>。有些現代模型，例如<strong>NV-Embed</strong>，更進一步增加了潛在注意力層等增強功能，這些增強功能可以強化標記化擷取複雜、特定領域詞彙的方式。</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 維度</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>向量維度</strong></a>指的是嵌入向量的長度，它決定了模型可以捕捉多少語意細節。較高的維度 (例如 1,536 或更高) 可以更細緻地區分概念，但代價是增加儲存空間、減慢查詢速度以及提高運算需求。較低的維度 (例如 768) 速度較快、成本較低，但卻有可能失去微妙的意義。</p>
<p>關鍵在於平衡。對於大多數的一般用途應用程式而言，768-1,536 尺寸是效率與精確度的最佳組合。對於要求高精確度的任務 (例如學術或科學搜尋)，超過 2,000 維度是值得的。另一方面，資源有限的系統 (例如邊緣部署) 可以有效地使用 512 維度，但前提是檢索品質必須經過驗證。在某些輕量級推薦或個人化系統中，甚至更小的維度也可能足夠。</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 詞彙大小</h3><p>模型的<strong>詞彙大小</strong>是指其標記器能夠識別的唯一標記的數量。這會直接影響其處理不同語言和特定領域術語的能力。如果詞彙庫中沒有某個詞或字，它就會被標記為<code translate="no">[UNK]</code> ，這可能會導致意義丟失。</p>
<p>不同的使用情況有不同的需求。多語言情境通常需要較大的詞彙--50k以上的詞彙，就像<a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a> 的情況一樣。對於特定領域的應用程式，專門詞彙的涵蓋範圍是最重要的。舉例來說，法律模型應該支援<em>「時效」</em>或<em>「善意取得</em>」等詞彙，而中文模型則必須顧及數以千計的字元和獨特的標點符號。如果沒有足夠的詞彙涵蓋範圍，嵌入的準確性很快就會崩潰。</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 訓練資料</h3><p><strong>訓練資料</strong>定義了嵌入模型 「知道 」什麼的界限。在廣泛的通用資料上訓練出來的模型，例如<em>text-embedding-ada-002</em>，它混合使用了網頁、書籍和維基百科，在不同領域都有良好的表現。但是當您需要專業領域的精確度時，經過領域訓練的模型通常會勝出。舉例來說，<em>LegalBERT</em>和<em>BioBERT</em>在法律和生物醫學文字上的表現優於一般模型，雖然它們會失去一些泛化能力。</p>
<p>經驗法則</p>
<ul>
<li><p><strong>一般情況</strong>→ 使用在廣泛資料集上訓練的模型，但請確保這些資料集涵蓋您的目標語言。例如，中文應用程式需要在豐富的中文語料集上訓練的模型。</p></li>
<li><p><strong>垂直領域</strong>→ 選擇特定領域的模型以獲得最佳精確度。</p></li>
<li><p><strong>兩全其美</strong>→ 較新的模型如<strong>NV-Embed</strong>，使用一般和特定領域的資料分兩階段訓練，在泛化<em>和</em>領域精確度方面都有不錯的表現。</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 成本</h3><p>成本不只是 API 定價，也包括<strong>經濟成本</strong>和<strong>計算成本</strong>。託管式 API 模型，例如 OpenAI 所提供的模型，是以使用量為基礎的：您只需為每次呼叫付費，而無需擔心基礎架構。這讓它們成為快速原型、試用專案或中小型工作負載的完美選擇。</p>
<p><em>BGE</em>或<em>Sentence-BERT</em> 等開放原始碼選項可自由使用，但需要自行管理基礎架構，通常是 GPU 或 TPU 集群。它們更適合大規模生產，長期的節省與彈性可抵銷一次性的設定與維護成本。</p>
<p>實用心得：<strong>API 模型是快速迭代的理想選擇</strong>，而<strong>開放原始碼模型在</strong>考慮到總擁有成本 (TCO) 之後，<strong>通常會在大規模生產中獲勝</strong>。選擇正確的路徑取決於您是否需要快速上市或長期控制。</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 MTEB 得分</h3><p><a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a>是比較嵌入模型最廣泛使用的標準。它評估各種任務的效能，包括語意搜尋、分類、聚類等。分數越高，通常表示模型在不同類型的任務上有更強的通用性。</p>
<p>儘管如此，MTEB 並非萬靈丹。一個整體得分很高的模型在您的特定使用個案中可能仍然表現不佳。舉例來說，一個主要以英文訓練的模型可能在 MTEB 基準上表現優異，但在處理專門的醫療文字或非英文資料時就會很吃力。安全的做法是使用 MTEB 作為起點，然後在投入之前使用<strong>您自己的資料集來驗證</strong>。</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 特定領域</h3><p>有些模型是專為特定情境所建立的，它們會在一般模型不足的地方大放異彩：</p>
<ul>
<li><p><strong>法律：</strong> <em>LegalBERT</em>可以區分細粒度的法律術語，例如<em>辯護</em>與<em>管轄權</em>。</p></li>
<li><p><strong>生物醫學：</strong> <em>BioBERT</em>可準確處理<em>mRNA</em>或<em>靶向療法</em>等專業術語。</p></li>
<li><p><strong>多語言：</strong> <em>BGE-M3</em>支援超過 100 種語言，非常適合需要銜接英文、中文和其他語言的全球應用程式。</p></li>
<li><p><strong>程式碼檢索：</strong> <em>Qwen3-Embedding</em>在<em>MTEB-Code</em> 獲得最高分 (81.0+) ，針對程式相關查詢進行最佳化。</p></li>
</ul>
<p>如果您的使用案例屬於這些領域之一，經過領域最佳化的模型可以大幅提升檢索準確度。但對於更廣泛的應用程式，除非您的測試顯示有其他用途，否則請堅持使用一般用途的模型。</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">評估嵌入式的其他觀點<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>除了這八個核心因素之外，如果您想要進行更深入的評估，還有其他幾個角度值得考慮：</p>
<ul>
<li><p><strong>多語言對齊</strong>：對於多語言模型來說，僅僅支援多種語言是不夠的。真正的考驗是向量空間是否對齊。換句話說，語義上相同的字詞，例如英文的「cat」和西班牙文的「gato」，在向量空間中是否很接近？強對齊可確保一致的跨語言檢索。</p></li>
<li><p><strong>對抗測試</strong>：一個好的嵌入模型應該能在小的輸入變化下保持穩定。透過輸入幾乎完全相同的句子 (例如：「貓坐在墊子上」與「貓坐在墊子上」)，您可以測試結果向量是否有合理的移動或大幅波動。擺動幅度大通常表示穩健性弱。</p></li>
<li><p><strong>局部語意一致性</strong>是指測試語意相似的字詞是否緊密地聚集在局部鄰域的現象。舉例來說，給出「銀行」這樣的詞彙，模型應該將相關的詞彙 (例如「河岸」和「金融機構」) 適當地歸類，而將不相關的詞彙保持一段距離。衡量「侵入性」或不相干的詞彙滲入這些區域的頻率，有助於比較模型品質。</p></li>
</ul>
<p>這些觀點在日常工作中並不總是必需的，但在多語言、高精確度或敵對穩定性非常重要的生產系統中，這些觀點對嵌入的壓力測試很有幫助。</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">常見的嵌入模型：簡史<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>嵌入模型的故事實際上是機器如何隨著時間的推移學習更深入地理解語言的故事。每一代都突破了前一代的極限，從靜態的字詞表達發展到今天可以捕捉細微上下文的大型語言模型 (LLM) 嵌入。</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec：起點 (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Google 的 Word2Vec</a>是使嵌入式廣泛實用化的第一個突破。它是基於語言學中的<em>分佈假設 (distributional hypothesis</em>)--即在類似上下文中出現的字詞通常具有相同的意義。透過分析大量的文字，Word2Vec 將文字映射到向量空間中，在這個空間中，相關的詞彙會緊挨在一起。舉例來說，「美洲豹」和「豹」因為有共同的棲息地和狩獵特徵而聚集在一起。</p>
<p>Word2Vec 有兩種版本：</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words)：</strong>從周遭上下文預測遺漏的字詞。</p></li>
<li><p><strong>Skip-Gram：</strong>反過來從目標單字預測周遭的單字。</p></li>
</ul>
<p>這種簡單但功能強大的方法允許優雅的類比，例如......：</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>在當時，Word2Vec 是革命性的。但它有兩個重大的限制。首先，它是<strong>靜態的</strong>：每個單詞只有一個向量，因此「銀行」無論是靠近「錢」或「河流」都是同樣的意思。其次，它只在<strong>單字層面上</strong>運作，句子和文件都在它的範圍之外。</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT：變形革命 (2018)</h3><p>如果說 Word2Vec 為我們提供了第一張意義地圖，那麼<a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong></a>則為我們重新繪製了一張詳細得多的意義地圖。BERT 於 2018 年由 Google 發佈，將 Transformer 架構引入嵌入式，標誌著<em>深度語義理解</em>時代的開始。與早期的 LSTM 不同，Transformers 可以同時從兩個方向檢查序列中的所有單詞，從而實現遠為豐富的上下文。</p>
<p>BERT 的神奇之處來自於兩個巧妙的預先訓練任務：</p>
<ul>
<li><p><strong>遮蔽語言建模 (MLM)：</strong>隨機隱藏句子中的單字，強迫模型預測這些單字，教它從上下文推斷意思。</p></li>
<li><p><strong>下一個句子預測 (NSP)：</strong>訓練模型判斷兩個句子是否彼此相連，幫助它學習句子之間的關係。</p></li>
</ul>
<p>在引擎蓋下，BERT 的輸入向量結合了三個元素：標記嵌入（單詞本身）、句段嵌入（它屬於哪個句子）和位置嵌入（它在序列中的位置）。這些元素的結合使 BERT 有能力捕捉<strong>句子</strong>和<strong>文件</strong>層級的複雜語義關係。這一躍進使 BERT 成為問題回答和語義搜索等任務的最先進技術。</p>
<p>當然，BERT 並非完美。它的早期版本僅限於<strong>512 個字元的視窗</strong>，這意味著長文件必須被切碎，有時甚至會失去意義。它的密集向量也缺乏詮釋能力-您可以看到兩個文字匹配，但不一定能解釋原因。後來的變體，例如<strong>RoBERTa</strong>，在研究顯示 NSP 任務所帶來的好處不多之後，捨棄了 NSP 任務，但保留了強大的 MLM 訓練。</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3：融合稀疏與密集 (2023)</h3><p>到了 2023 年，這個領域已經成熟到足以意識到，沒有任何單一的嵌入方法可以完成所有的工作。<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>(BAAI General Embedding-M3)是專為檢索任務設計的混合模型。它的關鍵創新之處在於它不只產生一種向量，而是同時產生密集向量、稀疏向量和多向量，並結合它們的優點。</p>
<ul>
<li><p><strong>密集向量</strong>捕捉深層語義，處理同義詞和意譯（例如，「iPhone 發表」≈「Apple 發表新電話」）。</p></li>
<li><p><strong>稀疏向量</strong>指派明確的詞彙權重。即使關鍵字沒有出現，模型也能推斷出相關性 - 例如，將「iPhone 新產品」與「Apple 公司」和「智慧型手機」連結起來。</p></li>
<li><p><strong>多向量</strong>可讓每個標記貢獻自己的互動分數，進一步精細密集嵌入，有助於精細檢索。</p></li>
</ul>
<p>BGE-M3 的訓練管道反映了這種複雜性：</p>
<ol>
<li><p>使用<em>RetroMAE</em>（遮罩編碼器 + 重構解碼器）對大量未標示資料進行<strong>預訓</strong>，以建立一般語義理解。</p></li>
<li><p>在 1 億個文字對上使用對比學習進行<strong>一般微調</strong>，以提升其檢索效能。</p></li>
<li><p>使用指令調整和複雜負取樣進行<strong>任務微調</strong>，以針對特定情境進行最佳化。</p></li>
</ol>
<p>結果令人印象深刻：BGE-M3 可處理多種粒度（從字詞層級到文件層級），提供強大的多語言效能（尤其是中文），並在準確性與效率之間取得平衡，優於大多數同業。實際上，它代表著在建立嵌入模型方面向前邁進了一大步，這些嵌入模型對於大規模檢索而言既強大又實用。</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">LLM 作為嵌入模型 (2023 年至今)</h3><p>多年來，普遍的看法是只用解碼器的大型語言模型 (LLM)，例如 GPT，並不適合用於嵌入。它們的因果注意力 (只看之前的標記) 被認為會限制深度語義理解。但是最近的研究顛覆了這個假設。經過適當的調整，LLM 可以產生媲美、甚至超越特定目的模型的內嵌。兩個顯著的例子是 LLM2Vec 和 NV-Embed。</p>
<p><strong>LLM2Vec</strong>透過三個關鍵變更來調整解碼器專用的 LLM：</p>
<ul>
<li><p><strong>雙向注意轉換</strong>：取代因果掩碼，讓每個符記都能注意整個序列。</p></li>
<li><p><strong>掩碼下一個符號預測 (MNTP)：</strong>一個鼓勵雙向理解的新訓練目標。</p></li>
<li><p><strong>無監督對比學習：</strong>受 SimCSE 的啟發，在向量空間中將語意相似的句子拉近。</p></li>
</ul>
<p><strong>NV-Embed</strong> 則採用更精簡的方法：</p>
<ul>
<li><p><strong>潛在注意力層：</strong>增加可訓練的「潛在陣列」，以改善序列匯集。</p></li>
<li><p><strong>直接雙向訓練：</strong>只需移除因果遮罩，並使用對比學習進行微調。</p></li>
<li><p><strong>均值池最佳化：</strong>使用各 token 的加權平均值來避免「最後一個 token 的偏差」。</p></li>
</ul>
<p>其結果是，基於 LLM 的現代嵌入結合了<strong>深度語義理解</strong>和<strong>可擴展性</strong>。它們可以處理<strong>非常長的上下文視窗 (8K-32K 字元)</strong>，因此特別適合研究、法律或企業搜尋等文件較多的工作。由於它們重複使用相同的 LLM 骨幹，因此即使在較受限制的環境中，有時也能提供高品質的嵌入。</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">結論：將理論轉化為實踐<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>在選擇嵌入模型時，理論只能幫助您到此為止。真正的考驗是它在<em>您的</em>系統與資料中<em>的</em>表現。幾個實務步驟就能讓紙上談兵的模型與在生產中實際運作的模型產生差異：</p>
<ul>
<li><p><strong>使用 MTEB 子集進行篩選。</strong>使用基準（尤其是檢索任務）來建立初步的候選名單。</p></li>
<li><p><strong>使用真實的業務資料進行測試。</strong>從您自己的文件建立評估集，以衡量真實條件下的召回率、精確度和延遲率。</p></li>
<li><p><strong>檢查資料庫相容性。</strong>稀疏向量需要反向索引支援，而高維密集向量則需要更多的儲存與計算。確保您的向量資料庫能夠容納您的選擇。</p></li>
<li><p><strong>巧妙處理長文件。</strong>利用分割策略 (例如滑動視窗) 來提高效率，並搭配大型上下文視窗模型來保留意義。</p></li>
</ul>
<p>從 Word2Vec 的簡單靜態向量到具有 32K 上下文的 LLM 驅動嵌入，我們看到機器在理解語言方面取得了巨大的進步。但每個開發人員最終都會學到：<em>得分最高的</em>模型不一定是<em>最適合</em>您的使用個案的模型。</p>
<p>說到底，使用者並不關心 MTEB 排行榜或基準圖表 - 他們只想要快速找到正確的資訊。選擇能平衡精確度、成本以及與您系統相容性的機型，您就能建立出不僅在理論上令人印象深刻，而且能在現實世界中真正運作的產品。</p>
