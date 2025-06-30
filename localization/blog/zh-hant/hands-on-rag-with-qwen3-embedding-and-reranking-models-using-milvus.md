---
id: hands-on-rag-with-qwen3-embedding-and-reranking-models-using-milvus.md
title: 使用 Qwen3 實作 RAG 使用 Milvus 嵌入和重新排名模型
author: Lumina
date: 2025-6-30
desc: 使用新發佈的 Qwen3 嵌入和重排模型建立 RAG 系統的教程。
cover: assets.zilliz.com/Chat_GPT_Image_Jun_30_2025_07_41_03_PM_e049bf71fb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, RAG, Embedding'
meta_title: Hands-on RAG with Qwen3 Embedding and Reranking Models using Milvus
origin: >-
  https://milvus.io/blog/hands-on-rag-with-qwen3-embedding-and-reranking-models-using-milvus.md
---
<p>如果您一直在關注嵌入模型領域，您可能已經注意到阿里巴巴剛剛發布了他們的<a href="https://qwenlm.github.io/blog/qwen3-embedding/">Qwen3 Embedding 系列</a>。他們發布了嵌入模型和重排模型，各有三種大小（0.6B、4B、8B），都是建立在 Qwen3 的基礎模型上，專門為檢索任務設計的。</p>
<p>Qwen3 系列有幾個我覺得有趣的功能：</p>
<ul>
<li><p><strong>多語言嵌入</strong>- 他們宣稱擁有跨越 100 種以上語言的統一語義空間</p></li>
<li><p><strong>指令提示</strong>- 您可以傳送自訂指令來修改嵌入行為</p></li>
<li><p><strong>可變尺寸</strong>- 透過 Matryoshka 表徵學習支援不同的嵌入尺寸</p></li>
<li><p><strong>32K 上下文長度</strong>- 可以處理較長的輸入序列</p></li>
<li><p><strong>標準的雙/交叉編碼器設定</strong>- 嵌入模型使用雙編碼器，reeranker 使用交叉編碼器</p></li>
</ul>
<p>從基準來看，Qwen3-Embedding-8B 在 MTEB 多語言排行榜上取得了 70.58 的高分，超越了 BGE、E5，甚至 Google Gemini。Qwen3-Reranker-8B 在多語言排名任務上創下 69.02 的佳績。這些不只是「在開源模型中還算不錯」，而是全面媲美甚至超越了主流的商業 API。在 RAG 檢索、跨語言搜尋和編碼搜尋系統中，尤其是在中文情境中，這些模型已經具備了生產就緒的能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdZCKoPqf8mpxwQ_s-gGbdHYvw_HhWn6Ib62v8C_VEZF8AOSnY1yLEEv1ztkINpmwgHAVC5kZw6rWplfx5OkISf_gL4VvoqlXxSfs8s_qd8mdBuA0HBhP9kEdipXy0QVuPmEyOJRg?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdNppvBpn_5M9d6WDb0-pCjgTobVc9eFw_m6m6Vg73wJtB9OvcPFw5089FUui_N2-LbJVjJPe1c8_EnYY4F3Ryw0021kvmJ0jU0Q06qG2ZX2D1vywIyd5aKqO_cx-77U_spMVr8cQ?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>身為一個可能已經處理過一般嫌疑犯（OpenAI 的 embeddings、BGE、E5）的人，您可能會想知道這些模型是否值得您花時間。劇透：它們是值得的。</p>
<h2 id="What-Were-Building" class="common-anchor-header">我們要建立的東西<button data-href="#What-Were-Building" class="anchor-icon" translate="no">
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
    </button></h2><p>本教學使用 Qwen3-Embedding-0.6B 和 Qwen3-Reranker-0.6B 與 Milvus 來建立一個完整的 RAG 系統。我們將實作一個兩階段的擷取管道：</p>
<ol>
<li><p>使用 Qwen3 內嵌進行<strong>密集檢索</strong>，以快速選擇候選人</p></li>
<li><p>使用 Qwen3 交叉編碼器進行<strong>重排</strong>，以提高精確度</p></li>
<li><p>使用 OpenAI 的 GPT-4<strong>生成</strong>最終回應</p></li>
</ol>
<p>最後，您將會擁有一個可處理多語言查詢、使用指令提示進行領域調整，並透過智慧型重新排序平衡速度與精確度的工作系統。</p>
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
    </button></h2><p>讓我們從相依性開始。請注意最低版本需求 - 這對相容性很重要：</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm sentence-transformers transformers
<button class="copy-code-btn"></button></code></pre>
<p><em>需要 transformers&gt;=4.51.0 和 sentence-transformers&gt;=2.7.0</em></p>
<p>在本教程中，我們將使用 OpenAI 作為產生模型。設定您的 API 金鑰：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Preparation" class="common-anchor-header"><strong>資料準備</strong><button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>我們將使用 Milvus 文件作為我們的知識庫 - 這是一個很好的技術內容組合，可以測試檢索和生成品質。</p>
<p>下載並擷取文件：</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>載入 markdown 檔案並將其分塊。我們在此使用簡單的基於標頭的分割策略 - 對於生產系統，請考慮更複雜的分塊方法：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Model-Setup" class="common-anchor-header"><strong>模型設定</strong><button data-href="#Model-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們初始化模型。我們使用輕量級的 0.6B 版本，在效能與資源需求之間取得良好的平衡：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoModel, AutoTokenizer, AutoModelForCausalLM

<span class="hljs-comment"># Initialize OpenAI client for LLM generation</span>
openai_client = OpenAI()

<span class="hljs-comment"># Load Qwen3-Embedding-0.6B model for text embeddings</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&quot;Qwen/Qwen3-Embedding-0.6B&quot;</span>)

<span class="hljs-comment"># Load Qwen3-Reranker-0.6B model for reranking</span>
reranker_tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&quot;Qwen/Qwen3-Reranker-0.6B&quot;</span>, padding_side=<span class="hljs-string">&#x27;left&#x27;</span>)
reranker_model = AutoModelForCausalLM.from_pretrained(<span class="hljs-string">&quot;Qwen/Qwen3-Reranker-0.6B&quot;</span>).<span class="hljs-built_in">eval</span>()

<span class="hljs-comment"># Reranker configuration</span>
token_false_id = reranker_tokenizer.convert_tokens_to_ids(<span class="hljs-string">&quot;no&quot;</span>)
token_true_id = reranker_tokenizer.convert_tokens_to_ids(<span class="hljs-string">&quot;yes&quot;</span>)
max_reranker_length = <span class="hljs-number">8192</span>

prefix = <span class="hljs-string">&quot;&lt;|im_start|&gt;system\nJudge whether the Document meets the requirements based on the Query and the Instruct provided. Note that the answer can only be \&quot;yes\&quot; or \&quot;no\&quot;.&lt;|im_end|&gt;\n&lt;|im_start|&gt;user\n&quot;</span>
suffix = <span class="hljs-string">&quot;&lt;|im_end|&gt;\n&lt;|im_start|&gt;assistant\n&lt;think&gt;\n\n&lt;/think&gt;\n\n&quot;</span>
prefix_tokens = reranker_tokenizer.encode(prefix, add_special_tokens=<span class="hljs-literal">False</span>)
suffix_tokens = reranker_tokenizer.encode(suffix, add_special_tokens=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p>預期的輸出：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdaUrXQrAs2W8-rGT9njJHEKnQ8YwREmULO6xYJnpPy7bwsmZImDRt_3EMwJuVM3k3zI7pbNvY1fDsqMKYq-rrNArx_gxOA4ZTi0g1tkRIlUqJfx1z2nZ60ATPW0L5t6I_XLTVf?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Embedding-Function" class="common-anchor-header">嵌入功能<button data-href="#Embedding-Function" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen3 embeddings 的關鍵洞察力在於能針對查詢與文件使用不同的提示。這個看似很小的細節可以顯著改善檢索效能：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">emb_text</span>(<span class="hljs-params">text, is_query=<span class="hljs-literal">False</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Generate text embeddings using Qwen3-Embedding-0.6B model.
    
    Args:
        text: Input text to embed
        is_query: Whether this is a query (True) or document (False)
    
    Returns:
        List of embedding values
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> is_query:
        <span class="hljs-comment"># For queries, use the &quot;query&quot; prompt for better retrieval performance</span>
        embeddings = embedding_model.encode([text], prompt_name=<span class="hljs-string">&quot;query&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># For documents, use default encoding</span>
        embeddings = embedding_model.encode([text])
    
    <span class="hljs-keyword">return</span> embeddings[<span class="hljs-number">0</span>].tolist()
<button class="copy-code-btn"></button></code></pre>
<p>讓我們測試一下嵌入功能，並檢查輸出的維度：</p>
<pre><code translate="no">test_embedding = emb_text(<span class="hljs-string">&quot;This is a test&quot;</span>)
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>預期輸出：</p>
<pre><code translate="no">Embedding dimension: 1024
First 10 values: [-0.009923271834850311, -0.030248118564486504, -0.011494234204292297, ...]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Reranking-Implementation" class="common-anchor-header">重排實作<button data-href="#Reranking-Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Reranker 使用交叉編碼器架構來評估查詢與文件對。這比雙編碼器嵌入模型的計算成本更高，但卻能提供更細緻的相關性評分。</p>
<p>以下是完整的重排管道：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">format_instruction</span>(<span class="hljs-params">instruction, query, doc</span>):
    <span class="hljs-string">&quot;&quot;&quot;Format instruction for reranker input&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> instruction <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
        instruction = <span class="hljs-string">&#x27;Given a web search query, retrieve relevant passages that answer the query&#x27;</span>
    output = <span class="hljs-string">&quot;&lt;Instruct&gt;: {instruction}\n&lt;Query&gt;: {query}\n&lt;Document&gt;: {doc}&quot;</span>.<span class="hljs-built_in">format</span>(
        instruction=instruction, query=query, doc=doc
    )
    <span class="hljs-keyword">return</span> output

<span class="hljs-keyword">def</span> <span class="hljs-title function_">process_inputs</span>(<span class="hljs-params">pairs</span>):
    <span class="hljs-string">&quot;&quot;&quot;Process inputs for reranker&quot;&quot;&quot;</span>
    inputs = reranker_tokenizer(
        pairs, padding=<span class="hljs-literal">False</span>, truncation=<span class="hljs-string">&#x27;longest_first&#x27;</span>,
        return_attention_mask=<span class="hljs-literal">False</span>, max_length=max_reranker_length - <span class="hljs-built_in">len</span>(prefix_tokens) - <span class="hljs-built_in">len</span>(suffix_tokens)
    )
    <span class="hljs-keyword">for</span> i, ele <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(inputs[<span class="hljs-string">&#x27;input_ids&#x27;</span>]):
        inputs[<span class="hljs-string">&#x27;input_ids&#x27;</span>][i] = prefix_tokens + ele + suffix_tokens
    inputs = reranker_tokenizer.pad(inputs, padding=<span class="hljs-literal">True</span>, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>, max_length=max_reranker_length)
    <span class="hljs-keyword">for</span> key <span class="hljs-keyword">in</span> inputs:
        inputs[key] = inputs[key].to(reranker_model.device)
    <span class="hljs-keyword">return</span> inputs

<span class="hljs-meta">@torch.no_grad()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_logits</span>(<span class="hljs-params">inputs, **kwargs</span>):
    <span class="hljs-string">&quot;&quot;&quot;Compute relevance scores using reranker&quot;&quot;&quot;</span>
    batch_scores = reranker_model(**inputs).logits[:, -<span class="hljs-number">1</span>, :]
    true_vector = batch_scores[:, token_true_id]
    false_vector = batch_scores[:, token_false_id]
    batch_scores = torch.stack([false_vector, true_vector], dim=<span class="hljs-number">1</span>)
    batch_scores = torch.nn.functional.log_softmax(batch_scores, dim=<span class="hljs-number">1</span>)
    scores = batch_scores[:, <span class="hljs-number">1</span>].exp().tolist()
    <span class="hljs-keyword">return</span> scores

<span class="hljs-keyword">def</span> <span class="hljs-title function_">rerank_documents</span>(<span class="hljs-params">query, documents, task_instruction=<span class="hljs-literal">None</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Rerank documents based on query relevance using Qwen3-Reranker
    
    Args:
        query: Search query
        documents: List of documents to rerank
        task_instruction: Task instruction for reranking
    
    Returns:
        List of (document, score) tuples sorted by relevance score
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> task_instruction <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
        task_instruction = <span class="hljs-string">&#x27;Given a web search query, retrieve relevant passages that answer the query&#x27;</span>
    
    <span class="hljs-comment"># Format inputs for reranker</span>
    pairs = [format_instruction(task_instruction, query, doc) <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    
    <span class="hljs-comment"># Process inputs and compute scores</span>
    inputs = process_inputs(pairs)
    scores = compute_logits(inputs)
    
    <span class="hljs-comment"># Combine documents with scores and sort by score (descending)</span>
    doc_scores = <span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(documents, scores))
    doc_scores.sort(key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)
    
    <span class="hljs-keyword">return</span> doc_scores
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Milvus-Vector-Database" class="common-anchor-header">設定 Milvus 向量資料庫<button data-href="#Setting-Up-Milvus-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們設定向量資料庫。為了簡單起見，我們使用 Milvus Lite，但相同的程式碼也適用於完整的 Milvus 部署：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>部署選項：</strong></p>
<ul>
<li><p><strong>本地檔案</strong>(如<code translate="no">./milvus.db</code>)：使用 Milvus Lite，非常適合開發</p></li>
<li><p><strong>Docker/Kubernetes</strong>：使用伺服器 URI，如<code translate="no">http://localhost:19530</code> 用於生產</p></li>
<li><p><strong>Zilliz Cloud</strong>：使用雲端端點和 API 金鑰來管理服務</p></li>
</ul>
<p>清理任何現有的集合，並建立一個新的集合：</p>
<pre><code translate="no"><span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection with our embedding dimensions</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,  <span class="hljs-comment"># 1024 for Qwen3-Embedding-0.6B</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product for similarity</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Ensure data consistency</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Loading-Data-into-Milvus" class="common-anchor-header">將資料載入 Milvus<button data-href="#Loading-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們處理我們的文件，並將它們插入向量資料庫：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: emb_text(line), <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>預期輸出：</p>
<pre><code translate="no">Creating embeddings: 100%|████████████| 72/72 [00:08&lt;00:00, 8.68it/s]
Inserted 72 documents
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enhancing-RAG-with-Reranking-Technology" class="common-anchor-header">使用重排技術增強 RAG<button data-href="#Enhancing-RAG-with-Reranking-Technology" class="anchor-icon" translate="no">
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
    </button></h2><p>現在到了令人興奮的部分 - 將這些整合為一個完整的檢索增強生成系統。</p>
<h3 id="Step-1-Query-and-Initial-Retrieval" class="common-anchor-header"><strong>步驟 1：查詢與初始檢索</strong></h3><p>讓我們用一個關於 Milvus 的常見問題進行測試：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Perform initial dense retrieval to get top candidates</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[emb_text(question, is_query=<span class="hljs-literal">True</span>)],  <span class="hljs-comment"># Use query prompt</span>
    limit=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Get top 10 candidates for reranking</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the actual text content</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(search_res[<span class="hljs-number">0</span>])}</span> initial candidates&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Reranking-for-Precision" class="common-anchor-header"><strong>步驟 2：重排精確度</strong></h3><p>抽取候選文件並應用重排：</p>
<pre><code translate="no"><span class="hljs-comment"># Extract candidate documents</span>
candidate_docs = [res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>] <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># Rerank using Qwen3-Reranker</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Reranking documents...&quot;</span>)
reranked_docs = rerank_documents(question, candidate_docs)

<span class="hljs-comment"># Select top 3 after reranking</span>
top_reranked_docs = reranked_docs[:<span class="hljs-number">3</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Selected top <span class="hljs-subst">{<span class="hljs-built_in">len</span>(top_reranked_docs)}</span> documents after reranking&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Compare-Results" class="common-anchor-header"><strong>步驟 3：比較結果</strong></h3><p>讓我們看看 reranking 如何改變結果：</p>
<pre><code translate="no"><span class="hljs-function">Reranked <span class="hljs-title">results</span> (<span class="hljs-params">top <span class="hljs-number">3</span></span>):
[
    [
        &quot; Where does Milvus store data?\n\nMilvus deals <span class="hljs-keyword">with</span> two types of data, inserted data <span class="hljs-keyword">and</span> metadata. \n\nInserted data, including vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema, are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including [MinIO](<span class="hljs-params">https://min.io/</span>), [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>), [Google Cloud Storage](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>) (<span class="hljs-params">GCS</span>), [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>), [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>), <span class="hljs-keyword">and</span> [Tencent Cloud Object Storage](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>) (<span class="hljs-params">COS</span>).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored <span class="hljs-keyword">in</span> etcd.\n\n###&quot;,
        0.9997891783714294
    ],
    [
        &quot;How does Milvus flush data?\n\nMilvus returns success <span class="hljs-keyword">when</span> inserted data are loaded to the message queue. However, the data are <span class="hljs-keyword">not</span> yet flushed to the disk. Then Milvus&#x27; data node writes the data <span class="hljs-keyword">in</span> the message queue to persistent storage <span class="hljs-keyword">as</span> incremental logs. If `<span class="hljs-title">flush</span>()` <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.\n\n###&quot;,
        0.9989748001098633
    ],
    [
        &quot;Does the query perform <span class="hljs-keyword">in</span> memory? What are incremental data <span class="hljs-keyword">and</span> historical data?\n\nYes. When a query request comes, Milvus searches both incremental data <span class="hljs-keyword">and</span> historical data <span class="hljs-keyword">by</span> loading them <span class="hljs-keyword">into</span> memory. Incremental data are <span class="hljs-keyword">in</span> the growing segments, which are buffered <span class="hljs-keyword">in</span> memory before they reach the threshold to be persisted <span class="hljs-keyword">in</span> storage engine, <span class="hljs-keyword">while</span> historical data are <span class="hljs-keyword">from</span> the <span class="hljs-keyword">sealed</span> segments that are stored <span class="hljs-keyword">in</span> the <span class="hljs-built_in">object</span> storage. Incremental data <span class="hljs-keyword">and</span> historical data together constitute the whole dataset to search.\n\n###&quot;,
        0.9984032511711121
    ]
]</span>

================================================================================
Original embedding-<span class="hljs-function">based <span class="hljs-title">results</span> (<span class="hljs-params">top <span class="hljs-number">3</span></span>):
[
    [
        &quot; Where does Milvus store data?\n\nMilvus deals <span class="hljs-keyword">with</span> two types of data, inserted data <span class="hljs-keyword">and</span> metadata. \n\nInserted data, including vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema, are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including [MinIO](<span class="hljs-params">https://min.io/</span>), [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>), [Google Cloud Storage](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>) (<span class="hljs-params">GCS</span>), [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>), [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>), <span class="hljs-keyword">and</span> [Tencent Cloud Object Storage](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>) (<span class="hljs-params">COS</span>).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored <span class="hljs-keyword">in</span> etcd.\n\n###&quot;,
        0.8306853175163269
    ],
    [
        &quot;How does Milvus flush data?\n\nMilvus returns success <span class="hljs-keyword">when</span> inserted data are loaded to the message queue. However, the data are <span class="hljs-keyword">not</span> yet flushed to the disk. Then Milvus&#x27; data node writes the data <span class="hljs-keyword">in</span> the message queue to persistent storage <span class="hljs-keyword">as</span> incremental logs. If `<span class="hljs-title">flush</span>()` <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.\n\n###&quot;,
        0.7302717566490173
    ],
    [
        &quot;How does Milvus handle vector data types <span class="hljs-keyword">and</span> precision?\n\nMilvus supports Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 vector types.\n\n- Binary vectors: Store binary data <span class="hljs-keyword">as</span> sequences of 0s <span class="hljs-keyword">and</span> 1s, used <span class="hljs-keyword">in</span> image processing <span class="hljs-keyword">and</span> information retrieval.\n- Float32 vectors: Default storage <span class="hljs-keyword">with</span> a precision of about 7 <span class="hljs-built_in">decimal</span> digits. Even Float64 values are stored <span class="hljs-keyword">with</span> Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 <span class="hljs-keyword">and</span> BFloat16 vectors: Offer reduced precision <span class="hljs-keyword">and</span> memory usage. Float16 <span class="hljs-keyword">is</span> suitable <span class="hljs-keyword">for</span> applications <span class="hljs-keyword">with</span> limited bandwidth <span class="hljs-keyword">and</span> storage, <span class="hljs-keyword">while</span> BFloat16 balances range <span class="hljs-keyword">and</span> efficiency, commonly used <span class="hljs-keyword">in</span> deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;,
        0.7003671526908875
    ]
]
</span><button class="copy-code-btn"></button></code></pre>
<p>相較於嵌入相似度得分，重排通常會顯示更高的判別得分（相關文件更接近 1.0）。</p>
<h3 id="Step-4-Generate-Final-Response" class="common-anchor-header"><strong>步驟 4：產生最終回應</strong></h3><p>現在讓我們使用擷取的上下文來產生一個全面的答案：</p>
<p>首先將擷取的文件轉換成字串格式。</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>為大型語言模型提供系統提示和使用者提示。此提示由從 Milvus 擷取的文件產生。</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>使用 GPT-4o 根據提示產生答案。</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>預期輸出：</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main forms: inserted data <span class="hljs-keyword">and</span> metadata. 
Inserted data, which includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific 
schema, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports 
multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including MinIO, AWS S3, 
Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent 
Cloud Object Storage. Metadata <span class="hljs-keyword">for</span> Milvus <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">by</span> its various modules 
<span class="hljs-keyword">and</span> stored <span class="hljs-keyword">in</span> etcd.
<button class="copy-code-btn"></button></code></pre>
<h2 id="Wrapping-Up" class="common-anchor-header"><strong>總結</strong><button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>本教程使用 Qwen3 的 embedding 和 reranking 模型展示了完整的 RAG 實作。主要的心得</p>
<ol>
<li><p><strong>兩階段式檢索</strong>(密集 + 重排) 比純嵌入式方法持續提高準確度</p></li>
<li><p><strong>指令提示</strong>可針對特定領域進行調整，而無需重新訓練</p></li>
<li><p><strong>多語言功能</strong>自然運作，無需增加複雜性</p></li>
<li><p>使用 0.6B 模型進行<strong>本地部署</strong>是可行的</p></li>
</ol>
<p>Qwen3 系列以輕量、開放源碼的套件提供穩固的效能。雖然不是革命性的，但它們提供了循序漸進的改進和有用的功能，例如指令提示，可以在生產系統中發揮真正的作用。</p>
<p>請針對您的特定資料和使用個案測試這些模型 - 何者最有效始終取決於您的內容、查詢模式和效能需求。</p>
