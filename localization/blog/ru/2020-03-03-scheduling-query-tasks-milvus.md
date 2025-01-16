---
id: scheduling-query-tasks-milvus.md
title: Справочная информация
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: Работа за сценой
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Как Milvus планирует задачи запросов</custom-h1><p>В этой статье мы обсудим, как Milvus планирует задачи запросов. Мы также поговорим о проблемах, решениях и будущих направлениях реализации планирования Milvus.</p>
<h2 id="Background" class="common-anchor-header">Справочная информация<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Из книги Managing Data in Massive-Scale Vector Search Engine мы знаем, что векторный поиск сходства осуществляется по расстоянию между двумя векторами в высокоразмерном пространстве. Цель векторного поиска - найти K векторов, которые наиболее близки к целевому вектору.</p>
<p>Существует множество способов измерения векторного расстояния, например евклидово расстояние:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>где x и y - два вектора. n - размерность векторов.</p>
<p>Для того чтобы найти K ближайших векторов в наборе данных, необходимо вычислить евклидово расстояние между целевым вектором и всеми векторами в наборе данных, по которым ведется поиск. Затем векторы сортируются по расстоянию, чтобы получить K ближайших векторов. Вычислительная работа прямо пропорциональна размеру набора данных. Чем больше набор данных, тем больше вычислительной работы требует запрос. Графический процессор, специализированный для обработки графов, обладает большим количеством ядер, чтобы обеспечить необходимую вычислительную мощность. Таким образом, поддержка нескольких GPU также учитывается при реализации Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Основные понятия<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Блок данных（TableFile）</h3><p>Чтобы улучшить поддержку поиска данных в больших объемах, мы оптимизировали хранение данных в Milvus. Milvus разбивает данные в таблице по размеру на несколько блоков данных. Во время векторного поиска Milvus ищет векторы в каждом блоке данных и объединяет результаты. Одна операция векторного поиска состоит из N независимых операций векторного поиска (N - количество блоков данных) и N-1 операций слияния результатов.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Очередь задач（TaskTable）</h3><p>Каждый ресурс имеет массив задач, в который записываются задачи, принадлежащие данному ресурсу. Каждая задача имеет различные состояния, включая Start, Loading, Loaded, Executing и Executed. Загрузчик и исполнитель на вычислительном устройстве используют одну и ту же очередь задач.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Планирование запросов</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>Когда сервер Milvus запускается, Milvus запускает соответствующий ресурс GpuResource через параметры <code translate="no">gpu_resource_config</code> в конфигурационном файле <code translate="no">server_config.yaml</code>. DiskResource и CpuResource по-прежнему нельзя редактировать в <code translate="no">server_config.yaml</code>. GpuResource представляет собой комбинацию <code translate="no">search_resources</code> и <code translate="no">build_index_resources</code> и в следующем примере обозначается как <code translate="no">{gpu0, gpu1}</code>:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>Milvus получает запрос. Метаданные таблицы хранятся во внешней базе данных, в качестве которой выступают SQLite или MySQl для однохостовых систем и MySQL для распределенных. Получив запрос на поиск, Milvus проверяет, существует ли таблица и соответствует ли размерность. Затем Milvus считывает список TableFile таблицы.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus создает задачу SearchTask. Поскольку вычисление каждого TableFile выполняется независимо, Milvus создает SearchTask для каждого TableFile. Как основная единица планирования задач, SearchTask содержит целевые векторы, параметры поиска и имена файлов TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus выбирает вычислительное устройство. Устройство, на котором выполняется вычисление в SearchTask, зависит от <strong>предполагаемого</strong> времени <strong>завершения</strong> для каждого устройства. <strong>Расчетное</strong> время <strong>завершения</strong> определяет предполагаемый интервал между текущим временем и предполагаемым временем завершения вычислений.</li>
</ol>
<p>Например, когда блок данных задачи SearchTask загружается в память CPU, следующая задача SearchTask ожидает в очереди вычислительных задач CPU, а очередь вычислительных задач GPU простаивает. <strong>Расчетное время завершения</strong> для CPU равно сумме расчетных временных затрат предыдущей SearchTask и текущей SearchTask. <strong>Расчетное время завершения</strong> для GPU равно сумме времени загрузки блоков данных на GPU и расчетной временной стоимости текущей задачи SearchTask. <strong>Расчетное время выполнения</strong> задачи поиска в ресурсе равно среднему времени выполнения всех задач поиска в ресурсе. Затем Milvus выбирает устройство с наименьшим <strong>расчетным временем выполнения</strong> и назначает SearchTask на это устройство.</p>
<p>Здесь мы предполагаем, что <strong>расчетное время завершения</strong> для GPU1 короче.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-shorter-estimated-completion-time.png</span> </span></p>
<ol start="5">
<li><p>Milvus добавляет SearchTask в очередь задач DiskResource.</p></li>
<li><p>Milvus перемещает SearchTask в очередь задач CpuResource. Поток загрузки в CpuResource последовательно загружает каждую задачу из очереди задач. CpuResource считывает соответствующие блоки данных в память процессора.</p></li>
<li><p>Milvus перемещает SearchTask в GpuResource. Загрузочный поток в GpuResource копирует данные из памяти CPU в память GPU. GpuResource считывает соответствующие блоки данных в память GPU.</p></li>
<li><p>Milvus выполняет SearchTask в GpuResource. Поскольку результат выполнения SearchTask относительно невелик, он возвращается непосредственно в память CPU.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus объединяет результат выполнения SearchTask с результатом поиска в целом.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>После завершения всех SearchTasks Milvus возвращает клиенту весь результат поиска.</p>
<h2 id="Index-building" class="common-anchor-header">Построение индексов<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>Построение индекса - это, по сути, то же самое, что и процесс поиска, только без процесса слияния. Мы не будем говорить об этом подробно.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Оптимизация производительности<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Кэш</h3><p>Как уже упоминалось, перед вычислениями блоки данных необходимо загружать на соответствующие устройства хранения, такие как память CPU или GPU. Чтобы избежать повторной загрузки данных, Milvus вводит кэш LRU (Least Recently Used). Когда кэш заполняется, новые блоки данных вытесняют старые. Размер кэша можно настроить в конфигурационном файле в зависимости от текущего объема памяти. Рекомендуется использовать большой кэш для хранения данных поиска, чтобы эффективно сократить время загрузки данных и повысить производительность поиска.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Дублирование загрузки данных и вычислений</h3><p>Кэш не может удовлетворить наши потребности в повышении производительности поиска. При нехватке памяти или слишком большом размере набора данных требуется повторная загрузка данных. Нам нужно уменьшить влияние загрузки данных на производительность поиска. Загрузка данных, будь то с диска в память процессора или из памяти процессора в память GPU, относится к операциям ввода-вывода и практически не требует вычислительной работы от процессоров. Поэтому мы рассматриваем возможность параллельного выполнения загрузки данных и вычислений для более эффективного использования ресурсов.</p>
<p>Мы разбиваем вычисления над блоком данных на 3 этапа (загрузка с диска в память CPU, вычисления CPU, объединение результатов) или 4 этапа (загрузка с диска в память CPU, загрузка из памяти CPU в память GPU, вычисления и получение результатов на GPU, объединение результатов). Если взять в качестве примера трехэтапные вычисления, то мы можем запустить 3 потока, отвечающих за 3 этапа, чтобы обеспечить конвейеризацию инструкций. Поскольку наборы результатов в основном невелики, объединение результатов не занимает много времени. В некоторых случаях перекрытие загрузки данных и вычислений может сократить время поиска на 1/2.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Проблемы и решения<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Разные скорости передачи данных</h3><p>Ранее Milvus использовал стратегию Round Robin для планирования задач на нескольких GPU. Эта стратегия отлично работала на нашем 4-GPU сервере, и производительность поиска была в 4 раза выше. Однако на наших хостах с 2 GPU производительность была не в 2 раза выше. Мы провели несколько экспериментов и обнаружили, что скорость копирования данных для одного GPU составляет 11 ГБ/с. Однако для другого GPU она составляла 3 ГБ/с. Обратившись к документации на материнскую плату, мы убедились, что она подключена к одному GPU через PCIe x16, а к другому - через PCIe x4. То есть эти GPU имеют разную скорость копирования. Позже мы добавили время копирования, чтобы определить оптимальное устройство для каждой задачи SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Будущая работа<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Аппаратное окружение повышенной сложности</h3><p>В реальных условиях аппаратная среда может быть более сложной. В аппаратных средах с несколькими CPU, памятью с архитектурой NUMA, NVLink и NVSwitch взаимодействие между CPU/GPU открывает широкие возможности для оптимизации.</p>
<p>Оптимизация запросов</p>
<p>В ходе экспериментов мы обнаружили несколько возможностей для повышения производительности. Например, когда сервер получает несколько запросов к одной и той же таблице, при определенных условиях их можно объединить. Используя локальность данных, мы можем повысить производительность. Эти оптимизации будут реализованы в наших будущих разработках. Сейчас мы уже знаем, как планируются и выполняются запросы для сценария с одним хостом и несколькими GPU. Мы продолжим знакомить вас с внутренними механизмами Milvus в следующих статьях.</p>
