---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: GPT-4o 및 Milvus로 더욱 창의적이고 엄선된 지브리 스타일의 이미지 생성하기
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: 밀버스를 사용하여 개인 데이터를 GPT-4o와 연결하여 더욱 엄선된 이미지 결과물 얻기
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">GPT-4o로 하룻밤 사이에 누구나 아티스트가 된 사람들<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>믿거나 말거나, 방금 보신 사진은 바로 새로 출시된 GPT-4o에 의해 AI가 생성한 것입니다!</em></p>
<p>지난 3월 26일 OpenAI가 GPT-4o의 기본 이미지 생성 기능을 출시했을 때, 그 누구도 그 후의 창작 쓰나미를 예측할 수 없었습니다. 하룻밤 사이에 인터넷은 AI가 생성한 지브리 스타일의 초상화로 폭발적으로 증가했습니다. 연예인, 정치인, 애완동물, 심지어 사용자 자신도 몇 가지 간단한 명령어만으로 매력적인 스튜디오 지브리 캐릭터로 변신했습니다. 수요가 너무 압도적이어서 샘 알트먼이 직접 사용자들에게 속도를 늦춰달라고 "간청"해야 했고, OpenAI의 "GPU가 녹아내리고 있다"는 트윗을 올리기도 했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-4o로 생성된 이미지 예시(제공: X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">GPT-4o가 모든 것을 바꾸는 이유<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>크리에이티브 산업에 있어 이는 패러다임의 전환을 의미합니다. 과거에는 디자인 팀 전체가 하루 종일 작업해야 했던 작업을 이제 단 몇 분 만에 완료할 수 있습니다. GPT-4o가 기존 이미지 제너레이터와 다른 점은 <strong>뛰어난 시각적 일관성과 직관적인 인터페이스입니다</strong>. 요소를 추가하고 비율을 조정하고 스타일을 변경하거나 2D를 3D로 변환하는 등 이미지를 다듬을 수 있는 멀티턴 대화를 지원하므로 전문 디자이너의 손길을 거치지 않고도 이미지를 완성할 수 있습니다.</p>
<p>GPT-4o의 뛰어난 성능의 비결은 무엇일까요? 바로 자동 회귀 아키텍처입니다. 이미지를 재구성하기 전에 이미지를 노이즈로 저하시키는 확산 모델(예: 안정적 확산)과 달리 GPT-4o는 한 번에 하나의 토큰씩 순차적으로 이미지를 생성하여 프로세스 전반에 걸쳐 컨텍스트 인식을 유지합니다. 이러한 근본적인 구조적 차이로 인해 GPT-4o가 보다 간단하고 자연스러운 프롬프트를 통해 보다 일관된 결과를 생성하는 이유를 설명할 수 있습니다.</p>
<p>하지만 여기서부터 개발자에게 흥미로운 점이 있습니다: <strong>인공지능 모델 자체가 하나의 제품이 되어가고 있다는 주요 트렌드를 가리키는 징후가 점점 더 많아지고 있습니다. 간단히 말해, 단순히 퍼블릭 도메인 데이터로 대규모 AI 모델을 감싸는 대부분의 제품은 도태될 위험에 처해 있습니다.</strong></p>
<p>이러한 발전의 진정한 힘은 범용 대규모 모델과 <strong>비공개 도메인별 데이터를</strong> 결합하는 데서 비롯됩니다. 이러한 조합은 대규모 언어 모델 시대에 대부분의 기업에게 최적의 생존 전략이 될 수 있습니다. 기본 모델이 계속 진화함에 따라 지속적인 경쟁 우위는 자사의 독점 데이터 세트를 이러한 강력한 AI 시스템과 효과적으로 통합할 수 있는 기업이 차지하게 될 것입니다.</p>
<p>오픈 소스 고성능 벡터 데이터베이스인 Milvus를 사용하여 개인 데이터를 GPT-4o와 연결하는 방법을 살펴보세요.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Milvus를 사용하여 개인 데이터를 GPT-4o와 연결하여 더욱 선별된 이미지 결과물 얻기<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 개인 데이터와 AI 모델을 연결하는 핵심 기술입니다. 이미지, 텍스트, 오디오 등 콘텐츠를 수학적 표현(벡터)으로 변환하여 그 의미와 특성을 포착하는 방식으로 작동합니다. 이를 통해 키워드가 아닌 유사성에 기반한 시맨틱 검색이 가능합니다.</p>
<p>선도적인 오픈 소스 벡터 데이터베이스인 Milvus는 특히 GPT-4o와 같은 제너레이티브 AI 도구와 연결하기에 적합합니다. 개인적인 문제를 해결하기 위해 Milvus를 사용한 방법을 소개합니다.</p>
<h3 id="Background" class="common-anchor-header">배경</h3><p>어느 날 저는 제 반려견 콜라의 모든 장난을 만화로 만들어보자는 기발한 아이디어를 떠올렸습니다. 하지만 문제가 있었습니다: 수만 장에 달하는 업무, 여행, 음식 사진에서 콜라의 장난스러운 순간을 어떻게 찾아낼 수 있을까요?</p>
<p>해답은? 모든 사진을 Milvus로 가져와서 이미지 검색을 하면 됩니다.</p>
<p>구현 과정을 단계별로 살펴보겠습니다.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">종속성 및 환경</h4><p>먼저 올바른 패키지로 환경을 준비해야 합니다:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">데이터 준비</h4><p>이 가이드에서는 약 30,000장의 사진이 있는 제 사진 라이브러리를 데이터 집합으로 사용하겠습니다. 데이터 세트가 준비되어 있지 않다면 Milvus에서 샘플 데이터 세트를 다운로드하여 압축을 풉니다:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">특징 추출기 정의하기</h4><p>이미지에서 임베딩 벡터를 추출하기 위해 <code translate="no">timm</code> 라이브러리의 ResNet-50 모드를 사용하겠습니다. 이 모델은 수백만 개의 이미지에 대해 학습되었으며 시각적 콘텐츠를 나타내는 의미 있는 특징을 추출할 수 있습니다.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Milvus 컬렉션 만들기</h4><p>다음으로 이미지 임베딩을 저장할 Milvus 컬렉션을 만들겠습니다. 이 컬렉션은 벡터 유사성 검색을 위해 명시적으로 설계된 특수 데이터베이스라고 생각하면 됩니다:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>MilvusClient 매개변수에 대한 참고 사항:</strong></p>
<ul>
<li><p><strong>로컬 설정:</strong> 로컬 파일(예: <code translate="no">./milvus.db</code>)을 사용하는 것이 가장 쉽게 시작할 수 있는 방법이며, Milvus Lite가 모든 데이터를 처리합니다.</p></li>
<li><p><strong>스케일업:</strong> 대규모 데이터 세트의 경우, Docker 또는 Kubernetes를 사용하여 강력한 Milvus 서버를 설정하고 해당 URI(예: <code translate="no">http://localhost:19530</code>)를 사용합니다.</p></li>
<li><p><strong>클라우드 옵션:</strong> 질리즈 클라우드(Milvus의 완전 관리형 서비스)를 사용하는 경우, 공개 엔드포인트 및 API 키와 일치하도록 URI와 토큰을 조정하세요.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Milvus에 이미지 삽입하기</h4><p>이제 각 이미지를 분석하고 벡터 표현을 저장하는 프로세스가 시작됩니다. 이 단계는 데이터 세트 크기에 따라 다소 시간이 걸릴 수 있지만, 한 번만 수행하면 됩니다:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">이미지 검색 수행</h4><p>데이터베이스가 채워지면 이제 유사한 이미지를 검색할 수 있습니다. 여기서 마법이 일어나는데, 벡터 유사도를 사용하여 시각적으로 유사한 사진을 찾을 수 있습니다:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>반환된 이미지는 아래와 같습니다:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">벡터 검색과 GPT-4o를 결합합니다: Milvus가 반환한 이미지로 지브리 스타일 이미지 생성하기</h3><p>이제 흥미로운 부분은 이미지 검색 결과를 GPT-4o의 입력으로 사용하여 창의적인 콘텐츠를 생성하는 것입니다. 제 경우에는 제가 찍은 사진을 바탕으로 반려견 콜라가 등장하는 만화를 만들고 싶었습니다.</p>
<p>워크플로는 간단하지만 강력합니다:</p>
<ol>
<li><p>벡터 검색을 사용하여 내 컬렉션에서 콜라와 관련된 이미지를 찾습니다.</p></li>
<li><p>이 이미지를 창의적인 프롬프트와 함께 GPT-4o에 공급합니다.</p></li>
<li><p>시각적 영감을 바탕으로 독특한 만화를 생성합니다.</p></li>
</ol>
<p>다음은 이 조합으로 만들 수 있는 몇 가지 예시입니다:</p>
<p><strong>제가 사용하는 프롬프트</strong></p>
<ul>
<li><p><em>"쥐를 갉아 먹는 보더 콜리가 잡힌 후 주인이 이를 알게 되는 어색한 순간을 담은 4컷의 풀컬러 만화 스트립을 생성하세요."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"이 개가 귀여운 옷을 입고 있는 만화를 그려보세요."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"이 개를 모델로 삼아 호그와트 마법과 마법 학교에 다니는 모습을 만화로 그려 보세요."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">이미지 생성 경험에서 얻은 몇 가지 간단한 팁</h3><ol>
<li><p><strong>단순하게 유지하세요</strong>: 까다로운 확산 모델과 달리 GPT-4o는 간단한 프롬프트에서 가장 잘 작동합니다. 저는 점점 더 짧게 프롬프트를 작성하면서 더 나은 결과를 얻을 수 있었습니다.</p></li>
<li><p><strong>영어가 가장 효과적입니다</strong>: 일부 만화에는 중국어로 프롬프트를 작성해 보았지만 결과가 좋지 않았습니다. 결국 영어로 프롬프트를 작성한 다음 필요할 때 완성된 만화를 번역하게 되었습니다.</p></li>
<li><p><strong>동영상 생성에는 좋지 않습니다</strong>: 아직 소라에 너무 큰 기대를 걸지 마세요. 유연한 움직임과 일관된 스토리 라인에 있어서는 아직 갈 길이 멀기 때문입니다.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">다음 단계는 무엇인가요? 나의 관점과 열린 토론<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>AI가 생성한 이미지가 선두를 달리고 있는 가운데, 지난 6개월간 OpenAI의 주요 릴리스를 살펴보면 앱 마켓플레이스용 GPT, 보고서 생성용 DeepResearch, 대화형 이미지 생성용 GPT-4o, 비디오 매직용 Sora 등 대형 AI 모델이 장막 뒤에서 스포트라이트를 받고 있다는 명확한 패턴을 확인할 수 있습니다. 한때 실험적인 기술에 불과했던 것이 이제는 실제 사용 가능한 제품으로 발전하고 있습니다.</p>
<p>GPT-4o와 유사한 모델이 널리 보급됨에 따라 대부분의 워크플로우와 스테이블 디퓨전 기반의 지능형 에이전트는 구식이 되어가고 있습니다. 하지만 개인 데이터와 인간 인사이트의 대체 불가능한 가치는 여전히 강력합니다. 예를 들어, AI가 크리에이티브 에이전시를 완전히 대체할 수는 없겠지만, Milvus 벡터 데이터베이스와 GPT 모델을 통합하면 에이전시가 과거의 성공에서 영감을 얻은 신선하고 창의적인 아이디어를 빠르게 생성할 수 있습니다. 이커머스 플랫폼은 쇼핑 트렌드에 따라 개인 맞춤형 의류를 디자인할 수 있고, 학술 기관은 연구 논문을 위한 시각 자료를 즉시 제작할 수 있습니다.</p>
<p>AI 모델로 구동되는 제품의 시대가 열렸으며, 데이터 금광을 찾기 위한 경쟁은 이제 막 시작되었습니다. 개발자와 기업 모두에게 메시지는 분명합니다. 고유한 데이터를 이러한 강력한 모델과 결합하지 않으면 뒤처질 위험이 있다는 것입니다.</p>
