---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  За пределами контекстной перегрузки: Как Parlant × Milvus обеспечивает
  контроль и ясность в поведении агентов LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Узнайте, как Parlant × Milvus использует моделирование выравнивания и
  векторный интеллект, чтобы сделать поведение LLM-агентов контролируемым,
  объяснимым и готовым к производству.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Представьте, что вам нужно выполнить задание, включающее 200 бизнес-правил, 50 инструментов и 30 демо-версий, а у вас на это всего час. Это просто невозможно. Однако мы часто ожидаем от больших языковых моделей именно этого, когда превращаем их в "агентов" и перегружаем инструкциями.</p>
<p>На практике такой подход быстро дает сбой. Традиционные агентные фреймворки, такие как LangChain или LlamaIndex, внедряют в контекст модели сразу все правила и инструменты, что приводит к конфликтам правил, перегрузке контекста и непредсказуемому поведению в производстве.</p>
<p>Для решения этой проблемы в последнее время на GitHub набирает обороты агентный фреймворк с открытым исходным кодом под названием<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a>. В нем реализован новый подход под названием Alignment Modeling, а также механизм надзора и условные переходы, которые делают поведение агентов гораздо более контролируемым и объяснимым.</p>
<p>В паре с <a href="https://milvus.io/"><strong>Milvus</strong></a>, векторной базой данных с открытым исходным кодом, Parlant становится еще более способным. Milvus добавляет семантический интеллект, позволяя агентам динамически извлекать наиболее релевантные правила и контекст в реальном времени, что делает их точными, эффективными и готовыми к производству.</p>
<p>В этом посте мы рассмотрим, как Parlant работает под прикрытием и как его интеграция с Milvus обеспечивает производственный уровень.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Почему традиционные агентские фреймворки терпят крах<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>Традиционные агентские фреймворки любят быть большими: сотни правил, десятки инструментов и горстка демо-версий - и все это в одном, переполненном подсказками, документе. Это может отлично смотреться в демо-версии или небольшом тесте в песочнице, но как только вы запустите это в производство, трещины начнут быстро проявляться.</p>
<ul>
<li><p><strong>Противоречивые правила приводят к хаосу:</strong> Когда два или более правил применяются одновременно, у этих фреймворков нет встроенного способа решить, какое из них победит. Иногда он выбирает одно из них. Иногда смешивает оба. А иногда делает что-то совершенно непредсказуемое.</p></li>
<li><p><strong>Краевые случаи выявляют пробелы:</strong> Невозможно предугадать все, что может сказать пользователь. И когда ваша модель сталкивается с чем-то, выходящим за рамки ее обучающих данных, она по умолчанию дает общие, неконкретные ответы.</p></li>
<li><p><strong>Отладка - это больно и дорого:</strong> Когда агент ведет себя неправильно, практически невозможно определить, какое правило вызвало проблему. Так как все правила находятся в одном огромном системном подсказчике, единственный способ их исправить - переписать подсказку и протестировать все с нуля.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Что такое Parlant и как он работает<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant - это механизм выравнивания с открытым исходным кодом для агентов LLM. Вы можете точно контролировать поведение агента в различных сценариях, моделируя его процесс принятия решений структурированным, основанным на правилах способом.</p>
<p>Чтобы решить проблемы, возникающие при использовании традиционных агентских фреймворков, Parlant предлагает новый мощный подход: <strong>Alignment Modeling</strong>. Его основная идея заключается в том, чтобы отделить определение правил от их выполнения, гарантируя, что в любой момент времени в контекст LLM будут введены только самые важные правила.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Гранулярные рекомендации: Основа моделирования согласования</h3><p>В основе модели согласования Parlant лежит концепция <strong>гранулированных рекомендаций</strong>. Вместо того чтобы писать гигантскую системную подсказку, полную правил, вы определяете небольшие модульные рекомендации - каждая из них описывает, как агент должен действовать в ситуации определенного типа.</p>
<p>Каждое руководство состоит из трех частей:</p>
<ul>
<li><p><strong>Условие</strong> - описание на естественном языке того, когда должно применяться правило. Parlant преобразует это условие в семантический вектор и сопоставляет его с вводом пользователя, чтобы определить, насколько оно релевантно.</p></li>
<li><p><strong>Действие</strong> - четкая инструкция, определяющая, как агент должен реагировать на выполнение условия. Это действие внедряется в контекст LLM только при срабатывании.</p></li>
<li><p><strong>Инструменты</strong> - любые внешние функции или API, связанные с конкретным правилом. Они открываются агенту только при активном правиле, что позволяет контролировать использование инструментов и учитывать контекст.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Каждый раз, когда пользователь взаимодействует с агентом, Parlant выполняет легкий этап подбора, чтобы найти три-пять наиболее релевантных рекомендаций. Только эти правила вводятся в контекст модели, что позволяет сохранить краткость и целенаправленность подсказок, а также гарантировать, что агент будет постоянно следовать правильным правилам.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Механизм контроля точности и согласованности</h3><p>Для дальнейшего поддержания точности и последовательности Parlant внедряет <strong>механизм надзора</strong>, который выступает в качестве второго уровня контроля качества. Процесс разворачивается в три этапа:</p>
<p><strong>1. Генерирование ответа-кандидата</strong> - агент создает первоначальный ответ на основе сопоставленных рекомендаций и текущего контекста разговора.</p>
<p><strong>2. Проверка соответствия</strong> - ответ сравнивается с активными рекомендациями, чтобы убедиться, что все инструкции были выполнены правильно.</p>
<p><strong>3. Пересмотр или подтверждение</strong> - если обнаружены какие-либо проблемы, система корректирует вывод; если все в порядке, ответ утверждается и отправляется пользователю.</p>
<p>Этот контролирующий механизм гарантирует, что агент не только понимает правила, но и действительно придерживается их, прежде чем ответить, что повышает надежность и контроль.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Условные переходы для контроля и безопасности</h3><p>В традиционных системах агентов все доступные инструменты всегда открыты для LLM. Такой подход "все на столе" часто приводит к перегрузке подсказок и непреднамеренным вызовам инструментов. Parlant решает эту проблему с помощью <strong>условных переходов</strong>. Подобно тому, как работают машины состояний, действие или инструмент запускается только при выполнении определенного условия. Каждый инструмент жестко привязан к соответствующему руководству и становится доступным только при выполнении условия этого руководства.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Этот механизм превращает вызов инструмента в условный переход - инструменты переходят из состояния "неактивно" в состояние "активно" только при выполнении условий их запуска. Структурируя выполнение таким образом, Parlant гарантирует, что каждое действие происходит осознанно и контекстно, предотвращая злоупотребления и повышая эффективность и безопасность системы.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Как Milvus обеспечивает работу Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда мы заглядываем под капот процесса подбора рекомендаций Parlant, становится понятной одна основная техническая проблема: как система может найти три-пять наиболее подходящих правил из сотен или даже тысяч вариантов всего за несколько миллисекунд? Именно здесь на помощь приходит векторная база данных. Семантический поиск - вот что делает это возможным.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Как Milvus поддерживает процесс сопоставления рекомендаций Parlant</h3><p>Сопоставление рекомендаций происходит за счет семантического сходства. Поле "Условие" каждого руководства преобразуется в векторную вставку, которая отражает его смысл, а не только буквальный текст. Когда пользователь отправляет сообщение, Parlant сравнивает семантику этого сообщения со всеми сохраненными вложениями рекомендаций, чтобы найти наиболее релевантные из них.</p>
<p>Вот как пошагово работает этот процесс:</p>
<p><strong>1. Кодирование запроса</strong> - сообщение пользователя и история последних разговоров преобразуются в вектор запроса.</p>
<p><strong>2. Поиск сходства</strong> - система выполняет поиск сходства в хранилище векторов рекомендаций, чтобы найти наиболее близкие совпадения.</p>
<p><strong>3. Получение результатов Top-K</strong> - возвращаются три-пять наиболее семантически релевантных рекомендаций.</p>
<p><strong>4. Вставка в контекст</strong> - эти совпадающие рекомендации динамически вставляются в контекст LLM, чтобы модель могла действовать в соответствии с правильными правилами.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Чтобы сделать этот рабочий процесс возможным, база данных векторов должна обеспечивать три критически важные возможности: высокопроизводительный поиск по приближенным ближайшим соседям (ANN), гибкую фильтрацию метаданных и обновление векторов в режиме реального времени. <a href="https://milvus.io/"><strong>Milvus</strong></a>, облачная векторная база данных с открытым исходным кодом, обеспечивает производительность производственного уровня во всех трех областях.</p>
<p>Чтобы понять, как Milvus работает в реальных сценариях, давайте рассмотрим в качестве примера агента финансовых услуг.</p>
<p>Предположим, что система определяет 800 бизнес-направлений, охватывающих такие задачи, как запросы по счетам, переводы средств и консультации по продуктам управления состоянием. В этом случае Milvus выступает в качестве уровня хранения и поиска всех данных о рекомендациях.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Теперь, когда пользователь говорит: "Я хочу перевести 100 000 юаней на счет моей матери", процесс выполнения выглядит следующим образом:</p>
<p><strong>1. Ректоризация запроса</strong> - преобразование пользовательского ввода в 768-мерный вектор.</p>
<p><strong>2. Гибридный поиск</strong> - запуск поиска по векторному сходству в Milvus с фильтрацией метаданных (например, <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Ранжирование результатов</strong> - Ранжирование рекомендаций-кандидатов на основе оценок сходства в сочетании с их <strong>приоритетными</strong> значениями.</p>
<p><strong>4. Инжекция контекста</strong> - инжектирование <code translate="no">action_text</code> руководящих принципов, вошедших в топ-3, в контекст агента Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В этой конфигурации Milvus обеспечивает задержку P99 менее 15 мс даже при масштабировании библиотеки рекомендаций до 100 000 записей. Для сравнения, использование традиционной реляционной базы данных с подбором ключевых слов обычно приводит к задержкам свыше 200 мс и значительно более низкой точности подбора.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Как Milvus обеспечивает долговременную память и персонализацию</h3><p>Milvus делает больше, чем просто подбор рекомендаций. В сценариях, где агентам требуется долгосрочная память и персонализированные ответы, Milvus может служить в качестве слоя памяти, который хранит и извлекает прошлые взаимодействия пользователей в виде векторных вкраплений, помогая агенту вспомнить, что обсуждалось ранее.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Когда тот же пользователь возвращается, агент может извлечь из Milvus наиболее релевантные исторические взаимодействия и использовать их для создания более связного, похожего на человеческий, опыта. Например, если на прошлой неделе пользователь спрашивал об инвестиционном фонде, агент может вспомнить этот контекст и проактивно ответить на него: "С возвращением! У вас еще есть вопросы о фонде, который мы обсуждали в прошлый раз?".</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Как оптимизировать производительность агентских систем на базе Milvus</h3><p>При развертывании агентской системы на базе Milvus в производственной среде настройка производительности становится критически важной. Чтобы добиться низкой задержки и высокой пропускной способности, необходимо обратить внимание на несколько ключевых параметров:</p>
<p><strong>1. Выбор правильного типа индекса</strong></p>
<p>Важно выбрать подходящую структуру индекса. Например, HNSW (Hierarchical Navigable Small World) идеально подходит для сценариев с высокой точностью вызова, таких как финансы или здравоохранение, где точность имеет решающее значение. IVF_FLAT лучше подходит для крупномасштабных приложений, таких как рекомендации в электронной коммерции, где немного меньшая запоминаемость приемлема в обмен на более высокую производительность и меньшее использование памяти.</p>
<p><strong>2. Стратегия шардинга</strong></p>
<p>Когда количество хранимых рекомендаций превышает миллион записей, рекомендуется использовать <strong>Partition</strong>, чтобы разделить данные по бизнес-доменам или сценариям использования. Разбиение на разделы сокращает пространство поиска для каждого запроса, повышая скорость поиска и поддерживая стабильную задержку даже при росте набора данных.</p>
<p><strong>3. Конфигурация кэша</strong></p>
<p>Для часто используемых инструкций, таких как стандартные запросы клиентов или рабочие процессы с высоким трафиком, вы можете использовать кэширование результатов запросов Milvus. Это позволяет системе повторно использовать предыдущие результаты, сокращая задержку до менее 5 миллисекунд при повторном поиске.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Практическая демонстрация: Как построить умную систему вопросов и ответов с помощью Parlant и Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> - это облегченная версия Milvus - библиотеки Python, которая может быть легко встроена в ваши приложения. Она идеально подходит для быстрого создания прототипов в таких средах, как Jupyter Notebooks, или для работы на периферийных и интеллектуальных устройствах с ограниченными вычислительными ресурсами. Несмотря на небольшой размер, Milvus Lite поддерживает те же API, что и другие развертывания Milvus. Это означает, что код на стороне клиента, написанный для Milvus Lite, может впоследствии легко подключаться к полноценному экземпляру Milvus или Zilliz Cloud - рефакторинг не требуется.</p>
<p>В этой демонстрации мы используем Milvus Lite в сочетании с Parlant, чтобы показать, как создать интеллектуальную систему вопросов и ответов, которая предоставляет быстрые, контекстно-зависимые ответы с минимальными настройками.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия：</h3><p>1.Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.документация Parlant: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Шаг 1: Установка зависимостей</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Шаг 2: Настройте переменные окружения</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Шаг 3: Реализация основного кода</h3><ul>
<li>Создайте пользовательский OpenAI Embedder</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Инициализация базы знаний</li>
</ul>
<p>1.Создайте коллекцию Milvus с именем kb_articles.</p>
<p>2.Вставьте данные образца (например, политика возврата, политика обмена, время доставки).</p>
<p>3.Создайте индекс HNSW для ускорения поиска.</p>
<ul>
<li>Создайте инструмент векторного поиска</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Настройте агент Parlant.</li>
</ul>
<p><strong>Рекомендация 1:</strong> Для вопросов, связанных с фактами или политикой, агент должен сначала выполнить векторный поиск.</p>
<p><strong>Принцип 2:</strong> Когда доказательства найдены, агент должен ответить на вопрос, используя структурированный шаблон (резюме + ключевые моменты + источники).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Напишите полный код</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Шаг 4: Запуск кода</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Посетите игровую площадку:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Теперь вы успешно создали интеллектуальную систему вопросов и ответов с использованием Parlant и Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex: Чем они отличаются и как работают вместе<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>Чем Parlant отличается от существующих агентных фреймворков, таких как <strong>LangChain</strong> или <strong>LlamaIndex</strong>?</p>
<p>LangChain и LlamaIndex - это фреймворки общего назначения. Они предоставляют широкий спектр компонентов и интеграций, что делает их идеальными для быстрого создания прототипов и проведения исследовательских экспериментов. Однако когда дело доходит до развертывания в производстве, разработчикам часто приходится самостоятельно создавать дополнительные уровни, такие как управление правилами, проверка соответствия и механизмы надежности, чтобы агенты были последовательными и надежными.</p>
<p>Parlant предлагает встроенное управление правилами, механизмы самокритики и инструменты объяснения, которые помогают разработчикам управлять поведением, реакцией и причинами агента. Это делает Parlant особенно подходящим для высокостатейных, ориентированных на клиента сценариев использования, где важны точность и подотчетность, например в финансах, здравоохранении и юридических услугах.</p>
<p>Более того, эти фреймворки могут работать вместе:</p>
<ul>
<li><p>Используйте LangChain для создания сложных конвейеров обработки данных или рабочих процессов извлечения.</p></li>
<li><p>Используйте Parlant для управления финальным слоем взаимодействия, обеспечивая соответствие выходных данных бизнес-правилам и их интерпретацию.</p></li>
<li><p>Используйте Milvus в качестве основы для векторной базы данных, чтобы обеспечить семантический поиск, память и извлечение знаний в системе в режиме реального времени.</p></li>
</ul>
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
    </button></h2><p>По мере того как агенты LLM переходят от эксперимента к производству, ключевым вопросом становится не то, что они могут делать, а то, насколько надежно и безопасно они могут это делать. Parlant обеспечивает структуру и контроль для достижения этой надежности, а Milvus - масштабируемую векторную инфраструктуру, которая обеспечивает быстродействие и контекстную осведомленность.</p>
<p>Вместе они позволяют разработчикам создавать ИИ-агентов, которые не только способны, но и заслуживают доверия, объяснимы и готовы к производству.</p>
<p>🚀 Проверьте<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant на GitHub</a> и интегрируйте его с<a href="https://milvus.io"> Milvus</a>, чтобы создать свою собственную интеллектуальную агентную систему, управляемую правилами.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете записаться на 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
