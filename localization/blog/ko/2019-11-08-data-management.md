---
id: 2019-11-08-data-management.md
title: Milvus에서 데이터 관리 방법
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: 이 게시물에서는 Milvus의 데이터 관리 전략을 소개합니다.
cover: null
tag: Engineering
origin: null
---
<custom-h1>대규모 벡터 검색 엔진에서 데이터 관리하기</custom-h1><blockquote>
<p>저자 저자: 이화 모</p>
<p>날짜: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Milvus에서 데이터 관리 방법<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 Milvus의 기본 개념에 대해 알아보겠습니다:</p>
<ul>
<li>테이블: 테이블은 벡터의 데이터 집합으로, 각 벡터에는 고유한 ID가 있습니다. 각 벡터와 그 ID는 테이블의 한 행을 나타냅니다. 테이블의 모든 벡터는 동일한 차원을 가져야 합니다. 아래는 10차원 벡터가 포함된 테이블의 예입니다:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>table</span> </span></p>
<ul>
<li>인덱스: 인덱스 구축은 특정 알고리즘에 의해 벡터를 클러스터링하는 과정으로, 추가 디스크 공간이 필요합니다. 일부 인덱스 유형은 벡터를 단순화하고 압축하기 때문에 더 적은 공간을 필요로 하는 반면, 일부 다른 유형은 원시 벡터보다 더 많은 공간을 필요로 합니다.</li>
</ul>
<p>Milvus에서 사용자는 테이블 생성, 벡터 삽입, 인덱스 구축, 벡터 검색, 테이블 정보 검색, 테이블 삭제, 테이블의 일부 데이터 제거, 인덱스 제거 등과 같은 작업을 수행할 수 있습니다.</p>
<p>1억 개의 512차원 벡터가 있고, 효율적인 벡터 검색을 위해 Milvus에서 이를 삽입하고 관리해야 한다고 가정해 보겠습니다.</p>
<p><strong>(1) 벡터 삽입</strong></p>
<p>Milvus에 벡터를 삽입하는 방법을 살펴보겠습니다.</p>
<p>벡터 하나당 2KB의 공간을 차지하므로 1억 개의 벡터를 저장하려면 최소 200GB의 저장 공간이 필요하므로 이 모든 벡터를 한 번에 삽입하는 것은 현실적으로 불가능합니다. 하나의 데이터 파일이 아닌 여러 개의 데이터 파일이 필요합니다. 삽입 성능은 핵심 성과 지표 중 하나입니다. Milvus는 수백 또는 수만 개의 벡터를 한 번에 삽입할 수 있도록 지원합니다. 예를 들어, 512차원 벡터 3만 개를 한 번에 삽입하는 데 일반적으로 1초밖에 걸리지 않습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>삽입</span> </span></p>
<p>모든 벡터 삽입이 디스크에 로드되는 것은 아닙니다. Milvus는 생성되는 모든 테이블에 대해 CPU 메모리에 변경 가능한 버퍼를 예약하여 삽입된 데이터를 빠르게 쓸 수 있도록 합니다. 그리고 변경 가능한 버퍼의 데이터가 특정 크기에 도달하면 이 공간은 변경 불가능한 것으로 표시됩니다. 그 동안 새로운 변경 가능한 버퍼가 예약됩니다. 변경 불가능한 버퍼의 데이터는 정기적으로 디스크에 쓰여지고 해당 CPU 메모리가 확보됩니다. 디스크에 정기적으로 쓰는 메커니즘은 1초마다 버퍼링된 데이터를 디스크에 쓰는 Elasticsearch에서 사용되는 메커니즘과 유사합니다. 또한 LevelDB/RocksDB에 익숙한 사용자라면 여기에서 MemTable과 어느 정도 유사하다는 것을 알 수 있습니다.</p>
<p>데이터 삽입 메커니즘의 목표는 다음과 같습니다:</p>
<ul>
<li>데이터 삽입은 효율적이어야 합니다.</li>
<li>삽입된 데이터는 즉시 사용할 수 있어야 합니다.</li>
<li>데이터 파일이 너무 조각화되어서는 안 됩니다.</li>
</ul>
<p><strong>(2) 원시 데이터 파일</strong></p>
<p>벡터가 디스크에 기록되면 원시 벡터가 포함된 원시 데이터 파일에 저장됩니다. 앞서 언급했듯이 대규모 벡터는 여러 개의 데이터 파일에 저장하고 관리해야 합니다. 사용자가 한 번에 10개 또는 100만 개의 벡터를 삽입할 수 있으므로 삽입되는 데이터 크기는 다양합니다. 하지만 디스크에 쓰는 작업은 1초에 한 번씩 실행됩니다. 따라서 다양한 크기의 데이터 파일이 생성됩니다.</p>
<p>조각난 데이터 파일은 벡터 검색을 위해 관리하기 편리하지도 않고 접근하기도 쉽지 않습니다. Milvus는 병합된 파일 크기가 특정 크기(예: 1GB)에 도달할 때까지 이러한 작은 데이터 파일을 지속적으로 병합합니다. 이 특정 크기는 테이블 생성의 API 매개변수 <code translate="no">index_file_size</code> 에서 설정할 수 있습니다. 따라서 1억 개의 512차원 벡터가 약 200개의 데이터 파일에 분산 저장됩니다.</p>
<p>벡터를 동시에 삽입하고 검색하는 증분 계산 시나리오를 고려할 때, 벡터가 디스크에 기록되면 검색에 사용할 수 있는지 확인해야 합니다. 따라서 작은 데이터 파일은 병합되기 전에 액세스하고 검색할 수 있습니다. 병합이 완료되면 작은 데이터 파일은 제거되고 대신 새로 병합된 파일이 검색에 사용됩니다.</p>
<p>다음은 병합 전의 쿼리된 파일 모습입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>병합 후 쿼리된 파일</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) 인덱스 파일</strong></p>
<p>원시 데이터 파일을 기반으로 하는 검색은 쿼리 벡터와 원본 벡터 사이의 거리를 비교하여 가장 가까운 k개의 벡터를 계산하는 무차별 대입 검색입니다. 무차별 대입 검색은 비효율적입니다. 벡터가 색인된 인덱스 파일을 기반으로 검색하면 검색 효율을 크게 높일 수 있습니다. 인덱스를 구축하려면 추가 디스크 공간이 필요하며 일반적으로 시간이 많이 걸립니다.</p>
<p>그렇다면 원시 데이터 파일과 인덱스 파일의 차이점은 무엇일까요? 간단히 말해, 원시 데이터 파일은 모든 단일 벡터를 고유 ID와 함께 기록하는 반면, 인덱스 파일은 인덱스 유형, 클러스터 중심, 각 클러스터의 벡터와 같은 벡터 클러스터링 결과를 기록합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>인덱스 파일</span> </span></p>
<p>일반적으로 인덱스 파일은 원시 데이터 파일보다 더 많은 정보를 포함하지만, 인덱스 구축 과정에서 벡터가 단순화되고 정량화되기 때문에 파일 크기는 훨씬 작습니다(특정 인덱스 유형의 경우).</p>
<p>새로 생성된 테이블은 기본적으로 무차별 연산으로 검색됩니다. 시스템에서 인덱스가 생성되면, Milvus는 독립형 스레드에서 1GB 크기에 도달하는 병합 파일에 대한 인덱스를 자동으로 구축합니다. 인덱스 구축이 완료되면 새 인덱스 파일이 생성됩니다. 원시 데이터 파일은 다른 인덱스 유형에 따라 인덱스 구축을 위해 보관됩니다.</p>
<p>Milvus는 1GB에 도달하는 파일에 대해 자동으로 인덱스를 구축합니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>인덱스 빌드가 완료되었습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>1GB에 도달하지 않는 원시 데이터 파일에 대해서는 인덱스가 자동으로 생성되지 않으므로 검색 속도가 느려질 수 있습니다. 이러한 상황을 방지하려면 이 테이블에 대해 인덱스를 수동으로 강제로 빌드해야 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>강제 구축</span> </span></p>
<p>파일에 대한 인덱스가 강제로 빌드되면 검색 성능이 크게 향상됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) 메타 데이터</strong></p>
<p>앞서 언급했듯이 1억 개의 512차원 벡터가 200개의 디스크 파일에 저장되어 있습니다. 이 벡터에 대한 인덱스가 구축되면 200개의 인덱스 파일이 추가로 생성되어 총 파일 수는 400개(디스크 파일과 인덱스 파일 모두 포함)가 됩니다. 파일 상태를 확인하고, 파일을 제거하거나 생성하려면 이러한 파일의 메타 데이터(파일 상태 및 기타 정보)를 관리할 수 있는 효율적인 메커니즘이 필요합니다.</p>
<p>이러한 정보를 관리하려면 OLTP 데이터베이스를 사용하는 것이 좋습니다. 독립형 Milvus는 SQLite를 사용하여 메타 데이터를 관리하지만, 분산 배포의 경우 Milvus는 MySQL을 사용합니다. Milvus 서버가 시작되면 2개의 테이블(즉, 'Tables' 및 'TableFiles')이 각각 SQLite/MySQL에 생성됩니다. 'Tables'에는 테이블 정보가, 'TableFiles'에는 데이터 파일과 인덱스 파일의 정보가 기록됩니다.</p>
<p>아래 순서도와 같이 'Tables'에는 테이블 이름(table_id), 벡터 차원(dimension), 테이블 생성 날짜(created_on), 테이블 상태(state), 인덱스 유형(engine_type), 벡터 클러스터 수(nlist), 거리 계산 방식(metric_type) 등의 메타 데이터 정보가 들어 있습니다.</p>
<p>그리고 'TableFiles'에는 파일이 속한 테이블 이름(table_id), 파일의 인덱스 유형(engine_type), 파일 이름(file_id), 파일 유형(file_type), 파일 크기(file_size), 행 수(row_count), 파일 생성 날짜(created_on)가 포함됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>메타데이터</span> </span></p>
<p>이러한 메타 데이터를 통해 다양한 작업을 실행할 수 있습니다. 다음은 몇 가지 예시입니다:</p>
<ul>
<li>테이블을 생성하려면 메타 매니저에서 SQL 문만 실행하면 됩니다: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>table_2에 대한 벡터 검색을 실행하기 위해 메타 매니저는 사실상의 SQL 문인 SQLite/MySQL에서 쿼리( <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> )를 실행하여 table_2의 파일 정보를 검색합니다. 그런 다음 쿼리 스케줄러가 검색 연산을 위해 이 파일을 메모리에 로드합니다.</li>
<li>테이블에 쿼리가 실행 중일 수 있으므로 테이블을 즉시 삭제할 수 없습니다. 그렇기 때문에 테이블에 소프트 삭제와 하드 삭제가 있습니다. 테이블을 삭제하면 '소프트 삭제'로 레이블이 지정되고 더 이상의 쿼리나 변경이 허용되지 않습니다. 그러나 삭제 전에 실행 중이던 쿼리는 계속 진행됩니다. 이러한 모든 삭제 전 쿼리가 완료되어야만 메타 데이터 및 관련 파일과 함께 테이블이 영구적으로 하드 삭제됩니다.</li>
</ul>
<p><strong>(5) 쿼리 스케줄러</strong></p>
<p>아래 차트는 가장 유사한 벡터를 찾기 위해 디스크, CPU 메모리 및 GPU 메모리에 복사 및 저장된 파일(원시 데이터 파일 및 인덱스 파일)을 쿼리하여 CPU와 GPU 모두에서 벡터를 검색하는 과정을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>쿼리 스케줄링 알고리즘은 시스템 성능을 크게 향상시킵니다. 기본 설계 철학은 하드웨어 리소스의 최대 활용을 통해 최고의 검색 성능을 달성하는 것입니다. 아래는 쿼리 스케줄러에 대한 간략한 설명이며 향후 이 주제에 대한 전용 문서가 있을 예정입니다.</p>
<p>주어진 테이블에 대한 첫 번째 쿼리를 '콜드' 쿼리, 후속 쿼리를 '웜' 쿼리라고 부릅니다. 주어진 테이블에 대해 첫 번째 쿼리를 수행하면 Milvus는 데이터를 CPU 메모리로 로드하고 일부 데이터를 GPU 메모리로 로드하기 위해 많은 작업을 수행하므로 시간이 많이 소요됩니다. 추가 쿼리에서는 데이터의 일부 또는 전부가 이미 CPU 메모리에 있으므로 디스크에서 읽는 시간이 절약되므로 검색 속도가 훨씬 빨라집니다.</p>
<p>첫 번째 쿼리의 검색 시간을 단축하기 위해 Milvus는 서버 시작 시 테이블을 CPU 메모리에 자동으로 미리 로드할 수 있는 테이블 사전 로드(<code translate="no">preload_table</code>) 구성을 제공합니다. 1억 개의 512차원 벡터가 포함된 테이블의 경우, 200GB인 경우 이 모든 데이터를 저장하기에 충분한 CPU 메모리가 있는 경우 검색 속도가 가장 빠릅니다. 그러나 테이블에 10억 규모의 벡터가 포함된 경우, 쿼리되지 않은 새로운 데이터를 추가하기 위해 CPU/GPU 메모리를 확보하는 것이 불가피한 경우가 있습니다. 현재 우리는 데이터 대체 전략으로 LRU(최근 사용량)를 사용합니다.</p>
<p>아래 차트와 같이 디스크에 6개의 인덱스 파일이 저장된 테이블이 있다고 가정해 보겠습니다. CPU 메모리는 3개의 인덱스 파일만 저장할 수 있고, GPU 메모리는 1개의 인덱스 파일만 저장할 수 있습니다.</p>
<p>검색이 시작되면 쿼리를 위해 3개의 인덱스 파일이 CPU 메모리에 로드됩니다. 첫 번째 파일은 쿼리 직후 CPU 메모리에서 해제됩니다. 한편, 네 번째 파일은 CPU 메모리에 로드됩니다. 같은 방식으로 GPU 메모리에서 파일이 쿼리되면 즉시 해제되고 새 파일로 대체됩니다.</p>
<p>쿼리 스케줄러는 주로 두 세트의 작업 대기열을 처리하는데, 한 대기열은 데이터 로딩에 관한 것이고 다른 대기열은 검색 실행에 관한 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>쿼리 스케줄러</span> </span></p>
<p><strong>(6) 결과 감소기</strong></p>
<p>벡터 검색과 관련된 두 가지 주요 매개변수가 있는데, 하나는 대상 벡터의 개수를 의미하는 'n'이고 다른 하나는 가장 유사한 상위 k개의 벡터를 의미하는 'k'입니다. 실제로 검색 결과는 각각 키-값 쌍이 k쌍인 KVP(키-값 쌍)의 n개 집합입니다. 원시 데이터 파일이든 인덱스 파일이든 각각의 개별 파일에 대해 쿼리를 실행해야 하므로, 각 파일에 대해 상위 k개의 결과 세트가 검색됩니다. 이러한 모든 결과 집합을 병합하여 테이블의 상위 k 결과 집합을 얻습니다.</p>
<p>아래 예는 4개의 인덱스 파일(n=2, k=3)이 있는 테이블에 대한 벡터 검색에서 결과 세트가 어떻게 병합되고 축소되는지를 보여줍니다. 각 결과 세트에는 2개의 열이 있습니다. 왼쪽 열은 벡터 ID를 나타내고 오른쪽 열은 유클리드 거리를 나타냅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>결과</span> </span></p>
<p><strong>(7) 향후 최적화</strong></p>
<p>다음은 데이터 관리의 가능한 최적화에 대한 몇 가지 생각입니다.</p>
<ul>
<li>불변 버퍼나 변경 가능한 버퍼에 있는 데이터도 즉시 조회할 수 있다면 어떨까요? 현재 변경 불가능한 버퍼의 데이터는 디스크에 기록될 때까지는 쿼리할 수 없습니다. 일부 사용자는 데이터를 삽입한 후 즉시 액세스하는 데 더 관심이 있습니다.</li>
<li>사용자가 매우 큰 테이블을 작은 파티션으로 나누고 주어진 파티션에 대해 벡터 검색을 실행할 수 있는 테이블 파티셔닝 기능을 제공하세요.</li>
<li>필터링할 수 있는 일부 속성을 벡터에 추가합니다. 예를 들어, 일부 사용자는 특정 속성을 가진 벡터 중에서만 검색하고자 합니다. 벡터 속성과 원시 벡터까지 검색해야 하는 경우도 있습니다. 한 가지 가능한 접근 방식은 RocksDB와 같은 KV 데이터베이스를 사용하는 것입니다.</li>
<li>오래된 데이터를 다른 저장 공간으로 자동 마이그레이션할 수 있는 데이터 마이그레이션 기능을 제공하세요. 데이터가 항상 유입되는 일부 시나리오의 경우, 데이터가 노후화될 수 있습니다. 일부 사용자는 가장 최근 달의 데이터에만 관심을 갖고 검색을 실행하기 때문에 오래된 데이터는 유용성은 떨어지지만 디스크 공간을 많이 소모하게 됩니다. 데이터 마이그레이션 메커니즘은 새로운 데이터를 위한 디스크 공간을 확보하는 데 도움이 됩니다.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글에서는 주로 Milvus의 데이터 관리 전략을 소개합니다. Milvus 분산 배포, 벡터 인덱싱 방법 선택, 쿼리 스케줄러에 대한 더 많은 글이 곧 추가될 예정입니다. 기대해 주세요!</p>
<h2 id="Related-blogs" class="common-anchor-header">관련 블로그<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 메타데이터 관리 (1): 메타데이터를 보는 방법</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus 메타데이터 관리 (2): 메타데이터 테이블의 필드</a></li>
</ul>
