---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  MCP уже устарел? Настоящая причина, по которой Anthropic отправила навыки, и
  как использовать их в паре с Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Узнайте, как Skills снижает потребление токенов и как Skills и MCP работают
  вместе с Milvus для улучшения рабочих процессов ИИ.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>За последние несколько недель на X и Hacker News разгорелся удивительно жаркий спор: <em>Действительно ли нам больше не нужны серверы MCP?</em> Одни разработчики утверждают, что MCP чрезмерно инженерно проработан, требует много токенов и в корне не соответствует тому, как агенты должны использовать инструменты. Другие защищают MCP как надежный способ раскрытия реальных возможностей языковых моделей. В зависимости от того, какую тему вы читаете, MCP - это либо будущее использования инструментов, либо смерть по прибытии.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Разочарование вполне объяснимо. MCP предоставляет надежный доступ к внешним системам, но при этом заставляет модель загружать длинные схемы, подробные описания и обширные списки инструментов. Это увеличивает реальные затраты. Если вы загрузите стенограмму совещания и затем отправите ее в другой инструмент, модель может обрабатывать один и тот же текст несколько раз, увеличивая использование токенов без какой-либо очевидной пользы. Для команд, работающих в масштабе, это не неудобство - это счет.</p>
<p>Но объявлять MCP устаревшим преждевременно. Anthropic - та же команда, которая придумала MCP, - тихо представила нечто новое: <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Навыки - это легковесные Markdown/YAML-определения, которые описывают <em>, как</em> и <em>когда</em> следует использовать инструмент. Вместо того чтобы сбрасывать полные схемы в контекстное окно, модель сначала считывает компактные метаданные и использует их для планирования. На практике Skills значительно сокращает накладные расходы на токены и дает разработчикам больше контроля над оркестровкой инструментов.</p>
<p>Значит ли это, что Skills заменит MCP? Не совсем. Навыки оптимизируют планирование, но MCP по-прежнему предоставляет фактические возможности: чтение файлов, вызов API, взаимодействие с системами хранения или подключение к внешней инфраструктуре, например <a href="https://milvus.io/"><strong>Milvus</strong></a>, векторной базе данных с открытым исходным кодом, которая обеспечивает быстрый семантический поиск в масштабе, что делает ее критически важным бэкэндом, когда вашим навыкам нужен реальный доступ к данным.</p>
<p>В этом посте мы рассмотрим, какие навыки хорошо работают, где MCP по-прежнему важны, и как они вписываются в развивающуюся архитектуру агентов Anthropic. Затем мы расскажем, как создать свои собственные навыки, которые легко интегрируются с Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Что такое навыки агентов Anthropic и как они работают<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Давняя проблема традиционных агентов ИИ заключается в том, что инструкции стираются по мере развития беседы.</p>
<p>Даже при самых тщательно продуманных системных подсказках поведение модели может постепенно дрейфовать по ходу разговора. После нескольких поворотов Клод начинает забывать или терять ориентацию на первоначальные инструкции.</p>
<p>Проблема кроется в структуре системной подсказки. Это одноразовая статичная инъекция, которая конкурирует за место в контекстном окне модели, наряду с историей разговора, документами и любыми другими входными данными. По мере заполнения контекстного окна внимание модели к системной подсказке все больше ослабевает, что со временем приводит к потере согласованности.</p>
<p>Навыки были разработаны для решения этой проблемы. Навыки - это папки, содержащие инструкции, скрипты и ресурсы. Вместо того чтобы полагаться на статичную системную подсказку, навыки разбивают опыт на модульные, многократно используемые и постоянные наборы инструкций, которые Клод может обнаруживать и загружать динамически, когда это необходимо для выполнения задачи.</p>
<p>Когда Claude начинает выполнение задачи, он сначала проводит легкое сканирование всех доступных навыков, читая только их метаданные YAML (всего несколько десятков лексем). Эти метаданные содержат достаточно информации, чтобы Claude мог определить, имеет ли навык отношение к текущей задаче. Если да, то Claude расширяет полный набор инструкций (обычно менее 5 тыс. токенов), а дополнительные ресурсы или скрипты загружаются только в случае необходимости.</p>
<p>Такое постепенное раскрытие позволяет Claude инициализировать навык всего 30-50 токенами, что значительно повышает эффективность и снижает ненужные контекстные накладные расходы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Как Skills сравнивается с Prompts, Projects, MCP и Subagents<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Сегодняшний ландшафт инструментов моделирования может показаться переполненным. Даже в рамках одной только агентской экосистемы Claude существует несколько отдельных компонентов: Навыки, подсказки, проекты, субагенты и MCP.</p>
<p>Теперь, когда мы понимаем, что такое навыки и как они работают благодаря модульным наборам инструкций и динамической загрузке, нам нужно знать, как навыки связаны с другими частями экосистемы Claude, особенно с MCP. Вот краткое описание:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Навыки</h3><p>Навыки - это папки, содержащие инструкции, скрипты и ресурсы. Claude обнаруживает и загружает их динамически, используя прогрессивное раскрытие: сначала метаданные, затем полные инструкции и, наконец, все необходимые файлы.</p>
<p><strong>Лучше всего подходит для:</strong></p>
<ul>
<li><p>Организационных рабочих процессов (руководства по бренду, процедуры соблюдения требований).</p></li>
<li><p>Знания в данной области (формулы Excel, анализ данных)</p></li>
<li><p>Личные предпочтения (системы ведения записей, шаблоны кодирования)</p></li>
<li><p>Профессиональные задачи, которые необходимо повторно использовать при общении (проверки безопасности кода на основе OWASP).</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Подсказки</h3><p>Подсказки - это инструкции на естественном языке, которые вы даете Клоду во время разговора. Они носят временный характер и существуют только в текущем разговоре.</p>
<p><strong>Лучше всего подходят для:</strong></p>
<ul>
<li><p>разовых просьб (резюмирование статьи, форматирование списка)</p></li>
<li><p>Уточнения в разговоре (корректировка тона, добавление деталей).</p></li>
<li><p>Непосредственный контекст (анализ конкретных данных, интерпретация содержания)</p></li>
<li><p>Специальные инструкции</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Проекты</h3><p>Проекты - это автономные рабочие пространства с собственными историями чатов и базами знаний. Каждый проект предлагает контекстное окно объемом 200K. Когда объем знаний по проекту достигает пределов контекста, Claude плавно переходит в режим RAG, позволяя увеличить эффективную емкость в 10 раз.</p>
<p><strong>Лучше всего подходит для:</strong></p>
<ul>
<li><p>Постоянный контекст (например, все разговоры, связанные с запуском продукта).</p></li>
<li><p>Организация рабочего пространства (отдельные контексты для разных инициатив)</p></li>
<li><p>Совместная работа в команде (в планах Team и Enterprise)</p></li>
<li><p>Индивидуальные инструкции (тон или точка зрения, характерные для конкретного проекта).</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Субагенты</h3><p>Субагенты - это специализированные помощники ИИ с собственными контекстными окнами, пользовательскими системными подсказками и особыми разрешениями на использование инструментов. Они могут работать независимо и возвращать результаты основному агенту.</p>
<p><strong>Лучше всего подходят для:</strong></p>
<ul>
<li><p>Специализация задач (обзор кода, генерация тестов, аудит безопасности)</p></li>
<li><p>Управление контекстом (чтобы не отвлекаться от основного разговора).</p></li>
<li><p>Параллельная обработка (несколько субагентов одновременно работают над разными аспектами)</p></li>
<li><p>Ограничение инструментов (например, доступ только для чтения).</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (протокол контекста модели)</h3><p>Протокол контекста модели (MCP) - это открытый стандарт, который соединяет модели ИИ с внешними инструментами и источниками данных.</p>
<p><strong>Лучше всего подходит для:</strong></p>
<ul>
<li><p>доступа к внешним данным (Google Drive, Slack, GitHub, базы данных).</p></li>
<li><p>Использование бизнес-инструментов (CRM-системы, платформы управления проектами)</p></li>
<li><p>Подключение к средам разработки (локальные файлы, IDE, контроль версий)</p></li>
<li><p>Интеграция с пользовательскими системами (собственные инструменты и источники данных).</p></li>
</ul>
<p>Исходя из вышесказанного, мы видим, что Skills и MCP решают разные задачи и работают вместе, дополняя друг друга.</p>
<table>
<thead>
<tr><th><strong>Измерение</strong></th><th><strong>MCP</strong></th><th><strong>Навыки</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Основная ценность</strong></td><td>Подключение к внешним системам (базам данных, API, SaaS-платформам)</td><td>Определяет спецификации поведения (как обрабатывать и представлять данные)</td></tr>
<tr><td><strong>Ответы на вопросы</strong></td><td>"К чему может получить доступ Клод?"</td><td>"Что должен делать Клод?"</td></tr>
<tr><td><strong>Реализация</strong></td><td>Клиент-серверный протокол + JSON-схема</td><td>Markdown-файл + метаданные YAML</td></tr>
<tr><td><strong>Потребление контекста</strong></td><td>Десятки тысяч жетонов (многократное накопление на сервере)</td><td>30-50 токенов на операцию</td></tr>
<tr><td><strong>Примеры использования</strong></td><td>Запрос больших баз данных, вызов API GitHub</td><td>Определение стратегий поиска, применение правил фильтрации, форматирование вывода</td></tr>
</tbody>
</table>
<p>В качестве примера рассмотрим поиск кода.</p>
<ul>
<li><p><strong>MCP (например, claude-context):</strong> Предоставляет возможность доступа к базе данных векторов Milvus.</p></li>
<li><p><strong>Навыки:</strong> Определяет рабочий процесс, такой как приоритезация последнего измененного кода, сортировка результатов по релевантности и представление данных в виде таблицы Markdown.</p></li>
</ul>
<p>MCP предоставляет возможности, а Skills определяет процесс. Вместе они образуют взаимодополняющую пару.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Как создавать пользовательские навыки с помощью Claude-Context и Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> - это MCP-плагин, который добавляет функциональность семантического поиска кода в Claude Code, превращая всю кодовую базу в контекст Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Необходимые условия</h3><p>Системные требования:</p>
<ul>
<li><p><strong>Node.js</strong>: Версия &gt;= 20.0.0 и &lt; 24.0.0</p></li>
<li><p><strong>API-ключ OpenAI</strong> (для встраивания моделей)</p></li>
<li><p><strong>Ключ API</strong><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> (управляемый сервис Milvus)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Шаг 1: Настройте службу MCP (claude-context)</h3><p>Выполните следующую команду в терминале:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Проверьте конфигурацию:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Настройка MCP завершена. Теперь Клод может получить доступ к базе данных векторов Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Шаг 2: Создание навыка</h3><p>Создайте каталог Skills:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Создайте файл SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Шаг 3: Перезапустите Claude для применения навыков</h3><p>Выполните следующую команду, чтобы перезапустить Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Примечание:</strong> После завершения настройки вы можете сразу же использовать навыки для запроса кодовой базы Milvus.</p>
<p>Ниже приведен пример того, как это работает.</p>
<p>Запрос: Как работает Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>По своей сути навыки выступают в качестве механизма инкапсуляции и передачи специализированных знаний. Используя навыки, ИИ может унаследовать опыт команды и следовать лучшим отраслевым практикам - будь то контрольный список для проверки кода или стандарты документации. Когда эти неявные знания становятся явными с помощью файлов Markdown, качество генерируемых ИИ результатов значительно повышается.</p>
<p>В будущем способность эффективно использовать навыки может стать ключевым фактором, определяющим, как команды и отдельные сотрудники используют ИИ в своих интересах.</p>
<p>Пока вы изучаете потенциал ИИ в своей организации, Milvus является важнейшим инструментом для управления и поиска крупномасштабных векторных данных. Сочетание мощной векторной базы данных Milvus с такими инструментами искусственного интеллекта, как Skills, позволит вам улучшить не только рабочие процессы, но и глубину и скорость анализа данных.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a>, чтобы пообщаться с нашими инженерами и другими инженерами по ИИ в сообществе. Вы также можете заказать 20-минутную индивидуальную сессию, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
