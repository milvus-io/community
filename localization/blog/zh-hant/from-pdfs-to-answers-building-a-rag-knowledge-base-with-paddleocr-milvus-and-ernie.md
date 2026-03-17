---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: 從 PDF 到答案：使用 PaddleOCR、Milvus 和 ERNIE 建立 RAG 知識庫
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: 學習如何使用 Milvus、混合搜尋、重排和多模態問答建立高準確度的 RAG 知識庫，以進行文件智慧化。
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>大型語言模型的能力遠比 2023 年時強大，但它們仍會對信心產生幻覺，而且經常回落到過時的資訊上。RAG (Retrieval-Augmented Generation) 可以解決這兩個問題，方法是在模型產生回應之前，先從向量資料庫 (例如<a href="https://milvus.io/">Milvus</a>) 擷取相關的上下文。這些額外的上下文可讓答案建立在真實資料來源的基礎上，並使其更具現代性。</p>
<p>最常見的 RAG 使用案例之一是公司知識庫。使用者上傳 PDF、Word 檔案或其他內部文件，提出自然語言問題，並根據這些資料獲得答案，而非僅根據模型的預先訓練。</p>
<p>但是使用相同的 LLM 和相同的向量資料庫並不能保證得到相同的結果。兩個團隊可以建立在相同的基礎上，但最終的系統品質仍會有很大的差異。差異通常來自上游的一切：<strong>文件如何解析、分塊和嵌入；資料如何索引；檢索結果如何排序；以及最終答案如何組合。</strong></p>
<p>在這篇文章中，我們將以<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a>為例，說明如何使用<a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>、<a href="https://milvus.io/">Milvus</a> 和 ERNIE-4.5-Turbo 建立一個以 RAG 為基礎的知識庫。</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Paddle-ERNIE-RAG 系統架構<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Paddle-ERNIE-RAG 架構包含四個核心層：</p>
<ul>
<li><strong>資料萃取層。</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>是PaddleOCR中的文件解析管道，使用版面感知OCR讀取PDF和影像。它會保留文件結構 - 標題、表格、閱讀順序 - 並輸出乾淨的 Markdown，分割成重疊的區塊。</li>
<li><strong>向量儲存層。</strong>每個分塊都嵌入到 384 維向量中，並與元資料（檔名、頁碼、分塊 ID）一起儲存在<a href="https://milvus.io"></a><a href="https://milvus.io">Milvus 中</a>。平行倒轉索引支援關鍵字搜尋。</li>
<li><strong>檢索與回答層。</strong>每個查詢都會同時執行向量索引和關鍵字索引。結果透過 RRF (Reciprocal Rank Fusion) 合併、重新排序，並傳送到<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a>模型以產生答案。</li>
<li><strong>應用層。</strong> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/"></a>Gradio 介面可讓您上傳文件、提出問題，並檢視附有來源引文和置信度分數的答案。  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>以下章節依序介紹每個階段，從原始文件如何變成可搜尋的文字開始。</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">如何逐步建立 RAG 管道<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">步驟 1：使用 PP-StructureV3 解析文件</h3><p>原始文件是大多數準確性問題的起點。研究論文和技術報告混合了雙欄版面、公式、表格和圖片。使用 PyPDF2 之類的基本函式庫萃取文字，通常會使輸出變得混亂：段落顯得不順序、表格塌陷、公式消失。</p>
<p>為了避免這些問題，本專案在 backend.py 中建立了一個 OnlinePDFParser 類。這個類別會呼叫 PP-StructureV3 線上 API 來進行版面解析。它不是提取原始文字，而是識別文件的結構，然後將其轉換成 Markdown 格式。</p>
<p>這個方法有三個明顯的好處</p>
<ul>
<li><strong>乾淨的 Markdown 輸出</strong></li>
</ul>
<p>輸出格式為 Markdown，並有適當的標題和段落。這讓模型更容易理解內容。</p>
<ul>
<li><strong>獨立的圖片擷取</strong></li>
</ul>
<p>系統會在解析過程中抽取並儲存圖片。這可以防止重要的視覺資訊遺失。</p>
<ul>
<li><strong>更好的上下文處理</strong></li>
</ul>
<p>使用具有重疊的滑動視窗分割文字。這可避免在中間切斷句子或公式，有助於保持意思清晰並提高搜尋準確性。</p>
<p><strong>基本解析流程</strong></p>
<p>在 backend.py 中，解析遵循三個簡單的步驟：</p>
<ol>
<li>將 PDF 檔案傳送至 PP-StructureV3 API。</li>
<li>讀取傳回的 layoutParsingResults。</li>
<li>擷取已清理的 Markdown 文字和任何圖片。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">步驟二：使用滑動視窗重疊分塊文字</h3><p>解析之後，Markdown 文字必須分割成較小的片段（chunks）以供搜尋。如果以固定長度切割文字，句子或公式可能會被分成兩半。</p>
<p>為了避免這種情況，本系統使用具有重疊的滑動視窗分塊技術。每個分塊與下一個分塊共用一個尾部，因此邊界內容會出現在兩個視窗中。這樣就能保持分塊邊緣的意義不變，並提高檢索召回率。</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">步驟 3：在 Milvus 中儲存向量與元資料</h3><p>準備好乾淨的資料塊後，下一步就是以支援快速、精確檢索的方式儲存資料塊。</p>
<p><strong>向量儲存與元資料</strong></p>
<p>Milvus 對資料庫名稱有嚴格的規定 - 只能使用 ASCII 字母、數字和底線。如果知識庫名稱包含非 ASCII 字元，後端會在建立資料庫前以 kb_ 前綴進行十六進位編碼，並在顯示時進行解碼。這是一個很小的細節，但卻可以防止隱藏錯誤。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>除了命名之外，每個 chunk 在插入之前都會經過兩個步驟：產生嵌入和附加元資料。</p>
<ul>
<li><strong>儲存內容：</strong></li>
</ul>
<p>每個 chunk 都會轉換成 384 維的密集向量。與此同時，Milvus 模式會儲存額外的欄位，例如檔案名稱、頁面號碼和頻塊 ID。</p>
<ul>
<li><strong>為什麼這很重要？</strong></li>
</ul>
<p>這使得追溯答案的確切頁面成為可能。這也讓系統為未來的多模式問答使用個案做好準備。</p>
<ul>
<li><strong>效能最佳化：</strong></li>
</ul>
<p>在 vector_store.py 中，insert_documents 方法使用批次嵌入。這可減少網路請求的次數，讓處理過程更有效率。</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">步驟 4：使用混合搜尋與 RRF 融合進行擷取</h3><p>單一的搜尋方法很少足夠。向量搜尋能找到語意相似的內容，但可能會遺漏精確的字詞；關鍵字搜尋能找到特定的字詞，但會遺漏意譯。並行執行這兩種方法並合併輸出，會比單獨執行其中一種方法產生更好的結果。</p>
<p>當查詢語言與文件語言不同時，系統會先使用 LLM 翻譯查詢，讓兩種搜尋路徑都能以文件語言運作。然後，兩個搜尋並行執行：</p>
<ul>
<li><strong>向量搜尋 (密集)：</strong>尋找意思相似的內容，甚至是跨語言的內容，但可能會出現無法直接回答問題的相關段落。</li>
<li><strong>關鍵字搜尋 (稀疏)：</strong>尋找精確匹配的專業詞彙、數字或公式變數 - 向量嵌入通常會忽略的那種標記。</li>
</ul>
<p>系統會使用 RRF (Reciprocal Rank Fusion) 來合併兩個結果清單。每個候選人會根據其在每個清單中的排名獲得一個分數，因此在<em>兩個</em>清單中<em>都</em>接近頂端的資料塊得分最高。向量搜尋會貢獻語意覆蓋率；關鍵字搜尋會貢獻詞彙精確度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">步驟 5：在產生答案之前重新排列結果</h3><p>搜尋步驟所返回的區塊並非同樣相關。因此，在產生最終答案之前，一個重新排名步驟會對它們重新評分。</p>
<p>在 reranker_v2.py中，有一種綜合評分方法會評估每個chunk，並從五個方面進行評分：</p>
<ul>
<li><strong>模糊匹配</strong></li>
</ul>
<p>使用 fuzzywuzzy，我們檢查語段的措辭與查詢的相似程度。這衡量直接文字重疊的程度。</p>
<ul>
<li><strong>關鍵字涵蓋率</strong></li>
</ul>
<p>我們會檢查有多少查詢的重要字詞出現在資料塊中。更多的關鍵字符合代表更高的分數。</p>
<ul>
<li><strong>語意相似性</strong></li>
</ul>
<p>我們重複使用 Milvus 傳回的向量相似度得分。這反映了意思的接近程度。</p>
<ul>
<li><strong>長度與原始排名</strong></li>
</ul>
<p>非常短的片段會受到懲罰，因為它們通常缺乏上下文。在 Milvus 原始結果中排名較高的片段則會獲得少量獎勵。</p>
<ul>
<li><strong>命名實體偵測</strong></li>
</ul>
<p>系統會將「Milvus」或「RAG」等大寫的詞彙偵測為可能的專有名詞，並將多字的技術詞彙識別為可能的關鍵詞組。</p>
<p>每個因素在最終得分中都有一個權重（如下圖所示）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>它不需要訓練資料，而且每個因素的貢獻都是可見的。如果某個分塊的排名出乎意料地高或低，分數會解釋原因。完全黑箱式的 ranker 則無法做到這一點。</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">步驟 6：為圖表和圖形加入多模式問與答</h3><p>研究論文通常會包含重要的圖表，這些圖表會提供文字所沒有的資訊。純文字的 RAG 管道會完全錯過這些訊號。  為了處理這個問題，我們新增了一個簡單的圖像問與答功能，包含三個部分：</p>
<p><strong>1.在提示中加入更多上下文</strong></p>
<p>將圖像傳送至模型時，系統也會從同一頁面中取得 OCR 文字。<br>
提示包括：圖片、頁面文字和使用者的問題。<br>
這有助於模型瞭解完整的上下文，減少讀取影像時的錯誤。</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.視覺 API 支援</strong></p>
<p>用戶端 (ernie_client.py)支援 OpenAI 視覺格式。影像會轉換成 Base64 並以 image_url 格式傳送，讓模型可以同時處理影像和文字。</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.後備計劃</strong></p>
<p>如果圖像 API 失敗 (例如，因為網路問題或模型限制)，系統會切換回一般以文字為基礎的 RAG。<br>
它會使用 OCR 文字來回答問題，因此系統會持續工作而不會中斷。</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">管道的主要 UI 功能與實作<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">如何處理 API 速率限制與保護</h3><p>在呼叫 LLM 或嵌入 API 時，系統有時可能會收到<strong>429 Too Many Requests</strong>錯誤。這通常發生在短時間內傳送太多要求時。</p>
<p>為了處理這種情況，本專案在ernie_client.py 中加入了自適應的減速機制。如果發生速率限制錯誤，系統會自動降低請求速度並重試，而不是停止。</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>這有助於保持系統穩定，尤其是在處理和嵌入大量文件時。</p>
<h3 id="Custom-Styling" class="common-anchor-header">自訂樣式</h3><p>前端使用 Gradio (main.py)。我們加入了自訂 CSS (modern_css) 讓介面更乾淨、更容易使用。</p>
<ul>
<li><strong>輸入框</strong></li>
</ul>
<p>從預設的灰色樣式改成白色圓角設計。看起來更簡單、更現代。</p>
<ul>
<li><strong>傳送按鈕</strong></li>
</ul>
<p>新增了漸層顏色和懸停效果，讓它看起來更突出。</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">LaTeX 公式渲染</h3><p>許多研究文件都包含數學公式，因此正確的呈現非常重要。我們新增了完整的 LaTeX 支援，可同時支援內嵌式與區塊式公式。</p>
<ul>
<li><strong>適用場合</strong>此設定在聊天視窗 (Chatbot) 和摘要區域 (Markdown) 均適用。</li>
<li><strong>實際結果</strong>無論公式出現在模型的答案或文件摘要中，都能在頁面上正確呈現。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">可說明性：相關性分數與可信度</h3><p>為了避免「黑箱」的體驗，系統顯示了兩個簡單的指標：</p>
<ul>
<li><p><strong>相關性</strong></p></li>
<li><p>在「參考資料」部分的每個答案下方顯示。</p></li>
<li><p>顯示每個被引用部分的 reranker 分數。</p></li>
<li><p>幫助使用者瞭解為何使用特定頁面或段落。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>信心</strong></p></li>
<li><p>顯示於「分析詳細資料」面板。</p></li>
<li><p>基於頂部資料塊的得分（比例為 100% ）。</p></li>
<li><p>顯示系統對答案的信心程度。</p></li>
<li><p>如果低於 60%，則答案的可信度可能較低。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>使用者介面如下所示。在介面中，每個答案都會顯示來源的頁碼及其相關性分數。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>RAG 的準確度取決於 LLM 與向量資料庫之間的工程。本文利用<a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a>進行了<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a>建置，涵蓋了工程的每個階段：</p>
<ul>
<li><strong>文件解析。</strong>PP-StructureV3 (透過<a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) 使用版面感知 OCR 將 PDF 轉換為乾淨的 Markdown，保留基本擷取器會遺失的標題、表格和圖片。</li>
<li><strong>分塊。</strong>具備重疊功能的滑動視窗分割功能，可在分塊邊界保持上下文完整，防止出現損害檢索回復能力的破碎片段。</li>
<li><strong>在 Milvus 中儲存向量。</strong>以支援快速、精確檢索的方式儲存向量。</li>
<li><strong>混合搜尋。</strong>並行執行向量搜尋與關鍵字搜尋，然後以 RRF (Reciprocal Rank Fusion) 合併結果，可同時抓取語意匹配與精確字詞的命中率，而單獨使用其中一種方法可能會遺漏這兩種情況。</li>
<li><strong>重新排名。</strong>透明、以規則為基礎的 Reranker 會根據模糊匹配、關鍵字涵蓋範圍、語義相似度、長度和專屬名詞偵測對每個分區進行評分 - 不需要訓練資料，而且每個評分都是可調試的。</li>
<li><strong>多模式問與答。</strong>在提示中將圖片與 OCR 頁面文字配對，讓視覺模型有足夠的上下文來回答有關圖表和圖解的問題，如果圖片 API 失敗，還可提供純文字的備用功能。</li>
</ul>
<p>如果您正在為文件問答建置 RAG 系統，並希望獲得更高的準確度，我們很樂意聽取您的做法。</p>
<p>對<a href="https://milvus.io/">Milvus</a>、混合搜尋或知識庫設計有任何疑問？加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>，討論您的使用個案。</p>
