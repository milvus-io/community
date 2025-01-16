---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Использование
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  Кардинальный дизайн функции удаления в Milvus 2.0, самой передовой в мире базе
  данных векторов.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Как Milvus удаляет потоковые данные в распределенном кластере</custom-h1><p>Благодаря унифицированной пакетной и потоковой обработке и облачной нативной архитектуре Milvus 2.0 представляет собой более сложную задачу, чем его предшественник при разработке функции DELETE. Благодаря усовершенствованной конструкции дезагрегации хранения и вычислений и гибкому механизму публикации/подписки мы с гордостью можем заявить, что справились с этой задачей. В Milvus 2.0 вы можете удалить сущность в данной коллекции с помощью ее первичного ключа, и тогда удаленная сущность больше не будет фигурировать в результатах поиска или запроса.</p>
<p>Обратите внимание, что операция DELETE в Milvus относится к логическому удалению, в то время как физическая очистка данных происходит во время Data Compaction. Логическое удаление не только значительно повышает производительность поиска, ограниченную скоростью ввода-вывода, но и облегчает восстановление данных. Логически удаленные данные все еще можно восстановить с помощью функции "Путешествие во времени".</p>
<h2 id="Usage" class="common-anchor-header">Использование<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте сначала опробуем функцию DELETE в Milvus 2.0. (В следующем примере используется PyMilvus 2.0.0 на Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>В экземпляре Milvus узел данных в основном отвечает за упаковку потоковых данных (журналов в лог-брокере) в исторические данные (снимки журналов) и их автоматическую промывку в объектное хранилище. Узел запросов выполняет поисковые запросы по полным данным, то есть как по потоковым, так и по историческим данным.</p>
<p>Чтобы максимально использовать возможности параллельных узлов кластера по записи данных, Milvus использует стратегию шардинга на основе хеширования первичных ключей для равномерного распределения операций записи между различными рабочими узлами. Иными словами, прокси будет направлять сообщения (т. е. запросы) сущности на языке манипулирования данными (DML) на один и тот же узел данных и узел запросов. Эти сообщения публикуются через DML-канал и потребляются узлом данных и узлом запросов по отдельности для совместного предоставления услуг поиска и запросов.</p>
<h3 id="Data-node" class="common-anchor-header">Узел данных</h3><p>Получив сообщения INSERT данных, узел данных вставляет данные в растущий сегмент, который представляет собой новый сегмент, созданный для приема потоковых данных в памяти. Если количество строк данных или продолжительность растущего сегмента достигает порогового значения, узел данных запечатывает его, чтобы предотвратить поступление данных. Затем узел данных сбрасывает запечатанный сегмент, содержащий исторические данные, в объектное хранилище. Тем временем узел данных генерирует фильтр цветения на основе первичных ключей новых данных и сбрасывает его в хранилище объектов вместе с запечатанным сегментом, сохраняя фильтр цветения как часть двоичного журнала статистики (binlog), который содержит статистическую информацию о сегменте.</p>
<blockquote>
<p>Фильтр цветения - это вероятностная структура данных, состоящая из длинного двоичного вектора и ряда функций случайного отображения. Она может быть использована для проверки того, является ли элемент членом множества, но может возвращать ложноположительные совпадения.           -- Википедия</p>
</blockquote>
<p>Когда приходят сообщения DELETE, узел данных буферизирует все фильтры bloom в соответствующем шарде и сопоставляет их с первичными ключами, указанными в сообщениях, чтобы получить все сегменты (как растущие, так и закрытые), которые могут включать сущности, подлежащие удалению. Выявив соответствующие сегменты, узел данных буферизирует их в памяти, чтобы создать бинлоги Delta для записи операций удаления, а затем сбрасывает эти бинлоги вместе с сегментами обратно в хранилище объектов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Узел данных</span> </span></p>
<p>Поскольку одному шарду назначается только один DML-канал, дополнительные узлы запросов, добавленные в кластер, не смогут подписаться на этот DML-канал. Чтобы гарантировать, что все узлы запросов смогут получать сообщения DELETE, узлы данных фильтруют сообщения DELETE из DML-канала и пересылают их в Delta-канал, чтобы уведомить все узлы запросов об операциях удаления.</p>
<h3 id="Query-node" class="common-anchor-header">Узел запроса</h3><p>При загрузке коллекции из хранилища объектов узел запроса сначала получает контрольную точку каждого шарда, в которой отмечены операции DML с момента последней операции flush. Основываясь на контрольной точке, узел запроса загружает все запечатанные сегменты вместе с их дельта-бинлогом и фильтрами bloom. После загрузки всех данных узел запроса подписывается на DML-Channel, Delta-Channel и Query-Channel.</p>
<p>Если после загрузки коллекции в память приходят сообщения INSERT с дополнительными данными, узел запроса сначала определяет растущие сегменты в соответствии с этими сообщениями и обновляет соответствующие фильтры цветения в памяти только для целей запроса. Эти фильтры цветности, предназначенные для запросов, не будут удаляться в хранилище объектов после завершения запроса.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Узел запросов</span> </span></p>
<p>Как упоминалось выше, только определенное количество узлов запросов может получать сообщения DELETE от DML-канала, а значит, только они могут выполнять запросы DELETE в растущих сегментах. Те узлы запросов, которые подписались на DML-канал, сначала фильтруют DELETE-сообщения в растущих сегментах, находят сущности, сопоставляя предоставленные первичные ключи с выделенными запросом фильтрами цветения растущих сегментов, а затем записывают операции удаления в соответствующие сегменты.</p>
<p>Узлы запросов, которые не могут подписаться на DML-канал, могут обрабатывать запросы поиска или запросов только в сегментах с уплотнениями, поскольку они могут подписаться только на Delta-канал и получать сообщения DELETE, пересылаемые узлами данных. Собрав все сообщения DELETE в закрытых сегментах из Delta-Channel, узлы запросов находят сущности, сопоставляя предоставленные первичные ключи с фильтрами bloom в закрытых сегментах, а затем записывают операции удаления в соответствующие сегменты.</p>
<p>В конечном итоге при поиске или запросе узлы запроса формируют набор битов на основе записей об удалении, чтобы исключить удаленные сущности, и осуществляют поиск среди оставшихся сущностей из всех сегментов, независимо от статуса сегмента. И последнее, но не менее важное: уровень согласованности влияет на видимость удаленных данных. При сильном уровне согласованности (как показано в предыдущем примере кода) удаленные сущности сразу же становятся невидимыми после удаления. При использовании уровня Bounded Consistency Level пройдет несколько секунд, прежде чем удаленные сущности станут невидимыми.</p>
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
    </button></h2><p>В серии блогов о новых возможностях версии 2.0 мы постараемся объяснить дизайн новых возможностей. Читайте больше в этой серии блогов!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Как Milvus удаляет потоковые данные в распределенном кластере</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Как уплотнить данные в Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Как Milvus балансирует нагрузку запросов между узлами?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Как Bitset обеспечивает универсальность поиска по векторному подобию</a></li>
</ul>
