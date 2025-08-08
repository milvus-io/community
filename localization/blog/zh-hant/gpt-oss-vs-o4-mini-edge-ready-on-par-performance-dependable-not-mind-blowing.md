---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: GPT-oss 對比 o4-mini：邊緣就緒、同級效能 - 可靠而非驚人
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: OpenAI 透過開放兩個推理模型：gpt-oss-120b 和 gpt-oss-20b，以 Apache 2.0 許可授權，搶盡了風頭。
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>人工智能世界一直在火熱發展。在短短幾個星期內，Anthropic 發表了 Claude 4.1 Opus，DeepMind 推出 Genie 3 世界模擬器讓大家目瞪口呆，而現在，OpenAI 開放了兩個推理模型：<a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a>和<a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>，並以 Apache 2.0 授權。</p>
<p>推出後，這兩個模型立即搶佔抱抱臉熱搜榜第一名的位置，而且理由充分。這是自 2019 年以來，OpenAI 首次釋出實際可量產的開放重量模型。此舉並非偶然--在多年來推動僅 API 存取之後，OpenAI 明顯是在回應 DeepSeek、Meta 的 LLaMA 和 Qwen 等開源領導者的壓力，他們在基準和開發人員工作流程中都佔據了主導地位。</p>
<p>在這篇文章中，我們將探討 GPT-oss 的與眾不同之處、它與 DeepSeek R1 和 Qwen 3 等領先開放模型的比較，以及開發人員應該關心的原因。我們也將利用 GPT-oss 與 Milvus（最受歡迎的開源向量資料庫）來建置一個具備推理能力的 RAG 系統。</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">是什麼讓 GPT-oss 與眾不同？<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss 並非只是另一個減重系統。它在五個關鍵領域提供了對開發人員很重要的功能：</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: 專為邊緣部署而設計</h3><p>GPT-oss 有兩種策略性大小的變體：</p>
<ul>
<li><p>GPT-OSS-120B: 總計 117B, 每個代幣 5.1B active</p></li>
<li><p>GPT-OSS-20B：總容量 21B，每個代幣 3.6B 有效值</p></li>
</ul>
<p>使用 Mixture-of-Experts (MoE) 架構，推論期間只有參數的子集是有效的。這使得這兩個模型相對於其大小而言，都能輕量執行：</p>
<ul>
<li><p>gpt-oss-120b 可在單一 80GB GPU (H100) 上執行</p></li>
<li><p>gpt-oss-20b 只需 16GB VRAM，這意味著它可以在高端筆記本電腦或邊緣設備上運行。</p></li>
</ul>
<p>根據 OpenAI 的測試，gpt-oss-20b 是推理速度最快的 OpenAI 模型，非常適合低延遲部署或離線推理代理。</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: 強大的基準效能</h3><p>根據 OpenAI 的評估：</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>在推理、工具使用和競爭編碼 (Codeforces、MMLU、TauBench) 方面的表現幾乎與 o4-mini 看齊。</p></li>
<li><p><strong>gpt-oss-20b</strong>可與 o3-mini 競爭，甚至在數學與醫療推理上優於 o3-mini</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: 具成本效益的訓練</h3><p>OpenAI 宣稱其效能等同於 o3-mini 和 o4-mini，但訓練成本大幅降低：</p>
<ul>
<li><p><strong>GPT-OSS-120B</strong>：210 萬 H100 小時 → ~$10M</p></li>
<li><p><strong>GPT-OSS-20B</strong>: 210K H100 小時 → ~$1M</p></li>
</ul>
<p>與 GPT-4 等模型背後的數億美元預算相比。GPT-oss 證明，有效率的擴充與架構選擇可以在不產生大量碳足跡的情況下，提供具有競爭力的效能。</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: 真正的開放原始碼自由</h3><p>GPT-oss 採用 Apache 2.0 授權，也就是說：</p>
<ul>
<li><p>允許商業使用</p></li>
<li><p>完整的修改與再散佈權利</p></li>
<li><p>無使用限制或著作權條款</p></li>
</ul>
<p>這是真正的開放原始碼，而不是僅供研究使用的版本。您可以針對特定領域的使用進行微調，在完全受控的情況下部署到生產中，並圍繞它建立商業產品。主要功能包括可設定的推理深度 (低/中/高)、完整的思維鏈可視性，以及支援結構化輸出的原生工具呼叫。</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5：潛在的 GPT-5 預覽</h3><p>OpenAI 未公開所有資訊，但架構細節顯示這可能是<strong>GPT-5</strong> 的預覽方向：</p>
<ul>
<li><p>使用 MoE，每個輸入有 4 位專家</p></li>
<li><p>遵循交替密集 + 局部稀疏注意力 (GPT-3 模式)</p></li>
<li><p>具有更多注意頭</p></li>
<li><p>有趣的是，GPT-2 中的偏置單元卷土重來</p></li>
</ul>
<p>如果您正在觀察下一步的訊號，GPT-oss 可能是最明確的公開暗示。</p>
<h3 id="Core-Specifications" class="common-anchor-header">核心規格</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>型號</strong></td><td><strong>總參數</strong></td><td><strong>有效參數</strong></td><td><strong>專家</strong></td><td><strong>上下文長度</strong></td><td><strong>VRAM 要求</strong></td></tr>
<tr><td>GPT-OSS-120B</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>這兩個模型都使用 o200k_harmony 記錄器，並支援 128,000-token 上下文長度（約 96,000-100,000 字）。</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss 與其他推理模型的比較<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是 GPT-oss 與 OpenAI 內部模型和頂尖開源競爭者的比較：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>模型</strong></td><td><strong>參數 (作用中)</strong></td><td><strong>記憶體</strong></td><td><strong>優勢</strong></td></tr>
<tr><td><strong>GPT-OSS-120B</strong></td><td>117B (5.1B 有效)</td><td>80GB</td><td>單 GPU、開放式推理</td></tr>
<tr><td><strong>GPT-OSS-20B</strong></td><td>21B (3.6B 使用中)</td><td>16GB</td><td>邊緣部署、快速推理</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B 啟用中)</td><td>分散式</td><td>基準領導者，經過驗證的效能</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>專屬</td><td>僅 API</td><td>強大的推理能力 (封閉式)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>專屬</td><td>僅 API</td><td>輕量級推理 (已封閉)</td></tr>
</tbody>
</table>
<p>基於各種基準模型，以下是我們的發現：</p>
<ul>
<li><p><strong>GPT-oss vs. OpenAI 自己的模型：</strong>gpt-oss-120b 在競賽數學 (AIME)、編碼 (Codeforces) 和工具使用 (TauBench) 方面與 o4-mini 相匹配。儘管 20b 模型比 o3-mini 小很多，但其表現與 o3-mini 相似。</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1：</strong>DeepSeek R1 在純效能上佔優，但需要分散式基礎架構。GPT-oss 提供更簡單的部署 - 120b 機型不需要分散式設定。</p></li>
</ul>
<p>總而言之，GPT-oss 提供了效能、開放存取和可部署性的最佳組合。DeepSeek R1 以純效能勝出，但 GPT-oss 對大多數開發人員來說是最佳平衡。</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">實際操作：使用 GPT-oss + Milvus 進行建置<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經看到 GPT-oss 所帶來的好處，是時候讓它派上用場了。</p>
<p>在以下的章節中，我們將使用 gpt-oss-20b 和 Milvus 來建立一個具備推理能力的 RAG 系統，所有的步驟都在本機執行，不需要 API 金鑰。</p>
<h3 id="Environment-Setup" class="common-anchor-header">環境設定</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">資料集準備</h3><p>我們將使用 Milvus 文件作為知識庫：</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">模型設定</h3><p>透過<a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a>存取 GPT-oss（或在本機執行）。<a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a>是一個平台，可讓開發人員透過單一、統一的 API 存取和切換多種 AI 模型 (如 GPT-4、Claude、Mistral)。這對於比較模型或建立與不同 AI 供應商合作的應用程式非常有用。現在 GPT-oss 系列已經可以在 OpenRouter 上使用了。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">設定 Milvus 向量資料庫</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>關於 MilvusClient 參數設定：</p>
<ul>
<li><p>將 URI 設定為本機檔案 (例如：<code translate="no">./milvus.db</code>) 是最方便的方法，因為它會自動使用 Milvus Lite 來儲存該檔案中的所有資料。</p></li>
<li><p>對於大型資料，您可以在 Docker 或 Kubernetes 上架設功能更強大的 Milvus 伺服器。在這種情況下，請使用伺服器的 URI (例如<code translate="no">http://localhost:19530</code>) 作為您的 URI。</p></li>
<li><p>如果您要使用<a href="https://zilliz.com/cloud">Zilliz Cloud </a>(Milvus 的管理服務)，請調整 URI 和 token，它們對應於 Zilliz Cloud 中的 Public Endpoint 和 API key。</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">將文件新增至收藏集</h3><p>現在我們要為文字塊建立嵌入，並將它們加入 Milvus：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG 查詢管道</h3><p>現在是令人興奮的部分 - 讓我們設定 RAG 系統來回答問題。</p>
<p>讓我們指定一個關於 Milvus 的常見問題：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在資料集中搜尋此問題，並擷取前 3 個語意相符的結果：</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>讓我們來看看這個問題的搜尋結果：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">使用 GPT-oss 建立 RAG 回應</h3><p>將擷取的文件轉換成字串格式：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>提供大語言模型的系統提示和使用者提示：</p>
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
<p>使用最新的 gpt-oss 模型根據提示產生回應：</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">對 GPT-oss 的最後感想<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss 是 OpenAI 默默地承認開源不能再被忽視了。它沒有把 DeepSeek R1 或 Qwen 3 或許多其他模型打得落花流水，但它確實帶來了它們所沒有的東西：OpenAI 的訓練管道，應用在您可以在本機檢視與執行的模型上。</p>
<p><strong>效能？不錯。不是很驚人，但很可靠。</strong>在消費性硬體，甚至是使用 LM Studio 的行動裝置上執行的 20B 模型，對開發人員來說是一種實際的優勢。更多的是 「這只是工作」，而不是 「哇，這改變了一切」。老實說，這也不錯。</p>
<p><strong>它的不足之處在於多語言支援。</strong>如果您使用英語以外的語言工作，您會遇到奇怪的措辭、拼寫問題和普遍的混亂。很明顯，這個模型是以英文為導向來訓練的。如果全球覆蓋很重要，您可能需要使用多語言資料集來微調模型。</p>
<p>不過，最有趣的是時間。OpenAI 在 X 上的預告--在「LIVESTREAM」一詞中加入「5」--讓人覺得是個圈套。GPT-oss 可能不是主要的演出，但它可能是 GPT-5 的預告。同樣的成分，不同的規模。讓我們拭目以待。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>真正的勝利是有更多高品質的選擇。</strong>競爭驅使創新，OpenAI 重新投入開放原始碼開發，對大家都有好處。請針對您的特定需求測試 GPT-oss，但選擇的依據是實際適用於您的使用個案，而非品牌知名度。</p>
