---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: '파이썬이 없어도 문제없다: Java 또는 다른 언어로 ONNX를 사용한 모델 추론'
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: ONNX(오픈 신경망 교환)는 플랫폼에 구애받지 않는 신경망 모델 추론을 수행하는 도구의 에코시스템입니다.
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
<p>제너레이티브 AI 애플리케이션을 구축하는 것이 그 어느 때보다 쉬워졌습니다. 풍부한 도구, AI 모델, 데이터세트로 구성된 에코시스템을 통해 전문 소프트웨어 엔지니어가 아니더라도 인상적인 챗봇, 이미지 생성기 등을 구축할 수 있습니다. 이러한 도구는 대부분 Python을 위해 만들어졌으며 PyTorch를 기반으로 구축됩니다. 하지만 프로덕션 환경에서 Python을 사용할 수 없고 Java, Golang, Rust, C++ 또는 다른 언어를 사용해야 하는 경우에는 어떻게 해야 할까요?</p>
<p>임베딩 모델과 기초 모델을 모두 포함하는 모델 추론으로 제한하며, 모델 학습 및 미세 조정과 같은 다른 작업은 일반적으로 배포 시점에 완료되지 않습니다. Python을 사용하지 않고 모델 추론을 할 수 있는 옵션은 무엇인가요? 가장 확실한 해결책은 Anthropic이나 Mistral과 같은 제공업체의 온라인 서비스를 활용하는 것입니다. 이러한 업체는 일반적으로 파이썬 이외의 언어에 대한 SDK를 제공하며, 그렇지 않은 경우 간단한 REST API 호출만 필요합니다. 하지만 규정 준수 또는 개인정보 보호 문제 등으로 인해 솔루션이 완전히 로컬에 있어야 한다면 어떻게 해야 할까요?</p>
<p>또 다른 해결책은 파이썬 서버를 로컬에서 실행하는 것입니다. 원래의 문제는 프로덕션 환경에서 Python을 실행할 수 없다는 것이었기 때문에 로컬 Python 서버를 사용하는 것이 배제되었습니다. 관련 로컬 솔루션도 유사한 법적, 보안 기반 또는 기술적 제한을 받을 가능성이 높습니다. <em>Java 또는 다른 Python 이외의 언어에서 직접 모델을 호출할 수 있는 완전히 포함된 솔루션이 필요합니다.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 1: 파이썬이 오닉스 나비로 변신합니다.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">ONNX(개방형 신경망 교환)란 무엇인가요?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (오픈 신경망 교환)는 신경망 모델 추론을 수행하기 위한 플랫폼에 구애받지 않는 도구 에코시스템입니다. 처음에는 Meta(당시 Facebook)의 PyTorch 팀이 개발했으며, 이후 Microsoft, IBM, Huawei, Intel, AMD, Arm, Qualcomm에서 추가로 기여했습니다. 현재는 AI 및 데이터를 위한 리눅스 재단에서 소유하고 있는 오픈 소스 프로젝트입니다. ONNX는 플랫폼에 구애받지 않는 신경망 모델을 배포하는 사실상 유일한 방법입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 2: NN 트랜스포머를 위한 (일부) ONNX 계산 그래프</em></p>
<p><strong>우리는 일반적으로 좁은 의미에서 "ONNX"를 파일 형식을 지칭하는 용어로 사용합니다.</strong> ONNX 모델 파일은 종종 수학 함수의 가중치 값을 포함하는 계산 그래프를 나타내며, 이 표준은 신경망에 대한 일반적인 연산을 정의합니다. 파이토치에서 오토디프를 사용할 때 생성되는 계산 그래프와 비슷하게 생각할 수 있습니다. 다른 관점에서 보면, ONNX 파일 형식은 네이티브 코드 컴파일과 마찬가지로 신경망의 <em>중간 표현</em> (IR) 역할을 하는데, 여기에도 IR 단계가 포함됩니다. 위의 그림은 ONNX 계산 그래프를 시각화한 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 3: IR은 프론트엔드와 백엔드의 다양한 조합을 허용합니다.</em></p>
<p>ONNX 파일 형식은 계산 그래프 조작을 위한 라이브러리와 ONNX 모델 파일 로드 및 실행을 위한 라이브러리도 포함하는 ONNX 에코시스템의 일부일 뿐입니다. 이러한 라이브러리는 언어와 플랫폼에 걸쳐 있습니다. ONNX는 IR(중간 표현 언어)에 불과하므로 네이티브 코드로 실행하기 전에 특정 하드웨어 플랫폼에 맞는 최적화를 적용할 수 있습니다. 프런트 엔드와 백엔드의 조합을 보여주는 위 그림을 참조하세요.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">ONNX 워크플로<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>예를 들어, 오픈 소스 벡터 데이터베이스 <a href="https://milvus.io/">Milvus에</a> 대한 데이터 수집을 준비하기 위해 Java에서 텍스트 임베딩 모델을 호출하는 방법을 살펴보겠습니다. 그렇다면 Java에서 임베딩 또는 기초 모델을 호출하려면 해당 모델 파일에서 ONNX 라이브러리를 사용하는 것만큼 간단할까요? 예, 하지만 모델과 토큰화 인코더(및 파운데이션 모델의 경우 디코더) 모두에 대한 파일을 확보해야 합니다. 이러한 파일은 오프라인, 즉 프로덕션 전에 Python을 사용하여 직접 생성할 수 있으며, 지금 설명해 드리겠습니다.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Python에서 NN 모델 내보내기<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>HuggingFace의 문장 변환기 라이브러리를 사용하여 Python에서 일반적인 텍스트 임베딩 모델( <code translate="no">all-MiniLM-L6-v2</code>)을 열어 보겠습니다. 트랜스포머 함수 뒤에 풀링 및 정규화 레이어를 내보내는 문장 트랜스포머를 둘러싼 래퍼가 필요하므로 .txtai의 util 라이브러리를 통해 간접적으로 HF 라이브러리를 사용하겠습니다. (이러한 레이어는 컨텍스트 종속 토큰 임베딩, 즉 트랜스포머의 출력을 가져와서 단일 텍스트 임베딩으로 변환합니다.)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>라이브러리에 HuggingFace 모델 허브에서 <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> 을 ONNX로 내보내도록 지시하고, 작업을 텍스트 임베딩으로 지정하고 모델 정량화를 활성화합니다. <code translate="no">onnx_model()</code> 을 호출하면 로컬에 모델이 없는 경우 모델 허브에서 모델을 다운로드하고, 세 개의 레이어를 ONNX로 변환하고, 계산 그래프를 결합합니다.</p>
<p>이제 Java로 추론을 수행할 준비가 되었나요? 아직은 아닙니다. 모델은 포함하려는 텍스트의 토큰화에 해당하는 토큰 목록(또는 둘 이상의 샘플에 대한 목록 목록)을 입력합니다. 따라서 프로덕션 시간 전에 모든 토큰화를 수행할 수 없다면 Java 내에서 토큰화 도구를 실행해야 합니다.</p>
<p>이를 위한 몇 가지 옵션이 있습니다. 하나는 해당 모델에 대한 토큰화 도구를 Java 또는 다른 언어로 구현하거나 구현을 찾아서 Java에서 정적 또는 동적으로 연결된 라이브러리로 호출하는 것입니다. 더 쉬운 해결책은 모델 ONNX 파일을 사용하는 것처럼 토큰화기를 ONNX 파일로 변환하여 Java에서 사용하는 것입니다.</p>
<p>그러나 일반 ONNX에는 토큰화 도구의 계산 그래프를 구현하는 데 필요한 연산이 포함되어 있지 않습니다. 이러한 이유로 Microsoft는 ONNX를 보강하기 위해 ONNXRuntime-Extensions라는 라이브러리를 만들었습니다. 이 라이브러리는 텍스트 토큰화뿐만 아니라 모든 종류의 데이터 전처리 및 후처리에 유용한 연산을 정의합니다.</p>
<p>다음은 토큰화기를 ONNX 파일로 내보내는 방법입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>토큰화기의 디코더는 문장을 임베드하는 데 필요하지 않으므로 삭제했습니다. 이제 텍스트 토큰화를 위한 <code translate="no">tokenizer.onnx</code> 파일과 토큰 문자열 임베딩을 위한 <code translate="no">model.onnx</code> 파일 두 개가 있습니다.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Java에서 모델 추론<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Java 내에서 모델을 실행하는 것은 아주 간단합니다. 다음은 전체 예제에서 중요한 코드 몇 줄입니다:</p>
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
<p>전체 작동 예제는 리소스 섹션에서 확인할 수 있습니다.</p>
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
    </button></h2><p>이 포스팅에서는 HuggingFace의 모델 허브에서 오픈 소스 모델을 내보내고 Python 이외의 언어에서 직접 사용할 수 있는 방법을 살펴봤습니다. 하지만 몇 가지 주의 사항이 있습니다:</p>
<p>첫째, ONNX 라이브러리와 런타임 확장 기능의 지원 수준이 다양합니다. 향후 SDK 업데이트가 릴리스될 때까지 모든 언어에서 모든 모델을 사용하지 못할 수도 있습니다. 파이썬, C++, 자바, 자바스크립트용 ONNX 런타임 라이브러리가 가장 포괄적입니다.</p>
<p>둘째, 허깅페이스 허브에는 미리 내보낸 ONNX가 포함되어 있지만 이러한 모델에는 최종 풀링 및 정규화 레이어가 포함되어 있지 않습니다. <code translate="no">torch.onnx</code> 을 직접 사용하려는 경우 <code translate="no">sentence-transformers</code> 의 작동 방식을 알고 있어야 합니다.</p>
<p>그럼에도 불구하고 ONNX는 주요 업계 리더들의 지원을 받고 있으며, 크로스 플랫폼 생성 AI의 원활한 수단이 되기 위한 궤도에 올라서고 있습니다.</p>
<h2 id="Resources" class="common-anchor-header">리소스<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Python 및 Java의 ONNX 코드 예시</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
