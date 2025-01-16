---
id: audio-retrieval-based-on-milvus.md
title: 処理技術
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: Milvusによる音声検索では、音声データをリアルタイムで分類・分析することが可能です。
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>milvusに基づく音声検索</custom-h1><p>音声は情報密度の高いデータタイプである。動画コンテンツの時代には時代遅れに感じるかもしれないが、音声は多くの人にとって主要な情報源であり続けている。リスナーが長期的に減少しているにもかかわらず、2020年には12歳以上のアメリカ人の83%がある週に地上波（AM/FM）ラジオを聴いている（2019年の89%から減少）。逆に、オンライン・オーディオのリスナーは過去20年間で着実に増加しており、同じ<a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">ピュー・リサーチ・センターの調査に</a>よると、アメリカ人の62％が何らかの形で毎週聴いていると報告されている。</p>
<p>波としての音には、周波数、振幅、波形、持続時間の4つの性質がある。音楽用語では、これらをピッチ、ダイナミック、トーン、デュレーションと呼ぶ。また、音は人間や他の動物が環境を認識・理解するのに役立ち、周囲の物体の位置や動きを知る手がかりとなる。</p>
<p>情報を伝えるものとして、音声は3つのカテゴリーに分類することができます：</p>
<ol>
<li><strong>音声：</strong>音声：単語と文法で構成されるコミュニケーション媒体。音声認識アルゴリズムにより、音声をテキストに変換することができる。</li>
<li><strong>音楽：</strong>メロディ、ハーモニー、リズム、音色で構成される楽曲を生み出すために、ボーカルや楽器の音が組み合わされたもの。音楽は楽譜で表すことができる。</li>
<li><strong>波形：</strong>アナログ音をデジタル化して得られるデジタル音声信号。波形は音声、音楽、自然音または合成音を表すことができる。</li>
</ol>
<p>音声検索は、オンライン・メディアをリアルタイムで検索・監視し、知的財産権の侵害を取り締まるために利用できる。また、音声データの分類や統計分析においても重要な役割を担っています。</p>
<h2 id="Processing-Technologies" class="common-anchor-header">処理技術<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>音声、音楽、その他の一般的な音には、それぞれ固有の特性があり、異なる処理方法が要求されます。通常、音声は音声を含むグループと含まないグループに分けられます：</p>
<ul>
<li>音声は自動音声認識によって処理されます。</li>
<li>音楽音声、効果音、デジタル化された音声信号を含む非音声音声は、音声検索システムを使って処理されます。</li>
</ul>
<p>この記事では、音声検索システムを使って、音声以外のオーディオデータを処理する方法を取り上げます。音声認識は、この記事では扱いません。</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">音声特徴抽出</h3><p>音声の特徴抽出は、音声の類似検索を可能にするため、音声検索システムにおいて最も重要な技術である。音声の特徴量を抽出する方法は2つに分類される：</p>
<ul>
<li>ガウス混合モデル（GMM）や隠れマルコフモデル（HMM）などの伝統的な音声特徴抽出モデル；</li>
<li>リカレントニューラルネットワーク（RNN）、長期短期記憶（LSTM）ネットワーク、符号化・復号化フレームワーク、注意メカニズムなどのディープラーニングベースの音声特徴抽出モデル。</li>
</ul>
<p>ディープラーニングに基づくモデルは、従来のモデルよりもエラー率が桁違いに低いため、オーディオ信号処理分野の中核技術として勢いを増している。</p>
<p>音声データは通常、抽出された音声特徴によって表現される。検索プロセスでは、オーディオデータそのものではなく、これらの特徴や属性を検索・比較する。そのため、音声類似検索の有効性は特徴抽出の品質に大きく依存する。</p>
<p>この記事では、<a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">大規模な事前訓練されたオーディオパターン認識のためのオーディオニューラルネットワーク（PANN）は</a>、その平均平均精度（mAP）0.439（Hersheyら、2017）の特徴ベクトルを抽出するために使用されます。</p>
<p>オーディオデータの特徴ベクトルを抽出した後、milvusを用いて高性能な特徴ベクトル解析を実装することができる。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">ベクトル類似度検索</h3><p><a href="https://milvus.io/">Milvusは</a>、機械学習モデルやニューラルネットワークによって生成された埋め込みベクトルを管理するために構築された、クラウドネイティブのオープンソースベクトルデータベースである。コンピュータビジョン、自然言語処理、計算化学、パーソナライズされたレコメンダーシステムなどのシナリオで広く使用されています。</p>
<p>以下の図は、Milvusを使った一般的な類似検索プロセスを表しています。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>非構造化データはディープラーニングモデルによって特徴ベクトルに変換され、Milvusに挿入される。</li>
<li>Milvusはこれらの特徴ベクトルを保存し、インデックスを作成する。</li>
<li>Milvusはリクエストに応じて、クエリベクトルに最も近いベクトルを検索して返す。</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">システムの概要<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>音声検索システムは、主に挿入（黒線）と検索（赤線）の2つの部分から構成されている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>音声検索システム.png</span> </span></p>
<p>サンプルデータセットにはオープンソースのゲームサウンドを使用しており、コードの詳細は<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus bootcampに</a>記載されています。</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">ステップ1: データの挿入</h3><p>以下は、事前に学習したPANNs推論モデルを用いて音声埋め込みデータを生成し、Milvusに挿入するサンプルコードです。Milvusは各ベクトル埋め込みデータに一意のIDを割り当てます。</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>そして、返されたids<strong>_</strong>milvusは、他の関連情報（例えば<strong>wav_name</strong>）と共にMySQLデータベースに格納されます。</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">ステップ2：オーディオ検索</h3><p>Milvusは、あらかじめ格納された特徴ベクトルと、PANNs推論モデルを用いてクエリオーディオデータから抽出された入力特徴ベクトルとの内積距離を計算し、検索されたオーディオデータに対応する類似特徴ベクトルのids<strong>_</strong>milvusを返します。</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">APIリファレンスとデモ<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>この音声検索システムはオープンソースのコードで構築されている。主な機能は音声データの挿入と削除です。すべてのAPIはブラウザで<strong>127.0.0.1:<port></strong>/docsと入力することで閲覧できます。</p>
<h3 id="Demo" class="common-anchor-header">デモ</h3><p>Milvusを使った音声検索システムの<a href="https://zilliz.com/solutions">ライブデモを</a>オンラインで公開しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>オーディオ検索デモ.png</span> </span></p>
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
    </button></h2><p>ビッグデータの時代に生きる人々は、自分たちの生活があらゆる種類の情報で溢れていることに気づく。それをよりよく理解するためには、従来のテキスト検索ではもはや対応できない。今日の情報検索技術では、動画、画像、音声など様々な非構造化データの検索が急務となっている。</p>
<p>コンピュータが処理しにくい非構造化データは、ディープラーニング・モデルを使って特徴ベクトルに変換することができる。この変換されたデータは、機械によって簡単に処理することができ、私たちは、先人たちができなかった方法で非構造化データを分析することができます。オープンソースのベクトルデータベースであるMilvusは、AIモデルによって抽出された特徴ベクトルを効率的に処理することができ、一般的な様々なベクトルの類似度計算を提供する。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March.大規模音声分類のためのCNNアーキテクチャ。In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp.131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">見知らぬ人にならない<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つける、または貢献する。</p></li>
<li><p><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</p></li>
<li><p><a href="https://twitter.com/milvusio">Twitterで</a>つながりましょう。</p></li>
</ul>
