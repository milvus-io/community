---
id: 2019-12-18-datafile-cleanup.md
title: 이전 삭제 전략 및 관련 문제
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: 쿼리 작업 관련 문제를 해결하기 위해 파일 삭제 전략을 개선했습니다.
cover: null
tag: Engineering
---
<custom-h1>데이터 파일 정리 메커니즘의 개선 사항</custom-h1><blockquote>
<p>작성자 Yihua Mo</p>
<p>날짜: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">이전 삭제 전략 및 관련 문제<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="/blog/ko/2019-11-08-data-management.md">대규모 벡터 검색 엔진에서 데이터 관리하기에서</a> 데이터 파일의 삭제 메커니즘에 대해 언급했습니다. 삭제에는 소프트 삭제와 하드 삭제가 있습니다. 테이블에서 삭제 작업을 수행한 후 테이블은 소프트 삭제로 표시됩니다. 그 이후의 검색 또는 업데이트 작업은 더 이상 허용되지 않습니다. 그러나 삭제 전에 시작되는 쿼리 작업은 계속 실행할 수 있습니다. 테이블은 쿼리 작업이 완료될 때만 메타데이터 및 기타 파일과 함께 실제로 삭제됩니다.</p>
<p>그렇다면 언제 소프트 삭제가 표시된 파일이 실제로 삭제될까요? 0.6.0 이전에는 5분 동안 소프트 삭제된 후 파일이 실제로 삭제되는 것이 전략이었습니다. 다음 그림은 이 전략을 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5분</span> </span></p>
<p>이 전략은 쿼리가 일반적으로 5분 이상 지속되지 않으며 신뢰할 수 없다는 전제를 기반으로 합니다. 쿼리가 5분 이상 지속되면 쿼리가 실패합니다. 그 이유는 쿼리가 시작되면 Milvus가 검색할 수 있는 파일에 대한 정보를 수집하고 쿼리 작업을 생성하기 때문입니다. 그런 다음 쿼리 스케줄러가 파일을 하나씩 메모리에 로드하고 파일을 하나씩 검색합니다. 파일을 로드할 때 파일이 더 이상 존재하지 않으면 쿼리가 실패합니다.</p>
<p>시간을 연장하면 쿼리 실패의 위험을 줄이는 데 도움이 될 수 있지만 디스크 사용량이 너무 많아지는 또 다른 문제가 발생할 수 있습니다. 그 이유는 대량의 벡터가 삽입될 때 Milvus는 데이터 파일을 계속 결합하고, 쿼리가 발생하지 않더라도 결합된 파일은 디스크에서 즉시 제거되지 않기 때문입니다. 데이터 삽입 속도가 너무 빠르거나 삽입된 데이터의 양이 너무 많으면 추가 디스크 사용량이 수십 GB에 달할 수 있습니다. 다음 그림을 예로 참조하세요:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>결과</span> </span></p>
<p>이전 그림에서와 같이 삽입된 데이터의 첫 번째 배치(insert_1)가 디스크로 플러시되어 file_1이 된 다음 insert_2가 file_2가 됩니다. 파일 결합을 담당하는 스레드는 파일을 file_3으로 결합합니다. 그런 다음 file_1과 file_2는 소프트 삭제로 표시됩니다. 세 번째 삽입 데이터 배치는 file_4가 됩니다. 이 스레드는 file_3과 file_4를 file_5로 결합하고 file_3과 file_4를 소프트 삭제로 표시합니다.</p>
<p>마찬가지로 insert_6과 insert_5도 결합됩니다. t3에서 file_5와 file_6은 소프트 삭제로 표시됩니다. t3과 t4 사이에는 많은 파일이 소프트 삭제로 표시되어 있지만 여전히 디스크에 남아 있습니다. 파일은 t4 이후에 실제로 삭제됩니다. 따라서 t3과 t4 사이의 디스크 사용량은 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836MB입니다. 삽입된 데이터는 64 + 64 + 64 + 64 = 256MB입니다. 디스크 사용량은 삽입된 데이터 크기의 3배입니다. 디스크의 쓰기 속도가 빠를수록 특정 기간 동안 디스크 사용량이 증가합니다.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">0.6.0에서 삭제 전략의 개선 사항<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>따라서 v0.6.0에서는 파일 삭제 전략을 변경했습니다. 하드 삭제는 더 이상 시간을 트리거로 사용하지 않습니다. 대신, 파일이 어떤 작업에서도 사용되지 않을 때가 트리거가 됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>새로운 전략</span> </span></p>
<p>두 개의 벡터 배치가 삽입되었다고 가정합니다. t1에서 쿼리 요청이 주어지면 Milvus는 쿼리할 두 개의 파일(file_3은 아직 존재하지 않으므로 file_1과 file_2)을 획득한 다음 백엔드 스레드는 동시에 실행되는 쿼리와 함께 두 파일을 결합하기 시작합니다. file_3이 생성되면 file_1과 file_2는 소프트 삭제로 표시됩니다. 쿼리 이후에는 다른 작업에서 file_1과 file_2를 사용하지 않으므로 t4에서 하드 삭제됩니다. t2와 t4 사이의 간격은 매우 작으며 쿼리 간격에 따라 달라집니다. 이런 식으로 사용하지 않는 파일은 제때에 제거됩니다.</p>
<p>내부 구현에서는 소프트웨어 엔지니어에게 익숙한 참조 카운팅을 사용하여 파일을 하드 삭제할 수 있는지 여부를 결정합니다. 비교를 통해 설명하자면, 플레이어가 게임에서 생명력을 가지고 있으면 계속 플레이할 수 있습니다. 생명 수가 0이 되면 게임이 종료됩니다. Milvus는 각 파일의 상태를 모니터링합니다. 파일이 작업에서 사용되면 파일에 수명이 추가됩니다. 파일이 더 이상 사용되지 않으면 파일에서 수명이 제거됩니다. 파일이 소프트 삭제로 표시되어 있고 수명이 0이면 해당 파일은 하드 삭제할 준비가 된 것입니다.</p>
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
<li><a href="/blog/ko/2019-11-08-data-management.md">대규모 벡터 검색 엔진에서 데이터 관리하기</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus 메타데이터 관리 (1): 메타데이터를 보는 방법</a></li>
<li><a href="/blog/ko/2019-12-27-meta-table.md">Milvus 메타데이터 관리 (2): 메타데이터 테이블의 필드</a></li>
</ul>
