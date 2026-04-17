---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Почему я против того, чтобы Клод Код использовал только Grep? Он сжигает
  слишком много токенов
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Узнайте, как векторное извлечение кода сокращает потребление токенов Claude
  Code на 40 %. Решение с открытым исходным кодом и простой интеграцией с MCP.
  Попробуйте claude-context уже сегодня.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>ИИ-помощники для кодинга переживают взрывной рост. Всего за последние два года такие инструменты, как Cursor, Claude Code, Gemini CLI и Qwen Code, превратились из диковинок в повседневных спутников миллионов разработчиков. Но за этим стремительным ростом скрывается борьба за нечто обманчиво простое: <strong>как помощник по кодингу с искусственным интеллектом должен искать контекст в вашей кодовой базе?</strong></p>
<p>На данный момент существует два подхода:</p>
<ul>
<li><p><strong>Векторный поиск на основе RAG</strong> (семантический поиск).</p></li>
<li><p><strong>Поиск по ключевым словам с помощью grep</strong> (буквенное соответствие строк).</p></li>
</ul>
<p>Claude Code и Gemini выбрали последний. На самом деле, один из инженеров Claude открыто признался на Hacker News, что Claude Code вообще не использует RAG. Вместо этого он просто строка за строкой ищет в вашем репозитории (то, что они называют "агентным поиском") - никакой семантики, никакой структуры, только совпадение строк.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Это откровение раскололо сообщество:</p>
<ul>
<li><p><strong>Сторонники</strong> защищают простоту grep. Он быстрый, точный и, что самое главное, предсказуемый. В программировании, утверждают они, точность - это главное, а современные вложения все еще слишком расплывчаты, чтобы им доверять.</p></li>
<li><p><strong>Критики</strong> считают grep тупиком. Он тонет в нерелевантных совпадениях, сжигает токены и тормозит рабочий процесс. Без семантического понимания это все равно что просить искусственный интеллект отлаживать с завязанными глазами.</p></li>
</ul>
<p>У обеих сторон есть свои аргументы. И после создания и тестирования собственного решения я могу сказать следующее: подход RAG, основанный на векторном поиске, меняет игру. <strong>Он не только делает поиск значительно быстрее и точнее, но и сокращает использование маркеров на 40 % и более. (Перейдите к части "Клод-контекст", чтобы узнать о моем подходе)</strong></p>
<p>Почему же grep так ограничен? И как на практике векторный поиск может дать лучшие результаты? Давайте разберемся в этом.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Что не так с поиском кода в Claude Code только с помощью Grep?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Я столкнулся с этой проблемой во время отладки одного сложного вопроса. Claude Code выполнял grep-запросы по всему моему репозиторию, вываливая на меня огромные куски нерелевантного текста. Через минуту я так и не нашел нужный файл. Через пять минут я наконец нашел нужные 10 строк, но они были похоронены в 500 строках шума.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Это не крайний случай. Просматривая проблемы Claude Code на GitHub, можно увидеть множество разочарованных разработчиков, столкнувшихся с той же проблемой:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Недовольство сообщества сводится к трем болевым точкам:</p>
<ol>
<li><p><strong>Раздувание токенов.</strong> Каждый grep-дамп выбрасывает огромное количество нерелевантного кода в LLM, увеличивая затраты, которые ужасно растут с размером репозитория.</p></li>
<li><p><strong>Налог на время.</strong> Вы вынуждены ждать, пока ИИ играет в двадцать вопросов с вашей кодовой базой, убивая фокус и поток.</p></li>
<li><p><strong>Нулевой контекст.</strong> Grep ищет буквальные строки. У него нет чувства смысла или взаимосвязи, так что вы фактически ищете вслепую.</p></li>
</ol>
<p>Вот почему эти дебаты важны: grep - это не просто "старая школа", он активно сдерживает программирование с помощью ИИ.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Код Клода против курсора: Почему последний имеет лучший контекст кода<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда дело доходит до контекста кода, Cursor делает лучшую работу. С самого первого дня Cursor склонялся к <strong>индексированию кодовой базы</strong>: разбивайте репозиторий на значимые фрагменты, встраивайте эти фрагменты в векторы и извлекайте их семантически, когда ИИ нужен контекст. Это учебник Retrieval-Augmented Generation (RAG), примененный к коду, и результаты говорят сами за себя: более плотный контекст, меньше потраченных впустую лексем и более быстрый поиск.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Клод Код, напротив, удвоил усилия по упрощению. Никаких индексов, никаких вкраплений - только grep. Это означает, что каждый поиск - это буквальное сопоставление строк, без понимания структуры или семантики. В теории это быстро, но на практике разработчики часто просеивают стог сена из нерелевантных совпадений, прежде чем найти ту единственную иголку, которая им действительно нужна.</p>
<table>
<thead>
<tr><th></th><th><strong>Код Клода</strong></th><th><strong>Курсор</strong></th></tr>
</thead>
<tbody>
<tr><td>Точность поиска</td><td>Находит только точные совпадения - пропускает все, что называется по-другому.</td><td>Находит семантически релевантный код даже при неполном совпадении ключевых слов.</td></tr>
<tr><td>Эффективность</td><td>Grep сбрасывает в модель огромные куски кода, увеличивая стоимость токенов.</td><td>Более мелкие, высокосигнальные фрагменты снижают нагрузку на маркеры на 30-40 %.</td></tr>
<tr><td>Масштабируемость</td><td>Каждый раз перегенерирует репозиторий, что замедляет рост проектов.</td><td>Индексирует один раз, а затем извлекает данные в масштабе с минимальной задержкой.</td></tr>
<tr><td>Философия</td><td>Минимализм - никакой лишней инфраструктуры.</td><td>Индексировать все, извлекать разумно.</td></tr>
</tbody>
</table>
<p>Почему же Claude (или Gemini, или Cline) не последовал примеру Cursor? Причины отчасти технические, а отчасти культурные. <strong>Векторный поиск - это не тривиальная задача: вам нужно решить проблемы чанкинга, инкрементных обновлений и крупномасштабного индексирования.</strong> Но что более важно, Claude Code построен на минимализме: никаких серверов, никаких индексов, только чистый CLI. Эмбендинги и векторные БД не вписываются в эту философию дизайна.</p>
<p>Эта простота привлекательна, но она также ограничивает потолок того, что может предоставить Claude Code. Готовность Cursor инвестировать в реальную инфраструктуру индексирования - вот почему сегодня он кажется более мощным.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: проект с открытым исходным кодом для добавления семантического поиска кода в Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code - сильный инструмент, но у него плохой контекст кода. Cursor решил эту проблему с помощью индексации кодовой базы, но Cursor имеет закрытый исходный код, закрыт для подписки и дороговат для отдельных пользователей или небольших команд.</p>
<p>Именно поэтому мы начали создавать собственное решение с открытым исходным кодом: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> - это плагин для MCP с открытым исходным кодом, который обеспечивает <strong>семантический поиск кода</strong> в Claude Code (и любом другом агенте кодирования с искусственным интеллектом, который говорит на MCP). Вместо того чтобы перебирать репозитории с помощью grep, он интегрирует векторные базы данных с моделями встраивания, чтобы предоставить LLM <em>глубокий, целевой контекст</em> из всей вашей кодовой базы. Результат: более точный поиск, меньше траты токенов и гораздо лучший опыт разработчиков.</p>
<p>Вот как мы его создали:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Технологии, которые мы используем</h3><p><strong>🔌 Интерфейсный уровень: MCP как универсальный коннектор</strong></p>
<p>Мы хотели, чтобы это работало везде, а не только в Claude. Протокол MCP (Model Context Protocol) действует как USB-стандарт для LLM, позволяя внешним инструментам легко подключаться. Упаковав Claude Context как MCP-сервер, он работает не только с Claude Code, но и с Gemini CLI, Qwen Code, Cline и даже Cursor.</p>
<p><strong>🗄️ Векторная база данных: Zilliz Cloud</strong></p>
<p>В качестве опорной базы мы выбрали <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (полностью управляемый сервис, построенный на базе <a href="https://milvus.io/">Milvus</a>). Он высокопроизводительный, облачный, эластичный и предназначен для ИИ-нагрузок, таких как индексирование кодовых баз. Это означает низкую задержку поиска, практически бесконечное масштабирование и надежную работу.</p>
<p><strong>🧩 Модели встраивания: Разные</strong>команды имеют разные потребности, поэтому Claude Context поддерживает несколько поставщиков встраивания из коробки:</p>
<ul>
<li><p><strong>Встраивания OpenAI</strong> для стабильности и широкого распространения.</p></li>
<li><p><strong>Встраивания Voyage</strong> для производительности с учетом особенностей кода.</p></li>
<li><p><strong>Ollama</strong> для локальных развертываний, ориентированных на конфиденциальность.</p></li>
</ul>
<p>Дополнительные модели могут быть добавлены по мере развития требований.</p>
<p><strong>💻 Выбор языка: TypeScript</strong></p>
<p>Мы спорили между Python и TypeScript. Победил TypeScript - не только из-за совместимости на уровне приложений (плагины VSCode, веб-инструменты), но и потому, что Claude Code и Gemini CLI сами основаны на TypeScript. Это делает интеграцию легкой и поддерживает целостность экосистемы.</p>
<h3 id="System-Architecture" class="common-anchor-header">Архитектура системы</h3><p>Claude Context имеет чистый многоуровневый дизайн:</p>
<ul>
<li><p><strong>Основные модули</strong> выполняют тяжелую работу: парсинг кода, разбивку на части, индексацию, поиск и синхронизацию.</p></li>
<li><p><strong>Пользовательский интерфейс</strong> управляет интеграциями - серверами MCP, плагинами VSCode или другими адаптерами.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Благодаря такому разделению основной механизм можно использовать в различных средах, а интеграции быстро развиваются по мере появления новых помощников по кодированию ИИ.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Реализация основных модулей</h3><p>Основные модули составляют основу всей системы. Они абстрагируют векторные базы данных, модели встраивания и другие компоненты в составные модули, которые создают объект Context, позволяя использовать различные векторные базы данных и модели встраивания для разных сценариев.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Решение ключевых технических задач<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Создание Claude Context не сводилось к подключению вкраплений и векторной базы данных. Настоящая работа заключалась в решении сложных проблем, которые делают или ломают индексацию кода в масштабе. Вот как мы решали три самые сложные задачи:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Задача 1: Интеллектуальное разбиение кода на части</h3><p>Код нельзя просто разделить по строкам или символам. Это создает беспорядочные, неполные фрагменты и лишает код логики, которая делает его понятным.</p>
<p>Мы решили эту проблему с помощью <strong>двух взаимодополняющих стратегий</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Разбивка на основе AST (основная стратегия)</h4><p>Это подход по умолчанию, использующий древовидные парсеры для понимания синтаксической структуры кода и разбиения по семантическим границам: функции, классы, методы. Это обеспечивает:</p>
<ul>
<li><p><strong>Полноту синтаксиса</strong> - никаких обрубленных функций или неработающих объявлений.</p></li>
<li><p><strong>Логическая связность</strong> - связанная логика сохраняется вместе для лучшего семантического поиска.</p></li>
<li><p><strong>Многоязыковая поддержка</strong> - работает в JS, Python, Java, Go и других языках благодаря древовидным грамматикам.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">Разделение текста LangChain (резервная стратегия)</h4><p>Для языков, которые AST не может разобрать или когда парсинг не удается, LangChain's <code translate="no">RecursiveCharacterTextSplitter</code> обеспечивает надежный резерв.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>Она менее "умна", чем AST, но очень надежна - это гарантирует, что разработчики никогда не останутся в затруднительном положении. Вместе эти две стратегии позволяют сбалансировать семантическое богатство и универсальность.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Задача 2: Эффективная обработка изменений кода</h3><p>Управление изменениями кода представляет собой одну из самых больших проблем в системах индексирования кода. Переиндексирование целых проектов для незначительных изменений в файлах было бы совершенно непрактичным.</p>
<p>Чтобы решить эту проблему, мы создали механизм синхронизации на основе деревьев Меркла.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Деревья Меркла: Основа обнаружения изменений</h4><p>Деревья Меркла создают иерархическую систему "отпечатков пальцев", в которой каждый файл имеет свой собственный хэш-отпечаток, папки имеют отпечатки, основанные на их содержимом, и все заканчивается уникальным отпечатком корневого узла для всей кодовой базы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>При изменении содержимого файлов хэш-отпечатки каскадом поднимаются вверх через каждый слой к корневому узлу. Это позволяет быстро обнаруживать изменения, сравнивая хэш-отпечатки слой за слоем от корневого узла вниз, быстро выявляя и локализуя изменения файлов без полной переиндексации проекта.</p>
<p>Система выполняет проверку синхронизации рукопожатий каждые 5 минут, используя оптимизированный трехфазный процесс:</p>
<p><strong>Фаза 1: молниеносное обнаружение</strong> вычисляет корневой хэш Merkle всей кодовой базы и сравнивает его с предыдущим снимком. Идентичные корневые хэши означают, что изменений не было - система пропускает всю обработку за миллисекунды.</p>
<p><strong>Фаза 2: Точное сравнение</strong> срабатывает, когда корневые хэши отличаются, и выполняет детальный анализ на уровне файлов, чтобы точно определить, какие файлы были добавлены, удалены или изменены.</p>
<p><strong>Фаза 3: Инкрементные обновления</strong> пересчитывает векторы только для измененных файлов и соответствующим образом обновляет базу данных векторов, обеспечивая максимальную эффективность.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Локальное управление моментальными снимками</h4><p>Все состояние синхронизации сохраняется локально в пользовательском каталоге <code translate="no">~/.context/merkle/</code>. Каждая кодовая база поддерживает свой собственный независимый файл моментальных снимков, содержащий хэш-таблицы файлов и сериализованные данные дерева Меркла, что обеспечивает точное восстановление состояния даже после перезапуска программы.</p>
<p>Такая конструкция дает очевидные преимущества: большинство проверок завершается за миллисекунды при отсутствии изменений, только действительно измененные файлы вызывают повторную обработку (что позволяет избежать огромных вычислительных потерь), а восстановление состояния безупречно работает во всех сессиях программы.</p>
<p>С точки зрения пользовательского опыта, изменение одной функции запускает переиндексацию только этого файла, а не всего проекта, что значительно повышает эффективность разработки.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Задача 3: Разработка интерфейса MCP</h3><p>Даже самый умный механизм индексирования бесполезен без чистого интерфейса, ориентированного на разработчиков. MCP был очевидным выбором, но он создал уникальные проблемы:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Дизайн инструмента: Сохранять простоту</strong></h4><p>Модуль MCP служит интерфейсом для пользователя, поэтому его удобство является главным приоритетом.</p>
<p>Разработка инструментов начинается с абстрагирования стандартных операций индексирования и поиска в кодовых базах в два основных инструмента: <code translate="no">index_codebase</code> для индексирования кодовых баз и <code translate="no">search_code</code> для поиска кода.</p>
<p>В связи с этим возникает важный вопрос: какие дополнительные инструменты необходимы?</p>
<p>Количество инструментов требует тщательного баланса - слишком много инструментов создают когнитивные издержки и запутывают выбор инструментов LLM, в то время как слишком мало инструментов могут упустить важную функциональность.</p>
<p>Ответ на этот вопрос можно получить, опираясь на реальные примеры использования.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Решение проблем фоновой обработки</h4><p>Индексация больших кодовых баз может занимать значительное время. Наивный подход, заключающийся в синхронном ожидании завершения, заставляет пользователей ждать несколько минут, что просто неприемлемо. Асинхронная фоновая обработка становится необходимой, но MCP не поддерживает этот паттерн нативно.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Наш MCP-сервер запускает фоновый процесс внутри MCP-сервера для обработки индексации, при этом немедленно возвращая пользователям сообщения о запуске, что позволяет им продолжать работу.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Это создает новую проблему: как пользователям отслеживать прогресс индексации?</p>
<p>Специальный инструмент для запроса прогресса или статуса индексирования решает эту проблему элегантно. Процесс фонового индексирования асинхронно кэширует информацию о ходе выполнения, позволяя пользователям в любой момент проверить процент завершения, статус успеха или условия неудачи. Кроме того, инструмент ручной очистки индекса позволяет справиться с ситуациями, когда пользователям необходимо сбросить неточные индексы или перезапустить процесс индексирования.</p>
<p><strong>Окончательный дизайн инструмента:</strong></p>
<p><code translate="no">index_codebase</code> - Кодовая база индексов<code translate="no">search_code</code> - Код поиска<code translate="no">get_indexing_status</code> - Статус индексирования запросов<code translate="no">clear_index</code> - Очистить индекс</p>
<p>Четыре инструмента, в которых соблюден идеальный баланс между простотой и функциональностью.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Управление переменными окружения</h4><p>Управление переменными окружения часто упускается из виду, несмотря на значительное влияние на работу пользователей. Требование отдельной настройки API-ключа для каждого MCP-клиента заставило бы пользователей настраивать учетные данные несколько раз при переключении между Claude Code и Gemini CLI.</p>
<p>Глобальный подход к конфигурации устраняет это трение путем создания файла <code translate="no">~/.context/.env</code> в домашнем каталоге пользователя:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Такой подход дает очевидные преимущества:</strong> пользователи настраивают один раз и используют везде во всех MCP-клиентах, все конфигурации сосредоточены в одном месте для удобства обслуживания, а чувствительные API-ключи не разбрасываются по нескольким конфигурационным файлам.</p>
<p>Мы также реализуем трехуровневую иерархию приоритетов: переменные окружения процесса имеют наивысший приоритет, глобальные конфигурационные файлы имеют средний приоритет, а значения по умолчанию служат запасными вариантами.</p>
<p>Такая конструкция обеспечивает огромную гибкость: разработчики могут использовать переменные окружения для временных переопределений при тестировании, производственные среды могут вводить конфиденциальные конфигурации через системные переменные окружения для повышения безопасности, а пользователи настраивают конфигурацию один раз, чтобы она работала без проблем в Claude Code, Gemini CLI и других инструментах.</p>
<p>На данный момент основная архитектура сервера MCP завершена, она охватывает разбор кода и хранение векторов, а также интеллектуальное извлечение и управление конфигурациями. Каждый компонент был тщательно разработан и оптимизирован, чтобы создать мощную и удобную систему.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Практическое тестирование<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Как же Claude Context работает на практике? Я протестировал его по точно такому же сценарию поиска ошибок, который поначалу меня разочаровал.</p>
<p>Установка была всего лишь одной командой перед запуском Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Как только моя кодовая база была проиндексирована, я дал Claude Code то же самое описание ошибки, которое ранее отправило его в <strong>пятиминутную гусиную охоту с помощью grep</strong>. На этот раз, благодаря вызовам <code translate="no">claude-context</code> MCP, он <strong>сразу же определил точный файл и номер строки</strong>, а также объяснил суть проблемы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Разница была незаметной - как днем, так и ночью.</p>
<p>И это был не просто поиск ошибок. С интегрированным Claude Context Claude Code постоянно выдавал результаты более высокого качества:</p>
<ul>
<li><p><strong>решение проблем</strong></p></li>
<li><p><strong>рефакторинг кода</strong></p></li>
<li><p><strong>обнаружение дублирующегося кода</strong></p></li>
<li><p><strong>комплексное тестирование</strong></p></li>
</ul>
<p>Повышение производительности проявляется и в цифрах. При сравнительном тестировании:</p>
<ul>
<li><p>использование токенов сократилось более чем на 40 %, без каких-либо потерь в отзывах.</p></li>
<li><p>Это напрямую отражается на снижении затрат на API и более быстрых ответах.</p></li>
<li><p>И наоборот, при том же бюджете Claude Context обеспечивает гораздо более точный поиск.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы выложили Claude Context в открытый доступ на GitHub, и он уже заработал 2,6K+ звезд. Спасибо всем за поддержку и лайки.</p>
<p>Вы можете попробовать его сами:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Подробные бенчмарки и методология тестирования доступны в репозитории - мы будем рады вашим отзывам.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Заглядывая вперед<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>То, что началось с разочарования в grep в Claude Code, переросло в надежное решение: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context -</strong></a>плагин для MCP с открытым исходным кодом, который привносит семантический, векторный поиск в Claude Code и другие помощники кодирования. Идея проста: разработчикам не нужно довольствоваться неэффективными инструментами ИИ. Благодаря RAG и векторному поиску вы сможете быстрее отлаживать, сократить расходы на токены на 40 % и наконец-то получить помощь ИИ, который действительно понимает вашу кодовую базу.</p>
<p>И это не ограничивается Claude Code. Поскольку Claude Context построен на открытых стандартах, тот же подход легко работает с Gemini CLI, Qwen Code, Cursor, Cline и другими. Больше не нужно быть зацикленным на компромиссах с поставщиками, которые отдают предпочтение простоте перед производительностью.</p>
<p>Мы будем рады, если вы станете частью этого будущего:</p>
<ul>
<li><p><strong>Попробуйте</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> он с открытым исходным кодом и совершенно бесплатный.</p></li>
<li><p><strong>Внесите свой вклад в его разработку</strong></p></li>
<li><p><strong>Или создайте свое собственное решение</strong> с использованием Claude Context</p></li>
</ul>
<p>Делитесь своими отзывами, задавайте вопросы или получайте помощь, присоединившись к нашему <a href="https://discord.com/invite/8uyFbECzPX"><strong>сообществу Discord</strong></a>.</p>
