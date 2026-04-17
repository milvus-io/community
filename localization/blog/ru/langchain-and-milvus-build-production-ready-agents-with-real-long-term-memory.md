---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 и Milvus: как создать готовые к производству агенты с реальной
  долговременной памятью
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Узнайте, как LangChain 1.0 упрощает архитектуру агентов и как Milvus добавляет
  долговременную память для масштабируемых, готовых к производству приложений
  ИИ.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain - это популярный фреймворк с открытым исходным кодом для разработки приложений на основе больших языковых моделей (LLM). Он предоставляет модульный набор инструментов для создания агентов, использующих рассуждения и инструменты, подключения моделей к внешним данным и управления потоками взаимодействия.</p>
<p>С выходом <strong>LangChain 1.0</strong> фреймворк делает шаг в сторону более удобной для производства архитектуры. Новая версия заменяет прежний дизайн, основанный на цепочке, стандартизированным циклом ReAct (Reason → Tool Call → Observe → Decide) и вводит Middleware для управления исполнением, контролем и безопасностью.</p>
<p>Однако одного рассуждения недостаточно. Агентам также нужна возможность хранить, вспоминать и повторно использовать информацию. Именно здесь важную роль может сыграть <a href="https://milvus.io/"><strong>Milvus</strong></a>, векторная база данных с открытым исходным кодом. Milvus предоставляет масштабируемый, высокопроизводительный слой памяти, который позволяет агентам эффективно хранить, искать и извлекать информацию на основе семантического сходства.</p>
<p>В этом посте мы рассмотрим, как LangChain 1.0 обновляет архитектуру агентов, и как интеграция Milvus помогает агентам выйти за рамки рассуждений, обеспечивая постоянную интеллектуальную память для реальных сценариев использования.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Почему дизайн, основанный на цепочке, не работает<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>В начале своего существования (версия 0.x) архитектура LangChain была основана на цепочках. Каждая цепочка определяла фиксированную последовательность действий и поставлялась с готовыми шаблонами, которые делали оркестровку LLM простой и быстрой. Такой дизайн отлично подходил для быстрого создания прототипов. Но по мере развития экосистемы LLM и усложнения реальных сценариев использования в этой архитектуре стали появляться трещины.</p>
<p><strong>1. Отсутствие гибкости</strong></p>
<p>Ранние версии LangChain предоставляли модульные конвейеры, такие как SimpleSequentialChain или LLMChain, каждый из которых следовал фиксированному, линейному потоку - создание запроса → вызов модели → обработка вывода. Такая конструкция хорошо работала для простых и предсказуемых задач и позволяла быстро создавать прототипы.</p>
<p>Однако по мере того, как приложения становились все более динамичными, эти жесткие шаблоны стали казаться ограничивающими. Когда бизнес-логика перестает аккуратно вписываться в предопределенную последовательность, у вас остается два неудовлетворительных варианта: заставить свою логику соответствовать фреймворку или полностью обойти его, вызвав LLM API напрямую.</p>
<p><strong>2. Отсутствие контроля производственного уровня</strong></p>
<p>То, что хорошо работало в демо-версиях, часто ломалось в производстве. Цепочки не предусматривали гарантий, необходимых для крупномасштабных, постоянных или чувствительных приложений. К числу распространенных проблем относятся:</p>
<ul>
<li><p><strong>Переполнение контекста:</strong> Длинные разговоры могли превысить лимит токенов, что приводило к сбоям или молчаливому обрыву.</p></li>
<li><p><strong>Утечка конфиденциальных данных:</strong> Лично идентифицируемая информация (например, электронные письма или идентификаторы) может быть случайно отправлена сторонним моделям.</p></li>
<li><p><strong>Неконтролируемые операции:</strong> Агенты могут удалять данные или отправлять электронную почту без одобрения человека.</p></li>
</ul>
<p><strong>3. Отсутствие кросс-модельной совместимости</strong></p>
<p>Каждый провайдер LLM - OpenAI, Anthropic и многие китайские модели - реализует собственные протоколы для рассуждений и вызова инструментов. Каждый раз при смене провайдера приходилось переписывать интеграционный слой: шаблоны подсказок, адаптеры и парсеры ответов. Эта повторяющаяся работа замедляла разработку и делала эксперименты болезненными.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: Агент ReAct "все в одном<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда команда LangChain проанализировала сотни реализаций агентов производственного уровня, выяснилось, что почти все успешные агенты естественным образом сходятся к <strong>шаблону ReAct ("Reasoning + Acting")</strong>.</p>
<p>Будь то многоагентная система или одиночный агент, выполняющий глубокие рассуждения, возникает один и тот же цикл управления: чередование коротких шагов рассуждения с целенаправленными вызовами инструментов, а затем использование полученных наблюдений для принятия последующих решений, пока агент не сможет дать окончательный ответ.</p>
<p>Чтобы опираться на эту проверенную структуру, LangChain 1.0 помещает цикл ReAct в ядро своей архитектуры, делая его структурой по умолчанию для создания надежных, интерпретируемых и готовых к производству агентов.</p>
<p>Чтобы поддерживать все - от простых агентов до сложных оркестров, LangChain 1.0 использует многоуровневый дизайн, сочетающий простоту использования с точным контролем:</p>
<ul>
<li><p><strong>Стандартные сценарии:</strong> Начните с функции create_agent() - чистого, стандартизированного цикла ReAct, который обрабатывает рассуждения и вызовы инструментов из коробки.</p></li>
<li><p><strong>Расширенные сценарии:</strong> Добавьте Middleware, чтобы получить более тонкий контроль. Middleware позволяет контролировать или изменять происходящее внутри агента - например, добавлять обнаружение PII, контрольные точки одобрения человеком, автоматические повторы или крючки мониторинга.</p></li>
<li><p><strong>Сложные сценарии:</strong> Для создания рабочих процессов с определенными состояниями или оркестровки нескольких агентов используйте LangGraph, механизм выполнения на основе графов, который обеспечивает точный контроль над логическим потоком, зависимостями и состояниями выполнения.</p></li>
</ul>
<p>Теперь давайте разделим три ключевых компонента, которые делают разработку агентов более простой, безопасной и согласованной в разных моделях.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. Функция create_agent(): Более простой способ создания агентов</h3><p>Ключевой прорыв в LangChain 1.0 заключается в том, что он сводит всю сложность создания агентов к одной функции - create_agent(). Вам больше не нужно вручную управлять состоянием, обрабатывать ошибки или передавать потоковые данные. Эти функции производственного уровня теперь автоматически управляются средой выполнения LangGraph.</p>
<p>С помощью всего трех параметров вы можете запустить полностью функциональный агент:</p>
<ul>
<li><p><strong>модель</strong> - либо идентификатор модели (строка), либо инстанцированный объект модели.</p></li>
<li><p><strong>tools</strong> - список функций, которые предоставляют агенту его возможности.</p></li>
<li><p><strong>system_prompt</strong> - инструкция, определяющая роль, тон и поведение агента.</p></li>
</ul>
<p>Под капотом create_agent() работает по стандартному циклу агента - вызывает модель, позволяет ей выбрать инструменты для выполнения и завершает работу, когда инструменты больше не нужны:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Она также наследует встроенные в LangGraph возможности сохранения состояния, восстановления после прерывания и потоковой передачи данных. Задачи, которые раньше занимали сотни строк кода оркестровки, теперь решаются с помощью единого декларативного API.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. Среднее ПО: Композитный слой для управления, готового к производству</h3><p>Middleware - это ключевой мост, который переводит LangChain от прототипа к производству. Оно открывает крючки в стратегических точках цикла выполнения агента, позволяя вам добавлять пользовательскую логику без переписывания основного процесса ReAct.</p>
<p>Основной цикл агента следует трехступенчатому процессу принятия решений - Модель → Инструмент → Завершение:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 предоставляет несколько <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">готовых промежуточных модулей</a> для общих паттернов. Вот четыре примера.</p>
<ul>
<li><strong>Обнаружение PII: Любое приложение, обрабатывающее конфиденциальные данные пользователя.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Суммирование: Автоматическое обобщение истории разговоров при приближении к лимиту токенов.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Повторные вызовы инструментов: Автоматическое повторение неудачных вызовов инструментов с настраиваемым экспоненциальным отступлением.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Пользовательское промежуточное ПО</strong></li>
</ul>
<p>Помимо официальных, готовых вариантов промежуточного ПО, вы также можете создавать пользовательское промежуточное ПО, используя декораторы или классы.</p>
<p>Например, в приведенном ниже фрагменте показано, как регистрировать вызовы модели перед выполнением:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Структурированный вывод: Стандартизированный способ работы с данными</h3><p>При традиционной разработке агентов структурированным выводом всегда было сложно управлять. Каждый поставщик моделей работает с ним по-разному - например, OpenAI предлагает собственный API структурированного вывода, в то время как другие поддерживают структурированные ответы только косвенно, через вызовы инструментов. Это часто означало написание собственных адаптеров для каждого провайдера, что добавляло дополнительную работу и делало обслуживание более болезненным, чем должно быть.</p>
<p>В LangChain 1.0 структурированный вывод обрабатывается напрямую через параметр response_format в create_agent().  Вам нужно только один раз определить схему данных. LangChain автоматически выбирает наилучшую стратегию исполнения в зависимости от используемой модели - не требуется никаких дополнительных настроек или кода, специфичного для конкретного производителя.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain поддерживает две стратегии структурированного вывода:</p>
<p><strong>1. Стратегия провайдера:</strong> Некоторые провайдеры моделей поддерживают структурированный вывод через свои API (например, OpenAI и Grok). При наличии такой поддержки LangChain использует встроенную схему провайдера напрямую. Такой подход обеспечивает наивысший уровень надежности и согласованности, поскольку модель сама гарантирует формат вывода.</p>
<p><strong>2. Стратегия вызова инструмента:</strong> Для моделей, которые не поддерживают собственный структурированный вывод, LangChain использует вызов инструментов для достижения того же результата.</p>
<p>Вам не нужно беспокоиться о том, какая стратегия используется - фреймворк определяет возможности модели и адаптируется автоматически. Такая абстракция позволяет вам свободно переключаться между различными поставщиками моделей без изменения бизнес-логики.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Как Milvus улучшает память агентов<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Для агентов производственного класса реальным узким местом в производительности часто является не механизм рассуждений, а система памяти. В LangChain 1.0 векторные базы данных выступают в качестве внешней памяти агента, обеспечивая долгосрочное запоминание с помощью семантического поиска.</p>
<p><a href="https://milvus.io/">Milvus</a> - одна из самых совершенных векторных баз данных с открытым исходным кодом, созданная специально для крупномасштабного векторного поиска в приложениях ИИ. Она интегрируется с LangChain, поэтому вам не придется вручную заниматься векторизацией, управлением индексами или поиском по сходству. Пакет langchain_milvus оборачивает Milvus в стандартный интерфейс VectorStore, позволяя вам подключать его к своим агентам всего несколькими строчками кода.</p>
<p>Таким образом, Milvus решает три ключевые проблемы при создании масштабируемых и надежных систем памяти агентов:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Быстрое извлечение информации из массивных баз знаний</strong></h4><p>Когда агенту необходимо обработать тысячи документов, прошлых разговоров или руководств по продуктам, простого поиска по ключевым словам недостаточно. Milvus использует векторный поиск по сходству, чтобы найти семантически релевантную информацию за миллисекунды - даже если в запросе используются разные формулировки. Это позволяет вашему агенту вспомнить знания на основе смысла, а не только точного совпадения текста.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Постоянная долговременная память</strong></h4><p>Программное обеспечение SummarizationMiddleware от LangChain может сжать историю разговора, когда она становится слишком длинной, но что происходит со всеми деталями, которые были обобщены? Milvus сохраняет их. Каждый разговор, вызов инструмента и шаг рассуждения может быть векторизован и сохранен для долгосрочного использования. При необходимости агент может быстро извлечь нужные воспоминания с помощью семантического поиска, обеспечивая настоящую преемственность между сессиями.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Унифицированное управление мультимодальным контентом</strong></h4><p>Современные агенты работают не только с текстом - они взаимодействуют с изображениями, аудио и видео. Milvus поддерживает многовекторное хранение и динамическую схему, позволяя управлять вкраплениями из нескольких модальностей в одной системе. Это обеспечивает единую основу памяти для мультимодальных агентов, позволяя согласованно извлекать данные разных типов.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph: Как выбрать подходящий вариант для ваших агентов<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Обновление до LangChain 1.0 - важный шаг на пути к созданию агентов производственного уровня, но это не значит, что он всегда является единственным или лучшим выбором для каждого случая использования. От правильного выбора фреймворка зависит, как быстро вы сможете объединить эти возможности в работающую и поддерживаемую систему.</p>
<p>На самом деле, LangChain 1.0 и LangGraph 1.0 можно рассматривать как часть одного и того же многоуровневого стека, созданного для совместной работы, а не для замены друг друга: LangChain помогает быстро создавать стандартные агенты, а LangGraph обеспечивает тонкий контроль над сложными рабочими процессами. Другими словами, LangChain помогает двигаться быстро, а LangGraph - глубоко.</p>
<p>Ниже приведено краткое сравнение того, как они различаются по техническому позиционированию:</p>
<table>
<thead>
<tr><th><strong>Размер</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Уровень абстракции</strong></td><td>Высокоуровневая абстракция, предназначенная для стандартных агентских сценариев</td><td>Низкоуровневая структура оркестровки, предназначенная для сложных рабочих процессов</td></tr>
<tr><td><strong>Основные возможности</strong></td><td>Стандартный цикл ReAct (причина → вызов инструмента → наблюдение → ответ)</td><td>Пользовательские машины состояний и сложная логика ветвления (StateGraph + условная маршрутизация)</td></tr>
<tr><td><strong>Механизм расширения</strong></td><td>Среднее программное обеспечение для возможностей производственного уровня</td><td>Ручное управление узлами, ребрами и переходами состояний</td></tr>
<tr><td><strong>Базовая реализация</strong></td><td>Ручное управление узлами, ребрами и переходами состояний</td><td>Нативная среда выполнения со встроенными функциями сохранения и восстановления</td></tr>
<tr><td><strong>Типичные сценарии использования</strong></td><td>80 % стандартных агентских сценариев</td><td>Совместная работа нескольких агентов и оркестровка длительных рабочих процессов</td></tr>
<tr><td><strong>Кривая обучения</strong></td><td>Создание агента за ~10 строк кода</td><td>Требуется понимание графов состояний и оркестровки узлов</td></tr>
</tbody>
</table>
<p>Если вы новичок в создании агентов или хотите быстро запустить проект, начните с LangChain. Если вы уже знаете, что ваш сценарий использования требует сложной оркестровки, совместной работы нескольких агентов или длительных рабочих процессов, переходите сразу к LangGraph.</p>
<p>Оба фреймворка могут сосуществовать в одном проекте - вы можете начать с LangChain и перейти на LangGraph, когда вашей системе потребуется больше контроля и гибкости. Главное - выбрать правильный инструмент для каждой части вашего рабочего процесса.</p>
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
    </button></h2><p>Три года назад LangChain начинался как легкая обертка для вызова LLM. Сегодня он превратился в полноценный фреймворк производственного уровня.</p>
<p>В основе лежат промежуточные слои, обеспечивающие безопасность, соответствие и наблюдаемость. LangGraph добавляет постоянное выполнение, поток управления и управление состоянием. А на уровне памяти <a href="https://milvus.io/">Milvus</a> заполняет критический пробел, обеспечивая масштабируемую, надежную долговременную память, которая позволяет агентам извлекать контекст, рассуждать об истории и совершенствоваться с течением времени.</p>
<p>Вместе LangChain, LangGraph и Milvus образуют практичный инструментарий для современной эры агентов, позволяющий быстро создавать прототипы и развертывать их в масштабах предприятия, не жертвуя надежностью и производительностью.</p>
<p>🚀 Готовы обеспечить своему агенту надежную и долговременную память? Изучите <a href="https://milvus.io">Milvus</a> и узнайте, как он обеспечивает интеллектуальную долговременную память для агентов LangChain в производстве.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции? Присоединяйтесь к нашему <a href="https://discord.com/invite/8uyFbECzPX">каналу Discord</a> или создавайте проблемы на <a href="https://github.com/milvus-io/milvus">GitHub</a>. Вы также можете забронировать 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы в <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
