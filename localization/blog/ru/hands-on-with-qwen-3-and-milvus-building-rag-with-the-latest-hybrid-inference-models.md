---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Практическая работа с Qwen 3 и Milvus: создание RAG с помощью новейших
  гибридных моделей вывода
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Расскажет о ключевых возможностях моделей Qwen 3 и проведет вас через процесс
  сопряжения Qwen 3 с Milvus для создания локальной системы генерации с
  расширенным поиском (RAG), учитывающей затраты.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Как разработчик, постоянно ищущий практические инструменты ИИ, я не мог проигнорировать шумиху вокруг последнего релиза Alibaba Cloud: семейства моделей<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a> - надежной линейки из восьми гибридных моделей вывода, призванных изменить баланс между интеллектом и эффективностью. Всего за 12 часов проект набрал <strong>более 17 000 звезд на GitHub</strong> и достиг пика в <strong>23 000 загрузок</strong> в час на Hugging Face.</p>
<p>Что же изменилось на этот раз? Если коротко, то модели Qwen 3 объединяют в единую архитектуру как рассуждения (медленные, вдумчивые ответы), так и не рассуждения (быстрые, эффективные ответы), включают в себя различные варианты моделей, улучшенное обучение и производительность, а также предоставляют больше возможностей для предприятий.</p>
<p>В этом посте я кратко расскажу о ключевых возможностях моделей Qwen 3, на которые вам следует обратить внимание, и проведу вас через процесс сопряжения Qwen 3 с Milvus для создания локальной системы поиска-дополнения (RAG) с учетом затрат - в комплекте с практическим кодом и советами по оптимизации производительности по сравнению с задержкой.</p>
<p>Давайте погрузимся в процесс.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Что интересного в Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>После тестирования и изучения Qwen 3 стало ясно, что дело не только в больших цифрах на листе с характеристиками. Речь идет о том, как конструктивные решения модели на самом деле помогают разработчикам создавать лучшие приложения GenAI - быстрее, умнее и с большим контролем. Вот что выделяется.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Гибридные режимы мышления: Умный, когда он нужен, быстрый, когда не нужен</h3><p>Одна из самых инновационных особенностей Qwen 3 - <strong>гибридная архитектура выводов</strong>. Она дает вам возможность тонко контролировать, сколько "размышлений" модель делает для каждой конкретной задачи. В конце концов, не все задачи требуют сложных рассуждений.</p>
<ul>
<li><p>Для сложных задач, требующих глубокого анализа, вы можете задействовать всю мощь рассуждений - даже если они будут медленнее.</p></li>
<li><p>Для повседневных простых запросов можно переключиться в более быстрый и легкий режим.</p></li>
<li><p>Вы даже можете установить <strong>"бюджет мышления</strong> " - ограничить количество вычислений или жетонов, сжигаемых за сессию.</p></li>
</ul>
<p>Это не просто лабораторная функция. Она напрямую направлена на решение ежедневного компромисса, который приходится искать разработчикам: предоставление высококачественных ответов без увеличения расходов на инфраструктуру и задержек для пользователей.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Универсальная линейка: модели MoE и плотные модели для разных потребностей</h3><p>Qwen 3 предоставляет широкий спектр моделей, разработанных для удовлетворения различных операционных потребностей:</p>
<ul>
<li><p><strong>Две модели MoE (Mixture of Experts)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 миллиардов общих параметров, 22 миллиарда активных на запрос</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 миллиардов общих параметров, 3 миллиарда активных.</p></li>
</ul></li>
<li><p><strong>Шесть плотных моделей</strong>: от проворных 0,6 Б до внушительных 32 Б параметров.</p></li>
</ul>
<p><em>Краткая техническая справка: Плотные модели (например, GPT-3 или BERT) всегда активируют все параметры, что делает их более тяжелыми, но иногда и более предсказуемыми.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>Модели MoE</em></a> <em>активируют только часть сети за раз, что делает их гораздо более эффективными при масштабировании.</em></p>
<p>На практике эта универсальная линейка моделей означает, что вы можете:</p>
<ul>
<li><p>Использовать плотные модели для жестких, предсказуемых рабочих нагрузок (например, для встраиваемых устройств).</p></li>
<li><p>Использовать модели MoE, когда вам нужны мощные возможности, не требующие больших затрат на облачные вычисления.</p></li>
</ul>
<p>Благодаря такому разнообразию вы можете адаптировать свое развертывание - от легких, готовых к работе на границе, до мощных облачных развертываний - без привязки к какому-либо одному типу модели.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Ориентированность на эффективность и развертывание в реальном мире</h3><p>Вместо того чтобы сосредоточиться исключительно на масштабировании размера модели, Qwen 3 фокусируется на эффективности обучения и практичности развертывания:</p>
<ul>
<li><p><strong>Обучение на 36 триллионах токенов</strong> - вдвое больше, чем в Qwen 2.5.</p></li>
<li><p><strong>Расширение до 235 ББ параметров</strong> - но разумное управление с помощью методов MoE, балансирующее возможности с требованиями к ресурсам.</p></li>
<li><p><strong>Оптимизирована для развертывания</strong> - динамическое квантование (с FP4 до INT8) позволяет запускать даже самую большую модель Qwen 3 на скромной инфраструктуре - например, на четырех графических процессорах H20.</p></li>
</ul>
<p>Цель ясна: обеспечить более высокую производительность, не требуя чрезмерных инвестиций в инфраструктуру.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Создано для реальной интеграции: Поддержка MCP и многоязычные возможности</h3><p>Qwen 3 разработан с учетом интеграции, а не только изолированной производительности моделей:</p>
<ul>
<li><p><strong>Совместимость с протоколом MCP (Model Context Protocol)</strong> обеспечивает бесшовную интеграцию с внешними базами данных, API и инструментами, сокращая инженерные затраты на сложные приложения.</p></li>
<li><p><strong>Qwen-Agent</strong> улучшает вызов инструментов и оркестровку рабочих процессов, поддерживая создание более динамичных и действенных систем искусственного интеллекта.</p></li>
<li><p><strong>Многоязычная поддержка 119 языков и диалектов</strong> делает Qwen 3 отличным выбором для приложений, ориентированных на глобальные и многоязычные рынки.</p></li>
</ul>
<p>Все эти функции в совокупности облегчают разработчикам создание систем производственного уровня без необходимости обширной разработки модели на заказ.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 теперь поддерживается в DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> - это проект с открытым исходным кодом для глубокого поиска и генерации отчетов, разработанный как локально-первостепенная альтернатива Deep Research от OpenAI. Он помогает разработчикам создавать системы, позволяющие получать высококачественную контекстно-зависимую информацию из частных или специфических для конкретной области источников данных.</p>
<p>DeepSearcher теперь поддерживает гибридную архитектуру выводов Qwen 3, позволяя разработчикам динамически переключать рассуждения - применять более глубокие выводы только тогда, когда они приносят пользу, и пропускать их, когда важнее скорость.</p>
<p>Под капотом DeepSearcher интегрируется с<a href="https://milvus.io"> Milvus</a>, высокопроизводительной векторной базой данных, разработанной инженерами Zilliz, чтобы обеспечить быстрый и точный семантический поиск по локальным данным. В сочетании с гибкостью модели это дает разработчикам больший контроль над поведением системы, стоимостью и удобством использования.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Практическое руководство: Построение системы RAG с помощью Qwen 3 и Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте применим эти модели Qwen 3 на практике, построив систему RAG с использованием векторной базы данных Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Настройте среду.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Примечание: Вам потребуется получить API-ключ от Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Подготовка данных</h3><p>В качестве основной базы знаний мы будем использовать страницы документации Milvus.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Настройка моделей</h3><p>Для доступа к Qwen 3 мы будем использовать API DashScope, совместимый с OpenAI:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Сгенерируем тестовое вложение и выведем его размеры и первые несколько элементов:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Создание коллекции Milvus</h3><p>Давайте настроим нашу векторную базу данных Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>О настройках параметров MilvusClient:</p>
<ul>
<li><p>Установка URI на локальный файл (например, <code translate="no">./milvus.db</code>) - наиболее удобный метод, поскольку он автоматически использует Milvus Lite для хранения всех данных в этом файле.</p></li>
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
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Создание системы запросов RAG</h3><p>Теперь самое интересное - давайте настроим нашу систему RAG на ответы на вопросы.</p>
<p>Зададим распространенный вопрос о Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Выполним поиск этого вопроса в коллекции и получим 3 лучших семантически совпадающих результата:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Посмотрим на результаты поиска по этому запросу:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Вывод:</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Использование LLM для построения ответа RAG</h3><p>Преобразуйте полученные документы в строковый формат:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Предоставьте системную подсказку и пользовательскую подсказку для большой языковой модели:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Используйте последнюю модель Qwen для создания ответа на основе запроса:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Выходные данные:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Сравнение обоснованных и необоснованных режимов: Практический тест<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Я провел тест, сравнивающий два режима умозаключений на математической задаче:</p>
<p><strong>Задача:</strong> Человек A и человек B начинают бег из одного и того же места. А выходит первым и бежит 2 часа со скоростью 5 км/ч. Б следует за ним со скоростью 15 км/ч. Сколько времени потребуется B, чтобы догнать его?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>При включенном режиме рассуждений:</strong></p>
<ul>
<li><p>Время обработки: ~74,83 секунды</p></li>
<li><p>Глубокий анализ, разбор задачи, несколько путей решения</p></li>
<li><p>Высококачественный вывод в формате markdown с формулами</p></li>
</ul>
<p>(Для удобства читателя ниже приведен скриншот визуализации ответа модели в формате markdown)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Режим без рассуждений:</strong></p>
<p>В коде нужно только установить <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Результаты работы режима без рассуждений на этой задаче:</p>
<ul>
<li>Время обработки: ~74,83 секунды</li>
<li>Глубокий анализ, разбор проблемы, несколько путей решения</li>
<li>Высококачественный вывод в формате markdown с формулами</li>
</ul>
<p>(Для удобства читателя ниже приведен скриншот визуализации ответа модели в формате markdown)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Qwen 3 представляет гибкую архитектуру моделей, которая хорошо согласуется с реальными потребностями разработки GenAI. Благодаря различным размерам моделей (включая плотные и MoE-варианты), гибридным режимам вывода, интеграции с MCP и многоязыковой поддержке, разработчики получают больше возможностей для настройки производительности, задержки и стоимости в зависимости от конкретного случая использования.</p>
<p>Вместо того чтобы делать акцент только на масштабе, Qwen 3 фокусируется на адаптивности. Это делает его практичным выбором для создания конвейеров RAG, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">агентов искусственного интеллекта</a> и производственных приложений, которым требуются как возможности рассуждений, так и экономичная работа.</p>
<p>В паре с такой инфраструктурой, как<a href="https://milvus.io"> Milvus</a> - высокопроизводительной векторной базой данных с открытым исходным кодом, - возможности Qwen 3 становятся еще более полезными, обеспечивая быстрый семантический поиск и плавную интеграцию с локальными системами данных. Вместе они создают прочную основу для интеллектуальных и отзывчивых приложений GenAI в масштабе.</p>
