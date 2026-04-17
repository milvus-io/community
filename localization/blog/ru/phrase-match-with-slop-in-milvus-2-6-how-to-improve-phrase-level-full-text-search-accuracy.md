---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Сопоставление фраз и слоп в Milvus 2.6: как повысить точность полнотекстового
  поиска на уровне фраз
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Узнайте, как Phrase Match в Milvus 2.6 поддерживает полнотекстовый поиск на
  уровне фраз с отклонением, обеспечивая более толерантную фильтрацию ключевых
  слов в реальных условиях производства.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>Поскольку объемы неструктурированных данных продолжают расти, а модели ИИ становятся все умнее, векторный поиск стал стандартным уровнем поиска для многих систем ИИ - конвейеров, ИИ-поиска, агентов, рекомендательных систем и т. д. Это работает, потому что он улавливает смысл: не просто слова, которые вводят пользователи, а намерение, стоящее за ними.</p>
<p>Однако после запуска этих приложений в производство команды часто обнаруживают, что семантическое понимание - это только одна сторона проблемы поиска. Многие рабочие нагрузки также зависят от строгих текстовых правил, таких как соответствие точной терминологии, сохранение порядка слов или выявление фраз, имеющих техническое, юридическое или оперативное значение.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> устраняет это разделение, внедряя встроенный полнотекстовый поиск непосредственно в векторную базу данных. Благодаря встроенным в основной механизм маркерным и позиционным индексам Milvus может интерпретировать семантический смысл запроса, обеспечивая при этом точные ограничения на уровне ключевых слов и фраз. В результате получается единый поисковый конвейер, в котором смысл и структура усиливают друг друга, а не живут в отдельных системах.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">Фразовое соответствие</a> - ключевая часть этой полнотекстовой возможности. Оно определяет последовательности терминов, которые встречаются вместе и по порядку, что крайне важно для обнаружения шаблонов журналов, сигнатур ошибок, названий продуктов и любого текста, в котором порядок слов определяет смысл. В этом посте мы расскажем, как работает <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> в <a href="https://milvus.io/">Milvus</a>, как <code translate="no">slop</code> добавляет гибкость, необходимую для работы с реальным текстом, и почему эти функции делают гибридный векторно-полнотекстовый поиск не только возможным, но и практичным в рамках одной базы данных.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">Что такое Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match - это тип полнотекстового запроса в Milvus, который фокусируется на <em>структуре - в частности</em>, на том, появляется ли последовательность слов в одном и том же порядке в документе. Когда гибкость не допускается, запрос ведет себя строго: термины должны встречаться рядом друг с другом и в той же последовательности. Поэтому запрос типа <strong>"robotics machine learning"</strong> будет соответствовать запросу только в том случае, если эти три слова встречаются в виде непрерывной фразы.</p>
<p>Проблема в том, что реальный текст редко ведет себя так же аккуратно. Естественный язык вносит шум: в него вкрадываются лишние прилагательные, журналы перестраивают поля, названия продуктов обрастают модификаторами, а авторы пишут не с оглядкой на поисковые системы. Строгое совпадение фраз легко нарушается - одно вставленное слово, одна перефразировка или один подмененный термин могут привести к промаху. А во многих системах искусственного интеллекта, особенно в производственных системах, пропуск релевантной строки журнала или фразы, запускающей правило, недопустим.</p>
<p>Milvus 2.6 решает эту проблему с помощью простого механизма: <strong>slop</strong>. Slop определяет <em>степень свободы действий между</em> терминами <em>запроса</em>. Вместо того чтобы рассматривать фразу как хрупкую и негибкую, slop позволяет вам решить, допустимо ли одно лишнее слово, или два, или даже незначительное изменение порядка слов должно считаться совпадением. Таким образом, поиск по фразе превращается из двоичного теста "прошел-не прошел" в контролируемый, настраиваемый инструмент поиска.</p>
<p>Чтобы понять, почему это важно, представьте, что вы ищете в журналах все варианты знакомой сетевой ошибки <strong>"соединение было сброшено одноранговой сетью".</strong> На практике ваши журналы могут выглядеть следующим образом:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>На первый взгляд, все они представляют собой одно и то же событие. Но обычные методы поиска не справляются с этой задачей:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 борется со структурой.</h3><p>Он рассматривает запрос как пакет ключевых слов, игнорируя порядок их появления. Если где-то появляются слова "связь" и "равный", BM25 может высоко проранжировать документ, даже если фраза обратная или не имеет отношения к концепции, которую вы ищете.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">Векторный поиск борется с ограничениями.</h3><p>Вкрапления отлично справляются с передачей смысла и семантических связей, но они не могут обеспечить соблюдение правила "эти слова должны встречаться в такой-то последовательности". Вы можете получить семантически связанные сообщения, но при этом не найти точную структурную схему, необходимую для отладки или соответствия требованиям.</p>
<p>Фразовое соответствие заполняет промежуток между этими двумя подходами. Используя <strong>отклонение</strong>, вы можете точно определить, насколько допустимы отклонения:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Точное совпадение (Все термины должны встречаться рядом и по порядку).</p></li>
<li><p><code translate="no">slop = 1</code> - Разрешить одно дополнительное слово (Охватывает распространенные естественно-языковые вариации с одним вставленным термином).</p></li>
<li><p><code translate="no">slop = 2</code> - Разрешить несколько вставленных слов (Для более описательных или многословных формулировок).</p></li>
<li><p><code translate="no">slop = 3</code> - Разрешить переупорядочивание (Поддерживает перевернутые или слабо упорядоченные фразы, что часто является самым сложным случаем в реальном тексте).</p></li>
</ul>
<p>Вместо того чтобы надеяться, что алгоритм подсчета "поймет все правильно", вы прямо заявляете о структурной допустимости, которую требует ваше приложение.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Как работает подбор фраз в Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Работает на основе библиотеки поисковой системы <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, Phrase Match в Milvus реализован на основе инвертированного индекса с позиционной информацией. Вместо того чтобы проверять, встречаются ли термины в документе, он проверяет, что они появляются в правильном порядке и на контролируемом расстоянии.</p>
<p>Приведенная ниже диаграмма иллюстрирует процесс:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Токенизация документа (с позициями)</strong></p>
<p>Когда документы вставляются в Milvus, текстовые поля обрабатываются <a href="https://milvus.io/docs/analyzer-overview.md">анализатором</a>, который разбивает текст на лексемы (слова или термины) и записывает позицию каждой лексемы в документе. Например, <code translate="no">doc_1</code> разбивается на лексемы как: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Создание инвертированного индекса</strong></p>
<p>Далее Milvus создает инвертированный индекс. Вместо того чтобы сопоставлять документы с их содержимым, инвертированный индекс сопоставляет каждую лексему с документами, в которых она встречается, вместе со всеми записанными позициями этой лексемы в каждом документе.</p>
<p><strong>3. Сопоставление фраз</strong></p>
<p>При выполнении фразового запроса Milvus сначала использует инвертированный индекс для поиска документов, содержащих все лексемы запроса. Затем он проверяет каждого кандидата, сравнивая позиции лексем, чтобы убедиться, что термины появляются в правильном порядке и в пределах допустимого расстояния <code translate="no">slop</code>. В качестве совпадений возвращаются только документы, удовлетворяющие обоим условиям.</p>
<p>На приведенной ниже диаграмме кратко показано, как работает сквозной поиск фраз.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Как включить поиск фраз в Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Подбор фраз работает с полями типа <strong><code translate="no">VARCHAR</code></strong>строковый тип в Milvus. Чтобы использовать его, вы должны настроить схему коллекции таким образом, чтобы Milvus выполнял анализ текста и сохранял позиционную информацию для поля. Это делается путем включения двух параметров: <code translate="no">enable_analyzer</code> и <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Установите enable_analyzer и enable_match</h3><p>Чтобы включить функцию Phrase Match для конкретного поля VARCHAR, при определении схемы поля установите оба параметра в значение <code translate="no">True</code>. Вместе они указывают Milvus:</p>
<ul>
<li><p><strong>токенизировать</strong> текст (через <code translate="no">enable_analyzer</code>), и</p></li>
<li><p><strong>построить инвертированный индекс с позиционными смещениями</strong> (через <code translate="no">enable_match</code>).</p></li>
</ul>
<p>Фразовое соответствие опирается на оба шага: анализатор разбивает текст на лексемы, а индекс соответствия хранит места появления этих лексем, обеспечивая эффективные запросы на основе фраз и слоупоков.</p>
<p>Ниже приведен пример конфигурации схемы, включающей функцию Phrase Match для поля <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Поиск с помощью фразового соответствия: Как слоп влияет на набор кандидатов<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>После того, как вы включили соответствие для поля VARCHAR в схеме коллекции, вы можете выполнять фразовые соответствия, используя выражение <code translate="no">PHRASE_MATCH</code>.</p>
<p>Примечание: Выражение <code translate="no">PHRASE_MATCH</code> не зависит от регистра. Вы можете использовать либо <code translate="no">PHRASE_MATCH</code>, либо <code translate="no">phrase_match</code>.</p>
<p>При поиске совпадение фраз обычно применяется перед ранжированием по векторному сходству. Сначала он фильтрует документы на основе явных текстовых ограничений, сужая набор кандидатов. Оставшиеся документы затем повторно ранжируются с помощью векторных вкраплений.</p>
<p>В примере ниже показано, как различные значения <code translate="no">slop</code> влияют на этот процесс. Настраивая параметр <code translate="no">slop</code>, вы напрямую контролируете, какие документы проходят фразовый фильтр и переходят к этапу векторного ранжирования.</p>
<p>Предположим, у вас есть коллекция с именем <code translate="no">tech_articles</code>, содержащая следующие пять сущностей:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>текст</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Машинное обучение повышает эффективность анализа крупномасштабных данных</td></tr>
<tr><td>2</td><td>Освоение машинного подхода жизненно важно для развития современного ИИ</td></tr>
<tr><td>3</td><td>Архитектуры машин глубокого обучения оптимизируют вычислительную нагрузку</td></tr>
<tr><td>4</td><td>Машина быстро улучшает производительность модели для непрерывного обучения</td></tr>
<tr><td>5</td><td>Изучение передовых машинных алгоритмов расширяет возможности ИИ</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Здесь мы допускаем отклонение в 1. Фильтр применяется к документам, содержащим фразу "обучающаяся машина", с небольшой гибкостью.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Результаты поиска:</p>
<table>
<thead>
<tr><th>doc_id</th><th>текст</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Обучение машинному подходу жизненно важно для современного прогресса ИИ</td></tr>
<tr><td>3</td><td>Архитектуры машин глубокого обучения оптимизируют вычислительную нагрузку</td></tr>
<tr><td>5</td><td>Изучение передовых машинных алгоритмов расширяет возможности ИИ</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>В данном примере допускается отклонение 2, то есть между словами "машина" и "обучение" допускается до двух дополнительных лексем (или обратных терминов).</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Результаты поиска:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>текст</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Машинное обучение повышает эффективность анализа крупномасштабных данных</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Архитектуры машин глубокого обучения оптимизируют вычислительную нагрузку</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>В этом примере значение slop, равное 3, обеспечивает еще большую гибкость. Фильтр ищет "машинное обучение", при этом между словами допускается не более трех позиций лексем.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Результаты поиска:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>текст</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Машинное обучение повышает эффективность анализа крупномасштабных данных</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">Освоение машинного подхода жизненно важно для развития современного ИИ</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Архитектуры машин глубокого обучения оптимизируют вычислительную нагрузку</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">Изучение передовых машинных алгоритмов расширяет возможности ИИ</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Быстрые советы: Что нужно знать перед включением функции поиска фраз в Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Функция Phrase Match обеспечивает поддержку фильтрации на уровне фраз, но ее включение требует не только настройки во время запроса. Прежде чем применять эту функцию в производственных условиях, необходимо ознакомиться с соответствующими соображениями.</p>
<ul>
<li><p>Включение функции Phrase Match для поля создает инвертированный индекс, что увеличивает расход памяти. Точные затраты зависят от таких факторов, как длина текста, количество уникальных лексем и конфигурация анализатора. При работе с большими текстовыми полями или данными с высокой кардинальностью эти накладные расходы следует учитывать заранее.</p></li>
<li><p>Конфигурация анализатора - еще один важный выбор при проектировании. Как только анализатор определен в схеме коллекции, его нельзя изменить. Для последующего перехода на другой анализатор требуется удалить существующую коллекцию и создать ее заново с новой схемой. По этой причине к выбору анализатора следует относиться как к долгосрочному решению, а не как к эксперименту.</p></li>
<li><p>Поведение Phrase Match тесно связано со способом токенизации текста. Прежде чем применять анализатор ко всей коллекции, рекомендуется использовать метод <code translate="no">run_analyzer</code>, чтобы проверить результат токенизации и убедиться, что он соответствует вашим ожиданиям. Этот шаг поможет избежать тонких несоответствий и неожиданных результатов запроса в дальнейшем. Для получения дополнительной информации см. раздел <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Обзор анализаторов</a>.</p></li>
</ul>
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
    </button></h2><p>Phrase Match - это основной тип полнотекстового поиска, который обеспечивает ограничения на уровне фразы и позиции, выходящие за рамки простого сопоставления ключевых слов. Оперируя порядком и близостью лексем, он обеспечивает предсказуемый и точный способ фильтрации документов на основе того, как термины на самом деле встречаются в тексте.</p>
<p>В современных поисковых системах фразовое соответствие обычно применяется перед векторным ранжированием. Сначала он ограничивает набор кандидатов документами, которые явно удовлетворяют требуемым фразам или структурам. Затем векторный поиск используется для ранжирования этих результатов по семантической релевантности. Эта схема особенно эффективна в таких сценариях, как анализ журналов, поиск технической документации и конвейеры RAG, где текстовые ограничения должны быть соблюдены до того, как будет рассмотрено семантическое сходство.</p>
<p>С введением параметра <code translate="no">slop</code> в Milvus 2.6, Phrase Match стал более терпимым к вариациям естественного языка, сохранив при этом свою роль механизма полнотекстовой фильтрации. Это облегчает применение ограничений на уровне фраз в производственных поисковых процессах.</p>
<p>👉 Попробуйте это с помощью <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">демонстрационных</a> скриптов и изучите <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>, чтобы понять, как поиск с учетом фразы вписывается в ваш стек.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции последней версии Milvus? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете записаться на 20-минутную индивидуальную сессию, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
