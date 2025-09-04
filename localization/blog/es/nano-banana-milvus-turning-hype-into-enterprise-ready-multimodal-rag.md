---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: >-
  Nano Banana + Milvus: convertir el bombo publicitario en un RAG multimodal
  preparado para la empresa
author: Lumina Wang
date: 2025-09-04T00:00:00.000Z
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, nano banana'
meta_keywords: 'Vibe coding, nano banana, Milvus, model context protocol'
meta_title: |
  Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: >-
  explicaremos cómo combinar Nano Banana y Milvus para crear un sistema RAG
  multimodal preparado para la empresa y por qué esta combinación abre la
  próxima ola de aplicaciones de IA.
origin: >-
  https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---
<p>Nano Banana se está convirtiendo en un fenómeno viral en las redes sociales, ¡y por una buena razón! Probablemente hayas visto las imágenes que genera o incluso lo hayas probado tú mismo. Se trata de un último modelo de generación de imágenes que convierte texto plano en fotos de figuritas de coleccionista con una precisión y velocidad asombrosas.</p>
<p>Escribe algo como <em>"cambia el sombrero y la falda de Elon"</em> y, en unos 16 segundos, obtendrás un resultado fotorrealista: la camisa por dentro, los colores mezclados, los accesorios en su sitio... sin ediciones manuales. Sin retrasos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beach_side_668179b830.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tampoco pude resistirme a probarlo. Mi pregunta era:</p>
<p><em>"Utiliza el modelo Nano Banana para crear una figura comercializada a escala 1/7 del personaje de la ilustración, con un estilo y un entorno realistas. Coloca la figura sobre el escritorio de un ordenador, utilizando una base circular de acrílico transparente sin ningún texto. En la pantalla del ordenador, visualiza el proceso de modelado ZBrush de la figura. Junto a la pantalla, coloca una caja de embalaje de juguetes al estilo Bandai impresa con la ilustración original".</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El resultado me dejó boquiabierto: parecía un prototipo de producción sacado directamente del stand de una convención.</p>
<p>No es de extrañar que los equipos ya le estén sacando mucho partido. Uno de nuestros clientes, una plataforma de entretenimiento móvil que ofrece juegos de gacha y disfraces, está desarrollando una función que permite a los jugadores subir fotos y disfrazar al instante sus avatares con accesorios del juego. Las marcas de comercio electrónico están experimentando con el "dispara una vez, reutiliza para siempre": capturar una imagen de modelo base y luego generar infinitas variaciones de atuendo y peinado con IA, en lugar de volver a disparar 20 veces en el estudio.</p>
<p>Pero aquí está el truco: la generación de imágenes por sí sola no resuelve todo el problema. Estos sistemas también necesitan <strong>una recuperación inteligente</strong>: la capacidad de encontrar al instante el vestuario, el atrezzo y los elementos visuales adecuados en bibliotecas de medios masivas y desestructuradas. Sin eso, el modelo generativo no hace más que adivinar en la oscuridad. Lo que realmente necesitan las empresas es un <strong>sistema RAG (recuperación-generación aumentada) multimodal, en el que</strong>Nano Banana se encargue de la creatividad y una potente base de datos vectorial del contexto.</p>
<p>Ahí es donde entra <strong>Milvus</strong>. Como base de datos vectorial de código abierto, Milvus puede indexar y buscar entre miles de millones de incrustaciones: imágenes, texto, audio y mucho más. Combinado con Nano Banana, se convierte en la columna vertebral de un proceso RAG multimodal listo para la producción: buscar, combinar y generar a escala empresarial.</p>
<p>En el resto de este blog, veremos cómo combinar Nano Banana y Milvus para crear un sistema RAG multimodal listo para la empresa y por qué esta combinación abre la próxima ola de aplicaciones de IA.</p>
<h2 id="Building-a-Text-to-Image-Retrieval-Engine" class="common-anchor-header">Creación de un motor de recuperación de texto a imagen<button data-href="#Building-a-Text-to-Image-Retrieval-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Para las marcas de bienes de consumo, los estudios de juegos y las empresas de medios de comunicación que se mueven con rapidez, el cuello de botella en la generación de imágenes de IA no es el modelo, sino el desorden.</p>
<p>Sus archivos son una ciénaga de datos no estructurados, que incluyen fotos de productos, activos de personajes, vídeos promocionales y renders de trajes. Y cuando necesitas encontrar "la capa roja de la última temporada de Lunar", buena suerte: la búsqueda tradicional basada en palabras clave no es capaz de hacerlo.</p>
<p>¿La solución? Crear un <strong>sistema de recuperación de texto a imagen</strong>.</p>
<p>La jugada es la siguiente: utilice <a href="https://openai.com/research/clip?utm_source=chatgpt.com">CLIP</a> para incrustar datos de texto e imagen en vectores. Almacene esos vectores en <strong>Milvus</strong>, la base de datos vectorial de código abierto creada específicamente para la búsqueda por similitud. Entonces, cuando un usuario escribe una descripción ("capa de seda roja con ribetes dorados"), se accede a la base de datos y se obtienen las 3 imágenes semánticamente más similares.</p>
<p>Es rápido. Es escalable. Y convierte tu desordenada biblioteca multimedia en un banco de activos estructurado y consultable.</p>
<p>He aquí cómo construirlo:</p>
<p>Instalar dependencias</p>
<pre><code translate="no"><span class="hljs-comment"># Install necessary packages</span>
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
<button class="copy-code-btn"></button></code></pre>
<p>Importe las bibliotecas necesarias</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> clip
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">import</span> matplotlib.pyplot <span class="hljs-keyword">as</span> plt
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
<span class="hljs-keyword">import</span> math

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All libraries imported successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Inicializar el cliente Milvus</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,token=<span class="hljs-string">&quot;root:Miluvs&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus client initialized successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Cargar modelo CLIP</p>
<pre><code translate="no"><span class="hljs-comment"># Load CLIP model</span>
model_name = <span class="hljs-string">&quot;ViT-B/32&quot;</span>
device = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
model, preprocess = clip.load(model_name, device=device)
model.<span class="hljs-built_in">eval</span>()

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;CLIP model &#x27;<span class="hljs-subst">{model_name}</span>&#x27; loaded successfully, running on device: <span class="hljs-subst">{device}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model input resolution: <span class="hljs-subst">{model.visual.input_resolution}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Context length: <span class="hljs-subst">{model.context_length}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Vocabulary size: <span class="hljs-subst">{model.vocab_size}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado de salida:</p>
<pre><code translate="no"><span class="hljs-variable constant_">CLIP</span> model <span class="hljs-string">`ViT-B/32`</span> loaded successfully, running <span class="hljs-attr">on</span>: cpu
 <span class="hljs-title class_">Model</span> input <span class="hljs-attr">resolution</span>: <span class="hljs-number">224</span>
 <span class="hljs-title class_">Context</span> <span class="hljs-attr">length</span>: <span class="hljs-number">77</span>
 <span class="hljs-title class_">Vocabulary</span> <span class="hljs-attr">size</span>: <span class="hljs-number">49</span>,<span class="hljs-number">408</span>
<button class="copy-code-btn"></button></code></pre>
<p>Definir funciones de extracción de características</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_image</span>(<span class="hljs-params">image_path</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode image into normalized feature vector&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        image = preprocess(Image.<span class="hljs-built_in">open</span>(image_path)).unsqueeze(<span class="hljs-number">0</span>).to(device)
        
        <span class="hljs-keyword">with</span> torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
        
        <span class="hljs-keyword">return</span> image_features.squeeze().cpu().tolist()
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Error processing image <span class="hljs-subst">{image_path}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_text</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text into normalized feature vector&quot;&quot;&quot;</span>
    text_tokens = clip.tokenize([text]).to(device)
    
    <span class="hljs-keyword">with</span> torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
    
    <span class="hljs-keyword">return</span> text_features.squeeze().cpu().tolist()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Feature extraction functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Crear colección Milvus</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;production_image_collection&quot;</span>
<span class="hljs-comment"># If collection already exists, delete it</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Existing collection deleted: <span class="hljs-subst">{collection_name}</span>&quot;</span>)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=<span class="hljs-number">512</span>,  <span class="hljs-comment"># CLIP ViT-B/32 embedding dimension</span>
    auto_id=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Auto-generate ID</span>
    enable_dynamic_field=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Enable dynamic fields</span>
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>  <span class="hljs-comment"># Use cosine similarity</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; created successfully!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection info: <span class="hljs-subst">{milvus_client.describe_collection(collection_name)}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado satisfactorio de la creación de la colección:</p>
<pre><code translate="no">Existing collection deleted: production_image_collection
Collection <span class="hljs-string">&#x27;production_image_collection&#x27;</span> created successfully!
Collection info: {<span class="hljs-string">&#x27;collection_name&#x27;</span>: <span class="hljs-string">&#x27;production_image_collection&#x27;</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;num_shards&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {}, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">101</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;vector&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">512</span>}}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">102</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;function&#x27;</span>: [], <span class="hljs-string">&#x27;aliases&#x27;</span>: [], <span class="hljs-string">&#x27;collection_id&#x27;</span>: <span class="hljs-number">460508990706033544</span>, <span class="hljs-string">&#x27;consistency_level&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;properties&#x27;</span>: {}, <span class="hljs-string">&#x27;num_partitions&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;created_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>, <span class="hljs-string">&#x27;updated_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Procesar e insertar imágenes</p>
<pre><code translate="no"><span class="hljs-comment"># Set image directory path</span>
image_dir = <span class="hljs-string">&quot;./production_image&quot;</span>
raw_data = []

<span class="hljs-comment"># Get all supported image formats</span>
image_extensions = [<span class="hljs-string">&#x27;*.jpg&#x27;</span>, <span class="hljs-string">&#x27;*.jpeg&#x27;</span>, <span class="hljs-string">&#x27;*.png&#x27;</span>, <span class="hljs-string">&#x27;*.JPEG&#x27;</span>, <span class="hljs-string">&#x27;*.JPG&#x27;</span>, <span class="hljs-string">&#x27;*.PNG&#x27;</span>]
image_paths = []

<span class="hljs-keyword">for</span> ext <span class="hljs-keyword">in</span> image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> images in <span class="hljs-subst">{image_dir}</span>&quot;</span>)

<span class="hljs-comment"># Process images and generate embeddings</span>
successful_count = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> i, image_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(image_paths):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Processing progress: <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> - <span class="hljs-subst">{os.path.basename(image_path)}</span>&quot;</span>)
    
    image_embedding = encode_image(image_path)
    <span class="hljs-keyword">if</span> image_embedding <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image_dict = {
            <span class="hljs-string">&quot;vector&quot;</span>: image_embedding,
            <span class="hljs-string">&quot;filepath&quot;</span>: image_path,
            <span class="hljs-string">&quot;filename&quot;</span>: os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += <span class="hljs-number">1</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully processed <span class="hljs-subst">{successful_count}</span> images&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Salida de progreso de procesamiento de imágenes:</p>
<pre><code translate="no">Found 50 images <span class="hljs-keyword">in</span> ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
<button class="copy-code-btn"></button></code></pre>
<p>Insertar datos en Milvus</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data into Milvus</span>
<span class="hljs-keyword">if</span> raw_data:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Inserting data into Milvus...&quot;</span>)
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> images into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample inserted IDs: <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;ids&#x27;</span>][:<span class="hljs-number">5</span>]}</span>...&quot;</span>)  <span class="hljs-comment"># Show first 5 IDs</span>
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No successfully processed image data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Definir funciones de búsqueda y visualización</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_images_by_text</span>(<span class="hljs-params">query_text, top_k=<span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Search images based on text query&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Search query: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    
    <span class="hljs-comment"># Encode query text</span>
    query_embedding = encode_text(query_text)
    
    <span class="hljs-comment"># Search in Milvus</span>
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;filepath&quot;</span>, <span class="hljs-string">&quot;filename&quot;</span>]
    )
    
    <span class="hljs-keyword">return</span> search_results[<span class="hljs-number">0</span>]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">visualize_search_results</span>(<span class="hljs-params">query_text, results</span>):
    <span class="hljs-string">&quot;&quot;&quot;Visualize search results&quot;&quot;&quot;</span>
    num_images = <span class="hljs-built_in">len</span>(results)
    
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No matching images found&quot;</span>)
        <span class="hljs-keyword">return</span>
    
    <span class="hljs-comment"># Create subplots</span>
    fig, axes = plt.subplots(<span class="hljs-number">1</span>, num_images, figsize=(<span class="hljs-number">5</span>*num_images, <span class="hljs-number">5</span>))
    fig.suptitle(<span class="hljs-string">f&#x27;Search Results: &quot;<span class="hljs-subst">{query_text}</span>&quot; (Top <span class="hljs-subst">{num_images}</span>)&#x27;</span>, fontsize=<span class="hljs-number">16</span>, fontweight=<span class="hljs-string">&#x27;bold&#x27;</span>)
    
    <span class="hljs-comment"># Handle single image case</span>
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">1</span>:
        axes = [axes]
    
    <span class="hljs-comment"># Display images</span>
    <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
        <span class="hljs-keyword">try</span>:
            img_path = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filepath&#x27;</span>]
            filename = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filename&#x27;</span>]
            score = result[<span class="hljs-string">&#x27;distance&#x27;</span>]
            
            <span class="hljs-comment"># Load and display image</span>
            img = Image.<span class="hljs-built_in">open</span>(img_path)
            axes[i].imshow(img)
            axes[i].set_title(<span class="hljs-string">f&quot;<span class="hljs-subst">{filename}</span>\nSimilarity: <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>&quot;</span>, fontsize=<span class="hljs-number">10</span>)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
            
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. File: <span class="hljs-subst">{filename}</span>, Similarity score: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
            
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            axes[i].text(<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>, <span class="hljs-string">f&#x27;Error loading image\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&#x27;</span>,
                        ha=<span class="hljs-string">&#x27;center&#x27;</span>, va=<span class="hljs-string">&#x27;center&#x27;</span>, transform=axes[i].transAxes)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
    
    plt.tight_layout()
    plt.show()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search and visualization functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ejecutar búsqueda de texto a imagen</p>
<pre><code translate="no"><span class="hljs-comment"># Example search 1</span>
query1 = <span class="hljs-string">&quot;a golden watch&quot;</span>
results1 = search_images_by_text(query1, top_k=<span class="hljs-number">3</span>)
visualize_search_results(query1, results1)
<button class="copy-code-btn"></button></code></pre>
<p>Salida de la ejecución de la consulta de búsqueda:</p>
<pre><code translate="no"><span class="hljs-title class_">Search</span> <span class="hljs-attr">query</span>: <span class="hljs-string">&#x27;a golden watch&#x27;</span>
<span class="hljs-number">1.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">19</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2934</span>
<span class="hljs-number">2.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">download</span> (<span class="hljs-number">26</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.3073</span>
<span class="hljs-number">3.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">17</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2717</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/watch_067c39ba51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Using-Nano-banana-to-Create-Brand-Promotional-Images" class="common-anchor-header">Uso de Nano-banana para crear imágenes promocionales de marca<button data-href="#Using-Nano-banana-to-Create-Brand-Promotional-Images" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que tenemos nuestro sistema de búsqueda de texto a imagen funcionando con Milvus, integremos Nano-banana para generar nuevo contenido promocional basado en los activos que recuperamos.</p>
<p>Instalar Google SDK</p>
<pre><code translate="no">%pip install google-generativeai
%pip install requests
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Google Generative AI SDK installation complete!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Configurar Gemini API</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.<span class="hljs-property">generativeai</span> <span class="hljs-keyword">as</span> genai
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> io <span class="hljs-keyword">import</span> <span class="hljs-title class_">BytesIO</span>
genai.<span class="hljs-title function_">configure</span>(api_key=<span class="hljs-string">&quot;&lt;your_api_key&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Generar nuevas imágenes</p>
<pre><code translate="no">prompt = (
    <span class="hljs-string">&quot;An European male model wearing a suit, carrying a gold watch.&quot;</span>
)

image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;/path/to/image/watch.jpg&quot;</span>)

model = genai.GenerativeModel(<span class="hljs-string">&#x27;gemini-2.5-flash-image-preview&#x27;</span>)
response = model.generate_content([prompt, image])

<span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> response.candidates[<span class="hljs-number">0</span>].content.parts:
    <span class="hljs-keyword">if</span> part.text <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">print</span>(part.text)
    <span class="hljs-keyword">elif</span> part.inline_data <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image = Image.<span class="hljs-built_in">open</span>(BytesIO(part.inline_data.data))
        image.save(<span class="hljs-string">&quot;generated_image.png&quot;</span>)
        image.show()
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/suit_976b6f1df2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-This-Means-for-Your-Development-Workflow" class="common-anchor-header">Qué significa esto para su flujo de trabajo de desarrollo<button data-href="#What-This-Means-for-Your-Development-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Como desarrollador, esta integración de Milvus + Nano-banana cambia fundamentalmente la forma en que puede abordar los proyectos de generación de contenidos. En lugar de gestionar bibliotecas de activos estáticos o depender de costosos equipos creativos, ahora dispone de un sistema dinámico que recupera y genera exactamente lo que su aplicación necesita en tiempo real.</p>
<p>Consideremos el siguiente caso de un cliente reciente: una marca lanzó varios productos nuevos, pero optó por saltarse por completo el proceso tradicional de sesiones fotográficas. Gracias a nuestro sistema integrado, pudieron generar instantáneamente imágenes promocionales combinando su base de datos de productos existente con las capacidades de generación de Nano-banana.</p>
<p><em>Pregunta: Una modelo lleva estos productos en la playa</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_5a2a042b46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La verdadera potencia se hace evidente cuando se necesita crear contenidos complejos y multivariantes que tradicionalmente requerirían una amplia coordinación entre fotógrafos, modelos y escenógrafos. Con Milvus gestionando la recuperación de activos y Nano-banana gestionando la generación, puede crear mediante programación escenas sofisticadas que se adapten a sus requisitos específicos:</p>
<p><em>Prompt: Una modelo posa apoyada en un coche deportivo descapotable azul. Lleva un vestido con escote halter y los accesorios que lo acompañan. Está adornada con un collar de diamantes y un reloj azul, lleva tacones altos en los pies y sostiene un colgante labubu en la mano.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shoes_98e1e4c70b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para los desarrolladores que trabajan en el sector de los juegos o los coleccionables, este sistema abre posibilidades totalmente nuevas para la creación rápida de prototipos y la validación de conceptos. En lugar de invertir semanas en el modelado 3D antes de saber si un concepto funciona, ahora se pueden generar visualizaciones fotorrealistas del producto que incluyan el embalaje, el contexto ambiental e incluso los procesos de fabricación:</p>
<p><em>Pregunta: Utiliza el modelo de nano-banana para crear una figura comercializada a escala 1/7 del personaje de la ilustración, con un estilo y un entorno realistas. Coloca la figura sobre el escritorio de un ordenador, utilizando una base circular de acrílico transparente sin ningún texto. En la pantalla del ordenador, visualiza el proceso de modelado ZBrush de la figura. Junto a la pantalla del ordenador, coloca una caja de embalaje de juguetes al estilo BANDAI impresa con la ilustración original.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_3d_5189d53773.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Desde un punto de vista técnico, Nano Banana es más que una novedad: está preparado para la producción en aspectos importantes para los desarrolladores. Su punto fuerte es la coherencia y la capacidad de control, lo que se traduce en menos casos extremos que se cuelan en la lógica de tu aplicación. Y lo que es igual de importante, se ocupa de los detalles más sutiles que a menudo hacen descarrilar los procesos automatizados: mantener la coherencia de los colores de las marcas, generar una iluminación y unos reflejos físicamente plausibles y garantizar la coherencia visual en múltiples formatos de salida.</p>
<p>La verdadera magia se produce cuando se combina con la base de datos vectorial Milvus. Una base de datos vectorial no se limita a almacenar incrustaciones, sino que se convierte en un gestor inteligente de activos que puede sacar a la superficie el contenido histórico más relevante para guiar a las nuevas generaciones. El resultado: tiempos de generación más rápidos (porque el modelo tiene mejor contexto), mayor coherencia en toda la aplicación y la posibilidad de aplicar directrices de marca o estilo automáticamente.</p>
<p>En resumen, Milvus transforma Nano Banana de un juguete creativo en un sistema empresarial escalable.</p>
<p>Por supuesto, ningún sistema es perfecto. Las instrucciones complejas de varios pasos pueden causar problemas, y la física de la iluminación a veces estira la realidad más de lo deseado. La solución más fiable que hemos visto es complementar las instrucciones de texto con imágenes de referencia almacenadas en Milvus, lo que proporciona al modelo una base más rica, resultados más predecibles y ciclos de iteración más cortos. Con esta configuración, no sólo está experimentando con RAG multimodal, sino que lo está ejecutando en producción con confianza.</p>
