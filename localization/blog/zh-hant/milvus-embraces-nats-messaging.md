---
id: milvus-embraces-nats-messaging.md
title: 優化資料通訊：Milvus 採用 NATS 訊息傳輸技術
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: 介紹 NATS 與 Milvus 的整合，探索其功能、設定與遷移過程，以及效能測試結果。
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在錯綜複雜的資料處理過程中，無縫溝通是將各項作業連結在一起的主線。開創先河的<a href="https://zilliz.com/cloud">開放原始碼向量資料庫</a> <a href="https://zilliz.com/what-is-milvus">Milvus</a>，以其最新功能踏上了轉型之旅：NATS 訊息整合。在這篇全面的部落格文章中，我們將解開這個整合的複雜性，探索它的核心功能、設定過程、遷移效益，以及它與前身 RocksMQ 的優勢。</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">了解訊息佇列在 Milvus 中的角色<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 的雲原生架構中，訊息佇列或 Log Broker 具有舉足輕重的地位。它是確保持久性資料流、同步、事件通知，以及系統復原時資料完整性的骨幹。傳統上，RocksMQ 是 Milvus Standalone 模式中最直接的選擇，尤其是與 Pulsar 和 Kafka 相較之下，但在大量資料和複雜的情況下，它的限制就顯而易見了。</p>
<p>Milvus 2.3 引入了單結點 MQ 實作 NATS，重新定義了如何管理資料流。與前代產品不同，NATS 將 Milvus 使用者從效能限制中解放出來，提供處理大量資料的無縫體驗。</p>
<h2 id="What-is-NATS" class="common-anchor-header">什麼是 NATS？<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS 是以 Go 實作的分散式系統連線技術。它支援多種通訊模式，例如跨系統的 Request-Reply 與 Publish-Subscribe，透過 JetStream 提供資料持久化，並透過內建的 RAFT 提供分散式功能。您可以參考<a href="https://nats.io/">NATS 官方網站</a>來更詳細了解 NATS。</p>
<p>在 Milvus 2.3 Standalone 模式下，NATS、JetStream 和 PubSub 為 Milvus 提供了強大的 MQ 功能。</p>
<h2 id="Enabling-NATS" class="common-anchor-header">啟用 NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 提供了一個新的控制選項<code translate="no">mq.type</code> ，它允許使用者指定他們想要使用的 MQ 類型。要啟用 NATS，請設定<code translate="no">mq.type=natsmq</code> 。如果您在啟動 Milvus 實例後看到類似下面的日誌，表示您已成功啟用 NATS 作為訊息佇列。</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">為 Milvus 配置 NATS<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS 自訂選項包括指定聆聽連接埠、JetStream 儲存目錄、最大有效負載大小和初始化逾時。微調這些設定可確保最佳效能與可靠性。</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>注意：</strong></p>
<ul>
<li><p>您必須指定<code translate="no">server.port</code> 作為 NATS 伺服器的監聽。如果存在端口冲突，Milvus 将无法启动。設定<code translate="no">server.port=-1</code> 隨機選擇連接埠。</p></li>
<li><p><code translate="no">storeDir</code> 指定 JetStream 儲存目錄。我們建議將目錄儲存在高效能的固態硬碟 (SSD) 中，以獲得 Milvus 更佳的讀寫吞吐量。</p></li>
<li><p><code translate="no">maxFileStore</code> 設定 JetStream 儲存大小的上限。超過此上限將阻止進一步的資料寫入。</p></li>
<li><p><code translate="no">maxPayload</code> 限制個別訊息大小。您應該將其保持在 5MB 以上，以避免任何寫入拒絕。</p></li>
<li><p><code translate="no">initializeTimeout</code>控制 NATS 服務器啟動超時。</p></li>
<li><p><code translate="no">monitor</code> 配置 NATS 的獨立日誌。</p></li>
<li><p><code translate="no">retention</code> 控制 NATS 消息的保留機制。</p></li>
</ul>
<p>更多資訊請參考<a href="https://docs.nats.io/running-a-nats-service/configuration">NATS 官方文件</a>。</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">從 RocksMQ 遷移到 NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>从RocksMQ迁移到NATS是一个无缝的过程，涉及到停止写操作、刷新数据、修改配置以及通过Milvus日志验证迁移等步骤。</p>
<ol>
<li><p>在啟動遷移之前，請先在 Milvus 中停止所有寫入作業。</p></li>
<li><p>在 Milvus 中執行<code translate="no">FlushALL</code> 作業，並等待其完成。這一步驟可確保所有待處理資料都已刷新，且系統已準備好關機。</p></li>
<li><p>修改 Milvus 配置文件，在<code translate="no">natsmq</code> 部分下設定<code translate="no">mq.type=natsmq</code> 並調整相關選項。</p></li>
<li><p>啟動 Milvus 2.3。</p></li>
<li><p>備份並清理儲存在<code translate="no">rocksmq.path</code> 目錄中的原始資料。(選擇性)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: 性能對決<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pub/Sub 性能測試</h3><ul>
<li><p><strong>測試平台：</strong>M1 Pro 晶片 / 記憶體：16GB</p></li>
<li><p><strong>測試情境：</strong>重複訂閱和發佈隨機資料封包到一個主題，直到收到最後發佈的結果。</p></li>
<li><p><strong>結果：</strong></p>
<ul>
<li><p>對於較小的資料包（&lt; 64kb），RocksMQ 在記憶體、CPU 和回應速度上都優於 NATS。</p></li>
<li><p>對於較大的資料包（&gt; 64kb），NATS 則優於 RocksMQ，提供更快的回應時間。</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>測試類型</th><th>MQ</th><th>操作次數</th><th>每次操作成本</th><th>記憶體成本</th><th>CPU 總時間</th><th>儲存成本</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4.29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 S/OP</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 S/OP</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 發行/次</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 發行/次</td><td>NATS</td><td>50</td><td>2.629391004 S/OP</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 發行/次</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>表 1：Pub/Sub 性能測試結果</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus 整合測試</h3><p><strong>資料大小：</strong>100M</p>
<p><strong>結果：</strong>在 1 億向量資料集的廣泛測試中，NATS 展示了較低的向量搜尋與查詢延遲。</p>
<table>
<thead>
<tr><th>指標</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>平均向量搜尋延遲</td><td>23.55</td><td>20.17</td></tr>
<tr><td>每秒向量搜尋要求 (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>平均查詢延遲</td><td>7.2</td><td>6.74</td></tr>
<tr><td>每秒查詢請求 (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>表 2：100M 資料集的 Milvus 整合測試結果</p>
<p><strong>資料集：&lt;100M</strong></p>
<p><strong>結果：</strong>對於小於 100M 的資料集，NATS 和 RocksMQ 顯示出相似的效能。</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">結論：使用 NATS 消息傳輸增強 Milvus 的能力<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中整合 NATS 標誌著資料處理的一大進步。無論是研究即時分析、機器學習應用程式，或是任何資料密集的企業，NATS 都能讓您的專案更有效率、可靠且快速。隨著資料環境的演進，在 Milvus 中擁有像 NATS 這樣強大的訊息傳送系統，可確保無縫、可靠且高效能的資料通訊。</p>
