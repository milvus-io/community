---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: 'Milvus 3.0 발표: 레이크 네이티브 벡터 검색과 더욱 강력한 검색 엔진'
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Milvus 3.0의 레이크 네이티브 벡터 검색, 제로카피 외부 컬렉션, 더 빠른 희소 검색, 스냅샷, Spark 통합, 고급 랭킹 기능을
  알아보세요.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>오늘 Milvus 3.0을 출시합니다. 이는 프로젝트의 주요 아키텍처 이정표입니다. Milvus가 인덱스를 구축하고 제공할 수 있는 위치와 엔진 내부에서 직접 수행할 수 있는 검색 작업의 범위를 모두 바꿉니다.</p>
<ul>
<li>Milvus 3.0은 Parquet, Lance, Iceberg, Vortex를 포함한 오브젝트 스토리지와 오픈 테이블 포맷에 존재하는 벡터 데이터를 인덱싱하기 위한 <strong>레이크 네이티브 경로</strong>를 도입합니다. 팀은 벡터 데이터베이스에 또 다른 복사본을 유지하지 않고도 레이크에 상주하는 데이터를 검색 가능하게 만들 수 있습니다.</li>
<li><strong>이번 릴리스는 또한 Milvus를 초기 후보 검색을 넘어 확장합니다.</strong> 서버 측 정렬, 집계, 패싯 검색, 중첩된 문서/청크 구조와 ColBERT 벡터를 위한 StructArray, 그리고 재설계된 희소 인덱스는 더 많은 랭킹, 그룹화, 결과 처리를 애플리케이션 코드에서 검색 엔진 내부로 이동시킵니다.</li>
</ul>
<p>이러한 발전을 통해 Milvus는 프로덕션 AI 검색을 위한 오픈소스 기반이자, 레이크 네이티브 스토리지와 고성능 벡터 검색을 결합하는 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 아키텍처의 기반이 됩니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Milvus 3.0 기능 세트 한눈에 보기<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>영역</strong></th><th><strong>기능</strong></th><th><strong>중요한 이유</strong></th></tr>
</thead>
<tbody>
<tr><td>레이크 네이티브 검색</td><td>Parquet, Lance, Iceberg, Vortex 기반 External Collections</td><td>두 번째 서빙용 복사본을 유지하지 않고 레이크에 상주하는 데이터 검색</td></tr>
<tr><td>S3 기반 스토리지</td><td>Loon (Storage v3)</td><td>서빙 스타일 접근을 위한 포인트 읽기 증폭을 줄이고 스키마 진화를 지원</td></tr>
<tr><td>오프라인/배치 워크플로 및 복구</td><td>Snapshots, Spark DataSource V2, 온라인 스키마 진화</td><td>평가, 중복 제거, 클러스터링, 피처 파이프라인에 안정적인 컬렉션 뷰 제공</td></tr>
<tr><td>검색 엔진</td><td>ORDER BY, 집계, 패싯, StructArray, 개선된 희소 검색</td><td>더 많은 결과 처리와 다중 벡터 스코어링을 Milvus로 이동</td></tr>
<tr><td>데이터 모델 &amp; 운영</td><td>Nullable 벡터, TEXT LOB, TTL, MinHash, Woodpecker, ForceMerge</td><td>더 풍부한 데이터 모델과 프로덕션 운영 패턴 지원</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">레이크 네이티브 인프라: 데이터가 이미 존재하는 곳에서 인덱싱하고 제공하기<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0에서 가장 큰 아키텍처 변화는 시스템이 인덱스를 구축하고 제공할 수 있는 위치입니다. 벡터 데이터는 오브젝트 스토리지의 오픈 포맷에 그대로 유지될 수 있으며, Milvus는 프로덕션 등급의 인덱싱, 검색, API를 제공합니다.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: 레이크 상주 데이터에 직접 인덱싱</h3><p>많은 팀은 이미 임베딩을 데이터 레이크에 저장하고 있습니다. 예를 들어 Lance 테이블, Iceberg 테이블, Parquet 파일 또는 S3, GCS, Azure Blob Storage에 있는 기타 오픈 포맷 데이터셋입니다. Milvus 3.0 이전에는 이 데이터를 검색하기 위한 선택지가 보통 두 가지였습니다.</p>
<ul>
<li>임베딩을 벡터 데이터베이스로 복사합니다. 이는 낮은 지연 시간의 검색을 제공하지만, 두 번째 복사본과 계속 동기화되어야 하는 ETL 파이프라인을 만듭니다.</li>
<li>레이크를 직접 쿼리합니다. 이는 중복을 피할 수 있지만, ANN 인덱스가 없으면 벡터 검색이 프로덕션 지연 시간을 충족할 수 없는 브루트포스 스캔이 됩니다.</li>
</ul>
<p><strong>External Collections는 세 번째 경로를 도입합니다.</strong> 오브젝트 스토리지에 그대로 남아 있는 데이터 위에 Milvus 컬렉션을 정의하고, 외부 필드를 Milvus 스키마에 매핑하며, 네이티브 컬렉션과 동일한 검색 및 쿼리 API를 사용합니다. 소스 파일은 이동하지 않습니다. Milvus가 외부 데이터 위에 벡터, BM25 역색인, JSON, 스칼라 인덱스를 구축하고 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections는 읽기 전용이며 제로 카피</strong>이므로, 거버넌스, 소유권 경계 또는 운영 비용 때문에 소스 데이터셋이 레이크에 남아 있어야 하는 경우 유용합니다.</p>
<p>외부 데이터셋이 변경되면 Milvus는 전체 컬렉션을 다시 빌드하는 대신 스토리지 매니페스트를 읽고 새로 추가된 프래그먼트를 인덱싱합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>거버넌스가 적용되는 환경에서는 데이터가 존재하도록 허용된 위치에서 검색을 실행할 수 있습니다. 대규모 AI 시스템의 경우 레이크에 상주하는 데이터셋은 배포 간 마이그레이션 작업 없이 여러 검색 배포를 지원할 수 있습니다.</p>
<p>External Collections는 추가 기능입니다. 네이티브 Milvus 컬렉션은 쓰기 중심, 낮은 지연 시간 서빙을 위한 기본 경로로 유지되며, External Collections는 기록 시스템이 Milvus 외부에 남아 있는 데이터셋을 위해 설계되었습니다.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>을 참조하세요.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): 레이크 네이티브 검색을 위한 효율적인 포인트 읽기</h3><p>External Collections는 분명한 질문을 제기합니다. 오브젝트 스토리지는 규모와 내구성을 위해 설계되었지만, ANN 검색 이후에 발생하는 좁은 범위의 포인트 읽기를 지원할 수 있을까요?</p>
<p><strong>과제는 읽기 증폭입니다.</strong> 벡터 검색은 일반적으로 두 단계로 실행됩니다. ANN 인덱스가 후보 ID를 반환하고, 시스템은 해당 후보에 대해 선택된 필드를 가져옵니다. 분석 스캔에 최적화된 포맷은 좁은 논리적 조회를 훨씬 더 큰 물리적 읽기로 바꿀 수 있습니다.</p>
<p><strong>Milvus 3.0은 S3 호환 오브젝트 스토리지를 위한 매니페스트 기반 컬럼형 스토리지 엔진인 Loon, 즉 Storage v3로 이 문제를 해결합니다.</strong> Loon은 정렬된 행 ID를 가진 <code translate="no">ColumnGroups</code>로 필드를 구성하여, 스칼라 필드는 필터링과 스캔에 유리하게 하고 벡터 및 포인트 읽기가 많은 필드는 더 좁은 조회에 맞게 설계된 레이아웃을 사용할 수 있게 합니다.</p>
<p>Loon은 벡터 및 역색인을 파일 포맷 내부에 포함하지 않고 파일 포맷과 분리하여 유지합니다. 각 데이터셋 버전은 해당 <code translate="no">ColumnGroups</code>를 기록하는 불변 매니페스트로 설명되며, 이를 통해 동일한 인덱싱 엔진이 Lance, Parquet, Iceberg, Vortex 전반에서 작동할 수 있습니다.</p>
<p>매니페스트 설계는 스키마 진화도 덜 disruptive하게 만듭니다. 필드를 추가하거나 삭제할 때 기존 컬럼을 다시 쓰지 않고 메타데이터를 업데이트할 수 있습니다. 새 필드를 채우면 기존 <code translate="no">ColumnGroups</code>는 그대로 두고 새로운 <code translate="no">ColumnGroup</code>을 씁니다.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a>는 이 경로의 기본 포맷입니다. 이는 유연한 레이아웃과 중첩 인코딩을 갖춘 오픈 Arrow 호환 컬럼형 포맷으로, 포인트 쿼리가 많은 AI 데이터에 더 잘 맞습니다. 300만 행, 128차원 벡터, S3, 256개 동시 리더를 사용한 내부 벤치마크에서 포인트 읽기당 측정된 I/O는 Parquet 기준선의 약 9.4 MB에서 Loon이 적용된 Vortex의 0.07 MB로 줄어 약 135배 감소했습니다.</p>
<p>Milvus 3.0이 오브젝트 스토리지를 로컬 메모리처럼 동작하게 만드는 것은 아닙니다. 대신 오브젝트 스토리지를 서빙 스타일 포인트 조회에 비실용적으로 만드는 읽기 증폭을 줄입니다. 포맷으로의 predicate pushdown과 로컬 Vortex 변형은 다음 로드맵에 있습니다.</p>
<p><em>자세한 내용은 블로그를 참조하세요:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>및</em> <a href="https://github.com/vortex-data/vortex"><em>Vortex 프로젝트</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: 데이터 복사 없는 특정 시점 뷰</h3><p>오프라인 작업은 프로덕션 컬렉션이 계속 쓰기를 받는 동안에도 데이터의 일관된 뷰가 필요합니다. Milvus 스냅샷은 전체 데이터셋을 복사하는 대신 기존 데이터, 인덱스, 메타데이터 파일에 대한 참조를 기록하는 특정 시점의 읽기 전용 뷰입니다.</p>
<p>따라서 모델 교체, 재임베딩 작업, 스키마 마이그레이션 같은 위험한 작업 전에 스냅샷을 만들 만큼 비용이 저렴합니다. 스냅샷 복원은 모든 행을 다시 가져오고 모든 인덱스를 재빌드하는 대신 오브젝트 스토리지의 서버 측 복사를 통해 기존 데이터와 인덱스 파일을 재사용할 수 있습니다. 이 기능은 데이터가 지속적으로 변경되고, 가끔 무거운 백업을 수행하는 대신 빈번하고 저렴한 복구 지점을 원하는 AI 에이전트 같은 빠르게 움직이는 워크로드에 특히 유용합니다.</p>
<p>동일한 고정 뷰는 라이브 컬렉션이 계속 쓰기를 수락하는 동안 평가, 중복 제거, 백필 검증, 격리된 테스트를 지원할 수 있습니다. 스냅샷은 논리적 입력을 안정화하지만, 워크로드는 여전히 오브젝트 스토리지와 네트워크 대역폭 같은 인프라를 공유할 수 있습니다.</p>
<p>스냅샷은 백업을 대체하지 않습니다. 스냅샷은 라이브 컬렉션이 소유한 파일을 참조하며, 논리적 복구, 클로닝, 단기 안정 뷰에 가장 적합합니다. 백업은 장기 보존과 재해 복구를 위한 독립 복사본을 생성합니다.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a>, <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>를 참조하세요.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark 커넥터: Milvus를 배치 워크플로에 연결</h3><p>안정적인 스냅샷은 배치 엔진이 읽을 수 있을 때만 유용합니다. Milvus 3.0은 Milvus를 Spark DataSource V2로 노출하여 Spark, Databricks, EMR 작업이 표준 배치 파이프라인의 일부로 Milvus에서 읽고 Milvus에 쓸 수 있게 합니다.</p>
<p>이 기능이 중요한 이유는 AI 데이터 워크플로가 반복적이기 때문입니다. 중복 제거는 재임베딩으로 이어지고, 클러스터링은 평가로 이어지며, 평가는 선별된 학습 또는 서빙 세트를 생성합니다. 안정적인 스냅샷은 이러한 작업에 일관된 입력을 제공하는 동시에 라이브 컬렉션은 계속 서빙합니다. Spark 커넥터를 사용하면 매번 전체 컬렉션을 Milvus 밖으로 내보내지 않아도 한 작업의 싱크가 다음 작업의 소스가 됩니다.</p>
<p>Milvus 3.0은 또한 중복 제거, 이상 탐지, 클러스터링 같은 작업을 위한 벡터 네이티브 배치 연산자를 도입하여, 계산량이 많은 작업을 온라인 쿼리 경로 밖에 두면서도 벡터 데이터에 직접 작동하게 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. 온라인 스키마 변경 및 백필</h3><p>프로덕션에서 스키마는 거의 정적으로 유지되지 않습니다. 팀은 시간이 지나면서 새로운 임베딩 모델, 희소 벡터, 레이블, 메타데이터 필드, 보존 정책을 추가합니다. Milvus 3.0은 과거에 필요했던 disruptive한 재빌드 대신, 서빙이 계속되는 동안 컬럼을 추가, 채우기, 삭제할 수 있게 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>컬럼을 추가하거나 삭제해도 기존 데이터를 다시 쓸 필요가 없습니다. <code translate="no">client.add_collection_field(...)</code>는 컬렉션을 오프라인으로 전환하지 않고 새 nullable 컬럼을 추가하며, <code translate="no">client.drop_collection_field(...)</code>는 런타임에 더 이상 사용하지 않거나 실험적인 필드를 제거합니다. 둘 중 어느 것도 기존 데이터를 다시 쓰지 않습니다. 각각은 데이터 파일이 아니라 컬렉션의 매니페스트에 대한 변경이므로 재빌드가 없습니다.</p>
<p>Milvus 3.0은 두 가지 백필 경로를 지원합니다:</p>
<ul>
<li><strong>Inner backfill</strong>(3.0 제공)은 기존 필드에서 파생된 값을 위한 것입니다. Milvus는 커널 내부에서 텍스트 컬럼으로부터 BM25 희소 벡터를 생성할 수 있어, dense-plus-sparse 하이브리드 검색을 구축할 때 클라이언트 측 인코더가 필요하지 않습니다.</li>
<li><strong>External backfill</strong>(로드맵에 포함)은 Milvus 외부에서 계산된 값을 위한 것입니다. 스냅샷을 만들고, 일관된 뷰에 대해 Spark를 실행하고, 새 컬럼을 계산한 뒤 값을 다시 쓰면 Milvus가 인덱스를 증분 업데이트합니다. 이는 대규모 재임베딩 작업을 위한 의도된 경로입니다. 예를 들어 쓰기가 계속되는 동안 수억 개 행에 새 임베딩 컬럼을 추가하는 경우입니다.</li>
</ul>
<p>온라인 스키마 변경과 백필을 함께 사용하면 데이터 모델이 변경될 때마다 전체 컬렉션을 다시 빌드하지 않고도 검색 파이프라인을 더 쉽게 진화시킬 수 있습니다.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">엔드투엔드 검색을 위한 더 강력한 엔진<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 BM25 기반 희소 검색과 하이브리드 검색을 포함해 dense ANN 검색 이상의 기능을 오랫동안 지원해 왔습니다. Milvus 3.0은 다른 축으로 엔진을 확장합니다. 다단계 검색 파이프라인의 더 많은 부분을 Milvus 자체로 가져와 과도한 가져오기, 중복된 애플리케이션 로직, 별도 후처리 서비스 의존도를 줄입니다.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. 서버 측 ORDER BY: 세그먼트별로 엔진 내부에서 정렬</h3><p>이전에는 정렬을 위해 애플리케이션이 후보를 과도하게 가져오고, 클라이언트로 이동한 뒤, 거기서 정렬해야 했습니다. 이는 대역폭을 소비하고 최종 결과가 클라이언트 측 잘림이 발생한 위치에 의존하게 만들었습니다.</p>
<p><strong>Milvus 3.0은 서버 측 ORDER BY를 추가합니다</strong>. 이를 통해 쿼리 워크로드는 평점, 가격, 최신성, 재고, 타임스탬프 같은 스칼라 필드를 기준으로 필터링된 행을 정렬할 수 있습니다.</p>
<ul>
<li>쿼리 경로에서는 각 세그먼트가 필터링된 결과 세트를 정렬하고, 쿼리 노드가 해당 스트림을 병합하며, 프록시가 요청된 슬라이스를 반환합니다.</li>
<li>검색 경로에서는 ORDER BY가 Milvus 내부에서 ANN 후보 세트를 정렬하여 클라이언트 측 과도한 가져오기와 중복 후처리를 줄입니다. 이는 ANN 후보가 설정한 recall 경계를 변경하지 않습니다.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>이는 관련성과 평점, 가격, 최신성, 재고, 타임스탬프 같은 비즈니스 또는 사용자 대면 제약 조건을 결합하는 검색에 특히 유용합니다.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> 및 <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>를 참조하세요.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. 집계 및 패싯 검색</h3><p>Milvus 3.0은 하나 이상의 스칼라 필드로 그룹화된 count, sum, average, minimum, maximum 같은 작업을 포함하는 쿼리 측 집계를 추가합니다. 이를 통해 팀이 단순히 개수를 세거나 그룹화하거나 간단한 통계를 계산하기 위해 필터링된 행을 클라이언트 코드로 가져오는 일반적인 패턴을 제거합니다.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0은 패싯 검색을 위한 <strong>검색 집계</strong>도 추가합니다. ANN 검색 후 Milvus는 검색된 히트를 필드별로 그룹화하고 버킷 카운트, 집계 통계, 버킷별 상위 N개 샘플 히트를 반환합니다. 이는 브랜드, 가격대, 색상, 테넌트, 문서 유형별 그룹화의 기반이 되는 패턴입니다. 한 가지 주의할 점은 검색 집계가 전체 컬렉션이 아니라 ANN으로 검색된 결과 세트에서 작동하므로 패싯 카운트가 근사값이라는 것입니다. 정확한 카운트가 필요하면 쿼리 측 집계를 사용하세요.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>를 참조하세요.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. 중첩 벡터 및 Late-Interaction 모델을 위한 StructArray</h3><p>많은 엔티티는 자연스럽게 여러 벡터로 표현됩니다. 긴 문서는 일련의 청크이고, 비디오는 여러 행에 흩뿌리기보다 한 행에 함께 유지하고 싶은 프레임의 시퀀스이며, 제품은 여러 이미지나 각도를 가집니다. Late-interaction 모델은 이를 더 확장합니다. ColBERT는 토큰당 하나의 벡터를, ColPali는 시각 패치당 하나의 벡터를 방출합니다. 모든 경우에 실제로 저장하고 검색하려는 단위는 각 프래그먼트 자체가 아니라 전체 엔티티입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong>는 단일 엔티티 ID와 단일 메타데이터 세트를 유지하면서, Milvus 행이 여러 벡터를 포함한 가변 길이 구조화 요소 배열을 포함할 수 있게 합니다. 이는 문서를 여러 행으로 분할하고 레이블, 권한 또는 기타 필드를 프래그먼트 전반에 중복하는 것을 방지합니다.</p>
<p>Milvus는 두 가지 검색 세분성을 지원합니다.</p>
<ul>
<li><strong>요소 수준 검색</strong>은 하나의 쿼리 벡터를 목록의 각 요소와 매칭하고, 해당 오프셋과 함께 일치하는 특정 요소를 반환합니다. 어떤 청크, 토큰, 패치, 이미지가 일치했는지 알고 싶을 때 유용합니다. 여러 요소가 일치하면 하나의 행이 여러 번 나타날 수 있습니다.</li>
<li><strong>엔티티 수준 검색</strong>은 <code translate="no">MAX_SIM</code>을 사용하고 <code translate="no">MAX_SIM_COSINE</code> 메트릭을 통해 쿼리의 전체 벡터 목록을 행의 벡터 목록과 비교합니다. 각 쿼리 토큰은 문서에서 자신의 최적 매칭을 취하고, 이러한 최적 점수들이 합산됩니다. 이를 통해 Milvus는 문서당 한 행을 유지하면서 ColBERT 및 ColPali 같은 late-interaction 검색 패턴을 네이티브로 지원합니다.</li>
</ul>
<p>모든 토큰 벡터를 인덱싱하는 것은 비용이 많이 들 수 있습니다. 그래서 Milvus 3.0은 인덱스 크기, 학습 비용, recall을 절충하는 TokenANN, Muvera, Lemur를 포함한 여러 가속 경로를 추가합니다.</p>
<table>
<thead>
<tr><th>전략</th><th>1단계 표현</th><th>비용 프로파일</th><th>적합한 경우</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>모든 토큰 벡터가 인덱싱됩니다.</td><td>가장 높음, 정확함</td><td>고식별 모델 및 짧은 문서</td></tr>
<tr><td>Muvera</td><td>랜덤 프로젝션 FDE를 사용해 문서당 하나의 벡터</td><td>중간, 학습 불필요</td><td>긴 문서</td></tr>
<tr><td>Lemur</td><td>학습된 MLP 압축을 사용해 문서당 하나의 벡터</td><td>가장 낮음, 학습 필요</td><td>저식별 모델 및 시각 또는 패치 벡터</td></tr>
</tbody>
</table>
<p>벤치마크에서 Lemur는 대부분의 데이터셋에서 각 문서를 단일 벡터로 축소하면서 TokenANN의 recall과 같거나 더 좋았습니다. 예외는 길이 편차가 큰 말뭉치로, 이 경우 TokenANN 또는 다른 전략이 더 안전합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>메모리보다 큰 말뭉치의 경우 Milvus는 RAM 부담을 줄이기 위해 임베딩 목록을 디스크에 유지하는 <code translate="no">DISKANN</code> 인덱스도 지원합니다.</p>
<p>요소 수준 검색은 이미 Milvus 2.6에 도입되었습니다. Muvera, Lemur, StructList에 대한 필터링은 3.0에서 새로 제공됩니다.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25 인덱스 압축 및 SINDI</h3><p>Milvus는 이전 릴리스에서 희소 벡터 검색을 지원해 왔습니다. Milvus 3.0은 블록 압축 포스팅(VByte 관련 알고리즘과 SIMD 디코딩)과 양자화(inner product용 fp16, BM25용 u16)를 통해 희소 인덱스 풋프린트를 줄입니다.</p>
<p>한 내부 BM25 벤치마크 세트에서 새 구현은 비슷한 recall에서 Milvus 2.6 희소 인덱스보다 약 3배 더 작았습니다. 더 작은 인덱스는 메모리와 대역폭 부담을 줄이고, 데이터 이동이 병목인 워크로드에서 속도를 개선할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0은 또한 SPLADE 같은 학습된 희소 임베딩에 최적화된 새로운 희소 검색 알고리즘인 <a href="https://arxiv.org/abs/2509.08395">SINDI</a>를 도입합니다. 이러한 임베딩은 BM25보다 더 조밀한 포스팅 리스트를 생성하므로, pruning 중심 검색 알고리즘은 무엇을 건너뛸지 결정하는 데 상당한 CPU 시간을 소비할 수 있습니다. SINDI는 대신 포스팅을 compact window로 구성하고 SIMD 친화적인 점수 누적을 사용해 효율적으로 처리하면서, lossless pruning을 통해 검색 정확도를 보존합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>또한 SINDI를 원래 설계 이상으로 확장해 네이티브 BM25 지원을 포함시켰으며, 이를 통해 Milvus는 학습된 희소 임베딩과 전통적인 전체 텍스트 검색 모두에 동일한 최적화된 희소 검색 경로를 사용할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>4개의 SPLADE 희소 벡터 데이터셋에 대한 벤치마크에서 SINDI는 학습된 희소 벡터에서 MaxScore 대비 최대 약 10배의 QPS에 도달했으며, 최악의 경우에도 약 5배였습니다.</p>
<p>SINDI는 Milvus 3.0에서 sparse inner-product 검색의 기본값입니다.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">기타 개선 사항<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> 벡터 옆에 긴 소스 텍스트를 저장합니다. 64 KB 미만의 텍스트는 인라인으로 유지되고, 더 큰 값은 Vortex LOB 참조를 사용합니다.</li>
<li><strong>확장된 dense 인덱스 지원:</strong> 다양한 규모, 메모리, recall 요구 사항을 위해 SVS, Panorama, PQ, IVFPQ, ScaNN을 포함하여 Faiss 계열 내에서 더 많은 인덱스 선택지를 추가합니다.</li>
<li><strong>MinHash 및 near-duplicate 검색:</strong> 서버 측에서 MinHash 시그니처를 생성하고 MINHASH_LSH를 사용해 near-duplicate 후보를 검색합니다.</li>
<li><strong>Nullable 벡터 및 새 타입:</strong> 벡터 필드가 NULL이 될 수 있게 하고, 시간 인식 필터링 및 보존 정책을 위한 TIMESTAMPTZ를 추가합니다.</li>
<li><strong>사용자 지정 전체 텍스트 사전:</strong> 다국어 및 도메인별 토큰화를 위해 클러스터에 사전, 동의어, 불용어 리소스를 등록합니다.</li>
<li><strong>Standalone Woodpecker:</strong> Milvus write-ahead log를 독립적으로 확장 가능하고 관찰 가능한 서비스로 실행합니다.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> TIMESTAMPTZ 필드를 통해 개별 레코드를 만료시키며, MVCC 필터링 이후 compaction 중 garbage collection이 수행됩니다.</li>
<li><strong>ForceMerge:</strong> 지속적인 읽기 중심 서비스 전에 읽기 증폭을 줄이기 위해 작은 세그먼트를 목표 크기로 압축하고 인덱스를 재빌드합니다.</li>
<li>그 외 다수</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Milvus 3.0 시작하기<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0은 오늘부터 Apache 2.0 라이선스하에 제공되며, 계속해서 LF AI &amp; Data 프로젝트로 유지됩니다. 시작하려면:</p>
<ul>
<li><a href="https://milvus.io/docs/release_notes.md">릴리스 노트</a>와 <a href="https://milvus.io/docs/quickstart.md">퀵스타트</a>를 읽고, <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>에서 소스를 받으세요.</li>
<li><a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 커뮤니티</a>에 참여하거나 <a href="https://milvus.io/office-hours">Milvus Office Hours</a> 세션을 예약해 메인테이너와 사용 사례를 논의하세요.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0과 Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0은 프로덕션 AI 검색과 새롭게 부상하는 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> 아키텍처를 위한 오픈소스 기반을 마련합니다. 이 아키텍처는 단일 진실 공급원 위에서 레이크 네이티브 스토리지와 고성능 벡터 검색을 각각 적절한 비용으로 결합합니다.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a>는 Milvus를 만든 팀이 구축한 완전 관리형 Vector Lakebase입니다. Milvus와 동일한 분산형 레이크 네이티브 아키텍처를 공유하며 Milvus API와 완전히 호환됩니다. 독자적인 Cardinal 인덱싱 엔진으로 구동되는 Zilliz Cloud는 표준 오픈소스 인덱싱 접근 방식보다 최대 10× 더 나은 가격 대비 성능을 제공하는 동시에 인프라 관리의 운영 복잡성을 제거합니다. 엔터프라이즈 기능에는 scale-to-zero 컴퓨팅, 크로스 리전 재해 복구, BYOC 배포, 엔터프라이즈급 보안 및 컴플라이언스(SOC 2, HIPAA, ISO 27001, GDPR), 최대 99.99% SLA가 포함됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>개발자는 Milvus를 오픈소스 벡터 데이터베이스로 배포하거나, AI 데이터 수명 주기 전반의 여러 워크로드를 위한 관리형 플랫폼으로 <a href="https://zilliz.com/">Zilliz Cloud</a>를 사용할 수 있습니다.</p>
<h2 id="What-comes-next" class="common-anchor-header">다음 단계<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 로드맵은 3.0 아키텍처를 기반으로 External Collections를 위한 predicate pushdown, 외부 백필, 추가 Spark 연산자, Delta Lake와 Apache Paimon을 포함한 더 많은 테이블 포맷 지원을 구축합니다.</p>
<p>더 큰 방향은 분명합니다. AI 데이터 시스템에는 온라인 검색과 오프라인 데이터 개선 사이의 더 긴밀한 루프가 필요합니다. 팀이 벡터 데이터를 검색, 분석, 개선 또는 제공하려고 할 때마다 별도 시스템으로 복사할 필요가 없어야 합니다.</p>
