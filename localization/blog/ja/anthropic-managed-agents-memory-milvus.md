---
id: anthropic-managed-agents-memory-milvus.md
title: MilvusでAnthropicのマネージドエージェントに長期メモリーを追加する方法
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  AnthropicのManaged
  Agentsはエージェントの信頼性を高めましたが、すべてのセッションは空白で始まります。ここでは、セッション内のセマンティックリコールとエージェント間の共有メモリのためにmilvusをペアリングする方法を紹介する。
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Anthropicの<a href="https://www.anthropic.com/engineering/managed-agents">マネージドエージェントは</a>、エージェントのインフラをレジリエントにします。200ステップのタスクは、ハーネスのクラッシュ、サンドボックスのタイムアウト、または飛行中のインフラ変更に人間の介入なしに耐えられるようになり、Anthropicの報告によると、デカップリング後、p50のtime-to-first-tokenは約60％減少し、p95は90％以上減少しました。</p>
<p>信頼性で解決できないのはメモリだ。200ステップのコードマイグレーションで、201ステップ目に新たな依存関係の衝突が発生した場合、前回の衝突をどのように処理したかを効率的に振り返ることはできません。ある顧客のために脆弱性スキャンを実行しているエージェントは、別のエージェントが1時間前に同じケースをすでに解決していることを知らない。すべてのセッションは白紙のページから始まり、並列の頭脳は他のエージェントがすでに解決したことにアクセスできない。</p>
<p>解決策は、<a href="https://milvus.io/">Milvusのベクトルデータベースと</a>Anthropicのマネージドエージェントを組み合わせることである：セッション内でのセマンティックリコールと、セッション間での共有<a href="https://milvus.io/docs/milvus_for_agents.md">ベクトルメモリレイヤー</a>である。セッション契約はそのままで、ハーネスは新しいレイヤーを1つ獲得し、ロングホライズンエージェントタスクは質的に異なる能力を獲得する。</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">マネージド・エージェントが解決したこと（そして解決しなかったこと）<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>マネージドエージェントは、エージェントを3つの独立したモジュールに分離することで信頼性を解決した。解決できなかったのは、単一セッション内でのセマンティック・リコールや、並列セッション間での共有経験としての記憶です。</strong>ここでは、何がデカップリングされたのか、そしてそのデカップリングされた設計の中でメモリのギャップがどこにあるのかを説明します。</p>
<table>
<thead>
<tr><th>モジュール</th><th>モジュール</th></tr>
</thead>
<tbody>
<tr><td><strong>セッション</strong></td><td>起こったことすべての追記型イベントログ。ハーネスの外に保存される。</td></tr>
<tr><td><strong>ハーネス</strong></td><td>クロードを呼び出し、クロードのツールコールを関連するインフラにルーティングするループ。</td></tr>
<tr><td><strong>サンドボックス</strong></td><td>クロードがコードを実行し、ファイルを編集する隔離された実行環境。</td></tr>
</tbody>
</table>
<p>この設計を機能させるリフレームは、Anthropicの投稿で明確に述べられている：</p>
<p><em>「セッションはクロードのコンテキストウィンドウではない。</em></p>
<p>セッションはクロードのコンテキストウィンドウではない。コンテキストウィンドウは刹那的で、トークンで区切られ、モデル呼び出しごとに再構築され、呼び出しが戻ると破棄される。セッションは耐久性があり、ハーネスの外部に保存され、タスク全体の記録システムを表す。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ハーネスがクラッシュすると、プラットフォームは<code translate="no">wake(sessionId)</code> で新しいハーネスを起動する。新しいハーネスは、<code translate="no">getSession(id)</code> を介してイベントログを読み、タスクは最後に記録されたステップから再開する。</p>
<p>Managed Agentsの投稿が扱っておらず、またそうであるとも主張していないのは、エージェントが何かを記憶する必要があるときに何をするかということです。実際のワークロードをアーキテクチャに通すと、2つのギャップが現れます。1つは1つのセッション内に存在するもので、もう1つはセッション間に存在するものです。</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">問題1：リニアセッションログが数百ステップを超えると失敗する理由<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>リニアセッションログは、数百ステップを超えると失敗します。なぜなら、シーケンシャルリードとセマンティック検索は、基本的に異なる作業負荷であり、</strong> <code translate="no">**getEvents()**</code> <strong>APIは、最初の</strong><strong>作業負荷</strong> <strong>にしか対応して</strong><strong>いないから</strong> <strong>です。</strong>位置によるスライスやタイムスタンプへのシークは、"このセッションがどこで終わったか "に答えるには十分である。それは、エージェントがどんな長いタスクでも予測できる必要な質問に答えるには十分ではない。</p>
<p>ステップ200で、新しい依存関係の衝突にぶつかったコード移行を考えてみよう。自然な行動は振り返ることだ。エージェントは、この同じタスクで、以前にも同じようなことに遭遇したことがあっただろうか？どのようなアプローチを試したか？それはうまくいったのか、それとも下流で何かを後退させたのか？</p>
<p><code translate="no">getEvents()</code> 、それに答えるには2つの方法がある：</p>
<table>
<thead>
<tr><th>オプション</th><th>問題</th></tr>
</thead>
<tbody>
<tr><td>すべてのイベントを順次スキャンする</td><td>200ステップでは遅い。2,000ステップでは不可能。</td></tr>
<tr><td>ストリームの大きなスライスをコンテキスト・ウィンドウにダンプする。</td><td>トークンにコストがかかり、信頼性が低い。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>セッションはリカバリーと監査には良いが、"前に見たことがある "ことをサポートするインデックスで構築されていない。長期的なタスクは、その質問がオプションでなくなるところです。</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">解決策1：マネージドエージェントのセッションにセマンティックメモリを追加する方法<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>セッションログと一緒にMilvusコレクションを追加し、</strong> <code translate="no">**emitEvent**</code><strong></strong>。 セッションの契約はそのままで、ハーネスは自分自身の過去に対するセマンティッククエリを得る。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropicの設計は、まさにこのための余地を残しています。フェッチされたイベントは、クロードのコンテキストウィンドウに渡される前に、ハーネスで変換することができます。これらの変換は、ハーネスがエンコードするものであれば何でも可能である。コンテキストエンジニアリングはハーネスにあり、セッションは耐久性とクエリ可能性を保証するだけでよい。</p>
<p>パターン:<code translate="no">emitEvent</code> が起動するたびに、ハーネスはインデックスを作成する価値のあるイベントの<a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">ベクトル埋め込みを</a>計算し、milvusコレクションに挿入する。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>エージェントがステップ200に到達し、以前の決定を呼び出す必要があるとき、クエリはそのセッションにスコープされた<a href="https://zilliz.com/glossary/vector-similarity-search">ベクトル検索と</a>なる：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>この出荷の前に、3つのプロダクションの詳細が重要である：</p>
<ul>
<li><strong>インデックスを作成する対象を選ぶ。</strong>すべてのイベントが埋め込みに値するわけではありません。ツールコールの中間状態、リトライログ、反復的なステータスイベントは、検索品質を向上させるよりも、検索品質を悪化させる。<code translate="no">INDEXABLE_EVENT_TYPES</code> ポリシーはタスク依存であり、グローバルではない。</li>
<li><strong>一貫性の境界を定義する。</strong>セッションの追加とmilvusの挿入の間にハーネスがクラッシュした場合、一方のレイヤがもう一方のレイヤより短時間先行する。このウィンドウは小さいが現実的である。リコンシリエーションのパス（再起動のリトライ、先読みログ、最終的なリコンシリエーション）を選ぶ。</li>
<li><strong>エンベッディングの支出をコントロールする。</strong>外部エンベッディングAPIを同期的に呼び出す200ステップのセッションは、誰も予定していなかった請求書を作成する。エンベッディングをキューに入れ、非同期で一括送信する。</li>
</ul>
<p>これがあれば、リコールにかかる時間は、ベクトル検索で数ミリ秒、エンベッディング呼び出しで100ミリ秒以下だ。エージェントが摩擦に気づく前に、最も関連性の高い上位5つの過去のイベントがコンテキストに着地する。セッションは耐久性のあるログとして本来の仕事を維持し、ハーネスは逐次的ではなく意味的に自身の過去を照会する能力を得る。これはAPIの表面上のささやかな変化であり、エージェントがロングホライズンタスクでできることの構造的な変化です。</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">問題2：なぜ並列クロードエージェントは経験を共有できないのか<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>マネージド・エージェントのセッションは設計上分離されているため、並列クロード・エージェントは経験を共有することができません。水平スケーリングをきれいにする同じ分離は、すべてのブレインが他のすべてのブレインから学習することを妨げます。</strong></p>
<p>分離されたハーネスでは、ブレーンはステートレスで独立している。この分離は、Anthropicのレポートが持つレイテンシーを解き放ち、すべてのセッションが他のセッションについて知ることができないようにします。</p>
<p>エージェントAは、ある顧客のためにトリッキーなSQLインジェクション・ベクターの診断に40分費やした。その1時間後、エージェントBは別の顧客のために同じケースをピックアップし、同じ行き止まりを40分かけて歩き、同じツールコールを実行し、同じ答えにたどり着きます。</p>
<p>時折エージェントを実行する1人のユーザーにとって、これは無駄なコンピュートだ。毎日異なる顧客のために、コードレビュー、脆弱性スキャン、ドキュメンテーション生成など、何十もの<a href="https://zilliz.com/glossary/ai-agents">AIエージェントを</a>同時に実行するプラットフォームでは、コストは構造的に増大する。</p>
<p>すべてのセッションが生み出す経験が、セッションが終わった瞬間に蒸発してしまうのであれば、インテリジェンスは使い捨てになってしまう。この方法で構築されたプラットフォームは、直線的にスケールするが、人間のエンジニアのように時間が経つにつれて何かが良くなることはない。</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">解決策2：Milvusで共有エージェントメモリプールを構築する方法<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>すべてのハーネスが起動時に読み込み、シャットダウン時に書き込むベクターコレクションを1つ構築し、テナントごとにパーティショニングする。</strong></p>
<p>セッションが終了すると、重要な決定、遭遇した問題、うまくいったアプローチがMilvusの共有コレクションにプッシュされる。新しいブレインが初期化されると、ハーネスはセットアップの一部としてセマンティッククエリを実行し、コンテキストウィンドウにトップマッチの過去の経験を注入する。新しいエージェントのステップ1は、すべての先行エージェントの教訓を継承する。</p>
<p>2つのエンジニアリング上の決定が、これをプロトタイプからプロダクションへと移行させる。</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Milvus Partition Keyによるテナントの分離</h3><p><code translate="no">**tenant_id**</code><strong> 、顧客Aのエージェントの経験は物理的に顧客Bと同じパーティションには存在しません。これはクエリの規約というよりもデータレイヤーでの分離です。</strong></p>
<p>ブレインAがA社のコードベースで行った作業は、B社のエージェントからは決して取得できないはずです。Milvusの<a href="https://milvus.io/docs/use-partition-key.md">パーティションキーは</a>、テナントごとに2つ目のコレクションを持たず、アプリケーションコードにシャーディングロジックを持たず、単一のコレクションでこれを処理する。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>顧客Aのエージェントが顧客Bのクエリで表面化することがないのは、クエリフィルタが正しく記述されているからではなく（そうでなければなりませんが）、データが物理的に顧客Bと同じパーティションに存在しないからです。論理的な分離はクエリ層で、物理的な分離はパーティション層で行われます。</p>
<p>パーティション・キーが適合する場合と別々のコレクションやデータベースが適合する場合については<a href="https://milvus.io/docs/multi_tenancy.md">マルチテナンシー戦略のドキュメントを</a>、本番環境への導入に関する注意事項については<a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">マルチテナンシーRAGパターン・ガイドを</a>参照してください。</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">エージェントのメモリ品質に継続的な取り組みが必要な理由</h3><p><strong>一度成功した欠陥のある回避策が再生されて強化され、非推奨の依存関係に結びついた古いエントリが、それを継承するエージェントを惑わせ続けます。防御は運用プログラムであり、データベースの機能ではない。</strong></p>
<p>エージェントは、たまたま一度だけ成功した欠陥のある回避策に出くわす。それは共有プールに書き込まれる。次のエージェントがそれを回収して再生し、2回目の「成功した」使用記録で悪いパターンを強化する。</p>
<p>古くなったエントリーは、同じ経路の遅いバージョンをたどる。6ヶ月前に非推奨となった依存バージョンに固定された修正は、取得され続け、それを継承するエージェントを惑わせ続けます。プールが古く、使用頻度が高ければ高いほど、このような現象は蓄積されていく。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>3つの運用プログラムがこれを防御する：</p>
<ul>
<li><strong>信頼度スコア。</strong>あるメモリが下流のセッションで何回正常に適用されたかを追跡する。リプレイで失敗したエントリを減衰させる。繰り返し成功したエントリーをプロモートする。</li>
<li><strong>時間の重み付け。</strong>最近の経験を優先する。既知の陳腐化しきい値を超えたエントリをリタイアさせる。</li>
<li><strong>人間による抜き取り検査。</strong>検索頻度の高いエントリは、ハイレバレッジである。そのうちの一つが間違っている場合、それは何度も間違っていることになる。</li>
</ul>
<p>Milvusだけではこれは解決できないし、Mem0やZep、その他のメモリ製品も同様である。1つのプールを多くのテナントで使用し、テナント間のリークをゼロにすることは、一度だけエンジニアが行うことです。そのプールを正確で、新鮮で、有用な状態に保つことは、どのデータベースも設定済みで出荷していない継続的な運用作業である。</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">要点MilvusがAnthropicのマネージドエージェントにもたらすもの<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvusは、セッション内のセマンティックリコールとエージェント間の共有メモリを追加することで、Managed Agentsを信頼性はあるが忘れがちなプラットフォームから、時間の経過とともに経験を向上させるプラットフォームへと変えました。</strong></p>
<p>マネージド・エージェントは、信頼性の問題に明確に答えている。脳も手も家畜であり、タスクを持ち出すことなく、どれかが死ぬ可能性がある。これがインフラの問題で、Anthropicはそれをうまく解決した。</p>
<p>オープンなままだったのは成長だった。人間のエンジニアは、時間の経過とともに複雑化する。長年の仕事はパターン認識に変わり、すべてのタスクについて第一原理から推論することはない。今日のマネージド・エージェントはそうではありません。なぜなら、すべてのセッションは白紙のページから始まるからです。</p>
<p>セッションをMilvusに接続することで、タスク内の意味的な想起を可能にし、脳全体の経験を共有ベクトルコレクションにプールすることで、エージェントに実際に使える過去を与えることができる。Milvusに接続するのはインフラストラクチャーの一部であり、間違った記憶を刈り込み、古くなった記憶を削除し、テナントの境界を強制するのは運用の一部である。この両方が整えば、メモリの形状は負債ではなくなり、複合資本となる。</p>
<h2 id="Get-Started" class="common-anchor-header">始める<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>ローカルで試す：</strong> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteで</a>組み込みMilvusインスタンスをスピンアップする。Dockerもクラスタもなく、<code translate="no">pip install pymilvus</code> 。本番ワークロードは、必要な時に<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus StandaloneまたはDistributedに</a>移行します。</li>
<li><strong>設計根拠をお読みください：</strong>Anthropicの<a href="https://www.anthropic.com/engineering/managed-agents">Managed Agentsエンジニアリングポストでは</a>、セッション、ハーネス、サンドボックスのデカップリングについて詳しく説明しています。</li>
<li><strong>質問がありますか？</strong> <a href="https://discord.com/invite/8uyFbECzPX">MilvusのDiscord</a>コミュニティに参加してエージェントメモリの設計について議論したり、<a href="https://milvus.io/office-hours">Milvusオフィスアワーの</a>セッションを予約してあなたのワークロードについて説明しましょう。</li>
<li><strong>マネージドをご希望ですか？</strong>パーティションキー、スケーリング、マルチテナンシーが組み込まれたホスト型Milvusの<a href="https://cloud.zilliz.com/signup">Zilliz Cloudにサインアップ</a>（または<a href="https://cloud.zilliz.com/login">サインイン</a>）してください。新規アカウントの場合、Eメールでのクレジットは無料です。</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">よくある質問<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Q: Anthropicのマネージドエージェントのセッションとコンテキストウィンドウの違いは何ですか？</strong></p>
<p>コンテキストウィンドウは、単一のクロードコールが見るトークンのエフェメラルセットです。境界があり、モデル呼び出しごとにリセットされます。セッションは、ハーネスの外に保存された、タスク全体で起こったすべてのことの耐久性のある、追記のみのイベントログです。ハーネスがクラッシュすると、<code translate="no">wake(sessionId)</code> 、新しいハーネスが生成され、セッションログを読み込んで再開する。セッションは記録システムであり、コンテキストウィンドウは作業メモリである。セッションはコンテキストウィンドウではありません。</p>
<p><strong>Q: クロード・セッションをまたいでエージェントのメモリを永続化するにはどうすればいいですか？</strong></p>
<p>セッション自体はすでに永続化されています。<code translate="no">getSession(id)</code> 。一般的に欠けているのは、照会可能な長期記憶です。<code translate="no">emitEvent</code> の間に、Milvus のようなベクターデータベースにシグナル性の高いイベント（決定、解決、戦略）を埋め込み、検索時に意味的類似性によってクエリを実行するパターンです。これにより、Anthropicが提供する耐久性のあるセッションログと、何百ものステップを遡るためのセマンティックリコールレイヤーの両方が得られます。</p>
<p><strong>Q: 複数のクロードエージェントはメモリを共有できますか？</strong></p>
<p>そのままではできません。各マネージドエージェントのセッションは設計上分離されており、水平方向に拡張することができます。エージェント間でメモリを共有するには、各ハーネスが起動時に読み込み、シャットダウン時に書き込む共有ベクタコレクションを追加します（例えばMilvus）。Milvusのパーティションキー機能を使ってテナントを分離し、顧客Aのエージェントのメモリが顧客Bのセッションに漏れることがないようにします。</p>
<p><strong>Q: AIエージェントのメモリに最適なベクターデータベースは？</strong></p>
<p>正直な答えは、規模や導入形態によります。プロトタイプや小規模なワークロードの場合は、Milvus Liteのようなローカル組み込みオプションがインフラなしでインプロセスで動作します。多くのテナントにまたがる本番エージェントの場合は、成熟したマルチテナント（パーティション・キー、フィルタリング検索）、ハイブリッド検索（ベクトル＋スカラー＋キーワード）、数百万ベクトルでのミリ秒レイテンシーを備えたデータベースが必要です。milvusは、そのような規模のベクトルワークロードのために構築されており、LangChain、Google ADK、Deep Agents、OpenAgentsで構築されたプロダクションエージェントメモリーシステムに採用されています。</p>
