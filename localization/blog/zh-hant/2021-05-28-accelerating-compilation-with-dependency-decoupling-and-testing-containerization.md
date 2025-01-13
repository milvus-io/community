---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: 使用相依性解耦與測試容器化加速編譯 2.5 倍
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: 探索 zilliz 如何使用相依性解耦與容器化技術，將大型 AI 與 MLOps 專案的編譯時間縮短 2.5 倍。
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>透過相依性解耦與測試容器化將編譯速度提升 2.5 倍</custom-h1><p>編譯時間可能會因為整個開發過程中演變的複雜內部和外部依賴關係，以及作業系統或硬體架構等編譯環境的變更而變得複雜。以下是進行大型 AI 或 MLOps 專案時可能遇到的常見問題：</p>
<p><strong>編譯時間過長</strong>- 每天都要進行數百次的程式碼整合。在數十萬行程式碼的情況下，即使是一個小小的變更，都可能導致完整的編譯過程，而完整的編譯過程通常需要一個或多個小時。</p>
<p><strong>複雜的編譯環境</strong>- 專案程式碼需要在不同的環境下進行編譯，這涉及到不同的作業系統，例如 CentOS 和 Ubuntu，底層的相依性，例如 GCC、LLVM 和 CUDA，以及硬體架構。而在特定環境下進行的編譯通常可能無法在不同的環境下運作。</p>
<p><strong>複雜的相依性</strong>- 專案編譯涉及 30 多個元件間與第三方的相依性。專案開發經常會導致相依性的變更，難免會造成相依性衝突。相依性之間的版本控制非常複雜，更新相依性的版本很容易影響其他元件。</p>
<p><strong>第三方依賴下載緩慢或失敗</strong>- 網路延遲或第三方依賴庫不穩定，造成資源下載緩慢或存取失敗，嚴重影響程式碼整合。</p>
<p>透過將相依性解耦，並實施測試容器化，我們在開放原始碼嵌入式相似性搜尋專案<a href="https://milvus.io/">Milvus</a> 工作時，成功將平均編譯時間減少了 60%。</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">將專案的相依性解耦</h3><p>專案編譯通常會牽涉到大量的內部與外部元件依賴。專案的相依性越多，管理起來就越複雜。隨著軟體的成長，變更或移除相依性，以及識別變更或移除相依性的影響，都會變得更加困難，成本也會更高。在整個開發過程中都需要定期維護，以確保相關依賴項目能正常運作。 維護不善、相關依賴項目複雜或相關依賴項目有問題，都可能造成衝突，進而導致開發速度變慢或停滯不前。實際上，這可能意味著遲緩的資源下載、對代碼整合造成負面影響的存取失敗等等。解耦專案相依性可以減少缺陷並縮短編譯時間，加速系統測試，避免軟體開發受到不必要的拖累。</p>
<p>因此，我們建議您將專案的相依性解耦：</p>
<ul>
<li>分割具有複雜依賴關係的元件</li>
<li>使用不同的儲存庫進行版本管理。</li>
<li>使用組態檔來管理版本資訊、編譯選項、相依性等。</li>
<li>將組態檔加入元件庫，以便隨著專案迭代更新。</li>
</ul>
<p><strong>元件之間的編譯最佳化</strong>- 根據依賴關係和組態檔案中記錄的編譯選項，拉取並編譯相關元件。標記和打包二進位編譯結果以及相應的清單檔案，然後上傳到您的私人儲存庫。如果未對元件或其依賴的元件進行變更，則根據清單檔案回放其編譯結果。對於網路延遲或第三方依賴庫不穩定等問題，請嘗試建立內部儲存庫或使用鏡像儲存庫。</p>
<p>若要最佳化元件間的編譯</p>
<p>1.建立依賴關係圖 - 使用元件庫中的設定檔建立依賴關係圖。使用依賴關係擷取上游和下游依賴元件的版本資訊（Git 分支、標籤和 Git commit ID）和編譯選項等等。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>.檢查相依性</strong>- 對於元件之間出現的循環相依性、版本衝突等問題產生警示。</p>
<p>3<strong>.扁平化依賴關係</strong>- 依深度先搜尋 (DFS) 排序依賴關係，並將具有重複依賴關係的元件前置合併，形成依賴關係圖。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4.使用 MerkleTree 演算法，根據版本資訊、編譯選項等，產生包含各元件依賴關係的雜湊值 (Root Hash)。結合元件名稱等資訊，演算法會為每個元件形成唯一的標籤。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5.根據元件的唯一標籤資訊，檢查私有 repo 中是否存在相應的編譯存檔。如果擷取到編譯存檔，則解壓縮以取得播放用的manifest檔案；如果沒有，則編譯元件，標示生成的編譯物件檔案和manifest檔案，並上傳到私有資源庫。</p>
<p><br/></p>
<p><strong>在元件內執行編譯最佳化</strong>- 選擇特定語言的編譯快取工具來快取編譯的物件檔案，並上傳儲存到您的私人資源庫。對於 C/C++ 編譯，選擇 CCache 之類的編譯快取工具來快取 C/C++ 編譯的中間檔案，編譯完成後再將本機的 CCache 快取歸檔。這類編譯快取工具只需在編譯後逐一快取變更的程式碼檔案，並複製未變更程式碼檔案的編譯元件，使其可直接參與最後的編譯。 元件內部的編譯最佳化包括以下步驟：</p>
<ol>
<li>在 Dockerfile 中加入必要的編譯依賴。使用 Hadolint 對 Dockerfile 執行符合性檢查，以確保映像符合 Docker 的最佳實作。</li>
<li>根據專案衝刺版本（版本 + 建立）、作業系統等資訊，鏡射編譯環境。</li>
<li>執行鏡射的編譯環境容器，並將映像 ID 作為環境變數傳輸至容器。以下是取得 image ID 的範例指令：「docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7」。</li>
<li>選擇適當的編譯快取工具：輸入您的 containter 以整合並編譯您的程式碼，並在您的私人儲存庫中檢查是否存在適當的編譯快取。如果有，請下載並解壓縮至指定目錄。所有元件編譯完成後，由編譯快取工具產生的快取，會根據專案版本和映像 ID 打包並上傳至您的私人資源庫。</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">進一步的編譯優化</h3><p>我們最初建置的佔用了太多的磁碟空間和網路頻寬，部署時間長，我們採取了以下措施：</p>
<ol>
<li>選擇最精簡的基本映像以減少映像大小，例如 alpine、busybox 等。</li>
<li>減少影像層數。儘可能重複使用相依性。使用「&amp;&amp;」合併多個指令。</li>
<li>清理建立影像時的中間產品。</li>
<li>盡可能使用影像快取建立影像。</li>
</ol>
<p>隨著我們專案的持續進行，磁碟使用量和網路資源開始隨著編譯快取的增加而飆升，而有些編譯快取卻未被充分利用。於是我們做了以下調整：</p>
<p><strong>定期清理快取檔案</strong>- 定期檢查私有資源庫 (例如使用腳本)，清理暫時沒有變更或下載不多的快取檔案。</p>
<p><strong>選擇性的快取編譯</strong>- 只快取需要資源的編譯，跳過快取不需要太多資源的編譯。</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">利用容器化測試來減少錯誤、提高穩定性和可靠性</h3><p>程式碼必須在不同的環境中進行編譯，其中涉及各種作業系統 (例如 CentOS 和 Ubuntu)、底層相依性 (例如 GCC、LLVM 和 CUDA) 以及特定的硬體架構。在特定環境下成功編譯的程式碼，在不同的環境下卻會失敗。透過在容器內執行測試，測試程序會變得更快、更準確。</p>
<p>容器化可確保測試環境一致，並確保應用程式如預期般運作。容器化測試方法將測試封裝為影像容器，並建立真正隔離的測試環境。我們的測試人員發現這種方法相當有用，最終減少了多達 60% 的編譯時間。</p>
<p><strong>確保一致的編譯環境</strong>- 由於編譯後的產品對於系統環境的變化非常敏感，因此在不同的作業系統中可能會發生未知的錯誤。我們必須根據編譯環境的變化對編譯後的產品快取進行標籤和歸檔，但這些標籤和歸檔很難進行分類。因此我們引入容器化技術來統一編譯環境，以解決這類問題。</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">結論</h3><p>本文透過分析專案的依賴關係，介紹了元件之間與元件內部編譯最佳化的不同方法，提供了建立穩定、有效率的持續程式碼整合的想法與最佳實作。這些方法有助於解決複雜的依賴關係所造成的程式碼整合緩慢問題，統一容器內部的作業以確保環境的一致性，並透過回放編譯結果和使用編譯快取工具快取中間的編譯結果來提高編譯效率。</p>
<p>上述做法使專案的編譯時間平均縮短了 60%，大大提升了程式碼整合的整體效率。未來，我們將繼續在元件之間和元件內部進行平行編譯，以進一步縮短編譯時間。</p>
<p><br/></p>
<p><em>本文使用了以下資料來源：</em></p>
<ul>
<li>「將源碼樹解耦為建置層級元件」</li>
<li><a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">「在專案中加入第三方依賴時需考量的因素</a>」</li>
<li><a href="https://queue.acm.org/detail.cfm?id=3344149">「軟體依賴關係的生存之道</a>」</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Understanding Dependencies：軟體開發中的協調挑戰研究</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">關於作者</h3><p>張志鋒，Zilliz.com 資深 DevOps 工程師，從事開源向量資料庫 Milvus 的開發，同時也是中國 LF 開源軟體大學授權講師。他在廣州軟件工程學院獲得物聯網（IOT）學士學位。他的職業生涯主要在 CI/CD、DevOps、IT 基礎設施管理、Cloud-Native 工具包、容器化、編譯流程優化等領域參與和領導項目。</p>
