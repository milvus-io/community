---
id: 2019-12-18-datafile-cleanup.md
title: これまでの削除戦略と関連する問題
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: クエリー操作に関連する問題を修正するため、ファイル削除ストラテジーを改善しました。
cover: null
tag: Engineering
---
<custom-h1>データファイルのクリーンアップ機構の改善</custom-h1><blockquote>
<p>著者イーファ・モ</p>
<p>日付: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">これまでの削除戦略と関連する問題<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="/blog/ja/2019-11-08-data-management.md">大規模ベクトル検索エンジンのデータ管理では</a>、データファイルの削除メカニズムについて言及した。削除にはソフト削除とハード削除がある。テーブルに対して削除操作を行うと、そのテーブルにはソフト削除のマークが付けられます。その後の検索操作や更新操作はできなくなる。しかし、削除前に開始した問い合わせ操作は実行できます。テーブルがメタデータや他のファイルとともに本当に削除されるのは、クエリ操作が完了してからです。</p>
<p>では、ソフト削除マークが付けられたファイルはいつ本当に削除されるのでしょうか？0.6.0より前のバージョンでは、5分間ソフト・デリートされたファイルが本当に削除されます。下図はその戦略を示しています：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5mins</span> </span></p>
<p>この戦略は、クエリは通常5分以上続かないという前提に基づいており、信頼性がありません。クエリが5分以上続くと、クエリは失敗します。その理由は、クエリが開始されると、Milvusは検索可能なファイルに関する情報を収集し、クエリタスクを作成するからです。そして、クエリスケジューラはファイルを1つずつメモリにロードし、ファイルを1つずつ検索します。ファイルのロード時にファイルが存在しなくなった場合、クエリは失敗する。</p>
<p>時間を延長することは、クエリ失敗のリスクを減らすのに役立つかもしれないが、ディスク使用量が大きくなりすぎるという別の問題も引き起こす。大量のベクターが挿入されると、Milvusは継続的にデータファイルを結合し、結合されたファイルはクエリが発生していないにもかかわらず、すぐにディスクから削除されないからです。データ挿入が速すぎたり、挿入データ量が多すぎたりすると、余分なディスク使用量が数十GBに達することがあります。例として以下の図を参照：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>結果</span> </span></p>
<p>前の図に示すように、挿入されたデータの最初のバッチ（insert_1）はディスクにフラッシュされ、file_1になり、次にinsert_2はfile_2になる。ファイルの結合を担当するスレッドは、これらのファイルをfile_3に結合する。その後、file_1とfile_2はソフト削除としてマークされる。挿入データの第3バッチはfile_4になる。スレッドはfile_3とfile_4をfile_5に結合し、file_3とfile_4をソフト削除としてマークする。</p>
<p>同様に、insert_6とinsert_5が結合される。t3では、file_5とfile_6がソフト削除としてマークされる。t3からt4の間、多くのファイルがソフト削除としてマークされているが、それらはまだディスクに残っている。ファイルが本当に削除されるのはt4以降である。したがって、t3とt4の間のディスク使用量は、64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MBである。挿入されたデータは64 + 64 + 64 + 64 = 256 MBである。ディスク使用量は挿入データの3倍である。ディスクの書き込み速度が速いほど、特定の時間帯のディスク使用量は多くなる。</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">0.6.0での削除戦略の改善<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>v0.6.0では、ファイルの削除方法を変更しました。ハード削除では、トリガーとして時間を使用しなくなりました。代わりに、ファイルがどのタスクでも使われていないときがトリガーとなる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>新戦略</span> </span></p>
<p>ベクターの2つのバッチが挿入されると仮定する。t1にクエリーリクエストが与えられ、Milvusはクエリーされる2つのファイル（file_1とfile_2。file_3が生成されると、file_1とfile_2はソフト削除としてマークされます。クエリーの後、他のタスクはfile_1とfile_2を使用しないので、t4でハード削除される。t2とt4の間隔は非常に小さく、クエリの間隔に依存する。このようにして、未使用のファイルは時間内に削除される。</p>
<p>内部的な実装としては、ソフトウェア・エンジニアにはおなじみの参照カウントを使用して、ファイルがハード・デリートされるかどうかを判断する。比較を使って説明すると、あるゲームでプレイヤーがライフを持っているとき、そのプレイヤーはまだプレイすることができる。ライフが0になるとゲームオーバーになる。Milvusは各ファイルの状態を監視している。あるファイルがタスクに使われると、そのファイルにライフが追加される。ファイルが使用されなくなると、ライフが削除される。ファイルにソフト削除のマークが付き、ライフの数が0になると、そのファイルはハード削除の準備が整ったことになる。</p>
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
<li><a href="/blog/ja/2019-11-08-data-management.md">大規模ベクトル検索エンジンにおけるデータ管理</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvusのメタデータ管理(1)：メタデータの見方</a></li>
<li><a href="/blog/ja/2019-12-27-meta-table.md">Milvusメタデータ管理(2)：メタデータテーブルのフィールド</a></li>
</ul>
