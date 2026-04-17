---
id: Milvus-Data-Migration-Tool.md
title: Milvus 데이터 마이그레이션 도구 소개
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: Milvus 데이터 마이그레이션 도구를 사용하여 데이터 관리의 효율성을 크게 개선하고 DevOps 비용을 절감하는 방법을 알아보세요.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Milvus 데이터 마이그레이션 도구 소개</custom-h1><p><em><strong>중요 참고</strong>: Milvus 데이터 마이그레이션 도구는 더 이상 사용되지 않습니다. 다른 데이터베이스에서 Milvus로 데이터를 마이그레이션하려면 고급 Milvus 마이그레이션 도구를 사용하는 것이 좋습니다.</em></p>
<p>현재 Milvus 마이그레이션 도구가 지원됩니다:</p>
<ul>
<li>Elasticsearch에서 Milvus 2.x로의 마이그레이션</li>
<li>Faiss에서 Milvus 2.x로</li>
<li>Milvus 1.x에서 Milvus 2.x로</li>
<li>Milvus 2.3.x에서 Milvus 2.3.x 이상 버전으로의 마이그레이션</li>
</ul>
<p>Pinecone, Chroma, Qdrant 등 더 많은 벡터 데이터 소스에서 마이그레이션을 지원할 예정입니다. 계속 지켜봐 주세요.</p>
<p><strong>자세한 내용은 <a href="https://milvus.io/docs/migrate_overview.md">Milvus 마이그레이션 설명서</a> 또는 해당 <a href="https://github.com/zilliztech/milvus-migration">GitHub 리포지토리를</a> 참조하세요.</strong></p>
<p>--------------------------------- <strong>Mivus 데이터 마이그레이션 도구는 더 이상 사용되지 않습니다</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">개요</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus 데이터 마이그레이션)은 Milvus로 데이터 파일을 가져오고 내보내기 위해 특별히 설계된 오픈 소스 도구입니다. MilvusDM은 다음과 같은 방식으로 데이터 관리 효율성을 크게 개선하고 DevOps 비용을 절감할 수 있습니다:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss에서 Mil</a>vus로: 압축 해제된 데이터를 Faiss에서 Milvus로 가져옵니다.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5에서 Milvus로</a>: HDF5 파일을 Milvus로 가져옵니다.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus에서</a> Milvus로: 소스 Milvus에서 다른 대상 Milvus로 데이터를 마이그레이션합니다.</p></li>
<li><p>Milvus에서<a href="#milvus-to-hdf5">HDF5로</a>: Milvus의 데이터를 HDF5 파일로 저장합니다.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>밀버스DM 블로그 1.png</span> </span></p>
<p>MilvusDM은 <a href="https://github.com/milvus-io/milvus-tools">Github에서</a> 호스팅되며 <code translate="no">pip3 install pymilvusdm</code> 명령줄을 실행하여 쉽게 설치할 수 있습니다. MilvusDM을 사용하면 특정 컬렉션 또는 파티션의 데이터를 마이그레이션할 수 있습니다. 다음 섹션에서는 각 데이터 마이그레이션 유형을 사용하는 방법을 설명합니다.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss에서 Milvus로</h3><h4 id="Steps" class="common-anchor-header">단계</h4><p>1. <strong>F2M.yaml을</strong> 다운로드합니다:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.다음 매개변수를 설정합니다:</p>
<ul>
<li><p><code translate="no">data_path</code>: Faiss의 데이터 경로(벡터 및 해당 ID).</p></li>
<li><p><code translate="no">dest_host</code>: 밀버스 서버 주소.</p></li>
<li><p><code translate="no">dest_port</code>: 밀버스 서버 포트.</p></li>
<li><p><code translate="no">mode</code>: 다음 모드를 사용하여 Milvus로 데이터를 가져올 수 있습니다:</p>
<ul>
<li><p>건너뛰기: 컬렉션 또는 파티션이 이미 있는 경우 데이터를 무시합니다.</p></li>
<li><p>추가: 추가: 컬렉션 또는 파티션이 이미 존재하는 경우 데이터를 추가합니다.</p></li>
<li><p>덮어쓰기: 덮어쓰기: 컬렉션 또는 파티션이 이미 존재하는 경우 삽입 전에 데이터를 삭제합니다.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: 데이터 가져오기를 위한 수신 컬렉션의 이름입니다.</p></li>
<li><p><code translate="no">dest_partition_name</code>: 데이터 가져오기를 위한 수신 파티션의 이름입니다.</p></li>
<li><p><code translate="no">collection_parameter</code>: 벡터 차원, 인덱스 파일 크기, 거리 메트릭과 같은 컬렉션별 정보입니다.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. <strong>F2M.yaml을</strong> 실행합니다 <strong>:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">샘플 코드</h4><p>1. Faiss 파일을 읽어 벡터와 해당 ID를 검색합니다.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. 검색된 데이터를 Milvus에 삽입합니다:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5에서 Milvus로</h3><h4 id="Steps" class="common-anchor-header">단계</h4><p>1. <strong>H2M.yaml을</strong> 다운로드합니다.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.다음 매개변수를 설정합니다:</p>
<ul>
<li><p><code translate="no">data_path</code>: HDF5 파일 경로.</p></li>
<li><p><code translate="no">data_dir</code>: HDF5 파일이 있는 디렉토리.</p></li>
<li><p><code translate="no">dest_host</code>: 밀버스 서버 주소.</p></li>
<li><p><code translate="no">dest_port</code>: Milvus 서버 포트.</p></li>
<li><p><code translate="no">mode</code>: 다음 모드를 사용하여 Milvus로 데이터를 가져올 수 있습니다:</p>
<ul>
<li><p>건너뛰기: 컬렉션 또는 파티션이 이미 있는 경우 데이터를 무시합니다.</p></li>
<li><p>추가: 추가: 컬렉션 또는 파티션이 이미 존재하는 경우 데이터를 추가합니다.</p></li>
<li><p>덮어쓰기: 덮어쓰기: 컬렉션 또는 파티션이 이미 존재하는 경우 삽입 전에 데이터를 삭제합니다.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: 데이터 가져오기를 위한 수신 컬렉션의 이름입니다.</p></li>
<li><p><code translate="no">dest_partition_name</code>: 데이터 가져오기를 위한 수신 파티션의 이름입니다.</p></li>
<li><p><code translate="no">collection_parameter</code>: 벡터 차원, 인덱스 파일 크기, 거리 메트릭과 같은 컬렉션 관련 정보.</p></li>
</ul>
<blockquote>
<p><code translate="no">data_path</code> 또는 <code translate="no">data_dir</code> 을 설정합니다. 둘 다 <strong>설정하지</strong> 마십시오. 여러 파일 경로를 지정하려면 <code translate="no">data_path</code>, 데이터 파일이 있는 디렉터리를 지정하려면 <code translate="no">data_dir</code> 을 사용합니다.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. <strong>H2M.yaml을</strong> 실행합니다 <strong>:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">샘플 코드</h4><p>1. HDF5 파일을 읽어 벡터와 해당 ID를 검색합니다:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. 검색된 데이터를 Milvus에 삽입합니다:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">밀버스에서 밀버스로</h3><h4 id="Steps" class="common-anchor-header">단계</h4><p>1. <strong>M2M.yaml을</strong> 다운로드합니다.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.다음 파라미터를 설정합니다:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: 소스 Milvus 작업 경로.</p></li>
<li><p><code translate="no">mysql_parameter</code>: 소스 밀버스 MySQL 설정. MySQL을 사용하지 않는 경우, mysql_parameter를 ''로 설정합니다.</p></li>
<li><p><code translate="no">source_collection</code>: 소스 Milvus의 컬렉션 및 해당 파티션의 이름입니다.</p></li>
<li><p><code translate="no">dest_host</code>: Milvus 서버 주소.</p></li>
<li><p><code translate="no">dest_port</code>: Milvus 서버 포트.</p></li>
<li><p><code translate="no">mode</code>: 다음 모드를 사용하여 Milvus로 데이터를 가져올 수 있습니다:</p>
<ul>
<li><p>건너뛰기: 컬렉션 또는 파티션이 이미 있는 경우 데이터를 무시합니다.</p></li>
<li><p>추가: 추가: 컬렉션 또는 파티션이 이미 있는 경우 데이터를 추가합니다.</p></li>
<li><p>덮어쓰기: 덮어쓰기: 컬렉션 또는 파티션이 이미 존재하는 경우 데이터를 삽입하기 전에 삭제합니다.컬렉션 또는 파티션이 이미 존재하는 경우 삽입하기 전에 데이터를 삭제합니다.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. <strong>M2M.yaml을</strong> 실행합니다 <strong>.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">샘플 코드</h4><p>1. 지정된 컬렉션 또는 파티션의 메타데이터에 따라 로컬 드라이브의 <strong>milvus/db에서</strong> 파일을 읽어 소스 Milvus에서 벡터와 해당 ID를 검색합니다.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. 검색된 데이터를 대상 Milvus에 삽입합니다.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus에서 HDF5로</h3><h4 id="Steps" class="common-anchor-header">단계</h4><p>1. <strong>M2H.yaml을</strong> 다운로드합니다:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.다음 파라미터를 설정합니다:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: 소스 Milvus 작업 경로.</p></li>
<li><p><code translate="no">mysql_parameter</code>: 소스 Milvus MySQL 설정. MySQL을 사용하지 않는 경우, mysql_parameter를 ''로 설정합니다.</p></li>
<li><p><code translate="no">source_collection</code>: 소스 Milvus의 컬렉션 및 해당 파티션의 이름입니다.</p></li>
<li><p><code translate="no">data_dir</code>: 저장된 HDF5 파일을 보관할 디렉터리입니다.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. <strong>M2H.yaml을</strong> 실행합니다:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">샘플 코드</h4><p>1. 지정된 컬렉션 또는 파티션의 메타데이터에 따라 로컬 드라이브의 <strong>milvus/db에서</strong> 파일을 읽어 벡터와 해당 ID를 검색합니다.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.검색된 데이터를 HDF5 파일로 저장합니다.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDM 파일 구조</h3><p>아래 순서도는 MilvusDM이 수신한 YAML 파일에 따라 어떻게 다른 작업을 수행하는지 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm 블로그 2.png</span> </span></p>
<p>MilvusDM 파일 구조:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>core</p>
<ul>
<li><p><strong>밀버스_클라이언트.py</strong>: 밀버스에서 클라이언트 작업을 수행합니다.</p></li>
<li><p><strong>read_data.py</strong>: 로컬 드라이브에 있는 HDF5 데이터 파일을 읽습니다. (다른 형식의 데이터 파일 읽기를 지원하려면 여기에 코드를 추가하세요.)</p></li>
<li><p><strong>read_faiss_data.py</strong>: Faiss의 데이터 파일을 읽습니다.</p></li>
<li><p><strong>read_milvus_data.py</strong>: 밀버스 형식의 데이터 파일을 읽습니다.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: 밀버스에서 메타데이터를 읽습니다.</p></li>
<li><p><strong>data_to_milvus.py</strong>: YAML 파일의 파라미터를 기반으로 컬렉션 또는 파티션을 생성하고 벡터와 해당 벡터 ID를 Milvus로 가져옵니다.</p></li>
<li><p><strong>save_data.py</strong>: 데이터를 HDF5 파일로 저장합니다.</p></li>
<li><p><strong>write_logs.py</strong>: 런타임 중에 로그를 씁니다.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Faiss에서 Milvus로 데이터를 가져옵니다.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: HDF5 파일에 있는 데이터를 Milvus로 가져옵니다.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: 소스 밀버스에서 대상 밀버스로 데이터를 마이그레이션합니다.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Milvus의 데이터를 내보내고 HDF5 파일로 저장합니다.</p></li>
<li><p><strong>main.py</strong>: 수신한 YAML 파일에 따라 해당 작업을 수행합니다.</p></li>
<li><p><strong>setting.py</strong>: MilvusDM 코드 실행과 관련된 설정.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: <strong>pymilvusdm</strong> 파일 패키지를 생성하고 PyPI(Python 패키지 인덱스)에 업로드합니다.</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">요약</h3><p>MilvusDM은 주로 Milvus 안팎으로 데이터를 마이그레이션하는 작업을 처리하며, 여기에는 Faiss에서 Milvus로, HDF5에서 Milvus로, Milvus에서 Milvus로, Milvus에서 HDF5로 마이그레이션하는 작업이 포함됩니다.</p>
<p>다음 기능은 향후 릴리스에 추가될 예정입니다:</p>
<ul>
<li><p>Faiss에서 Milvus로 바이너리 데이터 가져오기.</p></li>
<li><p>소스 Milvus와 대상 Milvus 간의 데이터 마이그레이션을 위한 차단 목록 및 허용 목록.</p></li>
<li><p>소스 Milvus의 여러 컬렉션 또는 파티션에서 데이터를 대상 Milvus의 새 컬렉션으로 병합 및 가져오기.</p></li>
<li><p>Milvus 데이터의 백업 및 복구.</p></li>
</ul>
<p>MilvusDM 프로젝트는 <a href="https://github.com/milvus-io/milvus-tools">Github에서</a> 오픈 소스입니다. 프로젝트에 대한 모든 기여를 환영합니다. 별점 🌟을 주고 <a href="https://github.com/milvus-io/milvus-tools/issues">이슈를</a> 제기하거나 직접 코드를 제출해 주세요!</p>
