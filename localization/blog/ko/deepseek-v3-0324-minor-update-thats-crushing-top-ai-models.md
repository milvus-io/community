---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: 'DeepSeek V3-0324: 최고의 AI 모델을 무너뜨리는 ''마이너 업데이트'''
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: 'DeepSeek v3-0324는 더 큰 매개변수로 학습되고, 컨텍스트 창이 더 길어졌으며, 추론, 코딩 및 수학 기능이 향상되었습니다.'
cover: >-
  assets.zilliz.com/Deep_Seek_V3_0324_The_Minor_Update_That_s_Crushing_Top_AI_Models_391585994c.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>딥시크는 어젯밤 조용히 폭탄을 떨어뜨렸습니다. 공식 발표에서는 API 변경이 없는 <strong>'마이너 업그레이드'에</strong> 불과한 최신 버전인<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324를</a> 경시했습니다. 하지만 <a href="https://zilliz.com/">질리즈의</a> 광범위한 테스트 결과, 이 업데이트는 특히 논리 추론, 프로그래밍, 수학적 문제 해결 능력에서 비약적인 성능 향상을 가져온 것으로 나타났습니다.</p>
<p>단순한 점진적 개선이 아니라, DeepSeek v3-0324를 언어 모델 중 최상위 계층에 위치시키는 근본적인 변화입니다. 그리고 오픈 소스입니다.</p>
<p><strong>이번 릴리스는 AI 기반 애플리케이션을 구축하는 개발자와 기업이라면 즉시 주목할 만한 가치가 있습니다.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">DeepSeek v3-0324의 새로운 기능은 무엇이며 실제로 얼마나 좋은가요?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324는 이전 버전인 <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3에</a> 비해 세 가지 주요 개선 사항을 도입했습니다:</p>
<ul>
<li><p><strong>더 큰 모델, 더 강력한 성능:</strong> 매개변수 수가 6,710억 개에서 6,850억 개로 증가하여 모델이 더 복잡한 추론을 처리하고 더 미묘한 응답을 생성할 수 있게 되었습니다.</p></li>
<li><p><strong>대규모 컨텍스트 창:</strong> 128K 토큰 컨텍스트 길이로 업그레이드된 DeepSeek v3-0324는 단일 쿼리에 훨씬 더 많은 정보를 저장하고 처리할 수 있어 긴 형식의 대화, 문서 분석, 검색 기반 AI 애플리케이션에 이상적입니다.</p></li>
<li><p><strong>향상된 추론, 코딩 및 수학:</strong> 이번 업데이트에서는 논리, 프로그래밍, 수학 기능이 눈에 띄게 향상되어 AI 지원 코딩, 과학 연구, 엔터프라이즈급 문제 해결을 위한 강력한 경쟁자가 되었습니다.</p></li>
</ul>
<p>하지만 원시 수치가 모든 것을 말해주지는 않습니다. 정말 인상적인 것은 딥시크가 추론 능력과 생성 효율성을 동시에 향상시키는 데 성공했다는 점인데, 이는 일반적으로 공학적 트레이드오프가 수반되는 부분입니다.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">비밀 소스: 아키텍처 혁신</h3><p>딥서치 v3-0324는 잠재 벡터를 사용해 키-값(KV) 캐시를 압축하여 추론 중 메모리 사용량과 계산 오버헤드를 줄이는 효율적인 메커니즘인 <a href="https://arxiv.org/abs/2502.07864">다중 헤드 잠재 주의(MLA) </a>아키텍처를 그대로 유지합니다. 또한, 기존의 <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">피드 포워드 네트워크(FFN)를</a> 전문가 혼합<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>) 계층으로 대체하여 각 토큰에 대해 가장 성능이 좋은 전문가를 동적으로 활성화함으로써 컴퓨팅 효율성을 최적화합니다.</p>
<p>하지만 가장 흥미로운 업그레이드는 각 토큰이 동시에 여러 개의 미래 토큰을 예측할 수 있는 <strong>다중 토큰 예측(MTP)</strong> 입니다. 이는 기존 자동 회귀 모델의 심각한 병목 현상을 극복하여 정확도와 추론 속도를 모두 개선합니다.</p>
<p>이러한 혁신을 통해 단순히 잘 확장되는 것이 아니라 지능적으로 확장되는 모델을 만들어 더 많은 개발팀이 전문가 수준의 AI 기능을 사용할 수 있게 되었습니다.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Milvus와 DeepSeek v3-0324로 5분 안에 RAG 시스템 구축하기<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324의 강력한 추론 기능은 검색 증강 세대(RAG) 시스템을 위한 이상적인 후보입니다. 이 튜토리얼에서는 5분 만에 DeepSeek v3-0324와 <a href="https://zilliz.com/what-is-milvus">Milvus</a> 벡터 데이터베이스를 사용해 완전한 RAG 파이프라인을 구축하는 방법을 보여드립니다. 최소한의 설정으로 지식을 효율적으로 검색하고 종합하는 방법을 배우게 됩니다.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">환경 설정하기</h3><p>먼저 필요한 종속 요소를 설치해 보겠습니다:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>참고:</strong> Google Colab을 사용하는 경우 이러한 패키지를 설치한 후 런타임을 다시 시작해야 합니다. 화면 상단의 '런타임' 메뉴를 클릭하고 드롭다운 메뉴에서 '세션 다시 시작'을 선택합니다.</p>
<p>DeepSeek는 OpenAI 호환 API를 제공하므로 API 키가 필요합니다.<a href="https://platform.deepseek.com/api_keys"> DeepSeek 플랫폼에</a> 가입하면 API 키를 받을 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">데이터 준비하기</h3><p>이 튜토리얼에서는 <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 문서 2.4.x의</a> FAQ 페이지를 지식 소스로 사용하겠습니다:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>이제 마크다운 파일에서 FAQ 콘텐츠를 로드하고 준비해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">언어 설정 및 모델 임베딩하기</h3><p><a href="https://openrouter.ai/">OpenRouter를</a> 사용하여 DeepSeek v3-0324에 액세스하겠습니다. OpenRouter는 DeepSeek 및 Claude와 같은 여러 AI 모델을 위한 통합 API를 제공합니다. OpenRouter에서 무료 DeepSeek V3 API 키를 생성하면 DeepSeek V3 0324를 쉽게 사용해 볼 수 있습니다.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>텍스트 임베딩의 경우 가볍고 효과적인 Milvus의 <a href="https://milvus.io/docs/embeddings.md">내장 임베딩 모델을</a> 사용하겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Milvus 컬렉션 만들기</h3><p>이제 Milvus를 사용하여 벡터 데이터베이스를 설정해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>프로 팁</strong>: 다양한 배포 시나리오에 따라 Milvus 설정을 조정할 수 있습니다:</p>
<ul>
<li><p>로컬 개발의 경우: <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite와</a> 함께 <code translate="no">uri=&quot;./milvus.db&quot;</code> 사용</p></li>
<li><p>대규모 데이터 세트의 경우: <a href="https://milvus.io/docs/quickstart.md">도커/쿠버네티스를</a> 통해 Milvus 서버를 설정하고 다음을 사용합니다. <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>프로덕션용: 클라우드 엔드포인트 및 API 키와 함께<a href="https://zilliz.com/cloud"> Zilliz Cloud를</a> 사용하세요.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Milvus에 데이터 불러오기</h3><p>텍스트 데이터를 임베딩으로 변환하여 Milvus에 저장해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">RAG 파이프라인 구축하기</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">1단계: 관련 정보 검색하기</h4><p>일반적인 질문으로 RAG 시스템을 테스트해 보겠습니다:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
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
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">2단계: DeepSeek로 응답 생성하기</h4><p>이제 DeepSeek를 사용하여 검색된 정보를 기반으로 응답을 생성해 보겠습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>이제 완성되었습니다! DeepSeek v3-0324와 Milvus로 완전한 RAG 파이프라인을 성공적으로 구축했습니다. 이제 이 시스템은 높은 정확도와 컨텍스트 인식으로 Milvus 문서를 기반으로 질문에 답할 수 있습니다.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">DeepSeek-V3-0324 비교: 오리지널 버전과 RAG 개선 버전 비교<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>이론도 중요하지만 실제 성능이 더 중요합니다. 동일한 프롬프트에서 표준 DeepSeek v3-0324('딥 씽킹' 비활성화 상태)와 RAG 강화 버전을 모두 테스트했습니다: <em>HTML 코드를 작성하여 Milvus에 대한 멋진 웹사이트를 만들어 보세요.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">표준 모델의 출력 코드로 구축된 웹사이트</h3><p>웹사이트의 모습은 다음과 같습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>시각적으로 매력적이지만 콘텐츠는 일반적인 설명에 크게 의존하고 있으며 Milvus의 핵심 기술 기능이 많이 누락되어 있습니다.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">RAG 개선 버전으로 생성된 코드로 구축된 웹사이트</h3><p>Milvus를 지식창고로 통합했을 때 그 결과는 극적으로 달라졌습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>후자의 웹사이트는 단순히 보기만 좋아진 것이 아니라 Milvus의 아키텍처, 사용 사례 및 기술적 이점에 대한 진정한 이해를 보여줍니다.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">DeepSeek v3-0324가 전용 추론 모델을 대체할 수 있을까요?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>가장 놀라운 발견은 수학, 논리적, 코드 추론 작업에서 Claude 3.7 Sonnet 및 GPT-4 Turbo와 같은 전문 추론 모델과 DeepSeek v3-0324를 비교했을 때 나타났습니다.</p>
<p>전용 추론 모델은 다단계 문제 해결에 탁월하지만 효율성을 희생하는 경우가 많습니다. 벤치마크 결과, 추론이 많은 모델은 간단한 프롬프트를 과도하게 분석하여 필요 이상의 토큰을 2~3배 더 생성하고 지연 시간과 API 비용을 크게 증가시키는 것으로 나타났습니다.</p>
<p>DeepSeek v3-0324는 다른 접근 방식을 취합니다. 논리적 일관성은 비슷하지만 훨씬 더 간결하며, 40~60% 더 적은 토큰으로 정확한 솔루션을 생성하는 경우가 많습니다. 이러한 효율성이 정확성을 희생하는 것은 아니며, 코드 생성 테스트에서 DeepSeek의 솔루션은 추론에 중점을 둔 경쟁사 솔루션의 기능과 일치하거나 그 이상의 성능을 보였습니다.</p>
<p>성능과 예산 제약의 균형을 맞추는 개발자에게 이러한 효율성 이점은 사용자 경험이 체감 속도에 좌우되는 프로덕션 애플리케이션에서 중요한 요소인 API 비용 절감과 응답 시간 단축으로 직결됩니다.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">AI 모델의 미래: 추론의 경계 허물기<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324의 성능은 AI 업계의 핵심 가정, 즉 추론과 효율성은 피할 수 없는 상충 관계라는 가정에 도전합니다. 이는 추론 모델과 비추론 모델의 구분이 모호해지기 시작하는 변곡점에 가까워지고 있음을 시사합니다.</p>
<p>선도적인 AI 제공업체들은 궁극적으로 이러한 구분을 완전히 없애고 작업 복잡도에 따라 추론 깊이를 동적으로 조정하는 모델을 개발할 수 있습니다. 이러한 적응형 추론은 계산 효율성과 응답 품질을 모두 최적화하여 잠재적으로 AI 애플리케이션 구축 및 배포 방식을 혁신할 수 있습니다.</p>
<p>RAG 시스템을 구축하는 개발자에게 이러한 진화는 계산 오버헤드 없이 프리미엄 모델의 추론 깊이를 제공하는 보다 비용 효율적인 솔루션을 약속하며, 오픈 소스 AI의 가능성을 확장합니다.</p>
