---
id: Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus.md
title: Software2.0、MLOps、milvusでAIを大規模に運用する
author: milvus
date: 2021-03-31T09:51:38.653Z
desc: >-
  ソフトウェア2.0への移行に伴い、MLOpsはDevOpsに取って代わりつつある。モデル・オペレーションとは何か、オープンソースのベクター・データベースMilvusはそれをどのようにサポートしているのか。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus
---
<custom-h1>Software2.0、MLOps、milvusでAIを大規模に運用する</custom-h1><p>機械学習（ML）アプリケーションの構築は、複雑で反復的なプロセスである。非構造化データの未開拓の可能性に気づく企業が増えるにつれ、<a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">AIを活用したデータ処理とアナリティクスの</a>需要は高まり続けるだろう。効果的な機械学習オペレーション（MLOps）がなければ、ほとんどのMLアプリケーションへの投資は枯れ木のようになってしまう。調査によると、企業が導入を計画しているAIのうち、実際に導入に至っているのは<a href="https://www.forbes.com/sites/cognitiveworld/2020/03/31/modelops-is-the-key-to-enterprise-ai/?sh=44c0f5066f5a">わずか5％程度</a>だという。多くの企業は「モデル負債」を抱えており、市場環境の変化やそれに適応できなかった結果、モデルへの投資が未実現のままリフレッシュされずに（あるいは最悪、全くデプロイされずに）放置されることになる。</p>
<p>この記事では、AIモデルのライフサイクル管理に対する体系的アプローチであるMLOpsと、オープンソースのベクターデータ管理プラットフォーム<a href="https://milvus.io/">Milvusを</a>使用してAIを大規模に運用する方法について説明する。</p>
<p><br/></p>
<h3 id="What-is-MLOps" class="common-anchor-header">MLOpsとは？</h3><p>機械学習オペレーション（MLOps）は、モデルオペレーション（ModelOps）またはAIモデルの運用化とも呼ばれ、AIアプリケーションを大規模に構築、維持、展開するために必要なものである。企業は開発したAIモデルを何百もの異なるシナリオに適用しようとするため、使用中のモデルや開発中のモデルを組織全体で運用することがミッションクリティカルとなる。MLOpsは、機械学習モデルをそのライフサイクル全体にわたって監視し、基礎となるデータから特定のモデルに依存する本番システムの有効性まで、あらゆるものを管理する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_362a07d156.jpg" alt="01.jpg" class="doc-image" id="01.jpg" />
   </span> <span class="img-wrapper"> <span>01.jpg</span> </span></p>
<p>ガートナーはModelOpsを、運用化された幅広い人工知能と意思決定モデルのガバナンスとライフサイクル管理と<a href="https://www.gartner.com/en/information-technology/glossary/modelops">定義して</a>いる。MLOpsの中核機能は、以下のように分解できる：</p>
<ul>
<li><p><strong>継続的インテグレーション／継続的デリバリー（CI/CD）：</strong>開発者オペレーション（DevOps）から借用した一連のベストプラクティスであるCI/CDは、コード変更をより頻繁に、より確実に提供するための手法である。<a href="https://www.gartner.com/en/information-technology/glossary/continuous-integration-ci">継続的インテグレーションは</a>、厳密なバージョン管理で監視しながら、コード変更を小ロットで実装することを促進する。<a href="https://www.gartner.com/smarterwithgartner/5-steps-to-master-continuous-delivery/">継続的デリバリーは</a>、さまざまな環境（テスト環境や開発環境など）へのアプリケーションのデリバリーを自動化する。</p></li>
<li><p><strong>モデル開発環境（MDE）：</strong>モデルの構築、レビュー、文書化、および検証のための複雑なプロセスである MDE は、モデルが反復的に作成され、開発中に文書化され、信頼され、再現可能であることを保証するのに役立ちます。効果的なMDEは、モデルが管理された方法で調査、研究、実験できることを保証する。</p></li>
<li><p><strong>チャンピオン・チャレンジャーテスト：</strong>マーケティング担当者が使用するA/Bテスト手法と同様に、<a href="https://medium.com/decision-automation/what-is-champion-challenger-and-how-does-it-enable-choosing-the-right-decision-f57b8b653149">チャンピオン・チャレンジャー・テストでは</a>、単一のアプローチにコミットすることを進める意思決定プロセスを支援するために、さまざまなソリューションを実験する。この手法では、リアルタイムでパフォーマンスを監視・測定し、どの逸脱が最も効果的かを特定する。</p></li>
<li><p><strong>モデルのバージョン管理：</strong>他の複雑なシステムと同様に、機械学習モデルは多くの異なる人々によって段階的に開発される。モデルのバージョニングは、データ、モデル、コードが異なる速度で進化する可能性があるML開発の反復プロセスを管理し、統制するのに役立ちます。</p></li>
<li><p><strong>モデルの保存とロールバック：</strong>モデルがデプロイされると、対応するイメージファイルを保存する必要があります。ロールバックとリカバリ機能により、MLOpsチームは必要に応じて以前のモデルのバージョンに戻すことができます。</p></li>
</ul>
<p>本番アプリケーションでモデルを1つだけ使用することは、多くの困難な課題をもたらします。MLOpsは、機械学習モデルのライフサイクル中に発生する技術的またはビジネス上の問題を克服するために、ツール、テクノロジー、およびベストプラクティスに依存する構造化された反復可能な手法である。MLOpsを成功させることで、AIモデルの構築、デプロイ、監視、再学習、管理、および本番システムでの使用に取り組むチーム全体の効率を維持することができる。</p>
<p><br/></p>
<h3 id="Why-is-MLOps-necessary" class="common-anchor-header">なぜMLOpsが必要なのか？</h3><p>上記のMLモデルのライフサイクルに描かれているように、機械学習モデルの構築は、新しいデータの取り込み、モデルの再トレーニング、時間の経過に伴う一般的なモデルの減衰への対処を含む反復プロセスです。これらはすべて、従来の開発者オペレーション（DevOps）では対処できない、あるいは解決策を提供できない問題だ。MLOpsは、AIモデルへの投資を管理し、生産性の高いモデルのライフサイクルを確保する方法として必要となっている。機械学習モデルは、さまざまな異なる本番システムで活用されるため、MLOpsは、さまざまな環境やさまざまなシナリオの中で要件を満たすことができるようにするために不可欠なものとなっている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_403e7f2fe2.jpg" alt="02.jpg" class="doc-image" id="02.jpg" />
   </span> <span class="img-wrapper"> <span>02.jpg</span> </span></p>
<p><br/></p>
<p>上のシンプルな図は、機械学習モデルがクラウド環境にデプロイされ、アプリケーションに取り込まれる様子を表している。この基本的なシナリオでは、MLOpsが克服に役立つ多くの問題が発生する可能性がある。本番アプリケーションは特定のクラウド環境に依存しているため、MLモデルを開発したデータサイエンティストがアクセスできないレイテンシー要件が存在する。モデルのライフサイクルを運用化することで、モデルについて深い知識を持つデータサイエンティストやエンジニアが、特定の本番環境で発生する問題を特定し、トラブルシューティングすることが可能になる。</p>
<p>機械学習モデルは、使用される本番アプリケーションとは異なる環境でトレーニングされるだけでなく、本番アプリケーションで使用されるデータとは異なる過去のデータセットに依存することも多い。MLOpsを使用することで、モデルの開発担当者からアプリケーションレベルで作業する担当者まで、データサイエンスチーム全体が情報や支援を共有し、要求する手段を持つことができる。データと市場が変化する速度が速いため、特定の機械学習モデルに依存するようになるすべての主要な利害関係者と貢献者間の摩擦を可能な限り少なくすることが不可欠である。</p>
<h3 id="Supporting-the-transition-to-Software-20" class="common-anchor-header">ソフトウェア2.0への移行をサポート</h3><p><a href="https://karpathy.medium.com/software-2-0-a64152b37c35">ソフトウェア2.0とは</a>、ソフトウェア・アプリケーションを強化するAIモデルの記述において、人工知能がますます中心的な役割を果たすようになるにつれて、ソフトウェア開発がパラダイム・シフトを経験するという考え方である。ソフトウェア1.0では、プログラマーは特定のプログラミング言語（Python、C++など）を使って明示的な命令を記述する。ソフトウェア2.0は、はるかに抽象的である。人間は入力データを提供し、パラメーターを設定するが、ニューラルネットワークは非常に複雑であるため、人間が理解するのは難しい。典型的なネットワークには、結果に影響を与える数百万の重みが含まれている（時には数十億、数兆）。</p>
<p>DevOpsは、プログラマーが言語を使用して指示する特定の命令に依存するソフトウェア1.0を中心に構築されたが、さまざまな異なるアプリケーションを強化する機械学習モデルのライフサイクルを考慮することはなかった。MLOpsは、ソフトウェア開発を管理するプロセスが、開発中のソフトウェアと共に変化する必要性に対処する。ソフトウェア2.0がコンピュータベースの問題解決の新しい標準となるにつれ、モデルのライフサイクルを管理するための適切なツールとプロセスを持つことが、新しいテクノロジーへの投資を左右することになる。Milvusは、ソフトウェア2.0への移行をサポートし、MLOpsでモデルのライフサイクルを管理するために構築されたオープンソースのベクトル類似性検索エンジンです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/03_c63c501995.jpg" alt="03.jpg" class="doc-image" id="03.jpg" />
   </span> <span class="img-wrapper"> <span>03.jpg</span> </span></p>
<p><br/></p>
<h3 id="Operationalizing-AI-at-scale-with-Milvus" class="common-anchor-header">MilvusでAIを大規模に運用する</h3><p>Milvusはベクトルデータ管理プラットフォームであり、1兆スケールの巨大なベクトルデータセットの保存、クエリ、更新、保守に特化して作られている。このプラットフォームは、ベクトル類似検索を強化し、Faiss、NMSLIB、Annoyなど、広く採用されているインデックスライブラリと統合することができる。非構造化データをベクトルに変換するAIモデルとMilvusを組み合わせることで、新薬開発、生体認証分析、レコメンデーションシステムなど、さまざまなアプリケーションを構築することができる。</p>
<p><a href="https://blog.milvus.io/vector-similarity-search-hides-in-plain-view-654f8152f8ab">ベクトル類似性検索は</a>、非構造化データのデータ処理と分析に最適なソリューションであり、ベクトルデータは中核的なデータタイプとして急速に台頭しています。Milvusのような包括的なデータ管理システムは、以下のような様々な方法でAIの運用を促進します：</p>
<ul>
<li><p>モデルトレーニングのための環境を提供することで、開発のより多くの側面が一箇所で行われるようにし、チーム間のコラボレーションやモデルガバナンスなどを促進する。</p></li>
<li><p>Python、Java、Goなどの一般的なフレームワークをサポートする包括的なAPIセットを提供し、一般的なMLモデルの統合を容易にする。</p></li>
<li><p>ブラウザ上で動作するJupyterノートブック環境であるGoogle Colaboratoryとの互換性により、Milvusをソースコードからコンパイルし、基本的なPython操作を実行するプロセスを簡素化。</p></li>
<li><p>自動機械学習（AutoML）機能により、実世界の問題に機械学習を適用する際のタスクを自動化することが可能です。AutoMLは効率改善につながるだけでなく、専門家でなくても機械学習モデルやテクニックを活用することを可能にします。</p></li>
</ul>
<p>Milvusは、現在構築中の機械学習アプリケーションや将来のアプリケーションの計画にかかわらず、ソフトウェア2.0とMLOpsを念頭に置いて作成された柔軟なデータ管理プラットフォームです。Milvusの詳細や貢献については、<a href="https://github.com/milvus-io">Githubで</a>プロジェクトをご覧ください。コミュニティへの参加や質問については、<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>チャンネルにご参加ください。もっとコンテンツが欲しいですか？以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database.md">Milvusはオープンソースのスケーラブルなベクターデータベースです。</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvusは大規模な（兆を考える）ベクトル類似検索のために構築された</a></li>
<li><a href="https://milvus.io/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md">MLアプリケーションを簡単に構築するためにGoogle ColaboratoryでMilvusをセットアップする。</a></li>
</ul>
