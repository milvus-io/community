---
id: dynamic-data-update-and-query-milvus.md
title: Подготовка
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: Векторный поиск стал более интуитивным и удобным
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Как в Milvus реализовано динамическое обновление и запрос данных</custom-h1><p>В этой статье мы расскажем о том, как векторные данные записываются в память Milvus и как эти записи поддерживаются.</p>
<p>Ниже приведены наши основные цели проектирования:</p>
<ol>
<li>Эффективность импорта данных должна быть высокой.</li>
<li>Данные должны быть видны как можно быстрее после их импорта.</li>
<li>Избегать фрагментации файлов данных.</li>
</ol>
<p>Поэтому мы создали буфер памяти (буфер вставки) для вставки данных, чтобы уменьшить количество контекстных переключений случайных операций ввода-вывода на диске и в операционной системе для повышения производительности вставки данных. Архитектура хранения данных в памяти, основанная на MemTable и MemTableFile, позволяет нам более удобно управлять и сериализовать данные. Состояние буфера делится на Mutable и Immutable, что позволяет сохранять данные на диске, сохраняя доступность внешних сервисов.</p>
<h2 id="Preparation" class="common-anchor-header">Подготовка<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда пользователь готов вставить вектор в Milvus, ему сначала нужно создать коллекцию (* Milvus переименовал таблицу в коллекцию в версии 0.7.0). Коллекция - это самая основная единица для записи и поиска векторов в Milvus.</p>
<p>Каждая Коллекция имеет уникальное имя и некоторые свойства, которые могут быть установлены, и векторы вставляются или ищутся на основе имени Коллекции. При создании новой Коллекции Milvus записывает информацию об этой Коллекции в метаданные.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Вставка данных<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда пользователь отправляет запрос на вставку данных, данные сериализуются и десериализуются, чтобы попасть на сервер Milvus. Теперь данные записываются в память. Запись в память условно делится на следующие этапы:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>В MemManager найдите или создайте новую MemTable, соответствующую имени коллекции. Каждая MemTable соответствует буферу Коллекции в памяти.</li>
<li>MemTable будет содержать один или несколько MemTableFile. Всякий раз, когда мы создаем новый MemTableFile, мы одновременно записываем эту информацию в Meta. Мы разделяем MemTableFile на два состояния: Mutable и Immutable. Когда размер MemTableFile достигнет порогового значения, он станет неизменяемым. Каждый MemTable может иметь только один Mutable MemTableFile для записи в любой момент времени.</li>
<li>Данные каждого MemTableFile будут окончательно записаны в память в формате заданного типа индекса. MemTableFile - это самая базовая единица управления данными в памяти.</li>
<li>В любой момент времени использование памяти для вставленных данных не будет превышать заданного значения (insert_buffer_size). Это происходит потому, что при каждом запросе на вставку данных MemManager может легко вычислить память, занимаемую MemTableFile, содержащимся в каждом MemTable, а затем скоординировать запрос на вставку в соответствии с текущим объемом памяти.</li>
</ol>
<p>Благодаря многоуровневой архитектуре MemManager, MemTable и MemTableFile, вставка данных может лучше управляться и поддерживаться. Конечно, они могут делать и многое другое.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Запросы почти в реальном времени<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus вам нужно ждать не более одной секунды, пока вставленные данные переместятся из памяти на диск. Весь этот процесс можно вкратце описать на следующей картинке:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>Сначала вставленные данные попадают в буфер вставки в памяти. Буфер будет периодически переходить из начального состояния Mutable в состояние Immutable в процессе подготовки к сериализации. Затем эти Immutable-буферы будут периодически сериализовываться на диск фоновым потоком сериализации. После размещения данных информация о заказе будет записана в метаданные. На этом этапе в данных можно производить поиск!</p>
<p>Теперь мы подробно опишем шаги, изображенные на рисунке.</p>
<p>Мы уже знаем процесс вставки данных в изменяемый буфер. Следующий шаг - переход от мутабельного буфера к мутабельному:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>Immutable queue предоставит фоновому потоку сериализации неизменяемое состояние и MemTableFile, готовый к сериализации. Каждый MemTable управляет своей собственной неизменяемой очередью, и когда размер единственного изменяемого MemTableFile достигнет порогового значения, он попадет в неизменяемую очередь. Фоновый поток, отвечающий за ToImmutable, будет периодически вытаскивать все MemTableFiles из неизменяемой очереди, управляемой MemTable, и отправлять их в общую очередь Immutable. Следует отметить, что две операции - запись данных в память и изменение данных в памяти в состояние, которое не может быть записано, - не могут происходить одновременно, поэтому требуется общая блокировка. Однако операция ToImmutable очень проста и практически не вызывает задержек, поэтому влияние производительности на вставляемые данные минимально.</p>
<p>Следующий шаг - сериализация MemTableFile в очереди сериализации на диск. Эта операция в основном делится на три этапа:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>Сначала фоновый поток сериализации будет периодически извлекать MemTableFile из неизменяемой очереди. Затем они сериализуются в сырые файлы фиксированного размера (Raw TableFiles). Наконец, мы запишем эту информацию в метаданные. Когда мы проводим векторный поиск, мы запрашиваем соответствующий TableFile в метаданных. Отсюда можно осуществлять поиск по этим данным!</p>
<p>Кроме того, согласно заданному index_file_size, после того как поток сериализации завершит цикл сериализации, он объединит несколько TableFiles фиксированного размера в TableFile, а также запишет эту информацию в метаданные. В это время TableFile может быть проиндексирован. Построение индекса также является асинхронным. Другой фоновый поток, отвечающий за построение индекса, будет периодически читать TableFile в состоянии ToIndex метаданных, чтобы выполнить соответствующее построение индекса.</p>
<h2 id="Vector-search" class="common-anchor-header">Векторный поиск<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>На самом деле, вы увидите, что с помощью TableFile и метаданных векторный поиск становится более интуитивным и удобным. В общем случае нам нужно получить из метаданных TableFiles, соответствующие запрашиваемой Коллекции, выполнить поиск в каждом TableFile и, наконец, объединить их. В этой статье мы не будем углубляться в конкретную реализацию поиска.</p>
<p>Если вы хотите узнать больше, приглашаем вас ознакомиться с нашим исходным кодом или прочитать другие технические статьи о Milvus!</p>
