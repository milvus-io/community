---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: 'Qwen 3 및 Milvus 실습: 최신 하이브리드 추론 모델로 RAG 구축하기'
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Qwen 3 모델의 주요 기능을 공유하고, Qwen 3와 Milvus를 페어링하여 비용 효율적인 로컬 검색 증강 생성(RAG) 시스템을
  구축하는 과정을 안내합니다.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>실용적인 AI 도구를 끊임없이 찾는 개발자로서 저는 인텔리전스와 효율성 간의 균형을 재정의하도록 설계된 8개의 하이브리드 추론 모델로 구성된 강력한 라인업인<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a> 모델 제품군을 둘러싼 알리바바 클라우드의 최신 릴리스에 대한 소문을 무시할 수 없었습니다. 이 프로젝트는 단 12시간 만에 <strong>17,000개 이상의 GitHub 별을</strong> 획득하고 Hugging Face에서 시간당 최고 <strong>다운로드 수인 23,000건을</strong> 기록했습니다.</p>
<p>그렇다면 이번에는 무엇이 달라졌을까요? 간단히 말해, Qwen 3 모델은 추론(느리고 사려 깊은 응답)과 비추론(빠르고 효율적인 응답)을 단일 아키텍처에 결합하고 다양한 모델 옵션, 향상된 교육 및 성능을 포함하며 엔터프라이즈급 기능을 더 많이 제공한다는 점입니다.</p>
<p>이 포스팅에서는 주목해야 할 Qwen 3 모델의 주요 기능을 요약하고, Qwen 3와 Milvus를 페어링하여 로컬의 비용 인식 검색 증강 생성(RAG) 시스템을 구축하는 과정을 실습 코드와 지연 시간 대비 성능 최적화를 위한 팁을 통해 안내해 드리겠습니다.</p>
<p>자세히 알아보세요.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Qwen 3의 흥미로운 점은 무엇인가요?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen 3를 테스트하고 자세히 살펴본 결과, 단순히 사양표의 숫자가 더 큰 것이 아니라는 것이 분명해졌습니다. 이 모델의 설계 선택이 실제로 개발자가 더 빠르고, 더 스마트하고, 더 많은 제어 기능을 갖춘 더 나은 GenAI 애플리케이션을 구축하는 데 어떻게 도움이 되는지에 관한 것입니다. 눈에 띄는 점은 다음과 같습니다.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. 하이브리드 사고 모드: 필요할 때는 스마트하게, 그렇지 않을 때는 빠르게</h3><p>Qwen 3의 가장 혁신적인 기능 중 하나는 <strong>하이브리드 추론 아키텍처입니다</strong>. 이 기능을 사용하면 작업별로 모델이 얼마나 많은 '사고'를 수행할지 세밀하게 제어할 수 있습니다. 모든 작업에 복잡한 추론이 필요한 것은 아닙니다.</p>
<ul>
<li><p>심층 분석이 필요한 복잡한 문제의 경우, 속도가 느리더라도 추론 능력을 최대한 활용할 수 있습니다.</p></li>
<li><p>일상적인 간단한 쿼리의 경우 더 빠르고 가벼운 모드로 전환할 수 있습니다.</p></li>
<li><p>세션에서 소모되는 컴퓨팅 또는 토큰의 양을 제한하는 <strong>'사고 예산'</strong> 을 설정할 수도 있습니다.</p></li>
</ul>
<p>이 기능은 단순한 실습용 기능이 아닙니다. 인프라 비용이나 사용자 대기 시간을 늘리지 않으면서 고품질 응답을 제공해야 하는 개발자의 일상적인 고민을 직접적으로 해결해 줍니다.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. 다양한 라인업: 다양한 요구 사항을 충족하는 MoE 및 고밀도 모델</h3><p>Qwen 3는 다양한 운영 요구 사항에 맞게 설계된 다양한 모델을 제공합니다:</p>
<ul>
<li><p><strong>두 가지 MoE(전문가 혼합) 모델</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 총 파라미터 235억 개, 쿼리당 활성 220억 개</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 총 300억 개, 활성 30억 개</p></li>
</ul></li>
<li><p><strong>6개의 고밀도 모델</strong>: 민첩한 0.6B부터 방대한 32B 매개변수까지 다양</p></li>
</ul>
<p><em>빠른 기술 배경: 고밀도 모델(예: GPT-3 또는 BERT)은 항상 모든 파라미터를 활성화하므로 더 무겁지만 때로는 예측 가능성이 더 높습니다.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>MoE 모델은</em></a> <em>한 번에 네트워크의 일부만 활성화하므로 규모에 따라 훨씬 더 효율적입니다.</em></p>
<p>실제로 이러한 다양한 모델 라인업을 활용할 수 있습니다:</p>
<ul>
<li><p>임베디드 디바이스와 같이 예측 가능한 워크로드에 고밀도 모델 사용</p></li>
<li><p>클라우드 요금 부담 없이 강력한 기능이 필요한 경우 MoE 모델 사용</p></li>
</ul>
<p>이 제품군을 사용하면 단일 모델 유형에 얽매이지 않고 가벼운 엣지 지원 설정부터 강력한 클라우드 규모 배포에 이르기까지 배포를 맞춤화할 수 있습니다.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. 효율성 및 실제 배포에 집중</h3><p>Qwen 3는 모델 규모 확장에만 초점을 맞추는 대신 교육 효율성과 배포 실용성에 중점을 둡니다:</p>
<ul>
<li><p><strong>36조 개의 토큰으로 학습</strong> - 2.5버전보다 두 배 늘어난<strong>36조 개의 토큰</strong> 사용</p></li>
<li><p><strong>235억 개의 파라미터로 확장되었지만</strong> MoE 기술을 통해 스마트하게 관리되어 리소스 수요와 기능의 균형을 맞춥니다.</p></li>
<li><p><strong>배포에 최적화</strong> - 동적 양자화(FP4에서 INT8로 축소)를 통해 가장 큰 Qwen 3 모델도 적당한 인프라에서 실행할 수 있습니다(예: 4개의 H20 GPU에 배포).</p></li>
</ul>
<p>여기서 목표는 분명합니다. 불균형적인 인프라 투자 없이도 더 강력한 성능을 제공하는 것입니다.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. 실제 통합을 위한 구축: MCP 지원 및 다국어 기능</h3><p>Qwen 3는 고립된 모델 성능뿐만 아니라 통합을 염두에 두고 설계되었습니다:</p>
<ul>
<li><p><strong>MCP(모델 컨텍스트 프로토콜) 호환성을</strong> 통해 외부 데이터베이스, API 및 도구와 원활하게 통합할 수 있으므로 복잡한 애플리케이션의 엔지니어링 오버헤드를 줄일 수 있습니다.</p></li>
<li><p><strong>Qwen-Agent는</strong> 툴 호출 및 워크플로 오케스트레이션을 개선하여 보다 역동적이고 실행 가능한 AI 시스템을 구축할 수 있도록 지원합니다.</p></li>
<li><p><strong>119개 언어 및 방언에 대한 다국어 지원으로</strong> 글로벌 및 다국어 시장을 타깃으로 하는 애플리케이션을 위한 강력한 선택이 될 수 있는 Qwen 3입니다.</p></li>
</ul>
<p>이러한 기능을 종합하면 개발자는 모델에 대한 광범위한 커스텀 엔지니어링 없이도 프로덕션급 시스템을 쉽게 구축할 수 있습니다.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">이제 DeepSearcher에서 지원되는 Qwen 3<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher는</a> 심층 검색 및 보고서 생성을 위한 오픈 소스 프로젝트로, OpenAI의 심층 연구에 대한 로컬 우선 대안으로 설계되었습니다. 개발자가 비공개 또는 도메인별 데이터 소스에서 고품질의 컨텍스트 인식 정보를 표시하는 시스템을 구축하는 데 도움이 됩니다.</p>
<p>이제 딥서처는 Qwen 3의 하이브리드 추론 아키텍처를 지원하므로 개발자는 추론을 동적으로 전환하여 가치를 더할 때만 심층 추론을 적용하고 속도가 더 중요할 때는 이를 건너뛸 수 있습니다.</p>
<p>딥서처는 Zilliz 엔지니어가 개발한 고성능 벡터 데이터베이스인<a href="https://milvus.io"> Milvus와</a> 통합되어 로컬 데이터에 대한 빠르고 정확한 의미론적 검색을 제공합니다. 모델 유연성과 결합하여 개발자는 시스템 동작, 비용 및 사용자 경험을 더욱 효과적으로 제어할 수 있습니다.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">실습 튜토리얼: Qwen 3 및 Milvus로 RAG 시스템 구축하기<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스를 사용하여 RAG 시스템을 구축함으로써 이러한 Qwen 3 모델을 활용해 보겠습니다.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">환경을 설정합니다.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>참고: Alibaba Cloud에서 API 키를 받아야 합니다.</p>
<h3 id="Data-Preparation" class="common-anchor-header">데이터 준비</h3><p>Milvus 문서 페이지를 기본 지식 베이스로 사용합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">모델 설정</h3><p>DashScope의 OpenAI 호환 API를 사용하여 Qwen 3에 액세스하겠습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>테스트 임베딩을 생성하고 그 치수와 처음 몇 개의 요소를 인쇄해 보겠습니다:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>출력합니다:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">밀버스 컬렉션 생성하기</h3><p>Milvus 벡터 데이터베이스를 설정해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>MilvusClient 매개변수 설정에 대해 알아보기:</p>
<ul>
<li><p>URI를 로컬 파일(예: <code translate="no">./milvus.db</code>)로 설정하는 것이 가장 편리한 방법인데, Milvus Lite를 자동으로 사용하여 모든 데이터를 해당 파일에 저장하기 때문입니다.</p></li>
<li><p>대규모 데이터의 경우 Docker 또는 Kubernetes에서 보다 강력한 Milvus 서버를 설정할 수 있습니다. 이 경우 서버의 URI(예: <code translate="no">http://localhost:19530</code>)를 URI로 사용하세요.</p></li>
<li><p>밀버스의 관리형 서비스인 <a href="https://zilliz.com/cloud">질리즈 클라우드를 </a> 사용하려면, 질리즈 클라우드의 퍼블릭 엔드포인트와 API 키에 해당하는 URI와 토큰을 조정합니다.</p></li>
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
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">RAG 쿼리 시스템 구축하기</h3><p>이제 흥미로운 부분인 질문에 답하기 위한 RAG 시스템을 설정해 보겠습니다.</p>
<p>Milvus에 대한 일반적인 질문을 지정해 보겠습니다:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션에서 이 질문을 검색하고 의미적으로 일치하는 상위 3개의 결과를 검색합니다:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>이 쿼리에 대한 검색 결과를 살펴봅시다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">LLM을 사용하여 RAG 응답 구축하기</h3><p>검색된 문서를 문자열 형식으로 변환합니다:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>대규모 언어 모델에 대한 시스템 프롬프트 및 사용자 프롬프트를 제공합니다:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>최신 Qwen 모델을 사용하여 프롬프트에 따라 응답을 생성합니다:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">추론 모드와 비추론 모드 비교: 실제 테스트<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>수학 문제에 대해 두 가지 추론 모드를 비교하는 테스트를 실행했습니다:</p>
<p><strong>문제:</strong> 사람 A와 사람 B가 같은 위치에서 달리기를 시작합니다. A가 먼저 출발하여 5km/h로 2시간 동안 달립니다. B는 15km/h로 뒤따릅니다. B가 따라잡는 데 걸리는 시간은 얼마나 될까요?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>추론 모드를 활성화한 경우:</strong></p>
<ul>
<li><p>처리 시간: ~74.83초</p></li>
<li><p>심층 분석, 문제 구문 분석, 여러 솔루션 경로</p></li>
<li><p>수식을 사용한 고품질 마크다운 출력</p></li>
</ul>
<p>(아래 이미지는 독자의 편의를 위해 모델의 마크다운 응답을 시각화한 스크린샷입니다.)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>비추론 모드:</strong></p>
<p>코드에서 다음을 설정하기만 하면 됩니다. <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>이 문제에 대한 비추론 모드의 결과:</p>
<ul>
<li>처리 시간: ~74.83초</li>
<li>심층 분석, 문제 구문 분석, 여러 솔루션 경로</li>
<li>수식을 사용한 고품질 마크다운 출력</li>
</ul>
<p>(아래 이미지는 독자의 편의를 위해 모델의 마크다운 응답을 시각화한 스크린샷입니다.)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen 3는 GenAI 개발의 실제 요구 사항에 잘 부합하는 유연한 모델 아키텍처를 도입했습니다. 다양한 모델 크기(고밀도 및 MoE 변형 모두 포함), 하이브리드 추론 모드, MCP 통합 및 다국어 지원을 통해 개발자는 사용 사례에 따라 성능, 지연 시간 및 비용을 조정할 수 있는 더 많은 옵션을 제공합니다.</p>
<p>Qwen 3는 확장성만을 강조하기보다는 적응성에 중점을 둡니다. 따라서 추론 기능과 비용 효율적인 운영이 모두 필요한 RAG 파이프라인, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">AI 에이전트</a> 및 프로덕션 애플리케이션을 구축하는 데 실용적인 선택이 될 수 있습니다.</p>
<p>고성능 오픈 소스 벡터 데이터베이스인<a href="https://milvus.io"> Milvus와</a> 같은 인프라와 결합하면 Qwen 3의 기능이 더욱 유용해져 빠른 시맨틱 검색과 로컬 데이터 시스템과의 원활한 통합이 가능해집니다. 이 두 가지를 함께 사용하면 대규모의 지능적이고 반응성이 뛰어난 GenAI 애플리케이션을 위한 강력한 기반을 제공할 수 있습니다.</p>
