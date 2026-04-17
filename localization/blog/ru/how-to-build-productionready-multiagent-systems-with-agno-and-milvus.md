---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: >-
  Как создавать готовые к производству мультиагентные системы с помощью Agno и
  Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Узнайте, как создавать, развертывать и масштабировать готовые к производству
  мультиагентные системы с помощью Agno, AgentOS и Milvus для реальных рабочих
  нагрузок.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Если вы занимаетесь созданием агентов искусственного интеллекта, то наверняка сталкивались с такой проблемой: демонстрация работает отлично, но внедрение в производство - совсем другая история.</p>
<p>Мы уже рассказывали об управлении памятью агента и реранжировании в предыдущих постах. Теперь давайте рассмотрим более серьезную задачу - создание агентов, которые действительно будут работать в производстве.</p>
<p>Реальность такова: производственные среды беспорядочны. Одиночный агент редко справляется с этой задачей, поэтому повсеместно используются мультиагентные системы. Но доступные сегодня фреймворки, как правило, делятся на два лагеря: легковесные, которые хорошо работают, но ломаются под реальной нагрузкой, или мощные, на изучение и создание которых уходит целая вечность.</p>
<p>В последнее время я экспериментировал с <a href="https://github.com/agno-agi/agno">Agno</a>, и, похоже, он представляет собой разумную золотую середину, ориентированную на готовность к производству без чрезмерной сложности. За несколько месяцев проект набрал более 37 000 звезд на GitHub, что говорит о том, что другие разработчики тоже находят его полезным.</p>
<p>В этом посте я поделюсь тем, что узнал, создавая мультиагентную систему с использованием Agno и <a href="https://milvus.io/">Milvus</a> в качестве слоя памяти. Мы рассмотрим, как Agno сравнивается с альтернативами, такими как LangGraph, и пройдемся по полной реализации, которую вы можете попробовать сами.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Что такое Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> - это мультиагентный фреймворк, созданный специально для использования в производстве. Он состоит из двух отдельных уровней:</p>
<ul>
<li><p><strong>Слой фреймворка Agno</strong>: где вы определяете логику работы агентов.</p></li>
<li><p><strong>Уровень среды выполнения AgentOS</strong>: Превращает эту логику в HTTP-сервисы, которые вы можете развернуть.</p></li>
</ul>
<p>Подумайте об этом так: фреймворк определяет <em>, что</em> должны делать ваши агенты, а AgentOS управляет <em>тем, как</em> эта работа выполняется и обслуживается.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">Уровень фреймворка</h3><p>Это то, с чем вы непосредственно работаете. Он представляет три основные концепции:</p>
<ul>
<li><p><strong>Агент</strong>: обрабатывает определенный тип задач.</p></li>
<li><p><strong>Команда</strong>: Координирует работу нескольких агентов для решения сложных задач</p></li>
<li><p><strong>Рабочий процесс</strong>: Определяет порядок и структуру выполнения.</p></li>
</ul>
<p>Одна вещь, которую я оценил: вам не нужно изучать новый DSL или рисовать блок-схемы. Поведение агента определяется с помощью стандартных вызовов функций Python. Фреймворк обрабатывает вызовы LLM, выполнение инструментов и управление памятью.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">Уровень выполнения AgentOS</h3><p>AgentOS рассчитан на большие объемы запросов благодаря асинхронному исполнению, а его архитектура без статических данных делает масштабирование простым.</p>
<p>Ключевые особенности включают:</p>
<ul>
<li><p>Встроенная интеграция FastAPI для представления агентов в виде конечных точек HTTP.</p></li>
<li><p>Управление сеансами и потоковые ответы</p></li>
<li><p>Конечные точки мониторинга</p></li>
<li><p>Поддержка горизонтального масштабирования</p></li>
</ul>
<p>На практике AgentOS выполняет большую часть работы по созданию инфраструктуры, что позволяет вам сосредоточиться на логике работы агента.</p>
<p>Высокоуровневый вид архитектуры Agno показан ниже.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno в сравнении с LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы понять, в чем суть Agno, давайте сравним его с LangGraph - одним из самых распространенных мультиагентных фреймворков.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> использует машину состояний на основе графов. Вы моделируете весь рабочий процесс агента в виде графа: шаги - узлы, пути выполнения - ребра. Это хорошо работает, когда ваш процесс фиксирован и строго упорядочен. Но для открытых или разговорных сценариев это может показаться ограничивающим. По мере того как взаимодействия становятся все более динамичными, поддерживать чистоту графа становится все сложнее.</p>
<p><strong>Agno</strong> использует другой подход. Вместо того чтобы быть чисто оркестровым слоем, это сквозная система. Определите поведение агента, и AgentOS автоматически представит его в виде готового к производству HTTP-сервиса с поддержкой мониторинга, масштабирования и многооборотного взаимодействия. Никаких отдельных API-шлюзов, никакого управления сеансами, никаких дополнительных инструментов для работы.</p>
<p>Вот краткое сравнение:</p>
<table>
<thead>
<tr><th>Dimension</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Модель оркестровки</td><td>Явное определение графа с помощью узлов и ребер</td><td>Декларативные рабочие процессы, определяемые на языке Python</td></tr>
<tr><td>Управление состояниями</td><td>Пользовательские классы состояний, определяемые и управляемые разработчиками</td><td>Встроенная система памяти</td></tr>
<tr><td>Отладка и наблюдаемость</td><td>LangSmith (платный)</td><td>AgentOS UI (с открытым исходным кодом)</td></tr>
<tr><td>Модель времени выполнения</td><td>Интегрируется в существующую среду выполнения</td><td>Автономный сервис на основе FastAPI</td></tr>
<tr><td>Сложность развертывания</td><td>Требуется дополнительная настройка через LangServe</td><td>Работает из коробки</td></tr>
</tbody>
</table>
<p>LangGraph обеспечивает большую гибкость и тонкий контроль. Agno оптимизирует время выхода на рынок. Правильный выбор зависит от стадии проекта, существующей инфраструктуры и уровня необходимой вам кастомизации. Если вы не уверены в выборе, проведите небольшую пробную версию обоих решений - это, вероятно, самый надежный способ принять решение.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Выбор Milvus для слоя памяти агента<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>После того как вы выбрали фреймворк, необходимо решить, как хранить память и знания. Мы используем для этого Milvus. <a href="https://milvus.io/">Milvus</a> - самая популярная векторная база данных с открытым исходным кодом, созданная для рабочих нагрузок ИИ и имеющая более <a href="https://github.com/milvus-io/milvus">42 000+</a> звезд <a href="https://github.com/milvus-io/milvus">на GitHub</a>.</p>
<p><strong>Agno имеет встроенную поддержку Milvus.</strong> Модуль <code translate="no">agno.vectordb.milvus</code> включает в себя такие производственные функции, как управление соединениями, автоматические повторные попытки, пакетная запись и генерация вложений. Вам не нужно создавать пулы соединений или самостоятельно справляться с сетевыми сбоями - несколько строк Python предоставят вам рабочий слой векторной памяти.</p>
<p><strong>Milvus масштабируется в зависимости от ваших потребностей.</strong> Он поддерживает три <a href="https://milvus.io/docs/install-overview.md">режима развертывания:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Легкий, файловый - отлично подходит для локальной разработки и тестирования.</p></li>
<li><p><strong>Standalone</strong>: Односерверное развертывание для производственных рабочих нагрузок</p></li>
<li><p><strong>Распределенный</strong>: Полный кластер для высокомасштабных сценариев</p></li>
</ul>
<p>Вы можете начать с Milvus Lite для локальной проверки памяти агента, а затем перейти к автономной или распределенной версии по мере роста трафика, не меняя код приложения. Такая гибкость особенно полезна, когда вы быстро проводите итерации на ранних этапах, но в дальнейшем вам нужен четкий путь к масштабированию.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Шаг за шагом: Создание готового к производству агента Agno с помощью Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте создадим готового к производству агента с нуля.</p>
<p>Мы начнем с простого примера с одним агентом, чтобы показать весь рабочий процесс. Затем мы расширим его до многоагентной системы. AgentOS автоматически упакует все в виде вызываемого HTTP-сервиса.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Развертывание Milvus Standalone с помощью Docker</h3><p><strong>(1) Загрузите файлы развертывания</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Запустите службу Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Внедрение ядра</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Запуск агента</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Подключение к консоли AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Создайте учетную запись и войдите в систему</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Подключите своего агента к AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Настройте открытый порт и имя агента</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Добавьте документы и проиндексируйте их в Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Протестируйте агента от конца к концу</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В этой системе Milvus выполняет высокопроизводительный семантический поиск. Когда помощник базы знаний получает технический вопрос, он вызывает инструмент <code translate="no">search_knowledge</code> для встраивания запроса, извлекает наиболее релевантные фрагменты документов из Milvus и использует эти результаты в качестве основы для своего ответа.</p>
<p>Milvus предлагает три варианта развертывания, что позволяет вам выбрать архитектуру, соответствующую вашим операционным требованиям, сохраняя при этом единство API на уровне приложений во всех режимах развертывания.</p>
<p>В демонстрационном примере выше показан основной поток получения и генерации данных. Однако, чтобы перенести этот проект в производственную среду, необходимо более подробно обсудить несколько архитектурных аспектов.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Как результаты поиска передаются агентам<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>В командном режиме Agno есть опция <code translate="no">share_member_interactions=True</code>, которая позволяет последующим агентам наследовать всю историю взаимодействия с предыдущими агентами. На практике это означает, что когда первый агент получает информацию из Milvus, последующие агенты могут повторно использовать эти результаты, а не запускать тот же поиск снова.</p>
<ul>
<li><p><strong>Плюсы:</strong> Расходы на поиск амортизируются на всю команду. Один векторный поиск поддерживает несколько агентов, сокращая количество избыточных запросов.</p></li>
<li><p><strong>Недостатки:</strong> Качество поиска ухудшается. Если первоначальный поиск возвращает неполные или неточные результаты, эта ошибка распространяется на всех агентов, которые от него зависят.</p></li>
</ul>
<p>Вот почему точность поиска имеет еще большее значение в многоагентных системах. Плохой поиск не только ухудшает реакцию одного агента - он влияет на всю команду.</p>
<p>Вот пример работы команды:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Почему Agno и Milvus расположены отдельно друг от друга<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой архитектуре <strong>Agno</strong> находится на уровне диалогов и оркестровки. Она отвечает за управление диалоговым потоком, координацию агентов и поддержание состояния разговора, а история сеансов хранится в реляционной базе данных. Фактические знания о домене системы - например, документация о продукте и технические отчеты - обрабатываются отдельно и хранятся в виде векторных вкраплений в <strong>Milvus</strong>. Благодаря такому четкому разделению логика разговора и хранение знаний полностью разделены.</p>
<p>Почему это важно с практической точки зрения:</p>
<ul>
<li><p><strong>Независимое масштабирование</strong>: По мере роста спроса на Agno добавляйте новые экземпляры Agno. По мере роста объема запросов расширяйте Milvus, добавляя узлы запросов. Каждый уровень масштабируется изолированно.</p></li>
<li><p><strong>Разные потребности в аппаратном обеспечении</strong>: Agno ограничен процессором и памятью (вывод LLM, выполнение рабочих процессов). Milvus оптимизирован для высокопроизводительного векторного поиска (дисковый ввод-вывод, иногда GPU-ускорение). Их разделение предотвращает нехватку ресурсов.</p></li>
<li><p><strong>Оптимизация затрат</strong>: Вы можете настраивать и выделять ресурсы для каждого слоя независимо друг от друга.</p></li>
</ul>
<p>Такой многоуровневый подход позволяет получить более эффективную, отказоустойчивую и готовую к производству архитектуру.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Что нужно отслеживать при использовании Agno с Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno имеет встроенные возможности оценки, но добавление Milvus расширяет круг задач, за которыми необходимо следить. Основываясь на нашем опыте, сосредоточьтесь на трех областях:</p>
<ul>
<li><p><strong>Качество поиска</strong>: Действительно ли документы, которые возвращает Milvus, релевантны запросу или просто поверхностно похожи на векторном уровне?</p></li>
<li><p><strong>Верность ответа</strong>: Основан ли конечный ответ на полученном контенте, или LLM генерирует неподтвержденные утверждения?</p></li>
<li><p><strong>Разбивка сквозной задержки</strong>: Не просто отслеживайте общее время ответа. Разбейте его на этапы: генерация вставки, поиск вектора, сборка контекста, вывод LLM - так вы сможете определить, где происходят замедления.</p></li>
</ul>
<p><strong>Практический пример:</strong> Когда ваша коллекция Milvus увеличивается с 1 млн до 10 млн векторов, вы можете заметить, что задержка поиска увеличивается. Обычно это сигнал к тому, что необходимо изменить параметры индекса (например, <code translate="no">nlist</code> и <code translate="no">nprobe</code>) или рассмотреть возможность перехода от автономного к распределенному развертыванию.</p>
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
    </button></h2><p>Для создания готовых к производству агентских систем требуется нечто большее, чем просто соединить воедино вызовы LLM и демонстрационные образцы поиска. Вам нужны четкие архитектурные границы, инфраструктура, которая масштабируется независимо, и наблюдаемость для раннего обнаружения проблем.</p>
<p>В этом посте я рассказал о том, как Agno и Milvus могут работать вместе: Agno для мультиагентной оркестровки, Milvus для масштабируемой памяти и семантического поиска. Разделяя эти слои, вы можете переходить от прототипа к производству без переписывания основной логики и масштабировать каждый компонент по мере необходимости.</p>
<p>Если вы экспериментируете с подобными системами, мне было бы интересно узнать, что у вас получилось.</p>
<p><strong>Есть вопросы о Milvus?</strong> Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу в Slack</a> или запишитесь на 20-минутную сессию <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
