---
id: geo-content-pipeline-openclaw-milvus.md
title: GEOコンテンツをスケールで：AI検索でブランドに毒されずにランクインする方法
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: >-
  AI回答がクリックに取って代わるにつれ、オーガニックトラフィックが減少しています。幻覚を見たりブランドを傷つけたりすることなく、GEOコンテンツを大規模に生成する方法を学びましょう。
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>オーガニック検索のトラフィックが減少していますが、それはSEOが悪化したからではありません。<a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">SparkToroによると、</a>グーグルクエリのおよそ60％がゼロクリックで終わっている。ユーザーは、あなたのページをクリックする代わりに、AIが生成した要約から答えを得るのだ。Perplexity、ChatGPT Search、Google AI Overview - これらは将来の脅威ではありません。すでにあなたのトラフィックを食っているのだ。</p>
<p><strong>ジェネレーティブ・エンジン最適化（GEO</strong>）は、あなたがそれに対抗する方法です。従来のSEOがランキングアルゴリズム（キーワード、バックリンク、ページスピード）を最適化するのに対して、GEOは複数のソースから答えを導き出すAIモデルを最適化する。目標は、AI検索エンジンが回答で<em>あなたのブランドを</em>引用するようにコンテンツを構成することだ。</p>
<p>問題は、GEOはほとんどのマーケティングチームが手作業で作成できない規模のコンテンツを必要とすることだ。AIモデルは単一のソースに依存するのではなく、何十ものソースを総合的に判断する。コンスタントに表示されるためには、何百ものロングテールクエリをカバーする必要があり、それぞれが、ユーザーがAIアシスタントに尋ねる可能性のある特定の質問をターゲットにしている。</p>
<p>LLMに記事をバッチ生成させるという明らかな近道は、より悪い問題を引き起こす。GPT-4に50記事の作成を依頼すれば、捏造された統計、再利用された言い回し、あなたのブランドが行ったことのない主張でいっぱいの50記事が出来上がるだろう。それはGEOではない。それは、<strong>あなたのブランド名を冠したAIコンテンツスパム</strong>だ。</p>
<p>この問題を解決するには、すべてのジェネレーションコールを検証済みのソース文書、つまり本物の製品仕様書、承認されたブランドメッセージ、そしてLLMが捏造する代わりに利用する実際のデータに基づかせることです。このチュートリアルでは、3つのコンポーネントに基づいて構築された、まさにそれを実行するプロダクションパイプラインについて説明します：</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong>- ワークフローをオーケストレーションし、Telegram、WhatsApp、Slackのようなメッセージングプラットフォームに接続するオープンソースのAIエージェントフレームワーク。</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong>- 知識の保存、セマンティック重複排除、RAG検索を処理する<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a></li>
<li><strong>LLM（GPT-4o、Claude、Gemini）</strong>- 生成および評価エンジン。</li>
</ul>
<p>最終的には、ブランド文書をMilvusの知識ベースに取り込み、シードトピックをロングテールクエリに展開し、それらを意味的に重複排除し、品質スコアリングを組み込んだ記事をバッチ生成する実用的なシステムを手に入れることができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>注：</strong>これは実際のマーケティングワークフローのために構築された実用的なシステムですが、コードは出発点です。プロンプト、スコアリングのしきい値、およびナレッジベースの構造を、あなた自身のユースケースに適応させたいでしょう。</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">パイプラインがボリューム×クオリティを解決する方法<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>コンポーネント</th><th>役割</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>エージェントオーケストレーション、メッセージング統合（Lark、Telegram、WhatsApp）</td></tr>
<tr><td>Milvus</td><td>知識ストレージ、セマンティック重複排除、RAG検索</td></tr>
<tr><td>LLM (GPT-4o, Claude, Gemini)</td><td>クエリ展開、記事生成、品質スコアリング</td></tr>
<tr><td>埋め込みモデル</td><td>テキストからMilvusのベクトルへ（OpenAI、デフォルトで1536次元）</td></tr>
</tbody>
</table>
<p>パイプラインは2つのフェーズで実行される。<strong>フェーズ0は</strong>ソースを知識ベースに取り込む。<strong>フェーズ1は</strong>そこから記事を生成する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>フェーズ1の内部では以下のようなことが行われる：</p>
<ol>
<li>ユーザーがLark、Telegram、WhatsAppを通じてメッセージを送信する。OpenClawはそれを受信し、GEO生成スキルにルーティングする。</li>
<li>このスキルは、ユーザーのトピックをLLM（実際のユーザーがAI検索エンジンに尋ねる具体的な質問）を使ってロングテールの検索クエリに展開する。</li>
<li>各クエリはmilvusに埋め込まれ、意味的な重複がないかチェックされる。既存のコンテンツと類似しすぎているクエリ（余弦類似度 &gt; 0.85）は削除される。</li>
<li>生き残ったクエリは、<strong>Milvusの2つのコレクション</strong>（知識ベース（ブランド文書）と記事アーカイブ（以前に生成されたコンテンツ））から同時にRAG検索をトリガーする。この二重検索により、出力は実際のソース資料に基づいたものとなる。</li>
<li>LLMは、検索されたコンテキストを使用して各記事を生成し、GEOの品質ルーブリックに照らして採点する。</li>
<li>完成した記事はmilvusに書き戻され、次のバッチのためにdedupとRAGプールを充実させる。</li>
</ol>
<p>GEOスキルの定義には、最適化のルールも組み込まれている：直接的な回答でリードする、構造化されたフォーマットを使用する、ソースを明確に引用する、オリジナルの分析を含める。AI検索エンジンは、構造によってコンテンツを解析し、ソースのない主張を優先しないため、各ルールは特定の検索行動に対応する。</p>
<p>生成はバッチ処理で行われる。最初のラウンドは、レビューのためにクライアントに送られる。方向性が確認されると、パイプラインは本番稼動へとスケールする。</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">知識層がGEOとAIスパムを分ける理由<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>このパイプラインを "単なるChatGPTのプロンプト "と区別しているのは、ナレッジレイヤーである。知識層がなければ、LLMの出力は洗練されているように見えるが、検証可能なことは何も言っていない。<a href="https://zilliz.com/what-is-milvus">Milvusは</a>、このパイプラインを駆動するベクトルデータベースであり、ここで重要ないくつかの機能をもたらす：</p>
<p><strong>セマンティック重複排除は、キーワードが見逃すものをキャッチする。</strong>キーワードマッチングは、「Milvusのパフォーマンスベンチマーク」と「Milvusは他のベクトルデータベースと比較してどうなのか」を無関係なクエリとして扱う。<a href="https://zilliz.com/learn/vector-similarity-search">ベクターの類似性は</a>、これらが同じ質問であることを認識し、パイプラインは世代コールを無駄にする代わりに重複をスキップする。</p>
<p><strong>デュアルコレクションRAGは、ソースとアウトプットを別々に保持する。</strong> <code translate="no">geo_knowledge</code> は、取り込まれたブランド文書を格納する。<code translate="no">geo_articles</code> は、生成されたコンテンツを格納する。知識ベースは事実を正確に保ち、記事アーカイブはバッチ全体で一貫したトーンを保つ。2つのコレクションは独立して管理されているため、ソースを更新しても既存の記事が中断されることはない。</p>
<p><strong>規模に応じて改善されるフィードバック・ループ。</strong>生成された各記事は即座にMilvusに書き戻される。次のバッチは、より大きなDedupプールと豊富なRAGコンテキストを持つ。時間とともに品質が向上する。</p>
<p><strong>様々なニーズに対応する複数の導入オプション。</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>：Milvusの軽量版で、Dockerは必要なく、1行のコードでラップトップ上で動作します。プロトタイピングに最適で、このチュートリアルで必要なのはこれだけです。</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a>StandaloneとMilvus Distributed: よりスケーラブルな本番用バージョンです。</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloudは</strong></a>手間のかからないマネージドMilvusです。技術的なセットアップやメンテナンスについて心配する必要は全くありません。無料版もあります。</p></li>
</ul>
<p>このチュートリアルでは、Milvus Liteを使用します。アカウントの作成、<code translate="no">pip install pymilvus</code> を超えるインストールは不要で、すべてがローカルで実行されるため、何かをコミットする前に完全なパイプラインを試すことができます。</p>
<p>デプロイの違いはURIにあります：</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">ステップバイステップのチュートリアル<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>パイプライン全体は、OpenClaw スキル（<code translate="no">SKILL.MD</code> 命令ファイルとコード実装を含むディレクトリ）としてパッケージ化されます。</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">ステップ 1: OpenClaw スキルの定義</h3><p><code translate="no">SKILL.md</code> は、OpenClaw にこのスキルで何ができるか、どのように呼び出すかを指示します。知識ベースへのフィードのための<code translate="no">geo_ingest</code> と、アーティクルのバッチ生成のための<code translate="no">geo_generate</code> です。また、LLM が生成する GEO 最適化ルールも含まれています。</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">ステップ2：ツールの登録とPythonへのブリッジ</h3><p>OpenClawはNode.js上で動作しますが、GEOパイプラインはPythonです。<code translate="no">index.js</code> 、OpenClawに各ツールを登録し、対応するPythonスクリプトに実行を委任します。</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">ステップ3：ソースの取り込み</h3><p>何かを生成する前に、ナレッジベースが必要である。<code translate="no">ingest.py</code> 、ウェブページをフェッチするか、ローカルドキュメントを読み込み、テキストをチャンクし、埋め込み、Milvusの<code translate="no">geo_knowledge</code> コレクションに書き込む。これによって、生成されたコンテンツはLLMの幻覚ではなく、実際の情報に基づいたものになる。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">ステップ4：ロングテールクエリの展開</h3><p>Milvusベクトルデータベース」のようなトピックが与えられると、LLMは具体的で現実的な検索クエリのセットを生成する。このプロンプトは、情報、比較、ハウツー、問題解決、FAQなど、さまざまなインテント・タイプをカバーしている。</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">ステップ5：Milvusによる重複排除</h3><p><a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索は</a>ここでその地位を獲得する。各拡張クエリは埋め込まれ、<code translate="no">geo_knowledge</code> と<code translate="no">geo_articles</code> コレクションの両方と比較される。コサイン類似度が0.85を超える場合、クエリはすでにシステム内にあるものと意味的に重複しており、削除される。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">ステップ6：デュアルソースRAGで記事を生成する</h3><p>生存している各クエリに対して、ジェネレーターはMilvusの両方のコレクションからコンテキストを検索する。<code translate="no">geo_knowledge</code> からの権威あるソース資料と、<code translate="no">geo_articles</code> からの以前に生成された記事である。この二重の検索は、コンテンツを事実に基づいて（知識ベース）、内部的に一貫性を保つ（記事履歴）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>2つのコレクションは同じエンベッディングディメンション（1536）を使用するが、異なる役割を果たすため、異なるメタデータを格納する。<code translate="no">geo_knowledge</code> は各チャンクがどこから来たかを追跡し（ソース帰属のため）、<code translate="no">geo_articles</code> は元のクエリとGEOスコアを格納する（dedupマッチングと品質フィルタリングのため）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Milvusデータモデル</h3><p>各コレクションをゼロから作成する場合、以下のようになります：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">パイプラインの実行<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">skills/geo-generator/</code> ディレクトリを OpenClaw のスキルフォルダにドロップするか、zip ファイルを Lark に送って OpenClaw にインストールさせます。<code translate="no">OPENAI_API_KEY</code> を設定する必要があります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>そこから、チャットメッセージを通してパイプラインとやりとりします：</p>
<p><strong>例 1:</strong>ソース URL をナレッジベースに取り込み、記事を生成する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>例2：</strong>本（Wuthering Heights）をアップロードし、3つのGEO記事を生成し、Larkのドキュメントにエクスポートする。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">このパイプラインを実運用に移す<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルのすべてはMilvus Lite上で実行されます。つまり、ラップトップ上で実行され、ラップトップが終了すると停止します。実際のGEOパイプラインでは、これでは不十分です。会議中に記事を作成したい。来週火曜日に同僚がバッチを実行するときに、ナレッジベースを利用できるようにしたい。</p>
<p>この時点で、解決策は2つある。</p>
<p><strong>Milvusをスタンドアロンまたは分散モードでセルフホストする。</strong>エンジニアリングチームは、サーバー（物理的またはAWSのようなクラウドプロバイダーからレンタルした専用コンピューター）にフルバージョンをインストールする。Milvusは非常に高性能で、デプロイメントを完全にコントロールできますが、セットアップ、メンテナンス、スケーリングに専門のエンジニアリングチームが必要です。</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloudを</strong></a><strong>使う</strong><strong>。</strong>Zilliz Cloudは、同じチームによって構築された、より高度なエンタープライズグレードの機能を備えたフルマネージドMilvusです。</p>
<ul>
<li><p><strong>運用・保守の手間がかかりません。</strong></p></li>
<li><p><strong>無料ティアあり。</strong> <a href="https://cloud.zilliz.com/signup">無料ティアには</a>5GBのストレージが含まれ、これは360回分の<em>『ウザーリングハイツ』</em>（360冊の本）のすべてをインジェストするのに十分な容量だ。より大きなワークロードには30日間の無料トライアルもあります。</p></li>
<li><p><strong>常に新機能の先頭に</strong>Milvusが改良版をリリースすると、Zilliz Cloudは自動的にそれを入手します。</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p><a href="https://cloud.zilliz.com/signup">Zilliz Cloudにサインアップして</a>、試してみてください。</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">GEOコンテンツ生成が裏目に出る場合<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>GEOコンテンツ生成は、その背後にある知識ベースと同じくらいうまく機能します。このアプローチが良いことよりも悪いことの方が多いケースをいくつかご紹介します：</p>
<p><strong>権威あるソースがない。</strong>確かな知識ベースがなければ、LLMはトレーニングデータに頼ってしまう。出力はよくても一般的なもの、悪くすれば幻覚に終わる。RAGステップの全ポイントは、検証された情報を基に生成することである。これをスキップすると、余分なステップでプロンプト・エンジニアリングを行っているだけになる。</p>
<p><strong>存在しないものを宣伝する。</strong>もし製品が説明通りに機能しなければ、それはGEOではなく、誤った情報である。自己採点ステップは、品質上の問題をいくつかキャッチするが、知識ベースが矛盾しない主張を検証することはできない。</p>
<p><strong>オーディエンスは純粋に人間である。</strong>GEO最適化（構造化された見出し、直接的な第一段落の回答、引用密度）は、AIが発見しやすいように設計されている。純粋に人間の読者のために書いているのであれば、定型的だと感じるかもしれません。どの読者をターゲットにしているのかを知ること。</p>
<p><strong>dedupのしきい値について。</strong>パイプラインはコサイン類似度が0.85以上のクエリを削除します。重複するクエリが多すぎる場合は、閾値を下げましょう。パイプラインが純粋に異なるクエリを破棄する場合は、閾値を上げます。0.85は妥当なスタートポイントですが、適切な値はトピックの狭さによって異なります。</p>
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
    </button></h2><p>GEOは10年前のSEOのようなものであり、適切なインフラが真の優位性を与えるのに十分な時期である。このチュートリアルでは、LLMの幻覚ではなく、あなたのブランド自身のソースに基づいた、AI検索エンジンが実際に引用する記事を生成するパイプラインを構築する。スタックは、オーケストレーションに<a href="https://github.com/nicepkg/openclaw">OpenClaw</a>、ナレッジストレージと<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>検索に<a href="https://milvus.io/intro">milvus</a>、生成とスコアリングにLLMを使用している。</p>
<p>完全なソースコードは<a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclawで</a>入手できる。</p>
<p>GEO戦略を構築中で、それをサポートするインフラが必要な場合：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、他のチームがどのようにコンテンツ、dedup、RAGのためにベクトル検索を使用しているかをご覧ください。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（20分）の無料セッションを予約して</a>、あなたのユースケースをチームと検討しましょう。</li>
<li>インフラストラクチャのセットアップを省きたい場合は、Milvusが管理する<a href="https://cloud.zilliz.com/signup">Zilliz Cloudの</a>無料ティアをご利用ください。</li>
</ul>
<hr>
<p>マーケティングチームがGEOを検討し始めたときに出てくるいくつかの質問：</p>
<p><strong>SEOのトラフィックが落ちている。GEOは</strong>SEOを置き換えるものではなく、新しいチャネルに拡張するものです。従来のSEOは、依然としてページをクリックしたユーザーからのトラフィックを促進します。GEOは、ユーザーがウェブサイトを訪問することなく、AI（Perplexity、ChatGPT Search、Google AI Overview）から直接回答を得るクエリのシェアを拡大していることをターゲットにしています。アナリティクスでゼロクリック率が上昇しているとしたら、それはGEOがクリックではなく、AIが生成した回答におけるブランドの引用を通じて、トラフィックを取り戻すために設計されたものです。</p>
<p><strong>ゲオのコンテンツは、通常のAIが生成するコンテンツとどのように違うのでしょうか？</strong>ほとんどのAIが生成するコンテンツは、一般的なものです。LLMは学習データから導き出し、合理的に聞こえるものを生成しますが、ブランドの実際の事実、主張、またはデータに基づいたものではありません。GEOのコンテンツは、RAG（検索補強型生成）を使用して検証されたソースの知識ベースに基づいています。漠然とした一般論ではなく具体的な商品の詳細、捏造された統計ではなく実際の数字、何十もの記事にわたる一貫したブランドボイスなど、その違いはアウトプットに表れます。</p>
<p><strong>GEOを機能させるために必要な記事の数は？</strong>魔法の数はありませんが、ロジックは単純です：AIモデルは、回答ごとに複数のソースから合成します。質の高いコンテンツでカバーするロングテールクエリが多ければ多いほど、あなたのブランドが表示される頻度も高くなります。コアトピックを中心に20-30記事から始め、どの記事が引用されるかを測定し（AIによる言及率とリファラートラフィックをチェックする）、そこから規模を拡大する。</p>
<p><strong>AI検索エンジンは、大量に作成されたコンテンツにペナルティを与えないのか？</strong>低品質なものであれば、ペナルティを与えるだろう。AI検索エンジンは、ソースのない主張、リサイクルされた言い回し、オリジナルの価値を付加していないコンテンツを検出することに長けてきている。だからこそ、このパイプラインには、基礎となる知識ベースと、品質管理のための自己採点ステップが含まれているのだ。目標は、より多くのコンテンツを生成することではなく、AIモデルが引用するのに十分な純粋に有用なコンテンツを生成することなのだ。</p>
