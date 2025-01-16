---
id: building-a-milvus-cluster-based-on-juicefs.md
title: JuiceFS란 무엇인가요?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: 클라우드 네이티브 환경을 위해 설계된 공유 파일 시스템인 JuiceFS를 기반으로 Milvus 클러스터를 구축하는 방법을 알아보세요.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>JuiceFS를 기반으로 Milvus 클러스터 구축하기</custom-h1><p>오픈소스 커뮤니티 간의 협업은 마법 같은 일입니다. 열정적이고 지적이며 창의적인 자원 봉사자들은 오픈소스 솔루션을 혁신적으로 유지할 뿐만 아니라, 서로 다른 도구를 흥미롭고 유용한 방식으로 결합하기 위해 노력합니다. 세계에서 가장 인기 있는 벡터 데이터베이스인 <a href="https://milvus.io/">Milvus와</a> 클라우드 네이티브 환경을 위해 설계된 공유 파일 시스템인 <a href="https://github.com/juicedata/juicefs">JuiceFS는</a> 각 오픈소스 커뮤니티에서 이러한 정신으로 뭉쳤습니다. 이 문서에서는 JuiceFS가 무엇인지, JuiceFS 공유 파일 스토리지를 기반으로 Milvus 클러스터를 구축하는 방법과 이 솔루션을 사용하여 사용자가 기대할 수 있는 성능에 대해 설명합니다.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>JuiceFS란 무엇인가요?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS는 Redis와 S3 위에 구축할 수 있는 고성능 오픈 소스 분산형 POSIX 파일 시스템입니다. 클라우드 네이티브 환경을 위해 설계되었으며 모든 유형의 데이터 관리, 분석, 아카이빙, 백업을 지원합니다. JuiceFS는 일반적으로 빅데이터 문제 해결, 인공 지능(AI) 애플리케이션 구축, 로그 수집에 사용됩니다. 또한 여러 클라이언트 간의 데이터 공유를 지원하며 Milvus에서 공유 스토리지로 바로 사용할 수 있습니다.</p>
<p>데이터와 해당 메타데이터가 각각 오브젝트 스토리지와 <a href="https://redis.io/">Redis에</a> 퍼시스턴트된 후, JuiceFS는 상태 비저장 미들웨어 역할을 합니다. 데이터 공유는 표준 파일 시스템 인터페이스를 통해 서로 다른 애플리케이션이 서로 원활하게 도킹할 수 있도록 함으로써 실현됩니다. JuiceFS는 메타데이터 저장을 위해 오픈 소스 인메모리 데이터 저장소인 Redis를 사용합니다. Redis는 원자성을 보장하고 고성능 메타데이터 작업을 제공하기 때문에 사용됩니다. 모든 데이터는 JuiceFS 클라이언트를 통해 객체 스토리지에 저장됩니다. 아키텍처 다이어그램은 다음과 같습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>JuiceFS를 기반으로 Milvus 클러스터 구축하기</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS로 구축된 Milvus 클러스터(아래 아키텍처 다이어그램 참조)는 클러스터 샤딩 미들웨어인 Mishards를 사용하여 업스트림 요청을 분할하여 하위 모듈로 요청을 캐스케이드하는 방식으로 작동합니다. 데이터를 삽입할 때, Mishards는 업스트림 요청을 Milvus 쓰기 노드에 할당하고, 이 노드는 새로 삽입된 데이터를 JuiceFS에 저장합니다. 데이터를 읽을 때, Mishards는 Milvus 읽기 노드를 통해 JuiceFS의 데이터를 메모리로 로드하여 처리한 다음 하위 서비스에서 결과를 수집하여 업스트림으로 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>밀버스-클러스터-구축-주스FS.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>1단계: MySQL 서비스 시작</strong></h3><p>클러스터의 <strong>아무</strong> 노드에서나 MySQL 서비스를 시작합니다. 자세한 내용은 <a href="https://milvus.io/docs/v1.1.0/data_manage.md">MySQL로 메타데이터 관리하기를</a> 참조하세요.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>2단계: JuiceFS 파일 시스템 만들기</strong></h3><p>데모 목적으로 미리 컴파일된 바이너리 JuiceFS 프로그램이 사용됩니다. 시스템에 맞는 <a href="https://github.com/juicedata/juicefs/releases">설치 패키지를</a> 다운로드하고 자세한 설치 지침은 JuiceFS <a href="https://github.com/juicedata/juicefs-quickstart">빠른 시작 가이드를</a> 참조하세요. JuiceFS 파일 시스템을 만들려면 먼저 메타데이터 저장용 Redis 데이터베이스를 설정합니다. 퍼블릭 클라우드 배포의 경우 애플리케이션과 동일한 클라우드에서 Redis 서비스를 호스팅하는 것이 좋습니다. 또한, JuiceFS용 오브젝트 스토리지를 설정합니다. 이 예에서는 Azure Blob Storage가 사용되었지만, JuiceFS는 거의 모든 개체 서비스를 지원합니다. 시나리오의 요구 사항에 가장 적합한 오브젝트 스토리지 서비스를 선택하세요.</p>
<p>Redis 서비스 및 오브젝트 스토리지를 구성한 후, 새 파일 시스템을 포맷하고 로컬 디렉터리에 JuiceFS를 마운트합니다:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Redis 서버가 로컬에서 실행되고 있지 않은 경우, localhost를 다음 주소로 바꿉니다: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>설치가 성공하면 JuiceFS는 공유 스토리지 페이지 <strong>/root/jfs를</strong> 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>설치 성공.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>3단계: Milvus 시작</strong></h3><p>클러스터의 모든 노드에 Milvus가 설치되어 있어야 하며, 각 Milvus 노드는 읽기 또는 쓰기 권한으로 구성되어야 합니다. Milvus 노드는 하나만 쓰기 노드로 구성할 수 있으며, 나머지는 읽기 노드로 설정해야 합니다. 먼저 Milvus 시스템 구성 파일 <strong>server_config.yaml에서</strong> <code translate="no">cluster</code> 및 <code translate="no">general</code> 섹션의 파라미터를 설정합니다:</p>
<p><strong>섹션</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>파라미터</strong></th><th style="text-align:left"><strong>설명</strong></th><th style="text-align:left"><strong>설정</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">클러스터 모드 활성화 여부</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvus 배포 역할</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>섹션</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>설치 과정에서 구성된 JuiceFS 공유 스토리지 경로는 <strong>/root/jfs/milvus/db로</strong> 설정됩니다.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>설치가 완료되면 Milvus를 시작하고 제대로 실행되는지 확인합니다. 마지막으로 클러스터의 <strong>모든</strong> 노드에서 Mishards 서비스를 시작합니다. 아래 이미지는 Mishards가 성공적으로 실행된 모습입니다. 자세한 내용은 GitHub <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">튜토리얼을</a> 참조하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>성능 벤치마크</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>공유 스토리지 솔루션은 일반적으로 NAS(네트워크 연결 스토리지) 시스템으로 구현됩니다. 일반적으로 사용되는 NAS 시스템 유형에는 NFS(네트워크 파일 시스템) 및 SMB(서버 메시지 블록)가 있습니다. 퍼블릭 클라우드 플랫폼은 일반적으로 이러한 프로토콜과 호환되는 관리형 스토리지 서비스(예: Amazon EFS(Elastic File System))를 제공합니다.</p>
<p>기존 NAS 시스템과 달리, JuiceFS는 모든 데이터 읽기 및 쓰기가 애플리케이션 측에서 직접 이루어지는 FUSE(Filesystem in Userspace)를 기반으로 구현되어 액세스 대기 시간을 더욱 단축합니다. 또한 데이터 압축 및 캐싱과 같이 다른 NAS 시스템에서는 찾아볼 수 없는 JuiceFS만의 고유한 기능도 있습니다.</p>
<p>벤치마크 테스트 결과, JuiceFS는 EFS에 비해 큰 장점이 있는 것으로 나타났습니다. 메타데이터 벤치마크(그림 1)에서 JuiceFS는 초당 입출력 작업 수(IOPS)가 EFS보다 최대 10배 더 높은 것으로 나타났습니다. 또한, I/O 처리량 벤치마크(그림 2)에서는 단일 작업 및 다중 작업 시나리오 모두에서 JuiceFS가 EFS보다 우수한 성능을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>성능-벤치마크-2.png</span> </span></p>
<p>또한 벤치마크 테스트에 따르면 첫 번째 쿼리 검색 시간, 즉 새로 삽입된 데이터를 디스크에서 메모리로 로드하는 데 걸리는 시간은 JuiceFS 기반 Milvus 클러스터의 경우 평균 0.032초에 불과하여 데이터가 디스크에서 메모리로 거의 즉각적으로 로드되는 것으로 나타났습니다. 이 테스트에서는 1~8초 간격으로 100k씩 일괄 삽입된 128차원 벡터 데이터 100만 행을 사용해 첫 번째 쿼리 검색 시간을 측정했습니다.</p>
<p>JuiceFS는 안정적이고 신뢰할 수 있는 공유 파일 스토리지 시스템으로, JuiceFS를 기반으로 구축된 Milvus 클러스터는 고성능과 유연한 저장 용량을 모두 제공합니다.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Milvus에 대해 자세히 알아보기</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 방대한 인공 지능 및 벡터 유사도 검색 애플리케이션을 구동할 수 있는 강력한 도구입니다. 이 프로젝트에 대해 자세히 알아보려면 다음 리소스를 확인하세요:</p>
<ul>
<li><a href="https://zilliz.com/blog">블로그</a> 읽기.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack의</a> 오픈 소스 커뮤니티와 교류하세요.</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> 세계에서 가장 인기 있는 벡터 데이터베이스를 사용하거나 기여하세요.</li>
<li>새로운 <a href="https://github.com/milvus-io/bootcamp">부트캠프를</a> 통해 AI 애플리케이션을 빠르게 테스트하고 배포하세요.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>작가 바이오-창지안 가오.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>작가 바이오-징징 지아.png</span> </span></p>
