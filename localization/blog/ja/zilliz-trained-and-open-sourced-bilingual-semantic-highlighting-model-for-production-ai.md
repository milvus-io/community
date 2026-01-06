---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: プロダクションRAGとAI検索のためのバイリンガル・セマンティック・ハイライティング・モデルをトレーニングし、オープンソース化した。
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  セマンティック・ハイライトを深く掘り下げ、Zillizのバイリンガルモデルがどのように構築され、RAGシステムの英語と中国語のベンチマークでどのようなパフォーマンスを発揮するのかを学びます。
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>製品検索、RAGパイプライン、AIエージェントのいずれを構築する場合でも、ユーザーが最終的に必要とするものは同じです。<strong>ハイライトは</strong>、マッチをサポートする正確なテキストをマークすることで、ユーザーが文書全体をスキャンする必要がないようにします。</p>
<p>ほとんどのシステムはまだキーワードベースのハイライトに頼っている。ユーザーが "iPhone performance "と検索すると、システムは "iPhone "と "performance "というトークンをハイライトする。しかし、テキストが異なる表現で同じアイデアを表現すると、これはすぐに破綻する。A15 Bionicチップ、ベンチマークで100万以上、ラグがなくスムーズ」のような説明は、明らかにパフォーマンスに言及しているのに、キーワードが登場しないため、何もハイライトされないのです。</p>
<p><strong>セマンティックハイライトは</strong>この問題を解決します。正確な文字列をマッチングするのではなく、クエリと意味的に一致するテキストスパンを特定する。RAGシステム、AI検索、エージェントなど、関連性が表面的な形ではなく意味に依存する場合、これは文書がなぜ検索されたのかについて、より正確で信頼性の高い説明をもたらす。</p>
<p>しかし、既存のセマンティックハイライトの方法は、本番のAIワークロード用に設計されていない。利用可能なすべてのソリューションを評価した結果、RAGパイプライン、エージェントシステム、大規模ウェブ検索に必要な精度、レイテンシー、多言語カバレッジ、ロバスト性を提供するものはありませんでした。<strong>そこで、私たちは独自のバイリンガル意味強調表示モデルをトレーニングし、オープンソース化しました。</strong></p>
<ul>
<li><p>私たちのセマンティックハイライティングモデル：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>私たちの<a href="https://discord.com/invite/8uyFbECzPX">Discordに</a>参加したり、<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedInで</a>私たちをフォローしたり、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーの20分の</a>セッションを予約してください。</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">キーワードベースのハイライトはどのように機能するのか - そしてなぜ現代のAIシステムでは失敗するのか<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>従来の検索システムは、単純なキーワードマッチによってハイライトを実装して</strong>います。検索結果が返されると、エンジンはクエリにマッチするトークンの位置を特定し、マークアップ（通常は<code translate="no">&lt;em&gt;</code> タグ）で囲みます。これは、クエリ用語がテキストにそのまま表示される場合は問題なく機能します。</p>
<p>問題は、このモデルは関連性がキーワードの完全な重複と結びついていると仮定していることだ。この仮定が崩れると、信頼性は急速に低下する。たとえ検索ステップが正しかったとしても、異なる表現で正しいアイデアを表現した結果は、ハイライトされずに終わってしまう。</p>
<p>この弱点は、最新のAIアプリケーションで明らかになる。RAGパイプラインやAIエージェントのワークフローでは、クエリがより抽象的になり、文書が長くなり、関連する情報が同じ単語を再利用しないことがあります。キーワードベースの強調表示は、開発者やエンドユーザーに<em>答えが実際に</em>どこにあるのかを示すことができなくなり、検索が意図したとおりに動作していても、システム全体の精度が低く感じられるようになる。</p>
<p>あるユーザーが尋ねたとしよう：<em>"Pythonコードの実行効率を上げるにはどうしたらいいですか？"</em>システムはベクターデータベースから技術文書を検索する。従来のハイライトでは、<em>"Python"、</em> <em>"code"、</em> <em>"execution"</em>、<em>"efficiency "</em>といったリテラルマッチしかマークできない。</p>
<p>しかし、その文書の最も有用な部分は次のようなものです：</p>
<ul>
<li><p>明示的なループの代わりにNumPyのベクトル化された演算を使う。</p></li>
<li><p>ループの中で繰り返しオブジェクトを生成することを避ける</p></li>
</ul>
<p>これらの文章は質問に直接答えていますが、クエリ用語を含んでいません。その結果、従来のハイライトは完全に失敗します。ドキュメントは関連性があるかもしれませんが、ユーザーは実際の答えを見つけるために一行ずつスキャンしなければなりません。</p>
<p>AIエージェントでは、この問題はさらに顕著になる。エージェントの検索クエリは多くの場合、ユーザーのオリジナルの質問ではなく、推論とタスク分解によって生成された派生命令である。例えば、ユーザーが<em>"最近の市場動向を分析できますか？"</em>と質問した場合、エージェントは "2024年第4四半期の家電製品の販売データ、前年比成長率、主要な競合他社の市場シェアの変化、サプライチェーンのコスト変動を取得 "のようなクエリを生成するかもしれない。</p>
<p>このクエリは複数の次元にまたがり、複雑な意図をコード化しています。しかし、従来のキーワードベースのハイライトでは、<em>「2024年」、</em> <em>「販売データ」</em>、「<em>成長率</em>」といった文字通りの一致を機械的にマークすることしかできません。</p>
<p>一方、最も価値のあるインサイトは次のようなものだ：</p>
<ul>
<li><p>iPhone 15シリーズが市場全体の回復を牽引</p></li>
<li><p>チップ供給の制約がコストを15%押し上げた</p></li>
</ul>
<p>これらの結論は、エージェントがまさに抽出しようとしているものであるにもかかわらず、クエリとキーワードを一つも共有していないかもしれない。エージェントは、検索された大量のコンテンツから本当に有益な情報を素早く特定する必要があります。</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">セマンティックハイライトとは何か、現在のソリューションの問題点<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>セマンティックハイライトは、セマンティック検索と同じ考え方に基づいています。</strong>セマンティック検索では、埋め込みモデルがテキストをベクトルにマッピングするため、検索システム（通常、<a href="https://milvus.io/">milvusの</a>ようなベクトルデータベースに支えられている）は、たとえ表現が異なっていても、クエリと同じアイデアを伝える文章を検索することができます。セマンティックハイライトは、この原理をより細かい粒度で応用したものである。文字通りのキーワードヒットをマークする代わりに、ユーザーの意図に意味的に関連する文書内の特定のスパンをハイライトする。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このアプローチは、クエリ用語が逐語的に表示される場合にのみ機能する従来のハイライトの中核的な問題を解決します。ユーザーが「iPhoneのパフォーマンス」と検索した場合、キーワードベースのハイライトでは、「A15 Bionicチップ」、「ベンチマークで100万回以上」、「ラグがなくスムーズ」といったフレーズは無視されます。セマンティックハイライトは、このような意味主導のつながりをとらえ、ユーザーが実際に気になる部分を浮かび上がらせます。</p>
<p>理論的には、これは簡単なセマンティックマッチングの問題である。現代の埋め込みモデルはすでに類似性をうまく符号化しているので、概念的な部分はすでに整っている。課題は実世界の制約から来る。ハイライトはすべてのクエリで発生し、多くの場合検索されたドキュメントにまたがるため、レイテンシー、スループット、クロスドメインのロバスト性が譲れない要件となる。大規模な言語モデルは、このような高頻度のパスで実行するには、単純に遅すぎ、コストがかかりすぎる。</p>
<p>そのため、実用的なセマンティック・ハイライトには、軽量で特化したモデルが必要なのです。このモデルは、検索インフラストラクチャーと並行して使用できるほど小さく、数ミリ秒で結果を返せるほど高速です。既存のソリューションのほとんどがここで破綻している。軽量なモデルは高速ですが、精度が落ちたり、多言語やドメイン固有のデータで失敗したりします。</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter（オープンサーチ-セマンティック-ハイライター</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>今年初め、OpenSearchはセマンティックハイライト専用のモデルをリリースした：<a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>。この問題に対する有意義な試みではあるが、2つの重大な制限がある。</p>
<ul>
<li><p><strong>コンテキストウィンドウが小さい：</strong>このモデルはBERTアーキテクチャに基づいており、最大512個のトークン（おおよそ300～400の漢字または400～500の英単語）をサポートしている。実際のシナリオでは、製品説明や技術文書は数千語に及ぶことが多い。最初のウィンドウを超えるコンテンツは単純に切り捨てられ、モデルは文書のごく一部に基づいてハイライトを識別することを余儀なくされます。</p></li>
<li><p><strong>領域外の汎化が悪い：</strong>このモデルは、学習セットと同様のデータ分布でのみ良好な性能を発揮する。ニュース記事で学習したモデルをeコマースコンテンツや技術文書のハイライトに使用するなど、領域外のデータに適用すると、パフォーマンスが急激に低下する。我々の実験では、このモデルはドメイン内のデータでは約0.72のF1スコアを達成したが、ドメイン外のデータセットでは約0.46まで低下した。このレベルの不安定性は、本番では問題となる。さらに、このモデルは中国語をサポートしていない。</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">プロヴァンス / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provenceは</strong></a> <a href="https://zilliz.com/customers/naver">Naverによって</a>開発されたモデルで、当初はセマンティックハイライトと密接に関連するタスクで<strong>あるコンテキストの刈り込みの</strong>ために学習された。</p>
<p>どちらのタスクも、意味的マッチングを使用して関連するコンテンツを識別し、無関係な部分をフィルタリングするという、根本的な考え方は同じです。このため、Provenceは比較的少ない適応でセマンティックハイライトに再利用することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provenceは英語のみのモデルであり、その設定においてそれなりにうまく機能する。<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvenceは</strong></a>その多言語版で、中国語、日本語、韓国語を含む12以上の言語をサポートしている。一見すると、XProvenceはバイリンガルまたは多言語のセマンティック・ハイライト・シナリオに適しているように見える。</p>
<p>しかし実際には、ProvenceにもXProvenceにもいくつかの顕著な限界がある：</p>
<ul>
<li><p><strong>多言語モデルにおける英語のパフォーマンスが弱い：</strong>XProvenceは英語のベンチマークでProvenceの性能に及ばない。これは、多言語モデルにおける一般的なトレードオフである。言語間で能力が共有されるため、英語のような高リソース言語では性能が低下することが多い。この制限は、英語が主要または支配的な作業負荷であり続ける実世界のシステムにおいて重要である。</p></li>
<li><p><strong>限られた中国語のパフォーマンス：</strong> XProvenceは多くの言語をサポートしている。多言語トレーニングでは、データとモデルのキャパシティが各言語に分散されるため、単一の言語に特化したモデルの性能が制限される。その結果、XProvenceの中国語性能はわずかであり、高精度のハイライト処理には不十分である。</p></li>
<li><p><strong>刈り込みと強調表示の目的の不一致：</strong>Provenceはコンテキストの刈り込みに最適化されており、重要な情報を失わないように、可能な限り有用なコンテンツを保持することが優先されます。これとは対照的に、セマンティックハイライトは精度を重視し、文書の大部分ではなく、最も関連性の高い文章のみをハイライトする。Provenceスタイルのモデルがハイライトに適用されると、この不一致はしばしば過度に広範なハイライトやノイズの多いハイライトにつながる。</p></li>
<li><p><strong>ライセンスの制限：</strong>ProvenceもXProvenceもCC BY-NC 4.0ライセンスでリリースされており、商用利用は許可されていない。この制限だけで、多くの本番環境には適さない。</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">オープン・プロヴァンス</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provenceは</strong></a>、Provenceトレーニングパイプラインをオープンで透明性のある方法で再実装するコミュニティ主導のプロジェクトです。トレーニングスクリプトだけでなく、データ処理ワークフロー、評価ツール、複数スケールでの事前学習済みモデルも提供する。</p>
<p>Open Provenceの主な利点は、<strong>寛容なMITライセンス</strong>である。ProvenceやXProvenceとは異なり、法的な制限なしに商用環境でも安全に使用できるため、生産志向のチームにとって魅力的である。</p>
<p>とはいえ、Open Provenceは現在のところ<strong>英語と日本語しか</strong>サポートしていないので、私たちのようなバイリンガルのユースケースには不向きです。</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">バイリンガル・セマンティック・ハイライティング・モデルをトレーニングし、オープンソース化しました。<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>実際の作業負荷のために設計されたセマンティックハイライティングモデルは、いくつかの重要な機能を提供する必要があります：</p>
<ul>
<li><p>強力な多言語パフォーマンス</p></li>
<li><p>長い文書をサポートするのに十分な大きさのコンテキストウィンドウ</p></li>
<li><p>頑健な領域外汎化</p></li>
<li><p>セマンティックハイライトタスクにおける高い精度</p></li>
<li><p>生産に適した寛容なライセンス（MITまたはApache 2.0）</p></li>
</ul>
<p>既存のソリューションを評価した結果、利用可能なモデルのどれもが実運用に必要な要件を満たしていないことがわかりました。そこで、私たちは独自のセマンティックハイライトモデル：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v</a>1をトレーニングすることにしました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これらすべてを達成するために、私たちは単純なアプローチを採用しました。大規模な言語モデルを使用して高品質のラベル付きデータを生成し、その上でオープンソースのツールを使用して軽量のセマンティックハイライトモデルを学習します。これにより、LLMの推論の強さと、生産システムで必要とされる効率性と低レイテンシーを組み合わせることができる。</p>
<p><strong>このプロセスで最も難しいのはデータ構築である</strong>。アノテーション中、LLM(Qwen3 8B)にハイライトスパンだけでなく、その背後にある推論全体を出力するよう促す。この追加的な推論信号により、より正確で一貫性のある監視が行われ、結果として得られるモデルの品質が大幅に向上する。</p>
<p>アノテーションパイプラインは次のように動作する：<strong>LLM推論 → ハイライトラベル → フィルタリング → 最終トレーニングサンプル。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この設計は、実際に3つの具体的な利点をもたらします：</p>
<ul>
<li><p><strong>ラベリングの質の向上</strong>：モデルは<em>最初に考え、次に答える</em>ように促される。この中間推論ステップは、組み込みのセルフチェックとして機能し、浅いラベルや一貫性のないラベルの可能性を低減します。</p></li>
<li><p><strong>観察可能性とデバッグ可能性の向上</strong>：各ラベルは推論トレースを伴うため、エラーが可視化されます。これにより、失敗ケースの診断が容易になり、パイプライン内のプロンプト、ルール、またはデータフィルタを迅速に調整できます。</p></li>
<li><p><strong>再利用可能なデータ</strong>：推論トレースは、将来の再ラベリングに貴重なコンテキストを提供します。要件が変更されても、同じデータを再検討し、ゼロから始めることなく改良することができます。</p></li>
</ul>
<p>このパイプラインを使用して、英語と中国語をほぼ均等に分けた100万以上のバイリンガルのトレーニングサンプルを生成しました。</p>
<p>モデルの学習には、BGE-M3 Reranker v2（0.6Bパラメータ、8,192トークンコンテキストウィンドウ）から開始し、Open Provence学習フレームワークを採用し、8×A100 GPUで3エポックの学習を行い、約5時間で学習を完了した。</p>
<p>推論トレースに依存する理由、ベースモデルの選択方法、データセットの構築方法など、これらの技術的な選択については、次の投稿で詳しく説明します。</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Zillizのバイリンガル意味強調モデルのベンチマーク<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>実世界でのパフォーマンスを評価するため、多様なデータセットで複数のセマンティックハイライティングモデルを評価しました。ベンチマークは、本番システムで遭遇する様々なコンテンツを反映するため、英語と中国語のドメイン内シナリオとドメイン外シナリオの両方をカバーしています。</p>
<h3 id="Datasets" class="common-anchor-header">データセット</h3><p>評価には以下のデータセットを使用した：</p>
<ul>
<li><p><strong>MultiSpanQA（英語）</strong>- インドメインのマルチスパン質問応答データセット。</p></li>
<li><p><strong>WikiText-2（英語）</strong>- 領域外のWikipediaコーパス。</p></li>
<li><p><strong>MultiSpanQA-ZH (中国語)</strong>- 中国語のマルチスパン質問応答データセット</p></li>
<li><p><strong>WikiText-2-ZH（中国語）</strong>- 領域外の中国語ウィキペディアコーパス</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比較モデル</h3><p>比較の対象としたモデルは以下の通りです：</p>
<ul>
<li><p><strong>Open Provenceモデル</strong></p></li>
<li><p><strong>Provence / XProvence</strong>(Naverがリリース)</p></li>
<li><p><strong>OpenSearchセマンティックハイライター</strong></p></li>
<li><p><strong>Zillizの対訳セマンティックハイライティングモデル</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">結果と分析</h3><p><strong>英語データセット</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>中国語データセット</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>バイリンガルベンチマーク全体において、我々のモデルは<strong>最先端の平均F1スコアを</strong>達成し、過去に評価された全てのモデルやアプローチを凌駕しました。特に<strong>中国語データセットで</strong>顕著であり、我々のモデルは、中国語をサポートする他の唯一の評価モデルであるXProvenceを大幅に上回っています。</p>
<p>さらに重要なことに、我々のモデルは英語と中国語の両方でバランスの取れた性能を発揮します：</p>
<ul>
<li><p><strong>Open Provenceは</strong>英語のみサポート</p></li>
<li><p><strong>XProvenceは</strong>Provenceに比べて英語のパフォーマンスを犠牲にしています。</p></li>
<li><p><strong>OpenSearch Semantic Highlighterは</strong>中国語をサポートしておらず、汎化が弱い。</p></li>
</ul>
<p>その結果、我々のモデルは、言語カバレッジとパフォーマンスの間の一般的なトレードオフを回避し、実際のバイリンガル展開により適しています。</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">実際の具体例</h3><p>ベンチマークのスコアだけでなく、具体的な例を検証することでより明らかになることがよくあります。以下のケースは、実際のセマンティックハイライトのシナリオにおいて我々のモデルがどのように振る舞い、なぜ精度が重要なのかを示しています。</p>
<p><strong>クエリー</strong>映画<em>「The Killing of a Sacred Deer（聖なる鹿殺し）</em>」の脚本家は？</p>
<p><strong>コンテキスト（5文）：</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em>』は、ヨルゴス・ランティモス監督による2017年のサイコスリラー映画で、脚本はランティモスとエフティミス・フィリッポウが執筆した。</p></li>
<li><p>主演はコリン・ファレル、ニコール・キッドマン、バリー・キーガン、ラフィー・キャシディ、サニー・スルジッチ、アリシア・シルヴァーストーン、ビル・キャンプ。</p></li>
<li><p>ストーリーは、エウリピデス作の古代ギリシャの戯曲『<em>アウリスのイフィゲニア</em>』をベースにしている。</p></li>
<li><p>この映画は、心臓外科医が、自分の過去につながる10代の少年と秘密の友情を結ぶ姿を描く。</p></li>
<li><p>彼は少年を家族に紹介するが、その後、不可解な病気が起こり始める。</p></li>
</ol>
<p><strong>正しいハイライト文</strong>1は、脚本がヨルゴス・ランティモスとエフティミス・フィリッポウであることを明記しているので正解。</p>
<p>この例文には微妙な罠がある。<strong>文3は</strong>、この物語の大まかな原作であるギリシャ劇の作者、エウリピデスについて触れている。しかし、設問は誰がこの<em>映画を</em>書いたかを問うているのであって、古代の原作を問うているのではない。したがって正解は、数千年前の劇作家ではなく、映画の脚本家である。</p>
<p><strong>結果</strong></p>
<p>下の表は、この例題で異なるモデルがどのように機能したかをまとめたものです。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>モデル</strong></th><th style="text-align:center"><strong>特定された正解</strong></th><th style="text-align:center"><strong>結果</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>我々のモデル（バイリンガルM3）</strong></td><td style="text-align:center">✓</td><td style="text-align:center">文1（正解）と文3を選択</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">文3のみを選択、正解を逃す</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">文3のみを選択、正解を逃した</td></tr>
</tbody>
</table>
<p><strong>文レベルのスコア比較</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>文</strong></th><th><strong>私たちの (バイリンガルM3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">センテンス1（映画脚本、<strong>正解）</strong></td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">センテンス3（オリジナル劇、ディストラクター）</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>XProvenceが不十分な点</strong></p>
<ul>
<li><p>XProvenceは<em>"Euripides "</em>と<em>"written "という</em>キーワードに強く惹か<em>れ、</em>文3にほぼ満点（0.947と0.802）をつける。</p></li>
<li><p>同時に、文1の正解をほとんど無視し、極端に低いスコア（0.133と0.081）を与える。</p></li>
<li><p>判定しきい値を0.5から0.2に下げた後でも、モデルは依然として正解を浮かび上がらせることができない。</p></li>
</ul>
<p>言い換えれば、このモデルは質問の実際の意図よりも、表面レベルのキーワードの関連性によって主に駆動されます。</p>
<p><strong>私たちのモデルがどのように異なる動作をするか</strong></p>
<ul>
<li><p>私たちのモデルは文1の正解に高いスコア(0.915)を割り当て、<em>映画の脚本家を</em>正しく特定します。</p></li>
<li><p>また、文3には中程度のスコア(0.719)を割り当てます。この文は脚本関連の概念に言及しているからです。</p></li>
<li><p>重要なのは、分離が明確で意味があるということだ：<strong>0.915対0.719で</strong>、ほぼ0.2の開きがある。</p></li>
</ul>
<p>この例は、キーワードによる関連付けを越えてユーザーの意図を正しく解釈するという、私たちのアプローチの核となる強みを強調しています。複数の "author "コンセプトが現れた場合でも、モデルは一貫して質問が実際に言及しているものをハイライトします。</p>
<p>より詳細な評価レポートとその他のケーススタディは、次の投稿でご紹介します。</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">試して感想をお聞かせください<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>上でバイリンガルのセマンティックハイライトモデルをオープンソース化し、すべてのモデルの重みを公開しました。使ってみての感想や問題点、改善のアイデアなどをぜひお聞かせください。</p>
<p>並行して、私たちは本番環境に対応した推論サービスに取り組んでおり、ネイティブのセマンティックハイライトAPIとして<a href="https://milvus.io/">Milvusに</a>モデルを直接統合しています。この統合はすでに進行中であり、間もなく利用可能になる予定です。</p>
<p>セマンティックハイライトは、より直感的なRAGとエージェントAI体験への扉を開きます。Milvusが複数の長い文書を検索する際、システムは最も関連性の高い文章を即座に表示し、答えがどこにあるかを明確にすることができる。これはエンドユーザーの体験を向上させるだけでなく、システムがコンテキストのどの部分に依存しているかを正確に示すことで、開発者が検索パイプラインをデバッグするのにも役立ちます。</p>
<p>私たちは、セマンティック・ハイライトが次世代検索およびRAGシステムの標準機能になると信じています。バイリンガル・セマンティック・ハイライトのアイデア、提案、使用例をお持ちの方は、私たちの<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>参加して、あなたの考えを共有してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
