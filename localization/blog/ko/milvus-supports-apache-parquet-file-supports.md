---
id: milvus-supports-apache-parquet-file-supports.md
title: 'Milvus, 데이터 처리 효율성 향상을 위한 Apache Parquet 파일 가져오기 지원'
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: Apache Parquet을 도입함으로써 사용자는 데이터 가져오기 프로세스를 간소화하고 스토리지 및 컴퓨팅 비용을 크게 절감할 수 있습니다.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p>방대한 데이터 세트를 처리하는 능력으로 유명한 확장성이 뛰어난 벡터 데이터베이스인<a href="https://zilliz.com/what-is-milvus">Milvus는</a> <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">버전 2.3.4에서</a> Parquet 파일 지원을 도입하여 한 단계 더 발전했습니다. Apache Parquet을 도입함으로써 사용자는 데이터 가져오기 프로세스를 간소화하고 스토리지 및 계산 비용을 크게 절감할 수 있습니다.</p>
<p>최신 게시물에서는 Parquet의 장점과 Milvus 사용자에게 제공되는 이점을 살펴봅니다. 이 기능을 통합하게 된 동기를 설명하고, Parquet 파일을 Milvus로 원활하게 가져와 효율적인 데이터 관리 및 분석을 위한 새로운 가능성을 열어주는 단계별 가이드를 제공합니다.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">Apache Parquet이란?<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet은</a> 대규모 데이터 세트의 저장 및 처리 효율성을 높이기 위해 설계된 널리 사용되는 오픈 소스 열 지향 데이터 파일 형식입니다. CSV나 JSON과 같은 기존의 행 중심 데이터 형식과 달리 Parquet은 데이터를 열 단위로 저장하여 보다 효율적인 데이터 압축 및 인코딩 체계를 제공합니다. 이러한 접근 방식은 성능 향상, 스토리지 요구 사항 감소, 처리 능력 향상으로 이어져 복잡한 데이터를 대량으로 처리하는 데 이상적입니다.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">Milvus 사용자가 Parquet 파일 가져오기 지원의 혜택을 누리는 방법<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 Parquet 파일 가져오기 지원을 확장하여 사용자에게 스토리지 및 컴퓨팅 비용 절감, 데이터 관리 간소화, 가져오기 프로세스 간소화 등 최적화된 환경과 다양한 이점을 제공합니다.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">최적화된 스토리지 효율성 및 간소화된 데이터 관리</h3><p>Parquet은 다양한 데이터 유형에 맞는 유연한 압축 옵션과 효율적인 인코딩 체계를 제공하여 최적의 스토리지 효율성을 보장합니다. 이러한 유연성은 모든 스토리지 절약이 실질적인 비용 절감으로 직결되는 클라우드 환경에서 특히 유용합니다. Milvus의 이 새로운 기능을 통해 사용자는 다양한 데이터를 모두 하나의 파일로 손쉽게 통합하여 데이터 관리를 간소화하고 전반적인 사용자 경험을 향상시킬 수 있습니다. 이 기능은 특히 가변 길이 배열 데이터 유형으로 작업하는 사용자에게 유용하며, 이제 데이터 가져오기 프로세스를 간소화할 수 있습니다.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">쿼리 성능 향상</h3><p>Parquet의 컬럼형 스토리지 설계와 고급 압축 방식은 쿼리 성능을 크게 향상시킵니다. 쿼리를 수행할 때 사용자는 관련 없는 데이터를 스캔할 필요 없이 관련 데이터에만 집중할 수 있습니다. 이러한 선택적 열 읽기는 CPU 사용량을 최소화하여 쿼리 시간을 단축합니다.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">광범위한 언어 호환성</h3><p>Parquet은 Java, C++, Python 등 여러 언어로 제공되며 수많은 데이터 처리 도구와 호환됩니다. Parquet 파일 지원으로 다른 SDK를 사용하는 Milvus 사용자도 데이터베이스 내에서 구문 분석을 위한 Parquet 파일을 원활하게 생성할 수 있습니다.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">Parquet 파일을 Milvus로 가져오는 방법<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터가 이미 Parquet 파일 형식인 경우 가져오기는 쉽습니다. Parquet 파일을 MinIO와 같은 객체 스토리지 시스템에 업로드하면 가져올 준비가 완료됩니다.</p>
<p>아래 코드 스니펫은 Parquet 파일을 Milvus로 가져오는 예제입니다.</p>
<pre><code translate="no">remote_files = []
<span class="hljs-keyword">try</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Prepare upload files&quot;</span>)
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=<span class="hljs-literal">False</span>)
    found = minio_client.bucket_exists(bucket_name)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> found:
        minio_client.make_bucket(bucket_name)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;MinIO bucket &#x27;{}&#x27; doesn&#x27;t exist&quot;</span>.<span class="hljs-built_in">format</span>(bucket_name))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

    <span class="hljs-comment"># set your remote data path</span>
    remote_data_path = <span class="hljs-string">&quot;milvus_bulkinsert&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file</span>(<span class="hljs-params">f: <span class="hljs-built_in">str</span></span>):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, <span class="hljs-string">&quot;parquet&quot;</span>, file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Upload file &#x27;{}&#x27; to &#x27;{}&#x27;&quot;</span>.<span class="hljs-built_in">format</span>(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

<span class="hljs-keyword">except</span> S3Error <span class="hljs-keyword">as</span> e:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Failed to connect MinIO server {}, error: {}&quot;</span>.<span class="hljs-built_in">format</span>(MINIO_ADDRESS, e))
    <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Successfully upload files: {}&quot;</span>.<span class="hljs-built_in">format</span>(remote_files))
<span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>, remote_files
<button class="copy-code-btn"></button></code></pre>
<p>데이터가 Parquet 파일이 아니거나 동적 필드가 있는 경우, 데이터 형식 변환 도구인 BulkWriter를 활용하여 Parquet 파일을 생성할 수 있습니다. 이제 BulkWriter는 기본 출력 데이터 형식으로 Parquet을 채택하여 개발자에게 보다 직관적인 환경을 제공합니다.</p>
<p>아래 코드 스니펫은 BulkWriter를 사용하여 Parquet 파일을 생성하는 예시입니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> json

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path=<span class="hljs-string">&quot;your_remote_data_path&quot;</span>,
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name=<span class="hljs-string">&quot;a-bucket&quot;</span>,
        ),
        file_type=BulkFileType.PARQUET,
)

<span class="hljs-comment"># append your data</span>
batch_count = <span class="hljs-number">10000</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    row = {
        <span class="hljs-string">&quot;id&quot;</span>: i,
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: i % <span class="hljs-number">128</span>,
        <span class="hljs-string">&quot;int16&quot;</span>: i % <span class="hljs-number">1000</span>,
        <span class="hljs-string">&quot;int32&quot;</span>: i % <span class="hljs-number">100000</span>,
        <span class="hljs-string">&quot;int64&quot;</span>: i,
        <span class="hljs-string">&quot;float&quot;</span>: i / <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;double&quot;</span>: i / <span class="hljs-number">7</span>,
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: {<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>},
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    }
    remote_writer.append_row(row)

<span class="hljs-comment"># append rows by numpy type</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    remote_writer.append_row({
        <span class="hljs-string">&quot;id&quot;</span>: np.int64(i + batch_count),
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: np.int8(i % <span class="hljs-number">128</span>),
        <span class="hljs-string">&quot;int16&quot;</span>: np.int16(i % <span class="hljs-number">1000</span>),
        <span class="hljs-string">&quot;int32&quot;</span>: np.int32(i % <span class="hljs-number">100000</span>),
        <span class="hljs-string">&quot;int64&quot;</span>: np.int64(i),
        <span class="hljs-string">&quot;float&quot;</span>: np.float32(i / <span class="hljs-number">3</span>),
        <span class="hljs-string">&quot;double&quot;</span>: np.float64(i / <span class="hljs-number">7</span>),
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: json.dumps({<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>}),
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    })

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.total_row_count}</span> rows appends&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.buffer_row_count}</span> rows in buffer not flushed&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generate data files...&quot;</span>)
remote_writer.commit()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Data files have been uploaded: <span class="hljs-subst">{remote_writer.batch_files}</span>&quot;</span>)
remote_files = remote_writer.batch_files
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 Parquet 파일을 Milvus로 가져오기 시작할 수 있습니다.</p>
<pre><code translate="no">remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
<button class="copy-code-btn"></button></code></pre>
<p>이제 데이터가 Milvus에 원활하게 통합되었습니다.</p>
<h2 id="Whats-Next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus가 계속해서 증가하는 데이터 용량을 지원함에 따라, 특히 Parquet 파일이 10GB를 초과하는 경우 상당한 크기의 가져오기를 관리하는 데 어려움이 있습니다. 이 문제를 해결하기 위해 가져오기 데이터를 스칼라 열과 벡터 열로 분리하여 가져오기당 2개의 Parquet 파일을 생성하여 I/O 부담을 완화할 계획입니다. 수백 기가바이트를 초과하는 데이터 세트의 경우, 데이터를 여러 번 가져오는 것이 좋습니다.</p>
