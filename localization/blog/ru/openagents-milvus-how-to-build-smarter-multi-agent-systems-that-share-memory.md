---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: как создавать более умные мультиагентные системы с общей
  памятью
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Узнайте, как OpenAgents обеспечивает распределенное взаимодействие нескольких
  агентов, почему Milvus необходим для добавления масштабируемой памяти и как
  построить полноценную систему.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>Большинство разработчиков начинают свои агентные системы с одного агента и только потом понимают, что, по сути, создали очень дорогой чатбот. Для простых задач агент в стиле ReAct работает хорошо, но быстро наступает предел: он не может выполнять шаги параллельно, теряет контроль над длинными цепочками рассуждений и имеет тенденцию разваливаться, как только вы добавляете слишком много инструментов. Многоагентные системы обещают решить эту проблему, но они несут свои собственные проблемы: накладные расходы на координацию, хрупкие передачи и раздувающийся общий контекст, который незаметно снижает качество модели.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> - это фреймворк с открытым исходным кодом для создания мультиагентных систем, в которых агенты ИИ работают вместе, делятся ресурсами и решают долгосрочные проекты в рамках постоянных сообществ. Вместо единого центрального организатора OpenAgents позволяет агентам сотрудничать более распределенным образом: они могут обнаруживать друг друга, общаться и координироваться вокруг общих целей.</p>
<p>В сочетании с векторной базой данных <a href="https://milvus.io/">Milvus</a> этот конвейер получает масштабируемый и высокопроизводительный слой долговременной памяти. Milvus обеспечивает память агентов быстрым семантическим поиском, гибкими вариантами индексирования, такими как HNSW и IVF, и чистой изоляцией с помощью разбиения на разделы, так что агенты могут хранить, извлекать и повторно использовать знания, не утопая в контексте и не наступая на данные друг друга.</p>
<p>В этом посте мы расскажем, как OpenAgents обеспечивает распределенное мультиагентное взаимодействие, почему Milvus является критической основой для масштабируемой памяти агентов, и как собрать такую систему шаг за шагом.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Проблемы создания агентных систем реального мира<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Многие современные агентные фреймворки - LangChain, AutoGen, CrewAI и другие - построены на модели <strong>, ориентированной на выполнение задач</strong>. Вы запускаете набор агентов, даете им задание, возможно, определяете рабочий процесс, и они начинают работать. Это хорошо подходит для узких или недолговечных случаев использования, но в реальных производственных средах это приводит к трем структурным ограничениям:</p>
<ul>
<li><p><strong>Знания остаются разрозненными.</strong> Опыт агента ограничивается его собственным развертыванием. Агент, проверяющий код в инженерном отделе, не делится своими знаниями с агентом команды разработчиков продукта, оценивающим целесообразность. В итоге каждой команде приходится восстанавливать знания с нуля, что неэффективно и хрупко.</p></li>
<li><p><strong>Сотрудничество негибкое.</strong> Даже в мультиагентных системах сотрудничество обычно зависит от рабочих процессов, определенных заранее. Когда сотрудничество должно измениться, эти статичные правила не могут адаптироваться, что делает всю систему менее гибкой.</p></li>
<li><p><strong>Отсутствие постоянного состояния.</strong> Большинство агентов следуют простому жизненному циклу: <em>запуск → выполнение → завершение работы.</em> Между циклами они забывают обо всем - о контексте, отношениях, принятых решениях и истории взаимодействия. Без постоянного состояния агенты не могут создать долгосрочную память или изменить свое поведение.</p></li>
</ul>
<p>Эти структурные проблемы возникают из-за того, что агенты рассматриваются как изолированные исполнители задач, а не как участники более широкой сети сотрудничества.</p>
<p>Команда OpenAgents считает, что будущие агентные системы нуждаются не только в более сильных рассуждениях - им нужен механизм, позволяющий агентам обнаруживать друг друга, строить отношения, обмениваться знаниями и динамически работать вместе. И что очень важно, это не должно зависеть от одного центрального контроллера. Интернет работает потому, что он распределен - ни один узел не диктует все, и система становится более надежной и масштабируемой по мере ее роста. Мультиагентные системы выигрывают от того же принципа проектирования. Именно поэтому OpenAgents отказывается от идеи всемогущего организатора и вместо этого обеспечивает децентрализованное, управляемое сетью сотрудничество.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">Что такое OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents - это фреймворк с открытым исходным кодом для создания сетей агентов ИИ, который обеспечивает открытое сотрудничество, где агенты ИИ работают вместе, делятся ресурсами и решают долгосрочные проекты. Она обеспечивает инфраструктуру для Интернета агентов - где агенты открыто сотрудничают с миллионами других агентов в постоянных, растущих сообществах. На техническом уровне система состоит из трех основных компонентов: <strong>Сеть агентов, сетевые моды и транспорты.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Сеть агентов: Общая среда для совместной работы</h3><p>Агентская сеть - это общая среда, в которой несколько агентов могут подключаться, общаться и работать вместе для решения сложных задач. Ее основные характеристики включают:</p>
<ul>
<li><p><strong>Постоянная работа:</strong> Созданная однажды, сеть остается в режиме онлайн независимо от отдельной задачи или рабочего процесса.</p></li>
<li><p><strong>Динамический агент:</strong> Агенты могут присоединиться к сети в любой момент, используя идентификатор сети; предварительная регистрация не требуется.</p></li>
<li><p><strong>Поддержка нескольких протоколов:</strong> Унифицированный уровень абстракции поддерживает взаимодействие через WebSocket, gRPC, HTTP и libp2p.</p></li>
<li><p><strong>Автономная конфигурация:</strong> Каждая сеть поддерживает свои собственные разрешения, управление и ресурсы.</p></li>
</ul>
<p>Всего одна строка кода позволяет создать Сеть, и любой агент может немедленно присоединиться к ней через стандартные интерфейсы.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Сетевые модули: Подключаемые расширения для совместной работы</h3><p>Модули обеспечивают модульный уровень функций совместной работы, который остается независимым от основной системы. Вы можете смешивать и сочетать модули в зависимости от ваших конкретных потребностей, обеспечивая шаблоны совместной работы, адаптированные к каждому случаю использования.</p>
<table>
<thead>
<tr><th><strong>Мод</strong></th><th><strong>Назначение</strong></th><th><strong>Примеры использования</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Обмен сообщениями в рабочем пространстве</strong></td><td>Обмен сообщениями в режиме реального времени</td><td>Потоковые ответы, мгновенная обратная связь</td></tr>
<tr><td><strong>Форум</strong></td><td>Асинхронное обсуждение</td><td>Рассмотрение предложений, многораундовое обсуждение</td></tr>
<tr><td><strong>Вики</strong></td><td>Общая база знаний</td><td>Консолидация знаний, совместная работа над документами</td></tr>
<tr><td><strong>Социальная</strong></td><td>Граф отношений</td><td>Маршрутизация экспертов, сети доверия</td></tr>
</tbody>
</table>
<p>Все модули работают на единой системе событий, что позволяет легко расширять фреймворк или внедрять пользовательское поведение, когда это необходимо.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Транспорты: Протокольно-агностический канал для коммуникации</h3><p>Транспорты - это коммуникационные протоколы, которые позволяют разнородным агентам соединяться и обмениваться сообщениями в сети OpenAgents. OpenAgents поддерживает несколько транспортных протоколов, которые могут работать одновременно в одной сети, включая:</p>
<ul>
<li><p><strong>HTTP/REST</strong> для широкой межъязыковой интеграции</p></li>
<li><p><strong>WebSocket</strong> для двунаправленного обмена данными с низкой задержкой</p></li>
<li><p><strong>gRPC</strong> для высокопроизводительного RPC, подходящего для крупномасштабных кластеров</p></li>
<li><p><strong>libp2p</strong> для децентрализованной одноранговой сети</p></li>
<li><p><strong>A2A</strong>, новый протокол, разработанный специально для взаимодействия между агентами.</p></li>
</ul>
<p>Все транспорты работают через единый формат сообщений, основанный на событиях, что позволяет легко переводить их между протоколами. Вам не нужно беспокоиться о том, какой протокол использует агент-агент - фреймворк справится с этим автоматически. Агенты, созданные на любом языке или фреймворке, могут присоединиться к сети OpenAgents без переписывания существующего кода.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Интеграция OpenAgents с Milvus для долговременной агентской памяти<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents решает проблему того, как агенты <strong>общаются, обнаруживают друг друга и сотрудничают, но</strong>одного сотрудничества недостаточно. Агенты генерируют идеи, решения, историю разговоров, результаты работы инструментов и знания, специфичные для конкретной области. Без слоя постоянной памяти все это испарится в тот момент, когда агент выключится.</p>
<p>Именно здесь <strong>Milvus</strong> становится незаменимым. Milvus обеспечивает высокопроизводительное векторное хранение и семантический поиск, необходимые для превращения взаимодействий агентов в долговечную, многократно используемую память. При интеграции в сеть OpenAgents он предлагает три основных преимущества:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Семантический поиск</strong></h4><p>Milvus обеспечивает быстрый семантический поиск с использованием таких алгоритмов индексирования, как HNSW и IVF_FLAT. Агенты могут извлекать наиболее значимые исторические записи на основе смысла, а не ключевых слов, что позволяет им:</p>
<ul>
<li><p>вспомнить предыдущие решения или планы,</p></li>
<li><p>избегать повторения работы,</p></li>
<li><p>поддерживать долгосрочный контекст во время сеансов.</p></li>
</ul>
<p>Это основа <em>агентской памяти</em>: быстрое, релевантное, контекстное извлечение информации.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Горизонтальная масштабируемость в миллиардных масштабах</strong></h4><p>Реальные агентские сети генерируют огромные объемы данных. Milvus создан для комфортной работы в таких масштабах, предлагая:</p>
<ul>
<li><p>хранение и поиск по миллиардам векторов,</p></li>
<li><p>задержки &lt; 30 мс даже при высокопроизводительном поиске по методу Top-K,</p></li>
<li><p>полностью распределенную архитектуру, которая линейно масштабируется по мере роста спроса.</p></li>
</ul>
<p>Независимо от того, работает ли у вас десяток агентов или тысячи параллельно, Milvus обеспечивает быстрый и последовательный поиск.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Изоляция нескольких арендаторов</strong></h4><p>Milvus обеспечивает гранулированную многопользовательскую изоляцию с помощью <strong>Partition Key</strong>- легкого механизма разделения, который сегментирует память внутри одной коллекции. Это позволяет:</p>
<ul>
<li><p>различным командам, проектам или сообществам агентов поддерживать независимые пространства памяти,</p></li>
<li><p>значительно снизить накладные расходы по сравнению с поддержкой нескольких коллекций,</p></li>
<li><p>опциональный межраздельный поиск, когда необходимы общие знания.</p></li>
</ul>
<p>Такая изоляция очень важна для крупных мультиагентных развертываний, где границы данных должны соблюдаться без ущерба для скорости поиска.</p>
<p>OpenAgents подключается к Milvus через <strong>пользовательские модули</strong>, которые напрямую вызывают API Milvus. Сообщения агентов, результаты работы инструментов и журналы взаимодействия автоматически встраиваются в векторы и хранятся в Milvus. Разработчики могут настраивать:</p>
<ul>
<li><p>модель встраивания,</p></li>
<li><p>схему хранения и метаданные,</p></li>
<li><p>и стратегии поиска (например, гибридный поиск, поиск по разделам).</p></li>
</ul>
<p>Таким образом, каждое сообщество агентов получает слой памяти, который является масштабируемым, постоянным и оптимизированным для семантических рассуждений.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Как построить многоагентный чатбот с помощью OpenAgent и Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы конкретизировать ситуацию, давайте рассмотрим демонстрационный пример: создание <strong>сообщества поддержки разработчиков</strong>, в котором несколько агентов-специалистов - эксперты в области программирования на языке Python, эксперты по базам данных, инженеры DevOps и другие - сотрудничают для ответа на технические вопросы. Вместо того чтобы полагаться на одного перегруженного работой агента широкого профиля, каждый эксперт вносит свой вклад в рассуждения о конкретной области, а система автоматически направляет запросы к наиболее подходящему агенту.</p>
<p>Этот пример демонстрирует, как интегрировать <strong>Milvus</strong> в развертывание OpenAgents, чтобы обеспечить долговременную память для технических вопросов и ответов. Разговоры агентов, прошлые решения, журналы устранения неполадок и запросы пользователей преобразуются в векторные вкрапления и хранятся в Milvus, обеспечивая сети возможность</p>
<ul>
<li><p>запоминать предыдущие ответы,</p></li>
<li><p>повторно использовать предыдущие технические объяснения,</p></li>
<li><p>поддерживать согласованность между сессиями и</p></li>
<li><p>улучшаться с течением времени по мере накопления количества взаимодействий.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Необходимые условия</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Определение зависимостей</h3><p>Определите пакеты Python, необходимые для проекта:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Переменные окружения</h3><p>Здесь приведен шаблон для настройки окружения:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Настройка сети OpenAgents</h3><p>Определите структуру сети агентов и параметры связи:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Реализация совместной работы нескольких агентов</h3><p>Ниже показаны основные фрагменты кода (не полная реализация).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Создание и активация виртуальной среды</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Установка зависимостей</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Настройте ключи API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Запуск сети OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Запустите мультиагентную службу</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Запуск OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Доступ к студии</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Проверьте состояние агентов и сети:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>OpenAgents обеспечивает координационный слой, позволяющий агентам обнаруживать друг друга, общаться и сотрудничать, а Milvus решает не менее важную проблему хранения, обмена и повторного использования знаний. Предоставляя высокопроизводительный слой векторной памяти, Milvus позволяет агентам создавать постоянный контекст, вспоминать прошлые взаимодействия и накапливать опыт с течением времени. Вместе они выводят системы искусственного интеллекта за пределы изолированных моделей и открывают более глубокий совместный потенциал настоящей мультиагентной сети.</p>
<p>Конечно, ни одна мультиагентная архитектура не обходится без компромиссов. Параллельный запуск агентов может увеличить потребление токенов, ошибки могут передаваться от одного агента к другому, а одновременное принятие решений может привести к конфликтам. Это активные области исследований и постоянного совершенствования, но они не умаляют ценности создания систем, которые могут координировать, запоминать и развиваться.</p>
<p>🚀 Готовы наделить своих агентов долговременной памятью?</p>
<p>Изучите <a href="https://milvus.io/">Milvus</a> и попробуйте интегрировать его в свой рабочий процесс.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутную индивидуальную сессию, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
