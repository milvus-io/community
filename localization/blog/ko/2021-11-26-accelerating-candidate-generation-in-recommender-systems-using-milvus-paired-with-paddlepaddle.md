---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: 밀버스와 패들패들을 결합하여 추천 시스템에서 후보 생성 가속화하기
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: 추천 시스템의 최소한의 워크플로우
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>추천 시스템을 개발한 경험이 있다면 다음 중 적어도 한 가지 이상의 문제를 겪어보셨을 것입니다:</p>
<ul>
<li>엄청난 양의 데이터 집합으로 인해 시스템에서 결과를 반환하는 속도가 매우 느립니다.</li>
<li>새로 삽입된 데이터를 검색이나 쿼리를 위해 실시간으로 처리할 수 없습니다.</li>
<li>추천 시스템 배포가 어렵습니다.</li>
</ul>
<p>이 글에서는 오픈소스 벡터 데이터베이스인 Milvus와 딥러닝 플랫폼인 PaddlePaddle을 함께 사용하는 상품 추천 시스템 프로젝트를 소개함으로써 위에서 언급한 문제를 해결하고 인사이트를 제공하는 것을 목표로 합니다.</p>
<p>이 글에서는 추천 시스템의 최소한의 워크플로우에 대해 간략하게 설명합니다. 그런 다음 이 프로젝트의 주요 구성 요소와 구현 세부 사항을 소개합니다.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">추천 시스템의 기본 워크플로<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>프로젝트 자체에 대해 자세히 알아보기 전에 먼저 추천 시스템의 기본 워크플로우에 대해 살펴보겠습니다. 추천 시스템은 사용자의 고유한 관심사와 필요에 따라 개인화된 결과를 반환할 수 있습니다. 이러한 개인화된 추천을 위해 시스템은 후보 생성 및 순위 지정의 두 단계를 거칩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>첫 번째 단계는 후보 생성으로, 사용자 프로필과 일치하는 제품이나 동영상 등 가장 관련성이 높거나 유사한 데이터를 반환합니다. 후보를 생성하는 동안 시스템은 사용자 특성을 데이터베이스에 저장된 데이터와 비교하여 유사한 특성을 검색합니다. 그런 다음 순위를 매기는 동안 시스템은 검색된 데이터에 점수를 매기고 순서를 다시 지정합니다. 마지막으로 목록 상단에 있는 결과가 사용자에게 표시됩니다.</p>
<p>상품 추천 시스템의 경우, 먼저 사용자 프로필과 인벤토리에 있는 상품의 특성을 비교하여 사용자의 니즈에 맞는 상품 목록을 필터링합니다. 그런 다음 시스템은 사용자 프로필과의 유사성을 기준으로 제품의 점수를 매기고 순위를 매긴 다음 최종적으로 상위 10개 제품을 사용자에게 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">시스템 아키텍처<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>이 프로젝트의 상품 추천 시스템은 세 가지 구성 요소를 사용합니다: 마인드, 패들렉, 밀버스.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND는</a>&quot;다중 관심 네트워크와 동적 라우팅을 통한 티몰 추천&quot;의 줄임말로, 알리바바 그룹에서 개발한 알고리즘입니다. MIND가 제안되기 전에는 추천을 위해 널리 사용되는 대부분의 AI 모델은 사용자의 다양한 관심사를 표현하기 위해 단일 벡터를 사용했습니다. 그러나 단일 벡터로는 사용자의 정확한 관심사를 표현하기에 충분하지 않습니다. 따라서 사용자의 다양한 관심사를 여러 개의 벡터로 변환하는 MIND 알고리즘이 제안되었습니다.</p>
<p>특히, MIND는 후보 생성 단계에서 한 사용자의 여러 관심사를 처리하기 위해 동적 라우팅이 가능한 <a href="https://arxiv.org/pdf/2005.09347">다중 관심사 네트워크를</a> 채택합니다. 다중 관심사 네트워크는 캡슐 라우팅 메커니즘을 기반으로 구축된 다중 관심사 추출기의 계층입니다. 사용자의 과거 행동과 여러 관심사를 결합하여 정확한 사용자 프로필을 제공하는 데 사용할 수 있습니다.</p>
<p>다음 다이어그램은 MIND의 네트워크 구조를 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>사용자의 특성을 표현하기 위해 MIND는 사용자 행동과 사용자 관심사를 입력으로 받은 다음 이를 임베딩 레이어에 공급하여 사용자 관심사 벡터와 사용자 행동 벡터를 포함한 사용자 벡터를 생성합니다. 그런 다음 사용자 행동 벡터를 다중 관심사 추출기 레이어에 공급하여 사용자 관심사 캡슐을 생성합니다. 사용자 관심사 캡슐을 사용자 행동 임베딩과 연결하고 여러 ReLU 레이어를 사용하여 변환한 후, MIND는 여러 사용자 표현 벡터를 출력합니다. 이 프로젝트에서는 MIND가 궁극적으로 4개의 사용자 표현 벡터를 출력하도록 정의했습니다.</p>
<p>반면에 제품 특성은 임베딩 레이어를 거쳐 희소 항목 벡터로 변환됩니다. 그런 다음 각 항목 벡터는 풀링 레이어를 거쳐 고밀도 벡터가 됩니다.</p>
<p>모든 데이터가 벡터로 변환되면 학습 과정을 안내하기 위해 추가적인 레이블 인식 주의 계층이 도입됩니다.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec은</a> 추천을 위한 대규모 검색 모델 라이브러리입니다. Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a> 에코시스템의 일부입니다. 패들렉은 개발자가 쉽고 빠르게 추천 시스템을 구축할 수 있는 통합 솔루션을 제공하는 것을 목표로 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>첫 문단에서 언급했듯이, 추천 시스템을 개발하는 엔지니어는 종종 사용성이 떨어지고 시스템 배포가 복잡해지는 문제에 직면하게 됩니다. 하지만 패들렉은 다음과 같은 측면에서 개발자에게 도움을 줄 수 있습니다:</p>
<ul>
<li><p>사용의 용이성: PaddleRec은 후보 생성, 랭킹, 재랭킹, 멀티태스킹 등의 모델을 포함하여 업계에서 널리 사용되는 다양한 모델을 캡슐화한 오픈 소스 라이브러리입니다. PaddleRec을 사용하면 모델의 효과를 즉시 테스트하고 반복을 통해 효율성을 개선할 수 있습니다. PaddleRec은 뛰어난 성능으로 분산 시스템을 위한 모델을 쉽게 훈련할 수 있는 방법을 제공합니다. 희소 벡터의 대규모 데이터 처리에 최적화되어 있습니다. PaddleRec은 수평적으로 쉽게 확장하고 컴퓨팅 속도를 가속화할 수 있습니다. 따라서 PaddleRec을 사용하여 Kubernetes에서 빠르게 교육 환경을 구축할 수 있습니다.</p></li>
<li><p>배포 지원: PaddleRec은 모델을 위한 온라인 배포 솔루션을 제공합니다. 모델은 교육 후 즉시 사용할 수 있으며 유연성과 고가용성이 특징입니다.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus는</a> 클라우드 네이티브 아키텍처를 갖춘 벡터 데이터베이스입니다. <a href="https://github.com/milvus-io">GitHub에서</a> 오픈 소스로 제공되며 심층 신경망 및 기타 머신 러닝(ML) 모델에서 생성된 대규모 임베딩 벡터를 저장, 색인화 및 관리하는 데 사용할 수 있습니다. Milvus는 Faiss, NMSLIB, Annoy를 비롯한 여러 최고 수준의 근사 근사 이웃(ANN) 검색 라이브러리를 캡슐화합니다. 필요에 따라 Milvus를 확장할 수도 있습니다. Milvus 서비스는 고가용성이며 통합 배치 및 스트림 처리를 지원합니다. Milvus는 비정형 데이터 관리 프로세스를 간소화하고 다양한 배포 환경에서 일관된 사용자 경험을 제공하기 위해 최선을 다하고 있습니다. 다음과 같은 특징이 있습니다:</p>
<ul>
<li><p>대규모 데이터 세트에서 벡터 검색을 수행할 때 뛰어난 성능.</p></li>
<li><p>다국어 지원과 도구 체인을 제공하는 개발자 우선 커뮤니티.</p></li>
<li><p>클라우드 확장성 및 장애 발생 시에도 높은 안정성.</p></li>
<li><p>스칼라 필터링과 벡터 유사도 검색을 결합하여 하이브리드 검색을 실현합니다.</p></li>
</ul>
<p>시스템 안정성을 유지하면서 잦은 데이터 업데이트 문제를 해결할 수 있어 이 프로젝트에서 벡터 유사도 검색과 벡터 관리에 Milvus를 사용했습니다.</p>
<h2 id="System-implementation" class="common-anchor-header">시스템 구현<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>이 프로젝트에서 상품 추천 시스템을 구축하려면 다음 단계를 거쳐야 합니다:</p>
<ol>
<li>데이터 처리</li>
<li>모델 학습</li>
<li>모델 테스트</li>
<li>상품 아이템 후보 생성<ol>
<li>데이터 저장: 학습된 모델을 통해 아이템 벡터를 획득하여 Milvus에 저장합니다.</li>
<li>데이터 검색: MIND에서 생성된 4개의 사용자 벡터가 Milvus에 제공되어 벡터 유사도 검색을 수행합니다.</li>
<li>데이터 랭킹: 4개의 벡터 각각에 <code translate="no">top_k</code> 유사한 항목 벡터가 있고, 4개의 <code translate="no">top_k</code> 벡터 세트의 순위를 매겨 <code translate="no">top_k</code> 가장 유사한 벡터의 최종 목록을 반환합니다.</li>
</ol></li>
</ol>
<p>이 프로젝트의 소스 코드는 <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a> 플랫폼에서 호스팅됩니다. 다음 섹션에서는 이 프로젝트의 소스 코드에 대해 자세히 설명합니다.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">1단계 데이터 처리</h3><p>원본 데이터 세트는 <a href="https://github.com/THUDM/ComiRec">ComiRec에서</a> 제공하는 아마존 도서 데이터 세트에서 가져옵니다. 하지만 이 프로젝트에서는 PaddleRec에서 다운로드하여 처리한 데이터를 사용합니다. 자세한 내용은 PaddleRec 프로젝트의 <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBook 데이터 세트를</a> 참조하세요.</p>
<p>훈련용 데이터 세트는 다음과 같은 형식으로 표시되며, 각 열은 다음을 나타냅니다:</p>
<ul>
<li><code translate="no">Uid</code>: 사용자 ID.</li>
<li><code translate="no">item_id</code>: 사용자가 클릭한 제품 항목의 ID.</li>
<li><code translate="no">Time</code>: 타임스탬프 또는 클릭 순서.</li>
</ul>
<p>테스트용 데이터 세트는 다음과 같은 형식으로 표시되며 각 열은 다음을 나타냅니다:</p>
<ul>
<li><p><code translate="no">Uid</code>: 사용자 ID.</p></li>
<li><p><code translate="no">hist_item</code>: 과거 사용자 클릭 행동에서 제품 항목의 ID입니다. <code translate="no">hist_item</code> 이 여러 개 있는 경우 타임스탬프에 따라 정렬됩니다.</p></li>
<li><p><code translate="no">eval_item</code>: 사용자가 제품을 클릭한 실제 순서입니다.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">2단계. 모델 학습</h3><p>모델 학습은 이전 단계에서 가공된 데이터를 활용하여 PaddleRec에 구축된 후보 생성 모델인 MIND를 도입합니다.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>모델</strong> <strong>입력</strong></h4><p><code translate="no">dygraph_model.py</code> 에서 다음 코드를 실행하여 데이터를 처리하고 모델 입력으로 전환합니다. 이 과정은 원본 데이터에서 동일한 사용자가 클릭한 항목을 타임스탬프에 따라 정렬하고, 이를 조합하여 하나의 시퀀스를 형성합니다. 그런 다음 시퀀스에서 <code translate="no">item``_``id</code> 을 <code translate="no">target_item</code> 으로 임의로 선택하고 <code translate="no">target_item</code> 앞의 10개 항목을 추출하여 <code translate="no">hist_item</code> 으로 모델 입력에 사용합니다. 시퀀스의 길이가 충분하지 않은 경우 0으로 설정할 수 있습니다. <code translate="no">seq_len</code> 은 <code translate="no">hist_item</code> 시퀀스의 실제 길이가 되어야 합니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>원본 데이터셋을 읽어오는 코드는 <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> 스크립트를 참조하세요.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>모델 네트워킹</strong></h4><p>다음 코드는 <code translate="no">net.py</code> 에서 발췌한 것입니다. <code translate="no">class Mind_Capsual_Layer</code> 은 관심사 캡슐 라우팅 메커니즘에 구축된 다중 관심사 추출기 계층을 정의합니다. <code translate="no">label_aware_attention()</code> 함수는 MIND 알고리즘에서 레이블 인식 관심도 기법을 구현합니다. <code translate="no">class MindLayer</code> 의 <code translate="no">forward()</code> 함수는 사용자 특성을 모델링하고 해당 가중치 벡터를 생성합니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>MIND의 구체적인 네트워크 구조는 <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> 스크립트를 참조하세요.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>모델 최적화</strong></h4><p>이 프로젝트는 <a href="https://arxiv.org/pdf/1412.6980">아담 알고리즘을</a> 모델 최적화 도구로 사용합니다.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>또한, 패들렉은 <code translate="no">config.yaml</code> 에 하이퍼파라미터를 작성하므로 이 파일을 수정하면 두 모델의 효율성을 명확하게 비교하여 모델 효율을 높일 수 있습니다. 모델을 학습할 때 모델 효과가 좋지 않은 것은 모델 과소적합 또는 과적합으로 인해 발생할 수 있습니다. 따라서 훈련 횟수를 수정하여 이를 개선할 수 있습니다. 이 프로젝트에서는 <code translate="no">config.yaml</code> 에서 매개변수 epochs만 변경하면 완벽한 훈련 횟수를 찾을 수 있습니다. 또한 모델 최적화 도구인 <code translate="no">optimizer.class</code> 또는 <code translate="no">learning_rate</code> 에서 디버깅을 위해 변경할 수도 있습니다. 다음은 <code translate="no">config.yaml</code> 의 일부 파라미터를 보여줍니다.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>자세한 구현 방법은 <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> 스크립트를 참조하세요.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>모델 훈련</strong></h4><p>다음 명령을 실행하여 모델 학습을 시작합니다.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>모델 학습 프로젝트는 <code translate="no">/home/aistudio/recommend/model/trainer.py</code> 을 참조하세요.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">3단계. 모델 테스트</h3><p>이 단계에서는 테스트 데이터 세트를 사용하여 학습된 모델의 리콜률 등의 성능을 검증합니다.</p>
<p>모델 테스트 중에는 모델에서 모든 항목 벡터를 로드한 다음 오픈 소스 벡터 데이터베이스인 Milvus로 가져옵니다. <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code> 스크립트를 통해 테스트 데이터 세트를 읽습니다. 이전 단계에서 모델을 로드하고 테스트 데이터 세트를 모델에 입력하여 사용자의 관심사 벡터 4개를 얻습니다. Milvus에서 4개의 관심사 벡터와 가장 유사한 50개의 항목 벡터를 검색합니다. 반환된 결과를 사용자에게 추천할 수 있습니다.</p>
<p>다음 명령을 실행하여 모델을 테스트합니다.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>모델 테스트 중에 시스템은 모델 효과를 평가하기 위한 여러 가지 지표(예: Recall@50, NDCG@50, HitRate@50)를 제공합니다. 이 문서에서는 하나의 매개변수만 수정하는 방법을 소개합니다. 그러나 자체 애플리케이션 시나리오에서는 더 나은 모델 효과를 위해 더 많은 에포크를 학습시켜야 합니다.  또한 다른 최적화 프로그램을 사용하고, 다른 학습 속도를 설정하고, 테스트 횟수를 늘려서 모델 효과를 개선할 수도 있습니다. 서로 다른 효과를 가진 여러 모델을 저장한 다음 가장 성능이 우수하고 애플리케이션에 가장 적합한 모델을 선택하는 것이 좋습니다.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">4단계. 상품 아이템 후보 생성</h3><p>상품 후보 생성 서비스를 구축하기 위해 이 프로젝트에서는 이전 단계에서 학습된 모델을 Milvus와 함께 사용합니다. 후보 생성 중에는 인터페이스를 제공하기 위해 FASTAPI가 사용됩니다. 서비스가 시작되면 <code translate="no">curl</code> 을 통해 터미널에서 직접 명령을 실행할 수 있습니다.</p>
<p>다음 명령을 실행하여 예비 후보를 생성합니다.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>이 서비스는 네 가지 유형의 인터페이스를 제공합니다:</p>
<ul>
<li><strong>삽입</strong>: 다음 명령을 실행하여 모델에서 항목 벡터를 읽고 Milvus의 컬렉션에 삽입합니다.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>예비 후보를 생성합니다</strong>: 사용자가 상품을 클릭하는 순서를 입력하고, 사용자가 클릭할 수 있는 다음 상품을 찾아냅니다. 다음 명령의 <code translate="no">hist_item</code> 은 2차원 벡터이며, 각 행은 사용자가 과거에 클릭한 상품의 시퀀스를 나타냅니다. 시퀀스의 길이를 정의할 수 있습니다. 반환되는 결과도 2차원 벡터의 집합이며, 각 행은 사용자에게 반환된 <code translate="no">item id</code>을 나타냅니다.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>총</strong> <strong>제품 품목</strong><strong>수를 쿼리합니다</strong>: 다음 명령을 실행하여 Milvus 데이터베이스에 저장된 총 품목 벡터 수를 반환합니다.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>삭제</strong>: 다음 명령을 실행하여 Milvus 데이터베이스에 저장된 모든 데이터를 삭제합니다.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>로컬 서버에서 후보 생성 서비스를 실행하는 경우 <code translate="no">127.0.0.1:8000/docs</code> 에서도 위의 인터페이스에 액세스할 수 있습니다. 네 가지 인터페이스를 클릭하고 매개변수 값을 입력하여 사용해 볼 수 있습니다. 그런 다음 '사용해 보기'를 클릭하면 추천 결과를 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">요약<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서는 주로 추천 시스템을 구축할 때 후보를 생성하는 첫 번째 단계에 중점을 두고 있습니다. 또한 Milvus와 MIND 알고리즘 및 PaddleRec을 결합하여 이 프로세스를 가속화하는 솔루션을 제공함으로써 첫 단락에서 제안한 문제를 해결했습니다.</p>
<p>엄청난 양의 데이터셋으로 인해 시스템이 결과를 반환할 때 매우 느리다면 어떻게 해야 할까요? 오픈 소스 벡터 데이터베이스인 Milvus는 수백만, 수십억, 심지어 수조 개의 벡터가 포함된 고밀도 벡터 데이터 세트에서 초고속 유사도 검색을 위해 설계되었습니다.</p>
<p>새로 삽입된 데이터를 검색이나 쿼리를 위해 실시간으로 처리할 수 없다면 어떻게 해야 할까요? 통합 배치 및 스트림 처리를 지원하고 새로 삽입된 데이터를 실시간으로 검색 및 쿼리할 수 있는 Milvus를 사용하면 됩니다. 또한, MIND 모델은 새로운 사용자 행동을 실시간으로 변환하여 사용자 벡터를 Milvus에 즉시 삽입할 수 있습니다.</p>
<p>복잡한 배포가 너무 부담스럽다면 어떻게 해야 할까요? 패들패들 생태계에 속하는 강력한 라이브러리인 패들렉은 추천 시스템이나 기타 애플리케이션을 쉽고 빠르게 배포할 수 있는 통합 솔루션을 제공할 수 있습니다.</p>
<h2 id="About-the-author" class="common-anchor-header">저자 소개<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Zilliz 데이터 엔지니어인 리윤메이는 화중과학기술대학교에서 컴퓨터 공학을 전공했습니다. Zilliz에 입사한 이후 오픈 소스 프로젝트 Milvus의 솔루션을 탐색하고 사용자가 실제 시나리오에서 Milvus를 적용할 수 있도록 지원하는 일을 하고 있습니다. 그녀의 주요 관심 분야는 자연어 처리와 추천 시스템이며, 앞으로 이 두 분야에 더욱 집중하고 싶습니다. 혼자 시간을 보내는 것과 독서를 좋아합니다.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">더 많은 리소스를 찾고 계신가요?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>추천 시스템 구축에 대한 더 많은 사용자 사례를 확인하세요:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Milvus와 함께 Vipshop으로 개인 맞춤형 제품 추천 시스템 구축하기</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Milvus로 옷장 및 의상 계획 앱 구축하기</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">소후 뉴스 앱에 지능형 뉴스 추천 시스템 구축하기</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">음악 추천 시스템을 위한 항목 기반 협업 필터링</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Milvus와 함께 만들기: Xiaomi의 모바일 브라우저 내 AI 기반 뉴스 추천 시스템 구축</a></li>
</ul></li>
<li>다른 커뮤니티와 협업하는 더 많은 Milvus 프로젝트:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">ONNX와 Milvus를 사용하여 이미지 검색을 위한 AI 모델 결합하기</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Milvus, PinSage, DGL, Movielens 데이터 세트로 그래프 기반 추천 시스템 구축하기</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">JuiceFS를 기반으로 Milvus 클러스터 구축하기</a></li>
</ul></li>
<li>오픈 소스 커뮤니티에 참여하세요:<ul>
<li><a href="https://bit.ly/307b7jC">GitHub에서</a> Milvus를 찾거나 기여하기</li>
<li><a href="https://bit.ly/3qiyTEk">포럼을</a> 통해 커뮤니티와 소통하기</li>
<li><a href="https://bit.ly/3ob7kd8">트위터에서</a> 소통하기</li>
</ul></li>
</ul>
