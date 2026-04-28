---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: DeepSeek V4 vs GPT-5.5 vs Qwen3.6：どのモデルを使うべきか？
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  DeepSeek V4、GPT-5.5、Qwen3.6を検索、デバッグ、ロングコンテキストのテストで比較し、DeepSeek V4でMilvus
  RAGパイプラインを構築します。
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>新しいモデルのリリースは、プロダクションチームが評価するよりも早く進んでいる。DeepSeek V4、GPT-5.5、Qwen3.6-35B-A3Bは、いずれも書類上では強力に見えますが、AIアプリケーション開発者にとってより難しい問題は実用的なことです。</p>
<p><strong>この記事では、</strong>ライブ情報検索、並行処理バグ・デバッグ、ロング・コンテキスト・マーカー<strong>検索という実用的なテストで3つのモデルを比較する</strong>。また、DeepSeek V4と<a href="https://zilliz.com/learn/what-is-vector-database">Milvusベクトルデータベースを</a>接続し、検索されたコンテキストをモデルのパラメータだけでなく、検索可能な知識ベースから取得する方法を紹介します。</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">DeepSeek V4、GPT-5.5、Qwen3.6-35B-A3Bとは？<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4、GPT-5.5、Qwen3.6-35B-A3Bは、モデル・スタックの異なる部分をターゲットとする異なるAIモデルです。</strong>DeepSeek V4は、オープンウェイトのロングコンテキスト推論に重点を置いています。GPT-5.5は、フロンティア・ホスト・パフォーマンス、コーディング、オンライン・リサーチ、ツールを多用するタスクに重点を置いています。Qwen3.6-35B-A3Bは、アクティブ・パラメータ・フットプリントがはるかに小さく、オープンウェイトのマルチモーダル展開に重点を置いている。</p>
<p><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">本番のベクトル検索</a>システムがモデルだけに依存することはほとんどないため、この比較は重要です。モデルの能力、コンテキストの長さ、デプロイメントの制御、検索品質、およびサービング・コストはすべて、最終的なユーザー・エクスペリエンスに影響します。</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4：ロングコンテキストのコスト管理を実現するオープンウェイトの MoE モデル</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V</strong></a> <strong>4は、DeepSeekが2026年4月24日にリリースしたオープンウェイトのMoEモデルファミリーです。</strong>公式リリースには2つのバリエーションが掲載されています：DeepSeek V4-ProとDeepSeek V4-Flashです。V4-Proは総パラメータ1.6T、トークンあたり49Bをアクティブにし、V4-Flashは総パラメータ284B、トークンあたり13Bをアクティブにする。どちらも1Mトークンのコンテキスト・ウィンドウをサポートしています。</p>
<p>また、<a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Proモデル・カードには</a>、このモデルがMITライセンスであり、Hugging FaceおよびModelScopeを通じて入手可能であることが記載されています。長いコンテキストのドキュメント・ワークフローを構築するチームにとって、完全にクローズドなフロンティアAPIと比較して、主な魅力はコスト管理とデプロイの柔軟性です。</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5：コーディング、研究、ツール使用のためのホストされたフロンティアモデル</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.</strong></a> <strong>5は、OpenAIが2026年4月23日にリリースしたクローズドフロンティアモデルです。</strong>OpenAIでは、コーディング、オンラインリサーチ、データ分析、文書作業、表計算作業、ソフトウェア操作、ツールベースの作業向けと位置づけています。公式モデルのドキュメントでは、<code translate="no">gpt-5.5</code> 、1MトークンのAPIコンテキストウィンドウが記載されていますが、CodexとChatGPTの製品制限は異なる場合があります。</p>
<p>OpenAIは強力なコーディングベンチマークの結果を報告しています：Terminal-Bench 2.0では82.7%、Expert-SWEでは73.1%、SWE-Bench Proでは58.6%です。トレードオフは価格です。公式のAPI価格では、GPT-5.5が1M入力トークンあたり5ドル、1M出力トークンあたり30ドルとなっています。</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B：ローカルおよびマルチモーダルワークロード用の小型アクティブ・パラメータ・モデル</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3</strong></a> <strong>Bは、AlibabaのQwenチームによるオープンウェイトのMoEモデルです。</strong>モデルカードには、35Bの総パラメータ、3Bのアクティブパラメータ、ビジョンエンコーダ、Apache-2.0ライセンスが記載されている。ネイティブの262,144トークンのコンテキスト・ウィンドウをサポートし、YaRNスケーリングで約1,010,000トークンまで拡張できる。</p>
<p>そのため、Qwen3.6-35B-A3Bは、管理されたフロンティア・モデルの利便性よりも、ローカルへの展開、プライベート・サーバー、画像テキスト入力、中国語のワークロードの方が重要な場合に魅力的となる。</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6：モデルスペックの比較</h3><table>
<thead>
<tr><th>モデル</th><th>展開モデル</th><th>公開パラメータ情報</th><th>コンテキストウィンドウ</th><th>最もフィットする</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>オープンウェイトMoE; APIあり</td><td>合計1.6T / アクティブ49B</td><td>100万トークン</td><td>ロング・コンテキスト、コスト重視のエンジニアリング・デプロイメント</td></tr>
<tr><td>GPT-5.5</td><td>ホスト型クローズドモデル</td><td>非公開</td><td>APIに1Mトークン</td><td>コーディング、ライブリサーチ、ツール使用、最高の総合能力</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>オープンウェイトのマルチモーダルMoE</td><td>合計 35B / アクティブ 3B</td><td>ネイティブ26.2万、YaRNで～100万</td><td>ローカル/プライベート展開、マルチモーダル入力、中国語シナリオ</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">DeepSeek V4、GPT-5.5、Qwen3.6のテスト方法<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>これらのテストは、完全なベンチマーク・スイートに代わるものではありません。これらのテストは、モデルが現在の情報を取得できるか、微妙なコードのバグを推論できるか、非常に長いド キュメント内の事実を特定できるかといった、開発者の一般的な疑問を反映した実用的なチェックです。</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">どのモデルがリアルタイム情報検索に最も適しているか？</h3><p>各モデルに、利用可能な場合はウェブ検索を使用して、3つの時間的制約のある質問をしました。指示は単純で、答えのみを返し、ソースURLを含めるというものであった。</p>
<table>
<thead>
<tr><th>質問</th><th>テスト時に期待される答え</th><th>ソース</th></tr>
</thead>
<tbody>
<tr><td>1024×1024の中画質の画像をOpenAIのAPIを使って<code translate="no">gpt-image-2</code> 、生成するのにいくらかかりますか？</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">OpenAIの画像生成の価格</a></td></tr>
<tr><td>今週のビルボードホット100で1位の曲とアーティストは？</td><td><code translate="no">Choosin' Texas</code> エラ・ラングレー著</td><td><a href="https://www.billboard.com/charts/hot-100/">ビルボードホット100チャート</a></td></tr>
<tr><td>2026年F1ドライバーランキングで現在首位に立っているのは？</td><td>キミ・アントネッリ</td><td><a href="https://www.formula1.com/en/results/2026/drivers">F1ドライバーランキング</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>注：これらは一刻を争う質問です。予想される回答は、テストを実施した時点での結果を反映しています。</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>OpenAIの画像価格設定ページでは、以下のラベルに「標準」ではなく「中」が使用されています。 <br>

  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg" alt="blog cover narrow 1152x720" class="doc-image" id="blog-cover-narrow-1152x720" />
   </span> <span class="img-wrapper"> <span>ブログの表紙が狭い 1152x720</span>$0 </span>.053 1024×1024 の結果では、「標準」ではなく「中」のラベルを使用しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">リアルタイム検索結果：GPT-5.5が最も有利だった</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro は、最初の質問に不正解でした。このセットアップでは、ライブ・ウェブ検索で 2 番目と 3 番目の質問に回答できませんでした。</p>
<p>2番目の回答には正しいビルボードのURLが含まれていましたが、現在のNo.1の曲は検索できませんでした。3番目の答えは間違ったソースを使用したため、不正解としてカウントした。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5は、このテストをはるかにうまく処理した。その回答は短く、正確で、ソースがあり、速かった。タスクが現在の情報に依存し、モデルがライブ検索を利用できる場合、GPT-5.5はこのセットアップで明確な優位性を持っていました。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B では、DeepSeek V4-Pro と同様の結果が得られました。このセットアップでは、ライブ Web アクセスがないため、リアルタイムの検索タスクを完了できませんでした。</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">同時実行バグのデバッグではどのモデルが優れているか?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>2つ目のテストでは、3層の並行性問題を持つPythonの銀行送金の例を使用した。課題は、明らかな競合状態を見つけるだけでなく、なぜ合計残高が壊れるのかを説明し、修正コードを提供することだった。</p>
<table>
<thead>
<tr><th>レイヤー</th><th>問題点</th><th>何が問題か</th></tr>
</thead>
<tbody>
<tr><td>基本</td><td>レース条件</td><td><code translate="no">if self.balance &gt;= amount</code> <code translate="no">self.balance -= amount</code> はアトミックではない。2つのスレッドが同時にバランスチェックを通過し、両方がお金を引くことができる。</td></tr>
<tr><td>ミディアム</td><td>デッドロックのリスク</td><td>素朴なアカウントごとのロックは、転送A→BがAを先にロックし、転送B→AがBを先にロックするとデッドロックになる可能性がある。これは古典的なABBAデッドロックです。</td></tr>
<tr><td>上級</td><td>誤ったロック・スコープ</td><td><code translate="no">self.balance</code> のみを保護しても、<code translate="no">target.balance</code> は保護されない。正しい修正は、安定した順序で、通常はアカウントIDで、両方のアカウントをロックするか、より低い同時実行性でグローバル・ロックを使用しなければならない。</td></tr>
</tbody>
</table>
<p>プロンプトとコードは以下の通り：</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">コードのデバッグ結果：GPT-5.5 が最も完全な答えを返しました。</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro は簡潔な分析を行い、ABBA デッドロックを回避する標準的な方法である順序付きロックの解決策にまっすぐ進みました。その解答は正しい修正を示していましたが、なぜ素朴なロックベースの修正が新たな故障モードを導入する可能性があるのかの説明には多くの時間を割きませんでした。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5はこのテストで最も良い結果を出した。核心的な問題を発見し、デッドロックのリスクを予測し、元のコードがなぜ失敗するのかを説明し、完全に修正された実装を提供した。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3Bはバグを正確に特定し、実行シーケンスの例も明確だった。弱点はその修正で、グローバルなクラスレベルのロックを選択し、すべてのアカウントが同じロックを共有するようにした。これは小規模なシミュレーションには有効ですが、実際の銀行システムには不適切なトレードオフです。</p>
<p><strong>要するに、</strong>GPT-5.5は現在のバグを解決しただけでなく、開発者が次に導入するかもしれないバグについても警告しているのです。DeepSeek V4-Proは、GPT以外のバグを最もきれいに修正しました。Qwen3.6は問題を発見し、動作するコードを作成しましたが、スケーラビリティの妥協点を指摘しませんでした。</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">どのモデルがロング・コンテキスト検索を最もうまく処理できるか？<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>ロングコンテキストのテストでは、『<em>紅楼夢</em>』の全文（約85万字）を使用した。50万文字の位置の周辺に隠しマーカーを挿入した：</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>その後、各モデルにファイルをアップロードし、マーカーの内容とその位置の両方を見つけるよう依頼した。</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">ロングコンテキストの検索結果：GPT-5.5が最も正確にマーカーを発見</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Proは隠れたマーカーを見つけましたが、正しい文字位置を見つけられませんでした。また、周囲の文脈も間違っていました。このテストでは、意味的にマーカーを見つけることはできても、文書を推論している間に正確な位置を見失ったようです。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5はマーカーの内容、位置、周囲の文脈を正しく見つけた。位置は500,002と報告され、ゼロ・インデックスとワン・インデックス・カウントの区別までついた。周囲の文脈もマーカー挿入時に使用されたテキストと一致した。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3Bはマーカーの内容と周辺の文脈を正しく検出したが、位置の推定が間違っていた。</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">これらのテストはモデル選択について何を語っているか？<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>3つのテストは実用的な選択パターンを示している：<strong>GPT-5.5はケイパビリティ重視の選択、DeepSeek V4-Proはロングコンテキストのコスト・パフォーマンス重視の選択、Qwen3.6-35B-A3Bはローカル・コントロール重視の選択である。</strong></p>
<table>
<thead>
<tr><th>モデル</th><th>ベストフィット</th><th>テストでの結果</th><th>主な注意点</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>最高の総合能力</td><td>ライブ検索、並行性デバッグ、ロング・コンテキスト・マーカー・テストに勝利</td><td>コストが高いが、精度とツールの使用が割高を正当化する場合は最強</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>ロングコンテキスト、低コストでの導入</td><td>並行性バグをGPT以外で最も強力に修正し、マーカーコンテンツを発見。</td><td>このテストでは、正確な文字位置の追跡は弱かった。</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>ローカル展開、オープンウェイト、マルチモーダル入力、中国語ワークロード</td><td>バグの特定とロングコンテキストの理解において良好な結果。</td><td>このセットアップではライブウェブアクセスが利用できなかった。</td></tr>
</tbody>
</table>
<p>GPT-5.5は、最強の結果が必要な場合に使用し、コストは二の次とする。長いコンテキストが必要で、処理コストが低く、API フレンドリーなデプロイメントが必要な場合は、DeepSeek V4-Pro を使用します。オープン・ウェイト、プライベート・デプロイメント、マルチモーダル対応、サービングスタック制御が最も重要な場合は、Qwen3.6-35B-A3Bを使用する。</p>
<p>しかし、検索を多用するアプリケーションの場合、モデルの選択は物語の半分に過ぎません。強力なロングコンテキストモデルであっても、専用の<a href="https://zilliz.com/learn/generative-ai">セマンティック検索システムによって</a>コンテキストが検索され、フィルタリングされ、グラウンディングされれば、より良いパフォーマンスを発揮する。</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">ロングコンテキストモデルにRAGが重要な理由<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>ロングコンテキストウィンドウは検索の必要性をなくすものではない。検索戦略を変えるのである。</p>
<p>RAGアプリケーションでは、モデルはリクエスト毎に全ての文書をスキャンすべきではない。<a href="https://zilliz.com/learn/introduction-to-unstructured-data">ベクトルデータベースアーキテクチャは</a>、埋め込みを格納し、意味的に関連するチャンクを検索し、メタデータフィルタを適用し、コンパクトなコンテキストセットをモデルに返す。これにより、コストとレイテンシを削減しながら、より良いインプットをモデルに与えることができる。</p>
<p>Milvusは、<a href="https://milvus.io/docs/schema.md">コレクションスキーマ</a>、ベクトルインデックス、スカラメタデータ、検索操作を1つのシステムで処理するため、この役割に適している。<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteで</a>ローカルに開始し、スタンドアロンの<a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタートに</a>移行し、<a href="https://milvus.io/docs/install_standalone-docker.md">Dockerインストール</a>または<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Composeデプロイで</a>展開し、ワークロードが大きくなったら<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetesデプロイで</a>さらにスケールすることができます。</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">MilvusとDeepSeek V4によるRAGパイプラインの構築方法<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>以下のウォークスルーでは、生成にDeepSeek V4-Pro、検索にMilvusを使用して小規模なRAGパイプラインを構築します。埋め込みを作成し、それらをコレクションに格納し、関連するコンテキストを検索し、そのコンテキストをモデルに渡します。</p>
<p>より詳細なチュートリアルについては、<a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAGの</a>公式<a href="https://milvus.io/docs/build-rag-with-milvus.md">チュートリアルを</a>参照してください。この例ではパイプラインを小さくしているので、検索フローを簡単に調べることができる。</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">環境の準備<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">依存関係のインストール</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Google Colabを使用している場合、依存関係をインストールした後にランタイムを再起動する必要があるかもしれません。<strong>Runtime]</strong>メニューをクリックし、[<strong>Restart session</strong>] を選択します。</p>
<p>DeepSeek V4-Pro は OpenAI 形式の API をサポートしています。DeepSeek の公式 Web サイトにログインし、環境変数に<code translate="no">DEEPSEEK_API_KEY</code> を設定します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Milvus ドキュメントデータセットの準備</h3><p><a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.xドキュメントアーカイブの</a>FAQページをプライベート知識ソースとして使用します。これは小さなRAGデモのための簡単なスターターデータセットです。</p>
<p>まず、ZIPファイルをダウンロードし、ドキュメントを<code translate="no">milvus_docs</code> フォルダに解凍します。</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus_docs/en/faq</code> フォルダからすべてのMarkdownファイルを読み込みます。各ドキュメントについて、<code translate="no">#</code> によってファイル・コンテンツを分割します。これは、主要な Markdown セクションを大まかに分割するためです。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">DeepSeek V4 と埋め込みモデルのセットアップ</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>次に、埋め込みモデルを選択します。この例では、PyMilvus モデルモジュールの<code translate="no">DefaultEmbeddingFunction</code> を使用します。<a href="https://milvus.io/docs/embeddings.md">埋め込み関数の</a>詳細については、Milvusのドキュメントを参照してください。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>テストベクトルを生成し、ベクトルの次元と最初のいくつかの要素を表示します。返された次元はMilvusコレクションを作成するときに使用されます。</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Milvusにデータをロードする。<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Milvusコレクションの作成</h3><p>Milvusコレクションは、ベクトルフィールド、スカラフィールド、オプションのダイナミックメタデータを格納します。以下のクイックセットアップでは、高レベルの<code translate="no">MilvusClient</code> APIを使用しています。プロダクションスキーマについては、<a href="https://milvus.io/docs/manage-collections.md">コレクション</a>管理と<a href="https://milvus.io/docs/create-collection.md">コレクションの作成に関する</a>ドキュメントを参照してください。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">MilvusClient</code> についての注意事項：</p>
<ul>
<li><code translate="no">./milvus.db</code> のようなローカルファイルに<code translate="no">uri</code> を設定することは、自動的に<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteを</a>使用し、すべてのデータをそのファイルに保存するため、最も簡単なオプションです。</li>
<li>大きなデータセットがある場合、<a href="https://milvus.io/docs/quickstart.md">DockerやKubernetes</a>上でより高性能なMilvusサーバーをセットアップすることができます。その場合、<code translate="no">http://localhost:19530</code> のようなサーバURIを<code translate="no">uri</code> 。</li>
<li>Milvusのフルマネージドクラウドサービスである<a href="https://docs.zilliz.com/">Zilliz Cloudを</a>利用する場合は、<code translate="no">uri</code> と<code translate="no">token</code> をZilliz Cloudの<a href="https://docs.zilliz.com/docs/connect-to-cluster">パブリックエンドポイントとAPIキーに</a>設定してください。</li>
</ul>
<p>コレクションが既に存在するか確認してください。存在する場合は削除する。</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>指定したパラメータで新しいコレクションを作成する。フィールド情報を指定しない場合、Milvusは自動的にデフォルトの<code translate="no">id</code> フィールドをプライマリキーとして作成し、ベクトルデータを格納するためのベクトルフィールドを作成します。予約JSONフィールドはスキーマで定義されていないスカラーデータを格納する。</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">IP</code> メトリックは内積類似度を意味します。<a href="https://milvus.io/docs/id/metric.md">milvusは</a>ベクトルタイプとワークロードに応じて他のメトリックタイプとインデックスの選択もサポートしています。<code translate="no">Strong</code> の設定は利用可能な<a href="https://milvus.io/docs/consistency.md">一貫性レベルの</a>一つである。</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">埋め込みドキュメントの挿入</h3><p>テキストデータを繰り返し、埋め込みを作成し、milvusにデータを挿入します。ここでは、<code translate="no">text</code> という新しいフィールドを追加します。これはコレクションスキーマで明示的に定義されていないため、予約されたダイナミックJSONフィールドに自動的に追加されます。プロダクション・メタデータについては、<a href="https://milvus.io/docs/enable-dynamic-field.md">ダイナミック・フィールドのサポートと</a> <a href="https://milvus.io/docs/json-field-overview.md">JSONフィールドの概要を</a>参照してください。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>大規模なデータセットの場合、明示的なスキーマ設計、<a href="https://milvus.io/docs/index-vector-fields.md">ベクトルフィールドインデックス</a>、スカラーインデックス、および<a href="https://milvus.io/docs/insert-update-delete.md">挿入、upsert、削除などの</a>データライフサイクル操作によって、同じパターンを拡張できる。</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">RAG検索フローの構築<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Milvusで関連するコンテキストを検索する</h3><p>Milvusに関する一般的な質問を定義してみましょう。</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>その質問についてコレクションを検索し、上位3つのセマンティックマッチを取得します。これは基本的な<a href="https://milvus.io/docs/single-vector-search.md">単一ベクトル検索</a>です。本番では、<a href="https://milvus.io/docs/filtered-search.md">フィルタリング検索</a>、<a href="https://milvus.io/docs/full-text-search.md">フルテキスト検索</a>、<a href="https://milvus.io/docs/multi-vector-search.md">マルチベクターハイブリッド検索</a>、関連性を向上させる<a href="https://milvus.io/docs/reranking.md">リランキング</a>戦略と組み合わせることができます。</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>それでは、クエリの検索結果を見てみましょう。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">DeepSeek V4 による RAG アンサーの生成</h3><p>検索されたドキュメントを文字列形式に変換します。</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>LLM のシステム・プロンプトとユーザ・プロンプトを定義します。このプロンプトは、Milvus から取得したドキュメントから作成されます。</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSeek V4-Pro が提供するモデルを使用して、プロンプトに基づく応答を生成します。</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>この時点で、パイプラインは、ドキュメントの埋め込み、Milvusへのベクトルの格納、関連するコンテキストの検索、DeepSeek V4-Proによる回答の生成という、中核となるRAGループを完了しています。</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">本番前に改善すべき点は？<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>デモでは、単純なセクション分割とtop-k検索を使用しています。仕組みを示すには十分ですが、本番のRAGでは通常、より多くの検索制御が必要です。</p>
<table>
<thead>
<tr><th>本番で必要なこと</th><th>検討すべきmilvusの機能</th><th>なぜ役立つのか</th></tr>
</thead>
<tbody>
<tr><td>セマンティックシグナルとキーワードシグナルの混合</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Milvusによるハイブリッド検索</a></td><td>密なベクトル検索とスパースまたはフルテキストシグナルを組み合わせる</td></tr>
<tr><td>複数の検索結果のマージ</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvusハイブリッド検索リトリーバ</a></td><td>LangChainワークフローで重み付けまたはRRFスタイルのランキングを使用可能</td></tr>
<tr><td>テナント、タイムスタンプ、ドキュメントタイプによる結果の制限</td><td>メタデータとスカラーフィルタ</td><td>検索範囲を適切なデータスライスに維持</td></tr>
<tr><td>Milvusからマネージドサービスへの移行</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">MilvusからZillizへの移行</a></td><td>Milvusとの互換性を保ちながらインフラ作業を削減</td></tr>
<tr><td>ホストされたアプリケーションを安全に接続</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">ZillizクラウドAPIキー</a></td><td>アプリケーションクライアントにトークンベースのアクセス制御を提供</td></tr>
</tbody>
</table>
<p>最も重要な生産習慣は、生成とは別に検索を評価することである。検索されたコンテキストが弱い場合、LLMを交換しても問題は解決されず、隠蔽されることが多い。</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">MilvusとDeepSeek RAGを使い始める<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>チュートリアルを再現したい場合は、<a href="https://milvus.io/docs">Milvusの</a>公式<a href="https://milvus.io/docs">ドキュメントと</a> <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvusを使用したRAGの構築ガイドから始めて</a>ください。マネージドセットアップの場合は、Milvusをローカルで実行する代わりに、クラスタのエンドポイントとAPIキーを使用して<a href="https://docs.zilliz.com/docs/connect-to-cluster">Zilliz Cloudに接続</a>します。</p>
<p>チャンキング、インデックス作成、フィルタリング、ハイブリッド検索などのチューニングに関するヘルプが必要な場合は、<a href="https://slack.milvus.io/">Milvus Slackコミュニティに</a>参加するか、無料の<a href="https://milvus.io/office-hours">Milvus Office Hoursセッションを</a>ご予約ください。インフラストラクチャのセットアップを省略したい場合は、<a href="https://cloud.zilliz.com/login">Zilliz Cloudログインを</a>使用するか、<a href="https://cloud.zilliz.com/signup">Zilliz Cloudアカウントを</a>作成してマネージドMilvusを実行してください。</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">DeepSeek V4、Milvus、RAGについて開発者から寄せられる質問<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4はRAGに適していますか？</h3><p>DeepSeek V4-Proは、長いコンテキスト処理とプレミアムクローズドモデルよりも低い配信コストが必要な場合に、RAGに強く適合します。それでも、関連するチャンクを選択し、メタデータフィルタを適用し、プロンプトを集中させるために、Milvusのような検索レイヤが必要です。</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">RAGパイプラインには、GPT-5.5とDeepSeek V4のどちらを使用すべきですか?</h3><p>回答品質、ツールの使用、ライブリサーチがコストよりも重要な場合は、GPT-5.5を使用してください。ロング・コンテキスト処理とコスト管理がより重要な場合は、DeepSeek V4-Pro を使用してください。特に、検索レイヤがすでに高品質のグラウンデッド・コンテキストを提供している場合は、DeepSeek V4-Pro を使用してください。</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Qwen3.6-35B-A3B をプライベート RAG 用にローカルで実行できますか?</h3><p>はい、Qwen3.6-35B-A3Bはオープンウェイトで、よりコントロールしやすいように設計されています。Qwen3.6-35B-A3Bは、プライバシー、ローカル配信、マルチモーダル入力、中国語パフォーマンスが重要な場合に適しています。</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">ロング・コンテキスト・モデルはベクター・データベースを不要にするのか？</h3><p>ロング・コンテキスト・モデルはより多くのテキストを読み取ることができますが、それでも検索から利益を得ることができます。ベクトル・データベースは、入力を関連するチャンクに絞り込み、メタデータのフィルタリングをサポートし、トークン・コストを削減し、ドキュメントの変更に伴うアプリケーションの更新を容易にします。</p>
