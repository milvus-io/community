---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Как Milvus распределяет нагрузку запросов между узлами?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  Milvus 2.0 поддерживает автоматическую балансировку нагрузки между узлами
  запросов.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение обложки Binlog</span> </span></p>
<p><a href="https://github.com/xige-16">Си Гэ</a>.</p>
<p>В предыдущих статьях блога мы последовательно представили функции Deletion, Bitset и Compaction в Milvus 2.0. В завершение этой серии статей мы хотели бы поделиться разработкой баланса нагрузки, жизненно важной функции в распределенном кластере Milvus.</p>
<h2 id="Implementation" class="common-anchor-header">Реализация<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>В то время как количество и размер сегментов, буферизуемых на узлах запросов, различаются, производительность поиска на узлах запросов также может отличаться. Худший случай может произойти, когда несколько узлов запросов истощаются, выполняя поиск по большому объему данных, а вновь созданные узлы запросов простаивают, потому что им не распределяется сегмент, что приводит к огромной трате ресурсов процессора и сильному падению производительности поиска.</p>
<p>Чтобы избежать подобных ситуаций, координатор запросов (query coord) запрограммирован на равномерное распределение сегментов между узлами запросов в соответствии с объемом оперативной памяти узлов. Таким образом, ресурсы ЦП расходуются одинаково на всех узлах, что значительно повышает производительность поиска.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Запуск автоматической балансировки нагрузки</h3><p>В соответствии со значением по умолчанию в конфигурации <code translate="no">queryCoord.balanceIntervalSeconds</code>, коорд запроса проверяет использование оперативной памяти (в процентах) всех узлов запроса каждые 60 секунд. Если выполняется одно из следующих условий, коорд запроса начинает балансировать нагрузку на узел запроса:</p>
<ol>
<li>Использование оперативной памяти любым узлом запроса в кластере больше, чем <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (по умолчанию: 90);</li>
<li>или абсолютное значение разницы в использовании оперативной памяти любыми двумя узлами запроса больше, чем <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (по умолчанию: 30).</li>
</ol>
<p>После передачи сегментов от узла запроса-источника к узлу запроса назначения они также должны удовлетворять обоим следующим условиям:</p>
<ol>
<li>Использование оперативной памяти узла запроса назначения не превышает <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (по умолчанию: 90);</li>
<li>абсолютное значение разницы в использовании оперативной памяти узлов запроса источника и назначения после балансировки нагрузки меньше, чем до балансировки нагрузки.</li>
</ol>
<p>При выполнении вышеуказанных условий коорд запроса приступает к балансировке нагрузки запроса между узлами.</p>
<h2 id="Load-balance" class="common-anchor-header">Баланс нагрузки<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда срабатывает баланс нагрузки, коорд запроса сначала загружает целевой сегмент(ы) на узел запроса назначения. Оба узла запроса возвращают результаты поиска из целевого сегмента(ов) при любом поисковом запросе в этот момент, чтобы гарантировать полноту результата.</p>
<p>После того как узел запроса назначения успешно загрузит целевой сегмент, коорд запроса публикует <code translate="no">sealedSegmentChangeInfo</code> в канале запросов. Как показано ниже, <code translate="no">onlineNodeID</code> и <code translate="no">onlineSegmentIDs</code> указывают на узел запроса, который загружает сегмент, и на загруженный сегмент соответственно, а <code translate="no">offlineNodeID</code> и <code translate="no">offlineSegmentIDs</code> указывают на узел запроса, которому нужно освободить сегмент, и на сегмент, который нужно освободить, соответственно.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Получив сообщение <code translate="no">sealedSegmentChangeInfo</code>, исходный узел запроса затем освобождает целевой сегмент.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Рабочий процесс балансировки нагрузки</span> </span></p>
<p>Весь процесс завершается успешно, когда узел запроса источника освобождает целевой сегмент. После этого нагрузка на узлы запроса будет сбалансирована, то есть использование оперативной памяти всеми узлами запроса будет не больше, чем <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, а абсолютное значение разницы в использовании оперативной памяти узлов запроса источника и назначения после балансировки нагрузки будет меньше, чем до балансировки нагрузки.</p>
<h2 id="Whats-next" class="common-anchor-header">Что дальше?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>В серии блогов о новых функциях версии 2.0 мы постараемся рассказать о дизайне новых функций. Читайте больше в этой серии блогов!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Как Milvus удаляет потоковые данные в распределенном кластере</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Как уплотнить данные в Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Как Milvus балансирует нагрузку запросов между узлами?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Как Bitset обеспечивает универсальность поиска по векторному подобию</a></li>
</ul>
<p>Это заключительная часть серии блогов о новых возможностях Milvus 2.0. После этой серии мы планируем новую серию Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, которая познакомит вас с базовой архитектурой Milvus 2.0. Пожалуйста, следите за новостями.</p>
