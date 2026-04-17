---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: 'Milvus 업그레이드 후 검색 속도 저하 문제 해결: WPS 팀의 교훈'
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  Milvus를 2.2에서 2.5로 업그레이드한 후 WPS 팀은 3~5배의 검색 지연 시간 회귀를 경험했습니다. 원인은 세그먼트를 조각화한
  단일 Milvus 백업 복원 플래그였습니다.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>이 게시물은 추천 시스템에서 Milvus를 사용하는 Kingsoft Office Software의 WPS 엔지니어링 팀에서 제공한 글입니다. Milvus 2.2.16에서 2.5.16으로 업그레이드하는 동안 검색 지연 시간이 3배에서 5배까지 증가했습니다. 이 문서에서는 이 문제를 조사하고 해결한 방법을 안내하며, 비슷한 업그레이드를 계획 중인 커뮤니티의 다른 사용자들에게 도움이 될 수 있습니다.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Milvus를 업그레이드한 이유<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>저희는 생산성 소프트웨어를 구축하는 WPS 엔지니어링 팀의 일원으로 온라인 추천 시스템에서 실시간 유사도 검색을 위한 벡터 검색 엔진으로 Milvus를 사용하고 있습니다. 우리의 프로덕션 클러스터에는 평균 768개의 차원으로 수천만 개의 벡터가 저장되어 있습니다. 데이터는 16개의 쿼리 노드에서 제공되었으며, 각 포드는 16개의 CPU 코어와 48GB의 메모리로 제한되어 구성되었습니다.</p>
<p>Milvus 2.2.16을 실행하는 동안 이미 비즈니스에 영향을 미치고 있는 심각한 안정성 문제가 발생했습니다. 쿼리 동시성이 높을 때 <code translate="no">planparserv2.HandleCompare</code> 에서 널 포인터 예외가 발생하여 프록시 구성 요소가 패닉 상태에 빠지고 자주 다시 시작될 수 있었습니다. 이 버그는 동시 접속자가 많은 시나리오에서 매우 쉽게 트리거되었으며 온라인 추천 서비스의 가용성에 직접적인 영향을 미쳤습니다.</p>
<p>아래는 이 인시던트의 실제 프록시 오류 로그와 스택 추적입니다:</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>스택 추적이 보여주는 내용</strong>: 패닉은 Proxy에서 쿼리 전처리 중 <code translate="no">queryTask.PreExecute</code> 내에서 발생했습니다. 호출 경로는 다음과 같습니다:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p><code translate="no">HandleCompare</code> 이 주소 <code translate="no">0x8</code> 에서 잘못된 메모리에 액세스하려고 시도하여 SIGSEGV를 트리거하고 Proxy 프로세스가 충돌하면서 충돌이 발생했습니다.</p>
<p><strong>이러한 안정성 위험을 완전히 제거하기 위해 Milvus 2.2.16에서 2.5.16으로 클러스터를 업그레이드하기로 결정했습니다.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">업그레이드 전에 milvus-backup으로 데이터 백업하기<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 클러스터에 손을 대기 전에 공식 <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a> 도구를 사용하여 모든 것을 백업했습니다. 이 도구는 동일한 클러스터 내, 클러스터 간, Milvus 버전 간 백업 및 복원을 지원합니다.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">버전 호환성 확인</h3><p>milvus-backup에는 <a href="https://milvus.io/docs/milvus_backup_overview.md">버전 간 복원에</a> 대한 두 가지 버전 규칙이 있습니다:</p>
<ol>
<li><p><strong>대상 클러스터는 동일한 Milvus 버전 또는 최신 버전을 실행해야 합니다.</strong> 2.2의 백업은 2.5로 로드할 수 있지만 그 반대는 불가능합니다.</p></li>
<li><p><strong>대상은 Milvus 2.4 이상이어야 합니다.</strong> 이전 복원 대상은 지원되지 않습니다.</p></li>
</ol>
<p>저희 경로(2.2.16에서 백업, 2.5.16에 로드)는 두 가지 규칙을 모두 충족했습니다.</p>
<table>
<thead>
<tr><th>다음에서 백업 ↓ \ 복원 대상 →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Milvus 백업 작동 방식</h3><p>Milvus 백업은 Milvus 인스턴스 전반에서 메타데이터, 세그먼트 및 데이터의 백업과 복원을 용이하게 합니다. 백업 및 복원 프로세스의 유연한 조작을 위해 CLI, API, gRPC 기반 Go 모듈과 같은 노스바운드 인터페이스를 제공합니다.</p>
<p>Milvus Backup은 소스 Milvus 인스턴스에서 컬렉션 메타데이터와 세그먼트를 읽어 백업을 생성합니다. 그런 다음 소스 Milvus 인스턴스의 루트 경로에서 컬렉션 데이터를 복사하여 백업 루트 경로에 저장합니다.</p>
<p>백업에서 복원하려면 Milvus 백업은 백업의 컬렉션 메타데이터 및 세그먼트 정보를 기반으로 대상 Milvus 인스턴스에 새 컬렉션을 만듭니다. 그런 다음 백업 루트 경로에서 대상 인스턴스의 루트 경로로 백업 데이터를 복사합니다.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">백업 실행</h3><p>전용 구성 파일인 <code translate="no">configs/backup.yaml</code> 을 준비했습니다. 주요 필드는 아래와 같으며 민감한 값은 제거되어 있습니다:</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 이 명령을 실행했습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> <strong>핫 백업은 핫 백업을</strong> 지원하므로 일반적으로 온라인 트래픽에 거의 영향을 미치지 않습니다. 리소스 경합을 피하려면 사용량이 많지 않은 시간에 실행하는 것이 더 안전합니다.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">백업 확인</h3><p>백업이 완료된 후 백업이 완료되고 사용 가능한지 확인했습니다. 주로 백업의 컬렉션 수와 세그먼트 수가 소스 클러스터의 컬렉션 수와 일치하는지 확인했습니다.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>일치했으므로 업그레이드로 넘어갔습니다.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">헬름 차트로 업그레이드하기<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>수천만 개의 벡터가 있는 세 가지 주요 버전(2.2 → 2.5)을 이동하는 것은 너무 위험했습니다. 대신 새 클러스터를 구축하고 데이터를 마이그레이션했습니다. 이전 클러스터는 롤백을 위해 온라인 상태를 유지했습니다.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">새 클러스터 배포</h3><p>헬름으로 새로운 Milvus 2.5.16 클러스터를 배포했습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">주요 구성 변경 (<code translate="no">values-v25.yaml</code>)</h3><p>성능 비교를 공정하게 하기 위해 새 클러스터를 가능한 한 이전 클러스터와 유사하게 유지했습니다. 이 워크로드에 중요한 몇 가지 설정만 변경했습니다:</p>
<ul>
<li><p><strong>Mmap 비활성화</strong> (<code translate="no">mmap.enabled: false</code>): 권장 워크로드는 지연 시간에 민감합니다. Mmap을 활성화하면 필요할 때 일부 데이터를 디스크에서 읽을 수 있으며, 이로 인해 디스크 I/O 지연이 추가되어 지연 시간이 급증할 수 있습니다. 데이터가 메모리에 완전히 유지되고 쿼리 지연 시간이 더 안정적으로 유지되도록 이 기능을 해제했습니다.</p></li>
<li><p><strong>쿼리 노드 수:</strong> 이전 클러스터와 동일하게 <strong>16개로</strong> 유지됨.</p></li>
<li><p><strong>리소스 제한:</strong> 각 파드에는 여전히 이전 클러스터와 동일하게 <strong>16개의 CPU 코어가</strong> 있습니다.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">메이저 버전 업그레이드를 위한 팁:</h3><ul>
<li><p><strong>기존 클러스터를 업그레이드하는 대신 새 클러스터를 구축한다.</strong> 메타데이터 호환성 위험을 피하고 깨끗한 롤백 경로를 유지할 수 있습니다.</p></li>
<li><p><strong>마이그레이션하기 전에 백업을 확인하세요.</strong> 데이터가 새 버전의 형식으로 바뀌면 쉽게 되돌릴 수 없습니다.</p></li>
<li><p><strong>전환하는 동안 두 클러스터를 모두 계속 실행하세요.</strong> 트래픽을 점진적으로 전환하고 완전히 확인된 후에만 이전 클러스터를 해제하세요.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Milvus-백업 복원을 사용하여 업그레이드 후 데이터 마이그레이션하기<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">milvus-backup restore</code> 을 사용하여 백업을 새 클러스터에 로드했습니다. 밀버스-백업의 용어에서 "복원"은 "백업 데이터를 대상 클러스터에 로드"하는 것을 의미합니다. 대상은 동일한 Milvus 버전 또는 최신 버전을 실행해야 하므로 이름과 상관없이 복원은 항상 데이터를 앞으로 이동합니다.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">복원 실행</h3><p>복원 구성 파일인 <code translate="no">configs/restore.yaml</code> 은 <strong>새 클러스터와</strong> 해당 <strong>클러스터의</strong> 스토리지 설정을 가리켜야 했습니다. 주요 필드는 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 실행했습니다:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> 복원된 데이터가 새 클러스터의 스토리지에 쓰여지도록 새 클러스터의 Milvus 및 MinIO 연결 정보가 필요합니다.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">복원 후 확인</h3><p>복원이 완료된 후 마이그레이션이 올바른지 확인하기 위해 다음 네 가지를 확인했습니다:</p>
<ul>
<li><p><strong>스키마.</strong> 새 클러스터의 컬렉션 스키마는 필드 정의 및 벡터 차원을 포함하여 이전 클러스터의 스키마와 정확히 일치해야 했습니다.</p></li>
<li><p><strong>총 행 수.</strong> 이전 클러스터와 새 클러스터의 총 엔티티 수를 비교하여 데이터가 손실되지 않았는지 확인했습니다.</p></li>
<li><p><strong>인덱스 상태.</strong> 모든 인덱스의 구축이 완료되었고 인덱스 상태가 <code translate="no">Finished</code> 로 설정되어 있는지 확인했습니다.</p></li>
<li><p><strong>쿼리 결과.</strong> 두 클러스터에서 동일한 쿼리를 실행하고 반환된 ID와 거리 점수를 비교하여 결과가 일치하는지 확인했습니다.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">점진적인 트래픽 이동과 지연 시간의 놀라움<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>프로덕션 트래픽을 단계적으로 새 클러스터로 옮겼습니다:</p>
<table>
<thead>
<tr><th>단계</th><th>트래픽 점유율</th><th>기간</th><th>관찰한 내용</th></tr>
</thead>
<tbody>
<tr><td>1단계</td><td>5%</td><td>24시간</td><td>P99 쿼리 지연 시간, 오류율 및 결과 정확도</td></tr>
<tr><td>2단계</td><td>25%</td><td>48시간</td><td>P99/P95 쿼리 지연 시간, QPS, CPU 사용량</td></tr>
<tr><td>3단계</td><td>50%</td><td>48시간</td><td>엔드투엔드 메트릭, 리소스 사용량</td></tr>
<tr><td>4단계</td><td>100%</td><td>지속적인 모니터링</td><td>전반적인 메트릭 안정성</td></tr>
</tbody>
</table>
<p>즉각적인 롤백을 위해 이전 클러스터를 계속 실행했습니다.</p>
<p><strong>이 롤백 중에 새로운 v2.5.16 클러스터의 검색 지연 시간이 기존 v2.2.16 클러스터보다 3~5배 더 길다는 문제를 발견했습니다.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">검색 속도 저하의 원인 찾기<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">1단계: 전체 CPU 사용량 확인</h3><p>클러스터의 리소스 부족 여부를 확인하기 위해 구성 요소별 CPU 사용량부터 시작했습니다.</p>
<table>
<thead>
<tr><th>구성 요소</th><th>CPU 사용량(코어)</th><th>분석</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>제한은 16코어였으므로 사용량은 약 63%였습니다. 완전히 사용되지 않음</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>매우 낮음</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>매우 낮음</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>매우 낮음</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>매우 낮음</td></tr>
</tbody>
</table>
<p>이는 QueryNode에 여전히 충분한 CPU가 있음을 보여줍니다. 따라서 속도 저하는 <strong>전체 CPU 부족으로 인한</strong> 것이 아닙니다.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">2단계: 쿼리 노드 잔량 확인</h3><p>전체 CPU는 괜찮아 보였지만 개별 쿼리 노드 파드에는 <strong>분명한 불균형이</strong> 있었습니다:</p>
<table>
<thead>
<tr><th>쿼리 노드 파드</th><th>CPU 사용량(마지막)</th><th>CPU 사용량(최대)</th></tr>
</thead>
<tbody>
<tr><td>쿼리노드-포드-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>쿼리노드-포드-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>쿼리노드-포드-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>쿼리노드-팟-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>쿼리노드-포드-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>쿼리노드-포드-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>쿼리노드-팟-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>쿼리노드-포드-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>쿼리노드-팟-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>포드-1은 포드-8보다 거의 5배나 많은 CPU를 사용했습니다. 이는 Milvus가 모든 쿼리 노드에 쿼리를 보내고 가장 느린 쿼리 노드가 완료될 때까지 기다리기 때문에 발생하는 문제입니다. 과부하가 걸린 몇 개의 파드가 모든 검색을 지연시키고 있었습니다.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">3단계: 세그먼트 분포 비교</h3><p>일반적으로 부하가 고르지 않다는 것은 데이터 분포가 고르지 않다는 것을 의미하므로 이전 클러스터와 새 클러스터 간의 세그먼트 레이아웃을 비교했습니다.</p>
<p><strong>v2.2.16 세그먼트 레이아웃(총 13개 세그먼트)</strong></p>
<table>
<thead>
<tr><th>행 수 범위</th><th>세그먼트 수</th><th>상태</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Sealed</td></tr>
<tr><td>533,630</td><td>1</td><td>Sealed</td></tr>
</tbody>
</table>
<p>이전 클러스터는 상당히 균등했습니다. 세그먼트는 13개에 불과했고, 대부분 약 <strong>74만 개의 행이</strong> 있었습니다.</p>
<p><strong>V2.5.16 세그먼트 레이아웃(총 21개 세그먼트)</strong></p>
<table>
<thead>
<tr><th>행 수 범위</th><th>세그먼트 수</th><th>상태</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Sealed</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Sealed</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Sealed</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Sealed</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Sealed</td></tr>
</tbody>
</table>
<p>새로운 클러스터는 매우 달라 보였습니다. 세그먼트 수가 21개(60% 증가)로, 세그먼트 크기가 다양한데, 어떤 세그먼트는 최대 68만 5,000행, 어떤 세그먼트는 겨우 35만 행에 불과했습니다. 복원 시 데이터가 고르지 않게 흩어져 있었습니다.</p>
<h3 id="Root-Cause" class="common-anchor-header">근본 원인</h3><p>원래 복원 명령으로 문제를 추적했습니다:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">--use_v2_restore</code> 플래그는 여러 세그먼트를 단일 복원 작업으로 그룹화하는 세그먼트 병합 복원 모드를 활성화합니다. 이 모드는 작은 세그먼트가 많은 경우 복원 속도를 높이도록 설계되었습니다.</p>
<p>그러나 버전 간 복원(2.2 → 2.5)에서는 v2 로직이 원래 클러스터와 다르게 세그먼트를 재구성하여 큰 세그먼트를 크기가 균일하지 않은 작은 세그먼트로 분할했습니다. 일단 로드되면, 일부 쿼리 노드는 다른 쿼리 노드보다 더 많은 데이터로 인해 멈췄습니다.</p>
<p>이로 인해 세 가지 방식으로 성능이 저하되었습니다:</p>
<ul>
<li><p><strong>핫 노드:</strong> 더 크거나 더 많은 세그먼트를 가진 쿼리 노드는 더 많은 작업을 수행해야 했습니다.</p></li>
<li><p>가장<strong>느린 노드 효과:</strong> 분산 쿼리 대기 시간은 가장 느린 노드에 따라 달라짐</p></li>
<li><p>병합<strong>오버헤드 증가:</strong> 세그먼트가 많을수록 결과를 병합할 때 더 많은 작업이 필요했습니다.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">수정 사항</h3><p><code translate="no">--use_v2_restore</code> 을 제거하고 기본 로직으로 복원했습니다:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>먼저 새 클러스터에서 잘못된 데이터를 정리한 다음 기본 복원을 실행했습니다. 세그먼트 분포가 균형을 되찾고 검색 지연 시간이 정상으로 돌아왔으며 문제가 사라졌습니다.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">다음번에는 다르게 처리할 것<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>이 사례에서는 실제 문제인 <strong>고르지 않은 세그먼트 분포를</strong> 찾는 데 너무 오랜 시간이 걸렸습니다. 다음과 같이 하면 더 빨리 찾을 수 있었을 것입니다.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">세그먼트 모니터링 개선</h3><p>Milvus는 표준 Grafana 대시보드에서 컬렉션당 세그먼트 수, 행 분포 또는 크기 분포를 노출하지 않습니다. <a href="https://github.com/zilliztech/attu">Attu와</a> etcd를 수동으로 파헤쳐야 했기 때문에 속도가 느렸습니다.</p>
<p>추가하면 도움이 될 것입니다:</p>
<ul>
<li><p>각 쿼리 노드가 로드한 세그먼트 수와 그 행 수 및 크기를 보여주는 Grafana의 <strong>세그먼트 분포 대시보드</strong> </p></li>
<li><p>노드 전반의 세그먼트 행 수가 임계값 이상으로 치우칠 때 트리거되는 <strong>불균형 경보</strong></p></li>
<li><p><strong>마이그레이션 비교 보기</strong>, 사용자가 업그레이드 후 이전 클러스터와 새 클러스터 간의 세그먼트 분포를 비교할 수 있습니다.</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">표준 마이그레이션 체크리스트 사용</h3><p>행 수를 확인한 결과 문제가 없다고 판단했습니다. 그것만으로는 충분하지 않았습니다. 마이그레이션 후 완전한 유효성 검사도 포함되어야 합니다:</p>
<ul>
<li><p><strong>스키마 일관성.</strong> 필드 정의와 벡터 차원이 일치하는가?</p></li>
<li><p><strong>세그먼트 수.</strong> 세그먼트 수가 급격하게 변경되지는 않았는지?</p></li>
<li><p><strong>세그먼트 잔액.</strong> 세그먼트 전반의 행 수가 합리적으로 균일한가요?</p></li>
<li><p><strong>인덱스 상태.</strong> 모든 인덱스가 <code translate="no">finished</code>?</p></li>
<li><p><strong>지연 시간 벤치마크.</strong> P50, P95 및 P99 쿼리 지연 시간이 이전 클러스터와 비슷하게 보이나요?</p></li>
<li><p><strong>로드 밸런스.</strong> 쿼리 노드의 CPU 사용량이 포드 간에 고르게 분산되어 있나요?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">자동화된 검사 추가</h3><p>이 유효성 검사를 PyMilvus로 스크립트화하여 프로덕션에 적용하기 전에 불균형을 포착할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">기존 도구 더 잘 활용하기</h3><p>몇 가지 도구는 이미 세그먼트 수준 진단을 지원합니다:</p>
<ul>
<li><p><strong>버드워처:</strong> Etcd 메타데이터를 직접 읽고 세그먼트 레이아웃과 채널 할당을 표시할 수 있습니다.</p></li>
<li><p><strong>Milvus 웹 UI(v2.5+):</strong> 세그먼트 정보를 시각적으로 검사할 수 있습니다.</p></li>
<li><p><strong>Grafana + Prometheus:</strong> 실시간 클러스터 모니터링을 위한 사용자 정의 대시보드 구축에 사용 가능</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Milvus 커뮤니티를 위한 제안 사항<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 몇 가지 변경하면 이러한 종류의 문제 해결이 더 쉬워질 것입니다:</p>
<ol>
<li><p><strong>매개변수 호환성에 대한 보다 명확한 설명</strong> <code translate="no">milvus-backup</code> 문서에 <code translate="no">--use_v2_restore</code> 같은 옵션이 버전 간 복원 중에 어떻게 작동하는지, 그리고 이로 인해 발생할 수 있는 위험을 명확하게 설명해야 합니다.</p></li>
<li><p><strong>복원 후 더 나은 확인 기능 추가</strong> <code translate="no">restore</code> 작업이 완료된<strong>후</strong>도구에서 세그먼트 분포에 대한 요약을 자동으로 인쇄해 주면 도움이 될 것입니다.</p></li>
<li><p><strong>잔액 관련 메트릭 노출프로메테우스</strong>메트릭에 세그먼트 잔액 정보가 포함되어 사용자가 직접 모니터링할 수 있어야 합니다.</p></li>
<li><p><strong>쿼리 계획 분석 지원MySQL</strong> <code translate="no">EXPLAIN</code> 과<strong>유사하게</strong>Milvus에는 쿼리가 실행되는 방식을 보여주고 성능 문제를 찾는 데 도움이 되는 도구가 있으면 유용할 것입니다.</p></li>
</ol>
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
    </button></h2><p>요약하자면</p>
<table>
<thead>
<tr><th>단계</th><th>도구/방법</th><th>키 포인트</th></tr>
</thead>
<tbody>
<tr><td>백업</td><td>밀버스-백업 생성</td><td>핫 백업이 지원되지만 백업은 신중하게 확인해야 합니다.</td></tr>
<tr><td>업그레이드</td><td>헬름으로 새 클러스터를 빌드한다.</td><td>Mmap을 비활성화하여 I/O 지터를 줄이고 리소스 설정을 이전 클러스터와 동일하게 유지한다.</td></tr>
<tr><td>마이그레이션</td><td>밀버스-백업 복원</td><td>use_v2_restore에 주의한다. 버전 간 복원에서는 명확하게 이해하지 않는 한 기본값이 아닌 로직을 사용하지 않는다.</td></tr>
<tr><td>회색 롤아웃</td><td>점진적인 트래픽 이동</td><td>단계적으로 트래픽을 이동합니다: 5% → 25% → 50% → 100%, 이전 클러스터는 롤백을 위한 준비 상태 유지</td></tr>
<tr><td>문제 해결</td><td>Grafana + 세그먼트 분석</td><td>CPU와 메모리만 보지 마세요. 세그먼트 잔액과 데이터 분포도 확인하세요.</td></tr>
<tr><td>수정</td><td>잘못된 데이터를 제거하고 다시 복원</td><td>잘못된 플래그를 제거하고 기본 로직으로 복원하면 성능이 정상으로 돌아옵니다.</td></tr>
</tbody>
</table>
<p>데이터를 마이그레이션할 때는 데이터가 존재하고 정확한지 여부만 고려할 것이 아니라 그 이상을 고려하는 것이 중요합니다. <strong>데이터가 어떻게</strong> <strong>배포되는지도</strong> 주의해야 합니다.</p>
<p>세그먼트 수와 세그먼트 크기는 Milvus가 쿼리 작업을 노드 간에 얼마나 균등하게 분배하는지를 결정합니다. 세그먼트가 불균형하면 소수의 노드가 대부분의 작업을 수행하게 되고 모든 검색이 이에 대한 비용을 지불하게 됩니다. 버전 간 업그레이드는 복원 프로세스가 원래 클러스터와 다르게 세그먼트를 재구축할 수 있기 때문에 추가적인 위험을 수반합니다. <code translate="no">--use_v2_restore</code> 같은 플래그는 행 수만으로는 표시되지 않는 방식으로 데이터를 조각화할 수 있습니다.</p>
<p>따라서 버전 간 마이그레이션에서 가장 안전한 접근 방식은 특별한 이유가 없는 한 기본 복원 설정을 그대로 사용하는 것입니다. 또한, 문제를 조기에 발견하려면 CPU와 메모리를 넘어 기본 데이터 레이아웃, 특히 세그먼트 분포와 균형에 대한 인사이트가 있어야 합니다.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Milvus 팀의 참고 사항<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>이 경험을 Milvus 커뮤니티와 공유해 주신 WPS 엔지니어링 팀에 감사의 말씀을 드립니다. 이와 같은 글은 실제 제작 과정에서 얻은 교훈을 포착하여 비슷한 문제에 직면한 다른 사람들에게 유용하기 때문에 가치가 있습니다.</p>
<p>팀에서 공유할 만한 기술 교훈, 문제 해결 사례 또는 실제 경험이 있다면 여러분의 의견을 듣고 싶습니다. <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 가입하여 문의해 주세요.</p>
<p>또한 자체적으로 문제를 해결하고 있다면 동일한 커뮤니티 채널을 통해 Milvus 엔지니어 및 다른 사용자와 소통할 수 있습니다. 백업 및 복원, 버전 간 업그레이드, 쿼리 성능에 대한 도움을 받으려면 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 업무 시간을</a> 통해 일대일 세션을 예약할 수도 있습니다.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
