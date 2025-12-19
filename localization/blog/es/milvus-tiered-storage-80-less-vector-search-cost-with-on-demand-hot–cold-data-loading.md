---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Deje de pagar por datos fríos: Reducción de costes del 80% con la carga de
  datos en caliente y en frío bajo demanda en el almacenamiento por niveles de
  Milvus
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Descubra cómo el almacenamiento por niveles en Milvus permite la carga bajo
  demanda de datos calientes y fríos, ofreciendo una reducción de costes de
  hasta el 80% y tiempos de carga más rápidos a escala.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>¿Cuántos de ustedes siguen pagando facturas de infraestructura premium por datos que su sistema apenas toca? Seamos sinceros: la mayoría de los equipos lo hacen.</strong></p>
<p>Si ejecuta búsquedas vectoriales en producción, probablemente lo haya comprobado de primera mano. Usted aprovisiona grandes cantidades de memoria y SSD para que todo esté "listo para la consulta", aunque sólo una pequeña parte de su conjunto de datos esté realmente activa. Y no es el único. También hemos visto muchos casos similares:</p>
<ul>
<li><p><strong>Plataformas SaaS multiusuario:</strong> Cientos de inquilinos incorporados, pero sólo el 10-15% activo en un día determinado. El resto permanece inactivo, pero sigue ocupando recursos.</p></li>
<li><p><strong>Sistemas de recomendación de comercio electrónico:</strong> Un millón de SKU, pero el 8% de los productos genera la mayoría de las recomendaciones y el tráfico de búsqueda.</p></li>
<li><p><strong>Búsqueda de inteligencia artificial:</strong> Vastos archivos de incrustaciones, aunque el 90% de las consultas de los usuarios se refieren a artículos de la semana pasada.</p></li>
</ul>
<p>Es la misma historia en todos los sectores: <strong>menos del 10% de los datos se consultan con frecuencia, pero a menudo consumen el 80% del almacenamiento y la memoria.</strong> Todo el mundo sabe que existe un desequilibrio, pero hasta hace poco no había una arquitectura limpia para solucionarlo.</p>
<p><strong>Eso cambia con</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Antes de esta versión, Milvus (como la mayoría de las bases de datos vectoriales) dependía de <strong>un modelo de carga completa</strong>: si los datos tenían que ser buscables, tenían que cargarse en nodos locales. No importaba si esos datos se consultaban mil veces por minuto o una vez por trimestre: <strong>todos tenían que permanecer calientes.</strong> Esa elección de diseño garantizaba un rendimiento predecible, pero también significaba sobredimensionar los clústeres y pagar por recursos que los datos fríos simplemente no merecían.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">El almacenamiento por niveles</a> <strong>es nuestra respuesta.</strong></p>
<p>Milvus 2.6 introduce una nueva arquitectura de almacenamiento por niveles con <strong>verdadera carga bajo demanda</strong>, que permite al sistema diferenciar automáticamente entre datos calientes y fríos:</p>
<ul>
<li><p>Los segmentos calientes permanecen en caché cerca del ordenador.</p></li>
<li><p>Los segmentos fríos viven a bajo coste en el almacenamiento remoto de objetos</p></li>
<li><p>Los datos se transfieren a los nodos locales <strong>sólo cuando una consulta los necesita realmente</strong>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esto cambia la estructura de costes de "cuántos datos tiene" a <strong>"cuántos datos utiliza realmente".</strong> Y en las primeras implantaciones de producción, este sencillo cambio supone <strong>una reducción de hasta el 80% en los costes de almacenamiento y memoria</strong>.</p>
<p>En el resto de este artículo, explicaremos cómo funciona el almacenamiento por niveles, compartiremos resultados reales de rendimiento y mostraremos dónde este cambio tiene el mayor impacto.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Por qué la carga completa falla a escala<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en la solución, merece la pena echar un vistazo más de cerca a por qué el <strong>modo de carga completa</strong> utilizado en Milvus 2.5 y versiones anteriores se convirtió en un factor limitante a medida que se ampliaban las cargas de trabajo.</p>
<p>En Milvus 2.5 y versiones anteriores, cuando un usuario emitía una solicitud <code translate="no">Collection.load()</code>, cada QueryNode almacenaba en caché localmente toda la colección, incluidos los metadatos, los datos de campo y los índices. Estos componentes se descargan del almacenamiento de objetos y se almacenan completamente en memoria o se mapean en memoria (mmap) en el disco local. Sólo después de que <em>todos</em> estos datos estén disponibles localmente se marca la colección como cargada y lista para servir consultas.</p>
<p>En otras palabras, la colección no es consultable hasta que el conjunto de datos completo -en caliente o en frío- está presente en el nodo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Nota:</strong> Para los tipos de índice que incluyen datos vectoriales sin procesar, Milvus sólo carga los archivos de índice, no el campo vectorial por separado. Aún así, el índice debe estar completamente cargado para servir consultas, independientemente de la cantidad de datos a los que se acceda realmente.</p>
<p>Para ver por qué esto resulta problemático, considere un ejemplo concreto:</p>
<p>Supongamos que tenemos un conjunto de datos vectoriales de tamaño medio con</p>
<ul>
<li><p><strong>100 millones de vectores</strong></p></li>
<li><p><strong>768 dimensiones</strong> (incrustaciones BERT)</p></li>
<li><p>precisión<strong>float32</strong> (4 bytes por dimensión)</p></li>
<li><p>Un <strong>índice HNSW</strong></p></li>
</ul>
<p>En esta configuración, sólo el índice HNSW -incluidos los vectores incrustados sin procesar- consume aproximadamente 430 GB de memoria. Si se añaden los campos escalares habituales, como los identificadores de usuario, las marcas de tiempo o las etiquetas de categoría, el uso total de recursos locales supera fácilmente los 500 GB.</p>
<p>Esto significa que incluso si el 80% de los datos no se consulta nunca o casi nunca, el sistema debe aprovisionar y mantener más de 500 GB de memoria local o disco sólo para mantener la colección en línea.</p>
<p>Para algunas cargas de trabajo, este comportamiento es aceptable:</p>
<ul>
<li><p>Si se accede con frecuencia a casi todos los datos, la carga completa de todos ellos ofrece la menor latencia de consulta posible, pero con el mayor coste.</p></li>
<li><p>Si los datos pueden dividirse en subconjuntos calientes y calientes, la asignación de memoria de los datos calientes al disco puede reducir parcialmente la presión de la memoria.</p></li>
</ul>
<p>Sin embargo, en las cargas de trabajo en las que el 80% o más de los datos se encuentran en la cola larga, los inconvenientes de la carga completa aparecen rápidamente, tanto en <strong>rendimiento</strong> como en <strong>coste</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Cuellos de botella en el rendimiento</h3><p>En la práctica, la carga completa no sólo afecta al rendimiento de las consultas, sino que a menudo ralentiza los flujos de trabajo operativos rutinarios:</p>
<ul>
<li><p><strong>Actualizaciones continuas más largas:</strong> En clústeres grandes, las actualizaciones continuas pueden llevar horas o incluso un día entero, ya que cada nodo debe recargar todo el conjunto de datos antes de volver a estar disponible.</p></li>
<li><p><strong>Recuperación más lenta tras los fallos:</strong> Cuando un QueryNode se reinicia, no puede servir tráfico hasta que se hayan recargado todos los datos, lo que prolonga significativamente el tiempo de recuperación y amplifica el impacto de los fallos de los nodos.</p></li>
<li><p><strong>Iteración y experimentación más lentas:</strong> La carga completa ralentiza los flujos de trabajo de desarrollo, obligando a los equipos de IA a esperar horas a que se carguen los datos cuando prueban nuevos conjuntos de datos o configuraciones de índices.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Ineficacia de costes</h3><p>La carga completa también aumenta los costes de infraestructura. Por ejemplo, en las principales instancias optimizadas para memoria en la nube, almacenar 1 TB de datos localmente cuesta aproximadamente<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">.</mo><mn>000 al</mn><mi>año</mi></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">∗∗,</span><span class="mord mathnormal">basándose en precios conservadores</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">AWSr6i</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">:</annotation></semantics></math></span></span><mtext> </mtext><annotation encoding="application/x-tex"></annotation><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70.000 al año**, basándose en precios</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">conservadores</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">(AWS</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">r6i</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000 al</span><span class="mord mathnormal" style="margin-right:0.02778em;">año</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mpunct"> ∗,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">basándose</span><span class="mord mathnormal">en precios conservadores</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.000</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">al año</span></span></span></span>).74 / GB / mes; GCP n4-highmem: ~5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn><mi>68/GB/mes</mi></mrow><annotation encoding="application/x-tex">;AzureE-series:</annotation></semantics></math></span></span><mtext> </mtext><annotation encoding="application/x-tex"></annotation><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">5,68 / GB / mes; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5,<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">68/GB/mes</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">series</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5,67 / GB / mes).</span></span></span></p>
<p>Consideremos ahora un patrón de acceso más realista, en el que el 80% de esos datos están fríos y podrían almacenarse en almacenamiento de objetos (a aproximadamente 0,023 $/Gb/mes):</p>
<ul>
<li><p>200 GB de datos calientes × 5,68</p></li>
<li><p>800 GB de datos fríos × 0,023</p></li>
</ul>
<p>Coste anual: (200×5,68+800×0,023)×12≈14<strong>.000</strong>$.</p>
<p>Esto supone una <strong>reducción del 80%</strong> del coste total de almacenamiento, sin sacrificar el rendimiento allí donde realmente importa.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">¿Qué es el almacenamiento por niveles y cómo funciona?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Para eliminar la compensación, Milvus 2.6 introdujo el <strong>almacenamiento por niveles</strong>, que equilibra el rendimiento y el coste tratando el almacenamiento local como una caché en lugar de como un contenedor para todo el conjunto de datos.</p>
<p>En este modelo, los QueryNodes sólo cargan metadatos ligeros al inicio. Los datos de campo y los índices se obtienen bajo demanda del almacenamiento de objetos remoto cuando una consulta los requiere, y se almacenan en caché local si se accede a ellos con frecuencia. Los datos inactivos pueden desalojarse para liberar espacio.</p>
<p>Como resultado, los datos calientes permanecen cerca de la capa de cálculo para consultas de baja latencia, mientras que los datos fríos permanecen en el almacenamiento de objetos hasta que se necesitan. Esto reduce el tiempo de carga, mejora la eficiencia de los recursos y permite a los QueryNodes consultar conjuntos de datos mucho mayores que su memoria local o capacidad de disco.</p>
<p>En la práctica, el almacenamiento por niveles funciona de la siguiente manera:</p>
<ul>
<li><p><strong>Mantener localmente los datos calientes:</strong> Aproximadamente el 20% de los datos a los que se accede con frecuencia permanecen en los nodos locales, lo que garantiza una baja latencia para el 80% de las consultas más importantes.</p></li>
<li><p><strong>Cargar los datos fríos bajo demanda:</strong> El 80% restante de los datos a los que se accede con poca frecuencia se obtiene sólo cuando es necesario, liberando la mayor parte de los recursos locales de memoria y disco.</p></li>
<li><p><strong>Adaptación dinámica con desalojo basado en LRU:</strong> Milvus utiliza una estrategia de desalojo LRU (Least Recently Used) para ajustar continuamente qué datos se consideran calientes o fríos. Los datos inactivos se desalojan automáticamente para dejar espacio a los nuevos.</p></li>
</ul>
<p>Con este diseño, Milvus ya no está limitado por la capacidad fija de la memoria y el disco locales. En su lugar, los recursos locales funcionan como una caché gestionada dinámicamente, donde el espacio se recupera continuamente de los datos inactivos y se reasigna a las cargas de trabajo activas.</p>
<p>Bajo el capó, este comportamiento es posible gracias a tres mecanismos técnicos básicos:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Carga perezosa</h3><p>En el momento de la inicialización, Milvus sólo carga los metadatos mínimos a nivel de segmento, lo que permite que las colecciones puedan consultarse casi inmediatamente después de la puesta en marcha. Los datos de campo y los archivos de índice permanecen en el almacenamiento remoto y se obtienen bajo demanda durante la ejecución de la consulta, manteniendo bajo el uso de la memoria local y del disco.</p>
<p><strong>Cómo funcionaba la carga de colecciones en Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cómo funciona la carga diferida en Milvus 2.6 y posteriores</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los metadatos cargados durante la inicialización se dividen en cuatro categorías clave:</p>
<ul>
<li><p><strong>Estadísticas de segmento</strong> (información básica como recuento de filas, tamaño de segmento y metadatos de esquema)</p></li>
<li><p><strong>Marcas de tiempo</strong> (se utilizan para realizar consultas sobre viajes en el tiempo)</p></li>
<li><p><strong>Registros de inserción y eliminación</strong> (necesarios para mantener la coherencia de los datos durante la ejecución de la consulta)</p></li>
<li><p><strong>Filtros Bloom</strong> (Utilizados para un prefiltrado rápido que elimine rápidamente los segmentos irrelevantes)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Carga parcial</h3><p>Mientras que la carga lenta controla <em>cuándo</em> se cargan los datos, la carga parcial controla <em>cuántos</em> datos se cargan. Una vez que comienzan las consultas o búsquedas, el QueryNode realiza una carga parcial, obteniendo sólo los trozos de datos o archivos de índice necesarios del almacenamiento de objetos.</p>
<p><strong>Índices vectoriales: Carga en función del inquilino</strong></p>
<p>Una de las capacidades más impactantes introducidas en Milvus 2.6+ es la carga de índices vectoriales con tenant-aware, diseñada específicamente para cargas de trabajo multi-tenant.</p>
<p>Cuando una consulta accede a los datos de un único arrendatario, Milvus carga sólo la parte del índice vectorial que pertenece a ese arrendatario, omitiendo los datos del índice para todos los demás arrendatarios. De este modo, los recursos locales se concentran en los usuarios activos.</p>
<p>Este diseño ofrece varias ventajas:</p>
<ul>
<li><p>Los índices vectoriales de los arrendatarios inactivos no consumen memoria local ni disco.</p></li>
<li><p>Los datos de índice de los inquilinos activos permanecen en caché para un acceso de baja latencia.</p></li>
<li><p>Una política de desalojo LRU a nivel de inquilino garantiza un uso equitativo de la caché entre los inquilinos.</p></li>
</ul>
<p><strong>Campos escalares: Carga parcial a nivel de columna</strong></p>
<p>La carga parcial también se aplica a los <strong>campos escalares</strong>, permitiendo a Milvus cargar sólo las columnas explícitamente referenciadas por una consulta.</p>
<p>Considere una colección con <strong>50 campos de esquema</strong>, como <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, y <code translate="no">tags</code>, y sólo necesita devolver tres campos-<code translate="no">id</code>, <code translate="no">title</code>, y <code translate="no">price</code>.</p>
<ul>
<li><p>En <strong>Milvus 2.5</strong>, se cargan los 50 campos escalares independientemente de los requisitos de la consulta.</p></li>
<li><p>En <strong>Milvus 2.6+</strong>, sólo se cargan los tres campos solicitados. Los 47 campos restantes permanecen sin cargar y sólo se recuperan de forma perezosa si se accede a ellos más tarde.</p></li>
</ul>
<p>El ahorro de recursos puede ser considerable. Si cada campo escalar ocupa 20 GB:</p>
<ul>
<li><p>Para cargar todos los campos se necesitan <strong>1.000 GB</strong> (50 × 20 GB).</p></li>
<li><p>Para cargar sólo los tres campos necesarios se necesitan <strong>60 GB</strong></p></li>
</ul>
<p>Esto representa una <strong>reducción del 94%</strong> en la carga de datos escalares, sin afectar a la corrección de la consulta ni a los resultados.</p>
<p><strong>Nota:</strong> la carga parcial de campos escalares e índices vectoriales con detección de inquilinos se introducirá oficialmente en una próxima versión. Una vez disponible, reducirá aún más la latencia de carga y mejorará el rendimiento de las consultas en frío en grandes despliegues multiarrendatario.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. Evacuación de la caché basada en LRU</h3><p>La carga lenta y la carga parcial reducen significativamente la cantidad de datos que se introducen en la memoria local y en el disco. Sin embargo, en sistemas de larga duración, la caché seguirá creciendo a medida que se acceda a nuevos datos. Cuando se alcanza la capacidad local, se procede a la expulsión de la caché basada en LRU.</p>
<p>El desalojo LRU (Least Recently Used) sigue una regla simple: los datos a los que no se ha accedido recientemente se desalojan primero. De este modo, se libera espacio local para los datos a los que se ha accedido recientemente, al tiempo que se mantienen en la caché los datos utilizados con más frecuencia.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Evaluación del rendimiento: Almacenamiento por niveles frente a carga completa<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Para evaluar el impacto en el mundo real del <strong>almacenamiento por niveles</strong>, creamos un entorno de prueba que refleja fielmente las cargas de trabajo de producción. Comparamos Milvus con y sin almacenamiento por niveles en cinco dimensiones: tiempo de carga, uso de recursos, rendimiento de las consultas, capacidad efectiva y rentabilidad.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Configuración experimental</h3><p><strong>Conjunto de datos</strong></p>
<ul>
<li><p>100 millones de vectores con 768 dimensiones (BERT embeddings)</p></li>
<li><p>Tamaño del índice vectorial: aproximadamente 430 GB</p></li>
<li><p>10 campos escalares, incluidos ID, marca de tiempo y categoría</p></li>
</ul>
<p><strong>Configuración de hardware</strong></p>
<ul>
<li><p>1 QueryNode con 4 vCPU, 32 GB de memoria y 1 TB de SSD NVMe</p></li>
<li><p>Red de 10 Gbps</p></li>
<li><p>Clúster de almacenamiento de objetos MinIO como backend de almacenamiento remoto</p></li>
</ul>
<p><strong>Patrón de acceso</strong></p>
<p>Las consultas siguen una distribución de acceso frío-caliente realista:</p>
<ul>
<li><p>El 80% de las consultas se dirigen a datos de los 30 días más recientes (≈20% de los datos totales)</p></li>
<li><p>el 15% se dirige a datos de entre 30 y 90 días (≈30% de los datos totales)</p></li>
<li><p>El 5% se centra en datos de más de 90 días (≈50% de los datos totales).</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Resultados clave</h3><p><strong>1. Tiempo de carga 33 veces más rápido</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Etapa</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Almacenamiento por niveles)</strong></th><th style="text-align:center"><strong>Aceleración</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Descarga de datos</td><td style="text-align:center">22 minutos</td><td style="text-align:center">28 segundos</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Carga del índice</td><td style="text-align:center">3 minutos</td><td style="text-align:center">17 segundos</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Total</strong></td><td style="text-align:center"><strong>25 minutos</strong></td><td style="text-align:center"><strong>45 segundos</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>En Milvus 2.5, la carga de la colección tardaba <strong>25 minutos</strong>. Con Tiered Storage en Milvus 2.6+, la misma carga de trabajo se completa en sólo <strong>45 segundos</strong>, lo que representa una mejora radical en la eficiencia de la carga.</p>
<p><strong>2. Reducción del 80% en el uso de recursos locales</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Etapa</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Almacenamiento por niveles)</strong></th><th style="text-align:center"><strong>Reducción</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Después de la carga</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Después de 1 hora</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Después de 24 horas</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">Estado estable</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>En Milvus 2.5, el uso de recursos locales permanece constante en <strong>430 GB</strong>, independientemente de la carga de trabajo o del tiempo de ejecución. Por el contrario, Milvus 2.6+ comienza con sólo <strong>12 GB</strong> inmediatamente después de la carga.</p>
<p>A medida que se ejecutan las consultas, los datos a los que se accede con frecuencia se almacenan en caché local y el uso de recursos aumenta gradualmente. Al cabo de aproximadamente 24 horas, el sistema se estabiliza en <strong>85-95 GB</strong>, lo que refleja el conjunto de datos calientes en funcionamiento. A largo plazo, esto se traduce en una <strong> reducción de ~80%</strong> en el uso local de memoria y disco, sin sacrificar la disponibilidad de las consultas.</p>
<p><strong>3. Impacto casi nulo en el rendimiento de los datos en caliente</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tipo de consulta</strong></th><th style="text-align:center"><strong>Latencia Milvus 2.5 P99</strong></th><th style="text-align:center"><strong>Milvus 2.6+ Latencia P99</strong></th><th style="text-align:center"><strong>Cambiar</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Consultas de datos en caliente</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Consultas de datos en caliente</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Consultas de datos en frío (primer acceso)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Consultas de datos en frío (en caché)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Para los datos en caliente, que representan aproximadamente el 80% de todas las consultas, la latencia P99 aumenta sólo un 6,7%, lo que resulta en un impacto prácticamente imperceptible en producción.</p>
<p>Las consultas de datos fríos muestran una latencia mayor en el primer acceso debido a la carga bajo demanda desde el almacenamiento de objetos. Sin embargo, una vez almacenados en caché, su latencia aumenta sólo un 20%. Dada la baja frecuencia de acceso a los datos fríos, esta compensación suele ser aceptable para la mayoría de las cargas de trabajo del mundo real.</p>
<p><strong>4. Capacidad efectiva 4,3 veces mayor</strong></p>
<p>Con el mismo presupuesto de hardware -ocho servidores con 64 GB de memoria cada uno (512 GB en total)- Milvus 2.5 puede cargar como máximo 512 GB de datos, lo que equivale aproximadamente a 136 millones de vectores.</p>
<p>Con el almacenamiento por niveles activado en Milvus 2.6+, el mismo hardware puede soportar 2,2 TB de datos, o aproximadamente 590 millones de vectores. Esto representa un aumento de 4,3 veces en la capacidad efectiva, lo que permite servir conjuntos de datos significativamente mayores sin ampliar la memoria local.</p>
<p><strong>5. Reducción de costes del 80,1</strong></p>
<p>Utilizando como ejemplo un conjunto de datos vectoriales de 2 TB en un entorno de AWS, y suponiendo que el 20% de los datos están en caliente (400 GB), la comparación de costes es la siguiente:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Artículo</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Almacenamiento por niveles)</strong></th><th style="text-align:center"><strong>Ahorro</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Coste mensual</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Coste anual</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Tasa de ahorro</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Resumen de las pruebas</h3><p>En todas las pruebas, el almacenamiento por niveles ofrece mejoras constantes y cuantificables:</p>
<ul>
<li><p><strong>Tiempos de carga 33 veces más rápidos:</strong> El tiempo de carga de las colecciones se reduce de <strong>25 minutos a 45 segundos</strong>.</p></li>
<li><p><strong>80% menos de uso de recursos locales:</strong> En funcionamiento estacionario, el uso de memoria y disco local se reduce aproximadamente <strong>un 80%</strong>.</p></li>
<li><p><strong>Impacto casi nulo en el rendimiento de los datos en caliente:</strong> La latencia P99 de los datos calientes aumenta <strong>menos de un 10%</strong>, lo que mantiene el rendimiento de las consultas de baja latencia.</p></li>
<li><p><strong>Latencia controlada para los datos fríos:</strong> Los datos fríos incurren en una mayor latencia en el primer acceso, pero es aceptable dada su baja frecuencia de acceso.</p></li>
<li><p><strong>Capacidad efectiva 4,3 veces superior:</strong> El mismo hardware puede servir <strong>entre 4 y 5 veces más datos</strong> sin memoria adicional.</p></li>
<li><p><strong>Más de un 80% de reducción de costes:</strong> Los costes anuales de infraestructura se reducen en más <strong>de un 80%</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Cuándo utilizar el almacenamiento por niveles en Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Basándonos en los resultados de las pruebas comparativas y en casos de producción del mundo real, agrupamos los casos de uso del almacenamiento por niveles en tres categorías para ayudarle a decidir si es una buena opción para su carga de trabajo.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Casos de uso más adecuados</h3><p><strong>1. Plataformas de búsqueda vectorial multiusuario</strong></p>
<ul>
<li><p><strong>Características:</strong> Gran número de inquilinos con actividad muy desigual; la búsqueda vectorial es la carga de trabajo principal.</p></li>
<li><p><strong>Patrón de acceso:</strong> Menos del 20% de los inquilinos generan más del 80% de las consultas vectoriales.</p></li>
<li><p><strong>Beneficios esperados:</strong> Reducción de costes del 70-80%; aumento de la capacidad de 3-5×.</p></li>
</ul>
<p><strong>2. Sistemas de recomendación de comercio electrónico (cargas de trabajo de búsqueda vectorial)</strong></p>
<ul>
<li><p><strong>Características:</strong> Fuerte desviación de la popularidad entre los productos principales y la cola larga.</p></li>
<li><p><strong>Patrón de acceso:</strong> El 10% de los productos más populares representan el 80% del tráfico de búsqueda vectorial.</p></li>
<li><p><strong>Ventajas previstas:</strong> Sin necesidad de capacidad adicional durante los picos; reducción de costes del 60-70%.</p></li>
</ul>
<p><strong>3. Conjuntos de datos a gran escala con una clara separación entre caliente y frío (vector dominante)</strong></p>
<ul>
<li><p><strong>Características:</strong> Conjuntos de datos a escala TB o superior, con acceso muy sesgado hacia datos recientes.</p></li>
<li><p><strong>Patrón de acceso:</strong> Una distribución clásica 80/20: el 20% de los datos sirve al 80% de las consultas.</p></li>
<li><p><strong>Beneficios esperados:</strong> Reducción de costes del 75-85</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Casos de uso adecuados</h3><p><strong>1. Cargas de trabajo sensibles a los costes</strong></p>
<ul>
<li><p><strong>Características:</strong> Presupuestos ajustados con cierta tolerancia a compensaciones menores de rendimiento.</p></li>
<li><p><strong>Patrón de acceso:</strong> Las consultas vectoriales están relativamente concentradas.</p></li>
<li><p><strong>Beneficios esperados:</strong> Reducción de costes del 50-70%; los datos fríos pueden incurrir en una latencia de ~500 ms en el primer acceso, que debe evaluarse en función de los requisitos del SLA.</p></li>
</ul>
<p><strong>2. Retención de datos históricos y búsqueda en archivos</strong></p>
<ul>
<li><p><strong>Características:</strong> Grandes volúmenes de vectores históricos con una frecuencia de consulta muy baja.</p></li>
<li><p><strong>Patrón de acceso:</strong> Alrededor del 90% de las consultas se dirigen a datos recientes.</p></li>
<li><p><strong>Beneficios esperados:</strong> Conservar conjuntos de datos históricos completos; mantener los costes de infraestructura predecibles y controlados.</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Casos de uso inadecuados</h3><p><strong>1. Cargas de trabajo de datos uniformemente calientes</strong></p>
<ul>
<li><p><strong>Características:</strong> Se accede a todos los datos con una frecuencia similar, sin una clara distinción entre caliente y frío.</p></li>
<li><p><strong>Razones:</strong> Beneficio limitado de la caché; Complejidad añadida del sistema sin ganancias significativas.</p></li>
</ul>
<p><strong>2. Cargas de trabajo de latencia ultrabaja</strong></p>
<ul>
<li><p><strong>Características:</strong> Sistemas extremadamente sensibles a la latencia, como el comercio financiero o las pujas en tiempo real.</p></li>
<li><p><strong>Razones:</strong> Incluso las pequeñas variaciones de latencia son inaceptables; la carga completa proporciona un rendimiento más predecible</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Inicio rápido: Pruebe el almacenamiento por niveles en Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>El almacenamiento por niveles en Milvus 2.6 aborda un desajuste común entre cómo se almacenan los datos vectoriales y cómo se accede realmente a ellos. En la mayoría de los sistemas de producción, sólo una pequeña fracción de los datos se consulta con frecuencia, pero los modelos de carga tradicionales tratan todos los datos como si estuvieran calientes por igual. Al cambiar a la carga bajo demanda y gestionar la memoria local y el disco como una caché, Milvus alinea el consumo de recursos con el comportamiento real de las consultas en lugar de con las suposiciones del peor de los casos.</p>
<p>Este enfoque permite a los sistemas escalar a conjuntos de datos más grandes sin aumentos proporcionales de los recursos locales, manteniendo prácticamente inalterado el rendimiento de las consultas en caliente. Los datos fríos siguen siendo accesibles cuando se necesitan, con una latencia predecible y limitada, lo que hace que la compensación sea explícita y controlable. A medida que la búsqueda vectorial se adentra en entornos de producción sensibles a los costes, multi-tenant y de larga duración, Tiered Storage proporciona una base práctica para operar eficientemente a escala.</p>
<p>Para obtener más información sobre el almacenamiento por niveles, consulte la documentación siguiente:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Documentación de Milvus</a></li>
</ul>
<p>¿Tiene preguntas o desea profundizar en alguna característica del último Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente cuestiones en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Más información sobre las características de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Unificación del filtrado geoespacial y la búsqueda vectorial con campos geométricos y RTREE en Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introducción de AISAQ en Milvus: la búsqueda vectorial a escala de miles de millones se ha vuelto 3.200 veces más barata en memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimización de NVIDIA CAGRA en Milvus: un enfoque híbrido GPU-CPU para una indexación más rápida y consultas más baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: el arma secreta para combatir los duplicados en los datos de entrenamiento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus</a></p></li>
</ul>
