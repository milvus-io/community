---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: >-
  Мы извлекли систему памяти OpenClaw и выложили ее в открытый доступ
  (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Мы извлекли архитектуру памяти ИИ OpenClaw в memsearch - отдельную библиотеку
  на Python с журналами в формате Markdown, гибридным векторным поиском и
  поддержкой Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (ранее clawdbot и moltbot) становится вирусным - <a href="https://github.com/openclaw/openclaw">189k+ звезд GitHub</a> менее чем за две недели. Это безумие. Большая часть шумихи связана с его автономными, агентскими возможностями в повседневных чатах, включая iMessages, WhatsApp, Slack, Telegram и другие.</p>
<p>Но нас, инженеров, работающих над системой векторных баз данных, привлек <strong>подход OpenClaw к долгосрочной памяти</strong>. В отличие от большинства существующих систем памяти, OpenClaw заставляет свой ИИ автоматически записывать ежедневные журналы в виде файлов в формате Markdown. Эти файлы являются источником истины, и модель "запоминает" только то, что записывается на диск. Люди-разработчики могут открывать эти файлы, редактировать их, вычленять долгосрочные принципы и видеть, что именно помнит ИИ в любой момент. Никаких черных ящиков. Честно говоря, это одна из самых чистых и удобных для разработчиков архитектур памяти, которые мы видели.</p>
<p>Естественно, у нас возник вопрос: <strong><em>почему это должно работать только в OpenClaw? Что, если бы любой агент мог иметь такую память?</em></strong> Мы взяли точную архитектуру памяти из OpenClaw и создали <a href="https://github.com/zilliztech/memsearch">memsearch</a> - автономную, подключаемую и играющую библиотеку долговременной памяти, которая дает любому агенту постоянную, прозрачную, изменяемую человеком память. Никакой зависимости от остальной части OpenClaw. Просто подключите ее, и ваш агент получит долговременную память с поиском на базе Milvus/Zilliz Cloud, а также журналы Markdown в качестве канонического источника истины.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (с открытым исходным кодом, лицензия MIT)</p></li>
<li><p><strong>Документация:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Плагин для кода Клода:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Чем отличается память OpenClaw<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем погрузиться в архитектуру памяти OpenClaw, давайте разберемся с двумя понятиями: <strong>контекст</strong> и <strong>память</strong>. Они звучат похоже, но на практике работают совершенно по-разному.</p>
<ul>
<li><p><strong>Контекст</strong> - это все, что агент видит в одном запросе: системные подсказки, файлы указаний на уровне проекта, такие как <code translate="no">AGENTS.md</code> и <code translate="no">SOUL.md</code>, история разговоров (сообщения, вызовы инструментов, сжатые резюме) и текущее сообщение пользователя. Она ограничена одной сессией и относительно компактна.</p></li>
<li><p><strong>Память</strong> - это то, что сохраняется во всех сеансах. Она хранится на локальном диске - полная история прошлых разговоров, файлы, с которыми работал агент, и предпочтения пользователя. Не обобщенная. Не сжатая. Необработанный материал.</p></li>
</ul>
<p>А вот дизайнерское решение, которое делает подход OpenClaw особенным: <strong>вся память хранится в виде обычных файлов Markdown в локальной файловой системе.</strong> После каждой сессии ИИ автоматически записывает обновления в эти журналы в формате Markdown. Вы - и любой разработчик - можете открыть их, отредактировать, реорганизовать, удалить или доработать. Тем временем векторная база данных работает рядом с этой системой, создавая и поддерживая индекс для поиска. Когда файл Markdown изменяется, система обнаруживает это изменение и автоматически переиндексирует его.</p>
<p>Если вы пользовались такими инструментами, как Mem0 или Zep, вы сразу заметите разницу. Эти системы хранят воспоминания в виде вкраплений - это единственная копия. Вы не можете прочитать то, что помнит ваш агент. Вы не можете исправить плохое воспоминание, отредактировав строку. Подход OpenClaw дает вам и то, и другое: прозрачность обычных файлов <strong>и</strong> поисковую мощь векторного поиска по векторной базе данных. Вы можете читать, <code translate="no">git diff</code>, grep - это просто файлы.</p>
<p>Единственный минус? Сейчас эта система памяти, ориентированная на Markdown, тесно переплетена со всей экосистемой OpenClaw - процессом шлюза, коннекторами платформы, конфигурацией рабочего пространства и инфраструктурой обмена сообщениями. Если вам нужна только модель памяти, то это очень много механизмов.</p>
<p>Именно поэтому мы создали <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: та же философия - маркдаун как источник истины, автоматическая векторная индексация, полностью редактируемая человеком - но в виде легкой автономной библиотеки, которую можно внедрить в любую агентную архитектуру.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Как работает Memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Как уже говорилось, <a href="https://github.com/zilliztech/memsearch">memsearch</a> - это полностью независимая библиотека долговременной памяти, которая реализует ту же архитектуру памяти, что и OpenClaw, без использования остального стека OpenClaw. Вы можете подключить ее к любому агентскому фреймворку (Claude, GPT, Llama, пользовательские агенты, движки рабочих процессов) и мгновенно предоставить вашей системе постоянную, прозрачную, доступную для человека память.</p>
<p>Вся память агентов в memsearch хранится в виде обычного текста в формате Markdown в локальной директории. Структура намеренно проста, чтобы разработчики могли понять ее с первого взгляда:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch использует <a href="https://milvus.io/"><strong>Milvus</strong></a> в качестве векторной базы данных для индексации этих Markdown-файлов для быстрого семантического поиска. Но очень важно, что векторный индекс <em>не</em> является источником истины - им являются файлы. Если вы полностью удалите индекс Milvus, <strong>вы ничего не потеряете.</strong> Memsearch просто заново соберет и заново проиндексирует файлы Markdown, восстановив весь слой поиска за несколько минут. Это означает, что память вашего агента прозрачна, долговечна и полностью восстанавливаема.</p>
<p>Вот основные возможности memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Читаемый уцененный текст делает отладку такой же простой, как редактирование файла</h3><p>Отладка памяти ИИ обычно очень болезненна. Когда агент выдает неправильный ответ, большинство систем памяти не дают вам четкого способа увидеть <em>, что</em> он на самом деле хранил. Типичный рабочий процесс - написание пользовательского кода для запроса API памяти, а затем просеивание непрозрачных вкраплений или многословных JSON-блобов - ни то, ни другое не говорит вам много о реальном внутреннем состоянии ИИ.</p>
<p><strong>memsearch устраняет весь этот класс проблем.</strong> Вся память хранится в папке memory/ в виде обычного Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Если ИИ что-то напутает, исправить это будет просто - достаточно отредактировать файл. Обновите запись, сохраните, и memsearch автоматически переиндексирует изменения. Пять секунд. Никаких вызовов API. Никаких инструментов. Никаких загадок. Вы отлаживаете память ИИ так же, как отлаживаете документацию - редактируя файл.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Память с поддержкой Git позволяет командам отслеживать, просматривать и откатывать изменения.</h3><p>Над памятью ИИ, хранящейся в базе данных, сложно работать совместно. Чтобы выяснить, кто и когда что изменил, приходится копаться в журналах аудита, а многие решения их даже не предоставляют. Изменения происходят молча, и разногласия по поводу того, что должен запомнить ИИ, не имеют четкого пути разрешения. В итоге команды полагаются на сообщения в Slack и предположения.</p>
<p>Memsearch решает эту проблему, делая память просто файлами в формате Markdown - а значит, <strong>Git автоматически обрабатывает версионность</strong>. Одна команда показывает всю историю:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Теперь память ИИ участвует в том же рабочем процессе, что и код. Архитектурные решения, обновления конфигурации и изменения предпочтений - все это отображается в диффах, которые каждый может прокомментировать, одобрить или изменить:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">Plaintext Memory делает миграцию почти без усилий</h3><p>Миграция - одна из самых больших скрытых издержек фреймворков с памятью. Переход от одного инструмента к другому обычно означает экспорт данных, преобразование форматов, повторный импорт и надежду на совместимость полей. Такая работа может легко съесть полдня, а результат никогда не гарантирован.</p>
<p>memsearch полностью избавляет от этой проблемы, потому что память - это простой текст Markdown. Нет ни проприетарного формата, ни схемы для перевода, ничего для миграции:</p>
<ul>
<li><p><strong>Переключитесь на другую машину:</strong> <code translate="no">rsync</code> папку памяти. Выполнено.</p></li>
<li><p><strong>Переключите модели встраивания:</strong> Повторно выполните команду index. Это займет пять минут, а файлы markdown останутся нетронутыми.</p></li>
<li><p><strong>Переключите развертывание векторной базы данных:</strong> Измените одно значение конфигурации. Например, перейдите с Milvus Lite в разработке на Zilliz Cloud в производстве:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ваши файлы памяти останутся прежними. Инфраструктура вокруг них может свободно развиваться. В результате вы получаете долгосрочную переносимость - редкое свойство для систем ИИ.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Общие файлы Markdown позволяют людям и агентам совместно создавать память</h3><p>В большинстве решений для работы с памятью редактирование того, что ИИ запоминает, требует написания кода для API. Это означает, что поддерживать память ИИ могут только разработчики, и даже для них это очень сложно.</p>
<p>Memsearch позволяет более естественно разделить ответственность:</p>
<ul>
<li><p><strong>ИИ обрабатывает:</strong> Автоматические ежедневные журналы (<code translate="no">YYYY-MM-DD.md</code>) с деталями выполнения, например "развернута версия 2.3.1, производительность повышена на 12 %".</p></li>
<li><p><strong>Люди занимаются:</strong> Долгосрочные принципы в <code translate="no">MEMORY.md</code>, например "стек команды: Python + FastAPI + PostgreSQL".</p></li>
</ul>
<p>Обе стороны редактируют одни и те же файлы в формате Markdown с помощью инструментов, которые они уже используют. Никаких вызовов API, никаких специальных инструментов, никаких привратников. Когда память заперта в базе данных, такое совместное авторство невозможно. memsearch делает это по умолчанию.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Под капотом: memsearch работает на основе четырех рабочих процессов, которые обеспечивают быстрое, свежее и бережное использование памяти<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В memsearch есть четыре основных рабочих процесса: <strong>Наблюдение</strong> (мониторинг) → <strong>Индексирование</strong> (разбивка на куски и встраивание) → <strong>Поиск</strong> (извлечение) → <strong>Компактность</strong> (обобщение). Вот что делает каждый из них.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Следить: Автоматическое повторное индексирование при каждом сохранении файла</h3><p>Рабочий процесс <strong>Watch</strong> отслеживает все файлы Markdown в памяти/каталоге и запускает переиндексацию при каждом изменении и сохранении файла. <strong>Задержка в 1500 мс</strong> обеспечивает обнаружение обновлений без лишних вычислений: если несколько сохранений происходят быстро, таймер сбрасывается и срабатывает только тогда, когда правки стабилизируются.</p>
<p>Эта задержка настраивается эмпирически:</p>
<ul>
<li><p><strong>100 мс</strong> → слишком чувствительно; срабатывает при каждом нажатии клавиши, сжигая вызовы встраивания.</p></li>
<li><p><strong>10 с</strong> → слишком медленно; разработчики замечают отставание</p></li>
<li><p><strong>1500 мс</strong> → идеальный баланс отзывчивости и эффективности использования ресурсов.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На практике это означает, что разработчик может писать код в одном окне и редактировать <code translate="no">MEMORY.md</code> в другом, добавляя URL API-документации или исправляя устаревшую запись. Сохраните файл, и следующий запрос AI подхватит новую память. Никакого перезапуска, никакого ручного переиндексирования.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Индекс: Интеллектуальное разбиение на части, дедупликация и встраивание с учетом версий</h3><p>Index - это критически важный рабочий процесс. Он обрабатывает три вещи: <strong>разбиение на части, дедупликацию и версионные идентификаторы фрагментов.</strong></p>
<p><strong>Чанкинг</strong> разделяет текст по семантическим границам - заголовкам и их частям, - чтобы связанный контент оставался вместе. Это позволяет избежать случаев, когда фраза вроде "конфигурация Redis" разбивается на куски.</p>
<p>Например, этот текст в формате Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Становится двумя кусками:</p>
<ul>
<li><p>Чанк 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Чанк 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>Дедупликация</strong> использует хэш SHA-256 каждого куска, чтобы избежать встраивания одного и того же текста дважды. Если в нескольких файлах упоминается "PostgreSQL 16", API встраивания вызывается один раз, а не по одному разу на файл. Для ~500 КБ текста это экономит около <strong>$0,15 в месяц.</strong> При масштабировании это выливается в сотни долларов.</p>
<p><strong>Идентификатор чанка</strong> кодирует все, что необходимо для определения того, является ли чанк несвежим. Формат - <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. Поле <code translate="no">model_version</code> - важная часть: когда модель встраивания обновляется с <code translate="no">text-embedding-3-small</code> до <code translate="no">text-embedding-3-large</code>, старые встраивания становятся недействительными. Поскольку версия модели заложена в идентификатор, система автоматически определяет, какие фрагменты нуждаются в повторном встраивании. Ручная очистка не требуется.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Поиск: Гибридный векторный + BM25-поиск для максимальной точности</h3><p>Для поиска используется гибридный подход: векторный поиск, взвешенный на 70 %, и поиск по ключевым словам BM25, взвешенный на 30 %. Это позволяет сбалансировать две различные потребности, которые часто возникают на практике.</p>
<ul>
<li><p><strong>Векторный поиск</strong> обеспечивает семантическое соответствие. Запрос "Redis cache config" возвращает чанк, содержащий "Redis L1 cache with 5min TTL", даже если формулировки отличаются. Это полезно, когда разработчик помнит концепцию, но не помнит точную формулировку.</p></li>
<li><p><strong>BM25</strong> обрабатывает точное соответствие. Запрос "PostgreSQL 16" не возвращает результатов о "PostgreSQL 15". Это важно для кодов ошибок, имен функций и поведения, специфичного для конкретной версии, где близкое соответствие недостаточно.</p></li>
</ul>
<p>Разделение по умолчанию 70/30 хорошо подходит для большинства случаев использования. Для рабочих процессов, которые в значительной степени склоняются к точным совпадениям, увеличение веса BM25 до 50% - это однострочное изменение конфигурации.</p>
<p>Результаты возвращаются в виде фрагментов top-K (по умолчанию 3), каждый из которых усечен до 200 символов. Когда требуется полное содержимое, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> загружает его. Такое постепенное раскрытие позволяет сократить использование контекстного окна LLM, не жертвуя доступом к деталям.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Компактность: Суммирование исторической памяти для поддержания чистоты контекста</h3><p>Накопленная память со временем становится проблемой. Старые записи заполняют контекстное окно, увеличивают стоимость маркера и добавляют шум, ухудшающий качество ответа. Compact решает эту проблему, вызывая LLM для обобщения исторической памяти в сжатом виде, а затем удаляя или архивируя оригиналы. Его можно запустить вручную или запланировать на регулярный интервал.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Как начать работу с memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch предоставляет как <strong>Python API</strong>, так и <strong>CLI</strong>, поэтому вы можете использовать его внутри агентских фреймворков или как отдельный инструмент отладки. Настройка минимальна, а система спроектирована таким образом, что ваша локальная среда разработки и производственное развертывание выглядят практически идентично.</p>
<p>Memsearch поддерживает три Milvus-совместимых бэкенда, все они открываются через один и тот же <strong>API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (по умолчанию)</strong></a><strong>:</strong> Локальный файл <code translate="no">.db</code>, нулевая конфигурация, подходит для индивидуального использования.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Самостоятельное размещение, поддержка нескольких агентов, совместно использующих данные, подходит для командной работы.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Полностью управляемое, с автоматическим масштабированием, резервным копированием, высокой доступностью и изоляцией. Идеально подходит для производственных рабочих нагрузок.</p></li>
</ul>
<p>Переход от локальной разработки к производству обычно сводится <strong>к изменению конфигурации в одну строку</strong>. Ваш код остается неизменным.</p>
<h3 id="Install" class="common-anchor-header">Установите</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch также поддерживает множество провайдеров встраивания, включая OpenAI, Google, Voyage, Ollama и локальные модели. Благодаря этому архитектура памяти остается переносимой и не зависит от производителя.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Вариант 1: Python API (интегрированный в ваш агентский фреймворк)</h3><p>Здесь приведен минимальный пример полного цикла агента, использующего memsearch. Вы можете копировать/вставлять и изменять его по мере необходимости:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Здесь показан основной цикл:</p>
<ul>
<li><p><strong>Вспомните</strong>: memsearch выполняет гибридный векторный + BM25-поиск.</p></li>
<li><p><strong>Думайте</strong>: ваш LLM обрабатывает пользовательский ввод + извлеченную память</p></li>
<li><p><strong>Помните</strong>: агент записывает новую память в Markdown, а memsearch обновляет свой индекс.</p></li>
</ul>
<p>Этот паттерн естественно вписывается в любую агентскую систему - LangChain, AutoGPT, семантические маршрутизаторы, LangGraph или пользовательские агентские циклы. По своему дизайну он не зависит от фреймворка.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Вариант 2: CLI (быстрые операции, хорошо подходит для отладки)</h3><p>CLI идеально подходит для автономных рабочих процессов, быстрых проверок или проверки памяти во время разработки:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLI повторяет возможности Python API, но работает без написания кода - отлично подходит для отладки, проверок, миграций или проверки структуры папок памяти.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Сравнение memsearch с другими решениями для работы с памятью<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>Самый распространенный вопрос, который задают разработчики, - зачем использовать memsearch, если уже существуют готовые варианты. Короткий ответ: memsearch обменивает расширенные возможности, такие как временные графы знаний, на прозрачность, переносимость и простоту. Для большинства случаев использования памяти агента это правильный компромисс.</p>
<table>
<thead>
<tr><th>Решение</th><th>Сильные стороны</th><th>Ограничения</th><th>Лучшее для</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Прозрачная память в виде открытого текста, соавторство человека и ИИ, нулевое трение при миграции, легкая отладка, Git-native</td><td>Нет встроенных временных графов или сложных мультиагентных структур памяти</td><td>Команды, которые ценят контроль, простоту и переносимость в долговременной памяти</td></tr>
<tr><td>Mem0</td><td>Полностью управляемый, нет инфраструктуры для запуска или обслуживания</td><td>Непрозрачная - нельзя проверять или вручную редактировать память; единственным представлением являются вкрапления</td><td>Команды, которые хотят получить управляемый сервис без рук и не против меньшей видимости.</td></tr>
<tr><td>Zep</td><td>Богатый набор функций: временная память, моделирование нескольких персон, сложные графы знаний</td><td>Тяжелая архитектура; больше движущихся частей; сложнее в освоении и эксплуатации</td><td>Агенты, которым действительно нужны расширенные структуры памяти или рассуждения с учетом времени</td></tr>
<tr><td>LangMem / Letta</td><td>Глубокая, бесшовная интеграция в их собственные экосистемы</td><td>Замкнутость фреймворка; трудно перенести на другие стеки агентов</td><td>Команды уже привержены этим конкретным фреймворкам</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">Начните использовать memsearch и присоединяйтесь к проекту<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch имеет полностью открытый исходный код под лицензией MIT, и репозиторий готов к производственным экспериментам уже сегодня.</p>
<ul>
<li><p><strong>Репозиторий:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Документация:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Если вы создаете агента, которому нужно запоминать что-то в течение нескольких сессий, и хотите получить полный контроль над тем, что он запоминает, memsearch стоит посмотреть. Библиотека устанавливается с помощью одного <code translate="no">pip install</code>, работает с любым фреймворком агента и хранит все в формате Markdown, который можно читать, редактировать и верстать с помощью Git.</p>
<p>Мы активно развиваем memsearch и будем рады участию сообщества.</p>
<ul>
<li><p>Откройте проблему, если что-то сломалось.</p></li>
<li><p>Отправьте PR, если хотите расширить библиотеку.</p></li>
<li><p>Ставьте звезду в репо, если философия Markdown-as-source-of-truth находит в вас отклик.</p></li>
</ul>
<p>Система памяти OpenClaw больше не заперта внутри OpenClaw. Теперь ее может использовать любой желающий.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Продолжить чтение<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Что такое OpenClaw? Полное руководство по ИИ-агенту с открытым исходным кодом</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Учебник по OpenClaw: Подключение к Slack для локального ИИ-ассистента</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Создание ИИ-агентов в стиле Clawdbot с помощью LangGraph и Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG против долгоиграющих агентов: Устарел ли RAG?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Создание пользовательского антропного навыка для Milvus, чтобы быстро раскрутить RAG</a></p></li>
</ul>
