---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: >-
  Как исправить цикл обучения агента Hermes с помощью гибридного поиска Milvus
  2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Контур обучения агента Hermes записывает навыки, полученные в результате
  использования, но его ретривер FTS5 пропускает перефразированные запросы.
  Гибридный поиск Milvus 2.6 исправляет кросс-сессионный отзыв.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>Агент Hermes</strong></a> <strong>в последнее время повсюду.</strong> Созданный компанией Nous Research, Hermes - это самодостаточный персональный ИИ-агент, который работает на вашем собственном оборудовании (подойдет и VPS за 5 долларов) и общается с вами через существующие каналы чата, например Telegram.</p>
<p><strong>Его главная изюминка - встроенный цикл обучения:</strong> цикл создает навыки на основе опыта, улучшает их в процессе использования и ищет в прошлых разговорах шаблоны для повторного использования. Другие агентские фреймворки вручную кодируют навыки перед развертыванием. Навыки Hermes растут в процессе использования, и повторяющиеся рабочие процессы становятся многоразовыми без изменения кода.</p>
<p><strong>Загвоздка в том, что поиск в Hermes осуществляется только по ключевым словам.</strong> Он подбирает точные слова, но не смысл, который ищут пользователи. Когда пользователи используют разные формулировки в разных сессиях, цикл не может их связать, и новый скилл не будет написан. Когда в системе всего несколько сотен документов, этот разрыв вполне терпим. <strong>После этого цикл перестает учиться, потому что не может найти свою собственную историю.</strong></p>
<p><strong>Исправить ситуацию поможет Milvus 2.6.</strong> Его <a href="https://milvus.io/docs/multi-vector-search.md">гибридный поиск</a> охватывает как смысл, так и точные ключевые слова в одном запросе, поэтому цикл может наконец соединить перефразированную информацию в разных сессиях. Он достаточно легкий, чтобы поместиться на небольшом облачном сервере (VPS за 5 долларов в месяц работает с ним). Его замена не требует изменения Гермеса - Milvus находится за слоем поиска, так что контур обучения остается нетронутым. Hermes по-прежнему выбирает, какой навык запустить, а Milvus обрабатывает то, что нужно извлечь.</p>
<p>Но более глубокая выгода не ограничивается улучшением запоминания: если поиск работает, Learning Loop может хранить саму стратегию поиска как навык, а не только содержимое, которое он извлекает. Таким образом, знания агента сохраняются на протяжении всех сессий.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Архитектура агента Hermes: Как четырехслойная память обеспечивает работу контура обучения навыкам<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>имеет четыре уровня памяти, и L4 Skills - это тот, который отличает его от других.</strong></p>
<ul>
<li><strong>L1</strong> - контекст сессии, очищается при ее закрытии</li>
<li><strong>L2</strong> - сохраняемые факты: стек проекта, командные соглашения, принятые решения</li>
<li><strong>L3</strong> - поиск по ключевым словам SQLite FTS5 в локальных файлах</li>
<li><strong>L4</strong> - хранение рабочих процессов в виде файлов Markdown. В отличие от инструментов LangChain или плагинов AutoGPT, которые разработчики создают в коде перед развертыванием, L4 Skills являются самописными: они вырастают из того, что агент фактически запускает, без авторства разработчика.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Почему поиск ключевых слов в FTS5 Hermes нарушает цикл обучения<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes в первую очередь нуждается в извлечении информации для запуска межсессионных рабочих процессов.</strong> Но его встроенный L3-слой использует SQLite FTS5, который соответствует только буквальным лексемам, но не смыслу.</p>
<p><strong>Когда пользователи по-разному формулируют одно и то же намерение в разных сеансах, FTS5 пропускает совпадение.</strong> Цикл обучения не срабатывает. Новый навык не пишется, и в следующий раз, когда намерение появится, пользователь снова будет прокладывать маршрут вручную.</p>
<p>Пример: в базе знаний хранятся "цикл событий asyncio, асинхронное планирование задач, неблокируемый ввод-вывод". Пользователь ищет "Python concurrency". FTS5 возвращает ноль результатов - нет буквального совпадения слов, и у FTS5 нет способа понять, что это один и тот же вопрос.</p>
<p>Если речь идет о нескольких сотнях документов, то такой разрыв вполне терпим. После этого документация использует один словарь, а пользователи спрашивают в другом, и у FTS5 нет моста между ними. <strong>Неизвлекаемого контента может и не быть в базе знаний, а обучающемуся контуру не на чем учиться.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Как Milvus 2.6 устраняет недостаток поиска с помощью гибридного поиска и многоуровневого хранения<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>В Milvus 2.6 реализованы два обновления, которые позволяют устранить недостатки Hermes.</strong> <strong>Гибридный поиск</strong> разблокирует цикл обучения, охватывая семантический поиск и поиск по ключевым словам в одном вызове. <strong>Многоуровневое хранилище</strong> сохраняет весь бэкэнд поиска достаточно маленьким, чтобы работать на VPS за $5/мес, для которого Hermes и был создан.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Что решает гибридный поиск: Поиск релевантной информации</h3><p>Milvus 2.6 поддерживает выполнение векторного поиска (семантического) и <a href="https://milvus.io/docs/full-text-search.md">полнотекстового поиска BM25</a> (по ключевым словам) в одном запросе, а затем объединяет два ранжированных списка с помощью <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF)</a>.</p>
<p>Например: задайте вопрос &quot;в чем принцип работы asyncio&quot;, и векторный поиск найдет семантически связанный контент. Спросите &quot;где определена функция <code translate="no">find_similar_task</code> &quot;, и BM25 точно подберет имя функции в коде. Для вопросов, связанных с функцией внутри определенного типа задач, гибридный поиск возвращает нужный результат за один вызов, без написания логики маршрутизации вручную.</p>
<p>Для Hermes это то, что разблокирует петлю обучения. Когда вторая сессия переформулирует намерение, векторный поиск улавливает семантическое соответствие, пропущенное FTS5. Цикл срабатывает, и пишется новый навык.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Что решает многоуровневое хранение данных: Стоимость</h3><p>Наивная векторная база данных хотела бы иметь полный индекс встраивания в оперативной памяти, что толкает персональные развертывания к большим и более дорогим инфраструктурам. Milvus 2.6 избегает этого благодаря трехуровневому хранению, перемещая записи между уровнями в зависимости от частоты доступа:</p>
<ul>
<li><strong>горячий</strong> - в памяти</li>
<li><strong>Теплый</strong> - на SSD</li>
<li><strong>Холодный</strong> - в объектное хранилище.</li>
</ul>
<p>Только горячие данные остаются в памяти. База знаний на 500 документов умещается в 2 ГБ оперативной памяти. Весь стек поиска работает на том же VPS Hermes за 5 долларов в месяц, не требуя обновления инфраструктуры.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: архитектура системы<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes выбирает, какой скилл запустить. Milvus решает, что извлекать.</strong> Эти две системы остаются отдельными, и интерфейс Hermes не меняется.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Поток:</strong></p>
<ol>
<li>Hermes определяет намерение пользователя и направляет его к навыку.</li>
<li>Навык вызывает скрипт поиска через терминальный инструмент.</li>
<li>Сценарий обращается к Milvus, запускает гибридный поиск и возвращает ранжированные фрагменты с исходными метаданными.</li>
<li>Hermes составляет ответ. Память записывает рабочий процесс.</li>
<li>Если один и тот же шаблон повторяется в разных сессиях, цикл обучения записывает новый навык.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Как установить Hermes и Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Установите Hermes и</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, затем создайте коллекцию с полями dense и BM25.</strong> Это полная настройка перед запуском Learning Loop.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Установите Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Запустите <code translate="no">hermes</code>, чтобы войти в интерактивный мастер инициализации:</p>
<ul>
<li><strong>Провайдер LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter имеет бесплатные модели).</li>
<li><strong>Канал</strong> - в этом руководстве используется бот FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Запуск Milvus 2.6 в автономном режиме</h3><p>Для персонального агента достаточно одного узла в автономном режиме:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Создайте коллекцию</h3><p>Дизайн схемы ограничивает возможности поиска. Эта схема работает с плотными векторами и разреженными векторами BM25 бок о бок:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Сценарий гибридного поиска</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>Плотный запрос расширяет пул кандидатов на 2×, так что у RRF есть из чего ранжировать.</strong> <code translate="no">text-embedding-3-small</code> - самая дешевая вставка OpenAI, которая все еще сохраняет качество поиска; если бюджет позволяет, замените ее на <code translate="no">text-embedding-3-large</code>.</p>
<p>Когда среда и база знаний готовы, в следующем разделе мы тестируем цикл обучения.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">Автоматическая генерация навыков Hermes на практике<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Две сессии демонстрируют работу Learning Loop в действии.</strong> В первой пользователь называет скрипт вручную. Во втором сеансе новый пользователь задает тот же вопрос, не называя сценарий. Гермес подхватывает шаблон и пишет три навыка.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Сессия 1: вызов скрипта вручную</h3><p>Откройте Hermes в Lark. Укажите ему путь к скрипту и цель поиска. Hermes вызовет терминальный инструмент, запустит скрипт и вернет ответ с указанием источника. <strong>Никакого навыка пока не существует. Это обычный вызов инструмента.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Сеанс 2: Спрашивать, не называя сценарий</h3><p>Очистите разговор. Начните с чистого листа. Задайте вопрос той же категории, не упоминая сценарий или путь.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">Память пишет первой, навык следует за ней</h3><p><strong>Цикл обучения записывает рабочий процесс (сценарий, аргументы, форма возврата) и возвращает ответ.</strong> Память хранит след; навык еще не существует.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Совпадение второй сессии говорит циклу, что паттерн стоит сохранить.</strong> Когда он срабатывает, записываются три навыка:</p>
<table>
<thead>
<tr><th>Навык</th><th>Роль</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Выполнить гибридный семантический поиск + поиск по ключевым словам в памяти и составить ответ</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Убедиться, что документы попали в базу знаний</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Выполнять команды оболочки: скрипты, настройка окружения, проверка.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>С этого момента <strong>пользователи перестают называть навыки.</strong> Hermes определяет намерение, направляется к навыку, извлекает соответствующие фрагменты из памяти и пишет ответ. В подсказке нет переключателя навыков.</p>
<p>Большинство систем RAG (retrieval-augmented generation) решают проблему хранения и выборки, но сама логика выборки жестко закодирована в коде приложения. Задайте вопрос другим способом или по новому сценарию, и поиск прервется. Hermes хранит стратегию выборки как скилл, то есть <strong>путь выборки становится документом, который можно читать, редактировать и изменять.</strong> Строка <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> - это не маркер завершения установки. Это <strong>агент, фиксирующий модель поведения в долговременной памяти.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes против OpenClaw: Накопление против оркестровки<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes и OpenClaw решают разные задачи.</strong> Hermes создан для одного агента, который накапливает память и навыки в течение нескольких сессий. OpenClaw создан для разбиения сложной задачи на части и передачи каждой части специализированному агенту.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Сильной стороной OpenClaw является оркестровка. Он оптимизирует, какая часть задачи выполняется автоматически. Сильной стороной Hermes является накопление: единый агент, который запоминает все сессии, с навыками, которые растут в процессе использования. Hermes оптимизирует долгосрочный контекст и опыт работы в домене.</p>
<p><strong>Оба фреймворка объединяются.</strong> Hermes поставляет одношаговый путь миграции, который переносит память <code translate="no">~/.openclaw</code> и навыки в слои памяти Hermes. Сверху может располагаться стек оркестровки, а под ним - агент накопления.</p>
<p>Что такое OpenClaw, читайте в разделе " <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Что такое OpenClaw? Полное руководство по агенту ИИ с открытым исходным кодом</a> в блоге Milvus.</p>
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
    </button></h2><p>Петля обучения Hermes превращает повторяющиеся рабочие процессы в многократно используемые навыки, но только если поиск может связать их между сессиями. Поиск по ключевым словам в FTS5 этого не делает. <a href="https://milvus.io/docs/multi-vector-search.md"><strong>Гибридный поиск Milvus 2.6</strong></a> может: плотные векторы справляются со смыслом, BM25 - с точными ключевыми словами, RRF объединяет оба варианта, а <a href="https://milvus.io/docs/tiered-storage-overview.md">многоуровневое хранилище</a> позволяет хранить весь стек на VPS за 5 долларов в месяц.</p>
<p>Главное: когда поиск работает, агент не просто хранит лучшие ответы: он хранит лучшие стратегии поиска как навыки. Путь выборки становится версифицируемым документом, который улучшается по мере использования. Это то, что отличает агента, накапливающего опыт в домене, от агента, начинающего каждый сеанс заново. Сравнение того, как другие агенты справляются (или не справляются) с этой проблемой, можно найти в статье <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">"Система памяти Клода Кода: объяснение".</a></p>
<h2 id="Get-Started" class="common-anchor-header">Начало работы<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Попробуйте инструменты из этой статьи:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent на GitHub</a> - сценарий установки, настройка провайдера и конфигурация канала, использованные выше.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - одноузловое развертывание Docker для бэкенда базы знаний.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus Hybrid Search Tutorial</a> - полная плотность + пример BM25 + RRF, соответствующий скрипту в этом посте.</li>
</ul>
<p><strong>Есть вопросы о гибридном поиске Hermes + Milvus?</strong></p>
<ul>
<li>Присоединяйтесь к <a href="https://discord.gg/milvus">Milvus Discord</a>, чтобы задать вопросы о гибридном поиске, многоуровневом хранилище или шаблонах маршрутизации навыков - другие разработчики создают похожие стеки.</li>
<li><a href="https://milvus.io/community#office-hours">Закажите сеанс Milvus Office Hours</a>, чтобы обсудить с командой Milvus настройку вашего агента + базы знаний.</li>
</ul>
<p><strong>Хотите обойтись без самостоятельного хостинга?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Зарегистрируйтесь</a> или <a href="https://cloud.zilliz.com/login">войдите в</a> Zilliz Cloud - управляемый Milvus с гибридным поиском и многоуровневым хранилищем из коробки. Новые учетные записи рабочей почты получают <strong> 100 долларов в виде бесплатных кредитов</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Дополнительное чтение<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Примечания к выпуску Milvus 2.6</a> - многоуровневое хранилище, гибридный поиск, изменения схемы</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> - операционный инструментарий для агентов Milvus-native</li>
<li><a href="https://zilliz.com/blog">Почему управление знаниями в стиле RAG ломается для агентов</a> - доводы в пользу специфического для агентов дизайна памяти</li>
<li><a href="https://zilliz.com/blog">Система памяти Claude Code более примитивна, чем вы ожидаете</a> - сравнительный анализ стека памяти другого агента</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Часто задаваемые вопросы<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Как на самом деле работает цикл обучения навыкам агента Hermes?</h3><p>Hermes записывает каждый выполняемый им рабочий процесс - вызванный скрипт, переданные аргументы и возвращаемую форму - в виде трассировки памяти. Когда в двух или более сессиях появляется один и тот же паттерн, цикл обучения срабатывает и записывает многоразовый навык: файл в формате Markdown, который фиксирует рабочий процесс в виде повторяющейся процедуры. С этого момента Hermes обращается к навыку только по намерению, без указания пользователем его имени. Критической зависимостью является поиск - цикл срабатывает только в том случае, если он может найти трассировку предыдущей сессии, поэтому поиск только по ключевым словам становится узким местом в масштабе.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">В чем разница между гибридным и только векторным поиском в памяти агента?</h3><p>Векторный поиск хорошо справляется со смыслом, но пропускает точные совпадения. Если разработчик вставляет строку ошибки типа ConnectionResetError или имя функции типа find_similar_task, чистый векторный поиск может вернуть семантически связанные, но неверные результаты. Гибридный поиск сочетает плотные векторы (семантические) с BM25 (по ключевым словам) и объединяет два набора результатов с помощью Reciprocal Rank Fusion. Для агентской памяти, где запросы варьируются от неясных намерений ("Python concurrency") до точных символов, гибридный поиск охватывает оба конца в одном вызове без логики маршрутизации на уровне приложения.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Могу ли я использовать гибридный поиск Milvus с агентами ИИ, отличными от Hermes?</h3><p>Да. Схема интеграции универсальна: агент вызывает скрипт поиска, скрипт запрашивает Milvus, и результаты возвращаются в виде ранжированных фрагментов с исходными метаданными. Любой агентский фреймворк, поддерживающий вызовы инструментов или выполнение оболочки, может использовать тот же подход. Hermes подходит для этого, потому что его Learning Loop зависит от межсессионного поиска, но сторона Milvus не зависит от агента - она не знает и не заботится о том, какой агент ее вызывает.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Сколько стоит самостоятельная установка Milvus + Hermes в месяц?</h3><p>Одноузловой Milvus 2.6 Standalone на 2-ядерном / 4 ГБ VPS с многоуровневым хранилищем стоит около <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5</mi><mn>в месяц</mn><mi mathvariant="normal">.</mi><mi>OpenAI</mi><mi>text-embedding-3-smallcosts5/month</mi></mrow><annotation encoding="application/x-tex">.</annotation><annotation encoding="application/x-tex">OpenAI text-embedding-3-small стоит</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5/месяц</span><span class="mord">.</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">smallcosts0</span></span></span></span>.02 за 1M tokens - несколько центов в месяц для персональной базы знаний. Выводы LLM доминируют в общей стоимости и масштабируются с использованием, а не со стеком поиска.</p>
