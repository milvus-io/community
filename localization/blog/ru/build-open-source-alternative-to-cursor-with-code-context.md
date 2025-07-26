---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Создание альтернативы Cursor с открытым исходным кодом с помощью Code Context
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context - плагин с открытым исходным кодом, совместимый с MCP, который
  обеспечивает мощный семантический поиск кода в любом агенте кодирования AI,
  Claude Code и Gemini CLI, IDE, таких как VSCode, и даже средах, таких как
  Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">Бум кодирования ИИ и его слепые пятна<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Инструменты для кодирования с помощью искусственного интеллекта встречаются повсюду - и не зря. От <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, Gemini CLI</a> до альтернатив Cursor с открытым исходным кодом - эти агенты могут писать функции, объяснять зависимость кода и рефакторить целые файлы с помощью одной подсказки. Разработчики спешат внедрить их в свои рабочие процессы, и во многих отношениях они оправдывают надежды.</p>
<p><strong>Но когда дело доходит до <em>понимания кодовой базы</em>, большинство инструментов ИИ упираются в стену.</strong></p>
<p>Попросите Claude Code найти "где этот проект обрабатывает аутентификацию пользователя", и он снова попадет на <code translate="no">grep -r &quot;auth&quot;</code>- выдаст 87 слабо связанных совпадений в комментариях, именах переменных и файлах, вероятно, пропустив множество функций с логикой аутентификации, но без названия "auth". Попробуйте Gemini CLI, и он будет искать ключевые слова вроде "login" или "password", полностью пропуская функции вроде <code translate="no">verifyCredentials()</code>. Эти инструменты отлично справляются с генерацией кода, но когда приходит время навигации, отладки или изучения незнакомых систем, они разваливаются на части. Если они не отправляют всю кодовую базу в LLM для получения контекста - сжигания токенов и времени - они не могут дать содержательных ответов.</p>
<p><em>Это реальный пробел в сегодняшних инструментах ИИ:</em> <strong><em>контекст кода.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor справился с этой задачей, но не для всех<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> решает эту проблему с головой. Вместо поиска по ключевым словам он строит семантическую карту вашей кодовой базы, используя деревья синтаксиса, векторные вкрапления и поиск по коду. Задайте ему вопрос "Где логика проверки электронной почты?", и он вернет <code translate="no">isValidEmailFormat()</code> - не потому, что название совпадает, а потому, что понимает, что <em>делает</em> этот код.</p>
<p>Хотя Cursor очень мощный, он может подойти не всем. <strong><em>Cursor имеет закрытый исходный код, размещается в облаке и работает по подписке.</em></strong> Это делает его недоступным для команд, работающих с конфиденциальным кодом, организаций, заботящихся о безопасности, инди-разработчиков, студентов и всех, кто предпочитает открытые системы.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">Что, если бы вы могли создать свой собственный курсор?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Дело вот в чем: основная технология, лежащая в основе Cursor, не является проприетарной. Она построена на проверенном фундаменте с открытым исходным кодом - векторные базы данных, такие как <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">модели встраивания</a>, синтаксические анализаторы с Tree-sitter - все это доступно любому, кто готов подключиться.</p>
<p><em>Итак, мы спросили:</em> <strong><em>Что, если каждый сможет создать свой собственный Cursor?</em></strong> Работает на вашей инфраструктуре. Без абонентской платы. Полностью настраиваемый. Полный контроль над вашим кодом и данными.</p>
<p>Именно поэтому мы создали <a href="https://github.com/zilliztech/code-context"><strong>Code Context -</strong></a>плагин с открытым исходным кодом, совместимый с MCP, который обеспечивает мощный семантический поиск кода в любом агенте кодирования AI, таком как Claude Code и Gemini CLI, IDE, например VSCode, и даже в таких средах, как Google Chrome. Кроме того, с его помощью вы можете создать собственный агент кодирования, например Cursor, с нуля, открыв интеллектуальную навигацию по кодовой базе в режиме реального времени.</p>
<p><strong><em>Никаких подписок. Никаких черных ящиков. Только интеллектуальный код на ваших условиях.</em></strong></p>
<p>В этой статье мы расскажем о том, как работает Code Context и как вы можете начать использовать его уже сегодня.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context: Альтернатива интеллекту Cursor с открытым исходным кодом<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> - это система семантического поиска кода с открытым исходным кодом, совместимая с MCP. Создаете ли вы собственный помощник по кодированию с нуля или добавляете семантическую осведомленность к таким помощникам по кодированию, как Claude Code и Gemini CLI, Code Context - это движок, который делает это возможным.</p>
<p>Он работает локально, интегрируется с вашими любимыми инструментами и средами, такими как VS Code и браузеры Chrome, и обеспечивает надежное понимание кода, не опираясь на облачные платформы с закрытым исходным кодом.</p>
<p><strong>Основные возможности включают:</strong></p>
<ul>
<li><p><strong>Семантический поиск кода на естественном языке:</strong> Поиск кода с помощью обычного английского языка. Введите в поиск такие понятия, как "проверка входа пользователя" или "логика обработки платежей", и Code Context найдет соответствующие функции - даже если они не полностью совпадают с ключевыми словами.</p></li>
<li><p><strong>Поддержка нескольких языков:</strong> Удобный поиск на 15+ языках программирования, включая JavaScript, Python, Java и Go, с последовательным семантическим пониманием на всех этих языках.</p></li>
<li><p><strong>Разбивка кода на части на основе AST:</strong> Код автоматически разбивается на логические единицы, такие как функции и классы, с помощью синтаксического анализа AST, что обеспечивает полноту и осмысленность результатов поиска и никогда не обрывается на середине функции.</p></li>
<li><p><strong>Индексация в режиме реального времени:</strong> Изменения кода индексируются в режиме реального времени. По мере редактирования файлов поисковый индекс остается актуальным - нет необходимости в ручном обновлении или повторном индексировании.</p></li>
<li><p><strong>Полностью локальное, безопасное развертывание:</strong> Запускайте все на своей собственной инфраструктуре. Code Context поддерживает локальные модели через Ollama и индексацию через <a href="https://milvus.io/">Milvus</a>, поэтому ваш код никогда не покинет пределы вашей среды.</p></li>
<li><p><strong>Первоклассная интеграция с IDE:</strong> Расширение VSCode позволяет осуществлять поиск и мгновенно переходить к результатам прямо из редактора, без переключения контекста.</p></li>
<li><p><strong>Поддержка протокола MCP:</strong> Code Context говорит на языке MCP, что упрощает интеграцию с помощниками по кодированию AI и позволяет внедрить семантический поиск непосредственно в их рабочие процессы.</p></li>
<li><p><strong>Поддержка плагинов для браузеров:</strong> Поиск в репозиториях непосредственно с GitHub в браузере - никаких вкладок, никакого копирования-вставки, только мгновенный контекст, где бы вы ни работали.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Принцип работы Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context использует модульную архитектуру с основным оркестратором и специализированными компонентами для встраивания, разбора, хранения и поиска.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">Основной модуль: Code Context Core</h3><p>Сердцем Code Context является <strong>Code Context Core</strong>, который координирует парсинг, встраивание, хранение и семантический поиск кода:</p>
<ul>
<li><p><strong>Модуль обработки текста</strong> разделяет и разбирает код, используя Tree-sitter для анализа AST с учетом языка.</p></li>
<li><p><strong>Интерфейс встраивания</strong> поддерживает подключаемые бэкенды - в настоящее время это OpenAI и VoyageAI, - преобразующие фрагменты кода в векторные вставки, которые передают их семантическое значение и контекстуальные связи.</p></li>
<li><p><strong>Интерфейс векторной базы данных</strong> хранит эти вкрапления в самостоятельном экземпляре <a href="https://milvus.io/">Milvus</a> (по умолчанию) или в <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, управляемой версии Milvus.</p></li>
</ul>
<p>Все это синхронизируется с вашей файловой системой по расписанию, что позволяет поддерживать индекс в актуальном состоянии без необходимости ручного вмешательства.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Модули расширения поверх Code Context Core</h3><ul>
<li><p><strong>Расширение VSCode</strong>: Бесшовная интеграция с IDE для быстрого семантического поиска в редакторе и перехода к определению.</p></li>
<li><p><strong>Расширение для Chrome</strong>: Встроенный семантический поиск кода при просмотре репозиториев GitHub - не нужно переключаться между вкладками.</p></li>
<li><p><strong>MCP Server</strong>: Предоставляет Code Context любым помощникам по кодированию с искусственным интеллектом по протоколу MCP, обеспечивая помощь в режиме реального времени с учетом контекста.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Начало работы с Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context можно подключить к уже используемым инструментам кодирования или создать собственный помощник по кодированию с искусственным интеллектом с нуля. В этом разделе мы рассмотрим оба сценария:</p>
<ul>
<li><p>Как интегрировать Code Context с существующими инструментами</p></li>
<li><p>Как настроить основной модуль для автономного семантического поиска кода при создании собственного помощника по кодированию с искусственным интеллектом</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Интеграция с MCP</h3><p>Code Context поддерживает <strong>протокол Model Context Protocol (MCP)</strong>, что позволяет агентам по кодированию ИИ, таким как Claude Code, использовать его в качестве семантического бэкенда.</p>
<p>Интеграция с Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>После настройки Claude Code будет автоматически вызывать Code Context для семантического поиска кода, когда это необходимо.</p>
<p>Для интеграции с другими инструментами или средами ознакомьтесь с нашими примерами и адаптерами<a href="https://github.com/zilliztech/code-context"> в репозитории GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Создание собственного ИИ-помощника по кодированию с помощью Code Context</h3><p>Чтобы создать собственный ИИ-помощник с помощью Code Context, вы настроите основной модуль для семантического поиска кода всего за три шага:</p>
<ol>
<li><p>Настройте модель встраивания</p></li>
<li><p>Подключитесь к базе данных векторов</p></li>
<li><p>Проиндексируйте свой проект и начните поиск.</p></li>
</ol>
<p>Вот пример, использующий <strong>OpenAI Embeddings</strong> и <strong>векторную базу данных</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> в качестве векторного бэкенда:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Расширение VSCode</h3><p>Code Context доступен в виде расширения VSCode под названием <strong>"Semantic Code Search",</strong> которое обеспечивает интеллектуальный поиск кода на естественном языке прямо в вашем редакторе.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>После установки:</p>
<ul>
<li><p>Настройте свой API-ключ</p></li>
<li><p>Проиндексируйте свой проект</p></li>
<li><p>Используйте простые английские запросы (точное совпадение не требуется)</p></li>
<li><p>Мгновенно переходите к результатам с помощью клика по навигации.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Таким образом, семантический поиск становится неотъемлемой частью рабочего процесса кодирования - не требуется терминал или браузер.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Расширение для Chrome (скоро выйдет)</h3><p>Наше готовящееся к выпуску <strong>расширение для Chrome</strong> привносит Code Context на веб-страницы GitHub, позволяя запускать семантический поиск кода непосредственно в любом публичном репозитории - без необходимости переключения контекста или вкладок.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вы сможете исследовать незнакомые кодовые базы с теми же возможностями глубокого поиска, что и в локальных хранилищах. Следите за новостями - расширение находится в разработке и скоро будет запущено.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Почему стоит использовать Code Context?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Базовая настройка поможет вам быстро начать работу, но по-настоящему <strong>Code Context</strong> проявляет себя в профессиональных, высокопроизводительных средах разработки. Его расширенные возможности предназначены для поддержки серьезных рабочих процессов, от развертывания в масштабах предприятия до создания пользовательских инструментов искусственного интеллекта.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Частное развертывание для безопасности корпоративного уровня</h3><p>Code Context поддерживает полностью автономное развертывание с использованием модели локального встраивания <strong>Ollama</strong> и <strong>Milvus</strong> в качестве самостоятельной векторной базы данных. Это позволяет создать полностью приватный конвейер поиска кода: никаких вызовов API, никакой передачи данных через Интернет, и ни одна информация никогда не покидает локальную среду.</p>
<p>Такая архитектура идеально подходит для отраслей со строгими требованиями к соблюдению нормативных требований, таких как финансовая, государственная и оборонная, где конфиденциальность кода не подлежит обсуждению.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Индексирование в режиме реального времени с интеллектуальной синхронизацией файлов</h3><p>Поддержание актуальности индекса кода не должно быть медленным или ручным. Code Context включает <strong>систему мониторинга файлов на основе дерева Меркла</strong>, которая мгновенно обнаруживает изменения и выполняет инкрементные обновления в режиме реального времени.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Переиндексируя только измененные файлы, она сокращает время обновления больших репозиториев с минут до секунд. Это гарантирует, что код, который вы только что написали, уже доступен для поиска без необходимости нажимать кнопку "обновить".</p>
<p>В быстро меняющейся среде разработчиков такая оперативность очень важна.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">AST-парсинг, который понимает код так же, как и вы</h3><p>Традиционные инструменты поиска кода разделяют текст по количеству строк или символов, часто нарушая логические единицы и возвращая путаные результаты.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context работает лучше. В нем используется синтаксический анализ AST на основе Tree-sitter для понимания фактической структуры кода. Он идентифицирует полные функции, классы, интерфейсы и модули, предоставляя чистые, семантически полные результаты.</p>
<p>Он поддерживает основные языки программирования, включая JavaScript/TypeScript, Python, Java, C/C++, Go и Rust, с языковыми стратегиями для точной разбивки кода. Для неподдерживаемых языков он возвращается к разбору на основе правил, обеспечивая плавную обработку без сбоев и пустых результатов.</p>
<p>Эти структурированные единицы кода также попадают в метаданные для более точного семантического поиска.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Открытый исходный код и расширяемость</h3><p>Code Context имеет полностью открытый исходный код под лицензией MIT. Все основные модули находятся в открытом доступе на GitHub.</p>
<p>Мы считаем, что открытая инфраструктура - это ключ к созданию мощных, надежных инструментов для разработчиков, и приглашаем разработчиков расширять ее для новых моделей, языков или случаев использования.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Решение проблемы контекстного окна для ИИ-помощников</h3><p>У больших языковых моделей (LLM) есть жесткое ограничение: их контекстное окно. Оно не позволяет им видеть всю кодовую базу, что снижает точность завершений, исправлений и предложений.</p>
<p>Code Context помогает устранить этот пробел. Его семантический поиск кода позволяет найти <em>нужные</em> фрагменты кода, предоставляя помощнику ИИ сфокусированный, релевантный контекст для рассуждений. Он повышает качество результатов, генерируемых ИИ, позволяя модели "приблизить" то, что действительно важно.</p>
<p>Популярные инструменты для кодирования ИИ, такие как Claude Code и Gemini CLI, не имеют встроенного семантического поиска кода - они полагаются на поверхностную эвристику, основанную на ключевых словах. Code Context, интегрированный в <strong>MCP</strong>, дает им "мозговой апгрейд".</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Создано для разработчиков, разработчиками</h3><p>Code Context упакован для модульного повторного использования: каждый компонент доступен в виде независимого пакета <strong>npm</strong>. Вы можете смешивать, сочетать и расширять их по мере необходимости для вашего проекта.</p>
<ul>
<li><p>Нужен только семантический поиск кода? Используйте .<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Хотите подключить агента искусственного интеллекта? Добавьте . <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Создаете свою собственную IDE/браузерную утилиту? Используйте наши примеры расширений VSCode и Chrome.</p></li>
</ul>
<p>Некоторые примеры применения контекста кода:</p>
<ul>
<li><p><strong>Контекстно-ориентированные плагины автозаполнения</strong>, которые извлекают релевантные фрагменты для лучшего завершения LLM</p></li>
<li><p><strong>Интеллектуальные детекторы ошибок</strong>, которые собирают окружающий код для улучшения предложений по исправлению</p></li>
<li><p><strong>Инструменты безопасного рефакторинга кода</strong>, которые автоматически находят семантически связанные места</p></li>
<li><p><strong>Визуализаторы архитектуры</strong>, которые строят диаграммы на основе семантических связей кода</p></li>
<li><p><strong>Более умные ассистенты для рецензирования кода</strong>, которые позволяют обнаружить исторические реализации во время PR-обзоров</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Добро пожаловать в наше сообщество<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> - это не просто инструмент, это платформа для изучения того, как <strong>искусственный интеллект и векторные базы данных</strong> могут работать вместе, чтобы по-настоящему понять код. Мы считаем, что по мере того, как разработка с помощью ИИ станет нормой, семантический поиск кода станет основополагающей способностью.</p>
<p>Мы приветствуем любой вклад:</p>
<ul>
<li><p>Поддержка новых языков</p></li>
<li><p>Новые бэкенды для моделей встраивания</p></li>
<li><p>Инновационные рабочие процессы с поддержкой ИИ</p></li>
<li><p>Отзывы, сообщения об ошибках и идеи дизайна.</p></li>
</ul>
<p>Найти нас можно здесь:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context на GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm package</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode marketplace</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Вместе мы сможем создать инфраструктуру для следующего поколения инструментов разработки ИИ - прозрачных, мощных и ориентированных на разработчиков.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
