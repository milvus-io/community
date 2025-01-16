---
id: mishards-distributed-vector-search-milvus.md
title: 分散アーキテクチャの概要
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: スケールアウトの方法
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Milvusにおける分散ベクトル検索</custom-h1><p>Milvusは、大規模ベクトルの効率的な類似性検索と分析を実現することを目指しています。スタンドアロンのMilvusインスタンスであれば、10億スケールのベクトル検索を容易に扱うことができる。しかし、100億、1000億、あるいはそれ以上の規模のデータセットに対しては、Milvusクラスタが必要となる。クラスタは上位アプリケーションのスタンドアロンインスタンスとして使用でき、大規模データに対する低レイテンシ、高並行性というビジネスニーズを満たすことができる。Milvusクラスタはリクエストの再送、読み込みと書き込みの分離、水平スケール、動的拡張が可能であり、無制限に拡張可能なMilvusインスタンスを提供します。MishardsはMilvusの分散ソリューションである。</p>
<p>本記事ではMishardsアーキテクチャのコンポーネントを簡単に紹介する。より詳細な情報は次回の記事で紹介する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">分散アーキテクチャの概要<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-分散アーキテクチャの概要.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">サービストレーシング<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-サービストレーシング-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">主なサービスコンポーネント<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>ZooKeeper、etcd、Consulなどのサービスディスカバリフレームワーク。</li>
<li>ロードバランサー：Nginx、HAProxy、Ingress Controllerなど。</li>
<li>Mishardsノード：ステートレス、スケーラブル。</li>
<li>書き込み専用のmilvusノード：シングルノードでスケーラブルではない。単一障害点を避けるため、このノードには高可用性ソリューションを使用する必要がある。</li>
<li>読み取り専用のMilvusノード：ステートフルノードでスケーラブル。</li>
<li>共有ストレージサービス：全てのMilvusノードはNASやNFSなどの共有ストレージサービスを使用してデータを共有します。</li>
<li>メタデータサービス：全てのMilvusノードがこのサービスを利用してメタデータを共有します。現在、MySQLのみがサポートされています。このサービスにはMySQLの高可用性ソリューションが必要です。</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">スケーラブルコンポーネント<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>ミシャード</li>
<li>読み取り専用のMilvusノード</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">コンポーネント紹介<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mishardsノード</strong></p>
<p>Mishardsはアップストリームリクエストを分割し、サブリクエストをサブサービスにルーティングする。結果はアップストリームに返すために要約される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-ミシャード・ノード.jpg</span> </span></p>
<p>上の図にあるように、TopK検索リクエストを受け付けると、Mishardsはまずリクエストをサブリクエストに分割し、そのサブリクエストを下流のサービスに送る。すべてのサブレスポンスが収集されると、サブレスポンスはマージされ、アップストリームに返される。</p>
<p>Mishardsはステートレス・サービスであるため、データを保存したり、複雑な計算に参加したりすることはありません。そのため、ノードは高い設定要件を必要とせず、計算能力は主にサブ結果のマージに使用されます。そのため、Mishardsノードの数を増やして高い同時実行性を実現することが可能です。</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Milvusノード<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusノードはCRUD関連のコア操作を担当するため、構成要件が比較的高くなります。第一に、ディスクIOオペレーションが多くなりすぎないよう、メモリサイズを十分に大きくする必要があります。次に、CPUの構成もパフォーマンスに影響します。クラスタサイズが大きくなると、システムのスループットを向上させるために、より多くのmilvusノードが必要になります。</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">読み取り専用ノードと書き込み可能ノード</h3><ul>
<li>Milvusのコアオペレーションはベクトル挿入と検索である。検索はCPUとGPUのコンフィギュレーションに対する要求が極めて高いが、挿入やその他のオペレーションは比較的要求が低い。検索を実行するノードとその他のオペレーションを実行するノードを分離することで、より経済的な展開が可能になる。</li>
<li>サービス品質の面では、あるノードが検索オペレーションを実行している場合、関連ハードウェアは全負荷で動作しており、他のオペレーションのサービス品質を確保することができない。そのため、2種類のノードが使用される。検索要求は読み取り専用ノードによって処理され、その他の要求は書き込み可能ノードによって処理される。</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">書き込み可能なノードは1つのみ</h3><ul>
<li><p>現在、Milvusは複数の書き込み可能インスタンスのデータ共有をサポートしていません。</p></li>
<li><p>デプロイ時には、書き込み可能ノードの単一障害点を考慮する必要があります。書き込み可能なノードには高可用性ソリューションを準備する必要があります。</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">読み取り専用ノードのスケーラビリティ</h3><p>データサイズが非常に大きい場合、またはレイテンシ要件が非常に高い場合、読み取り専用ノードをステートフルノードとして水平方向に拡張することができます。ホストが4台あり、それぞれが以下の構成であると仮定します：CPUコア16、GPU：CPUコア：16、GPU：1、メモリ：64GB。次の図は、ステートフル・ノードを水平スケールした場合のクラスタを示しています。コンピューティングパワーとメモリはともにリニアにスケールします。データは8つのシャードに分割され、各ノードは2つのシャードからのリクエストを処理します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>いくつかのシャードでリクエスト数が多い場合、スループットを向上させるために、これらのシャードにステートレス読み取り専用ノードを配置することができる。上のホストを例にとると、ホストをサーバーレスクラスターにまとめると、コンピューティングパワーはリニアに増加する。処理するデータは増えないため、同じデータシャードの処理能力も線形に増加する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">メタデータ・サービス</h3><p>キーワードMySQL</p>
<p>Milvusメタデータの詳細については、メタデータの表示方法を参照してください。分散システムにおいて、Milvus書き込み可能ノードはメタデータの唯一の生成者である。Milvusノード、Milvus書き込み可能ノード、Milvus読み取り専用ノードはすべてメタデータの消費者です。現在、MilvusはメタデータのストレージバックエンドとしてMySQLとSQLiteのみをサポートしています。分散システムでは、このサービスは高可用性のMySQLとしてのみデプロイ可能である。</p>
<h3 id="Service-discovery" class="common-anchor-header">サービスディスカバリー</h3><p>キーワードApache Zookeeper、etcd、Consul、Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-service-discovery.png</span> </span></p>
<p>サービスディスカバリは、すべてのMilvusノードに関する情報を提供する。Milvusノードはオンラインになると情報を登録し、オフラインになるとログアウトする。Milvusノードは定期的にサービスのヘルスステータスをチェックすることで、異常なノードを検出することもできる。</p>
<p>サービスディスカバリにはetcd、Consul、ZooKeeperなど多くのフレームワークが含まれています。Mishardsはサービスディスカバリインターフェースを定義し、プラグインによるスケーリングの可能性を提供します。現在、MishardsはKubernetesクラスタと静的構成の2種類のプラグインを提供している。これらのプラグインの実装に従うことで、独自のサービスディスカバリをカスタマイズすることができる。インターフェースは一時的なもので、再設計が必要です。独自のプラグインを書くことについての詳細は、次回の記事で詳しく説明する。</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">ロードバランシングとサービスシャーディング</h3><p>キーワードNginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>サービスディスカバリとロードバランシングは一緒に使われる。ロードバランシングはポーリング、ハッシュ、一貫したハッシュとして設定できる。</p>
<p>ロードバランサーはユーザーのリクエストをMishardsノードに再送する役割を担う。</p>
<p>各Mishardsノードはサービスディスカバリーセンターを通じて、すべての下流Milvusノードの情報を取得します。関連するすべてのメタデータはメタデータサービスによって取得することができます。Mishardsはこれらのリソースを消費することでシャーディングを実装します。Mishardsはルーティング戦略に関連するインターフェースを定義し、プラグインによる拡張機能を提供します。現在、Mishardsは最小セグメントレベルに基づく一貫したハッシュ戦略を提供しています。図に示すように、s1からs10の10個のセグメントがある。セグメントベースの一貫したハッシュ戦略により、Mishardsはs1、24、s6、s9に関するリクエストをMilvus 1ノードに、s2、s3、s5をMilvus 2ノードに、s7、s8、s10をMilvus 3ノードにルーティングします。</p>
<p>ビジネスニーズに基づき、デフォルトの一貫したハッシングルーティングプラグインに従ってルーティングをカスタマイズすることができます。</p>
<h3 id="Tracing" class="common-anchor-header">トレース</h3><p>キーワードOpenTracing、Jaeger、Zipkin</p>
<p>分散システムの複雑さを考えると、リクエストは複数の内部サービス呼び出しに送られます。問題を特定するために、内部サービス呼び出しチェーンをトレースする必要があります。複雑さが増すにつれて、利用可能なトレースシステムの利点は自明である。私たちはCNCF OpenTracing標準を選びました。OpenTracingは、開発者がトレースシステムを便利に実装するための、プラットフォームに依存しない、ベンダーに依存しないAPIを提供します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>前の図は、検索呼び出し中のトレースの例です。検索は<code translate="no">get_routing</code> 、<code translate="no">do_search</code> 、<code translate="no">do_merge</code> を連続して呼び出している。<code translate="no">do_search</code> は<code translate="no">search_127.0.0.1</code> も呼び出している。</p>
<p>全体のトレース記録は以下のツリーを形成する：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>次の図は、各ノードのリクエスト/レスポンス情報とタグの例を示しています：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png。</span> </span></p>
<p>OpenTracingがmilvusに統合されました。詳細は次回の記事で紹介します。</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">モニタリングとアラート</h3><p>キーワードPrometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
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
    </button></h2><p>サービス・ミドルウェアとして、Mishardsはサービスの発見、リクエストのルーティング、結果のマージ、トレースを統合している。プラグインベースの拡張も提供されている。現在のところ、Mishardsをベースにした分散ソリューションにはまだ以下の欠点がある：</p>
<ul>
<li>Mishardsはミドルレイヤーとしてプロキシを使用しており、レイテンシーコストがある。</li>
<li>Milvus書き込み可能ノードはシングルポイントサービスである。</li>
<li>複数のシャードがあり、1つのシャードが複数のコピーを持つ場合、展開が複雑になる。</li>
<li>メタデータへのアクセスなどのキャッシュレイヤーがない。</li>
</ul>
<p>Mishardsをより便利に本番環境に適用できるよう、次期バージョンではこれらの既知の問題を修正する予定です。</p>
