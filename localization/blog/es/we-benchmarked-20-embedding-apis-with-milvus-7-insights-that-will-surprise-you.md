---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >-
  Hemos comparado más de 20 API de incrustación con Milvus: 7 datos que le
  sorprenderán
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  Las API de incrustación más populares no son las más rápidas. La geografía
  importa más que la arquitectura de los modelos. Y a veces una CPU de 20 $/mes
  supera a una llamada API de 200 $/mes.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>Probablemente, todos los desarrolladores de IA han creado un sistema RAG que funciona perfectamente... en su entorno local.</strong></p>
<p>Has clavado la precisión de recuperación, optimizado tu base de datos vectorial, y tu demo funciona como la mantequilla. Luego se despliega a la producción y de repente:</p>
<ul>
<li><p>Sus consultas locales de 200 ms tardan 3 segundos para los usuarios reales.</p></li>
<li><p>Los colegas de distintas regiones informan de un rendimiento completamente diferente.</p></li>
<li><p>El proveedor de incrustación que eligió para obtener la "mayor precisión" se convierte en su mayor cuello de botella.</p></li>
</ul>
<p>¿Qué ha ocurrido? Aquí está el asesino del rendimiento que nadie compara: <strong>la latencia de la API de incrustación</strong>.</p>
<p>Mientras que las clasificaciones MTEB se obsesionan con las puntuaciones de recuperación y los tamaños de los modelos, ignoran la métrica que sienten los usuarios: cuánto tiempo esperan antes de ver una respuesta. Hemos probado todos los principales proveedores de incrustación en condiciones reales y hemos descubierto diferencias de latencia extremas que le harán cuestionarse toda su estrategia de selección de proveedores.</p>
<p><strong><em>Spoiler: Las API de incrustación más populares no son las más rápidas. La geografía importa más que la arquitectura del modelo. Y a veces una <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">CPU 20/mesbatea20/mes</span></span></span></span>a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">una</annotation></semantics></math></span></span>llamada API</em></strong><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><strong><em> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">20/mesbatea200/mes</span></span></span></span>.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Por qué la latencia de la API es el cuello de botella oculto de la GAR<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando se construyen sistemas RAG, búsquedas de comercio electrónico o motores de recomendación, los modelos de incrustación son el componente central que transforma el texto en vectores, permitiendo a las máquinas comprender la semántica y realizar búsquedas de similitud eficientes. Aunque solemos precalcular las incrustaciones para las bibliotecas de documentos, las consultas de los usuarios siguen requiriendo llamadas a la API de incrustación en tiempo real para convertir las preguntas en vectores antes de su recuperación, y esta latencia en tiempo real se convierte a menudo en el cuello de botella del rendimiento en toda la cadena de la aplicación.</p>
<p>Los puntos de referencia de incrustación más conocidos, como MTEB, se centran en la precisión de la recuperación o el tamaño del modelo, y a menudo pasan por alto la métrica de rendimiento crucial: la latencia de la API. Utilizando la función <code translate="no">TextEmbedding</code> de Milvus, realizamos pruebas exhaustivas en el mundo real con los principales proveedores de servicios de incrustación de Norteamérica y Asia.</p>
<p>La latencia de incrustación se manifiesta en dos etapas críticas:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Impacto en el tiempo de consulta</h3><p>En un flujo de trabajo RAG típico, cuando un usuario formula una pregunta, el sistema debe:</p>
<ul>
<li><p>convertir la consulta en un vector mediante una llamada a la API de incrustación</p></li>
<li><p>Buscar vectores similares en Milvus</p></li>
<li><p>Enviar los resultados y la pregunta original a un LLM</p></li>
<li><p>Generar y devolver la respuesta</p></li>
</ul>
<p>Muchos desarrolladores asumen que la generación de respuestas del LLM es la parte más lenta. Sin embargo, la capacidad de salida en flujo de muchos LLM crea una ilusión de velocidad: se ve el primer token rápidamente. En realidad, si la llamada a la API de incrustación tarda cientos de milisegundos o incluso segundos, se convierte en el primer cuello de botella -y el más notable- de la cadena de respuesta.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Impacto de la ingestión de datos</h3><p>Tanto si se trata de crear un índice desde cero como de realizar actualizaciones rutinarias, la ingestión masiva requiere vectorizar miles o millones de trozos de texto. Si cada llamada de incrustación experimenta una latencia elevada, toda su cadena de datos se ralentiza drásticamente, lo que retrasa los lanzamientos de productos y las actualizaciones de la base de conocimientos.</p>
<p>Ambas situaciones hacen que la latencia de la API de incrustación sea una métrica de rendimiento no negociable para los sistemas RAG de producción.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Medición de la latencia de la API de incrustación en el mundo real con Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una base de datos vectorial de código abierto y alto rendimiento que ofrece una nueva interfaz <code translate="no">TextEmbedding</code> Function. Esta función integra directamente modelos de incrustación populares de OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI y muchos más proveedores en su canalización de datos, agilizando su canalización de búsqueda vectorial con una sola llamada.</p>
<p>Utilizando esta nueva interfaz de funciones, hemos probado y evaluado API de incrustación populares de proveedores conocidos como OpenAI y Cohere, así como otros como AliCloud y SiliconFlow, midiendo su latencia de extremo a extremo en escenarios de implementación realistas.</p>
<p>Nuestro completo conjunto de pruebas abarcó varias configuraciones de modelos:</p>
<table>
<thead>
<tr><th><strong>Proveedor</strong></th><th><strong>Modelo</strong></th><th><strong>Dimensiones</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>text-embedding-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-embedding-3-small</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-embedding-3-large</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>text-embedding-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>texto-multilingüe-incrustado-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-inglés-light-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-light-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-embedding-v1</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>texto-incrustado-v2</td><td>1536</td></tr>
<tr><td>Dashscope Aliyun</td><td>texto-incrustado-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-es-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-es-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Principales conclusiones de nuestros resultados de pruebas comparativas<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos probado los principales modelos de incrustación en distintos tamaños de lote, longitudes de token y condiciones de red, midiendo la latencia media en todos los escenarios. Los resultados revelan información clave que podría cambiar la forma de elegir y optimizar las API de incrustación. Echemos un vistazo.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Los efectos globales de la red son más importantes de lo que se cree</h3><p>El entorno de red es quizás el factor más crítico que afecta al rendimiento de las API de incrustación. El mismo proveedor de servicios de API de incrustación puede tener un rendimiento muy diferente en los distintos entornos de red.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cuando su aplicación está desplegada en Asia y accede a servicios como OpenAI, Cohere o VoyageAI desplegados en Norteamérica, la latencia de la red aumenta significativamente. Nuestras pruebas en el mundo real muestran que la latencia de las llamadas a la API aumenta universalmente <strong>entre 3 y 4 veces</strong>.</p>
<p>Por el contrario, cuando tu aplicación se despliega en Norteamérica y accede a servicios asiáticos como AliCloud Dashscope o SiliconFlow, la degradación del rendimiento es aún más grave. SiliconFlow, en particular, mostró aumentos de latencia de <strong>casi 100 veces</strong> en escenarios interregionales.</p>
<p>Esto significa que siempre debes seleccionar proveedores de incrustación basados en la ubicación de tu despliegue y la geografía del usuario: las afirmaciones de rendimiento sin contexto de red no tienen sentido.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. Las clasificaciones de rendimiento del modelo revelan resultados sorprendentes</h3><p>Nuestras exhaustivas pruebas de latencia revelaron claras jerarquías de rendimiento:</p>
<ul>
<li><p><strong>Modelos basados en Norteamérica (latencia media)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Modelos basados en Asia (latencia media)</strong>: SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>Estas clasificaciones desafían la sabiduría convencional sobre la selección de proveedores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nota: Debido al significativo impacto del entorno de red y las regiones geográficas del servidor en la latencia de la API de incrustación en tiempo real, comparamos las latencias de los modelos basados en Norteamérica y Asia por separado.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. El impacto del tamaño del modelo varía drásticamente según el proveedor</h3><p>Observamos una tendencia general en la que los modelos más grandes tienen una latencia mayor que los modelos estándar, que a su vez tienen una latencia mayor que los modelos más pequeños/ligeros. Sin embargo, este patrón no es universal y revela datos importantes sobre la arquitectura del backend. Por ejemplo:</p>
<ul>
<li><p><strong>Cohere y OpenAI</strong> mostraron diferencias mínimas de rendimiento entre los tamaños de los modelos.</p></li>
<li><p><strong>VoyageAI</strong> mostró claras diferencias de rendimiento en función del tamaño del modelo.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esto indica que el tiempo de respuesta de la API depende de múltiples factores más allá de la arquitectura del modelo, incluidas las estrategias de procesamiento por lotes del backend, la optimización de la gestión de solicitudes y la infraestructura específica del proveedor. La lección es clara: <em>no confíe en el tamaño del modelo o en la fecha de lanzamiento como indicadores fiables de rendimiento; realice siempre pruebas en su propio entorno de despliegue.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. La longitud del token y el tamaño del lote crean compensaciones complejas</h3><p>Dependiendo de la implementación de su backend, especialmente de su estrategia de procesamiento por lotes. La longitud de los tokens puede tener poco impacto en la latencia hasta que el tamaño de los lotes aumente. Nuestras pruebas revelaron algunos patrones claros:</p>
<ul>
<li><p><strong>La latencia de OpenAI</strong> se mantuvo bastante constante entre lotes pequeños y grandes, lo que sugiere una generosa capacidad de procesamiento por lotes del backend.</p></li>
<li><p><strong>VoyageAI</strong> mostró claros efectos en la longitud de los tokens, lo que implica una optimización mínima de los lotes del backend.</p></li>
</ul>
<p>Los lotes de mayor tamaño aumentan la latencia absoluta, pero mejoran el rendimiento general. En nuestras pruebas, pasar de batch=1 a batch=10 aumentó la latencia entre 2× y 5×, al tiempo que incrementó sustancialmente el rendimiento total. Esto representa una oportunidad de optimización crítica para los flujos de trabajo de procesamiento masivo, en los que se puede cambiar la latencia de las solicitudes individuales por una mejora drástica del rendimiento general del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Al pasar de batch=1 a 10, la latencia aumentó 2×-5×.</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. La fiabilidad de la API introduce riesgos de producción</h3><p>Observamos una variabilidad significativa en la latencia, especialmente con OpenAI y VoyageAI, lo que introduce imprevisibilidad en los sistemas de producción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variación de la latencia con batch=1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variación de la latencia cuando batch=10</p>
<p>Aunque nuestras pruebas se centraron principalmente en la latencia, depender de cualquier API externa introduce riesgos de fallo inherentes, como fluctuaciones de la red, limitación de tarifas por parte del proveedor y cortes del servicio. Sin acuerdos de nivel de servicio claros por parte de los proveedores, los desarrolladores deben implementar estrategias sólidas de gestión de errores, incluyendo reintentos, tiempos de espera y disyuntores para mantener la fiabilidad del sistema en entornos de producción.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. La inferencia local puede ser sorprendentemente competitiva</h3><p>Nuestras pruebas también revelaron que el despliegue local de modelos de incrustación de tamaño medio puede ofrecer un rendimiento comparable al de las API en la nube, un hallazgo crucial para las aplicaciones sensibles al presupuesto o a la latencia.</p>
<p>Por ejemplo, el despliegue del código abierto <code translate="no">bge-base-en-v1.5</code> a través de TEI (Text Embeddings Inference) en una modesta CPU de 4c8g igualó el rendimiento de latencia de SiliconFlow, proporcionando una alternativa asequible de inferencia local. Este hallazgo es especialmente importante para los desarrolladores individuales y los equipos pequeños que carecen de recursos de GPU de nivel empresarial pero necesitan funciones de incrustación de alto rendimiento.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latencia de TEI</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. La sobrecarga de Milvus es insignificante</h3><p>Dado que hemos utilizado Milvus para probar la latencia de la API de incrustación, hemos validado que la sobrecarga adicional introducida por la función TextEmbedding de Milvus es mínima y prácticamente insignificante. Nuestras mediciones muestran que las operaciones de Milvus añaden sólo 20-40 ms en total, mientras que las llamadas a la API de incrustación tardan entre cientos de milisegundos y varios segundos, lo que significa que Milvus añade menos de un 5% de sobrecarga al tiempo total de la operación. El cuello de botella del rendimiento reside principalmente en la transmisión por red y en las capacidades de procesamiento de los proveedores de servicios de API de incrustación, no en la capa de servidor de Milvus.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Consejos: Cómo optimizar el rendimiento de la incrustación RAG<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Basándonos en nuestros benchmarks, recomendamos las siguientes estrategias para optimizar el rendimiento de incrustación de su sistema RAG:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. 1. Localice siempre sus pruebas</h3><p>No confíe en ningún informe genérico de pruebas comparativas (¡incluido éste!). Siempre debe probar los modelos dentro de su entorno de implantación real en lugar de confiar únicamente en los puntos de referencia publicados. Las condiciones de la red, la proximidad geográfica y las diferencias de infraestructura pueden afectar drásticamente al rendimiento en el mundo real.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Establezca una correspondencia geográfica estratégica entre sus proveedores</h3><ul>
<li><p><strong>Para despliegues en Norteamérica</strong>: Considere Cohere, VoyageAI, OpenAI/Azure o GCP Vertex AI, y realice siempre su propia validación de rendimiento.</p></li>
<li><p><strong>Para implantaciones en Asia</strong>: Considere seriamente los proveedores de modelos asiáticos como AliCloud Dashscope o SiliconFlow, que ofrecen un mejor rendimiento regional</p></li>
<li><p><strong>Para públicos globales</strong>: Implemente enrutamiento multirregión o seleccione proveedores con infraestructura distribuida globalmente para minimizar las penalizaciones de latencia entre regiones</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Cuestionar las opciones de proveedores predeterminados</h3><p>Los modelos de incrustación de OpenAI son tan populares que muchas empresas y desarrolladores los eligen como opciones predeterminadas. Sin embargo, nuestras pruebas revelaron que la latencia y la estabilidad de OpenAI eran, en el mejor de los casos, medias, a pesar de su popularidad en el mercado. Desafíe las suposiciones sobre los "mejores" proveedores con sus propios puntos de referencia rigurosos: la popularidad no siempre se correlaciona con un rendimiento óptimo para su caso de uso específico.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Optimice las configuraciones de lotes y trozos</h3><p>Una configuración no sirve para todos los modelos o casos de uso. El tamaño óptimo de los lotes y la longitud de los trozos varían significativamente de un proveedor a otro debido a las diferentes arquitecturas de backend y estrategias de procesamiento por lotes. Experimente sistemáticamente con diferentes configuraciones para encontrar su punto óptimo de rendimiento, teniendo en cuenta las compensaciones entre rendimiento y latencia para los requisitos específicos de su aplicación.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Implementar el almacenamiento estratégico en caché</h3><p>Para las consultas de alta frecuencia, almacene en caché tanto el texto de la consulta como sus incrustaciones generadas (utilizando soluciones como Redis). Las consultas posteriores idénticas pueden acceder directamente a la caché, reduciendo la latencia a milisegundos. Esta es una de las técnicas de optimización de la latencia de las consultas más rentables e impactantes.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Considerar el despliegue de la inferencia local</h3><p>Si los requisitos de latencia de la ingesta de datos, latencia de las consultas y privacidad de los datos son extremadamente altos, o si los costes de las llamadas a la API son prohibitivos, considere la posibilidad de desplegar modelos de incrustación localmente para la inferencia. Los planes de API estándar a menudo vienen con limitaciones de QPS, latencia inestable y falta de garantías de SLA, restricciones que pueden ser problemáticas para los entornos de producción.</p>
<p>Para muchos desarrolladores individuales o equipos pequeños, la falta de GPU de nivel empresarial es una barrera para la implantación local de modelos de incrustación de alto rendimiento. Sin embargo, esto no significa abandonar por completo la inferencia local. Con motores de inferencia de alto rendimiento como <a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face's text-embeddings-inference</a>, incluso la ejecución de modelos de incrustación de tamaño pequeño o mediano en una CPU puede lograr un rendimiento decente que puede superar las llamadas a la API de alta latencia, especialmente para la generación de incrustación offline a gran escala.</p>
<p>Este enfoque requiere una cuidadosa consideración de las compensaciones entre coste, rendimiento y complejidad de mantenimiento.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Cómo Milvus simplifica su flujo de trabajo de incrustación<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Como ya se ha mencionado, Milvus no es sólo una base de datos vectorial de alto rendimiento, sino que también ofrece una cómoda interfaz de funciones de incrustación que se integra a la perfección con los modelos de incrustación más populares de varios proveedores, como OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI y otros más de todo el mundo, en su canal de búsqueda vectorial.</p>
<p>Milvus va más allá del almacenamiento y la recuperación de vectores con funciones que agilizan la integración de la incrustación:</p>
<ul>
<li><p><strong>Gestión eficiente de vectores</strong>: Como base de datos de alto rendimiento creada para colecciones masivas de vectores, Milvus ofrece un almacenamiento fiable, opciones de indexación flexibles (HNSW, IVF, RaBitQ, DiskANN, etc.) y capacidades de recuperación rápidas y precisas.</p></li>
<li><p><strong>Cambio de proveedor optimizado</strong>: Milvus ofrece una interfaz de función <code translate="no">TextEmbedding</code>, que le permite configurar la función con sus claves de API, cambiar de proveedor o modelo al instante y medir el rendimiento en el mundo real sin necesidad de una compleja integración SDK.</p></li>
<li><p><strong>Canalización de datos de extremo a extremo</strong>: Llame a <code translate="no">insert()</code> con texto sin procesar, y Milvus incrustará y almacenará automáticamente los vectores en una sola operación, simplificando drásticamente su código de canalización de datos.</p></li>
<li><p><strong>De texto a resultados en una sola llamada</strong>: Llame a <code translate="no">search()</code> con consultas de texto y Milvus se encargará de incrustar, buscar y devolver los resultados, todo en una sola llamada a la API.</p></li>
<li><p><strong>Integración independiente del proveedor</strong>: Milvus se abstrae de los detalles de implementación del proveedor; sólo tiene que configurar su función y clave API una vez, y estará listo para empezar.</p></li>
<li><p><strong>Compatibilidad con el ecosistema de código abierto</strong>: Ya sea que genere incrustaciones a través de nuestra función integrada <code translate="no">TextEmbedding</code>, inferencia local u otro método, Milvus proporciona capacidades unificadas de almacenamiento y recuperación.</p></li>
</ul>
<p>Esto crea una experiencia racionalizada de "entrada de datos, salida de información" en la que Milvus gestiona internamente la generación de vectores, haciendo que el código de su aplicación sea más sencillo y fácil de mantener.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Conclusión: La verdad sobre el rendimiento que necesita su sistema RAG<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>El asesino silencioso del rendimiento de RAG no está donde la mayoría de los desarrolladores buscan. Mientras que los equipos invierten recursos en la ingeniería rápida y la optimización LLM, la latencia de la API sabotea silenciosamente la experiencia del usuario con retrasos que pueden ser 100 veces peores de lo esperado. Nuestras exhaustivas pruebas comparativas exponen la cruda realidad: popular no significa eficaz, la geografía importa más que la elección del algoritmo en muchos casos y la inferencia local a veces supera a las costosas API en la nube.</p>
<p>Estos resultados ponen de manifiesto un punto ciego crucial en la optimización de la GAR. Las penalizaciones por latencia entre regiones, las clasificaciones inesperadas del rendimiento de los proveedores y la sorprendente competitividad de la inferencia local no son casos extremos, sino realidades de producción que afectan a aplicaciones reales. Comprender y medir el rendimiento de la API de incrustación es esencial para ofrecer experiencias de usuario receptivas.</p>
<p>La elección del proveedor de incrustación es una pieza fundamental del rompecabezas del rendimiento RAG. Al realizar pruebas en su entorno de despliegue real, seleccionar los proveedores geográficamente adecuados y considerar alternativas como la inferencia local, puede eliminar una fuente importante de retrasos de cara al usuario y crear aplicaciones de IA realmente receptivas.</p>
<p>Para más detalles sobre cómo realizamos esta evaluación comparativa, consulte <a href="https://github.com/zhuwenxing/text-embedding-bench">este cuaderno</a>.</p>
