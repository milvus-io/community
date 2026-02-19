---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  ¿Y si pudieras ver por qué falla RAG? Depuración de RAG en 3D con
  Project_Golem y Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Descubra cómo Project_Golem y Milvus hacen observables los sistemas RAG
  mediante la visualización del espacio vectorial, la depuración de errores de
  recuperación y la ampliación de la búsqueda vectorial en tiempo real.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Cuando la recuperación RAG va mal, normalmente se sabe que está estropeada: no aparecen los documentos relevantes o aparecen los irrelevantes. Pero averiguar por qué es otra historia. Todo lo que tenemos para trabajar son puntuaciones de similitud y una lista plana de resultados. No hay forma de ver cómo se sitúan realmente los documentos en el espacio vectorial, cómo se relacionan los fragmentos entre sí o dónde aterrizó la consulta en relación con el contenido que debería haber coincidido. En la práctica, esto significa que la depuración de RAG se basa principalmente en el método de prueba y error: modificar la estrategia de agrupación, cambiar el modelo de incrustación, ajustar el top-k y esperar que los resultados mejoren.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> es una herramienta de código abierto que hace visible el espacio vectorial. Utiliza UMAP para proyectar incrustaciones tridimensionales en 3D y Three.js para representarlas de forma interactiva en el navegador. En lugar de adivinar por qué falló la recuperación, se puede ver cómo se agrupan los trozos semánticamente, dónde aterriza la consulta y qué documentos se recuperaron, todo en una única interfaz visual.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Es asombroso. Sin embargo, el Project_Golem original se diseñó para pequeñas demostraciones, no para sistemas del mundo real. Se basa en archivos planos, búsquedas de fuerza bruta y reconstrucciones de conjuntos de datos completos, lo que significa que se rompe rápidamente cuando los datos crecen más allá de unos pocos miles de documentos.</p>
<p>Para llenar ese vacío, integramos Project_Golem con <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (concretamente la versión 2.6.8) como su columna vertebral vectorial. Milvus es una base de datos vectorial de alto rendimiento y código abierto que gestiona la ingesta en tiempo real, la indexación escalable y la recuperación a nivel de milisegundos, mientras que Project_Golem se centra en lo que mejor sabe hacer: hacer visible el comportamiento de la recuperación vectorial. Juntos, convierten la visualización 3D de una demostración de juguete en una herramienta de depuración práctica para los sistemas RAG de producción.</p>
<p>En este post, recorreremos Project_Golem y mostraremos cómo lo integramos con Milvus para hacer que el comportamiento de búsqueda de vectores sea observable, escalable y listo para la producción.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">¿Qué es Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>La depuración RAG es difícil por una sencilla razón: los espacios vectoriales son de alta dimensión, y los seres humanos no pueden verlos.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> es una herramienta basada en navegador que le permite ver el espacio vectorial en el que opera su sistema RAG. Toma las incrustaciones de alta dimensión que impulsan la recuperación -normalmente 768 o 1536 dimensiones- y las proyecta en una escena 3D interactiva que puede explorar directamente.</p>
<p>He aquí cómo funciona:</p>
<ul>
<li>Reducción de la dimensionalidad con UMAP. Project_Golem utiliza UMAP para comprimir vectores tridimensionales y reducirlos a tres dimensiones, conservando sus distancias relativas. Los trozos que son semánticamente similares en el espacio original permanecen juntos en la proyección 3D; los trozos no relacionados acaban muy separados.</li>
<li>Renderizado 3D con Three.js. Cada fragmento de documento aparece como un nodo en una escena 3D representada en el navegador. Puedes rotar, ampliar y explorar el espacio para ver cómo se agrupan tus documentos: qué temas se agrupan estrechamente, cuáles se solapan y dónde están los límites.</li>
<li>Resaltado en tiempo de consulta. Cuando se ejecuta una consulta, la recuperación sigue produciéndose en el espacio original de alta dimensión utilizando la similitud del coseno. Pero una vez que se obtienen los resultados, los fragmentos recuperados se iluminan en la vista 3D. De este modo, se puede ver inmediatamente dónde se ha situado la consulta en relación con los resultados y, lo que es igual de importante, en relación con los documentos que no se han recuperado.</li>
</ul>
<p>Esto es lo que hace que Project_Golem sea útil para la depuración. En lugar de mirar una lista ordenada de resultados y adivinar por qué se ha omitido un documento relevante, puede ver si se encuentra en un clúster distante (un problema de incrustación), si se solapa con contenido irrelevante (un problema de agrupación) o si apenas se encuentra fuera del umbral de recuperación (un problema de configuración). La vista 3D convierte las puntuaciones abstractas de similitud en relaciones espaciales sobre las que se puede razonar.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Por qué Project_Golem no está listo para la producción<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem se diseñó como un prototipo de visualización, y funciona bien para eso. Pero su arquitectura hace suposiciones que se rompen rápidamente a escala - en formas que importan si desea utilizarlo para la depuración RAG en el mundo real.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Cada actualización requiere una reconstrucción completa</h3><p>Esta es la limitación más fundamental. En el diseño original, la adición de nuevos documentos desencadena una reconstrucción completa de la tubería: las incrustaciones se regeneran y se escriben en archivos .npy, UMAP se vuelve a ejecutar en todo el conjunto de datos, y las coordenadas 3D se vuelven a exportar como JSON.</p>
<p>Incluso con 100.000 documentos, una ejecución de UMAP con un solo núcleo tarda entre 5 y 10 minutos. A escala de un millón de documentos, se vuelve totalmente impracticable. No se puede utilizar para ningún conjunto de datos que cambie continuamente - noticias, documentación, conversaciones de usuarios - porque cada actualización significa esperar un ciclo completo de reprocesamiento.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">La búsqueda por fuerza bruta no es escalable</h3><p>El lado de la recuperación tiene su propio techo. La implementación original utiliza NumPy para la búsqueda de similitud coseno por fuerza bruta: complejidad de tiempo lineal, sin indexación. En un conjunto de datos de un millón de documentos, una sola consulta puede tardar más de un segundo. Eso es inutilizable para cualquier sistema interactivo o en línea.</p>
<p>La presión de la memoria agrava el problema. Cada vector float32 de 768 dimensiones ocupa aproximadamente 3 KB, por lo que un conjunto de datos de un millón de vectores requiere más de 3 GB de memoria, todo ello cargado en una matriz NumPy plana sin estructura de índices que permita una búsqueda eficiente.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Sin filtrado de metadatos, sin multi-tenancy</h3><p>En un sistema RAG real, la similitud vectorial rara vez es el único criterio de recuperación. Casi siempre es necesario filtrar por metadatos, como tipo de documento, marcas de tiempo, permisos de usuario o límites a nivel de aplicación. Un sistema RAG de atención al cliente, por ejemplo, necesita limitar la recuperación a los documentos de un inquilino específico, no buscar en los datos de todo el mundo.</p>
<p>Project_Golem no admite nada de esto. No hay índices RNA (como HNSW o IVF), ni filtrado escalar, ni aislamiento de inquilinos, ni búsqueda híbrida. Es una capa de visualización sin un motor de recuperación de producción por debajo.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Cómo Milvus potencia la capa de recuperación de Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>En la sección anterior se identificaron tres lagunas: reconstrucciones completas en cada actualización, búsqueda de fuerza bruta y ausencia de recuperación de metadatos. Las tres se deben a la misma causa: Project_Golem no tiene capa de base de datos. La recuperación, el almacenamiento y la visualización están enredados en una sola tubería, por lo que cambiar cualquier parte obliga a reconstruirlo todo.</p>
<p>La solución no consiste en optimizar ese proceso. Es separarlo.</p>
<p>Al integrar Milvus 2.6.8 como columna vertebral de los vectores, la recuperación se convierte en una capa dedicada de nivel de producción que funciona independientemente de la visualización. Milvus se encarga del almacenamiento, la indexación y la búsqueda de vectores. Project_Golem se centra exclusivamente en la representación, consumiendo los ID de los documentos de Milvus y resaltándolos en la vista 3D.</p>
<p>Esta separación produce dos flujos limpios e independientes:</p>
<p>Flujo de recuperación (en línea, a nivel de milisegundos)</p>
<ul>
<li>Su consulta se convierte en un vector utilizando incrustaciones OpenAI.</li>
<li>El vector de consulta se envía a una colección Milvus.</li>
<li>Milvus AUTOINDEX selecciona y optimiza el índice apropiado.</li>
<li>Una búsqueda de similitud coseno en tiempo real devuelve los IDs de los documentos relevantes.</li>
</ul>
<p>Flujo de visualización (fuera de línea, escala de demostración)</p>
<ul>
<li>UMAP genera coordenadas 3D durante la ingestión de datos (n_neighbors=30, min_dist=0.1).</li>
<li>Las coordenadas se almacenan en golem_cortex.json.</li>
<li>El frontend resalta los nodos 3D correspondientes utilizando los ID de documento devueltos por Milvus.</li>
</ul>
<p>El punto crítico: la recuperación ya no espera a la visualización. Puede ingerir nuevos documentos y buscarlos inmediatamente - la vista 3D se pone al día en su propio horario.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Qué cambian los nodos de streaming</h3><p>Esta ingesta en tiempo real es impulsada por una nueva capacidad en Milvus 2.6.8: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">Streaming Nodes</a>. En versiones anteriores, la ingesta en tiempo real requería una cola de mensajes externa como Kafka o Pulsar. Streaming Nodes traslada esa coordinación al propio Milvus: los nuevos vectores se ingieren continuamente, los índices se actualizan de forma incremental y los documentos recién añadidos se pueden buscar inmediatamente sin necesidad de una reconstrucción completa y sin dependencias externas.</p>
<p>Para Project_Golem, esto es lo que hace que la arquitectura sea práctica. Puede seguir añadiendo documentos a su sistema RAG - nuevos artículos, documentos actualizados, contenido generado por el usuario - y la recuperación se mantiene actualizada sin desencadenar el costoso ciclo UMAP → JSON → recarga.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Ampliación de la visualización a escala de millones (camino futuro)</h3><p>Con esta configuración respaldada por Milvus, Project_Golem admite actualmente demostraciones interactivas de unos 10.000 documentos. La recuperación se escala mucho más allá de eso - Milvus maneja millones - pero la tubería de visualización todavía se basa en ejecuciones UMAP por lotes. Para colmar esta laguna, la arquitectura puede ampliarse con un proceso de visualización incremental:</p>
<ul>
<li><p>Activadores de actualización: El sistema escucha los eventos de inserción en la colección Milvus. Una vez que los nuevos documentos añadidos alcanzan un umbral definido (por ejemplo, 1.000 elementos), se activa una actualización incremental.</p></li>
<li><p>Proyección incremental: En lugar de volver a ejecutar UMAP en todo el conjunto de datos, los nuevos vectores se proyectan en el espacio 3D existente utilizando el método transform() de UMAP. Esto preserva la estructura global a la vez que reduce drásticamente el coste computacional.</p></li>
<li><p>Sincronización frontend: Los fragmentos de coordenadas actualizados se transmiten al frontend a través de WebSocket, lo que permite que aparezcan nuevos nodos dinámicamente sin recargar toda la escena.</p></li>
</ul>
<p>Más allá de la escalabilidad, Milvus 2.6.8 permite la búsqueda híbrida combinando la similitud vectorial con la búsqueda de texto completo y el filtrado escalar. Esto abre la puerta a interacciones 3D más ricas, como el resaltado de palabras clave, el filtrado de categorías y el troceado basado en el tiempo, lo que ofrece a los desarrolladores formas más potentes de explorar, depurar y razonar sobre el comportamiento RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Cómo desplegar y explorar Project_Golem con Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>El Project_Golem actualizado es ahora de código abierto en <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Utilizando la documentación oficial de Milvus como nuestro conjunto de datos, recorremos el proceso completo de visualización de la recuperación RAG en 3D. La configuración utiliza Docker y Python y es fácil de seguir, incluso si estás empezando desde cero.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Una clave de la API de OpenAI</li>
<li>Un conjunto de datos (documentación de Milvus en formato Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Desplegar Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementación del núcleo</h3><p>Integración de Milvus (ingest.py)</p>
<p>Nota: La implementación admite hasta ocho categorías de documentos. Si el número de categorías supera este límite, los colores se reutilizan de forma rotatoria.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Visualización del frontend (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Descargue el conjunto de datos y colóquelo en el directorio especificado</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Iniciar el proyecto</h3><p>Conversión de las incrustaciones de texto al espacio 3D</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[imagen]</p>
<p>Iniciar el servicio de frontend</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualización e interacción</h3><p>Una vez que el frontend recibe los resultados de la recuperación, el brillo de los nodos se escala en función de las puntuaciones de similitud del coseno, mientras que los colores originales de los nodos se conservan para mantener claros los grupos de categorías. Se trazan líneas semitransparentes desde el punto de consulta hasta cada nodo coincidente, y la cámara se desplaza y amplía suavemente para enfocar el clúster activado.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Ejemplo 1: Coincidencia en el dominio</h4><p>Consulta: "¿Qué tipos de índice admite Milvus?"</p>
<p>Comportamiento de visualización:</p>
<ul>
<li><p>En el espacio 3D, aproximadamente 15 nodos dentro del cluster rojo etiquetado INDEXES muestran un notable aumento de brillo (alrededor de 2-3×).</p></li>
<li><p>Los nodos coincidentes incluyen fragmentos de documentos como index_types.md, hnsw_index.md e ivf_index.md.</p></li>
<li><p>Se representan líneas semitransparentes desde el vector de consulta hasta cada nodo coincidente, y la cámara enfoca suavemente el clúster rojo.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Ejemplo 2: Rechazo de consultas fuera del dominio</h4><p>Consulta: "¿Cuánto cuesta la comida de KFC?"</p>
<p>Comportamiento de la visualización:</p>
<ul>
<li><p>Todos los nodos conservan sus colores originales, con ligeros cambios de tamaño (menos de 1,1×).</p></li>
<li><p>Los nodos coincidentes están dispersos en varios grupos con colores diferentes, sin mostrar una concentración semántica clara.</p></li>
<li><p>La cámara no desencadena una acción de enfoque, ya que no se alcanza el umbral de similitud (0,5).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Project_Golem emparejado con Milvus no sustituirá a su proceso de evaluación RAG existente, pero añade algo de lo que la mayoría de los procesos carecen por completo: la capacidad de ver lo que está sucediendo dentro del espacio vectorial.</p>
<p>Con esta configuración, se puede distinguir entre un fallo de recuperación causado por una mala incrustación, uno causado por una mala fragmentación y uno causado por un umbral demasiado ajustado. Este tipo de diagnóstico solía requerir conjeturas e iteraciones. Ahora se puede ver.</p>
<p>La integración actual soporta la depuración interactiva a escala de demostración (~10.000 documentos), con la base de datos vectorial de Milvus gestionando la recuperación a nivel de producción entre bastidores. El camino hacia la visualización a escala de millones está trazado, pero aún no se ha construido, por lo que es un buen momento para participar.</p>
<p>Echa un vistazo a <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> en GitHub, pruébalo con tu propio conjunto de datos y comprueba el aspecto real de tu espacio vectorial.</p>
<p>Si tienes preguntas o quieres compartir lo que encuentres, únete a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserva una sesión <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a> para recibir orientación práctica sobre tu configuración.</p>
