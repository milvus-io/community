---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: 私はオープンソースで深い研究を構築した！
author: Stefan Webb
date: 2025-02-6
desc: >-
  Milvus、DeepSeek
  R1、LangChainなどのオープンソースツールを使用して、ディープリサーチスタイルのエージェントを作成する方法を学びます。
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>まあ実際には、ウィキペディアを使って調査を行うための推論、計画、ツールの使用などができる、最小限のスコープを持つエージェントだ。それでも、数時間の仕事としては悪くない。</p>
<p>岩の下や洞窟の中、あるいは人里離れた山の修道院に住んでいるのでなければ、2025年2月2日にOpenAIがリリースした<em>Deep Researchについて</em>耳にしたことがあるだろう。この新製品は、大量の多様な情報の統合を必要とする質問に答える方法に革命を起こすことを約束する。</p>
<p>クエリを入力し、Deep Researchオプションを選択すると、プラットフォームが自律的にウェブを検索し、発見したものに対して推論を実行し、複数のソースを首尾一貫した、完全に引用されたレポートに合成する。標準的なチャットボットと比較すると、アウトプットを作成するのに数桁の時間がかかりますが、結果はより詳細で、より多くの情報を提供し、よりニュアンスのあるものになります。</p>
<h2 id="How-does-it-work" class="common-anchor-header">どのように機能するのか？<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>しかし、この技術がどのように機能するのか、そしてなぜDeep Researchが以前の試み（Googleの<em>Deep Research</em>- 商標紛争の着信アラートなど）よりも顕著に改善されているのか？後者については今後の記事に譲る。前者については、ディープリサーチの根底には間違いなく多くの「秘密のソース」が存在する。OpenAIのリリース記事から、いくつかの詳細を読み取ることができる。</p>
<p><strong>Deep Researchは、推論タスクに特化した基礎モデルの最近の進歩を利用している：</strong></p>
<ul>
<li><p>"...次期OpenAI o3推論モデルで微調整..."</p></li>
<li><p>"...大量のテキストを検索、解釈、分析するために推論を活用する..."</p></li>
</ul>
<p><strong>ディープリサーチは、プランニング、リフレクション、メモリーを備えた洗練されたエージェントのワークフローを利用する：</strong></p>
<ul>
<li><p>"...多段階の軌跡を計画し実行することを学んだ..."</p></li>
<li><p>"...バックトラックとリアルタイムの情報への反応..."</p></li>
<li><p>"...遭遇した情報に反応して必要に応じてピボットを行う..."</p></li>
</ul>
<p><strong>ディープリサーチは、独自のデータで訓練され、数種類の微調整を使用している：</strong></p>
<ul>
<li><p>"...様々なドメインにわたるハードなブラウジングと推論タスクで、エンドツーエンドの強化学習を使って訓練されている..."</p></li>
<li><p>"...ウェブブラウジングとデータ分析に最適化された..."</p></li>
</ul>
<p>エージェントのワークフローの正確な設計は秘密だが、エージェントの構造化に関する確立されたアイデアに基づいて、自分たちで何かを構築することはできる。</p>
<p><strong>始める前に一つ注意点が</strong>ある：ジェネレーティブAIの熱に浮かされるのは簡単だ。しかし、OpenAIが認めているように、ディープリサーチにはジェネレーティブAI技術に共通する限界がある。誤った事実（「幻覚」）が含まれていたり、誤ったフォーマットや引用があったり、ランダムなシードによって品質が大きく異なったりする可能性があるという点で、出力について批判的に考えることを忘れてはならない。</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">自分でも作れますか？<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>もちろんだ！ローカルで、オープンソースのツールを使って、独自の「ディープ・リサーチ」を構築してみよう。私たちは、生成AIの基本的な知識、常識、数時間の空き時間、GPU、オープンソースの<a href="https://milvus.io/docs">milvus</a>、<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>、<a href="https://python.langchain.com/docs/introduction/">LangChainだけで</a>武装する。</p>
<p>もちろん、OpenAIのパフォーマンスを再現することは望めないが、我々のプロトタイプは、推論モデルの進歩とエージェントワークフローの進歩を組み合わせることで、彼らの技術の根底にあると思われる重要なアイデアのいくつかを最小限に示すことができるだろう。重要なことは、OpenAIとは異なり、オープンソースのツールだけを使用し、ローカルにシステムを展開できることです！</p>
<p>私たちのプロジェクトの範囲を縮小するために、いくつかの単純化した仮定を行う：</p>
<ul>
<li><p>オープンソースの推論モードを蒸留し、ローカルで実行できる4ビット用に<a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">量子化した</a>ものを使用する。</p></li>
<li><p>推論モデルの微調整は行わない。</p></li>
<li><p>我々のエージェントが持っている唯一のツールは、ウィキペディアのページをダウンロードして読み、個別のRAGクエリを実行する能力である（我々はウェブ全体にアクセスすることはできない）。</p></li>
<li><p>我々のエージェントはテキストデータのみを処理し、画像やPDFなどは処理しない。</p></li>
<li><p>当エージェントは、バックトラックやピボットを考慮しません。</p></li>
<li><p>私たちのエージェントは、（まだ）出力に基づいて実行フローを制御します。</p></li>
<li><p>ウィキペディアは、真実、全真実、そして真実以外を含んでいません。</p></li>
</ul>
<p><a href="https://milvus.io/docs">Milvusを</a>ベクトルデータベースに、<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R</a>1を推論モデルに、<a href="https://python.langchain.com/docs/introduction/">LangChainを</a>RAGの実装に使用します。それでは始めよう！</p>
<custom-h1>オンラインリサーチのための最小限のエージェント</custom-h1><p>人間がどのように研究を行うかというメンタルモデルを使用して、エージェントのワークフローを設計します：</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">質問の定義/絞り込み</h3><p>リサーチは、質問を定義することから始まります。質問をユーザーのクエリと見なしますが、推論モデルを使用して、質問が具体的で、明確で、焦点を絞った方法で表現されていることを確認します。つまり、最初のステップはプロンプトを書き直し、サブクエリやサブクエスチョンを抽出することです。私たちは、推論に特化した基礎モデルと、JSON構造化出力のためのシンプルなメソッドを効果的に利用します。</p>
<p>以下は、DeepSeekが「キャストは時間の経過とともにどのように変化したか」という質問を絞り込む際の推論トレースの例です：</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">検索</h3><p>次に、Wikipedia の記事の「文献レビュー」を行います。今のところ、1 つの記事を読み、リンクのナビゲートは将来の反復に任せます。各リンクが推論モデルへの呼び出しを必要とする場合、リンク探索が非常に高価になることが、プロトタイピング中に発見されました。私たちは記事を解析し、そのデータをMilvusというベクターデータベースに保存する。</p>
<p>以下はMilvusのLangChainとの統合により、Wikipediaのページをどのように保存しているかを示すコードスニペットです：</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">分析</h3><p>エージェントは質問に戻り、ドキュメントの関連情報に基づいて回答します。私たちは、ソースの信頼性と偏りに関する批判的思考と同様に、将来の作業のために多段階の分析/考察ワークフローを残しておきます。</p>
<p>以下は、LangChainでRAGを構築し、サブクエスチョンに個別に回答するコードです。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">合成</h3><p>エージェントが調査を行った後、報告書にまとめるために、調査結果の構造化されたアウトラインというかスケルトンを作成します。そして、各セクションを完成させ、セクションタイトルと対応する内容を記入する。反省、並べ替え、書き直しを含む、より洗練されたワークフローは、将来の反復のために残しておく。エージェントのこの部分には、計画、ツールの使用、メモリが含まれる。</p>
<p>完全なコードと<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">保存されたレポートファイルの</a>出力例については、<a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">付属のノートブックを</a>参照してください。</p>
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
    </button></h2><p>テスト用のクエリは<em>"How has The Simpsons changed over time? "</em>で、データソースは "The Simpsons "のウィキペディア記事です。以下は<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">生成された</a>レポートの一部です：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">要約：構築したものと次の課題<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>わずか数時間で、構造化された研究レポートを生成するために、推論し、計画し、ウィキペディアから情報を取得できる基本的なエージェントのワークフローを設計した。このプロトタイプはOpenAIのDeep Researchには程遠いものの、自律的な研究エージェントを構築する上でmilvus、DeepSeek、LangChainのようなオープンソースツールの力を実証している。</p>
<p>もちろん、改善の余地はたくさんある。将来的には次のようなことが可能になるだろう：</p>
<ul>
<li><p>ウィキペディアだけでなく、複数のソースを動的に検索できるように拡張する。</p></li>
<li><p>バックトラックとリフレクションを導入し、応答を洗練させる。</p></li>
<li><p>エージェント自身の推論に基づいて実行フローを最適化する。</p></li>
</ul>
<p>オープンソースは、クローズドソースにはない柔軟性とコントロールを与えてくれる。学術研究であれ、コンテンツ合成であれ、AIによる支援であれ、独自の研究エージェントを構築することは、エキサイティングな可能性を開く。次回は、リアルタイムのウェブ検索、マルチステップの推論、条件付きの実行フローを追加する方法を紹介します！</p>
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
<li><p>ノートブック<em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>オープンソースのディープリサーチのベースライン</em></a><em>"</em></p></li>
<li><p>レポート<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>"コンテンツ、ユーモア、キャラクター開発、アニメーション、社会における役割の変化を網羅した、番組としてのシンプソンズの経年変化</em></a><em>"</em></p></li>
<li><p><a href="https://milvus.io/docs">Milvusベクトルデータベースのドキュメント</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">ディスティル化・量子化されたDeepSeek R1モデルのページ</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">ディープリサーチFAQ｜OpenAIヘルプセンター</a></p></li>
</ul>
