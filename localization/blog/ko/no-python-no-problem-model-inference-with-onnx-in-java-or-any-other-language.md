---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) is a platform-agnostic ecosystem of tools
  for performing neural network model inference.
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
<p>It has never been easier to build Generative AI applications. A rich ecosystem of tools, AI models, and datasets allows even non-specialized software engineers to build impressive chatbots, image generators, and more. This tooling, for the most part, is made for Python and builds on top of PyTorch. But what about when you don’t have access to Python in production and need to use Java, Golang, Rust, C++, or another language?</p>
<p>We will restrict ourselves to model inference, including both embedding models and foundation models; other tasks, such as model training and fine-tuning, are not typically completed at deployment time. What are our options for model inference without Python? The most obvious solution is to utilize an online service from providers like Anthropic or Mistral. They typically provide an SDK for languages other than Python, and if they didn’t, it would require only simple REST API calls. But what if our solution has to be entirely local due to, for example, compliance or privacy concerns?</p>
<p>Another solution is to run a Python server locally. The original problem was posed as being unable to run Python in production, so that rules out using a local Python server. Related local solutions will likely suffer similar legal, security-based, or technical restrictions. <em>We need a fully contained solution that allows us to call the model directly from Java or another non-Python language.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1: A Python metamorphoses into an Onyx butterfly.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">What is ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) is a platform-agnostic ecosystem of tools for performing neural network model inference. It was initially developed by the PyTorch team at Meta (then Facebook), with further contributions from Microsoft, IBM, Huawei, Intel, AMD, Arm, and Qualcomm. Currently, it is an open-source project owned by the Linux Foundation for AI and Data. ONNX is the de facto method for distributing platform-agnostic neural network models.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2: A (partial) ONNX computational graph for a NN transformer</em></p>
<p><strong>We typically use “ONNX” in a narrower sense to refer to its file format.</strong> An ONNX model file represents a computational graph, often including the weight values of a mathematical function, and the standard defines common operations for neural networks. You can think of it similarly to the computational graph created when you use autodiff with PyTorch. From another perspective, the ONNX file format serves as an <em>intermediate representation</em> (IR) for neural networks, much like native code compilation, which also involves an IR step. See the illustration above visualizing an ONNX computational graph.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3: An IR allows many combinations of front-ends and back-ends</em></p>
<p>The ONNX file format is just one part of the ONNX ecosystem, which also includes libraries for manipulating computational graphs and libraries for loading and running ONNX model files. These libraries span languages and platforms. Since ONNX is just an IR (Intermediate Representation Language), optimizations specific to a given hardware platform can be applied before running it with native code. See the figure above illustrating combinations of front-ends and back-ends.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">ONNX Workflow<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>For discussion purposes, we will investigate calling a text embedding model from Java, for example, in preparation for data ingestion to the open-source vector database <a href="https://milvus.io/">Milvus</a>. So, if we are to call our embedding or foundation model from Java, is it as simple as using the ONNX library on the corresponding model file? Yes, but we will need to procure files for both the model and the tokenizer encoder (and decoder for foundation models). We can produce these ourselves using Python offline, that is, before production, which we now explain.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Exporting NN Models from Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s open a common text embedding model, <code translate="no">all-MiniLM-L6-v2</code>, from Python using HuggingFace’s sentence-transformers library. We will use the HF library indirectly via .txtai’s util library since we need a wrapper around sentence-transformers that also exports the pooling and normalization layers after the transformer function. (These layers take the context-dependent token embeddings, that is, the output of the transformer, and transform it into a single text embedding.)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>We instruct the library to export <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> from the HuggingFace model hub as ONNX, specifying the task as text embedding and enabling model quantization. Calling <code translate="no">onnx_model()</code> will download the model from the model hub if it does not already exist locally, convert the three layers to ONNX, and combine their computational graphs.</p>
<p>Are we ready now to perform inference in Java? Not quite so fast. The model inputs a list of tokens (or a list of lists for more than one sample) corresponding to the tokenization of the text we wish to embed. Therefore, unless we can perform all tokenization before production time, we will need to run the tokenizer from within Java.</p>
<p>There are a few options for this. One involves either implementing or finding an implementation of the tokenizer for the model in question in Java or another language, and calling it from Java as a static or dynamically linked library. An easier solution is to convert the tokenizer to an ONNX file and use it from Java, just as we use the model ONNX file.</p>
<p>Plain ONNX, however, does not contain the necessary operations to implement the computational graph of a tokenizer. For this reason, Microsoft created a library to augment ONNX called ONNXRuntime-Extensions. It defines useful operations for all manner of data pre- and postprocessing, not only text tokenizers.</p>
<p>Here is how we export our tokenizer as an ONNX file:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>We have discarded the decoder of the tokenizer, since embedding sentences doesn’t require it. Now, we have two files: <code translate="no">tokenizer.onnx</code> for tokenizing text, and <code translate="no">model.onnx</code> for embedding strings of tokens.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Model Inference in Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Running our model from within Java is now trivial. Here are some of the important lines of code from the full example:</p>
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
<p>A full working example can be found in the resources section.</p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>We have seen in this post how it is possible to export open-source models from HuggingFace’s model hub and use them directly from languages other than Python. We note, however, some caveats:</p>
<p>First, the ONNX libraries and runtime extensions have varying levels of feature support. It may not be possible to use all models across all languages until a future SDK update is released. The ONNX runtime libraries for Python, C++, Java, and JavaScript are the most comprehensive.</p>
<p>Second, the HuggingFace hub contains pre-exported ONNX, but these models don’t include the final pooling and normalization layers. You should be aware of how <code translate="no">sentence-transformers</code> works if you intend to use <code translate="no">torch.onnx</code> directly.</p>
<p>Nevertheless, ONNX has the backing of major industry leaders and is on a trajectory to become a frictionless means of cross-platform Generative AI.</p>
<h2 id="Resources" class="common-anchor-header">Resources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Example onnx code in Python and Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
