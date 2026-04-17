---
id: 2019-12-27-meta-table.md
title: Milvus 메타데이터 관리 (2) 메타데이터 테이블의 필드
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Milvus의 메타데이터 테이블에 있는 필드에 대해 자세히 알아보세요.
cover: null
tag: Engineering
---
<custom-h1>Milvus 메타데이터 관리 (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">메타데이터 테이블의 필드<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Author: 이화 모</p>
<p>날짜: 2019-12-27</p>
</blockquote>
<p>지난 블로그에서는 MySQL 또는 SQLite를 사용하여 메타데이터를 보는 방법에 대해 언급했습니다. 이번 글에서는 주로 메타데이터 테이블의 필드에 대해 자세히 소개하고자 합니다.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">&quot;<code translate="no">Tables</code>&quot; 테이블의 필드</h3><p>SQLite를 예로 들어 보겠습니다. 다음 결과는 0.5.0에서 가져온 것입니다. 일부 필드는 나중에 소개될 0.6.0에 추가되었습니다. <code translate="no">Tables</code> 에 이름이 <code translate="no">table_1</code> 인 512차원 벡터 테이블을 지정하는 행이 있습니다. 테이블이 생성되면 <code translate="no">index_file_size</code> 은 1024MB, <code translate="no">engine_type</code> 은 1(FLAT), <code translate="no">nlist</code> 은 16384, <code translate="no">metric_type</code> 은 1(유클리드 거리 L2), <code translate="no">id</code> 은 테이블의 고유 식별자입니다. <code translate="no">state</code> 은 테이블의 상태이며 0은 정상 상태를 나타냅니다. <code translate="no">created_on</code> 은 생성 시간, <code translate="no">flag</code> 은 내부 사용을 위해 예약된 플래그입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>테이블</span> </span></p>
<p>다음 표는 <code translate="no">Tables</code> 에 있는 필드 유형과 필드에 대한 설명을 보여줍니다.</p>
<table>
<thead>
<tr><th style="text-align:left">필드 이름</th><th style="text-align:left">데이터 유형</th><th style="text-align:left">설명</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">벡터 테이블의 고유 식별자입니다. <code translate="no">id</code> 자동으로 증가합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">문자열</td><td style="text-align:left">벡터 테이블의 이름. <code translate="no">table_id</code> 은 사용자가 정의해야 하며 Linux 파일 이름 가이드라인을 따라야 합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">벡터 테이블의 상태입니다. 0은 정상, 1은 삭제됨(소프트 삭제)을 나타냅니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">벡터 테이블의 벡터 차원입니다. 사용자가 정의해야 합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">1970년 1월 1일부터 테이블이 생성될 때까지의 시간(밀리초)입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">벡터 ID가 사용자 정의인지 여부와 같은 내부 사용을 위한 플래그입니다. 기본값은 0입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">데이터 파일의 크기가 <code translate="no">index_file_size</code> 에 도달하면 파일을 결합하지 않고 인덱스를 만드는 데 사용합니다. 기본값은 1024(MB)입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">벡터 테이블에 대해 빌드할 인덱스 유형입니다. 기본값은 0으로, 유효하지 않은 인덱스를 지정합니다. 1은 FLAT을 지정합니다. 2는 IVFLAT을 지정합니다. 3은 IVFSQ8을 지정합니다. 4는 NSG를 지정합니다. 5는 IVFSQ8H를 지정합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">인덱스가 구축될 때 각 데이터 파일의 벡터가 분할되는 클러스터의 수입니다. 기본값은 16384입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">벡터 거리를 계산하는 메서드. 1은 유클리드 거리(L1)를 지정하고 2는 내적 곱을 지정합니다.</td></tr>
</tbody>
</table>
<p>테이블 분할은 0.6.0에서 <code translate="no">owner_table</code>,<code translate="no">partition_tag</code> 및 <code translate="no">version</code> 를 포함한 몇 가지 새로운 필드와 함께 활성화되었습니다. 벡터 테이블인 <code translate="no">table_1</code> 에는 <code translate="no">table_1_p1</code> 이라는 파티션이 있으며, 이 역시 벡터 테이블입니다. <code translate="no">partition_name</code> 는 <code translate="no">table_id</code> 에 해당합니다. 파티션 테이블의 필드는 소유자 테이블에서 상속되며, <code translate="no">owner table</code> 필드는 소유자 테이블의 이름을 지정하고 <code translate="no">partition_tag</code> 필드는 파티션의 태그를 지정합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tables_new</span> </span></p>
<p>다음 표는 0.6.0의 새로운 필드를 보여줍니다:</p>
<table>
<thead>
<tr><th style="text-align:left">필드 이름</th><th style="text-align:left">데이터 유형</th><th style="text-align:left">설명</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">문자열</td><td style="text-align:left">파티션의 상위 테이블입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">문자열</td><td style="text-align:left">파티션의 태그입니다. 빈 문자열이 아니어야 합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Milvus 버전입니다.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">"<code translate="no">TableFiles&quot;</code> 테이블의 필드</h3><p>다음 예제에는 <code translate="no">table_1</code> 벡터 테이블에 속하는 두 개의 파일이 포함되어 있습니다. 첫 번째 파일의 인덱스 유형(<code translate="no">engine_type</code>)은 1(FLAT), 파일 상태(<code translate="no">file_type</code>)는 7(원본 파일의 백업), <code translate="no">file_size</code> 는 411200113 바이트, 벡터 행 수는 200,000개입니다. 두 번째 파일의 인덱스 유형은 2(IVFLAT)이고 파일 상태는 3(인덱스 파일)입니다. 두 번째 파일은 실제로 첫 번째 파일의 인덱스입니다. 자세한 내용은 다음 글에서 소개하겠습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>테이블 파일</span> </span></p>
<p>다음 표는 <code translate="no">TableFiles</code> 의 필드와 설명을 보여줍니다:</p>
<table>
<thead>
<tr><th style="text-align:left">필드 이름</th><th style="text-align:left">데이터 유형</th><th style="text-align:left">설명</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">벡터 테이블의 고유 식별자. <code translate="no">id</code> 자동으로 증가합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">문자열</td><td style="text-align:left">벡터 테이블의 이름입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">벡터 테이블에 대해 빌드할 인덱스 유형입니다. 기본값은 0으로, 유효하지 않은 인덱스를 지정합니다. 1은 FLAT을 지정합니다. 2는 IVFLAT을 지정합니다. 3은 IVFSQ8을 지정합니다. 4는 NSG를 지정합니다. 5는 IVFSQ8H를 지정합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">문자열</td><td style="text-align:left">파일 생성 시 생성된 파일명입니다. 1000에 1970년 1월 1일부터 테이블이 생성된 시간까지의 밀리초 수를 곱한 값입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">파일 상태입니다. 0은 새로 생성된 원시 벡터 데이터 파일을 지정합니다. 1은 원시 벡터 데이터 파일을 지정합니다. 2는 파일에 대한 인덱스가 생성될 것을 지정합니다. 3은 파일이 인덱스 파일임을 지정합니다. 4는 파일을 삭제(소프트 삭제)하도록 지정합니다. 5는 파일을 새로 생성하여 조합 데이터를 저장하는 데 사용하도록 지정합니다. 6은 파일이 새로 생성되어 인덱스 데이터를 저장하는 데 사용되도록 지정합니다. 7은 원시 벡터 데이터 파일의 백업 상태를 지정합니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">바이트 단위의 파일 크기입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">파일에 포함된 벡터의 개수입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">1970년 1월 1일부터 테이블이 생성된 시간까지의 밀리초 수를 지정하는 최신 업데이트 시간에 대한 타임스탬프입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">1970년 1월 1일부터 테이블이 생성된 시간까지의 밀리초 수입니다.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">테이블이 생성된 날짜입니다. 기록상의 이유로 아직 여기에 있으며 향후 버전에서는 제거될 예정입니다.</td></tr>
</tbody>
</table>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">대규모 벡터 검색 엔진에서 데이터 관리하기</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 메타데이터 관리 (1): 메타데이터를 보는 방법</a></li>
</ul>
