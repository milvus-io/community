---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Ускорение генерации кандидатов в рекомендательных системах с помощью Milvus в
  паре с PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: минимальный рабочий процесс рекомендательной системы
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Если у вас есть опыт разработки рекомендательной системы, то вы, скорее всего, стали жертвой хотя бы одной из следующих проблем:</p>
<ul>
<li>Система крайне медленно возвращает результаты из-за огромного количества наборов данных.</li>
<li>Вновь вводимые данные не могут быть обработаны в режиме реального времени для поиска или запроса.</li>
<li>Развертывание рекомендательной системы сопряжено с большими трудностями.</li>
</ul>
<p>Цель этой статьи - решить вышеупомянутые проблемы и дать вам некоторые рекомендации, представив проект системы рекомендаций продуктов, в котором используется Milvus, векторная база данных с открытым исходным кодом, в паре с PaddlePaddle, платформой глубокого обучения.</p>
<p>В этой статье мы кратко опишем минимальный рабочий процесс рекомендательной системы. Затем в ней представлены основные компоненты и детали реализации данного проекта.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">Базовый рабочий процесс рекомендательной системы<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем углубиться в сам проект, давайте сначала рассмотрим базовый рабочий процесс рекомендательной системы. Рекомендательная система может выдавать персонализированные результаты в соответствии с уникальными интересами и потребностями пользователя. Для создания таких персонализированных рекомендаций система проходит два этапа - генерацию и ранжирование кандидатов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>На первом этапе происходит генерация кандидатов, которые возвращают наиболее релевантные или похожие данные, например, продукт или видео, соответствующие профилю пользователя. Во время генерации кандидатов система сравнивает пользовательские характеристики с данными, хранящимися в ее базе данных, и извлекает те, которые похожи. Затем в процессе ранжирования система оценивает и упорядочивает полученные данные. Наконец, результаты, находящиеся в верхней части списка, показываются пользователям.</p>
<p>В нашем случае система рекомендаций продуктов сначала сравнивает профиль пользователя с характеристиками продуктов в инвентаре, чтобы отфильтровать список продуктов, отвечающих потребностям пользователя. Затем система оценивает продукты на основе их сходства с профилем пользователя, ранжирует их и, наконец, возвращает пользователю 10 лучших продуктов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Архитектура системы<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Система рекомендаций товаров в этом проекте использует три компонента: MIND, PaddleRec и Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, сокращение от &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, - это алгоритм, разработанный Alibaba Group. До появления MIND большинство распространенных моделей ИИ для рекомендаций использовали один вектор для представления разнообразных интересов пользователя. Однако одного вектора далеко не достаточно для точного представления интересов пользователя. Поэтому был предложен алгоритм MIND, позволяющий превратить множество интересов пользователя в несколько векторов.</p>
<p>В частности, MIND использует <a href="https://arxiv.org/pdf/2005.09347">сеть с несколькими интересами</a> и динамической маршрутизацией для обработки нескольких интересов одного пользователя на этапе генерации кандидатов. Сеть с несколькими интересами - это слой экстрактора нескольких интересов, построенный на механизме капсульной маршрутизации. С ее помощью можно объединить прошлое поведение пользователя с его многочисленными интересами, чтобы составить точный профиль пользователя.</p>
<p>Следующая диаграмма иллюстрирует сетевую структуру MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Чтобы представить черты пользователей, MIND принимает в качестве входных данных поведение и интересы пользователей, а затем передает их в слой встраивания для создания векторов пользователей, включая векторы интересов и поведения пользователей. Затем векторы поведения пользователя подаются в слой экстрактора интересов для создания капсул интересов пользователей. После объединения капсул пользовательских интересов с вкраплениями пользовательского поведения и использования нескольких слоев ReLU для их преобразования MIND выдает несколько векторов пользовательского представления. В данном проекте определено, что в конечном итоге MIND будет выдавать четыре вектора представлений пользователей.</p>
<p>С другой стороны, черты товара проходят через слой встраивания и преобразуются в разреженные векторы товаров. Затем каждый вектор товара проходит через слой объединения и превращается в плотный вектор.</p>
<p>Когда все данные преобразуются в векторы, вводится дополнительный слой внимания, учитывающий метки, чтобы направлять процесс обучения.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> - это крупномасштабная библиотека поисковых моделей для рекомендаций. Она является частью экосистемы Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. Цель PaddleRec - предоставить разработчикам интегрированное решение для быстрого и простого создания рекомендательных систем.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Как уже упоминалось во вступительном абзаце, инженерам, разрабатывающим рекомендательные системы, часто приходится сталкиваться с проблемами плохого юзабилити и сложного развертывания системы. Однако PaddleRec может помочь разработчикам в следующих аспектах:</p>
<ul>
<li><p>Простота использования: PaddleRec - это библиотека с открытым исходным кодом, в которой собраны различные популярные модели, включая модели генерации кандидатов, ранжирования, повторного ранжирования, многозадачности и другие. С помощью PaddleRec вы можете мгновенно проверить эффективность модели и повысить ее эффективность с помощью итераций. PaddleRec предлагает простой способ обучения моделей для распределенных систем с отличной производительностью. Он оптимизирован для крупномасштабной обработки данных с разреженными векторами. Вы можете легко масштабировать PaddleRec по горизонтали и ускорить скорость его вычислений. Поэтому с помощью PaddleRec можно быстро создавать обучающие среды на Kubernetes.</p></li>
<li><p>Поддержка развертывания: PaddleRec предоставляет решения для развертывания своих моделей в режиме онлайн. Модели сразу готовы к использованию после обучения, что обеспечивает гибкость и высокую доступность.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> - это векторная база данных с облачной нативной архитектурой. Она открыта на <a href="https://github.com/milvus-io">GitHub</a> и может использоваться для хранения, индексации и управления массивными векторами встраивания, генерируемыми глубокими нейронными сетями и другими моделями машинного обучения (ML). Milvus включает в себя несколько первоклассных библиотек поиска ближайших соседей (ANN), в том числе Faiss, NMSLIB и Annoy. Вы также можете масштабировать Milvus в соответствии с вашими потребностями. Сервис Milvus отличается высокой доступностью и поддерживает унифицированную пакетную и потоковую обработку. Milvus стремится упростить процесс управления неструктурированными данными и обеспечить согласованный пользовательский опыт в различных средах развертывания. Он обладает следующими возможностями:</p>
<ul>
<li><p>Высокая производительность при проведении векторного поиска в массивных массивах данных.</p></li>
<li><p>Сообщество разработчиков, ориентированное на разработчиков, предлагает многоязыковую поддержку и инструментарий.</p></li>
<li><p>Масштабируемость облака и высокая надежность даже в случае сбоев.</p></li>
<li><p>Гибридный поиск достигается за счет объединения скалярной фильтрации с векторным поиском сходства.</p></li>
</ul>
<p>В данном проекте для поиска векторного сходства и управления векторами используется Milvus, поскольку он позволяет решить проблему частого обновления данных, сохраняя при этом стабильность системы.</p>
<h2 id="System-implementation" class="common-anchor-header">Реализация системы<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы построить систему рекомендаций товаров в этом проекте, необходимо выполнить следующие шаги:</p>
<ol>
<li>Обработка данных</li>
<li>обучение модели</li>
<li>тестирование модели</li>
<li>Генерация кандидатов в товарные позиции<ol>
<li>Хранение данных: векторы товаров получаются с помощью обученной модели и хранятся в Milvus.</li>
<li>Поиск данных: четыре пользовательских вектора, сгенерированных MIND, подаются в Milvus для поиска векторного сходства.</li>
<li>Ранжирование данных: каждый из четырех векторов имеет свои собственные <code translate="no">top_k</code> похожие векторы предметов, и четыре набора <code translate="no">top_k</code> векторов ранжируются для получения окончательного списка <code translate="no">top_k</code> наиболее похожих векторов.</li>
</ol></li>
</ol>
<p>Исходный код этого проекта размещен на платформе <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. В следующем разделе приводится подробное описание исходного кода этого проекта.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Шаг 1. Обработка данных</h3><p>В качестве исходного набора данных используется набор данных книг Amazon, предоставленный компанией <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. Однако в данном проекте используются данные, загруженные и обработанные PaddleRec. Дополнительную информацию см. в разделе " <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">Набор данных AmazonBook</a> " в проекте PaddleRec.</p>
<p>Ожидается, что набор данных для обучения будет иметь следующий формат, в котором каждый столбец представляет собой:</p>
<ul>
<li><code translate="no">Uid</code>: : ID пользователя.</li>
<li><code translate="no">item_id</code>: ID товара, на который кликнул пользователь.</li>
<li><code translate="no">Time</code>: Временная метка или порядок нажатия.</li>
</ul>
<p>Набор данных для тестирования должен иметь следующий формат, в котором каждый столбец представляет собой:</p>
<ul>
<li><p><code translate="no">Uid</code>: : ID пользователя.</p></li>
<li><p><code translate="no">hist_item</code>: ID элемента продукта в историческом поведении пользователя при клике. При наличии нескольких <code translate="no">hist_item</code> они сортируются по временной метке.</p></li>
<li><p><code translate="no">eval_item</code>: Фактическая последовательность, в которой пользователь нажимал на товары.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Шаг 2. Обучение модели</h3><p>Для обучения модели используются данные, обработанные на предыдущем этапе, и модель генерации кандидатов MIND, построенная на основе PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Ввод</strong> <strong>модели</strong> </h4><p>В <code translate="no">dygraph_model.py</code> выполните следующий код, чтобы обработать данные и превратить их в исходные данные модели. Этот процесс сортирует элементы, нажатые одним и тем же пользователем в исходных данных в соответствии с временной меткой, и объединяет их в последовательность. Затем случайным образом выбирается <code translate="no">item``_``id</code> из последовательности в качестве <code translate="no">target_item</code>, и извлекаются 10 элементов перед <code translate="no">target_item</code> в качестве <code translate="no">hist_item</code> для ввода модели. Если последовательность недостаточно длинная, ее можно задать равной 0. <code translate="no">seq_len</code> должна быть фактической длиной последовательности <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Код чтения исходного набора данных см. в скрипте <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code>.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Создание модели</strong></h4><p>Следующий код представляет собой выдержку из <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> определяет слой мультиинтересного экстрактора, построенный на механизме маршрутизации капсул интересов. Функция <code translate="no">label_aware_attention()</code> реализует технику внимания с учетом меток в алгоритме MIND. Функция <code translate="no">forward()</code> в <code translate="no">class MindLayer</code> моделирует характеристики пользователя и генерирует соответствующие весовые векторы.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>Конкретную структуру сети MIND см. в скрипте <code translate="no">/home/aistudio/recommend/model/mind/net.py</code>.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Оптимизация модели</strong></h4><p>В данном проекте в качестве оптимизатора модели используется <a href="https://arxiv.org/pdf/1412.6980">алгоритм Adam</a>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Кроме того, PaddleRec записывает гиперпараметры в <code translate="no">config.yaml</code>, поэтому для повышения эффективности модели достаточно изменить этот файл, чтобы увидеть наглядное сравнение эффективности двух моделей. При обучении модели плохой эффект может быть результатом недоподгонки или переподгонки модели. Поэтому ее можно улучшить, изменив количество раундов обучения. В этом проекте достаточно изменить параметр epochs в <code translate="no">config.yaml</code>, чтобы найти идеальное количество раундов обучения. Кроме того, вы можете изменить оптимизатор модели, <code translate="no">optimizer.class</code> или <code translate="no">learning_rate</code> для отладки. Ниже показана часть параметров в скрипте <code translate="no">config.yaml</code>.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>За подробной реализацией обращайтесь к скрипту <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code>.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Обучение модели</strong></h4><p>Выполните следующую команду, чтобы начать обучение модели.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Проект обучения модели см. на сайте <code translate="no">/home/aistudio/recommend/model/trainer.py</code>.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Шаг 3. Тестирование модели</h3><p>На этом этапе используются тестовые наборы данных для проверки производительности, например, коэффициента запоминания обученной модели.</p>
<p>Во время тестирования модели все векторы элементов загружаются из модели, а затем импортируются в Milvus, базу данных векторов с открытым исходным кодом. Прочитайте тестовый набор данных с помощью скрипта <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Загрузите модель, созданную на предыдущем шаге, и подайте тестовый набор данных в модель, чтобы получить четыре вектора интересов пользователя. Выполните поиск 50 наиболее похожих векторов элементов на четыре вектора интересов в Milvus. Полученные результаты можно рекомендовать пользователям.</p>
<p>Выполните следующую команду, чтобы протестировать модель.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Во время тестирования модели система предоставляет несколько показателей для оценки ее эффективности, таких как Recall@50, NDCG@50 и HitRate@50. В этой статье рассматривается изменение только одного параметра. Однако в вашем собственном сценарии применения для повышения эффективности модели вам потребуется большее количество эпох обучения.  Вы также можете повысить эффективность модели, используя различные оптимизаторы, устанавливая разные скорости обучения и увеличивая количество раундов тестирования. Рекомендуется сохранить несколько моделей с разными эффектами, а затем выбрать ту, которая обладает наилучшей производительностью и лучше всего подходит для вашего приложения.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Шаг 4. Генерация кандидатов в товарные позиции</h3><p>Для создания сервиса генерации кандидатов на товар в данном проекте используется обученная на предыдущих шагах модель в паре с Milvus. Во время генерации кандидатов используется интерфейс FASTAPI. Когда сервис запускается, вы можете напрямую запускать команды в терминале через <code translate="no">curl</code>.</p>
<p>Выполните следующую команду для генерации предварительных кандидатов.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>Сервис предоставляет четыре типа интерфейсов:</p>
<ul>
<li><strong>Вставка</strong>: Выполните следующую команду, чтобы прочитать векторы элементов из вашей модели и вставить их в коллекцию в Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Генерировать предварительные кандидаты</strong>: Введите последовательность, в которой пользователь нажимает на товары, и определите следующий товар, на который пользователь может нажать. Вы также можете генерировать кандидатуры товаров партиями для нескольких пользователей за один раз. <code translate="no">hist_item</code> в следующей команде - это двумерный вектор, каждая строка которого представляет собой последовательность товаров, которые пользователь нажимал в прошлом. Вы можете задать длину последовательности. Возвращаемые результаты также являются наборами двумерных векторов, каждая строка которых представляет собой возвращенные <code translate="no">item id</code>s для пользователей.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Запрос общего количества</strong> <strong>товарных позиций</strong>: Выполните следующую команду, чтобы вернуть общее количество векторов товаров, хранящихся в базе данных Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Удалить</strong>: Выполните следующую команду, чтобы удалить все данные, хранящиеся в базе данных Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Если вы запустили службу генерации кандидатов на своем локальном сервере, вы также можете получить доступ к вышеуказанным интерфейсам по адресу <code translate="no">127.0.0.1:8000/docs</code>. Вы можете поиграть, щелкая по четырем интерфейсам и вводя значения параметров. Затем нажмите кнопку "Попробовать", чтобы получить результат рекомендации.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Обзор<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Эта статья в основном посвящена первому этапу генерации кандидатов при построении рекомендательной системы. В ней также предлагается решение по ускорению этого процесса путем объединения Milvus с алгоритмом MIND и PaddleRec, что позволило решить проблему, предложенную во вступительном абзаце.</p>
<p>Что делать, если система крайне медленно выдает результаты из-за огромного количества наборов данных? Milvus, база данных векторов с открытым исходным кодом, предназначена для молниеносного поиска сходства в плотных векторных наборах данных, содержащих миллионы, миллиарды и даже триллионы векторов.</p>
<p>Что делать, если новые данные не могут быть обработаны в режиме реального времени для поиска или запроса? Вы можете использовать Milvus, поскольку он поддерживает унифицированную пакетную и потоковую обработку и позволяет выполнять поиск и запросы по вновь введенным данным в режиме реального времени. Кроме того, модель MIND способна преобразовывать новое поведение пользователей в режиме реального времени и мгновенно вставлять пользовательские векторы в Milvus.</p>
<p>Что делать, если сложное развертывание слишком пугает? PaddleRec, мощная библиотека, входящая в экосистему PaddlePaddle, может предоставить вам интегрированное решение для простого и быстрого развертывания вашей рекомендательной системы или других приложений.</p>
<h2 id="About-the-author" class="common-anchor-header">Об авторе<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Юньмэй Ли, инженер по данным Zilliz, окончила Хуачжунский университет науки и технологий по специальности "информатика". С момента прихода в Zilliz она работает над поиском решений для проекта с открытым исходным кодом Milvus и помогает пользователям применять Milvus в реальных сценариях. Ее основное внимание сосредоточено на НЛП и рекомендательных системах, и она хотела бы еще больше углубиться в эти две области. Она любит проводить время в одиночестве и читать.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Ищете другие ресурсы?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Больше примеров создания рекомендательных систем:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Построение персонализированной системы рекомендаций товаров с помощью Vipshop с Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Создание приложения для планирования гардероба и нарядов с помощью Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Создание интеллектуальной системы рекомендаций новостей в приложении Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Коллаборативная фильтрация на основе элементов для системы рекомендаций музыки</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Создание с Milvus: ИИ-рекомендация новостей в мобильном браузере Xiaomi</a></li>
</ul></li>
<li>Другие проекты Milvus в сотрудничестве с другими сообществами:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Объединение моделей ИИ для поиска изображений с помощью ONNX и Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Построение рекомендательной системы на основе графиков с использованием наборов данных Milvus, PinSage, DGL и Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Создание кластера Milvus на основе JuiceFS</a></li>
</ul></li>
<li>Участвуйте в работе нашего сообщества разработчиков с открытым исходным кодом:<ul>
<li>Найдите Milvus на <a href="https://bit.ly/307b7jC">GitHub</a> или внесите в него свой вклад.</li>
<li>Взаимодействуйте с сообществом через <a href="https://bit.ly/3qiyTEk">форум</a></li>
<li>Общайтесь с нами в <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
