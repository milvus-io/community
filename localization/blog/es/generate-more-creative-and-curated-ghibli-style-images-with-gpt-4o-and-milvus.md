---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Generación de imágenes más creativas y cuidadas al estilo Ghibli con GPT-4o y
  Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Conexión de sus datos privados con GPT-4o Uso de Milvus para obtener
  resultados de imagen más curados
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Todo el mundo se convirtió en artista de la noche a la mañana con GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Lo creas o no, la imagen que acabas de ver ha sido generada por IA, en concreto, por el recién lanzado GPT-4o.</em></p>
<p>Cuando OpenAI lanzó la función nativa de generación de imágenes de GPT-4o el 26 de marzo, nadie podría haber predicho el tsunami creativo que siguió. De la noche a la mañana, Internet explotó con retratos al estilo Ghibli generados por la IA: celebridades, políticos, mascotas e incluso los propios usuarios se transformaron en encantadores personajes de Studio Ghibli con tan solo unas sencillas instrucciones. La demanda fue tan abrumadora que el propio Sam Altman tuvo que "suplicar" a los usuarios que fueran más despacio, tuiteando que las "GPU de OpenAI se están derritiendo".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ejemplo de imágenes generadas por GPT-4o (crédito X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Por qué GPT-4o lo cambia todo<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Para las industrias creativas, esto representa un cambio de paradigma. Las tareas que antes requerían todo un día de trabajo de un equipo de diseño ahora pueden realizarse en cuestión de minutos. Lo que diferencia a GPT-4o de los generadores de imágenes anteriores es <strong>su notable coherencia visual y su interfaz intuitiva</strong>. Admite conversaciones multiturno que le permiten refinar las imágenes añadiendo elementos, ajustando proporciones, cambiando estilos o incluso transformando 2D en 3D, lo que en esencia supone tener a un diseñador profesional en el bolsillo.</p>
<p>¿Cuál es el secreto del rendimiento superior de GPT-4o? Su arquitectura autorregresiva. A diferencia de los modelos de difusión (como Stable Diffusion), que degradan las imágenes hasta convertirlas en ruido antes de reconstruirlas, GPT-4o genera imágenes de forma secuencial -una ficha cada vez- manteniendo el conocimiento del contexto durante todo el proceso. Esta diferencia arquitectónica fundamental explica por qué GPT-4o produce resultados más coherentes con indicaciones más sencillas y naturales.</p>
<p>Pero aquí es donde las cosas se ponen interesantes para los desarrolladores: <strong>Cada vez hay más indicios que apuntan a una tendencia importante: los propios modelos de inteligencia artificial se están convirtiendo en productos. En pocas palabras, la mayoría de los productos que se limitan a envolver grandes modelos de IA con datos de dominio público corren el riesgo de quedarse atrás.</strong></p>
<p>La verdadera fuerza de estos avances reside en la combinación de grandes modelos de propósito general con <strong>datos privados específicos de un dominio</strong>. Esta combinación bien puede ser la estrategia de supervivencia óptima para la mayoría de las empresas en la era de los grandes modelos lingüísticos. A medida que los modelos básicos sigan evolucionando, la ventaja competitiva duradera pertenecerá a quienes puedan integrar eficazmente sus conjuntos de datos privados con estos potentes sistemas de IA.</p>
<p>Exploremos cómo conectar sus datos privados con GPT-4o utilizando Milvus, una base de datos vectorial de código abierto y alto rendimiento.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Cómo conectar sus datos privados con GPT-4o utilizando Milvus para obtener resultados de imagen más curados<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales son la tecnología clave que conecta sus datos privados con los modelos de IA. Funcionan convirtiendo su contenido -ya sean imágenes, texto o audio- en representaciones matemáticas (vectores) que capturan su significado y características. Esto permite una búsqueda semántica basada en la similitud y no sólo en palabras clave.</p>
<p>Milvus, como principal base de datos vectorial de código abierto, es especialmente adecuada para conectar con herramientas de IA generativa como GPT-4o. He aquí cómo la utilicé para resolver un reto personal.</p>
<h3 id="Background" class="common-anchor-header">Antecedentes</h3><p>Un día, tuve una idea brillante: convertir todas las travesuras de mi perro Cola en un cómic. Pero había un problema: ¿Cómo podía rebuscar entre decenas de miles de fotos de trabajo, viajes y aventuras gastronómicas para encontrar los momentos traviesos de Cola?</p>
<p>¿La respuesta? Importar todas mis fotos a Milvus y hacer una búsqueda de imágenes.</p>
<p>Veamos la implementación paso a paso.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Dependencias y entorno</h4><p>En primer lugar, tienes que preparar tu entorno con los paquetes adecuados:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Preparar los datos</h4><p>Voy a utilizar mi biblioteca de fotos, que tiene alrededor de 30.000 fotos, como el conjunto de datos en esta guía. Si no tiene ningún conjunto de datos a mano, descargue un conjunto de datos de muestra de Milvus y descomprímalo:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Definir el extractor de características</h4><p>Utilizaremos el modo ResNet-50 de la biblioteca <code translate="no">timm</code> para extraer vectores de incrustación de nuestras imágenes. Este modelo ha sido entrenado en millones de imágenes y puede extraer características significativas que representan el contenido visual.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Crear una colección Milvus</h4><p>A continuación, crearemos una colección Milvus para almacenar nuestras imágenes incrustadas. Piense en esto como una base de datos especializada diseñada explícitamente para la búsqueda de similitud vectorial:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Notas sobre MilvusClient Parámetros:</strong></p>
<ul>
<li><p><strong>Configuración local:</strong> El uso de un archivo local (por ejemplo, <code translate="no">./milvus.db</code>) es la forma más fácil de empezar-Milvus Lite se encargará de todos sus datos.</p></li>
<li><p><strong>Ampliación:</strong> Para grandes conjuntos de datos, configure un servidor Milvus robusto utilizando Docker o Kubernetes y utilice su URI (por ejemplo, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Opción en la nube:</strong> Si estás en Zilliz Cloud (el servicio totalmente gestionado de Milvus), ajusta tu URI y token para que coincidan con el endpoint público y la clave API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Insertar imágenes incrustadas en Milvus</h4><p>Ahora viene el proceso de analizar cada imagen y almacenar su representación vectorial. Este paso puede llevar algún tiempo dependiendo del tamaño de su conjunto de datos, pero es un proceso que se realiza una sola vez:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Realizar una búsqueda de imágenes</h4><p>Con nuestra base de datos poblada, ahora podemos buscar imágenes similares. Aquí es donde ocurre la magia: podemos encontrar fotos visualmente similares utilizando la similitud vectorial:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Las imágenes devueltas se muestran a continuación:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Combine la búsqueda vectorial con GPT-4o: Generación de imágenes de estilo Ghibli con imágenes devueltas por Milvus</h3><p>Ahora viene la parte emocionante: utilizar nuestros resultados de búsqueda de imágenes como entrada para GPT-4o para generar contenido creativo. En mi caso, quería crear tiras cómicas protagonizadas por mi perro Cola basadas en fotos que he tomado.</p>
<p>El flujo de trabajo es sencillo pero potente:</p>
<ol>
<li><p>Utilizar la búsqueda vectorial para encontrar imágenes relevantes de Cola en mi colección.</p></li>
<li><p>Introducir estas imágenes en GPT-4o con instrucciones creativas.</p></li>
<li><p>Generar cómics únicos basados en la inspiración visual</p></li>
</ol>
<p>He aquí algunos ejemplos de lo que esta combinación puede producir:</p>
<p><strong>Las instrucciones que utilizo:</strong></p>
<ul>
<li><p><em>"Genera una tira cómica de cuatro paneles a todo color con un Border Collie royendo un ratón, con un momento incómodo cuando el dueño se entera"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Dibuja un cómic en el que este perro luzca un bonito atuendo".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Utilizando este perro como modelo, crea una tira cómica en la que vaya al Colegio Hogwarts de Magia y Hechicería."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Algunos consejos rápidos de mi experiencia en la generación de imágenes:</h3><ol>
<li><p><strong>Hazlo sencillo</strong>: A diferencia de los modelos de difusión quisquillosos, GPT-4o funciona mejor con instrucciones sencillas. Me di cuenta de que escribía instrucciones cada vez más cortas y obtenía mejores resultados.</p></li>
<li><p><strong>El inglés funciona mejor</strong>: Probé a escribir en chino para algunos cómics, pero los resultados no fueron muy buenos. Acabé escribiendo las instrucciones en inglés y traduciendo los cómics cuando era necesario.</p></li>
<li><p><strong>No es bueno para la generación de vídeo</strong>: No te hagas demasiadas ilusiones con Sora: a los vídeos generados por la IA aún les queda mucho camino por recorrer en cuanto a fluidez de movimientos y coherencia argumental.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">¿Y ahora qué? Mi punto de vista y abierto al debate<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Con las imágenes generadas por IA a la cabeza, un rápido vistazo a los principales lanzamientos de OpenAI en los últimos seis meses muestra un patrón claro: ya sean GPT para mercados de aplicaciones, DeepResearch para la generación de informes, GPT-4o para la creación de imágenes conversacionales o Sora para la magia del vídeo, los grandes modelos de IA están saliendo de detrás de la cortina para convertirse en el centro de atención. Lo que antes era tecnología experimental está madurando para convertirse en productos reales y utilizables.</p>
<p>A medida que GPT-4o y otros modelos similares se generalizan, la mayoría de los flujos de trabajo y agentes inteligentes basados en la difusión estable se encaminan hacia la obsolescencia. Sin embargo, el valor insustituible de los datos privados y la perspicacia humana sigue siendo fuerte. Por ejemplo, aunque la IA no sustituirá por completo a las agencias creativas, la integración de una base de datos vectorial de Milvus con modelos GPT permite a las agencias generar rápidamente ideas frescas y creativas inspiradas en sus éxitos pasados. Las plataformas de comercio electrónico pueden diseñar ropa personalizada basándose en las tendencias de compra, y las instituciones académicas pueden crear al instante elementos visuales para trabajos de investigación.</p>
<p>La era de los productos impulsados por modelos de IA ya está aquí, y la carrera por explotar la mina de oro de datos no ha hecho más que empezar. Tanto para los desarrolladores como para las empresas, el mensaje es claro: combina tus datos exclusivos con estos potentes modelos o arriésgate a quedarte atrás.</p>
