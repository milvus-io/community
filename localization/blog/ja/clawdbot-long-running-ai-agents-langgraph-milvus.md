---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: Clawdbotはなぜ流行ったのか - そしてLangGraphとmilvusでプロダクション対応の長時間稼働エージェントを構築する方法
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbotは、人々が行動するAIを求めていることを証明した。2エージェントアーキテクチャ、Milvus、LangGraphを使った、量産可能な長時間稼働エージェントの構築方法を学ぶ。
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot（現在はOpenClaw）が大流行<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>（現在はOpenClawに改名）は先週、インターネットを席巻した。ピーター・スタインバーガーによって作られたオープンソースのAIアシスタントは、わずか数日で<a href="https://github.com/openclaw/openclaw">11万以上のGitHubスターを</a>獲得した。ユーザーは、フライトのチェックイン、Eメールの管理、スマートホームデバイスのコントロールなどを自律的に行う動画を投稿した。OpenAIの創設エンジニアであるアンドレイ・カルパシーは、これを賞賛した。テック創業者で投資家のデビッド・サックスは、この製品についてツイートした。人々は "Jarvis, but real "と呼んだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>その後、セキュリティ上の警告が発せられた。</p>
<p>研究者たちは、何百もの露出した管理パネルを発見した。ボットはデフォルトでroot権限で動作する。サンドボックスはない。プロンプト・インジェクションの脆弱性により、攻撃者はエージェントを乗っ取ることができる。セキュリティの悪夢。</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbotが流行ったのには理由がある<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbotが流行ったのには理由がある。</strong>Clawdbotはローカルまたは自分のサーバー上で動作する。人々がすでに使っているメッセージングアプリ-WhatsApp、Slack、Telegram、iMessage-に接続する。返信のたびにすべてを忘れてしまうのではなく、時間をかけて文脈を記憶する。カレンダーを管理し、Eメールを要約し、アプリ間のタスクを自動化する。</p>
<p>ユーザーは、単なるプロンプト＆レスポンスツールではなく、ハンズオフで常時オンのパーソナルAIの感覚を得ることができる。オープンソースのセルフホスティングモデルは、コントロールとカスタマイズを望む開発者に魅力的だ。また、既存のワークフローとの統合が容易なため、共有や推奨も容易だ。</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">長期間稼働するエージェントを構築するための2つの課題<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbotの人気は、人々が</strong><strong>回答だけでなく</strong> <em>行動</em><strong>するAIを求めていることを証明している。</strong>しかし、Clawdbotであろうと自分で作ったものであろうと、長期間稼働し、実際のタスクをこなすエージェントは、<strong>メモリと</strong> <strong>検証という</strong>2つの技術的課題を解決しなければならない。</p>
<p><strong>メモリの問題は</strong>様々な形で現れる：</p>
<ul>
<li><p>エージェントはタスクの途中でコンテキストウィンドウを使い果たし、中途半端な仕事を残してしまう。</p></li>
<li><p>タスクリストの全体像を見失い、「完了」を早く宣言しすぎる。</p></li>
<li><p>セッション間でコンテキストを引き継ぐことができず、新しいセッションがゼロから始まる。</p></li>
</ul>
<p>エージェントは永続的なメモリを持たない。コンテキストのウィンドウは有限であり、セッション間の検索は制限され、進捗はエージェントがアクセスできる方法では追跡されない。</p>
<p><strong>検証の問題は</strong>異なります。メモリが動作していても、エージェントはその機能が実際にエンドツーエンドで動作するかどうかをチェックすることなく、簡単な単体テストの後にタスクを完了とマークします。</p>
<p>Clawdbotはその両方に対処する。セッションをまたいでメモリをローカルに保存し、モジュール化された「スキル」を使ってブラウザ、ファイル、外部サービスを自動化する。このアプローチは機能する。しかし、本番環境では使えない。企業で使うには、Clawdbotがすぐに提供できない構造、監査可能性、セキュリティが必要だ。</p>
<p>この記事では、本番環境向けのソリューションと同じ問題を取り上げる。</p>
<p>記憶については、<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropicの研究に</a>基づいた<strong>2つのエージェントアーキテクチャを</strong>使用しています：プロジェクトを検証可能な機能に分割するイニシャライザーエージェントと、きれいなハンドオフで一度に1つずつ作業するコーディングエージェントです。セッション間のセマンティックリコールには、<a href="https://milvus.io/">Milvusという</a>ベクトルデータベースを使用し、エージェントはキーワードではなく、意味によって検索を行う。</p>
<p>検証には<strong>ブラウザの自動化を</strong>使う。ユニットテストを信頼する代わりに、エージェントは実際のユーザーと同じように機能をテストします。</p>
<p><a href="https://github.com/langchain-ai/langgraph">LangGraphと</a>Milvusを使った実装を紹介します。</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">つのエージェントアーキテクチャがコンテキストの枯渇を防ぐ方法<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>全てのLLMにはコンテキストウィンドウがあり、一度に処理できるテキスト量の制限があります。エージェントが複雑なタスクに取り組むと、このウィンドウはコード、エラーメッセージ、会話履歴、ドキュメントでいっぱいになる。ウィンドウがいっぱいになると、エージェントは停止するか、以前のコンテキストを忘れ始める。長く続くタスクの場合、これは避けられない。</p>
<p>単純なプロンプトを与えられたエージェントを考えてみよう："claude.aiのクローンを作れ"。このプロジェクトでは、認証、チャット・インターフェース、会話履歴、ストリーミング応答、その他何十もの機能が必要だ。一人のエージェントがすべてを一度に取り組もうとする。チャット・インターフェースを実装する途中で、コンテキスト・ウィンドウがいっぱいになった。セッションは中途半端に書かれたコードで終わり、何が試されたのかのドキュメントもなく、何がうまくいって何がうまくいかないのかもわかりません。次のセッションは混乱を引き継ぐ。コンテキストの圧縮があったとしても、新しいエージェントは前のセッションが何をしていたかを推測し、書いていないコードをデバッグし、どこで再開すべきかを考えなければならない。新たな進歩がなされる前に、何時間も浪費されることになる。</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">二重のエージェントソリューション</h3><p>Anthropicの解決策は、彼らのエンジニアリングポスト<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents "</a>に記載されているように、2つの異なるプロンプトモードを使用することです：最初のセッションの<strong>イニシャライザプロンプトと</strong>、その後のセッションの<strong>コーディングプロンプトです</strong>。</p>
<p>技術的には、どちらのモードも同じエージェント、システムプロンプト、ツール、ハーネスを使用します。唯一の違いは、最初のユーザープロンプトである。しかし、これらは異なる役割を果たすため、2つの別個のエージェントとして考えることが、有用なメンタルモデルとなります。これを2エージェントアーキテクチャと呼びます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>イニシャライザーは、漸進的な進歩のための環境を設定する。</strong>漠然としたリクエストを受け取り、3つのことを行う：</p>
<ul>
<li><p><strong>プロジェクトを具体的で検証可能な機能に分割する。</strong>"チャットインターフェイスを作れ "のような漠然とした要求ではなく、具体的でテスト可能なステップに分割します："ユーザーが新しいチャットボタンをクリック→サイドバーに新しい会話が表示される→チャットエリアにウェルカム状態が表示される"Anthropicのclaude.aiクローンの例では、このような機能が200以上ありました。</p></li>
<li><p><strong>進捗追跡ファイルを作成します。</strong>このファイルには各機能の完了ステータスが記録され、どのセッションでも何が完了し、何が残っているかを確認できる。</p></li>
<li><p><strong>セットアップスクリプトを書き、最初のgitコミットを行う。</strong> <code translate="no">init.sh</code> のようなスクリプトにより、今後のセッションは開発環境を素早く立ち上げることができます。git commit はクリーンなベースラインを確立します。</p></li>
</ul>
<p>イニシャライザーは計画を立てるだけではありません。将来のセッションがすぐに作業を開始できるようなインフラを構築するのだ。</p>
<p><strong>コーディングエージェントは</strong>、後続のすべてのセッションを処理する。それは</p>
<ul>
<li><p>進捗ファイルと git ログを読んで現在の状態を把握します。</p></li>
<li><p>基本的なエンドツーエンドテストを実行し、アプリがまだ動作することを確認します。</p></li>
<li><p>作業する機能を 1 つ選びます。</p></li>
<li><p>その機能を実装して徹底的にテストし、説明的なメッセージを添えて git にコミットし、進捗ファイルを更新します。</p></li>
</ul>
<p>セッションが終了すると、コードベースはマージ可能な状態になっています。大きなバグもなく、コードも整然としていて、ドキュメントも明確です。中途半端な作業はなく、何が行われたかについての謎もありません。次のセッションは、このセッションが終了したところから始まる。</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">機能追跡にはMarkdownではなくJSONを使う</h3><p><strong>特筆すべき実装の詳細が1つある：機能リストはMarkdownではなくJSONであるべきだ。</strong></p>
<p>JSONを編集するとき、AIモデルは特定のフィールドを外科的に修正する傾向がある。Markdownを編集する場合は、セクション全体を書き換えることが多い。200以上の機能リストでは、Markdownの編集は進捗追跡を誤って壊してしまう可能性がある。</p>
<p>JSONエントリーはこのようになる：</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>各機能には明確な検証ステップがあります。<code translate="no">passes</code> フィールドは完了を追跡します。また、エージェントが難しい機能を削除してシステムを悪用するのを防ぐために、「テストの削除や編集は、機能の欠落やバグにつながる可能性があるため、容認できません」というような強い言葉での指示も推奨されます。</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Milvusがエージェントにセッションをまたいだセマンティックメモリを与える方法<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>2エージェントアーキテクチャはコンテキストの枯渇を解決するが、忘却は解決しない。</strong>セッション間をきれいにハンドオフしても、エージェントは何を学習したかを見失う。JWT refresh tokens "が "user authentication "に関連していることは、その正確な単語がプログレスファイルに出てこない限り、思い出すことができない。プロジェクトが大きくなると、何百ものgitコミットを検索するのが遅くなる。キーワードのマッチングは、人間には明らかなつながりを見逃してしまう。</p>
<p><strong>そこでベクター・データベースの出番だ。</strong>ベクトル・データベースは、テキストを保存してキーワードを検索する代わりに、テキストを意味を表す数値表現に変換する。"ユーザー認証 "を検索すると、"JWTリフレッシュ・トークン "や "ログイン・セッション処理 "に関するエントリーが見つかる。単語が一致したからではなく、概念が意味的に近いからだ。エージェントは、"以前にこのようなものを見たことがあるか？"と尋ねることができ、有用な答えを得ることができる。</p>
<p><strong>実際には、進捗記録とgitコミットをベクターとしてデータベースに埋め込むことで機能する。</strong>コーディングセッションが始まると、エージェントは現在のタスクをデータベースに問い合わせます。データベースは関連する履歴をミリ秒単位で返します。エージェントはゼロから始めるわけではない。コンテキストから始めるのだ。</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>はこのユースケースに適している。</strong>オープンソースで、プロダクション規模のベクトル検索用に設計されており、汗をかくことなく何十億ものベクトルを処理できる。小規模プロジェクトやローカル開発では、<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteを</a>SQLiteのようなアプリケーションに直接組み込むことができる。クラスタのセットアップは不要です。プロジェクトが大きくなれば、コードを変更することなく分散Milvusに移行することができます。<a href="https://milvus.io/docs/embeddings.md">エンベッディングの</a>生成には、<a href="https://www.sbert.net/">SentenceTransformerの</a>ような外部モデルを使用してきめ細かく制御することができます。Milvusはまた、ベクトル類似度と従来のフィルタリングを組み合わせた<a href="https://milvus.io/docs/hybridsearch.md">ハイブリッド検索を</a>サポートしています。</p>
<p><strong>これにより、転送問題も解決される。</strong>ベクター・データベースは単一のセッションの外でも持続するため、知識は時間とともに蓄積される。セッション50は、セッション1から49で学んだことすべてにアクセスできる。このプロジェクトは、制度的記憶を発展させる。</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">自動テストによる完成度の検証<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>2エージェントのアーキテクチャと長期記憶を持ってしても、エージェントは早すぎる勝利宣言をすることができる。これが検証の問題である。</strong></p>
<p>よくある失敗例を挙げよう：コーディングセッションが機能を完成させ、ユニットテストを素早く実行し、それがパスするのを確認し、<code translate="no">&quot;passes&quot;: false</code> を<code translate="no">&quot;passes&quot;: true</code> に切り替える。しかし、ユニットテストがパスしたからといって、その機能が実際に動作するとは限らない。APIは正しいデータを返すかもしれないが、CSSのバグのためにUIは何も表示しない。進捗ファイルには "complete "と書かれているのに、ユーザには何も表示されない。</p>
<p><strong>解決策は、エージェントを実際のユーザーのようにテストさせることです。</strong>機能リストの各機能には、具体的な検証ステップがあります："ユーザが新規チャットボタンをクリックする → サイドバーに新規会話が表示される → チャットエリアにウェルカム状態が表示される"。エージェントはこれらのステップを文字通り検証する必要があります。コードレベルのテストだけを実行する代わりに、実際の使用をシミュレートするために Puppeteer のようなブラウザ自動化ツールを使用します。ページを開き、ボタンをクリックし、フォームに入力し、正しい要素が画面に表示されることを確認します。完全なフローが通過したときだけ、エージェントはその機能を完了とマークする。</p>
<p><strong>これは、ユニットテストが見逃す問題をキャッチします</strong>。チャット機能は、完璧なバックエンドロジックと正しい API レスポンスを持っているかもしれません。しかし、フロントエンドが返信をレンダリングしなければ、ユーザーには何も見えません。ブラウザオートメーションは結果をスクリーンショットし、スクリーンに表示されるものが表示されるべきものと一致することを検証することができる。<code translate="no">passes</code> フィールドが<code translate="no">true</code> になるのは、その機能が純粋にエンド・ツー・エンドで機能する場合だけだ。</p>
<p><strong>しかし限界もある。</strong>Puppeteerのようなツールでは自動化できないブラウザネイティブの機能もある。ファイルピッカーやシステム確認ダイアログがよくある例だ。<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropicは</a>、ブラウザネイティブのアラートモダルに依存する機能は、エージェントがPuppeteerを通してそれらを見ることができないため、バグが多くなる傾向があると指摘した。現実的な回避策は、これらの制限を回避するように設計することです。可能な限りネイティブダイアログの代わりにカスタムUIコンポーネントを使用し、エージェントが機能リストのすべての検証ステップをテストできるようにします。</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">まとめるセッション状態のLangGraph、長期記憶のmilvus<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>上記のコンセプトは、2つのツールを使って実用的なシステムにまとめられます：セッション・ステートはLangGraph、長期記憶はMilvusである。</strong>LangGraphは、一つのセッションの中で何が起きているかを管理します：どの機能が作業中か、何が完了したか、次は何か。Milvusは、セッションをまたいで検索可能な履歴を保存します：以前に何が行われ、どのような問題が発生し、どのような解決策が有効であったか。これらの機能により、エージェントは短期的な記憶と長期的な記憶の両方を得ることができます。</p>
<p><strong>この実装についての注意：</strong>以下のコードは簡略化されたデモンストレーションである。1つのスクリプトでコアパターンを示していますが、先に説明したセッション分離を完全に再現しているわけではありません。本番環境では、各コーディング・セッションは、別々のマシンや別々の時間に、別々の呼び出しになる可能性があります。LangGraphの<code translate="no">MemorySaver</code> と<code translate="no">thread_id</code> は、起動間の状態を永続化することで、これを可能にします。レジューム動作を明確に見るには、スクリプトを一度実行し、停止させ、同じ<code translate="no">thread_id</code> 。2回目の実行では、1回目の実行が終わったところから再開される。</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">結論</h3><p>AIエージェントは、永続的なメモリと適切な検証が欠けているため、長時間実行するタスクで失敗する。Clawdbotはこれらの問題を解決することで人気を博したが、そのアプローチは実運用に耐えうるものではない。</p>
<p>この記事では、3つの解決策を取り上げた：</p>
<ul>
<li><p><strong>2エージェント・アーキテクチャ：</strong>イニシャライザーがプロジェクトを検証可能な機能に分割し、コーディング・エージェントがきれいなハンドオフで一度に1つずつ作業する。これにより、コンテキストの枯渇を防ぎ、進捗を追跡可能にする。</p></li>
<li><p><strong>ベクターデータベースによるセマンティック記憶：</strong> <a href="https://milvus.io/">Milvusは</a>進捗記録とgitコミットをエンベッディングとして保存するので、エージェントはキーワードではなく、意味によって検索することができる。セッション50はセッション1が学んだことを記憶する。</p></li>
<li><p><strong>本当の検証のためのブラウザ自動化：</strong>ユニットテストはコードが動くかどうかを検証する。Puppeteerは、ユーザが画面上で何を見るかをテストすることで、機能が実際に動くかどうかをチェックする。</p></li>
</ul>
<p>これらのパターンはソフトウェア開発に限ったことではない。科学研究、財務モデリング、法的文書のレビューなど、複数のセッションにまたがり、信頼性の高いハンドオフを必要とするあらゆるタスクが恩恵を受けることができる。</p>
<p>核となる原則</p>
<ul>
<li><p>イニシャライザーを使って、作業を検証可能な塊に分割する。</p></li>
<li><p>構造化された機械可読形式で進捗を追跡する。</p></li>
<li><p>ベクターデータベースに経験を保存し、セマンティックな検索を可能にする。</p></li>
<li><p>ユニットテストだけでなく、実世界のテストで完了を検証する。</p></li>
<li><p>作業を安全に一時停止・再開できるように、セッションの境界をきれいに設計する。</p></li>
</ul>
<p>ツールは存在する。パターンは証明されている。あとはそれを適用するだけだ。</p>
<p><strong>始める準備はできていますか？</strong></p>
<ul>
<li><p>エージェントにセマンティックメモリを追加するための<a href="https://milvus.io/">Milvusと</a> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteを</a>ご覧ください。</p></li>
<li><p>セッションの状態を管理するLangGraphをチェック</p></li>
<li><p>ロングランエージェントハーネスに関する<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropicの全研究を</a>読む</p></li>
</ul>
<p><strong>質問がある場合、または構築しているものを共有したい場合は、MilvusのSlackコミュニティに参加してください。</strong></p>
<ul>
<li><p><a href="https://milvus.io/slack">MilvusのSlackコミュニティに</a>参加して、他の開発者と交流しましょう。</p></li>
<li><p><a href="https://milvus.io/office-hours">Milvusオフィスアワーに</a>参加し、チームとライブでQ&amp;Aを行う。</p></li>
</ul>
