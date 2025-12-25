---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: まず埋め込み、次にチャンキング：最大-最小の意味的チャンキングでRAG検索をよりスマートに
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Max-Minセマンティック・チャンキングが、よりスマートなチャンクを作成し、コンテキストの質を向上させ、より優れた検索性能を実現する埋め込み優先のアプローチを使用して、どのようにRAGの精度を向上させるかをご覧ください。
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation（RAG）は</a>、AIエージェント、カスタマーサポートアシスタント、ナレッジベース、検索システムなど、AIアプリケーションにコンテキストと記憶を提供するためのデフォルトのアプローチとなっている。</p>
<p>ほとんどすべてのRAGパイプラインにおいて、標準的なプロセスは同じである。ドキュメントを取得し、チャンクに分割し、それらのチャンクを<a href="https://milvus.io/">Milvusの</a>ようなベクトルデータベースに埋め込んで類似性を検索する。<strong>チャンキングは</strong>前もって行われるため、チャンクの品質は、システムが情報をどれだけうまく検索できるか、そして最終的な回答がどれだけ正確であるかに直接影響する。</p>
<p>問題は、従来のチャンキング戦略は通常、意味的な理解なしにテキストを分割することである。固定長のチャンキングはトークン数に基づいてカットし、再帰的チャンキングは表面レベルの構造を使いますが、どちらもテキストの実際の意味を無視したままです。その結果、関連するアイデアが分離されたり、関係のない行がグループ化されたり、重要な文脈が断片化されたりすることがよくある。</p>
<p>このブログでは、別のチャンキング戦略を紹介したい：<a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>マックス・ミンセマンティック・チャンキング</strong></a>だ。最初にチャンキングする代わりに、テキストを前もって埋め込み、意味的類似性を使って境界を形成する場所を決定します。カットする前に埋め込むことで、パイプラインは任意の長さ制限に頼るのではなく、意味の自然なシフトを追跡することができる。</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">典型的なRAGパイプラインの仕組み<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>フレームワークに関係なく、ほとんどのRAGパイプラインは同じ4段階の組み立てラインに従う。おそらくあなたも、これのいくつかのバージョンを書いたことがあるだろう：</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1.データのクリーニングとチャンキング</h3><p>ヘッダー、フッター、ナビゲーションテキスト、そして本当のコンテンツでないものを取り除く。ノイズを取り除いたら、テキストを細かく分割する。エンベッディングモデルを管理しやすくするためです。欠点は、分割が意味ではなく長さに基づいているため、境界が恣意的になる可能性があることです。</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2.埋め込みと保存</h3><p>各チャンクは、OpenAIのエンベッディング・モデルやBAAIのエンコーダーのようなエンベッディング・モデルを使って埋め込まれる。 <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a>やBAAIのエンコーダーのような埋め込みモデルを使って埋め込まれる。出来上がったベクトルは、<a href="https://milvus.io/">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ようなベクトルデータベースに格納される。データベースはインデックス作成と類似性検索を行うので、保存されたすべてのチャンクと新しいクエリを素早く比較することができます。</p>
<h3 id="3-Querying" class="common-anchor-header">3.クエリ</h3><p>ユーザーが質問をすると、例えば<em>"RAGはどのように幻覚を減らすのか？"</em>- システムはクエリを埋め込み、データベースに送信します。データベースはクエリに最も近いベクトルを持つ上位K個のチャンクを返す。これらは、モデルが質問に答えるために依拠するテキストの断片である。</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4.回答生成</h3><p>検索されたチャンクはユーザーのクエリーと一緒にバンドルされ、LLMに入力されます。LLMは、提供されたコンテキストを基に答えを生成する。</p>
<p><strong>チャンキングはこのパイプライン全体の最初に位置しますが、大きな影響を与えます</strong>。チャンクがテキストの自然な意味と一致していれば、検索は正確で一貫性があると感じられる。もしチャンクが厄介な場所でカットされていれば、たとえ強力な埋め込みと高速なベクターデータベースがあったとしても、システムは正しい情報を見つけるのが難しくなる。</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">チャンキングを正しく行うための課題</h3><p>今日、ほとんどのRAGシステムは、2つの基本的なチャンキング手法のいずれかを使っているが、どちらにも限界がある。</p>
<p><strong>1.固定サイズのチャンキング</strong></p>
<p>これは最も単純なアプローチです。テキストを固定のトークンまたは文字数で分割します。高速で予測可能だが、文法やトピック、トランジションにはまったく無頓着だ。文が半分になることもある。時には単語でさえも。これらのチャンクから得られる埋め込みは、境界がテキストの実際の構造を反映していないため、ノイズが多くなりがちです。</p>
<p><strong>2.再帰的文字分割</strong></p>
<p>この方法はもう少しスマートです。段落、改行、文などの手がかりに基づいてテキストを階層的に分割する。セクションが長すぎる場合は、再帰的にさらに分割します。出力は概して首尾一貫しているが、まだ一貫性がない。文書によっては、明確な構造がなかったり、セクションの長さにばらつきがあったりするため、検索精度が落ちてしまう。また、この方法でも、モデルのコンテキストウィンドウを超えるチャンクが生成される場合もある。</p>
<p>どちらの方法も、精度対コンテキストという同じトレードオフに直面している。小さなチャンクは検索精度を向上させるが、周囲の文脈を失う。大きなチャンクは意味を維持するが、無関係なノイズを追加するリスクがある。適切なバランスを取ることが、チャンキングをRAGシステム設計の基礎とし、また挫折させるのである。</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">最大最小のセマンティック・チャンキング最初に埋め込み、後でチャンクする<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>2025年、S.R. Bhatらは<a href="https://arxiv.org/abs/2505.21700"><em>『Rethinking Chunk Size for Long-Document Retrieval</em></a>』を発表した：<a href="https://arxiv.org/abs/2505.21700"><em>A Multi-Dataset Analysis</em></a>）」を発表した。彼らの重要な発見のひとつは、RAGに<strong>最適な</strong>チャンクサイズはひとつではないということである。小さなチャンク（64-128トークン）は、事実やルックアップ形式の質問に適している傾向があり、大きなチャンク（512-1024トークン）は、物語や高レベルの推論タスクに適している。言い換えれば、固定サイズのチャンキングは常に妥協の産物です。</p>
<p>1つの長さを選んでベストを望むのではなく、サイズではなく意味によってチャンキングできないだろうか？<a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunkingは</strong></a>、私が見つけた、まさにそれを行おうとするアプローチの一つである。</p>
<p>考え方は簡単で、<strong>まず埋め込み、次にチャンクするという</strong>ものだ。テキストを分割し、次に落ちてきた断片を埋め込むのではなく、このアルゴリズムは<em>すべての文章を</em>前もって埋め込む。そして、それらの文の埋め込み間の意味的な関係を使って、境界をどこにするかを決定する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Max-Minセマンティック・チャンキングにおける、埋め込み-最初にチャンク-次にチャンクのワークフローを示す図</span> </span></p>
<p>概念的には、この方法はチャンキングを埋め込み空間における制約付きクラスタリング問題として扱います。ドキュメントを一文ずつ順番に見ていく。各文について、アルゴリズムはその埋め込みを現在のチャンク内の埋め込みと比較する。新しい文が意味的に十分近ければ、そのチャンクに加わる。遠すぎる場合は、アルゴリズムは新しいチャンクを開始する。重要な制約は、チャンクは元の文の順序に従わなければならないということである。</p>
<p>その結果、文字カウンタがたまたまゼロになったところではなく、文書の意味が実際に変化したところを反映した、可変長のチャンクのセットが出来上がる。</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">最大最小セマンティック・チャンキング戦略の仕組み<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunkingは、高次元ベクトル空間における文同士の関連性を比較することで、チャンクの境界を決定します。固定された長さに依存するのではなく、文書全体でどのように意味が変化しているかを見る。プロセスは6つのステップに分けられる：</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1.すべての文を埋め込み、チャンクを開始する。</h3><p>埋め込みモデルは、文書内の各文をベクトル埋め込みに変換する。文は順番に処理される。最初の<em>n-k個の</em>文が現在のチャンクCを形成している場合、次の文(sₙₖ₊₁)を評価する必要があります。</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2.現在のチャンクの一貫性を測定</h3><p>チャンクCの中で、全ての文の埋め込み間のペアワイズ余弦類似度の最小値を計算する。この値はチャンク内の文がどれだけ密接に関連しているかを反映します。類似度の最小値が低いほど、文の関連性が低いことを示し、チャンクを分割する必要があることを示唆します。</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3.新しい文をチャンクと比較する</h3><p>この値は、新しい文が既存のチャンクとどれだけ意味的に一致しているかを反映します。</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4.チャンクを拡張するか、新しいチャンクを作成するかを決定します。</h3><p>これが核となるルールです：</p>
<ul>
<li><p>新しい文のチャンク<strong>Cに対する</strong> <strong>最大類似</strong>度が<strong>チャンクC内の最小類似度</strong> <strong>以上</strong>であれば、→新しい文はチャンクにフィットし、チャンクに留まる。</p></li>
<li><p>そうでなければ、→新しいチャンクを開始する。</p></li>
</ul>
<p>これにより、各チャンクは内部の意味的一貫性を維持する。</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5.文書の変化に応じて閾値を調整</h3><p>チャンクの品質を最適化するために、チャンクサイズや類似度のしきい値などのパラメータを動的に調整することができる。これにより、アルゴリズムは文書構造や意味密度の変化に適応できる。</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6.最初の数文を処理</h3><p>チャンクに1文しか含まれない場合、アルゴリズムは固定の類似度閾値を用いて最初の比較を処理する。文1と文2の類似度がその閾値以上であれば、両者はチャンクを形成する。そうでない場合は即座に分割される。</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">最大最小意味チャンキングの長所と限界<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunkingは、長さの代わりに意味を使用することで、RAGシステムがテキストを分割する方法を改善しますが、銀の弾丸ではありません。ここでは、Max-Minセマンティック・チャンキングが優れている点と、まだ不十分な点について実践的に見ていきます。</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">何が優れているか</h3><p>Max-Min Semantic Chunkingは3つの重要な点で従来のチャンキングを改善します：</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1.ダイナミックで意味主導のチャンク境界</strong></h4><p>固定サイズや構造ベースのアプローチとは異なり、この方法はチャンキングを導くために意味の類似性に依存します。現在のチャンク内の類似度の最小値（そのチャンクがどの程度まとまっているか）と、新しい文とそのチャンク間の類似度の最大値（そのチャンクがどの程度フィットしているか）を比較する。後者の方が高ければ、その文はチャンクに加わり、そうでなければ新しいチャンクが始まる。</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2.シンプルで実用的なパラメータ調整</strong></h4><p>このアルゴリズムは3つのハイパーパラメータに依存します：</p>
<ul>
<li><p><strong>チャンクの最大サイズ</strong></p></li>
<li><p>最初の2文の<strong>類似度の最小</strong>値、そして</p></li>
<li><p>新しい文を追加するための<strong>類似度のしきい値</strong>。</p></li>
</ul>
<p>これらのパラメータは文脈に応じて自動的に調整され、より大きなチャンクは一貫性を維持するためにより厳しい類似度閾値を必要とする。</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3.低い処理オーバーヘッド</strong></h4><p>RAGパイプラインはすでに文の埋め込みを計算しているので、Max-Min Semantic Chunkingは重い計算を追加しない。必要なのは、文をスキャンする際のコサイン類似度チェックだけである。このため、余分なモデルや多段階のクラスタリングを必要とする多くのセマンティックチャンキング技術よりも安価である。</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">まだ解決できないこと</h3><p>Max-Minセマンティック・チャンキングはチャンクの境界を改善するが、文書セグメンテーションの課題をすべて取り除くことはできない。このアルゴリズムは文章を順番に処理し、局所的にしかクラスタリングしないため、長い文書や複雑な文書では長距離の関係を見逃す可能性がある。</p>
<p>よくある問題のひとつに、<strong>文脈の断片</strong>化がある。重要な情報が文書のさまざまな部分にまたがっている場合、アルゴリズムはそれらの断片を別々のチャンクに分割することがある。その場合、各チャンクは意味の一部のみを伝えることになる。</p>
<p>例えば、Milvus 2.4.13リリースノートでは、以下のように、あるチャンクにはバージョン識別子が含まれ、別のチャンクには機能リストが含まれます。<em>Milvus 2.4.13で導入された新機能は何ですか? "の</em>ようなクエリは両方に依存します。これらの詳細が異なるチャンクに分割されている場合、埋め込みモデルはそれらをつなげることができず、検索が弱くなる可能性があります。</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Milvus 2.4.13のリリースノートで、バージョン識別子と機能リストが別々のチャンクに分割されている例。</span> </span></li>
</ul>
<p>この断片化はLLM生成段階にも影響します。バージョン参照があるチャンクにあり、機能説明が別のチャンクにある場合、モデルは不完全なコンテキストを受け取り、2つの関係をきれいに推論することができません。</p>
<p>このようなケースを軽減するために、システムはしばしばスライディングウィンドウ、チャンク境界の重複、マルチパススキャンなどのテクニックを使用する。これらのアプローチは、欠落したコンテキストの一部を再導入し、断片化を減らし、検索ステップが関連情報を保持するのを助ける。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic ChunkingはすべてのRAG問題を解決する魔法のような方法ではないが、チャンクの境界をよりまともに考える方法を与えてくれる。トークンの制限でアイデアの切り分けを決めるのではなく、埋め込みを使って実際に意味が移動する場所を検出するのだ。API、仕様書、ログ、リリースノート、トラブルシューティングガイドなど、実世界の多くのドキュメントでは、これだけで検索品質を著しく向上させることができる。</p>
<p>このアプローチで私が気に入っているのは、既存のRAGパイプラインに自然にフィットすることだ。すでに文章や段落を埋め込んでいる場合、追加コストは基本的にいくつかの余弦類似度チェックだけだ。余分なモデルや複雑なクラスタリング、ヘビー級の前処理は必要ない。そして、この方法がうまく機能した場合、生成されるチャンクはより「人間的」なものに感じられる。</p>
<p>しかし、この方法にはまだ盲点がある。局所的にしか意味を見出せず、意図的にばらばらになった情報をつなぎ直すことができないのだ。オーバーラッピングウィンドウ、マルチパススキャン、その他の文脈を保持するトリックは、特に参照と説明が互いに離れた場所にある文書にはまだ必要である。</p>
<p>それでも、Max-Min Semantic Chunkingは、恣意的なテキストスライスから、実際にセマンティクスを尊重する検索パイプラインへと、私たちを正しい方向へと導いてくれる。RAGの信頼性を高める方法を模索しているのであれば、試してみる価値はあるだろう。</p>
<p>RAGのパフォーマンスを向上させる方法についてご質問がありますか？私たちの<a href="https://discord.com/invite/8uyFbECzPX">Discordに</a>参加して、日々実際の検索システムを構築し、チューニングしているエンジニアとつながりましょう。</p>
