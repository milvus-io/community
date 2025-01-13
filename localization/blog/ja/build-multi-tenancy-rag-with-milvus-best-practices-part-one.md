---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: 'MilvusによるマルチテナントRAGの設計: 拡張可能なエンタープライズ知識ベースのベストプラクティス'
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>ここ数年、<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG（Retrieval-Augmented Generation：検索支援型ジェネレーション</a>）は、大企業が<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMを利用した</a>アプリケーション、特に多様なユーザーを持つアプリケーションを強化するための信頼できるソリューションとして台頭してきた。このようなアプリケーションが成長するにつれて、マルチテナンシーフレームワークの実装が不可欠になります。<strong>マルチ・テナントは</strong>、異なるユーザー・グループに対して安全で隔離されたデータ・アクセスを提供し、ユーザーの信頼を確保し、規制基準を満たし、運用効率を向上させます。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvusは</a>、高次元の<a href="https://zilliz.com/glossary/vector-embeddings">ベクトルデータを</a>扱うために構築されたオープンソースの<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a>です。RAGの不可欠なインフラストラクチャーコンポーネントであり、外部ソースからのLLMのコンテキスト情報を保存し、検索します。Milvusは、<strong>データベースレベル、コレクションレベル、パーティションレベルのマルチテナンシーなど</strong>、様々なニーズに対応した<a href="https://milvus.io/docs/multi_tenancy.md">柔軟なマルチテナンシー戦略を</a>提供しています。</p>
<p>この投稿では、以下の内容を取り上げます：</p>
<ul>
<li><p>マルチテナンシーとは何か、なぜ重要なのか</p></li>
<li><p>Milvusにおけるマルチテナンシー戦略</p></li>
<li><p>例RAGを利用した企業ナレッジベースのマルチテナンシー戦略</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">マルチテナンシーとは何か？<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>マルチテナンシーとは</strong></a>、「<strong>テナント</strong>」と呼ばれる複数の顧客やチームが、アプリケーションやシステムの単一のインスタンスを共有するアーキテクチャです。各テナントのデータと設定は論理的に分離され、プライバシーとセキュリティが確保される一方で、すべてのテナントが同じ基盤インフラを共有します。</p>
<p>複数の企業にナレッジベースのソリューションを提供するSaaSプラットフォームを想像してみてください。各企業はテナントです。</p>
<ul>
<li><p>テナントAは、患者向けのFAQやコンプライアンス文書を保管する医療機関です。</p></li>
<li><p>テナントBは、社内のITトラブルシューティングのワークフローを管理するハイテク企業。</p></li>
<li><p>テナントCは小売業で、返品に関するカスタマーサービスFAQを保管しています。</p></li>
</ul>
<p>各テナントは完全に分離された環境で運用されており、テナントAのデータがテナントBのシステムに漏れたり、逆にテナントCのデータがテナントBのシステムに漏れたりすることはありません。さらに、リソースの割り当て、クエリのパフォーマンス、およびスケーリングの決定はテナントごとに行われるため、あるテナントでワークロードが急増しても、高いパフォーマンスが保証されます。</p>
<p>マルチテナントは、同じ組織内の異なるチームにサービスを提供するシステムにも有効です。ある大企業が、HR、法務、マーケティングなどの社内部門にサービスを提供するために、RAGを利用したナレッジベースを使用しているとします。この設定では、<strong>各部門が</strong>独立したデータとリソースを持つ<strong>テナントとなります</strong>。</p>
<p>マルチテナントには、<strong>コスト効率、拡張性、堅牢なデータセキュリティなど</strong>、大きなメリットがあります。単一のインフラを共有することで、サービス・プロバイダーはオーバーヘッド・コストを削減し、より効果的なリソース消費を実現できる。また、シングル・テナント・モデルのようにテナントごとに個別のインスタンスを作成するよりも、新しいテナントを追加する際に必要なリソースがはるかに少なくて済みます。重要な点として、マルチテナントでは、テナントごとに厳重なデータ分離を行い、アクセス制御と暗号化によって機密情報を不正アクセスから保護することで、堅牢なデータセキュリティを維持します。さらに、アップデート、パッチ、新機能をすべてのテナントに同時に展開できるため、システムのメンテナンスが簡素化され、管理者の負担が軽減されるとともに、セキュリティとコンプライアンスの基準が一貫して維持されます。</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Milvusにおけるマルチテナント戦略<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusがどのようにマルチテナントをサポートしているかを理解するためには、まずユーザデータをどのように整理しているかを見ることが重要です。</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Milvusのユーザーデータ整理方法</h3><p>Milvusはデータを3つのレイヤーに分け、大まかなものから細かいものへと分類しています：<a href="https://milvus.io/docs/manage_databases.md"><strong>データベース</strong></a>、<a href="https://milvus.io/docs/manage-collections.md"><strong>コレクション</strong></a>、<a href="https://milvus.io/docs/manage-partitions.md"><strong>パーティション/パーティション・キー</strong></a>です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>図- Milvusによるユーザーデータの整理方法 .png</span> </span></p>
<p><em>図：Milvusによるユーザデータの整理方法</em></p>
<ul>
<li><p><strong>データベース</strong>：これは論理的なコンテナとして機能し、従来のリレーショナルシステムにおけるデータベースに似ている。</p></li>
<li><p><strong>コレクション</strong>：データベース内のテーブルと同様に、コレクションはデータを管理可能なグループに整理する。</p></li>
<li><p><strong>パーティション/パーティション・キー</strong>：コレクション内では、データを<strong>パーティションで</strong>さらに区分することができる。<strong>パーティション・キーを</strong>使用すると、同じキーを持つデータが一緒にグループ化されます。たとえば、<strong>ユーザーIDを</strong> <strong>パーティション・キーとして</strong>使用すると、特定のユーザーのすべてのデータが同じ論理セグメントに保存されます。これにより、個々のユーザに関連付けられたデータを簡単に取得できます。</p></li>
</ul>
<p><strong>データベースから</strong> <strong>コレクション</strong>、<strong>パーティション・キーに</strong>移行するにつれて、データ編成の粒度は徐々に細かくなります。</p>
<p>より強固なデータセキュリティと適切なアクセスコントロールを実現するため、Milvusは堅牢な<a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>ロールベースアクセスコントロール（RBAC</strong></a>）も提供しており、管理者は各ユーザに特定の権限を定義することができます。許可されたユーザのみが特定のデータにアクセスすることができます。</p>
<p>Milvusは、<strong>データベースレベル、コレクションレベル、パーティションレベルの</strong>マルチテナンシーなど、アプリケーションのニーズに応じた柔軟なマルチテナンシーを実装するための<a href="https://milvus.io/docs/multi_tenancy.md">複数の戦略を</a>サポートしています。</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">データベースレベルのマルチテナンシー</h3><p>データベースレベルマルチテナンシーでは、各テナントは同じMilvusクラスタ内で独自のデータベースを割り当てられます。この戦略により、強力なデータ分離が実現し、最適な検索パフォーマンスが保証されます。しかし、特定のテナントが非アクティブのままである場合、非効率的なリソース利用につながる可能性があります。</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">コレクションレベルマルチテナンシー</h3><p>ここで、コレクションレベルのマルチテナントでは、2つの方法でテナントのデータを整理することができます。</p>
<ul>
<li><p><strong>すべてのテナントに1つのコレクション</strong>：すべてのテナントが1つのコレクションを共有し、テナント固有のフィールドがフィルタリングに使用されます。実装は簡単ですが、この方法ではテナントの数が増えるにつれてパフォーマンスのボトルネックが発生する可能性があります。</p></li>
<li><p><strong>テナントごとに1つのコレクション</strong>：各テナントは専用のコレクションを持つことができ、分離とパフォーマンスが向上しますが、より多くのリソースが必要になります。テナント数がMilvusのコレクションキャパシティを超えた場合、この設定はスケーラビリティの制限に直面する可能性があります。</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">パーティションレベルのマルチテナント</h3><p>Partition-Level Multi-Tenancy は、単一のコレクション内でテナントを編成することに重点を置いています。ここでは、テナントデータを整理する2つの方法もあります。</p>
<ul>
<li><p><strong>テナントごとに1つのパーティション</strong>：テナントはコレクションを共有しますが、データは別々のパーティションに保存されます。各テナントに専用のパーティションを割り当てることで、データを分離し、分離と検索パフォーマンスのバランスをとることができます。しかし、このアプローチはMilvusの最大パーティション数制限に制約されます。</p></li>
<li><p><strong>パーティションキーベースのマルチテナント</strong>：これは、単一のコレクションがパーティション・キーを使用してテナントを区別する、よりスケーラブルなオプションです。この方法はリソース管理を簡素化し、より高いスケーラビリティをサポートしますが、大量のデータ挿入をサポートしません。</p></li>
</ul>
<p>以下の表は、主なマルチテナンシー・アプローチの主な違いをまとめたものです。</p>
<table>
<thead>
<tr><th><strong>粒度</strong></th><th><strong>データベースレベル</strong></th><th><strong>コレクションレベル</strong></th><th><strong>パーティション・キー・レベル</strong></th></tr>
</thead>
<tbody>
<tr><td>最大テナント数</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>データ編成の柔軟性</td><td>高：ユーザーはカスタムスキーマで複数のコレクションを定義できる。</td><td>中：ユーザはカスタムスキーマで1つのコレクションに制限される。</td><td>低：すべてのユーザーがコレクションを共有し、一貫したスキーマが必要。</td></tr>
<tr><td>ユーザーあたりのコスト</td><td>高</td><td>中</td><td>低</td></tr>
<tr><td>物理的リソースの分離</td><td>あり</td><td>あり</td><td>なし</td></tr>
<tr><td>RBAC</td><td>はい</td><td>はい</td><td>いいえ</td></tr>
<tr><td>検索パフォーマンス</td><td>強い</td><td>中</td><td>強い</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">例RAGナレッジベースのマルチテナント戦略<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGシステムのマルチテナント戦略を設計する際には、お客様のビジネスとテナントの具体的なニーズに合わせたアプローチが不可欠です。Milvusは様々なマルチテナント戦略を提供しており、テナントの数、要件、必要なデータ分離のレベルによって適切な戦略を選択することができます。ここでは、RAGを利用したエンタープライズナレッジベースを例に、これらの決定を行うための実践的なガイドを示します。</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">マルチテナント戦略を選択する前にテナント構造を理解する</h3><p>RAGを利用したエンタープライズナレッジベースは、多くの場合少数のテナントにサービスを提供しています。これらのテナントは通常、IT、営業、法務、マーケティングなどの独立したビジネスユニットであり、それぞれが個別のナレッジベースサービスを必要とします。例えば、人事部門は、入社案内や福利厚生方針などの機密情報を管理し、人事担当者のみがアクセスできるようにします。</p>
<p>この場合、各事業部門は独立したテナントとして扱われるべきであり、<strong>データベースレベルのマルチテナント</strong>戦略が最適であることが多い。各テナントに専用のデータベースを割り当てることで、組織は強力な論理的分離を実現し、管理を簡素化し、セキュリティを強化することができる。この設定はテナントに大きな柔軟性を提供します。テナントはコレクション内でカスタムデータモデルを定義し、必要な数のコレクションを作成し、コレクションのアクセス制御を独立して管理することができます。</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">物理的リソースの分離によるセキュリティの強化</h3><p>データ・セキュリティが非常に優先される状況では、データベース・レベルでの論理的な分離では不十分な場合があります。例えば、ビジネス・ユニットによってはクリティカルなデータや機密性の高いデータを扱う場合があり、他のテナントからの干渉に対してより強力な保証が必要になることがあります。このような場合、データベースレベルのマルチテナント構造の上に<a href="https://milvus.io/docs/resource_group.md">物理的な分離アプローチを</a>実装することができます。</p>
<p>Milvusではデータベースやコレクションなどの論理コンポーネントを物理リソースにマッピングすることができます。この方法により、他のテナントの活動が重要なオペレーションに影響を与えないようにすることができます。このアプローチが実際にどのように機能するのかを探ってみよう。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>図- Milvusによる物理リソースの管理方法.png</span> </span></p>
<p>図：Milvusの物理リソース管理方法</p>
<p>上図に示すように、Milvusのリソース管理には3つのレイヤーがある：<strong>クエリノード</strong>、<strong>リソースグループ</strong>、<strong>データベース</strong>です。</p>
<ul>
<li><p><strong>クエリノード</strong>：クエリタスクを処理するコンポーネント。物理マシンまたはコンテナ（KubernetesのPodなど）上で動作する。</p></li>
<li><p><strong>リソースグループ</strong>：論理コンポーネント（データベースとコレクション）と物理リソースの橋渡しをするQuery Nodeの集まり。1つのResource Groupに1つ以上のデータベースやコレクションを割り当てることができる。</p></li>
</ul>
<p>上図の例では、3 つの論理<strong>データベースが</strong>あります：X、Y、およびZです。</p>
<ul>
<li><p><strong>データベースX</strong>：<strong>コレクションAを</strong>含む。</p></li>
<li><p><strong>データベースY</strong>：<strong>コレクションBと</strong> <strong>Cを</strong>含む。</p></li>
<li><p><strong>データベースZ</strong>:<strong>コレクションDと</strong> <strong>Eを</strong>含む。</p></li>
</ul>
<p><strong>データベースXには</strong>、<strong>データベースY</strong>または<strong>データベースZからの</strong>負荷の影響を受けたくない重要な知識ベースが格納されているとします：</p>
<ul>
<li><p><strong>データベースXは</strong>、その重要な知識ベースが他のデータベースからのワークロードの影響を受けないことを保証するために、独自の<strong>リソースグループを</strong>割り当てられます。</p></li>
<li><p><strong>コレクションEも</strong>親データベース<strong>（Z</strong>）内の別の<strong>リソース</strong>グループに割り当てられます。これにより、共有データベース内の特定のクリティカル・データのコレクション・レベルでの分離が実現します。</p></li>
</ul>
<p>一方、<strong>データベースYと</strong> <strong>Zの</strong>残りのコレクションは<strong>リソースグループ2の</strong>物理リソースを共有します。</p>
<p>論理コンポーネントを物理リソースに注意深くマッピングすることで、組織は特定のビジネス・ニーズに合わせた柔軟で拡張性のあるセキュアなマルチテナンシー・アーキテクチャを実現できます。</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">エンドユーザーレベルのアクセス設計</h3><p>エンタープライズRAGのマルチテナント戦略を選択するためのベストプラクティスを学んだところで、このようなシステムにおけるユーザーレベルのアクセスをどのように設計するかを探ってみよう。</p>
<p>このようなシステムでは、エンドユーザは通常、LLMを通じて読み取り専用モードでナレッジベースと対話します。しかし、組織は、ナレッジベースの精度を向上させたり、パーソナライズされたサービスを提供したりするなどのさまざまな目的のために、ユーザーによって生成されたそのようなQ&amp;Aデータを追跡し、特定のユーザーにリンクする必要があります。</p>
<p>病院のスマート相談窓口を例にとってみよう。患者は、"今日の専門医の予約は空いていますか？"とか、"今度の手術に必要な特別な準備はありますか？"といった質問をするかもしれない。これらの質問はナレッジベースに直接影響を与えるものではありませんが、病院にとってこのようなやり取りを追跡することはサービス向上のために重要です。これらのQ&amp;Aペアは通常、インタラクションのログ専用の別のデータベース（必ずしもベクトルデータベースである必要はない）に保存される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>図- エンタープライズRAGナレッジベースのマルチテナンシーアーキテクチャ .png</span> </span></p>
<p><em>図エンタープライズRAG知識ベースのマルチテナンシーアーキテクチャ</em></p>
<p>上の図は、エンタープライズRAGシステムのマルチテナンシーアーキテクチャを示しています。</p>
<ul>
<li><p><strong>システム管理者は</strong>、RAGシステムを監督し、リソースの割り当てを管理し、データベースを割り当て、リソースグループにマッピングし、スケーラビリティを確保します。システム管理者は、図に示すように、各リソースグループ（リソースグループ1、2、3など）が物理サーバー（クエリノード）にマッピングされる物理インフラストラクチャを処理します。</p></li>
<li><p><strong>テナント（データベースの所有者と開発者）は</strong>、図に示すように、ユーザーが生成したQ&amp;Aデータに基づいて知識ベースを反復して管理する。異なるデータベース（データベースX、Y、Z）には、異なるナレッジベースのコンテンツを持つコレクションが含まれます（コレクションA、Bなど）。</p></li>
<li><p><strong>エンドユーザーは</strong>、LLMを通じて読み取り専用でシステムと対話します。彼らがシステムに問い合わせると、その質問は別のQ&amp;Aレコードテーブル（別のデータベース）に記録され、貴重なデータが継続的にシステムにフィードバックされます。</p></li>
</ul>
<p>この設計により、ユーザーとのやり取りからシステム管理まで、各プロセス層がシームレスに機能し、組織が強固で継続的に改善されるナレッジベースを構築できる。</p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>このブログでは、<a href="https://milvus.io/docs/multi_tenancy.md"><strong>マルチテナンシー・フレームワークが</strong></a>、RAGを利用したナレッジベースのスケーラビリティ、セキュリティ、およびパフォーマンスにおいて、いかに重要な役割を果たすかについて説明しました。テナントごとにデータとリソースを分離することで、企業はプライバシー、規制遵守、共有インフラ全体での最適なリソース割り当てを確保することができます。<a href="https://milvus.io/docs/overview.md">Milvusの</a>柔軟なマルチテナント戦略により、企業はデータベースレベルからパーティションレベルまで、特定のニーズに応じて適切なデータ分離レベルを選択することができます。適切なマルチテナンシー・アプローチを選択することで、多様なデータやワークロードを扱う場合でも、企業はテナントに合わせたサービスを提供することができます。</p>
<p>ここで説明するベストプラクティスに従うことで、企業は優れたユーザーエクスペリエンスを提供するだけでなく、ビジネスニーズの成長に合わせて容易に拡張できるマルチテナントRAGシステムを効果的に設計・管理することができます。Milvusのアーキテクチャは、企業が高レベルの分離、セキュリティ、およびパフォーマンスを維持できることを保証し、エンタープライズグレードのRAGを搭載したナレッジベースを構築する上で極めて重要な要素となっています。</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">マルチテナントRAGの詳細について<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>このブログでは、Milvusのマルチテナント戦略がどのようにテナントを管理するように設計されているかを説明しましたが、テナント内のエンドユーザを管理するようには設計されていません。エンドユーザーとのやり取りは通常アプリケーションレイヤーで行われ、ベクターデータベース自体はエンドユーザーを意識することはありません。</p>
<p>あなたは疑問に思うかもしれない：<em>各エンドユーザーのクエリ履歴に基づいてより正確な回答を提供したい場合、Milvusは各ユーザーにパーソナライズされたQ&amp;Aコンテキストを維持する必要があるのではないでしょうか？</em></p>
<p>素晴らしい質問ですね。答えはユースケースによります。例えば、オンデマンドの相談サービスでは、クエリはランダムであり、ユーザーの過去のコンテキストを追跡することよりも、ナレッジベースの質に主眼が置かれます。</p>
<p>しかし、他のケースでは、RAGシステムはコンテキストを認識する必要がある。このような場合、Milvusはアプリケーション層と連携して、各ユーザーのコンテキストをパーソナライズして記憶する必要がある。この設計は、大規模なエンドユーザーを持つアプリケーションでは特に重要である。さらなる洞察にご期待ください！</p>
