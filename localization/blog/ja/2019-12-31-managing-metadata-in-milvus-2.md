---
id: managing-metadata-in-milvus-2.md
title: Tables テーブルのフィールド
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: メタデータ・テーブルのフィールド
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>milvusのメタデータ管理 (2)</custom-h1><p>前回のブログでは、MySQLまたはSQLiteを使用してメタデータを表示する方法を紹介しました。今回は主にメタデータテーブルのフィールドについて詳しく紹介します。</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header"><code translate="no">Tables</code> テーブルのフィールド<button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>SQLiteを例にとってみよう。以下の結果は0.5.0のものです。0.6.0ではいくつかのフィールドが追加されているので、後で紹介する。<code translate="no">Tables</code> に &lt;codetable_1</code> という名前の512次元ベクトルテーブルを指定する行がある。テーブル作成時、<code translate="no">index_file_size</code> は1024MB、<code translate="no">engine_type</code> は1（FLAT）、<code translate="no">nlist</code> は16384、<code translate="no">metric_type</code> は1（ユークリッド距離L2）。idはテーブルの一意識別子。<code translate="no">state</code> はテーブルの状態で、0は通常状態を示す。<code translate="no">created_on</code> は作成時間。<code translate="no">flag</code> は内部用に予約されたフラグ。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>次の表は、<code translate="no">Tables</code> のフィールド・タイプとその説明である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span>。</p>
<p>0.6.0では、<code translate="no">owner_table</code>、<code translate="no">partition_tag</code> 、<code translate="no">version</code> を含むいくつかの新しいフィールドでテーブル・パーティショニングが有効になっています。ベクトル・テーブル、<code translate="no">table_1</code> は、<code translate="no">table_1_p1</code> というパーティションを持ちます。<code translate="no">partition_name</code> は、<code translate="no">table_id</code> に対応します。パーティション・テーブルのフィールドは<code translate="no">owner table</code> から継承され、オーナー・テーブル・フィールドがオーナー・テーブルの名前を指定し、<code translate="no">partition_tag</code> フィールドがパーティションのタグを指定する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>次の表は0.6.0の新しいフィールドを示しています：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span>。</p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">TableFilesテーブルのフィールド<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>次の例では、<code translate="no">table_1</code> ベクトル・テーブルに属する2つのファイルを示している。最初のファイルのインデックス・タイプ (<code translate="no">engine_type</code>) は 1 (FLAT)、ファイル・ステータス (<code translate="no">file_type</code>) は 7 (オリジナル・ファイルのバックアップ)、<code translate="no">file_size</code> は 411200113 バイト、ベクター行数は 200,000 です。2番目のファイルのインデックス・タイプは2（IVFLAT）であり、ファイル・ステータスは3（インデックス・ファイル）である。2番目のファイルは、実際には1番目のファイルのインデックスである。詳細は次回以降に紹介する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-image-3.png</span> </span></p>
<p><code translate="no">TableFiles</code> のフィールドと説明を以下の表に示す：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-フィールドの種類-説明-表ファイル.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">次の記事<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>次回はMilvusでSQLiteを使ってメタデータを管理する方法を紹介します。ご期待ください！</p>
<p>質問があれば、<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slackチャンネルに</a>参加<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">するか、</a>リポジトリにissueを投稿してください。</p>
<p>GitHub リポジトリ: https://github.com/milvus-io/milvus</p>
