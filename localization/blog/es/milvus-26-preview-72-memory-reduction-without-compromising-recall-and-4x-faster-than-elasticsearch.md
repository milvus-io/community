---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Avance de Milvus 2.6: 72% de reducción de memoria sin comprometer la
  recuperación y 4 veces más rápido que Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Eche un primer vistazo en exclusiva a las innovaciones de la próxima Milvus
  2.6 que redefinirán el rendimiento y la eficacia de las bases de datos
  vectoriales.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>A lo largo de esta semana, hemos compartido una serie de innovaciones interesantes en Milvus que amplían los límites de la tecnología de bases de datos vectoriales:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall (Búsqueda vectorial en el mundo real: cómo filtrar de forma eficiente sin matar la recuperación) </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Lleve la compresión vectorial al extremo: Cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: El arma secreta para luchar contra los duplicados en los datos de entrenamiento LLM </a></p></li>
</ul>
<p>Ahora, como colofón a nuestra serie de Semanas Milvus, me complace ofrecerle un adelanto de lo que está por llegar en Milvus 2.6, un hito crucial en nuestra hoja de ruta de productos 2025 que se encuentra actualmente en desarrollo, y cómo estas mejoras transformarán la búsqueda impulsada por IA. Esta próxima versión reúne todas estas innovaciones y más en tres frentes críticos: <strong>optimización de la rentabilidad</strong>, <strong>capacidades de búsqueda avanzada</strong> y <strong>una nueva arquitectura</strong> que lleva la búsqueda vectorial más allá de la escala de 10.000 millones de vectores.</p>
<p>Analicemos algunas de las mejoras clave que puede esperar cuando Milvus 2.6 llegue este mes de junio, empezando por las que podrían tener un impacto más inmediato: reducciones drásticas en el uso y coste de la memoria y un rendimiento ultrarrápido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Reducción de costes: Reducción drástica del uso de memoria y aumento del rendimiento<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Depender de una memoria costosa representa uno de los mayores obstáculos para escalar la búsqueda vectorial a miles de millones de registros. Milvus 2.6 introducirá varias optimizaciones clave que reducirán drásticamente sus costes de infraestructura a la vez que mejorarán el rendimiento.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">Cuantización RaBitQ de 1 bit: 72% de reducción de memoria con 4× QPS y sin pérdida de recuperación</h3><p>El consumo de memoria ha sido durante mucho tiempo el talón de Aquiles de las bases de datos vectoriales a gran escala. Aunque la cuantización vectorial no es nueva, la mayoría de los enfoques existentes sacrifican demasiada calidad de búsqueda para ahorrar memoria. Milvus 2.6 abordará este reto de frente introduciendo<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> la cuantización RaBitQ de 1 bit</a> en entornos de producción.</p>
<p>Lo que hace que nuestra implementación sea especial es la capacidad de optimización ajustable Refine que estamos construyendo. Al implementar un índice primario con cuantificación RaBitQ y opciones de refinado SQ4/SQ6/SQ8, hemos logrado un equilibrio óptimo entre el uso de memoria y la calidad de la búsqueda (~95% de recuperación).</p>
<p>Nuestros resultados preliminares son prometedores:</p>
<table>
<thead>
<tr><th><strong>Métrica de</strong><strong>rendimiento</strong> </th><th><strong>IVF_FLAT tradicional</strong></th><th><strong>Sólo RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1 bit) + SQ8 Refinar</strong></th></tr>
</thead>
<tbody>
<tr><td>Huella de memoria</td><td>100% (línea de base)</td><td>3% (reducción del 97%)</td><td>28% (reducción del 72%)</td></tr>
<tr><td>Calidad de recuperación</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Rendimiento de las consultas (QPS)</td><td>236</td><td>648 (2,7 veces más rápido)</td><td>946 (4 veces más rápido)</td></tr>
</tbody>
</table>
<p><em>Tabla: Evaluación de VectorDBBench con 1M de vectores de 768 dimensiones, probado en AWS m6id.2xlarge</em></p>
<p>El verdadero avance aquí no es sólo la reducción de memoria, sino lograr esto al mismo tiempo que ofrece una mejora de rendimiento 4× sin comprometer la precisión. Esto significa que podrá servir la misma carga de trabajo con un 75% menos de servidores o gestionar 4 veces más tráfico en su infraestructura actual.</p>
<p>Para los usuarios empresariales que utilizan Milvus totalmente gestionado en<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, estamos desarrollando perfiles de configuración automatizados que ajustarán dinámicamente los parámetros de RaBitQ en función de las características específicas de su carga de trabajo y sus requisitos de precisión.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Búsqueda de texto completo un 400% más rápida que Elasticsearch</h3><p>Las capacidades de<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">búsqueda</a> de<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">texto</a> completo en bases de datos vectoriales se han convertido en esenciales para la creación de sistemas de recuperación híbridos. Desde la introducción de BM25 en <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, hemos recibido comentarios entusiastas, junto con peticiones de un mejor rendimiento a escala.</p>
<p>Milvus 2.6 ofrecerá mejoras sustanciales de rendimiento en BM25. Nuestras pruebas en el conjunto de datos BEIR muestran un rendimiento 3-4 veces mayor que Elasticsearch con tasas de recuperación equivalentes. Para algunas cargas de trabajo, la mejora alcanza hasta 7 veces más QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Milvus frente a Elasticsearch en rendimiento Índice de rutas JSON: 99% menos de latencia para filtrado complejo</p>
<p>Las aplicaciones modernas de IA rara vez dependen únicamente de la similitud vectorial; casi siempre combinan la búsqueda vectorial con el filtrado de metadatos. A medida que estas condiciones de filtrado se hacen más complejas (especialmente con objetos JSON anidados), el rendimiento de la consulta puede deteriorarse rápidamente.</p>
<p>Milvus 2.6 introducirá un mecanismo de indexación dirigido para rutas JSON anidadas que le permitirá crear índices en rutas específicas (por ejemplo, $meta. <code translate="no">user_info.location</code>) dentro de campos JSON. En lugar de escanear objetos enteros, Milvus buscará directamente los valores de los índices preconstruidos.</p>
<p>En nuestra evaluación con más de 100 M de registros, JSON Path Index redujo la latencia de filtrado de <strong>140 ms</strong> (P99: 480 ms) a sólo <strong>1,5 ms</strong> (P99: 10 ms), una reducción del 99% que transformará en respuestas instantáneas consultas que antes resultaban impracticables.</p>
<p>Esta característica será especialmente valiosa para:</p>
<ul>
<li><p>Sistemas de recomendación con filtrado complejo de atributos de usuario</p></li>
<li><p>Aplicaciones RAG que filtran documentos por varias etiquetas</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Búsqueda de próxima generación: De la similitud vectorial básica a la recuperación de nivel de producción<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda vectorial por sí sola no es suficiente para las aplicaciones modernas de IA. Los usuarios exigen la precisión de la recuperación de información tradicional combinada con la comprensión semántica de las incrustaciones vectoriales. Milvus 2.6 introducirá varias funciones de búsqueda avanzada que acortarán esta distancia.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Mejor búsqueda de texto completo con analizador multilingüe</h3><p>La búsqueda de texto completo depende en gran medida del idioma... Milvus 2.6 introducirá un proceso de análisis de texto completamente renovado con soporte multilingüe:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> soporte sintáctico para la observabilidad de la configuración del analizador/tokenización</p></li>
<li><p>tokenizador Lindera para idiomas asiáticos como el japonés y el coreano</p></li>
<li><p>tokenizador ICU para un soporte multilingüe completo</p></li>
<li><p>Configuración granular de idiomas para definir reglas de tokenización específicas de cada idioma.</p></li>
<li><p>Jieba mejorado con soporte para la integración de diccionarios personalizados.</p></li>
<li><p>Opciones de filtro ampliadas para un procesamiento de texto más preciso</p></li>
</ul>
<p>Para las aplicaciones globales, esto significa una mejor búsqueda multilingüe sin indexación especializada por idioma ni complejas soluciones.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Coincidencia de frases: Captura del matiz semántico en el orden de las palabras</h3><p>El orden de las palabras transmite distinciones de significado críticas que la búsqueda por palabras clave suele pasar por alto. Pruebe a comparar &quot;técnicas de aprendizaje automático&quot; con &quot;técnicas de aprendizaje automático&quot;: mismas palabras, significado totalmente diferente.</p>
<p>Milvus 2.6 añadirá <strong>la concordancia de frases</strong>, que ofrece a los usuarios más control sobre el orden y la proximidad de las palabras que la búsqueda de texto completo o la concordancia exacta de cadenas:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>El parámetro <code translate="no">slop</code> proporcionará un control flexible sobre la proximidad de las palabras: 0 requiere coincidencias exactas consecutivas, mientras que valores más altos permiten pequeñas variaciones en las frases.</p>
<p>Esta función será especialmente útil para:</p>
<ul>
<li><p>Búsqueda de documentos jurídicos en los que la redacción exacta tiene importancia jurídica.</p></li>
<li><p>Recuperación de contenidos técnicos en los que el orden de los términos distingue conceptos diferentes.</p></li>
<li><p>Bases de datos de patentes en las que se deben buscar frases técnicas específicas.</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Funciones de decaimiento en función del tiempo: Priorización automática del contenido nuevo</h3><p>El valor de la información suele disminuir con el tiempo. Los artículos de noticias, los lanzamientos de productos y las publicaciones en redes sociales pierden relevancia a medida que envejecen, aunque los algoritmos de búsqueda tradicionales tratan todo el contenido por igual, independientemente de la fecha.</p>
<p>Milvus 2.6 introducirá <strong>funciones de decaimiento</strong> para una clasificación consciente del tiempo que ajusta automáticamente las puntuaciones de relevancia en función de la antigüedad del documento.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Podrá configurar:</p>
<ul>
<li><p><strong>Tipo de función</strong>: Exponencial (decaimiento rápido), Gaussiano (decaimiento gradual) o Lineal (decaimiento constante)</p></li>
<li><p><strong>Tasa de decaimiento</strong>: La rapidez con la que la relevancia disminuye con el tiempo</p></li>
<li><p><strong>Punto de origen</strong>: Fecha de referencia para medir las diferencias temporales</p></li>
</ul>
<p>Este reordenamiento sensible al tiempo garantizará que los resultados más actualizados y contextualmente relevantes aparezcan en primer lugar, lo que es crucial para los sistemas de recomendación de noticias, las plataformas de comercio electrónico y las redes sociales.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Datos de entrada, datos de salida: Del texto bruto a la búsqueda vectorial en un solo paso</h3><p>Uno de los mayores problemas de los desarrolladores con las bases de datos vectoriales ha sido la desconexión entre los datos sin procesar y las incrustaciones vectoriales. Milvus 2.6 simplificará drásticamente este flujo de trabajo con una nueva interfaz de <strong>funciones</strong> que integra modelos de incrustación de terceros directamente en su canalización de datos. Esto agiliza su proceso de búsqueda vectorial con una sola llamada.</p>
<p>En lugar de calcular previamente las incrustaciones, podrá:</p>
<ol>
<li><p><strong>Insertar datos sin procesar directamente</strong>: Enviar texto, imágenes u otro contenido a Milvus.</p></li>
<li><p><strong>Configurar proveedores de incrustación para vectorización</strong>: Milvus puede conectarse a servicios de modelos de incrustación como OpenAI, AWS Bedrock, Google Vertex AI y Hugging Face.</p></li>
<li><p><strong>Consulta mediante lenguaje natural</strong>: Búsqueda mediante consultas de texto, no incrustaciones vectoriales.</p></li>
</ol>
<p>Esto creará una experiencia racionalizada de "Entrada de datos, salida de datos" en la que Milvus gestiona internamente la generación de vectores, haciendo que el código de su aplicación sea más sencillo.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Evolución arquitectónica: Escalado a cientos de miles de millones de vectores<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Una buena base de datos no sólo tiene grandes características, también debe ofrecer esas características a escala, probadas en producción.</p>
<p>Milvus 2.6 introducirá un cambio arquitectónico fundamental que permitirá un escalado rentable a cientos de miles de millones de vectores. Lo más destacado es una nueva arquitectura de almacenamiento por niveles caliente-frío que gestiona de forma inteligente la colocación de los datos en función de los patrones de acceso, moviendo automáticamente los datos calientes a la memoria/SSD de alto rendimiento y colocando los datos fríos en un almacenamiento de objetos más económico. Este enfoque puede reducir drásticamente los costes al tiempo que mantiene el rendimiento de las consultas donde más importa.</p>
<p>Además, un nuevo <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">Streaming Node</a> permitirá el procesamiento vectorial en tiempo real con integración directa a plataformas de streaming como Kafka y Pulsar y el recién creado <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>, haciendo que los nuevos datos se puedan buscar inmediatamente sin retrasos por lotes.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Esté atento a Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 está actualmente en desarrollo activo y estará disponible este mes de junio. Estamos encantados de ofrecerle estas optimizaciones de rendimiento, capacidades de búsqueda avanzadas y una nueva arquitectura para ayudarle a crear aplicaciones de IA escalables a un coste menor.</p>
<p>Mientras tanto, agradeceremos sus comentarios sobre estas próximas funciones. ¿Qué es lo que más le entusiasma? ¿Qué funciones tendrían un mayor impacto en sus aplicaciones? Únete a la conversación en nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o sigue nuestro progreso en<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>¿Quiere ser el primero en saber cuándo se lanza Milvus 2.6? Síganos en<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> o<a href="https://twitter.com/milvusio"> X</a> para conocer las últimas actualizaciones.</p>
