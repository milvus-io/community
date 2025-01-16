---
id: 2019-12-27-meta-table.md
title: Milvus Metadata Management (2) メタデータテーブルのフィールド
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Milvusのメタデータテーブルのフィールドの詳細について学ぶ。
cover: null
tag: Engineering
---
<custom-h1>Milvusメタデータ管理 (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">メタデータテーブルのフィールド<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>著者Yihua Mo</p>
<p>日付: 2019-12-27</p>
</blockquote>
<p>前回のブログでは、MySQLやSQLiteを使ってメタデータを表示する方法を紹介した。今回は主にメタデータテーブルのフィールドについて詳しく紹介する。</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header"><code translate="no">Tables</code>&quot; テーブルのフィールド</h3><p>SQLiteを例にとろう。以下の結果は0.5.0のものです。0.6.0ではいくつかのフィールドが追加されているので、後で紹介する。<code translate="no">Tables</code> に<code translate="no">table_1</code> という名前の 512 次元ベクトル・テーブルを指定する行がある。テーブル作成時、<code translate="no">index_file_size</code> は1024MB、<code translate="no">engine_type</code> は1（FLAT）、<code translate="no">nlist</code> は16384、<code translate="no">metric_type</code> は1（ユークリッド距離L2）である。<code translate="no">id</code> はテーブルの一意識別子である。<code translate="no">state</code> はテーブルの状態であり、0は通常状態を示す。<code translate="no">created_on</code> は作成時間である。<code translate="no">flag</code> は内部用に予約されたフラグである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>テーブル</span> </span></p>
<p>以下の表は、<code translate="no">Tables</code> のフィールドの種類と説明である。</p>
<table>
<thead>
<tr><th style="text-align:left">フィールド名</th><th style="text-align:left">データ型</th><th style="text-align:left">説明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">ベクトル・テーブルの一意識別子。<code translate="no">id</code> 自動的にインクリメントされる。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">文字列</td><td style="text-align:left">ベクトル・テーブルの名前。<code translate="no">table_id</code> はユーザー定義で、Linux のファイル名ガイドラインに従う必要があります。</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">ベクターテーブルの状態。0は正常、1は削除（ソフト削除）を表す。</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">ベクトル・テーブルのベクトル次元。ユーザー定義でなければならない。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">1970年1月1日からテーブルが作成されるまでのミリ秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">ベクトルIDがユーザー定義かどうかなど、内部で使用するフラグ。デフォルトは 0 です。</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">データファイルのサイズが<code translate="no">index_file_size</code> に達した場合、そのファイルは結合されず、インデックスの構築に使用されます。デフォルトは 1024 (MB) です。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">ベクトル・テーブルに構築するインデックスの種類。デフォルトは0であり、無効なインデックスを指定する。1ではFLAT、2ではIVFLAT、3ではIVFSQ8を指定します。4 は NSG を指定します。5 は IVFSQ8H を指定します。</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">インデックス構築時に各データ・ファイル内のベクトルを分割するクラスタの数。デフォルトは16384。</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">ベクトル距離の計算方法。1 はユークリッド距離 (L1) を指定し、2 は内積を指定します。</td></tr>
</tbody>
</table>
<p>テーブル・パーティショニングは0.6.0で有効化され，<code translate="no">owner_table</code>，<code translate="no">partition_tag</code> ，<code translate="no">version</code> を含むいくつかの新しいフィールドが追加された。ベクトル・テーブル、<code translate="no">table_1</code> は、<code translate="no">table_1_p1</code> というパーティションを持ち、これもベクトル・テーブルである。<code translate="no">partition_name</code> は、<code translate="no">table_id</code> に対応する。パーティション・テーブルのフィールドはオーナー・テーブルから継承され、<code translate="no">owner table</code> フィールドがオーナー・テーブルの名前を指定し、<code translate="no">partition_tag</code> フィールドがパーティションのタグを指定します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tables_new</span> </span></p>
<p>次の表は0.6.0の新しいフィールドを示しています：</p>
<table>
<thead>
<tr><th style="text-align:left">フィールド名</th><th style="text-align:left">データ型</th><th style="text-align:left">フィールド名</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">文字列</td><td style="text-align:left">パーティションの親テーブル。</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">文字列</td><td style="text-align:left">パーティションのタグ。空文字列であってはならない。</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">文字列</td><td style="text-align:left">milvusのバージョン。</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header"><code translate="no">TableFiles&quot;</code> " テーブルのフィールド</h3><p>次の例は2つのファイルを含み、どちらも<code translate="no">table_1</code> ベクトル・テーブルに属しています。最初のファイルのインデックス・タイプ(<code translate="no">engine_type</code>)は 1 (FLAT)、ファイル・ステータス(<code translate="no">file_type</code>)は 7 (オリジナル・ファイルのバックアップ)、<code translate="no">file_size</code> は 411200113 バイト、ベクター行数は 200,000 です。2番目のファイルのインデックス・タイプは2（IVFLAT）であり、ファイル・ステータスは3（インデックス・ファイル）である。2番目のファイルは、実際には1番目のファイルのインデックスである。詳細は次回以降に紹介する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>テーブルファイル</span> </span></p>
<p><code translate="no">TableFiles</code> のフィールドと説明を以下の表に示す：</p>
<table>
<thead>
<tr><th style="text-align:left">フィールド名</th><th style="text-align:left">データ型</th><th style="text-align:left">説明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">ベクトル・テーブルの一意な識別子。<code translate="no">id</code> 自動的にインクリメントされる。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">文字列</td><td style="text-align:left">ベクトル・テーブルの名前。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">ベクトル・テーブルを構築するインデックスの種類。デフォルトは 0 で、これは無効なインデックスを指定します。1 は FLAT を、2 は IVFLAT を、3 は IVFSQ8 を指定します。4 は NSG を指定します。5 は IVFSQ8H を指定します。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">文字列</td><td style="text-align:left">ファイル作成時に生成されるファイル名。1970年1月1日からテーブルが作成されるまでのミリ秒数を1000倍したものに等しい。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">ファイルの状態。0は新しく生成された生のベクトル・データ・ファイルを示す。1は生のベクトル・データ・ファイルを指定する。2は、そのファイルに対してインデックスが作成されることを示す。3は、ファイルがインデックス・ファイルであることを示す。4 は、ファイルが削除（ソフト削除）されることを示す。5 は、ファイルが新たに生成され、組み合わせデータの保存に使用されることを指定する。6 は、ファイルが新たに生成され、インデックス・データの格納に使用されることを指定する。7は、生のベクトル・データ・ファイルのバックアップ・ステータスを指定します。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">ファイル・サイズ（バイト単位）。</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">ファイル内のベクトル数。</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">最新の更新時刻のタイムスタンプ。1970年1月1日からテーブルが作成されるまでのミリ秒数を指定する。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">1970年1月1日からテーブルが作成されるまでのミリ秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">テーブルが作成された日付。これは歴史的な理由で残っており、将来のバージョンでは削除される予定です。</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">関連ブログ<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">大規模ベクトル検索エンジンのデータ管理</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvusのメタデータ管理(1)：メタデータの見方</a></li>
</ul>
