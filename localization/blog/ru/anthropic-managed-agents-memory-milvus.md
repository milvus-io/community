---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Как добавить долговременную память в управляемые агенты Anthropic с помощью
  Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Управляемые агенты Anthropic сделали агентов надежными, но каждая сессия
  начинается с пустого места. Вот как можно использовать Milvus для
  семантического запоминания внутри сессии и общую память для агентов.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p><a href="https://www.anthropic.com/engineering/managed-agents">Управляемые агенты</a> Anthropic делают инфраструктуру агентов устойчивой к внешним воздействиям. Задача, состоящая из 200 шагов, теперь без вмешательства человека переживет сбой в системе, таймаут песочницы или изменение инфраструктуры в середине полета. По данным Anthropic, время p50 до первого токена сократилось примерно на 60 %, а p95 - более чем на 90 % после развязки.</p>
<p>Что надежность не решает, так это память. Миграция кода, состоящая из 200 шагов и столкнувшаяся с новым конфликтом зависимостей на 201-м шаге, не может эффективно просмотреть, как она справилась с предыдущим конфликтом. Агент, выполняющий сканирование уязвимостей для одного клиента, не знает, что другой агент уже решил тот же случай час назад. Каждая сессия начинается с чистого листа, и параллельные "мозги" не имеют доступа к тому, что уже успели сделать другие.</p>
<p>Решение состоит в том, чтобы объединить <a href="https://milvus.io/">векторную базу данных Milvus</a> с управляемыми агентами Anthropic: семантический отзыв в пределах сессии и общий <a href="https://milvus.io/docs/milvus_for_agents.md">слой векторной памяти</a> между сессиями. Контракт сессии остается нетронутым, упряжь получает один новый слой, а дальние задачи агентов получают качественно иные возможности.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Что решили управляемые агенты (и чего они не решили)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Управляемые агенты решили проблему надежности, разделив агента на три независимых модуля. Чего они не решили, так это проблемы памяти - как семантического запоминания в рамках одной сессии, так и обмена опытом между параллельными сессиями.</strong> Вот что было отделено, и где в этом отделенном дизайне находится пробел в памяти.</p>
<table>
<thead>
<tr><th>Модуль</th><th>Что он делает</th></tr>
</thead>
<tbody>
<tr><td><strong>Сессия</strong></td><td>Журнал событий со всеми событиями, которые произошли. Хранится за пределами системы.</td></tr>
<tr><td><strong>Harness</strong></td><td>Цикл, который вызывает Клода и направляет вызовы инструментов Клода в соответствующую инфраструктуру.</td></tr>
<tr><td><strong>Песочница</strong></td><td>Изолированная среда выполнения, в которой Клод запускает код и редактирует файлы.</td></tr>
</tbody>
</table>
<p>Рефрейм, благодаря которому эта конструкция работает, прямо указан в посте Anthropic:</p>
<p><em>"Сессия - это не контекстное окно Клода".</em></p>
<p>Контекстное окно эфемерно: ограничено токенами, реконструируется при вызове модели и отбрасывается при возврате вызова. Сессия же долговечна, хранится за пределами упряжки и представляет собой систему записей для всей задачи.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Когда упряжка терпит крах, платформа запускает новую с <code translate="no">wake(sessionId)</code>. Новый узел считывает журнал событий через <code translate="no">getSession(id)</code>, и задача начинает выполняться с последнего записанного шага, при этом не нужно писать пользовательскую логику восстановления и следить за сеансом на уровне сессии.</p>
<p>Что не рассматривается в статье Managed Agents и не утверждается, так это то, что делает агент, когда ему нужно что-то запомнить. Два пробела проявляются в тот момент, когда вы проталкиваете реальные рабочие нагрузки через архитектуру. Одна живет внутри одной сессии, другая - между сессиями.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Проблема 1: Почему линейные журналы сеансов не выдерживают нескольких сотен шагов<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Линейные журналы сессий не выдерживают и нескольких сотен шагов, потому что последовательное чтение и семантический поиск - принципиально разные рабочие нагрузки, а</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>обслуживает только первую.</strong> Нарезки по позиции или поиска по временной метке достаточно, чтобы ответить на вопрос "где закончилась эта сессия". Этого недостаточно, чтобы ответить на вопрос, который предсказуемо потребуется агенту при выполнении любой длительной задачи: встречались ли мы с подобной проблемой раньше и что мы с ней делали?</p>
<p>Рассмотрим миграцию кода на шаге 200, которая столкнулась с новым конфликтом зависимостей. Естественным шагом будет оглянуться назад. Сталкивался ли агент с чем-то подобным ранее в этой же задаче? Какой подход был опробован? Сработал ли он или привел к регрессу чего-то другого?</p>
<p>На сайте <code translate="no">getEvents()</code> есть два способа ответить на этот вопрос, и оба они плохи:</p>
<table>
<thead>
<tr><th>Вариант</th><th>Проблема</th></tr>
</thead>
<tbody>
<tr><td>Сканировать каждое событие последовательно.</td><td>Медленно при 200 шагах. Невозможно при 2 000.</td></tr>
<tr><td>Сбрасывать большой фрагмент потока в контекстное окно</td><td>Дорого для токенов, ненадежно в масштабе и вытесняет реальную рабочую память агента для текущего шага.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Сессия хороша для восстановления и аудита, но она не была построена с индексом, поддерживающим "видел ли я это раньше". Долгосрочные задачи - это то место, где этот вопрос перестает быть необязательным.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Решение 1: Как добавить семантическую память в сеанс управляемого агента<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Добавьте коллекцию Milvus рядом с журналом сессии и сделайте двойную запись с</strong> <code translate="no">**emitEvent**</code>. Контракт сессии остается нетронутым, а упряжка получает семантический запрос о своем прошлом.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Дизайн Anthropic оставляет пространство именно для этого. В их сообщении говорится, что "любые полученные события также могут быть преобразованы в обвязке перед передачей в контекстное окно Клода. Эти преобразования могут быть любыми, которые кодирует жгут, включая организацию контекста... и контекстную инженерию". Контекстная инженерия находится в ремне; сессия должна только гарантировать долговечность и возможность запросов.</p>
<p>Схема: каждый раз, когда срабатывает <code translate="no">emitEvent</code>, упряжка также вычисляет <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">векторное вложение</a> для событий, которые стоит индексировать, и вставляет их в коллекцию Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Когда агент переходит к шагу 200 и ему нужно вспомнить предыдущие решения, запрос представляет собой <a href="https://zilliz.com/glossary/vector-similarity-search">векторный поиск</a>, привязанный к этой сессии:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Прежде чем приступить к работе, необходимо учесть три производственные детали:</p>
<ul>
<li><strong>Выберите, что индексировать.</strong> Не каждое событие заслуживает встраивания. Промежуточные состояния вызова инструмента, журналы повторных попыток и повторяющиеся события состояния загрязняют качество поиска быстрее, чем улучшают его. Политика <code translate="no">INDEXABLE_EVENT_TYPES</code> зависит от задачи, а не является глобальной.</li>
<li><strong>Определите границу согласованности.</strong> Если обвязка падает между добавлением сессии и вставкой Milvus, один слой ненадолго опережает другой. Окно небольшое, но реальное. Выберите путь согласования (повторная попытка при перезапуске, запись в журнал с опережением или окончательное согласование), а не надейтесь.</li>
<li><strong>Контролируйте расходы на встраивание.</strong> Сессия из 200 шагов, которая синхронно вызывает внешний API для встраивания на каждом шаге, приводит к получению счета, который никто не планировал. Ставьте в очередь встраивания и отправляйте их партиями асинхронно.</li>
</ul>
<p>При наличии этих функций поиск по вектору занимает миллисекунды, а вызов встраивания - менее 100 мс. Пять наиболее релевантных прошлых событий попадают в контекст до того, как агент заметит трение. Сессия сохраняет свою первоначальную функцию долговременного журнала, а система получает возможность семантически, а не последовательно запрашивать свое прошлое. Это скромное изменение на поверхности API и структурное изменение в том, что агент может делать в долгосрочных задачах.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Проблема 2: почему параллельные агенты Claude не могут делиться опытом<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Параллельные агенты Claude не могут обмениваться опытом, потому что сеансы управляемых агентов изолированы по дизайну. Та же изоляция, которая делает горизонтальное масштабирование чистым, также не позволяет каждому мозгу учиться у каждого другого мозга.</strong></p>
<p>В отсоединенной системе мозги не имеют статусов и независимы. Такая изоляция раскрывает выигрыш в задержках в отчетах Anthropic, а также позволяет каждой сессии не знать обо всех других сессиях.</p>
<p>Агент А тратит 40 минут на диагностику хитрого вектора SQL-инъекции для одного клиента. Часом позже агент B подхватывает тот же случай для другого клиента и тратит свои 40 минут на то, чтобы пройтись по тем же тупикам, выполнить те же вызовы инструментов и прийти к тому же ответу.</p>
<p>Для одного пользователя, управляющего случайным агентом, это бесполезные вычисления. Для платформы, на которой ежедневно работают десятки параллельных <a href="https://zilliz.com/glossary/ai-agents">агентов искусственного интеллекта</a>, занимающихся проверкой кода, сканированием уязвимостей и созданием документации для разных клиентов, затраты структурно возрастают.</p>
<p>Если опыт, получаемый в каждой сессии, испаряется в момент ее окончания, интеллект становится одноразовым. Платформа, построенная таким образом, масштабируется линейно, но не становится лучше со временем, как это делают человеческие инженеры.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Решение 2: Как построить общий пул памяти агентов с помощью Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Создайте единую векторную коллекцию, из которой каждый агент читает при запуске и записывает при завершении работы, разделив ее по арендаторам, чтобы опыт работы с пулом в разных сессиях не просачивался между клиентами.</strong></p>
<p>Когда сессия заканчивается, ключевые решения, возникшие проблемы и подходы, которые сработали, помещаются в общую коллекцию Milvus. Когда новый мозг инициализируется, система выполняет семантический запрос в рамках настройки и вводит в контекстное окно наиболее подходящие примеры прошлого опыта. На первом этапе новый агент наследует опыт всех предыдущих агентов.</p>
<p>Два инженерных решения переносят этот этап из прототипа в производство.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Изолирование арендаторов с помощью ключа Milvus Partition Key</h3><p><strong>Разделение по</strong> <code translate="no">**tenant_id**</code>,<strong> и опыт агента клиента A физически не живет в том же разделе, что и опыт клиента B. Это изоляция на уровне данных, а не на уровне запросов.</strong></p>
<p>Работа мозга А над кодовой базой компании А никогда не должна быть доступна агентам компании Б. <a href="https://milvus.io/docs/use-partition-key.md">Ключ разделения</a> Milvus решает эту задачу в рамках одной коллекции, без второй коллекции для каждого арендатора и без логики шардинга в коде приложения.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Агенты клиента А никогда не всплывают в запросах клиента Б, но не потому, что фильтр запросов написан правильно (хотя он должен быть правильным), а потому, что данные физически не находятся в том же разделе, что и данные клиента Б. Одна коллекция для работы, логическая изоляция, обеспечиваемая на уровне запросов, физическая изоляция, обеспечиваемая на уровне разделов.</p>
<p>О том, в каких случаях подходит ключ раздела, а в каких - отдельные коллекции или базы данных, читайте в <a href="https://milvus.io/docs/multi_tenancy.md">документации по стратегиям многопользовательской работы</a>, а также в <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">руководстве по шаблонам многопользовательской работы RAG</a>, где описано развертывание на производстве.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Почему качество памяти агентов нуждается в постоянной работе</h3><p><strong>Качество памяти ухудшается со временем: ошибочные обходные пути, которые однажды оказались успешными, воспроизводятся и усиливаются, а устаревшие записи, связанные с устаревшими зависимостями, продолжают вводить в заблуждение агентов, которые их наследуют. Защитой являются операционные программы, а не функции базы данных.</strong></p>
<p>Агент натыкается на несовершенное обходное решение, которое сработало один раз. Он записывается в общий пул. Следующий агент извлекает его, воспроизводит и закрепляет неудачную схему второй записью об "успешном" использовании.</p>
<p>Устаревшие записи проходят более медленную версию того же пути. Исправление, привязанное к версии зависимости, которая была устаревшей полгода назад, продолжает извлекаться и вводить в заблуждение агентов, которые его наследуют. Чем старше и интенсивнее используется пул, тем больше таких ошибок накапливается.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Три оперативные программы защищают от этого:</p>
<ul>
<li><strong>Оценка доверия.</strong> Отслеживает, как часто память успешно применялась в последующих сеансах. Затухание записей, которые терпят неудачу при воспроизведении. Продвижение записей, которые неоднократно успешно применяются.</li>
<li><strong>Взвешивание по времени.</strong> Предпочтение недавнему опыту. Удаление записей после известного порога устаревания, часто связанного с переходом на новые версии зависимостей.</li>
<li><strong>Выборочные проверки.</strong> Записи с высокой частотой поиска являются высокоэффективными. Если одна из них ошибается, она ошибается много раз, и именно здесь человеческая проверка окупается быстрее всего.</li>
</ul>
<p>Milvus сам по себе не решает эту проблему, равно как и Mem0, Zep или любой другой продукт для работы с памятью. Обеспечение одного пула со многими арендаторами и нулевой утечкой между арендаторами - это то, что вы создаете один раз. Поддержание такого пула точным, свежим и полезным - это постоянная оперативная работа, которую не поставляет ни одна база данных с готовой конфигурацией.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Выводы: Что Milvus добавляет к управляемым агентам Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus превращает Managed Agents из надежной, но забывчивой платформы в платформу, которая накапливает опыт с течением времени, добавляя семантическое запоминание внутри сессии и общую память для агентов.</strong></p>
<p>На вопрос о надежности Managed Agents отвечает однозначно: и мозг, и руки - это скот, и любой из них может умереть, не забрав с собой задачу. Это проблема инфраструктуры, и Anthropic хорошо ее решила.</p>
<p>Что оставалось открытым, так это рост. Человеческие инженеры со временем становятся сложнее; годы работы превращаются в распознавание образов, и они не рассуждают, исходя из первых принципов, при решении каждой задачи. Современные управляемые агенты так не делают, потому что каждая сессия начинается с чистого листа.</p>
<p>Подключение сессии к Milvus для семантического запоминания внутри задачи и объединение опыта всех мозгов в общую коллекцию векторов - вот что дает агентам прошлое, которое они действительно могут использовать. Подключение Milvus - это инфраструктурная часть; обрезка неправильных воспоминаний, удаление устаревших и обеспечение границ арендаторов - это операционная часть. Как только оба этих компонента будут созданы, форма памяти перестанет быть обузой и превратится в растущий капитал.</p>
<h2 id="Get-Started" class="common-anchor-header">Начало работы<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>Попробуйте локально:</strong> запустите встроенный экземпляр Milvus с помощью <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Без Docker, без кластера, просто <code translate="no">pip install pymilvus</code>. Производственные рабочие нагрузки переходят на <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone или Distributed</a>, когда они вам понадобятся.</li>
<li><strong>Читайте обоснование проекта:</strong> В <a href="https://www.anthropic.com/engineering/managed-agents">инженерном посте</a> Anthropic " <a href="https://www.anthropic.com/engineering/managed-agents">Управляемые агенты</a> " подробно рассматривается развязка сессий, обвязки и песочницы.</li>
<li><strong>Есть вопросы?</strong> Присоединяйтесь к сообществу <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> для обсуждения дизайна памяти агентов или запишитесь на сеанс <a href="https://milvus.io/office-hours">Milvus Office Hours</a>, чтобы обсудить вашу рабочую нагрузку.</li>
<li><strong>Предпочитаете управляемые?</strong> <a href="https://cloud.zilliz.com/signup">Зарегистрируйтесь в Zilliz Cloud</a> (или <a href="https://cloud.zilliz.com/login">войдите в систему</a>), чтобы получить хостинг Milvus с ключами разделов, масштабированием и многопользовательской поддержкой. Новые аккаунты получают бесплатные кредиты на рабочую электронную почту.</li>
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
    </button></h2><p><strong>Вопрос: В чем разница между сеансом и контекстным окном в управляемых агентах Anthropic?</strong></p>
<p>Контекстное окно - это эфемерный набор маркеров, который видит один вызов Claude. Оно ограничено и сбрасывается при каждом вызове модели. Сессия - это долговременный журнал событий, хранящийся за пределами системы, в котором хранятся все события, произошедшие во время выполнения задачи. Когда упряжка терпит крах, <code translate="no">wake(sessionId)</code> порождает новую упряжку, которая считывает журнал сессии и возобновляет работу. Сессия - это система записи; контекстное окно - это рабочая память. Сессия не является контекстным окном.</p>
<p><strong>Вопрос: Как сохранить память агента в сеансах Claude?</strong></p>
<p>Сама сессия уже является постоянной; это то, что извлекается по адресу <code translate="no">getSession(id)</code>. Что обычно отсутствует, так это долговременная память с возможностью запроса. В качестве примера можно привести встраивание высокосигнальных событий (решений, резолюций, стратегий) в векторную базу данных типа Milvus во время <code translate="no">emitEvent</code>, а затем запрос по семантическому сходству во время извлечения. Таким образом, вы получаете и долговременный журнал сессий, который предоставляет Anthropic, и семантический слой для запоминания событий на сотни шагов назад.</p>
<p><strong>В: Могут ли несколько агентов Claude совместно использовать память?</strong></p>
<p>Из коробки - нет. Каждая сессия управляемых агентов изолирована, что позволяет им масштабироваться горизонтально. Чтобы разделить память между агентами, добавьте общую коллекцию векторов (например, в Milvus), из которой каждый агент считывает данные при запуске и записывает в нее при завершении работы. Используйте функцию Milvus partition key для изоляции арендаторов, чтобы память агентов клиента A не просачивалась в сессии клиента B.</p>
<p><strong>Вопрос: Какая векторная база данных лучше всего подходит для памяти агентов ИИ?</strong></p>
<p>Честный ответ зависит от масштаба и формы развертывания. Для прототипов и небольших рабочих нагрузок подойдет локальный встроенный вариант, например Milvus Lite, работающий в процессе без инфраструктуры. Для производственных агентов, работающих со многими арендаторами, вам нужна база данных с развитой многопользовательской поддержкой (ключи разделов, фильтрованный поиск), гибридным поиском (векторный + скалярный + ключевое слово) и миллисекундной задержкой при работе с миллионами векторов. Milvus специально создана для векторных рабочих нагрузок такого масштаба, поэтому она используется в системах памяти производственных агентов, построенных на LangChain, Google ADK, Deep Agents и OpenAgents.</p>
