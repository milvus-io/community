---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Я создал агента для мониторинга акций с помощью OpenClaw, Exa и Milvus за 20
  долларов в месяц
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Пошаговое руководство по созданию ИИ-агента для мониторинга акций с помощью
  OpenClaw, Exa и Milvus. Утренние сводки, память сделок и оповещения за 20
  долларов в месяц.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Я торгую американскими акциями на стороне, что означает, что я теряю деньги в качестве хобби. Мои коллеги шутят, что моя стратегия - "покупай на волнении, продавай на страхе, повторяй еженедельно".</p>
<p>Повторение - это то, что меня убивает. Каждый раз, когда я смотрю на рынок, я в итоге совершаю сделку, которую не планировал. Нефть скачет, я панически продаю. Одна технологическая акция взлетает на 4%, и я гонюсь за ней. Неделю спустя я просматриваю историю своих сделок и думаю: а <em>не сделал ли я точно так же в прошлом квартале?</em></p>
<p>Поэтому я создал агента с OpenClaw, который следит за рынком вместо меня и не дает мне совершать те же ошибки. Он не торгует и не трогает мои деньги, потому что это было бы слишком большим риском для безопасности. Вместо этого он экономит мое время, потраченное на наблюдение за рынком, и не дает мне совершить те же ошибки.</p>
<p>Этот агент состоит из трех частей и стоит около 20 долларов в месяц:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>для управления всем этим на автопилоте.</strong> OpenClaw запускает агента на 30-минутном пульсе и пингует меня только тогда, когда что-то действительно важно, что избавляет меня от FOMO, из-за которого я раньше не отрывался от экрана. Раньше, чем больше я следил за ценами, тем чаще реагировал на них импульсивно.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>для точного поиска в режиме реального времени.</strong> Exa просматривает и обобщает отобранные вручную источники информации по расписанию, поэтому каждое утро я получаю чистую сводку. Раньше я тратил час в день, просеивая SEO-спам и спекуляции, чтобы найти достоверные новости - и это невозможно было автоматизировать, потому что финансовые сайты обновляются ежедневно, чтобы бороться со скреперами.</li>
<li><strong><a href="https://milvus.io/">M****ilvus</a></strong> <strong>для личной истории и предпочтений.</strong> Milvus хранит историю моих сделок, и агент просматривает ее перед принятием решения - если я собираюсь повторить что-то, о чем уже пожалел, он сообщает мне об этом. Раньше просматривать прошлые сделки было достаточно утомительно, и я просто не делал этого, поэтому одни и те же ошибки повторялись с разными тикерами. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> - это полностью управляемая версия Milvus. Если вы хотите работать без лишних хлопот, Zilliz Cloud - отличный вариант<a href="https://cloud.zilliz.com/signup?utm_page=zilliz-cloud-free-tier&amp;utm_button=banner_left&amp;_gl=1*373c3v*_gcl_au*MjEwODY2Nzk5NS4xNzY5Njg1NzY4*_ga*MTU0OTAxMzY5Ni4xNzY5Njg1NzY4*_ga_Q1F8R2NWDP*czE3NzM0MDYzOTEkbzUwJGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..*_ga_KKMVYG8YF2*czE3NzM0MDYzOTEkbzc0JGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..">(есть бесплатный уровень</a>).</li>
</ul>
<p>Вот как я его настраивал, шаг за шагом.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Шаг 1: Получите информацию о рынке в режиме реального времени с помощью Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>До этого я пробовал пользоваться финансовыми приложениями, писал скребки и обращался к профессиональным терминалам данных. Что я получил?  Приложения скрывали сигнал под шумом, скреперы постоянно ломались, а профессиональные API были непомерно дороги.  Exa - это поисковый API, созданный для агентов искусственного интеллекта, который решает все вышеперечисленные проблемы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> - это API веб-поиска, который возвращает структурированные, готовые для ИИ данные для ИИ-агентов. Он работает на базе <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (полностью управляемый сервис компании Milvus). Если Perplexity - это поисковая система, используемая людьми, то Exa используется ИИ. Агент отправляет запрос, и Exa возвращает текст статьи, ключевые предложения и резюме в формате JSON - структурированный вывод, который агент может анализировать и действовать напрямую, без необходимости скрапинга.</p>
<p>Exa также использует семантический поиск, поэтому агент может делать запросы на естественном языке. Запрос типа "Почему акции NVIDIA упали, несмотря на сильную прибыль за 4 квартал 2026 года" выдает аналитические данные от Reuters и Bloomberg, а не страницу SEO-кликбейта.</p>
<p>У Exa есть бесплатный уровень - 1 000 поисковых запросов в месяц, чего более чем достаточно для начала работы. Чтобы продолжить работу, установите SDK и введите свой собственный API-ключ:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Вот основной вызов:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Параметр contents делает большую часть работы: text выводит полный текст статьи, highlights извлекает ключевые предложения, а summary генерирует сфокусированное резюме на основе заданного вами вопроса. Один вызов API заменяет двадцать минут переходов по вкладкам.</p>
<p>Этот базовый шаблон охватывает многое, но в итоге я создал четыре вариации, чтобы справиться с различными ситуациями, с которыми я регулярно сталкиваюсь:</p>
<ul>
<li><strong>Фильтрация по достоверности источника.</strong> Для анализа доходов мне нужны только Reuters, Bloomberg или Wall Street Journal - а не контент-фермы, переписывающие свои отчеты двенадцать часов спустя.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Поиск похожих аналитических материалов.</strong> Когда я читаю одну хорошую статью, мне нужны другие точки зрения на ту же тему без необходимости искать их вручную.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Глубокий поиск по сложным вопросам.</strong> На некоторые вопросы невозможно ответить в одной статье - например, как напряженность на Ближнем Востоке влияет на цепочки поставок полупроводников. Глубокий поиск синтезирует информацию из нескольких источников и возвращает структурированные резюме.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Мониторинг новостей в режиме реального времени.</strong> В часы работы рынка мне нужны срочные новости, отфильтрованные только на текущий день.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>Я написал около дюжины шаблонов с использованием этих шаблонов, охватывающих политику ФРС, доходы технологических компаний, цены на нефть и макропоказатели. Они запускаются автоматически каждое утро и отправляют результаты на мой телефон. То, что раньше занимало час просмотра, теперь занимает пять минут чтения сводок за чашкой кофе.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Шаг 2: Храните историю торговли в Milvus для принятия более разумных решений<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa решила мою проблему с информацией. Но я все равно повторял одни и те же сделки - панически продавал акции на спадах, которые восстанавливались в течение нескольких дней, и гнался за импульсом в акциях, которые уже были переоценены. Я действовал на эмоциях, сожалел об этом и забывал урок к тому времени, когда возникала похожая ситуация.</p>
<p>Мне нужна была личная база знаний: что-то, что могло бы хранить мои прошлые сделки, мои рассуждения и мои ошибки. Не то, что я должен был бы просматривать вручную (я пробовал это делать и так и не смог), а то, что агент мог бы искать самостоятельно при возникновении похожей ситуации. Если я собираюсь повторить ошибку, я хочу, чтобы агент сообщил мне об этом до того, как я нажму на кнопку". Сопоставление "текущей ситуации" с "прошлым опытом" - это проблема поиска сходства, которую решают векторные базы данных, поэтому я выбрал одну из них для хранения своих данных.</p>
<p>Я использовал <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, облегченную версию Milvus, которая запускается локально. Она не требует установки сервера и идеально подходит для создания прототипов и экспериментов. Я разделил свои данные на три коллекции. Размерность встраивания составляет 1536, чтобы соответствовать модели OpenAI text-embedding-3-small, которую можно использовать напрямую:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Три коллекции соответствуют трем типам персональных данных, каждый из которых имеет свою стратегию поиска:</p>
<table>
<thead>
<tr><th><strong>Тип</strong></th><th><strong>Что хранится</strong></th><th><strong>Как агент ее использует</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Предпочтения</strong></td><td>Пристрастия, толерантность к риску, философия инвестирования ("Я склонен слишком долго держать акции технологических компаний").</td><td>Загружается в контекст агента при каждом запуске.</td></tr>
<tr><td><strong>Решения и шаблоны</strong></td><td>Конкретные сделки в прошлом, извлеченные уроки, наблюдения за рынком</td><td>Извлекаются через поиск по сходству только при возникновении соответствующей ситуации</td></tr>
<tr><td><strong>Внешние знания</strong></td><td>Исследовательские отчеты, документы Комиссии по ценным бумагам и биржам, публичные данные.</td><td>Не хранятся в Milvus - поиск возможен через Exa</td></tr>
</tbody>
</table>
<p>Я создал три разные коллекции, потому что смешивать их в одной коллекции означало либо раздувать каждую подсказку нерелевантной историей торговли, либо терять основные предубеждения, если они недостаточно точно соответствуют текущему запросу.</p>
<p>После того как коллекции были созданы, мне понадобился способ их автоматического наполнения. Я не хотел копировать-вставлять информацию после каждого разговора с агентом, поэтому я создал экстрактор памяти, который запускается в конце каждой сессии чата.</p>
<p>Экстрактор делает две вещи: извлекает и дедуплицирует. Экстрактор просит LLM извлечь из разговора структурированные сведения - решения, предпочтения, шаблоны, уроки - и направляет каждую из них в нужную коллекцию. Прежде чем сохранить что-либо, он проверяет сходство с тем, что уже есть. Если новый инсайт более чем на 92 % похож на уже существующую запись, он пропускается.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Когда я сталкиваюсь с новой рыночной ситуацией и появляется желание поторговать, агент запускает функцию напоминания. Я описываю происходящее, и он ищет во всех трех коллекциях соответствующую историю:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Например, когда в начале марта акции технологических компаний упали на 3-4 % на фоне напряженности на Ближнем Востоке, агент нашел три вещи: урок из октября 2024 года о том, что не следует панически продавать во время геополитических спадов, заметку о том, что я склонен к перевесу геополитического риска, и закономерность, которую я зафиксировал (распродажи акций технологических компаний, вызванные геополитикой, обычно восстанавливаются через одну-три недели).</p>
<p>По мнению моего коллеги: если ваши обучающие данные - это проигрыш, то чему именно учится ИИ? Но в том-то и дело, что агент не копирует мои сделки, а запоминает их, чтобы потом отговорить меня от следующей.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Шаг 3: Научите агента анализировать с помощью OpenClaw Skills<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>На данном этапе агент располагает достоверной информацией<a href="https://exa.ai/">(Exa</a>) и личной памятью<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Но если вы дадите LLM в руки и скажете: "Проанализируй это", то получите общий, хеджирующий все ответ. В нем упоминаются все возможные аспекты, а в заключение говорится: "Инвесторы должны взвесить риски". С таким же успехом можно было ничего не говорить.</p>
<p>Выход - написать собственную аналитическую схему и дать ее агенту в виде четких инструкций. Вы должны указать ему, какие показатели вас волнуют, какие ситуации вы считаете опасными и когда следует быть консервативным, а не агрессивным. Для каждого инвестора эти правила свои, поэтому вы должны определить их сами.</p>
<p>OpenClaw делает это с помощью Skills - уцененных файлов в директории skills/. Когда агент сталкивается с соответствующей ситуацией, он загружает соответствующий навык и следует вашим правилам вместо того, чтобы действовать по своему усмотрению.</p>
<p>Вот один из них, который я написал для оценки акций после отчета о прибылях:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>Последняя строка - самая важная: "Всегда вспоминайте свои прошлые ошибки. У меня есть тенденция позволять страху преобладать над данными. Если моя история Milvus показывает, что я пожалел о продаже после падения, скажите об этом прямо". Это я говорю агенту, где именно я ошибаюсь, чтобы он знал, когда нужно дать отпор. Если вы создадите собственную систему, то именно эту часть вы будете настраивать в соответствии со своими предубеждениями.</p>
<p>Я написал похожие навыки для анализа настроений, макроиндикаторов и сигналов о ротации секторов. Я также написал навыки, моделирующие, как инвесторы, которыми я восхищаюсь, оценили бы ту же ситуацию - стоимостную структуру Баффета, макроподход Bridgewater. Это не способы принятия решений, а дополнительные перспективы.</p>
<p>Предупреждение: не давайте LLM рассчитывать технические индикаторы вроде RSI или MACD. Они уверенно галлюцинируют цифрами. Вычисляйте их сами или вызывайте специальный API, а результаты вводите в скилл в качестве входных данных.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Шаг 4: Запустите агента с помощью OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Все, что описано выше, по-прежнему требует запуска вручную. Если вам придется открывать терминал каждый раз, когда вы захотите получить обновление, вы практически вернетесь к тому, чтобы снова прокручивать брокерское приложение во время совещаний.</p>
<p>Механизм Heartbeat в OpenClaw решает эту проблему. Шлюз пингует агента каждые 30 минут (настраивается), и агент проверяет файл HEARTBEAT.md, чтобы решить, что делать в этот момент. Это файл в формате markdown с правилами, основанными на времени:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Результаты: Меньше экранного времени, меньше импульсивных сделок<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Вот что на самом деле производит система изо дня в день:</p>
<ul>
<li><strong>Утренняя сводка (7:00 утра).</strong> Агент запускает Exa на ночь, извлекает мои позиции и соответствующую историю из Milvus и отправляет на мой телефон персонализированное резюме - не более 500 слов. Что произошло за ночь, как это связано с моими активами и от одного до трех пунктов действий. Я читаю его, пока чищу зубы.</li>
<li><strong>Внутридневные оповещения (9:30 утра - 4:00 вечера по восточному времени).</strong> Каждые 30 минут агент проверяет мой список. Если какая-либо акция двигается более чем на 3 %, я получаю уведомление с пояснениями: почему я ее купил, где находится мой стоп-лосс и был ли я в подобной ситуации раньше.</li>
<li><strong>Еженедельный обзор (по выходным).</strong> Агент собирает информацию за всю неделю - движения рынка, их сравнение с моими утренними ожиданиями и закономерности, которые стоит запомнить. В субботу я трачу 30 минут на его чтение. В остальные дни недели я намеренно не подхожу к экрану.</li>
</ul>
<p>Последний пункт - самое большое изменение. Агент не только экономит время, но и освобождает меня от необходимости следить за рынком. Вы не можете панически продавать, если не смотрите на цены.</p>
<p>До появления этой системы я тратил 10-15 часов в неделю на сбор информации, мониторинг рынка и анализ сделок, разбрасываясь по встречам, поездкам на работу и прокручивая страницы поздно вечером. Теперь это около двух часов: пять минут на утренний брифинг каждый день, плюс 30 минут на обзор в выходные.</p>
<p>Качество информации также стало лучше. Я читаю сводки от Reuters и Bloomberg, а не то, что попало на вирусную страницу в Twitter. А благодаря тому, что агент вспоминает мои прошлые ошибки каждый раз, когда у меня возникает соблазн действовать, я значительно сократил количество своих импульсивных сделок. Пока я не могу доказать, что это сделало меня лучшим инвестором, но это сделало меня менее безрассудным.</p>
<p>Общие затраты: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>10/месяц</mi><mn>для OpenClaw</mn><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">10/месяц для OpenClaw,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02691em;">10/месяц</span><span class="mord">для OpenClaw</span><span class="mpunct">,</span></span></span></span>10/месяц для Exa, и немного электричества для поддержания работы Milvus Lite.</p>
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
    </button></h2><p>Я продолжал совершать одни и те же импульсивные сделки, потому что у меня была плохая информация, я редко просматривал свою историю, а смотреть на рынок весь день - еще хуже. Поэтому я создал ИИ-агент, который решает эти проблемы, делая три вещи:</p>
<ul>
<li><strong>Собирает достоверные рыночные новости</strong> с помощью <strong><a href="https://exa.ai/">Exa</a></strong>, заменяя час пролистывания SEO-спама и платных сайтов.</li>
<li><strong>Запоминает мои прошлые сделки</strong> с помощью <a href="http://milvus.io">Milvus</a> и предупреждает меня, когда я собираюсь повторить ошибку, о которой уже пожалел.</li>
<li><strong>Работает на автопилоте</strong> с <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> и пингует меня только тогда, когда что-то действительно важно.</li>
</ul>
<p>Общая стоимость: 20 долларов в месяц. Агент не торгует и не трогает мои деньги.</p>
<p>Самым большим изменением стали не данные или оповещения. Дело в том, что я перестал следить за рынком. В прошлую среду я совсем забыл о нем, чего никогда не случалось за годы моей торговли. Я все еще иногда теряю деньги, но гораздо реже, и я снова наслаждаюсь своими выходными. Мои коллеги еще не поняли эту шутку, но дайте им время.</p>
<p>На создание агента также ушло всего два выходных. Год назад для такой же настройки пришлось бы писать планировщики, конвейеры уведомлений и управление памятью с нуля. С OpenClaw большая часть этого времени ушла на уточнение моих собственных торговых правил, а не на написание инфраструктуры.</p>
<p>А после того, как вы построили систему для одного варианта использования, архитектура становится переносимой.  Поменяйте местами шаблоны поиска Exa и навыки OpenClaw, и вы получите агента, который следит за исследовательскими работами, отслеживает конкурентов, следит за изменениями в законодательстве или следит за нарушениями в цепочке поставок.</p>
<p>Если вы хотите попробовать:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> - запустите локальную базу данных векторов менее чем за пять минут.</li>
<li><strong>Документация</strong><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> - настройка вашего первого агента с помощью Skills и Heartbeat</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 1 000 бесплатных поисков в месяц для начала.</li>
</ul>
<p>Есть вопросы, нужна помощь в отладке или просто хотите похвастаться тем, что вы создали? Присоединяйтесь к <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-каналу Milvus</a> - это самый быстрый способ получить помощь как от сообщества, так и от команды. А если вы предпочитаете обсудить свою настройку один на один, запишитесь на 20-минутную встречу <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">в Milvus.</a></p>
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (бывшие Clawdbot и Moltbot) объяснения: Полное руководство по автономному агенту искусственного интеллекта</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Пошаговое руководство по настройке OpenClaw (ранее Clawdbot/Moltbot) в Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Почему ИИ-агенты вроде OpenClaw сжигают токены и как сократить расходы</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Мы извлекли систему памяти OpenClaw и выложили ее в открытый доступ (memsearch)</a></li>
</ul>
