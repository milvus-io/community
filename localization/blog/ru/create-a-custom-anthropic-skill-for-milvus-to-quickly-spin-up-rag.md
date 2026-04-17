---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Как антропные навыки меняют инструментарий агента - и как создать
  пользовательский навык для Milvus, чтобы быстро раскрутить RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Узнайте, что такое навыки и как создать пользовательский навык в Claude Code,
  который позволяет создавать RAG-системы на основе естественного языка с
  помощью многоразового рабочего процесса, поддерживаемого Milvus.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>Использование инструментов - важная составляющая работы агента. Агент должен выбрать правильный инструмент, решить, когда его вызвать, и правильно отформатировать вводимые данные. На бумаге это звучит просто, но как только вы начинаете строить реальные системы, вы обнаруживаете множество крайних случаев и режимов отказа.</p>
<p>Многие команды используют определения инструментов в стиле MCP, чтобы организовать это, но MCP имеет некоторые неровности. Модель должна рассуждать обо всех инструментах сразу, и в ней нет особой структуры, которая бы направляла ее решения. Кроме того, каждое определение инструмента должно находиться в контекстном окне. Некоторые из них очень велики - GitHub MCP занимает около 26 тысяч токенов, - что съедает контекст еще до того, как агент начинает выполнять реальную работу.</p>
<p>Anthropic представил <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>Навыки</strong></a>, чтобы улучшить эту ситуацию. Навыки меньше, более сфокусированы, и их легче загружать по требованию. Вместо того чтобы сбрасывать все в контекст, вы упаковываете логику домена, рабочие процессы или скрипты в компактные блоки, которые агент может использовать только по мере необходимости.</p>
<p>В этом посте я расскажу о том, как работают антропные навыки, а затем расскажу о создании простого навыка в Claude Code, который превращает естественный язык в базу знаний <a href="https://milvus.io/">с поддержкой Milvus</a>- быстрая настройка RAG без дополнительных проводов.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">Что такое антропные навыки?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Антропные навыки</a> (или навыки агента) - это просто папки, в которых собраны инструкции, скрипты и справочные файлы, необходимые агенту для выполнения определенной задачи. Думайте о них как о небольших, самодостаточных пакетах возможностей. Навык может определять, как генерировать отчет, выполнять анализ или следовать определенному рабочему процессу или набору правил.</p>
<p>Ключевая идея заключается в том, что навыки являются модульными и могут быть загружены по требованию. Вместо того чтобы запихивать огромные определения инструментов в контекстное окно, агент извлекает только нужный ему навык. Это позволяет снизить потребление контекста и одновременно дать модели четкие указания о том, какие инструменты существуют, когда их вызывать и как выполнять каждый шаг.</p>
<p>Формат намеренно прост, и благодаря этому он уже поддерживается или легко адаптируется во многих инструментах разработчика - Claude Code, Cursor, расширения VS Code, интеграции GitHub, установки в стиле Codex и так далее.</p>
<p>Навык имеет последовательную структуру папок:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Core File)</strong></p>
<p>Это руководство по выполнению для агента - документ, который указывает агенту, как именно следует выполнять задание. Он определяет метаданные навыка (например, название, описание и ключевые слова триггера), порядок выполнения и настройки по умолчанию. В этом файле вы должны четко описать:</p>
<ul>
<li><p><strong>Когда навык должен быть запущен:</strong> Например, запустить навык, когда пользовательский ввод включает фразу типа "обрабатывать CSV-файлы с помощью Python".</p></li>
<li><p><strong>Как должно выполняться задание:</strong> Расставьте шаги выполнения по порядку, например: интерпретация запроса пользователя → вызов скриптов предварительной обработки из каталога <code translate="no">scripts/</code> → генерация необходимого кода → форматирование вывода с помощью шаблонов из <code translate="no">templates/</code>.</p></li>
<li><p><strong>Правила и ограничения:</strong> Указывают такие детали, как соглашения по кодированию, форматы вывода и способы обработки ошибок.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Сценарии выполнения)</strong></p>
<p>Эта директория содержит заранее написанные сценарии на таких языках, как Python, Shell или Node.js. Агент может вызывать эти сценарии напрямую, вместо того чтобы генерировать один и тот же код во время выполнения. Типичными примерами являются <code translate="no">create_collection.py</code> и <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Шаблоны документов)</strong></p>
<p>Файлы шаблонов многократного использования, которые агент может использовать для генерации настраиваемого содержимого. Типичные примеры - шаблоны отчетов или шаблоны конфигурации.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Справочные материалы)</strong></p>
<p>Справочные документы, к которым агент может обращаться во время выполнения, например документация по API, технические спецификации или руководства по лучшей практике.</p>
<p>В целом эта структура отражает процесс передачи работы новому сотруднику: <code translate="no">SKILL.md</code> объясняет задание, <code translate="no">scripts/</code> предоставляет готовые к использованию инструменты, <code translate="no">templates/</code> определяет стандартные форматы, а <code translate="no">resources/</code> предоставляет справочную информацию. Имея все это, агент может выполнить задание надежно и с минимальными ошибками.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Практическое руководство: Создание пользовательского навыка для системы RAG с питанием от Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом разделе мы рассмотрим создание пользовательского навыка, который может настроить коллекцию Milvus и собрать полный конвейер RAG из простых инструкций на естественном языке. Цель состоит в том, чтобы пропустить всю обычную работу по настройке - никакого ручного проектирования схемы, никакой настройки индексов, никакого шаблонного кода. Вы сообщаете агенту, что вам нужно, а он обрабатывает все части Milvus за вас.</p>
<h3 id="Design-Overview" class="common-anchor-header">Обзор проектирования</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><table>
<thead>
<tr><th>Компонент</th><th>Требование</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Модели</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Контейнер</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Платформа конфигурирования моделей</td><td>CC-Switch</td></tr>
<tr><td>Менеджер пакетов</td><td>npm</td></tr>
<tr><td>Язык разработки</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Шаг 1: Настройка среды</h3><p><strong>Установите</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Установите CC-Switch</strong></p>
<p><strong>Примечание:</strong> CC-Switch - это инструмент для переключения моделей, который позволяет легко переключаться между различными API моделей при локальном запуске моделей ИИ.</p>
<p>Репозиторий проекта: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Выберите Claude и добавьте ключ API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Проверьте текущее состояние</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Развертывание и запуск Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Настройка ключа API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Шаг 2: Создание пользовательского навыка для Milvus</h3><p><strong>Создайте структуру каталогов</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Инициализируйте</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Примечание:</strong> SKILL.md служит руководством по выполнению агента. В нем определено, что делает навык и как он должен быть вызван.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Напишите основные сценарии</strong></p>
<table>
<thead>
<tr><th>Тип сценария</th><th>Имя файла</th><th>Назначение</th></tr>
</thead>
<tbody>
<tr><td>Проверка среды</td><td><code translate="no">check_env.py</code></td><td>Проверяет версию Python, необходимые зависимости и соединение с Milvus</td></tr>
<tr><td>Разбор намерений</td><td><code translate="no">intent_parser.py</code></td><td>Преобразует запросы типа "создать базу данных RAG" в структурированные намерения, такие как <code translate="no">scene=rag</code></td></tr>
<tr><td>Создание коллекции</td><td><code translate="no">milvus_builder.py</code></td><td>Основной конструктор, который генерирует схему коллекции и конфигурацию индексов</td></tr>
<tr><td>Ввод данных</td><td><code translate="no">insert_milvus_data.py</code></td><td>Загружает документы, разбивает их на части, генерирует вкрапления и записывает данные в Milvus</td></tr>
<tr><td>Пример 1</td><td><code translate="no">basic_text_search.py</code></td><td>Демонстрирует создание системы поиска по документам</td></tr>
<tr><td>Пример 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Демонстрирует создание полной базы знаний RAG</td></tr>
</tbody>
</table>
<p>Эти сценарии показывают, как превратить навык, ориентированный на Milvus, в нечто практическое: работающую систему поиска по документам и интеллектуальную базу вопросов и ответов (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Шаг 3: Включите навык и проведите тестирование</h3><p><strong>Опишите запрос на естественном языке</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Создана система RAG</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Вставка образцов данных</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Выполнить запрос</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>В этом руководстве мы рассмотрели создание RAG-системы на базе Milvus с помощью пользовательского навыка. Цель заключалась не только в том, чтобы показать еще один способ вызова Milvus, но и в том, чтобы показать, как навыки могут превратить то, что обычно является многоступенчатой и тяжелой конфигурацией, в нечто, что вы можете повторно использовать и повторять. Вместо того чтобы вручную определять схемы, настраивать индексы или сшивать код рабочего процесса, навык обрабатывает большую часть шаблонов, и вы можете сосредоточиться на тех частях RAG, которые действительно важны.</p>
<p>Это только начало. Полный конвейер RAG состоит из множества движущихся частей: препроцессинг, чанкинг, настройки гибридного поиска, повторное ранжирование, оценка и многое другое. Все они могут быть упакованы в виде отдельных навыков и скомпонованы в зависимости от конкретного случая использования. Если у вашей команды есть внутренние стандарты для размеров вектора, параметров индекса, шаблонов подсказок или логики поиска, навыки - это чистый способ закодировать эти знания и сделать их повторяемыми.</p>
<p>Для новых разработчиков это снижает входной барьер - не нужно изучать каждую деталь Milvus, прежде чем запустить что-то. Для опытных команд это сокращает время на повторную настройку и помогает поддерживать согласованность проектов в разных средах. Навыки не заменят продуманного проектирования системы, но они устраняют множество ненужных трений.</p>
<p>👉 Полная реализация доступна в <a href="https://github.com/yinmin2020/open-milvus-skills">репозитории с открытым исходным кодом</a>, и вы можете изучить больше примеров, созданных сообществом, на <a href="https://skillsmp.com/">рынке навыков</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Следите за новостями!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы также работаем над созданием официальных навыков Milvus и Zilliz Cloud, которые охватывают общие шаблоны RAG и лучшие производственные практики. Если у вас есть идеи или конкретные рабочие процессы, которые вы хотите поддержать, присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу Slack</a> и общайтесь с нашими инженерами. А если вам нужны рекомендации по вашей собственной настройке, вы всегда можете записаться на сеанс <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
