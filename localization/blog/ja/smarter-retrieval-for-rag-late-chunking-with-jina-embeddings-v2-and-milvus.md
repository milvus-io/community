---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: RAGのよりスマートな検索：Jina Embeddings v2とmilvusによる後期チャンキング
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: 効率的で文脈を考慮した文書埋め込みと、より高速でスマートなベクトル検索のために、後期チャンキングとmilvusを使用してRAGの精度を向上させます。
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: true
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>堅牢なRAGシステムの構築は通常、<strong>ドキュメントの</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>チャンキングから</strong></a>始まる<a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>。</strong></a>一般的な戦略は以下の通り：</p>
<ul>
<li><p><strong>固定サイズのチャンク</strong>（例：512トークンごと）</p></li>
<li><p><strong>可変サイズのチャンク</strong>（段落や文の境界など）</p></li>
<li><p><strong>スライディングウィンドウ</strong>（スパンの重複）</p></li>
<li><p><strong>再帰的チャンキング</strong>（階層的分割）</p></li>
<li><p><strong>意味的チャンキング</strong>（トピックによるグループ化）</p></li>
</ul>
<p>これらの方法には利点がある一方で、しばしば長期的な文脈を破壊してしまう。この課題に対処するために、Jina AIは後期チャンキングアプローチを作成します：最初にドキュメント全体を埋め込み、次にチャンクを切り出します。</p>
<p>この記事では、Late Chunkingがどのように機能するかを探り、<a href="https://milvus.io/">Milvus（</a>類似検索用に構築された高性能なオープンソースのベクトルデータベース）と組み合わせることで、RAGパイプラインを劇的に改善できることを実証します。あなたがエンタープライズナレッジベース、AI主導のカスタマーサポート、または高度な検索アプリケーションを構築しているかどうかに関わらず、このウォークスルーでは、エンベッディングをより効果的にスケール管理する方法を紹介します。</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">後期チャンキングとは？<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のチャンキング手法では、重要な情報が複数のチャンクにまたがる場合、重要なつながりを断ち切る可能性があります。</p>
<p>Milvus 2.4.13のリリースノートを2つのチャンクに分けて見てみましょう：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図1.Milvus 2.4.13リリースノートのチャンキング</em></p>
<p>もし、"Milvus 2.4.13の新機能は何ですか？"と問い合わせた場合、標準的な埋め込みモデルでは、"Milvus 2.4.13"（チャンク1）とその機能（チャンク2）を結びつけることができないかもしれません。結果は？ベクトルが弱くなり、検索精度が低下します。</p>
<p>スライディングウィンドウ、オーバーラップコンテキスト、繰り返しスキャンなどのヒューリスティックな修正は、部分的な救済を提供しますが、保証はありません。</p>
<p><strong>伝統的なチャンキングは</strong>、このようなパイプラインに従っている：</p>
<ol>
<li><p>テキストを<strong>事前にチャンクする</strong>（センテンス、パラグラフ、または最大トークン長で）。</p></li>
<li><p>各チャンクを別々に<strong>埋め込む</strong>。</p></li>
<li><p>トークンの埋め込みを（平均プーリングなどで）1つのチャンクベクトルに<strong>集約する</strong>。</p></li>
</ol>
<p><strong>レイトチャンキングは</strong>パイプラインを反転させる：</p>
<ol>
<li><p><strong>最初に埋め込む</strong>：最初に埋め込む：文書全体に対してロングコンテクスト変換を実行し、グローバルコンテクストを捉えたリッチなトークン埋め込みを生成する。</p></li>
<li><p><strong>後でチャンクする</strong>：トークン埋め込みを平均化し、チャンクベクトルを形成します。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図2.ナイーブ・チャンキングとレイト・チャンキングの比較</em><em>（</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>ソース）</em></a></p>
<p>すべてのチャンクに完全なドキュメントのコンテキストを保持することで、Late Chunking は次のような効果をもたらします：</p>
<ul>
<li><p><strong>検索精度の向上-各チャンクは</strong>文脈を意識している。</p></li>
<li><p><strong>より少ないチャンク-より</strong>焦点を絞ったテキストをLLMに送ることができ、コストと待ち時間を削減できます。</p></li>
</ul>
<p>jina-embeddings-v2-base-enのような多くのロングコンテキストモデルは、最大8,192トークンまで処理することができます。</p>
<p>さて、レイト・チャンキングの背景にある「何」と「なぜ」を理解したところで、「どのように」に飛び込んでみよう。次のセクションでは、Late Chunkingパイプラインの実践的な実装、従来のチャンキングに対する性能のベンチマーク、Milvusを使用した実世界への影響の検証をご案内します。この実践的なウォークスルーは、理論と実践の架け橋となり、Late ChunkingをRAGワークフローに統合する方法を正確に示します。</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">レイトチャンキングのテスト<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">基本的な実装</h3><p>以下はレイトチャンキングのコア機能です。各ステップのガイドとして、分かりやすいドキュメントを追加しました。関数<code translate="no">sentence_chunker</code> は、元の文書を段落ベースのチャンクに分割し、チャンクの内容とチャンクの注釈情報<code translate="no">span_annotations</code> （すなわち、各チャンクの開始と終了のインデックス）の両方を返します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p>関数<code translate="no">document_to_token_embeddings</code> は、jinaai/jina-embeddings-v2-base-en モデルとそのトークナイザを使って、文書全体の埋め込みを生成します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p>関数<code translate="no">late_chunking</code> は、文書のトークン埋め込みと元のチャンクの注釈情報<code translate="no">span_annotations</code> を受け取り、最終的なチャンクの埋め込みを生成します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>例えば、jinaai/jina-embeddings-v2-base-enを使ったチャンキング：</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>ヒント：</em>パイプラインを関数でラップすることで、他のロングコンテキストモデルやチャンキング戦略を簡単に入れ替えることができます。</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">従来の埋め込み手法との比較</h3><p>Late Chunkingの優位性をさらに示すために、サンプル文書とクエリを用いて、従来の埋め込み手法とも比較しました。</p>
<p>Milvus 2.4.13のリリースノートの例を見てみましょう：</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>クエリー埋め込み（"milvus 2.4.13"）と各チャンク間の<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">余弦類似度を</a>測定します：</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>レイトチャンキングは一貫して従来のチャンキングを凌駕し、すべてのチャンクでより高いコサイン類似度が得られました。これは、最初に完全な文書を埋め込むことで、より効果的にグローバルな文脈を保持できることを裏付けている。</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>段落全体を最初に埋め込むことで、各チャンクに"<code translate="no">Milvus 2.4.13</code>"コンテキストを確実に伝えることができ、類似度スコアと検索品質が向上することがわかる。</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Milvusでの後期チャンキングのテスト</strong></h3><p>チャンクの埋め込みが生成されたら、Milvusに格納し、クエリーを実行することができる。以下のコードはチャンクベクトルをコレクションに挿入する。</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Milvusに埋め込みをインポートする。</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">クエリと検証</h4><p>Milvusのクエリの精度を検証するために、Milvusの検索結果を手動で計算したコサイン類似度スコアと比較します。両方の方法が一貫したトップkの結果を返す場合、Milvusの検索精度は信頼できると確信できます。</p>
<p>Milvusのネイティブ検索とブルートフォース・コサイン類似度スキャンを比較する：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>これはMilvusが手作業によるcosine-simスキャンと同じtop-kチャンクを返すことを確認する。</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>つまり、どちらの方法でも同じトップ3のチャンクが得られ、Milvusの精度が確認できる。</p>
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
    </button></h2><p>この記事では、レイトチャンキングの仕組みと利点について深く掘り下げてみた。まず、従来のチャンキングアプローチの欠点、特に文脈の保持が重要な長い文書を扱う場合の欠点を明らかにしました。意味のあるチャンクにスライスする前に文書全体を埋め込むというレイト・チャンキングのコンセプトを紹介し、これによりグローバルなコンテキストが保持され、意味的類似性と検索精度が向上することを示しました。</p>
<p>その後、Jina AIのjina-embeddings-v2-base-enモデルを使った実践的な実装を行い、従来の手法と比較したパフォーマンスを評価した。最後に、チャンク埋め込みをMilvusに統合し、スケーラブルで高精度なベクトル検索を実現する方法を紹介した。</p>
<p>レイトチャンキングは、<strong>文脈が</strong>最も重要な長くて複雑な文書に最適な、<strong>文脈優先の</strong>埋め込みアプローチを提供します。テキスト全体を先に埋め込み、後でスライスすることで、次のような利点が得られます：</p>
<ul>
<li><p><strong>検索精度が</strong>向上します。</p></li>
<li><p>⚡<strong>無駄のない焦点化されたLLMプロンプト</strong></p></li>
<li><p>🛠️ あらゆるロングコンテキストモデルとの<strong>簡単な統合</strong></p></li>
</ul>
