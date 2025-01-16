---
id: deep-dive-6-oss-qa.md
title: オープンソースソフトウェア（OSS）の品質保証 - Milvusのケーススタディ
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: 品質保証とは、製品やサービスが一定の要件を満たしているかどうかを判断するプロセスである。
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/zhuwenxing">Wenxing Zhuによって</a>書かれ、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niによって</a>翻訳されました。</p>
</blockquote>
<p>品質保証（QA）とは、製品やサービスが特定の要件を満たしているかどうかを判断する体系的なプロセスである。QAシステムは、その名の通り、製品の品質を保証するものであり、研究開発プロセスにおいて欠かすことのできないものである。</p>
<p>本記事では、Milvusベクターデータベースの開発において採用されたQAフレームワークを紹介し、貢献する開発者やユーザーがプロセスに参加するためのガイドラインを提供することを目的とする。また、Milvusの主要なテストモジュールや、QAテストの効率を向上させるために活用できる手法やツールについても取り上げます。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">MilvusQAシステムの一般的な紹介</a></li>
<li><a href="#Test-modules-in-Milvus">Milvusのテストモジュール</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">QA効率化のためのツールと手法</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Milvus QAシステムの概要<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>QAテストを実施する上で、<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">システムアーキテクチャは</a>非常に重要です。QAエンジニアがシステムを熟知していればいるほど、合理的かつ効率的なテスト計画を立てることができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvusアーキテクチャ</span> </span></p>
<p>Milvus2.0は、<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">クラウドネイティブ、分散、レイヤードアーキテクチャを</a>採用しており、SDKはMilvusにおける<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">データの</a>流れの<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">主要な入り口となって</a>いる。MilvusユーザーはSDKを頻繁に利用するため、SDK側の機能テストが非常に必要となります。また、SDKの機能テストは、Milvusシステム内に存在するかもしれない内部的な問題を検出するのに役立ちます。機能テスト以外にも、ユニットテスト、デプロイテスト、信頼性テスト、安定性テスト、パフォーマンステストなど、様々な種類のテストがベクターデータベース上で実施される。</p>
<p>クラウドネイティブで分散型のアーキテクチャは、QAテストに利便性と課題の両方をもたらす。ローカルにデプロイされ実行されるシステムとは異なり、Kubernetesクラスタ上にデプロイされ実行されるMilvusインスタンスは、ソフトウェア開発と同じ状況下でソフトウェアテストを確実に実施することができる。しかし、デメリットとしては、分散アーキテクチャの複雑さが、システムのQAテストをさらに難しく、大変なものにする不確実性をもたらすことだ。例えば、Milvus 2.0では様々なコンポーネントのマイクロサービスを使用しているため、<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">サービスやノードの</a>数が増え、システムエラーが発生する可能性が高くなる。そのため、より洗練された包括的なQAプランが、テスト効率の向上のために必要となる。</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">QAテストと課題管理</h3><p>MilvusにおけるQAには、テストの実施とソフトウェア開発中に発生した問題の管理の両方が含まれます。</p>
<h4 id="QA-testings" class="common-anchor-header">QAテスト</h4><p>Milvusでは、Milvusの機能やユーザーニーズに応じて、下図のような優先順位で様々なタイプのQAテストを実施しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>QAテストの優先順位</span> </span></p>
<p>MilvusのQAテストは、以下の優先順位で実施されます：</p>
<ol>
<li><strong>機能</strong>機能：機能や特徴が当初の設計通りに動作するかを検証する。</li>
<li><strong>デプロイメント</strong>Milvus スタンドアロン版と Milvus クラスタ版を異なる方法(Docker Compose、Helm、APT、YUM など)でデプロイ、再インストール、アップグレードできるかを確認する。</li>
<li><strong>パフォーマンス</strong> Milvusのデータ挿入、インデックス作成、ベクトル検索、クエリのパフォーマンスをテストする。</li>
<li><strong>安定性</strong>Milvusが通常レベルのワークロードで5～10日間安定稼働するかを確認する。</li>
<li><strong>信頼性</strong>特定のシステムエラーが発生した場合でも、Milvusが部分的に機能するかどうかをテストする。</li>
<li><strong>設定</strong>：Milvusが特定の環境下で期待通りに動作するかを検証する。</li>
<li><strong>互換性</strong>Milvusが異なるハードウェアやソフトウェアと互換性があるかどうかを検証する。</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">問題管理</h4><p>ソフトウェア開発中には様々な問題が発生します。テンプレート化された問題の作成者は、QAエンジニア自身であったり、オープンソースコミュニティのMilvusユーザであったりします。QAチームはその問題を解決する責任を負います。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>課題管理ワークフロー</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus/issues">課題が</a>作成されると、まずトリアージが行われます。トリアージでは、新しいissueが精査され、issueの詳細が十分に提供されていることが確認されます。issueが確認されると、開発者に受け入れられ、開発者はissueの修正を試みます。開発が完了すると、issueの作成者はそれが修正されたかどうかを確認する必要があります。問題が修正された場合、その課題は最終的にクローズされます。</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">QAはいつ必要なのか？</h3><p>よくある誤解として、QAと開発は互いに独立しているというものがある。しかし実際には、システムの品質を保証するためには、開発者とQAエンジニアの両方の努力が必要である。したがって、QAはライフサイクル全体を通して関わる必要がある。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>QAライフサイクル</span> </span></p>
<p>上の図に示すように、ソフトウェアの研究開発ライフサイクルには3つの段階がある。</p>
<p>初期段階では、開発者が設計文書を公開する一方で、QAエンジニアがテスト計画を立案し、リリース基準を定義し、QAタスクを割り当てます。開発者とQAエンジニアは、リリースの目的（機能、パフォーマンス、安定性、バグの収束など）についての相互理解が両チーム間で共有されるように、設計書とテスト計画の両方に精通している必要があります。</p>
<p>研究開発期間中、開発とQAテストは頻繁にやり取りを行い、機能や特徴の開発・検証を行い、<a href="https://slack.milvus.io/">オープンソースコミュニティから</a>報告されたバグや問題も修正する。</p>
<p>最終段階では、リリース基準を満たした場合、Milvus新バージョンのDockerイメージがリリースされます。正式リリースには、新機能と修正されたバグに焦点を当てたリリースノートとリリースタグが必要です。その後、QAチームはこのリリースに関するテストレポートも公開します。</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Milvusのテストモジュール<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusにはいくつかのテストモジュールがありますが、ここでは各モジュールについて詳しく説明します。</p>
<h3 id="Unit-test" class="common-anchor-header">ユニットテスト</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>ユニットテスト</span> </span></p>
<p>ユニットテストは、ソフトウェアのバグを早期に発見し、コード再構築の検証基準を提供するのに役立ちます。Milvusのプルリクエスト(PR)受け入れ基準によると、コードのユニットテストの<a href="https://app.codecov.io/gh/milvus-io/milvus/">カバレッジは</a>80%である必要があります。</p>
<h3 id="Function-test" class="common-anchor-header">機能テスト</h3><p>Milvusの機能テストは主に<a href="https://github.com/milvus-io/pymilvus">PyMilvusと</a>SDKを中心に構成されています。機能テストの主な目的は、インタフェースが設計通りに動作するかどうかを検証することです。機能テストには2つの側面があります：</p>
<ul>
<li>正しいパラメータが渡されたときにSDKが期待される結果を返すことができるかどうかのテスト。</li>
<li>間違ったパラメータが渡されたときに、SDKがエラーを処理し、妥当なエラーメッセージを返すことができるかどうかをテストする。</li>
</ul>
<p>下図は、主流の<a href="https://pytest.org/">pytest</a>フレームワークに基づいている関数テストの現在のフレームワークを示しています。このフレームワークはPyMilvusにラッパーを追加し、自動化されたテストインタフェースでテストを強化します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>関数テスト</span> </span></p>
<p>共有のテスト手法が必要であり、いくつかの関数を再利用する必要があることを考慮し、PyMilvusのインターフェースを直接使用するのではなく、上記のテストフレームワークを採用しています。check "モジュールもフレームワークに含まれ、期待値と実際の値の検証に利便性をもたらします。</p>
<p>2,700もの関数テストケースが<code translate="no">tests/python_client/testcases</code> ディレクトリに組み込まれており、ほぼすべての PyMilvus インタフェースを完全にカバーしています。これらの関数テストは各PRの品質を厳密に監視します。</p>
<h3 id="Deployment-test" class="common-anchor-header">デプロイメントテスト</h3><p>Milvusには<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">スタンドアロンと</a> <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">クラスタの</a>2つのモードがあります。また、Milvusをデプロイする方法は大きく分けてDocker Composeを使う方法とHelmを使う方法があります。また、Milvusをデプロイした後、Milvusサービスの再起動やアップグレードを行うこともできる。デプロイテストには大きく分けて再起動テストとアップグレードテストの2種類がある。</p>
<p>再起動テストとは、データの永続性、つまり再起動後もデータが利用可能かどうかをテストするプロセスを指します。アップグレードテストとは、互換性のない形式のデータがmilvusに挿入される事態を防ぐために、データの互換性をテストするプロセスを指す。この2種類のデプロイメントテストは、下図のように同じワークフローを共有します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>配置テスト</span> </span></p>
<p>再起動テストでは、2つのデプロイメントで同じ docker イメージを使用します。しかしアップグレードテストでは、1つ目のデプロイメントでは以前のバージョンの docker イメージを使用し、2つ目のデプロイメントではそれ以降のバージョンの docker イメージを使用します。テスト結果とデータは<code translate="no">Volumes</code> ファイルまたは<a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">永続ボリュームクレーム</a>（PVC）に保存される。</p>
<p>最初のテストを実行するとき、複数のコレクションが作成され、それぞれのコレクションに対して異なる操作が行われる。2番目のテストを実行する場合、作成されたコレクションがCRUD操作でまだ利用可能かどうか、新しいコレクションをさらに作成できるかどうかを検証することに主眼が置かれます。</p>
<h3 id="Reliability-test" class="common-anchor-header">信頼性テスト</h3><p>クラウドネイティブ分散システムの信頼性に関するテストは、通常、エラーやシステム障害の芽を摘むことを目的としたカオスエンジニアリング手法を採用する。つまり、カオスエンジニアリングのテストでは、意図的にシステム障害を発生させることで、プレッシャーテストにおける問題を特定し、システム障害が本当に危険な状態になる前に修正する。Milvusのカオステストでは、<a href="https://chaos-mesh.org/">カオスを</a>作り出すツールとして<a href="https://chaos-mesh.org/">カオスメッシュを</a>選択する。作成が必要な障害にはいくつかの種類がある：</p>
<ul>
<li><strong>ポッドキル</strong>：ノードがダウンするシナリオのシミュレーション。</li>
<li><strong>ポッド障害</strong>：ワーカーノードのポッドの1つが故障した場合、システム全体がまだ動作し続けることができるかどうかをテストする。</li>
<li><strong>メモリ・ストレス</strong>：作業ノードがメモリとCPUリソースを大量に消費するシミュレーション。</li>
<li><strong>ネットワーク・パーティション</strong>：Milvusは<a href="https://milvus.io/docs/v2.0.x/four_layers.md">ストレージとコンピューティングを分離している</a>ため、システムは様々なコンポーネント間の通信に大きく依存している。異なるMilvusコンポーネントの相互依存性をテストするために、異なるポッド間の通信がパーティション化されたシナリオのシミュレーションが必要である。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>信頼性テスト</span> </span></p>
<p>上図はMilvusの信頼性テストフレームワークを示しており、カオステストを自動化することができます。信頼性テストのワークフローは以下の通りである：</p>
<ol>
<li>デプロイメント設定を読み込んでMilvusクラスタを初期化する。</li>
<li>クラスタの準備ができたら、<code translate="no">test_e2e.py</code> 、Milvusの機能が利用可能かどうかをテストする。</li>
<li><code translate="no">hello_milvus.py</code> を実行してデータの永続性をテストする。データ挿入、フラッシュ、インデックス構築、ベクトル検索、クエリ用に "hello_milvus "という名前のコレクションを作成する。このコレクションは、テスト中に解放または削除されない。</li>
<li>create、insert、flush、index、search、query 操作を実行する6つのスレッドを開始する監視オブジェクトを作成する。</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>最初のアサーションを行う。</li>
<li>Chaos Meshを使用して、障害を定義するyamlファイルを解析し、Milvusにシステム障害を導入する。障害とは、例えば5秒ごとにクエリノードを停止させることである。</li>
<li>システム障害を導入しながら2つ目のアサーションを行う - システム障害時にMilvusで行われた操作の返された結果が期待値と一致するかどうかを判断する。</li>
<li>Chaos Meshで障害を排除する。</li>
<li>Milvusサービスが回復したら（つまりすべてのポッドが準備できたら）、3番目のアサーションを行う。</li>
<li>Milvus の機能が利用可能かどうかをテストするために<code translate="no">test_e2e.py</code> を実行する。カオスの間、3つ目のアサーションのためにいくつかのオペレーションがブロックされるかもしれない。また、カオスが解消された後でも、一部の操作がブロックされ続け、3つ目のアサーションが期待通りに成功しない可能性がある。このステップの目的は、3つ目のアサーションを容易にすることであり、Milvusサービスが回復したかどうかを確認する基準として機能することである。</li>
<li><code translate="no">hello_milvus.py</code> を実行し、作成されたコレクションをロードし、そのコレクションにCRUP操作 を実行する。次に、システム障害前に存在したデータが障害復旧後も利用可能かどうかをチェックする。</li>
<li>ログを収集する。</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">安定性テストと性能テスト</h3><p>下図は、安定性テストと性能テストの目的、テストシナリオ、および測定基準を示している。</p>
<table>
<thead>
<tr><th></th><th>安定性テスト</th><th>パフォーマンステスト</th></tr>
</thead>
<tbody>
<tr><td>目的</td><td>- Milvusが一定時間、通常のワークロードで円滑に動作することを確認する。 <br>- Milvusサービス起動時にリソースが安定的に消費されることを確認する。</td><td>- Milvusの全インターフェースの性能をテストする。 <br>- パフォーマンステストにより最適なコンフィギュレーションを見つける。  <br>- 将来のリリースのベンチマークとする。 <br>- パフォーマンス向上の妨げとなるボトルネックを見つける。</td></tr>
<tr><td>シナリオ</td><td>- オフラインの読み取り集中型シナリオでは、データは挿入後ほとんど更新されず、各タイプのリクエストの処理割合は、検索リクエスト90%、挿入リクエスト5%、その他5%。 <br>- オンライン書き込み集中型シナリオ：データの挿入と検索が同時に行われ、各リクエストの処理割合は、挿入リクエスト50％、検索リクエスト40％、その他10％。</td><td>- データ挿入 <br>- インデックス構築 <br>- ベクトル検索</td></tr>
<tr><td>指標</td><td>- メモリ使用量 <br>- CPU消費量 <br>- IOレイテンシ <br>- Milvusポッドのステータス <br>- Milvusサービスのレスポンスタイム <br>その他</td><td>- データ挿入時のデータスループット <br>- インデックス構築にかかる時間 <br>- ベクトル検索時の応答時間 <br>- 1秒あたりのクエリー数 (QPS) <br>- 1秒あたりのリクエスト数  <br>- リコール率 <br>などである。</td></tr>
</tbody>
</table>
<p>安定性テストとパフォーマンス・テストは、同じワークフローを共有する：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>安定性テストとパフォーマンス・テスト</span> </span></p>
<ol>
<li>設定を解析・更新し、メトリクスを定義する。<code translate="no">server-configmap</code> 、milvusスタンドアロンまたはクラスタの設定に対応し、<code translate="no">client-configmap</code> 、テストケースの設定に対応する。</li>
<li>サーバとクライアントの設定</li>
<li>データの準備</li>
<li>サーバとクライアント間のインタラクションを要求する。</li>
<li>メトリクスのレポートと表示</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">QA 効率向上のためのツールと手法<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>モジュールテストのセクションを見ると、Milvusサーバとクライアントの設定変更、APIパラメータの受け渡しなど、ほとんどのテストの手順はほぼ同じであることがわかる。複数のコンフィギュレーションがある場合、異なるコンフィギュレーションの組み合わせが多様であればあるほど、これらの実験やテストはより多くのテストシナリオをカバーすることができる。その結果、コードと手順を再利用することが、テスト効率を高めるプロセスにとってより重要になります。</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDKテストフレームワーク</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>SDKテストフレームワーク</span> </span></p>
<p>テストプロセスを加速するために、オリジナルのテストフレームワークに<code translate="no">API_request</code> ラッパーを追加し、APIゲートウェイに似たものとして設定することができる。このAPIゲートウェイは、すべてのAPIリクエストを収集し、Milvusに渡してまとめてレスポンスを受け取る役割を担う。これらのレスポンスは、その後クライアントに引き渡される。このような設計により、パラメータや返された結果のような特定のログ情報の取得がより簡単になる。さらに、SDKテストフレームワークのチェッカーコンポーネントは、Milvusからの結果を検証し、検査することができます。そして、すべてのチェック方法はこのチェッカーコンポーネント内で定義することができます。</p>
<p>SDKテストフレームワークでは、いくつかの重要な初期化処理を1つの関数にまとめることができます。そうすることで、面倒なコードの大きな塊を省くことができます。</p>
<p>また、データの分離を確実にするために、個々のテストケースが固有のコレクションに関連付けられ ていることも注目すべき点です。</p>
<p>テストケースを実行する際には、<code translate="no">pytest-xdist</code> （pytest拡張機能）を活用することで、個々のテストケースをすべて並行して実行することができ、効率が大幅に向上します。</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub アクション</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>GitHubアクション</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Actionは</a>、以下のような特徴からQAの効率化にも採用されている：</p>
<ul>
<li>GitHubと深く統合されたネイティブのCI/CDツールである。</li>
<li>統一されたマシン環境と、Docker、Docker Composeなどの一般的なソフトウェア開発ツールがプリインストールされている。</li>
<li>Ubuntu、MacOs、Windows-serverなど、複数のオペレーティングシステムとバージョンをサポートしています。</li>
<li>豊富な拡張機能とすぐに使える機能を提供するマーケットプレイスがあります。</li>
<li>マトリックスは同時実行ジョブをサポートし、同じテストフローを再利用して効率を向上させる。</li>
</ul>
<p>上記の特徴とは別に、GitHub Actionを採用するもう一つの理由は、デプロイテストや信頼性テストには独立した隔離された環境が必要だからです。また、GitHub Actionは小規模なデータセットの日常的な検査チェックに最適です。</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">ベンチマークテスト用ツール</h3><p>QAテストを効率化するために、多くのツールが使われています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>QAツール</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: Kubernetes用のオープンソースツール群で、ワークフローを実行し、タスクをスケジューリングしてクラスタを管理する。複数のタスクを並行して実行することもできる。</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetesダッシュボード</a>：<code translate="no">server-configmap</code> と<code translate="no">client-configmap</code> を可視化するためのウェブベースのKubernetesユーザーインターフェース。</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Network Attached Storage (NAS)は、一般的なANNベンチマークのデータセットを保管するためのファイルレベルのコンピュータデータストレージサーバー。</li>
<li><a href="https://www.influxdata.com/">InfluxDBと</a> <a href="https://www.mongodb.com/">MongoDB</a>：ベンチマークテストの結果を保存するためのデータベース。</li>
<li><a href="https://grafana.com/">Grafana</a>：サーバーのリソースメトリクスやクライアントのパフォーマンスメトリクスを監視するためのオープンソースの分析・監視ソリューション。</li>
<li><a href="https://redash.io/">Redash</a>：データを可視化し、ベンチマークテストのチャートを作成するためのサービス。</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープ・ダイブ・シリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
