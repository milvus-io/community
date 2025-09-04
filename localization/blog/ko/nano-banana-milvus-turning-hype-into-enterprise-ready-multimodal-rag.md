---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: '나노 바나나 + 밀버스: 과대광고를 엔터프라이즈급 멀티모달 RAG로 전환하기'
author: Lumina Wang
date: 2025-09-04T00:00:00.000Z
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, nano banana'
meta_keywords: 'Vibe coding, nano banana, Milvus, model context protocol'
meta_title: |
  Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: >-
  나노 바나나와 밀버스를 결합하여 엔터프라이즈급 멀티모달 RAG 시스템을 구축하는 방법과 이 조합이 왜 차세대 AI 애플리케이션의 물꼬를
  트는지 살펴봅니다.
origin: >-
  https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---
<p>나노 바나나는 지금 소셜 미디어에서 입소문을 타고 있으며, 그럴 만한 이유가 있습니다! 여러분은 아마도 나노 바나나가 생성하는 이미지를 보셨거나 직접 사용해 보셨을 것입니다. 나노 바나나는 일반 텍스트를 놀라운 정확도와 속도로 소장 가치가 있는 피규어 사진으로 바꿔주는 최신 이미지 생성 모델입니다.</p>
<p><em>"엘론의 모자와 치마를 바꿔줘"</em> 와 같은 문장을 입력하면 약 16초 만에 셔츠를 집어넣고, 색상을 혼합하고, 액세서리를 제자리에 배치하는 등 수동 편집 없이도 실제와 같은 결과물을 얻을 수 있습니다. 지연도 없습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beach_side_668179b830.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>저도 테스트해보고 싶었습니다. 제가 받은 메시지는 다음과 같았습니다:</p>
<p><em>"나노 바나나 모델을 사용하여 일러스트 속 캐릭터의 1/7 스케일 상품화 피규어를 사실적인 스타일과 환경으로 만들어 보세요. 텍스트가 없는 원형 투명 아크릴 받침대를 사용하여 피규어를 컴퓨터 책상 위에 놓습니다. 컴퓨터 화면에 피규어의 ZBrush 모델링 과정을 표시합니다. 화면 옆에 원본 아트워크가 인쇄된 반다이 스타일의 장난감 포장 상자를 놓습니다."</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그 결과물은 마치 컨벤션 부스에서 바로 나온 프로덕션 프로토타입처럼 보였습니다.</p>
<p>이미 많은 팀에서 이 기술을 진지하게 활용하고 있는 것은 놀라운 일이 아닙니다. 가챠와 드레스업 게임 플레이를 제공하는 모바일 엔터테인먼트 플랫폼의 한 고객사는 플레이어가 사진을 업로드하고 게임 내 액세서리로 아바타를 즉시 꾸밀 수 있는 기능을 개발하고 있습니다. 이커머스 브랜드는 스튜디오에서 20번씩 재촬영하는 대신 기본 모델 이미지를 캡처한 후 AI로 무한한 의상과 헤어스타일 변형을 생성하는 '한번 촬영, 영원히 재사용'을 실험하고 있습니다.</p>
<p>하지만 캐치 이미지 생성만으로는 모든 문제를 해결할 수 없습니다. 이러한 시스템에는 <strong>스마트 검색</strong> 기능, 즉 방대한 비정형 미디어 라이브러리에서 적합한 의상, 소품 및 시각적 요소를 즉시 찾을 수 있는 기능도 필요합니다. 이러한 기능이 없으면 제너레이티브 모델은 어둠 속에서 추측하는 것과 같습니다. 기업에게 진정으로 필요한 것은 <strong>멀티모달 RAG(검색 증강 생성) 시스템으로</strong>, 나노 바나나가 창의성을 처리하고 강력한 벡터 데이터베이스가 컨텍스트를 처리하는 방식입니다.</p>
<p>바로 여기에 <strong>Milvus가</strong> 등장합니다. 오픈 소스 벡터 데이터베이스인 Milvus는 이미지, 텍스트, 오디오 등 수십억 개의 임베딩을 색인하고 검색할 수 있습니다. Nano Banana와 함께 사용하면 엔터프라이즈 규모에서 검색, 매칭, 생성하는 프로덕션 준비된 멀티모달 RAG 파이프라인의 중추가 됩니다.</p>
<p>이 블로그의 나머지 부분에서는 나노 바나나와 Milvus를 결합하여 엔터프라이즈급 멀티모달 RAG 시스템을 구축하는 방법과 이러한 결합을 통해 차세대 AI 애플리케이션의 물결을 여는 이유를 살펴볼 것입니다.</p>
<h2 id="Building-a-Text-to-Image-Retrieval-Engine" class="common-anchor-header">텍스트-이미지 검색 엔진 구축하기<button data-href="#Building-a-Text-to-Image-Retrieval-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>빠르게 변화하는 소비재 브랜드, 게임 스튜디오, 미디어 회사의 경우 AI 이미지 생성의 병목 현상은 모델이 아니라 아카이브가 엉망이라는 점입니다.</p>
<p>이들의 아카이브는 제품 사진, 캐릭터 에셋, 홍보 동영상, 의상 렌더링 등 비정형 데이터의 늪입니다. '지난 시즌 루나드롭의 빨간 망토'를 찾아야 하는 경우, 기존의 키워드 기반 검색으로는 이를 처리할 수 없습니다.</p>
<p>해결책은? <strong>텍스트-이미지 검색 시스템을</strong> 구축하세요.</p>
<p><a href="https://openai.com/research/clip?utm_source=chatgpt.com">CLIP을</a> 사용하여 텍스트와 이미지 데이터를 모두 벡터로 임베드하세요. 이러한 벡터를 유사도 검색을 위해 특별히 제작된 오픈소스 벡터 데이터베이스인 <strong>Milvus에</strong> 저장하세요. 그런 다음 사용자가 설명("금색 트리밍이 있는 빨간 실크 케이프")을 입력하면 DB를 조회하여 의미적으로 가장 유사한 이미지 상위 3개가 반환됩니다.</p>
<p>빠릅니다. 확장성이 뛰어납니다. 그리고 지저분한 미디어 라이브러리를 구조화되고 쿼리가 가능한 자산 뱅크로 바꿔줍니다.</p>
<p>구축 방법은 다음과 같습니다:</p>
<p>종속성 설치</p>
<pre><code translate="no"><span class="hljs-comment"># Install necessary packages</span>
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
<button class="copy-code-btn"></button></code></pre>
<p>필요한 라이브러리 가져오기</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> clip
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">import</span> matplotlib.pyplot <span class="hljs-keyword">as</span> plt
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
<span class="hljs-keyword">import</span> math

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All libraries imported successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 클라이언트 초기화</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,token=<span class="hljs-string">&quot;root:Miluvs&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus client initialized successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>클립 모델 로드</p>
<pre><code translate="no"><span class="hljs-comment"># Load CLIP model</span>
model_name = <span class="hljs-string">&quot;ViT-B/32&quot;</span>
device = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
model, preprocess = clip.load(model_name, device=device)
model.<span class="hljs-built_in">eval</span>()

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;CLIP model &#x27;<span class="hljs-subst">{model_name}</span>&#x27; loaded successfully, running on device: <span class="hljs-subst">{device}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model input resolution: <span class="hljs-subst">{model.visual.input_resolution}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Context length: <span class="hljs-subst">{model.context_length}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Vocabulary size: <span class="hljs-subst">{model.vocab_size}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>결과 출력</p>
<pre><code translate="no"><span class="hljs-variable constant_">CLIP</span> model <span class="hljs-string">`ViT-B/32`</span> loaded successfully, running <span class="hljs-attr">on</span>: cpu
 <span class="hljs-title class_">Model</span> input <span class="hljs-attr">resolution</span>: <span class="hljs-number">224</span>
 <span class="hljs-title class_">Context</span> <span class="hljs-attr">length</span>: <span class="hljs-number">77</span>
 <span class="hljs-title class_">Vocabulary</span> <span class="hljs-attr">size</span>: <span class="hljs-number">49</span>,<span class="hljs-number">408</span>
<button class="copy-code-btn"></button></code></pre>
<p>특징 추출 함수 정의</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_image</span>(<span class="hljs-params">image_path</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode image into normalized feature vector&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        image = preprocess(Image.<span class="hljs-built_in">open</span>(image_path)).unsqueeze(<span class="hljs-number">0</span>).to(device)
        
        <span class="hljs-keyword">with</span> torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
        
        <span class="hljs-keyword">return</span> image_features.squeeze().cpu().tolist()
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Error processing image <span class="hljs-subst">{image_path}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_text</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text into normalized feature vector&quot;&quot;&quot;</span>
    text_tokens = clip.tokenize([text]).to(device)
    
    <span class="hljs-keyword">with</span> torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
    
    <span class="hljs-keyword">return</span> text_features.squeeze().cpu().tolist()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Feature extraction functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 컬렉션 생성</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;production_image_collection&quot;</span>
<span class="hljs-comment"># If collection already exists, delete it</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Existing collection deleted: <span class="hljs-subst">{collection_name}</span>&quot;</span>)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=<span class="hljs-number">512</span>,  <span class="hljs-comment"># CLIP ViT-B/32 embedding dimension</span>
    auto_id=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Auto-generate ID</span>
    enable_dynamic_field=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Enable dynamic fields</span>
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>  <span class="hljs-comment"># Use cosine similarity</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; created successfully!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection info: <span class="hljs-subst">{milvus_client.describe_collection(collection_name)}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션 생성 성공 출력:</p>
<pre><code translate="no">Existing collection deleted: production_image_collection
Collection <span class="hljs-string">&#x27;production_image_collection&#x27;</span> created successfully!
Collection info: {<span class="hljs-string">&#x27;collection_name&#x27;</span>: <span class="hljs-string">&#x27;production_image_collection&#x27;</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;num_shards&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {}, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">101</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;vector&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">512</span>}}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">102</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;function&#x27;</span>: [], <span class="hljs-string">&#x27;aliases&#x27;</span>: [], <span class="hljs-string">&#x27;collection_id&#x27;</span>: <span class="hljs-number">460508990706033544</span>, <span class="hljs-string">&#x27;consistency_level&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;properties&#x27;</span>: {}, <span class="hljs-string">&#x27;num_partitions&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;created_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>, <span class="hljs-string">&#x27;updated_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>}
<button class="copy-code-btn"></button></code></pre>
<p>이미지 처리 및 삽입</p>
<pre><code translate="no"><span class="hljs-comment"># Set image directory path</span>
image_dir = <span class="hljs-string">&quot;./production_image&quot;</span>
raw_data = []

<span class="hljs-comment"># Get all supported image formats</span>
image_extensions = [<span class="hljs-string">&#x27;*.jpg&#x27;</span>, <span class="hljs-string">&#x27;*.jpeg&#x27;</span>, <span class="hljs-string">&#x27;*.png&#x27;</span>, <span class="hljs-string">&#x27;*.JPEG&#x27;</span>, <span class="hljs-string">&#x27;*.JPG&#x27;</span>, <span class="hljs-string">&#x27;*.PNG&#x27;</span>]
image_paths = []

<span class="hljs-keyword">for</span> ext <span class="hljs-keyword">in</span> image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> images in <span class="hljs-subst">{image_dir}</span>&quot;</span>)

<span class="hljs-comment"># Process images and generate embeddings</span>
successful_count = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> i, image_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(image_paths):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Processing progress: <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> - <span class="hljs-subst">{os.path.basename(image_path)}</span>&quot;</span>)
    
    image_embedding = encode_image(image_path)
    <span class="hljs-keyword">if</span> image_embedding <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image_dict = {
            <span class="hljs-string">&quot;vector&quot;</span>: image_embedding,
            <span class="hljs-string">&quot;filepath&quot;</span>: image_path,
            <span class="hljs-string">&quot;filename&quot;</span>: os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += <span class="hljs-number">1</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully processed <span class="hljs-subst">{successful_count}</span> images&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>이미지 처리 진행률 출력:</p>
<pre><code translate="no">Found 50 images <span class="hljs-keyword">in</span> ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
<button class="copy-code-btn"></button></code></pre>
<p>Milvus에 데이터 삽입</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data into Milvus</span>
<span class="hljs-keyword">if</span> raw_data:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Inserting data into Milvus...&quot;</span>)
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> images into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample inserted IDs: <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;ids&#x27;</span>][:<span class="hljs-number">5</span>]}</span>...&quot;</span>)  <span class="hljs-comment"># Show first 5 IDs</span>
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No successfully processed image data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>검색 및 시각화 기능 정의</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_images_by_text</span>(<span class="hljs-params">query_text, top_k=<span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Search images based on text query&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Search query: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    
    <span class="hljs-comment"># Encode query text</span>
    query_embedding = encode_text(query_text)
    
    <span class="hljs-comment"># Search in Milvus</span>
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;filepath&quot;</span>, <span class="hljs-string">&quot;filename&quot;</span>]
    )
    
    <span class="hljs-keyword">return</span> search_results[<span class="hljs-number">0</span>]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">visualize_search_results</span>(<span class="hljs-params">query_text, results</span>):
    <span class="hljs-string">&quot;&quot;&quot;Visualize search results&quot;&quot;&quot;</span>
    num_images = <span class="hljs-built_in">len</span>(results)
    
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No matching images found&quot;</span>)
        <span class="hljs-keyword">return</span>
    
    <span class="hljs-comment"># Create subplots</span>
    fig, axes = plt.subplots(<span class="hljs-number">1</span>, num_images, figsize=(<span class="hljs-number">5</span>*num_images, <span class="hljs-number">5</span>))
    fig.suptitle(<span class="hljs-string">f&#x27;Search Results: &quot;<span class="hljs-subst">{query_text}</span>&quot; (Top <span class="hljs-subst">{num_images}</span>)&#x27;</span>, fontsize=<span class="hljs-number">16</span>, fontweight=<span class="hljs-string">&#x27;bold&#x27;</span>)
    
    <span class="hljs-comment"># Handle single image case</span>
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">1</span>:
        axes = [axes]
    
    <span class="hljs-comment"># Display images</span>
    <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
        <span class="hljs-keyword">try</span>:
            img_path = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filepath&#x27;</span>]
            filename = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filename&#x27;</span>]
            score = result[<span class="hljs-string">&#x27;distance&#x27;</span>]
            
            <span class="hljs-comment"># Load and display image</span>
            img = Image.<span class="hljs-built_in">open</span>(img_path)
            axes[i].imshow(img)
            axes[i].set_title(<span class="hljs-string">f&quot;<span class="hljs-subst">{filename}</span>\nSimilarity: <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>&quot;</span>, fontsize=<span class="hljs-number">10</span>)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
            
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. File: <span class="hljs-subst">{filename}</span>, Similarity score: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
            
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            axes[i].text(<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>, <span class="hljs-string">f&#x27;Error loading image\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&#x27;</span>,
                        ha=<span class="hljs-string">&#x27;center&#x27;</span>, va=<span class="hljs-string">&#x27;center&#x27;</span>, transform=axes[i].transAxes)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
    
    plt.tight_layout()
    plt.show()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search and visualization functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>텍스트-이미지 검색 실행</p>
<pre><code translate="no"><span class="hljs-comment"># Example search 1</span>
query1 = <span class="hljs-string">&quot;a golden watch&quot;</span>
results1 = search_images_by_text(query1, top_k=<span class="hljs-number">3</span>)
visualize_search_results(query1, results1)
<button class="copy-code-btn"></button></code></pre>
<p>검색 쿼리 실행 출력</p>
<pre><code translate="no"><span class="hljs-title class_">Search</span> <span class="hljs-attr">query</span>: <span class="hljs-string">&#x27;a golden watch&#x27;</span>
<span class="hljs-number">1.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">19</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2934</span>
<span class="hljs-number">2.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">download</span> (<span class="hljs-number">26</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.3073</span>
<span class="hljs-number">3.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">17</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2717</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/watch_067c39ba51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Using-Nano-banana-to-Create-Brand-Promotional-Images" class="common-anchor-header">나노 바나나를 사용하여 브랜드 홍보 이미지 만들기<button data-href="#Using-Nano-banana-to-Create-Brand-Promotional-Images" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Milvus와 텍스트-이미지 검색 시스템을 연동했으니, 나노 바나나를 통합하여 검색된 자산을 기반으로 새로운 홍보 콘텐츠를 생성해 보겠습니다.</p>
<p>Google SDK 설치</p>
<pre><code translate="no">%pip install google-generativeai
%pip install requests
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Google Generative AI SDK installation complete!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Gemini API 구성</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.<span class="hljs-property">generativeai</span> <span class="hljs-keyword">as</span> genai
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> io <span class="hljs-keyword">import</span> <span class="hljs-title class_">BytesIO</span>
genai.<span class="hljs-title function_">configure</span>(api_key=<span class="hljs-string">&quot;&lt;your_api_key&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>새 이미지 생성</p>
<pre><code translate="no">prompt = (
    <span class="hljs-string">&quot;An European male model wearing a suit, carrying a gold watch.&quot;</span>
)

image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;/path/to/image/watch.jpg&quot;</span>)

model = genai.GenerativeModel(<span class="hljs-string">&#x27;gemini-2.5-flash-image-preview&#x27;</span>)
response = model.generate_content([prompt, image])

<span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> response.candidates[<span class="hljs-number">0</span>].content.parts:
    <span class="hljs-keyword">if</span> part.text <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">print</span>(part.text)
    <span class="hljs-keyword">elif</span> part.inline_data <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image = Image.<span class="hljs-built_in">open</span>(BytesIO(part.inline_data.data))
        image.save(<span class="hljs-string">&quot;generated_image.png&quot;</span>)
        image.show()
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/suit_976b6f1df2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-This-Means-for-Your-Development-Workflow" class="common-anchor-header">이것이 개발 워크플로에 미치는 영향<button data-href="#What-This-Means-for-Your-Development-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>개발자로서 Milvus + Nano-banana 통합은 콘텐츠 생성 프로젝트에 접근하는 방식을 근본적으로 변화시킵니다. 이제 정적인 에셋 라이브러리를 관리하거나 값비싼 크리에이티브 팀에 의존하는 대신 애플리케이션에 필요한 것을 실시간으로 정확하게 검색하고 생성하는 동적 시스템을 갖추게 되었습니다.</p>
<p>최근 한 브랜드가 여러 신제품을 출시했지만 기존의 사진 촬영 파이프라인을 완전히 생략하기로 결정한 고객 시나리오를 예로 들어보겠습니다. 이 브랜드는 당사의 통합 시스템을 사용하여 기존 제품 데이터베이스와 나노 바나나의 생성 기능을 결합하여 홍보 이미지를 즉시 생성할 수 있었습니다.</p>
<p><em>프롬프트: 모델이 해변에서 이 제품을 착용하고 있습니다.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_5a2a042b46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>기존에는 사진작가, 모델, 세트 디자이너 간의 광범위한 조율이 필요했던 복잡하고 다양한 콘텐츠를 제작해야 할 때 진정한 위력이 발휘됩니다. Milvus가 에셋 검색을 처리하고 나노 바나나가 생성을 관리하면 특정 요구 사항에 맞는 정교한 장면을 프로그래밍 방식으로 제작할 수 있습니다:</p>
<p><em>프롬프트: 한 모델이 파란색 컨버터블 스포츠카에 기대어 포즈를 취하고 있습니다. 그녀는 홀터 탑 드레스와 함께 제공되는 액세서리를 착용하고 있습니다. 다이아몬드 목걸이와 파란색 시계로 장식하고 발에는 하이힐을 신고 있으며 손에는 라부부 펜던트를 들고 있습니다.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shoes_98e1e4c70b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>게임이나 수집품 개발자에게 이 시스템은 신속한 프로토타이핑과 콘셉트 검증을 위한 완전히 새로운 가능성을 열어줍니다. 이제 컨셉이 제대로 작동하는지 확인하기까지 몇 주씩 3D 모델링에 투자할 필요 없이 포장, 환경적 맥락, 제조 공정까지 포함한 사실적인 제품 시각화를 생성할 수 있습니다:</p>
<p><em>프롬프트: 나노 바나나 모델을 사용하여 일러스트 속 캐릭터의 1/7 스케일 상품화 피규어를 사실적인 스타일과 환경으로 만들어 보세요. 텍스트가 없는 원형 투명 아크릴 베이스를 사용하여 피규어를 컴퓨터 책상 위에 놓습니다. 컴퓨터 화면에 피규어의 ZBrush 모델링 과정을 표시합니다. 컴퓨터 화면 옆에 원본 아트워크가 인쇄된 반다이 스타일의 장난감 포장 상자를 놓습니다.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_3d_5189d53773.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>기술적인 관점에서 볼 때 나노 바나나는 단순히 신기한 것이 아니라 개발자에게 중요한 방식으로 생산 준비가 완료된 제품입니다. 가장 큰 강점은 일관성과 제어 가능성으로, 애플리케이션 로직에 영향을 미치는 에지 케이스가 적다는 것입니다. 또한 브랜드 색상을 일관되게 유지하고, 물리적으로 그럴듯한 조명과 리플렉션을 생성하며, 여러 출력 형식에서 시각적 일관성을 보장하는 등 자동화된 파이프라인에서 종종 탈선하는 미묘한 세부 사항을 처리할 수 있다는 점도 중요한 장점입니다.</p>
<p>진정한 마법은 Milvus 벡터 데이터베이스와 결합할 때 발생합니다. 벡터 데이터베이스는 단순히 임베딩을 저장하는 것이 아니라 가장 관련성이 높은 과거 콘텐츠를 표시하여 새로운 세대를 안내할 수 있는 지능형 자산 관리자가 됩니다. 그 결과, 더 빠른 생성 시간(모델에 더 나은 컨텍스트가 있으므로), 애플리케이션 전반의 일관성 향상, 브랜드 또는 스타일 가이드라인을 자동으로 적용할 수 있는 기능이 제공됩니다.</p>
<p>요컨대, Milvus는 나노 바나나를 창의적인 장난감에서 확장 가능한 엔터프라이즈 시스템으로 탈바꿈시켰습니다.</p>
<p>물론 완벽한 시스템은 없습니다. 복잡한 다단계 지침은 여전히 딸꾹질을 유발할 수 있으며, 조명 물리학은 때때로 현실을 원하는 것보다 더 많이 확장합니다. 가장 신뢰할 수 있는 솔루션은 Milvus에 저장된 참조 이미지로 텍스트 프롬프트를 보완하여 모델에 더 풍부한 근거와 예측 가능한 결과, 더 짧은 반복 주기를 제공하는 것입니다. 이 설정을 사용하면 멀티모달 RAG를 실험하는 데 그치지 않고 프로덕션 환경에서 자신 있게 실행할 수 있습니다.</p>
