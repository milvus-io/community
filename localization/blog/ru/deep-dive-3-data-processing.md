---
id: deep-dive-3-data-processing.md
title: Как обрабатываются данные в векторной базе данных?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus предоставляет инфраструктуру управления данными, необходимую для
  производственных приложений искусственного интеллекта. В этой статье
  раскрываются тонкости обработки данных внутри.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/czs007">Чжэньшань Цао</a> и переработана <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>В предыдущих двух постах этой серии мы уже рассмотрели <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">системную архитектуру</a> Milvus, самой передовой в мире векторной базы данных, а также ее <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">SDK и API на языке Python</a>.</p>
<p>Цель этого поста - помочь вам понять, как обрабатываются данные в Milvus, углубившись в систему Milvus и рассмотрев взаимодействие между компонентами обработки данных.</p>
<p><em>Ниже перечислены некоторые полезные ресурсы, необходимые для начала работы. Мы рекомендуем сначала прочитать их, чтобы лучше понять тему этого поста.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Глубокое погружение в архитектуру Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Модель данных Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Роль и функции каждого компонента Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Обработка данных в Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Интерфейс MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">Интерфейс MsgStream</a> имеет решающее значение для обработки данных в Milvus. Когда вызывается <code translate="no">Start()</code>, короутин в фоновом режиме записывает данные в <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">лог-брокер</a> или считывает их оттуда. Когда вызывается <code translate="no">Close()</code>, корутина останавливается.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Интерфейс MsgStream</span> </span></p>
<p>MsgStream может выступать в роли производителя и потребителя. Интерфейс <code translate="no">AsProducer(channels []string)</code> определяет MsgStream как производителя, а <code translate="no">AsConsumer(channels []string, subNamestring)</code>- как потребителя. Параметр <code translate="no">channels</code> является общим для обоих интерфейсов и используется для определения того, в какие (физические) каналы записывать или считывать данные.</p>
<blockquote>
<p>Количество шардов в коллекции может быть задано при ее создании. Каждый шард соответствует <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">виртуальному каналу (vchannel)</a>. Поэтому коллекция может иметь несколько виртуальных каналов. Milvus назначает каждому виртуальному каналу в лог-брокере <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">физический канал (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Каждому виртуальному каналу/шарду соответствует физический канал</span>. </span></p>
<p><code translate="no">Produce()</code> в интерфейсе MsgStream, отвечающем за запись данных в pchannels в log broker. Данные могут быть записаны двумя способами:</p>
<ul>
<li>Одиночная запись: сущности записываются в разные шарды (vchannel) по хэш-значениям первичных ключей. Затем эти сущности поступают в соответствующие pchannels в log broker.</li>
<li>Широковещательная запись: сущности записываются во все pchannels, указанные параметром <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> является разновидностью блокирующего API. Если в указанном pchannel нет данных, то при вызове <code translate="no">Consume()</code> в интерфейсе MsgStream корутина будет заблокирована. С другой стороны, <code translate="no">Chan()</code> является неблокирующим API, что означает, что корутина читает и обрабатывает данные только в том случае, если в указанном pchannel есть существующие данные. В противном случае корутина может обрабатывать другие задачи и не будет заблокирована при отсутствии данных.</p>
<p><code translate="no">Seek()</code> метод восстановления после сбоев. При запуске нового узла можно получить запись о потреблении данных и возобновить потребление данных с того места, где оно было прервано, вызвав <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Запись данных<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Данные, записываемые в различные vchannels (shards), могут быть либо сообщениями вставки, либо сообщениями удаления. Эти vchannels также могут называться DmChannels (каналы манипулирования данными).</p>
<p>Различные коллекции могут использовать одни и те же каналы в брокере журналов. Одна коллекция может иметь несколько шардов и, следовательно, несколько соответствующих vchannels. Сущности в одной коллекции, следовательно, поступают в несколько соответствующих pchannels в брокере журналов. В результате выгода от совместного использования pchannels заключается в увеличении пропускной способности, обеспечиваемой высокой параллельностью брокера журналов.</p>
<p>При создании коллекции указывается не только количество шардов, но и определяется сопоставление между vchannels и pchannels в лог-брокере.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Путь записи в Milvus</span> </span></p>
<p>Как показано на рисунке выше, при записи прокси-серверы записывают данные в лог-брокер через интерфейс <code translate="no">AsProducer()</code> MsgStream. Затем узлы данных потребляют эти данные, после чего преобразуют и сохраняют потребленные данные в объектном хранилище. Путь хранения - это тип метаинформации, которая будет записываться в etcd координаторами данных.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flowgraph</h3><p>Поскольку разные коллекции могут использовать одни и те же pchannels в лог-брокере, при потреблении данных узлам данных или узлам запросов необходимо определить, к какой коллекции принадлежат данные в pchannel. Чтобы решить эту проблему, мы ввели в Milvus функцию flowgraph. В основном он отвечает за фильтрацию данных в общем pchannel по идентификаторам коллекций. Таким образом, можно сказать, что каждый flowgraph обрабатывает поток данных в соответствующем шарде (vchannel) в коллекции.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Флоуграф на пути записи</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Создание MsgStream</h3><p>При записи данных объект MsgStream создается в следующих двух сценариях:</p>
<ul>
<li>Когда прокси получает запрос на вставку данных, он сначала пытается получить отображение между vchannels и pchannels через корневой координатор (root coord). Затем прокси создает объект MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Сценарий 1</span> </span></p>
<ul>
<li>Когда узел данных запускается и считывает метаинформацию каналов в etcd, создается объект MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Сценарий 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Чтение данных<button data-href="#Read-data" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Путь чтения в Milvus</span> </span></p>
<p>Общий процесс чтения данных показан на рисунке выше. Запросы транслируются по каналу DqRequestChannel на узлы запросов. Узлы запросов параллельно выполняют задачи запроса. Результаты запросов от узлов запросов проходят через gRPC, прокси агрегирует результаты и возвращает их клиенту.</p>
<p>Чтобы рассмотреть процесс чтения данных более подробно, мы видим, что прокси записывает запросы в канал DqRequestChannel. Затем узлы запросов потребляют сообщения, подписываясь на DqRequestChannel. Каждое сообщение в канале DqRequestChannel транслируется, чтобы все подписанные узлы запроса могли его получить.</p>
<p>Когда узлы запроса получают запросы, они выполняют локальный запрос как к пакетным данным, хранящимся в запечатанных сегментах, так и к потоковым данным, которые динамически вставляются в Milvus и хранятся в растущих сегментах. После этого узлы запроса должны агрегировать результаты запроса как в <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">закрытых, так и в растущих сегментах</a>. Эти агрегированные результаты передаются прокси-серверу через gRPC.</p>
<p>Прокси собирает все результаты от нескольких узлов запроса и затем агрегирует их для получения окончательных результатов. Затем прокси возвращает окончательные результаты запроса клиенту. Поскольку каждый запрос и соответствующие ему результаты запроса обозначаются одним и тем же уникальным requestID, прокси может определить, какие результаты запроса соответствуют какому запросу.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flowgraph</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Flowgraph в пути чтения</span> </span></p>
<p>Подобно пути записи, флоуграфы также представлены в пути чтения. В Milvus реализована унифицированная архитектура Lambda, которая объединяет обработку инкрементных и исторических данных. Поэтому узлы запросов должны получать и потоковые данные в реальном времени. Аналогично, потоковые графы на пути чтения фильтруют и дифференцируют данные из разных коллекций.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Создание MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Создание объекта MsgStream в пути чтения</span> </span></p>
<p>При чтении данных объект MsgStream создается в следующем сценарии:</p>
<ul>
<li>В Milvus данные не могут быть прочитаны, пока они не загружены. Когда прокси получает запрос на загрузку данных, он отправляет запрос координатору запросов, который решает, как назначить шарды различным узлам запросов. Информация о назначении (т. е. имена vchannels и отображение между vchannels и соответствующими им pchannels) отправляется узлам запросов через вызов метода или RPC (удаленный вызов процедуры). Впоследствии узлы запросов создают соответствующие объекты MsgStream для потребления данных.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Операции DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL означает язык определения данных. Операции DDL над метаданными можно разделить на запросы на запись и запросы на чтение. Однако при обработке метаданных эти два типа запросов обрабатываются одинаково.</p>
<p>К запросам на чтение метаданных относятся:</p>
<ul>
<li>схема коллекции запросов</li>
<li>Информация об индексировании запросов и многое другое.</li>
</ul>
<p>Запросы на запись включают:</p>
<ul>
<li>Создать коллекцию</li>
<li>Удалить коллекцию</li>
<li>Создать индекс</li>
<li>Удалить индекс и многое другое.</li>
</ul>
<p>DDL-запросы отправляются прокси от клиента, и далее прокси передает эти запросы в полученном порядке корневому коорду, который назначает временную метку для каждого DDL-запроса и проводит динамические проверки запросов. Прокси обрабатывает каждый запрос последовательно, то есть по одному DDL-запросу за раз. Прокси не будет обрабатывать следующий запрос, пока не завершит обработку предыдущего и не получит результаты от корневого коорда.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Операции DDL</span>. </span></p>
<p>Как показано на рисунке выше, в очереди задач Root coord находится <code translate="no">K</code> DDL-запросов. DDL-запросы в очереди задач располагаются в порядке их поступления в корневой коорд. Так, <code translate="no">ddl1</code> - первый, отправленный в корневой коорд, а <code translate="no">ddlK</code> - последний в этой партии. Корневой коорд обрабатывает запросы один за другим в порядке очереди.</p>
<p>В распределенной системе связь между прокси и корневым коордом обеспечивается с помощью gRPC. Корневой коорд ведет учет максимального значения временной метки выполняемых задач, чтобы гарантировать, что все DDL-запросы будут обработаны в порядке очереди.</p>
<p>Предположим, есть два независимых прокси, прокси 1 и прокси 2. Они оба отправляют DDL-запросы на один и тот же корневой коорд. Однако одна из проблем заключается в том, что более ранние запросы не обязательно отправляются в корневой коорд раньше, чем запросы, полученные другим прокси позже. Например, на изображении выше, когда <code translate="no">DDL_K-1</code> отправляется в корневой коорд от прокси 1, <code translate="no">DDL_K</code> от прокси 2 уже был принят и выполнен корневым коордом. Как записал корневой коорд, максимальное значение временной метки выполненных задач в этот момент составляет <code translate="no">K</code>. Поэтому, чтобы не нарушать временной порядок, запрос <code translate="no">DDL_K-1</code> будет отклонен очередью задач корневого координатора. Однако, если прокси 2 отправит запрос <code translate="no">DDL_K+5</code> корневому координатору в этот момент, запрос будет принят в очередь задач и будет выполнен позже в соответствии с его значением временной метки.</p>
<h2 id="Indexing" class="common-anchor-header">Индексирование<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Построение индекса</h3><p>Получая от клиента запросы на построение индекса, прокси сначала выполняет статическую проверку запросов и отправляет их в корневой коорд. Затем корневой коорд сохраняет эти запросы на построение индекса в метахранилище (etcd) и отправляет запросы координатору индекса (index coord).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Построение индекса</span>. </span></p>
<p>Как показано выше, когда индексный координатор получает запросы на построение индекса от корневого координатора, он сначала сохраняет задачу в etcd для метахранилища. Начальный статус задачи построения индекса - <code translate="no">Unissued</code>. Индексный коорд ведет учет загрузки задач каждого индексного узла и отправляет входящие задачи на менее загруженный индексный узел. По завершении задачи индексный узел записывает статус задачи, либо <code translate="no">Finished</code>, либо <code translate="no">Failed</code>, в метахранилище, которым в Milvus является etcd. Затем индексный узел поймет, успешна или нет задача построения индекса, посмотрев в etcd. Если задача провалилась из-за нехватки системных ресурсов или падения индексного узла, индексный коорд повторно запустит весь процесс и назначит ту же задачу другому индексному узлу.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Отказ от индекса</h3><p>Кроме того, index coord отвечает за запросы на удаление индексов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Сбрасывание индекса</span>. </span></p>
<p>Когда корневой узел получает от клиента запрос на сброс индекса, он сначала помечает индекс как &quot;сброшенный&quot; и возвращает результат клиенту, уведомляя об этом индексный узел. Затем индексный коорд фильтрует все задачи индексирования по адресу <code translate="no">IndexID</code>, и те задачи, которые соответствуют условию, отбрасываются.</p>
<p>Фоновая коротина index coord постепенно удаляет все задачи индексирования, помеченные как "dropped", из хранилища объектов (MinIO и S3). В этом процессе задействован интерфейс recycleIndexFiles. Когда все соответствующие индексные файлы будут удалены, метаинформация удаленных задач индексирования будет удалена из метахранилища (etcd).</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">О серии "Глубокое погружение<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
