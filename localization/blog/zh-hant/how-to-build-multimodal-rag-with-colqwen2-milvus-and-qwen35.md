---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: 如何使用 ColQwen2、Milvus 和 Qwen3.5 建立多模式 RAG
author: Lumina Wang
date: 2026-3-6
cover: assets.zilliz.com/download_11zon_1862455eb4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_keywords: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_title: |
  How to Build Multimodal RAG with ColQwen2, Milvus, Qwen3.5
desc: 使用 ColQwen2、Milvus 和 Qwen3.5 建立多模式 RAG 管道，擷取 PDF 頁面影像而非擷取文字。逐步教學。
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>現在，您可以將 PDF 上傳到任何現代的 LLM，並提出相關問題。對於少量的文件來說，這個方法很好用。但大多數 LLM 的上限都是幾百頁的上下文，所以大篇幅的語料根本不適合。即使符合要求，您也得花錢處理每個查詢的每頁內容。就同一個 500 頁的文件集提出一百個問題，你就得為 500 頁的文件付一百倍的費用。這很快就會變得昂貴。</p>
<p>Retrieval-augmented generation (RAG) 透過將編制索引與解答分開來解決這個問題。您只需對文件編碼一次，將表示法儲存在向量資料庫中，在查詢時只擷取最相關的頁面傳送給 LLM。模型會在每次查詢時讀取三頁，而不是您的整個語料庫。這使得在不斷成長的資料集中建立文件問與答非常實用。</p>
<p>本教學教導您使用三個公開授權的元件建立多模式 RAG 管道：</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>將每個 PDF 頁面的影像編碼為多向量嵌入，取代傳統的 OCR 與文字分塊步驟。</li>
<li><strong><a href="http://milvus.io">Milvus</a></strong>會儲存這些向量，並在查詢時處理相似性搜尋，只擷取最相關的頁面。</li>
<li><strong><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></strong>會讀取擷取的頁面影像，並根據所見生成答案。</li>
</ul>
<p>到最後，您將擁有一個可運作的系統，它能接收 PDF 和問題，找出最相關的頁面，並根據模型所看到的內容傳回答案。</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">什麼是多模式 RAG？<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>前面的介紹說明了為什麼 RAG 在規模上很重要。下一個問題是您需要哪一種 RAG，因為傳統的方法有一個盲點。</p>
<p>傳統的 RAG 擷取文件中的文字，將其嵌入為向量，在查詢時擷取最接近的匹配項目，然後將這些文字區塊傳送給 LLM。這對於具有簡潔格式的大量文字內容非常有效。但當您的文件包含下列內容時，就會出現問題</p>
<ul>
<li>表格，其意義取決於行列與標題之間的關係。</li>
<li>圖表：資訊完全視覺化，沒有對應的文字。</li>
<li>掃描文件或手寫筆記，OCR 輸出不可靠或不完整。</li>
</ul>
<p>Multimodal RAG 以影像編碼取代文字擷取。您將每頁渲染為影像，使用視覺語言模型進行編碼，並在查詢時擷取網頁影像。LLM 會看到原始頁面 - 表格、圖表、格式等所有內容 - 並根據所見回答問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">多模式 RAG 管道結構：ColQwen2 用於編碼，Milvus 用於搜索，Qwen3.5 用於生成<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">管道如何運作  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">技術堆疊</h3><table>
<thead>
<tr><th><strong>元件</strong></th><th><strong>選擇</strong></th><th><strong>角色</strong></th></tr>
</thead>
<tbody>
<tr><td>PDF 處理</td><td>pdf2image + poppler</td><td>將 PDF 頁面呈現為高解析度影像</td></tr>
<tr><td>嵌入模型</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">colqwen2-v1.0</a></td><td>視覺語言模型；將每頁編碼成 ~755 128 dim 的修補向量</td></tr>
<tr><td>向量資料庫</td><td><a href="https://milvus.io/">Milvus Lite</a></td><td>儲存修補向量並處理相似性搜尋；本機執行，無需伺服器設定</td></tr>
<tr><td>生成模型</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></td><td>透過 OpenRouter API 呼叫的多模態 LLM；讀取擷取的頁面影像以產生答案</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">使用 ColQwen2+ Milvus+ Qwen3.5-397B-A17B 分步實現多模態 RAG<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">環境設定</h3><ol>
<li>安裝 Python 相依性</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>安裝 PDF 渲染引擎 Poppler</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>下載嵌入模型 ColQwen2</li>
</ol>
<p>從 HuggingFace 下載 vidore/colqwen2-v1.0-merged (~4.4 GB) 並儲存到本機：</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>取得 OpenRouter API 金鑰</li>
</ol>
<p>在<a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys</a> 註冊並產生一個金<a href="https://openrouter.ai/settings/keys">鑰。</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">步驟 1: 匯入相依性並進行設定</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> pdf2image <span class="hljs-keyword">import</span> convert_from_path

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColQwen2, ColQwen2Processor

<span class="hljs-comment"># --- Configuration ---</span>
EMBED_MODEL = os.path.expanduser(<span class="hljs-string">&quot;~/models/colqwen2-v1.0-merged&quot;</span>)
EMBED_DIM = <span class="hljs-number">128</span>              <span class="hljs-comment"># ColQwen2 output vector dimension</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>  <span class="hljs-comment"># Milvus Lite local file</span>
COLLECTION = <span class="hljs-string">&quot;doc_patches&quot;</span>
TOP_K = <span class="hljs-number">3</span>                    <span class="hljs-comment"># Number of pages to retrieve</span>
CANDIDATE_PATCHES = <span class="hljs-number">300</span>      <span class="hljs-comment"># Candidate patches per query token</span>

<span class="hljs-comment"># OpenRouter LLM config</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;your-api-key-here&gt;&quot;</span>,
)
GENERATION_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>

<span class="hljs-comment"># Device selection</span>
DEVICE = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
DTYPE = torch.bfloat16 <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> torch.float32
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Device: <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：裝置：cpu</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">步驟 2：載入嵌入模型</h3><p><strong>ColQwen2</strong>是一個視覺語言模型，可將文件影像編碼為 ColBERT 風格的多向量表示法。每個頁面會產生數百個 128 維的修補向量。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loading embedding model: <span class="hljs-subst">{EMBED_MODEL}</span>&quot;</span>)
emb_model = ColQwen2.from_pretrained(
    EMBED_MODEL,
    torch_dtype=DTYPE,
    attn_implementation=<span class="hljs-string">&quot;flash_attention_2&quot;</span> <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>,
    device_map=DEVICE,
).<span class="hljs-built_in">eval</span>()
emb_processor = ColQwen2Processor.from_pretrained(EMBED_MODEL)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding model ready on <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">步驟 3：初始化 Milvus</h3><p>本教學使用 Milvus Lite，它以本地檔案的方式執行，零組態 - 不需要獨立的伺服器進程。</p>
<p><strong>資料庫模式：</strong></p>
<p><strong>id</strong>：INT64, 自增主鍵</p>
<p><strong>doc_id</strong>：INT64，頁號（PDF 的哪一頁）</p>
<p><strong>patch_idx</strong>：INT64，該頁中的補丁索引</p>
<p><strong>向量</strong>：FLOAT_VECTOR(128)，補丁的 128 維嵌入值</p>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;doc_id&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;patch_idx&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)

index = milvus_client.prepare_index_params()
index.add_index(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)
milvus_client.create_collection(COLLECTION, schema=schema, index_params=index)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus collection created.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：建立 Milvus 套件。</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">步驟 4：將 PDF 頁面轉換成影像</h3><p>您以 150 DPI 渲染每頁。這裡不會進行文字萃取 - 傳輸管道會將每頁純粹視為影像。</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">步驟 5：編碼影像並插入 Milvus</h3><p>ColQwen2 將每頁編碼為多向量修補嵌入。然後，您可以在 Milvus 中以獨立行的形式插入每個修補碼。</p>
<pre><code translate="no"><span class="hljs-comment"># Encode all pages</span>
all_page_embs = []
<span class="hljs-keyword">with</span> torch.no_grad():
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), <span class="hljs-number">2</span>), desc=<span class="hljs-string">&quot;Encoding pages&quot;</span>):
        batch = images[i : i + <span class="hljs-number">2</span>]
        inputs = emb_processor.process_images(batch).to(emb_model.device)
        embs = emb_model(**inputs)
        <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> embs:
            all_page_embs.append(e.cpu().<span class="hljs-built_in">float</span>().numpy())

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Encoded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, ~<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">0</span>]}</span> patches per page, dim=<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">1</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：編碼 17 頁，每頁 ~755 個修補碼，dim=128</p>
<pre><code translate="no"><span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-keyword">for</span> doc_id, patch_vecs <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(all_page_embs):
    rows = [
        {<span class="hljs-string">&quot;doc_id&quot;</span>: doc_id, <span class="hljs-string">&quot;patch_idx&quot;</span>: j, <span class="hljs-string">&quot;vector&quot;</span>: v.tolist()}
        <span class="hljs-keyword">for</span> j, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(patch_vecs)
    ]
    milvus_client.insert(COLLECTION, rows)

total = milvus_client.get_collection_stats(COLLECTION)[<span class="hljs-string">&quot;row_count&quot;</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Indexed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, <span class="hljs-subst">{total}</span> patches total.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：索引 17 頁，共 12835 個修補碼。</p>
<p>17 頁 PDF 產生 12,835 個修補碼向量記錄 - 每頁約 755 個修補碼。</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">步驟 6：擷取 - 查詢編碼 + MaxSim 重新排序</h3><p>這是核心的擷取邏輯。它分三個階段運作：</p>
<p><strong>將查詢編碼</strong>為多個標記向量。</p>
<p><strong>搜尋 Milvus 中</strong>每個符號向量最接近的補丁。</p>
<p>使用 MaxSim<strong>按頁面進行聚合</strong>：對於每個查詢標記，在每個頁面中選取得分最高的補丁，然後將所有標記的得分相加。總分最高的頁面即為最佳匹配。</p>
<p><strong>MaxSim 如何運作：</strong>對於每個查詢符記向量，您會找出具有最高內乘積 (MaxSim 中的「最大」) 的文件修補區。然後將所有查詢標記的最大分數相加，得到每頁的總相關性分數。分數越高，表示查詢與頁面的視覺內容之間的語意匹配度越高。</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;What is the difference between Milvus and Zilliz Cloud?&quot;</span>

<span class="hljs-comment"># 1. Encode the query</span>
<span class="hljs-keyword">with</span> torch.no_grad():
    query_inputs = emb_processor.process_queries([question]).to(emb_model.device)
    query_vecs = emb_model(**query_inputs)[<span class="hljs-number">0</span>].cpu().<span class="hljs-built_in">float</span>().numpy()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query encoded: <span class="hljs-subst">{query_vecs.shape[<span class="hljs-number">0</span>]}</span> token vectors&quot;</span>)

<span class="hljs-comment"># 2. Search Milvus for each query token vector</span>
doc_patch_scores = {}
<span class="hljs-keyword">for</span> qv <span class="hljs-keyword">in</span> query_vecs:
    hits = milvus_client.search(
        COLLECTION, data=[qv.tolist()], limit=CANDIDATE_PATCHES,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;patch_idx&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    )[<span class="hljs-number">0</span>]
    <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits:
        did = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>]
        pid = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;patch_idx&quot;</span>]
        score = h[<span class="hljs-string">&quot;distance&quot;</span>]
        doc_patch_scores.setdefault(did, {})[pid] = <span class="hljs-built_in">max</span>(
            doc_patch_scores.get(did, {}).get(pid, <span class="hljs-number">0</span>), score
        )

<span class="hljs-comment"># 3. MaxSim aggregation: total score per page = sum of all matched patch scores</span>
doc_scores = {d: <span class="hljs-built_in">sum</span>(ps.values()) <span class="hljs-keyword">for</span> d, ps <span class="hljs-keyword">in</span> doc_patch_scores.items()}
ranked = <span class="hljs-built_in">sorted</span>(doc_scores.items(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)[:TOP_K]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> retrieved pages: <span class="hljs-subst">{[(d, <span class="hljs-built_in">round</span>(s, <span class="hljs-number">2</span>)) <span class="hljs-keyword">for</span> d, s <span class="hljs-keyword">in</span> ranked]}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Query encoded: 24 token vectors
Top-3 retrieved pages: [(16, 161.16), (12, 135.73), (7, 122.58)]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Display the retrieved pages</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
<span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context_images):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Retrieved page <span class="hljs-subst">{ranked[i][<span class="hljs-number">0</span>]}</span> (score: <span class="hljs-subst">{ranked[i][<span class="hljs-number">1</span>]:<span class="hljs-number">.2</span>f}</span>) ---&quot;</span>)
    display(img.resize((<span class="hljs-number">500</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">500</span> * img.height / img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_6_2842a54af8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">步驟 7：使用多模態 LLM 產生答案</h3><p>您將擷取到的頁面圖像 (而非擷取的文字) 連同使用者的問題一併傳送至 Qwen3.5。LLM 會直接讀取圖片以產生答案。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert an image to a base64 data URI for sending to the LLM.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; <span class="hljs-number">1600</span>:
        r = <span class="hljs-number">1600</span> / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;PNG&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-comment"># Build the multimodal prompt</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> context_images
]
content.append({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">f&quot;Above are <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context_images)}</span> retrieved document pages.\n&quot;</span>
        <span class="hljs-string">f&quot;Read them carefully and answer the following question:\n\n&quot;</span>
        <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n\n&quot;</span>
        <span class="hljs-string">f&quot;Be concise and accurate. If the documents don&#x27;t contain &quot;</span>
        <span class="hljs-string">f&quot;relevant information, say so.&quot;</span>
    ),
})

<span class="hljs-comment"># Call the LLM</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)
response = llm.chat.completions.create(
    model=GENERATION_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">1024</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
answer = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Answer: <span class="hljs-subst">{answer}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>結果：<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>在本教程中，我們建立了一個多模態 RAG 管道，它可以取得 PDF，將每頁轉換成圖片，使用 ColQwen2 將這些圖片編碼成多向量斑塊內嵌，然後將它們儲存到 Milvus 中，並在查詢時使用 MaxSim Scoring 檢索最相關的頁面。該管道將原始頁面圖像傳送至 Qwen3.5，Qwen3.5 會直觀讀取這些圖像並產生答案，而不是擷取文字並希望 OCR 保留版面。</p>
<p>本教學只是一個起點，而非生產部署。當您進一步使用時，有幾件事情需要注意。</p>
<p>關於取捨：</p>
<ul>
<li><strong>儲存空間會隨頁數增加。</strong>每頁產生 ~755 個向量，因此 1,000 頁的資料庫在 Milvus 中大約有 755,000 行。這裡使用的 FLAT 索引適用於示範，但對於較大的資料庫，您需要 IVF 或 HNSW。</li>
<li><strong>編碼比文字嵌入慢。</strong>ColQwen2 是 4.4 GB 的視覺模型。編碼影像每頁所需的時間比嵌入文字區塊更長。對於執行一次的批次索引工作，這通常沒問題。對於即時擷取，則值得進行基準測試。</li>
<li><strong>此方法最適用於視覺豐富的文件。</strong>如果您的 PDF 文件大多是簡潔的單欄文字，沒有表格或圖表，傳統基於文字的 RAG 可能擷取得更精確，執行成本也更低。</li>
</ul>
<p>下一步該怎麼做？</p>
<ul>
<li><strong>換一個不同的多模式 LLM。</strong>本教學透過 OpenRouter 使用 Qwen3.5，但檢索管道與模型無關。您可以將生成步驟指向 GPT-4o、Gemini 或任何接受影像輸入的多模態模型。</li>
<li><strong>擴充<a href="http://milvus.io">Milvus</a>。</strong>Milvus Lite 以本機檔案形式執行，非常適合原型開發。對於生產工作負載，Docker/Kubernetes 上的 Milvus 或 Zilliz Cloud (完全管理的 Milvus) 可處理較大的語料庫，而無需您管理基礎架構。</li>
<li><strong>使用不同的文件類型進行實驗。</strong>這裡的管道使用的是比較 PDF，但對於掃描過的合約、工程圖紙、財務報表或圖表密集的研究論文，其運作方式相同。</li>
</ul>
<p>要開始使用，請使用 pip install<a href="https://github.com/milvus-io/milvus-lite">pymilvus</a>安裝<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>，並從 HuggingFace 擷取 ColQwen2 權重。</p>
<p>有問題或想炫耀您的成果嗎？<a href="https://milvus.io/slack">Milvus Slack</a>是從社群和團隊獲得協助的最快方式。如果您想要一對一的對話，可以在我們的<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">辦公時間</a>預約時間。</p>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">如果您可以看到 RAG 失敗的原因會如何？使用 Project_Golem 和 Milvus 在 3D 中偵錯 RAG</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">現在像 Claude Cowork 這種長期運作的代理正在崛起，RAG 是否已經過時？</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">我們如何為 RAG 建立語意強調模型 上下文剪枝與代幣儲存</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">當模型爭論時，AI 程式碼檢閱會變得更好：Claude vs Gemini vs Codex vs Qwen vs MiniMax</a></p></li>
</ul>
