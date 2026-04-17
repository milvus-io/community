---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 años, 2 grandes reconstrucciones, más de 40.000 estrellas GitHub: El ascenso
  de Milvus como principal base de datos vectorial de código abierto
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Celebración de los 7 años de viaje de Milvus para convertirse en la principal
  base de datos vectorial de código abierto del mundo
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>En junio de 2025, Milvus alcanzó las 35.000 estrellas de GitHub. Tan solo unos meses después, hemos <a href="https://github.com/milvus-io/milvus">superado las 40.000, prueba</a>no solo del impulso, sino también de una comunidad global que sigue impulsando el futuro de la búsqueda vectorial y multimodal.</p>
<p>Estamos profundamente agradecidos. A todos los que han puesto una estrella, han hecho un fork, han presentado problemas, han discutido sobre una API, han compartido un benchmark o han construido algo increíble con Milvus: <strong>Gracias, y ustedes son la razón por la que este proyecto se mueve tan rápido como lo hace</strong>. Cada estrella representa algo más que un botón pulsado: refleja a alguien que elige Milvus para impulsar su trabajo, alguien que cree en lo que estamos construyendo, alguien que comparte nuestra visión de una infraestructura de IA abierta, accesible y de alto rendimiento.</p>
<p>Así que, mientras celebramos, también miramos hacia el futuro: hacia las funciones que usted nos pide, hacia las arquitecturas que la IA exige ahora y hacia un mundo en el que la comprensión multimodal y semántica sea la norma en todas las aplicaciones.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">El viaje: De cero a más de 40.000 estrellas<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando empezamos a construir Milvus en 2017, el término <em>base de datos vectorial</em> ni siquiera existía. Solo éramos un pequeño equipo de ingenieros convencidos de que las aplicaciones de IA pronto necesitarían un nuevo tipo de infraestructura de datos: una construida no para filas y columnas, sino para datos multidimensionales, no estructurados y multimodales. Las bases de datos tradicionales no estaban hechas para ese mundo, y sabíamos que alguien tenía que reimaginar cómo podría ser el almacenamiento y la recuperación.</p>
<p>Los primeros días no fueron nada glamurosos. Construir una infraestructura de nivel empresarial es un trabajo lento y obstinado: semanas dedicadas a perfilar rutas de código, reescribir componentes y cuestionar decisiones de diseño a las 2 de la madrugada. Pero nos aferramos a una misión sencilla: <strong>hacer que la búsqueda vectorial fuera accesible, escalable y fiable para todos los desarrolladores que crean aplicaciones de IA</strong>. Esa misión nos llevó a través de los primeros avances y a través de los inevitables contratiempos.</p>
<p>Y en el camino, algunos puntos de inflexión lo cambiaron todo:</p>
<ul>
<li><p><strong>2019:</strong> Pusimos Milvus 0.10 en código abierto. Significó exponer todos nuestros bordes ásperos: los hacks, los TODOs, las piezas de las que aún no estábamos orgullosos. Pero la comunidad apareció. Los desarrolladores presentaron problemas que nunca habríamos encontrado, propusieron características que no habíamos imaginado y desafiaron suposiciones que, en última instancia, hicieron que Milvus fuera más fuerte.</p></li>
<li><p><strong>2020-2021:</strong> Nos unimos a la <a href="https://lfaidata.foundation/projects/milvus/">Fundación LF</a> AI <a href="https://lfaidata.foundation/projects/milvus/">&amp; Data</a>, lanzamos Milvus 1.0, nos graduamos de LF AI &amp; Data y ganamos el desafío de búsqueda vectorial a escala de mil millones de <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a>, una prueba temprana de que nuestra arquitectura podía manejar la escala del mundo real.</p></li>
<li><p><strong>2022:</strong> Los usuarios empresariales necesitaban un escalado nativo de Kubernetes, elasticidad y una separación real entre almacenamiento y computación. Nos enfrentamos a una difícil decisión: parchear el sistema antiguo o reconstruirlo todo. Elegimos el camino más difícil. <strong>Milvus 2.0 fue una reinvención desde cero</strong>, introduciendo una arquitectura nativa de la nube totalmente desacoplada que transformó Milvus en una plataforma de nivel de producción para cargas de trabajo de IA de misión crítica.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (el equipo detrás de Milvus) fue nombrado <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">líder por Forrester</a>, superó las 30.000 estrellas y ahora está por encima de las 40.000. Se convirtió en la <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">columna</a> vertebral de las empresas multiservicio. Se convirtió en la columna vertebral de la búsqueda multimodal, los sistemas RAG, los flujos de trabajo agénticos y la recuperación a escala de miles de millones en todos los sectores (educación, finanzas, producción creativa, investigación científica, etc.).</p></li>
</ul>
<p>Este hito no se consiguió a base de bombo y platillo, sino gracias a que los desarrolladores eligieron Milvus para cargas de trabajo de producción reales y nos empujaron a mejorar en cada paso del camino.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Dos grandes lanzamientos, enormes mejoras de rendimiento<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 fue el año en que Milvus entró en una nueva liga. Aunque la búsqueda vectorial destaca en la comprensión semántica, la realidad en la producción es simple: <strong>los desarrolladores siguen necesitando una concordancia precisa de palabras clave</strong> para ID de productos, números de serie, frases exactas, términos legales y mucho más. Sin la búsqueda nativa de texto completo, los equipos se veían obligados a mantener clústeres de Elasticsearch/OpenSearch o a unir sus propias soluciones personalizadas, lo que duplicaba la sobrecarga operativa y la fragmentación.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>cambió eso</strong>. Introdujo <strong>la búsqueda híbrida verdaderamente nativa</strong>, combinando la recuperación de texto completo y la búsqueda vectorial en un único motor. Por primera vez, los desarrolladores podían ejecutar conjuntamente consultas léxicas, consultas semánticas y filtros de metadatos sin tener que hacer malabarismos con sistemas adicionales ni sincronizar canalizaciones. También mejoramos el filtrado de metadatos, el análisis sintáctico de expresiones y la eficiencia de ejecución para que las consultas híbridas resultaran naturales y rápidas bajo cargas de producción reales.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>impulsó aún más este impulso</strong>, centrándose en los dos retos que escuchamos con más frecuencia de los usuarios que trabajan a escala: <strong><em>el coste</em> y el <em>rendimiento</em>.</strong> Esta versión aportó profundas mejoras arquitectónicas: rutas de consulta más predecibles, indexación más rápida, un uso de memoria drásticamente menor y un almacenamiento significativamente más eficiente. Muchos equipos informaron de mejoras inmediatas sin cambiar ni una sola línea del código de la aplicación.</p>
<p>Estos son algunos de los aspectos más destacados de Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Almacenamiento por niveles</strong></a> que permite a los equipos equilibrar el coste y el rendimiento de forma más inteligente, reduciendo los costes de almacenamiento hasta en un 50%.</p></li>
<li><p><strong>Enorme ahorro de memoria</strong> gracias a <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">la cuantización RaBitQ de 1 bit</a>, que reduce el uso de memoria hasta en un 72% sin dejar de ofrecer consultas más rápidas.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Un motor de texto completo rediseñado</strong></a> con una implementación de BM25 significativamente más rápida: hasta 4 veces más rápido que Elasticsearch en nuestras pruebas comparativas.</p></li>
<li><p><strong>Un nuevo índice de rutas</strong> para <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">metadatos estructurados en JSON</a>, que permite un filtrado hasta 100 veces más rápido de documentos complejos.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> compresión a escala de miles de millones con una reducción de almacenamiento de 3200× y una gran capacidad de recuperación.</p></li>
<li><p><a href="https://milvus.io/docs/geometry-operators.md"><strong>Búsqueda</strong></a><strong>semántica y</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>geoespacial</strong></a> <strong>con R-Tree:</strong> Combinación de <em>dónde están las cosas</em> con <em>lo que significan</em> para obtener resultados más relevantes.</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> Reduce los costes de implantación con un modo CAGRA híbrido que se basa en la GPU pero realiza las consultas en la CPU.</p></li>
<li><p><strong>Un</strong><strong>flujo de trabajo</strong><strong>de "</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>entrada de datos, salida de datos"</strong></a> que simplifica la ingesta y recuperación de incrustaciones, especialmente para canalizaciones multimodales.</p></li>
<li><p><strong>Soporte de hasta 100.000 colecciones</strong> en un único clúster, lo que supone un gran paso hacia la multitenencia real a escala.</p></li>
</ul>
<p>Para más información sobre Milvus 2.6, consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión completa</a>.</p>
<p><a href="https://zilliz.com/event/milvus-2-6-deep-dive-faster-search-lower-cost-smarter-scaling?utm_source=milvusio&amp;utm_medium=milvus-40k-stars&amp;utm_campaign=milvus-26-webinar">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Webinar_Milvus_2_6_Webinar_5_4_Twitter_a4e8dbf7e4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Más allá de Milvus: herramientas de código abierto para desarrolladores de IA<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, no sólo mejoramos Milvus, sino que creamos herramientas que fortalecen todo el ecosistema de desarrolladores de IA. Nuestro objetivo no era perseguir tendencias, sino ofrecer a los desarrolladores el tipo de herramientas abiertas, potentes y transparentes que siempre hemos deseado que existieran.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Investigación sin bloqueo en la nube</h3><p>Deep Researcher de OpenAI demostró lo que pueden hacer los agentes de razonamiento profundo. Pero es cerrado, caro y está bloqueado detrás de APIs en la nube. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>es nuestra respuesta.</strong> Es un motor de investigación profunda local y de código abierto diseñado para cualquiera que desee investigaciones estructuradas sin sacrificar el control o la privacidad.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher se ejecuta completamente en su máquina, recopilando información a través de fuentes, sintetizando ideas y proporcionando citas, pasos de razonamiento y trazabilidad, características esenciales para la investigación real, no sólo resúmenes superficiales. Sin cajas negras. Sin dependencia de un proveedor. Sólo análisis transparentes y reproducibles en los que puedan confiar desarrolladores e investigadores.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context: Asistentes de codificación que realmente entienden su código</h3><p>La mayoría de las herramientas de codificación de IA todavía se comportan como extravagantes tuberías grep: rápidas, superficiales, quemadoras de tokens y ajenas a la estructura real del proyecto. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> cambia eso. Construido como un plugin MCP, por fin ofrece a los asistentes de codificación lo que les faltaba: una auténtica comprensión semántica de tu código base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context construye un índice semántico vectorial a través de su proyecto, permitiendo a los agentes encontrar los módulos correctos, seguir las relaciones entre los archivos, entender la intención a nivel de arquitectura, y responder a las preguntas con relevancia en lugar de conjeturas. Reduce el desperdicio de fichas, aumenta la precisión y, lo que es más importante, permite que los asistentes de codificación se comporten como si realmente entendieran su software en lugar de fingir que lo hacen.</p>
<p>Ambas herramientas son de código abierto. Porque la infraestructura de IA debería pertenecer a todo el mundo y porque el futuro de la IA no debería estar encerrado tras muros propietarios.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Con la confianza de más de 10.000 equipos en producción<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>En la actualidad, más de 10.000 equipos empresariales utilizan Milvus en producción, desde empresas emergentes de rápido crecimiento hasta algunas de las compañías tecnológicas más consolidadas del mundo y de la lista Fortune 500. Los equipos de NVIDIA, Sales &amp; Co. Los equipos de NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch y Microsoft confían en Milvus para impulsar sistemas de IA que funcionan cada minuto del día. Sus cargas de trabajo abarcan la búsqueda, las recomendaciones, las canalizaciones agénticas, la recuperación multimodal y otras aplicaciones que llevan al límite la infraestructura de vectores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pero lo más importante no es sólo <em>quién</em> utiliza Milvus, sino <em>lo que están construyendo con él</em>. En todos los sectores, Milvus está detrás de sistemas que determinan la forma en que las empresas operan, innovan y compiten:</p>
<ul>
<li><p><strong>Copilotos de IA y asistentes de empresa</strong> que mejoran la atención al cliente, los flujos de trabajo de ventas y la toma de decisiones interna con acceso instantáneo a miles de millones de incrustaciones.</p></li>
<li><p><strong>Búsqueda semántica y visual en comercio electrónico, medios de comunicación y publicidad</strong>, que impulsa una mayor conversión, un mejor descubrimiento y una producción creativa más rápida.</p></li>
<li><p><strong>Plataformas de inteligencia jurídica, financiera y científica</strong> en las que la precisión, la auditabilidad y el cumplimiento se traducen en beneficios operativos reales.</p></li>
<li><p><strong>Motores de detección de fraudes y riesgos</strong> en la banca y la tecnología financiera que dependen de una rápida correspondencia semántica para evitar pérdidas en tiempo real.</p></li>
<li><p><strong>Sistemas RAG y agénticos a gran escala</strong> que proporcionan a los equipos un comportamiento de IA profundamente contextual y consciente del dominio.</p></li>
<li><p><strong>Capas de conocimiento empresarial</strong> que unifican texto, código, imágenes y metadatos en un tejido semántico coherente.</p></li>
</ul>
<p>Y no se trata de pruebas de laboratorio, sino de algunas de las implantaciones de producción más exigentes del mundo. Milvus lo consigue de forma rutinaria:</p>
<ul>
<li><p>Recuperación en menos de 50 ms de miles de millones de vectores</p></li>
<li><p>Miles de millones de documentos y eventos gestionados en un único sistema</p></li>
<li><p>Flujos de trabajo entre 5 y 10 veces más rápidos que las soluciones alternativas</p></li>
<li><p>Arquitecturas multiusuario que soportan cientos de miles de colecciones</p></li>
</ul>
<p>Los equipos eligen Milvus por una sencilla razón: <strong>ofrece lo que importa: velocidad, fiabilidad, rentabilidad y la capacidad de escalar a miles de millones sin tener que desmontar su arquitectura cada pocos meses.</strong> La confianza que estos equipos depositan en nosotros es la razón por la que seguimos reforzando Milvus para la década de IA que tenemos por delante.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Cuando necesite Milvus sin las operaciones: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es gratuito, potente y de eficacia probada. Pero también es un sistema distribuido y el buen funcionamiento de los sistemas distribuidos es un verdadero trabajo de ingeniería. El ajuste de índices, la gestión de la memoria, la estabilidad de los clústeres, el escalado, la observabilidad... estas tareas requieren un tiempo y una experiencia de los que muchos equipos simplemente no disponen. Los desarrolladores querían la potencia de Milvus, pero sin el peso operativo que inevitablemente conlleva su gestión a escala.</p>
<p>Esta realidad nos llevó a una sencilla conclusión: si Milvus iba a convertirse en la infraestructura central de las aplicaciones de IA, necesitábamos que su funcionamiento no supusiera ningún esfuerzo. Por eso creamos <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>, el servicio Milvus totalmente gestionado, creado y mantenido por el mismo equipo que está detrás del proyecto de código abierto.</p>
<p>Zilliz Cloud ofrece a los desarrolladores el Milvus que ya conocen y en el que confían, pero sin necesidad de aprovisionar clústeres, solucionar problemas de rendimiento, planificar actualizaciones o preocuparse por el almacenamiento y el ajuste informático. Y como incluye optimizaciones imposibles de ejecutar en entornos autogestionados, es aún más rápido y fiable. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, nuestro motor vectorial autooptimizado de calidad comercial, ofrece un rendimiento 10 veces superior <strong>al Milvus de código abierto</strong>.</p>
<p><strong>Lo que diferencia a Zilliz Cloud</strong></p>
<ul>
<li><strong>Rendimiento autooptimizado:</strong> AutoIndex ajusta automáticamente HNSW, IVF y DiskANN, ofreciendo una recuperación superior al 96% sin necesidad de configuración manual.</li>
</ul>
<ul>
<li><p><strong>Elástico y rentable:</strong> Los precios de pago por uso, el escalado automático sin servidor y la gestión inteligente de recursos suelen reducir los costes en un 50% o más en comparación con las implantaciones autogestionadas.</p></li>
<li><p><strong>Fiabilidad de nivel empresarial:</strong> 99,95% de tiempo de actividad SLA, redundancia multi-AZ, SOC 2 Tipo II, ISO 27001 y cumplimiento GDPR. Compatibilidad total con RBAC, BYOC, registros de auditoría y cifrado.</p></li>
<li><p><strong>Despliegue independiente de la nube:</strong> Ejecute en AWS, Azure, GCP, Alibaba Cloud o Tencent Cloud, sin dependencia del proveedor, rendimiento constante en todas partes.</p></li>
<li><p><strong>Consultas en lenguaje natural:</strong> La compatibilidad integrada con el servidor MCP le permite consultar los datos de forma conversacional en lugar de elaborar manualmente llamadas a la API.</p></li>
<li><p><strong>Migración sin esfuerzo</strong>: Migre desde Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch o PostgreSQL utilizando herramientas de migración integradas, sin necesidad de reescribir esquemas ni tiempos de inactividad.</p></li>
<li><p><strong>100% compatible con Milvus de código abierto.</strong> Sin bifurcaciones propietarias. Sin dependencia. Sólo Milvus, más fácil.</p></li>
</ul>
<p><strong>Milvus seguirá siendo siempre de código abierto y de uso gratuito.</strong> Pero ejecutarlo y hacerlo funcionar de forma fiable a escala empresarial requiere una experiencia y unos recursos considerables. <strong>Zilliz Cloud es nuestra respuesta a ese vacío</strong>. Desplegado en 29 regiones y cinco nubes principales, Zilliz Cloud proporciona rendimiento, seguridad y rentabilidad de nivel empresarial, al tiempo que le mantiene completamente alineado con el Milvus que ya conoce.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Iniciar prueba gratuita →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">Lo que viene a continuación: Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Como el equipo que introdujo la base de datos vectorial, hemos tenido un asiento en primera fila para ver cómo están cambiando los datos empresariales. Lo que antes cabía perfectamente en terabytes de tablas estructuradas se está convirtiendo rápidamente en petabytes -y pronto billones- de objetos multimodales. Texto, imágenes, audio, vídeo, flujos de series temporales, registros de multisensores... estos son los conjuntos de datos en los que se basan los modernos sistemas de IA.</p>
<p>Las bases de datos vectoriales están diseñadas específicamente para datos no estructurados y multimodales, pero no siempre son la opción más económica o la más adecuada desde el punto de vista arquitectónico, especialmente cuando la gran mayoría de los datos son fríos. Los corpus de entrenamiento para modelos de gran tamaño, los registros de percepción de conducción autónoma y los conjuntos de datos de robótica no suelen requerir latencia de milisegundos ni alta concurrencia. La ejecución de este volumen de datos a través de una base de datos vectorial en tiempo real resulta cara, pesada desde el punto de vista operativo y demasiado compleja para los procesos que no requieren ese nivel de rendimiento.</p>
<p>Esta realidad nos llevó a nuestra siguiente gran iniciativa: <strong>Milvus Lake, un</strong>lago multimodal basado en la semántica y en el índice diseñado para datos a escala de IA. Milvus Lake unifica las señales semánticas en todas las modalidades -vectores, metadatos, etiquetas, descripciones generadas por LLM y campos estructurados- y las organiza en <strong>tablas semánticas</strong> ancladas en torno a entidades empresariales reales. Los datos que antes vivían como archivos en bruto y dispersos en almacenes de objetos, almacenes de lagos y canalizaciones de modelos se convierten en una capa semántica unificada y consultable. Los corpus multimodales masivos se convierten en activos manejables, recuperables y reutilizables con un significado coherente en toda la empresa.</p>
<p>Bajo el capó, Milvus Lake se basa en una arquitectura limpia <strong>de manifiesto + datos + índice</strong> que trata la indexación como algo fundamental y no como una ocurrencia tardía. Esto desbloquea un flujo de trabajo de "recuperar primero, procesar después" optimizado para datos fríos a escala de billones, que ofrece una latencia predecible, unos costes de almacenamiento drásticamente inferiores y una estabilidad operativa mucho mayor. Un enfoque de almacenamiento por niveles -NVMe/SSD para rutas activas y almacenamiento de objetos para archivos profundos- combinado con una compresión eficiente e índices de carga lenta preserva la fidelidad semántica a la vez que mantiene la sobrecarga de la infraestructura bajo control.</p>
<p>Milvus Lake también se integra perfectamente en el ecosistema de datos moderno, con Paimon, Iceberg, Hudi, Spark, Ray y otros motores y formatos de big data. Los equipos pueden ejecutar el procesamiento por lotes, las canalizaciones en tiempo casi real, la recuperación semántica, la ingeniería de características y la preparación de datos de formación en un solo lugar, sin necesidad de volver a configurar sus flujos de trabajo existentes. Tanto si está construyendo corpus de modelos básicos, gestionando bibliotecas de simulación de conducción autónoma, entrenando agentes robóticos o alimentando sistemas de recuperación a gran escala, Milvus Lake proporciona un lago semántico extensible y rentable para la era de la IA.</p>
<p><strong>Milvus Lake está en desarrollo activo.</strong> Le interesa el acceso anticipado o quiere saber más?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Ponte en contacto con nosotros →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Construido por la comunidad, para la comunidad<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo que hace especial a Milvus no es solo la tecnología, sino la gente que hay detrás. Nuestra base de colaboradores se extiende por todo el mundo, reuniendo a especialistas en computación de alto rendimiento, sistemas distribuidos e infraestructura de IA. Ingenieros e investigadores de ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft y muchos más han contribuido con su experiencia a dar forma a Milvus para convertirlo en lo que es hoy.</p>
<p>Cada pull request, cada informe de error, cada pregunta respondida en nuestros foros, cada tutorial creado... estas contribuciones hacen que Milvus sea mejor para todos.</p>
<p>Este hito os pertenece a todos:</p>
<ul>
<li><p><strong>A nuestros colaboradores</strong>: Gracias por su código, sus ideas y su tiempo. Hacéis que Milvus sea mejor cada día.</p></li>
<li><p><strong>A nuestros usuarios</strong>: Gracias por confiar en Milvus con sus cargas de trabajo de producción y por compartir sus experiencias, tanto buenas como difíciles. Sus comentarios impulsan nuestra hoja de ruta.</p></li>
<li><p><strong>A los seguidores de nuestra comunidad</strong>: Gracias por responder preguntas, escribir tutoriales, crear contenido y ayudar a los recién llegados a empezar. Gracias a vosotros, nuestra comunidad es acogedora e integradora.</p></li>
<li><p><strong>A nuestros socios e integradores</strong>: Gracias por construir con nosotros y hacer de Milvus un ciudadano de primera clase en el ecosistema de desarrollo de IA.</p></li>
<li><p><strong>Al equipo de Zilliz</strong>: Gracias por vuestro inquebrantable compromiso tanto con el proyecto de código abierto como con el éxito de nuestros usuarios.</p></li>
</ul>
<p>Milvus ha crecido porque miles de personas decidieron construir algo juntos, de forma abierta, generosa y con la creencia de que la infraestructura básica de la IA debería ser accesible para todos.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Únase a nosotros en este viaje<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Ya sea que esté construyendo su primera aplicación de búsqueda de vectores o escalando a miles de millones de vectores, nos encantaría tenerlo como parte de la comunidad Milvus.</p>
<p><strong>Comience</strong>:</p>
<ul>
<li><p><strong>⭐ Inícianos en GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Prueba Zilliz Cloud gratis</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Únete a nuestro</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> para conectar con desarrolladores de todo el mundo</p></li>
<li><p>📚 <strong>Explora nuestra documentación</strong>: <a href="https://milvus.io/docs">Documentación de Milvus</a></p></li>
<li><p>💬 <strong>Reserva una</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>sesión individual de 20 minutos</strong></a> para obtener ideas, orientación y respuestas a tus preguntas.</p></li>
</ul>
<p>El camino que tenemos por delante es apasionante. A medida que la IA reconfigura las industrias y abre nuevas posibilidades, las bases de datos vectoriales se situarán en el centro de esta transformación. Juntos, estamos construyendo la base semántica en la que se apoyan las aplicaciones modernas de IA, y no hemos hecho más que empezar.</p>
<p>Brindemos por las próximas 40.000 estrellas y por construir <strong>juntos</strong> el futuro de la infraestructura de la IA. 🎉</p>
