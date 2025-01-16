---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Aceleración de la generación de candidatos en sistemas de recomendación
  mediante Milvus emparejado con PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: el flujo de trabajo mínimo de un sistema de recomendación
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Si tiene experiencia en el desarrollo de un sistema de recomendación, es probable que haya sido víctima de al menos una de las siguientes situaciones:</p>
<ul>
<li>El sistema es extremadamente lento a la hora de devolver resultados debido a la enorme cantidad de conjuntos de datos.</li>
<li>Los datos recién introducidos no se pueden procesar en tiempo real para realizar búsquedas o consultas.</li>
<li>El despliegue del sistema de recomendación es desalentador.</li>
</ul>
<p>Este artículo pretende abordar los problemas mencionados anteriormente y proporcionar algunas ideas para usted mediante la introducción de un proyecto de sistema de recomendación de productos que utiliza Milvus, una base de datos vectorial de código abierto, emparejado con PaddlePaddle, una plataforma de aprendizaje profundo.</p>
<p>Este artículo describe brevemente el flujo de trabajo mínimo de un sistema de recomendación. A continuación, se presentan los principales componentes y los detalles de implementación de este proyecto.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">El flujo de trabajo básico de un sistema de recomendación<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de adentrarnos en el proyecto, echemos un vistazo al flujo de trabajo básico de un sistema de recomendación. Un sistema de recomendación puede ofrecer resultados personalizados en función de los intereses y necesidades de cada usuario. Para hacer esas recomendaciones personalizadas, el sistema pasa por dos etapas: la generación de candidatos y la clasificación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>La primera etapa es la generación de candidatos, que devuelve los datos más relevantes o similares, como un producto o un vídeo que coincide con el perfil del usuario. Durante la generación de candidatos, el sistema compara el rasgo del usuario con los datos almacenados en su base de datos, y recupera aquellos similares. A continuación, durante la clasificación, el sistema puntúa y reordena los datos recuperados. Por último, los resultados que encabezan la lista se muestran a los usuarios.</p>
<p>En el caso de un sistema de recomendación de productos, primero compara el perfil del usuario con las características de los productos del inventario para filtrar una lista de productos que se ajusten a las necesidades del usuario. A continuación, el sistema puntúa los productos en función de su similitud con el perfil del usuario, los clasifica y, por último, devuelve al usuario los 10 mejores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Arquitectura del sistema<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de recomendación de productos de este proyecto utiliza tres componentes: MIND, PaddleRec y Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, abreviatura de &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, es un algoritmo desarrollado por Alibaba Group. Antes de que se propusiera MIND, la mayoría de los modelos de inteligencia artificial predominantes para la recomendación utilizaban un único vector para representar los diversos intereses de un usuario. Sin embargo, un único vector dista mucho de ser suficiente para representar los intereses exactos de un usuario. Por ello, se propuso el algoritmo MIND para convertir los múltiples intereses de un usuario en varios vectores.</p>
<p>En concreto, MIND adopta una <a href="https://arxiv.org/pdf/2005.09347">red multiinterés</a> con enrutamiento dinámico para procesar los múltiples intereses de un usuario durante la fase de generación de candidatos. La red multiinterés es una capa del extractor multiinterés construida sobre un mecanismo de enrutamiento de cápsulas. Puede utilizarse para combinar los comportamientos pasados de un usuario con sus múltiples intereses, a fin de proporcionar un perfil de usuario preciso.</p>
<p>El siguiente diagrama ilustra la estructura de red de MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Para representar los rasgos de los usuarios, MIND toma los comportamientos e intereses de los usuarios como datos de entrada y los introduce en la capa de incrustación para generar vectores de usuario, incluidos los vectores de intereses de usuario y los vectores de comportamiento de usuario. A continuación, los vectores de comportamiento de los usuarios se introducen en la capa de extracción de intereses múltiples para generar cápsulas de intereses de los usuarios. Tras concatenar las cápsulas de interés del usuario con las incrustaciones de comportamiento del usuario y utilizar varias capas ReLU para transformarlas, MIND genera varios vectores de representación del usuario. En este proyecto se ha definido que MIND producirá en última instancia cuatro vectores de representación del usuario.</p>
<p>Por otro lado, los rasgos del producto pasan por la capa de incrustación y se convierten en vectores de elementos dispersos. A continuación, cada vector de artículo pasa por una capa de agrupación para convertirse en un vector denso.</p>
<p>Cuando todos los datos se convierten en vectores, se introduce una capa adicional de atención a las etiquetas para guiar el proceso de entrenamiento.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> es una biblioteca de modelos de búsqueda a gran escala para la recomendación. Forma parte del ecosistema Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. PaddleRec tiene como objetivo proporcionar a los desarrolladores una solución integrada para construir un sistema de recomendación de una manera fácil y rápida.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Como se menciona en el párrafo inicial, los ingenieros que desarrollan sistemas de recomendación a menudo tienen que enfrentarse a los retos de una usabilidad deficiente y un despliegue complicado del sistema. Sin embargo, PaddleRec puede ayudar a los desarrolladores en los siguientes aspectos:</p>
<ul>
<li><p>Facilidad de uso: PaddleRec es una librería de código abierto que encapsula varios modelos populares en la industria, incluyendo modelos para la generación de candidatos, ranking, reranking, multitarea y más. Con PaddleRec, puedes probar instantáneamente la eficacia del modelo y mejorar su eficiencia a través de la iteración. PaddleRec le ofrece una forma sencilla de entrenar modelos para sistemas distribuidos con un rendimiento excelente. Está optimizado para el procesamiento de datos a gran escala de vectores dispersos. Puedes escalar fácilmente PaddleRec horizontalmente y acelerar su velocidad de cálculo. Por lo tanto, puedes construir rápidamente entornos de entrenamiento en Kubernetes utilizando PaddleRec.</p></li>
<li><p>Soporte para el despliegue: PaddleRec proporciona soluciones de despliegue en línea para sus modelos. Los modelos están inmediatamente listos para su uso después de la formación, presentando flexibilidad y alta disponibilidad.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> es una base de datos vectorial con una arquitectura nativa en la nube. Es de código abierto en <a href="https://github.com/milvus-io">GitHub</a> y puede utilizarse para almacenar, indexar y gestionar vectores de incrustación masiva generados por redes neuronales profundas y otros modelos de aprendizaje automático (ML). Milvus encapsula varias bibliotecas de búsqueda aproximada de vecinos más cercanos (RNA) de primera clase, como Faiss, NMSLIB y Annoy. También puede ampliar Milvus según sus necesidades. El servicio Milvus está altamente disponible y admite el procesamiento unificado por lotes y en flujo. Milvus se compromete a simplificar el proceso de gestión de datos no estructurados y a proporcionar una experiencia de usuario coherente en diferentes entornos de despliegue. Presenta las siguientes características</p>
<ul>
<li><p>Alto rendimiento al realizar búsquedas vectoriales en conjuntos de datos masivos.</p></li>
<li><p>Una comunidad de desarrolladores que ofrece soporte multilingüe y una cadena de herramientas.</p></li>
<li><p>Escalabilidad en la nube y alta fiabilidad incluso en caso de interrupción.</p></li>
<li><p>Búsqueda híbrida lograda combinando el filtrado escalar con la búsqueda de similitud vectorial.</p></li>
</ul>
<p>Milvus se utiliza para la búsqueda de similitud vectorial y la gestión de vectores en este proyecto porque puede resolver el problema de las actualizaciones frecuentes de datos manteniendo la estabilidad del sistema.</p>
<h2 id="System-implementation" class="common-anchor-header">Implementación del sistema<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Para construir el sistema de recomendación de productos en este proyecto, es necesario seguir los siguientes pasos:</p>
<ol>
<li>Procesamiento de datos</li>
<li>Entrenamiento del modelo</li>
<li>Prueba del modelo</li>
<li>Generación de productos candidatos<ol>
<li>Almacenamiento de datos: los vectores de artículos se obtienen a través del modelo entrenado y se almacenan en Milvus.</li>
<li>Búsqueda de datos: cuatro vectores de usuario generados por MIND se introducen en Milvus para la búsqueda de similitud de vectores.</li>
<li>Clasificación de datos: cada uno de los cuatro vectores tiene sus propios vectores de artículos similares en <code translate="no">top_k</code>, y se clasifican cuatro conjuntos de vectores de <code translate="no">top_k</code> para obtener una lista final de los vectores más similares en <code translate="no">top_k</code>.</li>
</ol></li>
</ol>
<p>El código fuente de este proyecto está alojado en la plataforma <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. A continuación se explica en detalle el código fuente de este proyecto.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Paso 1. Procesamiento de datos Procesamiento de datos</h3><p>El conjunto de datos original procede del conjunto de datos de libros de Amazon proporcionado por <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. Sin embargo, este proyecto utiliza los datos descargados y procesados por PaddleRec. Consulta el <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">conjunto de datos AmazonBook</a> en el proyecto PaddleRec para obtener más información.</p>
<p>Se espera que el conjunto de datos para el entrenamiento tenga el siguiente formato, en el que cada columna representa:</p>
<ul>
<li><code translate="no">Uid</code>: ID de usuario.</li>
<li><code translate="no">item_id</code>: ID del producto en el que ha hecho clic el usuario.</li>
<li><code translate="no">Time</code>: La marca de tiempo u orden de clic.</li>
</ul>
<p>Se espera que el conjunto de datos para las pruebas tenga el siguiente formato, en el que cada columna representa:</p>
<ul>
<li><p><code translate="no">Uid</code>: ID de usuario.</p></li>
<li><p><code translate="no">hist_item</code>: ID del elemento del producto en el comportamiento histórico de clics del usuario. Cuando hay varios <code translate="no">hist_item</code>, se ordenan según la marca de tiempo.</p></li>
<li><p><code translate="no">eval_item</code>: La secuencia real en la que el usuario hace clic en los productos.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Paso 2. Entrenamiento del modelo Entrenamiento del modelo</h3><p>El entrenamiento del modelo utiliza los datos procesados en el paso anterior y adopta el modelo de generación de candidatos, MIND, construido sobre PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Entrada del modelo</strong></h4><p>En <code translate="no">dygraph_model.py</code>, ejecuta el siguiente código para procesar los datos y convertirlos en entrada del modelo. Este proceso ordena los elementos pulsados por el mismo usuario en los datos originales según la marca de tiempo, y los combina para formar una secuencia. A continuación, selecciona aleatoriamente un <code translate="no">item``_``id</code> de la secuencia como <code translate="no">target_item</code>, y extrae los 10 elementos anteriores a <code translate="no">target_item</code> como <code translate="no">hist_item</code> para la entrada del modelo. Si la secuencia no es lo suficientemente larga, puede establecerse como 0. <code translate="no">seq_len</code> debe ser la longitud real de la secuencia <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Consulte el script <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> para ver el código de lectura del conjunto de datos original.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Red de modelos</strong></h4><p>El siguiente código es un extracto de <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> define la capa extractora multi-interés construida sobre el mecanismo de enrutamiento de cápsulas de interés. La función <code translate="no">label_aware_attention()</code> implementa la técnica de atención consciente de etiquetas en el algoritmo MIND. La función <code translate="no">forward()</code> en <code translate="no">class MindLayer</code> modela las características del usuario y genera los vectores de peso correspondientes.</p>
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
<p>Consulte el script <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> para conocer la estructura de red específica de MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Optimización del modelo</strong></h4><p>Este proyecto utiliza <a href="https://arxiv.org/pdf/1412.6980">el algoritmo Adam</a> como optimizador del modelo.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Además, PaddleRec escribe los hiperparámetros en <code translate="no">config.yaml</code>, por lo que basta con modificar este archivo para ver una comparación clara entre la eficacia de los dos modelos para mejorar la eficiencia del modelo. Al entrenar el modelo, el pobre efecto del modelo puede ser el resultado de un ajuste insuficiente o excesivo del modelo. Por lo tanto, puede mejorarlo modificando el número de rondas de entrenamiento. En este proyecto, sólo necesita cambiar el parámetro epochs en <code translate="no">config.yaml</code> para encontrar el número perfecto de rondas de entrenamiento. Además, también puedes cambiar el optimizador del modelo, <code translate="no">optimizer.class</code>,o <code translate="no">learning_rate</code> para depuración. A continuación se muestra parte de los parámetros en <code translate="no">config.yaml</code>.</p>
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
<p>Consulte el script <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> para una implementación detallada.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Entrenamiento del modelo</strong></h4><p>Ejecute el siguiente comando para iniciar el entrenamiento del modelo.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Consulte <code translate="no">/home/aistudio/recommend/model/trainer.py</code> para el proyecto de entrenamiento del modelo.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Paso 3. Prueba del modelo Prueba del modelo</h3><p>En este paso se utiliza un conjunto de datos de prueba para verificar el rendimiento del modelo entrenado, como la tasa de recuperación.</p>
<p>Durante la prueba del modelo, todos los vectores de ítems se cargan desde el modelo y luego se importan a Milvus, la base de datos de vectores de código abierto. Lea el conjunto de datos de prueba a través del script <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Cargar el modelo en el paso anterior, e introducir el conjunto de datos de prueba en el modelo para obtener cuatro vectores de interés del usuario. Busque los 50 vectores de elementos más similares a los cuatro vectores de interés en Milvus. Puede recomendar los resultados obtenidos a los usuarios.</p>
<p>Ejecute el siguiente comando para probar el modelo.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Durante la prueba del modelo, el sistema proporciona varios indicadores para evaluar la eficacia del modelo, como Recall@50, NDCG@50 y HitRate@50. En este artículo sólo se presenta la modificación de un parámetro. Sin embargo, en su propio escenario de aplicación, necesitará entrenar más épocas para mejorar el efecto del modelo.  También puede mejorar la efectividad del modelo utilizando diferentes optimizadores, estableciendo diferentes tasas de aprendizaje y aumentando el número de rondas de pruebas. Se recomienda que guarde varios modelos con diferentes efectos, y luego elija el que tenga el mejor rendimiento y se adapte mejor a su aplicación.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Paso 4. Generación de candidatos a producto</h3><p>Para construir el servicio de generación de candidatos a producto, este proyecto utiliza el modelo entrenado en los pasos anteriores, emparejado con Milvus. Durante la generación de candidatos, se utiliza FASTAPI para proporcionar la interfaz. Cuando se inicia el servicio, puede ejecutar directamente comandos en el terminal a través de <code translate="no">curl</code>.</p>
<p>Ejecute el siguiente comando para generar candidatos preliminares.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>El servicio proporciona cuatro tipos de interfaces:</p>
<ul>
<li><strong>Insertar</strong>: Ejecute el siguiente comando para leer los vectores de elementos de su modelo e insertarlos en una colección en Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Generar candidatos</strong> preliminares: Introduzca la secuencia en la que el usuario hace clic en los productos y descubra el siguiente producto en el que el usuario puede hacer clic. También puede generar candidatos a productos en lotes para varios usuarios a la vez. <code translate="no">hist_item</code> en el siguiente comando es un vector bidimensional, y cada fila representa una secuencia de los productos que el usuario ha pulsado en el pasado. Se puede definir la longitud de la secuencia. Los resultados devueltos son también conjuntos de vectores bidimensionales, y cada fila representa los <code translate="no">item id</code>s devueltos por los usuarios.</li>
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
<li><strong>Consultar el número total de</strong> <strong>artículos</strong>: Ejecute el siguiente comando para devolver el número total de vectores de artículos almacenados en la base de datos de Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Borrar</strong>: Ejecute el siguiente comando para eliminar todos los datos almacenados en la base de datos de Milvus .</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si ejecuta el servicio de generación de candidatos en su servidor local, también puede acceder a las interfaces anteriores en <code translate="no">127.0.0.1:8000/docs</code>. Puede jugar haciendo clic en las cuatro interfaces e introduciendo el valor de los parámetros. A continuación, haga clic en "Probar" para obtener el resultado de la recomendación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Recapitulación<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artículo se centra principalmente en la primera etapa de generación de candidatos en la construcción de un sistema de recomendación. También proporciona una solución para acelerar este proceso combinando Milvus con el algoritmo MIND y PaddleRec y, por lo tanto, ha abordado la cuestión propuesta en el párrafo inicial.</p>
<p>¿Qué ocurre si el sistema es extremadamente lento a la hora de devolver resultados debido a la enorme cantidad de conjuntos de datos? Milvus, la base de datos vectorial de código abierto, está diseñada para una búsqueda de similitudes rapidísima en conjuntos de datos vectoriales densos que contienen millones, miles de millones o incluso billones de vectores.</p>
<p>¿Y si los datos recién insertados no pueden procesarse en tiempo real para su búsqueda o consulta? Puede utilizar Milvus, ya que admite el procesamiento unificado por lotes y por flujos y le permite buscar y consultar datos recién insertados en tiempo real. Además, el modelo MIND es capaz de convertir nuevos comportamientos de usuario en tiempo real e insertar los vectores de usuario en Milvus instantáneamente.</p>
<p>¿Y si el complicado despliegue resulta demasiado intimidante? PaddleRec, una potente librería que pertenece al ecosistema PaddlePaddle, puede proporcionarte una solución integrada para desplegar tu sistema de recomendación u otras aplicaciones de forma fácil y rápida.</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre el autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Ingeniero de Datos de Zilliz, se licenció en Informática por la Universidad de Ciencia y Tecnología de Huazhong. Desde que se unió a Zilliz, ha estado trabajando en la exploración de soluciones para el proyecto de código abierto Milvus y ayudando a los usuarios a aplicar Milvus en escenarios del mundo real. Su principal interés se centra en la PNL y los sistemas de recomendación, y le gustaría profundizar aún más en estas dos áreas. Le gusta pasar tiempo a solas y leer.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">¿Buscas más recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Más casos de usuario sobre la creación de un sistema de recomendación:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Creación de un sistema de recomendación de productos personalizado con Vipshop con Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Creación de una aplicación de planificación de vestuario y atuendos con Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Creación de un sistema inteligente de recomendación de noticias dentro de la aplicación Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Filtrado colaborativo basado en ítems para un sistema de recomendación de música</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Creación con Milvus: Recomendación de noticias basada en IA dentro del navegador móvil de Xiaomi</a></li>
</ul></li>
<li>Más proyectos de Milvus en colaboración con otras comunidades:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinar modelos de IA para la búsqueda de imágenes utilizando ONNX y Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Creación de un sistema de recomendación basado en gráficos con los conjuntos de datos Milvus, PinSage, DGL y Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Creación de un clúster Milvus basado en JuiceFS</a></li>
</ul></li>
<li>Participe en nuestra comunidad de código abierto:<ul>
<li>Encuentre o contribuya a Milvus en <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Interactúe con la comunidad a través <a href="https://bit.ly/3qiyTEk">del Foro</a></li>
<li>Conéctese con nosotros en <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
