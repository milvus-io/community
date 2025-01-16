---
id: milvus-embraces-nats-messaging.md
title: '데이터 통신 최적화: Milvus, NATS 메시징 도입'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: 'NATS와 Milvus의 통합을 소개하고, 기능, 설정 및 마이그레이션 프로세스, 성능 테스트 결과를 살펴봅니다.'
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
<p>데이터 처리의 복잡한 태피스트리에서 원활한 커뮤니케이션은 작업을 하나로 묶는 실타래입니다. 선구적인 <a href="https://zilliz.com/cloud">오픈 소스 벡터 데이터베이스인</a> <a href="https://zilliz.com/what-is-milvus">Milvus가</a> 최신 기능으로 혁신적인 여정을 시작했습니다: 바로 NATS 메시징 통합입니다. 이 포괄적인 블로그 게시물에서는 이 통합의 핵심 기능, 설정 프로세스, 마이그레이션의 이점, 이전 버전인 RocksMQ와의 비교를 통해 이 통합의 복잡성을 풀어보겠습니다.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Milvus에서 메시지 큐의 역할 이해하기<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus의 클라우드 네이티브 아키텍처에서 메시지 큐 또는 로그 브로커는 매우 중요한 역할을 합니다. 이는 지속적인 데이터 스트림, 동기화, 이벤트 알림, 시스템 복구 중 데이터 무결성을 보장하는 백본입니다. 기존에는 Milvus 독립형 모드에서 특히 Pulsar 및 Kafka와 비교할 때 RocksMQ가 가장 간단한 선택이었지만, 방대한 데이터와 복잡한 시나리오로 인해 그 한계가 분명해졌습니다.</p>
<p>Milvus 2.3은 단일 노드 MQ 구현인 NATS를 도입하여 데이터 스트림 관리 방법을 재정의합니다. 이전 버전과 달리 NATS는 Milvus 사용자에게 성능 제약으로부터 자유로워져 상당한 양의 데이터를 원활하게 처리할 수 있는 환경을 제공합니다.</p>
<h2 id="What-is-NATS" class="common-anchor-header">NATS란 무엇인가요?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS는 Go에서 구현된 분산 시스템 연결 기술입니다. 시스템 간 요청-응답 및 게시-구독과 같은 다양한 통신 모드를 지원하고, JetStream을 통해 데이터 지속성을 제공하며, 내장된 RAFT를 통해 분산 기능을 제공합니다. NATS에 대한 자세한 내용은 NATS <a href="https://nats.io/">공식 홈페이지를</a> 참조하세요.</p>
<p>Milvus 2.3 독립 실행형 모드에서 NATS, JetStream, PubSub는 Milvus에 강력한 MQ 기능을 제공합니다.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">NATS 활성화<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3은 새로운 제어 옵션인 <code translate="no">mq.type</code> 을 제공하여 사용자가 사용하고자 하는 MQ 유형을 지정할 수 있습니다. NATS를 활성화하려면 <code translate="no">mq.type=natsmq</code> 을 설정하세요. Milvus 인스턴스를 시작한 후 아래와 유사한 로그가 표시되면 메시지 큐로 NATS를 성공적으로 활성화한 것입니다.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Milvus용 NATS 구성하기<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS 사용자 지정 옵션에는 수신 포트, JetStream 스토리지 디렉터리, 최대 페이로드 크기 및 초기화 시간 초과 지정이 포함됩니다. 이러한 설정을 미세 조정하면 최적의 성능과 안정성을 보장할 수 있습니다.</p>
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
<p><strong>참고:</strong></p>
<ul>
<li><p>NATS 서버 수신에는 <code translate="no">server.port</code> 을 지정해야 합니다. 포트 충돌이 발생하면 Milvus를 시작할 수 없습니다. <code translate="no">server.port=-1</code> 을 설정하여 포트를 임의로 선택합니다.</p></li>
<li><p><code translate="no">storeDir</code> JetStream 스토리지의 디렉터리를 지정합니다. Milvus의 읽기/쓰기 처리량을 높이려면 고성능 SSD(솔리드 스테이트 드라이브)에 디렉터리를 저장하는 것이 좋습니다.</p></li>
<li><p><code translate="no">maxFileStore</code> JetStream 스토리지 크기의 상한을 설정합니다. 이 제한을 초과하면 더 이상의 데이터 쓰기가 불가능합니다.</p></li>
<li><p><code translate="no">maxPayload</code> 개별 메시지 크기를 제한합니다. 쓰기 거부를 방지하려면 5MB 이상으로 유지해야 합니다.</p></li>
<li><p><code translate="no">initializeTimeout</code>NATS 서버 시작 시간 제한을 제어합니다.</p></li>
<li><p><code translate="no">monitor</code> NATS의 독립 로그를 구성합니다.</p></li>
<li><p><code translate="no">retention</code> NATS 메시지의 보존 메커니즘을 제어합니다.</p></li>
</ul>
<p>자세한 내용은 <a href="https://docs.nats.io/running-a-nats-service/configuration">NATS 공식 문서를</a> 참조하세요.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">RocksMQ에서 NATS로 마이그레이션하기<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>RocksMQ에서 NATS로 마이그레이션하는 것은 쓰기 작업 중지, 데이터 플러시, 구성 수정, Milvus 로그를 통한 마이그레이션 확인 등의 단계를 포함하는 원활한 프로세스입니다.</p>
<ol>
<li><p>마이그레이션을 시작하기 전에 Milvus에서 모든 쓰기 작업을 중지하세요.</p></li>
<li><p>Milvus에서 <code translate="no">FlushALL</code> 작업을 실행하고 완료될 때까지 기다립니다. 이 단계를 통해 보류 중인 모든 데이터가 플러시되고 시스템이 종료될 준비가 됩니다.</p></li>
<li><p><code translate="no">mq.type=natsmq</code> 을 설정하고 <code translate="no">natsmq</code> 섹션에서 관련 옵션을 조정하여 Milvus 구성 파일을 수정합니다.</p></li>
<li><p>Milvus 2.3을 시작합니다.</p></li>
<li><p><code translate="no">rocksmq.path</code> 디렉터리에 저장된 원본 데이터를 백업하고 정리합니다. (선택 사항)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS 대 RocksMQ: 성능 대결<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">게시/서브 성능 테스트</h3><ul>
<li><p><strong>테스트 플랫폼:</strong> M1 Pro 칩/메모리: 16GB</p></li>
<li><p><strong>테스트 시나리오:</strong> 마지막으로 게시된 결과가 수신될 때까지 임의의 데이터 패킷을 주제에 반복적으로 구독 및 게시.</p></li>
<li><p><strong>결과:</strong></p>
<ul>
<li><p>더 작은 데이터 패킷(64KB 미만)의 경우, 메모리, CPU, 응답 속도 면에서 RocksMQ가 NATS보다 우수한 성능을 보였습니다.</p></li>
<li><p>더 큰 데이터 패킷(64KB 초과)의 경우, 응답 시간이 훨씬 빠른 NATS가 RocksMQ를 앞섰습니다.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>테스트 유형</th><th>MQ</th><th>연산 횟수</th><th>연산당 비용</th><th>메모리 비용</th><th>CPU 총 시간</th><th>스토리지 비용</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4.29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>표 1: Pub/Sub 성능 테스트 결과</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus 통합 테스트</h3><p><strong>데이터 크기:</strong> 100M</p>
<p><strong>결과:</strong> 1억 개의 벡터 데이터 세트를 사용한 광범위한 테스트에서 NATS는 더 낮은 벡터 검색 및 쿼리 지연 시간을 보여주었습니다.</p>
<table>
<thead>
<tr><th>메트릭</th><th>RocksMQ(ms)</th><th>NATS(ms)</th></tr>
</thead>
<tbody>
<tr><td>평균 벡터 검색 지연 시간</td><td>23.55</td><td>20.17</td></tr>
<tr><td>초당 벡터 검색 요청 수(RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>평균 쿼리 지연 시간</td><td>7.2</td><td>6.74</td></tr>
<tr><td>초당 쿼리 요청 수(RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>표 2: 100m 데이터 세트를 사용한 Milvus 통합 테스트 결과</p>
<p><strong>데이터 세트: &lt;100M</strong></p>
<p><strong>결과</strong> 100M보다 작은 데이터 세트의 경우, NATS와 RocksMQ는 비슷한 성능을 보였습니다.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">결론: NATS 메시징을 통한 Milvus의 역량 강화<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 NATS를 통합함으로써 데이터 처리에 있어 상당한 진전을 이루었습니다. 실시간 분석, 머신 러닝 애플리케이션, 데이터 집약적인 벤처 등 어떤 프로젝트든 NATS는 효율성, 안정성, 속도를 통해 프로젝트의 역량을 강화합니다. 데이터 환경이 진화함에 따라 Milvus 내에 NATS와 같은 강력한 메시징 시스템을 갖추면 원활하고 안정적인 고성능 데이터 통신을 보장할 수 있습니다.</p>
