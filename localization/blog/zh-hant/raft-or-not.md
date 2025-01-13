---
id: raft-or-not.md
title: 筏與否？雲端原生資料庫資料一致性的最佳解決方案
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: 為什麼基於共識的複製演算法不是在分散式資料庫中實現資料一致性的靈丹妙藥？
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者：<a href="https://github.com/xiaofan-luan">栾小凡</a>，轉載：<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>。</p>
</blockquote>
<p>基於共識的複製是許多雲原生分散式資料庫廣泛採用的策略。然而，它也有一定的缺點，絕非萬靈丹。</p>
<p>這篇文章的目的是首先解釋雲原生和分散式資料庫中複製、一致性和共識的概念，然後澄清為什麼 Paxos 和 Raft 等基於共識的演算法不是萬靈藥，最後針<a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">對基於共識的複製</a>提出<a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">解決方案</a>。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">瞭解複製、一致性與共識</a></li>
<li><a href="#Consensus-based-replication">基於共識的複製</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">適用於雲原生與分散式資料庫的日誌複製策略</a></li>
<li><a href="#Summary">摘要</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">瞭解複製、一致性與共識<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入探討 Paxos 和 Raft 的優缺點，並提出最適合的日誌複製策略之前，我們需要先解釋複製、一致性和共識的概念。</p>
<p>請注意，本文主要著重於增量資料/日誌的同步化。因此，在談論資料/日誌複製時，僅提及複製增量資料，而非歷史資料。</p>
<h3 id="Replication" class="common-anchor-header">複製</h3><p>複製是將資料複製多份，並儲存在不同的磁碟、進程、機器、叢集等中，以提高資料可靠性並加速資料查詢的過程。由於在複製過程中，資料會被複製並儲存在多個位置，因此在面對磁碟故障、實體機器故障或叢集錯誤時，資料的復原會更加可靠。此外，資料的多重複製可大幅加快查詢速度，從而提升分散式資料庫的效能。</p>
<p>複製模式有多種，例如同步/異步複製、強一致性/現行一致性複製、領導者-追隨者/分散式複製。複製模式的選擇會影響系統的可用性和一致性。因此，正如著名的<a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP 理論</a>所提出的，當網路分割不可避免時，系統架構需要在一致性和可用性之間作出取捨。</p>
<h3 id="Consistency" class="common-anchor-header">一致性</h3><p>簡而言之，分散式資料庫中的一致性是指在指定時間寫入或讀取資料時，確保每個節點或副本都擁有相同資料視圖的屬性。如需一致性等級的完整清單，請閱讀<a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">此處</a>的說明文件。</p>
<p>要澄清的是，這裡我們討論的是 CAP 理論中的一致性，而不是 ACID (原子性、一致性、隔離性、耐久性)。CAP 理論中的一致性是指系統中的每個節點都擁有相同的資料，而 ACID 中的一致性是指單一節點對每個潛在的提交執行相同的規則。</p>
<p>一般而言，OLTP（線上交易處理）資料庫需要強一致性或線性化來確保：</p>
<ul>
<li>每次讀取都能存取最新插入的資料。</li>
<li>如果在讀取之後傳回了新的值，那麼接下來的所有讀取，不論是在相同或不同的用戶端，都必須傳回新的值。</li>
</ul>
<p>可線性化的精髓在於保證多個資料副本的重複性 - 一旦寫入或讀取新值，所有後續讀取都可以檢視新值，直到該值後來被覆蓋為止。提供線性化的分散式系統可以省去使用者盯著多個複製本的麻煩，並保證每個操作的原子性和順序。</p>
<h3 id="Consensus" class="common-anchor-header">共識</h3><p>共識的概念被引入到分散式系統中，因為使用者渴望看到分散式系統以與獨立系統相同的方式運作。</p>
<p>簡單來說，共識就是在價值上的一般協議。例如，Steve 和 Frank 想去吃點東西。Steve 建議吃三明治。Frank 同意 Steve 的建議，兩人都吃了三明治。他們達成共識。更明確地說，其中一人提出的價值 (三明治) 得到了兩人的同意，而兩人都根據該價值採取了行動。同樣地，分散式系統中的共識是指當一個程序提出一個值時，系統中的所有其他程序都會同意這個值並採取行動。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>共識</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">基於共識的複製<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>最早的共識型演算法是在 1988 年與<a href="https://pmg.csail.mit.edu/papers/vr.pdf">視圖戳記複製</a>一起提出的。1989 年，Leslie Lamport 提出了<a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>，一種基於共識的演算法。</p>
<p>近年來，我們見證了業界另一種盛行的共識型演算法 -<a href="https://raft.github.io/">Raft</a>。它已被許多主流 NewSQL 資料庫採用，例如 CockroachDB、TiDB、OceanBase 等。</p>
<p>值得注意的是，分散式系統即使採用共識式複製，也不一定支援線性化。然而，線性化是建立 ACID 分散式資料庫的先決條件。</p>
<p>在設計資料庫系統時，應該考慮日誌和狀態機的提交順序。此外，還需要格外小心，以維護 Paxos 或 Raft 的 leader 租賃，並防止在網路分割下出現分裂腦的情況。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Raft 複製狀態機</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">優點與缺點</h3><p>事實上，Raft、ZAB 和 Aurora<a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">中基於法定人數的日誌通訊協定</a>都是 Paxos 的變體。基於共識的複製有以下優點：</p>
<ol>
<li>雖然在 CAP 理論中，基於共識的複製更著重於一致性和網路分割，但相較於傳統的領導者-追隨者複製，它能提供相對更好的可用性。</li>
<li>Raft 是一個突破，大大簡化了基於共識的演算法。GitHub 上有許多開源的 Raft 函式庫（例如<a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>）。</li>
<li>共識式複製的效能可以滿足絕大多數的應用程式和企業。隨著高效能 SSD 和千兆 NIC（網路介面卡）的覆蓋，同步多個副本的負擔得以減輕，使得 Paxos 和 Raft 演算法成為業界主流。</li>
</ol>
<p>有一種誤解是，以共識為基礎的複製是在分散式資料庫中實現資料一致性的靈丹妙藥。然而，事實並非如此。基於共識的演算法所面臨的可用性、複雜性和效能挑戰，使其無法成為完美的解決方案。</p>
<ol>
<li><p>可用性受損 優化的 Paxos 或 Raft 演算法非常依賴領導複製，因此對抗灰色故障的能力較弱。在基於共識的複製中，除非領導者節點長時間不回應，否則不會進行新的領導者複製選舉。因此，基於共識的複製無法處理領導節點(leader node)緩慢或發生斷層(thrashing)的情況。</p></li>
<li><p>高複雜度 雖然已經有許多基於 Paxos 和 Raft 的擴充演算法，但<a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a>和<a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a>的出現，需要在日誌和狀態機之間進行更多同步的考量和測試。</p></li>
<li><p>效能受損 在雲原生時代，本機儲存會被 EBS 和 S3 等共用儲存解決方案取代，以確保資料的可靠性和一致性。因此，基於共識的複製不再是分散式系統的必要條件。更重要的是，基於共識的複製會帶來資料備援的問題，因為解決方案和 EBS 都有多個複本。</p></li>
</ol>
<p>對於多資料中心和多雲端複製而言，追求一致性不僅會損害可用性，也會影響<a href="https://en.wikipedia.org/wiki/PACELC_theorem">延遲</a>，導致效能下降。因此，在大多數應用中，線性化並非多資料中心容災的必要條件。</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">適用於雲原生與分散式資料庫的日誌複製策略<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>無可否認，Raft 和 Paxos 等基於共識的演算法仍是許多 OLTP 資料庫所採用的主流演算法。然而，透過觀察<a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>協定、<a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a>和<a href="https://rockset.com/">Rockset</a> 等範例，我們可以發現趨勢正在轉變。</p>
<p>能為雲端原生分散式資料庫提供最佳服務的解決方案有兩大原則。</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1.複製即服務</h3><p>需要專門用於資料同步的獨立微型服務。同步模組與儲存模組不該再緊耦合在同一個流程中。</p>
<p>例如，Socrates 解耦了儲存、日誌和運算。有一個專用的日誌服務（下圖中間的 XLog 服務）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Socrates 架構</span> </span></p>
<p>XLog 服務是一個獨立的服務。借助低延遲存儲實現了資料持久化。Socrates 中的著陸區負責以加速的速度保持三個副本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Socrates XLog 服務</span> </span></p>
<p>領導節點以非同步方式將日誌分發給日誌經紀人，並將資料刷新到 Xstore。本地 SSD 快取可以加速資料讀取。一旦資料刷新成功，就可以清理登陸區域的緩衝區。很明顯，所有日誌資料分為三層 - 著陸區、本機 SSD 和 XStore。</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2.俄羅斯娃娃原則</h3><p>設計系統的一種方法是遵循俄羅斯娃娃原則：每一層都是完整的，並完全適合該層的功能，以便在其上或周圍建立其他層。</p>
<p>在設計雲端原生資料庫時，我們需要巧妙地利用其他第三方服務來降低系統架構的複雜性。</p>
<p>我們似乎無法繞過 Paxos 來避免單點故障。但是，我們仍可以將 leader election 交給 Raft 或基於<a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>、<a href="https://github.com/bloomreach/zk-replicator">Zk</a> 和<a href="https://etcd.io/">etcd</a> 的 Paxos 服務，從而大大簡化日誌複製。</p>
<p>舉例來說，<a href="https://rockset.com/">Rockset</a>架構遵循俄羅斯娃娃原則，使用 Kafka/Kineses 來做分散式日誌，使用 S3 來做儲存，並使用本機 SSD 快取來提升查詢效能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Rockset 架構</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Milvus 方法</h3><p>Milvus 中的可調式一致性實際上與共識式複製中的跟讀類似。從者讀取功能是指在強一致性的前提下，使用從者複製器承擔資料讀取任務。其目的是提高集群吞吐量，降低 leader 的負載。從者讀取功能的機制是查詢最新日誌的 commit 索引，並提供查詢服務，直到 commit 索引中的所有資料都套用到狀態機上。</p>
<p>然而，Milvus 的設計並未採用 follower 策略。換句話說，Milvus 並不是在每次收到查詢請求時都查詢提交索引。相反地，Milvus 採用了類似<a href="https://flink.apache.org/">Flink</a> 中的水印機制，每隔一段固定時間通知查詢節點 commit index 的位置。之所以採用這樣的機制，是因為 Milvus 的使用者通常對資料一致性的要求不高，他們可以接受資料可視性的折衷，以獲得更好的系統效能。</p>
<p>此外，Milvus 也採用多重微服務，並將儲存與運算分離。在<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus 架構</a>中，儲存使用 S3、MinIo 和 Azure Blob。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架構</span> </span></p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>如今，越來越多的雲原生資料庫將日誌複製變成單獨的服務。這樣可以降低新增唯讀複製和異質複製的成本。使用多個微服務可快速利用成熟的雲端基礎架構，這是傳統資料庫無法做到的。單獨的日誌服務可以仰賴共識式複製，但也可以遵循俄羅斯娃娃策略，採用各種一致性協定，再搭配 Paxos 或 Raft 來達成可線性化。</p>
<h2 id="References" class="common-anchor-header">參考文獻<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos made simple[J].ACM SIGACT News (Distributed Computing Column) 32, 4 (Whole Number 121, December 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14).2014:305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication：A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing.1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replication in log-based distributed storage systems[J].2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora：On avoiding distributed consensus for i/os、commits、member changes[C]//Proceedings of the 2018 International Conference on Management of Data.2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates：雲端新的 sql 伺服器[C]//2019 資料管理國際研討會論文集.2019: 1743-1756.</li>
</ul>
