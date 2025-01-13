---
id: in-memory-replicas.md
title: >-
  Повышение производительности чтения базы данных Vector с помощью реплик
  In-Memory
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Используйте реплики в памяти для повышения производительности чтения и
  использования аппаратных ресурсов.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_image</span> </span></p>
<blockquote>
<p>Эта статья написана в соавторстве с <a href="https://github.com/congqixia">Конгки Ся</a> и <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>Официальный релиз Milvus 2.1 включает в себя множество новых функций, обеспечивающих удобство и лучший пользовательский опыт. Хотя концепция реплик in-memory не является чем-то новым для мира распределенных баз данных, это критически важная функция, которая может помочь вам увеличить производительность системы и повысить ее доступность без особых усилий. Поэтому в этой статье мы постараемся объяснить, что такое репликация in-memory и почему она важна, а затем расскажем, как включить эту новую функцию в Milvus, векторной базе данных для искусственного интеллекта.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Концепции, связанные с репликой in-memory</a></p></li>
<li><p><a href="#What-is-in-memory-replica">Что такое реплика in-memory?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Почему реплики in-memory важны?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Включение реплик in-memory в векторной базе данных Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Концепции, связанные с репликой in-memory<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем узнать, что такое реплика in-memory и почему она важна, нам нужно понять несколько соответствующих понятий, включая группу реплик, реплику осколков, потоковую реплику, историческую реплику и лидера осколков. Изображение ниже иллюстрирует эти понятия.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Понятия_реплики</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Группа реплик</h3><p>Группа реплик состоит из нескольких <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">узлов запросов</a>, которые отвечают за работу с историческими данными и репликами.</p>
<h3 id="Shard-replica" class="common-anchor-header">Осколочная реплика</h3><p>Осколочная реплика состоит из потоковой и исторической реплик, принадлежащих одному и тому же <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">осколку</a> (т. е. каналу DML). Несколько реплик шарда образуют группу реплик. Точное количество реплик шардов в группе реплик определяется количеством шардов в заданной коллекции.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Потоковая реплика</h3><p>Потоковая реплика содержит все <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">растущие сегменты</a> из одного канала DML. Технически говоря, потоковая реплика должна обслуживаться только одним узлом запроса в одной реплике.</p>
<h3 id="Historical-replica" class="common-anchor-header">Историческая реплика</h3><p>Историческая реплика содержит все запечатанные сегменты из одного и того же канала DML. Запечатанные сегменты одной исторической реплики могут быть распределены по нескольким узлам запросов в рамках одной группы реплик.</p>
<h3 id="Shard-leader" class="common-anchor-header">Лидер осколка</h3><p>Лидер шарда - это узел запроса, обслуживающий потоковую реплику в шард-реплике.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">Что такое реплика в памяти?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Включение реплик в памяти позволяет загружать данные в коллекции на несколько узлов запросов, чтобы задействовать дополнительные ресурсы процессора и памяти. Эта функция очень полезна, если у вас относительно небольшой набор данных, но вы хотите увеличить пропускную способность чтения и повысить эффективность использования аппаратных ресурсов.</p>
<p>Пока что векторная база данных Milvus хранит в памяти одну реплику для каждого сегмента. Однако благодаря репликам в памяти вы можете иметь несколько реплик одного сегмента на разных узлах запроса. Это означает, что если один узел запроса ведет поиск в сегменте, то входящий новый запрос на поиск может быть назначен другому незанятому узлу запроса, поскольку на этом узле запроса есть репликация точно такого же сегмента.</p>
<p>Кроме того, если у нас есть несколько реплик в памяти, мы можем лучше справляться с ситуацией, когда узел запроса терпит крах. Раньше нам приходилось ждать перезагрузки сегмента, чтобы продолжить поиск на другом узле запроса. Однако при использовании репликации в памяти запрос на поиск может быть немедленно отправлен на новый узел запроса без необходимости повторной загрузки данных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>Репликация</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Почему важны репликации in-memory?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Одним из наиболее значительных преимуществ использования реплик in-memory является увеличение общего числа запросов в секунду (QPS) и пропускной способности. Кроме того, можно поддерживать несколько сегментных реплик, и система становится более устойчивой к сбоям.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Включение реплик in-memory в векторной базе данных Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Включить новую функцию реплик в памяти в векторной базе данных Milvus не составляет труда. Все, что вам нужно сделать, это просто указать количество реплик, которое вы хотите получить при загрузке коллекции (т. е. при вызове <code translate="no">collection.load()</code>).</p>
<p>В следующем примере мы предположим, что вы уже <a href="https://milvus.io/docs/v2.1.x/create_collection.md">создали коллекцию</a> с именем "book" и <a href="https://milvus.io/docs/v2.1.x/insert_data.md">вставили</a> в нее <a href="https://milvus.io/docs/v2.1.x/insert_data.md">данные</a>. Тогда вы можете выполнить следующую команду для создания двух реплик при <a href="https://milvus.io/docs/v2.1.x/load_collection.md">загрузке</a> коллекции book.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Вы можете гибко изменять количество реплик в приведенном выше коде примера, чтобы наилучшим образом соответствовать сценарию вашего приложения. После этого вы можете напрямую выполнять <a href="https://milvus.io/docs/v2.1.x/search.md">поиск</a> или <a href="https://milvus.io/docs/v2.1.x/query.md">запрос</a> векторного сходства на нескольких репликах без дополнительных команд. Однако следует отметить, что максимальное количество реплик ограничено общим объемом памяти для выполнения узлов запроса. Если указанное количество реплик превысит ограничения по объему используемой памяти, при загрузке данных будет выдана ошибка.</p>
<p>Вы также можете проверить информацию о созданных in-memory репликах, выполнив команду <code translate="no">collection.get_replicas()</code>. Будет выведена информация о группах реплик и соответствующих узлах запроса и шардах. Ниже приведен пример вывода.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Подробнее читайте в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Понимание уровня согласованности в векторной базе данных Milvus (часть II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
