---
id: deleting-data-in-milvus.md
title: まとめ
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: Milvus v0.7.0では、削除をより効率的にし、より多くのインデックスタイプをサポートするために、全く新しいデザインを考案しました。
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Milvusによる削除機能の実現方法</custom-h1><p>この記事では、Milvusがどのようにdelete機能を実装しているかを扱います。Milvus v0.7.0では、多くのユーザが待ち望んでいたdelete機能が導入されました。FAISSのremove_idsを直接呼び出すのではなく、削除をより効率的にし、より多くのインデックスタイプをサポートするために、全く新しい設計を考えました。</p>
<p><a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Milvusの動的データ更新とクエリの実現</a>」では、データ挿入からデータ洗浄までの全プロセスを紹介しました。基本的なことをおさらいしましょう。MemManagerがすべてのインサートバッファを管理し、各MemTableがコレクションに対応する（Milvus v0.7.0では "テーブル "を "コレクション "に改名した）。Milvusはメモリに挿入されたデータを自動的に複数のMemTableFilesに分割します。データがディスクにフラッシュされると、各MemTableFileはrawファイルにシリアライズされる。delete関数を設計する際も、このアーキテクチャを維持しました。</p>
<p>deleteメソッドの機能は、特定のコレクション内の指定されたエンティティIDに対応するすべてのデータを削除することです。この関数を開発する際、2つのシナリオを想定しました。1つ目は、挿入バッファに残っているデータを削除すること、2つ目は、ディスクにフラッシュされたデータを削除することです。最初のシナリオはより直感的です。指定されたIDに対応するMemTableFileを見つけ、メモリ上のデータを直接削除することができる（図1）。データの削除と挿入を同時に行うことはできず、データをフラッシュするときにMemTableFileをミュータブルからイミュータブルに変更するメカニズムがあるため、削除はミュータブル・バッファでのみ実行される。このように、削除操作はデータのフラッシュと衝突しないため、データの一貫性が保証される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>ほとんどの場合、データはディスクにフラッシュされる前に挿入バッファに短時間留まるからである。ハード削除のためにフラッシュされたデータをメモリにロードするのは非効率的であるため、より効率的なアプローチであるソフト削除を採用することにした。ソフト削除では、フラッシュされたデータを実際に削除する代わりに、削除されたIDを別のファイルに保存する。こうすることで、検索などの読み取り操作の際に、削除されたIDをフィルタリングすることができる。</p>
<p>実装に関しては、考慮すべき問題がいくつかある。Milvusでは、データはディスクにフラッシュされたときにのみ見える、言い換えれば回復可能である。したがって、フラッシュされたデータはdeleteメソッド呼び出し時に削除されるのではなく、次のフラッシュ操作で削除される。ディスクにフラッシュされたデータ・ファイルには新しいデータが含まれなくなるため、ソフト削除はフラッシュされたデータに影響を与えないからです。削除を呼び出すと、挿入バッファに残っているデータを直接削除できますが、フラッシュされたデータについては、削除されたデータのIDをメモリに記録する必要があります。Milvusはデータをディスクにフラッシュする際、削除されたIDをDELファイルに書き込み、対応するセグメント内のどのエンティティが削除されたかを記録します。これらの更新は、データのフラッシュが完了した後にのみ表示される。このプロセスを図2に示す。v0.7.0以前は、自動フラッシュメカニズムしかありませんでした。つまり、Milvusは1秒ごとにインサートバッファ内のデータをシリアライズしていました。つまり、Milvusは1秒ごとに挿入バッファ内のデータをシリアライズします。新しい設計では、開発者が削除メソッドの後に呼び出すことができるフラッシュ・メソッドを追加し、新しく挿入されたデータが表示され、削除されたデータが回復できなくなるようにしました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>2つ目の問題は、Milvusでは生データファイルとインデックスファイルは2つの独立したファイルであり、メタデータにおいても2つの独立したレコードであるということです。指定されたIDを削除する場合、そのIDに対応する生ファイルとインデックスファイルを探し出し、一緒に記録する必要がある。そこで、セグメントという概念を導入した。セグメントには、生ファイル（生ベクトルファイルとIDファイルが含まれる）、インデックスファイル、DELファイルが含まれる。セグメントとは、Milvusでベクターの読み書きや検索を行うための最も基本的な単位である。コレクション（図3）は複数のセグメントで構成されます。したがって、ディスク内のコレクションフォルダの下に複数のセグメントフォルダが存在する。Milvusのメタデータはリレーショナルデータベース（SQLiteまたはMySQL）に基づいているため、セグメント内の関係を記録するのは非常に簡単である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>3つ目の問題は、検索時に削除されたデータをどのようにフィルタリングするかである。実際には、DELによって記録されるIDは、セグメントに格納されている対応するデータのオフセットである。フラッシュされたセグメントには新しいデータは含まれないので、オフセットは変化しない。DELのデータ構造はメモリ上のビットマップであり、アクティブなビットは削除されたオフセットを表す。FAISS で検索した場合、アクティブビットに対応するベクトルは距離計算に含まれなくなる（図 4）。FAISSの変更点については、ここでは詳述しない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>最後の問題は、パフォーマンス向上に関するものである。フラッシュされたデータを削除するとき、まず、削除されたIDがコレクションのどのセグメントにあるかを見つけ、そのオフセットを記録する必要がある。最も単純な方法は、各セグメント内のすべてのIDを検索することです。私たちが考えている最適化は、各セグメントにブルームフィルターを追加することです。ブルームフィルターは、要素が集合のメンバーであるかどうかをチェックするために使用されるランダムなデータ構造です。したがって、各セグメントのブルームフィルターだけを読み込むことができます。削除された ID が現在のセグメ ントにあるとブルーム・フィルターが判断した場合にのみ、セグメント内の対応するオフセットを見つけ ることができる。それ以外の場合は、このセグメントを無視することができる（図 5）。ブルーム・フィルターを選択した理由は、ハッシュ・テーブルのような多くの同種のものよりも、使用するスペースが少なく、検索効率が高いからである。ブルームフィルタには一定の誤検出率があるが、確率を調整するために、検索が必要なセグメントを理想的な数まで減らすことができる。一方、ブルームフィルタは削除にも対応する必要がある。そうしないと、削除されたエンティティ ID がまだブルームフィルタで検出される可能性があり、結果として誤検出率が高まります。このため、削除をサポートするカウント・ブルーム・フィルタを使用する。この記事では、ブルームフィルタがどのように動作するかについては詳しく説明しません。興味があればウィキペディアを参照されたい。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-削除リクエスト-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">まとめ<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>ここまで、MilvusがどのようにIDでベクトルを削除するのかについて簡単に紹介しました。ご存知のように、Milvusではソフト削除を利用して、流したデータを削除しています。削除されたデータが増えるにつれて、削除されたデータが占める領域を解放するために、コレクション内のセグメントをコンパクトにする必要があります。また、すでにインデックスが作成されているセグメントも、コンパクト化によって以前のインデックスファイルが削除され、新しいインデックスが作成されます。今のところ、開発者はデータをコンパクトにするために compact メソッドをコールする必要があります。将来的には、検査メカニズムを導入したいと考えています。例えば、削除されたデータ量がある閾値に達した場合や、削除後にデータ分布が変化した場合、milvusは自動的にセグメントをコンパクト化します。</p>
<p>以上、削除機能の設計思想と実装について紹介した。まだまだ改良の余地はありますので、ご意見・ご感想をお待ちしております。</p>
<p>Milvusについて知る: https://github.com/milvus-io/milvus。また、私たちのコミュニティ<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slackに</a>参加して技術的なディスカッションをすることもできます！</p>
