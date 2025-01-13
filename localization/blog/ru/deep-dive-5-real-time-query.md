---
id: deep-dive-5-real-time-query.md
title: >-
  Использование базы данных векторов Milvus для запросов в режиме реального
  времени
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: 'Узнайте о механизме, лежащем в основе запросов в реальном времени в Milvus.'
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/xige-16">Си Гэ</a> и переработана <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>В предыдущем посте мы рассказали о <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">вставке и сохранении данных</a> в Milvus. В этой статье мы продолжим объяснять, как <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">различные компоненты</a> Milvus взаимодействуют друг с другом для выполнения запросов к данным в режиме реального времени.</p>
<p><em>Ниже перечислены некоторые полезные ресурсы, которые можно найти перед началом работы. Мы рекомендуем сначала прочитать их, чтобы лучше понять тему этого поста.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Глубокое погружение в архитектуру Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Модель данных Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Роль и функции каждого компонента Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Обработка данных в Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Вставка и сохранение данных в Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Загрузка данных в узел запроса<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Перед выполнением запроса данные должны быть загружены в узлы запроса.</p>
<p>Существует два типа данных, загружаемых в узел запроса: потоковые данные из <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">брокера журналов</a> и исторические данные из <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">объектного хранилища</a> (также называемого ниже постоянным хранилищем).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Блок-схема</span> </span></p>
<p>Data coord отвечает за обработку потоковых данных, которые постоянно вставляются в Milvus. Когда пользователь Milvus обращается по адресу <code translate="no">collection.load()</code>, чтобы загрузить коллекцию, коорд запросов обращается к коорду данных, чтобы узнать, какие сегменты были сохранены в хранилище и какие контрольные точки им соответствуют. Контрольная точка - это метка, обозначающая, что сегменты, сохраненные до контрольной точки, потребляются, а сегменты после контрольной точки - нет.</p>
<p>Затем коорд запроса выводит стратегию распределения на основе информации из коорда данных: либо по сегментам, либо по каналам. Распределитель сегментов отвечает за распределение сегментов в постоянном хранилище (пакетных данных) между различными узлами запроса. Например, на изображении выше распределитель сегментов выделяет сегменты 1 и 3 (S1, S3) для узла запроса 1, а сегменты 2 и 4 (S2, S4) - для узла запроса 2. Распределитель каналов назначает различные узлы запроса для просмотра нескольких <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">каналов</a> манипулирования данными (DMChannels) в брокере журналов. Например, на изображении выше распределитель каналов назначает узел запроса 1 для просмотра канала 1 (Ch1), а узел запроса 2 - для просмотра канала 2 (Ch2).</p>
<p>При такой стратегии распределения каждый узел запроса загружает данные сегмента и просматривает каналы соответствующим образом. В узле запроса 1 на изображении исторические данные (пакетные данные) загружаются через выделенные S1 и S3 из постоянного хранилища. В то же время узел запроса 1 загружает инкрементные данные (потоковые данные), подписываясь на канал 1 в брокере журналов.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Управление данными в узле запроса<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Узлу запроса необходимо управлять как историческими, так и инкрементными данными. Исторические данные хранятся в <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">закрытых сегментах</a>, а инкрементные данные - в <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">растущих сегментах</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Управление историческими данными</h3><p>Для управления историческими данными необходимо учитывать два момента: баланс нагрузки и восстановление работоспособности узла запроса.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Баланс нагрузки</span> </span></p>
<p>Например, как показано на рисунке, узлу запроса 4 было выделено больше закрытых сегментов, чем остальным узлам запроса. Вполне вероятно, что это сделает узел запроса 4 узким местом, замедляющим весь процесс запроса. Чтобы решить эту проблему, системе необходимо распределить несколько сегментов узла запроса 4 между другими узлами запроса. Это называется балансировкой нагрузки.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Обход отказа узла запроса</span> </span></p>
<p>Другая возможная ситуация показана на рисунке выше. Один из узлов, узел запроса 4, внезапно выходит из строя. В этом случае нагрузку (сегменты, выделенные узлу запроса 4) необходимо передать другим работающим узлам запроса, чтобы обеспечить точность результатов запроса.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Инкрементное управление данными</h3><p>Узел запроса просматривает DMChannels для получения инкрементных данных. В этот процесс вводится Flowgraph. Сначала он фильтрует все сообщения о вставке данных. Это делается для того, чтобы гарантировать, что будут загружены только данные в определенном разделе. Каждая коллекция в Milvus имеет соответствующий канал, который разделяется всеми разделами в этой коллекции. Поэтому, если пользователю Milvus нужно загрузить данные только в определенный раздел, то для фильтрации вставленных данных требуется блок-схема. В противном случае на узел запроса будут загружены данные из всех разделов коллекции.</p>
<p>После фильтрации инкрементные данные вставляются в растущие сегменты и далее передаются на временные узлы сервера.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Flowgraph</span> </span></p>
<p>Во время вставки данных каждому сообщению о вставке присваивается временная метка. В канале DMChannel, показанном на рисунке выше, данные вставляются по порядку, слева направо. Временная метка для первого сообщения вставки равна 1, второго - 2, третьего - 6. Четвертое сообщение, отмеченное красным, не является сообщением вставки, а скорее сообщением timetick. Это означает, что вставленные данные, чьи временные метки меньше этой временной метки, уже находятся в журнале брокера. Другими словами, данные, вставленные после этого сообщения timetick, должны иметь временные метки, значения которых больше этого timetick. Например, на изображении выше, когда узел запроса воспринимает, что текущий таймстик равен 5, это означает, что все сообщения о вставке, чье значение временной метки меньше 5, загружены в узел запроса.</p>
<p>Узел времени сервера предоставляет обновленное значение <code translate="no">tsafe</code> каждый раз, когда получает метку времени от узла вставки. <code translate="no">tsafe</code> означает время безопасности, и все данные, вставленные до этого момента времени, могут быть запрошены. Например, если <code translate="no">tsafe</code> = 9, то все вставленные данные с временными метками меньше 9 могут быть запрошены.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Запрос в реальном времени в Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Запрос в реальном времени в Milvus осуществляется с помощью сообщений запроса. Сообщения запросов вставляются в лог-брокер через прокси. Затем узлы запроса получают сообщения запроса, просматривая канал запроса в лог-брокере.</p>
<h3 id="Query-message" class="common-anchor-header">Сообщение запроса</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Сообщение запроса</span> </span></p>
<p>Сообщение запроса включает в себя следующую важную информацию о запросе:</p>
<ul>
<li><code translate="no">msgID</code>: ID сообщения, идентификатор сообщения запроса, присвоенный системой.</li>
<li><code translate="no">collectionID</code>: : ID коллекции для запроса (если задан пользователем).</li>
<li><code translate="no">execPlan</code>: План выполнения в основном используется для фильтрации атрибутов в запросе.</li>
<li><code translate="no">service_ts</code>: Временная метка сервиса будет обновляться вместе с <code translate="no">tsafe</code>, указанным выше. Временная метка сервиса означает, в какой момент времени находится сервис. Все данные, вставленные до <code translate="no">service_ts</code>, доступны для запроса.</li>
<li><code translate="no">travel_ts</code>: Временная метка путешествия задает диапазон времени в прошлом. Запрос будет выполняться к данным, существующим в период времени, указанный <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: Временная метка гарантии задает период времени, после которого необходимо выполнить запрос. Запрос будет выполняться только в том случае, если <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Запрос в реальном времени</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Процесс запроса</span> </span></p>
<p>При получении сообщения запроса Milvus сначала проверяет, превышает ли текущее время обслуживания, <code translate="no">service_ts</code>, гарантийную метку времени, <code translate="no">guarantee_ts</code>, в сообщении запроса. Если да, то запрос будет выполнен. Запросы выполняются параллельно как на исторических, так и на инкрементных данных. Поскольку потоковые и пакетные данные могут пересекаться, для отсеивания избыточных результатов запроса необходимо выполнить действие под названием "локальное сокращение".</p>
<p>Однако если текущее время обслуживания меньше, чем гарантийная метка времени в новом сообщении запроса, сообщение запроса становится неразрешенным и ожидает обработки до тех пор, пока время обслуживания не станет больше гарантийной метки времени.</p>
<p>Результаты запросов в конечном итоге передаются в канал результатов. Прокси получает результаты запроса из этого канала. Кроме того, прокси будет выполнять "глобальное уменьшение", поскольку он получает результаты от нескольких узлов запроса, и результаты запроса могут быть повторяющимися.</p>
<p>Чтобы убедиться, что прокси получил все результаты запроса, прежде чем вернуть их в SDK, в сообщении результата также будет храниться информация, включающая искомые закрытые сегменты, искомые DMC-каналы и глобальные закрытые сегменты (все сегменты на всех узлах запроса). Система может сделать вывод, что прокси получил все результаты запроса, только если выполняются оба следующих условия:</p>
<ul>
<li>Объединение всех искомых запечатанных сегментов, записанных во всех сообщениях результатов, больше, чем глобальные запечатанные сегменты,</li>
<li>Все DMC-каналы в коллекции запрошены.</li>
</ul>
<p>В конечном итоге прокси возвращает окончательные результаты после "глобального сокращения" в Milvus SDK.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">О серии глубоких погружений<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>После <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">официального объявления об общей доступности</a> Milvus 2.0 мы организовали эту серию блогов Milvus Deep Dive, чтобы предоставить углубленную интерпретацию архитектуры и исходного кода Milvus. В этой серии блогов рассматриваются следующие темы:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Обзор архитектуры Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API и Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Обработка данных</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Управление данными</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Запрос в реальном времени</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Скалярный механизм выполнения</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Система контроля качества</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Векторный механизм выполнения</a></li>
</ul>
