---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: 'JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad'
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/json_shredding_cover_new_a678c3731f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Descubra cómo Milvus JSON Shredding utiliza el almacenamiento columnar
  optimizado para acelerar las consultas JSON hasta un 89× preservando al mismo
  tiempo la flexibilidad total del esquema.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Los sistemas modernos de IA producen más datos JSON semiestructurados que nunca. La información sobre clientes y productos se compacta en un objeto JSON, los microservicios emiten registros JSON en cada solicitud, los dispositivos IoT transmiten lecturas de sensores en cargas útiles JSON ligeras y las aplicaciones de IA actuales estandarizan cada vez más JSON para obtener resultados estructurados. El resultado es una avalancha de datos de tipo JSON que fluyen hacia las bases de datos vectoriales.</p>
<p>Tradicionalmente, hay dos formas de manejar los documentos JSON:</p>
<ul>
<li><p><strong>Predefinir cada campo de JSON en un esquema fijo y construir un índice:</strong> Este enfoque ofrece un sólido rendimiento de consulta, pero es rígido. Una vez que cambia el formato de los datos, cada campo nuevo o modificado desencadena otra ronda de dolorosas actualizaciones del lenguaje de definición de datos (DDL) y migraciones de esquemas.</p></li>
<li><p><strong>Almacenar todo el objeto JSON como una sola columna (tanto el tipo JSON como el esquema dinámico en Milvus utilizan este enfoque):</strong> Esta opción ofrece una flexibilidad excelente, pero a costa del rendimiento de la consulta. Cada solicitud requiere un análisis JSON en tiempo de ejecución y, a menudo, una exploración completa de la tabla, lo que provoca una latencia que aumenta a medida que crece el conjunto de datos.</p></li>
</ul>
<p>Solía ser un dilema entre flexibilidad y rendimiento.</p>
<p>Ya no lo es con la nueva función JSON Shredding de <a href="https://milvus.io/">Milvus</a>.</p>
<p>Con la introducción de <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, Milvus consigue ahora una agilidad sin esquemas con el rendimiento del almacenamiento en columnas, haciendo por fin que los datos semiestructurados a gran escala sean flexibles y fáciles de consultar.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Cómo funciona JSON Shredding<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON shredding acelera las consultas JSON transformando los documentos JSON basados en filas en almacenamiento columnar altamente optimizado. Milvus conserva la flexibilidad de JSON para el modelado de datos al tiempo que optimiza automáticamente el almacenamiento en columnas, lo que mejora significativamente el acceso a los datos y el rendimiento de las consultas.</p>
<p>Para gestionar eficazmente los campos JSON dispersos o poco frecuentes, Milvus también dispone de un índice invertido para claves compartidas. Todo esto ocurre de forma transparente para los usuarios: puede insertar documentos JSON como de costumbre y dejar que Milvus gestione internamente la estrategia óptima de almacenamiento e indexación.</p>
<p>Cuando Milvus recibe registros JSON en bruto con formas y estructuras variadas, analiza cada clave JSON en función de su ratio de ocurrencia y estabilidad de tipo (si su tipo de datos es consistente en todos los documentos). Basándose en este análisis, cada clave se clasifica en una de estas tres categorías:</p>
<ul>
<li><p><strong>Claves tipificadas:</strong> Claves que aparecen en la mayoría de los documentos y siempre tienen el mismo tipo de datos (por ejemplo, todos los enteros o todas las cadenas).</p></li>
<li><p><strong>Claves dinámicas</strong>: Claves que aparecen con frecuencia pero tienen tipos de datos mixtos (por ejemplo, a veces una cadena, a veces un entero).</p></li>
<li><p><strong>Claves compartidas:</strong> Claves poco frecuentes, dispersas o anidadas, por debajo de un umbral de frecuencia configurable.</p></li>
</ul>
<p>Milvus gestiona cada categoría de forma diferente para maximizar la eficiencia:</p>
<ul>
<li><p>Las<strong>claves mecanografiadas</strong> se almacenan en columnas dedicadas, fuertemente mecanografiadas.</p></li>
<li><p>Las<strong>claves dinámicas</strong> se colocan en columnas dinámicas en función del tipo de valor real observado en tiempo de ejecución.</p></li>
<li><p>Tanto las columnas tipificadas como las dinámicas se almacenan en formatos de columnas Arrow/Parquet para una exploración rápida y una ejecución de consultas altamente optimizada.</p></li>
<li><p>Las claves<strong>compartidas</strong> se consolidan en una columna binaria-JSON compacta, acompañada de un índice invertido de claves compartidas. Este índice acelera las consultas en campos de baja frecuencia al eliminar las filas irrelevantes y restringir la búsqueda a los documentos que contienen la clave consultada.</p></li>
</ul>
<p>Esta combinación de almacenamiento adaptativo en columnas e indexación invertida constituye el núcleo del mecanismo de trituración JSON de Milvus, que permite tanto flexibilidad como alto rendimiento a escala.</p>
<p>A continuación se ilustra el flujo de trabajo general:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora que hemos cubierto los conceptos básicos de cómo funciona la trituración JSON, echemos un vistazo más de cerca a las capacidades clave que hacen que este enfoque sea flexible y de alto rendimiento.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Trituración y Columnarización</h3><p>Cuando se escribe un nuevo documento JSON, Milvus lo descompone y reorganiza en un almacenamiento columnar optimizado:</p>
<ul>
<li><p>Las claves tipográficas y dinámicas se identifican automáticamente y se almacenan en columnas específicas.</p></li>
<li><p>Si el JSON contiene objetos anidados, Milvus genera automáticamente nombres de columnas basados en rutas. Por ejemplo, un campo <code translate="no">name</code> dentro de un objeto <code translate="no">user</code> puede almacenarse con el nombre de columna <code translate="no">/user/name</code>.</p></li>
<li><p>Las claves compartidas se almacenan juntas en una única columna JSON binaria compacta. Dado que estas claves aparecen con poca frecuencia, Milvus construye un índice invertido para ellas, lo que permite un filtrado rápido y permite al sistema localizar rápidamente las filas que contienen la clave especificada.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Gestión inteligente de columnas</h3><p>Además de triturar JSON en columnas, Milvus añade una capa adicional de inteligencia a través de la gestión dinámica de columnas, garantizando que JSON Shredding se mantiene flexible a medida que evolucionan los datos.</p>
<ul>
<li><p><strong>Columnas creadas según sea necesario:</strong> Cuando aparecen nuevas claves en los documentos JSON entrantes, Milvus agrupa automáticamente los valores con la misma clave en una columna dedicada. Esto conserva las ventajas de rendimiento del almacenamiento en columnas sin necesidad de que los usuarios diseñen esquemas por adelantado. Milvus también infiere el tipo de datos de los nuevos campos (por ejemplo, INTEGER, DOUBLE, VARCHAR) y selecciona un formato columnar eficiente para ellos.</p></li>
<li><p><strong>Todas las claves se gestionan automáticamente:</strong> Milvus analiza y procesa todas las claves del documento JSON. Esto garantiza una amplia cobertura de las consultas sin obligar a los usuarios a predefinir campos o crear índices de antemano.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Optimización de consultas</h3><p>Una vez reorganizados los datos en las columnas adecuadas, Milvus selecciona la ruta de ejecución más eficiente para cada consulta:</p>
<ul>
<li><p><strong>Exploraciones directas de columnas para claves mecanografiadas y dinámicas:</strong> Si una consulta se dirige a un campo que ya ha sido dividido en su propia columna, Milvus puede escanear esa columna directamente. Esto reduce la cantidad total de datos que deben procesarse y aprovecha el cálculo en columnas acelerado por SIMD para una ejecución aún más rápida.</p></li>
<li><p><strong>Búsqueda indexada de claves compartidas:</strong> Si la consulta incluye un campo que no se ha promocionado a su propia columna (normalmente, una clave poco frecuente), Milvus la evalúa con respecto a la columna de clave compartida. El índice invertido creado en esta columna permite a Milvus identificar rápidamente las filas que contienen la clave especificada y omitir el resto, lo que mejora significativamente el rendimiento de los campos de baja frecuencia.</p></li>
<li><p><strong>Gestión automática de metadatos:</strong> Milvus mantiene continuamente metadatos y diccionarios globales para que las consultas sigan siendo precisas y eficientes, incluso cuando la estructura de los documentos JSON entrantes evoluciona con el tiempo.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Pruebas de rendimiento<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos diseñado una prueba para comparar el rendimiento de las consultas almacenando todo el documento JSON como un único campo sin procesar frente al uso de la nueva función JSON Shredding.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Entorno y metodología de las pruebas</h3><ul>
<li><p>Hardware: clúster de 1 núcleo/8 GB</p></li>
<li><p>Conjunto de datos: 1 millón de documentos de <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Metodología: Medición de QPS y latencia en diferentes patrones de consulta</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Resultados: claves mecanografiadas</h3><p>Esta prueba mide el rendimiento cuando se consulta una clave presente en la mayoría de los documentos.</p>
<table>
<thead>
<tr><th>Expresión de consulta</th><th>QPS (sin destrucción)</th><th>QPS (con destrucción)</th><th>Aumento del rendimiento</th></tr>
</thead>
<tbody>
<tr><td>json['tiempo_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Resultados: claves compartidas</h3><p>Esta prueba se ha centrado en la consulta de claves dispersas y anidadas que entran en la categoría de "compartidas".</p>
<table>
<thead>
<tr><th>Expresión de consulta</th><th>QPS (sin destrucción)</th><th>QPS (con destrucción)</th><th>Aumento del rendimiento</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Las consultas de clave compartida son las que muestran las mejoras más espectaculares (hasta 89 veces más rápidas), mientras que las consultas de clave mecanografiada ofrecen aumentos de velocidad constantes de 15 a 30 veces. En general, todos los tipos de consulta se benefician de JSON Shredding, con claras mejoras de rendimiento en todos los ámbitos.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Pruébelo ahora<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Tanto si trabaja con registros de API, datos de sensores IoT o cargas útiles de aplicaciones en rápida evolución, JSON Shredding le ofrece la rara posibilidad de disponer tanto de flexibilidad como de alto rendimiento.</p>
<p>La función ya está disponible y le invitamos a probarla ahora. También puede consultar <a href="https://milvus.io/docs/json-shredding.md">este documento</a> para obtener más información.</p>
<p>¿Tiene preguntas o desea una inmersión profunda en cualquier característica de la última Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presente cuestiones en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
