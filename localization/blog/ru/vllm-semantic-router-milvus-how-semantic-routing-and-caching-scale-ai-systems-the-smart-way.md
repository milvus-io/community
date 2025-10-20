---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  Семантический маршрутизатор vLLM + Milvus: как с помощью семантической
  маршрутизации и кэширования построить масштабируемые системы искусственного
  интеллекта умным способом
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Узнайте, как vLLM, Milvus и семантическая маршрутизация оптимизируют вывод
  больших моделей, снижают затраты на вычисления и повышают производительность
  ИИ в масштабируемых развертываниях.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>Большинство приложений с искусственным интеллектом полагаются на одну модель для каждого запроса. Но такой подход быстро наталкивается на ограничения. Большие модели мощные, но дорогие, даже если они используются для простых запросов. Меньшие модели дешевле и быстрее, но не могут справиться со сложными рассуждениями. Когда трафик возрастает - скажем, ваше приложение с искусственным интеллектом внезапно становится вирусным и за ночь набирает десять миллионов пользователей, - неэффективность этой системы "одна модель для всех" становится болезненно очевидной. Задержки растут, счета за GPU увеличиваются, и модель, которая еще вчера работала отлично, начинает задыхаться.</p>
<p>И мой друг, <em>вы</em>, инженер, создавший это приложение, должны быстро исправить ситуацию.</p>
<p>Представьте, что вы развертываете несколько моделей разного размера и ваша система автоматически выбирает лучшую для каждого запроса. Простые запросы отправляются к маленьким моделям, сложные - к большим. Именно такая идея лежит в основе <a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router -</strong></a>механизма маршрутизации, который направляет запросы на основе смысла, а не конечных точек. Он анализирует семантическое содержание, сложность и намерения каждого запроса, чтобы выбрать наиболее подходящую языковую модель, гарантируя, что каждый запрос будет обработан той моделью, которая лучше всего для этого подходит.</p>
<p>Чтобы сделать эту работу еще более эффективной, Semantic Router работает в паре с <a href="https://milvus.io/"><strong>Milvus</strong></a>, векторной базой данных с открытым исходным кодом, которая служит в качестве <strong>семантического кэш-слоя</strong>. Перед повторным вычислением ответа он проверяет, не был ли уже обработан семантически похожий запрос, и в случае обнаружения мгновенно извлекает кэшированный результат. Результат: более быстрые ответы, более низкие затраты и система поиска, которая масштабируется разумно, а не расточительно.</p>
<p>В этом посте мы подробно рассмотрим, как работает <strong>семантический маршрутизатор vLLM</strong>, как <strong>Milvus</strong> обеспечивает его кэширующий слой и как эта архитектура может быть применена в реальных приложениях ИИ.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">Что такое семантический маршрутизатор?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>По своей сути, <strong>семантический маршрутизатор</strong> - это система, которая решает <em>, какая модель</em> должна обрабатывать данный запрос, исходя из его смысла, сложности и намерений. Вместо того чтобы направлять все в одну модель, он разумно распределяет запросы между несколькими моделями, чтобы сбалансировать точность, задержку и стоимость.</p>
<p>Архитектурно она построена на трех ключевых уровнях: <strong>Семантическая маршрутизация</strong>, <strong>смесь моделей (MoM)</strong> и <strong>слой кэша</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Слой семантической маршрутизации</h3><p><strong>Семантический слой маршрутизации</strong> - это мозг системы. Он анализирует каждый входной сигнал - что он запрашивает, насколько он сложен и какого рода рассуждения требует, - чтобы выбрать модель, лучше всего подходящую для данной работы. Например, простой поиск фактов может быть направлен на легкую модель, а многоэтапный запрос на рассуждение - на более крупную. Такая динамическая маршрутизация обеспечивает быстродействие системы даже при увеличении трафика и разнообразия запросов.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">Слой смеси моделей (MoM)</h3><p>Второй слой, <strong>Mixture of Models (MoM)</strong>, объединяет несколько моделей разного размера и возможностей в единую систему. Он вдохновлен архитектурой <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong>, но вместо того, чтобы выбирать "экспертов" внутри одной большой модели, он работает с несколькими независимыми моделями. Такая конструкция позволяет сократить время ожидания, снизить затраты и избежать привязки к какому-либо одному поставщику моделей.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">Уровень кэша: Где Milvus делает разницу</h3><p>Наконец, <strong>слой кэша, работающий</strong>на базе <a href="https://milvus.io/">Milvus Vector Database, выполняет роль</a>памяти системы. Перед запуском нового запроса он проверяет, не обрабатывался ли ранее семантически похожий запрос. Если да, то он мгновенно извлекает кэшированный результат, экономя время вычислений и повышая пропускную способность.</p>
<p>Традиционные системы кэширования опираются на хранилища ключевых значений в памяти, сопоставляя запросы по точным строкам или шаблонам. Это хорошо работает, когда запросы повторяются и предсказуемы. Но реальные пользователи редко набирают одно и то же дважды. Как только формулировка меняется - даже незначительно - кэш не распознает ее как одно и то же намерение. Со временем процент попадания в кэш падает, а прирост производительности исчезает по мере естественного изменения формулировок.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Чтобы исправить ситуацию, нам нужно кэширование, которое понимает <em>смысл</em>, а не просто подбирает слова. Именно здесь на помощь приходит <strong>семантический поиск</strong>. Вместо того чтобы сравнивать строки, он сравнивает вкрапления - высокоразмерные векторные представления, которые отражают семантическое сходство. Однако проблема заключается в масштабе. Выполнение грубого поиска по миллионам или миллиардам векторов на одной машине (с временной сложностью O(N-d)) является запретительным с вычислительной точки зрения. Затраты памяти возрастают, горизонтальная масштабируемость рушится, и система с трудом справляется с внезапными всплесками трафика или длинными запросами.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus</strong> - распределенная векторная база данных, специально созданная для крупномасштабного семантического поиска, - обеспечивает горизонтальную масштабируемость и отказоустойчивость, необходимые этому слою кэша. Он эффективно хранит вкрапления на разных узлах и выполняет поиск по <a href="https://zilliz.com/blog/ANN-machine-learning">приближенным ближайшим соседям</a>(ANN) с минимальной задержкой даже при огромных масштабах. При правильном выборе пороговых значений сходства и стратегий резервного копирования Milvus обеспечивает стабильную и предсказуемую производительность, превращая кэш-слой в устойчивую семантическую память для всей системы маршрутизации.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Как разработчики используют Semantic Router + Milvus в производстве<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Сочетание <strong>vLLM Semantic Router</strong> и <strong>Milvus</strong> проявляет себя в реальных производственных средах, где важны скорость, стоимость и возможность повторного использования.</p>
<p>Можно выделить три распространенных сценария:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Вопросы и ответы в службе поддержки клиентов</h3><p>Боты, работающие с клиентами, ежедневно обрабатывают огромные объемы повторяющихся запросов - сброс пароля, обновление учетной записи, статус доставки. Эта область чувствительна как к затратам, так и к задержкам, что делает ее идеальной для семантической маршрутизации. Маршрутизатор отправляет рутинные вопросы более мелким и быстрым моделям, а сложные или неоднозначные вопросы передает более крупным моделям для более глубокого анализа. Тем временем Milvus кэширует предыдущие пары вопросов и ответов, поэтому при появлении похожих запросов система может мгновенно использовать прошлые ответы, а не генерировать их заново.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Помощь в работе с кодом</h3><p>В инструментах для разработчиков или помощниках IDE многие запросы пересекаются - помощь по синтаксису, поиск API, небольшие подсказки по отладке. Анализируя семантическую структуру каждого запроса, маршрутизатор динамически выбирает подходящий размер модели: легкую для простых задач, более мощную для многоэтапных рассуждений. Milvus еще больше повышает скорость реагирования, кэшируя похожие проблемы кодирования и их решения, превращая предыдущие взаимодействия с пользователем в базу знаний для многократного использования.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. База знаний предприятия</h3><p>Корпоративные запросы имеют тенденцию повторяться с течением времени - поиск политики, ссылки на соответствие нормативным требованиям, часто задаваемые вопросы о продуктах. С помощью Milvus в качестве семантического кэш-слоя можно эффективно хранить и извлекать часто задаваемые вопросы и ответы на них. Это позволяет минимизировать избыточные вычисления, сохраняя согласованность ответов в разных отделах и регионах.</p>
<p>Конвейер <strong>Semantic Router + Milvus</strong> реализован на <strong>Go</strong> и <strong>Rust</strong>, что обеспечивает высокую производительность и низкую задержку. Интегрированный на уровне шлюза, он постоянно отслеживает ключевые метрики, такие как частота попаданий, задержка маршрутизации и производительность модели, чтобы точно настроить стратегии маршрутизации в режиме реального времени.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Как быстро протестировать семантическое кэширование в семантическом маршрутизаторе<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем развертывать семантическое кэширование в масштабе, полезно проверить, как оно ведет себя в контролируемой среде. В этом разделе мы проведем быстрый локальный тест, который покажет, как Semantic Router использует <strong>Milvus</strong> в качестве семантического кэша. Вы увидите, как похожие запросы мгновенно попадают в кэш, в то время как новые или отличные запросы запускают генерацию модели - это доказывает логику кэширования в действии.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><ul>
<li>Контейнерная среда: Docker + Docker Compose</li>
<li>Векторная база данных: Milvus Service</li>
<li>LLM + Embedding: Проект загружен локально</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.Развертывание векторной базы данных Milvus</h3><p>Скачайте файлы развертывания</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Запустите службу Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Клонируйте проект</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Загрузите локальные модели</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Изменения конфигурации</h3><p>Примечание: Измените тип semantic_cache на milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Изменение конфигурации Mmilvus Примечание: Заполните только что развернутую службу Milvusmilvus.</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Запустите проект</h3><p>Примечание: Рекомендуется изменить некоторые зависимости Dockerfile на внутренние источники</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Тестовые запросы</h3><p>Примечание: Всего два запроса (без кэша и с попаданием в кэш) Первый запрос:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Выход:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Второй запрос:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Выход:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Этот тест демонстрирует семантическое кэширование Semantic Router в действии. Используя Milvus в качестве векторной базы данных, он эффективно сопоставляет семантически схожие запросы, улучшая время отклика, когда пользователи задают одинаковые или похожие вопросы.</p>
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
    </button></h2><p>По мере роста рабочих нагрузок ИИ и оптимизации затрат сочетание vLLM Semantic Router и <a href="https://milvus.io/">Milvus</a> предоставляет практичный способ интеллектуального масштабирования. Маршрутизируя каждый запрос к нужной модели и кэшируя семантически схожие результаты в распределенной векторной базе данных, эта система сокращает накладные расходы на вычисления, сохраняя скорость и согласованность ответов в разных случаях использования.</p>
<p>Одним словом, вы получаете более интеллектуальное масштабирование - меньше грубой силы, больше мозгов.</p>
<p>Если вы хотите узнать больше об этом, присоединяйтесь к разговору в нашем <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> или откройте проблему на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутную<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> сессию Milvus Office Hours</a>, чтобы получить индивидуальное руководство, понимание и глубокое техническое погружение от команды, стоящей за Milvus.</p>
