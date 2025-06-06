---
id: 2019-11-08-data-management.md
title: Как осуществляется управление данными в Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: В этом посте представлена стратегия управления данными в Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Управление данными в векторной поисковой системе большого масштаба</custom-h1><blockquote>
<p>Автор: Yihua Mo</p>
<p>Дата: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Как осуществляется управление данными в Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде всего, несколько основных понятий Milvus:</p>
<ul>
<li>Таблица: Таблица - это набор данных, состоящий из векторов, причем каждый вектор имеет уникальный идентификатор. Каждый вектор и его ID представляют собой строку таблицы. Все векторы в таблице должны иметь одинаковые размеры. Ниже приведен пример таблицы с 10-мерными векторами:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>таблица</span> </span></p>
<ul>
<li>Индекс: Построение индекса - это процесс кластеризации векторов по определенному алгоритму, который требует дополнительного дискового пространства. Некоторые типы индексов требуют меньше места, так как они упрощают и сжимают векторы, в то время как другие типы требуют больше места, чем необработанные векторы.</li>
</ul>
<p>В Milvus пользователи могут выполнять такие задачи, как создание таблицы, вставка векторов, построение индексов, поиск векторов, получение информации о таблице, удаление таблиц, удаление части данных в таблице и удаление индексов и т. д.</p>
<p>Предположим, что у нас есть 100 миллионов 512-мерных векторов, и нам нужно вставить и управлять ими в Milvus для эффективного векторного поиска.</p>
<p><strong>(1) Вставка векторов</strong></p>
<p>Давайте рассмотрим, как векторы вставляются в Milvus.</p>
<p>Поскольку каждый вектор занимает 2 КБ, минимальное пространство для хранения 100 миллионов векторов составляет около 200 ГБ, что делает нереальным однократную вставку всех этих векторов. Необходимо иметь несколько файлов данных вместо одного. Производительность вставки - один из ключевых показателей эффективности. Milvus поддерживает единовременную вставку сотен или даже десятков тысяч векторов. Например, единовременная вставка 30 тысяч 512-мерных векторов обычно занимает всего 1 секунду.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>вставка</span> </span></p>
<p>Не каждая вставка вектора загружается на диск. Для каждой создаваемой таблицы Milvus резервирует в памяти процессора буфер с изменяемыми данными, в который можно быстро записать вставленные данные. А когда данные в буфере достигнут определенного размера, это пространство будет помечено как неизменяемое. В это время будет зарезервирован новый буфер. Данные в неизменяемом буфере регулярно записываются на диск, а соответствующая память процессора освобождается. Механизм регулярной записи на диск похож на тот, что используется в Elasticsearch, который записывает буферизованные данные на диск каждые 1 секунду. Кроме того, пользователи, знакомые с LevelDB/RocksDB, могут увидеть здесь некоторое сходство с MemTable.</p>
<p>Цели механизма вставки данных следующие:</p>
<ul>
<li>Вставка данных должна быть эффективной.</li>
<li>Вставленные данные могут быть использованы мгновенно.</li>
<li>Файлы данных не должны быть слишком фрагментированы.</li>
</ul>
<p><strong>(2) Файл необработанных данных</strong></p>
<p>Когда векторы записываются на диск, они сохраняются в файле Raw Data File, содержащем необработанные векторы. Как уже говорилось, векторы большого масштаба необходимо сохранять и управлять ими в нескольких файлах данных. Размер вставляемых данных варьируется: пользователь может вставить 10 векторов или 1 миллион векторов за один раз. Однако операция записи на диск выполняется раз в 1 секунду. Таким образом, генерируются файлы данных разного размера.</p>
<p>Фрагментированными файлами данных неудобно управлять и к ним нелегко получить доступ для векторного поиска. Milvus постоянно объединяет эти маленькие файлы данных, пока размер объединенного файла не достигнет определенного размера, например, 1 ГБ. Этот конкретный размер можно настроить в API-параметре <code translate="no">index_file_size</code> при создании таблицы. Таким образом, 100 миллионов 512-мерных векторов будут распределены и сохранены примерно в 200 файлах данных.</p>
<p>Учитывая сценарии инкрементных вычислений, в которых векторы вставляются и ищутся одновременно, нам необходимо убедиться, что после записи векторов на диск они будут доступны для поиска. Таким образом, до слияния малых файлов данных к ним можно получить доступ и выполнить поиск. После завершения слияния файлы с малыми данными будут удалены, а для поиска будут использоваться новые объединенные файлы.</p>
<p>Вот как выглядят запрашиваемые файлы до слияния:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>Запрашиваемые файлы после слияния:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) Индексный файл</strong></p>
<p>Поиск по файлу Raw Data File - это грубый поиск, который сравнивает расстояния между векторами запроса и исходными векторами и вычисляет k ближайших векторов. Грубый поиск неэффективен. Эффективность поиска может быть значительно увеличена, если поиск основан на индексном файле, в котором векторы индексируются. Создание индекса требует дополнительного дискового пространства и обычно занимает много времени.</p>
<p>Так в чем же разница между файлами сырых данных и индексными файлами? Проще говоря, в Raw Data File записывается каждый вектор вместе с его уникальным идентификатором, а в Index File - результаты кластеризации векторов, такие как тип индекса, центроиды кластеров и векторы в каждом кластере.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>индексный файл</span> </span></p>
<p>Вообще говоря, Index File содержит больше информации, чем Raw Data File, но при этом размер файлов гораздо меньше, так как векторы упрощаются и квантуются в процессе построения индекса (для определенных типов индексов).</p>
<p>Вновь созданные таблицы по умолчанию ищутся методом грубого вычисления. После создания индекса в системе Milvus будет автоматически строить индекс для объединенных файлов, размер которых достигает 1 ГБ, в отдельном потоке. По завершении построения индекса генерируется новый индексный файл. Необработанные файлы данных будут заархивированы для построения индекса на основе других типов индексов.</p>
<p>Milvus автоматически строит индекс для файлов, размер которых достигает 1 ГБ:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Построение индекса завершено:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>Индекс не будет автоматически строиться для файлов необработанных данных, которые не достигают 1 ГБ, что может замедлить скорость поиска. Чтобы избежать этой ситуации, необходимо вручную принудительно построить индекс для этой таблицы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcebuild</span> </span></p>
<p>После принудительного построения индекса для файла производительность поиска значительно повышается.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Метаданные</strong></p>
<p>Как упоминалось ранее, 100 миллионов 512-мерных векторов хранятся в 200 дисковых файлах. При построении индекса для этих векторов потребуется еще 200 индексных файлов, что в сумме составит 400 файлов (включая дисковые и индексные файлы). Необходим эффективный механизм для управления метаданными (статусами файлов и другой информацией) этих файлов, чтобы проверять статусы файлов, удалять или создавать файлы.</p>
<p>Использование баз данных OLTP для управления этой информацией является хорошим выбором. Автономный Milvus использует SQLite для управления метаданными, а в распределенном развертывании Milvus использует MySQL. При запуске сервера Milvus в SQLite/MySQL создаются 2 таблицы (а именно 'Tables' и 'TableFiles') соответственно. В 'Tables' записывается информация о таблицах, а в 'TableFiles' - информация о файлах данных и индексных файлах.</p>
<p>Как показано на схеме ниже, "Tables" содержит метаданные, такие как имя таблицы (table_id), размерность вектора (dimension), дата создания таблицы (created_on), статус таблицы (state), тип индекса (engine_type), а также количество кластеров вектора (nlist) и метод вычисления расстояния (metric_type).</p>
<p>А 'TableFiles' содержит имя таблицы, к которой принадлежит файл (table_id), тип индекса файла (engine_type), имя файла (file_id), тип файла (file_type), размер файла (file_size), количество строк (row_count) и дату создания файла (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>метаданные</span> </span></p>
<p>С помощью этих метаданных можно выполнять различные операции. Ниже приведены примеры:</p>
<ul>
<li>Чтобы создать таблицу, Meta Manager достаточно выполнить SQL-оператор: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Чтобы выполнить векторный поиск в таблице_2, Meta Manager выполнит запрос в SQLite/MySQL, который де-факто является SQL-оператором: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> для получения информации о файлах таблицы_2. Затем эти файлы будут загружены в память планировщиком запросов для вычисления поиска.</li>
<li>Мгновенное удаление таблицы недопустимо, так как на нее могут выполняться запросы. Поэтому существуют мягкое и жесткое удаление таблицы. При удалении таблицы она будет помечена как "мягкое удаление", и дальнейшие запросы или изменения в ней запрещены. Однако запросы, которые выполнялись до удаления, все еще будут выполняться. Только когда все эти запросы перед удалением будут завершены, таблица вместе с ее метаданными и связанными файлами будет удалена навсегда.</li>
</ul>
<p><strong>(5) Планировщик запросов</strong></p>
<p>Приведенная ниже диаграмма демонстрирует процесс поиска векторов на CPU и GPU путем запроса файлов (файлов исходных данных и индексных файлов), которые копируются и сохраняются на диске, в памяти CPU и в памяти GPU для поиска topk наиболее похожих векторов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>Алгоритм планирования запросов значительно повышает производительность системы. Основная философия разработки заключается в достижении наилучшей производительности поиска за счет максимального использования аппаратных ресурсов. Ниже приведено лишь краткое описание планировщика запросов, в будущем этой теме будет посвящена отдельная статья.</p>
<p>Первый запрос к заданной таблице мы называем "холодным" запросом, а последующие - "теплыми". При первом запросе к таблице Milvus выполняет много работы по загрузке данных в память CPU и некоторых данных в память GPU, что отнимает много времени. При последующих запросах поиск происходит гораздо быстрее, так как часть или все данные уже находятся в памяти процессора, что экономит время на чтение с диска.</p>
<p>Чтобы сократить время поиска при первом запросе, Milvus предлагает конфигурацию Preload Table (<code translate="no">preload_table</code>), которая обеспечивает автоматическую предварительную загрузку таблиц в память процессора при запуске сервера. Для таблицы, содержащей 100 миллионов 512-мерных векторов, что составляет 200 ГБ, скорость поиска будет самой высокой, если памяти процессора достаточно для хранения всех этих данных. Однако если таблица содержит миллиарды векторов, то иногда неизбежно приходится освобождать память CPU/GPU для добавления новых данных, которые не запрашиваются. В настоящее время мы используем LRU (Latest Recently Used) в качестве стратегии замены данных.</p>
<p>Как показано на диаграмме ниже, предположим, что на диске хранится 6 индексных файлов. Память CPU может хранить только 3 индексных файла, а память GPU - только 1 индексный файл.</p>
<p>Когда начинается поиск, в память CPU загружаются 3 индексных файла для запроса. Первый файл будет освобожден из памяти CPU сразу после запроса. Тем временем в память процессора загружается четвертый файл. Точно так же, когда файл запрашивается в памяти GPU, он мгновенно освобождается и заменяется новым файлом.</p>
<p>Планировщик запросов в основном обрабатывает 2 набора очередей задач, одна из которых связана с загрузкой данных, а другая - с выполнением поиска.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>queryschedule</span> </span></p>
<p><strong>(6) Редуктор результатов</strong></p>
<p>Существует 2 ключевых параметра, связанных с векторным поиском: первый - 'n', означающий n количество целевых векторов; второй - 'k', означающий k наиболее похожих векторов. Результаты поиска на самом деле представляют собой n наборов KVP (пар ключ-значение), каждый из которых содержит k пар ключ-значение. Поскольку запросы должны выполняться к каждому отдельному файлу, независимо от того, является ли он файлом необработанных данных или индексным файлом, для каждого файла будет получено n наборов топ-k наборов результатов. Все эти наборы результатов объединяются, чтобы получить наборы результатов top-k для таблицы.</p>
<p>В примере ниже показано, как объединяются и сокращаются наборы результатов для векторного поиска по таблице с 4 индексными файлами (n=2, k=3). Обратите внимание, что каждый набор результатов имеет 2 столбца. Левый столбец представляет собой идентификатор вектора, а правый - евклидово расстояние.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>результат</span> </span></p>
<p><strong>(7) Будущая оптимизация</strong></p>
<p>Ниже приведены некоторые мысли о возможных оптимизациях управления данными.</p>
<ul>
<li>Что если данные в неизменяемом буфере или даже мутабельном буфере можно будет также мгновенно запрашивать? В настоящее время данные в неизменяемом буфере не могут быть запрошены, пока они не будут записаны на диск. Некоторые пользователи больше заинтересованы в мгновенном доступе к данным после их вставки.</li>
<li>Предоставьте функциональность разбиения таблиц, которая позволит пользователю разделить очень большие таблицы на более мелкие разделы и выполнять векторный поиск по заданному разделу.</li>
<li>Добавить к векторам некоторые атрибуты, которые можно фильтровать. Например, некоторые пользователи хотят искать только среди векторов с определенными атрибутами. Требуется получить атрибуты векторов и даже необработанные векторы. Один из возможных подходов - использование базы данных KV, например RocksDB.</li>
<li>Обеспечить функциональность миграции данных, позволяющую автоматически переносить устаревшие данные в другое пространство хранения. В некоторых сценариях, где данные поступают постоянно, они могут устаревать. Поскольку некоторым пользователям важны только данные за последний месяц и они выполняют поиск по ним, старые данные становятся менее полезными, занимая много места на диске. Механизм миграции данных помогает освободить дисковое пространство для новых данных.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье в основном представлена стратегия управления данными в Milvus. Другие статьи о распределенном развертывании Milvus, выборе методов векторного индексирования и планировщике запросов будут опубликованы в ближайшее время. Следите за новостями!</p>
<h2 id="Related-blogs" class="common-anchor-header">Похожие блоги<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Управление метаданными в Milvus (1): Как просматривать метаданные</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Управление метаданными Milvus (2): Поля в таблице метаданных</a></li>
</ul>
