---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: 没有 Python，没问题：用 Java 或其他语言的 ONNX 进行模型推理
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: ONNX（开放神经网络交换）是一个平台无关的生态系统，包含用于执行神经网络模型推理的工具。
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
<p>构建生成式人工智能应用从未如此简单。丰富的工具、AI 模型和数据集生态系统，让非专业的软件工程师也能构建令人印象深刻的聊天机器人、图像生成器等。这些工具大部分是为 Python 开发的，建立在 PyTorch 的基础之上。但是，如果您在生产中无法使用 Python，而需要使用 Java、Golang、Rust、C++ 或其他语言呢？</p>
<p>我们将仅限于模型推理，包括 embedding 模型和基础模型；其他任务，如模型训练和微调，通常不会在部署时完成。在不使用 Python 的情况下，我们有哪些模型推断的选择？最明显的解决方案是利用 Anthropic 或 Mistral 等供应商提供的在线服务。它们通常会为 Python 以外的语言提供 SDK，如果没有，也只需要简单的 REST API 调用。但如果由于合规或隐私等原因，我们的解决方案必须完全本地化，那该怎么办呢？</p>
<p>另一种解决方案是在本地运行 Python 服务器。最初的问题是无法在生产中运行 Python，因此排除了使用本地 Python 服务器的可能性。相关的本地解决方案可能会受到类似的法律、安全或技术限制。<em>我们需要一个完全包含的解决方案，允许我们直接从 Java 或其他非 Python 语言调用模型。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 1：Python 蜕变成 Onyx 蝴蝶。</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">什么是 ONNX（开放神经网络交换）？<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a>（开放神经网络交换）是一个平台无关的生态系统，由用于执行神经网络模型推理的工具组成。它最初由 Meta（当时的 Facebook）的 PyTorch 团队开发，微软、IBM、华为、英特尔、AMD、Arm 和高通也为其做出了贡献。目前，它是 Linux 人工智能和数据基金会拥有的一个开源项目。ONNX 是发布平台无关神经网络模型的事实方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 2：神经网络转换器的（部分）ONNX 计算图</em></p>
<p><strong>我们通常在狭义上使用 "ONNX "来指代其文件格式。</strong>ONNX 模型文件表示一个计算图，通常包括数学函数的权重值，该标准定义了神经网络的常用操作符。你可以把它想象成类似于在 PyTorch 中使用 autodiff 时创建的计算图。从另一个角度看，ONNX 文件格式可以作为神经网络的<em>中间表示</em>（IR），就像本地代码编译一样，其中也包含一个 IR 步骤。请看上图，ONNX 计算图可视化。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 3：IR 允许多种前端和后端组合</em></p>
<p>ONNX 文件格式只是 ONNX 生态系统的一部分，它还包括用于操作计算图的库以及用于加载和运行 ONNX 模型文件的库。这些库跨越语言和平台。由于 ONNX 只是一种中间表示语言（IR），因此在使用本地代码运行之前，可以针对特定硬件平台进行优化。请参见上图，了解前端和后端的组合。</p>
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
    </button></h2><p>为了便于讨论，我们将研究从 Java 调用文本嵌入模型，例如，为向开源向量数据库<a href="https://milvus.io/">Milvus</a> 输入数据做准备。那么，如果我们要从 Java 中调用我们的嵌入或基础模型，是不是就像在相应的模型文件上使用 ONNX 库一样简单呢？是的，但我们需要采购模型和标记编码器（基础模型的解码器）的文件。我们可以自己使用 Python 离线生成这些文件，也就是在生成之前，我们现在来解释一下。</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">从 Python 导出 NN 模型<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们使用 HuggingFace 的 Sentence-transformers 库从 Python 打开一个常见的文本嵌入模型<code translate="no">all-MiniLM-L6-v2</code> 。我们将通过 .txtai 的 util 库间接使用 HF 库，因为我们需要一个句子变换器的包装器，它还能在变换器函数后导出池化和归一化层。(这些层将上下文相关的标记嵌入（即转换器的输出）转换为单一的文本嵌入）。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>我们指示库以 ONNX 的形式从 HuggingFace 模型中心导出<code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> ，指定任务为文本嵌入并启用模型量化。如果本地还不存在模型，调用<code translate="no">onnx_model()</code> 将从模型中心下载模型，将三个层转换为 ONNX，并合并它们的计算图。</p>
<p>现在我们准备好用 Java 执行推理了吗？没那么快。该模型会输入一个标记列表（或一个以上样本的列表），与我们希望嵌入的文本的标记化相对应。因此，除非我们能在制作之前执行所有标记化，否则就需要在 Java 中运行标记化器。</p>
<p>这有几种选择。一种是用 Java 或其他语言实现或找到相关模型的标记化器，然后以静态或动态链接库的形式从 Java 中调用。一种更简单的解决方案是将标记化器转换为 ONNX 文件，然后从 Java 中使用它，就像我们使用模型 ONNX 文件一样。</p>
<p>然而，普通 ONNX 并不包含实现令牌器计算图所需的操作符。因此，微软创建了一个名为 ONNXRuntime-Extensions 的库来增强 ONNX。它为各种数据预处理和后处理定义了有用的操作符，而不仅仅是文本标记符。</p>
<p>下面是我们如何将标记符导出为 ONNX 文件：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>我们舍弃了标记符的解码器，因为嵌入句子并不需要它。现在，我们有两个文件：<code translate="no">tokenizer.onnx</code> ，用于标记文本；<code translate="no">model.onnx</code> ，用于嵌入标记字符串。</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Java 中的模型推理<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Java 中运行我们的模型现在变得轻而易举。下面是完整示例中的一些重要代码行：</p>
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
<p>完整的工作示例可在资源部分找到。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在这篇文章中看到了如何从 HuggingFace 的模型中心导出开源模型，并直接从 Python 以外的语言中使用它们。不过，我们也注意到一些注意事项：</p>
<p>首先，ONNX 库和运行时扩展对特征的支持程度各不相同。在未来的 SDK 更新发布之前，可能无法在所有语言中使用所有模型。用于 Python、C++、Java 和 JavaScript 的 ONNX 运行时库是最全面的。</p>
<p>其次，HuggingFace 集线器包含预导出的 ONNX，但这些模型不包括最终的池化和归一化层。如果您打算直接使用<code translate="no">torch.onnx</code> ，则应了解<code translate="no">sentence-transformers</code> 的工作原理。</p>
<p>尽管如此，ONNX 还是得到了主要行业领导者的支持，并有望成为跨平台生成式人工智能的无障碍手段。</p>
<h2 id="Resources" class="common-anchor-header">资源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Python 和 Java 中的 ONNX 示例代码</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
