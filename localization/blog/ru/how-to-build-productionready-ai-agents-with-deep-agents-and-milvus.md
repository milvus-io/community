---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: >-
  Как создавать готовые к производству агенты искусственного интеллекта с
  помощью Deep Agents и Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Узнайте, как создать масштабируемые агенты искусственного интеллекта с помощью
  Deep Agents и Milvus для выполнения длительных задач, снижения стоимости
  токенов и постоянной памяти.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Все больше команд создают агентов ИИ, и задачи, которые они ставят перед ними, становятся все сложнее. Многие реальные рабочие процессы включают в себя длительные задания, состоящие из нескольких этапов и множества вызовов инструментов. По мере роста числа таких задач быстро возникают две проблемы: повышение стоимости токенов и ограничение контекстного окна модели. Кроме того, агентам часто требуется запоминать информацию в течение нескольких сессий, например результаты прошлых исследований, предпочтения пользователей или предыдущие разговоры.</p>
<p>Такие фреймворки, как <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, выпущенные компанией LangChain, помогают организовать эти рабочие процессы. Он предоставляет структурированный способ запуска агентов с поддержкой планирования задач, доступа к файлам и делегирования полномочий субагентам. Это облегчает создание агентов, которые могут более надежно справляться с длинными многоэтапными задачами.</p>
<p>Но одних рабочих процессов недостаточно. Агентам также нужна <strong>долговременная память</strong>, чтобы они могли извлекать полезную информацию из предыдущих сессий. Именно здесь на помощь приходит <a href="https://milvus.io/"><strong>Milvus</strong></a>, векторная база данных с открытым исходным кодом. Храня в себе вкрапления разговоров, документов и результатов работы инструментов, Milvus позволяет агентам искать и вспоминать прошлые знания.</p>
<p>В этой статье мы объясним, как работает Deep Agents, и покажем, как объединить его с Milvus для создания ИИ-агентов со структурированными рабочими процессами и долговременной памятью.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Что такое Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> - это фреймворк для агентов с открытым исходным кодом, созданный командой LangChain. Он призван помочь агентам более надежно справляться с длительными многоэтапными задачами. Он фокусируется на трех основных возможностях:</p>
<p><strong>1. Планирование задач</strong></p>
<p>В Deep Agents встроены такие инструменты, как <code translate="no">write_todos</code> и <code translate="no">read_todos</code>. Агент разбивает сложную задачу на четкий список дел, затем пошагово выполняет каждый пункт, отмечая задачи как выполненные.</p>
<p><strong>2. Доступ к файловой системе</strong></p>
<p>С помощью таких инструментов, как <code translate="no">ls</code>, <code translate="no">read_file</code> и <code translate="no">write_file</code>, агент может просматривать, читать и записывать файлы. Если инструмент выдает большой результат, то он автоматически сохраняется в файл, а не остается в контекстном окне модели. Это помогает предотвратить заполнение контекстного окна.</p>
<p><strong>3. Делегирование полномочий субагентам</strong></p>
<p>Используя инструмент <code translate="no">task</code>, главный агент может передавать подзадачи специализированным субагентам. У каждого субагента есть собственное контекстное окно и инструменты, что помогает организовать работу.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Технически агент, созданный с помощью <code translate="no">create_deep_agent</code>, представляет собой скомпилированный <strong>LangGraph StateGraph</strong>. (LangGraph - это библиотека рабочих процессов, разработанная командой LangChain, а StateGraph - это ее основная структура состояний). Благодаря этому Deep Agents могут напрямую использовать такие возможности LangGraph, как потоковый вывод, контрольные точки и взаимодействие "человек в цикле".</p>
<p><strong>Что же делает Deep Agents полезными на практике?</strong></p>
<p>Долгоиграющие агентские задачи часто сталкиваются с такими проблемами, как ограничение контекста, высокая стоимость токенов и ненадежность выполнения. Deep Agents помогает решить эти проблемы, делая рабочие процессы агентов более структурированными и простыми в управлении. Сокращение ненужного роста контекста снижает расход токенов и делает длительные задачи более экономичными.</p>
<p>Кроме того, с его помощью легче организовать сложные многоэтапные задачи. Подзадачи могут выполняться независимо, не мешая друг другу, что повышает надежность. В то же время система гибкая, что позволяет разработчикам настраивать и расширять ее по мере того, как их агенты превращаются из простых экспериментов в производственные приложения.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Кастомизация в глубоких агентах<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Общий фреймворк не может охватить все отрасли или потребности бизнеса. Deep Agents спроектирован гибким, поэтому разработчики могут настраивать его в соответствии с собственными сценариями использования.</p>
<p>С помощью кастомизации вы можете:</p>
<ul>
<li><p>Подключать собственные внутренние инструменты и API</p></li>
<li><p>Определять рабочие процессы, специфичные для конкретной области</p></li>
<li><p>Обеспечить соблюдение агентом бизнес-правил</p></li>
<li><p>Поддерживать память и обмен знаниями между сеансами.</p></li>
</ul>
<p>Вот основные способы настройки агентов Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Настройка системной подсказки</h3><p>Вы можете добавить собственную системную подсказку поверх инструкций по умолчанию, предоставляемых промежуточным ПО. Это полезно для определения правил домена и рабочих процессов.</p>
<p>Хорошая пользовательская подсказка может включать:</p>
<ul>
<li><strong>Правила рабочего процесса домена</strong></li>
</ul>
<p>Пример: "Для задач анализа данных всегда выполняйте исследовательский анализ перед построением модели".</p>
<ul>
<li><strong>Конкретные примеры</strong></li>
</ul>
<p>Пример: "Объединить похожие запросы на поиск литературы в один пункт todo".</p>
<ul>
<li><strong>Правила остановки</strong></li>
</ul>
<p>Пример: "Остановиться, если использовано более 100 вызовов инструментов".</p>
<ul>
<li><strong>Руководство по координации инструментов</strong></li>
</ul>
<p>Пример: "Используйте <code translate="no">grep</code> для поиска местоположения кода, затем используйте <code translate="no">read_file</code> для просмотра деталей".</p>
<p>Избегайте повторения инструкций, которые уже обрабатывает промежуточное ПО, и не добавляйте правила, противоречащие поведению по умолчанию.</p>
<h3 id="Tools" class="common-anchor-header">Инструменты</h3><p>Вы можете добавить свои собственные инструменты к встроенному набору инструментов. Инструменты определяются как обычные функции Python, а в их документах описывается, что они делают.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents также поддерживает инструменты, которые следуют стандарту Model Context Protocol (MCP) через <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Промежуточное ПО</h3><p>Вы можете написать пользовательское промежуточное ПО, чтобы:</p>
<ul>
<li><p>Добавлять или изменять инструменты</p></li>
<li><p>настраивать подсказки</p></li>
<li><p>подключаться к различным этапам выполнения агента.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents также включает встроенное промежуточное ПО для планирования, управления субагентами и контроля выполнения.</p>
<table>
<thead>
<tr><th>Промежуточное ПО</th><th>Функция</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Предоставляет инструменты write_todos и read_todos для управления списками задач</td></tr>
<tr><td>FilesystemMiddleware</td><td>Предоставляет инструменты для работы с файлами и автоматически сохраняет большие результаты работы инструментов</td></tr>
<tr><td>SubAgentMiddleware</td><td>Предоставляет инструмент задачи для делегирования работы субагентам</td></tr>
<tr><td>SummarizationMiddleware</td><td>Автоматически подводит итоги, когда контекст превышает 170 тыс. лексем</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Включает кэширование подсказок для моделей Anthropic</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Исправляет неполные вызовы инструментов, вызванные прерываниями</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Настраивает инструменты, требующие одобрения человека</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Субагенты</h3><p>Главный агент может делегировать подзадачи субагентам с помощью инструмента <code translate="no">task</code>. Каждый субагент запускается в собственном контекстном окне и имеет собственные инструменты и системную подсказку.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Для продвинутых случаев использования можно даже передать в качестве субагента предварительно созданный рабочий процесс LangGraph.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Контроль одобрения человеком)</h3><p>Вы можете указать определенные инструменты, требующие одобрения человека, с помощью параметра <code translate="no">interrupt_on</code>. Когда агент вызывает один из таких инструментов, выполнение приостанавливается до тех пор, пока человек не просмотрит и не утвердит его.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Настройка бэкэнда (хранение)</h3><p>Вы можете выбрать различные бэкенды хранения, чтобы контролировать работу с файлами. В настоящее время доступны следующие варианты:</p>
<ul>
<li><p><strong>StateBackend</strong> (временное хранилище)</p></li>
<li><p><strong>FilesystemBackend</strong> (локальное дисковое хранилище).</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Изменяя бэкенд, вы можете настроить поведение файлового хранилища без изменения общего дизайна системы.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Почему стоит использовать Deep Agents с Milvus для агентов искусственного интеллекта?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>В реальных приложениях агентам часто требуется память, которой хватает на все сеансы работы. Например, им может потребоваться запоминать предпочтения пользователей, накапливать знания о домене с течением времени, записывать обратную связь для корректировки поведения или отслеживать долгосрочные исследовательские задачи.</p>
<p>По умолчанию Deep Agents использует <code translate="no">StateBackend</code>, который хранит данные только в течение одной сессии. Когда сессия заканчивается, все данные очищаются. Это означает, что он не может поддерживать долгосрочную межсессионную память.</p>
<p>Чтобы обеспечить постоянную память, мы используем <a href="https://milvus.io/"><strong>Milvus</strong></a> в качестве векторной базы данных вместе с <code translate="no">StoreBackend</code>. Вот как это работает: важное содержание разговора и результаты работы инструментов преобразуются в эмбеддинги (числовые векторы, отражающие смысл) и сохраняются в Milvus. Когда начинается новая задача, агент выполняет семантический поиск для извлечения связанных с ней прошлых воспоминаний. Это позволяет агенту "вспомнить" соответствующую информацию из предыдущих сессий.</p>
<p>Milvus хорошо подходит для этого варианта использования благодаря своей архитектуре разделения вычислений и хранения данных. Она поддерживает:</p>
<ul>
<li><p>Горизонтальное масштабирование до десятков миллиардов векторов</p></li>
<li><p>Высокоскоростные запросы</p></li>
<li><p>Обновление данных в реальном времени</p></li>
<li><p>Готовое к производству развертывание для крупномасштабных систем</p></li>
</ul>
<p>Технически Deep Agents использует <code translate="no">CompositeBackend</code> для маршрутизации различных путей к различным бэкендам хранения:</p>
<table>
<thead>
<tr><th>Путь</th><th>Бэкенд</th><th>Назначение</th></tr>
</thead>
<tbody>
<tr><td>/workspace/, /temp/</td><td>StateBackend</td><td>Временные данные, очищаемые после завершения сеанса</td></tr>
<tr><td>/memories/, /knowledge/</td><td>StoreBackend + Milvus</td><td>Постоянные данные, доступные для поиска во всех сессиях</td></tr>
</tbody>
</table>
<p>При такой настройке разработчикам нужно сохранять только долгосрочные данные по путям типа <code translate="no">/memories/</code>. Система автоматически обрабатывает межсессионную память. Подробные шаги по настройке приведены в разделе ниже.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Практическое занятие: Создание ИИ-агента с долговременной памятью с помощью Milvus и Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом примере показано, как предоставить агенту на базе DeepAgents постоянную память с помощью Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Шаг 1: Установите зависимости</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Шаг 2: Настройте бэкэнд памяти</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Шаг 3: Создайте агента</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ключевые моменты</strong></p>
<ul>
<li><strong>Постоянный путь</strong></li>
</ul>
<p>Любые файлы, сохраненные по адресу <code translate="no">/memories/</code>, будут храниться постоянно, и к ним можно будет обращаться в разных сессиях.</p>
<ul>
<li><strong>Производственная настройка</strong></li>
</ul>
<p>В примере используется <code translate="no">InMemoryStore()</code> для тестирования. В производстве замените его адаптером Milvus, чтобы обеспечить масштабируемый семантический поиск.</p>
<ul>
<li><strong>Автоматическая память</strong></li>
</ul>
<p>Агент автоматически сохраняет результаты исследований и важные результаты в папке <code translate="no">/memories/</code>. В последующих задачах он может искать и извлекать соответствующую прошлую информацию.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Обзор встроенных инструментов<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents включает в себя несколько встроенных инструментов, предоставляемых через промежуточное ПО. Они делятся на три основные группы:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Управление задачами (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Создает структурированный список дел. Каждая задача может содержать описание, приоритет и зависимости.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Показывает текущий список дел, включая завершенные и ожидающие выполнения задачи.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Инструменты файловой системы (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Перечисляет файлы в каталоге. Должен использоваться абсолютный путь (начиная с <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Читает содержимое файлов. Поддерживает <code translate="no">offset</code> и <code translate="no">limit</code> для больших файлов.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Создает или перезаписывает файл.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Заменяет определенный текст в файле.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Находит файлы по шаблонам, например <code translate="no">**/*.py</code> для поиска всех файлов Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Поиск текста внутри файлов.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Выполняет команды оболочки в среде "песочницы". Требуется, чтобы бэкенд поддерживал <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Делегирование субагента (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Отправляет подзадачу определенному субагенту. Вы указываете имя субагента и описание задачи.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Как обрабатываются выходные данные инструментов</h3><p>Если инструмент выдает большой результат, Deep Agents автоматически сохраняет его в файл.</p>
<p>Например, если <code translate="no">internet_search</code> возвращает 100 КБ содержимого, система сохраняет его в файл типа <code translate="no">/tool_results/internet_search_1.txt</code>. Агент сохраняет в своем контексте только путь к файлу. Это сокращает использование токенов и уменьшает размер контекстного окна.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents против Agent Builder: Когда следует использовать каждый из них?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Поскольку эта статья посвящена DeepAgents, полезно также понять, как они соотносятся с</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, еще одним вариантом создания агентов в экосистеме LangChain.</em></p>
<p>LangChain предлагает несколько способов создания агентов ИИ, и выбор лучшего варианта обычно зависит от того, насколько вы хотите контролировать систему.</p>
<p><strong>DeepAgents</strong> предназначен для создания автономных агентов, выполняющих длительные многоэтапные задачи. Он дает разработчикам полный контроль над тем, как агент планирует задачи, использует инструменты и управляет памятью. Поскольку он построен на LangGraph, вы можете настраивать компоненты, интегрировать инструменты Python и изменять бэкэнд хранения данных. Благодаря этому DeepAgents хорошо подходит для сложных рабочих процессов и производственных систем, где важны надежность и гибкость.</p>
<p><strong>Agent Builder</strong>, напротив, сосредоточен на простоте использования. Он скрывает большинство технических деталей, поэтому вы можете быстро описать агента, добавить инструменты и запустить его. Расход памяти, использование инструментов и шаги по утверждению агента человеком выполняются автоматически. Это делает Agent Builder полезным для быстрых прототипов, внутренних инструментов или ранних экспериментов.</p>
<p><strong>Agent Builder и DeepAgents - это не отдельные системы, а часть одного стека.</strong> Agent Builder построен поверх DeepAgents. Многие команды начинают с Agent Builder для тестирования идей, а затем переходят на DeepAgents, когда им требуется больше контроля. Рабочие процессы, созданные в DeepAgents, также можно превратить в шаблоны Agent Builder, чтобы другие могли легко их использовать.</p>
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
    </button></h2><p>Deep Agents упрощает управление сложными рабочими процессами агентов, используя три основные идеи: планирование задач, хранение файлов и делегирование полномочий субагентам. Эти механизмы превращают беспорядочные многоэтапные процессы в структурированные рабочие процессы. В сочетании с Milvus для векторного поиска агент также может сохранять долгосрочную память в течение нескольких сессий.</p>
<p>Для разработчиков это означает снижение затрат на токены и более надежную систему, которая может масштабироваться от простой демонстрации до производственной среды.</p>
<p>Если вы создаете агентов искусственного интеллекта, которым нужны структурированные рабочие процессы и реальная долговременная память, мы будем рады пообщаться с вами.</p>
<p>У вас есть вопросы о Deep Agents или использовании Milvus в качестве бэкенда постоянной памяти? Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу в Slack</a> или запишитесь на 20-минутную сессию <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы обсудить ваш вариант использования.</p>
