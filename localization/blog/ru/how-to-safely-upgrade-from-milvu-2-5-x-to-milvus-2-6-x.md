---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Как безопасно перейти с Milvus 2.5.x на Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Узнайте, что нового появилось в Milvus 2.6, включая изменения в архитектуре и
  ключевые функции, а также узнайте, как выполнить скользящее обновление с
  Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> уже давно в продаже, и это серьезный шаг вперед для проекта. В релизе усовершенствована архитектура, повышена производительность в реальном времени, снижено потребление ресурсов и улучшено поведение при масштабировании в производственных средах. Многие из этих улучшений были сформированы непосредственно под влиянием отзывов пользователей, и первые пользователи 2.6.x уже сообщили о заметно более быстром поиске и более предсказуемой производительности системы при высоких или динамических нагрузках.</p>
<p>Для команд, работающих с Milvus 2.5.x и рассматривающих возможность перехода на 2.6.x, это руководство является отправной точкой. В нем рассматриваются архитектурные различия, освещаются ключевые возможности, представленные в Milvus 2.6, и приводится практический пошаговый путь обновления, призванный свести к минимуму перебои в работе.</p>
<p>Если ваши рабочие нагрузки включают конвейеры реального времени, мультимодальный или гибридный поиск или крупномасштабные векторные операции, этот блог поможет вам оценить соответствие версии 2.6 вашим потребностям и, если вы решите продолжить, уверенно перейти на новую версию, сохранив целостность данных и доступность сервисов.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Изменения в архитектуре с Milvus 2.5 до Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем перейти к самому процессу обновления, давайте сначала разберемся, как изменилась архитектура Milvus в Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Архитектура Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Архитектура Milvus 2.5</span> </span></p>
<p>В Milvus 2.5 потоковые и пакетные рабочие процессы были переплетены на нескольких рабочих узлах:</p>
<ul>
<li><p><strong>QueryNode</strong> обрабатывал как исторические запросы <em>, так и</em> инкрементные (потоковые) запросы.</p></li>
<li><p><strong>DataNode</strong> выполнял как промывку в момент поступления <em>, так и</em> фоновое уплотнение исторических данных.</p></li>
</ul>
<p>Такое смешение логики пакетного и реального времени затрудняло независимое масштабирование пакетных рабочих нагрузок. Кроме того, состояние потоковых данных было разбросано по нескольким компонентам, что приводило к задержкам синхронизации, усложняло восстановление после сбоев и повышало операционную сложность.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Архитектура Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Архитектура Milvus 2.6</span> </span></p>
<p>В Milvus 2.6 появился выделенный <strong>узел StreamingNode</strong>, который выполняет все обязанности по работе с данными в реальном времени: потребление очереди сообщений, запись инкрементных сегментов, обслуживание инкрементных запросов и управление восстановлением на основе WAL. С выделением потоковой передачи остальные компоненты приобретают более чистые и сфокусированные роли:</p>
<ul>
<li><p><strong>QueryNode</strong> теперь обрабатывает <em>только</em> пакетные запросы к историческим сегментам.</p></li>
<li><p><strong>DataNode</strong> теперь выполняет <em>только</em> задачи, связанные с историческими данными, такие как уплотнение и создание индексов.</p></li>
</ul>
<p>StreamingNode поглощает все задачи, связанные с потоковой передачей данных, которые в Milvus 2.5 были разделены между DataNode, QueryNode и даже Proxy, внося ясность и уменьшая межролевое разделение состояний.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x: Сравнение по компонентам</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Что изменилось</strong></th></tr>
</thead>
<tbody>
<tr><td>Сервисы координаторов</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (или MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">Управление метаданными и планирование задач объединены в единый MixCoord, что упрощает логику координации и снижает сложность распределения.</td></tr>
<tr><td>Уровень доступа</td><td style="text-align:center">Прокси</td><td style="text-align:center">Прокси</td><td style="text-align:center">Запросы на запись направляются только через потоковый узел для ввода данных.</td></tr>
<tr><td>Рабочие узлы</td><td style="text-align:center">-</td><td style="text-align:center">Узел потоковой обработки</td><td style="text-align:center">Выделенный узел потоковой обработки, отвечающий за всю логику инкрементальной обработки (растущие сегменты), включая:- инкрементное получение данных- запрос инкрементных данных- сохранение инкрементных данных в объектном хранилище- запись на основе потоков- восстановление после сбоев на основе WAL</td></tr>
<tr><td></td><td style="text-align:center">Узел запросов</td><td style="text-align:center">Узел запросов</td><td style="text-align:center">Узел пакетной обработки, который обрабатывает запросы только к историческим данным.</td></tr>
<tr><td></td><td style="text-align:center">Узел данных</td><td style="text-align:center">Узел данных</td><td style="text-align:center">Узел пакетной обработки, отвечающий только за исторические данные, включая уплотнение и построение индексов.</td></tr>
<tr><td></td><td style="text-align:center">Индексный узел</td><td style="text-align:center">-</td><td style="text-align:center">Index Node объединен с Data Node, что упрощает определение ролей и топологию развертывания.</td></tr>
</tbody>
</table>
<p>Одним словом, Milvus 2.6 проводит четкую границу между потоковыми и пакетными рабочими нагрузками, устраняя путаницу между компонентами, наблюдавшуюся в 2.5, и создавая более масштабируемую и удобную в обслуживании архитектуру.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Основные характеристики Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем перейти к процессу обновления, кратко рассмотрим, что нового предлагает Milvus 2.6. <strong>В этом выпуске основное внимание уделяется снижению затрат на инфраструктуру, повышению производительности поиска и упрощению масштабирования больших динамических рабочих нагрузок ИИ.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Улучшения стоимости и эффективности</h3><ul>
<li><p><strong>Квантование</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>для первичных индексов</strong> - новый метод 1-битного квантования, который сжимает векторные индексы до <strong>1/32</strong> от их исходного размера. В сочетании с реранжированием SQ8 он сокращает использование памяти до ~28 %, увеличивает QPS на 4 × и поддерживает ~95 % запоминания, значительно снижая аппаратные затраты.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>Оптимизированный</strong></a><strong> полнотекстовый поиск</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25</strong></a> - встроенный скоринг BM25 на основе разреженных векторов веса терминов. Поиск по ключевым словам работает <strong>на 3-4× быстрее</strong> (до <strong>7×</strong> на некоторых наборах данных) по сравнению с Elasticsearch, при этом размер индекса составляет около трети от исходных текстовых данных.</p></li>
<li><p><strong>Индексирование путей JSON с измельчением JSON</strong> - структурированная фильтрация по вложенному JSON теперь работает значительно быстрее и гораздо более предсказуемо. Предварительно проиндексированные пути JSON сокращают время задержки фильтрации с <strong>140 мс → 1,5 мс</strong> (P99: <strong>480 мс → 10 мс</strong>), делая гибридный векторный поиск + фильтрацию метаданных значительно более отзывчивыми.</p></li>
<li><p><strong>Расширенная поддержка типов данных</strong> - добавлены типы векторов Int8, поля <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">геометрии</a> (POINT / LINESTRING / POLYGON) и массивы структур. Эти расширения поддерживают геопространственные рабочие нагрузки, более богатое моделирование метаданных и более чистые схемы.</p></li>
<li><p><strong>Upsert для частичных обновлений</strong> - теперь вы можете вставлять или обновлять сущности с помощью одного вызова первичного ключа. Частичные обновления изменяют только указанные поля, уменьшая усиление записи и упрощая конвейеры, которые часто обновляют метаданные или вставки.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Улучшения в области поиска и извлечения информации</h3><ul>
<li><p><strong>Улучшенная обработка текста и многоязычная поддержка:</strong> Новые токенизаторы Lindera и ICU улучшают обработку японских, корейских и <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">многоязычных</a> текстов. Jieba теперь поддерживает пользовательские словари. <code translate="no">run_analyzer</code> помогает отладить поведение токенизации, а мультиязычные анализаторы обеспечивают согласованный межъязыковой поиск.</p></li>
<li><p><strong>Высокоточное сопоставление текстов:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Phrase Match</a> обеспечивает выполнение упорядоченных запросов по фразам с настраиваемым отклонением. Новый индекс <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> ускоряет выполнение подстрочных запросов и запросов <code translate="no">LIKE</code> как по полям VARCHAR, так и по путям JSON, обеспечивая быстрое частичное и нечеткое сопоставление текста.</p></li>
<li><p><strong>Реранжирование с учетом времени и метаданных:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Ранжировщики с распадом</a> (экспоненциальный, линейный, гауссовый) корректируют оценки, используя временные метки; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">ранжировщики с повышением</a> применяют правила, основанные на метаданных, для продвижения или понижения результатов. Оба способа помогают точно настроить поведение поиска без изменения базовых данных.</p></li>
<li><p><strong>Упрощенная интеграция моделей и автовекторизация:</strong> Встроенная интеграция с OpenAI, Hugging Face и другими провайдерами встраивания позволяет Milvus автоматически векторизовать текст во время операций вставки и запроса. Больше не нужно вручную создавать конвейеры встраивания для распространенных случаев использования.</p></li>
<li><p><strong>Онлайн-обновление схемы для скалярных полей:</strong> Добавление новых скалярных полей в существующие коллекции без простоев и перезагрузки, что упрощает эволюцию схемы по мере роста требований к метаданным.</p></li>
<li><p><strong>Обнаружение близких дубликатов с помощью MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH обеспечивает эффективное обнаружение близких дубликатов в больших наборах данных без дорогостоящих точных сравнений.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Обновления архитектуры и масштабируемости</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Многоуровневое хранилище</strong></a> <strong>для управления "горячими" и "холодными" данными:</strong> Разделение горячих и холодных данных между SSD и объектными хранилищами; поддержка ленивой и частичной загрузки; устранение необходимости полной локальной загрузки коллекций; снижение использования ресурсов до 50 % и ускорение загрузки больших наборов данных.</p></li>
<li><p><strong>Служба потоковой передачи данных в режиме реального времени:</strong> Добавляет выделенные узлы потоковой передачи, интегрированные с Kafka/Pulsar, для непрерывного ввода данных; обеспечивает немедленное индексирование и доступность запросов; повышает пропускную способность записи и ускоряет восстановление после сбоев для быстро меняющихся рабочих нагрузок в режиме реального времени.</p></li>
<li><p><strong>Улучшенная масштабируемость и стабильность:</strong> Milvus теперь поддерживает 100 000+ коллекций для крупных многопользовательских сред. Обновления инфраструктуры - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL с нулевым диском), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (уменьшение IOPS/памяти) и <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - повышают стабильность кластера и обеспечивают предсказуемое масштабирование при высоких рабочих нагрузках.</p></li>
</ul>
<p>Полный список функций Milvus 2.6 можно найти в <a href="https://milvus.io/docs/release_notes.md">примечаниях к выпуску Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Как перейти с Milvus 2.5.x на Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы сохранить максимальную доступность системы во время обновления, кластеры Milvus 2.5 следует обновлять до Milvus 2.6 в следующем порядке.</p>
<p><strong>1. Сначала запустите узел потоковой передачи</strong></p>
<p>Запустите узел потоковой передачи заранее. Новый <strong>Delegator</strong> (компонент в Query Node, отвечающий за обработку потоковых данных) должен быть перемещен в Milvus 2.6 Streaming Node.</p>
<p><strong>2. Обновление MixCoord</strong></p>
<p>Обновите компоненты координатора до <strong>MixCoord</strong>. На этом этапе MixCoord должен определить версии рабочих узлов, чтобы обеспечить кросс-версионную совместимость в распределенной системе.</p>
<p><strong>3. Обновление узла запросов</strong></p>
<p>Обновление узла запросов обычно занимает больше времени. На этом этапе узлы данных и индексные узлы Milvus 2.5 могут продолжать выполнять такие операции, как промывка и построение индексов, что помогает снизить нагрузку на сторону запроса во время обновления узлов запроса.</p>
<p><strong>4. Обновление узла данных</strong></p>
<p>После того как узлы данных Milvus 2.5 будут выведены из сети, операции Flush станут недоступны, а данные в растущих сегментах могут продолжать накапливаться до тех пор, пока все узлы не будут полностью обновлены до Milvus 2.6.</p>
<p><strong>5. Обновление прокси-сервера</strong></p>
<p>После обновления прокси до Milvus 2.6 операции записи на этом прокси будут недоступны до тех пор, пока все компоненты кластера не будут обновлены до версии 2.6.</p>
<p><strong>6. Удалите индексный узел</strong></p>
<p>После обновления всех остальных компонентов автономный индексный узел можно безопасно удалить.</p>
<p><strong>Примечания:</strong></p>
<ul>
<li><p>С момента завершения обновления DataNode и до завершения обновления Proxy операции Flush недоступны.</p></li>
<li><p>С момента обновления первого Proxy до обновления всех узлов Proxy некоторые операции записи будут недоступны.</p></li>
<li><p><strong>При обновлении непосредственно с Milvus 2.5.x до 2.6.6 операции DDL (Data Definition Language) будут недоступны в процессе обновления из-за изменений в структуре DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Как обновиться до Milvus 2.6 с помощью Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> - это оператор Kubernetes с открытым исходным кодом, который обеспечивает масштабируемый, высокодоступный способ развертывания, управления и обновления всего стека сервисов Milvus на целевом кластере Kubernetes. Стек сервисов Milvus, управляемый оператором, включает в себя:</p>
<ul>
<li><p>основные компоненты Milvus</p></li>
<li><p>Необходимые зависимости, такие как etcd, Pulsar и MinIO.</p></li>
</ul>
<p>Milvus Operator следует стандартному шаблону Kubernetes Operator. Он представляет Milvus Custom Resource (CR), который описывает желаемое состояние кластера Milvus, такое как его версия, топология и конфигурация.</p>
<p>Контроллер постоянно следит за кластером и сверяет фактическое состояние с желаемым, определенным в CR. При внесении изменений (например, обновлении версии Milvus) оператор автоматически применяет их контролируемым и повторяющимся образом, обеспечивая автоматическое обновление и непрерывное управление жизненным циклом.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Пример пользовательского ресурса (CR) Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Скользящее обновление с Milvus 2.5 до 2.6 с помощью Milvus Operator</h3><p>Milvus Operator обеспечивает встроенную поддержку <strong>скользящих обновлений с Milvus 2.5 до 2.6</strong> в кластерном режиме, адаптируя свое поведение для учета архитектурных изменений, представленных в 2.6.</p>
<p><strong>1. Обнаружение сценариев обновления</strong></p>
<p>Во время обновления Milvus Operator определяет целевую версию Milvus по спецификации кластера. Это делается либо путем:</p>
<ul>
<li><p>Проверки тега изображения, определенного в <code translate="no">spec.components.image</code>, или</p></li>
<li><p>чтения явной версии, указанной в <code translate="no">spec.components.version</code></p></li>
</ul>
<p>Затем оператор сравнивает желаемую версию с текущей версией, которая записана в <code translate="no">status.currentImage</code> или <code translate="no">status.currentVersion</code>. Если текущая версия - 2.5, а желаемая - 2.6, оператор идентифицирует обновление как сценарий обновления 2.5 → 2.6.</p>
<p><strong>2. Порядок выполнения скользящего обновления</strong></p>
<p>Когда обнаружено обновление 2.5 → 2.6 и режим обновления установлен на скользящее обновление (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, которое используется по умолчанию), Milvus Operator автоматически выполняет обновление в заранее определенном порядке, согласованном с архитектурой Milvus 2.6:</p>
<p>Запуск узла потоковой передачи → Обновление MixCoord → Обновление узла запросов → Обновление узла данных → Обновление прокси → Удаление индексного узла.</p>
<p><strong>3. Автоматическая консолидация координаторов</strong></p>
<p>В Milvus 2.6 несколько компонентов координатора заменяются одним MixCoord. Milvus Operator обрабатывает этот архитектурный переход автоматически.</p>
<p>Когда <code translate="no">spec.components.mixCoord</code> настроен, оператор вызывает MixCoord и ждет, пока он будет готов. После того как MixCoord полностью готов к работе, оператор плавно отключает устаревшие компоненты координатора - RootCoord, QueryCoord и DataCoord, завершая переход без необходимости ручного вмешательства.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Этапы перехода с Milvus 2.5 на 2.6</h3><p>1.Обновите Milvus Operator до последней версии (в данном руководстве мы используем <strong>версию 1.3.3</strong>, которая была последней на момент написания статьи).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.Объедините компоненты координатора</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Убедитесь, что кластер работает под управлением Milvus 2.5.16 или более поздней версии.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.Обновите Milvus до версии 2.6.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Как обновить Milvus до версии 2.6 с помощью Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>При развертывании Milvus с помощью Helm все ресурсы Kubernetes <code translate="no">Deployment</code> обновляются параллельно, без гарантированного порядка выполнения. В результате Helm не обеспечивает строгого контроля над последовательностью обновления компонентов. Поэтому для производственных сред настоятельно рекомендуется использовать Milvus Operator.</p>
<p>Milvus по-прежнему можно обновить с 2.5 до 2.6 с помощью Helm, выполнив следующие шаги.</p>
<p>Системные требования</p>
<ul>
<li><p><strong>Версия Helm:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Версия Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Обновите таблицу Milvus Helm до последней версии. В этом руководстве мы используем <strong>версию 5.0.7</strong>, которая была последней на момент написания руководства.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.Если кластер развернут с несколькими компонентами координаторов, сначала обновите Milvus до версии 2.5.16 или более поздней и включите MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.Обновите Milvus до версии 2.6.</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Часто задаваемые вопросы по обновлению и работе Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm против Milvus Operator - какой из них мне использовать?</h3><p>Для производственных сред настоятельно рекомендуется использовать Milvus Operator.</p>
<p>Подробности см. в официальном руководстве: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a>.</p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: Как выбрать очередь сообщений (MQ)?</h3><p>Рекомендуемый MQ зависит от режима развертывания и операционных требований:</p>
<p><strong>1. Автономный режим:</strong> Для экономичных развертываний рекомендуется RocksMQ.</p>
<p><strong>2. Кластерный режим</strong></p>
<ul>
<li><p><strong>Pulsar</strong> поддерживает многопользовательский режим, позволяет большим кластерам совместно использовать инфраструктуру и обеспечивает высокую горизонтальную масштабируемость.</p></li>
<li><p><strong>Kafka</strong> имеет более развитую экосистему, с управляемыми SaaS-предложениями, доступными на большинстве основных облачных платформ.</p></li>
</ul>
<p><strong>3. Woodpecker (представлен в Milvus 2.6):</strong> Woodpecker устраняет необходимость во внешней очереди сообщений, снижая стоимость и эксплуатационную сложность.</p>
<ul>
<li><p>В настоящее время поддерживается только встроенный режим Woodpecker, который является легким и простым в управлении.</p></li>
<li><p>Для автономных развертываний Milvus 2.6 рекомендуется использовать Woodpecker.</p></li>
<li><p>Для развертывания производственных кластеров рекомендуется использовать будущий кластерный режим Woodpecker, как только он станет доступен.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">Вопрос 3: Можно ли переключать очередь сообщений во время обновления?</h3><p>Нет. Переключение очереди сообщений во время обновления в настоящее время не поддерживается. В будущих выпусках будут представлены API-интерфейсы управления для поддержки переключения между Pulsar, Kafka, Woodpecker и RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Вопрос 4: Нужно ли обновлять конфигурации ограничения скорости для Milvus 2.6?</h3><p>Нет. Существующие конфигурации ограничения скорости остаются в силе и также применяются к новому потоковому узлу. Никаких изменений не требуется.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Вопрос 5: Изменяются ли роли или конфигурации мониторинга после слияния координаторов?</h3><ul>
<li><p>Роли мониторинга остаются неизменными (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Существующие параметры конфигурации продолжают работать как прежде.</p></li>
<li><p>Вводится новый параметр конфигурации, <code translate="no">mixCoord.enableActiveStandby</code>, который будет возвращаться к <code translate="no">rootcoord.enableActiveStandby</code>, если он не задан явно.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: Каковы рекомендуемые настройки ресурсов для StreamingNode?</h3><ul>
<li><p>Для легкой обработки данных в реальном времени или периодической записи и запросов достаточно небольшой конфигурации, например, 2 ядра CPU и 8 ГБ памяти.</p></li>
<li><p>При интенсивной обработке данных в реальном времени или постоянных нагрузках, связанных с записью и запросами, рекомендуется выделять ресурсы, сопоставимые с ресурсами узла Query Node.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Вопрос 7: Как обновить автономное развертывание с помощью Docker Compose?</h3><p>Для автономных развертываний на базе Docker Compose достаточно обновить тег образа Milvus в <code translate="no">docker-compose.yaml</code>.</p>
<p>Подробности см. в официальном руководстве: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a>.</p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 знаменует собой значительное улучшение как архитектуры, так и операций. Разделив потоковую и пакетную обработку с помощью StreamingNode, объединив координаторы в MixCoord и упростив роли рабочих, Milvus 2.6 обеспечивает более стабильную, масштабируемую и простую в эксплуатации основу для крупномасштабных векторных рабочих нагрузок.</p>
<p>Эти архитектурные изменения делают обновления - особенно с Milvus 2.5 - более чувствительными к порядку. Успешное обновление зависит от соблюдения зависимостей компонентов и временных ограничений доступности. Для производственных сред рекомендуется использовать Milvus Operator, поскольку он автоматизирует последовательность обновлений и снижает операционный риск, в то время как обновления на базе Helm лучше подходят для непроизводственных сред.</p>
<p>Благодаря расширенным возможностям поиска, более богатым типам данных, многоуровневому хранению и улучшенным опциям очередей сообщений Milvus 2.6 имеет все шансы поддержать современные приложения искусственного интеллекта, требующие ввода данных в реальном времени, высокой производительности запросов и эффективных операций в масштабе.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции последней версии Milvus? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутный индивидуальный сеанс, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Дополнительные ресурсы о Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Заметки о выпуске Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Запись вебинара по Milvus 2.6: Ускоренный поиск, снижение затрат и более разумное масштабирование</a></p></li>
<li><p>Блоги о возможностях Milvus 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Представляем функцию встраивания: Как Milvus 2.6 оптимизирует векторизацию и семантический поиск</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Измельчение JSON в Milvus: 88,9-кратное ускорение фильтрации JSON с гибкостью</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Разблокирование истинного поиска на уровне сущностей: Новые возможности Array-of-Structs и MAX_SIM в Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Перестаньте платить за холодные данные: 80-процентное сокращение расходов благодаря горячей и холодной загрузке данных по требованию в многоуровневом хранилище Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Представление AISAQ в Milvus: векторный поиск миллиардного масштаба стал на 3 200× дешевле в памяти</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Оптимизация NVIDIA CAGRA в Milvus: гибридный подход GPU-CPU к ускоренному индексированию и более дешевым запросам</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Представляем индекс Milvus Ngram: Ускоренное сопоставление ключевых слов и LIKE-запросы для агентских рабочих нагрузок</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Объединение геопространственной фильтрации и векторного поиска с геометрическими полями и RTREE в Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Векторный поиск в реальном мире: как эффективно фильтровать, не убивая запоминание</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Векторное сжатие в экстремальных условиях: как Milvus обслуживает в 3 раза больше запросов с помощью RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Бенчмарки лгут - векторные БД заслуживают реальной проверки</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Мы заменили Kafka/Pulsar на Woodpecker для Milvus - вот что получилось</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH в Milvus: секретное оружие для борьбы с дубликатами в обучающих данных LLM</a></p></li>
</ul></li>
</ul>
