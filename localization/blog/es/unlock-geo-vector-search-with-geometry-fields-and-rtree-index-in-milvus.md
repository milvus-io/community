---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  Lo espacial se une a lo semántico: Desbloquear la búsqueda geovectorial con
  campos geométricos e índice RTREE en Milvus
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Milvus Geometry Field and RTREE Index for Geo-Vector Search
desc: >-
  Descubra cómo Milvus 2.6 unifica la búsqueda vectorial con la indexación
  geoespacial mediante campos geométricos y el índice RTREE, lo que permite una
  recuperación precisa y consciente de la ubicación de la IA.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>A medida que los sistemas modernos se vuelven más inteligentes, los datos de geolocalización se han convertido en esenciales para aplicaciones como las recomendaciones basadas en IA, los envíos inteligentes y la conducción autónoma.</p>
<p>Por ejemplo, cuando pides comida en plataformas como DoorDash o Uber Eats, el sistema tiene en cuenta mucho más que la distancia entre tú y el restaurante. También tiene en cuenta las valoraciones de los restaurantes, la ubicación de los mensajeros, las condiciones del tráfico e incluso sus preferencias personales. En la conducción autónoma, los vehículos deben planificar rutas, detectar obstáculos y comprender la semántica del escenario, a menudo en cuestión de milisegundos.</p>
<p>Todo ello depende de la capacidad de indexar y recuperar datos geoespaciales de forma eficiente.</p>
<p>Tradicionalmente, los datos geográficos y los vectoriales vivían en dos sistemas separados:</p>
<ul>
<li><p>Los sistemas geoespaciales almacenan coordenadas y relaciones espaciales (latitud, longitud, regiones poligonales, etc.).</p></li>
<li><p>Las bases de datos vectoriales gestionan las incrustaciones semánticas y la búsqueda de similitudes generadas por modelos de IA.</p></li>
</ul>
<p>Esta separación complica la arquitectura, ralentiza las consultas y dificulta que las aplicaciones realicen razonamientos espaciales y semánticos al mismo tiempo.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> aborda este problema introduciendo el <a href="https://milvus.io/docs/geometry-field.md">Campo Geométrico</a>, que permite combinar directamente la búsqueda de similitud vectorial con restricciones espaciales. Esto permite casos de uso como:</p>
<ul>
<li><p>Location-Base Service (LBS): "encontrar puntos de interés similares en esta manzana".</p></li>
<li><p>Búsqueda multimodal: "recuperar fotos similares en un radio de 1 km de este punto"</p></li>
<li><p>Mapas y logística: "activos dentro de una región" o "rutas que se cruzan en un camino"</p></li>
</ul>
<p>Junto con el nuevo <a href="https://milvus.io/docs/rtree.md">índice RTREE -una</a>estructura arborescente optimizada para el filtrado espacial-, Milvus admite ahora operadores geoespaciales eficientes como <code translate="no">st_contains</code>, <code translate="no">st_within</code> y <code translate="no">st_dwithin</code>, además de la búsqueda vectorial de altas dimensiones. Juntos, hacen que la recuperación inteligente espacialmente consciente no sólo sea posible, sino práctica.</p>
<p>En este artículo explicaremos cómo funcionan el campo geométrico y el índice RTREE, y cómo se combinan con la búsqueda vectorial por similitud para permitir aplicaciones espacio-semánticas en el mundo real.</p>
<h2 id="What-Is-a-Geometry-Field" class="common-anchor-header">¿Qué es un campo geométrico?<button data-href="#What-Is-a-Geometry-Field" class="anchor-icon" translate="no">
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
    </button></h2><p>Un <strong>campo</strong> de <strong>geometría</strong> es un tipo de datos definido por esquema (<code translate="no">DataType.GEOMETRY</code>) en Milvus que se utiliza para almacenar datos geométricos. A diferencia de los sistemas que sólo manejan coordenadas en bruto, Milvus admite una serie de estructuras espaciales, como <strong>Point</strong>, <strong>LineString</strong> y <strong>Polygon</strong>.</p>
<p>Esto permite representar conceptos del mundo real como la ubicación de un restaurante (Point), zonas de reparto (Polygon) o trayectorias de vehículos autónomos (LineString), todo ello en la misma base de datos que almacena vectores semánticos. En otras palabras, Milvus se convierte en un sistema unificado tanto para saber <em>dónde</em> está algo como <em>qué significa</em>.</p>
<p>Los valores geométricos se almacenan utilizando el formato <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>, un estándar legible por humanos para insertar y consultar datos geométricos. Esto simplifica la introducción y consulta de datos porque las cadenas WKT pueden insertarse directamente en un registro Milvus. Por ejemplo</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">¿Qué es el índice RTREE y cómo funciona?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que Milvus introduce el tipo de datos Geometría, también necesita una manera eficiente de filtrar objetos espaciales. Milvus maneja esto utilizando una tubería de filtrado espacial de dos etapas:</p>
<ul>
<li><p><strong>Filtrado grueso:</strong> Reduce rápidamente los candidatos utilizando índices espaciales como RTREE.</p></li>
<li><p><strong>Filtrado fino:</strong> Aplica comprobaciones geométricas exactas a los candidatos que quedan, garantizando la corrección en los límites.</p></li>
</ul>
<p>El núcleo de este proceso es <strong>RTREE (Rectangle Tree)</strong>, una estructura de indexación espacial diseñada para datos geométricos multidimensionales. RTREE acelera las consultas espaciales organizando jerárquicamente los objetos geométricos.</p>
<p><strong>Fase 1: Construcción del índice</strong></p>
<p><strong>1. Crear nodos hoja:</strong> Para cada objeto geométrico, calcule su rectángulo <strong>de contorno mínimo (MBR)</strong>-el rectángulo más pequeño que contiene completamente el objeto- y guárdelo como nodo hoja.</p>
<p><strong>2. 2. Agrupar en rectángulos más grandes:</strong> Agrupe los nodos hoja cercanos y envuelva cada grupo dentro de un nuevo MBR, produciendo nodos internos.</p>
<p><strong>3. Añada el nodo raíz:</strong> Crear un nodo raíz cuya RBM abarque todos los grupos internos, formando una estructura de árbol de altura equilibrada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fase 2: Acelerar las consultas</strong></p>
<p><strong>1. Forma el MBR</strong> de la consulta<strong>:</strong> Calcula el MBR de la geometría utilizada en tu consulta.</p>
<p><strong>2. 2. Pode las ramas:</strong> Empezando por la raíz, compare el MBR de la consulta con cada nodo interno. Omita cualquier rama cuyo MBR no se cruce con el MBR de la consulta.</p>
<p><strong>3. 3. Recopilar candidatos:</strong> Descienda a las ramas que se intersecan y reúna los nodos hoja candidatos.</p>
<p><strong>4.</strong> Para cada candidato,<strong>ejecute</strong> el predicado espacial para obtener resultados precisos.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Por qué RTREE es rápido</h3><p>RTREE ofrece un gran rendimiento en el filtrado espacial debido a varias características clave de diseño:</p>
<ul>
<li><p>Cada<strong>nodo almacena un MBR:</strong> Cada nodo aproxima el área de todas las geometrías de su subárbol. Esto facilita la decisión de explorar una rama durante una consulta.</p></li>
<li><p><strong>Poda rápida:</strong> Sólo se exploran los subárboles cuyo MBR se cruza con la región de consulta. Las zonas irrelevantes se ignoran por completo.</p></li>
<li><p><strong>Escala con el tamaño de los datos:</strong> RTREE admite búsquedas espaciales en tiempo <strong>O(log N)</strong>, lo que permite realizar consultas rápidas incluso cuando el conjunto de datos se amplía.</p></li>
<li><p><strong>Implementación de Boost.Geometry:</strong> Milvus construye su índice RTREE utilizando <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, una biblioteca de C++ ampliamente utilizada que proporciona algoritmos de geometría optimizados y una implementación de RTREE a prueba de hilos adecuada para cargas de trabajo concurrentes.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Operadores de geometría compatibles</h3><p>Milvus proporciona un conjunto de operadores espaciales que le permiten filtrar y recuperar entidades basándose en relaciones geométricas. Estos operadores son esenciales para las cargas de trabajo que necesitan comprender cómo se relacionan los objetos entre sí en el espacio.</p>
<p>La siguiente tabla enumera los <a href="https://milvus.io/docs/geometry-operators.md">operadores ge</a> ométricos disponibles actualmente en Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operador</strong></th><th style="text-align:center"><strong>Descripción</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si las geometrías A y B comparten al menos un punto común.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si la geometría A contiene completamente a la geometría B (excluyendo el límite).</td></tr>
<tr><td style="text-align:center"><strong>st_dentro(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si la geometría A está completamente contenida dentro de la geometría B. Es la inversa de st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si la geometría A cubre la geometría B (incluido el límite).</td></tr>
<tr><td style="text-align:center"><strong>st_toca(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si las geometrías A y B se tocan en sus límites pero no se cruzan internamente.</td></tr>
<tr><td style="text-align:center"><strong>st_igual(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si las geometrías A y B son espacialmente idénticas.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">Devuelve TRUE si las geometrías A y B se solapan parcialmente y ninguna contiene totalmente a la otra.</td></tr>
<tr><td style="text-align:center"><strong>st_dentro(A, B, d)</strong></td><td style="text-align:center">Devuelve TRUE si la distancia entre A y B es inferior a <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Cómo combinar el índice de geolocalización y el índice vectorial</h3><p>Con el soporte de Geolocalización y el índice RTREE, Milvus puede combinar el filtrado geoespacial con la búsqueda de similitud vectorial en un único flujo de trabajo. El proceso funciona en dos pasos</p>
<p><strong>1. Filtrar por ubicación utilizando RTREE:</strong> Milvus utiliza primero el índice RTREE para restringir la búsqueda a entidades dentro del rango geográfico especificado (por ejemplo, "dentro de 2 km").</p>
<p><strong>2. 2. Clasificación por semántica mediante búsqueda vectorial:</strong> De los candidatos restantes, el índice vectorial selecciona los N resultados más similares en función de la similitud de incrustación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Applications-of-Geo-Vector-Retrieval" class="common-anchor-header">Aplicaciones reales de la recuperación geovectorial<button data-href="#Real-World-Applications-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Servicios de entrega: Recomendaciones más inteligentes basadas en la ubicación</h3><p>Plataformas como DoorDash o Uber Eats gestionan cientos de millones de solicitudes al día. En el momento en que un usuario abre la aplicación, el sistema debe determinar -en función de la ubicación del usuario, la hora del día, las preferencias de sabor, los tiempos de entrega estimados, el tráfico en tiempo real y la disponibilidad del mensajero- qué restaurantes o mensajeros son los más adecuados <em>en ese momento</em>.</p>
<p>Tradicionalmente, esto requiere consultar una base de datos geoespacial y un motor de recomendación independiente, seguido de múltiples rondas de filtrado y reclasificación. Con el Índice de Geolocalización, Milvus simplifica enormemente este flujo de trabajo:</p>
<ul>
<li><p><strong>Almacenamiento unificado</strong>: las coordenadas de los restaurantes, las ubicaciones de los servicios de mensajería y las preferencias de los usuarios se almacenan en un único sistema.</p></li>
<li><p><strong>Recuperación conjunta</strong>: primero se aplica un filtro espacial (por ejemplo, <em>restaurantes en un radio de 3 km</em>) y, a continuación, se utiliza la búsqueda vectorial para clasificar por similitud, preferencia de sabor o calidad.</p></li>
<li><p><strong>Toma de decisiones dinámica</strong> - Combine la distribución de mensajería en tiempo real y las señales de tráfico para asignar rápidamente el mensajero más cercano y adecuado.</p></li>
</ul>
<p>Este enfoque unificado permite a la plataforma realizar razonamientos espaciales y semánticos en una sola consulta. Por ejemplo, cuando un usuario busca "arroz al curry", Milvus recupera los restaurantes que son semánticamente relevantes <em>y</em> da prioridad a los que están cerca, entregan rápidamente y coinciden con el perfil histórico de gustos del usuario.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Conducción autónoma: Decisiones más inteligentes</h3><p>En la conducción autónoma, la indexación geoespacial es fundamental para la percepción, la localización y la toma de decisiones. Los vehículos deben alinearse continuamente con mapas de alta definición, detectar obstáculos y planificar trayectorias seguras, todo ello en cuestión de milisegundos.</p>
<p>Con Milvus, el tipo Geometry y el índice RTREE pueden almacenar y consultar estructuras espaciales ricas como:</p>
<ul>
<li><p><strong>Límites de carreteras</strong> (LineString)</p></li>
<li><p><strong>Zonas de regulación del tráfico</strong> (Polígono)</p></li>
<li><p><strong>Obstáculos detectados</strong> (Point)</p></li>
</ul>
<p>Estas estructuras pueden indexarse de forma eficiente, permitiendo que los datos geoespaciales participen directamente en el bucle de decisión de la IA. Por ejemplo, un vehículo autónomo puede determinar rápidamente si sus coordenadas actuales se encuentran dentro de un carril específico o se cruzan con una zona restringida, simplemente a través de un predicado espacial RTREE.</p>
<p>Cuando se combina con incrustaciones vectoriales generadas por el sistema de percepción, como las incrustaciones de escenas que capturan el entorno de conducción actual, Milvus puede admitir consultas más avanzadas, como la recuperación de escenarios de conducción históricos similares al actual en un radio de 50 metros. Esto ayuda a los modelos a interpretar el entorno más rápidamente y a tomar mejores decisiones.</p>
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
    </button></h2><p>La geolocalización es más que latitud y longitud: es una valiosa fuente de información semántica que nos dice dónde suceden las cosas, cómo se relacionan con su entorno y a qué contexto pertenecen.</p>
<p>En la base de datos de nueva generación de Zilliz, los datos vectoriales y la información geoespacial se unen gradualmente como una base unificada. Esto permite:</p>
<ul>
<li><p>La recuperación conjunta de vectores, datos geoespaciales y tiempo.</p></li>
<li><p>Sistemas de recomendación con conciencia espacial</p></li>
<li><p>Búsqueda multimodal basada en la localización (LBS).</p></li>
</ul>
<p>En el futuro, la IA no sólo comprenderá <em>el</em> significado de los contenidos, sino también dónde se aplican y cuándo son más importantes.</p>
<p>Para más información sobre el Campo Geométrico y el índice RTREE, consulte la documentación que figura a continuación:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Campo de geometría | Documentación de Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Documentación Milvus</a></p></li>
</ul>
<p>¿Tiene preguntas o desea una inmersión profunda en cualquier característica de la última Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presente cuestiones en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: El arma secreta para combatir los duplicados en los datos de formación LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Búsqueda vectorial en el mundo real: cómo filtrar eficazmente sin matar la recuperación</a></p></li>
</ul>
