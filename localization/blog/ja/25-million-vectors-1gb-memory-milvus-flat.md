---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: Milvusで1GB以下のメモリで2500万イメージベクトルを実行する方法
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: MilvusのFLAT、FP16、mmapを使用して、25Mベクトル画像検索を1GB以下のメモリで実行したコミュニティ・ユーザーの例。
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Milvusのユーザーが最近、非常に実用的な画像検索の問題を抱えてきた。</p>
<p>「1280次元ベクトルとしてエンコードされた2500万枚の画像を画像間検索する必要がある。1台のマシンがこのワークロードに対応する。マシンのRAMは64GBで、ベクターデータベースに使えるのはせいぜい32GBです。しかし、<a href="https://milvus.io/tools/sizing"><strong>milvusのサイジング・ツールは</strong></a>、139GB必要だと言っている。これでいいのか？"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>サイジングツールの推定結果：25M×1280次元ベクトル、ローデータサイズ119.2GB、ロードメモリ139.4GB</p>
<p>まだまだだ。</p>
<p>当初は、より高度なインデックスを使うのが当然の答えのように思われた。データセットが大きく、メモリが逼迫しているのであれば、よりスマートなANNインデックスが役立つはずだ。しかしこの場合、そうはならなかった。最終的に機能したインデックスは、milvusの最も単純なオプションであった：<a href="https://milvus.io/docs/flat.md"><strong>FLATで</strong></a>ある。</p>
<p>結果は予想以上に良かった：定常状態のメモリは1GB以下にとどまり、コンテナの常駐メモリは約600MB、ウォームクエリーのレイテンシは100ms以下にとどまった。起動時の一時的なピークは約12.5GBで、システムがウォームアップする間、最初のクエリに約30秒かかった。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>重要なのは、FLATが2,500万回のブルートフォース比較を魔法のように安価にしたということではない。そうではない。重要なのは、このワークロードが2,500万個のベクトルすべてを検索することはほとんどなかったということです。スカラー・フィルターが最初にクエリを絞り込み、FLATはそのずっと小さな候補セットの中のベクトルだけを比較したのだ。</p>
<p>この投稿では、何が失敗したのか、なぜFLATがうまくいったのか、そして同じパターンを自分のワークロードで試す価値があるのかについて説明する。</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">AISAQとIVF_FLATが機能しなかった理由<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>FLATの前に、ユーザーは、制約のあるマシンにとってより自然に見える2つのインデックスを試しました。</p>
<p><strong>最初の試み：</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>。</strong>AISAQは、メモリ使用量を低く抑えるように設計されたディスク指向インデックスである。この作業負荷で問題となったのは、構築とロードのパスである。5,500万個のベクターを使った以前のテストでは、1回の収集ロードで249GBの一時データをディスクに書き込み、時間がかかりすぎて実用的ではなかった。</p>
<p><strong>2回目の試み：IVF_FLAT。</strong>IVF_FLATも標準的なANNインデックスであるため、合理的に見えた。インデックスの構築は成功したが、収集負荷は14%で停止し、回復しなかった。</p>
<p>この2つの行き詰まりの後、ユーザーは退屈なオプションを試した：FLATである。これはきれいにロードされた。また、この特定のクエリパターンに対して最良の実行時動作を与えました。</p>
<table>
<thead>
<tr><th><strong>インデックス</strong></th><th><strong>有望に見えた理由</strong></th><th><strong>このワークロードで起こったこと</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>理論的にはメモリ使用量の少ないディスク指向インデックス</td><td>ビルド/ロード・パスが大きな一時ファイルを生成した。55Mベクタのテストでは、1つのコレクションロードが249GBの一時データを書き込み、低速であった。</td></tr>
<tr><td>IVF_FLAT</td><td>フルスキャンよりも検索コストが低い標準的なANNインデックス</td><td>インデックスは構築されたが、収集負荷は14%で停止し、回復しなかった。</td></tr>
<tr><td>FLAT</td><td>余分なANN構造がなく、インデックス構築の複雑さもない。</td><td>定常状態のメモリは1GB以下にとどまった。コンテナ常駐メモリは約600MB。起動時のピークは12.5GB付近。最初のクエリに約30秒かかり、その後ウォームクエリは100ms未満にとどまった。</td></tr>
</tbody>
</table>
<p>理論的には効率的なインデックスでも、特定のマシン、データ形状、クエリーパターンには適合しないことがある。</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">FLATが機能した理由<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLATはmilvusがサポートする最もシンプルなインデックスである。グラフなし。ツリーもない。クラスタリングもない。クエリーベクトルと候補ベクトルを直接比較する。</p>
<p>2,500万個のベクトルには向かない。すべてのクエリがコレクション全体を検索するのであれば、間違ったツールになるだろう。</p>
<p>しかし、この作業負荷は、ベクトル検索の前に強力なフィルターを持っていた。すべてのクエリーは、まず、<code translate="no">dataid</code> や<code translate="no">classid</code> のようなスカラー・フィールドで検索空間を絞り込む。Milvusはその後で初めてベクトル類似性検索を実行した。これにより、問題は "2500万個のベクトルを検索する "ことから、"フィルタリング後に数百から数万個のベクトルを検索する "ことに変わった。</p>
<p>このセットアップを成功させたのは3つの要素だ：FP16ベクトル・ストレージ、生のベクトル・データ用のmmap、そしてFLATパスの前のスカラー・フィルタリングである。</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">最適化1：FP16はベクトルデータを半分にする<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトルは1280次元だった。FP32として格納する場合、各ベクトルは5120バイトを必要とする：</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>2500万ベクトル全体では、約119.2GBの生のベクトルデータとなる。FP16は各次元を4バイトから2バイトに削減する：</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>つまり、生のベクトルデータは約59.6GBに減少する。</p>
<p>これでも利用可能なRAMには収まらないが、Milvusとオペレーティング・システムが処理する必要のあるベクトル・データ量は半分になる。多くの画像検索ワークロードにおいて、FP16のリコールインパクトは小さいが、それはフリールールではない。デフォルトにする前に、独自のエンベッディング、メトリック、クオリティバーでリコールをテストしてください。</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">最適化2：mmapは生のベクトルをプロセスヒープから離す<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16の後でも、約60GBのベクターはメモリ予算に対して多すぎる。そこで<a href="https://milvus.io/docs/mmap.md"><strong>mmapが</strong></a>役に立つ。</p>
<p>mmapを使えば、milvusは生のベクトル・フィールド全体をプロセス・メモリにロードする代わりに、メモリ・マップド・ファイルを通じてベクトル・データにアクセスできる。オペレーティングシステムは、クエリがデータに触れるたびにデータをページングし、ホットページをページキャッシュに保持することができます。</p>
<p>このユーザーのMilvus 2.6.14環境では、クラスタレベルのmmap設定がすでに生のベクターデータをカバーしていたので、ユーザーはmmapを手動で設定する必要はありませんでした。</p>
<p>デバッグ中に混乱を招いたことがありました：Attuはクラスタレベルのデフォルトではなく、スキーマレベルのmmap設定を表示します。<a href="https://zilliz.com/attu"><strong>Attuは</strong></a>クラスタ・レベルのデフォルトではなくスキーマ・レベルのmmap設定を表示するため、クラスタ・レベルのコンフィギュレーションがデータ・パスのmmapを事実上有効にしていても、<a href="https://zilliz.com/attu"><strong>Attuは</strong></a>mmapを無効と表示することがあります。</p>
<p>mmapはRAMを節約しますが、ディスクとOSのページ・キャッシュをより多く使用します。ベクター・ファイル用にSSDの容量が必要であることに変わりはなく、関連ページをディスクから読み込む間、最初のクエリが遅くなる可能性があります。</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">最適化3：スカラー・フィルタリングが真の性能向上要因<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16とmmapはメモリ数を説明する。スカラーフィルタリングはレイテンシの数値を説明します。</p>
<p>このワークロードのすべてのクエリには、次のようなフィルタ式が含まれています：</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>このフィルターはベクトル比較ステップの前に実行されます。FLATは2,500万個のベクターと比較する代わりに、フィルタリングされた候補セットと比較しました。</p>
<p>そのため、ウォームクエリーは100ms以下に抑えられた。何万ものベクトル比較は、最新のCPUでは実用的である。クエリーあたり2,500万回の比較となると、話は大きく変わってくる。</p>
<p>IVF_FLATとHNSWが役に立たなかった理由もここにある。スカラーフィルタリングで候補セットが十分に減ると、余分なANN構造はデッドウェイトになる可能性がある。メモリ、ビルド時間、負荷の複雑さは増えるが、レイテンシはあまり改善されないかもしれない。</p>
<p>一つ注意点がある。このワークロードのフィルターは単純である。あなたのフィルターが、大きな<code translate="no">IN</code> リスト、<code translate="no">LIKE</code> パターン、範囲述語、またはネストされたJSON条件を使用する場合、関連するフィールドにスカラーインデックスを追加し、フィルターステージを直接測定する。</p>
<table>
<thead>
<tr><th>最適化</th><th>何をするのか</th><th>ここで重要な理由</th><th>トレードオフ</th></tr>
</thead>
<tbody>
<tr><td>FP16ベクトル・ストレージ</td><td>各ベクトル次元を4バイトではなく2バイトで格納</td><td>生のベクトルデータを約119.2GBから約59.6GBに削減</td><td>リコールへの影響は、埋め込みとメトリックに依存します。テストしてみてください。</td></tr>
<tr><td>生ベクトルでのmmap</td><td>生のベクトルフィールドを完全にプロセスメモリにロードする代わりに、ディスクからベクトルファイルをマップ。</td><td>OSに必要に応じてデータをページインさせながら、プロセスメモリを低く抑える。</td><td>SSDの容量を必要とし、コールドクエリが遅くなる可能性がある。</td></tr>
<tr><td>最初にスカラー・フィルタリング</td><td>ベクトル比較の前にスカラーフィールドでフィルタリング</td><td>各クエリを25Mの候補から数百、数万に削減</td><td>複雑なフィルターではスカラーインデックスが必要になる</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">このパターンが適用される場合<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>画像検索のケースがうまくいったのは、実際の検索空間がコレクション全体よりもずっと小さかったからだ。これと同じ形が、多くの実運用ワークロードに現れる。</p>
<ol>
<li><strong>マルチテナントRAG：</strong>最初に<code translate="no">tenant_id</code> 、<code translate="no">workspace_id</code> 、または<code translate="no">project_id</code> 。各テナントは数千から数万のチャンクしか持っていないかもしれない。</li>
<li><strong>Eコマース商品検索：</strong>ベクトル検索の前に、カテゴリー、ブランド、販売者、地域、在庫状況によってフィルタリングします。</li>
<li><strong>ログとドキュメントの検索：</strong>セマンティック検索の前に、時間範囲、ソース、サービス、文書タイプでフィルタリング。</li>
<li><strong>画像やメディアのラベル検索：</strong>埋め込みを比較する前に、データセット、クラス、顧客、資産グループでフィルタリング。</li>
</ol>
<p>これらはFLAT + FP16 + mmapに適した候補である。なぜなら、コレクション全体は大きくても、各クエリはまだ小さなサブセットにしか触れていないからである。</p>
<p>すべてのクエリがコレクション全体を検索する場合、このパターンは適用されません。各クエリが本当に2,500万個のベクトルすべてをスキャンする必要がある場合、FLATでは同じレイテンシは得られません。その場合は、HNSW、IVF、ディスク指向インデックスなどのANNインデックスを使用し、メモリ、ディスク、構築時間のトレードオフを考慮して計画を立てます。</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">サイジングツールの見積もりの見方<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Sizing Toolは出発点であり、ハードウェアの最終判断ではありません。</p>
<p>このケースでは、139.4GBのローディングメモリ見積もりは、2,500万個の1,280次元FP32ベクトルに対する保守的なベースラインとして機能しました。実際のワークロードでは、いくつかの仮定が変更された：</p>
<ol>
<li>FP16では、生のベクトルサイズが約半分になった。</li>
<li>mmapは、生のベクトル・フィールドをプロセス・メモリに完全にロードすることを避けた。</li>
<li>FLATは余分なANNインデックス構造を避けた。</li>
<li>スカラー・フィルターにより、各クエリーの検索候補セットはかなり小さくなった。</li>
</ol>
<p>これが、実際のワークロードテストが重要な理由である。サイジングの見積もりだけに基づいてハードウェア・セットアップを拒否する前に、実際のベクトル精度、インデックス・タイプ、mmap構成、スカラー・フィルター、コールド・クエリ動作、ウォーム・クエリ動作でテストしてください。</p>
<h2 id="Get-Started" class="common-anchor-header">始める<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>同じレシピを試す場合、インデックス名ではなく、クエリパターンから始めます。</p>
<ol>
<li>すべてのクエリが選択的なスカラーフィルタを持っているか確認します。</li>
<li>フィルタリング後にどれだけのベクトルが残っているかを見積もる。</li>
<li>想起テストが良好であれば、ベクトルをFP16として格納する。</li>
<li>フィルタリングされた候補セットがブルートフォース比較に十分小さい場合は FLAT を使用。</li>
<li>生のベクトルデータの mmap 動作を検証する。スキーマレベルの設定とクラスタレベルの設定の両方を確認。</li>
<li>起動メモリ、ファーストクエリレイテンシ、ウォームクエリレイテンシ、ディスクI/Oを測定する。</li>
<li>フィルタ評価がボトルネックになる場合はスカラインデックスを追加する。</li>
</ol>
<p>ローカルテストでは、<a href="https://milvus.io/docs/quickstart.md"><strong>Milvusクイックスタート</strong></a>またはMilvus<a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>リポジトリから始める。Attuを使用してコレクションを検査しますが、Attuはクラスタレベルのmmapデフォルトを表示しない場合があることを覚えておいてください。</p>
<p>インフラを自分で運用したくない場合、<a href="https://zilliz.com/cloud"><strong>Zilliz Cloudは</strong></a>Milvusのマネージドサービスです。同じMilvusコアをマネージド運用、スケーリング、テスト用の無料ティアで利用できる。仕事用のEメールで100ドルの無料クレジットを<a href="https://cloud.zilliz.com/signup"><strong>申し込むか</strong></a>、すでにアカウントをお持ちの場合は<a href="https://cloud.zilliz.com/login"><strong>サインインして</strong></a>ください。</p>
