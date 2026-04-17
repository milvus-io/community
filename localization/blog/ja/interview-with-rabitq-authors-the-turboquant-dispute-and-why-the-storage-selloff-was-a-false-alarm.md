---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: RaBitQ著者インタビュー：TurboQuant紛争とストレージの暴落が誤報だった理由
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: RaBitQの著者らがGoogleのTurboQuant論文に反論：ベンチマークの不均衡、誤った理論、ストレージの売り浴びせが誤報であった理由。
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>グーグルの<a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a>論文は、ベクトル表現について、<strong>6倍の圧縮、8倍のスピードアップ、ほぼゼロに近い精度低下を</strong>主張した。この論文が発表された後、メモリとストレージの株価は急落し、主要な技術系メディアはすぐにこの論文をトップニュースにした。</p>
<p>市場の反応は始まりに過ぎなかった。研究者たちはすぐに、論文の主張が誇張されていないか、先行研究（特に<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>）を公平に扱っているかどうかを問い始めた。この論争によって、<strong>ベクトル量子化は</strong>再び脚光を浴びることになったが、その理由のひとつは、AIスタックの2つの重要な部分、すなわち<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索</a>システムと大規模モデルのKVキャッシュ圧縮において、同じ基本的な考え方が重要な意味を持つようになったからである。</p>
<p>技術的な議論と、量産システムにとっての意味の両方を理解するために、NTUシンガポールの准教授でVectorDB@NTUの責任者である<strong>チェン・ロン</strong>氏、RaBitQの筆頭著者である<strong>ジャンヤン・ガオ</strong>氏、Zillizのエンジニアリング・ディレクターである<strong>リウ・リウ</strong>氏に話を聞いた。対談では、ベクトル量子化そのもの、TurboQuantにまつわる疑問、そして最も人気のあるオープンソースの<a href="https://zilliz.com/learn/what-is-vector-database">ベクトル・データベース</a>である<a href="https://milvus.io/">milvusや</a>大規模なベクトル検索などのシステムにとって、なぜこれが重要なのかについて話し合われた。</p>
<p><strong><em>関連記事</em></strong> <em>インタビューよりもエンジニアリングの側面について知りたい方は、</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>ベクトル量子化がAIのインフラコストにどのような影響を与えるかについての</em></a> <em>関連記事をご覧ください</em><em>。</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">なぜベクトル量子化が突然これほど大きなトピックになったのでしょうか？<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：論争に入る前に、まずベクトル量子化とは何か、なぜAIでこれほど重要になったのかを説明していただけますか？</strong></p>
<p><strong>チェン・ロン</strong>ベクトル量子化は、<strong>データ圧縮と</strong> <strong>近似表現の</strong>ための技術です。もともとは信号処理から来ており、画像や音声の圧縮に使われていました。現代のAIシステムでは、ベクトルが計算の基本単位のひとつになったため、その役割が変わりました。</p>
<p>今日、その重要性が最も明確になっているのは2つの場面だ。</p>
<p>ひとつは、<strong>数十億から数百億のベクトルを含むコレクションに対するリアルタイム検索</strong>である。意味検索システムでは、高次元ベクトルに対する類似検索が中心的なタスクとなる。しかし、生のベクトルは大きく、浮動小数点計算は高価である。規模が大きくなると、ミリ秒レベルのレイテンシーを実現することが難しくなる。ベクトル量子化は、ベクトルを低ビット表現に圧縮し、距離計算を高速化することで役立ちます。そのため、<a href="https://milvus.io/docs/single-vector-search.md">シングルベクトル検索</a>、<a href="https://milvus.io/docs/multi-vector-search.md">マルチベクトル検索</a>、<a href="https://milvus.io/docs/index-explained.md">Milvus検索アーキテクチャの</a>インデックス設計など、実用的なワークロードにとって重要なのだ。</p>
<p>もうひとつは、大規模モデル向けの<strong>KVキャッシュ圧縮</strong>である。KVキャッシュは生成時の冗長な計算を減らすが、コンテキストが長くなるにつれてメモリコストは急速に増大する。そのため、出力品質をあまり損なわずにベクトルを圧縮する方法が問題となる。その核心は、ベクトル量子化の問題でもある。</p>
<p><strong>Zilliz：もしベクトル量子化がより広く使われるようになれば、そしてTurboQuantの結果が維持されれば、ストレージの需要は急激に低下するのでしょうか？</strong></p>
<p><strong>Jianyang Gao氏：</strong>同じモデル、同じワークロードであれば、圧縮によってストレージの需要は減少します。しかし、それは人々が飛びついた広義の結論を正当化するものではありません。</p>
<p>TurboQuantが<strong>6倍の圧縮と</strong> <strong>8倍のスピードアップについて</strong>語るとき、それは基本的な<strong>16ビット／32ビットのベースラインとの</strong>比較である。それは、同じカテゴリーの他の方法と比較するのとは違う。ですから、本当の効果はもっと慎重に評価する必要があります。</p>
<p><strong>Zilliz：その観点からすると、もし市場の反応が本当に技術そのものに関するものだとしたら、同じようなアイデアがすでに登場していたもっと早い時期に起こるべきだったのでしょうか？</strong></p>
<p><strong>チェン・ロン</strong>技術的な観点からは、似たような理論的領域にすでに到達していたと言えるでしょう。しかし、市場は研究と同期して動くものではない。学術的な成果、技術的な採用、そして金融的な解釈の間には通常タイムラグがある。</p>
<p>また、より長期的な視野に立てば、その影響は直線的でさえないかもしれない。圧縮によって、より小さなデバイスで大きなモデルを動かすことが可能になり、単に需要を減らすのではなく、新たな需要を生み出すことができる。テクノロジーと市場の関係は、直線的な外挿よりも複雑なのだ。</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">RaBitQはどのようにして生まれ、何に貢献したのでしょうか？<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：RaBitQのアイデアはどのようにして生まれたのですか？</strong></p>
<p><strong>Jianyang Gaoです：</strong>私たちは、ベクトル・データベースに見られるギャップから出発しました。<a href="https://milvus.io/docs/ivf-pq.md">積量子化の</a>ような従来の手法は経験的にはうまく機能しましたが、理論的な保証はほとんどありませんでした。</p>
<p>当時、私はNTUシンガポールで高次元確率を研究していましたので、実用的なだけでなく、明確な理論的保証のある手法を構築できないかと考えるようになりました。それがRaBitQの出発点でした。</p>
<p><strong>Zilliz：RaBitQの核となるオリジナリティは何だと思われますか？</strong></p>
<p><strong>ジェンヤン・ガオ：</strong>その重要なアイデアは、ランダム回転、別名ジョンソン・リンデンストラウス変換を使って、ベクトル座標の分布をより均一で、より予測しやすくすることです。</p>
<p>それができれば、その上で最適な量子化推定量を導くことができます。そして、理論的な下界に達することを厳密に証明しました。</p>
<p>以前の研究では、ランダムな回転を導入することも試みられていた。しかし、私たちの観点からすると、それらの方法はアルゴリズム設計における実用的な問題のため、私たちが求めていた効果を達成することはできませんでした。</p>
<p><strong>Zilliz：エンジニアリングの観点から、RaBitQで最も目立った点は何ですか？</strong></p>
<p><strong>Li Liu（以下Liu）：</strong> <a href="https://milvus.io/docs/ivf-sq8.md">スカラー量子化法から</a>PQやその他の変種まで、私たちは多くの量子化アルゴリズムに取り組んできました。RaBitQで際立っていたのは、人々の問題への取り組み方を変えたことです。</p>
<p>それ以前は、この分野の多くはまだかなり経験的なものでした。ある方法がうまくいきそうだと言うことはできても、その理由を明確に説明することは難しかった。RaBitQは、より数学的な方法で問題にアプローチした。その方法はエレガントで、ある意味シンプルに感じられた。その考え方は、後の多くの仕事に影響を与えました。</p>
<p><strong>Zilliz：簡単に言うと、メモリとコストはどれくらい節約できるのですか？</strong></p>
<p><strong>リウ：</strong>同じリコールレベルであれば、4ビット圧縮から2ビット圧縮に移行することで、メモリ使用量は半分になります。</p>
<p>また、圧縮だけではありません。その性能は以前のアプローチと比べても遜色なく、メモリ効率と検索品質の両方を重視する本番環境では重要です。<a href="https://milvus.io/docs/dense-vector.md">高密度のベクトル・ストレージ</a>、スループット、リコールのバランスを取る必要があるシステムにとって、この製品が重要なのはそのためだ。</p>
<p><strong>Milvusの他に、RaBitQは現在どのような場面で利用されていますか？</strong></p>
<p><strong>チェン・ロング</strong>まず、Milvusチームに感謝したい。彼らはRaBitQをいち早く採用した。RaBitQをいち早く採用してくれたMilvusチームに感謝します。</p>
<p>RaBitQは、MetaのFAISS、VSAG、VectorChord、Volcengine OpenSearch、CockroachDB、ElasticSearch、Lucene、turbopufferなど、他のシステムでも採用されています。milvus側で際立っているのは、チームが<a href="https://milvus.io/docs/manage-collections.md">コレクション管理</a>、<a href="https://milvus.io/docs/ivf-flat.md">IVFベースのインデックス作成</a>、<a href="https://milvus.io/docs/hnsw.md">HNSWベースのインデックス作成に関する</a>より広範な作業と並行して、<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">milvus 2.6で</a>実際のインデックスオプションとして<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQを</a>出荷したことです。</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">TurboQuantをどのように評価すべきでしょうか？<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：公開された回答の中で、あなたはTurboQuantにはいくつかの重大な問題があると述べました。その主なものは何だとお考えですか？</strong></p>
<p><strong>Jianyang Gaoです：</strong>主な問題点は3つあります。</p>
<p>ひとつは、先行研究についての記述と重複についての議論の仕方です。TurboQuantの論文では、RaBitQの方法論を誤って説明しており、ジョンソン・リンデンストラウス変換のような最も似ている部分を無視しています。もう一つは、理論的な結果の特徴づけ方です。何の説明も根拠も示さずにRaBitQを最適でないと表現しているが、実際にはRaBitQは最適である。3つ目は、実験比較の公平性である。彼らはシングルコアCPUを使ってRaBitQを評価し、A100 GPUを使ってTurboQuantを評価している。</p>
<p><strong>Zilliz：まずベンチマークの問題を取り上げましょう。なぜ比較が公平でなかったと思いますか？</strong></p>
<p><strong>Jianyang Gao：</strong>ベンチマークの主張は、セットアップが同等である場合にのみ意味を持ちます。あるシステムが全く異なるハードウェアやソフトウェア環境でテストされた場合、その結果はアルゴリズムそのものよりもセットアップを反映している可能性があります。</p>
<p>私たちの見解では、プロセッサーの選択、実装言語、最適化レベルの違いが大きな違いを生む可能性があります。そのため、ベンチマークの手法は、特に本番の検索システムを構築するチームにとっては、非常に慎重に解釈する必要があるのです。</p>
<p><strong>Cheng Long：</strong>この論文では、他にもいくつかの主張がなされています。</p>
<p>例えば、論文には<strong>RaBitQはベクトル化できないと</strong>書かれています。しかしRaBitQは、2024年の論文が発表された時点で、すでにSIMDベースのベクトル化計算を行うコードをオープンソース化していました。ですから、私たちの観点からは、この記述は事実無根でした。</p>
<p>また、我々は昨年からNVIDIAと協力し、RaBitQのGPU実装を完成させたことも特筆に値する。関連するコードは、NVIDIAのcuVSライブラリに含めるためにレビュー中です。</p>
<p><strong>Milvusは2025年後半にTurboQuantを評価しましたが、採用しませんでした。テストではどうでしたか？</strong></p>
<p><strong>Li Liu（以下Liu）：</strong>TurboQuantには1つだけ有用なアイデアが含まれています。私たちの見解では、量子化グリッドをどのように割り当てるかという点で小さな最適化を行います。しかし、この手法の最も重要なステップであるランダム回転を使った量子化は、RaBitQが最初に導入したものです。</p>
<p>また、不偏推定に関しては、RaBitQのアプローチの方がすっきりしており、理論的な導出もしっかりしている。</p>
<p>とはいえ、これはGoogleの結果なので、我々は2025年にテストした。私たちのラボでは、標準化されたCPU環境の下で、TurboQuantは、私たちが評価したほとんどのケースで、私たちの内部RaBitQバージョンを上回りませんでした。ですから、市場がこれほど強く反応したとき、私たちは純粋に驚きました。</p>
<p><strong>Zilliz：どちらの論文もよく見たことがない読者のために、RaBitQとTurboQuantが重なる部分をわかりやすく説明していただけますか？</strong></p>
<p><strong>Li Liu（以下Liu）：</strong>高いレベルでは、どちらの手法も<strong>ランダム回転から</strong>始まります。数学的には、ベクトルにランダムな直交行列を掛けるということです。高次元空間で見る角度を変えるようなものだと考えればいいでしょう。データ点の相対的な位置は変わらないが、次元間の情報がより均等に分散される。</p>
<p>次に<strong>量子化が</strong>行われる。連続した実数値空間を<strong>2^k個のグリッドセルに</strong>分割します。<strong>kは</strong>量子化ビット数で、各ベクトル要素を近くのグリッド点にマッピングします。TurboQuantでは、グリッドを均等に割り当てるのではなく、データの分布に従って割り当てることで、ここで小さな調整を行います。</p>
<p>最後のステップは<strong>誤差推定で</strong>、ここがRaBitQの主な貢献点である。従来の方法では、量子化された値から直接計算するため、誤差の制御が難しくなります。RaBitQは量子化誤差をより正確に推定し、それが数学的な最適性をもたらす。TurboQuantのソリューションはより複雑で、私たちの設定ではトレードオフが魅力的に見えませんでした。</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">なぜ帰属を解決するのは実際には難しいのでしょうか？<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>あなたが声明を発表した後、GoogleとICLRはどのように対応しましたか？</p>
<p><strong>チェン・ロン：</strong>ICLRは行動を起こしませんでした。昨年9月の審査期間中にメールで問い合わせましたが、回答はありませんでした。今年3月にも手紙を書き、OpenReviewにコメントを掲載するように言われましたが、それ以上のアクションはありませんでした。</p>
<p>グーグルに関しては、共著者の一人から数日前に返信があった。その返事は、RaBitQの最適性に関する不正確な記述を修正するためにarXivのバージョンを改訂するというものでした。</p>
<p><strong>Zilliz：</strong>以前の議論は、学術的不正行為という枠組みでした。今は、不均衡の問題や、誰がストーリーを形成するのかという問題のようにも聞こえます。自分の研究を守るのが難しいのはなぜですか？</p>
<p><strong>チェン・ロング</strong>一つの問題は規模です。AIカンファレンスは今や非常に大規模で、1サイクルで数万件の論文が集まることもあります。主催者は、この種の論争をすべて処理する能力を持ち合わせていないのです。</p>
<p>もうひとつの問題は不均衡だ。大企業は公的な発言力がはるかに強い。独立した研究者や小規模なチームには、同じような発信力はありません。</p>
<p><strong>ジェンヤン・ガオ</strong>個人にとって、そのコストは非常に高い。ロング教授と私はここ数週間、ほとんど普通に仕事ができていない。</p>
<p>プロセス自体にもフラストレーションが溜まっています。著者に連絡してもきっぱりと断られましたし、学会主催者からも何の反応もありませんでした。実際には、多くの研究者がこのような状況を見て、放っておくことを決める。しかし、そうやって多くの独創的な貢献が世間の物語から消えていくのもまた事実なのです。</p>
<p><strong>Zilliz：</strong>あなたのチームがこの種の問題に遭遇したのは、今回が初めてではなさそうですね。</p>
<p><strong>チェン・ロン：</strong>いいえ、そうではありません。</p>
<p>私たちは以前にも、企業がRaBitQをパクり、技術的に少し手を加え、新しい名前をつけて、RaBitQにインスパイアされたものだとだけ説明するケースを見たことがあります。</p>
<p>だからこそ、私はmilvusを含むいくつかの業界チームの扱い方を高く評価している。RaBitQを使用するときは、それを客観的に説明する。そして、オリジナル・バージョン以上の最適化を加えるときは、それを自分たちのエンジニアリングの貢献として明確に説明する。そうすることで、オリジナル作品への適切なクレジットを示すと同時に、自社の技術力をアピールすることができる。</p>
<p><strong>Zilliz：</strong>大企業がアカデミックな研究をベースにする場合、通常、金銭的な分配や利益配分を行うのでしょうか？</p>
<p><strong>ジェンヤン・ガオ：</strong>ほとんどの場合、ありません。</p>
<p>とはいえ、大企業には、技術的な進歩を他者から採用したものではなく、自社で生み出したものであると示す強い動機があります。顧客や投資家にとって、最先端の研究は自分たちのチームの技術革新の成果だと思われたいのです。</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">ベクトル量子化の次に来るものは何でしょうか？<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>現在取り組んでいる研究の方向性は？</p>
<p><strong>チェン・ロン</strong>私たちの研究の大部分は、引き続きベクトル検索に焦点を当てています。</p>
<p>一つの方向性は、RaBitQをIVFやHNSWのような異なるベクトル検索インデックスと組み合わせることで、システムがより大きなスケールのデータを、より低いレイテンシ、より高い同時実行性、より低いコストでサポートできるようにすることです。KVキャッシュ圧縮にも注目しています。</p>
<p><strong>高 建陽</strong>大規模モデルのKVキャッシュとベクトル検索は、どちらも高次元ベクトルを扱うため、数学的にもシステムレベルでも多くの共通点があります。</p>
<p>今後は、高次元確率からのアイデアも含め、数学的ツールをどのように適用して推論や学習を加速させるかについてもっと考えたい。</p>
<p><strong>Zilliz：</strong>分野としてのベクトル量子化の限界はどこにあるのでしょうか？改善の余地はどの程度残されているのでしょうか？</p>
<p><strong>チェン・ロン</strong>理論的な観点からは、天井はほぼ見えています。RaBitQはすでに漸近的に最適化されています。</p>
<p>しかし、エンジニアリングの面ではまだ大きな余地があります。ハードウェアの特性、データの分散、待ち時間の制約、その他多くの現実的な要因に対処しなければなりません。<a href="https://milvus.io/docs/architecture_overview.md">分散ベクトルデータベースアーキテクチャ</a>、<a href="https://milvus.io/docs/sparse_vector.md">スパースベクトルサポート</a>、<a href="https://milvus.io/docs/reranking.md">リランキングパイプライン</a>、<a href="https://milvus.io/docs/metric.md">milvus距離</a>メトリクスにおけるメトリック選択などの分野で、実運用システムに慎重な作業が必要な理由はまさにそこにある。</p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQの工学的な側面やMilvusへの適合をより深く知りたいのであれば、以下が最も関連するリソースです：</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ documentation</a>- 設定の詳細とチューニングガイド。</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ統合のディープダイブ</a>- MilvusがどのようにRaBitQをプロダクションインデックスにしたか。</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">ベクトル量子化はAIインフラコストにどのように影響するか</a>- TurboQuant-RaBitQの議論に関する広範な分析。</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus2.6リリースポスト</a>- IVF_RABITQがMilvusインデックスオプションとして出荷されました。</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvusインデックス解説</a>- IVF_RABITQと他のインデックスの組み合わせについて。</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLATインデックスと</a> <a href="https://milvus.io/docs/hnsw.md">HNSWインデックス</a>- インデックスのトレードオフを比較する場合に有用なベースライン。</li>
<li><a href="https://milvus.io/docs/schema.md">Milvusにおけるスキーマ設計と</a> <a href="https://milvus.io/docs/filtered-search.md">フィルター検索</a>- RaBitQを単独ではなく実際のアプリケーションで評価する場合に有用。</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタートと</a> <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGシステム設計</a>- 検索パイプラインで試してみたい場合に役立ちます。</li>
</ul>
<p><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加するか、<a href="https://milvus.io/office-hours">Milvusオフィスアワーを予約して</a>ください。</p>
<p>インフラストラクチャのセットアップを省略したい場合は、<a href="https://cloud.zilliz.com/signup">Zillizクラウド</a>（フルマネージドMilvus<a href="https://cloud.zilliz.com/signup">）にサインアップする</a>ことができます。</p>
