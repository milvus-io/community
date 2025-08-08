---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: 'GPT-oss와 o4-mini: 엣지 지원, 동급 성능 - 안정적이지만 놀랍지는 않음'
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI는 Apache 2.0에 따라 허가된 두 가지 추론 모델인 gpt-oss-120b와 gpt-oss-20b를 오픈소스화하여 주목을
  받고 있습니다.
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
<p>인공지능 세계는 뜨겁게 달아오르고 있습니다. 불과 몇 주 만에 Anthropic은 Claude 4.1 Opus를 출시했고, DeepMind는 Genie 3 월드 시뮬레이터로 모두를 놀라게 했으며, 이제 OpenAI는 Apache 2.0에 따라 허가된 두 가지 추론 모델인 <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b와</a> <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b를</a> 오픈소스화하며 주목을 받고 있습니다.</p>
<p>이 모델들은 출시 후 곧바로 Hugging Face에서 인기 트렌드 1위에 올랐고, 그럴 만한 이유가 있었습니다. OpenAI가 실제 생산이 가능한 오픈 웨이트 모델을 출시한 것은 2019년 이후 이번이 처음입니다. 수년간 API 전용 액세스를 추진해 온 OpenAI는 벤치마크와 개발자 워크플로우를 모두 장악하고 있는 DeepSeek, Meta의 LLaMA, Qwen과 같은 오픈 소스 리더의 압력에 분명하게 대응하고 있습니다.</p>
<p>이 글에서는 GPT-oss의 차별화 요소, DeepSeek R1 및 Qwen 3와 같은 주요 오픈 모델과의 비교, 개발자가 관심을 가져야 하는 이유에 대해 살펴봅니다. 또한 가장 인기 있는 오픈 소스 벡터 데이터베이스인 GPT-oss와 Milvus를 사용해 추론이 가능한 RAG 시스템을 구축하는 방법도 살펴봅니다.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">GPT-oss가 특별한 이유는 무엇이며 왜 관심을 가져야 할까요?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss는 단순한 경량화가 아닙니다. 개발자에게 중요한 다섯 가지 핵심 영역을 제공합니다:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: 엣지 배포를 위한 구축</h3><p>GPT-oss는 전략적으로 크기가 다른 두 가지 버전으로 제공됩니다:</p>
<ul>
<li><p>GPT-oss-120B: 총 117억 개, 토큰당 51억 개 활성</p></li>
<li><p>GPT-oss-20B: 총 210억 개, 토큰당 36억 개 활성</p></li>
</ul>
<p>전문가 혼합(MoE) 아키텍처를 사용하면 추론 중에 매개변수의 하위 집합만 활성화됩니다. 따라서 두 모델 모두 크기에 비해 실행이 가볍습니다:</p>
<ul>
<li><p>gpt-oss-120b는 단일 80GB GPU(H100)에서 실행됩니다.</p></li>
<li><p>gpt-oss-20b는 16GB VRAM에 불과하므로 하이엔드 노트북이나 엣지 디바이스에서 실행할 수 있습니다.</p></li>
</ul>
<p>OpenAI의 테스트에 따르면, gpt-oss-20b는 추론을 위한 가장 빠른 OpenAI 모델로, 지연 시간이 짧은 배포 또는 오프라인 추론 에이전트에 이상적입니다.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: 강력한 벤치마크 성능</h3><p>OpenAI의 평가에 따르면</p>
<ul>
<li><p><strong>gpt-oss-120b는</strong> 추론, 도구 사용, 경쟁 코딩(Codeforces, MMLU, TauBench)에서 o4-mini와 거의 동등한 성능을 발휘합니다.</p></li>
<li><p><strong>gpt-oss-20b는</strong> o3-mini와 경쟁하며, 심지어 수학 및 의료 추론에서 더 뛰어난 성능을 발휘합니다.</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: 비용 효율적인 트레이닝</h3><p>OpenAI는 o3-mini 및 o4-mini와 동등한 성능을 자랑하지만 훈련 비용은 훨씬 저렴합니다:</p>
<ul>
<li><p><strong>GPT-OS-120B</strong>: 210만 H100시간 → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210만 H100시간 → ~$1백만</p></li>
</ul>
<p>GPT-4와 같은 모델에 수억 달러의 예산이 투입되는 것과 비교해 보세요. GPT-oss는 효율적인 확장 및 아키텍처 선택으로 막대한 탄소 발자국 없이도 경쟁력 있는 성능을 제공할 수 있음을 증명합니다.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: 진정한 오픈 소스의 자유</h3><p>GPT-oss는 Apache 2.0 라이선스를 사용합니다:</p>
<ul>
<li><p>상업적 사용 허용</p></li>
<li><p>완전한 수정 및 재배포 권한</p></li>
<li><p>사용 제한이나 카피레프트 조항 없음</p></li>
</ul>
<p>이것은 연구 전용 릴리스가 아닌 진정한 오픈 소스입니다. 도메인별 용도에 맞게 미세 조정하고, 완전한 제어를 통해 프로덕션에 배포하고, 이를 기반으로 상용 제품을 구축할 수 있습니다. 주요 기능으로는 구성 가능한 추론 깊이(낮음/중간/높음), 전체 사고 사슬 가시성, 구조화된 출력 지원을 통한 기본 도구 호출 등이 있습니다.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: 잠재적인 GPT-5 미리보기</h3><p>OpenAI는 모든 것을 공개하지는 않았지만 아키텍처 세부 사항을 보면 <strong>GPT-5의</strong> 방향을 미리 엿볼 수 있습니다:</p>
<ul>
<li><p>입력당 4명의 전문가와 함께 MoE 사용</p></li>
<li><p>고밀도 + 로컬 스파스 주의(GPT-3 패턴)를 번갈아 사용함</p></li>
<li><p>더 많은 주의 헤드 기능</p></li>
<li><p>흥미롭게도 GPT-2의 바이어스 유닛이 다시 등장했습니다.</p></li>
</ul>
<p>다음에 나올 신호에 대한 신호를 주시하고 있다면 GPT-oss가 가장 명확한 공개 힌트일 수 있습니다.</p>
<h3 id="Core-Specifications" class="common-anchor-header">핵심 사양</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>모델</strong></td><td><strong>총 파라미터</strong></td><td><strong>활성 매개변수</strong></td><td><strong>전문가</strong></td><td><strong>컨텍스트 길이</strong></td><td><strong>VRAM 요구</strong></td></tr>
<tr><td>GPT-OS-120B</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>GPT-OSS-20B</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>두 모델 모두 o200k_harmony 토큰화기를 사용하며 128,000개의 토큰 컨텍스트 길이(약 96,000-100,000단어)를 지원합니다.</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss와 다른 추론 모델 비교<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 OpenAI의 내부 모델 및 주요 오픈 소스 경쟁 모델과 GPT-oss의 비교입니다:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>모델</strong></td><td><strong>매개변수(활성)</strong></td><td><strong>메모리</strong></td><td><strong>강점</strong></td></tr>
<tr><td><strong>GPT-oss-120B</strong></td><td>117B(5.1B 활성)</td><td>80GB</td><td>단일 GPU, 개방형 추론</td></tr>
<tr><td><strong>GPT-OS-20B</strong></td><td>21B(3.6B 활성)</td><td>16GB</td><td>엣지 배포, 빠른 추론</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B(~37B 활성)</td><td>분산형</td><td>벤치마크 리더, 입증된 성능</td></tr>
<tr><td><strong>o4-mini(API)</strong></td><td>독점</td><td>API 전용</td><td>강력한 추론(비공개)</td></tr>
<tr><td><strong>o3-mini(API)</strong></td><td>독점</td><td>API 전용</td><td>경량 추론(비공개)</td></tr>
</tbody>
</table>
<p>다양한 벤치마킹 모델을 기반으로 한 결과는 다음과 같습니다:</p>
<ul>
<li><p><strong>GPT-oss와 OpenAI 자체 모델 비교:</strong> gpt-oss-120b는 경쟁 수학(AIME), 코딩(Codeforces), 도구 사용(TauBench)에서 o4-mini와 일치합니다. 20b 모델은 훨씬 더 작지만 o3-mini와 비슷한 성능을 발휘합니다.</p></li>
<li><p><strong>GPT-oss 대 DeepSeek R1:</strong> 순수한 성능에서는 DeepSeek R1이 우위에 있지만 분산 인프라가 필요합니다. GPT-oss는 120b 모델에 분산 설정이 필요 없는 더 간단한 배포를 제공합니다.</p></li>
</ul>
<p>요약하면, GPT-oss는 성능, 개방형 액세스, 배포 가능성의 최상의 조합을 제공합니다. 순수한 성능 면에서는 DeepSeek R1이 우위에 있지만, 대부분의 개발자에게는 GPT-oss가 최적의 균형을 이룹니다.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">실습: GPT-oss + Milvus로 구축하기<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 GPT-oss가 어떤 기능을 제공하는지 살펴보았으니 이제 실제로 사용해 볼 차례입니다.</p>
<p>다음 섹션에서는 API 키 없이 로컬에서 실행되는 gpt-oss-20b와 Milvus를 사용하여 추론이 가능한 RAG 시스템을 구축하는 실습 튜토리얼을 살펴보겠습니다.</p>
<h3 id="Environment-Setup" class="common-anchor-header">환경 설정</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">데이터 세트 준비</h3><p>Milvus 문서를 지식 베이스로 사용하겠습니다:</p>
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
<h3 id="Model-Setup" class="common-anchor-header">모델 설정</h3><p><a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter를</a> 통해 GPT-oss에 액세스(또는 로컬에서 실행)합니다. <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter는</strong></a> 개발자가 단일 통합 API를 통해 여러 AI 모델(예: GPT-4, Claude, Mistral)에 액세스하고 이들 간에 전환할 수 있는 플랫폼입니다. 모델을 비교하거나 여러 AI 제공업체에서 작동하는 앱을 구축할 때 유용합니다. 이제 오픈라우터에서 GPT-oss 시리즈를 사용할 수 있습니다.</p>
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
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스 설정</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

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
<p>MilvusClient 매개변수 설정에 대해 설명합니다:</p>
<ul>
<li><p>URI를 로컬 파일(예: <code translate="no">./milvus.db</code>)로 설정하는 것이 가장 편리한 방법으로, Milvus Lite가 자동으로 모든 데이터를 해당 파일에 저장하기 때문입니다.</p></li>
<li><p>대규모 데이터의 경우 Docker 또는 Kubernetes에서 보다 강력한 Milvus 서버를 설정할 수 있습니다. 이 경우 서버의 URI(예: <code translate="no">http://localhost:19530</code>)를 URI로 사용하세요.</p></li>
<li><p>밀버스의 매니지드 서비스인 <a href="https://zilliz.com/cloud">질리즈 클라우드를 </a> 사용하려면, 질리즈 클라우드의 퍼블릭 엔드포인트와 API 키에 해당하는 URI와 토큰을 조정합니다.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">컬렉션에 문서 추가하기</h3><p>이제 텍스트 청크에 대한 임베딩을 생성하여 Milvus에 추가하겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>출력에 추가합니다:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG 쿼리 파이프라인</h3><p>이제 흥미로운 부분인 질문에 답하기 위해 RAG 시스템을 설정해 보겠습니다.</p>
<p>Milvus에 대한 일반적인 질문을 지정해 보겠습니다:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션에서 이 질문을 검색하고 의미적으로 일치하는 상위 3개의 결과를 검색합니다:</p>
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
<p>이 쿼리에 대한 검색 결과를 살펴봅시다:</p>
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
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">GPT-oss를 사용하여 RAG 응답 구축하기</h3><p>검색된 문서를 문자열 형식으로 변환합니다:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>대규모 언어 모델에 대한 시스템 프롬프트 및 사용자 프롬프트를 제공합니다:</p>
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
<p>최신 gpt-oss 모델을 사용하여 프롬프트에 따라 응답 생성하기:</p>
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
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">GPT-oss에 대한 최종 생각<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss는 오픈소스를 더 이상 무시할 수 없다는 OpenAI의 조용한 인정입니다. 딥씨크 R1이나 큐원 3 또는 다른 많은 모델을 뛰어넘지는 못하지만, 이들에게 없는 무언가를 제공합니다: 바로 로컬에서 실제로 검사하고 실행할 수 있는 모델에 적용된 OpenAI의 학습 파이프라인입니다.</p>
<p><strong>성능은? 견고합니다. 놀랍지는 않지만 신뢰할 수 있습니다.</strong> 소비자 하드웨어에서 실행되는 20B 모델, 심지어 LM Studio를 사용하는 모바일에서도 실행되는 20B 모델은 개발자에게 실제로 중요한 실질적인 이점을 제공합니다. "와, 이거면 모든 것이 바뀐다"라기보다는 "그냥 작동한다"에 가깝죠. 솔직히 이 정도면 괜찮습니다.</p>
<p><strong>부족한 부분은 다국어 지원입니다.</strong> 영어가 아닌 다른 언어로 작업하는 경우 이상한 문구, 철자 문제 및 일반적인 혼란을 겪을 수 있습니다. 이 모델은 영어를 우선시하는 렌즈로 명확하게 훈련되었습니다. 글로벌 커버리지가 중요하다면 다국어 데이터 세트를 사용하여 미세 조정해야 할 것입니다.</p>
<p>하지만 가장 흥미로운 것은 타이밍입니다. '라이브스트림'이라는 단어에 '5'가 들어간 OpenAI의 X 티저는 마치 설정처럼 느껴집니다. GPT-oss가 본편은 아닐지 모르지만, GPT-5에서 선보일 내용을 미리 보여주는 것일 수도 있습니다. 같은 재료, 다른 스케일. 기다려 봅시다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>진정한 승리는 더 많은 고품질의 선택권을 갖는 것입니다.</strong> 경쟁은 혁신을 촉진하고, OpenAI가 오픈소스 개발에 다시 참여하면 모두에게 이익이 됩니다. 특정 요구 사항에 대해 GPT-oss를 테스트하되, 브랜드 인지도가 아닌 사용 사례에 실제로 적합한 것을 기준으로 선택하세요.</p>
