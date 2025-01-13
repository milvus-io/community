---
id: audio-retrieval-based-on-milvus.md
title: Tecnologías de procesamiento
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  La recuperación de audio con Milvus permite clasificar y analizar datos
  sonoros en tiempo real.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Recuperación de audio basada en Milvus</custom-h1><p>El sonido es un tipo de datos con gran densidad de información. Aunque pueda parecer anticuado en la era de los contenidos de vídeo, el audio sigue siendo una fuente de información primaria para muchas personas. A pesar de la disminución a largo plazo de los oyentes, el 83% de los estadounidenses de 12 años o más escucharon la radio terrestre (AM / FM) en una semana determinada en 2020 (por debajo del 89% en 2019). Por el contrario, el audio en línea ha experimentado un aumento constante de oyentes en las últimas dos décadas, con el 62% de los estadounidenses escuchando alguna forma de él semanalmente, según el mismo <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">estudio del Pew Research Center</a>.</p>
<p>Como onda, el sonido incluye cuatro propiedades: frecuencia, amplitud, forma de onda y duración. En terminología musical, se denominan tono, dinámica, sonido y duración. Los sonidos también ayudan a los humanos y a otros animales a percibir y comprender nuestro entorno, proporcionando pistas contextuales sobre la ubicación y el movimiento de los objetos que nos rodean.</p>
<p>Como portador de información, el audio puede clasificarse en tres categorías:</p>
<ol>
<li><strong>El habla:</strong> Medio de comunicación compuesto por palabras y gramática. Los algoritmos de reconocimiento del habla permiten convertirla en texto.</li>
<li><strong>Música:</strong> Sonidos vocales y/o instrumentales combinados para producir una composición compuesta de melodía, armonía, ritmo y timbre. La música puede representarse mediante una partitura.</li>
<li><strong>Forma de onda:</strong> Señal de audio digital obtenida mediante la digitalización de sonidos analógicos. Las formas de onda pueden representar voz, música y sonidos naturales o sintetizados.</li>
</ol>
<p>La recuperación de audio puede utilizarse para buscar y supervisar medios en línea en tiempo real con el fin de reprimir la infracción de los derechos de propiedad intelectual. También desempeña un papel importante en la clasificación y el análisis estadístico de datos de audio.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Tecnologías de procesamiento<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>El habla, la música y otros sonidos genéricos tienen características únicas y exigen distintos métodos de procesamiento. Normalmente, el audio se separa en grupos que contienen habla y grupos que no la contienen:</p>
<ul>
<li>El audio hablado se procesa mediante reconocimiento automático del habla.</li>
<li>El audio que no contiene habla, como el musical, los efectos de sonido y las señales de voz digitalizadas, se procesa mediante sistemas de recuperación de audio.</li>
</ul>
<p>Este artículo se centra en cómo utilizar un sistema de recuperación de audio para procesar datos de audio no vocal. En este artículo no se trata el reconocimiento de voz.</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Extracción de características de audio</h3><p>La extracción de características es la tecnología más importante en los sistemas de recuperación de audio, ya que permite la búsqueda de similitudes de audio. Los métodos de extracción de características de audio se dividen en dos categorías:</p>
<ul>
<li>Modelos tradicionales de extracción de características de audio, como los modelos de mezcla gaussiana (GMM) y los modelos de Markov ocultos (HMM);</li>
<li>Modelos de extracción de características de audio basados en el aprendizaje profundo, como redes neuronales recurrentes (RNN), redes de memoria a corto plazo (LSTM), marcos de codificación y descodificación, mecanismos de atención, etc.</li>
</ul>
<p>Los modelos basados en aprendizaje profundo tienen una tasa de error que es un orden de magnitud menor que los modelos tradicionales, y por lo tanto están ganando impulso como tecnología central en el campo del procesamiento de señales de audio.</p>
<p>Los datos de audio suelen estar representados por las características de audio extraídas. El proceso de recuperación busca y compara estas características y atributos en lugar de los propios datos de audio. Por lo tanto, la eficacia de la recuperación de similitudes de audio depende en gran medida de la calidad de la extracción de características.</p>
<p>En este artículo, se utilizan <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">redes neuronales de audio preentrenadas a gran escala para el reconocimiento de patrones de audio (PANN)</a> con el fin de extraer vectores de características para su precisión media media (mAP) de 0,439 (Hershey et al., 2017).</p>
<p>Después de extraer los vectores de características de los datos de audio, podemos implementar un análisis de vectores de características de alto rendimiento utilizando Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Búsqueda de similitud de vectores</h3><p><a href="https://milvus.io/">Milvus</a> es una base de datos de vectores nativa de la nube y de código abierto construida para gestionar vectores de incrustación generados por modelos de aprendizaje automático y redes neuronales. Se utiliza ampliamente en escenarios como la visión por ordenador, el procesamiento del lenguaje natural, la química computacional, los sistemas de recomendación personalizados, etc.</p>
<p>El siguiente diagrama muestra el proceso general de búsqueda de similitudes utilizando Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>Los datos no estructurados se convierten en vectores de características mediante modelos de aprendizaje profundo y se insertan en Milvus.</li>
<li>Milvus almacena e indexa estos vectores de características.</li>
<li>A petición, Milvus busca y devuelve los vectores más similares al vector de consulta.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">Visión general del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de recuperación de audio consta principalmente de dos partes: inserción (línea negra) y búsqueda (línea roja).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>audio-retrieval-system.png</span> </span></p>
<p>El conjunto de datos de muestra utilizado en este proyecto contiene sonidos de juegos de código abierto, y el código se detalla en el <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus bootcamp</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Paso 1: Insertar datos</h3><p>A continuación se muestra el código de ejemplo para generar incrustaciones de audio con el modelo PANNs-inference preentrenado e insertarlas en Milvus, que asigna un ID único a cada incrustación vectorial.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, los <strong>ids_milvus</strong> devueltos se almacenan junto con otra información relevante (por ejemplo, <strong>wav_name</strong>) para los datos de audio almacenados en una base de datos MySQL para su posterior procesamiento.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Paso 2: Búsqueda de audio</h3><p>Milvus calcula la distancia del producto interior entre los vectores de características prealmacenados y los vectores de características de entrada, extraídos de los datos de audio de la consulta utilizando el modelo de inferencia PANNs, y devuelve los <strong>ids_milvus</strong> de vectores de características similares, que corresponden a los datos de audio buscados.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Referencia de la API y demostración<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Este sistema de recuperación de audio está construido con código abierto. Sus principales características son la inserción y eliminación de datos de audio. Todas las API pueden consultarse escribiendo <strong>127.0.0.1:<port></strong> /docs en el navegador.</p>
<h3 id="Demo" class="common-anchor-header">Demo</h3><p>Tenemos en línea una <a href="https://zilliz.com/solutions">demostración en vivo</a> del sistema de recuperación de audio basado en Milvus que puede probar con sus propios datos de audio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
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
    </button></h2><p>En la era de los macrodatos, la vida de las personas está repleta de todo tipo de información. Para entenderla mejor, la recuperación de texto tradicional ya no es suficiente. La tecnología actual de recuperación de información necesita urgentemente recuperar diversos tipos de datos no estructurados, como vídeos, imágenes y audio.</p>
<p>Los datos no estructurados, difíciles de procesar por los ordenadores, pueden convertirse en vectores de características mediante modelos de aprendizaje profundo. Estos datos convertidos pueden ser procesados fácilmente por máquinas, lo que nos permite analizar datos no estructurados de formas que nuestros predecesores nunca pudieron. Milvus, una base de datos de vectores de código abierto, puede procesar eficientemente los vectores de características extraídos por modelos de IA y proporciona una variedad de cálculos comunes de similitud de vectores.</p>
<h2 id="References" class="common-anchor-header">Referencias<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. y Slaney, M., 2017, marzo. Arquitecturas CNN para clasificación de audio a gran escala. En 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp. 131-135, 2017.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">No sea un extraño<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>Encuentra o contribuye a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Interactúa con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Conecta con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
