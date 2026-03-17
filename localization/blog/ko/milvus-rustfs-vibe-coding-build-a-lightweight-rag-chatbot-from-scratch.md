---
id: milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
title: 'Milvus + RustFS + 바이브 코딩: 처음부터 경량 RAG 챗봇 구축하기'
author: Jinghe Ma
date: 2026-3-10
cover: assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_7_f25795481e.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_keywords: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_title: |
  Milvus + RustFS: Build a Lightweight RAG Chatbot
desc: 'RustFS 문서를 지식 베이스로 사용하여 Milvus, RustFS, FastAPI 및 Next.js로 경량 RAG 챗봇을 구축하세요.'
origin: >-
  https://milvus.io/blog/milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
---
<p><em>이 블로그는 Milvus 커뮤니티 기여자인 Jinghe Ma가</em> <em>작성한 것으로, 허가를 받아 여기에 게시되었습니다.</em></p>
<p>저는 자체 문서에서 질문에 답할 수 있는 챗봇을 원했고, 객체 저장소에서 채팅 인터페이스에 이르기까지 그 뒤에 있는 스택을 완전히 제어할 수 있기를 원했습니다. 그래서 <a href="https://milvus.io/">Milvus와</a> <a href="https://rustfs.com/">RustFS를</a> 핵심으로 하는 경량 RAG 챗봇을 구축하게 되었습니다.</p>
<p><a href="https://milvus.io/">Milvus는</a> RAG 애플리케이션 구축에 가장 널리 채택된 오픈 소스 벡터 데이터베이스입니다. 컴퓨팅과 스토리지를 분리하여 빠른 검색을 위해 핫 데이터를 메모리나 SSD에 보관하고, 확장 가능하고 비용 효율적인 데이터 관리를 위해 그 아래에는 오브젝트 스토리지를 사용합니다. S3 호환 스토리지와 함께 작동하기 때문에 이 프로젝트에 매우 적합했습니다.</p>
<p>스토리지 레이어에는 Rust로 작성된 오픈 소스 S3 호환 객체 스토리지 시스템인 <a href="https://rustfs.com/">RustFS를</a> 선택했습니다. 이 시스템은 바이너리, Docker 또는 Helm 차트를 통해 배포할 수 있습니다. 아직 알파 버전이고 프로덕션 워크로드에는 권장되지 않지만, 이 빌드에는 충분히 안정적이었습니다.</p>
<p>인프라가 구축되고 나면 쿼리할 지식 기반이 필요했습니다. 약 80개의 마크다운 파일로 구성된 RustFS 문서는 편리한 출발점이었습니다. 저는 문서를 덩어리로 묶고 임베딩을 생성하여 Milvus에 저장하고 나머지는 바이브 코딩했습니다: 백엔드에는 <a href="https://fastapi.tiangolo.com/">FastAPI를</a>, 채팅 인터페이스에는 <a href="https://nextjs.org/">Next.js를</a> 사용했습니다.</p>
<p>이 글에서는 전체 시스템을 엔드 투 엔드로 다뤄보겠습니다. 코드는 https://github.com/majinghe/chatbot 에서 확인할 수 있습니다. 이 코드는 프로덕션에 사용할 수 있는 시스템이 아니라 작동 중인 프로토타입이지만 명확하고 확장 가능한 빌드를 제공하여 사용자가 자신의 용도에 맞게 조정할 수 있도록 하는 것이 목표입니다. 아래의 각 섹션에서는 인프라부터 프론트엔드까지 각 계층을 하나씩 살펴봅니다.</p>
<h2 id="Installing-Milvus-and-RustFS-with-Docker-Compose" class="common-anchor-header">Docker Compose로 Milvus 및 RustFS 설치하기<button data-href="#Installing-Milvus-and-RustFS-with-Docker-Compose" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus와</a> <a href="https://rustfs.com/">RustFS를</a> 설치하는 것부터 시작하겠습니다.</p>
<p>Milvus는 모든 S3 호환 개체 스토리지와 함께 작동할 수 있지만, 표준 설정에서는 MinIO가 기본 백엔드입니다. MinIO는 더 이상 커뮤니티 기여를 받지 않으므로 이 예제에서는 RustFS로 대체하겠습니다.</p>
<p>이렇게 변경하려면 Milvus 리포지토리 내부의 configs/milvus.yaml에서 개체 스토리지 구성을 업데이트하세요. 관련 섹션은 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-attr">minio</span>:
  <span class="hljs-attr">address</span>: <span class="hljs-attr">localhost</span>:<span class="hljs-number">9000</span>
  <span class="hljs-attr">port</span>: <span class="hljs-number">9000</span>
  <span class="hljs-attr">accessKeyID</span>: rustfsadmin
  <span class="hljs-attr">secretAccessKey</span>: rustfsadmin
  <span class="hljs-attr">useSSL</span>: <span class="hljs-literal">false</span>
  <span class="hljs-attr">bucketName</span>: <span class="hljs-string">&quot;rustfs-bucket&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 변경 사항을 적용하는 방법에는 두 가지가 있습니다:</p>
<ul>
<li><strong>로컬 구성 파일을 마운트합니다.</strong> configs/milvus.yaml을 로컬에 복사하고 MinIO 필드가 RustFS를 가리키도록 업데이트한 다음 Docker 볼륨을 통해 컨테이너에 마운트합니다.</li>
<li><strong>시작 시</strong> <strong>yq****</strong><strong>으로 패치합니다</strong> <strong>.</strong> Milvus 프로세스가 시작되기 전에 컨테이너의 명령을 수정하여 /milvus/configs/milvus.yaml에 대해 yq를 실행합니다.</li>
</ul>
<p>이 빌드에서는 첫 번째 접근 방식을 사용합니다. docker-compose.yml의 Milvus 서비스는 하나의 추가 볼륨 항목을 가져옵니다:</p>
<pre><code translate="no">- <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Docker-Compose-Setup" class="common-anchor-header">도커 컴포즈 설정</h3><p>전체 docker-compose.yml은 네 가지 서비스를 실행합니다.</p>
<p><strong>etcd</strong> - Milvus는 메타데이터 스토리지를 위해 etcd에 의존합니다:</p>
<pre><code translate="no">etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.18
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;etcdctl&quot;</span>, <span class="hljs-string">&quot;endpoint&quot;</span>, <span class="hljs-string">&quot;health&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
<button class="copy-code-btn"></button></code></pre>
<p><strong>Attu</strong> - Zilliz에서 개발 및 오픈 소스한 Milvus용 시각적 UI(참고: 2.6 이후 버전은 비공개 소스):</p>
<pre><code translate="no">  attu:
    container_name: milvus-attu
    image: zilliz/attu:v2.6
    environment:
      - MILVUS_URL=milvus-standalone:19530
    ports:
      - <span class="hljs-string">&quot;8000:3000&quot;</span>
    restart: unless-stopped
<button class="copy-code-btn"></button></code></pre>
<p><strong>RustFS</strong> - 객체 스토리지 백엔드:</p>
<pre><code translate="no">rustfs:
    container_name: milvus-rustfs
    image: rustfs/rustfs:1.0.0-alpha.58
    environment:
      - RUSTFS_VOLUMES=/data/rustfs0,/data/rustfs1,/data/rustfs2,/data/rustfs3
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=<span class="hljs-literal">true</span>
      - RUSTFS_EXTERNAL_ADDRESS=:9000  <span class="hljs-comment"># Same as internal since no port mapping</span>
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_ACCESS_KEY=rustfsadmin
      - RUSTFS_SECRET_KEY=rustfsadmin
    ports:
      - <span class="hljs-string">&quot;9000:9000&quot;</span># S3 API port
      - <span class="hljs-string">&quot;9001:9001&quot;</span># Console port
    volumes:
      - rustfs_data_0:/data/rustfs0
      - rustfs_data_1:/data/rustfs1
      - rustfs_data_2:/data/rustfs2
      - rustfs_data_3:/data/rustfs3
      - logs_data:/app/logs
    restart: unless-stopped
    healthcheck:
      <span class="hljs-built_in">test</span>:
        [
          <span class="hljs-string">&quot;CMD&quot;</span>,
          <span class="hljs-string">&quot;sh&quot;</span>, <span class="hljs-string">&quot;-c&quot;</span>,
          <span class="hljs-string">&quot;curl -f http://localhost:9000/health &amp;&amp; curl -f http://localhost:9001/health&quot;</span>
        ]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 10s
      retries: 3
      start_period: 40s
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus</strong> - 독립형 모드로 실행:</p>
<pre><code translate="no">  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.6.0
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    security_opt:
    - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: rustfs:9000
      MQ_TYPE: woodpecker
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;rustfs&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Starting-Everything" class="common-anchor-header">모든 것 시작하기</h3><p>구성이 완료되면 네 가지 서비스를 모두 불러옵니다:</p>
<pre><code translate="no">docker compose -f docker-compose.yml up -d
<button class="copy-code-btn"></button></code></pre>
<p>모든 것이 실행되고 있는지 확인할 수 있습니다:</p>
<pre><code translate="no">docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED          STATUS                      PORTS                                                                                      NAMES
4404b5cc6f7e   milvusdb/milvus:v2.6.0                            <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     0.0.0.0:9091-&gt;9091/tcp, :::9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp, :::19530-&gt;19530/tcp   milvus-standalone
40ddc8ed08bb   zilliz/attu:v2.6                                  <span class="hljs-string">&quot;docker-entrypoint.s…&quot;</span>   53 minutes ago   Up 53 minutes               0.0.0.0:8000-&gt;3000/tcp, :::8000-&gt;3000/tcp                                                  milvus-attu
3d2c8d80a8ce   quay.io/coreos/etcd:v3.5.18                       <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     2379-2380/tcp                                                                              milvus-etcd
d760f6690ea7   rustfs/rustfs:1.0.0-alpha.58                      <span class="hljs-string">&quot;/entrypoint.sh rust…&quot;</span>   53 minutes ago   Up 53 minutes (unhealthy)   0.0.0.0:9000-9001-&gt;9000-9001/tcp, :::9000-9001-&gt;9000-9001/tcp                              milvus-rustfs
<button class="copy-code-btn"></button></code></pre>
<p>네 개의 컨테이너가 모두 실행되면 다음에서 서비스를 사용할 수 있습니다:</p>
<ul>
<li><strong>Milvus:</strong> <ip>:19530</li>
<li><strong>RustFS:</strong> <ip>:9000</li>
<li><strong>Attu:</strong> <ip>:8000</li>
</ul>
<h2 id="Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="common-anchor-header">RustFS 문서 벡터화 및 Milvus에 임베딩 저장하기<button data-href="#Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus와 RustFS가 실행되면 다음 단계는 지식 베이스를 구축하는 것입니다. 소스 자료는 RustFS 중국어 문서로, 80개의 마크다운 파일을 청크하고 임베드하여 Milvus에 저장할 것입니다.</p>
<h3 id="Reading-and-Chunking-the-Docs" class="common-anchor-header">문서 읽기 및 청크</h3><p>이 스크립트는 문서 폴더의 모든 .md 파일을 재귀적으로 읽은 다음 각 파일의 콘텐츠를 줄 바꿈으로 청크로 분할합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># 3. Read Markdown files</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">folder</span>):
    files = glob.glob(os.path.join(folder, <span class="hljs-string">&quot;**&quot;</span>, <span class="hljs-string">&quot;*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
    docs = []
    <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> files:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(f, <span class="hljs-string">&quot;r&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> fp:
            docs.append(fp.read())
    <span class="hljs-keyword">return</span> docs

<span class="hljs-comment"># 4. Split documents (simple paragraph-based splitting)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_into_chunks</span>(<span class="hljs-params">text, max_len=<span class="hljs-number">500</span></span>):
    chunks, current = [], []
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>):
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(<span class="hljs-string">&quot; &quot;</span>.join(current)) + <span class="hljs-built_in">len</span>(line) &lt; max_len:
            current.append(line)
        <span class="hljs-keyword">else</span>:
            chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
            current = [line]
    <span class="hljs-keyword">if</span> current:
        chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<p>이 청크 분할 전략은 의도적으로 간단합니다. 헤더를 분할하거나, 코드 블록을 보존하거나, 청크를 겹쳐서 검색을 개선하는 등 보다 엄격한 제어를 원한다면 여기에서 반복할 수 있습니다.</p>
<h3 id="Embedding-the-Chunks" class="common-anchor-header">청크 임베딩하기</h3><p>청크가 준비되면 3072차원 벡터를 출력하는 OpenAI의 텍스트 임베딩-3 대형 모델을 사용하여 임베딩합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts</span>):
    response = client.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-large&quot;</span>,
        <span class="hljs-built_in">input</span>=texts
    )
    <span class="hljs-keyword">return</span> [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> response.data]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Storing-Embeddings-in-Milvus" class="common-anchor-header">Milvus에 임베딩 저장하기</h3><p>Milvus는 데이터를 각각 스키마로 정의된 컬렉션으로 구성합니다. 여기서 각 레코드는 임베딩 벡터와 함께 원시 텍스트 청크를 저장합니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Connect to Milvus</span>
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;ip&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">3072</span>),
]
schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Markdown docs collection&quot;</span>)

<span class="hljs-comment"># Create the collection</span>
<span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>):
    utility.drop_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>)

collection = Collection(name=<span class="hljs-string">&quot;docs_collection&quot;</span>, schema=schema)

<span class="hljs-comment"># Insert data</span>
collection.insert([all_chunks, embeddings])
collection.flush()
<button class="copy-code-btn"></button></code></pre>
<p>삽입이 완료되면 Attu에서 <ip>:8000에서 컬렉션을 확인할 수 있으며, 컬렉션 아래에 docs_collection이 나열되어 있을 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_2_a787e96076.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>또한 <ip>:9000에서 RustFS를 확인하여 오브젝트 스토리지에 저장된 기본 데이터를 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_6_0e6d8c9471.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="common-anchor-header">Milvus와 OpenAI의 GPT-5로 RAG 파이프라인 구축하기<button data-href="#Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 저장된 임베딩을 사용하면 RAG 파이프라인을 구축하는 데 필요한 모든 것을 갖추게 됩니다. 사용자의 쿼리를 임베드하고, Milvus에서 의미적으로 가장 유사한 청크를 검색하고, 프롬프트를 조합하고, GPT-5를 호출하는 흐름입니다. 여기서는 OpenAI의 GPT-5를 사용하지만 채팅이 가능한 모든 모델이 작동하며, 검색 계층이 중요하고 최종 답변을 생성하는 LLM에 관계없이 Milvus가 이를 처리합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># 1. Embed the query</span>
query_embedding = embed_texts(query)

<span class="hljs-comment"># 2. Retrieve similar documents from Milvus</span>
    search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}}
    results = collection.search(
        data=[query_embedding],
        anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
        param=search_params,
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )

docs = [hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>) <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># 3. Assemble the RAG prompt</span>
prompt = <span class="hljs-string">f&quot;You are a RustFS expert. Answer the question based on the following documents:\n\n<span class="hljs-subst">{docs}</span>\n\nUser question: <span class="hljs-subst">{query}</span>&quot;</span>

<span class="hljs-comment"># 4. Call the LLM</span>
    response = client.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-5&quot;</span>, <span class="hljs-comment"># swap to any OpenAI model, or replace this call with another LLM provider</span>
        messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}],
        <span class="hljs-comment"># max_tokens=16384,</span>
        <span class="hljs-comment"># temperature=1.0,</span>
        <span class="hljs-comment"># top_p=1.0,</span>
    )

    answer = response.choices[<span class="hljs-number">0</span>].message.content

    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;answer&quot;</span>: answer, <span class="hljs-string">&quot;sources&quot;</span>: docs}
<button class="copy-code-btn"></button></code></pre>
<p>이를 테스트하려면 쿼리를 실행해 보세요:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>쿼리 결과:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_5_2cd609c90c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_3_18f4476b7a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>모든 것을 FastAPI + Next.js 챗봇으로 래핑하기</p>
<p>RAG 파이프라인이 작동하고 있지만 질문을 할 때마다 Python 스크립트를 실행하는 것은 목적에 어긋납니다. 그래서 AI에게 스택 제안을 요청했습니다. 대답은 백엔드에는 <strong>FastAPI</strong> - RAG 코드는 이미 Python이므로 FastAPI 엔드포인트로 래핑하는 것이 가장 적합하고, 프런트엔드에는 <strong>Next.js를</strong> 사용하는 것이 좋습니다. FastAPI는 RAG 로직을 HTTP 엔드포인트로 노출하고, Next.js는 이를 호출하여 채팅 창에 응답을 렌더링합니다.</p>
<h3 id="FastAPI-Backend" class="common-anchor-header">FastAPI 백엔드</h3><p>FastAPI는 RAG 로직을 단일 POST 엔드포인트로 래핑합니다. 이제 모든 클라이언트가 JSON 요청으로 지식창고를 쿼리할 수 있습니다:</p>
<pre><code translate="no">app = FastAPI()

<span class="hljs-meta">@app.post(<span class="hljs-params"><span class="hljs-string">&quot;/chat&quot;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">req: ChatRequest</span>):
    query = req.query

......
<button class="copy-code-btn"></button></code></pre>
<p>서버를 다음과 같이 시작하세요:</p>
<pre><code translate="no">uvicorn main:app --reload --host <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> --port <span class="hljs-number">9999</span>
INFO:     Will watch <span class="hljs-keyword">for</span> changes <span class="hljs-keyword">in</span> these directories: [<span class="hljs-string">&#x27;/home/xiaomage/milvus/chatbot/.venv&#x27;</span>]
INFO:     Uvicorn running <span class="hljs-keyword">on</span> http:<span class="hljs-comment">//0.0.0.0:9999 (Press CTRL+C to quit)</span>
INFO:     Started reloader process [<span class="hljs-number">2071374</span>] <span class="hljs-keyword">using</span> WatchFiles
INFO:     Started server process [<span class="hljs-number">2071376</span>]
INFO:     Waiting <span class="hljs-keyword">for</span> application startup.
INFO:     Application startup complete.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Nextjs-Frontend" class="common-anchor-header">Next.js 프런트엔드</h3><p>프런트엔드는 사용자의 쿼리를 FastAPI 엔드포인트로 전송하고 응답을 렌더링합니다. 핵심 가져오기 로직입니다:</p>
<p>javascript</p>
<pre><code translate="no">   <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;http://localhost:9999/chat&#x27;</span>, {
        <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
        <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
        <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ <span class="hljs-attr">query</span>: input }),
      });

      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: data.<span class="hljs-property">answer</span> || <span class="hljs-string">&#x27;No response&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, userMessage, botMessage]);
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error);
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Error connecting to server.&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, botMessage]);
    } <span class="hljs-keyword">finally</span> {
      <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>);
    }
<button class="copy-code-btn"></button></code></pre>
<p>프런트엔드를 시작합니다:</p>
<pre><code translate="no">pnpm run dev -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

&gt; rag-chatbot@<span class="hljs-number">0.1</span><span class="hljs-number">.0</span> dev /home/xiaomage/milvus/chatbot-web/rag-chatbot
&gt; next dev --turbopack -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

   ▲ <span class="hljs-title class_">Next</span>.<span class="hljs-property">js</span> <span class="hljs-number">15.5</span><span class="hljs-number">.3</span> (<span class="hljs-title class_">Turbopack</span>)
   - <span class="hljs-title class_">Local</span>:        <span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
   - <span class="hljs-title class_">Network</span>:      <span class="hljs-attr">http</span>:<span class="hljs-comment">//0.0.0.0:3000</span>

 ✓ <span class="hljs-title class_">Starting</span>...
 ✓ <span class="hljs-title class_">Ready</span> <span class="hljs-keyword">in</span> 1288ms
<button class="copy-code-btn"></button></code></pre>
<p>브라우저에서 <code translate="no">http://&lt;ip&gt;:3000/chat</code> 을 엽니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_1_0832811fc8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
질문을 입력합니다:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>채팅 인터페이스 응답::</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_4_91d679ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>챗봇이 완성되었습니다.</p>
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
    </button></h2><p>Milvus의 스토리지 백엔드에 대한 호기심에서 시작된 프로젝트가 제대로 작동하는 RAG 챗봇으로 완성되기까지 예상보다 짧은 시간이 걸렸습니다. 이 빌드에서 다루는 내용은 다음과 같습니다:</p>
<ul>
<li><strong><a href="http://milvus.io">Milvus</a></strong> <strong>+</strong> <strong>RustFS와 Docker Compose.</strong> Milvus는 기본 MinIO를 대체하는 객체 스토리지 백엔드로 RustFS를 사용하여 독립형 모드로 실행됩니다. 총 4개의 서비스: etcd, Milvus, RustFS, Attu.</li>
<li><strong>지식창고 벡터화.</strong> 80개의 마크다운 파일로 구성된 RustFS 문서가 청크화되고, 텍스트 임베딩 3-large로 임베딩되어 466개의 벡터로 Milvus에 저장됩니다.</li>
<li><strong>RAG 파이프라인.</strong> 쿼리 시 사용자의 질문은 동일한 방식으로 임베드되고, Milvus는 의미적으로 가장 유사한 3개의 청크를 검색하며, GPT-5는 해당 문서에 기반한 답변을 생성합니다.</li>
<li><strong>챗봇 UI.</strong> FastAPI는 파이프라인을 단일 POST 엔드포인트로 래핑하고, Next.js는 그 앞에 채팅 창을 배치합니다. 더 이상 터미널에 들러 질문할 필요가 없습니다.</li>
</ul>
<p>이 과정에서 제가 느낀 점을 몇 가지 말씀드리겠습니다:</p>
<ul>
<li><strong><a href="https://milvus.io/docs">Milvus의 문서는</a></strong> <strong>훌륭합니다.</strong> 특히 배포 섹션은 명확하고 완전하며 따라하기 쉽습니다.</li>
<li><strong><a href="https://rustfs.com/">RustFS는</a></strong> <strong>객체 스토리지 백엔드로서 작업하는 것이 즐겁습니다.</strong> MinIO에 도입하는 데 생각보다 많은 노력이 들지 않았습니다.</li>
<li><strong>Vibe 코딩은 스코프가 인수할 때까지 매우 빠릅니다.</strong> 한 가지 일이 계속 다른 일로 이어져 Milvus에서 RAG, 챗봇, "모든 것을 도커화해야 할지도 모르겠다"는 생각이 들었습니다. 요구 사항은 저절로 수렴되지 않습니다.</li>
<li><strong>디버깅은 읽는 것보다 더 많은 것을 가르쳐줍니다.</strong> 이 빌드에서 실패할 때마다 어떤 문서보다 빠르게 다음 섹션을 클릭할 수 있었습니다.</li>
</ul>
<p>이 빌드의 모든 코드는 <a href="https://github.com/majinghe/chatbot"></a> github<a href="https://github.com/majinghe/chatbot">.com/majinghe/chatbot에서</a> 확인할 수 있습니다. <a href="http://milvus.io">Milvus를</a> 직접 사용해보고 싶으시다면 <a href="https://milvus.io/docs/quickstart.md">빠른 시작을</a> 통해 시작해보세요. 빌드에 대해 이야기를 나누고 싶거나 예상치 못한 문제가 발생하면 <a href="https://milvus.io/slack">Milvus 슬랙에서</a> 저희를 찾아주세요. 보다 전문적인 대화를 나누고 싶으시다면 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">근무 시간에 시간을 예약하실</a> 수도 있습니다.</p>
