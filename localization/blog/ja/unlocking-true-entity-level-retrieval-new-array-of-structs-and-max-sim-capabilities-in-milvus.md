---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: 真のエンティティレベルの検索を解き放つ：Milvusの新しいArray-of-StructsとMAX_SIM機能
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  MilvusのArray of
  StructsとMAX_SIMがどのようにマルチベクターデータの真のエンティティレベル検索を可能にし、デデュープを排除して検索精度を向上させるかをご紹介します。
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>ベクター・データベースの上にAIアプリケーションを構築したことがある人なら、おそらく同じ痛点にぶつかったことがあるだろう。データベースは個々のチャンクの埋め込みを検索するが、アプリケーションは<strong><em>エンティティを</em></strong>気にする。このミスマッチが、検索ワークフロー全体を複雑にしている。</p>
<p>このような現象は、何度も何度も目にしてきたことだろう：</p>
<ul>
<li><p><strong>RAG知識ベース：</strong>RAG知識ベース：記事は段落埋め込みにチャンクされているため、検索エンジンは完全なドキュメントではなく、散らばった断片を返す。</p></li>
<li><p><strong>Eコマースの推薦：</strong>商品には複数の画像エンベッディングがあり、システムは5つのユニークな商品ではなく、同じ商品の5つのアングルを返す。</p></li>
<li><p><strong>動画プラットフォーム：</strong>動画はクリップ埋め込みに分割されているが、検索結果は単一の統合されたエントリではなく、同じ動画のスライスを表示する。</p></li>
<li><p><strong>ColBERT / ColPaliスタイルの検索：</strong>ドキュメントは何百ものトークンやパッチレベルのエンベッディングに分割され、検索結果はまだマージが必要な小さな断片として戻ってくる。</p></li>
</ul>
<p>これらの問題はすべて、<em>同じアーキテクチャのギャップに</em>起因しています。ほとんどのベクターデータベースは、各埋め込みを孤立した行として扱いますが、実際のアプリケーションは、ドキュメント、製品、ビデオ、アイテム、シーンなど、より高いレベルのエンティティを操作します。その結果、エンジニアリングチームは、重複排除、グループ化、バケツ分け、再ランク付けのロジックを使って手作業でエンティティを再構築せざるを得ない。それは機能しますが、壊れやすく、遅く、そもそもそこに存在すべきでないロジックでアプリケーションレイヤーを肥大化させます。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus2.6.4では</a>、このギャップを埋める新機能が追加された：<strong>MAX_SIM</strong>メトリックタイプを持つ<a href="https://milvus.io/docs/array-of-structs.md"><strong>構造体の配列</strong></a>です。これらにより、1つのエンティティのすべてのエンベッディングを1つのレコードに格納することができ、Milvusはエンティティのスコアリングを行い、総合的に返すことができます。重複した結果セットはもうありません。再ランク付けやマージのような複雑な後処理が不要になります。</p>
<p>この記事では、Array of StructsとMAX_SIMがどのように機能するかを説明し、2つの実例を通してデモンストレーションを行う：Wikipediaの文書検索とColPaliの画像ベースの文書検索だ。</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Array of Structsとは？<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusでは、<strong>Array of Structs</strong>フィールドにより、1つのレコードに同じ定義済みのスキーマに従ったStruct要素の<em>順序付きリストを</em>格納することができます。Structは複数のベクトル、スカラーフィールド、文字列、その他サポートされている型を保持することができます。言い換えれば、1つのエンティティに属するすべての要素（段落埋め込み、画像ビュー、トークン・ベクトル、メタデータ）を1つの行に直接まとめることができます。</p>
<p>以下は、Array of Structsフィールドを含むコレクションのエンティティの例です。</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>上の例では、<code translate="no">chunks</code> フィールドが Array of Structs フィールドで、各 Struct 要素はそれ自身のフィールド、すなわち<code translate="no">text</code> 、<code translate="no">text_vector</code> 、<code translate="no">chapter</code> を含んでいます。</p>
<p>このアプローチは、ベクトル・データベースにおける長年のモデリング問題を解決します。従来は、すべての埋め込みや属性がそれ自身の行になる必要があり、<strong>マルチベクターエンティティ（文書、製品、ビデオ）を</strong>数十、数百、あるいは数千のレコードに分割せざるを得ませんでした。Array of Structsを使えば、Milvusはマルチベクターエンティティ全体を1つのフィールドに格納することができますので、段落リスト、トークン埋め込み、クリップシーケンス、マルチビュー画像など、1つの論理アイテムが多くのベクターで構成されているようなシナリオに自然にフィットします。</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">MAX_SIM で構造体の配列はどのように機能するのか？<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>MAX_SIMは</strong>、この新しい構造体の配列の上に、意味検索のエンティティを意識させる新しいスコアリング戦略です。Milvusは、クエリが入力されると、それを各構造体配列内の<em>すべての</em>ベクトルと比較し、<strong>最大類似</strong>度をエンティティの最終スコアとする。そして、そのスコアに基づいてエンティティがランク付けされ、返される。これにより、散在した断片を検索するという古典的なベクトルデータベースの問題を回避し、グループ化、デデュープ、再ランク付けの負担をアプリケーションレイヤーに押し付けることができます。MAX_SIM によって、エンティティレベルの検索は、ビルトインで、一貫性があり、効率的なも のとなる。</p>
<p>MAX_SIM が実際にどのように機能するのかを理解するために、具体的な例を見てみよう。</p>
<p><strong>注：</strong>この例では、すべてのベクトルは同じ埋め込みモデルによって生成され、類似度は [0,1] の範囲の余弦類似度で測定されます。</p>
<p>あるユーザーが<strong>"機械学習初心者コース "を</strong>検索したとします。</p>
<p>クエリは3つの<strong>トークンに</strong>トークン化される：</p>
<ul>
<li><p><em>機械学習</em></p></li>
<li><p><em>初心者</em></p></li>
<li><p><em>コース</em></p></li>
</ul>
<p>そして、それぞれのトークンは、ドキュメントに使われたのと同じ埋め込みモデルによって、<strong>埋め込みベクトルに変換さ</strong>れる。</p>
<p>さて、ベクトル・データベースには2つの文書が含まれているとしよう：</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Pythonによるディープニューラルネットワーク入門ガイド</em></p></li>
<li><p><strong>doc_2:</strong> <em>LLM論文リーディング上級ガイド</em></p></li>
</ul>
<p>どちらのドキュメントもベクトルに埋め込まれ、Array of Structsの中に格納されています。</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>ステップ1：doc_1のMAX_SIMの計算</strong></h3><p>各クエリベクトルに対して、milvusはdoc_1の各ベクトルとのコサイン類似度を計算する：</p>
<table>
<thead>
<tr><th></th><th>はじめに</th><th>ガイド</th><th>ディープニューラルネットワーク</th><th>パイソン</th></tr>
</thead>
<tbody>
<tr><td>機械学習</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>初心者</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>コース</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>各クエリベクトルに対して、MAX_SIM はその行から<strong>最も高い</strong>類似度を選択する：</p>
<ul>
<li><p>機械学習 → ディープニューラルネットワーク (0.9)</p></li>
<li><p>初心者 → 導入 (0.8)</p></li>
<li><p>コース → ガイド (0.7)</p></li>
</ul>
<p>最良の一致を合計すると、doc_1 の<strong>MAX_SIM スコアは 2.4</strong> となる。</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">ステップ2：doc_2のMAX_SIMを計算する</h3><p>次に、doc_2についてこのプロセスを繰り返す：</p>
<table>
<thead>
<tr><th></th><th>高度な</th><th>ガイド</th><th>LLM</th><th>論文</th><th>リーディング</th></tr>
</thead>
<tbody>
<tr><td>機械学習</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>初心者</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>コース</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>doc_2のベストマッチは以下の通り：</p>
<ul>
<li><p>「機械学習」 → 「LLM」 (0.9)</p></li>
<li><p>「初心者" → "ガイド" (0.6)</p></li>
<li><p>「コース」 → 「ガイド」 (0.8)</p></li>
</ul>
<p>これらを合計すると、doc_2の<strong>MAX_SIMスコアは2.3と</strong>なる。</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">ステップ3：スコアを比較する</h3><p><strong>2.4＞2.3</strong>なので、<strong>doc_1はdoc_2より上位にランクされる</strong>。doc_1は機械学習入門ガイドに近いので、これは直感的に理解できる。</p>
<p>この例から、MAX_SIMの3つの核となる特徴を強調することができる：</p>
<ul>
<li><p><strong>キーワードベースではなく、意味ベース：</strong>MAX_SIMは、テキスト・リテラルではなく、埋め込みを比較する。<em>機械学習</em>」と<em>「ディープニューラルネットワーク」は</em>、重複する単語がゼロであっても、意味的類似度は0.9である。このため、MAX_SIMは同義語、言い換え、概念の重複、埋め込みが多い最新のワークロードに対してロバストです。</p></li>
<li><p><strong>長さと順序に影響されない：</strong>MAX_SIMは、クエリとドキュメントのベクトル数が同じであることを要求しません（例えば、doc_1のベクトル数は4ですが、doc_2のベクトル数は5です。）また、ベクトルの順番も無視します。"beginner "がクエリで先に出てきても、"introduction "がドキュメントで後に出てきても、スコアには影響しません。</p></li>
<li><p><strong>すべてのクエリベクトルが重要なのです：</strong>MAX_SIMは各クエリベクトルに最もマッチするものを選び、それらのベストスコアを合計します。これにより、一致しないベクトルが結果を歪めることを防ぎ、重要なクエリトークンが最終的なスコアに貢献することを保証します。例えば、doc_2の "beginner "の低品質なマッチは、そのまま全体のスコアを下げることになる。</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">ベクターデータベースにおいてMAX_SIM + 構造体の配列が重要な理由<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvusは</a>オープンソースの高性能ベクトルデータベースであり、現在ではArray of Structsと共にMAX_SIMを完全にサポートし、ベクトルネイティブなエンティティレベルのマルチベクトル検索を可能にしています：</p>
<ul>
<li><p><strong>マルチベクターエンティティをネイティブに保存</strong>Array of Structsにより、関連するベクトル群を別々の行や補助テーブルに分割することなく、単一のフィールドに格納することができます。</p></li>
<li><p><strong>効率的なベストマッチ計算：</strong>IVFやHNSWのようなベクトルインデックスと組み合わせることで、MAX_SIMはすべてのベクトルをスキャンすることなく、ベストマッチを計算することができます。</p></li>
<li><p><strong>意味を多用する作業負荷に特化した設計：</strong>このアプローチは、長文検索、多面的なセマンティックマッチング、文書と要約のアライメント、複数キーワードのクエリ、および柔軟できめ細かいセマンティック推論を必要とするその他のAIシナリオにおいて優れています。</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">構造体の配列を使用するタイミング<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Array of Structsの</strong>価値は、それが何を可能にするかを見れば明らかだ。この機能の核心は、3つの基本的な機能を提供することである：</p>
<ul>
<li><p><strong>ベクトル</strong>、スカラー、文字列、<strong>メタデータといった異種データを</strong>単一の構造化オブジェクトに<strong>束ねる</strong>。</p></li>
<li><p><strong>ストレージを実世界のエンティティに合わせるので</strong>、データベースの各行が、記事、製品、ビデオなどの実際のアイテムにきれいにマッピングされる。</p></li>
<li><p><strong>MAX_SIMのような集約関数と組み合わせると</strong>、データベースから直接、真のエンティティレベルのマルチベクトル検索が可能になり、アプリケーションレイヤーでの重複排除、グループ化、再ランク付けが不要になる。</p></li>
</ul>
<p>このような特性により、Array of Structs は、<em>単一の論理エンティティが複数のベクタで表現される</em>場合に自然に適合します。よくある例としては、段落に分割された記事、トークン埋め込みに分解された文書、複数の画像で表現された製品などがあります。検索結果が重複ヒットしたり、断片が散在したり、同じエンティティが検索結果の上位に何度も表示されたりする場合、Array of Structsは、アプリケーションコードで事後的にパッチを適用するのではなく、ストレージと検索のレイヤーでこれらの問題を解決します。</p>
<p>このパターンは、<strong>マルチベクトル検索に</strong>依存する最新のAIシステムにとって特に強力である。 例えば、ColBERTは1つのドキュメントを<strong>複数のベクトルとして</strong>表現する：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERTは</strong></a>1つの文書を100～500のトークン埋め込みとして表現し、法律文書や学術研究などのドメイン間できめ細かなセマンティックマッチングを行う。</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPaliは</strong> </a>PDFの各ページを256～1024の画像パッチに<a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy">変換 </a>し、財務諸表、契約書、請求書、その他のスキャン文書を横断的に検索します。</p></li>
</ul>
<p>Milvusは、Structsの配列により、これらのベクトルをすべて単一のエンティティに格納し、集約類似度（MAX_SIMなど）を効率的かつネイティブに計算することができます。これを明確にするために、2つの具体例を示します。</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">例1：Eコマースの商品検索</h3><p>以前は、複数の画像を持つ商品は、1行に1つの画像を持つフラットスキーマに格納されていました。フロント、サイド、アングルの3つの画像を持つ商品は、3つの行を生成していました。検索結果は同じ商品の複数の画像を返すことが多く、手作業による重複排除と再ランク付けが必要でした。</p>
<p>Array of Structsでは、各商品が<strong>1行に</strong>なります。すべての画像埋め込みとメタデータ（角度、is_primaryなど）は、構造体の配列として、<code translate="no">images</code> フィールド内に格納されます。milvusはそれらが同じ商品に属していると理解し、個々の画像ではなく商品全体を返します。</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">例2: ナレッジベースまたはウィキペディア検索</h3><p>以前は、一つのウィキペディア記事が<em>N個の</em>段落行に分割されていました。検索結果は散らばった段落を返し、システムはそれらをグループ化し、どの記事に属するかを推測することを余儀なくされていました。</p>
<p>構造体の配列では、記事全体が<strong>1つの行に</strong>なります。すべての段落とその埋め込みは段落フィールドの下にグループ化され、データベースは断片化された部分ではなく、記事全体を返します。</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">ハンズオンチュートリアル構造体の配列によるドキュメントレベルの検索<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1.ウィキペディアのドキュメント検索</h3><p>このチュートリアルでは、段落レベルのデータを完全なドキュメントレコードに変換するために<strong>Array of Structsを</strong>使用する方法を説明します。</p>
<p>多くの知識ベースパイプラインはWikipediaの記事をパラグラフチャンクとして保存しています。これは埋め込みやインデックス作成には適していますが、検索には不向きです。ユーザクエリは通常、散らばった段落を返すため、手動で記事をグループ化し、再構築する必要があります。Array of StructsとMAX_SIMを使えば、<strong>各記事が1行になる</strong>ようにストレージスキーマを再設計することができ、milvusは文書全体をネイティブにランク付けして返すことができる。</p>
<p>次のステップでは、以下の方法を紹介します：</p>
<ol>
<li><p>ウィキペディアの段落データの読み込みと前処理</p></li>
<li><p>同じ記事に属するすべてのパラグラフを構造体の配列に束ねる。</p></li>
<li><p>これらの構造化されたドキュメントをmilvusに挿入する。</p></li>
<li><p>MAX_SIMクエリを実行し、重複排除や再ランク付けを行うことなく、クリーンな記事全体を取得する。</p></li>
</ol>
<p>このチュートリアルが終わるころには、Milvusが直接エンティティレベルの検索を行うパイプラインが完成していることでしょう。</p>
<p><strong>データモデル</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ 1: データのグループ化と変換</strong></p>
<p>このデモでは<a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>データセットを使用します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ2: Milvusコレクションの作成</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ3：データの挿入とインデックスの構築</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ4：ドキュメントの検索</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>出力の比較：従来の検索と構造体の配列の比較</strong></p>
<p>Array of Structsの影響は、データベースが実際に何を返すかを見ると明らかになる：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>次元</strong></th><th style="text-align:center"><strong>従来のアプローチ</strong></th><th style="text-align:center"><strong>構造体の配列</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>データベース出力</strong></td><td style="text-align:center"><strong>上位100段落を</strong>返す（冗長性が高い）</td><td style="text-align:center"><em>上位10個の完全な文書を</em>返す - クリーンで正確</td></tr>
<tr><td style="text-align:center"><strong>アプリケーションロジック</strong></td><td style="text-align:center"><strong>グループ化、重複排除、再ランク付けが</strong>必要（複雑）</td><td style="text-align:center">後処理は不要 - エンティティレベルの結果はmilvusから直接得られる。</td></tr>
</tbody>
</table>
<p>ウィキペディアの例では、段落ベクトルを結合して統一的な文書表現にするという最も単純なケースのみを示した。しかし、Array of Structsの本当の強みは、古典的な検索パイプラインや最新のAIアーキテクチャなど、<strong>どのような</strong>マルチベクトルデータモデルにも一般化できることです。</p>
<p><strong>従来のマルチベクトル検索シナリオ</strong></p>
<p>多くの確立された検索システムや推薦システムは、当然ながら複数の関連ベクトルを持つエンティティを操作します。Array of Structsはこれらのユースケースにうまく対応します：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>シナリオ</strong></th><th style="text-align:center"><strong>データモデル</strong></th><th style="text-align:center"><strong>エンティティごとのベクトル</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️<strong>Eコマース商品</strong></td><td style="text-align:center">1つの商品 → 複数の画像</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center"><strong>動画検索</strong></td><td style="text-align:center">1つの動画 → 複数のクリップ</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖<strong>論文検索</strong></td><td style="text-align:center">一つの論文 → 複数のセクション</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>AIモデルのワークロード（主要な複数ベクトルの使用例）</strong></p>
<p>構造体の配列は、きめ細かな意味論的推論のためにエンティティごとに意図的に大きなベクトルセットを生成する最新のAIモデルでは、さらに重要になる。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>モデル</strong></th><th style="text-align:center"><strong>データモデル</strong></th><th style="text-align:center"><strong>エンティティごとのベクトル</strong></th><th style="text-align:center"><strong>アプリケーション</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">1ドキュメント→多数のトークン埋め込み</td><td style="text-align:center">100-500</td><td style="text-align:center">法律文書、学術論文、きめ細かな文書検索</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">PDF1ページ → 多数のパッチ埋め込み</td><td style="text-align:center">256-1024</td><td style="text-align:center">財務報告書、契約書、請求書、マルチモーダル文書検索</td></tr>
</tbody>
</table>
<p>これらのモデルは、マルチベクターストレージパターンを<em>必要とする</em>。Array of Structs以前は、開発者は行をまたいでベクトルを分割し、結果を手作業でつなぎ合わせる必要がありました。Milvusでは、MAX_SIMがドキュメントレベルのスコアリングを自動的に処理することで、これらのエンティティをネイティブに格納・検索できるようになりました。</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2.ColPali画像ベース文書検索</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPaliは</strong></a>、クロスモーダルなPDF検索のための強力なモデルです。テキストに依存する代わりに、各PDFページを画像として処理し、最大1024の視覚パッチにスライスし、パッチごとに1つの埋め込みを生成します。従来のデータベーススキーマでは、1つのページを数百から数千の別々の行として格納する必要があり、データベースがこれらの行が同じページに属することを理解することは不可能でした。その結果、エンティティレベルの検索は断片化し、実用的ではなくなります。</p>
<p>Array of Structsは、すべてのパッチ埋め込みを<em>1つのフィールドに</em>格納することで、この問題をきれいに解決し、milvusがページを1つのまとまったマルチベクターエンティティとして扱うことを可能にします。</p>
<p>従来のPDF検索は、ページ画像をテキストに変換する<strong>OCRに</strong>依存することがよくあります。これはプレーンテキストには有効ですが、図表、レイアウト、その他の視覚的な手がかりを失います。ColPaliは、ページ画像を直接処理することで、この制限を回避し、すべての視覚情報とテキスト情報を保持します。トレードオフはスケールです。各ページには数百のベクトルが含まれるようになり、多数の埋め込みを1つのエンティティに集約できるデータベースが必要になります-まさにArray of Structs + MAX_SIMが提供するものです。</p>
<p>最も一般的な使用例は<strong>Vision RAGで</strong>、各PDFページがマルチベクターエンティティになります。典型的なシナリオは以下の通りです：</p>
<ul>
<li><p><strong>財務報告書：</strong>何千ものPDFから、特定のグラフや表を含むページを検索。</p></li>
<li><p><strong>契約書：</strong>スキャンまたは撮影した法的文書から条項を検索。</p></li>
<li><p><strong>請求書：</strong>ベンダー、金額、レイアウトで請求書を検索。</p></li>
<li><p><strong>プレゼンテーション：</strong>特定の図やダイアグラムを含むスライドを検索。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>データモデル：</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ1: データの準備</strong>ColPaliが画像やテキストをマルチベクトル表現に変換する方法の詳細については、ドキュメントを参照してください。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ2: Milvusコレクションの作成</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ3：データの挿入とインデックスの構築</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ステップ4：クロスモーダル検索：テキストクエリ → 画像結果</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>サンプル出力：</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>ここでは、結果は直接完全なPDFページを返します。Milvusがすべての集約を自動的に処理するため、1024パッチの埋め込みについて心配する必要はない。</p>
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
    </button></h2><p>ほとんどのベクターデータベースは、各フラグメントを独立したレコードとして保存しているため、完全なドキュメント、製品、ページが必要なときに、アプリケーションはそれらのフラグメントを再組み立てしなければなりません。Structsの配列はそれを変えます。スカラー、ベクトル、テキスト、その他のフィールドを1つの構造化オブジェクトにまとめることで、1つのデータベース行で1つの完全なエンティティをエンドツーエンドで表現できるようになります。</p>
<p>アプリケーションレイヤーで複雑なグループ化、デデュープ、リランキングを必要としていた作業が、ネイティブなデータベース機能として利用できるようになるのです。ベクター・データベースの未来は、よりリッチな構造、よりスマートな検索、よりシンプルなパイプラインへと向かっています。</p>
<p>Array of StructsとMAX_SIMの詳細については、以下のドキュメントを参照してください：</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">構造体の配列｜Milvusドキュメント</a></li>
</ul>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
