---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss против o4-mini: производительность на грани - надежно, но не
  умопомрачительно
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI перехватывает внимание, выкладывая в открытый доступ две модели
  рассуждений: gpt-oss-120b и gpt-oss-20b, лицензированные под Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>Мир искусственного интеллекта разгорается с новой силой. Всего за несколько недель Anthropic выпустила Claude 4.1 Opus, DeepMind ошеломила всех симулятором мира Genie 3, а теперь и OpenAI перехватывает внимание, выложив в открытый доступ две модели рассуждений: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> и <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, лицензированные по разрешительной лицензии Apache 2.0.</p>
<p>После запуска эти модели мгновенно заняли первое место по популярности на Hugging Face - и не зря. Впервые с 2019 года OpenAI выпустила модели с открытым весом, которые действительно готовы к производству. Этот шаг не случаен - после нескольких лет проталкивания доступа только к API, OpenAI явно реагирует на давление со стороны лидеров open-source, таких как DeepSeek, Meta's LLaMA и Qwen, которые доминируют как в бенчмарках, так и в рабочих процессах разработчиков.</p>
<p>В этом посте мы рассмотрим, чем отличается GPT-oss, как он сравнивается с такими ведущими открытыми моделями, как DeepSeek R1 и Qwen 3, и почему это должно волновать разработчиков. Мы также рассмотрим процесс создания RAG-системы, способной к рассуждениям, с использованием GPT-oss и Milvus, самой популярной векторной базы данных с открытым исходным кодом.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">Что делает GPT-oss особенным и почему это должно вас волновать?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss - это не просто очередное снижение веса. Он обеспечивает преимущества в пяти ключевых областях, которые важны для разработчиков:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Создан для пограничного развертывания</h3><p>GPT-oss поставляется в двух стратегически важных вариантах:</p>
<ul>
<li><p>gpt-oss-120b: 117B всего, 5,1B активных на токен</p></li>
<li><p>gpt-oss-20b: 21B всего, 3,6B активных на токен.</p></li>
</ul>
<p>Благодаря использованию архитектуры Mixture-of-Experts (MoE) во время вывода активным является только подмножество параметров. Это делает обе модели легкими в исполнении относительно их размера:</p>
<ul>
<li><p>gpt-oss-120b работает на одном GPU объемом 80 ГБ (H100)</p></li>
<li><p>gpt-oss-20b занимает всего 16 ГБ VRAM, что позволяет использовать ее на ноутбуках высокого класса или устройствах, работающих на граничных устройствах.</p></li>
</ul>
<p>Согласно тестам OpenAI, gpt-oss-20b является самой быстрой моделью OpenAI для выводов - идеальное решение для развертывания с низкой задержкой или автономных агентов рассуждений.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Сильная производительность в бенчмарках</h3><p>Согласно оценкам OpenAI:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> демонстрирует почти равные с o4-mini результаты в рассуждениях, использовании инструментов и соревновательном кодировании (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>gpt-oss-20b</strong> конкурирует с o3-mini и даже превосходит его в математике и рассуждениях о здравоохранении</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Экономически эффективное обучение</h3><p>OpenAI заявляет о производительности, эквивалентной o3-mini и o4-mini, но при этом значительно меньшей стоимости обучения:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 миллиона H100-часов → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K H100-часов → ~$1M</p></li>
</ul>
<p>Сравните это с многосотмиллионными бюджетами, стоящими за такими моделями, как GPT-4. GPT-oss доказывает, что эффективное масштабирование и выбор архитектуры могут обеспечить конкурентоспособную производительность без огромного углеродного следа.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Настоящая свобода открытого исходного кода</h3><p>GPT-oss использует лицензию Apache 2.0, что означает:</p>
<ul>
<li><p>Коммерческое использование разрешено</p></li>
<li><p>Полное право на модификацию и распространение</p></li>
<li><p>Никаких ограничений на использование или положений об авторском леве.</p></li>
</ul>
<p>Это действительно открытый исходный код, а не релиз, предназначенный только для исследований. Вы можете настраивать его для использования в конкретных областях, внедрять в производство с полным контролем и создавать на его основе коммерческие продукты. Среди ключевых особенностей - настраиваемая глубина рассуждений (низкая/средняя/высокая), полная видимость цепочки мыслей, а также встроенный вызов инструментов с поддержкой структурированного вывода.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Потенциальный предварительный просмотр GPT-5</h3><p>OpenAI не раскрывает всего, но детали архитектуры позволяют предположить, что это может быть превью <strong>GPT-5</strong>:</p>
<ul>
<li><p>Использует MoE с 4 экспертами на вход</p></li>
<li><p>Чередование плотного и локального рассеянного внимания (модель GPT-3)</p></li>
<li><p>Имеет больше головок внимания</p></li>
<li><p>Интересно, что блоки смещения из GPT-2 снова появились.</p></li>
</ul>
<p>Если вы следите за сигналами о том, что будет дальше, GPT-oss может стать самым ясным публичным намеком.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Технические характеристики ядра</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Модель</strong></td><td><strong>Всего параметров</strong></td><td><strong>Активные параметры</strong></td><td><strong>Эксперты</strong></td><td><strong>Длина контекста</strong></td><td><strong>Запрос памяти VRAM</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80 ГБ</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16 ГБ</td></tr>
</tbody>
</table>
<p>Обе модели используют токенизатор o200k_harmony и поддерживают длину контекста в 128 000 токенов (примерно 96 000-100 000 слов).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss в сравнении с другими моделями рассуждений<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Вот как GPT-oss выглядит в сравнении с внутренними моделями OpenAI и лучшими конкурентами с открытым исходным кодом:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Модель</strong></td><td><strong>Параметры (активные)</strong></td><td><strong>Память</strong></td><td><strong>Сильные стороны</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117 Б (5,1 Б активной)</td><td>80 ГБ</td><td>Однопроцессорная, открытое обоснование</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B активно)</td><td>16 ГБ</td><td>Пограничное развертывание, быстрые выводы</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671 Б (~37 Б активны)</td><td>Распределенный</td><td>Лидер бенчмарков, доказанная производительность</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Собственный</td><td>Только API</td><td>Сильное обоснование (закрыто)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Собственный</td><td>Только API</td><td>Облегченные рассуждения (закрыто)</td></tr>
</tbody>
</table>
<p>Вот что мы обнаружили, основываясь на различных моделях бенчмаркинга:</p>
<ul>
<li><p><strong>GPT-oss против собственных моделей OpenAI:</strong> gpt-oss-120b соответствует o4-mini по соревновательной математике (AIME), кодированию (Codeforces) и использованию инструментов (TauBench). Модель 20b демонстрирует схожие результаты с o3-mini, несмотря на то, что она гораздо меньше.</p></li>
<li><p><strong>GPT-oss против DeepSeek R1:</strong> DeepSeek R1 доминирует по чистой производительности, но требует наличия распределенной инфраструктуры. GPT-oss предлагает более простое развертывание - для модели 120b не требуется распределенная инфраструктура.</p></li>
</ul>
<p>В итоге GPT-oss предлагает наилучшее сочетание производительности, открытого доступа и возможности развертывания. DeepSeek R1 выигрывает по чистой производительности, но GPT-oss обеспечивает оптимальный баланс для большинства разработчиков.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Практическое занятие: Сборка с GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы увидели, что дает GPT-oss, пришло время применить его на практике.</p>
<p>В следующих разделах мы рассмотрим практическое руководство по созданию системы RAG, способной к рассуждениям, с помощью gpt-oss-20b и Milvus. Все работает локально, ключ API не требуется.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Настройка среды</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Подготовка набора данных</h3><p>В качестве базы знаний мы будем использовать документацию Milvus:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Настройка модели</h3><p>Получите доступ к GPT-oss через <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (или запустите локально). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> - это платформа, позволяющая разработчикам получать доступ и переключаться между несколькими моделями ИИ (такими как GPT-4, Claude, Mistral) через единый унифицированный API. Это полезно для сравнения моделей или создания приложений, работающих с разными поставщиками ИИ. Теперь серия GPT-oss доступна на OpenRouter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Настройка векторной базы данных Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>О настройках параметров MilvusClient:</p>
<ul>
<li><p>Установка URI на локальный файл (например, <code translate="no">./milvus.db</code>) является наиболее удобным методом, поскольку он автоматически использует Milvus Lite для хранения всех данных в этом файле.</p></li>
<li><p>Для больших объемов данных можно установить более мощный сервер Milvus на Docker или Kubernetes. В этом случае используйте URI сервера (например, <code translate="no">http://localhost:19530</code>) в качестве URI.</p></li>
<li><p>Если вы хотите использовать <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(управляемый сервис Milvus), настройте URI и токен, которые соответствуют публичной конечной точке и ключу API в Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Добавление документов в коллекцию</h3><p>Теперь мы создадим вкрапления для наших текстовых фрагментов и добавим их в Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Выход:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">Конвейер запросов RAG</h3><p>Теперь самое интересное - давайте настроим нашу систему RAG на ответы на вопросы.</p>
<p>Зададим распространенный вопрос о Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Поиск этого вопроса в коллекции и получение 3 лучших семантически совпадающих результатов:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Посмотрим на результаты поиска по этому запросу:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Использование GPT-oss для построения RAG-ответов</h3><p>Преобразуйте полученные документы в строковый формат:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Предоставьте системную подсказку и пользовательскую подсказку для большой языковой модели:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Используйте последнюю модель gpt-oss для создания ответа на основе запроса:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Заключительные мысли о GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss - это тихое признание OpenAI в том, что открытый исходный код больше нельзя игнорировать. Он не переплюнул DeepSeek R1, Qwen 3 или многие другие модели, но он предлагает то, чего нет у них: конвейер обучения OpenAI, примененный к модели, которую вы можете проверить и запустить локально.</p>
<p><strong>Производительность? Солидная. Не умопомрачительная, но надежная.</strong> Модель 20B, работающая на потребительском оборудовании - или даже на мобильном с LM Studio - это то практическое преимущество, которое действительно важно для разработчиков. Это больше похоже на "это просто работает", чем на "вау, это все меняет". И, честно говоря, это прекрасно.</p>
<p><strong>А вот в чем он не дотягивает, так это в многоязыковой поддержке.</strong> Если вы работаете не на английском языке, вы столкнетесь со странными формулировками, проблемами с орфографией и общей путаницей. Модель явно обучалась с учетом английского языка. Если вам важен глобальный охват, то, скорее всего, вам придется доработать ее на многоязычном наборе данных.</p>
<p>Но самое интересное - это время. Тизер OpenAI на X - с буквой "5", опущенной в слово "LIVESTREAM" - выглядит как подстава. Возможно, GPT-oss не будет главным актом, но это может быть превью к тому, что будет в GPT-5. Те же ингредиенты, другой масштаб. Давайте подождем.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Настоящий выигрыш - это больше качественных вариантов.</strong> Конкуренция стимулирует инновации, и возвращение OpenAI к разработке с открытым исходным кодом выгодно всем. Протестируйте GPT-oss на соответствие вашим специфическим требованиям, но выбирайте, основываясь на том, что действительно работает для вашего случая использования, а не на узнаваемости бренда.</p>
