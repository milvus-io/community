---
id: claude-code-memory-memsearch.md
title: >-
  Мы прочитали утечку исходного текста Claude Code. Вот как на самом деле
  работает его память
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Утечка исходного кода Claude Code раскрывает 4-слойную память, ограниченную
  200 строками, с поиском только по grep. Вот как работает каждый слой и что
  исправляет memsearch.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Исходный код Claude Code был выложен в открытый доступ случайно. Версия 2.1.88 включала файл карты исходного кода размером 59,8 МБ, который следовало удалить из сборки. Этот единственный файл содержал полную, читаемую кодовую базу TypeScript - 512 000 строк, которые теперь зеркально отображаются на GitHub.</p>
<p>Наше внимание привлекла <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">система памяти</a>. Claude Code - самый популярный на рынке ИИ-кодировщик, а память - это та часть, с которой взаимодействует большинство пользователей, не понимая, как она работает под капотом. Поэтому мы покопались в ней.</p>
<p>Краткая версия: Память Claude Code более простая, чем вы думаете. Она ограничивается 200 строками заметок. Она может найти воспоминания только по точному совпадению ключевых слов - если вы спрашиваете о "конфликтах портов", а в заметке говорится о "маппинге docker-compose", вы ничего не получите. И ничего из этого не покидает Claude Code. Переключившись на другого агента, вы начинаете с нуля.</p>
<p>Вот четыре слоя:</p>
<ul>
<li><strong>CLAUDE.md</strong> - файл, который вы пишете сами, с правилами, которым должен следовать Клод. Ручной, статичный и ограниченный тем, сколько вы думаете записать заранее.</li>
<li><strong>Автопамять</strong> - Клод делает собственные заметки во время сессий. Полезно, но ограничено индексом в 200 строк без возможности поиска по смыслу.</li>
<li><strong>Auto Dream</strong> - фоновый процесс очистки, который консолидирует беспорядочные воспоминания, пока вы бездействуете. Помогает справиться с беспорядком, накопившимся за несколько дней, но не может работать с месяцами.</li>
<li><strong>KAIROS</strong> - неизданный режим постоянно включенного демона, найденный в утечке кода. Пока не представлен ни в одной публичной сборке.</li>
</ul>
<p>Ниже мы распакуем каждый слой, а затем расскажем, где архитектура ломается и что мы создали для устранения пробелов.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Как работает CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md - это файл в формате Markdown, который вы создаете и помещаете в папку с проектом. Вы заполняете его тем, что хотите, чтобы Клод запомнил: правила стиля кода, структуру проекта, команды тестирования, шаги развертывания. Клод загружает его в начале каждой сессии.</p>
<p>Существует три диапазона: уровень проекта (в корне репозитория), персональный (<code translate="no">~/.claude/CLAUDE.md</code>) и организационный (корпоративный конфиг). Более короткие файлы отслеживаются надежнее.</p>
<p>Ограничение очевидно: CLAUDE.md хранит только то, что вы записали заранее. Решения по отладке, предпочтения, о которых вы упомянули в середине разговора, крайние случаи, которые вы обнаружили вместе - ничего из этого не будет записано, если вы не остановитесь и не добавите это вручную. Большинство людей этого не делают.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Как работает автопамять?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Автопамять фиксирует то, что всплывает во время работы. Клод решает, что стоит сохранить, и записывает это в папку памяти на вашем компьютере, организованную по четырем категориям: пользователь (роль и предпочтения), обратная связь (ваши исправления), проект (решения и контекст) и ссылка (место, где все живет).</p>
<p>Каждая заметка - это отдельный Markdown-файл. Точкой входа является <code translate="no">MEMORY.md</code> - индекс, в котором каждая строка представляет собой короткую метку (менее 150 символов), указывающую на подробный файл. Клод читает индекс, а затем извлекает конкретные файлы, когда они кажутся подходящими.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>Первые 200 строк MEMORY.md загружаются в каждую сессию. Все, что дальше, остается невидимым.</p>
<p>Один из умных дизайнерских решений: утечка системной подсказки говорит Клоду, что он должен рассматривать свою собственную память как подсказку, а не как факт. Он сверяется с реальным кодом, прежде чем действовать в соответствии с тем, что запомнил, что помогает уменьшить количество галлюцинаций - шаблон, который начинают перенимать другие <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">платформы для ИИ-агентов</a>.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Как Auto Dream консолидирует застоявшиеся воспоминания?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Автопамять фиксирует заметки, но после нескольких недель использования эти заметки устаревают. Запись "вчерашняя ошибка развертывания" теряет смысл через неделю. В одной заметке говорится, что вы используете PostgreSQL, а в другой - что вы перешли на MySQL. В удаленных файлах все еще есть записи о памяти. Индекс наполняется противоречиями и устаревшими ссылками.</p>
<p>Auto Dream - это процесс очистки. Он выполняется в фоновом режиме и:</p>
<ul>
<li>Заменяет расплывчатые временные ссылки на точные даты. "Вчерашняя проблема развертывания" → "2026-03-28 проблема развертывания".</li>
<li>Устраняет противоречия. PostgreSQL note + MySQL note → сохраняет текущую истину.</li>
<li>Удаляет устаревшие записи. Заметки, ссылающиеся на удаленные файлы или завершенные задачи, удаляются.</li>
<li>Сохраняет <code translate="no">MEMORY.md</code> менее 200 строк.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Условия срабатывания:</strong> с момента последней очистки прошло более 24 часов И накопилось не менее 5 новых сессий. Вы также можете набрать "dream", чтобы запустить его вручную. Процесс запускается в фоновом суб-агенте - как и настоящий сон, он не прерывает вашу активную работу.</p>
<p>Системная подсказка агента сновидений начинается со слов: <em>"Вы выполняете сновидение - рефлексивный проход по файлам вашей памяти".</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">Что такое KAIROS? Невыпущенный постоянный режим Клода Кода<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>Первые три уровня уже существуют или распространяются. Утечка кода также содержит кое-что, что еще не отправлено: KAIROS.</p>
<p>KAIROS, названный в честь греческого слова, означающего "нужный момент", встречается в исходниках более 150 раз. Он превращает Claude Code из инструмента, который вы активно используете, в фонового помощника, который постоянно следит за вашим проектом.</p>
<p>Судя по утечке кода, KAIROS:</p>
<ul>
<li>Ведет журнал наблюдений, решений и действий в течение дня.</li>
<li>Проверяет работу по таймеру. Через регулярные промежутки времени он получает сигнал и решает: действовать или молчать.</li>
<li>Не лезет на рожон. Любое действие, которое заблокирует вас более чем на 15 секунд, откладывается.</li>
<li>Выполняет внутреннюю очистку снов, а также полный цикл "наблюдать-думать-действовать" в фоновом режиме.</li>
<li>Имеет эксклюзивные инструменты, которых нет у обычного Claude Code: пересылка файлов вам, отправка уведомлений, мониторинг ваших запросов на GitHub.</li>
</ul>
<p>KAIROS находится под флагом компиляции. Его нет ни в одной публичной сборке. Считайте, что Anthropic исследует, что произойдет, когда <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">память агента</a> перестанет быть сессионной и станет постоянной.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Где архитектура памяти Клода Кода дает сбои?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Память Клода Кода выполняет реальную работу. Но пять структурных ограничений ограничивают ее возможности по мере роста проектов.</p>
<table>
<thead>
<tr><th>Ограничение</th><th>Что происходит</th></tr>
</thead>
<tbody>
<tr><td><strong>Шапка индекса на 200 строк</strong></td><td><code translate="no">MEMORY.md</code> вмещает ~25 КБ. Запустите проект на несколько месяцев, и старые записи будут вытеснены новыми. "На какой конфигурации Redis мы остановились на прошлой неделе?" - исчезла.</td></tr>
<tr><td><strong>Поиск только с помощью Grep</strong></td><td>Поиск в памяти использует буквальное <a href="https://milvus.io/docs/full-text-search.md">соответствие ключевых слов</a>. Вы помните "конфликты портов во время развертывания", но в заметке говорится о "сопоставлении портов в docker-compose". Grep не может преодолеть этот пробел.</td></tr>
<tr><td><strong>Только резюме, без рассуждений</strong></td><td>Автопамять сохраняет заметки высокого уровня, а не шаги по отладке или рассуждения, которые привели вас к этому. Информация о том <em>, как</em> это сделать, теряется.</td></tr>
<tr><td><strong>Сложность накапливается без исправления фундамента</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Каждый слой существует потому, что предыдущий был недостаточен. Но никакие наслоения не меняют того, что находится под ними: один инструмент, локальные файлы, захват сессии за сессией.</td></tr>
<tr><td><strong>Память заперта в коде Клода</strong></td><td>Переключившись на OpenCode, Codex CLI или любой другой агент, вы начинаете с нуля. Нет экспорта, нет общего формата, нет переносимости.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Это не баги. Это естественные ограничения архитектуры с одним инструментом и локальными файлами. Каждый месяц появляются новые агенты, меняются рабочие процессы, но знания, накопленные вами в проекте, не должны исчезать вместе с ними. Именно поэтому мы создали <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">Что такое memsearch? Постоянная память для любого агента кодирования ИИ<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> извлекает память из агента и помещает ее в свой собственный слой. Агенты приходят и уходят. Память остается.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Как установить memsearch</h3><p>Пользователи Claude Code устанавливают memsearch из маркета:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Готово. Конфигурация не требуется.</p>
<p>На других платформах все так же просто. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. Python API через uv или pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">Что перехватывает memsearch?</h3><p>После установки memsearch подключается к жизненному циклу агента. Каждый разговор обобщается и индексируется автоматически. Когда вы задаете вопрос, для которого нужна история, запоминание срабатывает само по себе.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Файлы памяти хранятся в виде датированного Markdown - один файл в день:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Вы можете открывать, читать и редактировать файлы памяти в любом текстовом редакторе. Если вы хотите мигрировать, вы копируете папку. Если вам нужен контроль версий, git работает как родной.</p>
<p><a href="https://milvus.io/docs/index-explained.md">Векторный индекс</a>, хранящийся в <a href="https://milvus.io/docs/overview.md">Milvus</a>, является кэш-слоем - если он когда-нибудь будет потерян, вы восстановите его из файлов Markdown. Ваши данные живут в файлах, а не в индексе.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Как memsearch находит воспоминания? Семантический поиск против Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Для поиска воспоминаний Клод Код использует grep - буквальный подбор ключевых слов. Это работает, когда у вас есть несколько десятков заметок, но после нескольких месяцев истории, когда вы не можете вспомнить точную формулировку, он ломается.</p>
<p>Вместо этого memsearch использует <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">гибридный поиск</a>. <a href="https://zilliz.com/glossary/semantic-search">Семантические векторы</a> находят контент, связанный с вашим запросом, даже если формулировки отличаются, в то время как BM25 подбирает точные ключевые слова. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> объединяет и ранжирует оба набора результатов вместе.</p>
<p>Скажем, вы спрашиваете: "Как мы исправили тайм-аут Redis на прошлой неделе?". - Семантический поиск понимает намерение и находит его. Скажем, вы спрашиваете &quot;search for <code translate="no">handleTimeout</code>&quot; - BM25 находит точное название функции. Эти два пути покрывают слепые зоны друг друга.</p>
<p>Когда срабатывает вызов, субагент выполняет поиск в три этапа, углубляясь только при необходимости:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Семантический поиск - короткие предварительные просмотры</h3><p>Субагент выполняет <code translate="no">memsearch search</code> по индексу Milvus и извлекает наиболее релевантные результаты:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Каждый результат показывает оценку релевантности, исходный файл и превью длиной 200 символов. Большинство запросов на этом останавливается.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Полный контекст - расширение конкретного результата</h3><p>Если предварительного просмотра L1 недостаточно, субагент запускает <code translate="no">memsearch expand a3f8c1</code>, чтобы получить полную запись:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Raw Conversation Transcript</h3><p>В редких случаях, когда вам нужно увидеть, что именно было сказано, субагент извлекает исходную запись разговора:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>В стенограмме сохраняется все: ваши точные слова, точный ответ агента и каждый вызов инструмента. Три этапа идут от легкого к тяжелому - субагент решает, как глубоко копнуть, а затем возвращает упорядоченные результаты в вашу основную сессию.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Как memsearch распределяет память между агентами кодирования ИИ?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Это наиболее фундаментальное различие между memsearch и памятью Claude Code.</p>
<p>Память Claude Code заперта в одном инструменте. Используйте OpenCode, OpenClaw или Codex CLI, и вы начнете с нуля. MEMORY.md является локальным, привязанным к одному пользователю и одному агенту.</p>
<p>memsearch поддерживает четыре агента кодирования: Claude Code, OpenClaw, OpenCode и Codex CLI. Они используют один и тот же формат памяти Markdown и одну и ту же <a href="https://milvus.io/docs/manage-collections.md">коллекцию Milvus</a>. Воспоминания, написанные в любом агенте, доступны для поиска в любом другом агенте.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Два реальных сценария:</strong></p>
<p><strong>Переключение инструментов.</strong> Вы провели полдня в Claude Code, разбираясь с конвейером развертывания, и столкнулись с несколькими проблемами. Разговоры автоматически обобщаются и индексируются. На следующий день вы переходите на OpenCode и спрашиваете: "Как мы вчера разрешили конфликт портов?". OpenCode выполняет поиск в memsearch, находит вчерашние воспоминания Claude Code и дает вам правильный ответ.</p>
<p><strong>Командная работа.</strong> Направьте бэкенд Milvus в <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>, и несколько разработчиков на разных машинах, используя разные агенты, читают и записывают память одного и того же проекта. Новому члену команды не нужно копаться в месяцах Slack и документации - агент уже знает.</p>
<h2 id="Developer-API" class="common-anchor-header">API для разработчиков<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы создаете собственный <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">инструментарий для агентов</a>, memsearch предоставляет CLI и Python API.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Под капотом Milvus управляет векторным поиском. Работайте локально с <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (нулевая конфигурация), сотрудничайте через <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (доступен бесплатный уровень) или самостоятельно размещайтесь в Docker. По умолчанию используются <a href="https://milvus.io/docs/embeddings.md">вкрапления</a> ONNX - работает на CPU, GPU не требуется. В любой момент можно заменить на OpenAI или Ollama.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory против memsearch: Полное сравнение<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Характеристика</th><th>Память кода Клода</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Что сохраняется</td><td>Что Клод считает важным</td><td>Каждый разговор с автоматическим подведением итогов</td></tr>
<tr><td>Ограничение на хранение</td><td>~200-строчный индекс (~25 КБ)</td><td>Неограниченно (ежедневные файлы + векторный индекс)</td></tr>
<tr><td>Поиск старых воспоминаний</td><td>Поиск по ключевым словам с помощью Grep</td><td>Гибридный поиск по смыслу + ключевым словам (Milvus)</td></tr>
<tr><td>Можете ли вы их прочитать?</td><td>Проверьте папку с воспоминаниями вручную</td><td>Откройте любой файл .md</td></tr>
<tr><td>Можете ли вы их редактировать?</td><td>Редактируйте файлы вручную</td><td>То же самое - автоматическая переиндексация при сохранении</td></tr>
<tr><td>Контроль версий</td><td>Не предназначен для этого</td><td>git работает как родной</td></tr>
<tr><td>Поддержка кросс-инструментов</td><td>Только код Клода</td><td>4 агента, общая память</td></tr>
<tr><td>Долговременное запоминание</td><td>Деградирует через несколько недель</td><td>Сохраняется в течение нескольких месяцев</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Начните работу с memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>У памяти Клода Кода есть реальные сильные стороны - самоскептический дизайн, концепция консолидации сновидений и 15-секундный бюджет на блокировку в KAIROS. Anthropic усиленно думает над этой проблемой.</p>
<p>Но у памяти одного инструмента есть потолок. Если ваш рабочий процесс охватывает несколько агентов, несколько человек или более нескольких недель истории, вам нужна память, которая существует сама по себе.</p>
<ul>
<li>Попробуйте <a href="https://github.com/zilliztech/memsearch">memsearch</a> - с открытым исходным кодом и лицензией MIT. Устанавливается в Claude Code двумя командами.</li>
<li>Прочитайте <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">, как работает memsearch под капотом</a>, или в <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">руководстве по плагину для Claude Code</a>.</li>
<li>Есть вопросы? Присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX">сообществу Milvus Discord</a> или <a href="https://milvus.io/office-hours">запишитесь на бесплатную сессию Office Hours</a>, чтобы разобрать ваш случай использования.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Как работает система памяти Claude Code под капотом?</h3><p>Claude Code использует четырехслойную архитектуру памяти, которая хранится в виде локальных файлов Markdown. CLAUDE.md - это статический файл правил, который вы пишете вручную. Auto Memory позволяет Claude сохранять собственные заметки во время сессий, организованные в четыре категории - пользовательские предпочтения, обратная связь, контекст проекта и справочные указатели. Auto Dream консолидирует устаревшие воспоминания в фоновом режиме. KAIROS - это невыпущенный демон постоянной работы, найденный в утечке исходного кода. Вся система ограничена индексом в 200 строк, а поиск возможен только по точному подбору ключевых слов - никакого семантического поиска или запоминания по смыслу.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Могут ли агенты кодирования ИИ совместно использовать память в разных инструментах?</h3><p>Нет. Память Claude Code привязана к Claude Code - нет ни формата экспорта, ни межагентского протокола. Если вы перейдете на OpenCode, Codex CLI или OpenClaw, вы начнете с нуля. memsearch решает эту проблему, храня воспоминания в виде датированных файлов Markdown, проиндексированных в <a href="https://zilliz.com/learn/what-is-vector-database">векторной базе данных</a> (Milvus). Все четыре поддерживаемых агента читают и записывают одно и то же хранилище памяти, поэтому контекст автоматически переносится при переключении инструментов.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">В чем разница между поиском по ключевым словам и семантическим поиском в памяти агента?</h3><p>Поиск по ключевым словам (grep) соответствует точным строкам - если в памяти написано "docker-compose port mapping", но вы ищете "port conflicts", он ничего не вернет. Семантический поиск преобразует текст в <a href="https://zilliz.com/glossary/vector-embeddings">векторные вкрапления</a>, которые передают смысл, поэтому связанные понятия совпадают даже при разных формулировках. memsearch сочетает оба подхода в гибридном поиске, обеспечивая запоминание по смыслу и точное соответствие ключевым словам в одном запросе.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Что стало известным в результате инцидента с исходным кодом Claude Code?</h3><p>Версия 2.1.88 Claude Code поставлялась с файлом карты исходного кода размером 59,8 МБ, который должен был быть удален из производственной сборки. Файл содержал полную, читаемую кодовую базу TypeScript - примерно 512 000 строк - включая полную реализацию системы памяти, процесс консолидации Auto Dream и ссылки на KAIROS, невыпущенный режим постоянно включенного агента. Код был быстро зеркалирован на GitHub, прежде чем его успели удалить.</p>
