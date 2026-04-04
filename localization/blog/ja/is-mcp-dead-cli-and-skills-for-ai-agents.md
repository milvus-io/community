---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: MCPは死んだのか？MCP、CLI、エージェントスキルで構築するために学んだこと
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: MCPはコンテキストを食い、本番で壊れ、エージェントのLLMを再利用できない。私たちはこの3つすべてを使って構築しました。
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>PerplexityのCTOであるDenis YaratsがASK 2026で社内でMCPの優先順位を下げていると発言したとき、いつものサイクルが始まった。YCのCEOであるGarry Tanは、MCPはコンテキストウィンドウを食いすぎ、認証は壊れている、彼はCLIに代わるものを30分で作った、と非難した。Hacker Newsは反MCPを強く打ち出した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>1年前なら、これほど世間が懐疑的になることは珍しかっただろう。モデルコンテキストプロトコル（MCP）は、<a href="https://zilliz.com/glossary/ai-agents">AIエージェント</a>ツール統合のための決定的な標準として位置づけられていた。サーバー数は毎週倍増していた。それ以来、このパターンはおなじみの弧をたどっている：急速な宣伝、広範な採用、そして生産現場での幻滅。</p>
<p>業界は迅速に対応している。BytedanceのLark/Feishuは公式CLIをオープンソース化し、11のビジネスドメインにわたる200以上のコマンドと19の組み込みエージェントスキルを提供した。GoogleはGoogle Workspace用のgwsを出荷した。CLI + スキルのパターンは、ニッチな代替ではなく、エンタープライズエージェントツールのデフォルトになりつつあります。</p>
<p>Zillizでは、<a href="https://milvus.io/intro">Milvusと</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a>（フルマネージドMilvus）をコーディング環境を離れることなくターミナルから直接操作・管理できる<a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLIを</a>リリースしました。さらに、<a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skillsと</a> <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skillsを</a>構築し、Claude CodeやCodexのようなAIコーディングエージェントが自然言語で<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースを</a>管理できるようにしました。</p>
<p>また、1年前にMilvusとZilliz Cloud用のMCPサーバーを構築しました。その経験から、MCPがどこで破綻しているのか、そしてどこでまだ適合しているのかを正確に知ることができました。コンテキストウィンドウの肥大化、受動的なツールデザイン、エージェント自身のLLMを再利用できないことです。</p>
<p>この投稿では、それぞれの問題点を説明し、私たちが代わりに構築しているものを示し、MCP、CLI、エージェントスキルのいずれかを選択するための実用的なフレームワークを示します。</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCPは起動時にコンテキスト・ウィンドウの72%を消費する<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>標準的なMCPのセットアップは、エージェントが1つのアクションを起こす前に、利用可能なコンテキストウィンドウの約72%を消費します。GitHub、Playwright、IDE統合の3つのサーバーを200Kトークンモデルで接続すると、ツールの定義だけでおよそ143Kトークンを消費します。エージェントはまだ何もしていない。すでに4分の3が埋まっている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>コストはトークンだけではない。コンテキストに無関係なコンテンツが詰め込まれれば詰め込まれるほど、モデルが実際に重要なことにフォーカスできなくなる。100のツールスキーマがコンテキストの中にあるということは、エージェントが意思決定のたびにそれらすべてに目を通すことを意味する。研究者たちは、<em>コンテキストの腐敗</em>（コンテキストの過負荷による推論の質の低下）と呼ぶものを文書化している。実測テストでは、ツール数が増えるにつれて、ツール選択精度は43％から14％以下に低下した。ツールが増えるということは、逆説的だが、ツールの使い方が悪くなることを意味する。</p>
<p>根本的な原因はアーキテクチャにある。MCPは、セッション開始時に、現在の会話がツールを使用するかどうかに関係なく、すべてのツールの説明を完全にロードします。これはプロトコルレベルの設計上の選択であり、バグではありません。</p>
<p>エージェントスキルは異なるアプローチをとります。セッション開始時にエージェントは各スキルのメタデータ（名前、1行の説明、トリガー条件）のみを読み取ります。合計数十トークンです。スキルの全コンテンツは、エージェントが関連性があると判断した場合にのみ読み込まれます。このように考えてください：MCPはあらゆるツールをドアの前に並べ、選択させる。Skillsは最初にインデックスを提供し、オンデマンドでフルコンテンツを提供する。</p>
<p>CLIツールも同様の利点がある。エージェントはgit --helpやdocker --helpを実行し、すべてのパラメータ定義をプリロードすることなく、オンデマンドで機能を発見する。コンテキストのコストは前払いではなく、従量課金だ。</p>
<p>小規模であれば、その差はごくわずかだ。本番規模では、これは機能するエージェントと、独自のツール定義に溺れるエージェントの違いだ。</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">MCPの受動的なアーキテクチャがエージェントのワークフローを制限する<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCPは、ツール呼び出しプロトコルです。ツールを発見し、呼び出し、結果を受け取る方法です。シンプルなユースケースのためのクリーンな設計です。しかし、そのクリーンさは同時に制約でもある。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">階層のないフラットなツールスペース</h3><p>MCPツールはフラットな関数シグネチャです。サブコマンドもなく、セッションのライフサイクルを意識することもなく、エージェントがマルチステップワークフローのどこにいるのかもわかりません。呼ばれるのを待つ。それがすべてだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>gitコミット、gitプッシュ、gitログは、単一のインターフェイスを共有する全く異なる実行パスである。エージェントは --help を実行し、利用可能なサーフェスをインクリメンタルに探索し、必要なものだけを展開する。</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">スキルはワークフローロジックをエンコードする - MCPではできない</h3><p>エージェントスキルは、最初に何をするか、次に何をするか、失敗をどのように処理するか、いつユーザに何かを提示するかといった標準的な操作手順を含むMarkdownファイルです。エージェントは、単なるツールではなく、ワークフロー全体を受け取ります。スキルは、エージェントが会話中にどのように行動するか（何が引き金になるか、何を事前に準備するか、エラーからどのように回復するか）を積極的に形成する。MCPツールは待つことしかできない。</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCPはエージェントのLLMにアクセスできない</h3><p>これは、私たちを実際に止めた制限です。</p>
<p><a href="https://github.com/zilliztech/claude-context">クロード</a>・コードや他のAIコーディング・エージェントに<a href="https://zilliz.com/glossary/semantic-search">セマンティック検索を</a>追加し、コードベース全体から深いコンテキストを与えるMCPプラグインである<a href="https://github.com/zilliztech/claude-context">claude-contextを</a>構築したとき、私たちはMilvusから関連する過去の会話スニペットを取得し、コンテキストとして表示したいと考えた。<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索は</a>うまくいった。問題は結果をどうするかだった。</p>
<p>上位10件を検索して、3件くらいは役に立つだろう。残りの7つはノイズだ。10件すべてを外側のエージェントに渡すと、ノイズが答えの邪魔をする。テストでは、無関係な過去の記録によって回答が散漫になるのを見ました。結果を渡す前にフィルターをかける必要がありました。</p>
<p>いくつかのアプローチを試した。小さなモデルを使ってMCPサーバーの中にリランキングステップを追加する：十分な精度がなく、関連性のしきい値はユースケースごとにチューニングする必要がありました。リランキングに大きなモデルを使う：技術的には問題ありませんが、MCPサーバーは外部エージェントのLLMにアクセスできない別のプロセスとして実行されます。別のLLMクライアントを設定し、別のAPIキーを管理し、別のコールパスを処理しなければなりません。</p>
<p>私たちが望んでいたことは単純です。外部エージェントの LLM をフィルタリングの決定に直接参加させることです。トップ10を取得し、エージェント自身に残す価値のあるものを判断させ、関連する結果のみを返す。2つ目のモデルは不要です。余分なAPIキーもない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCPはこれができない。サーバとエージェントの間のプロセスの境界は、インテリジェンスの境界でもある。サーバーはエージェントのLLMを使うことができず、エージェントはサーバー内部で起こることを制御することができません。単純なCRUDツールでは問題ありません。ツールが判断を下す必要があるとき、その分離は本当の制約になります。</p>
<p>エージェントスキルはこれを直接解決します。検索スキルは、トップ10のベクトル検索を呼び出し、エージェント自身のLLMに関連性を評価させ、合格したものだけを返すことができます。追加モデルはありません。エージェント自身がフィルタリングを行います。</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">CLIとスキルで代わりに構築したもの<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは、CLI + スキルをエージェントとツールのインタラクションの方向性として考えています。この確信が、私たちが構築しているすべてのものを動かしています。</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch：AIエージェントのためのスキルベースのメモリーレイヤー</h3><p>私たちは、クロード・コードやその他のAIエージェントのためのオープンソースのメモリーレイヤーである<a href="https://github.com/zilliztech/memsearch">memsearchを</a>構築した。スキルは3つのステージを持つサブエージェント内で実行される：milvusは幅広い発見のために最初のベクトル検索を処理し、エージェント自身のLLMは関連性を評価し、有望なヒットのためにコンテキストを拡張し、最後のドリルダウンでは必要なときだけ元の会話にアクセスする。ノイズは各段階で破棄され、中間的な検索のゴミがプライマリコンテキストウィンドウに到達することはない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>重要な洞察：エージェントのインテリジェンスはツールの実行の一部である。ループの中にあるLLMがフィルタリングを行うので、2つ目のモデルも、余分なAPIキーも、もろいしきい値のチューニングも必要ない。これは、コーディングエージェントのための会話コンテキストの検索という特殊なユースケースですが、このアーキテクチャは、ツールの実行だけでなく、判断が必要なあらゆるシナリオに一般化します。</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">ベクターデータベース操作のためのZilliz CLI、スキル、プラグイン</h3><p>Milvusは世界で最も広く採用されているオープンソースのベクターデータベースであり、<a href="https://github.com/milvus-io/milvus">GitHub上で43K以上のスターを</a>持つ。<a href="https://zilliz.com/cloud">Zilliz Cloudは</a>Milvusのフルマネージドサービスであり、高度なエンタープライズ機能を備え、Milvusよりもはるかに高速です。</p>
<p>上記と同じレイヤーアーキテクチャーが開発者ツールを動かしています：</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLIは</a>インフラレイヤーです。クラスタ管理、<a href="https://milvus.io/docs/manage-collections.md">コレクション操作</a>、ベクトル検索、<a href="https://milvus.io/docs/rbac.md">RBAC</a>、バックアップ、課金など、Zilliz Cloudのコンソールで行うすべてのことがターミナルから利用できます。人間もエージェントも同じコマンドを使う。Zilliz CLIはMilvus SkillとZilliz Skillsの基盤にもなっている。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skillは</a>、オープンソースのMilvusの知識層である。AIコーディングエージェント（Claude Code、Cursor、Codex、GitHub Copilot）が、<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>、スタンドアロン、または分散型のMilvusデプロイメントを、<a href="https://milvus.io/docs/install-pymilvus.md">Pymilvus</a>Pythonコードを通じて操作できるようにします。</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zillizスキルは</a>Zillizクラウドでも同様で、Zilliz CLIを通してクラウドインフラを管理するエージェントを教えます。</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Pluginは</a>Claude Codeの開発者エクスペリエンスレイヤーで、CLI + Skillを/zilliz:quickstartや/zilliz:statusのようなスラッシュコマンドによるガイド付きエクスペリエンスにラップします。</li>
</ul>
<p>CLIは実行を処理し、スキルは知識とワークフローロジックをエンコードし、プラグインはUXを提供します。ループ内にMCPサーバーは存在しない。</p>
<p>詳細については、以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Zilliz CLIとZilliz Cloudのエージェントスキルの紹介</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloudがクロードコードに登場</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AIプロンプト - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLIリファレンス - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zillizスキル - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">AIエージェントのためのmilvus - Milvusドキュメント</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">MCPは本当に滅びるのか？<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちZillizを含め、多くの開発者や企業がCLIやスキルに目を向けています。しかし、MCPは本当に死につつあるのでしょうか？</p>
<p>短い答え：いいえ-しかし、その範囲は実際に適合するところまで狭まりつつある。</p>
<p>MCPはLinux Foundationに寄付されました。アクティブなサーバーの数は10,000を超えています。SDKの月間ダウンロード数は9,700万に達している。この規模のエコシステムは、カンファレンスのコメントで消滅することはない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hacker News のスレッド、<em>"When does MCP make sense vs CLI?"</em>には、<em>CLI</em>を支持する回答がほとんどだった。- CLIツールは精密機器のようだ」、「CLIはMCPよりもキビキビしている」。もっとバランスの取れた見方をしている開発者もいる：スキルは問題をよりよく解決するための詳細なレシピであり、MCPは問題を解決するためのツールである。MCPは問題解決に役立つツールだ。</p>
<p>しかし、それは現実的な問題を提起している。レシピそのものが、どのツールをどのように使うかをエージェントに指示できるのであれば、ツール配布のプロトコルは別に必要なのだろうか？</p>
<p>それはユースケースによります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ほとんどの開発者がローカルで実行している<strong>stdio上でのMCPは</strong>、不安定なプロセス間通信、厄介な環境分離、高いトークンオーバーヘッドといった問題が累積するところです。そのような状況では、ほとんどすべてのユースケースにおいて、より良い選択肢が存在する。</p>
<p><strong>HTTP経由のMCPは</strong>別の話です。エンタープライズの内部ツールプラットフォームには、一元化された権限管理、統一されたOAuth、標準化された遠隔測定とロギングが必要だ。断片化されたCLIツールは、純粋にこれらを提供するのに苦労している。MCPの一元化されたアーキテクチャは、そのような状況において真価を発揮する。</p>
<p>Perplexityが実際に落としたのは、主にstdioのユースケースだった。デニス・ヤラッツは "内部的に "と指定し、その選択を業界全体で採用することを求めなかった。PerplexityがMCPを放棄する」というニュアンスは、「Perplexityが社内ツール統合のためにstdioよりもMCPを優先しない」というニュアンスよりもかなり早く広まってしまった。</p>
<p>MCPが登場したのは、それが現実的な問題を解決したからである。MCPが登場する前は、すべてのAIアプリケーションは独自のツール呼び出しロジックを書いており、共有された標準はなかった。MCPは適切なタイミングで統一されたインターフェースを提供し、エコシステムは急速に構築されました。MCPは適切なタイミングで統一されたインターフェイスを提供し、エコシステムは瞬く間に構築された。これはインフラツールの正常な弧であり、死刑宣告ではない。</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">MCP、CLI、スキルのどれを使うべきか<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
<tr><th></th><th>stdio経由のMCP（ローカル）</th><th>HTTP経由のMCP（エンタープライズ）</th></tr>
</thead>
<tbody>
<tr><td><strong>認証</strong></td><td>なし</td><td>OAuth、集中型</td></tr>
<tr><td><strong>接続の安定性</strong></td><td>プロセス分離の問題</td><td>安定したHTTPS</td></tr>
<tr><td><strong>ロギング</strong></td><td>標準メカニズムなし</td><td>集中型遠隔測定</td></tr>
<tr><td><strong>アクセス制御</strong></td><td>なし</td><td>役割ベースのアクセス許可</td></tr>
<tr><td><strong>当社の見解</strong></td><td>CLI + スキルに置き換える</td><td>エンタープライズツールのために維持する</td></tr>
</tbody>
</table>
<p><a href="https://zilliz.com/glossary/ai-agents">エージェントAI</a>ツールスタックを選択するチームにとって、レイヤーの適合性は以下の通りだ：</p>
<table>
<thead>
<tr><th>レイヤー</th><th>機能</th><th>最適</th><th>例</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>オペレーションタスク、インフラ管理</td><td>エージェントと人間の両方が実行するコマンド</td><td>git、docker、zilliz-cli</td></tr>
<tr><td><strong>スキル</strong></td><td>エージェントのワークフローロジック、エンコードされた知識</td><td>LLM判断が必要なタスク、マルチステップSOP</td><td>milvus-スキル、zilliz-スキル、memsearch</td></tr>
<tr><td><strong>REST API</strong></td><td>外部インテグレーション</td><td>サードパーティサービスとの接続</td><td>GitHub API、Slack API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>エンタープライズツールプラットフォーム</td><td>集中認証、監査ロギング</td><td>内部ツールゲートウェイ</td></tr>
</tbody>
</table>
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
    </button></h2><p>この記事で説明したものは全て今日から利用可能です：</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>- AIエージェントのためのスキルベースのメモリレイヤー。クロードコードやスキルをサポートするエージェントにドロップしてください。</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a>- MilvusとZilliz Cloudをターミナルから管理。インストールして、エージェントが使用できるサブコマンドを調べましょう。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus</strong></a>スキルと<a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zillizスキル</strong></a>- AIコーディングエージェントにMilvusとZilliz Cloudのネイティブな知識を与えます。</li>
</ul>
<p>ベクトル検索、エージェントアーキテクチャ、CLIとスキルでの構築について質問がありますか？<a href="https://discord.com/invite/8uyFbECzPX">MilvusのDiscordコミュニティに</a>参加するか、<a href="https://milvus.io/office-hours">無料のオフィスアワーセッションを予約して</a>、あなたのユースケースについて話しましょう。</p>
<p>構築の準備はできましたか？<a href="https://cloud.zilliz.com/signup">Zilliz Cloudにサインアップして</a>ください。すでにアカウントをお持ちですか？<a href="https://cloud.zilliz.com/login">こちらからサインインして</a>ください。</p>
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">AIエージェントのMCPの何が問題ですか？</h3><p>MCPには、実運用において3つの主なアーキテクチャ上の制限があります。第一に、セッション開始時にすべてのツールスキーマをコンテキストウィンドウにロードします。20万トークンモデルで3台のMCPサーバーを接続するだけで、エージェントが何もしないうちに利用可能なコンテキストの70%以上を消費してしまいます。第二に、MCPツールは受動的です。呼び出されるのを待つだけで、マルチステップワークフロー、エラー処理ロジック、標準操作手順をエンコードすることはできません。第三に、MCPサーバーは、エージェントのLLMにアクセスできない別のプロセスとして実行されるため、（検索結果の関連性をフィルタリングするような）判断が必要なツールは、独自のAPIキーを持つ別のモデルを構成する必要があります。これらの問題は、MCP over stdioで最も深刻になります。MCP over HTTPは、これらの問題をいくつか軽減します。</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">MCPとエージェント・スキルの違いは何ですか?</h3><p>MCPは、エージェントが外部ツールを発見し、呼び出す方法を定義するツール呼び出しプロトコルです。エージェントスキルは、トリガー、ステップバイステップの指示、エラー処理、エスカレーションルールなど、完全な標準操作手順を含むMarkdownファイルです。アーキテクチャ上の主な違いスキルはエージェントのプロセス内で実行されるため、関連性のフィルタリングや結果の再ランク付けのような判断のために、エージェント自身のLLMを活用することができます。MCPツールは別のプロセスで実行され、エージェントのインテリジェンスにアクセスすることはできません。また、Skillsはプログレッシブな情報開示を採用しており、起動時に軽量なメタデータのみをロードし、必要に応じて完全なコンテンツをロードすることで、MCPのスキーマロードに比べ、コンテキストウィンドウの使用量を最小限に抑えることができます。</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">CLIやSkillsの代わりにMCPを使うべき場合は？</h3><p>HTTP経由のMCPは、一元化されたOAuth、ロールベースのアクセスコントロール、標準化された遠隔測定、多くの社内ツールにまたがる監査ロギングが必要なエンタープライズツールプラットフォームにとって、依然として理にかなっています。断片化されたCLIツールは、これらの企業要件を一貫して提供するのに苦労している。ローカル開発ワークフロー（エージェントがあなたのマシン上でツールと対話する場合）において、CLI + スキルは、一般的に stdio 経由の MCP よりも優れたパフォーマンス、より低いコンテキストオーバーヘッド、より柔軟なワークフローロジックを提供します。</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">CLI ツールとエージェントスキルはどのように連携しますか？</h3><p>CLIは実行レイヤー（実際のコマンド）を提供し、スキルは知識レイヤー（いつ、どのコマンドを、どの順番で実行し、どのように障害を処理するか）を提供します。例えば、Zilliz CLIはクラスタ管理、コレクションCRUD、ベクトル検索のようなインフラ操作を処理します。Milvus Skillは、スキーマ設計、ハイブリッド検索、RAGパイプラインのための正しいpymilvusパターンをエージェントに教える。CLIは作業を行い、Skillはワークフローを知る。実行はCLI、知識はスキル、UXはプラグインというレイヤーパターンは、Zillizのすべての開発者ツールを構成する方法です。</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs スキル vs CLI：それぞれをいつ使うべきか？</h3><p>git、docker、zilliz-cliのようなCLIツールは、運用タスクに最適です - 階層的なサブコマンドを公開し、オンデマンドでロードします。milvus-skillのようなスキルは、エージェントのワークフローロジックに最適です - 操作手順やエラーリカバリーを持ち、エージェントのLLMにアクセスできます。HTTP経由のMCPは、OAuth、パーミッション、監査ログの一元化を必要とするエンタープライズツールプラットフォームに適しています。MCP over stdio - ローカルバージョン - は、ほとんどのプロダクションセットアップで CLI + スキルに取って代わられつつあります。</p>
