---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Milvus로 데이터를 원활하게 마이그레이션하는 방법: 종합 가이드'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Elasticsearch, FAISS 및 이전 Milvus 1.x 버전에서 Milvus 2.x 버전으로 데이터를 마이그레이션하는 방법에 대한
  종합적인 가이드입니다.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus는</a> <a href="https://zilliz.com/learn/vector-similarity-search">유사도 검색을</a> 위한 강력한 오픈 소스 벡터 데이터베이스로, 최소한의 지연 시간으로 수십억, 수조 개의 벡터 데이터를 저장, 처리 및 검색할 수 있습니다. 또한 확장성과 안정성이 뛰어나고 클라우드 네이티브이며 기능이 풍부합니다. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus의 최신 버전은</a> 10배 이상 빠른 성능을 위한 <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU 지원과</a> 단일 머신에서 더 큰 저장 용량을 위한 MMap 등 훨씬 더 흥미로운 기능과 개선 사항을 도입했습니다.</p>
<p>2023년 9월 현재 Milvus는 GitHub에서 약 23,000개의 별을 획득했으며, 다양한 요구사항을 가진 다양한 산업 분야의 수만 명의 사용자를 보유하고 있습니다. <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT와</a> 같은 생성형 AI 기술이 널리 보급됨에 따라 더욱 인기를 얻고 있습니다. 특히 <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">검색 증강 생성</a> 프레임워크는 대규모 언어 모델의 환각 문제를 해결하는 다양한 AI 스택의 필수 구성 요소입니다.</p>
<p>Milvus로 마이그레이션하려는 신규 사용자와 최신 Milvus 버전으로 업그레이드하려는 기존 사용자의 증가하는 수요를 충족하기 위해 Milvus <a href="https://github.com/zilliztech/milvus-migration">마이그레이션을</a> 개발했습니다. 이 블로그에서는 Milvus 마이그레이션의 기능을 살펴보고 Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> 이상 버전에서 Milvus로 데이터를 신속하게 전환하는 방법을 안내해 드립니다.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">강력한 데이터 마이그레이션 도구, Milvus Migration<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration은</a> Go로 작성된 데이터 마이그레이션 도구입니다. 이를 통해 사용자는 이전 버전의 Milvus(1.x), FAISS, Elasticsearch 7.0 이상 버전에서 Milvus 2.x 버전으로 데이터를 원활하게 이동할 수 있습니다.</p>
<p>아래 다이어그램은 Milvus 마이그레이션을 구축한 방법과 작동 방식을 보여줍니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Milvus 마이그레이션이 데이터를 마이그레이션하는 방법</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Milvus 1.x 및 FAISS에서 Milvus 2.x로 마이그레이션하기</h4><p>Milvus 1.x 및 FAISS에서 데이터 마이그레이션은 원본 데이터 파일의 내용을 파싱하고, 이를 Milvus 2.x의 데이터 저장 형식으로 변환한 다음, Milvus SDK의 <code translate="no">bulkInsert</code> 를 사용하여 데이터를 작성하는 과정을 포함합니다. 이 전체 프로세스는 스트림 기반이며 이론적으로 디스크 공간에 의해서만 제한되며 데이터 파일은 로컬 디스크, S3, OSS, GCP 또는 Minio에 저장됩니다.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Elasticsearch에서 Milvus 2.x로 전환하기</h4><p>Elasticsearch 데이터 마이그레이션에서는 데이터 검색이 달라집니다. 파일에서 데이터를 가져오는 것이 아니라 Elasticsearch의 스크롤 API를 사용해 데이터를 순차적으로 가져옵니다. 그런 다음 데이터를 구문 분석하여 Milvus 2.x 스토리지 형식으로 변환한 다음 <code translate="no">bulkInsert</code> 을 사용하여 씁니다. Elasticsearch에 저장된 <code translate="no">dense_vector</code> 유형 벡터를 마이그레이션하는 것 외에도, Milvus 마이그레이션은 긴, 정수, 짧은, 부울, 키워드, 텍스트, 이중 등 다른 필드 유형도 마이그레이션할 수 있도록 지원합니다.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Milvus 마이그레이션 기능 세트</h3><p>Milvus 마이그레이션은 강력한 기능 세트를 통해 마이그레이션 프로세스를 간소화합니다:</p>
<ul>
<li><p><strong>지원되는 데이터 소스:</strong></p>
<ul>
<li><p>Milvus 1.x에서 Milvus 2.x로</p></li>
<li><p>Elasticsearch 7.0 이상에서 Milvus 2.x로의 마이그레이션</p></li>
<li><p>FAISS에서 Milvus 2.x로</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>다양한 상호 작용 모드:</strong></p>
<ul>
<li><p>Cobra 프레임워크를 사용하는 명령줄 인터페이스(CLI)</p></li>
<li><p>Swagger UI가 내장된 Restful API</p></li>
<li><p>다른 도구에서 Go 모듈로 통합</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>다양한 파일 형식 지원:</strong></p>
<ul>
<li><p>로컬 파일</p></li>
<li><p>Amazon S3</p></li>
<li><p>오브젝트 스토리지 서비스(OSS)</p></li>
<li><p>구글 클라우드 플랫폼(GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>유연한 Elasticsearch 통합:</strong></p>
<ul>
<li><p>Elasticsearch에서 <code translate="no">dense_vector</code> 유형 벡터 마이그레이션</p></li>
<li><p>긴, 정수, 짧은, 부울, 키워드, 텍스트, 이중과 같은 다른 필드 유형 마이그레이션 지원</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">인터페이스 정의</h3><p>Milvus 마이그레이션은 다음과 같은 주요 인터페이스를 제공합니다:</p>
<ul>
<li><p><code translate="no">/start</code>: 마이그레이션 작업을 시작합니다(덤프와 로드의 조합에 해당, 현재 ES 마이그레이션만 지원).</p></li>
<li><p><code translate="no">/dump</code>: 덤프 작업을 시작합니다(소스 데이터를 대상 저장 매체에 씁니다).</p></li>
<li><p><code translate="no">/load</code>: 로드 작업을 시작합니다(대상 저장 매체의 데이터를 Milvus 2.x에 씁니다).</p></li>
<li><p><code translate="no">/get_job</code>: 사용자가 작업 실행 결과를 볼 수 있습니다. (자세한 내용은 <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">프로젝트의 server.go를</a> 참조하세요).</p></li>
</ul>
<p>다음으로, 몇 가지 예제 데이터를 사용하여 이 섹션에서 Milvus 마이그레이션을 사용하는 방법을 살펴보겠습니다. <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">이</a> 예제는 GitHub에서 찾을 수 있습니다.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Elasticsearch에서 Milvus 2.x로의 마이그레이션<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Elasticsearch 데이터 준비</li>
</ol>
<p><a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> 데이터를 <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">마이그레이션하려면</a> 이미 자체 Elasticsearch 서버를 설정해야 합니다. <code translate="no">dense_vector</code> 필드에 벡터 데이터를 저장하고 다른 필드와 함께 색인을 생성해야 합니다. 인덱스 매핑은 아래와 같습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>컴파일 및 빌드</li>
</ol>
<p>먼저, <a href="https://github.com/zilliztech/milvus-migration">GitHub에서</a> Milvus Migration의 <a href="https://github.com/zilliztech/milvus-migration">소스 코드를</a> 다운로드합니다. 그런 다음 다음 명령을 실행하여 컴파일합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>이 단계는 <code translate="no">milvus-migration</code> 이라는 실행 파일을 생성합니다.</p>
<ol start="3">
<li>구성 <code translate="no">migration.yaml</code></li>
</ol>
<p>마이그레이션을 시작하기 전에 데이터 소스, 대상 및 기타 관련 설정에 대한 정보가 포함된 <code translate="no">migration.yaml</code> 이라는 이름의 구성 파일을 준비해야 합니다. 다음은 구성 예시입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>구성 파일에 대한 자세한 설명은 GitHub의 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">이 페이지를</a> 참조하세요.</p>
<ol start="4">
<li>마이그레이션 작업 실행</li>
</ol>
<p>이제 <code translate="no">migration.yaml</code> 파일을 구성했으므로 다음 명령을 실행하여 마이그레이션 작업을 시작할 수 있습니다:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>로그 출력을 관찰합니다. 다음과 유사한 로그가 표시되면 마이그레이션이 성공했다는 뜻입니다.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>명령줄 접근 방식 외에도 Milvus 마이그레이션은 Restful API를 사용한 마이그레이션도 지원합니다.</p>
<p>Restful API를 사용하려면 다음 명령을 사용하여 API 서버를 시작합니다:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>서비스가 실행되면 API를 호출하여 마이그레이션을 시작할 수 있습니다.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>마이그레이션이 완료되면 올인원 벡터 데이터베이스 관리 도구인 <a href="https://zilliz.com/attu">Attu를</a> 사용하여 마이그레이션된 총 성공 행 수를 확인하고 기타 수집 관련 작업을 수행할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Attu 인터페이스</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Milvus 1.x에서 Milvus 2.x로 마이그레이션하기<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Milvus 1.x 데이터 준비</li>
</ol>
<p>마이그레이션 프로세스를 빠르게 경험할 수 있도록 Milvus 마이그레이션의 소스 코드에 10,000개의 Milvus 1.x <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">테스트 데이터</a> 레코드를 넣었습니다. 그러나 실제 사례에서는 마이그레이션 프로세스를 시작하기 전에 Milvus 1.x 인스턴스에서 <code translate="no">meta.json</code> 파일을 직접 내보내야 합니다.</p>
<ul>
<li>다음 명령을 사용하여 데이터를 내보낼 수 있습니다.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>다음 사항을 확인하세요:</p>
<ul>
<li><p>플레이스홀더를 실제 MySQL 자격 증명으로 바꿉니다.</p></li>
<li><p>이 내보내기를 수행하기 전에 Milvus 1.x 서버를 중지하거나 데이터 쓰기를 중지합니다.</p></li>
<li><p>Milvus <code translate="no">tables</code> 폴더와 <code translate="no">meta.json</code> 파일을 같은 디렉터리에 복사합니다.</p></li>
</ul>
<p><strong>참고:</strong> 밀버스의 완전 관리형 서비스인 <a href="https://zilliz.com/cloud">질리즈 클라우드에서</a> 밀버스 2.x를 사용하는 경우, 클라우드 콘솔을 사용하여 마이그레이션을 시작할 수 있습니다.</p>
<ol start="2">
<li>컴파일 및 빌드</li>
</ol>
<p>먼저 <a href="https://github.com/zilliztech/milvus-migration">GitHub에서</a> Milvus 마이그레이션의 <a href="https://github.com/zilliztech/milvus-migration">소스 코드를</a> 다운로드합니다. 그런 다음 다음 명령을 실행하여 컴파일합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>이 단계는 <code translate="no">milvus-migration</code> 이라는 실행 파일을 생성합니다.</p>
<ol start="3">
<li>구성 <code translate="no">migration.yaml</code></li>
</ol>
<p><code translate="no">migration.yaml</code> 구성 파일을 준비하여 소스, 대상 및 기타 관련 설정에 대한 세부 정보를 지정합니다. 다음은 구성 예시입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>구성 파일에 대한 자세한 설명은 GitHub의 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">이 페이지를</a> 참조하세요.</p>
<ol start="4">
<li>마이그레이션 작업 실행</li>
</ol>
<p>마이그레이션을 완료하려면 <code translate="no">dump</code> 및 <code translate="no">load</code> 명령을 별도로 실행해야 합니다. 이 명령은 데이터를 변환하여 Milvus 2.x로 가져옵니다.</p>
<p><strong>참고:</strong> 조만간 이 단계를 간소화하여 사용자가 하나의 명령으로 마이그레이션을 완료할 수 있도록 할 예정입니다. 계속 지켜봐 주세요.</p>
<p><strong>덤프 명령:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>로드 명령:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>마이그레이션이 완료되면 Milvus 2.x에서 생성된 컬렉션에는 <code translate="no">id</code> 와 <code translate="no">data</code> 두 개의 필드가 포함됩니다. 올인원 벡터 데이터베이스 관리 도구인 <a href="https://zilliz.com/attu">Attu를</a> 사용하여 자세한 내용을 확인할 수 있습니다.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">FAISS에서 Milvus 2.x로 마이그레이션하기<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>FAISS 데이터 준비</li>
</ol>
<p>Elasticsearch 데이터를 마이그레이션하려면 자체 FAISS 데이터가 준비되어 있어야 합니다. 마이그레이션 프로세스를 빠르게 경험할 수 있도록 Milvus 마이그레이션의 소스 코드에 몇 가지 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">FAISS 테스트 데이터를</a> 넣었습니다.</p>
<ol start="2">
<li>컴파일 및 빌드</li>
</ol>
<p>먼저 <a href="https://github.com/zilliztech/milvus-migration">GitHub에서</a> Milvus 마이그레이션의 <a href="https://github.com/zilliztech/milvus-migration">소스 코드를</a> 다운로드합니다. 그런 다음 다음 명령을 실행하여 컴파일합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>이 단계는 <code translate="no">milvus-migration</code> 이라는 실행 파일을 생성합니다.</p>
<ol start="3">
<li>구성 <code translate="no">migration.yaml</code></li>
</ol>
<p>소스, 대상 및 기타 관련 설정에 대한 세부 정보를 지정하여 FAISS 마이그레이션을 위한 <code translate="no">migration.yaml</code> 구성 파일을 준비합니다. 다음은 구성 예시입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>구성 파일에 대한 자세한 설명은 GitHub의 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">이 페이지를</a> 참조하세요.</p>
<ol start="4">
<li>마이그레이션 작업 실행</li>
</ol>
<p>Milvus 1.x에서 Milvus 2.x로의 마이그레이션과 마찬가지로 FAISS 마이그레이션도 <code translate="no">dump</code> 및 <code translate="no">load</code> 명령을 모두 실행해야 합니다. 이 명령은 데이터를 변환하여 Milvus 2.x로 가져옵니다.</p>
<p><strong>참고:</strong> 조만간 이 단계를 간소화하여 사용자가 단 하나의 명령으로 마이그레이션을 완료할 수 있도록 할 예정입니다. 계속 지켜봐 주세요.</p>
<p><strong>덤프 명령:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>로드 명령:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>올인원 벡터 데이터베이스 관리 도구인 <a href="https://zilliz.com/attu">Attu를</a> 사용하여 자세한 내용을 확인할 수 있습니다.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">향후 마이그레이션 계획에 대해 계속 지켜봐 주세요.<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>향후에는 더 많은 데이터 소스에서 마이그레이션을 지원하고 다음과 같은 마이그레이션 기능을 추가할 예정입니다:</p>
<ul>
<li><p>Redis에서 Milvus로의 마이그레이션 지원.</p></li>
<li><p>MongoDB에서 Milvus로의 마이그레이션 지원.</p></li>
<li><p>재개 가능한 마이그레이션 지원.</p></li>
<li><p>덤프와 로드 프로세스를 하나로 병합하여 마이그레이션 명령을 간소화하세요.</p></li>
<li><p>다른 주류 데이터 소스에서 Milvus로의 마이그레이션을 지원합니다.</p></li>
</ul>
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
    </button></h2><p>Milvus의 최신 릴리스인 Milvus 2.3은 데이터 관리의 증가하는 요구 사항을 충족하는 흥미로운 새 기능과 성능 개선을 제공합니다. Milvus 2.x로 데이터를 마이그레이션하면 이러한 이점을 누릴 수 있으며, Milvus 마이그레이션 프로젝트를 통해 마이그레이션 프로세스가 간소화되고 쉬워집니다. 한 번 사용해 보시면 실망하지 않으실 겁니다.</p>
<p><em><strong>참고:</strong> 이 블로그의 정보는 2023년 9월 현재 Milvus 및 <a href="https://github.com/zilliztech/milvus-migration">Milvus 마이그레이션</a> 프로젝트의 상태를 기반으로 합니다. 최신 정보 및 지침은 <a href="https://milvus.io/docs">Milvus</a> 공식 <a href="https://milvus.io/docs">문서를</a> 참조하세요.</em></p>
