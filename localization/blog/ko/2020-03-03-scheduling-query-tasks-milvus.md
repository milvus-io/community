---
id: scheduling-query-tasks-milvus.md
title: 배경
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: 무대 뒤의 작업
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Milvus가 쿼리 작업을 예약하는 방법</custom-h1><p>이 문서에서는 Milvus가 쿼리 작업을 예약하는 방법에 대해 설명합니다. 또한 Milvus 스케줄링 구현의 문제점, 해결 방법 및 향후 방향에 대해서도 설명합니다.</p>
<h2 id="Background" class="common-anchor-header">배경<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>대규모 벡터 검색 엔진에서 데이터 관리하기에서 벡터 유사도 검색은 고차원 공간에서 두 벡터 사이의 거리로 구현된다는 것을 알고 있습니다. 벡터 검색의 목표는 목표 벡터에 가장 가까운 K개의 벡터를 찾는 것입니다.</p>
<p>벡터 거리를 측정하는 방법에는 유클리드 거리와 같은 여러 가지가 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-유클리드 거리.png</span> </span></p>
<p>여기서 x와 y는 두 개의 벡터이고, n은 벡터의 차원입니다.</p>
<p>데이터 세트에서 가장 가까운 K개의 벡터를 찾으려면 대상 벡터와 검색할 데이터 세트의 모든 벡터 간에 유클리드 거리를 계산해야 합니다. 그런 다음 벡터를 거리별로 정렬하여 가장 가까운 벡터 K개를 얻습니다. 계산 작업은 데이터 세트의 크기에 정비례합니다. 데이터 세트가 클수록 쿼리에 더 많은 계산 작업이 필요합니다. 그래프 처리에 특화된 GPU는 필요한 컴퓨팅 성능을 제공하기 위해 많은 코어를 가지고 있습니다. 따라서 Milvus를 구현하는 동안 멀티 GPU 지원도 고려됩니다.</p>
<h2 id="Basic-concepts" class="common-anchor-header">기본 개념<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">데이터 블록(테이블 파일)</h3><p>대규모 데이터 검색에 대한 지원을 향상시키기 위해 Milvus의 데이터 저장소를 최적화했습니다. Milvus는 테이블의 데이터를 크기별로 여러 개의 데이터 블록으로 분할합니다. 밀버스는 벡터 검색 시 각 데이터 블록에서 벡터를 검색하고 그 결과를 병합합니다. 하나의 벡터 검색 작업은 N개의 독립적인 벡터 검색 작업(N은 데이터 블록의 수)과 N-1개의 결과 병합 작업으로 구성됩니다.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">작업 대기열(작업 테이블)</h3><p>각 리소스에는 리소스에 속한 작업을 기록하는 작업 배열이 있습니다. 각 작업은 시작, 로드 중, 로드됨, 실행 중, 실행 완료 등 다양한 상태를 갖습니다. 컴퓨팅 장치의 로더와 실행기는 동일한 작업 대기열을 공유합니다.</p>
<h3 id="Query-scheduling" class="common-anchor-header">쿼리 스케줄링</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-쿼리 스케줄링.png</span> </span></p>
<ol>
<li>Milvus 서버가 시작되면 Milvus는 <code translate="no">server_config.yaml</code> 구성 파일의 <code translate="no">gpu_resource_config</code> 매개 변수를 통해 해당 GpuResource를 시작합니다. DiskResource와 CpuResource는 여전히 <code translate="no">server_config.yaml</code> 에서 편집할 수 없습니다. GpuResource는 <code translate="no">search_resources</code> 와 <code translate="no">build_index_resources</code> 의 조합이며 다음 예제에서는 <code translate="no">{gpu0, gpu1}</code> 로 참조됩니다:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>Milvus가 요청을 받습니다. 테이블 메타데이터는 외부 데이터베이스에 저장되며, 단일 호스트의 경우 SQLite 또는 MySQl, 분산 호스트의 경우 MySQL입니다. 검색 요청을 받으면 Milvus는 테이블이 존재하는지, 차원이 일관성이 있는지 확인합니다. 그런 다음 Milvus는 테이블의 TableFile 목록을 읽습니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus는 SearchTask를 생성합니다. 각 TableFile의 계산은 독립적으로 수행되기 때문에 Milvus는 각 TableFile에 대해 SearchTask를 생성합니다. 작업 스케줄링의 기본 단위인 SearchTask에는 대상 벡터, 검색 매개변수 및 TableFile의 파일 이름이 포함됩니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>밀버스가 컴퓨팅 장치를 선택합니다. 검색 태스크가 계산을 수행하는 장치는 각 장치의 <strong>예상 완료</strong> 시간에 따라 달라집니다. <strong>예상 완료</strong> 시간은 현재 시간과 계산이 완료될 예상 시간 사이의 예상 간격을 지정합니다.</li>
</ol>
<p>예를 들어 검색 작업의 데이터 블록이 CPU 메모리에 로드되면 다음 검색 작업이 CPU 계산 작업 큐에서 대기 중이고 GPU 계산 작업 큐는 유휴 상태입니다. CPU의 <strong>예상 완료 시간은</strong> 이전 검색 작업과 현재 검색 작업의 예상 시간 비용의 합과 같습니다. GPU의 <strong>예상 완료 시간은</strong> 데이터 블록이 GPU에 로드되는 시간과 현재 검색 작업의 예상 시간 비용을 합한 값과 같습니다. 리소스에서 검색 태스크의 <strong>예상 완료 시간은</strong> 리소스에 있는 모든 검색 태스크의 평균 실행 시간과 같습니다. 그런 다음 Milvus는 <strong>예상 완료 시간이</strong> 가장 짧은 장치를 선택하고 해당 장치에 SearchTask를 할당합니다.</p>
<p>여기서는 GPU1의 <strong>예상 완료 시간이</strong> 더 짧다고 가정합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-추정 완료 시간 단축.png</span> </span></p>
<ol start="5">
<li><p>Milvus가 SearchTask를 DiskResource의 작업 대기열에 추가합니다.</p></li>
<li><p>Milvus가 SearchTask를 CpuResource의 작업 대기열로 이동합니다. CpuResource의 로딩 스레드는 작업 대기열에서 각 작업을 순차적으로 로드합니다. CpuResource는 해당 데이터 블록을 CPU 메모리로 읽습니다.</p></li>
<li><p>Milvus는 SearchTask를 GpuResource로 이동합니다. GpuResource의 로딩 스레드가 CPU 메모리에서 GPU 메모리로 데이터를 복사합니다. GpuResource는 해당 데이터 블록을 GPU 메모리로 읽습니다.</p></li>
<li><p>밀버스는 GpuResource에서 SearchTask를 실행합니다. SearchTask의 결과는 상대적으로 작기 때문에 CPU 메모리로 직접 반환됩니다.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>밀버스는 SearchTask의 결과를 전체 검색 결과에 병합합니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>모든 SearchTask가 완료되면 Milvus는 전체 검색 결과를 클라이언트에 반환합니다.</p>
<h2 id="Index-building" class="common-anchor-header">색인 구축<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>인덱스 구축은 기본적으로 병합 프로세스가 없는 검색 프로세스와 동일합니다. 이에 대해서는 자세히 설명하지 않겠습니다.</p>
<h2 id="Performance-optimization" class="common-anchor-header">성능 최적화<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">캐시</h3><p>앞서 언급했듯이 데이터 블록은 계산 전에 CPU 메모리 또는 GPU 메모리와 같은 해당 저장 장치에 로드해야 합니다. 반복적인 데이터 로딩을 피하기 위해 Milvus는 LRU(최소 최근 사용) 캐시를 도입했습니다. 캐시가 가득 차면 새 데이터 블록이 오래된 데이터 블록을 밀어냅니다. 현재 메모리 크기에 따라 구성 파일로 캐시 크기를 사용자 지정할 수 있습니다. 데이터 로딩 시간을 효과적으로 절약하고 검색 성능을 개선하려면 검색 데이터를 저장하는 대용량 캐시를 사용하는 것이 좋습니다.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">데이터 로딩 및 계산 중복</h3><p>캐시만으로는 더 나은 검색 성능에 대한 요구를 충족시킬 수 없습니다. 메모리가 부족하거나 데이터 세트의 크기가 너무 크면 데이터를 다시 로드해야 합니다. 데이터 로딩이 검색 성능에 미치는 영향을 줄여야 합니다. 디스크에서 CPU 메모리로 또는 CPU 메모리에서 GPU 메모리로 데이터를 로드하는 것은 IO 작업에 속하며 프로세서의 계산 작업은 거의 필요하지 않습니다. 따라서 더 나은 리소스 사용을 위해 데이터 로딩과 계산을 병렬로 수행하는 것을 고려합니다.</p>
<p>데이터 블록에 대한 연산을 3단계(디스크에서 CPU 메모리로 로드, CPU 연산, 결과 병합) 또는 4단계(디스크에서 CPU 메모리로 로드, CPU 메모리에서 GPU 메모리로 로드, GPU 연산 및 결과 검색, 결과 병합)로 나눕니다. 3단계 계산을 예로 들면, 3단계를 담당하는 3개의 스레드를 실행하여 명령어 파이프라인으로 작동할 수 있습니다. 결과 집합이 대부분 작기 때문에 결과 병합에 많은 시간이 걸리지 않습니다. 경우에 따라 데이터 로딩과 계산이 겹치면 검색 시간을 1/2로 줄일 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">문제점 및 해결 방법<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">다른 전송 속도</h3><p>이전에는 Milvus가 멀티 GPU 작업 스케줄링에 라운드 로빈 전략을 사용했습니다. 이 전략은 4-GPU 서버에서 완벽하게 작동했으며 검색 성능이 4배 향상되었습니다. 하지만 2-GPU 호스트의 경우 성능이 2배 이상 향상되지 않았습니다. 몇 가지 실험을 해본 결과, 한 GPU의 데이터 복사 속도는 11GB/s였습니다. 그러나 다른 GPU의 경우 3GB/s였습니다. 메인보드 설명서를 참조한 결과, 메인보드는 PCIe x16을 통해 한 GPU에 연결되고 다른 GPU는 PCIe x4를 통해 연결된다는 것을 확인했습니다. 즉, 이 GPU들은 서로 다른 복사 속도를 가지고 있습니다. 나중에 각 검색 작업에 대한 최적의 장치를 측정하기 위해 복사 시간을 추가했습니다.</p>
<h2 id="Future-work" class="common-anchor-header">향후 작업<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">복잡성이 증가한 하드웨어 환경</h3><p>실제 환경에서는 하드웨어 환경이 더 복잡할 수 있습니다. 여러 개의 CPU, NUMA 아키텍처의 메모리, NV링크, NV스위치가 있는 하드웨어 환경의 경우 CPU/GPU 간의 통신은 최적화를 위한 많은 기회를 가져다줍니다.</p>
<p>쿼리 최적화</p>
<p>실험 중에 성능 향상을 위한 몇 가지 기회를 발견했습니다. 예를 들어, 서버가 동일한 테이블에 대한 여러 쿼리를 수신할 때 일부 조건에서 쿼리를 병합할 수 있습니다. 데이터 로컬리티를 사용하면 성능을 개선할 수 있습니다. 이러한 최적화는 향후 개발 과정에서 구현될 예정입니다. 이제 단일 호스트, 다중 GPU 시나리오에서 쿼리가 어떻게 예약되고 수행되는지 알게 되었습니다. 다음 글에서 Milvus의 내부 메커니즘을 계속 소개할 예정입니다.</p>
