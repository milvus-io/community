---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: MilvusにおけるNVIDIA CAGRAの最適化：GPUとCPUのハイブリッドアプローチによるインデックス作成の高速化とクエリの低コスト化
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: Milvus2.6のGPU_CAGRAが、GPUによる高速なグラフ構築とCPUによるスケーラブルなクエリ処理をどのように使い分けているかをご紹介します。
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>AIシステムが実験から生産インフラに移行するにつれ、ベクトル・データベースはもはや数百万の埋め込みを扱うことはなくなった。<strong>今や数十億は日常茶飯事であり、数百億はますます一般的になっている。</strong>このような規模では、アルゴリズムの選択はパフォーマンスやリコールに影響するだけでなく、インフラコストにも直結します。</p>
<p>つまり、<strong>計算リソースの使用量を制御不能に陥らせることなく、許容可能なリコールとレイテンシを実現するために適切なインデックスをどのように選択するかということです。</strong></p>
<p><strong>NSW、HNSW、CAGRA、Vamanaなどの</strong>グラフベースのインデックスが最も広く採用されている。あらかじめ構築された近傍グラフをナビゲートすることで、これらのインデックスは、ブルートフォーススキャンやクエリに対するすべてのベクトルの比較を回避し、億単位での高速最近傍検索を可能にします。</p>
<p>しかし、このアプローチのコストプロファイルにはばらつきがある。<strong>グラフのクエリは比較的安価だが、グラフの構築はそうではない。</strong>高品質のグラフを構築するには、大規模な距離計算と、データセット全体にわたる反復的な改良が必要です。</p>
<p>NVIDIAのCAGRAは、GPUを使用して大規模な並列処理によりグラフ構築を高速化することで、このボトルネックに対処します。これにより構築時間は大幅に短縮されますが、インデックス構築とクエリ処理の両方をGPUに依存することは、本番環境においてより高いコストとスケーラビリティの制約をもたらします。</p>
<p>これらのトレードオフのバランスをとるため、<a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1では</a> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a> <strong>インデックスに</strong> <strong>ハイブリッド設計を採用して</strong>います：<strong>GPUはグラフ構築のみに使用され、クエリ実行はCPUで実行されます。</strong>これにより、GPUで構築されたグラフの品質の優位性を維持しながら、クエリ処理のスケーラビリティとコスト効率を維持することができ、データの更新頻度が低く、クエリ量が多く、コストに厳しいワークロードに特に適しています。</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">CAGRAとは何か、どのように機能するのか？<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>グラフベースのベクトルインデックスは一般的に2つの主要なカテゴリに分類される：</p>
<ul>
<li><p><strong>CAGRAに</strong>代表される<strong>反復的グラフ構築</strong>（Milvusでは既にサポートされています）。</p></li>
<li><p><strong>Vamanaに</strong>代表される<strong>挿入ベースのグラフ構築</strong>（現在Milvusで開発中）。</p></li>
</ul>
<p>これら2つのアプローチは、設計目標と技術的基盤が大きく異なるため、それぞれ異なるデータスケールとワークロードパターンに適しています。</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong>は、近似最近傍(ANN)探索のためのGPUネイティブアルゴリズムであり、大規模な近接グラフを効率的に構築し、クエリするために設計されています。GPU並列性を活用することで、CAGRAはグラフ構築を大幅に高速化し、HNSWのようなCPUベースのアプローチと比較して高スループットのクエリ性能を実現します。</p>
<p>CAGRAは<strong>NN-Descent (Nearest Neighbor Descent)</strong>アルゴリズムに基づいて構築されており、反復的な精密化によってk-nearest-neighbor (kNN)グラフを構築する。各反復において、近傍候補は評価され、更新され、データセット全体にわたってより質の高い近傍関係へと徐々に収束していく。</p>
<p>各改良ラウンドの後、CAGRAは<strong>2ホップ迂回枝刈りなどの</strong>グラフ枝刈り技術を追加適用<strong>し、</strong>探索品質を維持しながら冗長な辺を削除する。この洗練と枝刈りの反復の組み合わせにより、クエリ時に効率的にトラバースできる、<strong>コンパクトでありながらつながりの深いグラフが</strong>得られる。</p>
<p>洗練と刈り込みを繰り返すことで、CAGRAは<strong>大規模で高い再現性と低レイテンシの最近傍探索を</strong>サポートするグラフ構造を生成し、静的なデータセットや更新頻度の低いデータセットに特に適している。</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">ステップ1：NN-Descentによる初期グラフの構築</h3><p>NN-Descentは、ノード<em>uが</em> <em>vの</em>近傍であり、ノード<em>wが</em> <em>uの</em>近傍である場合、<em>wも</em> <em>vの</em>近傍である可能性が非常に高いという、シンプルだが強力な観察に基づいている。この推移的な性質により、このアルゴリズムはすべてのベクトルのペアを網羅的に比較することなく、効率的に真の最近傍を発見することができる。</p>
<p>CAGRAはグラフ構築アルゴリズムの中核としてNN-Descentを使用する。このプロセスは以下のように動作する：</p>
<p><strong>1.ランダムな初期化：</strong>各ノードはランダムに選択された隣人の小さな集合から開始し、大まかな初期グラフを形成する。</p>
<p><strong>2.隣人拡大：</strong>各反復において、ノードは現在の近傍とその近傍を集めて候補リストを形成する。アルゴリズムはノードとすべての候補の間の類似性を計算する。各ノードの候補リストは独立しているため、これらの計算を別々のGPUスレッドブロックに割り当て、大規模に並列実行することができます。</p>
<p><strong>3.候補リストの更新：</strong>アルゴリズムがノードの現在の近傍よりも近い候補を見つけた場合、より遠い近傍を入れ替え、ノードのkNNリストを更新する。何度も繰り返すことで、このプロセスはより質の高い近似kNNグラフを生成する。</p>
<p><strong>4.収束チェック：</strong>反復が進むにつれて、近傍の更新は少なくなる。更新された接続の数が設定されたしきい値を下回ると、アルゴリズムは停止し、グラフが効果的に安定したことを示す。</p>
<p>異なるノードの近傍展開と類似度計算は完全に独立しているため、CAGRAは各ノードのNN-Descentワークロードを専用のGPUスレッドブロックにマッピングします。この設計は大規模な並列処理を可能にし、従来のCPUベースの手法よりもグラフ構築を桁違いに高速化します。</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">ステップ2：2ホップ迂回によるグラフの刈り込み</h3><p>NN-Descentが完了した後のグラフは正確だが、密度が高すぎる。NN-Descentは意図的に余分な近傍候補を保持し、ランダムな初期化段階では弱いエッジや無関係なエッジを多数導入する。その結果、各ノードの次数は目標の次数の2倍、あるいは数倍になることが多い。</p>
<p>コンパクトで効率的なグラフを作成するために、CAGRAは2ホップ迂回枝刈りを適用する。</p>
<p>この考え方は簡単で、ノード<em>Aが</em>共有の隣人<em>Cを介して</em>間接的にノード<em>Bに</em>到達でき（パスA → C → Bを形成する）、この間接パスの距離が<em>A</em>-<em>B</em>間の直接距離と同程度である場合、直接エッジA → Bは冗長とみなされ、削除することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この枝刈り戦略の主な利点は、各辺の冗長性チェックが局所的な情報（2つの端点間の距離とその共有近傍）にのみ依存することである。各辺は独立して評価できるため、枝刈りステップは非常に並列化可能であり、GPUバッチ実行に自然に適合する。</p>
<p>その結果、CAGRAはGPU上で効率的にグラフを刈り込むことができ、検索精度を維持しながらストレージのオーバーヘッドを<strong>40-50%</strong>削減し、クエリ実行時のトラバーサル速度を向上させる。</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">MilvusにおけるGPU_CAGRA：何が違うのか？<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>GPUはグラフ構築に大きなパフォーマンス上の利点をもたらしますが、本番環境では現実的な課題に直面します：GPUリソースはCPUよりもはるかに高価であり、制限されています。インデックス構築とクエリ実行の両方がGPUのみに依存する場合、いくつかの運用上の問題がすぐに浮上します：</p>
<ul>
<li><p><strong>リソース利用率の低さ：</strong>クエリ・トラフィックは不規則かつバースト的であることが多いため、GPUは長時間アイドル状態となり、高価な計算能力を浪費する。</p></li>
<li><p><strong>高い導入コスト：</strong>ほとんどのクエリがGPUの性能をフルに活用していないにもかかわらず、クエリを提供するすべてのインスタンスにGPUを割り当てると、ハードウェアコストが上昇します。</p></li>
<li><p><strong>限られたスケーラビリティ：</strong>利用可能なGPUの数は、実行可能なサービス・レプリカの数に直接影響するため、需要に応じて拡張する能力が制限されます。</p></li>
<li><p><strong>柔軟性の低下：</strong>インデックス構築とクエリの両方がGPUに依存する場合、システムはGPUの可用性に縛られることになり、ワークロードをCPUに簡単にシフトすることができません。</p></li>
</ul>
<p>これらの制約に対処するため、Milvus 2.6.1では、<code translate="no">adapt_for_cpu</code> パラメータを通じてGPU_CAGRAインデックスの柔軟な導入モードを導入しています。このモードはハイブリッドワークフローを可能にします：CAGRAはGPUを使用して高品質のグラフインデックスを構築し、クエリ実行はCPUで実行される。</p>
<p>このセットアップでは、GPUは高速で高精度なインデックス構築という最も価値のある場所で使用され、CPUは大規模なクエリワークロードをはるかにコスト効率が高くスケーラブルな方法で処理する。</p>
<p>その結果、このハイブリッドアプローチは以下のような作業負荷に特に適している：</p>
<ul>
<li><p><strong>データの更新頻度が低く</strong>、インデックスの再構築が少ない。</p></li>
<li><p><strong>クエリー量が多く</strong>、安価なレプリカを多数必要とする。</p></li>
<li><p><strong>コスト感度が高く</strong>、GPUの使用量を厳しく管理する必要がある。</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">理解<code translate="no">adapt_for_cpu</code></h3><p>Milvusでは、<code translate="no">adapt_for_cpu</code> パラメータが、インデックス構築時にCAGRAインデックスがどのようにディスクにシリアライズされ、ロード時にどのようにメモリにデシリアライズされるかを制御します。構築時とロード時にこの設定を変更することで、MilvusはGPUベースのインデックス構築とCPUベースのクエリ実行を柔軟に切り替えることができます。</p>
<p>構築時とロード時の<code translate="no">adapt_for_cpu</code> の異なる組み合わせにより、4つの実行モードが生まれ、それぞれが特定の運用シナリオ向けに設計されています。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>構築時間 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>ロード時間 (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>実行ロジック</strong></th><th style="text-align:center"><strong>推奨シナリオ</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">GPU_CAGRAでビルド→HNSWとしてシリアライズ→HNSWとしてデシリアライズ→<strong>CPUクエリ</strong></td><td style="text-align:center">コスト重視のワークロード、大規模クエリ処理</td></tr>
<tr><td style="text-align:center"><strong>真</strong></td><td style="text-align:center"><strong>偽</strong></td><td style="text-align:center">GPU_CAGRAでビルド → HNSWとしてシリアライズ → HNSWとしてデシリアライズ →<strong>CPUクエリ</strong></td><td style="text-align:center">パラメータの不一致が発生した場合、後続のクエリはCPUにフォールバックされる</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>真</strong></td><td style="text-align:center">GPU_CAGRAで構築 → CAGRAとしてシリアライズ → HNSWとしてデシリアライズ →<strong>CPUクエリ</strong></td><td style="text-align:center">一時的なCPU検索を可能にしながら、オリジナルのCAGRAインデックスを保存用に保持する</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">GPU_CAGRAで構築 → CAGRAとしてシリアライズ → CAGRAとしてデシリアライズ →<strong>GPUクエリ</strong></td><td style="text-align:center">コストが二の次となるパフォーマンスクリティカルなワークロード</td></tr>
</tbody>
</table>
<p><strong>注：</strong> <code translate="no">adapt_for_cpu</code> メカニズムは一方向の変換のみをサポートします。CAGRAグラフ構造はHNSWが必要とする全ての近傍関係を保持しているので、CAGRAインデックスはHNSWに変換できる。しかし、HNSWインデックスはGPUベースのクエリに必要な追加構造情報がないため、CAGRAに戻すことはできない。その結果、ビルド時の設定は、長期的な展開とクエリ要件を考慮して慎重に選択する必要があります。</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">GPU_CAGRAをテストする<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>ハイブリッド実行モデル（インデックス構築にGPUを使用し、クエリ実行にCPUを使用する）の有効性を評価するために、標準化された環境で一連の制御された実験を行いました。この評価では、<strong>インデックス構築性能</strong>、<strong>クエリ性能</strong>、<strong>リコール精度の</strong>3つの側面に焦点を当てている。</p>
<p><strong>実験セットアップ</strong></p>
<p>実験は、結果の信頼性を維持し、広く適用できるように、広く採用されている業界標準のハードウェアで実施した。</p>
<ul>
<li><p>CPU：MD EPYC 7R13プロセッサー(16CPU)</p></li>
<li><p>GPUNVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1.インデックス構築性能</h3><p>GPUで構築したCAGRAとCPUで構築したHNSWを、同じターゲットグラフ次数64で比較した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主な結果</strong></p>
<ul>
<li><p><strong>GPU CAGRAはCPU HNSWより12-15倍高速にインデックスを構築する。</strong>Cohere1MとGist1Mの両方において、GPUベースのCAGRAはCPUベースのHNSWを大幅に上回り、グラフ構築時のGPU並列処理の効率性を強調。</p></li>
<li><p><strong>ビルド時間はNN-Descentの反復によって直線的に増加する。</strong>これは、NN-Descentの反復洗練の性質を反映し、構築コストとグラフ品質の間の予測可能なトレードオフを提供する。</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2.クエリー性能</h3><p>この実験では、CAGRA グラフを GPU 上で一度構築し、その後、2つの異なる実行経路を使用してクエリを実行する：</p>
<ul>
<li><p><strong>CPUクエリ</strong>：インデックスをHNSW形式にデシリアライズし、CPU上で検索する。</p></li>
<li><p><strong>GPUクエリ</strong>：GPUベースのトラバーサルを用いてCAGRAグラフ上で直接検索を実行する。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主な結果</strong></p>
<ul>
<li><p><strong>GPU検索のスループットはCPU検索より5-6倍高い。</strong>Cohere1MとGist1Mの両方で、GPUベースのトラバーサルは大幅に高いQPSを実現し、GPU上での並列グラフナビゲーションの効率性を強調している。</p></li>
<li><p><strong>リコールはNN-Descentの反復によって増加し、その後停滞する。</strong>ビルドの反復回数が増えるにつれて、CPUとGPUの両方のクエリでリコールが向上する。しかし、ある点を超えると、さらなる反復は、グラフ品質がほぼ収束したことを示すように、利得を減少させる。</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3.リコール精度</h3><p>この実験では、CAGRAとHNSWの両方をCPUでクエリし、同一のクエリ条件下での再現率を比較する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>主な結果</strong></p>
<p><strong>CAGRAは両方のデータセットでHNSWより高い回収率を達成</strong>し、CAGRAインデックスがGPU上で構築され、CPU検索のためにデシリアライズされた場合でも、グラフの品質は十分に保たれていることを示している。</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">次へVamanaによるインデックス構築の拡張<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusのGPUとCPUのハイブリッドアプローチは、今日の大規模ベクトル検索ワークロードに実用的でコスト効率の高いソリューションを提供します。GPUで高品質のCAGRAグラフを構築し、CPUでクエリを処理することで、高速なインデックス構築とスケーラブルで手頃な価格のクエリ実行を組み合わせて<strong>います</strong>。</p>
<p>数百<strong>億から数千億のベクトルという</strong>さらに大きなスケールでは<strong>、インデックス</strong>構築そのものがボトルネックになります。完全なデータセットがGPUメモリに収まらなくなると、業界では通常、<strong>Vamanaの</strong>ような<strong>挿入ベースのグラフ構築</strong>手法に移行します。Vamanaはグラフを一度に構築するのではなく、データをバッチ処理し、グローバルな接続性を維持しながら新しいベクトルをインクリメンタルに挿入します。</p>
<p>その構築パイプラインは、3つの重要な段階を踏む：</p>
<p><strong>1.</strong>1.<strong>幾何学的バッチ成長</strong>- スケルトン・グラフを形成するために小さなバッチから始め、並列性を最大化するためにバッチ・サイズを大きくし、最後に大きなバッチを使って詳細を洗練する。</p>
<p><strong>2.貪欲な挿入</strong>- 各新規ノードは、中央のエントリーポイントからナビゲートして挿入され、その隣接セットを反復的に洗練していく。</p>
<p><strong>3.後方エッジの更新</strong>- 対称性を保持し、効率的なグラフナビゲーションを保証するために、逆方向の接続を追加する。</p>
<p>プルーニングはα-RNG基準を用いて構築プロセスに直接組み込まれる：もし近傍候補<em>vが</em>既存の近傍<em>p′によって</em>すでにカバーされている場合（すなわち、<em>d(p′, v) &lt; α × d(p, v)</em>）、<em>vは</em>プルーニングされる。パラメータαは、スパース性と精度の精密な制御を可能にする。GPUによる高速化は、バッチ内並列処理と幾何学的バッチスケーリングによって達成され、インデックスの品質とスループットのバランスをとる。</p>
<p>これらの技術を組み合わせることで、チームはGPUメモリの制限に陥ることなく、急激なデータ増加や大規模なインデックス更新を処理することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusチームは、2026年前半のリリースを目標に、Vamanaサポートを積極的に構築しています。ご期待ください。</p>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH: LLMトレーニングデータの重複と戦う秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusのためにKafka/PulsarをWoodpeckerに置き換えた</a></p></li>
</ul>
