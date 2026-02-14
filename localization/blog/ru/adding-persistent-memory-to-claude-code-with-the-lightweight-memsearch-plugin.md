---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: Добавление постоянной памяти в код Клода с помощью легкого плагина memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Обеспечьте коду Клода долговременную память с помощью cc-плагина memsearch.
  Легкое, прозрачное хранилище Markdown, автоматический семантический поиск,
  нулевые затраты на токены.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Недавно мы создали и выложили в открытый доступ <a href="https://github.com/zilliztech/memsearch">memsearch</a>- автономную библиотеку долговременной памяти, которая позволяет любому агенту получить постоянную, прозрачную и управляемую человеком память. Она использует ту же архитектуру памяти, что и OpenClaw - только без остального стека OpenClaw. Это означает, что вы можете добавить ее в любой агентский фреймворк (Claude, GPT, Llama, пользовательские агенты, движки рабочих процессов) и мгновенно добавить долговременную память, доступную для запросов. <em>(Если вы хотите узнать, как работает memsearch, мы написали</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>отдельный пост здесь</em></a><em>).</em></p>
<p>В большинстве агентских рабочих процессов memsearch работает именно так, как задумано. Но <strong>агентское кодирование</strong> - это совсем другая история. Сессии кодирования длятся долго, контекстные переключения происходят постоянно, а информация, которую стоит хранить, накапливается в течение нескольких дней или недель. Такой объем и изменчивость выявляют слабые места в типичных системах памяти агентов - в том числе и в memsearch. В сценариях кодирования шаблоны поиска отличаются настолько, что мы не можем просто использовать существующий инструмент как есть.</p>
<p>Чтобы решить эту проблему, мы создали <strong>плагин постоянной памяти, разработанный специально для Claude Code</strong>. Он располагается поверх memsearch CLI, и мы назвали его <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(с открытым исходным кодом, лицензия MIT)</em></li>
</ul>
<p>С помощью легкого <strong>cc-плагина memsearch</strong>, управляющего памятью за кулисами, Claude Code получает возможность помнить каждый разговор, каждое решение, каждое стилевое предпочтение и каждый многодневный поток - автоматически индексируемый, с возможностью полного поиска и сохраняемый в течение всех сессий.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Для ясности в этом посте: "ccplugin" означает верхний слой, или сам плагин Claude Code. "memsearch" относится к нижнему уровню - отдельному инструменту CLI, лежащему в его основе.</em></p>
<p>Почему же для кодирования нужен свой собственный плагин и почему мы создали что-то настолько легковесное? Все сводится к двум проблемам, с которыми вы почти наверняка сталкивались: Отсутствие постоянной памяти в Claude Code, а также громоздкость и сложность существующих решений вроде claude-mem.</p>
<p>Так зачем вообще создавать специальный плагин? Потому что агенты кодирования сталкиваются с двумя болевыми точками, с которыми вы почти наверняка сталкивались сами:</p>
<ul>
<li><p>Код Клода не имеет постоянной памяти.</p></li>
<li><p>Многие существующие решения сообщества, такие как <em>claude-mem, являются</em>мощными, но тяжелыми, неуклюжими или слишком сложными для повседневной работы с кодом.</p></li>
</ul>
<p>Плагин cc призван решить обе проблемы с помощью минимального, прозрачного, удобного для разработчиков слоя поверх memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Проблема памяти кода Клода: он забывает все, когда сессия заканчивается<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Начнем со сценария, с которым наверняка сталкивались пользователи Claude Code.</p>
<p>Вы открываете Claude Code утром. "Продолжить вчерашний рефактор аутентификации", - набираете вы. Клод отвечает: "Я не уверен, над чем вы работали вчера". Так что следующие десять минут вы тратите на копирование вчерашних логов. Это не такая уж большая проблема, но она быстро надоедает, потому что возникает так часто.</p>
<p>Несмотря на то, что в Claude Code есть собственные механизмы памяти, они далеко не всегда удовлетворительны. Файл <code translate="no">CLAUDE.md</code> может хранить директивы проекта и предпочтения, но он лучше работает для статических правил и коротких команд, а не для накопления долгосрочных знаний.</p>
<p>Claude Code предлагает команды <code translate="no">resume</code> и <code translate="no">fork</code>, но они далеко не так удобны. Для команд-вилки вам нужно запоминать идентификаторы сессий, набирать команды вручную и управлять деревом ветвящихся историй разговоров. Когда вы запускаете <code translate="no">/resume</code>, вы получаете стену названий сессий. Если вы помните только несколько деталей того, что вы делали, и это было более нескольких дней назад, удачи вам в поиске нужного.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для долгосрочного, межпроектного накопления знаний такой подход невозможен.</p>
<p>Чтобы реализовать эту идею, claude-mem использует трехуровневую систему памяти. Первый уровень ищет высокоуровневые сводки. Второй уровень копается во временной шкале для получения более подробной информации. Третий уровень извлекает полные наблюдения для поиска необработанных разговоров. Кроме того, есть метки конфиденциальности, отслеживание расходов и веб-интерфейс для визуализации.</p>
<p>Вот как это работает под капотом:</p>
<ul>
<li><p><strong>Уровень выполнения.</strong> Рабочая служба Node.js работает на порту 37777. Метаданные сессии хранятся в легкой базе данных SQLite. Векторная база данных обеспечивает точный семантический поиск по содержимому памяти.</p></li>
<li><p><strong>Слой взаимодействия.</strong> Веб-интерфейс на основе React позволяет просматривать захваченные воспоминания в реальном времени: сводки, временные шкалы и необработанные записи.</p></li>
<li><p><strong>Интерфейсный уровень.</strong> Сервер MCP (Model Context Protocol) предоставляет стандартизированные интерфейсы инструментов. Клод может вызвать <code translate="no">search</code> (запрос высокоуровневых сводок), <code translate="no">timeline</code> (просмотр подробных временных шкал) и <code translate="no">get_observations</code> (получение необработанных записей взаимодействия), чтобы получить и использовать воспоминания напрямую.</p></li>
</ul>
<p>По правде говоря, это надежный продукт, который решает проблему памяти Клода Кода. Но он неуклюж и сложен в тех аспектах, которые важны в повседневной жизни.</p>
<table>
<thead>
<tr><th>Слой</th><th>Технология</th></tr>
</thead>
<tbody>
<tr><td>Язык</td><td>TypeScript (ES2022, модули ESNext)</td></tr>
<tr><td>Время выполнения</td><td>Node.js 18+</td></tr>
<tr><td>База данных</td><td>SQLite 3 с драйвером bun:sqlite</td></tr>
<tr><td>Векторное хранилище</td><td>ChromaDB (опционально, для семантического поиска)</td></tr>
<tr><td>HTTP-сервер</td><td>Express.js 4.18</td></tr>
<tr><td>В режиме реального времени</td><td>События, отправляемые сервером (SSE)</td></tr>
<tr><td>UI Framework</td><td>React + TypeScript</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Инструмент для сборки</td><td>esbuild (включает TypeScript)</td></tr>
<tr><td>Менеджер процессов</td><td>Bun</td></tr>
<tr><td>Тестирование</td><td>Встроенный в Node.js прогонщик тестов</td></tr>
</tbody>
</table>
<p><strong>Начнем с того, что установка очень тяжелая.</strong> Запуск claude-mem означает установку Node.js, Bun и среды выполнения MCP, а затем создание сервиса Worker, сервера Express, пользовательского интерфейса React, SQLite и векторного хранилища поверх всего этого. Это множество подвижных частей, которые нужно развернуть, поддерживать и отлаживать, если что-то сломалось.</p>
<p><strong>Все эти компоненты также сжигают токены, которые вы не просили тратить.</strong> Определения инструментов MCP постоянно загружаются в контекстное окно Claude, и каждый вызов инструмента съедает токены на запрос и ответ. При длительных сессиях эти накладные расходы быстро растут и могут вывести стоимость токенов из-под контроля.</p>
<p><strong>Вызов памяти ненадежен, поскольку полностью зависит от выбора Клода для поиска.</strong> Клод должен сам принимать решение о вызове таких инструментов, как <code translate="no">search</code>, чтобы вызвать поиск. Если он не понимает, что ему нужна память, соответствующий контент просто не появится. И каждый из трех уровней памяти требует своего собственного явного вызова инструмента, так что нет никакого запасного варианта, если Клод не догадается поискать.</p>
<p><strong>Наконец, хранение данных непрозрачно, что делает отладку и миграцию неприятными.</strong> Память разделена между SQLite для метаданных сессии и Chroma для бинарных векторных данных, при этом нет открытого формата, связывающего их вместе. Миграция означает написание скриптов экспорта. Чтобы узнать, что на самом деле помнит ИИ, нужно зайти в веб-интерфейс или специальный интерфейс запросов. Нет возможности просто посмотреть на необработанные данные.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Почему плагин memsearch для Claude Code лучше?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Нам нужен был действительно легкий слой памяти - без дополнительных сервисов, без запутанной архитектуры, без операционных накладных расходов. Именно это побудило нас создать <strong>cc-плагин memsearch</strong>. По сути, это был эксперимент: <em>может ли система памяти, ориентированная на кодирование, быть радикально проще?</em></p>
<p>Да, и мы это доказали.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Весь ccplugin - это четыре хука оболочки плюс фоновый процесс watch. Никакого Node.js, никакого MCP-сервера, никакого веб-интерфейса. Это просто сценарии оболочки, вызывающие memsearch CLI, что значительно снижает требования к настройке и обслуживанию.</p>
<p>Плагин ccplugin может быть таким тонким благодаря строгим границам ответственности. Он не занимается хранением памяти, поиском векторов или вставкой текста. Все это делегируется находящемуся под ним memsearch CLI. У ccplugin одна задача: передать события жизненного цикла Claude Code (начало сессии, отправка запроса, остановка ответа, конец сессии) соответствующим функциям memsearch CLI.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Такая развязка делает систему гибче, чем Claude Code. CLI memsearch работает независимо с другими IDE, другими агентскими фреймворками или даже с простым ручным вызовом. Он не привязан к какому-то одному сценарию использования.</p>
<p>На практике такая конструкция дает три ключевых преимущества.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Все воспоминания живут в простых файлах Markdown</h3><p>Каждое воспоминание, созданное плагином ccplugin, хранится на сайте <code translate="no">.memsearch/memory/</code> в виде файла в формате Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Это один файл на день. Каждый файл содержит резюме сессий этого дня в виде обычного текста, полностью читаемого человеком. Вот скриншот ежедневных файлов памяти из самого проекта memsearch:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вы сразу видите формат: временная метка, идентификатор сессии, идентификатор поворота и краткое описание сессии. Ничего не скрыто.</p>
<p>Хотите узнать, что запоминает ИИ? Откройте файл в формате Markdown. Хотите отредактировать воспоминание? Используйте свой текстовый редактор. Хотите перенести свои данные? Скопируйте папку <code translate="no">.memsearch/memory/</code>.</p>
<p>Векторный индекс <a href="https://milvus.io/">Milvus</a> - это кэш для ускорения семантического поиска. Он перестраивается из Markdown в любое время. Никаких непрозрачных баз данных, никаких двоичных черных ящиков. Все данные можно отследить и полностью восстановить.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. Автоматическая инъекция контекста требует ноль дополнительных токенов</h3><p>Прозрачное хранилище - основа этой системы. Реальная отдача зависит от того, как эти воспоминания используются, и в ccplugin вызов воспоминаний полностью автоматический.</p>
<p>Каждый раз, когда отправляется запрос, хук <code translate="no">UserPromptSubmit</code> запускает семантический поиск и вводит в контекст три самых релевантных воспоминания. Клод не решает, нужно ли искать. Он просто получает контекст.</p>
<p>Во время этого процесса Клод никогда не видит определений инструментов MCP, поэтому в окне контекста нет ничего лишнего. Хук работает на уровне CLI и вводит результаты поиска в виде обычного текста. Никаких накладных расходов на IPC, никаких затрат на маркеры вызовов инструментов. Раздувание контекстного окна, которое возникает при использовании определений инструментов MCP, полностью исключено.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для случаев, когда автоматического топ-3 недостаточно, мы также создали три уровня прогрессивного поиска. Все три уровня - это команды CLI, а не инструменты MCP.</p>
<ul>
<li><p><strong>L1 (автоматический):</strong> Каждая команда возвращает топ-3 результатов семантического поиска с <code translate="no">chunk_hash</code> и 200-символьным превью. Этого достаточно для повседневного использования.</p></li>
<li><p><strong>L2 (по требованию):</strong> Когда требуется полный контекст, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> возвращает полный текст раздела в формате Markdown плюс метаданные.</p></li>
<li><p><strong>L3 (глубокий):</strong> Если нужен оригинальный разговор, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> извлекает необработанную JSONL-запись из Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Резюме сессий генерируются в фоновом режиме с почти нулевыми затратами</h3><p>Извлечение информации - это то, как используются воспоминания. Но сначала воспоминания должны быть написаны. Как создаются все эти файлы в формате Markdown?</p>
<p>Плагин ccplugin генерирует их с помощью фонового конвейера, который работает асинхронно и почти ничего не стоит. Каждый раз, когда вы останавливаете ответ Claude, срабатывает хук <code translate="no">Stop</code>: он разбирает стенограмму разговора, вызывает Claude Haiku (<code translate="no">claude -p --model haiku</code>) для создания резюме и добавляет его в Markdown-файл текущего дня. Вызовы API Haiku очень дешевы, почти ничтожны на одно обращение.</p>
<p>После этого процесс watch обнаруживает изменение файла и автоматически индексирует новое содержимое в Milvus, чтобы его можно было сразу же найти. Весь процесс работает в фоновом режиме, не мешая вашей работе, и затраты остаются под контролем.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Быстрый запуск плагина memsearch с помощью Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Во-первых, установите плагин из маркетплейса плагинов Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Во-вторых, перезапустите Claude Code.</h3><p>Плагин автоматически инициализирует свою конфигурацию.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">В-третьих, после разговора проверьте файл памяти за день:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">В-четвертых, наслаждайтесь.</h3><p>В следующий раз, когда Claude Code запустится, система автоматически извлечет и введет соответствующие воспоминания. Никаких дополнительных действий не требуется.</p>
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
    </button></h2><p>Давайте вернемся к первоначальному вопросу: как дать ИИ постоянную память? claude-mem и memsearch ccplugin используют разные подходы, каждый из которых имеет свои преимущества. Мы составили краткое руководство по выбору между ними:</p>
<table>
<thead>
<tr><th>Категория</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Архитектура</td><td>4 shell hooks + 1 watch process</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>Метод интеграции</td><td>Нативные хуки + CLI</td><td>MCP сервер (stdio)</td></tr>
<tr><td>Вызов</td><td>Автоматический (инъекция хуков)</td><td>Управляемый агентом (требует вызова инструмента)</td></tr>
<tr><td>Потребление контекста</td><td>Нулевое (инъекция только текста результата)</td><td>Определения инструментов MCP сохраняются</td></tr>
<tr><td>Резюме сессии</td><td>Один асинхронный вызов Haiku CLI</td><td>Несколько вызовов API + сжатие наблюдений</td></tr>
<tr><td>Формат хранения</td><td>Обычные файлы в формате Markdown</td><td>SQLite + вкрапления Chroma</td></tr>
<tr><td>Миграция данных</td><td>Обычные файлы Markdown</td><td>SQLite + вкрапления Chroma</td></tr>
<tr><td>Метод миграции</td><td>Копирование файлов .md</td><td>Экспорт из базы данных</td></tr>
<tr><td>Время выполнения</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP runtime</td></tr>
</tbody>
</table>
<p>claude-mem предлагает более богатые возможности, отточенный пользовательский интерфейс и более тонкий контроль. Для команд, которым нужна совместная работа, веб-визуализация или детальное управление памятью, это отличный выбор.</p>
<p>Плагин memsearch ccplugin предлагает минимальный дизайн, нулевые накладные расходы на контекстное окно и полностью прозрачное хранение. Для инженеров, которым нужен легкий слой памяти без дополнительных сложностей, он подойдет лучше. Какой из них лучше, зависит от того, что вам нужно.</p>
<p>Хотите погрузиться глубже или получить помощь в создании memsearch или Milvus?</p>
<ul>
<li><p>Присоединяйтесь к <a href="https://milvus.io/slack">Slack-сообществу Milvus</a>, чтобы общаться с другими разработчиками и делиться тем, что вы создаете.</p></li>
<li><p>Запишитесь на наши <a href="https://milvus.io/office-hours">офисные часы Milvus, чтобы</a>получить ответы на вопросы и прямую поддержку от команды.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Ресурсы<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>Документация по cc-плагину memsearch:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>Проект memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Блог: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Мы извлекли систему памяти OpenClaw и выложили ее в открытый доступ (memsearch)</a></p></li>
<li><p>Блог: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Что такое OpenClaw? Полное руководство по агенту искусственного интеллекта с открытым исходным кодом</a></p></li>
<li><p>Блог: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Tutorial: Подключение к Slack для локального ИИ-ассистента</a></p></li>
</ul>
