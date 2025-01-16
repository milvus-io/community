---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Вставка и сохранение данных в векторной базе данных
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Узнайте о механизме вставки и сохранения данных в векторной базе данных
  Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/sunby">Биньи Сун</a> и переработана <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>В предыдущей статье из серии "Глубокое погружение" мы рассказали о <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">том, как обрабатываются данные в Milvus</a>, самой передовой в мире векторной базе данных. В этой статье мы продолжим рассматривать компоненты, участвующие во вставке данных, подробно проиллюстрируем модель данных и объясним, как в Milvus достигается сохранение данных.</p>
<p>Перейти к:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Обзор архитектуры Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">Портал запросов на вставку данных</a></li>
<li><a href="#Data-coord-and-data-node">Корд данных и узел данных</a></li>
<li><a href="#Root-coord-and-Time-Tick">Корневая координата и временной тик</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Организация данных: коллекция, раздел, осколок (канал), сегмент</a></li>
<li><a href="#Data-allocation-when-and-how">Распределение данных: когда и как</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Структура файлов Binlog и сохранение данных</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Обзор архитектуры Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Архитектура Milvus</span>. </span></p>
<p>SDK отправляет запросы данных на прокси, портал, через балансировщик нагрузки. Затем прокси взаимодействует с сервисом-координатором для записи запросов DDL (язык определения данных) и DML (язык манипулирования данными) в хранилище сообщений.</p>
<p>Рабочие узлы, включая узел запросов, узел данных и индексный узел, потребляют запросы из хранилища сообщений. В частности, узел запросов отвечает за запрос данных, узел данных - за вставку и сохранение данных, а индексный узел в основном занимается построением индексов и ускорением запросов.</p>
<p>Нижний уровень - это объектное хранилище, которое в основном использует MinIO, S3 и AzureBlob для хранения журналов, дельта-бинлогов и индексных файлов.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">Портал запросов на вставку данных<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Прокси в Milvus</span>. </span></p>
<p>Прокси служит порталом запросов на вставку данных.</p>
<ol>
<li>Изначально прокси принимает запросы на вставку данных от SDK и распределяет их на несколько бакетов с помощью хэш-алгоритма.</li>
<li>Затем прокси запрашивает data coord для назначения сегментов, наименьшей единицы в Milvus для хранения данных.</li>
<li>После этого прокси вставляет информацию о запрошенных сегментах в хранилище сообщений, чтобы эти данные не были потеряны.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Координатор данных и узел данных<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Основная функция data coord - управление распределением каналов и сегментов, а основная функция data node - потребление и сохранение вставленных данных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Коорд данных и узел данных в Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Функция</h3><p>Data coord выполняет следующие функции:</p>
<ul>
<li><p><strong>Выделение сегментного пространства</strong>Data coord выделяет прокси пространство в растущих сегментах, чтобы прокси мог использовать свободное пространство в сегментах для вставки данных.</p></li>
<li><p><strong>Запись распределения сегмента и времени истечения срока действия выделенного пространства в сегменте</strong>Пространство в каждом сегменте, выделенное data coord, не является постоянным, поэтому data coord также должен вести запись времени истечения срока действия каждого выделенного сегмента.</p></li>
<li><p><strong>Автоматическая промывка данных сегмента</strong>Если сегмент заполнен, координатор данных автоматически запускает промывку данных.</p></li>
<li><p><strong>Распределение каналов для узлов данных</strong>Коллекция может иметь несколько <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannels</a>. Data coord определяет, какие vchannels потребляются узлами данных.</p></li>
</ul>
<p>Узел данных выполняет следующие функции:</p>
<ul>
<li><p><strong>Потребление данных</strong>Узел данных потребляет данные из каналов, выделенных data coord, и создает последовательность для этих данных.</p></li>
<li><p><strong>Сохранение данных</strong>Кэширование вставленных данных в памяти и автоматическая очистка вставленных данных на диск, когда объем данных достигает определенного порога.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Рабочий процесс</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Один канал vchannel может быть назначен только одному узлу данных</span>. </span></p>
<p>Как показано на рисунке выше, коллекция имеет четыре канала (V1, V2, V3 и V4) и два узла данных. Вполне вероятно, что data coord назначит один узел данных для потребления данных из V1 и V2, а другой узел данных - из V3 и V4. Один канал vchannel не может быть назначен нескольким узлам данных, и это делается для предотвращения повторного потребления данных, что в противном случае приведет к повторной вставке одной и той же порции данных в один и тот же сегмент.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord и Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord управляет TSO (timestamp Oracle) и публикует сообщения о временных отметках в глобальном масштабе. Каждый запрос на вставку данных имеет временную метку, назначенную корневым коордом. Time Tick - это краеугольный камень Milvus, который действует как часы в Milvus и указывает, в какой момент времени находится система Milvus.</p>
<p>Когда данные записываются в Milvus, каждый запрос на вставку данных содержит временную метку. Во время потребления данных каждый узел временных данных потребляет данные, временные метки которых находятся в определенном диапазоне.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Пример вставки и потребления данных на основе временной метки</span>. </span></p>
<p>На рисунке выше показан процесс вставки данных. Значения временных меток представлены числами 1,2,6,5,7,8. Данные записываются в систему двумя прокси-серверами: p1 и p2. Во время потребления данных, если текущее время Time Tick равно 5, узлы данных могут считывать только данные 1 и 2. Затем во время второго чтения, если текущее время Time Tick становится 9, данные 6,7,8 могут быть прочитаны узлом данных.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Организация данных: коллекция, раздел, осколок (канал), сегмент<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Организация данных в Milvus</span>. </span></p>
<p>Прочитайте эту <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">статью</a>, чтобы понять модель данных в Milvus и понятия коллекции, раздела и сегмента.</p>
<p>В целом, самой крупной единицей данных в Milvus является коллекция, которую можно сравнить с таблицей в реляционной базе данных. Коллекция может иметь несколько осколков (каждый из которых соответствует каналу) и несколько разделов внутри каждого осколка. Как показано на рисунке выше, каналы (шарды) - это вертикальные полосы, а разделы - горизонтальные. На каждом пересечении находится понятие сегмента, наименьшей единицы для распределения данных. В Milvus индексы строятся на основе сегментов. Во время выполнения запроса система Milvus также балансирует нагрузку на различные узлы запроса, и этот процесс происходит на основе единицы сегментов. Сегменты содержат несколько <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">бинлогов</a>, и когда данные сегмента расходуются, генерируется файл бинлога.</p>
<h3 id="Segment" class="common-anchor-header">Сегмент</h3><p>В Milvus существует три типа сегментов с различным статусом: растущий, запечатанный и промытый сегмент.</p>
<h4 id="Growing-segment" class="common-anchor-header">Растущий сегмент</h4><p>Растущий сегмент - это вновь созданный сегмент, который может быть выделен прокси-серверу для вставки данных. Внутреннее пространство сегмента может быть использовано, выделено или свободно.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Три состояния растущего сегмента</span> </span></p>
<ul>
<li>Используется: эта часть пространства растущего сегмента была использована узлом данных.</li>
<li>Выделено: эта часть пространства растущего сегмента была запрошена прокси и выделена узлом данных. Выделенное пространство истечет через определенное время.</li>
<li>Свободно: эта часть пространства растущего сегмента не была использована. Значение свободного пространства равно общему пространству сегмента, вычтенному из значений использованного и выделенного пространства. Таким образом, свободное пространство сегмента увеличивается по мере истечения выделенного пространства.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Герметичный сегмент</h4><p>Запечатанный сегмент - это закрытый сегмент, который больше не может быть выделен прокси-серверу для вставки данных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Запечатанный сегмент в Milvus</span> </span></p>
<p>Растущий сегмент запечатывается в следующих случаях:</p>
<ul>
<li>Если используемое пространство в растущем сегменте достигает 75 % от общего пространства, сегмент будет запечатан.</li>
<li>Flush() вызывается вручную пользователем Milvus, чтобы сохранить все данные в коллекции.</li>
<li>Растущие сегменты, которые не запечатываются после длительного периода времени, будут запечатаны, так как слишком большое количество растущих сегментов приводит к перерасходу памяти узлами данных.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Промытый сегмент</h4><p>Промытый сегмент - это сегмент, который уже был записан на диск. Промывка означает сохранение данных сегмента в объектном хранилище для обеспечения сохранности данных. Сегмент можно прошить только после того, как закончится выделенное место в запечатанном сегменте. При промывке запечатанный сегмент превращается в промытый.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Промытый сегмент в Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Канал</h3><p>Канал выделяется :</p>
<ul>
<li>Когда узел данных запускается или выключается; или</li>
<li>Когда выделенное сегментное пространство запрашивается прокси.</li>
</ul>
<p>Существует несколько стратегий выделения канала. Milvus поддерживает 2 из них:</p>
<ol>
<li>Последовательное хэширование</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Последовательное хеширование в Milvus</span> </span></p>
<p>Стратегия по умолчанию в Milvus. Эта стратегия использует технику хэширования для назначения каждому каналу позиции в кольце, а затем выполняет поиск в направлении по часовой стрелке, чтобы найти ближайший к каналу узел данных. Так, на иллюстрации выше канал 1 назначен узлу данных 2, а канал 2 - узлу данных 3.</p>
<p>Однако одна из проблем этой стратегии заключается в том, что увеличение или уменьшение числа узлов данных (например, запуск нового узла данных или внезапное отключение узла данных) может повлиять на процесс распределения каналов. Чтобы решить эту проблему, data coord отслеживает статус узлов данных через etcd, так что data coord может быть немедленно уведомлен о любых изменениях в статусе узлов данных. Затем data coord определяет, какому узлу данных правильно распределить каналы.</p>
<ol start="2">
<li>Балансировка нагрузки</li>
</ol>
<p>Вторая стратегия заключается в распределении каналов одной и той же коллекции между различными узлами данных, обеспечивая равномерное распределение каналов. Цель этой стратегии - добиться баланса нагрузки.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Распределение данных: когда и как<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Процесс распределения данных в Milvus</span> </span></p>
<p>Процесс распределения данных начинается с клиента. Сначала он отправляет запросы на вставку данных с временной меткой <code translate="no">t1</code> на прокси-сервер. Затем прокси отправляет запрос в data coord на выделение сегмента.</p>
<p>Получив запрос на выделение сегмента, data coord проверяет статус сегмента и выделяет его. Если текущее пространство созданных сегментов достаточно для новых вставленных строк данных, коорд данных выделяет эти созданные сегменты. Однако если места в текущих сегментах недостаточно, коорд данных выделит новый сегмент. Координатор данных может возвращать один или несколько сегментов при каждом запросе. При этом коорд данных также сохраняет выделенный сегмент в метасервере для сохранения данных.</p>
<p>Затем координатор данных возвращает информацию о выделенном сегменте (включая идентификатор сегмента, количество строк, время истечения <code translate="no">t2</code>, и т.д.) прокси-серверу. Прокси отправляет информацию о выделенном сегменте в хранилище сообщений, чтобы эта информация была правильно записана. Обратите внимание, что значение <code translate="no">t1</code> должно быть меньше, чем значение <code translate="no">t2</code>. По умолчанию значение <code translate="no">t2</code> равно 2 000 миллисекунд, и его можно изменить, настроив параметр <code translate="no">segment.assignmentExpiration</code> в файле <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Структура файла Binlog и сохранение данных<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Промывка узла данных</span> </span></p>
<p>Узел данных подписывается на хранилище сообщений, потому что запросы на вставку данных хранятся в хранилище сообщений, и узлы данных могут таким образом потреблять сообщения на вставку. Сначала узлы данных помещают запросы на вставку в буфер вставки, и по мере накопления запросов они будут сбрасываться в хранилище объектов по достижении порогового значения.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Структура файла Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Структура файла binlog</span>. </span></p>
<p>Структура файла binlog в Milvus похожа на структуру файла в MySQL. Binlog используется для выполнения двух функций: восстановления данных и построения индексов.</p>
<p>Бинлог содержит множество <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">событий</a>. Каждое событие имеет заголовок и данные о событии.</p>
<p>Метаданные, включая время создания бинлога, идентификатор узла записи, длину события, NextPosition (смещение следующего события) и т. д., записываются в заголовке события.</p>
<p>Данные события можно разделить на две части: фиксированную и переменную.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Файловая структура события вставки</span>. </span></p>
<p>Фиксированная часть в данных события <code translate="no">INSERT_EVENT</code> содержит <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code> и <code translate="no">reserved</code>.</p>
<p>Переменная часть фактически хранит вставляемые данные. Данные вставки упорядочиваются в формат parquet и хранятся в этом файле.</p>
<h3 id="Data-persistence" class="common-anchor-header">Сохранение данных</h3><p>Если в схеме есть несколько столбцов, Milvus будет хранить бинлоги в столбцах.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Сохранение данных бинлога</span>. </span></p>
<p>Как показано на рисунке выше, первый столбец - это первичный ключ binlog. Второй - столбец временной метки. Остальные столбцы определены в схеме. Путь к файлам бинлогов в MinIO также указан на изображении выше.</p>
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
    </button></h2><p>После <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">официального объявления об общей доступности</a> Milvus 2.0 мы организовали эту серию блогов Milvus Deep Dive, чтобы дать глубокую интерпретацию архитектуры и исходного кода Milvus. В этой серии блогов рассматриваются следующие темы:</p>
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
