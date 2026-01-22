---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Создание агентов искусственного интеллекта за 10 минут на естественном языке с
  помощью LangSmith Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Узнайте, как за считанные минуты создать ИИ-агенты с памятью с помощью
  LangSmith Agent Builder и Milvus - без кода, на естественном языке, готовые к
  производству.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>По мере ускорения разработки ИИ все больше команд обнаруживают, что для создания ИИ-ассистента не обязательно иметь образование инженера-программиста. Люди, которым помощники нужны больше всего - команды разработчиков, операторы, служба поддержки, исследователи, - часто знают, что именно должен делать агент, но не знают, как реализовать это в коде. Традиционные инструменты "без кода" пытались преодолеть этот разрыв с помощью перетаскиваемых полотен, но они разрушались в тот момент, когда вам требовалось реальное поведение агента: многоступенчатые рассуждения, использование инструментов или постоянная память.</p>
<p>Недавно выпущенный <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> использует другой подход. Вместо того чтобы разрабатывать рабочие процессы, вы описываете цели агента и доступные инструменты на простом языке, а среда выполнения принимает решения. Никаких блок-схем, никаких сценариев - только четкое намерение.</p>
<p>Но само по себе намерение не создает интеллектуального помощника. Это делает <strong>память</strong>. Именно в этом случае <a href="https://milvus.io/"><strong>Milvus</strong></a>, широко распространенная векторная база данных с открытым исходным кодом, обеспечивает основу. Храня документы и историю разговоров в виде вкраплений, Milvus позволяет вашему агенту вспоминать контекст, извлекать нужную информацию и точно реагировать в масштабе.</p>
<p>В этом руководстве рассказывается о том, как создать готовый к производству ИИ-ассистент с поддержкой памяти с помощью <strong>LangSmith Agent Builder + Milvus</strong>, не написав при этом ни строчки кода.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">Что такое LangSmith Agent Builder и как он работает?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Как видно из названия, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> - это инструмент без кода от LangChain, который позволяет создавать, развертывать и управлять агентами искусственного интеллекта с помощью обычного языка. Вместо того чтобы писать логику или разрабатывать визуальные потоки, вы объясняете, что должен делать агент, какие инструменты он может использовать и как он должен себя вести. После этого система справляется со сложными задачами - генерирует подсказки, выбирает инструменты, соединяет компоненты и включает память.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В отличие от традиционных инструментов без кода или рабочих процессов, в Agent Builder нет холста с перетаскиванием и библиотеки узлов. Вы взаимодействуете с ним так же, как с ChatGPT. Опишите, что вы хотите создать, ответьте на несколько уточняющих вопросов, и Конструктор создаст полностью функционирующего агента на основе вашего замысла.</p>
<p>За кулисами этот агент строится из четырех основных строительных блоков.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Подсказка:</strong> Подсказка - это мозг агента, определяющий его цели, ограничения и логику принятия решений. LangSmith Agent Builder использует мета-подсказку для автоматического построения: вы описываете, что вам нужно, он задает уточняющие вопросы, и ваши ответы синтезируются в подробную, готовую к производству системную подсказку. Вместо того чтобы писать логику от руки, вы просто выражаете намерение.</li>
<li><strong>Инструменты:</strong> Инструменты позволяют агенту действовать - отправлять электронные письма, писать сообщения в Slack, создавать события в календаре, искать данные или вызывать API. Agent Builder интегрирует эти инструменты с помощью протокола Model Context Protocol (MCP), который обеспечивает безопасный и расширяемый способ раскрытия возможностей. Пользователи могут использовать встроенные интеграции или добавлять собственные серверы MCP, включая <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">серверы</a>Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP</a>для векторного поиска и долговременной памяти.</li>
<li><strong>Триггеры:</strong> Триггеры определяют, когда запускается агент. Помимо ручного выполнения, вы можете прикреплять агентов к расписаниям или внешним событиям, чтобы они автоматически реагировали на сообщения, электронную почту или активность webhook. Когда срабатывает триггер, Agent Builder запускает новый поток выполнения и запускает логику агента, обеспечивая непрерывное поведение, управляемое событиями.</li>
<li><strong>Субагенты:</strong> Субагенты разбивают сложные задачи на более мелкие специализированные части. Основной агент может делегировать работу субагентам - каждый со своим собственным подсказчиком и набором инструментов, - чтобы такие задачи, как поиск данных, обобщение или форматирование, выполнялись специальными помощниками. Это позволяет избежать единой перегруженной подсказки и создать более модульную, масштабируемую архитектуру агента.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Как агент запоминает ваши предпочтения?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Уникальность Agent Builder заключается в том, как он обращается с <em>памятью</em>. Вместо того чтобы записывать предпочтения в историю чата, агент может обновлять свои собственные правила поведения во время работы. Если вы скажете: "Отныне заканчивайте каждое сообщение в Slack стихотворением", агент не будет рассматривать это как одноразовый запрос - он сохранит его как постоянное предпочтение, которое будет применяться в будущих запусках.</p>
<p>Под капотом агент хранит файл внутренней памяти - по сути, это его эволюционирующая системная подсказка. При каждом запуске он считывает этот файл, чтобы решить, как себя вести. Когда вы даете поправки или ограничения, агент редактирует файл, добавляя в него структурированные правила вроде "Всегда завершать брифинг коротким стихотворением, поднимающим настроение". Такой подход гораздо стабильнее, чем опора на историю разговоров, потому что агент активно переписывает свои операционные инструкции, а не хоронит ваши предпочтения в транскрипте.</p>
<p>Этот дизайн заимствован из FilesystemMiddleware DeepAgents, но полностью абстрагирован в Agent Builder. Вы никогда не прикасаетесь к файлам напрямую: вы выражаете обновления на естественном языке, а система обрабатывает правки за кулисами. Если вам нужно больше контроля, вы можете подключить собственный MCP-сервер или перейти на уровень DeepAgents для расширенной настройки памяти.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Практическая демонстрация: Создание Milvus Assistant за 10 минут с помощью Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы рассмотрели философию разработки Agent Builder, давайте пройдемся по всему процессу сборки на практическом примере. Наша цель - создать интеллектуального помощника, который сможет отвечать на технические вопросы, связанные с Milvus, искать информацию в официальной документации и запоминать предпочтения пользователя на протяжении долгого времени.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Шаг 1. Войдите на сайт LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Шаг 2. Настройте свой ключ API Anthropic</h3><p><strong>Примечание:</strong> Anthropic поддерживается по умолчанию. Вы также можете использовать пользовательскую модель, если ее тип входит в список официально поддерживаемых LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Добавьте ключ API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Введите и сохраните ключ API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Шаг 3. Создайте нового агента</h3><p><strong>Примечание:</strong> Щелкните <strong>Learn More</strong>, чтобы просмотреть документацию по использованию.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Настройка пользовательской модели (необязательно)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Введите параметры и сохраните</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Шаг 4. Опишите свои требования для создания агента</h3><p><strong>Примечание:</strong> Создайте агента, используя описание на естественном языке.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Система задает последующие вопросы для уточнения требований</strong></li>
</ol>
<p>Вопрос 1: Выберите типы индексов Milvus, которые агент должен запомнить.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вопрос 2: Выберите, как агент должен обрабатывать технические вопросы  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вопрос 3: Укажите, должен ли агент сосредоточиться на руководстве для конкретной версии Milvus.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Шаг 5. Просмотр и подтверждение сгенерированного агента</h3><p><strong>Примечание:</strong> Система автоматически генерирует конфигурацию агента.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Перед созданием агента вы можете просмотреть его метаданные, инструменты и подсказки. Если все выглядит правильно, нажмите кнопку <strong>Создать</strong>, чтобы продолжить.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Шаг 6. Изучите интерфейс и области функций</h3><p>После создания агента вы увидите три функциональные области в левом нижнем углу интерфейса:</p>
<p><strong>(1) Триггеры</strong></p>
<p>Триггеры определяют, когда агент должен запускаться, либо в ответ на внешние события, либо по расписанию:</p>
<ul>
<li><strong>Slack:</strong> Активировать агента при поступлении сообщения в определенный канал.</li>
<li><strong>Gmail:</strong> Запускать агента при получении нового сообщения электронной почты.</li>
<li><strong>Cron:</strong> Запуск агента по расписанию</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Набор инструментов</strong></p>
<p>Это набор инструментов, которые может вызывать агент. В показанном примере три инструмента генерируются автоматически при создании, и вы можете добавить другие, нажав кнопку <strong>Добавить инструмент</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Если вашему агенту нужны возможности векторного поиска - например, семантический поиск в больших объемах технической документации, - вы можете развернуть MCP-сервер Milvus</strong> и добавить его сюда с помощью кнопки <strong>MCP</strong>. Убедитесь, что MCP-сервер запущен <strong>на доступной конечной точке сети</strong>; в противном случае Agent Builder не сможет его вызвать.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Субагенты</strong></p>
<p>Создайте независимые модули агентов, предназначенные для выполнения определенных подзадач, что позволит создать модульную систему.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Шаг 7. Протестируйте агента</h3><p>Нажмите кнопку <strong>Test</strong> в правом верхнем углу, чтобы перейти в режим тестирования. Ниже приведен пример результатов тестирования.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder против DeepAgents: Что выбрать?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain предлагает несколько фреймворков агентов, и правильный выбор зависит от того, какой контроль вам нужен. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> - это инструмент для создания агентов. Он используется для создания автономных, долго работающих агентов ИИ, которые решают сложные многоэтапные задачи. Построенный на базе LangGraph, он поддерживает расширенное планирование, управление контекстом на основе файлов и оркестровку субагентов, что делает его идеальным для долгосрочных или производственных проектов.</p>
<p>Чем же отличается <strong>Agent Builder</strong> от <strong>Agent Builder</strong>, и когда следует использовать каждый из них?</p>
<p>В<strong>Agent Builder</strong> основное внимание уделяется простоте и скорости. Он абстрагируется от большинства деталей реализации, позволяя вам описать агента на естественном языке, настроить инструменты и сразу же запустить его. Вопросы памяти, использования инструментов и рабочих процессов с участием человека решаются за вас. Это делает Agent Builder идеальным решением для быстрого создания прототипов, внутренних инструментов и проверки на ранних этапах, где простота использования важнее, чем детальный контроль.</p>
<p><strong>DeepAgents</strong>, напротив, предназначен для сценариев, в которых вам необходим полный контроль над памятью, исполнением и инфраструктурой. Вы можете настроить промежуточное ПО, интегрировать любой инструмент Python, модифицировать бэкэнд хранения (включая сохранение памяти в <a href="https://milvus.io/blog">Milvus</a>) и явно управлять графом состояний агента. Компромисс заключается в инженерных усилиях - вы сами пишете код, управляете зависимостями и обрабатываете режимы отказов, - но вы получаете полностью настраиваемый стек агентов.</p>
<p>Важно отметить, что <strong>Agent Builder и DeepAgents не являются отдельными экосистемами - они образуют единый континуум</strong>. Agent Builder построен на базе DeepAgents. Это означает, что вы можете начать с быстрого прототипа в Agent Builder, а затем перейти к DeepAgents, когда вам понадобится большая гибкость, не переписывая все с нуля. Работает и обратное: паттерны, созданные в DeepAgents, могут быть упакованы в шаблоны Agent Builder, чтобы нетехнические пользователи могли использовать их повторно.</p>
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
    </button></h2><p>Благодаря развитию искусственного интеллекта создание агентов ИИ больше не требует сложных рабочих процессов и тяжелого инженерного труда. С помощью LangSmith Agent Builder вы можете создавать долговременных помощников с состоянием, используя только естественный язык. Вы сосредотачиваетесь на описании того, что должен делать агент, а система занимается планированием, выполнением инструментов и постоянным обновлением памяти.</p>
<p>В сочетании с <a href="https://milvus.io/blog">Milvus</a> эти агенты получают надежную, постоянную память для семантического поиска, отслеживания предпочтений и долгосрочного контекста в течение нескольких сессий. Независимо от того, проверяете ли вы идею или развертываете масштабируемую систему, LangSmith Agent Builder и Milvus обеспечивают простую и гибкую основу для агентов, которые не просто отвечают - они запоминают и совершенствуются с течением времени.</p>
<p>У вас есть вопросы или вы хотите получить более подробную информацию? Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу Slack</a> или запишитесь на 20-минутную сессию <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы получить индивидуальные рекомендации.</p>
