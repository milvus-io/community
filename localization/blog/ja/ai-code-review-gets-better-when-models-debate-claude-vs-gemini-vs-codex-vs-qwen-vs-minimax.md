---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: AIコードレビューはモデルが議論すれば良くなる：クロード vs ジェミニ vs コーデックス vs クウェン vs ミニマックス
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  クロード、ジェミニ、コーデックス、クウェン、ミニマックスを実際のバグ検出でテストした。最良のモデルは53％を記録した。敵対的な議論の後、検出率は80%に跳ね上がった。
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>私は最近、AIモデルを使ってプルリクエストをレビューしたが、その結果は矛盾していた：クロードはデータ競合のフラグを立てたが、ジェミニはコードはクリーンだと言った。そこで、Claude、Gemini、Codex、Qwen、MiniMaxの最新のフラッグシップモデルを構造化コードレビューベンチマークにかけた。結果は？最高性能のモデルは、既知のバグの53％しか捕まえられなかった。</p>
<p>しかし、私の好奇心はそれだけでは終わらなかった。AIモデル同士を討論させる実験を行ったところ、5ラウンドの敵対的討論の後、バグ検出率は80％に跳ね上がった。最も難しいバグ、システムレベルの理解が必要なバグは、ディベート・モードで100％検出できた。</p>
<p>この投稿では、実験デザイン、モデルごとの結果、そしてディベートのメカニズムから明らかになった、コードレビューにAIを実際に使う方法について説明する。</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">コードレビューのためのClaude、Gemini、Codex、Qwen、MiniMaxのベンチマーク<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>コードレビューのためにモデルを使用している場合、おそらく精度が異なるだけでなく、コードをどのように読み取るかが異なることにお気づきでしょう。例えば</p>
<p>Claudeは通常、コールチェーンを上から下まで歩き、「退屈な」パス（エラー処理、再試行、クリーンアップ）に時間をかける。そこに本当のバグが隠れていることが多いので、その徹底ぶりは嫌いではない。</p>
<p>双子座は強い評決（「これはダメだ」／「問題なさそうだ」）から始まり、設計／構造の角度からそれを正当化するために逆算する傾向がある。それが役に立つこともある。時には、ざっと読んでからテイクにコミットしたように読めることもある。</p>
<p>コーデックスはもっと静かだ。しかし、何かにフラグを立てるとき、それはしばしば具体的で実行可能なものである。</p>
<p>しかし、これは印象であって、測定ではない。実際の数字を得るために、私はベンチマークを設定した。</p>
<h3 id="Setup" class="common-anchor-header">セットアップ</h3><p><strong>5つのフラッグシップモデルをテストした：</strong></p>
<ul>
<li><p>クロード・オーパス4.6</p></li>
<li><p>ジェミニ3プロ</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>ミニマックス-M2.5</p></li>
</ul>
<p><strong>ツール（Magpie）</strong></p>
<p><a href="https://github.com/liliu-z/magpie">Magpieは</a>、私が構築したオープンソースのベンチマークツールである。Magpieの仕事は、通常手作業で行う「コードレビューの前準備」を行うことだ。周囲のコンテキスト（コールチェーン、関連モジュール、関連する隣接コード）を取り込み、PRをレビューする<em>前に</em>それをモデルに与える。</p>
<p><strong>テストケース（既知のバグを含むMilvus PR）</strong></p>
<p>データセットは、<a href="https://github.com/milvus-io/milvus">Milvus</a>（<a href="https://zilliz.com/">Zillizによって</a>作成・保守されているオープンソースのベクターデータベース）からの15のプルリクエストで構成されている。これらのPRはベンチマークとして有用です。なぜなら、それぞれがマージされた後、本番環境でバグが表面化し、リバートやホットフィックスが必要になったからです。つまり、どのケースにも既知のバグがあり、それに対してスコアをつけることができるのです。</p>
<p><strong>バグの難易度</strong></p>
<p>とはいえ、すべてのバグが同じように見つけにくいわけではないので、3つの難易度に分類しました：</p>
<ul>
<li><p><strong>L1：</strong>差分だけでわかる（use-after-free、off-by-one）。</p></li>
<li><p><strong>L2（10件）：</strong>L2（10件）：インターフェイスのセマンティック変更や並行競合などを発見するために、周囲のコードを理解する必要がある。日常的なコードレビューで最もよく見られるバグである。</p></li>
<li><p><strong>L3（5件）：</strong>モジュール間の状態の不整合やアップグレードの互換性の問題などを発見するために、システムレベルの理解が必要です。これらは、モデルがコードベースについてどれだけ深く推論できるかの最も難しいテストです。</p></li>
</ul>
<p><em>注：どのモデルもL1のバグをすべて捕まえたので、採点から除外した。</em></p>
<p><strong>2つの評価モード</strong></p>
<p>各モデルは2つのモードで実行された：</p>
<ul>
<li><p><strong>Raw：</strong>モデルはPR（差分＋PRの中身）だけを見る。</p></li>
<li><p><strong>R1：</strong>モデルがレビューする<em>前に、</em>Magpieが周囲のコンテキスト（関連ファイル／コールサイト／関連コード）をプルする。これは、モデルに必要なものを推測してもらう代わりに、前もってコンテキストを準備するワークフローをシミュレートします。</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">結果（L2 + L3のみ）</h3><table>
<thead>
<tr><th>モード</th><th>クロード</th><th>ジェミニ</th><th>コーデックス</th><th>ミニマックス</th><th>クウェン</th></tr>
</thead>
<tbody>
<tr><td>生</td><td>53% (1位)</td><td>13%（最下位）</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1（カササギによるコンテクスト付き）</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>4つの要点</p>
<p><strong>1.クロードが生レビューを支配している。</strong>総合的な検出率は53％、L3バグの検出率は5/5という完璧なスコア。単一のモデルを使用し、コンテキストの準備に時間をかけたくないのであれば、Claudeは最良の選択だ。</p>
<p><strong>2.ジェミニはコンテキストを手渡される必要がある。</strong>生のスコアは13%でグループ最低だったが、Magpieが周囲のコードを提供することで、33%に跳ね上がった。ジェミニは独自のコンテキストをうまく収集できないが、その作業を前もって行えば、立派なパフォーマンスを発揮する。</p>
<p><strong>3.Qwenは、最も強力なコンテキストアシスト能力を持つ。</strong>R1モードで40％、L2バグで5/10を記録し、この難易度では最高得点だった。コンテクストを準備することを厭わない日常的なレビューには、Qwenは実用的な選択だ。</p>
<p><strong>4.文脈が多ければいいというものでもない。</strong>Gemini（13％→33％）とMiniMax（27％→33％）を引き上げたが、実際にはClaude（53％→47％）を苦しめた。クロードはすでにそれ自体でコンテキストの整理に秀でているため、追加された情報は明瞭さよりもノイズをもたらした可能性が高い。教訓：ワークフローをモデルに合わせるのであって、コンテキストが多ければ多いほど万能だと考えるのではないのだ。</p>
<p>これらの結果は、私の日々の経験と一致している。クロードがトップなのは驚くべきことではない。Geminiのスコアが予想より低かったのは、後から考えると納得がいく。私は通常、デザインを反復したり、一緒に問題を追いかけたりする複数ターンの会話でGeminiを使うが、そのようなインタラクティブな場面でGeminiは良いパフォーマンスを発揮する。このベンチマークは固定されたシングルパスのパイプラインであり、まさにGeminiが最も苦手とする形式である。この後のディベートのセクションでは、Geminiに多ラウンドの敵対的な形式を与えると、その性能が顕著に向上することを示す。</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">AIモデル同士にディベートをさせる<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>どのモデルも、それぞれのベンチマークで異なる強みと盲点を示した。そこで私は、コードだけでなく、モデル同士がお互いの仕事をレビューしたらどうなるかを試してみたかった。</p>
<p>そこで、同じベンチマークの上にディベートのレイヤーを追加した。5人のモデル全員が5ラウンドに参加する：</p>
<ul>
<li><p>ラウンド1では、各モデルが同じPRを単独でレビューする。</p></li>
<li><p>ラウンド1では、各モデルが同じPRを独自にレビューする。</p></li>
<li><p>ラウンド2では、各モデルが他の4人のレビューに基づいて自分のポジションを更新する。</p></li>
<li><p>これを第5ラウンドまで繰り返す。</p></li>
</ul>
<p>最終的には、各モデルは単にコードに反応するだけでなく、すでに何度も批判され修正された議論に反応することになる。</p>
<p>LLMの大合唱」にならないように、私は一つの厳しいルールを課した。<strong>すべての主張は、証拠として具体的なコードを指し示す必要が</strong>あり、モデルは単に「良い指摘だ」と言うことはできない。</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">結果ベスト・ソロ対ディベート・モード</h3><table>
<thead>
<tr><th>モード</th><th>L2 (10件)</th><th>L3（5件）</th><th>総検出数</th></tr>
</thead>
<tbody>
<tr><td>個人ベスト（生クロード）</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>ディベート（5モデルすべて）</td><td>7/10 （ダブル）</td><td>5/5（すべてキャッチ）</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">目立った点</h3><p><strong>1.L2検出が倍増。</strong>ルーティンで中難度のバグが3/10から7/10に急増。これらは実際のコードベースで最も頻繁に現れるバグであり、まさに個々のモデルが一貫性のないミスをするカテゴリーである。ディベート・メカニズムの最大の貢献は、こうした日常的なギャップを埋めることにある。</p>
<p><strong>2.L3バグ：ミスゼロ。</strong>単一モデルの実行では、5つのL3システムレベルのバグをすべて捕まえたのはクロードだけだった。つまり、L3を完全にカバーするために正しいモデルに賭ける必要がなくなったのだ。</p>
<p><strong>3.ディベートは天井を上げるのではなく、盲点を埋める。</strong>システムレベルのバグは、最強の個人にとって難しい部分ではなかった。クロードにはすでにそれがあった。ディベート・メカニズムの中心的な貢献は、クロードの弱点であった日常的なL2バグを修正することであり、クロード個人は10個中3個しか捕まえられなかったが、ディベート・グループは7個を捕まえた。53％から80％へのジャンプはここから来ている。</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">ディベートの実際</h3><p>上記の数字は、ディベートが機能することを示しているが、具体的な例は、<em>なぜ</em>機能するのかを示している。ここでは、検索時に主キーの遅延読み込みを導入した<strong>PR #44474を</strong>5つのモデルがどのように扱ったかを凝縮したウォークスルーを紹介する。</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474：</strong></a>遅延ロードの最適化により、検索時にすべての主キーを前もってロードするのではなく、必要に応じて主キーをフェッチするように変更した。</p>
<p><strong>第1ラウンド</strong></p>
<p>ジェミニは攻撃的に始まった：</p>
<p>このPRは、バッドプラクティス、潜在的な未定義の動作、"最適化 "を装ったパフォーマンス後退の地雷原だ」。</p>
<p>クロードとクウェンは、未定義の動作とパフォーマンスに焦点を当て、同じ懸念に収束させた：</p>
<p>「C++のメモリ・モデルは、適切な同期化なしに同じベクトルの異なるインデックスに同時に書き込む場合の安全性を保証していない。</p>
<p>C++のメモリモデルは、適切な同期がない限り、同じベクトルの異なるインデックスへの同時書き込みの安全性を保証しない。<code translate="no">primary_keys_</code> 、ベクトルはリサイズされるが、リデュースフェーズを通過した位置だけが実際に入力される。それ以外の位置はゼロのままなのだ。</p>
<p><strong>第2ラウンド</strong></p>
<p>クロードはコーデックスの発見を拾い上げ、下流の結果をたどった：</p>
<p>「<code translate="no">ReduceResultData</code> の前に<code translate="no">SortEqualScoresByPks</code> が実行される。つまり、<code translate="no">SortEqualScoresByPks</code> が実行されたときには、まだPKは0個しかフェッチされていない。<code translate="no">primary_keys_</code> 、ベクトル全体がデフォルトで構成されたPkType値でいっぱいになる。"</p>
<p>平たく言えば、ソート関数はキーがロードされる前に実行されるので、ゼロをソートしているのだ。クロードはこのミスを率直に認めた：</p>
<p>「codex-cliは正真正銘の重大なバグを発見した。私は最初のラウンドでこのバグを見逃してしまいました。</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">最も多くのバグを発見できるモデルの組み合わせは？<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>53％から80％へのジャンプは、5つのモデルが互いの死角をカバーしたために起こった。しかし、誰もがコードレビューのたびに5つのモデルをセットアップし、5ラウンドのディベートを実行する余裕があるわけではない。</p>
<p><strong>そこで私は、より単純なバージョンをテストしてみた。2つのモデルしか実行できない場合、どのペアがマルチモデルの上限に最も近づけるだろうか？</strong></p>
<p><strong>コンテキスト・アシスト（R1）を使って</strong>実行し、各モデルが15個の既知のバグのうちいくつを発見したかを数えた：</p>
<ul>
<li><p><strong>クロード：</strong>7/15 (47%)</p></li>
<li><p><strong>クウェン：</strong>6/15（40）</p></li>
<li><p><strong>ジェミニ：</strong>5/15（33）</p></li>
<li><p><strong>ミニマックス：</strong>5/15（33）</p></li>
<li><p><strong>コーデックス</strong>4/15 (27%)</p></li>
</ul>
<p>重要なのは、各モデルがどれだけのバグを発見したかではなく、<em>どの</em>バグを見逃したかである。Claudeが見逃した8つのバグのうち、Geminiは3つを発見した：並行処理の競合状態、クラウドストレージAPIの互換性の問題、パーミッションチェックの欠落である。逆に、Geminiはほとんどのデータ構造とディープロジックのバグを見逃し、Claudeはそれらのほとんどすべてを捕まえた。両者の弱点はほとんど重なっておらず、それが両者を強力なペアにしている。</p>
<table>
<thead>
<tr><th>2つのモデルの組み合わせ</th><th>複合カバレッジ</th></tr>
</thead>
<tbody>
<tr><td>クロード＋ジェミニ</td><td>10/15</td></tr>
<tr><td>クロード＋クウェン</td><td>9/15</td></tr>
<tr><td>クロード＋コーデックス</td><td>8/15</td></tr>
<tr><td>クロード＋ミニマックス</td><td>8/15</td></tr>
</tbody>
</table>
<p>全5モデルで15個中11個をカバーし、全モデルが外したバグが4個残っている。</p>
<p><strong>クロード＋ジェミニの</strong>2モデルペアは、すでに5モデルの上限の91％に達している。このベンチマークでは、最も効率的な組み合わせだ。</p>
<p>とはいえ、クロード＋ジェミニは、あらゆる種類のバグに対してベストな組み合わせというわけではない。結果をバグカテゴリー別に分類してみると、より微妙な図式が浮かび上がってきた：</p>
<table>
<thead>
<tr><th>バグの種類</th><th>バグの種類</th><th>クロード</th><th>ジェミニ</th><th>コーデックス</th><th>ミニマックス</th><th>クウェン</th></tr>
</thead>
<tbody>
<tr><td>バリデーションギャップ</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>データ構造のライフサイクル</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>同時実行レース</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>互換性</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>ディープロジック</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>合計</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>バグの種類別内訳を見ると、なぜ単一の組み合わせが普遍的にベストでないのかがわかる。</p>
<ul>
<li><p>データ構造のライフサイクルのバグでは、クロードとミニマックスが3/4で並んだ。</p></li>
<li><p>検証ギャップについては、クロードとQwenが3/4で並んだ。</p></li>
<li><p>並行性と互換性の問題では、Claudeはどちらも0点で、Geminiがこれらのギャップを埋めている。</p></li>
<li><p>すべてをカバーするモデルはないが、Claudeは最も広い範囲をカバーし、ジェネラリストに最も近い。</p></li>
</ul>
<p>すべてのモデルで4つのバグが見落とされた。1つはANTLRの文法規則の優先順位に関するもの。1つは関数間の読み取り/書き込みロックのセマンティックの不一致。1つはコンパクションタイプ間のビジネスロジックの違いを理解する必要があった。そして1つは、ある変数がメガバイトを使用し、別の変数がバイトを使用するというサイレント比較エラーであった。</p>
<p>これら4つに共通しているのは、コードが構文的に正しいということだ。バグがあるのは、開発者が頭の中に抱えた思い込みの中であって、diffの中ではなく、周囲のコードの中ですらないのだ。AIによるコードレビューが限界に達するのは、だいたいこのあたりだ。</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">バグを見つけた後、どのモデルがバグを修正するのに最適なのか？<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>コードレビューにおいて、バグを見つけることは仕事の半分である。もう半分はバグを修正することだ。そこで、討論ラウンドの後、各モデルの修正提案が実際にどの程度役に立つかを測定するために、相互評価を加えました。</p>
<p>これを測定するために、私はディベートの後に相互評価ラウンドを追加した。各モデルは新しいセッションを開き、匿名の審査員として他のモデルのレビューを採点した。5人のモデルはランダムにレビュアーA/B/C/D/Eにマッピングされたので、どのモデルがどのレビューを作成したかは審査員にはわからない。各審査員は、「正確さ」「実行可能性」「深さ」「わかりやすさ」の4つの次元について、1～10で採点した。</p>
<table>
<thead>
<tr><th>モデル</th><th>正確さ</th><th>実用性</th><th>深さ</th><th>明確さ</th><th>全体</th></tr>
</thead>
<tbody>
<tr><td>クウェン</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8.6（1位タイ）</td></tr>
<tr><td>クロード</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8.6（1位タイ）</td></tr>
<tr><td>コーデックス</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>ジェミニ</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>ミニマックス</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>クウェンとクロードが圧倒的な差で首位に並んだ。コーデックス、ジェミニ、ミニマックスが1ポイント以上下回るのに対し、両者は4つの次元すべてにおいて一貫して高得点をマークした。特筆すべきは、ペアリング分析でクロードのバグ発見パートナーとして貴重な役割を果たしたジェミニが、レビューの質では最下位に近い順位につけていることだ。問題を発見するのが得意なことと、それを修正する方法を説明するのが得意なことは、明らかに異なるスキルである。</p>
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
    </button></h2><p><strong>クロードは</strong>最も難しいレビューを任せられる選手だ。コールチェーン全体を通して作業し、深いロジックの経路をたどり、あなたが匙を投げなくても独自のコンテキストを引き出してくれる。L3システムレベルのバグに関しては、他の追随を許さない。数学を過信することもあるが、他のモデルで間違っていることが証明されると、それを自分のものとし、自分の推論がどこで破綻したかを説明してくれる。コア・コードや絶対に見逃せないバグに使ってほしい。</p>
<p><strong>双子座は</strong>熱い。コードのスタイルやエンジニアリングの基準について強い意見を持っており、問題を構造的にとらえるのが早い。欠点は、表面的な部分に留まることが多く、十分に深く掘り下げないことである。ジェミニの真価が発揮されるのは、チャレンジャーとしての役割だ。そのプッシュバックは、他のモデルに自分の仕事を再チェックさせる。クロードと組ませれば、クロードが時々省略する構造的な視点を得ることができる。</p>
<p><strong>コーデックスは</strong>ほとんど言葉を発しない。しかし、それが重要な意味を持つ。実際のバグに対するヒット率は高く、他の誰もが素通りしてしまうようなバグを見つけるコツをつかんでいる。PR #44474の例で言えば、Codexはゼロバリューの主キーの問題を発見したモデルであり、それが一連の問題の発端となった。Codexは、プライマリーモデルが見逃したものをキャッチする補助的なレビュアーだと考えてほしい。</p>
<p><strong>Qwenは</strong>5人の中で最も充実している。そのレビューの質はクロードに匹敵し、特に異なる視点をまとめて実際に行動できる修正提案にまとめるのがうまい。また、コンテクスト・アシスト・モードでのL2検出率も最も高く、日常的なPRレビューのデフォルトとして使える。唯一の弱点は、長い複数ラウンドのディベートでは、以前の文脈を見失い、後のラウンドで一貫性のない答えを出し始めることがあることだ。</p>
<p><strong>MiniMaxは</strong>、自分でバグを見つけるのが最も苦手である。単体のレビュアーとしてではなく、複数モデルのグループを埋めるために使うのがベストだろう。</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">この実験の限界<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>この実験にはいくつかの注意点があります：</p>
<p><strong>サンプルサイズは小さい。</strong>サンプル数はわずか15件で、すべて同じGo/C++プロジェクト（milvus）からのものです。これらの結果は、すべての言語やコードベースに一般化できるわけではありません。確定的なものではなく、方向性を示すものとして扱ってください。</p>
<p><strong>モデルは本質的にランダムである。</strong>同じプロンプトを2回実行すると、異なる結果が出る可能性がある。この記事の数値は1回のスナップショットであり、安定した期待値ではありません。個々のモデルのランキングは軽く見るべきだが、より広い傾向（ディベートが個人を上回り、異なるモデルが異なるバグタイプを得意とする）は一貫している。</p>
<p><strong>発言順を修正しました。</strong>ディベートは全ラウンドで同じ順番を使用したため、後から発言したモデルの反応に影響を与えた可能性がある。将来の実験では、ラウンドごとに順番をランダムにすることで、この点をコントロールできるだろう。</p>
<h2 id="Try-it-yourself" class="common-anchor-header">自分でやってみる<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>この実験のすべてのツールとデータはオープンソースです：</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>：コードコンテキスト（コールチェーン、関連するPR、影響を受けるモジュール）を収集し、コードレビューのための複数モデルの敵対的議論を編成するオープンソースツール。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>：完全な評価パイプライン、設定、スクリプト。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>テストケース</strong></a>：既知のバグが注釈された15個のPRすべて。</p></li>
</ul>
<p>この実験でのバグはすべて、AIアプリケーション用に構築されたオープンソースのベクトルデータベースである<a href="https://github.com/milvus-io/milvus">Milvusの</a>実際のプルリクエストから得られたものである。私たちは<a href="https://discord.com/invite/8uyFbECzPX">Discordや</a> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackで</a>かなり活発なコミュニティを持っているので、もっと多くの人にコードを覗いてもらいたい。もしこのベンチマークを自分のコードベースで実行することになったら、ぜひ結果をシェアしてほしい！異なる言語やプロジェクトでもこの傾向が保たれるのか、とても興味があります。</p>
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 ディープシンク：あなたのAIエージェントスタックに合うモデルは？</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">軽量 memsearch プラグインでクロードコードに永続メモリを追加する</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClawのメモリシステムを抽出してオープンソース化した（memsearch）</a></p></li>
</ul>
