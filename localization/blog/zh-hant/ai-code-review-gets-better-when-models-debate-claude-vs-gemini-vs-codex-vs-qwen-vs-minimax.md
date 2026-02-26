---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: 當模型爭論時，AI 代碼審查會變得更好：Claude vs Gemini vs Codex vs Qwen vs MiniMax
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
  我們對 Claude、Gemini、Codex、Qwen 和 MiniMax 進行了真實錯誤偵測測試。最佳模型的偵測率為
  53%。經過敵對辯論後，偵測率躍升到 80%。
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>我最近使用 AI 模型來審查一個 pull request，結果是矛盾的：Claude 標記出一個資料競賽，而 Gemini 則說程式碼是乾淨的。這讓我對其他 AI 模型的表現感到好奇，因此我將 Claude、Gemini、Codex、Qwen 和 MiniMax 的最新旗艦模型進行結構化程式碼檢閱基準測試。結果如何？表現最好的模型只抓到 53% 的已知錯誤。</p>
<p>然而，我的好奇心並未就此結束：如果這些 AI 模型一起工作會如何？我試著讓這些模型互相辯論，經過五輪對抗性的辯論後，錯誤偵測率躍升到 80%。在辯論模式下，最難的錯誤，也就是需要系統層級理解的錯誤，可以達到 100% 的偵測率。</p>
<p>這篇文章將介紹實驗設計、每個模型的結果，以及辯論機制對於如何實際使用 AI 進行程式碼檢閱的啟示。</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">以 Claude、Gemini、Codex、Qwen 及 MiniMax 作為程式碼檢閱的基準<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您一直使用模型來進行程式碼檢閱，您可能已經注意到它們不僅在準確度上有差異，在閱讀程式碼的方式上也有差異。舉例來說：</p>
<p>Claude 通常會從上至下走一遍呼叫鏈，並會在 「無聊 」的路徑（錯誤處理、重試、清理）上花時間。那往往是真正的 bug 隱藏的地方，所以我不討厭這種徹底性。</p>
<p>Gemini 傾向於以強烈的判斷 (「這不好」/「看起來很好」) 開始，然後從設計/結構的角度來反向證明其合理性。有時這是有用的。有時讀起來就像是略略看過，然後就決定了。</p>
<p>Codex 比較安靜。但當它標示某些東西時，往往是具體和可操作的 - 少了評論，多了 「這行是錯的，因為 X」。</p>
<p>但這些都是印象，而不是測量。為了得到實際的數字，我設定了一個基準。</p>
<h3 id="Setup" class="common-anchor-header">設定</h3><p><strong>測試了五款旗艦機種：</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>雙子星 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>工具 (Magpie)</strong></p>
<p>我使用<a href="https://github.com/liliu-z/magpie">Magpie</a>，這是我建立的開放原始碼基準測試工具。它的工作是做你通常會手動做的「程式碼檢閱準備」：<em>在</em>模型檢閱 PR<em>之前</em>，拉入周遭的上下文（呼叫鏈、相關模組和相鄰的相關程式碼）並將它餵給模型。</p>
<p><strong>測試案例 (有已知錯誤的 Milvus PR)</strong></p>
<p>資料集包含<a href="https://github.com/milvus-io/milvus">Milvus</a>(由<a href="https://zilliz.com/">Zilliz</a> 建立並維護的開放原始碼向量資料庫) 的 15 個 pull request。這些 PR 是有用的基準，因為每個 PR 都已合併，只是在生產中出現 bug 後需要回復或熱修正。因此每個案例都有一個已知的 bug，我們可以對其進行評分。</p>
<p><strong>錯誤難度等級</strong></p>
<p>但並非所有的 bug 都同樣難以發現，因此我將它們分為三個難度等級：</p>
<ul>
<li><p><strong>L1:</strong>單從 diff 就可以看出 (use-after-free, off-by-one)。</p></li>
<li><p><strong>L2 (10 個案例)：</strong>需要瞭解周遭的程式碼才能發現，例如介面語意變更或並發競賽。這些是日常程式碼檢閱中最常見的 bug。</p></li>
<li><p><strong>L3 (5 個案例)：</strong>需要系統層級的瞭解，才能發現跨模組的狀態不一致或升級相容性問題。這些是最難的測試，考驗模型對程式碼庫的推理能力有多深。</p></li>
</ul>
<p><em>注意：每個模型都能抓到所有 L1 的 bug，因此我將它們排除在評分之外。</em></p>
<p><strong>兩種評估模式</strong></p>
<p>每個模型都在兩種模式下執行：</p>
<ul>
<li><p><strong>Raw:</strong>模型只看到 PR (diff + PR 內容的任何東西)。</p></li>
<li><p><strong>R1：</strong>Magpie 會<em>在</em>模型檢閱<em>之前</em>，<em>先拉取</em>周遭的上下文 (相關檔案/呼叫站台/相關程式碼)。這模擬了一個工作流程，您在前面預先準備上下文，而不是要求模型猜測它需要什麼。</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">結果（僅 L2 + L3）</h3><table>
<thead>
<tr><th>模式</th><th>克勞德</th><th>雙子星</th><th>法典</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>原始</td><td>53% (第一名)</td><td>13% (最後)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (有喜鵲的上下文)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>四項心得</p>
<p><strong>1.Claude 在原始評測中佔主導地位。</strong>在沒有任何上下文輔助的情況下，它的整體偵測得分達到 53%，在 L3 錯誤上獲得 5/5 的滿分。如果您使用單一模型，又不想花時間準備上下文，Claude 是最佳選擇。</p>
<p><strong>2.Gemini 需要上下文交給它。</strong>它的原始分數為 13%，是組別中最低的，但有了 Magpie 提供周圍的程式碼後，它的原始分跳到了 33%。Gemini 不會很好地收集自己的上下文，但當您事先做這些工作時，它的表現還是可圈可點的。</p>
<p><strong>3.Qwen 是在上下文輔助下表現最好的。</strong>在 R1 模式下，它的得分率為 40%，L2 錯誤率為 5/10，是該難度下的最高分。對於你願意準備上下文的例行日常審查，Qwen 是一個實用的選擇。</p>
<p><strong>4.更多的上下文不一定有幫助。</strong>它提升了 Gemini (13% → 33%) 和 MiniMax (27% → 33%)，但實際上卻傷害了 Claude (53% → 47%)。Claude 本身已經很擅長組織上下文，因此額外的資訊很可能會帶來雜訊，而非清晰度。教訓：讓工作流程與模型相匹配，而不是假設上下文越多就越好。</p>
<p>這些結果與我的日常經驗相符。Claude 位居榜首並不令人驚訝。Gemini 的得分比我預期的低，這在事後看來是有道理的：我通常會在多輪會談中使用 Gemini，在會談中一起迭代設計或追尋問題，它在這種互動設定中表現良好。這個基準是一個固定、單次通過的流水線，這正是 Gemini 最弱的形式。稍後的辯論部分將顯示，當您給 Gemini 一個多回合、對抗式的形式時，它的表現會有明顯的改善。</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">讓 AI 模型互相辯論<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>在個別的基準測試中，每個模型都顯示出不同的優勢和盲點。因此我想要測試：如果模型互相檢閱彼此的工作，而不只是檢閱程式碼，會發生什麼情況？</p>
<p>因此我在相同的基準之上加入了一個辯論層。所有五個模型都參與五個回合：</p>
<ul>
<li><p>在第一回合中，每個模型獨立審閱相同的 PR。</p></li>
<li><p>之後，我將所有五個評論廣播給所有參與者。</p></li>
<li><p>在第二回合中，每個模型根據其他四個模型的評論更新自己的立場。</p></li>
<li><p>重複進行，直到第五回合。</p></li>
</ul>
<p>到最後，每個模型不只是對程式碼做出反應，而是對已經被批評和修改多次的論點做出反應。</p>
<p>為了避免這變成「LLMs 高聲同意」，我強制執行一個硬性規則：<strong>每個主張都必須指向特定的程式碼作為證據</strong>，而且模型不能只說「說得好」- 它必須解釋為什麼它改變了主意。</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">結果：最佳獨奏 vs 辯論模式</h3><table>
<thead>
<tr><th>模式</th><th>L2 (10 個案例)</th><th>L3 (5 個案例)</th><th>偵測總數</th></tr>
</thead>
<tbody>
<tr><td>最佳個人 (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>辯論 (全部五個模型)</td><td>7/10 (雙倍)</td><td>5/5 (全部抓到)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">突出的地方</h3><p><strong>1.L2 檢測增加一倍。</strong>常規、中等難度的 bug 從 3/10 跳到 7/10。這些都是真實程式碼庫中最常出現的 bug，也正是個別模型失誤率不一致的類別。辯論機制最大的貢獻就是縮小這些日常差距。</p>
<p><strong>2.L3 bug：零遺漏。</strong>在單一模型的執行中，只有 Claude 抓到所有五個 L3 系統層級的 bug。在辯論模式中，群組的結果與此相符，這意味著您不再需要押注於正確的模型來獲得完整的 L3 涵蓋範圍。</p>
<p><strong>3.辯論可以填補盲點，而不是提高上限。</strong>對於最強的個人來說，系統層級的 bug 並不是最難的部分。Claude 已經有那些了。辯論機制的核心貢獻是修補 Claude 在常規 L2 bug 上的弱點，Claude 個人只抓到 10 個中的 3 個，但辯論小組抓到了 7 個。這就是 53% → 80% 跳躍的來源。</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">辯論在實際中的表現</h3><p>上面的數字說明了辯論是有效的，但是一個具體的例子說明了它<em>為什麼</em>有效。以下是五個模型如何處理<strong>PR #44474</strong> 的精簡演練，<strong>PR #44474</strong> 在搜尋時引入了主索引鍵的偷懶載入。</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474：</strong></a>懶惰載入的最佳化，將搜尋改為依需求取得主索引鍵，而非事先載入所有主索引鍵。</p>
<p><strong>第一回合</strong></p>
<p>Gemini 開場咄咄逼人：</p>
<p>"這份 PR 是個雷區，充斥著不良實作、潛在的未定義行為，以及偽裝成 「最佳化」 的效能退步"。</p>
<p>Claude 和 Qwen 則專注於未定義行為和效能，並將焦點集中在相同的問題上：</p>
<p>「在沒有適當同步的情況下，C++ 記憶體模型無法保證對同一向量不同索引的並發寫入的安全性」。</p>
<p>這三個人都發現了真正的問題，但都沒有發現更深層次的錯誤。之後，Codex 幾乎還沒有發言，就指出了其他人所遺漏的東西：<code translate="no">primary_keys_</code> 向量會被重新調整大小，但實際上只有通過 reduce 階段的位置才會被填充。其他位置的值都是零。</p>
<p><strong>第二回合</strong></p>
<p>Claude 接下 Codex 的發現，並追蹤下游的後果：</p>
<p>"我找到了：<code translate="no">SortEqualScoresByPks</code> 在<code translate="no">ReduceResultData</code> 之前執行。因此，當<code translate="no">SortEqualScoresByPks</code> 執行時，還沒有偷懶地取得零個 PK。整個<code translate="no">primary_keys_</code> 向量都是預設建構的 PkType 值"。</p>
<p>簡單來說，排序函式是在載入鍵值之前執行的，所以它排序的是零。Claude 公開承認這個錯誤：</p>
<p>"codex-cli 發現了一個真正關鍵的正確性錯誤。我在第一輪就遺漏了這個問題。</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">哪種模型組合能找出最多錯誤？<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>從 53% 到 80% 的躍升是因為五個模型互相掩蓋了彼此的盲點。但不是每個人都能負擔得起為每次程式碼檢閱設定並運行五個模型進行五輪辯論。</p>
<p><strong>因此我測試了更簡單的版本：如果您只能執行兩個模型，哪一對能讓您最接近多模型上限？</strong></p>
<p>我使用<strong>上下文輔助 (R1)</strong>執行，並計算每個模型在 15 個已知錯誤中找到多少個：</p>
<ul>
<li><p><strong>Claude:</strong>7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong>6/15 (40%)</p></li>
<li><p><strong>雙子座：</strong>5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong>5/15 (33%)</p></li>
<li><p><strong>法典：</strong>4/15 (27%)</p></li>
</ul>
<p>因此，重要的不只是每個模型找到多少錯誤，而是它遺漏了<em>哪些</em>錯誤。在 Claude 遺漏的 8 個 bug 中，Gemini 抓到了 3 個：一個並發競爭條件、一個雲儲存 API 相容性問題，以及一個遺漏的權限檢查。從另一個方向來看，Gemini 遺漏了大部分的資料結構和深層邏輯錯誤，而 Claude 幾乎捕捉到所有這些錯誤。他們的弱點幾乎沒有重疊，這也是他們成為強強對手的原因。</p>
<table>
<thead>
<tr><th>雙模型配對</th><th>綜合覆蓋率</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>所有五個模型加起來涵蓋了 15 個中的 11 個，剩下 4 個每個模型都漏掉的 bug。</p>
<p><strong>Claude + Gemini</strong>作為兩個模型組合，已經達到五個模型上限的 91%。對於此基準而言，這是最有效率的組合。</p>
<p>儘管如此，Claude + Gemini 並不是每種類型的 bug 的最佳組合。當我將結果依 Bug 類別細分時，就會發現更微妙的情況：</p>
<table>
<thead>
<tr><th>錯誤類型</th><th>總數</th><th>克勞德</th><th>雙子星</th><th>法典</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>驗證缺口</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>資料結構生命週期</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>並發競賽</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>相容性</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>深層邏輯</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>總計</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>錯誤類型的細分揭示了為什麼沒有一個配對是普遍最佳的。</p>
<ul>
<li><p>對於資料結構生命週期的錯誤，Claude 和 MiniMax 以 3/4 並列。</p></li>
<li><p>在驗證缺口方面，Claude 與 Qwen 以 3/4 並列。</p></li>
<li><p>對於並發和相容性問題，Claude 在這兩方面的得分都是零，而 Gemini 則能夠填補這些缺口。</p></li>
<li><p>沒有任何模型能涵蓋所有問題，但 Claude 涵蓋的範圍最廣，最接近通才。</p></li>
</ul>
<p>每個模型都遺漏了四個 bug。一個涉及 ANTLR 語法規則的優先順序。一個是跨函數的讀/寫鎖語意錯配。一個需要瞭解壓縮類型之間的業務邏輯差異。還有一個是無聲的比較錯誤，其中一個變數使用 megabytes，另一個則使用 bytes。</p>
<p>這四個錯誤的共同點是程式碼在語法上是正確的。錯誤存在於開發者腦海中的假設，而不是在差異中，甚至不是在周遭的程式碼中。這大概就是目前 AI 程式碼檢閱的天花板。</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">發現錯誤之後，哪個模型最擅長修正錯誤？<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>在程式碼檢閱中，發現 bug 只是工作的一半。另一半則是修正錯誤。因此在一輪辯論之後，我加入了同儕評估，以衡量每個模型的修正建議實際上有多大用處。</p>
<p>為了衡量這一點，我在辯論之後加入了一輪同儕評估。每個模型都開啟一個新的環節，並擔任匿名評審，為其他模型的評論打分。五個模型被隨機映射到評論員 A/B/C/D/E 上，因此沒有評論員知道哪個模型產生了哪個評論。每位評審從四個方面進行評分，評分為 1 到 10 分：準確性、可操作性、深度和清晰度。</p>
<table>
<thead>
<tr><th>模型</th><th>準確性</th><th>可操作性</th><th>深度</th><th>清晰度</th><th>整體</th></tr>
</thead>
<tbody>
<tr><td>曲文</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8.6 (並列第一)</td></tr>
<tr><td>克勞德</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8.6 (並列第一)</td></tr>
<tr><td>法典</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>雙子星</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen 和 Claude 以明顯的差距並列第一名。兩者在所有四個維度上都持續獲得高分，而 Codex、Gemini 和 MiniMax 則低了整整一分或更多。值得注意的是，Gemini 在配對分析中證明是 Claude 極具價值的錯誤搜尋夥伴，但在審閱品質方面卻排名最末。善於發現問題與善於解釋如何修正問題，顯然是兩種不同的技能。</p>
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
    </button></h2><p><strong>Claude</strong>是您會信任的最難複審的人。它可以通過整個呼叫鏈、跟蹤深層邏輯路徑，並且不需要您餵飼它，它自己就能拉出上下文。在 L3 系統層級的 bug 上，沒有其他東西可以媲美。它有時會對數學過於自信，但當另一個模型證明它是錯的時候，它會自己承認，並說明它的推理在哪裡出了問題。用它來處理核心程式碼和您不能錯過的 bug。</p>
<p><strong>雙子座</strong>來勢洶洶。它對程式碼風格和工程標準有強烈的意見，而且能快速地從結構上架構問題。它的缺點是經常停留在表面，挖掘得不夠深入，這也是它在同儕評價中得分偏低的原因。Gemini 的真正優勢在於它是一個挑戰者：它的反擊迫使其他模型重新檢查他們的工作。與 Claude 搭配使用，可以獲得 Claude 有時跳過的結構性觀點。</p>
<p><strong>Codex</strong>很少說話。但當它說的時候，它是重要的。它對於真正錯誤的命中率很高，而且它擅長捕捉別人都沒有注意到的東西。在 PR #44474 的範例中，Codex 就是發現零值主鍵問題的典範，而這正是整個連鎖反應的起因。將它視為補充審查員，可以捕捉到主要模型遺漏的東西。</p>
<p><strong>Qwen</strong>是這五個人中最全面的。它的審查品質與 Claude 不相伯仲，而且它特別擅長將不同的觀點整合成您可以實際執行的修正建議。在上下文輔助模式中，它的 L2 檢測率也是最高的，這讓它成為日常 PR 評論的可靠預設值。唯一的缺點是：在長時間、多回合的辯論中，它有時會跟不上先前的上下文，並在後來的回合中開始提供不一致的答案。</p>
<p><strong>MiniMax</strong>在自行尋找 bug 方面是最弱的。它最好用來填充多模型小組，而不是作為獨立的審查員。</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">本實驗的限制<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>本實驗有一些注意事項：</p>
<p><strong>樣本數目少。</strong>只有 15 份 PR，全部來自相同的 Go/C++ 專案 (Milvus)。這些結果並不適用於所有語言或程式碼。請將它們視為方向性的，而非決定性的。</p>
<p><strong>模型本身是隨機的。</strong>執行相同的提示兩次可能會產生不同的結果。本文章中的數字是單一的快照，而非穩定的預期值。雖然大趨勢 (辯論優於個人，不同的模型擅長於不同的錯誤類型) 是一致的，但個別模型的排名應該被輕視。</p>
<p><strong>發言順序是固定的。</strong>辯論在所有回合都使用相同的順序，這可能會影響後來發言模型的反應。未來的實驗可以隨機調整每輪的順序來控制這一點。</p>
<h2 id="Try-it-yourself" class="common-anchor-header">自己試試看<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>本實驗的所有工具和資料均開放原始碼：</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>：一個開放原始碼的工具，可以收集程式碼上下文 (呼叫鏈、相關的 PR、受影響的模組)，並為程式碼檢閱安排多模型對辯。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>：完整的評估管道、配置與腳本。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>測試案例</strong></a>：所有 15 個附有已知錯誤註釋的 PR。</p></li>
</ul>
<p>本實驗中的 bug 全都來自<a href="https://github.com/milvus-io/milvus">Milvus</a> 的真實 pull request，<a href="https://github.com/milvus-io/milvus">Milvus</a> 是專為 AI 應用程式打造的開放原始碼向量資料庫。我們在<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>和<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a> 上有一個相當活躍的社群，我們也希望有更多人來探討程式碼。如果您在自己的程式碼上執行此基準，請與我們分享結果！我真的很好奇這些趨勢是否在不同的語言和專案中都成立。</p>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 深入思考：哪個模型適合您的 AI 代理堆疊？</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">使用輕量級 memsearch 外掛為 Claude 程式碼加入持久記憶體</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我們擷取 OpenClaw 的記憶體系統並將其開放原始碼 (memsearch)</a></p></li>
</ul>
