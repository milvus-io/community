---
id: managing-metadata-in-milvus-2.md
title: Tables 테이블의 필드
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: 메타데이터 테이블의 필드
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Milvus 메타데이터 관리 (2)</custom-h1><p>지난 블로그에서는 MySQL 또는 SQLite를 사용하여 메타데이터를 보는 방법에 대해 언급했습니다. 이번 글에서는 주로 메타데이터 테이블의 필드에 대해 자세히 소개하고자 합니다.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header"><code translate="no">Tables</code> 테이블의 필드<button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>SQLite를 예로 들어 보겠습니다. 다음 결과는 0.5.0에서 가져온 것입니다. 일부 필드는 나중에 소개될 0.6.0에 추가되었습니다. <code translate="no">Tables</code> 에 &lt;codetable_1</code> 이라는 이름의 512차원 벡터 테이블을 지정하는 행이 있습니다. 테이블이 생성되면 <code translate="no">index_file_size</code> 은 1024MB, <code translate="no">engine_type</code> 은 1(FLAT), <code translate="no">nlist</code> 은 16384, <code translate="no">metric_type</code> 은 1(유클리드 거리 L2)입니다. id 는 테이블의 고유 식별자입니다. <code translate="no">state</code> 은 테이블의 상태이며 0은 정상 상태를 나타냅니다. <code translate="no">created_on</code> 은 생성 시간입니다. <code translate="no">flag</code> 은 내부용으로 예약되어 있는 플래그입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-이미지-1.png</span> </span></p>
<p>다음 표는 <code translate="no">Tables</code> 의 필드 유형과 필드에 대한 설명을 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>테이블 파티셔닝은 0.6.0에서 <code translate="no">owner_table</code>,<code translate="no">partition_tag</code> 및 <code translate="no">version</code> 을 포함한 몇 가지 새로운 필드와 함께 활성화됩니다. 벡터 테이블인 <code translate="no">table_1</code> 에는 <code translate="no">table_1_p1</code> 이라는 파티션이 있으며, 이 파티션도 벡터 테이블입니다. <code translate="no">partition_name</code> 는 <code translate="no">table_id</code> 에 해당합니다. 파티션 테이블의 필드는 <code translate="no">owner table</code> 에서 상속되며, 소유자 테이블 필드는 소유자 테이블의 이름을 지정하고 <code translate="no">partition_tag</code> 필드는 파티션의 태그를 지정합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-이미지-2.png</span> </span></p>
<p>다음 표는 0.6.0의 새로운 필드를 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">TableFiles 테이블의 필드<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 예제에는 <code translate="no">table_1</code> 벡터 테이블에 속하는 두 개의 파일이 포함되어 있습니다. 첫 번째 파일의 인덱스 유형(<code translate="no">engine_type</code>)은 1(FLAT), 파일 상태(<code translate="no">file_type</code>)는 7(원본 파일의 백업), <code translate="no">file_size</code> 는 411200113 바이트, 벡터 행 수는 200,000개입니다. 두 번째 파일의 인덱스 유형은 2(IVFLAT)이고 파일 상태는 3(인덱스 파일)입니다. 두 번째 파일은 실제로 첫 번째 파일의 인덱스입니다. 자세한 내용은 다음 글에서 소개하겠습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-이미지-3.png</span> </span></p>
<p>다음 표는 <code translate="no">TableFiles</code> 의 필드와 설명을 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-필드-유형-설명-테이블파일.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">다음 단계<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 글에서는 SQLite를 사용하여 Milvus에서 메타데이터를 관리하는 방법을 보여드릴 예정입니다. 기대해주세요!</p>
<p>궁금한 점이 있으면 <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack 채널에 참여하거나</a>리포지토리에 이슈를 제출해 주세요.</p>
<p>깃허브 리포지토리: https://github.com/milvus-io/milvus</p>
