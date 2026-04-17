---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: PDFから回答へ：PaddleOCR、Milvus、ERNIEによるRAG知識ベースの構築
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Milvus、ハイブリッド検索、リランキング、ドキュメントインテリジェンスのためのマルチモーダルQ&amp;Aを使用して、高精度のRAG知識ベースを構築する方法を学びます。
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>大規模な言語モデルは、2023年当時よりもはるかに高性能になっているが、まだ自信満々で幻覚を見たり、古い情報に逆戻りしたりすることが多い。RAG（Retrieval-Augmented Generation）は、モデルが応答を生成する前に、<a href="https://milvus.io/">Milvusの</a>ようなベクトルデータベースから関連するコンテキストを取得することで、両方の問題に対処する。この余分なコンテキストは、実際の情報源に根拠を置き、回答をより最新のものにする。</p>
<p>最も一般的なRAGのユースケースの一つは、会社のナレッジベースです。ユーザーはPDF、Wordファイル、または他の社内文書をアップロードし、自然言語で質問し、モデルの事前学習のみではなく、それらの資料に基づいた回答を受け取ります。</p>
<p>しかし、同じLLMと同じベクトルデータベースを使っても、同じ結果が保証されるわけではない。2つのチームが同じ基盤の上に構築しても、システムの品質は大きく異なる。その違いは通常、<strong>ドキュメントの解析、チャンク化、埋め込み方法、データのインデックス作成方法、検索結果のランク付け方法、最終的な回答の組み立て方など</strong>、上流にあるものすべてに起因する。</p>
<p>この記事では<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAGを</a>例に、<a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>、<a href="https://milvus.io/">Milvus</a>、ERNIE-4.5-Turboを使ってRAGベースの知識ベースを構築する方法を説明する。</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Paddle-ERNIE-RAGシステムアーキテクチャ<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Paddle-ERNIE-RAGアーキテクチャは4つのコアレイヤーから構成される：</p>
<ul>
<li><strong>データ抽出層。</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCRの</a>文書解析パイプラインである<a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3は</a>、レイアウトを意識したOCRでPDFや画像を読み取ります。文書の構造（見出し、表、読み順）を保持し、オーバーラップするチャンクに分割されたクリーンなMarkdownを出力します。</li>
<li><strong>ベクターストレージレイヤー。</strong>各チャンクは384次元ベクトルに埋め込まれ、メタデータ（ファイル名、ページ番号、チャンクID）とともに<a href="https://milvus.io"></a><a href="https://milvus.io">Milvusに</a>保存されます。並列転置インデックスがキーワード検索をサポート。</li>
<li><strong>検索と回答レイヤー。</strong>各クエリはベクトルインデックスとキーワードインデックスの両方に対して実行される。結果はRRF（Reciprocal Rank Fusion）によりマージされ、再ランク付けされた後、回答生成のために<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a>モデルに渡される。</li>
<li><strong>アプリケーション層。</strong> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/">Gradio</a>インターフェースにより、文書のアップロード、質問、出典の引用と信頼度スコア付きの回答の閲覧が可能。  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>以下のセクションでは、生文書が検索可能なテキストになる方法から順に、各ステージについて説明する。</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">RAGパイプラインのステップ・バイ・ステップの構築方法<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">ステップ1：PP-StructureV3によるドキュメントの解析</h3><p>生文書は、ほとんどの精度の問題が始まる場所である。研究論文や技術報告書には、2段組のレイアウト、数式、表、画像が混在しています。PyPDF2のような基本的なライブラリでテキストを抽出すると、通常、出力は文字化けします：段落は順番通りに表示されず、表は崩れ、数式は消えてしまいます。</p>
<p>これらの問題を避けるために、このプロジェクトではbackend.pyにOnlinePDFParserクラスを作成します。このクラスはレイアウト解析を行うためにPP-StructureV3オンラインAPIを呼び出します。生のテキストを抽出する代わりに、ドキュメントの構造を特定し、それをMarkdownフォーマットに変換します。</p>
<p>この方法には3つの明確な利点があります：</p>
<ul>
<li><strong>クリーンなMarkdown出力</strong></li>
</ul>
<p>出力は、適切な見出しと段落を持つMarkdownとしてフォーマットされます。これにより、モデルにとってコンテンツが理解しやすくなります。</p>
<ul>
<li><strong>個別の画像抽出</strong></li>
</ul>
<p>解析中に画像を抽出して保存します。これにより、重要な視覚情報が失われるのを防ぎます。</p>
<ul>
<li><strong>より優れた文脈処理</strong></li>
</ul>
<p>オーバーラップするスライディングウィンドウを使用してテキストを分割します。これにより、文章や数式が途中で切れることがなくなり、意味が明確に保たれ、検索精度が向上します。</p>
<p><strong>基本的な解析の流れ</strong></p>
<p>backend.pyでは、3つのシンプルなステップで構文解析を行います：</p>
<ol>
<li>PDFファイルをPP-StructureV3 APIに送る。</li>
<li>返されたlayoutParsingResultsを読む。</li>
<li>クリーンアップされたMarkdownテキストと画像を抽出する。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">ステップ2：スライディングウィンドウのオーバーラップでテキストをチャンクする</h3><p>パース後、Markdownテキストは検索のために小さな断片（チャンク）に分割されなければなりません。テキストが固定された長さでカットされる場合、文章や数式が半分に分割される可能性があります。</p>
<p>これを防ぐために、システムはオーバーラップ付きのスライディングウィンドウ・チャンキングを使用します。各チャンクは次のチャンクと末尾部分を共有するため、境界のコンテンツは両方のウィンドウに表示される。これにより、チャンクの端で意味が損なわれることなく保持され、検索の再現性が向上する。</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">ステップ3：Milvusにベクターとメタデータを格納する</h3><p>クリーンなチャンクの準備ができたら、次のステップはそれらを高速で正確な検索をサポートする方法で保存することです。</p>
<p><strong>ベクターの保存とメタデータ</strong></p>
<p>Milvusはコレクション名に厳格なルールを課しています - ASCII文字、数字、アンダースコアのみです。知識ベース名にASCII以外の文字が含まれている場合、バックエンドはコレクションを作成する前にkb_プレフィックスで16進エンコードし、表示のためにデコードします。些細なことですが、暗号化エラーを防ぐことができます。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>名前を付けるだけでなく、各チャンクは挿入の前に2つのステップを踏みます：エンベッディングの生成とメタデータの添付です。</p>
<ul>
<li><strong>何が保存されるのか：</strong></li>
</ul>
<p>各チャンクは384次元の密なベクトルに変換される。同時に、Milvusスキーマはファイル名、ページ番号、チャンクIDなどの追加フィールドを保存する。</p>
<ul>
<li><strong>なぜこれが重要なのか：</strong></li>
</ul>
<p>これにより、答えがどのページから来たかを正確にたどることができる。また、将来的なマルチモーダルQ&amp;Aのユースケースに備えることができます。</p>
<ul>
<li><strong>パフォーマンスの最適化：</strong></li>
</ul>
<p>vector_store.pyでは、insert_documentsメソッドはバッチ埋め込みを使用しています。これにより、ネットワークリクエストの数が減り、処理が効率的になります。</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">ステップ4：ハイブリッド検索とRRFフュージョンによる検索</h3><p>単一の検索方法で十分なことはほとんどありません。ベクトル検索は意味的に類似したコンテンツを見つけるが、正確な用語を見逃すことがある。キーワード検索は特定の用語を特定するが、言い換えを見逃すことがある。両方を並行して実行し、出力をマージすることで、どちらか一方だけを実行するよりも良い結果が得られる。</p>
<p>クエリの言語が文書の言語と異なる場合、システムはまずLLMを使ってクエリを翻訳し、両方の検索パスが文書の言語で動作できるようにする。その後、2つの検索が並行して実行される：</p>
<ul>
<li><strong>ベクトル検索（高密度）：</strong>ベクトル検索（高密度）：言語が違っても、似たような意味を持つコンテンツを見つける。</li>
<li><strong>キーワード検索（スパース）：</strong>専門用語、数値、数式変数など、ベクトル埋め込みがしばしば平滑化する種類のトークンに完全に一致するものを見つける。</li>
</ul>
<p>システムはRRF(Reciprocal Rank Fusion)を使って両方の結果リストをマージする。各候補はそれぞれのリストでの順位に基づいたスコアを受け取るので、<em>両方の</em>リストの上位に表示されるチャンクが最も高いスコアを獲得する。ベクトル検索はセマンティック・カバレッジに寄与し、キーワード検索は用語の精度に寄与する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">ステップ5：回答生成の前に結果を再ランク付けする</h3><p>検索ステップで返されたチャンクは等しく関連性があるわけではありません。そこで、最終的な回答を生成する前に、再ランク付けステップで再ランク付けを行う。</p>
<p>reranker_v2.pyでは、複合的なスコアリングメソッドにより、各チャンクを5つの側面から評価します：</p>
<ul>
<li><strong>ファジィマッチング</strong></li>
</ul>
<p>ファジーマッチング(fuzzywuzzy)を使って、チャンクの文言がクエリとどれだけ似ているかをチェックします。これはテキストの直接の重なりを測定します。</p>
<ul>
<li><strong>キーワードカバレッジ</strong></li>
</ul>
<p>クエリの重要な単語がチャンクにどれだけ含まれているかをチェックします。キーワードの一致が多いほどスコアが高くなります。</p>
<ul>
<li><strong>意味的類似度</strong></li>
</ul>
<p>Milvusが返すベクトルの類似度スコアを再利用します。これは意味がどれだけ近いかを反映します。</p>
<ul>
<li><strong>長さと元のランク</strong></li>
</ul>
<p>非常に短いチャンクはコンテキストに欠けることが多いため、ペナルティを受けます。元のMilvusの結果で上位にランクされたチャンクにはわずかなボーナスが与えられる。</p>
<ul>
<li><strong>名前付きエンティティ検出</strong></li>
</ul>
<p>システムは "Milvus "や "RAG "のような大文字の単語を固有名詞として検出し、複数単語の専門用語をキーフレーズとして識別する。</p>
<p>各要素は最終スコア（下図）で重み付けされる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>学習データを必要とせず、各要素の貢献度が目に見える形で表示されます。あるチャンクの順位が予想外に高かったり低かったりした場合、スコアによってその理由が説明される。完全にブラックボックス化されたリランカーにはそれがない。</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">ステップ6：図表のマルチモーダルQ&amp;Aの追加</h3><p>研究論文には、テキストにはない情報を伝える重要な図表が含まれていることが多い。テキストのみのRAGパイプラインでは、これらのシグナルを完全に見逃してしまうだろう。  これを処理するために、3つの部分からなるシンプルな画像ベースのQ&amp;A機能を追加した：</p>
<p><strong>1.プロンプトにコンテキストを追加する</strong></p>
<p>画像をモデルに送信する際、システムは同じページからOCRテキストも取得する。<br>
プロンプトには、画像、ページテキスト、ユーザーの質問が含まれます。<br>
これは、モデルが完全な文脈を理解し、画像を読み取る際のミスを減らすのに役立ちます。</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.ビジョンAPIのサポート</strong></p>
<p>クライアント（ernie_client.py）はOpenAIのビジョンフォーマットをサポートしています。画像はBase64に変換され、image_url形式で送信されるため、モデルは画像とテキストの両方を一緒に処理することができます。</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.フォールバックプラン</strong></p>
<p>画像APIが失敗した場合（例えば、ネットワークの問題やモデルの限界のため）、システムは通常のテキストベースのRAGに切り替わる。<br>
OCRテキストを使用して質問に回答するため、システムは中断することなく動作し続ける。</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">パイプラインの主なUI機能と実装<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">APIレート制限と保護の扱い方</h3><p>LLMを呼び出したりAPIを埋め込んだりする際、システムが<strong>429 Too Many Requests</strong>エラーを受け取ることがある。これは通常、短時間に多くのリクエストが送信された場合に発生する。</p>
<p>これを処理するために、プロジェクトではernie_client.pyに適応的なスローダウン機構を追加しています。速度制限エラーが発生した場合、システムは自動的にリクエスト速度を下げ、停止する代わりに再試行します。</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>これは、特に大量のドキュメントを処理したり埋め込んだりする際に、システムの安定性を保つのに役立ちます。</p>
<h3 id="Custom-Styling" class="common-anchor-header">カスタムスタイリング</h3><p>フロントエンドは Gradio (main.py) を使用しています。カスタムCSS (modern_css) を追加して、インターフェイスをすっきり使いやすくしました。</p>
<ul>
<li><strong>入力ボックス</strong></li>
</ul>
<p>デフォルトのグレーのスタイルから、白の丸みを帯びたデザインに変更しました。よりシンプルでモダンな印象になりました。</p>
<ul>
<li><strong>送信ボタン</strong></li>
</ul>
<p>グラデーションカラーとホバー効果を追加し、より目立つようにしました。</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">LaTeX数式のレンダリング</h3><p>多くの研究文書には数式が含まれるため、正しいレンダリングが重要です。インライン数式とブロック数式の両方のLaTeX完全サポートを追加しました。</p>
<ul>
<li><strong>この</strong>設定は、チャットウィンドウ（チャットボット）とサマリーエリア（Markdown）の両方で機能します。</li>
<li><strong>実用的な結果</strong>数式がモデルの回答に表示されるか、ドキュメントの要約に表示されるかにかかわらず、ページ上で正しくレンダリングされます。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">説明可能性：関連性スコアと信頼度</h3><p>ブラックボックス "を避けるために、システムは2つのシンプルな指標を表示します：</p>
<ul>
<li><p><strong>関連性</strong></p></li>
<li><p>参考文献」セクションの各回答の下に表示されます。</p></li>
<li><p>引用された各チャンクのリランカースコアが表示されます。</p></li>
<li><p>ユーザーが特定のページや文章が使用された理由を確認するのに役立ちます。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>信頼性</strong></p></li>
<li><p>分析の詳細」パネルに表示されます。</p></li>
<li><p>一番上のチャンクのスコア（100%にスケール）に基づく。</p></li>
<li><p>答えに対する自信度を示します。</p></li>
<li><p>60%以下の場合、答えの信頼性が低い可能性があります。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>UIを以下に示します。インターフェースでは、各回答にソースのページ番号と関連性スコアが表示されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>RAGの精度は、LLMとベクトルデータベース間のエンジニアリングに依存する。この記事では、<a href="https://milvus.io"></a><a href="https://milvus.io">Milvusを</a>使った<a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAGの</a>ビルドを通して、そのエンジニアリングの各段階を説明した：</p>
<ul>
<li><strong>ドキュメントの解析</strong>PP-StructureV3 (<a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR"></a> PaddleOCR経由)は、レイアウトを意識したOCRでPDFをクリーンなMarkdownに変換し、基本的な抽出ツールが失う見出し、表、画像を保持します。</li>
<li><strong>チャンキング。</strong>オーバーラップするスライディングウィンドウの分割は、チャンクの境界でコンテキストを無傷に保ち、検索リコールに支障をきたす断片の破損を防ぎます。</li>
<li><strong>milvusでのベクトルの保存。</strong>高速で正確な検索をサポートする方法でベクトルを保存します。</li>
<li><strong>ハイブリッド検索。</strong>ベクトル検索とキーワード検索を並行して実行し、その結果をRRF（Reciprocal Rank Fusion）でマージすることで、どちらかの方法だけでは見逃してしまうセマンティックマッチと完全一致の両方をキャッチします。</li>
<li><strong>再ランク付け。</strong>透過的なルールベースの再ランカーは、ファジーマッチ、キーワードカバレッジ、意味的類似性、長さ、固有名詞検出で各チャンクをスコアリングします。</li>
<li><strong>マルチモーダルQ&amp;A。</strong>プロンプトで画像とOCRページテキストをペアリングすることで、画像APIが失敗した場合のテキストのみのフォールバックで、ビジョンモデルが図表に関する質問に答えるのに十分なコンテキストを提供します。</li>
</ul>
<p>もしあなたがドキュメントQ&amp;A用のRAGシステムを構築していて、より良い精度を求めているのであれば、どのようにアプローチしているのかぜひお聞かせください。</p>
<p><a href="https://milvus.io/">Milvus</a>、ハイブリッド検索、ナレッジベース設計についてご質問がありますか？<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加いただくか、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワー</a>20分セッションをご予約ください。</p>
