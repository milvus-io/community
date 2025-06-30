---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: 35K以上のGitHubスターへの旅：Milvusをゼロから作り上げた本当の物語
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  GitHubで35.5Kスターを達成したベクトルデータベースMilvusを一緒にお祝いしましょう。私たちのストーリーと、開発者にとってAIソリューションをどのように使いやすくしているかをご覧ください。
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>過去数年間、私たちはひとつのことに集中してきた。それは、AI時代のエンタープライズ対応ベクター・データベースを構築することだ。難しいのは<em>データベースを</em>構築することではなく、スケーラブルで使いやすく、本番で実際に問題を解決できるデータベースを構築することです。</p>
<p>今年6月、我々は新たなマイルストーンに到達した：Milvusは<a href="https://github.com/milvus-io/milvus">GitHubで35,000スターを</a>達成したのだ（現在、執筆時点で35.5K以上のスターがある）。これは単なる数字だと偽るつもりはありません。</p>
<p>ひとつひとつの星は、私たちが作ったものを時間をかけて見て、ブックマークするほど役に立つと感じ、多くの場合、それを使うことに決めた開発者を表しています。中には、問題を提出したり、コードを提供したり、フォーラムで質問に答えたり、他の開発者が行き詰まったときに助けてくれたり、さらに多くのことをしてくれた方もいます。</p>
<p>私たちはこの場を借りて、私たちのストーリーを共有したいと思います。</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">私たちがMilvusを作り始めたのは、他にうまくいくものがなかったからです。<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>2017年、私たちは単純な疑問から始まりました：AIアプリケーションが登場し始め、非構造化データが爆発的に増加する中、意味理解を促進するベクトル埋め込みを効率的に保存し、検索するにはどうすればいいのだろうか？</p>
<p>従来のデータベースは、このために構築されたものではなかった。データベースは行と列に最適化されており、高次元のベクトルには対応していない。既存の技術やツールは、私たちが必要とするものには不可能であるか、非常に時間がかかるものでした。</p>
<p>入手可能なものはすべて試しました。Elasticsearch を使ってソリューションをハックした。MySQLの上にカスタムインデックスを構築した。FAISSの実験もしましたが、それは研究用ライブラリとして設計されたもので、本番用データベース・インフラではありませんでした。私たちが思い描くエンタープライズAIワークロードのための完全なソリューションを提供するものはありませんでした。</p>
<p><strong>そこで私たちは独自に構築し始めた。</strong>それは簡単だと思ったからではなく、データベースはうまく構築するのが難しいことで有名だからです。しかし、AIがどこに向かっているのかがわかり、そこに到達するためには専用のインフラが必要だとわかっていたからです。</p>
<p>2018年までに、私たちは<a href="https://milvus.io/">Milvusと</a>なるものの開発に没頭していた。<strong>ベクター・データベース</strong>」という言葉はまだ存在していなかった。私たちは本質的に、新しいカテゴリーのインフラストラクチャー・ソフトウェアを作ろうとしていたのです。</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Milvusのオープンソース化：公共での構築<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>2019年11月、私たちはMilvusバージョン0.10のオープンソースを決定した。</p>
<p>オープンソース化とは、自分の欠陥をすべて世界にさらすことだ。すべてのハック、すべてのTODOコメント、あなたが完全に確信しているわけではないすべての設計決定。しかし、もしベクター・データベースがAIの重要なインフラになるのであれば、オープンで誰もがアクセスできる必要があると私たちは信じていた。</p>
<p>反響は圧倒的だった。開発者たちはMilvusを使うだけでなく、改良していった。私たちが見逃していたバグを発見してくれたり、私たちが考えもしなかった機能を提案してくれたり、私たちの設計の選択をより深く考えさせるような質問をしてくれたりした。</p>
<p>2020年、私たちは<a href="https://lfaidata.foundation/">LF AI &amp; Data Foundationに</a>加入した。これは単に信頼性のためだけでなく、持続可能なオープンソースプロジェクトを維持する方法を教えてくれた。ガバナンス、後方互換性、そして数カ月ではなく数年持続するソフトウェアを構築する方法を学んだ。</p>
<p>2021年までにMilvus 1.0をリリースし、<a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundationを卒業</a>しました。同じ年、私たちは<a href="https://big-ann-benchmarks.com/neurips21.html">BigANNグローバルチャレンジで</a>10億スケールのベクトル検索で優勝した。この勝利は気分の良いものでしたが、それ以上に重要なのは、私たちが真の問題を正しい方法で解決していることを証明してくれたのです。</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">最も困難な決断やり直す<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>ここからがややこしくなる。2021年までに、Milvus 1.0は多くのユースケースでうまく機能していたが、企業の顧客は、より優れたクラウドネイティブなアーキテクチャ、より容易な水平スケーリング、よりシンプルな運用など、同じことを求め続けていた。</p>
<p>私たちには、パッチを当てて前進するか、一から作り直すかという選択肢がありました。私たちは再構築を選択しました。</p>
<p>Milvus 2.0は、基本的に全面的な書き換えでした。ダイナミックなスケーラビリティを備えた、完全に分離されたストレージ-コンピュート・アーキテクチャを導入しました。この作業には2年を要し、正直なところ、当社の歴史の中で最もストレスの多い時期のひとつでした。何千人もの人々が使っていた実用的なシステムを捨てて、実績のないものを構築するのですから。</p>
<p><strong>しかし、2022年にMilvus 2.0をリリースしたことで、Milvusは強力なベクター・データベースから、エンタープライズ・ワークロードまで拡張可能な量産可能なインフラへと生まれ変わった。</strong>同年、私たちは<a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">シリーズB+の資金調達ラウンドを</a>完了しました。これは資金を消費するためではなく、製品の品質とグローバルな顧客へのサポートを倍増させるためです。この道には時間がかかることはわかっていましたが、どのステップも強固な基盤の上に築かれなければなりませんでした。</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">AIですべてが加速するとき<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023年は<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（検索拡張世代）の年だった。突然、セマンティック検索は、興味深いAI技術から、チャットボット、文書Q&amp;Aシステム、AIエージェントに不可欠なインフラとなった。</p>
<p>MilvusのGitHubスターは急増した。サポート依頼は急増した。ベクトルデータベースを知らなかった開発者たちが、インデックス戦略やクエリの最適化について突然高度な質問をしてきたのだ。</p>
<p>この成長はエキサイティングだったが、同時に圧倒的でもあった。私たちは、テクノロジーだけでなく、コミュニティ・サポートへのアプローチ全体を拡大する必要があることに気づきました。私たちは開発者の支援者を増員し、ドキュメントを全面的に書き直し、ベクターデータベースを初めて使う開発者のための教育コンテンツを作り始めました。</p>
<p>また、Milvusのフルマネージド版で<a href="https://zilliz.com/cloud">あるZilliz Cloudを</a>立ち上げました。なぜオープンソースプロジェクトを "商業化 "するのかと質問する人もいました。正直な答えは、エンタープライズグレードのインフラを維持するのは高価で複雑だからです。Zilliz Cloudは、コア・プロジェクトを完全にオープンソースに保ちながら、Milvusの開発を維持し、加速することを可能にします。</p>
<p>そして2024年。<a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forresterは、</strong></a> <strong>ベクターデータベースカテゴリーの</strong> <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>リーダーに私たちを選びました</strong></a> <strong>。</strong>MilvusはGitHubのスターが3万を超えました。<strong>そして私たちは悟った。私たちが7年間舗装してきた道は、ついに高速道路になったのだ、と。</strong>ベクターデータベースを重要なインフラとして採用する企業が増えるにつれて、私たちのビジネスの成長は急速に加速し、私たちが構築した基盤が技術的にも商業的にも拡張可能であることが証明されました。</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Milvusを支えるチーム：Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのことは知っていても、Zillizのことは知らないという人も多いでしょう。私たちはそれで構わないと思っています。<a href="https://zilliz.com/"><strong>Zillizは</strong></a> <strong>Milvusを支えるチームであり、Milvusを構築し、保守し、サポートしています。</strong></p>
<p>パフォーマンス最適化、セキュリティパッチ、初心者に役立つドキュメント、GitHubの問題への丁寧な対応などです。</p>
<p>私たちは、アメリカ、ヨーロッパ、アジアにまたがる年中無休のグローバル・サポート・チームを構築しました。開発者は、私たちのタイムゾーンではなく、それぞれのタイムゾーンでサポートを必要としているからです。<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvusアンバサダー</a>&quot;と呼んでいるコミュニティ貢献者たちが、イベントを企画したり、フォーラムの質問に答えたり、しばしば私たちよりも上手にコンセプトを説明してくれます。</p>
<p>また、AWS、GCP、その他のクラウドプロバイダーとの統合も歓迎しています（たとえそのプロバイダーがMilvusのマネージドバージョンを提供している場合でも）。デプロイの選択肢が増えることは、ユーザーにとって良いことだ。しかし、チームが複雑な技術的課題にぶつかったとき、私たちがシステムを最も深いレベルで理解しているため、結局は私たちに直接問い合わせることが多いことに気づきました。</p>
<p>多くの人はオープンソースを単なる「道具箱」だと考えているが、実際には「進化のプロセス」であり、それを愛し、信じる無数の人々による集団的な努力なのだ。アーキテクチャを本当に理解している人だけが、バグ修正、パフォーマンスボトルネック分析、データシステム統合、アーキテクチャ調整の背後にある「理由」を提供することができる。</p>
<p><strong>オープンソースのMilvusを使用している場合、またはAIシステムのコアコンポーネントとしてベクターデータベースを検討している場合は、最も専門的でタイムリーなサポートを提供するために、私たちに直接連絡することをお勧めします。</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">プロダクションにおける真のインパクトユーザーからの信頼<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのユースケースは、私たちが当初想像していた以上に拡大しています。私たちは、あらゆる業界にわたり、世界で最も要求の厳しい企業のAIインフラを支えています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_66d3adfe97.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz customers.png</span> </span></p>
<p>世界的な自動車技術のリーダーであり、自律走行のパイオニアである<a href="https://zilliz.com/customers/bosch"><strong>ボッシュは</strong></a>、Milvusによってデータ分析に革命を起こし、データ収集コストを80%削減し、年間140万ドルの節約を達成しました。</p>
<p>数百万人の月間アクティブユーザーを抱える最も急成長している生産性AI企業の1つである<a href="https://zilliz.com/customers/read-ai"><strong>Read AIは</strong></a>、Milvusを使用して数十億レコードの検索レイテンシを20-50ms以下にし、エージェント検索で5倍のスピードアップを実現しています。彼らのCTOは、"Milvusは中央リポジトリとして機能し、数十億のレコードの中で私たちの情報検索を強化します "と述べている。</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>世界</strong></a>最大級のデジタル決済プラットフォームであり、200以上の国と25以上の通貨で数百億件の取引を処理する<a href="https://zilliz.com/customers/global-fintech-leader"><strong>世界的なフィンテック・リーダー</strong></a>である同社は、競合他社よりも5～10倍高速なバッチ取り込みのためにMilvusを選択し、他社が8時間以上かかるジョブを1時間未満で完了させた。</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevineは</strong></a>、全米の何千もの法律事務所に信頼されている主要な法律業務プラットフォームであり、何百万もの法律文書にわたって30億のベクトルを管理し、弁護士が文書分析にかける時間を60～80%節約し、法律事件管理のための「データの真の意識化」を実現しています。</p>
<p>また、<strong>NVIDIA、OpenAI、Microsoft、Salesforce、Walmartを</strong>はじめ、ほぼすべての業界の多くの企業をサポートしています。10,000を超える組織がMilvusまたはZilliz Cloudをベクターデータベースとして選択しています。</p>
<p>これらは単なる技術的なサクセスストーリーではなく、ベクターデータベースがいかに静かに、人々が毎日使うAIアプリケーションを強化する重要なインフラになっているかを示す例なのです。</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Zilliz Cloudを構築した理由エンタープライズ・グレードのベクター・データベース・アズ・ア・サービス<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusはオープンソースで、無料で利用できる。しかし、Milvusをエンタープライズ規模でうまく運用するには、深い専門知識と多大なリソースが必要です。インデックスの選択、メモリ管理、スケーリング戦略、セキュリティ設定-これらは些細な決定ではありません。多くのチームは、運用の複雑さを伴わないMilvusのパワーと、エンタープライズサポート、SLA保証などを求めています。</p>
<p>そこで私たちは、パフォーマンス、セキュリティ、信頼性が要求されるエンタープライズスケールのAIワークロードのために特別に設計された、25のグローバルリージョンとAWS、GCP、Azureを含む5つの主要クラウドに展開されたMilvusのフルマネージドバージョン<a href="https://zilliz.com/cloud">であるZilliz Cloudを</a>構築しました。</p>
<p>Zilliz Cloudの特徴は以下の通りです：</p>
<ul>
<li><p><strong>高性能で大規模：</strong>当社独自のAIを搭載したAutoIndexエンジンは、オープンソースのMilvusよりも3～5倍高速なクエリ速度を実現し、インデックスのチューニングは不要です。クラウドネイティブのアーキテクチャは、秒以下の応答時間を維持しながら、数十億のベクトルと数万の同時クエリをサポートします。</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>組み込みのセキュリティとコンプライアンス</strong></a><strong>：</strong>静止時およびトランジット時の暗号化、きめ細かなRBAC、包括的な監査ロギング、SAML/OAuth2.0の統合、<a href="https://zilliz.com/bring-your-own-cloud">BYOC</a>（Bring Your Own Cloud）の展開。GDPR、HIPAA、その他企業が実際に必要とするグローバルスタンダードに準拠しています。</p></li>
<li><p><strong>コスト効率の最適化</strong>階層化されたホット/コールドデータストレージ、実際のワークロードに対応する弾力的なスケーリング、および従量課金制により、総所有コストを自己管理型の導入と比較して50%以上削減できます。</p></li>
<li><p><strong>ベンダーに縛られない真のクラウド対応：</strong>ベンダーに縛られることなく、AWS、Azure、GCP、Alibaba Cloud、Tencent Cloudに導入できます。ベンダーに縛られることなく、AWS、Azure、GCP、Alibaba Cloud、Tencent Cloud上に展開できます。</p></li>
</ul>
<p>これらの機能は派手には聞こえないかもしれませんが、AIアプリケーションを大規模に構築する際に企業チームが直面する現実的で日常的な問題を解決するものです。そして、最も重要なことは、MilvusはMilvusのままなので、プロプライエタリなロックインや互換性の問題はありません。</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">次なる課題ベクター・データレイク<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは「<a href="https://zilliz.com/learn/what-is-vector-database">ベクター・データベース</a>」という言葉を作り出し、それを最初に構築しました。私たちは今、次の進化を構築しています：<strong>ベクター・データレイクです。</strong></p>
<p><strong>すべてのベクトル検索にミリ秒単位のレイテンシーが必要なわけではありません。</strong>多くの企業では、過去の文書分析、バッチの類似度計算、長期的なトレンド分析など、時折クエリされる巨大なデータセットを持っています。このようなユースケースでは、従来のリアルタイム・ベクター・データベースは過剰であり、コストも高い。</p>
<p>Vector Data Lakeは、大規模でアクセス頻度の低いベクトルデータ用に最適化されたストレージとコンピュートを分離したアーキテクチャを採用し、リアルタイムシステムよりもコストを大幅に削減します。</p>
<p><strong>主な機能は以下の通り：</strong></p>
<ul>
<li><p><strong>統合データスタック：</strong>一貫したフォーマットと効率的なストレージでオンラインとオフラインのデータレイヤーをシームレスに接続するため、再フォーマットや複雑なマイグレーションを行うことなく、ホットティアとコールドティア間でデータを移動できます。</p></li>
<li><p><strong>互換性のあるコンピュート・エコシステム：</strong>SparkやRayのようなフレームワークとネイティブに連携し、ベクトル検索から従来のETLやアナリティクスまでサポートします。つまり、既存のデータチームは、すでに知っているツールを使ってベクトルデータを扱うことができます。</p></li>
<li><p><strong>コスト最適化アーキテクチャ：</strong>ホットデータはSSDまたはNVMeに保存して高速アクセスを実現し、コールドデータはS3のようなオブジェクトストレージに自動的に移動します。スマートなインデックス作成とストレージ戦略により、必要なときに高速なI/Oを維持しながら、ストレージコストを予測可能で手頃な価格に抑えます。</p></li>
</ul>
<p>これはベクターデータベースを置き換えるということではなく、それぞれのワークロードに適したツールを企業に提供するということです。ユーザー向けアプリケーションにはリアルタイム検索を、アナリティクスや履歴処理には費用対効果の高いベクターデータレイクを。</p>
<p>私たちは、ムーアの法則とジェヴォンズのパラドックスの背後にある論理を信じています。同じことがベクトル・インフラにも当てはまります。</p>
<p>インデックス、ストレージ構造、キャッシング、デプロイメント・モデルを日々改善することで、AIインフラストラクチャを誰にとってもよりアクセスしやすく、手頃なものにし、非構造化データをAIネイティブな未来へと導く手助けをしたいと考えています。</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">皆さんに感謝します！<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>これらの35K以上の星は、私たちが純粋に誇りに思っていることを表しています：Milvusを推薦し、貢献するのに十分なほどMilvusを有用だと感じている開発者のコミュニティです。</p>
<p>しかし、私たちはまだ終わっていません。Milvusには修正すべきバグ、パフォーマンス改善、そしてコミュニティが求めてきた機能があります。私たちのロードマップは公開されており、何を優先させるかについてのご意見を純粋に求めています。</p>
<p>重要なのは数字そのものではなく、星が表す信頼なのです。私たちがオープンに作り続け、フィードバックに耳を傾け、milvusをより良いものにし続けるという信頼です。</p>
<ul>
<li><p><strong>貢献者の皆様へ:</strong>皆様のPR、バグレポート、ドキュメントの改善により、Milvusは日々改善されています。本当にありがとうございます。</p></li>
<li><p><strong>ユーザーの皆様へ:</strong>皆様の本番作業を私たちに任せていただき、また、私たちを正直に保つためのフィードバックをありがとうございます。</p></li>
<li><p><strong>私たちのコミュニティへ:</strong>質問への回答、イベントの企画、新規参入者の手助けをしていただきありがとうございます。</p></li>
</ul>
<p>ベクターデータベースを初めてお使いになる方は、ぜひ私たちにご相談ください。既にMilvusやZilliz Cloudをお使いであれば、ぜひその<a href="https://zilliz.com/share-your-story">経験を</a>お聞かせください。また、私たちが何を作っているのか興味がある方は、コミュニティチャンネルをいつでも開いています。</p>
<p>一緒にAIアプリケーションを実現するインフラを構築し続けましょう。</p>
<hr>
<p>私たちをここで見つけてください：<a href="https://github.com/milvus-io/milvus">Milvus on</a><a href="https://zilliz.com/"> GitHub｜Zilliz</a> <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">Cloud｜Discord｜LinkedIn｜X｜YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
