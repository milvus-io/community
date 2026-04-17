---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Pruebe e implante rápidamente soluciones de búsqueda vectorial con el Milvus
  2.0 Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Cree, pruebe y personalice soluciones de búsqueda de similitud vectorial con
  Milvus, una base de datos vectorial de código abierto.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Pruebe e implante rápidamente soluciones de búsqueda vectorial con el Milvus 2.0 Bootcamp</custom-h1><p>Con el lanzamiento de Milvus 2.0, el equipo ha renovado el Milvus <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>. El nuevo y mejorado bootcamp ofrece guías actualizadas y ejemplos de código más fáciles de seguir para una variedad de casos de uso e implementaciones. Además, esta nueva versión está actualizada para <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, una versión reimaginada de la base de datos vectorial más avanzada del mundo.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Pruebas de estrés de su sistema con conjuntos de datos de referencia de 1M y 100M</h3><p>El <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">directorio de pruebas comparativas</a> contiene pruebas comparativas de vectores de 1 millón y 100 millones que indican cómo reaccionará su sistema ante conjuntos de datos de diferentes tamaños.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Explore y cree soluciones populares de búsqueda de similitud vectorial</h3><p>El <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">directorio de soluciones</a> incluye los casos de uso más populares de búsqueda de similitud vectorial. Cada caso de uso contiene una solución de bloc de notas y una solución desplegable en Docker. Los casos de uso incluyen:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Búsqueda de similitud de imágenes</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Búsqueda de similitudes en vídeo</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Búsqueda de similitudes de audio</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Sistema de recomendación</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Búsqueda molecular</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Sistema de respuesta a preguntas</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Despliegue rápido de aplicaciones completas en cualquier sistema</h3><p>Las soluciones de despliegue rápido son soluciones dockerizadas que permiten a los usuarios desplegar aplicaciones completamente construidas en cualquier sistema. Estas soluciones son ideales para demostraciones breves, pero requieren un trabajo adicional de personalización y comprensión en comparación con los blocs de notas.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Utilice cuadernos de escenarios específicos para desplegar fácilmente aplicaciones preconfiguradas.</h3><p>Los cuadernos contienen un ejemplo sencillo de despliegue de Milvus para resolver el problema en un caso de uso determinado. Cada uno de los ejemplos puede ejecutarse de principio a fin sin necesidad de gestionar archivos o configuraciones. Además, cada cuaderno es fácil de seguir y modificable, lo que los convierte en archivos base ideales para otros proyectos.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Ejemplo de cuaderno de búsqueda de similitud de imágenes</h3><p>La búsqueda por similitud de imágenes es una de las ideas centrales que subyacen a muchas tecnologías diferentes, incluidos los coches autónomos que reconocen objetos. Este ejemplo explica cómo construir fácilmente programas de visión por ordenador con Milvus.</p>
<p>Este cuaderno gira en torno a tres cosas:</p>
<ul>
<li>Servidor Milvus</li>
<li>Servidor Redis (para almacenamiento de metadatos)</li>
<li>Modelo preentrenado Resnet-18.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Paso 1: Descargar los paquetes necesarios</h4><p>Comience descargando todos los paquetes necesarios para este proyecto. Este cuaderno incluye una tabla con la lista de paquetes a utilizar.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Paso 2: Arranque del servidor</h4><p>Una vez instalados los paquetes, inicie los servidores y asegúrese de que ambos funcionan correctamente. Asegúrese de seguir las instrucciones correctas para iniciar los servidores <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> y <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Paso 3: Descargar datos del proyecto</h4><p>Por defecto, este cuaderno extrae un fragmento de los datos de VOCImage para utilizarlo como ejemplo, pero cualquier directorio con imágenes debería funcionar siempre que siga la estructura de archivos que puede verse en la parte superior del cuaderno.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Paso 4: Conectarse a los servidores</h4><p>En este ejemplo, los servidores se ejecutan en los puertos por defecto en el localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Paso 5: Crear una colección</h4><p>Después de iniciar los servidores, cree una colección en Milvus para almacenar todos los vectores. En este ejemplo, el tamaño de dimensión se establece en 512, el tamaño de la salida de resnet-18, y la métrica de similitud se establece en la distancia euclidiana (L2). Milvus soporta una variedad de <a href="https://milvus.io/docs/v2.0.x/metric.md">métricas de similitud</a> diferentes.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Paso 6: Construir un índice para la colección</h4><p>Una vez hecha la colección, construya un índice para ella. En este caso, se utiliza el índice IVF_SQ8. Este índice requiere el parámetro 'nlist', que le dice a Milvus cuántos clusters hacer dentro de cada archivo de datos (segmento). Diferentes <a href="https://milvus.io/docs/v2.0.x/index.md">índices</a> requieren diferentes parámetros.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Paso 7: Configurar el modelo y el cargador de datos</h4><p>Una vez construido el índice IVF_SQ8, configure la red neuronal y el cargador de datos. La red neuronal preentrenada pytorch resnet-18 utilizada en este ejemplo carece de su última capa, que comprime los vectores para la clasificación y puede perder información valiosa.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Es necesario modificar el conjunto de datos y el cargador de datos para que sean capaces de preprocesar y procesar por lotes las imágenes y, al mismo tiempo, proporcionar las rutas de los archivos de las imágenes. Esto puede hacerse con un cargador de datos Torchvision ligeramente modificado. Para el preprocesamiento, las imágenes deben ser recortadas y normalizadas debido a que el modelo resnet-18 ha sido entrenado en un tamaño y rango de valores específicos.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Paso 8: Insertar vectores en la colección</h4><p>Una vez configurada la colección, las imágenes pueden procesarse y cargarse en la colección creada. En primer lugar, el cargador de datos extrae las imágenes y las ejecuta a través del modelo resnet-18. Los vectores resultantes se incrustan en la colección. Los vectores resultantes se insertan en Milvus, que devuelve un ID único para cada vector. A continuación, los ID de los vectores y las rutas de los archivos de imagen se insertan como pares clave-valor en el servidor Redis.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Paso 9: Realizar una búsqueda de similitud de vectores</h4><p>Una vez insertados todos los datos en Milvus y Redis, se puede realizar la búsqueda de similitud de vectores. En este ejemplo, se extraen del servidor Redis tres imágenes seleccionadas al azar para realizar una búsqueda de similitud vectorial.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Estas imágenes pasan primero por el mismo preprocesamiento que se encuentra en el Paso 7 y luego son empujadas a través del modelo resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, las incrustaciones vectoriales resultantes se utilizan para realizar una búsqueda. Primero, establezca los parámetros de búsqueda, incluyendo el nombre de la colección a buscar, nprobe (el número de clusters a buscar), y top_k (el número de vectores devueltos). En este ejemplo, la búsqueda debería ser muy rápida.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Paso 10: Resultados de la búsqueda de imágenes</h4><p>Los ID de los vectores devueltos por las consultas se utilizan para encontrar las imágenes correspondientes. A continuación, se utiliza Matplotlib para mostrar los resultados de la búsqueda de imágenes.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Aprenda a desplegar Milvus en diferentes entornos</h3><p>La <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">sección de despliegue</a> del nuevo bootcamp contiene toda la información para utilizar Milvus en diferentes entornos y configuraciones. Incluye el despliegue de Mishards, el uso de Kubernetes con Milvus, el balanceo de carga y más. Cada entorno tiene una guía detallada paso a paso que explica cómo hacer que Milvus funcione en él.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">No sea un extraño</h3><ul>
<li>Lee nuestro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interactúe con nuestra comunidad de código abierto en <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilice o contribuya a Milvus, la base de datos vectorial más popular del mundo, en <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
