---
id: milvus-embraces-nats-messaging.md
title: 'Оптимизация передачи данных: Milvus внедряет систему обмена сообщениями NATS'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Представление интеграции NATS и Milvus, изучение ее возможностей, процесса
  настройки и миграции, а также результатов тестирования производительности.
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
<p>В запутанном гобелене обработки данных бесперебойная связь - это нить, связывающая операции воедино. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, новаторская <a href="https://zilliz.com/cloud">векторная база данных с открытым исходным кодом</a>, отправилась в путь с новейшей функцией: интеграция сообщений NATS. В этой подробной статье блога мы раскроем все тонкости этой интеграции, изучим ее основные возможности, процесс настройки, преимущества миграции и сравним ее с предшественницей, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Понимание роли очередей сообщений в Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>В облачной нативной архитектуре Milvus очередь сообщений, или Log Broker, имеет ключевое значение. Это основа, обеспечивающая постоянные потоки данных, синхронизацию, уведомления о событиях и целостность данных при восстановлении системы. Традиционно RocksMQ был самым простым выбором в режиме Milvus Standalone, особенно по сравнению с Pulsar и Kafka, но его ограничения становились очевидными при работе с большими объемами данных и сложными сценариями.</p>
<p>В Milvus 2.3 представлен NATS, одноузловая реализация MQ, пересматривающая способы управления потоками данных. В отличие от своих предшественников, NATS освобождает пользователей Milvus от ограничений производительности, обеспечивая бесперебойную работу со значительными объемами данных.</p>
<h2 id="What-is-NATS" class="common-anchor-header">Что такое NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS - это технология соединения распределенных систем, реализованная на языке Go. Она поддерживает различные режимы связи между системами, такие как Request-Reply и Publish-Subscribe, обеспечивает сохранение данных с помощью JetStream и предлагает распределенные возможности с помощью встроенного RAFT. Для более подробного ознакомления с <a href="https://nats.io/">NATS</a> вы можете обратиться к <a href="https://nats.io/">официальному сайту NATS</a>.</p>
<p>В автономном режиме Milvus 2.3 NATS, JetStream и PubSub обеспечивают Milvus надежными возможностями MQ.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Включение NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 предлагает новый параметр управления, <code translate="no">mq.type</code>, который позволяет пользователям указывать тип MQ, который они хотят использовать. Чтобы включить NATS, установите <code translate="no">mq.type=natsmq</code>. Если после запуска экземпляров Milvus вы увидите журналы, похожие на приведенные ниже, значит, вы успешно включили NATS в качестве очереди сообщений.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Настройка NATS для Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Параметры настройки NATS включают в себя указание порта прослушивания, каталога хранения JetStream, максимального размера полезной нагрузки и таймаута инициализации. Тонкая настройка этих параметров обеспечивает оптимальную производительность и надежность.</p>
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
<p><strong>Примечание:</strong></p>
<ul>
<li><p>Вы должны указать <code translate="no">server.port</code> для прослушивания сервера NATS. Если возникнет конфликт портов, Milvus не сможет запуститься. Установите <code translate="no">server.port=-1</code> для случайного выбора порта.</p></li>
<li><p><code translate="no">storeDir</code> указывает каталог для хранения JetStream. Мы рекомендуем хранить каталог на высокопроизводительном твердотельном диске (SSD) для повышения пропускной способности Milvus при чтении/записи.</p></li>
<li><p><code translate="no">maxFileStore</code> устанавливает верхний предел размера хранилища JetStream. Превышение этого предела приведет к невозможности дальнейшей записи данных.</p></li>
<li><p><code translate="no">maxPayload</code> ограничивает размер отдельного сообщения. Во избежание отказов в записи следует держать его выше 5 МБ.</p></li>
<li><p><code translate="no">initializeTimeout</code>управляет таймаутом запуска сервера NATS.</p></li>
<li><p><code translate="no">monitor</code> настраивает независимые журналы NATS.</p></li>
<li><p><code translate="no">retention</code> управляет механизмом сохранения сообщений NATS.</p></li>
</ul>
<p>Для получения дополнительной информации обратитесь к <a href="https://docs.nats.io/running-a-nats-service/configuration">официальной документации NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Переход с RocksMQ на NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Миграция с RocksMQ на NATS - это плавный процесс, включающий в себя такие шаги, как остановка операций записи, очистка данных, изменение конфигурации и проверка миграции через журналы Milvus.</p>
<ol>
<li><p>Перед началом миграции остановите все операции записи в Milvus.</p></li>
<li><p>Выполните операцию <code translate="no">FlushALL</code> в Milvus и дождитесь ее завершения. Этот шаг гарантирует, что все ожидающие данные будут удалены и система будет готова к выключению.</p></li>
<li><p>Измените конфигурационный файл Milvus, установив значение <code translate="no">mq.type=natsmq</code> и настроив соответствующие опции в разделе <code translate="no">natsmq</code>.</p></li>
<li><p>Запустите Milvus 2.3.</p></li>
<li><p>Создайте резервную копию и очистите исходные данные, хранящиеся в каталоге <code translate="no">rocksmq.path</code>. (Необязательно)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS против RocksMQ: сравнение производительности<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Тестирование производительности Pub/Sub</h3><ul>
<li><p><strong>Платформа для тестирования:</strong> Чип M1 Pro / Память: 16 ГБ</p></li>
<li><p><strong>Сценарий тестирования:</strong> Многократная подписка и публикация случайных пакетов данных в тему до получения последнего опубликованного результата.</p></li>
<li><p><strong>Результаты:</strong></p>
<ul>
<li><p>Для небольших пакетов данных (&lt; 64 кб) RocksMQ превосходит NATS по объему памяти, процессору и скорости отклика.</p></li>
<li><p>Для больших пакетов данных (&gt; 64 кб) NATS превосходит RocksMQ, предлагая гораздо более быстрое время отклика.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Тип теста</th><th>MQ</th><th>количество операций</th><th>стоимость одной операции</th><th>Стоимость памяти</th><th>Общее время процессора</th><th>Стоимость хранения</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 с/оп</td><td>4,29 ГБ</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 с/оп</td><td>1,18 ГБ</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 с/оп</td><td>2.60 ГБ</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 с/оп</td><td>614,9 МБ</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 с/оп</td><td>3.29 ГБ</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 с/оп</td><td>331,2 МБ</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 с/оп</td><td>635,1 МБ</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 с/оп</td><td>232,3 МБ</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Таблица 1: Результаты тестирования производительности Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Интеграционное тестирование Milvus</h3><p><strong>Размер данных:</strong> 100M</p>
<p><strong>Результат:</strong> В ходе всестороннего тестирования с набором данных в 100 миллионов векторов NATS продемонстрировала более низкую задержку поиска векторов и запросов.</p>
<table>
<thead>
<tr><th>Метрики</th><th>RocksMQ (мс)</th><th>NATS (мс)</th></tr>
</thead>
<tbody>
<tr><td>Средняя задержка поиска векторов</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Количество запросов на векторный поиск в секунду (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Средняя задержка запроса</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Количество запросов в секунду (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Таблица 2: Результаты интеграционного тестирования Milvus с набором данных 100m</p>
<p><strong>Набор данных: &lt;100M</strong></p>
<p><strong>Результат:</strong> Для наборов данных меньше 100 М, NATS и RocksMQ показывают схожую производительность.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Выводы: Расширение возможностей Milvus с помощью обмена сообщениями NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>Интеграция NATS в Milvus знаменует собой значительный шаг в области обработки данных. Если вы занимаетесь аналитикой в реальном времени, приложениями машинного обучения или другими работами, требующими больших объемов данных, NATS обеспечит вашим проектам эффективность, надежность и скорость. По мере развития ландшафта данных наличие в Milvus такой надежной системы обмена сообщениями, как NATS, обеспечивает бесперебойную, надежную и высокопроизводительную передачу данных.</p>
