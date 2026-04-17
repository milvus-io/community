---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: Pythonがなくても問題なし：Javaやその他の言語でのONNXによるモデル推論
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX（Open Neural Network
  Exchange）は、ニューラルネットワークモデルの推論を実行するためのツールで構成される、プラットフォームにとらわれないエコシステムです。
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
<p>ジェネレーティブAIアプリケーションの構築がかつてないほど簡単になりました。ツール、AIモデル、データセットの豊富なエコシステムにより、専門外のソフトウェアエンジニアでも印象的なチャットボットや画像ジェネレーターなどを構築できる。このツールの大部分はPython用に作られ、PyTorchの上に構築されている。しかし、本番環境でPythonにアクセスできず、Java、Golang、Rust、C++、あるいは他の言語を使う必要がある場合はどうだろうか？</p>
<p>ここでは、埋め込みモデルと基礎モデルの両方を含む、モデル推論に限定して説明します。Pythonを使わないモデル推論の選択肢は？最も明白な解決策は、AnthropicやMistralのようなプロバイダーのオンラインサービスを利用することです。彼らは通常、Python以外の言語用のSDKを提供しており、もしそうでなければ、単純なREST APIコールが必要になるだけです。しかし、例えばコンプライアンスやプライバシーの問題から、ソリューションを完全にローカルにしなければならない場合はどうするのだろうか？</p>
<p>もう一つの解決策は、ローカルでPythonサーバーを実行することだ。もともとの問題は、本番環境でPythonを実行できないことでしたので、ローカルのPythonサーバーを使うことは除外されます。関連するローカルソリューションは、おそらく同様の法的、セキュリティベース、あるいは技術的な制約を受けるでしょう。<em>Javaや他のPython以外の言語から直接モデルを呼び出せるような、完全なソリューションが必要です。</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図1：PythonがOnyxの蝶に変態する。</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">ONNX（Open Neural Network Exchange）とは？<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX（Open</a>Neural Network Exchange）は、ニューラルネットワークモデルの推論を実行するためのツールで構成される、プラットフォームにとらわれないエコシステムです。当初はMeta（当時はFacebook）のPyTorchチームによって開発され、さらにMicrosoft、IBM、Huawei、Intel、AMD、Arm、Qualcommが参加している。現在は、Linux Foundation for AI and Dataが所有するオープンソースプロジェクトである。ONNXは、プラットフォームに依存しないニューラルネットワークモデルを配布するための事実上の方法である。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図2：NN変換器の（部分的な）ONNX計算グラフ</em></p>
<p><strong>ONNX」は通常、そのファイル形式を指す狭義の意味で使用します。</strong>ONNXモデル・ファイルは計算グラフを表し、しばしば数学関数のウェイト値を含み、この標準はニューラル・ネットワークの一般的な操作を定義している。PyTorchでautodiffを使用したときに作成される計算グラフと同様に考えることができます。別の観点から見ると、ONNXファイルフォーマットはニューラルネットワークの<em>中間表現</em>（IR）として機能し、ネイティブコードのコンパイルとよく似ています。上の図はONNX計算グラフを視覚化したものです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図3：IRはフロントエンドとバックエンドのさまざまな組み合わせを可能にする</em></p>
<p>ONNXファイルフォーマットはONNXエコシステムの一部に過ぎず、計算グラフを操作するためのライブラリや、ONNXモデルファイルをロードして実行するためのライブラリも含まれている。これらのライブラリは、言語やプラットフォームにまたがっている。ONNXは単なるIR（中間表現言語）であるため、ネイティブコードで実行する前に、特定のハードウェアプラットフォームに特化した最適化を適用することができる。上の図は、フロントエンドとバックエンドの組み合わせを示したものです。</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">ONNXワークフロー<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>例えば、オープンソースのベクトルデータベース<a href="https://milvus.io/">Milvusに</a>データを取り込む準備として、Javaからテキスト埋め込みモデルを呼び出すことを検討する。では、埋め込みモデルや基礎モデルをJavaから呼び出す場合、対応するモデルファイル上でONNXライブラリを使うだけでよいのでしょうか？はい、しかし、モデルとトークナイザーエンコーダー（およびファンデーションモデルのデコーダー）の両方のファイルを入手する必要があります。これらのファイルはPythonをオフラインで、つまり本番前に自分で作成することができます。</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">PythonからNNモデルをエクスポートする<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>PythonからHuggingFaceのセンテントランスフォーマライブラリを使って、一般的なテキスト埋め込みモデル、<code translate="no">all-MiniLM-L6-v2</code> を開いてみよう。.txtaiのutilライブラリを介して間接的にHFライブラリを使用します。なぜなら、変換関数の後にプーリング層と正規化層もエクスポートする、文変換のラッパーが必要だからです。(これらの層は文脈依存のトークン埋め込み、つまりトランスフォーマの出力を受け取り、単一のテキスト埋め込みに変換します)。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace モデルハブから<code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> を ONNX としてエクスポートし、タスクをテキスト埋め込みと指定し、モデルの量子化を有効にするようにライブラリに指示する。<code translate="no">onnx_model()</code> を呼び出すと、モデルがまだローカルに存在しない場合、モデルハブからモデルをダウンロードし、3つのレイヤーをONNXに変換し、それらの計算グラフを結合する。</p>
<p>これでJavaで推論を実行する準備ができただろうか？それほど速くはない。モデルは、埋め込みたいテキストのトークン化に対応するトークンのリスト（複数のサンプルの場合はリストのリスト）を入力する。したがって、本番前にすべてのトークン化を実行できない限り、Java内からトークナイザを実行する必要があります。</p>
<p>これにはいくつかの選択肢があります。ひとつは、問題のモデルのトークナイザをJavaまたは他の言語で実装するか、実装を見つけ、Javaから静的または動的にリンクされたライブラリとして呼び出すことです。より簡単な解決策は、モデルのONNXファイルを使用するのと同じように、トークナイザをONNXファイルに変換してJavaから使用することです。</p>
<p>しかし、プレーンなONNXには、トークナイザーの計算グラフを実装するのに必要な操作は含まれていません。このため、Microsoft社はONNXRuntime-ExtensionsというONNXを補強するライブラリを作成した。ONNXRuntime-Extensionsは、テキスト・トークナイザーだけでなく、あらゆるデータの前処理と後処理に役立つ操作を定義しています。</p>
<p>ここでは、私たちのトークナイザーをONNXファイルとしてエクスポートする方法を説明します：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>文の埋め込みにはデコーダーは必要ないので、トークナイザーのデコーダーは破棄しました。これで、テキストをトークン化するための<code translate="no">tokenizer.onnx</code> と、トークンの文字列を埋め込むための<code translate="no">model.onnx</code> の2つのファイルができました。</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Javaでのモデル推論<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Javaからモデルを実行するのは、今や簡単なことだ。以下は、完全な例からのコードの重要な行の一部です：</p>
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
<p>完全な動作例は、リソースセクションにあります。</p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、HuggingFaceのモデルハブからオープンソースのモデルをエクスポートし、Python以外の言語から直接使用することが可能であることを見てきました。しかし、いくつかの注意点があります：</p>
<p>第一に、ONNXライブラリとランタイム拡張機能は、さまざまなレベルの機能をサポートしています。将来のSDKアップデートがリリースされるまで、すべての言語ですべてのモデルを使用することはできないかもしれません。Python、C++、Java、JavaScript用のONNXランタイム・ライブラリが最も包括的です。</p>
<p>第二に、HuggingFaceハブには事前にエクスポートされたONNXが含まれているが、これらのモデルには最終的なプーリングと正規化レイヤーは含まれていない。<code translate="no">torch.onnx</code> を直接使うつもりなら、<code translate="no">sentence-transformers</code> がどのように機能するか知っておくべきである。</p>
<p>とはいえ、ONNXは主要な業界リーダーの支持を得ており、クロスプラットフォームのジェネレーティブAIの摩擦のない手段となる軌道に乗っている。</p>
<h2 id="Resources" class="common-anchor-header">リソース<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">PythonとJavaによるonnxコード例</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
