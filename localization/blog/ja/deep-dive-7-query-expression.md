---
id: deep-dive-7-query-expression.md
title: データベースはどのようにクエリを理解し、実行するのか？
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: ベクトル・クエリーとは、スカラー・フィルタリングによってベクトルを検索するプロセスである。
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niによって</a>書き起こされています。</p>
</blockquote>
<p>Milvusにおける<a href="https://milvus.io/docs/v2.0.x/query.md">ベクトル検索とは</a>、ブーリアン式に基づくスカラーフィルタリングによってベクトルを検索することである。スカラーフィルタリングでは、ユーザーはデータの属性に特定の条件を適用してクエリ結果を制限することができる。例えば、1990年から2010年の間に公開された映画で、8.5以上のスコアを持つ映画を検索する場合、属性（公開年とスコア）が条件を満たす映画のみが検索されます。</p>
<p>この投稿では、Milvusにおいて、クエリ式の入力からクエリプランの生成、クエリの実行まで、クエリがどのように完了するのかを検証することを目的としています。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#Query-expression">クエリ式</a></li>
<li><a href="#Plan-AST-generation">プランAST生成</a></li>
<li><a href="#Query-execution">クエリ実行</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">クエリ式<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusでは、属性フィルタリングを伴うクエリの表現は、EBNF(Extended Backus-Naur form)構文を採用しています。下の画像はMilvusの表現ルールです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>式の構文</span> </span></p>
<p>論理式は、二項論理演算子、単項論理演算子、論理式、単式を組み合わせて作成することができます。EBNF構文自体が再帰的であるため、論理式は組み合わせの結果であったり、より大きな論理式の一部であったりします。論理式は多くの下位論理式を含むことができます。Milvusでも同じルールが適用されます。ユーザが多くの条件で結果の属性をフィルタリングする必要がある場合、ユーザは異なる論理演算子や論理式を組み合わせて、独自のフィルタリング条件セットを作成することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>ブール式</span> </span></p>
<p>上の画像はMilvusの<a href="https://milvus.io/docs/v2.0.x/boolean.md">論理式ルールの</a>一部を示しています。式には単項論理演算子を追加することができます。現在、Milvusは単項論理演算子 &quot;not &quot;のみをサポートしており、これはスカラーフィールドの値が計算結果を満たさないベクトルを取る必要があることを示します。二項論理演算子には &quot;and &quot;と &quot;or &quot;がある。単式には項式や比較式がある。</p>
<p>加算、減算、乗算、除算のような基本的な算術計算もMilvusのクエリでサポートされています。以下の図は演算の優先順位を示しています。演算子の優先順位は上から順に表示されています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>優先順位</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Milvusでは、あるフィルムに関するクエリー式はどのように処理されるのでしょうか？</h3><p>Milvusに豊富なフィルムデータが保存されており、ユーザが特定のフィルムに対するクエリを実行したいとします。例として、Milvusに保存されている各映画データには、映画ID、公開年、映画タイプ、スコア、ポスターの5つのフィールドがあります。この例では、映画IDと公開年のデータ型はint64であり、映画の点数は浮動小数点データである。また、映画のポスターは浮動小数点ベクトルの形式で、映画のタイプは文字列データの形式で格納されている。文字列データ型のサポートは、Milvus 2.1の新機能である。</p>
<p>例えば、ユーザが8.5点以上の映画を検索したい場合。また、2000年以前の10年間から2000年以降の10年間に公開された映画であること、または、その映画のタイプがコメディ映画かアクション映画であることが必要である場合、ユーザは次の述語式を入力する必要があります：<code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code> 。</p>
<p>クエリ式を受け取ると、システムは以下の優先順位でクエリを実行する：</p>
<ol>
<li>スコアが8.5より高い映画のクエリ。クエリー結果は &quot;result1 &quot;と呼ばれる。</li>
<li>2000-10を計算し、"result2"(1990)を得る。</li>
<li>2000+10を計算し、"result3"（2010）を得る。</li>
<li><code translate="no">release_year</code> &quot;の値が &quot;result2 &quot;より大きく、&quot;result3 &quot;より小さい映画をクエリーする。つまり、システムは1990年から2010年の間に公開された映画をクエリする必要がある。クエリー結果は &quot;result4 &quot;と呼ばれる。</li>
<li>コメディまたはアクション映画のクエリ。クエリー結果は &quot;result5 &quot;と呼ばれる。</li>
<li>result4 "と "result5 "を組み合わせて、1990年から2010年の間に公開された映画か、コメディ映画かアクション映画のカテゴリーに属する映画を取得する。この結果を &quot;result6 &quot;と呼ぶ。</li>
<li>result1 "と "result6 "の共通部分を取り、すべての条件を満たす最終結果を得る。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>映画の例</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">プランAST生成<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusはプランAST（抽象構文木）生成にオープンソースツール<a href="https://www.antlr.org/">ANTLR</a>（ANother Tool for Language Recognition）を活用しています。ANTLRは、構造体テキストファイルやバイナリファイルの読み取り、処理、実行、翻訳のための強力な構文解析ジェネレータです。より具体的には、ANTLR は事前に定義された構文やルールに基づいて構文木を構築し、歩くためのパーサーを生成することができます。以下の画像は、入力式が「SP=100;」である例です。ANTLR の組み込み言語認識機能である LEXER は、入力式に対して 4 つのトークンを生成します - &quot;SP&quot;、&quot;=&quot;、&quot;100&quot;、および &quot;; &quot;です。そして、このツールはさらに4つのトークンを解析し、対応する解析木を生成します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>解析ツリー</span> </span></p>
<p>ウォーカー機構はANTLRツールの重要な部分である。すべての解析木をウォークして、各ノードが構文規則に従っているかどうかを調べたり、特定のセンシティブな単語を検出したりするように設計されています。関連する API の一部を下の画像に示します。ANTLR はルートノードから開始し、各サブノードを通って一番下まで下っていくので、解析ツリーの歩き方の順序を区別する必要はありません。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>解析ツリーウォーカー</span> </span></p>
<p>MilvusはANTLRと同様の方法でクエリ用のPlanASTを生成します。しかし、ANTLRを使用するには、かなり複雑な構文ルールを再定義する必要があります。そのため、Milvusは最も一般的なルールの1つであるブール式ルールを採用し、GitHubでオープンソース化されている<a href="https://github.com/antonmedv/expr">Expr</a>パッケージに依存して、クエリ式の構文をクエリおよびパースします。</p>
<p>属性フィルタリングを伴う問い合わせの間、Milvusは問い合わせ式を受け取ると、Exprが提供する解析手法であるant-parserを使用して、原始的な未解決計画木を生成します。生成される計画木は単純なバイナリ木です。次に、この計画木はExprとMilvusの組み込みオプティマイザによって微調整されます。Milvusのオプティマイザは前述のウォーカー機構とよく似ています。Exprが提供するプランツリーの最適化機能はかなり洗練されているので、Milvusの組み込みオプティマイザの負担はかなり軽減される。最終的に、アナライザは最適化されたプランツリーを再帰的に解析し、<a href="https://developers.google.com/protocol-buffers">プロトコルバッファ</a>（protobuf）構造のプランASTを生成します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>プランASTのワークフロー</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">クエリの実行<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリの実行は、前のステップで生成されたプランASTの実行を根本とします。</p>
<p>Milvusでは、プランASTはプロト構造で定義されます。下の画像はプロトブフ構造体のメッセージです。式は6種類あり、このうちバイナリ式とユナリ式は、さらにバイナリ論理式とユナリ論理式を持つことができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>プロトブーフ1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>プロトブーフ2</span> </span></p>
<p>下の図は、クエリ式のUMLイメージです。各式の基本クラスと派生クラスを示しています。各クラスには、ビジターのパラメータを受け付けるメソッドがあります。これは典型的なビジターの設計パターンです。Milvusはこのパターンを使用してプランASTを実行します。最大の利点は、ユーザがプリミティブ式に何もする必要がなく、パターンのメソッドのいずれかに直接アクセスして、特定のクエリ式クラスと関連する要素を変更できることです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>計画ASTを実行する際、Milvusはまずプロトタイプの計画ノードを受け取ります。次に、内部C++プロトパーサーを介してセグコア型プランノードが取得されます。この2種類のプランノードを取得すると、Milvusは一連のクラスアクセスを受け付け、プランノードの内部構造を修正して実行します。最後に、Milvusはすべての実行計画ノードを検索し、フィルタリングされた結果を得ます。最終結果はビットマスク形式で出力されます。ビットマスクはビット番号（"0 "と "1"）の配列です。フィルタリング条件を満たすデータはビットマスクに "1 "と表示され、条件を満たさないデータはビットマスクに "0 "と表示される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>実行ワークフロー</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープダイブシリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
