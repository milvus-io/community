---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Milvus 벡터 데이터베이스에서 메타데이터를 보는 방법에 대해 알아보세요.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Milvus 메타데이터 관리 (1)</custom-h1><p><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">대규모 벡터 검색 엔진에서 데이터 관리하기에서</a> 메타데이터에 대한 몇 가지 정보를 소개했습니다. 이번 글에서는 Milvus의 메타데이터를 보는 방법을 주로 설명합니다.</p>
<p>Milvus는 SQLite 또는 MySQL에 메타데이터 저장을 지원합니다. 설정 파일 <code translate="no">server_config.yaml</code>)에 있는 <code translate="no">backend_url</code> 파라미터를 통해 메타데이터를 관리할 때 SQLite를 사용할지 MySQL을 사용할지 지정할 수 있습니다.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>SQLite를 사용하는 경우 Milvus가 시작된 후 데이터 디렉터리(설정 파일 <code translate="no">server_config.yaml</code> 의 <code translate="no">primary_path</code> 에 정의됨)에 <code translate="no">meta.sqlite</code> 파일이 생성됩니다. 파일을 보려면 SQLite 클라이언트만 설치하면 됩니다.</p>
<p>명령줄에서 SQLite3를 설치합니다:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>그런 다음 Milvus 데이터 디렉토리에 들어가서 SQLite3를 사용하여 메타 파일을 엽니다:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>이제 이미 SQLite 클라이언트 명령줄에 들어갔을 것입니다. 몇 가지 명령을 사용하여 메타데이터의 내용을 확인하기만 하면 됩니다.</p>
<p>인쇄된 결과를 사람이 읽기 쉽도록 서식을 지정합니다:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>SQL 문을 사용하여 테이블 및 테이블 파일을 쿼리하려면(대소문자 구분 없음) 다음과 같이 하세요:</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-use-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>MySQL을 사용하는 경우 구성 파일 <code translate="no">server_config.yaml</code> 의 <code translate="no">backend_url</code> 에 MySQL 서비스 주소를 지정해야 합니다.</p>
<p>예를 들어, 다음 설정은 포트 '3306', 사용자 이름 'root', 비밀번호 '123456', 데이터베이스 이름 'milvus'로 MySQL 서비스가 로컬에 배포되었음을 나타냅니다:</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>먼저 MySQL 클라이언트를 설치합니다:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Milvus가 시작되면 <code translate="no">backend_url</code> 에서 지정한 MySQL 서비스에 두 개의 테이블(Tables 및 TableFiles)이 생성됩니다.</p>
<p>다음 명령어를 사용하여 MySQL 서비스에 연결합니다:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>이제 SQL 문을 사용하여 메타데이터 정보를 쿼리할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
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
    </button></h2><p>다음 글에서는 메타데이터 테이블의 스키마에 대해 자세히 소개할 예정입니다. 기대해주세요!</p>
<p>궁금한 점이 있으면 <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack 채널에</a> 참여하거나 리포지토리에 이슈를 제출해 주세요.</p>
<p>GitHub 리포지토리: https://github.com/milvus-io/milvus</p>
<p>이 글이 마음에 들거나 유용하다고 생각되면 박수를 보내주세요!</p>
