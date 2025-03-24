---
id: introducing-milvus-lite.md
title: Milvus Liteのご紹介：数秒でGenAIアプリケーションの構築を開始
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pythonアプリケーション内でローカルに動作する軽量ベクトルデータベース、<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteを</a>ご紹介いたします。オープンソースの<a href="https://milvus.io/intro">Milvus</a>ベクトルデータベースをベースにしたMilvus Liteは、ベクトルインデックス作成とクエリ解析のコアコンポーネントを再利用する一方で、分散システムにおける高いスケーラビリティを実現するために設計された要素を削除しています。この設計により、ラップトップ、Jupyter Notebooks、モバイルデバイスやエッジデバイスなど、コンピューティングリソースが限られた環境に理想的なコンパクトで効率的なソリューションを実現します。</p>
<p>Milvus Liteは、LangChainやLlamaIndexのような様々なAI開発スタックと統合されており、サーバーのセットアップなしでRAG（Retrieval Augmented Generation）パイプラインのベクターストアとして使用することができます。PythonライブラリとしてAIアプリケーションに組み込むには、<code translate="no">pip install pymilvus</code> （バージョン2.4.3以上）を実行するだけです。</p>
<p>Milvus LiteはMilvus APIを共有するため、小規模なローカルデプロイメントでも、数十億のベクターを持つDockerやKubernetes上にデプロイされたMilvusサーバーでも、クライアントサイドのコードが動作することを保証します。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Milvus Liteを構築した理由<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>多くのAIアプリケーションは、チャットボットやショッピングアシスタントなどのアプリケーションのために、テキスト、画像、音声、動画を含む非構造化データのベクトル類似検索を必要とします。ベクトルデータベースは、ベクトル埋め込みデータを保存し検索するために作られ、AI開発スタックの重要な部分であり、特に<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG（Retrieval Augmented Generation）の</a>ような生成的AIのユースケースにとって重要です。</p>
<p>数多くのベクトル検索ソリューションがあるにもかかわらず、大規模な生産展開にも対応する、簡単に始められるオプションがありませんでした。Milvusの開発者として、私たちはMilvus on Kubernetes、Docker、マネージドクラウドサービスを含む様々なデプロイメントオプションで一貫したエクスペリエンスを保証しながら、AI開発者がアプリケーションをより速く構築できるようにMilvus Liteを設計しました。</p>
<p>Milvus Liteは、Milvusエコシステム内の一連の製品群に加わる重要な製品です。Milvus Liteは、開発のあらゆる段階をサポートする汎用的なツールを開発者に提供します。プロトタイピングから本番環境、エッジコンピューティングから大規模なデプロイメントまで、Milvusはあらゆる規模、あらゆる開発段階のユースケースをカバーする唯一のベクターデータベースとなりました。</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Milvus Liteの仕組み<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Liteは、Milvusで利用可能なすべての基本操作（コレクションの作成、ベクターの挿入、検索、削除など）をサポートしています。ハイブリッド検索などの高度な機能にも近々対応する予定です。Milvus Liteは効率的な検索のためにデータをメモリにロードし、SQLiteファイルとして永続化します。</p>
<p>Milvus Liteは<a href="https://github.com/milvus-io/pymilvus">MilvusのPython SDKに</a>含まれており、シンプルな<code translate="no">pip install pymilvus</code> 。以下のコードスニペットは、ローカルファイル名を指定し、新しいコレクションを作成することで、Milvus Liteでベクトルデータベースをセットアップする方法を示しています。<code translate="no">&quot;milvus_demo.db&quot;</code> <code translate="no">&quot;http://localhost:19530&quot;</code> MilvusのAPIに慣れている人にとって、唯一の違いは<code translate="no">uri</code> がネットワークエンドポイントではなくローカルファイル名を参照していることです。その他はすべて同じです。Milvus Liteは、以下に示すように、動的または明示的に定義されたスキーマを使用して、生のテキストやその他のラベルをメタデータとして保存することもサポートしています。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>スケーラビリティのために、Milvus Liteで開発されたAIアプリケーションは、サーバーエンドポイントで<code translate="no">uri</code> を指定するだけで、DockerやKubernetes上にデプロイされたMilvusを使用するように簡単に移行することができます。</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">AI開発スタックとの統合<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索を簡単に始められるMilvus Liteの導入に加え、Milvusは<a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>、<a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>、<a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>、<a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>、<a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>、<a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>、<a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>、<a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>、<a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>、<a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>、<a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>、<a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a>、<a href="https://memgpt.readme.io/docs/storage#milvus">MemGPTなど</a>、AI開発スタックの多くのフレームワークやプロバイダーとも統合しています。広範なツールとサービスのおかげで、これらの統合はベクトル検索機能を備えたAIアプリケーションの開発を簡素化する。</p>
<p>そして、これはほんの始まりに過ぎません-多くのエキサイティングな統合が間もなく登場します！ご期待ください！</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">その他のリソースと例<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/quickstart.md">Milvus クイックスタートドキュメントでは</a>、<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">RAG（</a>Retrieval-Augmented Generation）や<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">画像検索の</a>ようなAIアプリケーションを構築するためにMilvus Liteを使用するための詳細なガイドとコード例をご覧いただけます。</p>
<p>Milvus Liteはオープンソースプロジェクトです。まずは<a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">コントリビューティングガイドを</a>ご覧ください。また、<a href="https://github.com/milvus-io/milvus-lite">Milvus LiteのGitHub</a>リポジトリに課題を提出することで、バグを報告したり、機能をリクエストすることができます。</p>
