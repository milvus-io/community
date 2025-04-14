---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: DeepSearcherの紹介：ローカルオープンソースディープリサーチ
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  OpenAIのDeep
  Researchとは対照的に、この例ではMilvusやLangChainのようなオープンソースのモデルやツールだけを使い、ローカルで実行された。
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>ディープサーチャー</span> </span></p>
<p>前回の記事<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>「私はオープンソースでディープリサーチを構築した-そしてあなたもできる！」では</em></a>、リサーチエージェントの基礎となる原則のいくつかを説明し、与えられたトピックや質問に関する詳細なレポートを生成するシンプルなプロトタイプを構築しました。この記事と対応するノートブックは、<em>ツールの使用</em>、<em>クエリの分解</em>、<em>推論</em>、<em>考察の</em>基本的な概念を示しています。前回の記事の例は、OpenAIのDeep Researchとは対照的に、<a href="https://milvus.io/docs">Milvusや</a>LangChainのようなオープンソースのモデルやツールだけを使い、ローカルで実行された。(続ける前に<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">上記の記事を</a>読むことをお勧めする)。</p>
<p>その後の数週間で、OpenAIのDeep Researchを理解し再現することへの関心が爆発的に高まった。例えば、<a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Researchや</a> <a href="https://huggingface.co/blog/open-deep-research">Hugging FaceのOpen DeepResearchを</a>参照されたい。これらのツールは、ウェブや社内文書をサーフすることによってトピックや質問を反復的に調査し、詳細で、情報に基づいた、よく構造化されたレポートを出力するという目的を共有しているものの、アーキテクチャや方法論が異なっている。重要なのは、基礎となるエージェントが、各中間ステップでどのようなアクションを取るべきかについての推論を自動化することである。</p>
<p>この投稿では、前回の投稿を基に、Zillizの<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>オープンソースプロジェクトを紹介します。私たちのエージェントは、<em>クエリルーティング、条件付き実行フロー</em>、<em>ツールとしてのウェブクローリングといった</em>追加概念を示している。Jupyterノートブックではなく、Pythonライブラリとコマンドラインツールとして提供され、前回の投稿よりも機能が充実している。例えば、複数のソース・ドキュメントを入力することができ、設定ファイルを介して、使用する埋め込みモデルやベクター・データベースを設定することができる。まだ比較的シンプルではあるが、DeepSearcherはエージェント型RAGの素晴らしいショーケースであり、最先端のAIアプリケーションへのさらなる一歩である。</p>
<p>さらに、より高速で効率的な推論サービスの必要性を探る。推論モデルは、その出力を向上させるために「推論スケーリング」、つまり余分な計算を利用し、1つのレポートが数百または数千のLLMコールを必要とする場合があるという事実と組み合わせることで、推論帯域幅が主要なボトルネックとなる。<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">SambaNovaの特注ハードウェア上でDeepSeek-R1推論モデルを</a>使用しており、出力トークン/秒は最も近い競合の2倍高速です（下図参照）。</p>
<p>SambaNova CloudはLlama 3.x、Qwen2.5、QwQなど他のオープンソースモデルの推論サービスも提供している。この推論サービスは、SambaNovaのリコンフィギュラブル・データフロー・ユニット（RDU）と呼ばれるカスタムチップ上で実行され、Generative AIモデルの効率的な推論のために特別に設計されており、コストを削減し、推論速度を向上させる。<a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">詳細はウェブサイトをご覧ください。</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>出力速度- DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">DeepSearcherのアーキテクチャ<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcherの</a>アーキテクチャは、前回の投稿に続き、問題を4つのステップ（<em>質問の定義/絞り込み</em>、<em>調査</em>、<em>分析</em>、<em>合成</em>）に分けています。各ステップを通して、<a href="https://github.com/zilliztech/deep-searcher">DeepSearcherの</a>改善点を強調します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>DeepSearcherのアーキテクチャ</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">質問の定義と絞り込み</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcherの設計では、質問の調査と絞り込みの境界は曖昧である。最初のユーザークエリは、前の投稿と同様に、サブクエリに分解されます。クエリ「How has The Simpsons changed over time?」から生成される最初のサブクエリについては、上記を参照してください。しかし、次のリサーチステップでは、必要に応じて質問を絞り込んでいきます。</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">リサーチと分析</h3><p>クエリをサブクエリに分解した後、エージェントのリサーチ部分が始まります。大まかに言うと、<em>ルーティング</em>、<em>サーチ</em>、<em>リフレクション、条件リピートの</em>4つのステップがあります。</p>
<h4 id="Routing" class="common-anchor-header">ルーティング</h4><p>私たちのデータベースには、異なるソースからの複数のテーブルやコレクションがあります。手元のクエリに関連するソースのみにセマンティック検索を制限できれば、より効率的である。クエリルーターはLLMに、どのコレクションから情報を取得するかを決定させる。</p>
<p>以下はクエリ・ルーティング・プロンプトの作成方法である：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>LLMが構造化された出力をJSONとして返すようにし、その出力を次に何をすべきかの決定に簡単に変換できるようにする。</p>
<h4 id="Search" class="common-anchor-header">検索</h4><p>前のステップで様々なデータベースコレクションを選択した後、検索ステップでは<a href="https://milvus.io/docs">Milvusを使って</a>類似検索を行う。前回の投稿と同様に、ソース・データは事前に指定され、チャンク化され、埋め込まれ、ベクトル・データベースに格納されている。DeepSearcherの場合は、ローカルとオンラインの両方のデータソースを手動で指定する必要がある。オンライン検索は今後の作業に譲る。</p>
<h4 id="Reflection" class="common-anchor-header">リフレクション</h4><p>前の投稿とは異なり、DeepSearcherはエージェントによる真のリフレクションの形を示し、これまでの質問と関連する検索されたチャンクに情報ギャップが含まれているかどうかを「リフレクション」するプロンプトに、事前の出力をコンテキストとして入力します。これは分析ステップと見なすことができる。</p>
<p>これがプロンプトの作成方法である：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>もう一度、LLMが構造化された出力を、今度はPythonで解釈可能なデータとして返すようにします。</p>
<p>上記の最初のサブクエリに答えた後、リフレクションによって新しいサブクエリを「発見」した例を示します：</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">条件付き繰り返し</h4><p>前回の投稿とは異なり、DeepSearcherは条件付きの実行フローを示しています。ここまでの質問と回答が完了したかどうかを振り返った後、追加で質問することがあれば、エージェントは上記のステップを繰り返します。重要なのは、実行フロー（whileループ）がハードコードされているのではなく、LLM出力の関数であることです。この場合、<em>調査を繰り返すか</em> <em>レポートを作成</em>するかの二者択一しかありません。より複雑なエージェントでは、<em>ハイパーリンクをたどる</em>、<em>チャンクを検索する、メモリに保存する、リフレクション</em>するなど、いくつかの選択肢があるかもしれません。このように、エージェントは、ループを抜けてレポートを生成することを決定するまで、適切と思われる質問を改良し続けます。Simpsonsの例では、DeepSearcherは、追加のサブクエリでギャップを埋めるラウンドをさらに2回実行します。</p>
<h3 id="Synthesize" class="common-anchor-header">合成</h3><p>最後に、完全に分解された質問と取得されたチャンクは、1つのプロンプトを含むレポートに合成されます。これがプロンプトを作成するコードです：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>このアプローチは、各質問を個別に分析し、単純に出力を連結した私たちのプロトタイプよりも、すべてのセクションが互いに一貫している、つまり、繰り返されたり、矛盾する情報を含まないレポートを作成するという利点があります。より複雑なシステムは、レポートの構造化、要約、書き換え、反映、ピボットなどの条件実行フローを使用して、両方の側面を組み合わせることができます。</p>
<h2 id="Results" class="common-anchor-header">結果<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>以下は、DeepSeek-R1がソースとしてThe SimpsonsのWikipediaページを渡すことで、"How has The Simpsons changed over time? "というクエリによって生成されたレポートのサンプルです：</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>また、比較のために<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o miniを使用してDeepSearcherが生成したレポートも</a> <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">あります</a>。</p>
<h2 id="Discussion" class="common-anchor-header">ディスカッション<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>我々は<a href="https://github.com/zilliztech/deep-searcher">DeepSearcherを</a>紹介した。<a href="https://github.com/zilliztech/deep-searcher">DeepSearcherは</a>リサーチとレポート作成のエージェントである。我々のシステムは、前回の記事のアイデアを基に構築されており、条件付き実行フロー、クエリルーティング、改良されたインターフェースなどの機能が追加されている。小さな4ビット量子化推論モデルによる局所推論から、巨大なDeepSeek-R1モデルのオンライン推論サービスに切り替え、出力レポートを質的に改善した。DeepSearcherは、OpenAI、Gemini、DeepSeek、Grok 3（近日公開予定！）など、ほとんどの推論サービスで動作します。</p>
<p>推論モデル、特に研究エージェントで使用される推論モデルは、推論を多用します。幸運なことに、SambaNova社のカスタムハードウェア上で動作するDeepSeek-R1の最速版を使用することができました。デモクエリでは、SambaNovaのDeepSeek-R1推論サービスを65回呼び出し、約25kトークンを入力し、22kトークンを出力しました。モデルには6710億のパラメータが含まれ、1テラバイトの3/4のサイズであることを考えると、推論のスピードには感心した。<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">詳細はこちらをご覧ください！</a></p>
<p>私たちは、今後の投稿でこの研究を繰り返し、さらなるエージェントの概念と研究エージェントのデザイン空間を検証していきます。その間、ぜひ<a href="https://github.com/zilliztech/deep-searcher">DeepSearcherを</a>お試しいただき、<a href="https://github.com/zilliztech/deep-searcher">GitHubでスターを付けて</a>、フィードバックをお寄せください！</p>
<h2 id="Resources" class="common-anchor-header">リソース<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>ZillizのDeepSearcher</strong></a></p></li>
<li><p>背景を読む<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>「私はオープンソースでディープリサーチを構築しました。</em></strong></a></p></li>
<li><p><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>"SambaNova、最高効率で最速のDeepSeek-R1 671Bをローンチ</strong></a><em>"</em></p></li>
<li><p>DeepSearcher<a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">シンプソンズのDeepSeek-R1レポート</a></p></li>
<li><p>DeepSearcher<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">The SimpsonsのGPT-4o miniレポート</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvusオープンソース・ベクター・データベース</a></p></li>
</ul>
