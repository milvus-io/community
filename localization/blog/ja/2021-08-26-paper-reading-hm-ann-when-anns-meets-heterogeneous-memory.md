---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: 論文リーディング｜HM-ANN ANNSとヘテロジニアスメモリの出会い
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: HM-ANN 効率的なヘテロジニアスメモリ上の10億点最近傍探索
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>論文リーディング ｜ HM-ANN：ANNSと異種メモリが出会うとき</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memoryは</a>、2020 Conference on Neural Information Processing Systems<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>)に採択された研究論文である。本論文では、HM-ANNと呼ばれるグラフベースの類似性探索のための新しいアルゴリズムを提案する。このアルゴリズムは、最新のハードウェア設定において、メモリの不均一性とデータの不均一性の両方を考慮する。HM-ANNは圧縮技術を用いずに、1台のマシンで10億スケールの類似性検索を可能にする。ヘテロジニアスメモリ(HM)は、高速だが小さいダイナミックランダムアクセスメモリ(DRAM)と、低速だが大きいパーシステントメモリ(PMem)の組み合わせを表す。HM-ANNは、特にデータセットがDRAMに収まらない場合に、低い探索レイテンシと高い探索精度を達成する。このアルゴリズムは、最新の近似最近傍(ANN)探索ソリューションに対して明確な優位性を持つ。</p>
<custom-h1>動機</custom-h1><p>ANN検索アルゴリズムは、その登場以来、DRAMの容量が限られているため、クエリの精度とクエリのレイテンシとの間に基本的なトレードオフが存在する。高速なクエリーアクセスのためにインデックスをDRAMに格納するためには、データポイント数を制限するか、圧縮されたベクトルを格納する必要がありますが、どちらも検索精度を低下させます。グラフベースのインデックス（HNSW：Hierarchical Navigable Small World）は、クエリ実行時の性能とクエリ精度に優れている。しかし、これらのインデックスは、億単位のデータセットで使用する場合、1TiBレベルのDRAMを消費します。</p>
<p>億スケールのデータセットを生フォーマットでDRAMに保存させないための回避策は他にもある。データセットが大きすぎて1台のマシンのメモリに収まらない場合、データセットのポイントの積量子化などの圧縮アプローチが使われる。しかし、量子化の際に精度が落ちるため、圧縮されたデータセットを用いたインデックスの再現性は通常低い。Subramanyaら[1]は、ソリッド・ステート・ドライブ（SSD）を活用し、生のデータセットがSSDに、圧縮された表現がDRAMに保存されるDisk-ANNと呼ばれるアプローチで、1台のマシンで10億スケールのANN検索を実現することを模索している。</p>
<custom-h1>ヘテロジニアスメモリ入門</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>ヘテロジニアスメモリ(HM)は、高速だが小さいDRAMと、低速だが大きいPMemの組み合わせを表している。DRAMは、最新のサーバーには必ず搭載されている通常のハードウェアであり、そのアクセスは比較的高速です。Intel® Optane™ DC Persistent Memory Modulesのような新しいPMemテクノロジーは、NANDベースのフラッシュ（SSD）とDRAMの間のギャップを埋め、I/Oボトルネックを解消します。PMemはSSDのように耐久性があり、メモリのようにCPUから直接アドレス指定が可能です。Renenら[2]は、設定された実験環境において、PMemの読み取り帯域幅がDRAMより2.6倍、書き込み帯域幅が7.5倍低いことを発見している。</p>
<custom-h1>HM-ANN設計</custom-h1><p>HM-ANNは、正確で高速な10億スケールのANN探索アルゴリズムであり、圧縮なしで1台のマシンで動作する。HM-ANNの設計はHNSWのアイデアを一般化したもので、その階層構造はHMに自然に適合する。HNSWは複数の層で構成され、第0層のみがデータセット全体を含み、残りの各層はその直下の層の要素のサブセットを含む。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>データセットのサブセットのみを含む上位レイヤーの要素は、ストレージ全体のごく一部を消費する。この観察から、これらの要素はDRAMに配置するのに適した候補となる。このように、HM-ANNの検索の大部分は上位層で行われることが予想され、DRAMの高速アクセス特性を最大限に活用することができる。しかし、HNSWの場合、ほとんどの検索は最下層で行われる。</li>
<li>最下層はデータセット全体を格納するため、PMemに配置するのに適している。 第0層へのアクセスは低速であるため、各クエリでアクセスされるのはごく一部とし、アクセス頻度を下げることが望ましい。</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">グラフ構築アルゴリズム<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>HM-ANNの構築のキーとなる考え方は、レイヤ0での検索により良いナビゲーションを提供するために、高品質な上位レイヤを作成することである。したがって、ほとんどのメモリアクセスはDRAMで行われ、PMemでのアクセスは削減される。これを可能にするため、HM-ANNの構築アルゴリズムにはトップダウン挿入フェーズとボトムアップ昇格フェーズがある。</p>
<p>トップダウン挿入フェーズでは、最下層のレイヤーをPMem上に配置し、ナビゲート可能なスモールワールドグラフを構築する。</p>
<p>ボトムアップ昇格フェーズでは、最下位レイヤからピボットポイントを昇格させ、精度をあまり落とさずにDRAM上に配置される上位レイヤを形成する。レイヤ0からの要素の高品質な投影がレイヤ1で作成された場合、レイヤ0での検索はわずか数ホップでクエリの正確な最近傍を見つける。</p>
<ul>
<li>HNSWのランダム選択による昇格の代わりに、HM-ANNは高次数の昇格戦略を用い、レイヤ0で最も次数の高い要素をレイヤ1に昇格させる。より高いレイヤでは、HM-ANNは昇格率に基づいて高次ノードを上位レイヤに昇格させる。</li>
<li>HM-ANNは、より多くのノードをレイヤ0からレイヤ1に昇格させ、レイヤ1の各要素の最大隣接数を大きく設定する。上位レイヤのノード数は、使用可能なDRAM容量によって決定されます。レイヤ0はDRAMに保存されないため、DRAMに保存される各レイヤをより密にすることで、探索品質が向上します。</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">グラフ探索アルゴリズム<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>探索アルゴリズムは、高速メモリ探索とプリフェッチによるレイヤ0の並列探索の2つのフェーズからなる。</p>
<h3 id="Fast-memory-search" class="common-anchor-header">高速メモリ探索</h3><p>HNSWと同様に、DRAM内の探索は最上層のエントリポイントから開始し、最上層から第2層まで1-greedy探索を行う。HM-ANNは、レイヤ0の探索空間を絞り込むために、レイヤ1の探索バジェットを<code translate="no">efSearchL1</code> 、レイヤ1の候補リストのサイズを制限して探索を行う。HNSWは1つのエントリーポイントしか使用しないが、HM-ANNではレイヤ0とレイヤ1の間のギャップは、他の2つのレイヤ間のギャップよりも特別に処理される。</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">プリフェッチによるレイヤ0の並列探索</h3><p>最下層では、HM-ANNはレイヤ1の探索で得られた前述の候補を均等に分割し、スレッドによる並列マルチスタート1-greedy探索を行うためのエントリーポイントとみなす。各探索から上位の候補を集め、最良の候補を見つける。周知のように、レイヤ1からレイヤ0に降りることは、まさにPMemに行くことである。 並列探索は、PMemの待ち時間を隠し、メモリ帯域幅を最大限に利用することで、探索時間を増加させることなく探索品質を向上させる。</p>
<p>HM-ANNは、DRAMにソフトウェアで管理されたバッファを実装し、メモリアクセスが発生する前にPMemからデータをプリフェッチする。レイヤ1を検索するとき、HM-ANNは非同期に<code translate="no">efSearchL1</code> 、候補の近傍要素とレイヤ1の近傍要素の接続をPMemからバッファにコピーする。レイヤ0の検索が行われるとき、アクセスされるデータの一部はすでにDRAMにプリフェッチされているため、PMemにアクセスする待ち時間が隠蔽され、問い合わせ時間の短縮につながる。これは、ほとんどのメモリアクセスがDRAMで行われ、PMemでのメモリアクセスが削減されるというHM-ANNの設計目標にマッチしている。</p>
<custom-h1>評価</custom-h1><p>本論文では、広範な評価を行った。すべての実験は、Intel Xeon Gold 6252 CPU@2.3GHz を搭載したマシンで行われた。高速メモリとして DDR4 (96GB)、低速メモリとして Optane DC PMM (1.5TB)を使用。5つのデータセットを評価した：BIGANN、DEEP1B、SIFT1M、DEEP1M、GIST1M。億スケールのテストには、以下のスキームが含まれる：億スケールの量子化ベースの手法（IMI+OPQとL&amp;C）、非圧縮ベースの手法（HNSWとNSG）。</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">億スケールのアルゴリズム比較<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>表1では、異なるグラフベースのインデックスの構築時間とストレージを比較している。HNSWが最も短い構築時間を要し、HM-ANNはHNSWより8%の追加時間を要する。HM-ANNはレイヤー0からレイヤー1へより多くのノードを昇格させるため、全体のストレージ使用量ではHSNWより5～13%大きい。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>図1では、異なるインデックスのクエリ性能を分析している。図1の(a)と(b)は、HM-ANNが1ms以内に95%以上のトップ1リコールを達成していることを示している。図1の©と(d)は、HM-ANNが4ms以内に90%以上のトップ100リコールを達成していることを示している。HM-ANNは、他のすべてのアプローチよりも優れた遅延対想起性能を提供する。</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">ミリオンスケールのアルゴリズム比較<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>図2では、純粋なDRAM環境における異なるインデックスのクエリ性能を分析しています。HNSW、NSG、およびHM-ANNが、DRAMに適合する3つのミリオンスケールのデータセットで評価されています。HM-ANNは依然としてHNSWよりも優れた問い合わせ性能を達成している。その理由は、HM-ANNの距離計算の総数がHNSW（平均900/クエリ）より少ない（平均850/クエリ）ためである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">高次プロモーションの効果<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>図3では、同じ構成でランダムプロモーションと高次プロモーション戦略を比較している。高次プロモーションはベースラインを上回っている。高次プロモーションはランダムプロモーションの1.8倍、4.3倍、3.9倍の速度で、それぞれ95%、99%、99.5%の想起目標に到達する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">メモリ管理技術のパフォーマンス上の利点<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>図5はHNSWとHM-ANNの間の一連のステップを含み、HM-ANNの各最適化がどのように改善に寄与するかを示している。BPはインデックス構築時のボトムアップ推進を表す。PL0はParallel layer-0探索を表し、DPはPMemからDRAMへのデータプリフェッチを表す。このように、HM-ANNの検索性能は一歩一歩向上している。</p>
<custom-h1>結論</custom-h1><p>HM-ANNと呼ばれる新しいグラフベースの索引付けと探索アルゴリズムは、グラフベースのANNの階層的設計とHMのメモリヘテロジニアリティをマッピングする。評価により、HM-ANNは10億点データセットにおける新しい最先端のインデックスに属することが示された。</p>
<p>我々は、産業界だけでなく学界においても、永続記憶装置上でのインデックス構築が注目されている傾向に注目している。しかし、HM-ANNの構築にはまだ数日かかり、Disk-ANNと比較して大きな差はない。例えば、PMemの粒度(256Byte)を意識し、キャッシュラインをバイパスするためにストリーミング命令を使用するなど、PMemの特性をより注意深く利用することで、HM-ANNの構築時間を最適化することが可能であると考えています。また、耐久性のあるストレージデバイスを用いたアプローチも今後提案されると考えられる。</p>
<custom-h1>参考文献</custom-h1><p>[1]:Suhas Jayaram Subramanya and Devvrit and Rohan Kadekodi and Ravishankar Krishaswamy and Ravishankar Krishaswamy：DiskANN: シングルノード上での高速高精度10億点最近傍探索, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: シングルノードでの高速高精度10億点最近傍探索 - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: シングルノード上での高速高精度10億点最近傍探索</a></p>
<p>[2]:Alexander van Renen、Lukas Vogel、Viktor Leis、Thomas Neumann、Alfons Kemper：永続メモリI/Oプリミティブ, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">永続メモリI/Oプリミティブ</a></p>
