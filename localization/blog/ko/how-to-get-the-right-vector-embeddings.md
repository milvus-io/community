---
id: how-to-get-the-right-vector-embeddings.md
title: 올바른 벡터 임베딩을 얻는 방법
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: 벡터 임베딩에 대한 포괄적인 소개와 인기 있는 오픈소스 모델을 사용하여 벡터 임베딩을 생성하는 방법에 대해 설명합니다.
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
<p><em>이 글은 원래 <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack에</a> 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p><strong>벡터 임베딩에 대한 포괄적인 소개와 인기 있는 오픈 소스 모델을 사용하여 임베딩을 생성하는 방법을 소개합니다.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Денис Марчук 이미지 제공: Pixabay</span> </span></p>
<p>벡터 임베딩은 <a href="https://zilliz.com/blog/vector-similarity-search">의미적 유사성</a> 작업을 할 때 매우 중요합니다. 그러나 벡터는 단순히 일련의 숫자인 반면, 벡터 임베딩은 입력 데이터를 나타내는 일련의 숫자입니다. 벡터 임베딩을 사용하면 <a href="https://zilliz.com/blog/introduction-to-unstructured-data">비정형 데이터를</a> 구조화하거나 일련의 숫자로 변환하여 모든 유형의 데이터로 작업할 수 있습니다. 이 접근 방식을 사용하면 정성적 비교에 의존하지 않고 입력 데이터에 대해 수학적 연산을 수행할 수 있습니다.</p>
<p>벡터 임베딩은 많은 작업, 특히 <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색에</a> 영향을 미칩니다. 하지만 사용하기 전에 적절한 벡터 임베딩을 구하는 것이 중요합니다. 예를 들어, 이미지 모델을 사용해 텍스트를 벡터화하거나 그 반대의 경우, 좋지 않은 결과를 얻을 수 있습니다.</p>
<p>이 글에서는 벡터 임베딩의 의미, 다양한 모델을 사용하여 애플리케이션에 적합한 벡터 임베딩을 생성하는 방법, <a href="https://milvus.io/">Milvus</a> 및 <a href="https://zilliz.com/">Zilliz Cloud와</a> 같은 벡터 데이터베이스로 벡터 임베딩을 최대한 활용하는 방법에 대해 알아보겠습니다.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">벡터 임베딩은 어떻게 생성되나요?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>이제 벡터 임베딩의 중요성을 이해했으니 그 작동 원리를 알아봅시다. 벡터 임베딩은 임베딩 모델 또는 심층 신경망이라고도 하는 딥 러닝 모델에서 입력 데이터를 내부적으로 표현하는 것입니다. 그렇다면 이 정보를 어떻게 추출할까요?</p>
<p>마지막 계층을 제거하고 두 번째에서 마지막 계층의 출력을 가져와 벡터를 얻습니다. 신경망의 마지막 계층은 일반적으로 모델의 예측을 출력하므로 두 번째에서 마지막 계층의 출력을 가져옵니다. 벡터 임베딩은 신경망의 예측 계층에 공급되는 데이터입니다.</p>
<p>벡터 임베딩의 차원은 모델에서 두 번째에서 마지막 레이어의 크기와 같으므로 벡터의 크기 또는 길이와 바꿔 사용할 수 있습니다. 일반적인 벡터 차원은 384(Sentence Transformers Mini-LM에서 생성), 768(Sentence Transformers MPNet에서 생성), 1,536(OpenAI에서 생성), 2,048(ResNet-50에서 생성) 등입니다.</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">벡터 임베딩은 무엇을 의미하나요?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>누군가 벡터 임베딩에서 각 차원의 의미에 대해 질문한 적이 있습니다. 짧은 대답은 아무것도 아닙니다. 벡터 임베딩에서 단일 차원은 너무 추상적이어서 그 의미를 파악하기 어렵기 때문에 아무 의미가 없습니다. 그러나 모든 차원을 함께 고려하면 입력 데이터의 의미론적 의미를 제공합니다.</p>
<p>벡터의 차원은 다양한 속성을 높은 수준의 추상적인 표현으로 나타낸 것입니다. 표현되는 속성은 학습 데이터와 모델 자체에 따라 달라집니다. 텍스트 모델과 이미지 모델은 근본적으로 다른 데이터 유형에 대해 학습되기 때문에 서로 다른 임베딩을 생성합니다. 심지어 다른 텍스트 모델도 다른 임베딩을 생성합니다. 크기가 다른 경우도 있고, 표현하는 속성이 다른 경우도 있습니다. 예를 들어, 법률 데이터로 학습된 모델은 의료 데이터로 학습된 모델과 다른 것을 학습합니다. <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">벡터 임베딩을 비교하는</a> 포스팅에서 이 주제에 대해 살펴본 적이 있습니다.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">올바른 벡터 임베딩 생성하기<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>적절한 벡터 임베딩은 어떻게 얻을 수 있을까요? 임베드하려는 데이터의 유형을 파악하는 것부터 시작해야 합니다. 이 섹션에서는 이미지, 텍스트, 오디오, 동영상, 멀티모달 데이터 등 다섯 가지 유형의 데이터 임베딩을 다룹니다. 여기서 소개하는 모든 모델은 오픈 소스이며 Hugging Face 또는 PyTorch에서 제공합니다.</p>
<h3 id="Image-embeddings" class="common-anchor-header">이미지 임베딩</h3><p>이미지 인식은 2012년에 AlexNet이 등장하면서 시작되었습니다. 그 이후로 컴퓨터 비전 분야는 수많은 발전을 거듭해 왔습니다. 가장 최근에 주목할 만한 이미지 인식 모델은 이전의 ResNet-34 아키텍처를 기반으로 하는 50층 심층 잔류 신경망인 ResNet-50입니다.</p>
<p>잔류 신경망(ResNet)은 바로 가기 연결을 사용하여 심층 컨볼루션 신경망의 소실 그라데이션 문제를 해결합니다. 이러한 연결을 통해 이전 계층의 출력이 모든 중간 계층을 거치지 않고 바로 이후 계층으로 이동하여 소실 그라데이션 문제를 피할 수 있습니다. 이러한 설계 덕분에 ResNet은 기존 최고 성능의 컨볼루션 신경망인 VGGNet(Visual Geometry Group)보다 덜 복잡합니다.</p>
<p>두 가지 ResNet-50 구현을 예로 들어보겠습니다: <a href="https://huggingface.co/microsoft/resnet-50">Hugging Face의 ResNet 50과</a> <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">PyTorch Hub의 ResNet 50입니다</a>. 네트워크는 동일하지만 임베딩을 얻는 과정은 다릅니다.</p>
<p>아래 코드 샘플은 PyTorch를 사용해 벡터 임베딩을 얻는 방법을 보여줍니다. 먼저 PyTorch Hub에서 모델을 로드합니다. 다음으로, 마지막 레이어를 제거하고 <code translate="no">.eval()</code> 을 호출하여 모델이 추론을 위해 실행되는 것처럼 동작하도록 지시합니다. 그런 다음 <code translate="no">embed</code> 함수가 벡터 임베딩을 생성합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace는 약간 다른 설정을 사용합니다. 아래 코드는 허깅 페이스에서 벡터 임베딩을 얻는 방법을 보여줍니다. 먼저 <code translate="no">transformers</code> 라이브러리에서 특징 추출기와 모델이 필요합니다. 특징 추출기를 사용하여 모델에 대한 입력을 얻고 모델을 사용하여 출력을 얻고 마지막 숨겨진 상태를 추출합니다.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">텍스트 임베딩</h3><p>엔지니어와 연구자들은 AI가 발명된 이래로 자연어와 AI를 실험해 왔습니다. 초기 실험에는 다음과 같은 것들이 있습니다:</p>
<ul>
<li>최초의 AI 치료사 챗봇인 ELIZA.</li>
<li>중국어와 영어를 번역하는 능력에 언어에 대한 이해가 필요한지 여부를 조사하는 사고 실험인 존 설의 중국어 방(Chinese Room).</li>
<li>영어와 러시아어 간의 규칙 기반 번역.</li>
</ul>
<p>자연어에 대한 AI의 작업은 규칙 기반 임베딩에서 크게 발전했습니다. 기본 신경망으로 시작하여 RNN을 통해 반복 관계를 추가하여 시간의 단계를 추적했습니다. 거기서부터 트랜스포머를 사용해 시퀀스 변환 문제를 해결했습니다.</p>
<p>트랜스포머는 입력을 상태를 나타내는 행렬로 인코딩하는 인코더, 주의 행렬, 디코더로 구성됩니다. 디코더는 상태와 주의 행렬을 디코딩하여 올바른 다음 토큰을 예측하여 출력 시퀀스를 완성합니다. 현재까지 가장 널리 사용되는 언어 모델인 GPT-3는 엄격한 디코더로 구성되어 있습니다. 이 디코더는 입력을 인코딩하고 올바른 다음 토큰을 예측합니다.</p>
<p>다음은 OpenAI의 임베딩과 함께 사용할 수 있는 Hugging Face의 <code translate="no">sentence-transformers</code> 라이브러리에서 제공하는 두 가지 모델입니다:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: 384차원 모델</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: 768차원 모델</li>
</ul>
<p>두 모델 모두 동일한 방식으로 임베딩에 액세스할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">멀티모달 임베딩</h3><p>멀티모달 모델은 이미지나 텍스트 모델보다 덜 개발되었습니다. 종종 이미지를 텍스트와 연관시킵니다.</p>
<p>가장 유용한 오픈 소스 예로는 이미지-텍스트 모델인 <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT가</a> 있습니다. 아래 코드에 표시된 것처럼 이미지 모델과 동일한 방식으로 CLIP VIT의 임베딩에 액세스할 수 있습니다.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">오디오 임베딩</h3><p>오디오용 AI는 텍스트나 이미지용 AI에 비해 덜 주목받았습니다. 오디오의 가장 일반적인 사용 사례는 콜센터, 의료 기술 및 접근성과 같은 산업에서 음성-텍스트 변환입니다. 음성-텍스트 변환에 널리 사용되는 오픈 소스 모델 중 하나는 <a href="https://huggingface.co/openai/whisper-large-v2">OpenAI의 Whisper입니다</a>. 아래 코드는 음성-텍스트 변환 모델에서 벡터 임베딩을 얻는 방법을 보여줍니다.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">동영상 임베딩</h3><p>비디오 임베딩은 오디오나 이미지 임베딩보다 더 복잡합니다. 동영상 작업 시에는 동기화된 오디오와 이미지가 포함되므로 멀티모달 접근 방식이 필요합니다. 널리 사용되는 비디오 모델 중 하나는 DeepMind의 <a href="https://huggingface.co/deepmind/multimodal-perceiver">멀티모달 퍼시버입니다</a>. 이 <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">노트북 튜토리얼에서는</a> 이 모델을 사용해 동영상을 분류하는 방법을 보여드립니다.</p>
<p>입력의 임베딩을 가져오려면 노트북에 표시된 코드에서 출력을 삭제하는 대신 <code translate="no">outputs[1][-1].squeeze()</code> 을 사용하세요. <code translate="no">autoencode</code> 함수에서 이 코드 스니펫을 강조 표시했습니다.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">벡터 데이터베이스로 벡터 임베딩 저장, 인덱싱 및 검색하기<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 벡터 임베딩이 무엇인지, 다양한 강력한 임베딩 모델을 사용하여 벡터 임베딩을 생성하는 방법을 이해했으니 다음 질문은 이를 어떻게 저장하고 활용할 것인가 하는 것입니다. 벡터 데이터베이스가 해답입니다.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus와</a> <a href="https://zilliz.com/cloud">Zilliz Cloud와</a> 같은 벡터 데이터베이스는 벡터 임베딩을 통해 방대한 비정형 데이터 세트의 저장, 색인, 검색을 위해 의도적으로 구축되었습니다. 또한 다양한 AI 스택에서 가장 중요한 인프라 중 하나이기도 합니다.</p>
<p>벡터 데이터베이스는 일반적으로 근사 최인접 <a href="https://zilliz.com/glossary/anns">이웃(ANN)</a> 알고리즘을 사용해 쿼리 벡터와 데이터베이스에 저장된 벡터 사이의 공간 거리를 계산합니다. 두 벡터의 위치가 가까울수록 관련성이 높습니다. 그런 다음 알고리즘은 가장 가까운 상위 k개의 이웃을 찾아 사용자에게 전달합니다.</p>
<p>벡터 데이터베이스는 <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 검색 증강 생성</a> (RAG), 질문과 답변 시스템, 추천 시스템, 시맨틱 검색, 이미지, 비디오 및 오디오 유사도 검색과 같은 사용 사례에서 널리 사용됩니다.</p>
<p>벡터 임베딩, 비정형 데이터, 벡터 데이터베이스에 대해 자세히 알아보려면 벡터 <a href="https://zilliz.com/blog?tag=39&amp;page=1">데이터베이스 101</a> 시리즈부터 시작하세요.</p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터는 비정형 데이터 작업을 위한 강력한 도구입니다. 벡터를 사용하면 의미적 유사성을 기반으로 서로 다른 비정형 데이터를 수학적으로 비교할 수 있습니다. 모든 애플리케이션을 위한 벡터 검색 엔진을 구축하려면 올바른 벡터 임베딩 모델을 선택하는 것이 중요합니다.</p>
<p>이 글에서는 벡터 임베딩이 신경망에서 입력 데이터의 내부 표현이라는 것을 배웠습니다. 따라서 네트워크 아키텍처와 모델 훈련에 사용되는 데이터에 따라 크게 달라집니다. 이미지, 텍스트, 오디오 등 데이터 유형에 따라 특정 모델이 필요합니다. 다행히도 사전 학습된 많은 오픈 소스 모델을 사용할 수 있습니다. 이 게시물에서는 이미지, 텍스트, 멀티모달, 오디오, 비디오 등 가장 일반적인 5가지 데이터 유형에 대한 모델을 다루었습니다. 또한 벡터 임베딩을 최대한 활용하고 싶다면 벡터 데이터베이스가 가장 많이 사용되는 도구입니다.</p>
