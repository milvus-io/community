---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: ドラッグ、ドロップ、デプロイ：LangflowとmilvusでRAGワークフローを構築する方法
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Langflowとmilvusを使ってビジュアルなRAGワークフローを構築する方法を学びます。ドラッグ＆ドロップで、数分でコンテキストを意識したAIアプリをデプロイできます。
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>AIワークフローの構築は、必要以上に難しく感じることが多い。グルーコードの記述、APIコールのデバッグ、データパイプラインの管理など、そのプロセスは結果が出るまでに何時間も費やすことになります。<a href="https://www.langflow.org/"><strong>Langflowと</strong></a> <a href="https://milvus.io/"><strong>Milvusは</strong></a>、これを劇的に簡素化します。コードライトな方法で、数日ではなく数分で検索支援生成（RAG）ワークフローを設計、テスト、導入することができます。</p>
<p><strong>Langflowは</strong>、コーディングというよりもホワイトボードにアイデアをスケッチするような感覚で、ドラッグ＆ドロップのクリーンなインターフェイスを提供します。言語モデル、データソース、外部ツールを視覚的に接続し、ワークフローロジックを定義することができます。</p>
<p>LLMに長期記憶と文脈理解を与えるオープンソースのベクトル・データベースである<strong>Milvusと</strong>組み合わせることで、この2つはプロダクション・グレードのRAGのための完全な環境を形成します。Milvusは、企業やドメイン固有のデータからの埋め込みを効率的に保存・取得し、LLMが根拠があり、正確で、コンテキストを意識した回答を生成できるようにします。</p>
<p>このガイドでは、LangflowとMilvusを組み合わせて高度なRAGワークフローを構築する方法を説明します。</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Langflowとは？<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGのデモを見る前に、Langflowとは何か、何ができるかを学びましょう。</p>
<p>LangflowはオープンソースのPythonベースのフレームワークで、AIアプリケーションの構築と実験を容易にします。エージェントやモデル・コンテキスト・プロトコル（MCP）などの主要なAI機能をサポートしており、開発者にも非開発者にも、インテリジェント・システムを作成するための柔軟な基盤を提供します。</p>
<p>Langflowの中核はビジュアル・エディタです。様々なリソースをドラッグ、ドロップ、接続することで、モデル、ツール、データソースを組み合わせた完全なアプリケーションを設計することができます。ワークフローをエクスポートすると、Langflow は自動的に<code translate="no">FLOW_NAME.json</code> という名前のファイルをローカル マシンに生成します。このファイルには、フローを記述するすべてのノード、エッジ、メタデータが記録されるため、チーム間でプロジェクトを簡単にバージョン管理、共有、再現することができます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>舞台裏では、Pythonベースのランタイムエンジンがフローを実行する。このエンジンはLLM、ツール、検索モジュール、ルーティングロジックをオーケストレーションし、データフロー、状態、エラー処理を管理することで、最初から最後までスムーズな実行を保証します。</p>
<p>Langflowには、<a href="https://milvus.io/">Milvusを</a>含む一般的なLLMやベクトル データベース用のアダプタがあらかじめ組み込まれた豊富なコンポーネント ライブラリも含まれています。特殊なユースケース用にカスタムPythonコンポーネントを作成することで、これをさらに拡張することができます。テストと最適化のために、Langflowはステップ・バイ・ステップの実行、迅速なテストのためのPlayground、エンドツーエンドのワークフローの監視、デバッグ、再生のためのLangSmithとLangfuseとの統合を提供します。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">ハンズオンデモLangflowとmilvusによるRAGワークフローの構築方法<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Langflowのアーキテクチャをベースに、Milvusはエンベッディングを管理し、プライベートな企業データやドメイン固有のナレッジを取得するベクターデータベースとして機能します。</p>
<p>このデモでは、LangflowのベクターストアRAGテンプレートを使用して、Milvusを統合し、ローカルデータからベクターインデックスを構築する方法を実演します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>1.Python 3.11（またはConda）</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4.OpenAIキー</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">ステップ1.Milvusベクターデータベースをデプロイする。</h3><p>デプロイファイルをダウンロードする。</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvusサービスを起動する。</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">ステップ2.Python仮想環境の作成</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">ステップ3.最新パッケージのインストール</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">ステップ4.Langflowを起動する</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Langflowにアクセスします。</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">ステップ5.RAGテンプレートの設定</h3><p>LangflowのVector Store RAGテンプレートを選択します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusをデフォルトのベクターデータベースとして選択します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>左のパネルで "Milvus "を検索し、フローに追加します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus接続の詳細を設定します。他のオプションはデフォルトのままにしておきます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>関連するノードにOpenAIのAPIキーを追加します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">ステップ 6.テストデータの準備</h3><p>Milvus 2.6の公式FAQをテストデータとして使用します。</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">ステップ 7.第一段階のテスト</h3><p>データセットをアップロードし、Milvusに取り込みます。 注：Langflowはテキストをベクトル表現に変換します。少なくとも2つのデータセットをアップロードする必要があります。これはLangflowの現在のノード実装における既知のバグです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ノードの状態を確認してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">ステップ8.フェーズ2のテスト</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">ステップ9.完全なRAGワークフローを実行する</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>AIワークフローの構築は複雑である必要はありません。Langflow + Milvusは、高速で、視覚的で、コードが軽く、エンジニアリングの労力を必要とせずにRAGを強化するシンプルな方法を提供します。</p>
<p>Langflowのドラッグアンドドロップ・インターフェイスは、AIシステムがどのように機能するかを明確かつインタラクティブに示す必要がある教育、ワークショップ、ライブデモに適しています。直感的なワークフロー設計とエンタープライズグレードのベクトル検索を統合したいチームには、LangflowのシンプルさとMilvusの高性能検索を組み合わせることで、柔軟性とパワーの両方を実現します。</p>
<p>今すぐ<a href="https://milvus.io/">Milvusで</a>スマートなRAGワークフローを構築してください。</p>
<p>ご質問がある場合、または機能について詳しく知りたい場合は、Discordチャンネルにご参加ください。私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
