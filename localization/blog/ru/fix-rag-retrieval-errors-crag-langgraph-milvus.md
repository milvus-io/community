---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Исправление ошибок извлечения RAG с помощью CRAG, LangGraph и Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Высокое сходство, но неправильные ответы? Узнайте, как CRAG добавляет оценку и
  коррекцию в конвейеры RAG. Создайте готовую к производству систему с помощью
  LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>По мере запуска приложений LLM в производство командам все чаще требуется, чтобы их модели отвечали на вопросы, основанные на частных данных или информации в реальном времени. Стандартным подходом является <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">генерация с дополненным извлечением</a> (RAG), когда модель берет информацию из внешней базы знаний во время запроса. Он сокращает количество галлюцинаций и поддерживает актуальность ответов.</p>
<p>Однако на практике быстро возникает проблема: <strong>документ может иметь высокие показатели сходства и при этом совершенно не соответствовать вопросу.</strong> Традиционные конвейеры RAG приравнивают сходство к релевантности. В производстве это предположение нарушается. Результат, занявший первое место, может быть устаревшим, иметь лишь косвенное отношение к вопросу или не содержать точной информации, которая нужна пользователю.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) решает эту проблему, добавляя оценку и коррекцию между поиском и генерацией. Вместо того чтобы слепо доверять оценкам сходства, система проверяет, действительно ли найденный контент отвечает на вопрос, и исправляет ситуацию, если это не так.</p>
<p>В этой статье мы рассмотрим создание готовой к производству системы CRAG с использованием LangChain, LangGraph и <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Три проблемы поиска, которые традиционная RAG не решает<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>Большинство неудач RAG в производстве связано с одной из трех проблем:</p>
<p><strong>Несоответствие поиска.</strong> Документ похож по тематике, но фактически не отвечает на вопрос. Спросите, как настроить HTTPS-сертификат в Nginx, и система может выдать руководство по настройке Apache, инструкцию 2019 года или общее объяснение того, как работает TLS. Семантически близкие, но практически бесполезные.</p>
<p><strong>Несвежий контент.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">Векторный поиск</a> не имеет понятия актуальности. Задайте запрос "Python async best practices" и получите смесь шаблонов 2018 года и шаблонов 2024 года, ранжированных исключительно по расстоянию встраивания. Система не может отличить, какой из них действительно нужен пользователю.</p>
<p><strong>Загрязнение памяти.</strong> Эта проблема усугубляется со временем, и зачастую ее сложнее всего исправить. Скажем, система извлекает устаревшую ссылку на API и генерирует некорректный код. Неправильный результат сохраняется в памяти. При следующем аналогичном запросе система снова извлекает его - и это усиливает ошибку. Устаревшая и свежая информация постепенно смешиваются, и надежность системы снижается с каждым циклом.</p>
<p>Это не угловые случаи. Они проявляются регулярно, как только система RAG начинает работать с реальным трафиком. Именно это делает проверку качества поиска обязательным требованием, а не просто приятной мелочью.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">Что такое CRAG? Сначала оцените, потом создайте<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Корректирующий поиск-дополнительная генерация (CRAG)</strong> - это метод, который добавляет этап оценки и коррекции между поиском и генерацией в конвейере RAG. Он был представлен в статье <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). В отличие от традиционной RAG, которая принимает бинарное решение - использовать документ или отбросить его, - CRAG оценивает каждый полученный результат по релевантности и направляет его по одному из трех путей коррекции, прежде чем он попадет в языковую модель.</p>
<p>Традиционный RAG испытывает трудности, когда результаты поиска попадают в "серую зону": частично релевантны, немного устарели или не хватает ключевого фрагмента. Простые ворота "да/нет" либо отбрасывают полезную частичную информацию, либо пропускают шумный контент. CRAG перестраивает конвейер с <strong>получения → генерации</strong> на <strong>получение → оценку → исправление → генерацию</strong>, давая системе шанс исправить качество поиска до начала генерации.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Четырехэтапный рабочий процесс CRAG: Получение → Оценка → Коррекция → Генерация, показывающий, как документы оцениваются и направляются.</span> </span></p>
<p>Полученные результаты классифицируются по одной из трех категорий:</p>
<ul>
<li><strong>Правильные:</strong> непосредственно отвечают на запрос; пригодны для использования после легкой доработки</li>
<li><strong>Неоднозначный:</strong> частично релевантный; нуждается в дополнительной информации</li>
<li><strong>Неверно:</strong> неактуально; отбросить и вернуться к альтернативным источникам.</li>
</ul>
<table>
<thead>
<tr><th>Решение</th><th>Уверенность</th><th>Действие</th></tr>
</thead>
<tbody>
<tr><td>Правильно</td><td>&gt; 0.9</td><td>Доработать содержание документа</td></tr>
<tr><td>Неоднозначный</td><td>0.5-0.9</td><td>Доработка документа + дополнение с помощью веб-поиска</td></tr>
<tr><td>Неправильный</td><td>&lt; 0.5</td><td>Отбросьте результаты поиска; полностью вернитесь к веб-поиску</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Уточнение содержания</h3><p>CRAG также решает более тонкую проблему стандартного RAG: большинство систем передают в модель полный текст найденного документа. При этом тратятся токены и размывается сигнал - модель вынуждена продираться через нерелевантные абзацы, чтобы найти одно предложение, которое действительно имеет значение. CRAG сначала очищает полученный контент, извлекая релевантные фрагменты и удаляя все остальное.</p>
<p>В оригинальной статье для этого используются полосы знаний и эвристические правила. На практике для многих случаев использования подходит сопоставление ключевых слов, а производственные системы могут включать резюмирование на основе LLM или структурированное извлечение для повышения качества.</p>
<p>Процесс уточнения состоит из трех частей:</p>
<ul>
<li><strong>Декомпозиция документа:</strong> извлечение ключевых фрагментов из длинного документа.</li>
<li><strong>Переписывание запросов:</strong> превращение нечетких или неоднозначных запросов в более целевые</li>
<li><strong>Отбор знаний:</strong> дедублирование, ранжирование и сохранение только самого полезного контента.</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>Трехэтапный процесс уточнения документов: Декомпозиция документа (2000 → 500 лексем), переработка запроса (повышение точности поиска) и отбор знаний (фильтрация, ранжирование и отсечение).</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">Оценщик</h3><p>Оценщик - это ядро CRAG. Он не предназначен для глубоких рассуждений - это быстрый сортировщик. Учитывая запрос и набор полученных документов, он решает, достаточно ли хорош контент для использования.</p>
<p>В оригинальной статье выбрана модель T5-Large с точной настройкой, а не LLM общего назначения. Обоснование: для данной конкретной задачи скорость и точность важнее гибкости.</p>
<table>
<thead>
<tr><th>Атрибут</th><th>Тонко настроенная T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Латентность</td><td>10-20 мс</td><td>200 мс+</td></tr>
<tr><td>Точность</td><td>92% (бумажные эксперименты)</td><td>TBD</td></tr>
<tr><td>Соответствие задаче</td><td>Высокий - тонкая настройка для одной задачи, высокая точность</td><td>Средний - общего назначения, более гибкий, но менее специализированный</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Возврат к веб-поиску</h3><p>Если внутренний поиск признан неверным или неоднозначным, CRAG может запустить веб-поиск, чтобы получить более свежую или дополнительную информацию. Это позволяет подстраховаться при запросах, чувствительных ко времени, и в тех случаях, когда во внутренней базе знаний есть пробелы.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Почему Milvus хорошо подходит для внедрения CRAG в производство<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Эффективность CRAG зависит от того, что лежит в ее основе. <a href="https://zilliz.com/learn/what-is-vector-database">Векторная база данных</a> должна выполнять не только базовый поиск по сходству - она должна поддерживать многопользовательскую изоляцию, гибридный поиск и гибкость схемы, которые требуются производственной системе CRAG.</p>
<p>Оценив несколько вариантов, мы выбрали <a href="https://zilliz.com/what-is-milvus">Milvus</a> по трем причинам.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Многопользовательская изоляция</h3><p>В системах на основе агентов каждому пользователю или сессии требуется собственное пространство памяти. Наивный подход - одна коллекция на одного арендатора - быстро превращается в головную боль, особенно при масштабировании.</p>
<p>Milvus решает эту проблему с помощью <a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>. Установите <code translate="no">is_partition_key=True</code> в поле <code translate="no">agent_id</code>, и Milvus автоматически направит запросы к нужному разделу. Никакого разрастания коллекции, никакого кода ручной маршрутизации.</p>
<p>В наших бенчмарках с 10 миллионами векторов для 100 арендаторов Milvus с кластерным уплотнением показал <strong>3-5-кратное увеличение QPS</strong> по сравнению с неоптимизированной базовой версией.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Гибридный поиск</h3><p>Чистый векторный поиск не справляется с точным соответствием SKU контента и продукта, например <code translate="no">SKU-2024-X5</code>, строк версий или специфической терминологии.</p>
<p>Milvus 2.5 поддерживает <a href="https://milvus.io/docs/multi-vector-search.md">гибридный поиск</a>: плотные векторы для семантического сходства, разреженные векторы для подбора ключевых слов в стиле BM25 и скалярную фильтрацию метаданных - все в одном запросе. Результаты объединяются с помощью Reciprocal Rank Fusion (RRF), поэтому вам не нужно создавать и объединять отдельные конвейеры поиска.</p>
<p>На наборе данных объемом 1 миллион векторов задержка извлечения Milvus Sparse-BM25 составила <strong>6 мс</strong>, что незначительно повлияло на сквозную производительность CRAG.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Гибкая схема для развивающейся памяти</h3><p>По мере развития конвейеров CRAG модель данных развивается вместе с ними. Нам нужно было добавлять такие поля, как <code translate="no">confidence</code>, <code translate="no">verified</code> и <code translate="no">source</code>, в то же время итерируя логику оценки. В большинстве баз данных это означает миграционные сценарии и простои.</p>
<p>Milvus поддерживает динамические JSON-поля, поэтому метаданные можно расширять на лету, не прерывая работу сервиса.</p>
<p>Вот типичная схема:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus также упрощает масштабирование развертывания. Он предлагает <a href="https://milvus.io/docs/install-overview.md">режимы Lite, Standalone и Distributed</a>, которые совместимы с кодом - для перехода от локальной разработки к производственному кластеру требуется только изменить строку подключения.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Практическое занятие: создание системы CRAG с помощью LangGraph Middleware и Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Почему именно подход Middleware?</h3><p>Обычный способ построения CRAG с помощью LangGraph заключается в создании графа состояний с узлами и ребрами, контролирующими каждый шаг. Это работает, но с ростом сложности граф становится запутанным, а отладка превращается в головную боль.</p>
<p>В LangGraph 1.0 мы остановились на <strong>паттерне Middleware</strong>. Он перехватывает запросы до вызова модели, поэтому получение, оценка и исправление обрабатываются в одном месте. По сравнению с подходом на основе графа состояний:</p>
<ul>
<li><strong>Меньше кода:</strong> логика централизована, а не разбросана по узлам графа.</li>
<li><strong>Легче следовать:</strong> поток управления читается линейно</li>
<li><strong>Легче отлаживать:</strong> сбои указывают на одно место, а не на обход графа.</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Основной рабочий процесс</h3><p>Конвейер работает в четыре этапа:</p>
<ol>
<li><strong>Извлечение:</strong> получение 3 лучших релевантных документов из Milvus, с привязкой к текущему арендатору.</li>
<li><strong>Оценка:</strong> оценка качества документов с помощью облегченной модели</li>
<li><strong>Корректировка:</strong> уточнение, дополнение веб-поиском или полный отказ от него в зависимости от вердикта.</li>
<li><strong>Инжекция:</strong> передача окончательно сформированного контекста в модель с помощью динамического системного запроса.</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Настройка среды и подготовка данных</h3><p><strong>Переменные среды</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Создание коллекции Milvus</strong></p>
<p>Перед выполнением кода создайте коллекцию в Milvus со схемой, соответствующей логике поиска.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Примечание к версии:</strong> В этом коде используются последние возможности Middleware в LangGraph и LangChain. Эти API могут меняться по мере развития фреймворков - проверьте <a href="https://langchain-ai.github.io/langgraph/">документацию LangGraph</a>, чтобы узнать о наиболее актуальном использовании.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Ключевые модули</h3><p><strong>1. Разработка оценщика производственного класса</strong></p>
<p>Метод <code translate="no">_evaluate_relevance()</code> в приведенном выше коде намеренно упрощен для быстрого тестирования. Для производства вам нужен структурированный результат с доверительной оценкой и объяснением:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Уточнение знаний и обратная реакция</strong></p>
<p>Три механизма работают вместе, чтобы поддерживать высокое качество контекста модели:</p>
<ul>
<li><strong>Уточнение знаний</strong> извлекает наиболее релевантные для запроса предложения и удаляет шум.</li>
<li><strong>Обратный поиск</strong> срабатывает, когда локальный поиск недостаточен, привлекая внешние знания через Tavily.</li>
<li><strong>Объединение контекста</strong> объединяет внутреннюю память с внешними результатами в единый дедуплицированный блок контекста, прежде чем он попадет в модель.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Советы по запуску CRAG в производство<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда вы выходите за рамки прототипирования, наиболее важны три области.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Стоимость: Выберите правильный оценщик</h3><p>Оценщик выполняется при каждом запросе, что делает его самым большим рычагом влияния как на задержку, так и на стоимость.</p>
<ul>
<li><strong>Высококонкурентные рабочие нагрузки:</strong> Тонкая настройка легкой модели, такой как T5-Large, позволяет поддерживать задержку на уровне 10-20 мс, а затраты - предсказуемыми.</li>
<li><strong>Низкий трафик или прототипирование:</strong> Модель с хостингом, например <code translate="no">gpt-4o-mini</code>, быстрее настраивается и требует меньше операционной работы, но задержки и стоимость каждого вызова выше.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Наблюдаемость: Инструмент с первого дня</h3><p>Самые сложные производственные проблемы - это те, которые не видны до тех пор, пока качество ответов уже ухудшилось.</p>
<ul>
<li><strong>Мониторинг инфраструктуры:</strong> Milvus интегрируется с <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Начните с трех метрик: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, и <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Мониторинг приложений:</strong> Отслеживайте распределение вердиктов CRAG, частоту срабатывания веб-поиска и распределение баллов доверия. Без этих сигналов вы не сможете определить, вызвано ли падение качества плохим поиском или ошибкой эксперта.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Долгосрочное обслуживание: Предотвращение загрязнения памяти</h3><p>Чем дольше работает агент, тем больше устаревших и некачественных данных накапливается в памяти. Заранее установите защитные ограждения:</p>
<ul>
<li><strong>Предварительная фильтрация:</strong> Выводите на поверхность только воспоминания с <code translate="no">confidence &gt; 0.7</code>, чтобы низкокачественный контент блокировался до того, как он попадет к эксперту.</li>
<li><strong>Затухание времени:</strong> Постепенно уменьшайте вес старых воспоминаний. Тридцать дней - разумное начальное значение по умолчанию, настраиваемое в зависимости от случая использования.</li>
<li><strong>Очистка по расписанию:</strong> Еженедельно выполняйте задание по очистке старых, малодостоверных и непроверенных воспоминаний. Это предотвратит цикл обратной связи, когда устаревшие данные извлекаются, используются и хранятся заново.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Подведение итогов - и несколько общих вопросов<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG решает одну из самых постоянных проблем в производственных RAG: результаты поиска, которые выглядят релевантными, но таковыми не являются. Вставляя этап оценки и коррекции между поиском и генерацией, он отфильтровывает плохие результаты, заполняет пробелы с помощью внешнего поиска и дает модели более чистый контекст для работы.</p>
<p>Для того чтобы CRAG надежно работала в производстве, требуется не только хорошая логика поиска. Для этого требуется векторная база данных, которая справляется с многопользовательской изоляцией, гибридным поиском и развивающимися схемами, - вот где пригодится <a href="https://milvus.io/intro">Milvus</a>. Что касается приложений, то выбор правильного оценщика, раннее обеспечение наблюдаемости и активное управление качеством памяти - это то, что отделяет демо-версию от системы, которой можно доверять.</p>
<p>Если вы создаете RAG или агентские системы и сталкиваетесь с проблемами качества поиска, мы будем рады помочь:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">сообществу Milvus Slack</a>, чтобы задавать вопросы, делиться своей архитектурой и учиться у других разработчиков, решающих похожие проблемы.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы обсудить с командой ваш вариант использования - будь то разработка CRAG, гибридный поиск или многопользовательское масштабирование.</li>
<li>Если вы предпочитаете пропустить настройку инфраструктуры и сразу перейти к созданию, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемая Milvus) предлагает бесплатный уровень для начала работы.</li>
</ul>
<hr>
<p>Несколько вопросов, которые часто возникают, когда команды начинают внедрять CRAG:</p>
<p><strong>Чем CRAG отличается от простого добавления реранкера в RAG?</strong></p>
<p>Ранкер упорядочивает результаты по релевантности, но при этом предполагает, что найденные документы пригодны для использования. CRAG идет дальше - он оценивает, действительно ли полученный контент отвечает запросу, и предпринимает корректирующие действия, если это не так: уточняет частичные совпадения, дополняет веб-поиском или полностью отбрасывает результаты. Это цикл контроля качества, а не просто лучшая сортировка.</p>
<p><strong>Почему высокий показатель сходства иногда возвращает не тот документ?</strong></p>
<p>Сходство встраивания измеряет семантическую близость в векторном пространстве, но это не то же самое, что ответить на вопрос. Документ о настройке HTTPS на Apache семантически близок к вопросу о HTTPS на Nginx, но он не поможет. CRAG выявляет это, оценивая релевантность фактическому запросу, а не просто векторное расстояние.</p>
<p><strong>Что нужно искать в векторной базе данных для CRAG?</strong></p>
<p>Больше всего важны три вещи: гибридный поиск (чтобы вы могли сочетать семантический поиск с подбором ключевых слов для точных терминов), многопользовательская изоляция (чтобы у каждого пользователя или сессии агента было свое пространство памяти) и гибкая схема (чтобы вы могли добавлять поля вроде <code translate="no">confidence</code> или <code translate="no">verified</code> без простоя по мере развития вашего конвейера).</p>
<p><strong>Что происходит, когда ни один из найденных документов не является релевантным?</strong></p>
<p>CRAG не просто сдается. Когда доверие падает ниже 0,5, он возвращается к веб-поиску. Если результаты неоднозначны (0,5-0,9), он объединяет уточненные внутренние документы с результатами внешнего поиска. Модель всегда получает некоторый контекст для работы, даже если в базе знаний есть пробелы.</p>
