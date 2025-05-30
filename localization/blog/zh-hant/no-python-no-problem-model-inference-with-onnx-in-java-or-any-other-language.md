---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: 沒有 Python，沒問題：在 Java 或任何其他語言中使用 ONNX 進行模型推理
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: ONNX (Open Neural Network Exchange) 是一個平台中立的生態系統，包含執行神經網路模型推論的工具。
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>建立 Generative AI 應用程式從未如此容易。豐富的工具、AI 模型和資料集生態系統，讓非專業的軟體工程師也能建構令人印象深刻的聊天機器人、影像產生器等。這些工具大部分都是為 Python 所製作，並且建構在 PyTorch 之上。但當您在生產中無法使用 Python，而需要使用 Java、Golang、Rust、C++ 或其他語言時，該怎麼辦？</p>
<p>我們將僅限於模型推論，包括嵌入模型和基礎模型；其他任務，例如模型訓練和微調，通常不會在部署時完成。在沒有 Python 的情況下，我們有哪些模型推論的選擇？最明顯的解決方案是利用 Anthropic 或 Mistral 等提供者的線上服務。它們通常會為 Python 以外的語言提供 SDK，如果沒有，也只需要簡單的 REST API 呼叫。但是，如果我們的解決方案因為合規性或隱私權等考量而必須完全在本地執行，那該怎麼辦？</p>
<p>另一個解決方案是在本機執行 Python 伺服器。原本的問題是無法在生產中執行 Python，因此排除了使用本機 Python 伺服器的可能性。相關的本機解決方案可能也會受到類似的法律、安全或技術限制。<em>我們需要一個完全包含的解決方案，讓我們可以直接從 Java 或其他非 Python 語言呼叫模型。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 1：Python蛻變為 Onyx 蝴蝶。</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">什麼是 ONNX (Open Neural Network Exchange)？<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a>（開放神經網路交換）是一個平台中立的生態系統，包含執行神經網路模型推論的工具。它最初是由 Meta（當時是 Facebook）的 PyTorch 團隊所開發，微軟、IBM、華為、英特爾、AMD、Arm 和 Qualcomm 也提供了進一步的貢獻。目前，它是 Linux Foundation for AI and Data 所擁有的開源專案。ONNX 是發佈與平台無關的神經網路模型的實際方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 2：一個 NN 變換器的 (部分) ONNX 計算圖表</em></p>
<p><strong>我們通常在狹義上使用「ONNX」來指其檔案格式。</strong>ONNX 模型檔案代表一個計算圖形，通常包括一個數學函數的權重值，這個標準定義了神經網路的常用操作。您可以將它想像成類似於使用 PyTorch 的 autodiff 時所建立的計算圖形。從另一個角度來看，ONNX 檔案格式可作為神經網路的<em>中間表示</em>(IR)，就像原生<em>代碼</em>的編譯一樣，也涉及到 IR 步驟。請參閱上圖，可視化 ONNX 計算圖。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 3：IR 允許許多前端與後端的組合</em></p>
<p>ONNX 檔案格式只是 ONNX 生態系統的一部分，它還包括用於操作計算圖形的函式庫，以及用於載入和執行 ONNX 模型檔案的函式庫。這些函式庫跨越各種語言和平台。由於 ONNX 只是一種 IR (Intermediate Representation Language，中間表達語言)，因此在使用本機程式碼執行之前，可以先套用特定硬體平台的最佳化處理。請參閱上圖，說明前端與後端的組合。</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">ONNX 工作流程<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>為了討論的目的，我們會研究從 Java 調用文字嵌入模型，例如，準備將資料擷取至開放原始碼向量資料庫<a href="https://milvus.io/">Milvus</a>。那麼，如果我們要從 Java 中呼叫我們的嵌入或基礎模型，是否就像在對應的模型檔案上使用 ONNX 函式庫一樣簡單？是的，但我們需要取得模型和 tokenizer 編碼器 (以及基礎模型的解碼器) 的檔案。我們可以使用 Python 離線自行製作這些檔案，也就是在製作之前，現在我們就來說明一下。</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">從 Python 匯出 NN 模型<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們使用 HuggingFace 的句子轉換器函式庫從 Python 開啟一個常見的文字嵌入模型<code translate="no">all-MiniLM-L6-v2</code> 。我們將透過 .txtai 的 util 函式庫間接使用 HF 函式庫，因為我們需要一個句子轉換器的包裝程式，它也會在轉換器函式之後匯出匯集層和規範化層。(這些層採用上下文相關的標記嵌入，也就是轉換器的輸出，並將其轉換為單一的文字嵌入）。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>我們指示函式庫以 ONNX 的形式從 HuggingFace model hub 匯出<code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> ，指定任務為文字嵌入並啟用模型量化。呼叫<code translate="no">onnx_model()</code> 將會從模型集線器下載模型（如果本機尚未存在），將三層轉換為 ONNX，並結合它們的計算圖形。</p>
<p>我們現在準備好在 Java 中執行推論了嗎？沒那麼快。模型會輸入與我們想要嵌入的文字標記化相對應的標記清單（或一個以上樣本的清單）。因此，除非我們能在生產前執行所有的標記化，否則我們需要在 Java 內執行標記器。</p>
<p>在這方面有幾個選擇。其一是以 Java 或其他語言實作或尋找相關模型的符記化器實作，然後以靜態或動態連結函式庫的方式從 Java 中呼叫它。更簡單的解決方案是將標記器轉換成 ONNX 檔案，然後從 Java 使用它，就像我們使用模型 ONNX 檔案一樣。</p>
<p>但是，普通的 ONNX 並不包含實現 tokenizer 計算圖形的必要操作。因此，Microsoft 建立了一個擴充 ONNX 的函式庫，稱為 ONNXRuntime-Extensions。它定義了各種資料前後處理的有用操作，而不僅限於文字符記器。</p>
<p>以下是我們如何將 tokenizer 匯出為 ONNX 檔案：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>我們捨棄了 tokenizer 的解碼器，因為嵌入句子並不需要它。現在，我們有兩個檔案：<code translate="no">tokenizer.onnx</code> 用於標記化文字，<code translate="no">model.onnx</code> 用於嵌入標記串。</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Java 中的模型推論<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Java 中執行我們的模型現在變得微不足道。以下是完整範例中一些重要的程式碼：</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>完整的工作範例可在資源部分找到。</p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇文章中，我們已經看到如何從 HuggingFace 的 model hub 匯出開源模型，並直接從 Python 以外的語言使用它們。然而，我們注意到一些注意事項：</p>
<p>首先，ONNX 函式庫和執行時擴充套件有不同程度的功能支援。在未來 SDK 更新釋出之前，可能無法在所有語言中使用所有模型。適用於 Python、C++、Java 和 JavaScript 的 ONNX 運行時間函式庫是最全面的。</p>
<p>其次，HuggingFace 集線器包含預先匯出的 ONNX，但這些模型不包含最後的匯集層和歸一化層。如果您打算直接使用<code translate="no">torch.onnx</code> ，您應該瞭解<code translate="no">sentence-transformers</code> 的運作方式。</p>
<p>儘管如此，ONNX 已獲得主要業界領導者的支持，並正邁向成為跨平台 Generative AI 的無摩擦方式。</p>
<h2 id="Resources" class="common-anchor-header">資源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Python 和 Java 中的 onnx 程式碼範例</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
