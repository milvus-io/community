---
id: how-to-get-the-right-vector-embeddings.md
title: 正しいベクトル埋め込みを取得する方法
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: ベクトル埋め込みの包括的な入門書であり、人気のあるオープンソースのモデルを使ってベクトル埋め込みを生成する方法です。
cover: assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Embeddings, Image Embeddings, Text Embeddings
recommend: true
canonicalUrl: 'https://zilliz.com/blog/how-to-get-the-right-vector-embeddings'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>この記事は<a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stackに</a>掲載されたものを許可を得て再掲載しています。</em></p>
<p><strong>ベクトル埋め込みと、人気のあるオープンソースモデルを使った埋め込み生成方法の包括的な紹介。</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Image by Денис Марчук from Pixabay</span> </span></p>
<p>ベクトル埋め込みは、<a href="https://zilliz.com/blog/vector-similarity-search">意味的類似性を</a>扱う際に非常に重要です。しかし、ベクトルは単に数字の羅列であり、ベクトル埋め込みは入力データを表す数字の羅列です。ベクトル埋め込みを使えば、<a href="https://zilliz.com/blog/introduction-to-unstructured-data">非構造化データを</a>構造化したり、あらゆる種類のデータを数値列に変換して扱うことができる。このアプローチは、定性的な比較に頼るのではなく、入力データに対して数学的な演算を実行することを可能にします。</p>
<p>ベクトル埋め込みは、多くのタスク、特に<a href="https://zilliz.com/glossary/semantic-search">意味検索に</a>影響力を持つ。しかし、ベクトル埋め込みを使う前に、適切なベクトル埋め込みを取得することが非常に重要です。例えば、画像モデルを使ってテキストをベクトル化したり、その逆をしたりすると、おそらく悪い結果が得られるでしょう。</p>
<p>この投稿では、ベクトル埋め込みとは何か、様々なモデルを用いてアプリケーションに適したベクトル埋め込みを生成する方法、<a href="https://milvus.io/">Milvusや</a> <a href="https://zilliz.com/">Zilliz Cloudの</a>ようなベクトルデータベースを用いてベクトル埋め込みを最大限に活用する方法について学びます。</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">ベクトル埋め込みはどのように生成されるのか？<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_vector_embeddings_are_created_03f9b60c68.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ベクトル埋込みの重要性を理解したところで、その仕組みを学びましょう。ベクトル埋め込みとは、ディープラーニングモデルにおける入力データの内部表現であり、埋め込みモデルやディープニューラルネットワークとも呼ばれる。では、どのようにしてこの情報を抽出するのだろうか？</p>
<p>最後の層を取り除き、最後から2番目の層の出力を取り出すことでベクトルを得る。ニューラルネットワークの最後の層は通常、モデルの予測を出力するので、最後から2番目の層の出力を取る。ベクトル埋め込みは、ニューラルネットワークの予測層に供給されるデータである。</p>
<p>ベクトル埋込みの次元数は、モデルの最後から2番目の層のサイズに等しく、したがってベクトルのサイズまたは長さと交換可能です。一般的なベクトルの次元数は、384（Sentence Transformers Mini-LMで生成）、768（Sentence Transformers MPNetで生成）、1,536（OpenAIで生成）、2,048（ResNet-50で生成）などです。</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">ベクトル埋め込みとはどういう意味か？<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>ある人から、ベクトル埋め込みにおける各次元の意味について質問されたことがある。答えは、「何もない」です。ベクトル埋め込みにおける1つの次元は、抽象的すぎて意味を決定することができないからです。しかし、すべての次元を合わせると、入力データの意味論的な意味になります。</p>
<p>ベクトルの次元は、さまざまな属性を抽象的に表現したものです。表現される属性は、学習データとモデル自体に依存する。テキストモデルと画像モデルは、基本的に異なるデータ型に対して学習されるため、異なる埋め込みを生成します。異なるテキストモデルでさえ、異なる埋め込みを生成します。サイズが異なることもあれば、表現する属性が異なることもあります。例えば、法律データで訓練されたモデルは、医療データで訓練されたモデルとは異なることを学習します。このトピックについては、<a href="https://zilliz.com/blog/comparing-different-vector-embeddings">ベクトル埋め込みを比較するという</a>投稿で探りました。</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">適切なベクトル埋め込みを生成する<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>どのようにして適切なベクトル埋め込みを得るのでしょうか？それは、埋め込みたいデータの種類を特定することから始まります。このセクションでは、画像、テキスト、オーディオ、ビデオ、マルチモーダルデータの5種類のデータの埋め込みについて説明します。ここで紹介するモデルはすべてオープンソースで、Hugging FaceやPyTorchから提供されています。</p>
<h3 id="Image-embeddings" class="common-anchor-header">画像埋め込み</h3><p>画像認識は、AlexNetの登場後、2012年に一気に広まりました。それ以来、コンピュータ・ビジョンの分野は多くの進歩を目撃してきた。最新の注目すべき画像認識モデルはResNet-50で、以前のResNet-34アーキテクチャをベースにした50層のディープ残差ネットワークです。</p>
<p>残差ニューラルネットワーク（ResNet）は、ショートカット接続を使用して、深層畳み込みニューラルネットワークにおける消失勾配問題を解決する。このショートカット接続により、前の層からの出力がすべての中間層を経由せずに直接後の層に送られるようになり、消失勾配問題が回避される。この設計により、ResNetは、以前最高の性能を誇った畳み込みニューラルネットワークであるVGGNet（Visual Geometry Group）よりも複雑でなくなっている。</p>
<p>例として2つのResNet-50の実装を推薦する： <a href="https://huggingface.co/microsoft/resnet-50">Hugging FaceのResNet 50と</a> <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">PyTorch HubのResNet 50</a>だ。ネットワークは同じですが、エンベッディングを取得するプロセスは異なります。</p>
<p>以下のコードサンプルは、PyTorchを使ってベクトル埋め込みを取得する方法を示しています。まず、PyTorch Hubからモデルを読み込みます。次に、最後のレイヤーを削除し、<code translate="no">.eval()</code> を呼び出して、推論を実行するようにモデルに指示します。そして、<code translate="no">embed</code> 関数がベクトル埋め込みを生成します。</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFaceは少し異なるセットアップを使用する。以下のコードは、Hugging Faceからベクトル埋め込みを得る方法を示しています。まず、<code translate="no">transformers</code> ライブラリの特徴抽出器とモデルが必要です。モデルの入力を得るために特徴抽出器を使い、出力を得て最後の隠れた状態を抽出するためにモデルを使います。</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, AutoModelForImageClassification


extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)
model = AutoModelForImageClassification.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)


<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Text-embeddings" class="common-anchor-header">テキスト埋め込み</h3><p>AIが発明されて以来、エンジニアや研究者は自然言語とAIの実験を行ってきた。初期の実験には次のようなものがある：</p>
<ul>
<li>ELIZA、最初のAIセラピスト・チャットボット。</li>
<li>ジョン・サールの「中国語の部屋」は、中国語と英語を翻訳する能力に言語の理解が必要かどうかを検証する思考実験である。</li>
<li>英語とロシア語の間のルールベースの翻訳。</li>
</ul>
<p>自然言語に対するAIの操作は、ルールベースの埋め込みから大きく進化した。一次ニューラルネットワークから始まり、RNNによって再帰関係を追加し、時間のステップを追跡するようにした。そこから、シーケンス変換問題を解決するためにトランスフォーマーを使用した。</p>
<p>トランスフォーマーは、入力を状態を表す行列にエンコードするエンコーダー、アテンション行列、デコーダーで構成される。デコーダは状態とアテンション行列をデコードし、出力シーケンスを終了する正しい次のトークンを予測する。GPT-3は現在最もよく使われている言語モデルであり、厳密なデコーダで構成されている。デコーダは入力をエンコードし、正しい次のトークンを予測する。</p>
<p>Hugging Faceによる<code translate="no">sentence-transformers</code> ライブラリから、OpenAIのエンベッディングに加えて使用できる2つのモデルを紹介します：</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>：384次元モデル</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>：768次元モデル</li>
</ul>
<p>どちらのモデルの埋め込みも、同じようにアクセスできます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">マルチモーダル埋め込み</h3><p>マルチモーダルモデルは、画像モデルやテキストモデルよりもあまり発達していません。画像とテキストを関連付けることが多い。</p>
<p>最も有用なオープンソースの例は、画像からテキストへのモデルである<a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>です。CLIP VITのエンベッディングには、画像モデルと同じようにアクセスできます。</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoProcessor, AutoModelForZeroShotImageClassification


processor = AutoProcessor.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
model = AutoModelForZeroShotImageClassification.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Audio-embeddings" class="common-anchor-header">音声埋め込み</h3><p>音声のAIは、テキストや画像のAIに比べてあまり注目されていません。音声の最も一般的なユースケースは、コールセンター、医療技術、アクセシビリティなどの業界向けの音声からテキストへの変換です。一般的なオープンソースのSpeech-to-textモデルは、<a href="https://huggingface.co/openai/whisper-large-v2">OpenAIのWhisper</a>です。以下のコードは、Speech-to-textモデルからベクトル埋め込みを取得する方法を示しています。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
from transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, WhisperModel
from datasets <span class="hljs-keyword">import</span> <span class="hljs-type">load_dataset</span>


<span class="hljs-variable">model</span> <span class="hljs-operator">=</span> WhisperModel.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
feature_extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
ds = load_dataset(<span class="hljs-string">&quot;hf-internal-testing/librispeech_asr_dummy&quot;</span>, <span class="hljs-string">&quot;clean&quot;</span>, split=<span class="hljs-string">&quot;validation&quot;</span>)
inputs = feature_extractor(ds[<span class="hljs-number">0</span>][<span class="hljs-string">&quot;audio&quot;</span>][<span class="hljs-string">&quot;array&quot;</span>], return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
input_features = inputs.<span class="hljs-type">input_features</span>
<span class="hljs-variable">decoder_input_ids</span> <span class="hljs-operator">=</span> torch.tensor([[<span class="hljs-number">1</span>, <span class="hljs-number">1</span>]]) * model.config.<span class="hljs-type">decoder_start_token_id</span>
<span class="hljs-variable">vector_embedding</span> <span class="hljs-operator">=</span> model(input_features, decoder_input_ids=decoder_input_ids).last_hidden_state
<button class="copy-code-btn"></button></code></pre>
<h3 id="Video-embeddings" class="common-anchor-header">ビデオ埋め込み</h3><p>動画の埋め込みは、音声や画像の埋め込みよりも複雑です。動画を扱う場合、同期された音声や画像が含まれるため、マルチモーダルなアプローチが必要です。一般的なビデオモデルの1つに、DeepMindの<a href="https://huggingface.co/deepmind/multimodal-perceiver">マルチモーダルパーシーバーが</a>あります。この<a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">ノートブック・チュートリアルでは</a>、このモデルを使って動画を分類する方法を示します。</p>
<p>入力の埋め込みを取得するには、出力を削除する代わりに、ノートブックに示されているコードから<code translate="no">outputs[1][-1].squeeze()</code> 。このコード・スニペットは、<code translate="no">autoencode</code> 関数の中でハイライトしています。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">autoencode_video</span>(<span class="hljs-params">images, audio</span>):
     <span class="hljs-comment"># only create entire video once as inputs</span>
     inputs = {<span class="hljs-string">&#x27;image&#x27;</span>: torch.from_numpy(np.moveaxis(images, -<span class="hljs-number">1</span>, <span class="hljs-number">2</span>)).<span class="hljs-built_in">float</span>().to(device),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.from_numpy(audio).to(device),
               <span class="hljs-string">&#x27;label&#x27;</span>: torch.zeros((images.shape[<span class="hljs-number">0</span>], <span class="hljs-number">700</span>)).to(device)}
     nchunks = <span class="hljs-number">128</span>
     reconstruction = {}
     <span class="hljs-keyword">for</span> chunk_idx <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(nchunks)):
          image_chunk_size = np.prod(images.shape[<span class="hljs-number">1</span>:-<span class="hljs-number">1</span>]) // nchunks
          audio_chunk_size = audio.shape[<span class="hljs-number">1</span>] // SAMPLES_PER_PATCH // nchunks
          subsampling = {
               <span class="hljs-string">&#x27;image&#x27;</span>: torch.arange(
                    image_chunk_size * chunk_idx, image_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.arange(
                    audio_chunk_size * chunk_idx, audio_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;label&#x27;</span>: <span class="hljs-literal">None</span>,
          }
     <span class="hljs-comment"># forward pass</span>
          <span class="hljs-keyword">with</span> torch.no_grad():
               outputs = model(inputs=inputs, subsampled_output_points=subsampling)


          output = {k:v.cpu() <span class="hljs-keyword">for</span> k,v <span class="hljs-keyword">in</span> outputs.logits.items()}
          reconstruction[<span class="hljs-string">&#x27;label&#x27;</span>] = output[<span class="hljs-string">&#x27;label&#x27;</span>]
          <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;image&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> reconstruction:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = output[<span class="hljs-string">&#x27;image&#x27;</span>]
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = output[<span class="hljs-string">&#x27;audio&#x27;</span>]
          <span class="hljs-keyword">else</span>:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], output[<span class="hljs-string">&#x27;image&#x27;</span>]], dim=<span class="hljs-number">1</span>)
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], output[<span class="hljs-string">&#x27;audio&#x27;</span>]], dim=<span class="hljs-number">1</span>)
          vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<span class="hljs-comment"># finally, reshape image and audio modalities back to original shape</span>
     reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], images.shape)
     reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], audio.shape)
     <span class="hljs-keyword">return</span> reconstruction


     <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">ベクトル埋め込みをベクトルデータベースで保存・索引付け・検索する<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル埋め込みがどのようなものか、そして様々な強力な埋め込みモデルを使ってどのように埋め込みを生成するかを理解したところで、次の問題は、どのように埋め込みを保存し、活用するかです。ベクターデータベースがその答えです。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ようなベクターデータベースは、構造化されていない膨大なデータセットをベクター埋め込みによって保存、インデックス付け、検索するために構築されています。また、様々なAIスタックにとって最も重要なインフラの一つでもある。</p>
<p>ベクトルデータベースは通常、<a href="https://zilliz.com/glossary/anns">近似最近傍（ANN）</a>アルゴリズムを使用して、クエリベクトルとデータベースに格納されているベクトル間の空間距離を計算する。2つのベクトルの位置が近ければ近いほど、関連性が高いことになる。そして、アルゴリズムは上位k個の最近傍を見つけ、ユーザーに配信します。</p>
<p>ベクトルデータベースは、<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM検索拡張世代</a>（RAG）、質問応答システム、推薦システム、意味検索、画像・動画・音声の類似検索などのユースケースで人気があります。</p>
<p>ベクトル埋め込み、非構造化データ、ベクトルデータベースについてより詳しく学ぶには、<a href="https://zilliz.com/blog?tag=39&amp;page=1">ベクトルデータベース101</a>シリーズから始めることを検討してください。</p>
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
    </button></h2><p>ベクトルは、非構造化データを扱うための強力なツールです。ベクトルを使うことで、構造化されていないデータの異なる部分を意味的な類似性に基づいて数学的に比較することができます。適切なベクトル埋め込みモデルを選択することは、あらゆるアプリケーションのベクトル検索エンジンを構築する上で非常に重要である。</p>
<p>この投稿で、ベクトル埋め込みはニューラルネットワークにおける入力データの内部表現であることを学んだ。その結果、ベクトル埋め込みはネットワークのアーキテクチャとモデルの学習に使われるデータに大きく依存します。異なるデータタイプ（画像、テキスト、音声など）は特定のモデルを必要とします。幸いなことに、多くの事前学習済みオープンソースモデルが利用可能です。この投稿では、最も一般的な5種類のデータ（画像、テキスト、マルチモーダル、オーディオ、ビデオ）のモデルを取り上げました。また、ベクトル埋め込みを最大限に活用したいのであれば、ベクトルデータベースが最もポピュラーなツールです。</p>
