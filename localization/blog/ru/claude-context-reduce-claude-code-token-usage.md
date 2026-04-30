---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Контекст Клода: Сокращение использования токенов кода Claude с помощью поиска
  кода на базе Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Клод Контест сжигает токены на grep? Посмотрите, как Claude Context использует
  гибридный поиск с поддержкой Milvus, чтобы сократить использование токенов на
  39,4 %.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Большие контекстные окна позволяют агентам по кодированию ИИ чувствовать себя безгранично, вплоть до того момента, когда они начинают читать половину вашего репозитория, чтобы ответить на один вопрос. Для многих пользователей Claude Code дорогостоящей частью является не только обоснование модели. Это цикл поиска: поиск по ключевому слову, чтение файла, повторный поиск, чтение еще большего количества файлов и постоянная плата за нерелевантный контекст.</p>
<p>Claude Context - это MCP-сервер для поиска кода с открытым исходным кодом, который дает Claude Code и другим агентам искусственного интеллекта для кодирования лучший способ найти релевантный код. Он индексирует ваш репозиторий, хранит фрагменты кода с возможностью поиска в <a href="https://zilliz.com/learn/what-is-vector-database">векторной базе данных</a> и использует <a href="https://zilliz.com/blog/hybrid-search-with-milvus">гибридный поиск</a>, чтобы агент мог получить код, который ему действительно нужен, вместо того чтобы заваливать подсказку результатами grep.</p>
<p>В наших бенчмарках Claude Context сократил потребление токенов в среднем на 39,4 % и уменьшил количество вызовов инструментов на 36,1 % при сохранении качества поиска. В этой заметке объясняется, почему при поиске в стиле grep тратится контекст, как Claude Context работает под капотом и как он сравнивается с базовым рабочим процессом в реальных задачах отладки.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Репозиторий Claude Context на GitHub набирает обороты и преодолевает отметку в 10 000 звезд</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Почему поиск кода в стиле grep сжигает токены в кодовых агентах ИИ<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>ИИ-агент может написать полезный код, только если он понимает кодовую базу вокруг задачи: пути вызова функций, соглашения об именовании, связанные тесты, модели данных и исторические паттерны реализации. Большое контекстное окно помогает, но не решает проблему поиска. Если в контекст попадают не те файлы, модель все равно тратит лексемы и может рассуждать на основе нерелевантного кода.</p>
<p>Поиск кода обычно разбивается на две большие схемы:</p>
<table>
<thead>
<tr><th>Модель извлечения</th><th>Как это работает</th><th>Где он ломается</th></tr>
</thead>
<tbody>
<tr><td>Поиск в стиле Grep</td><td>Поиск литеральных строк, затем чтение соответствующих файлов или диапазонов строк.</td><td>Пропускает семантически связанный код, возвращает шумные совпадения и часто требует повторных циклов поиска/чтения.</td></tr>
<tr><td>Поиск в стиле RAG</td><td>Заранее индексируйте код, а затем извлекайте соответствующие фрагменты с помощью семантического, лексического или гибридного поиска.</td><td>Требует использования чанков, вкраплений, индексации и логики обновления, которой большинство инструментов кодирования не хотят владеть напрямую.</td></tr>
</tbody>
</table>
<p>Это то же самое различие, которое разработчики видят в дизайне <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">приложений RAG</a>: буквальное соответствие полезно, но его редко бывает достаточно, когда важен смысл. Функция с именем <code translate="no">compute_final_cost()</code> может быть релевантна запросу о <code translate="no">calculate_total_price()</code>, даже если точные слова не совпадают. Именно в таких случаях помогает <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">семантический поиск</a>.</p>
<p>Во время одной отладочной операции Клод Код неоднократно перебирал и считывал файлы, прежде чем найти нужную область. Через несколько минут лишь небольшая часть просмотренного кода оказалась релевантной.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>Поиск Claude Code в стиле grep тратит время на чтение нерелевантных файлов</span> </span></p>
<p>Этот паттерн встречается достаточно часто, чтобы разработчики жаловались на него публично: агент может быть умным, но цикл поиска контекста все равно кажется дорогим и неточным.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Комментарий разработчиков об использовании контекста и токенов Claude Code</span> </span></p>
<p>Поиск в стиле Grep терпит неудачу по трем предсказуемым причинам:</p>
<ul>
<li><strong>Информационная перегрузка:</strong> большие хранилища дают много буквальных совпадений, и большинство из них не полезны для текущей задачи.</li>
<li><strong>Семантическая слепота:</strong> grep ищет строки, а не намерения, поведение или эквивалентные шаблоны реализации.</li>
<li><strong>Потеря контекста:</strong> совпадения на уровне строк не включают автоматически окружающий класс, зависимости, тесты или граф вызовов.</li>
</ul>
<p>Лучший уровень поиска кода должен сочетать точность ключевых слов с семантическим пониманием, а затем возвращать достаточно полные фрагменты, чтобы модель могла рассуждать о коде.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">Что такое Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context - это сервер с открытым исходным кодом <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a> для поиска кода. Он подключает инструменты кодирования ИИ к индексу кода, поддерживаемому Milvus, чтобы агент мог искать в хранилище по смыслу, а не полагаться только на поиск по буквальному тексту.</p>
<p>Цель проста: когда агент запрашивает контекст, вернуть наименьший полезный набор фрагментов кода. Claude Context делает это, разбирая кодовую базу, генерируя вкрапления, сохраняя фрагменты в <a href="https://zilliz.com/what-is-milvus">векторной базе данных Milvus</a> и предоставляя возможность поиска с помощью MCP-совместимых инструментов.</p>
<table>
<thead>
<tr><th>Проблема Grep</th><th>Подход Claude Context</th></tr>
</thead>
<tbody>
<tr><td>Слишком много нерелевантных совпадений</td><td>Ранжирование фрагментов кода по сходству векторов и релевантности ключевых слов.</td></tr>
<tr><td>Нет семантического понимания</td><td>Используйте <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">модель встраивания</a>, чтобы связанные реализации совпадали даже при различии имен.</td></tr>
<tr><td>Отсутствие окружающего контекста</td><td>Возвращайте полные фрагменты кода с достаточной структурой, чтобы модель могла рассуждать о поведении.</td></tr>
<tr><td>Повторные чтения файлов</td><td>Сначала выполните поиск по индексу, а затем читайте или редактируйте только те файлы, которые имеют значение.</td></tr>
</tbody>
</table>
<p>Поскольку Claude Context раскрывается через MCP, он может работать с Claude Code, Gemini CLI, MCP-хостами в стиле Cursor и другими MCP-совместимыми окружениями. Один и тот же основной слой извлечения может поддерживать несколько интерфейсов агентов.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Как работает Claude Context под капотом<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context имеет два основных слоя: многократно используемый основной модуль и интеграционные модули. Ядро обрабатывает синтаксический анализ, разбиение на части, индексирование, поиск и инкрементную синхронизацию. Верхний слой раскрывает эти возможности через интеграции с MCP и редакторами.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Архитектура Claude Context, показывающая интеграции MCP, основной модуль, провайдер встраивания и базу данных векторов</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">Как MCP связывает Claude Context с агентами кодирования?</h3><p>MCP обеспечивает интерфейс между хостом LLM и внешними инструментами. Выставляя Claude Context в качестве сервера MCP, уровень поиска остается независимым от какой-либо IDE или ассистента кодирования. Агент вызывает инструмент поиска; Claude Context обрабатывает индекс кода и возвращает соответствующие фрагменты.</p>
<p>Если вы хотите понять более широкую схему, в <a href="https://milvus.io/docs/milvus_and_mcp.md">руководстве MCP + Milvus</a> показано, как с помощью MCP можно подключить инструменты искусственного интеллекта к векторным операциям с базами данных.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Почему стоит использовать Milvus для поиска кода?</h3><p>Поиск кода требует быстрого векторного поиска, фильтрации метаданных и достаточного масштаба для работы с большими хранилищами. Milvus предназначен для высокопроизводительного векторного поиска и может поддерживать плотные векторы, разреженные векторы и рабочие процессы реранжирования. Для команд, создающих агентские системы с большим объемом поиска, документация по <a href="https://milvus.io/docs/multi-vector-search.md">многовекторному гибридному поиску</a> и <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a> демонстрируют тот же базовый шаблон поиска, который используется в производственных системах.</p>
<p>Claude Context может использовать Zilliz Cloud в качестве управляемого бэкенда Milvus, что позволяет избежать самостоятельного запуска и масштабирования векторной базы данных. Та же архитектура может быть адаптирована для самостоятельного развертывания Milvus.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Какие провайдеры встраивания поддерживает Claude Context?</h3><p>Claude Context поддерживает несколько вариантов встраивания:</p>
<table>
<thead>
<tr><th>Провайдер</th><th>Лучший вариант</th></tr>
</thead>
<tbody>
<tr><td>Встраивания OpenAI</td><td>Хостируемые встраиваемые модули общего назначения с широкой поддержкой экосистемы.</td></tr>
<tr><td>Встраивания Voyage AI</td><td>Ориентированный на код поиск, особенно когда важно качество поиска.</td></tr>
<tr><td>Ollama</td><td>Локальные рабочие процессы встраивания для сред, чувствительных к конфиденциальности.</td></tr>
</tbody>
</table>
<p>О связанных с Milvus рабочих процессах см. <a href="https://milvus.io/docs/embeddings.md">обзор встраивания Milvus</a>, <a href="https://milvus.io/docs/embed-with-openai.md">интеграцию встраивания OpenAI</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">интеграцию встраивания Voyage</a> и примеры работы <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama с Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Почему основная библиотека написана на TypeScript?</h3><p>Claude Context написана на TypeScript, потому что многие интеграции с кодинговыми агентами, плагины для редакторов и MCP-хосты уже используют TypeScript. Сохраняя ядро извлечения на TypeScript, проще интегрировать его с инструментами прикладного уровня, сохраняя при этом чистый API.</p>
<p>Основной модуль абстрагирует базу данных векторов и провайдера встраивания в составной объект <code translate="no">Context</code>:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Как Claude Context разбивает код на куски и сохраняет индексы свежими<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Куски и инкрементные обновления определяют, будет ли система поиска кода пригодна для использования на практике. Если куски слишком малы, модель теряет контекст. Если куски слишком большие, система поиска возвращает шум. Если индексация слишком медленная, разработчики перестают ее использовать.</p>
<p>Claude Context справляется с этой проблемой с помощью кусковой обработки кода на основе AST, аварийного разделителя текста и обнаружения изменений на основе дерева Меркла.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">Каким образом AST-ориентированное измельчение кода сохраняет контекст?</h3><p>Основной стратегией является AST-кусок. Вместо того чтобы разбивать файлы по количеству строк или символов, Claude Context анализирует структуру кода и разбивает его на части по семантическим единицам, таким как функции, классы и методы.</p>
<p>Это дает каждому куску три полезных свойства:</p>
<table>
<thead>
<tr><th>Свойство</th><th>Почему это важно</th></tr>
</thead>
<tbody>
<tr><td>Синтаксическая полнота</td><td>Функции и классы не разделены посередине.</td></tr>
<tr><td>Логическая связность</td><td>Связанная логика остается вместе, поэтому извлеченные фрагменты легче использовать в модели.</td></tr>
<tr><td>Поддержка нескольких языков</td><td>Различные древовидные ситтеры могут работать с JavaScript, Python, Java, Go и другими языками.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>Разбор кода на основе AST с сохранением полных синтаксических единиц и результатов разбора.</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">Что происходит, когда парсинг AST не работает?</h3><p>Для языков или файлов, с которыми не справляется AST-парсинг, Claude Context обращается к LangChain'у <code translate="no">RecursiveCharacterTextSplitter</code>. Он менее точен, чем AST-рубилово, но предотвращает сбой индексации при неподдерживаемом вводе.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Как Claude Context избегает переиндексации всего хранилища?</h3><p>Переиндексировать весь репозиторий после каждого изменения слишком дорого. Claude Context использует дерево Меркла, чтобы определить, что именно изменилось.</p>
<p>Дерево Меркла присваивает каждому файлу свой хэш, выводит хэш каждого каталога из его дочерних файлов и сворачивает весь репозиторий в корневой хэш. Если корневой хэш не изменился, Claude Context может пропустить индексацию. Если корень изменился, он проходит по дереву в поисках измененных файлов и повторно индексирует только их.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Обнаружение изменений в дереве Меркла при сравнении неизмененных и измененных хэшей файлов</span> </span></p>
<p>Синхронизация выполняется в три этапа:</p>
<table>
<thead>
<tr><th>Этап</th><th>Что происходит</th><th>Почему это эффективно</th></tr>
</thead>
<tbody>
<tr><td>Быстрая проверка</td><td>Сравните текущий корень Меркла с последним снимком.</td><td>Если ничего не изменилось, проверка быстро завершается.</td></tr>
<tr><td>Точная проверка</td><td>Пройдитесь по дереву, чтобы определить добавленные, удаленные и измененные файлы.</td><td>Только измененные пути продвигаются вперед.</td></tr>
<tr><td>Инкрементное обновление</td><td>Пересчитайте вкрапления для измененных файлов и обновите Milvus.</td><td>Векторный индекс остается свежим без полной пересборки.</td></tr>
</tbody>
</table>
<p>Состояние локальной синхронизации хранится по адресу <code translate="no">~/.context/merkle/</code>, поэтому Claude Context может восстановить хэш-таблицу файлов и сериализованное дерево Меркла после перезапуска.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Что происходит, когда Claude Code использует Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Настройка - это единственная команда перед запуском Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>После индексации репозитория Claude Code может вызвать Claude Context, когда ему понадобится контекст кодовой базы. В одном и том же сценарии поиска ошибок, который ранее сжигал время на grep и чтение файлов, Claude Context нашел точный файл и номер строки с полным объяснением.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Демонстрация Claude Context, показывающая, как Claude Code находит соответствующее местоположение ошибки</span> </span></p>
<p>Инструмент не ограничивается поиском ошибок. Он также помогает в рефакторинге, обнаружении дубликатов кода, решении проблем, генерации тестов и любых других задачах, где агенту нужен точный контекст репозитория.</p>
<p>При эквивалентном отзыве Claude Context сократил потребление токенов на 39,4 %, а количество вызовов инструментов - на 36,1 % в нашем бенчмарке. Это важно, поскольку вызовы инструментов и чтение нерелевантных файлов часто доминируют в стоимости рабочих процессов агентов-кодировщиков.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Диаграмма бенчмарка, показывающая снижение использования токенов и вызовов инструментов в Claude Context по сравнению с базовым уровнем</span> </span></p>
<p>Сейчас у проекта более 10 000 звезд на GitHub, а репозиторий содержит полную информацию о бенчмарке и ссылки на пакеты.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>История звезд Claude Context на GitHub, демонстрирующая быстрый рост</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Как Claude Context сравнивается с grep на реальных ошибках?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>В бенчмарке сравнивается чисто текстовый поиск с извлечением кода на основе Milvus на реальных задачах отладки. Разница заключается не только в меньшем количестве лексем. Claude Context меняет путь поиска агента: он начинает работать ближе к той реализации, которую нужно изменить.</p>
<table>
<thead>
<tr><th>Кейс</th><th>Базовое поведение</th><th>Поведение Claude Context</th><th>Сокращение количества токенов</th></tr>
</thead>
<tbody>
<tr><td>Ошибка Django <code translate="no">YearLookup</code> </td><td>Поиск неправильного связанного символа и редактирование логики регистрации.</td><td>Нашел логику оптимизации <code translate="no">YearLookup</code> напрямую.</td><td>На 93 % меньше токенов</td></tr>
<tr><td>Ошибка Xarray <code translate="no">swap_dims()</code> </td><td>Прочитал разрозненные файлы вокруг упоминаний <code translate="no">swap_dims</code>.</td><td>Найдена реализация и связанные с ней тесты.</td><td>На 62 % меньше токенов</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Случай 1: ошибка Django YearLookup</h3><p><strong>Описание проблемы:</strong> Во фреймворке Django оптимизация запроса <code translate="no">YearLookup</code> нарушает фильтрацию <code translate="no">__iso_year</code>. При использовании фильтра <code translate="no">__iso_year</code> класс <code translate="no">YearLookup</code> неверно применяет стандартную оптимизацию BETWEEN, которая действительна для календарных лет, но не для лет с нумерацией недель ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Базовая линия (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>Текстовый поиск фокусировался на регистрации <code translate="no">ExtractIsoYear</code>, а не на логике оптимизации в <code translate="no">YearLookup</code>.</p>
<p><strong>Клод Контекст:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>Семантический поиск понял <code translate="no">YearLookup</code> как основное понятие и сразу перешел к нужному классу.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Контрольная таблица Django YearLookup, показывающая уменьшение количества лексем на 93 % при использовании контекста Claude Context</span> </span></p>
<p><strong>Результат:</strong> на 93 % меньше лексем.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Случай 2: ошибка Xarray swap_dims</h3><p><strong>Описание проблемы:</strong> Метод <code translate="no">.swap_dims()</code> библиотеки Xarray неожиданно мутирует исходный объект, нарушая ожидание неизменяемости.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Базовый уровень (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>Базовая линия потратила время на навигацию по каталогам и чтение соседнего кода, прежде чем обнаружила реальный путь реализации.</p>
<p><strong>Контекст Клода:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>Семантический поиск быстрее находит соответствующую реализацию <code translate="no">swap_dims()</code> и связанный с ней контекст.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Контрольная таблица Xarray swap_dims, показывающая на 62 % меньше лексем при использовании Claude Context</span> </span></p>
<p><strong>Результат:</strong> на 62 % меньше лексем.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Начало работы с Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы хотите попробовать инструмент из этого поста, начните с <a href="https://github.com/zilliztech/claude-context">репозитория Claude Context на GitHub</a> и <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">пакета Claude Context MCP</a>. Репозиторий содержит инструкции по настройке, контрольные примеры и основные пакеты TypeScript.</p>
<p>Если вы хотите понять или настроить слой извлечения, эти ресурсы будут полезными следующими шагами:</p>
<ul>
<li>Изучите основы векторной базы данных с помощью <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Изучите <a href="https://milvus.io/docs/full-text-search.md">полнотекстовый поиск Milvus</a> и <a href="https://milvus.io/docs/full_text_search_with_milvus.md">учебник по полнотекстовому поиску LangChain</a>, если вы хотите совместить поиск в стиле BM25 с плотными векторами.</li>
<li>Изучите <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">системы векторного поиска с открытым исходным кодом</a>, если вы сравниваете варианты инфраструктуры.</li>
<li>Попробуйте <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin для Claude Code</a>, если вам нужны операции с векторными базами данных непосредственно в рабочем процессе Claude Code.</li>
</ul>
<p>Если вам нужна помощь в работе с Milvus или архитектурой поиска кода, присоединяйтесь к <a href="https://milvus.io/community/">сообществу Milvus</a> или записывайтесь в <a href="https://milvus.io/office-hours">Milvus Office Hours</a>, чтобы получить индивидуальную консультацию. Если вы не хотите заниматься настройкой инфраструктуры, <a href="https://cloud.zilliz.com/signup">подпишитесь на Zilliz Cloud</a> или <a href="https://cloud.zilliz.com/login">войдите в Zilliz Cloud</a> и используйте управляемый Milvus в качестве бэкенда.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Почему Claude Code использует так много токенов при выполнении некоторых задач по кодированию?</h3><p>Claude Code может использовать много токенов, когда задача требует повторяющихся циклов поиска и чтения файлов в большом хранилище. Если агент ищет по ключевому слову, читает нерелевантные файлы, а затем снова ищет, каждый прочитанный файл добавляет токены, даже если код не является полезным для задачи.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Как Claude Context сокращает использование токенов Claude Code?</h3><p>Claude Context сокращает использование маркеров за счет поиска по индексу кода, поддерживаемому Milvus, до того, как агент прочитает файлы. Он извлекает соответствующие фрагменты кода с помощью гибридного поиска, поэтому Claude Code может проверять меньше файлов и тратить больше своего контекстного окна на код, который действительно важен.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude Context предназначен только для Claude Code?</h3><p>Нет. Claude Context открыт как MCP-сервер, поэтому он может работать с любым инструментом кодирования, который поддерживает MCP. Claude Code является основным примером в этом посте, но тот же самый слой извлечения может поддерживать другие MCP-совместимые IDE и рабочие процессы агентов.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Нужен ли мне Zilliz Cloud для использования Claude Context?</h3><p>Claude Context может использовать Zilliz Cloud в качестве управляемого бэкенда Milvus, что является самым простым способом, если вы не хотите управлять инфраструктурой векторных баз данных. Та же архитектура поиска основана на концепциях Milvus, поэтому команды также могут адаптировать ее для самостоятельного развертывания Milvus.</p>
