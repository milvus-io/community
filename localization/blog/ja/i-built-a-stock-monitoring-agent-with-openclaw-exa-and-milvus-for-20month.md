---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: OpenClaw、Exa、milvusで月20ドルの株式監視エージェントを構築した
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  OpenClaw、Exa、Milvusを使ったAI株式監視エージェントの構築ステップバイステップガイド。モーニング・ブリーフ、トレード・メモリー、アラートは月額20ドル。
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>私は副業として米国株の取引をしている。同僚は、私の戦略は「興奮で高く買い、恐怖で安く売る。</p>
<p>この繰り返しが私を苦しめる。相場とにらめっこするたびに、予定外の取引をしてしまう。原油が急騰すればパニック売り。あるハイテク株が4％急騰し、私はそれを追いかける。一週間後、自分の取引履歴を見て、<em>前四半期も同じようなことをやっていたな</em>、と思う。</p>
<p>そこで私は、私の代わりに市場を監視し、同じ間違いを犯さないようにするエージェントをオープンクローで構築した。セキュリティ・リスクが高すぎるからだ。その代わり、マーケットウォッチングに費やす時間を節約し、同じ間違いを犯さないようにしてくれる。</p>
<p>このエージェントは3つの部分で構成されており、月々約20ドルかかる：</p>
<ul>
<li><strong>OpenClawはすべてを自動操縦で実行する。</strong>OpenClawは30分のハートビートでエージェントを動かし、実際に何か重要なことがあったときだけピングを鳴らしてくれる。以前は、価格を見れば見るほど、衝動的に反応していた。</li>
<li><strong>Exaで正確なリアルタイム検索。</strong>エクサは、厳選された情報源をスケジュール通りに閲覧・要約してくれるので、毎朝すっきりとしたブリーフィングを受けることができる。以前は、信頼できるニュースを見つけるために、SEOスパムや憶測をふるいにかけて1日1時間費やしていた。金融サイトはスクレイパーと戦うために毎日更新されるため、自動化できなかったのだ。</li>
<li><strong>Milvusで個人の履歴と嗜好を管理。</strong>Milvusは私の取引履歴を保存し、私が決断を下す前にエージェントがそれを検索する。以前は、過去の取引を見直すのは面倒だったので、同じ間違いを別のティッカーで繰り返していました。<a href="https://zilliz.com/cloud">Zilliz Cloudは</a>Milvusのフルマネージド・バージョンです。手間をかけずに利用したいのであれば、Zilliz Cloudは素晴らしい選択肢です<a href="https://cloud.zilliz.com/signup">（無料ティアもあります</a>）。</li>
</ul>
<p>私がどのようにセットアップしたかを順を追って説明しよう。</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">ステップ1：Exaでリアルタイムのマーケット・インテリジェンスを得る<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>以前は、金融アプリを見たり、スクレイパーを書いたり、プロのデータ端末を調べたりしていた。私の経験？アプリはシグナルをノイズに埋もれさせ、スクレイパーは常に壊れ、専門的なAPIは法外に高価だった。ExaはAIエージェントのために作られた検索APIで、上記の問題を解決する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exaは</a></strong>、AIエージェントのために構造化されたAI対応データを返すウェブ検索APIだ。Milvusのフルマネージドサービスである<a href="https://zilliz.com/cloud">Zilliz Cloudを</a>利用している。Perplexityが人間が使う検索エンジンなら、ExaはAIが使う。エージェントがクエリを送信すると、Exaは記事テキスト、キーセンテンス、要約をJSONとして返す。</p>
<p>Exaはまた、フード下でセマンティック検索を使用しているため、エージェントは自然言語でクエリーを行うことができる。なぜNVIDIAの株価は2026年第4四半期の業績が好調だったにもかかわらず下落したのか」というようなクエリは、SEOクリックベイトのページではなく、ロイターやブルームバーグからのアナリストの内訳を返します。</p>
<p>Exaには、月1,000回の検索が可能な無料版がある。SDKをインストールし、自分のAPIキーと交換する：</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>これがコア・コールだ：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>contentsパラメータは、記事の全文を取得し、主要な文章を抽出し、あなたが提供した質問に基づいた要約を生成します。1回のAPI呼び出しで、20分のタブホッピングを置き換えることができる。</p>
<p>この基本パターンは多くのことをカバーしているが、私は定期的に遭遇するさまざまな状況に対処するために4つのバリエーションを構築することにした：</p>
<ul>
<li><strong>ソースの信頼性によるフィルタリング。</strong>収益分析では、ロイター、ブルームバーグ、ウォールストリート・ジャーナルだけが欲しい。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>類似分析を見つける。</strong>良い記事を1つ読んだら、手作業で探すことなく、同じトピックについてより多くの視点が欲しい。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>複雑な質問に対するディープサーチ。</strong>例えば、中東の緊張が半導体のサプライチェーンにどのような影響を与えるか、など。ディープサーチは複数のソースを統合し、構造化された要約を返します。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>リアルタイムのニュース・モニタリング。</strong>市場の時間帯には、その日限りのニュース速報が必要だ。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>これらのパターンを使って、FRBの政策、ハイテク企業の業績、原油価格、マクロ指標をカバーするテンプレートを12個ほど作成した。これらは毎朝自動的に実行され、私の携帯電話に結果がプッシュされる。以前は1時間かかっていたブラウジングも、今ではコーヒーを飲みながら5分でサマリーを読むことができる。</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">ステップ2：取引履歴をmilvusに保存し、より賢い決断を下す<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>エクサは私の情報の問題を解決してくれた。しかし、私はまだ同じ取引を繰り返していた。数日で回復する下落局面でパニック売りをしたり、すでに割高だった銘柄に勢いを追ったり。感情で行動しては後悔し、同じような状況が訪れる頃には教訓を忘れていた。</p>
<p>過去のトレードやその理由、失敗談を保存しておけるものが必要だったのだ。私が手作業で見直さなければならないようなものではなく（試したことはあるが、それを続けたことはない）、同じような状況が訪れるたびにエージェントが自分で検索できるようなものだ。もし私がミスを繰り返しそうになったら、ボタンを押す前にエージェントに教えてもらいたい。現在の状況 "と "過去の経験 "のマッチングは、ベクトルデータベースが解決する類似検索の問題である。</p>
<p><a href="https://github.com/milvus-io/milvus-lite">Milvus Liteを</a>使った。Milvusの軽量版で、ローカルで動作する。サーバーの設定がないので、プロトタイピングや実験に最適だ。データを3つのコレクションに分割した。埋め込み次元は、OpenAIのtext-embedding-3-smallモデルに合わせて1536とした：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>3つのコレクションは3種類の個人データに対応し、それぞれ異なる検索戦略を持つ：</p>
<table>
<thead>
<tr><th><strong>タイプ</strong></th><th><strong>何を保存するか</strong></th><th><strong>エージェントがそれをどのように使うか</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>嗜好</strong></td><td>バイアス、リスク許容度、投資哲学（「私はハイテク株を長期保有する傾向がある」）。</td><td>毎回エージェントのコンテキストにロードされる</td></tr>
<tr><td><strong>意思決定とパターン</strong></td><td>過去の特定の取引、学んだ教訓、市場観察</td><td>関連する状況が出てきたときのみ、類似検索で取得</td></tr>
<tr><td><strong>外部知識</strong></td><td>調査レポート、SEC提出書類、公開データ</td><td>Milvusには保存されていない - Exaを通じて検索可能</td></tr>
</tbody>
</table>
<p>3つの異なるコレクションを構築したのは、これらを1つのコレクションに混ぜると、無関係な取引履歴ですべてのプロンプトを肥大化させるか、現在のクエリと十分に一致しない場合にコアバイアスを失うことになるからだ。</p>
<p>一旦コレクションが存在すると、それらを自動的に入力する方法が必要でした。エージェントとの会話のたびに情報をコピーペーストしたくなかったので、各チャットセッションの最後に実行されるメモリエクストラクタを構築した。</p>
<p>エクストラクタは2つのことをする：抽出と重複排除だ。エクストラクタはLLMに、会話から構造化された洞察（決定、好み、パターン、教訓）を引き出すよう依頼し、それぞれを適切なコレクションにルーティングする。何かを保存する前に、すでにあるものとの類似性をチェックする。新しい洞察が既存のエントリーと92％以上類似している場合、それはスキップされる。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>私が新しい市場状況に直面し、トレードの衝動に駆られると、エージェントはリコール機能を実行する。私が何が起きているかを説明すると、エージェントは3つのコレクションすべてから関連する履歴を検索する：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>例えば、3月上旬に中東の緊張でハイテク株が3～4％下落したとき、エージェントは3つのことを検索した：2024年10月の地政学的ディップ時にパニック売りをしないことについての教訓、私が地政学的リスクをオーバーウェイトする傾向があるという嗜好メモ、そして私が記録したパターン（地政学に起因するハイテク株下落は通常1～3週間で回復する）。</p>
<p>同僚の意見：もしトレーニングデータが負けた記録なら、AIは一体何を学んでいるのだろう？しかし、そこが重要なのだ。エージェントは私のトレードをコピーしているのではなく、次のトレードから私を説得できるように、トレードを記憶しているのだ。</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">ステップ 3: エージェントにOpenClawスキルで分析を教える<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>この時点で、エージェントは信頼できる情報<a href="https://exa.ai/">（Exa</a>）と個人的な記憶<a href="https://github.com/milvus-io/milvus-lite">（milvus</a>）を持っている。しかし、その両方をLLMに渡して「これを分析しろ」と言うと、一般的な、ヘッジの効いた回答が返ってくる。ありとあらゆる角度から言及し、最後に「投資家はリスクを天秤にかけるべきだ」と締めくくる。何も書いていないのと同じだ。</p>
<p>解決策は、自分で分析フレームワークを書き、それをエージェントに明確な指示として渡すことだ。どの指標を重視するのか、どの状況を危険と考えるのか、いつ保守的になるのか積極的になるのか、などを伝えなければならない。これらのルールは投資家ごとに異なるため、自分で定義する必要があります。</p>
<p>OpenClawはこれをスキル（skills/ディレクトリ内のマークダウン・ファイル）を使って行います。エージェントが関連する状況に遭遇すると、マッチするスキルがロードされ、自由奔放に動くのではなく、あなたのフレームワークに従います。</p>
<p>これは、決算報告後の銘柄評価用に書いたものです：</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>最後の一行が最も重要だ。私は恐怖心がデータに優先する傾向がある。Milvusの履歴で、急落後に売ったことを後悔しているのであれば、はっきりとそう言ってください"。これは、私がどこで間違ったかをエージェントに正確に伝えることで、エージェントが背中を押すタイミングを知るためだ。自分で作る場合は、この部分を自分のバイアスに基づいてカスタマイズすることになる。</p>
<p>センチメント分析、マクロ指標、セクター・ローテーション・シグナルについても同様のスキルを書いた。また、バフェットのバリューフレームワークやブリッジウォーターのマクロアプローチなど、私が尊敬する投資家が同じ状況をどのように評価するかをシミュレートするスキルも書いた。これらは意思決定者ではなく、追加の視点なのだ。</p>
<p>警告：LLMにRSIやMACDのようなテクニカル指標を計算させてはいけない。彼らは自信満々に数字を幻視する。自分で計算するか、専用のAPIを呼び出し、その結果を入力としてSkillに送り込んでください。</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">ステップ 4: OpenClaw Heartbeat でエージェントを起動する<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>上記の全てはまだ手動でトリガーする必要があります。更新が必要なたびにターミナルを開かなければならないのであれば、会議中にブローカーアプリをドゥームスクロールするようなものです。</p>
<p>OpenClaw の Heartbeat メカニズムはこれを解決します。ゲートウェイはエージェントに30分ごとにpingを送り（設定可能）、エージェントはHEARTBEAT.mdファイルをチェックして、その瞬間に何をすべきかを決定します。HEARTBEAT.mdは、時間ベースのルールが記述されたマークダウンファイルです：</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">結果スクリーンの使用時間を減らし、衝動的な取引を減らす<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>以下は、このシステムが日々実際に生成するものである：</p>
<ul>
<li><strong>朝のブリーフ（午前7時）。</strong>エージェントは一晩中エクサを実行し、私のポジションと関連する履歴をmilvusから取得し、パーソナライズされたサマリーを私の携帯電話にプッシュする。一晩の出来事、私の持ち株との関連、そして1つから3つのアクション・アイテム。歯を磨きながら読んでいる。</li>
<li><strong>日中アラート（9:30 AM-4:00 PM ET）。</strong>30分ごとにエージェントが私のウォッチリストをチェックする。3％以上動いた銘柄があれば、その銘柄を買った理由、ストップロスの位置、以前にも同じような状況に陥ったことがあるかどうかなど、状況とともに通知が届く。</li>
<li><strong>週次レビュー（週末）。</strong>市場の動き、朝の予想との比較、覚えておく価値のあるパターンなど。私は土曜日に30分かけてそれを読む。それ以外の週は、意図的に画面から離れる。</li>
</ul>
<p>最後の点が最大の変化だ。エージェントは時間を節約するだけでなく、市場を見ることから私を解放してくれる。価格を見ていなければ、パニック売りはできない。</p>
<p>このシステムを導入する前は、情報収集、市場監視、取引検討に週10～15時間を費やしており、会議、通勤時間、深夜のスクロールなどに分散していた。今では、毎日朝のブリーフに5分、週末のレビューに30分の合計2時間程度だ。</p>
<p>情報の質も向上した。ツイッターで話題になったものではなく、ロイターやブルームバーグのサマリーを読んでいる。そして、行動を起こしたくなるたびにエージェントが過去の失敗を引き出してくれるので、衝動的な取引を大幅に減らすことができた。これが私をより良い投資家にしたと証明することはまだできないが、無謀な投資家は減った。</p>
<p>総費用：OpenClawに月10ドル、Exaに月10ドル、milvus Liteを稼働させるための電気代が少し。</p>
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
    </button></h2><p>私が同じような衝動的な取引を繰り返していたのは、自分の情報が悪く、自分の履歴をめったに見直さず、一日中マーケットとにらめっこしていたからだ。そこで私は、3つのことをすることでこれらの問題を解決するAIエージェントを作った：</p>
<ul>
<li>SEOスパムや有料サイトを1時間スクロールする代わりに、<strong><a href="https://exa.ai/">Exaで</a></strong><strong>信頼できるマーケットニュースを収集する</strong>。</li>
<li><a href="http://milvus.io">Milvusを使って</a><strong>過去のトレードを記憶し</strong>、すでに後悔しているミスを繰り返そうとしているときに警告してくれる。</li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClawで</a><strong>自動操縦し</strong>、実際に重要なことがあったときだけpingを送る。</li>
</ul>
<p>総費用は月20ドル。エージェントは私のお金を売買したり、触ったりしない。</p>
<p>最大の変化はデータでもアラートでもない。マーケットを見なくなったことだ。先週の水曜日、私はこのことをすっかり忘れていた。今でも時々損をすることはあるが、その頻度はずっと減り、週末を再び楽しむことができるようになった。同僚はまだジョークを更新していないけど、時間をおいてね。</p>
<p>このエージェントもたった2回の週末で構築できた。年前だったら、同じセットアップでスケジューラー、通知パイプライン、メモリー管理をゼロから書いていただろう。OpenClawの場合、その時間のほとんどは、インフラを書くことではなく、私自身の取引ルールを明確にすることに費やされた。</p>
<p>そして、一つのユースケースのために構築した後は、アーキテクチャは移植可能だ。Exaの検索テンプレートとOpenClawのスキルを入れ替えれば、研究論文を監視したり、競合他社を追跡したり、規制の変更を監視したり、サプライチェーンの混乱を追跡したりするエージェントができる。</p>
<p>試してみたい方は</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタート</a></strong>- 5分以内にローカルでベクターデータベースを稼動させることができます。</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong>- スキルとハートビートで最初のエージェントをセットアップする。</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong>- 月額1,000件の検索を無料でご利用いただけます。</li>
</ul>
<p>質問がある、デバッグを手伝って欲しい、または作ったものを自慢したいですか？<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">MilvusのSlack</a>チャンネルに参加してください。コミュニティとチームの両方から助けを得る最速の方法です。コミュニティとチームの両方から助けを得る最速の方法です。また、あなたのセットアップについて一対一で話したい場合は、20分の<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvusオフィスアワーを</a>予約してください。</p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw（旧Clawdbot &amp; Moltbot）解説：自律型AIエージェントの完全ガイド</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw（旧Clawdbot/Moltbot）をSlackでセットアップするためのステップ・バイ・ステップ・ガイド</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">OpenClawのようなAIエージェントがトークンを消費する理由とコスト削減方法</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClawのメモリシステムを抽出してオープンソース化した（memsearch）</a></li>
</ul>
