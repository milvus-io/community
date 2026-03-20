---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Cómo reducir los costes de las bases de datos vectoriales hasta en un 80%: Una
  guía práctica de optimización de Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus es gratuito, pero la infraestructura no lo es. Aprenda a reducir los
  costes de memoria de las bases de datos vectoriales entre un 60 y un 80% con
  mejores índices, MMap y almacenamiento por niveles.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Su prototipo RAG funcionaba muy bien. Luego pasó a producción, el tráfico creció y ahora la factura de su base de datos vectorial ha pasado de 500 a 5.000 dólares al mes. ¿Le resulta familiar?</p>
<p>Este es uno de los problemas de escalado más comunes en las aplicaciones de IA en este momento. Has construido algo que crea valor real, pero los costes de infraestructura crecen más rápido de lo que crece tu base de usuarios. Y cuando miras la factura, la base de datos vectorial es a menudo la mayor sorpresa - en los despliegues que hemos visto, puede suponer aproximadamente el 40-50% del coste total de la aplicación, sólo superado por las llamadas a la API LLM.</p>
<p>En esta guía, repasaré a dónde va realmente el dinero y las cosas específicas que puede hacer para reducirlo, en muchos casos entre un 60 y un 80%. Utilizaré <a href="https://milvus.io/">Milvus</a>, la base de datos vectorial de código abierto más popular, como ejemplo principal ya que es la que mejor conozco, pero los principios se aplican a la mayoría de las bases de datos vectoriales.</p>
<p><em>Para que quede claro:</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>en sí es gratuito y de código abierto - nunca se paga por el software. El coste proviene enteramente de la infraestructura en la que se ejecuta: instancias en la nube, memoria, almacenamiento y red. La buena noticia es que la mayor parte de ese coste de infraestructura es reducible.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">¿Dónde va realmente el dinero cuando se utiliza un VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Empecemos con un ejemplo concreto. Digamos que tienes 100 millones de vectores, 768 dimensiones, almacenados como float32 - una configuración RAG bastante típica. Esto es aproximadamente lo que cuesta en AWS al mes:</p>
<table>
<thead>
<tr><th><strong>Componente de coste</strong></th><th><strong>Compartir</strong></th><th><strong>~Coste mensual</strong></th><th><strong>Notas</strong></th></tr>
</thead>
<tbody>
<tr><td>Informática (CPU + memoria)</td><td>85-90%</td><td>$2,800</td><td>El más importante, principalmente impulsado por la memoria</td></tr>
<tr><td>Red</td><td>5-10%</td><td>$250</td><td>Tráfico entre zonas geográficas, grandes cargas de resultados</td></tr>
<tr><td>Almacenamiento</td><td>2-5%</td><td>$100</td><td>Barato: el almacenamiento de objetos (S3/MinIO) cuesta ~0,03 $/GB.</td></tr>
</tbody>
</table>
<p>La conclusión es sencilla: la memoria es el destino del 85-90% de su dinero. La red y el almacenamiento importan en los márgenes, pero si quiere reducir costes de forma significativa, la memoria es la palanca. Todo en esta guía se centra en ello.</p>
<p><strong>Nota rápida sobre la red y el almacenamiento:</strong> Puede reducir los costes de red devolviendo sólo los campos que necesita (ID, puntuación, metadatos clave) y evitando las consultas entre regiones. Para el almacenamiento, Milvus ya separa el almacenamiento de la computación - sus vectores se sientan en el almacenamiento de objetos baratos como S3, por lo que incluso en 100M vectores, el almacenamiento es por lo general menos de $ 50 / mes. Ninguna de estas opciones moverá la aguja como lo hará la optimización de la memoria.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Por qué la memoria es tan cara para la búsqueda vectorial<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vienes de bases de datos tradicionales, los requisitos de memoria para la búsqueda vectorial pueden ser sorprendentes. Una base de datos relacional puede aprovechar los índices B-tree basados en disco y la caché de páginas del sistema operativo. La búsqueda vectorial es diferente: implica un cálculo masivo en coma flotante y los índices como HNSW o IVF deben permanecer cargados en memoria para ofrecer una latencia de milisegundos.</p>
<p>He aquí una fórmula rápida para calcular las necesidades de memoria:</p>
<p><strong>Memoria necesaria = (vectores × dimensiones × 4 bytes) × multiplicador de índice</strong></p>
<p>Para nuestro ejemplo de 100M × 768 × float32 con HNSW (multiplicador ~1,8x):</p>
<ul>
<li>Datos en bruto: 100M × 768 × 4 bytes ≈ 307 GB</li>
<li>Con índice HNSW 307 GB × 1,8 ≈ 553 GB</li>
<li>Con sobrecarga del SO, caché y espacio libre: ~768 GB en total</li>
<li>En AWS 3× r6i.8xlarge (256 GB cada uno) ≈ 2.800 $/mes</li>
</ul>
<p><strong>Esa es la línea de base. Ahora veamos cómo bajarlo.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Elija el índice correcto para obtener un uso de memoria 4 veces menor<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Este es el cambio de mayor impacto que puede hacer. Para el mismo conjunto de datos de 100M de vectores, el uso de memoria puede variar entre 4 y 6 veces dependiendo de su elección de índice.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: casi sin compresión, por lo que el uso de memoria se mantiene cerca del tamaño de los datos en bruto, alrededor de <strong>300 GB</strong>.</li>
<li><strong>HNSW</strong>: almacena una estructura gráfica adicional, por lo que el consumo de memoria suele ser <strong>de 1,5 a 2,0 veces</strong> el tamaño de los datos brutos, es decir, <strong>de 450 a 600 GB</strong>.</li>
<li><strong>IVF_SQ8</strong>: comprime los valores float32 en uint8, lo que supone una <strong>compresión de 4 veces</strong>, por lo que el uso de memoria puede reducirse a <strong>entre 75 y 100 GB.</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>: utiliza una compresión mayor o un índice basado en disco, por lo que la memoria puede reducirse aún más, hasta unos <strong>30 a 60 GB</strong>.</li>
</ul>
<p>Muchos equipos empiezan con HNSW porque tiene la mejor velocidad de consulta, pero acaban pagando entre 3 y 5 veces más de lo necesario.</p>
<p>Así es como se comparan los principales tipos de índices:</p>
<table>
<thead>
<tr><th><strong>Índice</strong></th><th><strong>Multiplicador de memoria</strong></th><th><strong>Velocidad de consulta</strong></th><th><strong>Recuperación</strong></th><th><strong>Mejor para</strong></th></tr>
</thead>
<tbody>
<tr><td>PLANA</td><td>~1.0x</td><td>Lento</td><td>100%</td><td>Conjuntos de datos pequeños (&lt;1M), pruebas</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Media</td><td>95-99%</td><td>Uso general</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Media</td><td>93-97%</td><td>Producción sensible a los costes (recomendada)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Rápido</td><td>70-80%</td><td>Conjuntos de datos muy grandes, recuperación gruesa</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Muy rápido</td><td>98-99%</td><td>Sólo cuando la latencia es más importante que el coste</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Medio</td><td>95-98%</td><td>A muy gran escala con SSD NVMe</td></tr>
</tbody>
</table>
<p><strong>Conclusión:</strong> El cambio de HNSW o IVF_FLAT a IVF_SQ8 suele reducir la recuperación en solo un 2-3 % (por ejemplo, del 97 % al 94-95 %), al tiempo que reduce el coste de memoria en aproximadamente un 70 %. Para la mayoría de las cargas de trabajo RAG, esta compensación merece la pena. Si está realizando una recuperación gruesa o su listón de precisión es más bajo, IVF_PQ o IVF_RABITQ pueden aumentar aún más el ahorro.</p>
<p><strong>Mi recomendación:</strong> Si va a utilizar HNSW en producción y le preocupa el coste, pruebe primero IVF_SQ8 en una colección de prueba. Mida la recuperación en sus consultas reales. La mayoría de los equipos se sorprenden de lo pequeña que es la caída de precisión.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Deje de cargar todo en memoria para reducir los costes en un 60-80<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Incluso después de elegir un índice más eficiente, es posible que siga teniendo más datos en memoria de los necesarios. Milvus ofrece dos maneras de solucionar esto: <strong>MMap (disponible desde 2.3) y almacenamiento por niveles (disponible desde 2.6). Ambos pueden reducir el uso de memoria en un 60-80%.</strong></p>
<p>La idea central detrás de ambos es la misma: no todos sus datos necesitan vivir en la memoria en todo momento. La diferencia radica en cómo gestionan los datos que no están en memoria.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (archivos mapeados en memoria)</h3><p>MMap mapea tus archivos de datos desde el disco local al espacio de direcciones del proceso. El conjunto completo de datos permanece en el disco local del nodo, y el sistema operativo carga las páginas en memoria sólo cuando se accede a ellas. Antes de utilizar MMap, todos los datos se descargan del almacenamiento de objetos (S3/MinIO) al disco local del QueryNode.</p>
<ul>
<li>El uso de memoria se reduce a ~10-30% del modo de carga completa.</li>
<li>La latencia se mantiene estable y predecible (los datos están en el disco local, no en la red).</li>
<li>Contrapartida: el disco local debe ser lo suficientemente grande como para contener el conjunto de datos completo.</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Almacenamiento por niveles</h3><p>El almacenamiento por niveles va un paso más allá. En lugar de descargar todo al disco local, utiliza el disco local como caché para los datos calientes y mantiene el almacenamiento de objetos como capa primaria. Los datos se obtienen del almacenamiento de objetos sólo cuando es necesario.</p>
<ul>
<li>El uso de memoria cae a &lt;10% del modo de carga completa.</li>
<li>El uso del disco local también disminuye: sólo se almacenan en caché los datos calientes (normalmente entre el 10 y el 30% del total).</li>
<li>Contrapartida: los errores de caché añaden una latencia de 50-200 ms (obtención del almacenamiento de objetos).</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Flujo de datos y uso de recursos</h3><table>
<thead>
<tr><th><strong>Modo</strong></th><th><strong>Flujo de datos</strong></th><th><strong>Uso de memoria</strong></th><th><strong>Uso del disco local</strong></th><th><strong>Latencia</strong></th></tr>
</thead>
<tbody>
<tr><td>Carga completa tradicional</td><td>Almacenamiento de objetos → memoria (100%)</td><td>Muy alta (100%)</td><td>Baja (sólo temporal)</td><td>Muy baja y estable</td></tr>
<tr><td>MMap</td><td>Almacenamiento de objetos → disco local (100%) → memoria (bajo demanda)</td><td>Bajo (10-30%)</td><td>Alto (100%)</td><td>Bajo y estable</td></tr>
<tr><td>Almacenamiento por niveles</td><td>Almacenamiento de objetos ↔ caché local (datos calientes) → memoria (bajo demanda)</td><td>Muy bajo (&lt;10%)</td><td>Bajo (sólo datos calientes)</td><td>Bajo en aciertos de caché, mayor en fallos de caché</td></tr>
</tbody>
</table>
<p><strong>Recomendación de hardware:</strong> ambos métodos dependen en gran medida de la E/S de disco local, por lo que se recomiendan encarecidamente <strong>SSD NVMe</strong>, idealmente con <strong>IOPS superiores a 10.000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap frente a almacenamiento por niveles: ¿Cuál debería utilizar?</h3><table>
<thead>
<tr><th><strong>Su situación</strong></th><th><strong>Utilícelo</strong></th><th><strong>Por qué</strong></th></tr>
</thead>
<tbody>
<tr><td>Sensible a la latencia (P99 &lt; 20 ms)</td><td>MMap</td><td>Los datos ya están en el disco local - no hay que buscarlos en la red, latencia estable</td></tr>
<tr><td>Acceso uniforme (no hay una clara división caliente/fría)</td><td>MMap</td><td>El almacenamiento por niveles necesita una desviación caliente/fría para ser eficaz; sin ella, la tasa de aciertos de la caché es baja.</td></tr>
<tr><td>La prioridad es el coste (se aceptan picos de latencia ocasionales)</td><td>Almacenamiento por niveles</td><td>Ahorra memoria y disco local (70-90% menos de disco)</td></tr>
<tr><td>Patrón claro de calor/frío (regla 80/20)</td><td>Almacenamiento por niveles</td><td>Los datos calientes permanecen en caché, los datos fríos permanecen baratos en el almacenamiento de objetos</td></tr>
<tr><td>A gran escala (&gt;500 millones de vectores)</td><td>Almacenamiento por niveles</td><td>El disco local de un nodo a menudo no puede contener el conjunto de datos completo a esta escala.</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> MMap requiere Milvus 2.3+. El almacenamiento por niveles requiere Milvus 2.6+. Ambos funcionan mejor con SSD NVMe (se recomiendan más de 10.000 IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Cómo configurar MMap</h3><p><strong>Opción 1: Configuración YAML (recomendada para nuevos despliegues)</strong></p>
<p>Edite el archivo de configuración de Milvus milvus.yaml y añada los siguientes ajustes en la sección queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Opción 2: Configuración Python SDK (para colecciones existentes)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Cómo configurar el almacenamiento por niveles (Milvus 2.6+)</h3><p>Edite el archivo de configuración de Milvus milvus.yaml y añada los siguientes parámetros en la sección queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Usar incrustaciones de baja dimensión<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Esto es fácil de pasar por alto, pero la dimensión escala directamente su coste. La memoria, el almacenamiento y el cálculo crecen linealmente con el número de dimensiones. Un modelo de 1536 dimensiones cuesta aproximadamente 4 veces más infraestructura que un modelo de 384 dimensiones para los mismos datos.</p>
<p>El coste de las consultas aumenta de la misma manera: la similitud del coseno es O(D), por lo que los vectores de 768 dimensiones requieren aproximadamente el doble de cálculo por consulta que los vectores de 384 dimensiones. En cargas de trabajo de alto QPS, esta diferencia se traduce directamente en un menor número de nodos necesarios.</p>
<p>Así es como se comparan los modelos de incrustación habituales (utilizando 384-dim como referencia 1,0x):</p>
<table>
<thead>
<tr><th><strong>Modelo</strong></th><th><strong>Dimensiones</strong></th><th><strong>Coste relativo</strong></th><th><strong>Recuperación</strong></th><th><strong>Mejor para</strong></th></tr>
</thead>
<tbody>
<tr><td>text-embedding-3-large</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Cuando la precisión no es negociable (investigación, sanidad)</td></tr>
<tr><td>text-embedding-3-small</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Cargas de trabajo RAG generales</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Buen equilibrio coste-rendimiento</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Cargas de trabajo sensibles a los costes</td></tr>
</tbody>
</table>
<p><strong>Consejo práctico:</strong> No dé por sentado que necesita el modelo más grande. Realice pruebas con una muestra representativa de sus consultas reales (1 millón de vectores suele ser suficiente) y encuentre el modelo de menor dimensión que se ajuste a su nivel de precisión. Muchos equipos descubren que 768 dimensiones funcionan igual de bien que 1536 para su caso de uso.</p>
<p><strong>¿Ya se ha comprometido con un modelo de grandes dimensiones?</strong> Puede reducir las dimensiones a posteriori. El análisis de componentes principales (PCA) puede eliminar las características redundantes, y <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">las incrustaciones Matryoshka</a> permiten truncar las primeras N dimensiones conservando la mayor parte de la calidad. Merece la pena probar ambos métodos antes de volver a incrustar todo el conjunto de datos.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Gestionar el ciclo de vida de los datos con compactación y TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Esto es menos glamuroso pero sigue siendo importante, especialmente para los sistemas de producción de larga duración. Milvus utiliza un modelo de almacenamiento de sólo apéndice: cuando usted borra datos, se marcan como borrados pero no se eliminan inmediatamente. Con el tiempo, estos datos muertos se acumulan, desperdician espacio de almacenamiento y hacen que las consultas exploren más filas de las necesarias.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Compactación: Recupere almacenamiento de los datos eliminados</h3><p>La compactación es el proceso de limpieza en segundo plano de Milvus. Fusiona pequeños segmentos, elimina físicamente los datos eliminados y reescribe los archivos compactados. Usted querrá esto si</p>
<ul>
<li>Tiene escrituras y eliminaciones frecuentes (catálogos de productos, actualizaciones de contenido, registros en tiempo real).</li>
<li>El número de segmentos sigue creciendo (esto aumenta la sobrecarga por consulta).</li>
<li>El uso del almacenamiento crece mucho más rápido que los datos válidos reales.</li>
</ul>
<p><strong>Atención:</strong> La compactación es intensiva en E/S. Prográmela durante periodos de poco tráfico (por ejemplo, por la noche) o ajuste los disparadores cuidadosamente para que no compita con las consultas de producción.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (Tiempo de vida): Expire automáticamente los datos vectoriales antiguos</h3><p>Para los datos que caducan de forma natural, TTL es más limpio que la eliminación manual. Establezca un tiempo de vida para sus datos y Milvus los marcará automáticamente para su eliminación cuando caduquen. La compactación maneja la limpieza real.</p>
<p>Esto es útil para:</p>
<ul>
<li>Registros y datos de sesión: conserve sólo los últimos 7 ó 30 días.</li>
<li>RAG sensibles al tiempo - prefiera el conocimiento reciente, deje que los documentos antiguos caduquen</li>
<li>Recomendaciones en tiempo real - recuperar sólo del comportamiento reciente del usuario</li>
</ul>
<p>Juntos, la compactación y el TTL evitan que su sistema acumule residuos de forma silenciosa. No es la mayor palanca de costes, pero evita el tipo de acumulación lenta que pilla desprevenidos a los equipos.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Una opción más: Zilliz Cloud (Milvus totalmente gestionado)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Desvelación total: <a href="https://zilliz.com/">Zilliz Cloud</a> está construido por el mismo equipo que está detrás de Milvus, así que tómese esto con el grano de sal apropiado.</p>
<p>Dicho esto, aquí está la parte contraintuitiva: a pesar de que Milvus es gratuito y de código abierto, un servicio gestionado en realidad puede costar menos que el autoalojamiento. La razón es simple: el software es gratuito, pero la infraestructura en la nube para ejecutarlo no lo es, y se necesitan ingenieros para operarlo y mantenerlo. Si un servicio gestionado puede hacer el mismo trabajo con menos máquinas y menos horas de ingeniería, su factura total se reduce incluso después de pagar por el servicio en sí.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> es un servicio totalmente gestionado basado en Milvus y compatible con su API. Dos cosas son relevantes para el coste:</p>
<ul>
<li><strong>Mejor rendimiento por nodo.</strong> Zilliz Cloud se ejecuta sobre Cardinal, nuestro motor de búsqueda optimizado. Según <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">los resultados de VectorDBBench</a>, ofrece un rendimiento entre 3 y 5 veces mayor que Milvus de código abierto y es 10 veces más rápido. En la práctica, esto significa que necesitará entre un tercio y una quinta parte de nodos de cálculo para la misma carga de trabajo.</li>
<li><strong>Optimizaciones integradas.</strong> Las funciones tratadas en esta guía (MMap, almacenamiento por niveles y cuantificación de índices) están integradas y se ajustan automáticamente. El escalado automático ajusta la capacidad en función de la carga real, para que no tenga que pagar por un margen que no necesita.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">La migración</a> es sencilla, ya que las API y los formatos de datos son compatibles. Zilliz también proporciona herramientas de migración para ayudar. Para una comparación detallada, consulte: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Resumen: Un plan paso a paso para reducir los costes de las bases de datos vectoriales<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Si sólo hace una cosa, haga esto: compruebe su tipo de índice.</strong></p>
<p>Si está ejecutando HNSW en una carga de trabajo sensible a los costes, cambie a IVF_SQ8. Esto por sí solo puede reducir el coste de memoria en un 70% con una pérdida de memoria mínima.</p>
<p>Si quieres ir más allá, este es el orden de prioridad:</p>
<ul>
<li><strong>Cambie su índice</strong> - HNSW → IVF_SQ8 para la mayoría de las cargas de trabajo. El mayor beneficio sin cambio arquitectónico.</li>
<li><strong>Habilitar MMap o almacenamiento por niveles</strong> - Deje de mantener todo en la memoria. Se trata de un cambio de configuración, no de un rediseño.</li>
<li><strong>Evalúe sus dimensiones de incrustación</strong> - Pruebe si un modelo más pequeño satisface sus necesidades de precisión. Esto requiere volver a incrustar, pero el ahorro es considerable.</li>
<li><strong>Configure la compactación y el TTL</strong>: evite la sobrecarga silenciosa de datos, especialmente si realiza escrituras/borrados frecuentes.</li>
</ul>
<p>Combinadas, estas estrategias pueden reducir la factura de su base de datos vectorial en un 60-80%. No todos los equipos necesitan las cuatro: empiece por el cambio de índice, mida el impacto y siga con la lista.</p>
<p>Para los equipos que buscan reducir el trabajo operativo y mejorar la rentabilidad, <a href="https://zilliz.com/">Zilliz Cloud</a> (Milvus gestionado) es otra opción.</p>
<p>Si está trabajando en alguna de estas optimizaciones y desea comparar notas, el <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack de la comunidad Milvus</a> es un buen lugar para hacer preguntas. También puede unirse a <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para una charla rápida con el equipo de ingeniería sobre su configuración específica.</p>
