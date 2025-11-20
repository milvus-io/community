---
id: raft-or-not.md
title: 筏か否か？クラウドネイティブデータベースにおけるデータ一貫性のベストソリューション
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: なぜコンセンサスに基づくレプリケーション・アルゴリズムは、分散データベースでデータの一貫性を実現するための特効薬ではないのか？
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/xiaofan-luan">Xiaofan Luanが</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niが</a>翻訳した。</p>
</blockquote>
<p>コンセンサス・ベースのレプリケーションは、多くのクラウド・ネイティブな分散データベースで広く採用されている戦略だ。しかし、レプリケーションにはいくつかの欠点があり、銀の弾丸ではありません。</p>
<p>この投稿の目的は、クラウドネイティブな分散データベースにおけるレプリケーション、一貫性、コンセンサスの概念を説明し、PaxosやRaftのようなコンセンサスベースのアルゴリズムがなぜ特効薬ではないのかを明らかにし、最後に<a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">コンセンサスベースのレプリケーションに対する解決</a>策を提案することである。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">レプリケーション、一貫性、コンセンサスを理解する</a></li>
<li><a href="#Consensus-based-replication">コンセンサスベースのレプリケーション</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">クラウド・ネイティブ・分散データベースのログ・レプリケーション戦略</a></li>
<li><a href="#Summary">要約</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">レプリケーション、一貫性、コンセンサスを理解する<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>PaxosとRaftの長所と短所を深く掘り下げ、最適なログレプリケーション戦略を提案する前に、まずレプリケーション、一貫性、コンセンサスの概念を理解する必要がある。</p>
<p>この記事では、主にインクリメンタルなデータ/ログの同期に焦点を当てていることに注意してください。従って、データ/ログのレプリケーションについて語る場合は、履歴データではなく、増分データのみをレプリケーションすることを指す。</p>
<h3 id="Replication" class="common-anchor-header">レプリケーション</h3><p>レプリケーションとは、データの複数のコピーを作成し、異なるディスク、プロセス、マシン、クラスタなどに保存するプロセスであり、データの信頼性を高め、データクエリを高速化することを目的としています。レプリケーションではデータが複数の場所にコピーされ保存されるため、ディスク障害や物理的なマシン障害、クラスタエラーからの復旧においてデータの信頼性が高まる。さらに、データの複製を複数作成することで、クエリを大幅に高速化し、分散データベースのパフォーマンスを向上させることができます。</p>
<p>レプリケーションには、同期/非同期レプリケーション、強力/完全一貫性レプリケーション、リーダー・フォロワー/分散レプリケーションなど、さまざまなモードがあります。レプリケーション・モードの選択はシステムの可用性と一貫性に影響を与える。したがって、有名な<a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP定理で</a>提案されているように、ネットワーク分割が避けられない場合、システムアーキテクトは一貫性と可用性をトレードオフする必要がある。</p>
<h3 id="Consistency" class="common-anchor-header">一貫性</h3><p>つまり、分散データベースにおける一貫性とは、データの書き込みや読み出しの際に、全てのノードやレプリカが同じデータビューを持つことを保証する性質を指します。一貫性レベルの完全なリストについては、<a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">こちらの</a>ドキュメントを参照してください。</p>
<p>明確にするために、ここではACID（atomicity、consistency、isolation、durability）ではなく、CAP定理の一貫性について話しています。CAPの定理における一貫性とは、システム内の各ノードが同じデータを持つことを指し、ACIDにおける一貫性とは、単一のノードがすべての潜在的なコミットに対して同じルールを強制することを指す。</p>
<p>一般に、OLTP（オンライントランザクション処理）データベースは、以下のことを保証するために、強力な一貫性または線形化可能性を必要とする：</p>
<ul>
<li>各読み出しは、挿入された最新のデータにアクセスできる。</li>
<li>読み取り後に新しい値が返された場合、同じクライアントであろうと異なるクライアントであろうと、それに続くすべての読み取りは新しい値を返さなければならない。</li>
</ul>
<p>リニアライザビリティの本質は、複数のデータレプリカの再帰性を保証することである。一旦新しい値が書き込まれるか読み込まれると、その値が後で上書きされるまで、後続のすべての読み取りは新しい値を見ることができる。線形化可能性を提供する分散システムは、ユーザーが複数のレプリカを監視する手間を省くことができ、各操作の原子性と順序を保証することができる。</p>
<h3 id="Consensus" class="common-anchor-header">コンセンサス</h3><p>コンセンサスという概念が分散システムに導入されたのは、分散システムがスタンドアロンシステムと同じように動作することをユーザーが切望しているからである。</p>
<p>簡単に言うと、コンセンサスとは価値に対する一般的な合意である。例えば、SteveとFrankが何か食べに行こうとした。スティーブはサンドイッチを食べることを提案した。フランクはスティーブの提案に同意し、二人ともサンドイッチを食べた。彼らはコンセンサスに達した。より具体的には、どちらかが提案した価値（サンドイッチ）が両者によって合意され、その価値に基づいて両者が行動を起こす。同様に、分散システムにおけるコンセンサスとは、あるプロセスがある値を提案すると、システム内の残りのすべてのプロセスがその値に同意し、その値に基づいて行動することを意味する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>コンセンサス</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">コンセンサスに基づく複製<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>最も初期のコンセンサスベースのアルゴリズムは、1988年に<a href="https://pmg.csail.mit.edu/papers/vr.pdf">ビュースタンプレプリケーションと共に</a>提案された。1989年にはLeslie Lamportがコンセンサスベースのアルゴリズムである<a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxosを</a>提案した。</p>
<p>近年では、コンセンサスベースのアルゴリズムである<a href="https://raft.github.io/">Raftが</a>業界で普及している。Raftは、CockroachDB、TiDB、OceanBaseなど、多くの主流のNewSQLデータベースで採用されている。</p>
<p>注目すべきは、分散システムがコンセンサスベースのレプリケーションを採用したとしても、必ずしも線形化可能性をサポートするとは限らないということである。しかし、線形化可能性はACID分散データベースを構築するための前提条件である。</p>
<p>データベースシステムを設計する際には、ログとステートマシンのコミット順序を考慮する必要がある。また、PaxosやRaftのリーダー・リースを維持し、ネットワーク・パーティション下でのスプリットブレインを防ぐためには、特に注意が必要である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Raftレプリケーション・ステートマシン</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">長所と短所</h3><p>実際、Raft、ZAB、Auroraの<a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">クォーラムベースのログプロトコルは</a>すべてPaxosのバリエーションです。コンセンサスベースのレプリケーションには次のような利点があります：</p>
<ol>
<li>コンセンサスに基づくレプリケーションは、CAP定理における一貫性とネットワーク分割により重点を置いているが、従来のリーダー・フォロワーレプリケーションと比較して、比較的優れた可用性を提供する。</li>
<li>Raftは、コンセンサスベースのアルゴリズムを大幅に簡素化した画期的なものである。GitHubにはオープンソースのRaftライブラリが多数公開されている（例：<a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>）。</li>
<li>コンセンサスベースのレプリケーションの性能は、ほとんどのアプリケーションとビジネスを満足させることができる。高性能SSDとギガバイトのNIC（ネットワークインターフェースカード）の普及により、複数のレプリカを同期させる負担が軽減され、PaxosとRaftアルゴリズムが業界の主流になっている。</li>
</ol>
<p>誤解のひとつに、コンセンサスベースのレプリケーションは分散データベースでデータの一貫性を実現するための特効薬であるというものがあります。しかし、これは真実ではありません。コンセンサス・ベースのアルゴリズムが直面する可用性、複雑性、性能の課題が、完璧なソリューションであることを阻んでいるのです。</p>
<ol>
<li><p>妥協した可用性 最適化されたPaxosやRaftアルゴリズムは、リーダーレプリカに強く依存しており、グレー障害に対抗する能力が弱い。コンセンサスベースのレプリケーションでは、リーダーノードが長時間応答しない限り、新しいリーダーレプリカの選出は行われません。そのため、コンセンサスベースのレプリケーションでは、リーダーノードの動作が遅い場合や、スラッシングが発生した場合に対処できない。</p></li>
<li><p>複雑性 PaxosとRaftをベースにした拡張アルゴリズムはすでに数多く存在するが、<a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">マルチRaftと</a> <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">パラレルRaftの</a>出現により、ログとステートマシン間の同期についてより多くの検討とテストが必要となる。</p></li>
<li><p>パフォーマンスの低下 クラウドネイティブの時代には、データの信頼性と一貫性を確保するために、ローカルストレージはEBSやS3のような共有ストレージソリューションに取って代わられる。その結果、コンセンサスベースのレプリケーションは分散システムにとってもはや必須ではなくなった。さらに、コンセンサス・ベースのレプリケーションには、ソリューションとEBSの両方に複数のレプリカがあるため、データの冗長性の問題が伴う。</p></li>
</ol>
<p>マルチデータセンターやマルチクラウドのレプリケーションでは、一貫性を追求するあまり、可用性だけでなく<a href="https://en.wikipedia.org/wiki/PACELC_theorem">レイテンシも</a>損なわれ、結果としてパフォーマンスが低下する。そのため、ほとんどのアプリケーションでは、マルチデータセンターのディザスタ・トレランスのために線形化可能性は必須ではありません。</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">クラウドネイティブな分散データベースのためのログ複製戦略<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>RaftやPaxosのようなコンセンサスベースのアルゴリズムが、多くのOLTPデータベースで採用されている主流のアルゴリズムであることは否定できない。しかし、<a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>プロトコル、<a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a>、<a href="https://rockset.com/">Rocksetの</a>例を見ると、トレンドが変わりつつあることがわかる。</p>
<p>クラウドネイティブな分散データベースに最適なソリューションには、2つの大原則がある。</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1.サービスとしてのレプリケーション</h3><p>データ同期専用の独立したマイクロサービスが必要である。同期モジュールとストレージモジュールは、もはや同じプロセス内で緊密に結合されるべきではない。</p>
<p>例えば、Socratesはストレージ、ログ、コンピューティングを分離している。専用のログサービス（下図中央のXLogサービス）が1つある。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>ソクラテスのアーキテクチャ</span> </span></p>
<p>XLogサービスは個別のサービスです。データの永続性は、低遅延ストレージの助けを借りて達成される。Socratesのランディングゾーンは3つのレプリカを高速に保持する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Socrates XLogサービス</span> </span></p>
<p>リーダーノードはログを非同期にログブローカーに配信し、Xstoreにデータをフラッシュします。ローカルSSDキャッシュはデータの読み込みを高速化することができます。データのフラッシュが成功すると、ランディングゾーンのバッファをクリーニングすることができます。明らかに、すべてのログデータは、ランディングゾーン、ローカルSSD、XStoreの3つのレイヤーに分割されます。</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2.ロシア人形の原理</h3><p>システムを設計する1つの方法は、ロシア人形の原則に従うことである。各レイヤーは完全であり、そのレイヤーが行うことに完全に適しているため、他のレイヤーをそのレイヤーの上や周りに構築することができる。</p>
<p>クラウドネイティブ・データベースを設計する際には、システム・アーキテクチャの複雑さを軽減するために、他のサードパーティ・サービスを巧みに活用する必要がある。</p>
<p>単一障害点を回避するためにPaxosを利用することはできないようだ。しかし、リーダー選出をRaftや<a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>、<a href="https://github.com/bloomreach/zk-replicator">Zk</a>、<a href="https://etcd.io/">etcdを</a>ベースとしたPaxosサービスに委ねることで、ログのレプリケーションを大幅に簡素化することができる。</p>
<p>例えば、<a href="https://rockset.com/">Rockset</a>アーキテクチャはロシア人形の原理に従い、分散ログにKafka/Kineses、ストレージにS3、クエリパフォーマンス向上のためにローカルSSDキャッシュを使用している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Rocksetアーキテクチャ</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Milvusのアプローチ</h3><p>Milvusの調整可能な一貫性は、実はコンセンサスベースのレプリケーションにおけるフォロワーリードに似ている。フォロワーリードとは、フォロワーレプリカを使って、強い一貫性を前提にデータの読み込みを行うことである。その目的は、クラスタのスループットを向上させ、リーダーの負荷を軽減することである。フォロワリード機能の仕組みは、最新のログのコミットインデックスを取得し、コミットインデックスにある全てのデータがステートマシンに適用されるまでクエリサービスを提供する。</p>
<p>しかし、Milvusの設計では、フォロワー戦略を採用していない。つまり、Milvusは、問い合わせ要求を受け取るたびにコミットインデックスを問い合わせるわけではない。その代わりに、Milvusは<a href="https://flink.apache.org/">Flinkの</a>透かしのような機構を採用し、一定間隔でコミットインデックスの位置を問い合わせノードに通知する。このような機構を採用した理由は、Milvusのユーザは通常データの一貫性を強く要求することはなく、システムの性能向上のためならデータの可視性の妥協を受け入れることができるからである。</p>
<p>さらに、Milvusは複数のマイクロサービスを採用し、ストレージとコンピューティングを分離している。<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvusアーキテクチャでは</a>、S3、MinIo、Azure Blobがストレージとして使用されている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvusアーキテクチャ</span> </span></p>
<h2 id="Summary" class="common-anchor-header">概要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>昨今、ログレプリケーションを個別のサービスとして提供するクラウドネイティブデータベースが増えている。そうすることで、読み取り専用のレプリカや異種レプリケーションを追加するコストを削減できる。複数のマイクロサービスを利用することで、従来のデータベースでは不可能だった、成熟したクラウドベースのインフラを迅速に利用することができる。個々のログサービスは、コンセンサスベースのレプリケーションに依存することもできるが、ロシア人形戦略に従って、PaxosやRaftとともに様々な一貫性プロトコルを採用し、線形可用性を実現することもできる。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos made simple[J].ACM SIGACT News (Distributed Computing Column) 32, 4 (Whole Number 121, December 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandingable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14).2014:305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication：高可用性分散システムをサポートする新しい一次コピー方式[C]//Proceedings of the 7th annual ACM Symposium on Principles of Distributed Computing.1988: 8-17.</li>
<li>PacificA: ログベースの分散ストレージシステムにおけるレプリケーション[J].2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora：i/os、コミット、メンバシップ変更の分散コンセンサスの回避について[C]//Proceedings of the 2018 International Conference on Management of Data.2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al：The new sql server in the cloud[C]//Proceedings of the 2019 International Conference on Management of Data.2019: 1743-1756.</li>
</ul>
