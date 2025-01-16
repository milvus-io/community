---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: Milvus 2.0 부트캠프로 벡터 검색 솔루션을 빠르게 테스트하고 배포하세요.
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: '오픈 소스 벡터 데이터베이스인 Milvus로 벡터 유사도 검색 솔루션을 구축, 테스트 및 사용자 지정하세요.'
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Milvus 2.0 부트캠프로 벡터 검색 솔루션을 빠르게 테스트 및 배포하기</custom-h1><p>Milvus 2.0의 출시와 함께 Milvus <a href="https://github.com/milvus-io/bootcamp">부트캠프가</a> 개편되었습니다. 새롭고 개선된 부트캠프는 다양한 사용 사례와 배포를 위한 업데이트된 가이드와 따라 하기 쉬운 코드 예제를 제공합니다. 또한 이 새 버전은 세계에서 가장 진보된 벡터 데이터베이스를 새롭게 재해석한 <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0용으로</a> 업데이트되었습니다.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">100만 및 1억 데이터 세트 벤치마크로 시스템 스트레스 테스트하기</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">벤치마크 디렉터리에는</a> 다양한 크기의 데이터 세트에 대해 시스템이 어떻게 반응하는지 보여주는 100만 및 1억 개의 벡터 벤치마크 테스트가 포함되어 있습니다.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">인기 있는 벡터 유사도 검색 솔루션 탐색 및 구축</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">솔루션 디렉터리에는</a> 가장 인기 있는 벡터 유사도 검색 사용 사례가 포함되어 있습니다. 각 사용 사례에는 노트북 솔루션과 도커 배포 가능한 솔루션이 포함되어 있습니다. 사용 사례는 다음과 같습니다:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">이미지 유사도 검색</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">동영상 유사도 검색</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">오디오 유사도 검색</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">추천 시스템</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">분자 검색</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">질문 답변 시스템</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">모든 시스템에 완벽하게 빌드된 애플리케이션을 빠르게 배포하세요</h3><p>빠른 배포 솔루션은 도커화된 솔루션으로, 사용자가 모든 시스템에 완벽하게 구축된 애플리케이션을 배포할 수 있도록 해줍니다. 이러한 솔루션은 간단한 데모에 이상적이지만 노트북에 비해 사용자 지정 및 이해에 추가적인 작업이 필요합니다.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">시나리오별 노트북을 사용해 사전 구성된 애플리케이션을 쉽게 배포하세요.</h3><p>노트북에는 주어진 사용 사례의 문제를 해결하기 위해 Milvus를 배포하는 간단한 예제가 포함되어 있습니다. 각 예제는 파일이나 구성을 관리할 필요 없이 처음부터 끝까지 실행할 수 있습니다. 또한 각 노트북은 따라 하기 쉽고 수정이 가능하기 때문에 다른 프로젝트의 기본 파일로 사용하기에도 이상적입니다.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">이미지 유사도 검색 노트북 예시</h3><p>이미지 유사도 검색은 물체를 인식하는 자율 주행 자동차를 비롯한 다양한 기술의 핵심 아이디어 중 하나입니다. 이 예제에서는 Milvus로 컴퓨터 비전 프로그램을 쉽게 구축하는 방법을 설명합니다.</p>
<p>이 노트북은 세 가지를 중심으로 전개됩니다:</p>
<ul>
<li>Milvus 서버</li>
<li>Redis 서버(메타데이터 저장용)</li>
<li>사전 학습된 Resnet-18 모델.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">1단계: 필요한 패키지 다운로드</h4><p>이 프로젝트에 필요한 모든 패키지를 다운로드하는 것으로 시작하세요. 이 노트북에는 사용할 패키지가 나열된 표가 포함되어 있습니다.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">2단계: 서버 시작</h4><p>패키지를 설치한 후 서버를 시작하고 두 서버가 모두 제대로 실행되는지 확인합니다. <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> 및 <a href="https://hub.docker.com/_/redis">Redis</a> 서버를 시작하려면 올바른 지침을 따르세요.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">3단계: 프로젝트 데이터 다운로드</h4><p>기본적으로 이 노트북은 예제로 사용하기 위해 VOCImage 데이터의 스니펫을 가져오지만, 노트북 상단에 표시되는 파일 구조를 따르는 한 이미지가 있는 모든 디렉터리가 작동합니다.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">4단계: 서버에 연결</h4><p>이 예에서는 서버가 로컬 호스트의 기본 포트에서 실행되고 있습니다.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">5단계: 컬렉션 만들기</h4><p>서버를 시작한 후 모든 벡터를 저장하기 위해 Milvus에서 컬렉션을 만듭니다. 이 예제에서는 차원 크기를 resnet-18 출력 크기인 512로 설정하고 유사도 메트릭을 유클리드 거리(L2)로 설정했습니다. Milvus는 다양한 <a href="https://milvus.io/docs/v2.0.x/metric.md">유사도 메트릭을</a> 지원합니다.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">6단계: 컬렉션에 대한 인덱스 구축</h4><p>컬렉션이 만들어지면 컬렉션에 대한 인덱스를 구축합니다. 이 경우 IVF_SQ8 인덱스가 사용됩니다. 이 인덱스에는 각 데이터 파일(세그먼트) 내에 몇 개의 클러스터를 만들 것인지 Milvus에 알려주는 'nlist' 매개변수가 필요합니다. <a href="https://milvus.io/docs/v2.0.x/index.md">인덱스마다</a> 다른 매개변수가 필요합니다.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">7단계: 모델 및 데이터 로더 설정하기</h4><p>IVF_SQ8 인덱스가 구축되면 신경망과 데이터 로더를 설정합니다. 이 예에서 사용된 사전 학습된 파이토치 resnet-18은 분류를 위해 벡터를 압축하는 마지막 계층이 없어 중요한 정보가 손실될 수 있습니다.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>데이터 세트와 데이터 로더는 이미지의 파일 경로를 제공하면서 이미지를 전처리하고 일괄 처리할 수 있도록 수정해야 합니다. 이는 약간 수정된 토치비전 데이터 로더를 사용하여 수행할 수 있습니다. 전처리를 위해서는 특정 크기와 값 범위에 대해 학습된 resnet-18 모델로 인해 이미지를 잘라내고 정규화해야 합니다.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">8단계: 컬렉션에 벡터 삽입하기</h4><p>컬렉션 설정이 완료되면 이미지를 처리하여 생성된 컬렉션에 로드할 수 있습니다. 먼저 데이터 로더를 통해 이미지를 가져와 resnet-18 모델을 통해 실행합니다. 그런 다음 결과 벡터 임베딩을 Milvus에 삽입하면 각 벡터에 대한 고유 ID가 반환됩니다. 그런 다음 벡터 ID와 이미지 파일 경로가 Redis 서버에 키-값 쌍으로 삽입됩니다.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">9단계: 벡터 유사도 검색 수행</h4><p>모든 데이터가 Milvus와 Redis에 삽입되면 실제 벡터 유사도 검색을 수행할 수 있습니다. 이 예제에서는 벡터 유사도 검색을 위해 무작위로 선택된 이미지 세 개를 Redis 서버에서 가져옵니다.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>이 이미지들은 먼저 7단계에서와 동일한 전처리를 거친 다음 resnet-18 모델을 통해 푸시됩니다.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 결과 벡터 임베딩을 사용하여 검색을 수행합니다. 먼저 검색할 컬렉션의 이름, nprobe(검색할 클러스터의 수), top_k(반환된 벡터의 수) 등 검색 파라미터를 설정합니다. 이 예에서는 검색이 매우 빨라야 합니다.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">10단계: 이미지 검색 결과</h4><p>쿼리에서 반환된 벡터 ID는 해당 이미지를 찾는 데 사용됩니다. 그런 다음 이미지 검색 결과를 표시하는 데 Matplotlib를 사용합니다.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">다양한 환경에서 Milvus를 배포하는 방법 알아보기</h3><p>새로운 부트캠프의 <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">배포 섹션에는</a> 다양한 환경과 설정에서 Milvus를 사용하기 위한 모든 정보가 포함되어 있습니다. 여기에는 미샤드 배포, Milvus와 함께 Kubernetes 사용, 로드 밸런싱 등이 포함됩니다. 각 환경에는 Milvus를 작동시키는 방법을 설명하는 자세한 단계별 가이드가 있습니다.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요.</h3><ul>
<li><a href="https://zilliz.com/blog">블로그를</a> 읽어보세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack의</a> 오픈 소스 커뮤니티와 소통하세요.</li>
<li><a href="https://github.com/milvus-io/milvus">Github에서</a> 세계에서 가장 인기 있는 벡터 데이터베이스인 Milvus를 사용하거나 기여하세요.</li>
</ul>
