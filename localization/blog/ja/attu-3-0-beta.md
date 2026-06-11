---
id: attu-3-0-beta.md
title: |
  Attu 3.0 ベータ版：マルチクラスター管理、AIエージェント、そして刷新されたMilvusコンソール
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 ベータ版では、Milvus 管理コンソールが再構築され、マルチクラスタ管理、永続的な状態管理、組み込みの AI
  エージェント、高度な診断機能、リアルタイムメトリクス、API デバッグ、バックアップと復元、および簡素化された RBAC ワークフローが搭載されています。
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 ベータ版がリリースされました。</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attuは</strong></a>、<a href="https://milvus.io"><strong>Milvus用のオープンソース管理</strong></a>コンソールです。ローカル環境や本番環境でMilvusをご利用になったことがある方なら、コレクションの確認、データの閲覧、スキーマの管理、あるいはクラスタ内部の状況確認などにAttuをご利用になったことがあるでしょう。</p>
<p>Attu 2.xは、基本的な単一クラスタの管理には十分機能していました。しかし、Milvusの導入規模が拡大するにつれ、その限界が顕在化してきました。一度に接続できるMilvusインスタンスは1つに限られ、コンテナの再起動後は接続状態が失われていました。 データの閲覧は、主にコレクション中心のものでした。診断、監視、APIデバッグ、バックアップと復元、権限管理には、多くの場合、別のツールや手動での操作が必要でした。</p>
<p><strong>Attu 3.0 Betaは、Milvusの管理体験を全面的に再構築したものです。</strong></p>
<p>このリリースでは、マルチクラスタ管理、永続的なローカル状態、50以上のMilvusツールを備えた組み込みAIエージェント、高度な診断機能、再設計されたデータブラウザ、組み込みのPrometheusメトリクス、API Playground、GUIベースのバックアップと復元、および簡素化されたRBACワークフローが追加されています。</p>
<p>要するに、Attuはもはや単一のMilvusインスタンス向けの軽量ビューアにとどまりません。ローカル、ステージング、本番環境を横断してMilvusを管理する開発者やチームにとって、実用的な運用コンソールへと進化しつつあります。</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Attu 3.0 Betaでの変更点<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>以下に、Attu 2.x と Attu 3.0 Beta の概要比較を示します。</p>
<table>
<thead>
<tr><th>機能</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>クラスタ接続</td><td>単一インスタンスのみ</td><td>複数のクラスタとワンクリック切り替え</td></tr>
<tr><td>ステートレス</td><td>ステートレス；コンテナ再起動時に失われる</td><td>ローカルデータベース；再起動後も維持される</td></tr>
<tr><td>AIアシスタント</td><td>なし</td><td>50以上のMilvusツールを備えた組み込みエージェント</td></tr>
<tr><td>診断</td><td>手動による調査</td><td>4つの組み込みエキスパートレベル診断スキル</td></tr>
<tr><td>RBAC管理</td><td>独立したページ、多段階フロー</td><td>コンテキスト内でのワンクリックユーザー作成</td></tr>
<tr><td>データナビゲーション</td><td>フラットなコレクション一覧</td><td>階層ツリー：データベース → コレクション → パーティション</td></tr>
<tr><td>監視</td><td>外部の Grafana が必要</td><td>組み込みのPrometheusメトリクスダッシュボード</td></tr>
<tr><td>APIデバッグ</td><td>curl や Postman などの外部ツール</td><td>組み込みのREST APIプレイグラウンド</td></tr>
<tr><td>バックアップと復元</td><td>CLIのみ</td><td>S3、MinIO、GCS、Azure に対応した GUI</td></tr>
<tr><td>LLMの統合</td><td>なし</td><td>BYOL：OpenAI、Anthropic、DeepSeek、Geminiなど</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">1つのサイドバーから複数のMilvusクラスターを管理<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>日々の運用における最大の変更点は、マルチクラスター管理です。</strong>Attu 3.0では、実行中のすべてのMilvusインスタンスに接続し、それらを単一のサイドバーに一覧表示できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：ヘルスインジケーター付きの複数のMilvus接続を表示するAttu 3.0のサイドバー</p>
<p>Attu 2.xでは、あるMilvusクラスターから別のクラスターに切り替えるには、接続を切断し、再接続し、待機する必要がありました。開発、ステージング、本番環境、あるいは異なる事業部門ごとに別々のクラスターを運用している場合、クラスターごとにブラウザタブを1つずつ開くことになりがちでした。</p>
<p>Attu 3.0では、このフローが常時表示される左サイドバーに置き換えられました。すべてのMilvus接続が一箇所に一覧表示され、その横にはリアルタイムのヘルスインジケーターが表示されます。緑色のドットはクラスターに接続可能であることを示し、赤色のドットはクラスターがダウンしているか利用できない状態であることを示します。</p>
<p>クラスターの切り替えはワンクリックで完了します。Attuは各接続のコンテキストを保持するため、環境間を移動するたびに再接続する必要はありません。</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">接続設定の安定性向上</h3><p>新しい接続では、TLS/SSL暗号化、トークン認証、およびユーザー名/パスワード認証がサポートされています。接続を保存する前にテストしたり、接続の詳細をローカルに保存したり、古い環境が不要になった際に切断された接続を一括で削除したりできます。</p>
<p><strong>各クラスターには独自のワークスペースが割り当てられます。</strong>概要、データブラウザ、ユーザー管理、メトリクス、および操作はすべて、現在選択されているクラスターに限定されます。これにより、ステージング環境と本番環境を混同したり、誤った場所で操作を実行したりするリスクが大幅に低減されます。</p>
<p>複数のMilvusインスタンスを管理しているユーザーにとって、これはAttu 3.0における最も重要な変更点の1つです。基本的な機能のように思えるかもしれませんが、これにより、日々のMilvus作業におけるタブの切り替えや再接続に伴う煩わしさが大幅に軽減されます。</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">ローカル状態が再起動後も保持されるようになりました<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.xはステートレスでした。コンテナが再起動すると、保存された接続情報が消えてしまい、ワークスペースを再構築する必要がありました。</p>
<p><strong>Attu 3.0では、クラスタ設定、エージェントとの会話履歴、カスタムスキル、LLM設定、ユーザー設定を永続化するローカルデータベースが追加されました。</strong></p>
<p>DockerでAttuを実行する際は、ボリュームをマウントして状態を保持してください：</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>ボリュームをマウントしておけば、コンテナを再起動してもゼロからの再構築が必要なくなります。</p>
<p>これは新しい AI エージェントにとっても重要です。会話履歴、カスタムスキル、LLM 設定をローカルに永続化できるため、Attu は再起動のたびにリセットされる一時的な UI ではなく、長期的に使い続けられるコンソールとなります。</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">組み込みのAIエージェントを使用して、自然言語でMilvusを操作する<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0には、Milvus管理用の組み込みAIエージェントが含まれています。これは単なるドキュメントチャットボットではありません。<strong>このエージェントは50以上のMilvusツールと連携しており、クラスタの状態を確認したり、Attuを通じて実際の操作を実行したりすることができます。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：Attu 3.0のAIエージェントは、自然言語のリクエストからMilvusツールを呼び出すことができます</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">一般的なMilvusワークフローに対応した50以上の組み込みツール</h3><p>このエージェントは、日常的な運用、診断、権限管理、クラスタ管理をカバーしています。以下のような質問や指示を出すことができます：</p>
<table>
<thead>
<tr><th>シナリオ</th><th>プロンプト例</th></tr>
</thead>
<tbody>
<tr><td>日常的な運用</td><td>「すべてのコレクションを一覧表示してください。」<br>「id、title、embeddingフィールドを持つコレクションを作成してください。embeddingフィールドにはディメンション768を使用してください。」<br>「my_collectionにテストデータをいくつか挿入してください。」<br>「my_collection から『artificial intelligence』に最も類似したレコードを10件検索してください。」</td></tr>
<tr><td>運用と診断</td><td>「クラスタの状態は正常ですか？」<br>「なぜ検索がこんなに遅いのですか？」<br>「どのコレクションが最も多くのメモリを使用していますか？」<br>「最近、処理に時間がかかるクエリはありますか？」</td></tr>
<tr><td>権限</td><td>「analyst という名前の読み取り専用ユーザーを作成してください。」<br>「adminロールにすべての権限を付与してください。」<br>「ユーザー zhangsan がどの権限を持っているか確認してください。」</td></tr>
<tr><td>クラスタ管理</td><td>「現在のMilvusのバージョンと設定を表示してください。」<br>「リソースグループの使用状況を一覧表示する。」<br>「my_collectionを自動的に圧縮してください。」</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">破壊的な操作には承認が必要です</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：破壊的または機密性の高い操作は、実行前に確認ダイアログが表示されます</p>
<p><strong>エージェントは、透過的かつ制御可能な設計となっています。</strong>コレクションの一覧表示やメトリクスの読み取りなどの非破壊的な操作は、結果を直接返します。</p>
<p>コレクションの削除、データの消去、権限の変更などの破壊的または機密性の高い操作では、確認ダイアログが表示されます。このダイアログには正確なパラメータが一覧表示され、操作の実行前に承認を待ちます。</p>
<p>また、エージェントがどのツールを呼び出したか、いくつのトークンを使用したか、ツール呼び出しに失敗したかどうかを確認することもできます。これはデータベース管理エージェントにとって重要な点です。ユーザーは、最終的な結果を見るだけでなく、エージェントが何を行ったのかを理解できる必要があります。</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">コンソールからエキスパート診断スキルを実行<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AIエージェントには、4つの組み込み診断スキルが付属しています。</strong>これらは一般的なMilvusのトラブルシューティングシナリオ向けのガイド付きワークフローであり、汎用的なプロンプトではありません。</p>
<table>
<thead>
<tr><th>診断スキル</th><th>チェック項目</th></tr>
</thead>
<tbody>
<tr><td>クラスタの健全性診断</td><td>バージョン、ノードの状態、コンポーネントごとの健全性、および主要なメトリクス。</td></tr>
<tr><td>検索パフォーマンス診断</td><td>インデックスの整合性、セグメントの断片化、レプリカのバランス、および関連する検索パフォーマンスのシグナル。</td></tr>
<tr><td>データの書き込み診断</td><td>挿入の遅延、データチェックの欠落、フラッシュの異常、および書き込みパスの症状。</td></tr>
<tr><td>構成の監査</td><td>安定性、パフォーマンス、または期待される動作に影響を与える可能性のある、リスクのある設定や誤った設定。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：Attu 3.0には組み込みの診断スキルが含まれており、カスタムスキルもサポートしています</p>
<p>自然言語でカスタムスキルを作成することも可能です。スキルには、起動前のチェックリスト、特定のコレクションに対するデータ品質チェック、または既知のワークロードに対してチームが実行する診断フローなどを組み込むことができます。</p>
<p>カスタムスキルは、本質的にはドメイン知識と手順の組み合わせです。一度保存すれば、エージェントは毎回その場限りのプロンプトに頼るのではなく、それを再利用できます。</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">LLMプロバイダーの持込<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AttuはLLMサービスをバンドルしたりプロキシしたりしません。</strong>ユーザー自身がプロバイダーを設定し、モデルのパスを管理します。</p>
<p>サポートされているプロバイダーには、OpenAI、Anthropic、DeepSeek、Google Gemini、OpenRouter、およびOpenAI互換のカスタムエンドポイントが含まれます。</p>
<table>
<thead>
<tr><th>プロバイダー</th><th>モデル例</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>ClaudeOpus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>任意のルーティングモデル</td></tr>
<tr><td>カスタムエンドポイント</td><td>OpenAI互換のAPI</td></tr>
</tbody>
</table>
<p>APIキーはローカルで暗号化され、Attuが管理するサービスにはアップロードされません。この設計は、AIによる支援を求めつつも、認証情報、データフロー、プロバイダーの選択を管理する必要があるチームにとって重要です。</p>
<p>実際には、BYOL（Bring Your Own Model）により、エージェントを異なる環境で利用できるようになります。あるチームはOpenAIを使用し、別のチームはAnthropicのモデルを使用し、さらに別のチームはOpenAI互換のエンドポイントを経由してルーティングを行うといったことが可能です。Attuは特定のモデルプロバイダーを強制しません。</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">データベース → コレクション → パーティションツリーでMilvusデータを閲覧<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0では、データブラウザも再設計されています。Attu 2.xでは主にフラットなコレクションリストが表示されていましたが、クラスタに複数のデータベース、数十のコレクション、パーティション化されたデータが存在するようになると、その表示形式では使いにくくなっていました。</p>
<p><strong>新しいブラウザでは、Milvusがデータを整理する方式（データベース → コレクション → パーティション）に合わせた階層構造を採用しています。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：再設計されたデータブラウザは、データベース、コレクション、パーティションに対して階層的なナビゲーションを採用しています</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">データ操作が閲覧場所のすぐ近くで実行可能に</h3><p>データブラウザは、ユーザーがすでに期待している操作を維持しつつ、UI上で直接実行できるアクションをさらに追加しています：</p>
<ul>
<li>コレクションを別のデータベースにドラッグ＆ドロップする。</li>
<li>埋め込みモデルが設定されている場合、テキストを直接入力してベクトル検索を実行する。</li>
<li>類似度スコアを確認し、ファセットを使用して結果を絞り込む。</li>
<li>CSV、JSON、Parquet形式でのデータのインポートおよびエクスポート。</li>
<li>動的フィールドのサポートを含め、コレクションスキーマを視覚的に表示および編集します。</li>
<li>パーティションおよびパーティション統計の作成、削除、確認を行います。</li>
<li>コレクションのライフサイクル全体（作成、ロード、リリース、コピー、名前変更、データベース間の移動、削除）を管理します。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：ベクトル検索と結果確認機能を備えた Attu 3.0 データブラウザ</p>
<p>これらの操作のほとんどは、右クリックメニューまたは操作パネルから利用できます。一般的なコレクション作業において、UI ブラウジングとコマンドライン操作の間を行き来する必要はもうありません。</p>
<p>また、Attu 3.0 は、スナップショットや null 許容ベクトルなど、<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a>の新機能に対する UI サポートが、それらの機能が成熟するにつれて引き続き追加されていく製品ラインでもあります。</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">操作、メトリクス、スロークエリ、トポロジー、バックアップを一元的に確認<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 では、コンソールに表示される運用情報がさらに充実しました。</strong>「Ops and Monitoring」エリアには、クラスタの概要、リアルタイムメトリクス、スロークエリ分析、トポロジー、バックアップおよび復元が含まれます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：Attu 3.0の「Ops and Monitoring」ページ</p>
<p>目的は、運用チームが既に使用しているすべての可観測性システムを置き換えることではありません。チームは引き続き、Prometheus、Grafana、ログ、アラート、および既存のモニタリングスタックを使用できます。目的は、Milvusに関する一般的な質問にAttu内から回答できるようにすることです。</p>
<table>
<thead>
<tr><th>エリア</th><th>可能な操作</th></tr>
</thead>
<tbody>
<tr><td>クラスタの概要表示</td><td>Milvusのバージョン、デプロイモード、ノード数、データベース数、コレクション数、負荷状況、およびクォータエンティティを一目で確認できます。</td></tr>
<tr><td>リアルタイムメトリクス</td><td>QPS、挿入/削除レート、クエリのレイテンシ、キャッシュヒット率、および関連するPrometheusベースのメトリクスを確認できます。</td></tr>
<tr><td>遅延クエリの分析</td><td>タイプ、実行時間、コレクション、タイムスタンプ、ソース、および関連するトラブルシューティングのコンテキストごとに、遅延クエリを調査します。</td></tr>
<tr><td>トポロジービュー</td><td>ノードのトポロジーや、RootCoord、DataCoord、IndexCoord、QueryCoord、Proxy などのコンポーネント間の接続関係を確認できます。</td></tr>
<tr><td>バックアップと復元</td><td>S3、MinIO、GCS、またはAzureに対してフルバックアップまたは増分バックアップを作成し、バックアップメタデータをZIP形式でダウンロードするか、復元用にアップロードできます。</td></tr>
</tbody>
</table>
<p>バックアップと復元は、これまで CLI の使用に依存していたワークフローを GUI に移行するため、特に重要です。これは、ローカルでのテスト、ステージング環境での検証、およびより可視性の高いリカバリパスを求めるチームにとって有用です。</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">組み込みのAPI Playgroundを使用したMilvus REST APIのデバッグ<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 では、Milvus API の開発およびデバッグのための REST API Playground が追加されました。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：Attu 3.0 API Playground</p>
<p>このプレイグラウンドでは、MilvusのRESTエンドポイントがカテゴリ別に一覧表示されます。データベースとコレクションを選択すると、Attuが実行コンテキストを自動的に設定します。そこからワンクリックでリクエストを送信し、レスポンスをリアルタイムで確認できます。</p>
<p>これは、curlコマンドやPostmanコレクションを設定せずにAPI呼び出しをテストしたい場合に便利です。また、UIコンテキストとリクエスト本文の間を直接行き来できるため、Milvusの機能がREST APIにどのように対応しているかを学ぶのにも役立ちます。</p>
<p>アプリケーション開発者にとって、API Playgroundはデバッグの場となります。Milvusの新規ユーザーにとっては学習の場となります。プラットフォームチームにとっては、スクリプトやアプリケーションコード化する前に、操作を迅速に検証する手段となります。</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">データベースやコレクションの横でRBACを管理<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 では、UI における権限ワークフローの操作感が一新されました。</strong> <a href="https://milvus.io/docs/rbac.md">RBAC を</a>独立した管理タスクとして扱うのではなく、ユーザーがすでに作業を行っているデータベースやコレクションのタブに、アクセス制御機能をより密接に統合しました。</p>
<p>基盤となるモデルは依然としてMilvus RBAC（ユーザー、ロール、<a href="https://milvus.io/docs/grant_privileges.md">権限</a>、付与、取り消し）です。Attu 3.0は、このモデルを巡る操作手順を簡素化します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>画像：Attu 3.0におけるコンテキスト内でのユーザーおよび権限管理</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">一般的なスコープ向けのワンクリックユーザー作成</h3><p>Attu 2.x では、コレクションへの読み取り専用アクセスを許可するには、通常、ユーザー作成、ロールの作成、権限の設定、ユーザーへのロールの割り当て、スコープの確認といった複数の手順が必要でした。</p>
<p><strong>Attu 3.0では、コレクションを開き、「ユーザー」タブに移動して「ユーザーの作成」をクリックし、「ReadOnly」または「ReadWrite」を選択するだけで、Attuがワークフローを完了させます。これにより</strong>、ユーザーの作成、安全なパスワードの生成、対応するスコープ付きロールの作成、および権限付与が実行されます。</p>
<p>この同じパターンはデータベースレベルでも機能します。また、ワンクリックで既存のユーザーに現在のコレクションへのアクセス権を付与したり、アクセス権を取り消したりすることも可能です。</p>
<p>これにより、権限管理は保護対象のリソースに近い位置で行われます。チームメイトにスコープ付きアクセス権を付与するためだけに、複数の管理ページを行き来したり、ロールの命名規則を覚えたりする必要はありません。</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">このベータ版が Attu ユーザーに意味すること<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Betaは、Attuのリリース以来、Milvus管理コンソールにとって最大のアップデートです。</strong>これは単なるビジュアルの刷新にとどまりません<strong>。</strong>Attuが対応できる範囲そのものを変えるものです。</p>
<p>主なアップグレード点は、Attuが多くのMilvusユーザーの実際のワークフローに適合するようになったことです。具体的には、複数のクラスター、永続的なローカル設定、データ移動の増加、アクセス制御の強化、トラブルシューティングの増加、そしてツールを切り替えることなくクラスターの挙動を理解する必要性の高まりに対応しています。</p>
<p>主なハイライトは以下の通りです：</p>
<ul>
<li>ヘルスインジケーターとワンクリック切り替え機能を備えたマルチクラスター管理。</li>
<li>クラスタ設定、プリファレンス、LLM設定、エージェント履歴、カスタムスキルに対する永続的なローカル状態。</li>
<li>50以上のMilvusツールと、破壊的な操作に対する確認ゲートを備えた組み込みAIエージェント。</li>
<li>クラスタのヘルス、検索パフォーマンス、データ書き込み、および構成レビューのための4つの組み込みエキスパート診断スキル。</li>
<li>データベース → コレクション → パーティションのナビゲーションと、より豊富なコレクション操作を備えた、再設計されたデータブラウザ。</li>
<li>Prometheusメトリクス、スロークエリ分析、トポロジー、バックアップおよび復元機能を内蔵。</li>
<li>Milvus APIのデバッグおよび学習のためのREST API Playground。</li>
<li>データベースやコレクションの横で実行される RBAC ワークフロー（独立した管理フロー内だけでなく）。</li>
</ul>
<p>AttuをローカルでのMilvus開発専用に使用する場合でも、3.0ではより高性能なコンソールが利用可能です。複数のMilvus環境を管理している場合、マルチクラスタ機能と永続状態の変更だけでも試す価値があります。 パフォーマンスや権限の問題を頻繁にデバッグする場合は、エージェント、診断、メトリクス、およびコンテキスト内 RBAC ワークフローによって、すぐに時間の節約ができるはずです。</p>
<h2 id="Get-Started" class="common-anchor-header">はじめに<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>DockerでAttu 3.0 Betaを試す:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>次に、以下を開いてください：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>サイドバーからMilvus接続を追加し、新しいコンソールを試してみてください。</p>
<p>デスクトップアプリをご希望ですか？<a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>から、お使いのプラットフォーム用のビルドをダウンロードしてください。Attu 3.0 Betaでは、macOS、Linux、Windows用のデスクトップパッケージを提供しています。最近のリリースには、DockerやElectronを使用せずにAttuを実行するためのスタンドアロンLinuxサーバーパッケージも含まれています。</p>
<p><strong>ご質問はありますか？</strong>マルチクラスタ環境の構築、カスタムエージェントのスキル、または診断シナリオについて、<a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a> でお尋ねいただくか、<a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours</strong></a>を予約してコミュニティと一緒に解決しましょう。</p>
<p><strong>Milvusのインフラを自ら運用したくないですか？</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloudは</strong></a>、Milvusの開発チームが提供するフルマネージドプラットフォームです。Milvus APIを維持しつつ、リアルタイムベクトル検索、大規模ディスカバリー、AIデータオペレーションのためのマネージドインフラストラクチャを追加します。 データ主権の要件があるチーム向けに、Zilliz Cloud<strong>BYOCは</strong>お客様のクラウドアカウント内で稼働するため、Zillizが運用を担当する間もデータはお客様のVPC内に留まります。</p>
