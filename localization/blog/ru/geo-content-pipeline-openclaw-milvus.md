---
id: geo-content-pipeline-openclaw-milvus.md
title: 'GEO-контент в масштабе: Как ранжироваться в ИИ-поиске, не отравляя свой бренд'
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: >-
  Ваш органический трафик снижается, поскольку ответы ИИ заменяют клики.
  Узнайте, как генерировать GEO-контент в масштабе без галлюцинаций и ущерба для
  бренда.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>Ваш органический поисковый трафик снижается, и это не потому, что ваше SEO стало хуже. По <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">данным SparkToro</a>, около 60 % запросов в Google теперь заканчиваются нулевыми кликами - пользователи получают ответы из резюме, сгенерированных искусственным интеллектом, вместо того чтобы перейти на вашу страницу. Perplexity, ChatGPT Search, Google AI Overview - это не угрозы будущего. Они уже пожирают ваш трафик.</p>
<p><strong>Генеративная оптимизация двигателя (GEO)</strong> - это способ дать им отпор. Если традиционная SEO оптимизируется под алгоритмы ранжирования (ключевые слова, обратные ссылки, скорость страницы), то GEO оптимизируется под модели искусственного интеллекта, которые составляют ответы на основе множества источников. Цель: структурировать контент таким образом, чтобы поисковые системы искусственного интеллекта ссылались на <em>ваш бренд</em> в своих ответах.</p>
<p>Проблема в том, что GEO требует контента такого масштаба, который большинство маркетинговых команд не могут создать вручную. Модели ИИ не полагаются на один источник - они синтезируют информацию из десятков. Чтобы постоянно показываться на сайте, необходимо охватить сотни длиннохвостых запросов, каждый из которых направлен на конкретный вопрос, который пользователь может задать помощнику ИИ.</p>
<p>Очевидный путь - поручить LLM пакетную генерацию статей - создает еще более серьезную проблему. Попросите GPT-4 подготовить 50 статей, и вы получите 50 статей, полных сфабрикованной статистики, переработанных фраз и утверждений, которых ваш бренд никогда не делал. Это не GEO. Это <strong>контентный спам AI с именем вашего бренда</strong>.</p>
<p>Решение проблемы заключается в том, чтобы обосновать каждый вызов генерации проверенными исходными документами - реальными спецификациями продуктов, утвержденными сообщениями бренда и фактическими данными, на которые LLM опирается, а не придумывает. В этом руководстве рассматривается производственный конвейер, который делает именно это, построенный на трех компонентах:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong> - фреймворк AI-агентов с открытым исходным кодом, который организует рабочий процесс и подключается к платформам обмена сообщениями, таким как Telegram, WhatsApp и Slack.</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong> - <a href="https://zilliz.com/learn/what-is-vector-database">векторная база данных</a>, которая обеспечивает хранение знаний, семантическую дедупликацию и поиск по RAG.</li>
<li><strong>LLMs (GPT-4o, Claude, Gemini)</strong> - движки генерации и оценки.</li>
</ul>
<p>К концу работы у вас будет рабочая система, которая заносит брендовые документы в базу знаний, поддерживаемую Milvus, расширяет посевные темы до длиннохвостых запросов, дедуплицирует их семантически и пакетно генерирует статьи со встроенной оценкой качества.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>Примечание:</strong> Это рабочая система, созданная для реального маркетингового рабочего процесса, но код является отправной точкой. Вы можете адаптировать подсказки, пороги оценки и структуру базы знаний под свой случай использования.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">Как конвейер решает проблему "объем × качество<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Компонент</th><th>Роль</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Оркестрация агентов, интеграция обмена сообщениями (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Хранение знаний, семантическая дедупликация, поиск по RAG</td></tr>
<tr><td>LLMs (GPT-4o, Claude, Gemini)</td><td>Расширение запросов, генерация статей, оценка качества</td></tr>
<tr><td>Модель встраивания</td><td>Преобразование текста в векторы для Milvus (OpenAI, 1536 измерений по умолчанию)</td></tr>
</tbody>
</table>
<p>Конвейер работает в две фазы. На <strong>этапе 0</strong> исходный материал поступает в базу знаний. <strong>Фаза 1</strong> генерирует из него статьи.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вот что происходит на фазе 1:</p>
<ol>
<li>Пользователь отправляет сообщение через Lark, Telegram или WhatsApp. OpenClaw получает его и направляет навыку генерации ГЕО.</li>
<li>Этот навык преобразует тему пользователя в длинные поисковые запросы, используя LLM - конкретные вопросы, которые реальные пользователи задают поисковым системам AI.</li>
<li>Каждый запрос встраивается и проверяется в Milvus на наличие семантических дубликатов. Запросы, слишком похожие на существующий контент (косинусное сходство &gt; 0,85), отбрасываются.</li>
<li>Выжившие запросы запускают RAG-поиск <strong>сразу</strong> из <strong>двух коллекций Milvus</strong>: базы знаний (документы по бренду) и архива статей (ранее созданный контент). Такое двойное извлечение позволяет обеспечить привязку результатов к реальному исходному материалу.</li>
<li>LLM генерирует каждую статью, используя полученный контекст, а затем оценивает ее по рубрике качества GEO.</li>
<li>Готовая статья записывается обратно в Milvus, обогащая пулы dedup и RAG для следующей партии.</li>
</ol>
<p>Определение навыков GEO также включает в себя правила оптимизации: ведите статью с прямым ответом, используйте структурированное форматирование, явно цитируйте источники и включайте оригинальный анализ. Поисковые системы с искусственным интеллектом анализируют контент по структуре и лишают приоритета утверждения, не подтвержденные источниками, поэтому каждое правило соответствует определенному поведению поисковика.</p>
<p>Генерация выполняется партиями. Первая партия отправляется клиенту на проверку. После подтверждения направления конвейер масштабируется до полного производства.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Почему слой знаний - это разница между GEO и ИИ-спамом<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>Что отличает этот конвейер от "простого запроса ChatGPT", так это слой знаний. Без него результаты LLM выглядят полированными, но не содержат ничего проверяемого - и поисковые системы ИИ все лучше это распознают. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, векторная база данных, обеспечивающая работу этого конвейера, обладает несколькими возможностями, которые здесь важны:</p>
<p><strong>Семантическая дедупликация улавливает то, что пропускают ключевые слова.</strong> Сопоставление ключевых слов рассматривает "бенчмарки производительности Milvus" и "Как Milvus сравнивается с другими векторными базами данных?" как несвязанные запросы. <a href="https://zilliz.com/learn/vector-similarity-search">Векторное сходство</a> распознает, что они задают один и тот же вопрос, поэтому конвейер пропускает дубликаты вместо того, чтобы тратить вызов генерации.</p>
<p><strong>В RAG с двойной коллекцией источники и результаты разделены.</strong> <code translate="no">geo_knowledge</code> хранит входящие документы бренда. <code translate="no">geo_articles</code> хранит сгенерированный контент. Каждый запрос генерации обращается к обеим коллекциям - база знаний обеспечивает точность фактов, а архив статей - соответствие тональности всей партии. Эти две коллекции поддерживаются независимо друг от друга, поэтому обновление исходных материалов никогда не нарушает работу существующих статей.</p>
<p><strong>Петля обратной связи, которая улучшается с ростом масштаба.</strong> Каждая сгенерированная статья немедленно записывается обратно в Milvus. Следующая партия имеет больший пул вычитания и более богатый контекст RAG. Качество улучшается с течением времени.</p>
<p><strong>Несколько вариантов развертывания для разных нужд.</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>: Облегченная версия Milvus, которая запускается на вашем ноутбуке с одной строкой кода, без использования Docker. Отлично подходит для создания прототипов, и это все, что требуется в данном учебнике.</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a> Standalone и Milvus Distributed: более масштабируемая версия для производственного использования.</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> - это управляемый Milvus с нулевыми хлопотами. Вам не нужно беспокоиться о технической настройке и обслуживании. Доступен бесплатный уровень.</p></li>
</ul>
<p>В этом руководстве используется Milvus Lite - не нужно создавать учетную запись, не нужно устанавливать ничего, кроме <code translate="no">pip install pymilvus</code>, и все работает локально, так что вы можете попробовать полный конвейер, прежде чем принять решение.</p>
<p>Разница в развертывании заключается в URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Пошаговое руководство<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>Весь конвейер упакован как OpenClaw Skill - каталог, содержащий файл инструкций <code translate="no">SKILL.MD</code> и реализацию кода.</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Шаг 1: Определите навык OpenClaw</h3><p><code translate="no">SKILL.md</code> указывает OpenClaw, что может делать этот навык и как его вызывать. Он открывает два инструмента: <code translate="no">geo_ingest</code> для загрузки базы знаний и <code translate="no">geo_generate</code> для пакетной генерации статей. Он также содержит правила оптимизации GEO, которые определяют, что производит LLM.</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Шаг 2: Регистрация инструментов и переход на Python</h3><p>OpenClaw работает на Node.js, а конвейер GEO - на Python. <code translate="no">index.js</code> соединяет эти два инструмента - он регистрирует каждый инструмент в OpenClaw и делегирует выполнение соответствующему скрипту Python.</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Шаг 3: Загрузка исходного материала</h3><p>Прежде чем генерировать что-либо, вам нужна база знаний. <code translate="no">ingest.py</code> получает веб-страницы или читает локальные документы, разбивает текст на фрагменты, вставляет их и записывает в коллекцию <code translate="no">geo_knowledge</code> в Milvus. Именно это позволяет генерируемому контенту опираться на реальную информацию, а не на галлюцинации LLM.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Шаг 4: Расширение длиннохвостых запросов</h3><p>Учитывая такую тему, как "база данных векторов Milvus", LLM генерирует набор конкретных, реалистичных поисковых запросов - таких, какие реальные пользователи вводят в поисковые системы AI. Запросы охватывают различные типы намерений: информационные, сравнительные, "как сделать", "как решить проблему" и FAQ.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Шаг 5: Дублирование с помощью Milvus</h3><p>Здесь <a href="https://zilliz.com/learn/vector-similarity-search">векторный поиск</a> занимает достойное место. Каждый расширенный запрос встраивается и сравнивается с коллекциями <code translate="no">geo_knowledge</code> и <code translate="no">geo_articles</code>. Если косинусное сходство превышает 0,85, запрос является семантическим дубликатом того, что уже есть в системе, и отбрасывается - это предотвращает генерацию пяти немного отличающихся статей, отвечающих на один и тот же вопрос.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Шаг 6: Генерация статей с помощью RAG из двух источников</h3><p>Для каждого выжившего запроса генератор извлекает контекст из обеих коллекций Milvus: авторитетные исходные материалы из <code translate="no">geo_knowledge</code> и ранее сгенерированные статьи из <code translate="no">geo_articles</code>. Этот двойной поиск позволяет сохранить фактическую базу знаний и внутреннюю последовательность контента (историю статей).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>Обе коллекции используют один и тот же размер встраивания (1536), но хранят разные метаданные, поскольку выполняют разные функции: <code translate="no">geo_knowledge</code> отслеживает, откуда взят каждый фрагмент (для атрибуции источника), а <code translate="no">geo_articles</code> хранит исходный запрос и оценку GEO (для сопоставления dedup и фильтрации качества).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Модель данных Milvus</h3><p>Вот как выглядит каждая коллекция, если вы создаете их с нуля:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">Запуск конвейера<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Закиньте каталог <code translate="no">skills/geo-generator/</code> в папку с навыками OpenClaw или отправьте zip-файл в Lark и позвольте OpenClaw установить его. Вам нужно будет настроить ваш <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>После этого взаимодействуйте с конвейером через сообщения чата:</p>
<p><strong>Пример 1:</strong> Внести URL-адреса источников в базу знаний, затем создать статьи.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Пример 2:</strong> загрузите книгу ("Грозовой перевал"), затем сгенерируйте 3 статьи GEO и экспортируйте их в Lark doc.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">Использование этого конвейера в производстве<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Все в этом руководстве работает на Milvus Lite, что означает, что он запускается на вашем ноутбуке и останавливается, когда ваш ноутбук завершает работу. Для настоящего конвейера GEO этого недостаточно. Вы хотите, чтобы статьи генерировались, пока вы находитесь на совещании. Вы хотите, чтобы база знаний была доступна, когда коллега будет работать с партией в следующий вторник.</p>
<p>На данный момент есть два решения.</p>
<p><strong>Самостоятельное размещение Milvus с использованием автономного или распределенного режима.</strong> Ваша команда инженеров устанавливает полную версию на сервер - выделенный компьютер, либо физический, либо арендованный у облачного провайдера, например AWS. Этот режим обладает широкими возможностями и дает вам полный контроль над развертыванием, но для его настройки, обслуживания и масштабирования требуется специальная команда инженеров.</p>
<p><strong>Используйте</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a><strong>.</strong> Zilliz Cloud - это полностью управляемый Milvus с более продвинутыми функциями корпоративного уровня, созданный той же командой.</p>
<ul>
<li><p><strong>Никаких хлопот с эксплуатацией и обслуживанием.</strong></p></li>
<li><p><strong>Доступен бесплатный уровень.</strong> <a href="https://cloud.zilliz.com/signup">Бесплатный уровень</a> включает в себя 5 ГБ хранилища - этого достаточно, чтобы просмотреть все <em>"Грозовые высоты"</em> 360 раз, или 360 книг. Для больших объемов работы предоставляется 30-дневная бесплатная пробная версия.</p></li>
<li><p><strong>Всегда первыми получаем новые функции.</strong> Когда Milvus выпускает улучшения, Zilliz Cloud получает их автоматически - не нужно ждать, пока ваша команда запланирует обновление.</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p><a href="https://cloud.zilliz.com/signup">Зарегистрируйтесь в Zilliz Cloud</a> и попробуйте.</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">Когда генерация контента GEO дает обратный эффект<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>Генерация контента GEO работает только в том случае, если за ней стоит база знаний. Есть несколько случаев, когда такой подход приносит больше вреда, чем пользы:</p>
<p><strong>Отсутствие авторитетного исходного материала.</strong> Без прочной базы знаний LLM опирается на обучающие данные. В результате в лучшем случае получаются общие данные, в худшем - галлюцинации. Весь смысл шага RAG заключается в том, чтобы обосновать генерацию проверенной информацией - пропустите его, и вы просто займетесь оперативным проектированием с дополнительными шагами.</p>
<p><strong>Продвижение того, чего не существует.</strong> Если продукт работает не так, как описано, это не GEO - это дезинформация. Этап самооценки позволяет выявить некоторые проблемы с качеством, но он не может проверить утверждения, которым не противоречит база знаний.</p>
<p><strong>Ваша аудитория - исключительно люди.</strong> Оптимизация GEO (структурированные заголовки, прямые ответы в первом абзаце, плотность цитирования) предназначена для удобства поиска ИИ. Если вы пишете исключительно для людей, это может показаться шаблонным. Знайте, на какую аудиторию вы ориентируетесь.</p>
<p><strong>Замечание по поводу порога вычитания.</strong> Конвейер отбрасывает запросы с косинусным сходством выше 0,85. Если через него проходит слишком много почти дубликатов, снизьте этот порог. Если конвейер отбрасывает запросы, которые кажутся действительно разными, увеличьте его. 0,85 - разумная отправная точка, но правильное значение зависит от того, насколько узкой является ваша тема.</p>
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
    </button></h2><p>GEO находится там, где SEO было десять лет назад - достаточно рано, чтобы правильная инфраструктура дала вам реальное преимущество. В этом руководстве построен конвейер, который генерирует статьи, которые действительно цитируют поисковые системы AI, основанные на собственных исходных материалах вашего бренда, а не на галлюцинациях LLM. В качестве стека используется <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> для оркестровки, <a href="https://milvus.io/intro">Milvus</a> для хранения знаний и <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-поиска</a>, а также LLM для генерации и оценки.</p>
<p>Полный исходный код доступен на <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>Если вы разрабатываете стратегию GEO и нуждаетесь в инфраструктуре для ее поддержки:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">Slack-сообществу Milvus</a>, чтобы узнать, как другие команды используют векторный поиск для контента, dedup и RAG.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы обсудить с командой ваш вариант использования.</li>
<li>Если вы предпочитаете обойтись без настройки инфраструктуры, у <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемой Milvus) есть бесплатный уровень - одно изменение URI и вы в производстве.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают, когда маркетинговые команды начинают изучать GEO:</p>
<p><strong>Мой SEO-трафик падает. Является ли GEO заменой?</strong>GEO не заменяет SEO - он расширяет его на новый канал. Традиционное SEO по-прежнему привлекает трафик от пользователей, которые переходят на страницы. GEO нацелен на растущую долю запросов, по которым пользователи получают ответы непосредственно от искусственного интеллекта (Perplexity, ChatGPT Search, Google AI Overview), не заходя на сайт. Если вы наблюдаете в своей аналитике рост числа нулевых кликов, это трафик, который GEO призван вернуть - не за счет кликов, а за счет упоминания бренда в ответах, сгенерированных ИИ.</p>
<p><strong>Чем контент GEO отличается от обычного контента, генерируемого искусственным интеллектом?</strong>Большинство контента, генерируемого искусственным интеллектом, является общим - LLM черпает из обучающих данных и создает нечто, что звучит разумно, но не основано на реальных фактах, утверждениях или данных вашего бренда. Контент GEO основывается на базе знаний проверенных источников с помощью RAG (генерация с расширением поиска). Разница видна на выходе: конкретные детали продукта вместо расплывчатых обобщений, реальные цифры вместо сфабрикованных статистических данных и последовательный голос бренда в десятках статей.</p>
<p><strong>Сколько статей мне нужно для работы GEO?</strong>Магического числа нет, но логика понятна: Модели искусственного интеллекта синтезируют информацию из нескольких источников для каждого ответа. Чем больше длиннохвостых запросов вы охватите качественным контентом, тем чаще будет появляться ваш бренд. Начните с 20-30 статей по вашей основной теме, измерьте, какие из них цитируются (проверьте частоту упоминаний ИИ и реферальный трафик), и расширяйтесь дальше.</p>
<p><strong>Не будут ли поисковые системы с искусственным интеллектом наказывать массовый контент?</strong>Будут, если он некачественный. Поисковые системы с искусственным интеллектом все лучше определяют необоснованные утверждения, переработанные фразы и контент, не несущий оригинальной ценности. Именно поэтому этот конвейер включает в себя базу знаний для обоснования и этап самооценки для контроля качества. Цель состоит не в том, чтобы генерировать больше контента, а в том, чтобы генерировать контент, который действительно достаточно полезен, чтобы модели искусственного интеллекта могли ссылаться на него.</p>
