---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Почему Clawdbot стал вирусным - и как создать готовые к производству долго
  работающие агенты с помощью LangGraph и Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot доказал, что людям нужен действующий ИИ. Узнайте, как создавать
  готовые к производству долгоиграющие агенты с помощью двухагентной
  архитектуры, Milvus и LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (теперь OpenClaw) стал вирусным<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, теперь переименованный в OpenClaw, на прошлой неделе захватил интернет. ИИ-ассистент с открытым исходным кодом, созданный Питером Стейнбергером, набрал <a href="https://github.com/openclaw/openclaw">110 000+ звезд на GitHub</a> всего за несколько дней. Пользователи публиковали видео, на которых он автономно регистрирует их на рейсы, управляет электронной почтой и контролирует устройства "умного дома". Андрей Карпати, инженер-основатель OpenAI, похвалил его. Дэвид Сакс, основатель и инвестор Tech, написал о нем в Твиттере. Люди называли его "Джарвис, но настоящий".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Затем последовали предупреждения о безопасности.</p>
<p>Исследователи обнаружили сотни открытых панелей администратора. По умолчанию бот работает с root-доступом. Песочница отсутствует. Уязвимости в инъекциях могут позволить злоумышленникам захватить агента. Кошмар безопасности.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot стал вирусным не просто так.<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot стал вирусным не просто так.</strong> Он работает локально или на вашем собственном сервере. Он подключается к приложениям для обмена сообщениями, которые люди уже используют - WhatsApp, Slack, Telegram, iMessage. Он запоминает контекст на протяжении долгого времени, вместо того чтобы забывать все после каждого ответа. Он управляет календарями, обобщает электронные письма и автоматизирует задачи в разных приложениях.</p>
<p>У пользователей создается ощущение, что это персональный ИИ, не требующий внимания, а просто инструмент подсказки и ответа. Модель с открытым исходным кодом и самостоятельным хостингом привлекает разработчиков, которые хотят контролировать и настраивать систему. А простота интеграции с существующими рабочими процессами делает его удобным для распространения и рекомендации.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Две проблемы при создании долго работающих агентов<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Популярность Clawdbot доказывает, что людям нужен ИИ, который</strong> <em>действует</em><strong>, а не просто отвечает.</strong> Но любой агент, работающий в течение длительного времени и выполняющий реальные задачи - будь то Clawdbot или что-то, что вы создадите сами, - должен решить две технические проблемы: <strong>памяти</strong> и <strong>верификации</strong>.</p>
<p><strong>Проблема памяти</strong> проявляется по-разному:</p>
<ul>
<li><p>Агенты исчерпывают свое контекстное окно в середине задачи и оставляют незаконченную работу.</p></li>
<li><p>Они теряют из виду весь список задач и слишком рано объявляют "готово".</p></li>
<li><p>Они не могут передавать контекст между сессиями, поэтому каждая новая сессия начинается с нуля.</p></li>
</ul>
<p>Все эти проблемы имеют один и тот же корень: у агентов нет постоянной памяти. Контекстные окна конечны, межсессионный поиск ограничен, а прогресс не отслеживается в доступном для агентов виде.</p>
<p><strong>Проблема верификации</strong> заключается в другом. Даже когда память работает, агенты все равно помечают задачи как выполненные после быстрого юнит-теста, не проверяя, действительно ли функция работает из конца в конец.</p>
<p>Clawdbot решает обе проблемы. Он хранит память локально во всех сессиях и использует модульные "навыки" для автоматизации работы с браузерами, файлами и внешними сервисами. Подход работает. Но он не подходит для производства. Для корпоративного использования вам нужна структура, возможность аудита и безопасность, которые Clawdbot не обеспечивает из коробки.</p>
<p>В этой статье рассматриваются те же проблемы, что и в готовых к производству решениях.</p>
<p>Для запоминания мы используем <strong>двухагентную архитектуру</strong>, основанную на <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">исследованиях Anthropic</a>: агент-инициализатор, который разбивает проекты на проверяемые функции, и агент-кодировщик, который работает над ними по очереди с чистыми передачами. Для запоминания семантики по сессиям мы используем <a href="https://milvus.io/">Milvus</a>, векторную базу данных, которая позволяет агентам искать по смыслу, а не по ключевым словам.</p>
<p>Для проверки мы используем <strong>автоматизацию браузера</strong>. Вместо того чтобы доверять модульным тестам, агент тестирует функции так, как это сделал бы реальный пользователь.</p>
<p>Мы расскажем о концепциях, а затем покажем рабочую реализацию с использованием <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> и Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Как двухагентная архитектура предотвращает исчерпание контекста<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>У каждого LLM есть контекстное окно: предел того, сколько текста он может обработать за один раз. Когда агент работает над сложной задачей, это окно заполняется кодом, сообщениями об ошибках, историей разговоров и документацией. Как только окно заполняется, агент либо останавливается, либо начинает забывать предыдущий контекст. Для длительных задач это неизбежно.</p>
<p>Рассмотрим агента, получившего простой запрос: "Создать клон claude.ai". Проект требует аутентификации, чат-интерфейса, истории разговоров, потоковых ответов и десятков других функций. Один агент попытается справиться со всем сразу. На полпути к реализации интерфейса чата контекстное окно заполняется. Сессия заканчивается с наполовину написанным кодом, без документации о том, что было сделано, и без указаний на то, что работает, а что нет. Следующая сессия наследует беспорядок. Даже при уплотнении контекста новому агенту приходится догадываться, чем занимался предыдущий сеанс, отлаживать код, который он не писал, и выяснять, где можно возобновить работу. Час проходит впустую, прежде чем будет достигнут хоть какой-то новый прогресс.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">Решение с двумя агентами</h3><p>Решение Anthropic, описанное в инженерном посте <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Эффективные харнессы для долго работающих агентов",</a> заключается в использовании двух различных режимов подсказок: <strong>подсказка-инициализатор</strong> для первой сессии и <strong>подсказка-код</strong> для последующих сессий.</p>
<p>Технически оба режима используют один и тот же базовый агент, системные подсказки, инструменты и харнес. Единственное различие - это начальная подсказка для пользователя. Но поскольку они выполняют разные роли, полезно рассматривать их как два отдельных агента. Мы называем это двухагентной архитектурой.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Инициализатор создает среду для постепенного прогресса.</strong> Он принимает расплывчатый запрос и делает три вещи:</p>
<ul>
<li><p><strong>Разбивает проект на конкретные, поддающиеся проверке функции.</strong> Не расплывчатые требования вроде "сделать интерфейс чата", а конкретные, проверяемые шаги: "пользователь нажимает кнопку "Новый чат" → новая беседа появляется в боковой панели → область чата показывает состояние приветствия". Пример клона claude.ai от Anthropic содержит более 200 таких функций.</p></li>
<li><p><strong>Создает файл отслеживания выполнения.</strong> В этот файл записывается статус завершения каждой функции, поэтому в любой сессии можно посмотреть, что сделано и что осталось.</p></li>
<li><p><strong>Пишет скрипты настройки и делает начальный git-коммит.</strong> Такие скрипты, как <code translate="no">init.sh</code>, позволяют будущим сессиям быстро запустить среду разработки. Коммит git устанавливает чистую базовую линию.</p></li>
</ul>
<p>Инициализатор не просто планирует. Он создает инфраструктуру, которая позволяет будущим сессиям немедленно приступить к работе.</p>
<p><strong>Агент кодирования</strong> обрабатывает каждую последующую сессию. Он:</p>
<ul>
<li><p>Читает файл прогресса и журналы git, чтобы понять текущее состояние</p></li>
<li><p>Выполняет базовое сквозное тестирование, чтобы убедиться, что приложение по-прежнему работает</p></li>
<li><p>Выбирает одну функцию для работы</p></li>
<li><p>Реализует функцию, тщательно тестирует ее, фиксирует в git с описательным сообщением и обновляет файл прогресса.</p></li>
</ul>
<p>Когда сессия заканчивается, кодовая база находится в состоянии, пригодном для слияния: никаких серьезных ошибок, упорядоченный код, понятная документация. Нет ни полуфабрикатов, ни загадок о том, что было сделано. Следующая сессия начнется ровно с того места, где остановилась эта.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Используйте JSON для отслеживания функций, а не Markdown</h3><p><strong>Стоит отметить одну деталь реализации: список функций должен быть JSON, а не Markdown.</strong></p>
<p>При редактировании JSON модели ИИ склонны хирургически изменять конкретные поля. При редактировании Markdown они часто переписывают целые разделы. При списке из 200 с лишним функций правки в формате Markdown могут случайно испортить отслеживание прогресса.</p>
<p>Запись в формате JSON выглядит следующим образом:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>У каждой функции есть четкие шаги проверки. Поле <code translate="no">passes</code> отслеживает завершение. Инструкции с жесткими формулировками вроде "Недопустимо удалять или редактировать тесты, так как это может привести к отсутствию или ошибкам в функциональности" также рекомендуются, чтобы агент не смог обмануть систему, удалив сложные функции.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Как Milvus обеспечивает агентам семантическую память на все сеансы<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Двухагентная архитектура решает проблему исчерпания контекста, но не решает проблему забывания.</strong> Даже при чистом переходе от одной сессии к другой агент теряет память о том, чему он научился. Он не может вспомнить, что "маркеры обновления JWT" относятся к "аутентификации пользователей", если только эти слова не появятся в файле выполнения. По мере роста проекта поиск в сотнях git-коммитов становится медленным. При подборе ключевых слов упускаются связи, которые были бы очевидны для человека.</p>
<p><strong>Именно здесь на помощь приходят векторные базы данных.</strong> Вместо того чтобы хранить текст и искать по ключевым словам, векторная база данных преобразует текст в числовые представления смысла. При поиске по запросу "аутентификация пользователей" в ней будут найдены записи о "маркерах обновления JWT" и "обработке сеансов входа". Не потому, что слова совпадают, а потому, что эти понятия семантически близки. Агент может спросить: "Видел ли я что-то подобное раньше?" и получить полезный ответ.</p>
<p><strong>На практике это работает за счет встраивания записей о прогрессе и коммитов git в базу данных в виде векторов.</strong> Когда начинается сессия кодирования, агент запрашивает базу данных с текущей задачей. База данных за миллисекунды возвращает соответствующую историю: что уже пытались сделать, что получилось, что не получилось. Агент не начинает с нуля. Он начинает с контекста.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>хорошо подходит для этого случая использования.</strong> Он имеет открытый исходный код и предназначен для векторного поиска в производственных масштабах, обрабатывая миллиарды векторов без особых усилий. Для небольших проектов или локальной разработки <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> может быть встроен непосредственно в приложение, например SQLite. Настройка кластера не требуется. Когда проект вырастет, вы сможете перейти на распределенный Milvus без изменения кода. Для генерации вкраплений вы можете использовать внешние модели, такие как <a href="https://www.sbert.net/">SentenceTransformer</a>, для более тонкого контроля или ссылаться на <a href="https://milvus.io/docs/embeddings.md">встроенные функции вкраплений</a> для более простых настроек. Milvus также поддерживает <a href="https://milvus.io/docs/hybridsearch.md">гибридный поиск</a>, сочетающий векторное сходство с традиционной фильтрацией, так что вы можете запросить "найти похожие проблемы аутентификации за последнюю неделю" за один вызов.</p>
<p><strong>Это также решает проблему переноса.</strong> Векторная база данных сохраняется вне отдельной сессии, поэтому знания накапливаются со временем. На сеансе 50 можно получить доступ ко всему, что было изучено на сеансах с 1 по 49. Проект развивает институциональную память.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Проверка завершенности с помощью автоматизированного тестирования<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Даже при двухагентной архитектуре и долговременной памяти агенты могут объявить о победе слишком рано. Это и есть проблема верификации.</strong></p>
<p>Вот распространенный вариант отказа: Сессия кодинга завершает работу над функцией, запускает быстрый модульный тест, видит, что он прошел, и переключает <code translate="no">&quot;passes&quot;: false</code> на <code translate="no">&quot;passes&quot;: true</code>. Но прохождение модульного теста не означает, что функция действительно работает. API может возвращать корректные данные, а пользовательский интерфейс ничего не отображает из-за ошибки CSS. В файле выполнения написано "завершено", а пользователи ничего не видят.</p>
<p><strong>Решение заключается в том, чтобы заставить агента тестировать как реальный пользователь.</strong> Каждая функция в списке функций имеет конкретные шаги проверки: "пользователь нажимает кнопку "Новый чат" → новая беседа появляется в боковой панели → область чата показывает состояние приветствия". Агент должен проверить эти шаги буквально. Вместо того чтобы выполнять только тесты на уровне кода, он использует инструменты автоматизации браузера, такие как Puppeteer, для имитации реального использования. Он открывает страницу, нажимает кнопки, заполняет формы и проверяет, появляются ли на экране нужные элементы. Только когда весь поток проходит, агент отмечает функцию как завершенную.</p>
<p><strong>Это позволяет выявить проблемы, которые не замечают модульные тесты</strong>. Функция чата может иметь идеальную логику бэкенда и правильные ответы API. Но если фронтенд не отображает ответ, пользователи ничего не видят. Автоматизация браузера может сделать скриншот и проверить, соответствует ли то, что появляется на экране, тому, что должно появиться. Поле <code translate="no">passes</code> становится <code translate="no">true</code> только тогда, когда функция действительно работает из конца в конец.</p>
<p><strong>Однако здесь есть свои ограничения.</strong> Некоторые функции, присущие браузерам, не могут быть автоматизированы с помощью таких инструментов, как Puppeteer. В качестве примера можно привести подборщики файлов и диалоги подтверждения системы. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">В Anthropic отметили</a>, что функции, полагающиеся на модальные оповещения, как правило, имеют больше ошибок, поскольку агент не может увидеть их через Puppeteer. Практическим выходом из ситуации является проектирование с учетом этих ограничений. По возможности используйте пользовательские компоненты пользовательского интерфейса вместо нативных диалогов, чтобы агент мог протестировать каждый шаг проверки в списке функций.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Собираем все вместе: LangGraph для состояния сеанса, Milvus для долговременной памяти<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Концепции, описанные выше, объединяются в рабочую систему с помощью двух инструментов: LangGraph для состояния сеанса и Milvus для долговременной памяти.</strong> LangGraph управляет тем, что происходит в рамках одной сессии: над какой функцией ведется работа, что завершено, что дальше. Milvus хранит историю с возможностью поиска по всем сессиям: что было сделано ранее, какие проблемы возникли и какие решения сработали. Вместе они дают агентам как кратковременную, так и долговременную память.</p>
<p><strong>Замечание по реализации:</strong> Приведенный ниже код - это упрощенная демонстрация. Он показывает основные паттерны в одном сценарии, но не полностью повторяет разделение сессий, описанное ранее. В производственной установке каждый сеанс кодирования будет отдельным вызовом, возможно, на разных машинах или в разное время. В LangGraph для этого используются <code translate="no">MemorySaver</code> и <code translate="no">thread_id</code>, сохраняющие состояние между вызовами. Чтобы наглядно увидеть поведение возобновления, запустите скрипт один раз, остановите его, а затем запустите снова с тем же <code translate="no">thread_id</code>. Второй запуск продолжит работу с того места, на котором остановился первый.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Заключение</h3><p>ИИ-агенты не справляются с длительными задачами, потому что им не хватает постоянной памяти и надлежащей проверки. Clawdbot получил широкую известность благодаря решению этих проблем, но его подход не подходит для производства.</p>
<p>В этой статье мы рассмотрели три решения:</p>
<ul>
<li><p><strong>Двухагентная архитектура:</strong> Инициализатор разбивает проекты на проверяемые функции; агент кодирования работает над ними по очереди с чистыми передачами. Это предотвращает истощение контекста и позволяет отслеживать прогресс.</p></li>
<li><p><strong>Векторная база данных для семантической памяти:</strong> <a href="https://milvus.io/">Milvus</a> хранит записи о прогрессе и коммиты git в виде вкраплений, поэтому агенты могут искать по смыслу, а не по ключевым словам. Сессия 50 запоминает то, что узнала сессия 1.</p></li>
<li><p><strong>Автоматизация браузера для реальной проверки:</strong> Юнит-тесты проверяют, работает ли код. Puppeteer проверяет, работают ли функции на самом деле, тестируя то, что пользователи видят на экране.</p></li>
</ul>
<p>Эти паттерны не ограничиваются разработкой программного обеспечения. Научные исследования, финансовое моделирование, анализ юридических документов - любая задача, которая охватывает несколько сессий и требует надежной передачи данных, может принести пользу.</p>
<p>Основные принципы:</p>
<ul>
<li><p>Используйте инициализатор, чтобы разбить работу на поддающиеся проверке фрагменты.</p></li>
<li><p>Отслеживайте прогресс в структурированном, машиночитаемом формате</p></li>
<li><p>Хранить опыт в векторной базе данных для семантического поиска</p></li>
<li><p>Проверяйте завершение работы с помощью реальных тестов, а не только юнит-тестов.</p></li>
<li><p>Создавайте четкие границы сессий, чтобы работа могла безопасно приостанавливаться и возобновляться.</p></li>
</ul>
<p>Инструменты существуют. Паттерны проверены. Осталось только применить их.</p>
<p><strong>Готовы приступить к работе?</strong></p>
<ul>
<li><p>Изучите <a href="https://milvus.io/">Milvus</a> и <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> для добавления семантической памяти в ваши агенты.</p></li>
<li><p>Ознакомьтесь с LangGraph для управления состоянием сессии</p></li>
<li><p>Ознакомьтесь с <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">полным исследованием Anthropic</a>, посвященным долговременной работе агентов.</p></li>
</ul>
<p><strong>У вас есть вопросы или вы хотите поделиться тем, что вы создаете?</strong></p>
<ul>
<li><p>Присоединяйтесь к <a href="https://milvus.io/slack">сообществу Milvus Slack</a>, чтобы общаться с другими разработчиками.</p></li>
<li><p>Посещайте <a href="https://milvus.io/office-hours">Milvus Office Hours</a> для живых вопросов и ответов с командой</p></li>
</ul>
