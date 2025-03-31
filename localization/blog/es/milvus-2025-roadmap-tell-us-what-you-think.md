---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 Roadmap - Díganos lo que piensa
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  En 2025, vamos a lanzar dos versiones principales, Milvus 2.6 y Milvus 3.0, y
  muchas otras características técnicas. Le invitamos a que comparta sus ideas
  con nosotros.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>¡Hola, usuarios y colaboradores de Milvus!</p>
<p>Estamos muy contentos de compartir nuestra <a href="https://milvus.io/docs/roadmap.md"><strong>hoja de ruta Milvus 2025</strong></a> con ustedes. 🚀 Este plan técnico destaca las características y mejoras clave que estamos construyendo para hacer Milvus aún más potente para sus necesidades de búsqueda vectorial.</p>
<p>Pero esto es solo el principio: ¡queremos conocer tus opiniones! Sus comentarios ayudan a dar forma a Milvus, asegurando que evoluciona para satisfacer los desafíos del mundo real. Háganos saber lo que piensa y ayúdenos a perfeccionar la hoja de ruta a medida que avanzamos.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">El panorama actual<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Durante el último año, hemos visto a muchos de ustedes crear impresionantes aplicaciones RAG y de agentes con Milvus, aprovechando muchas de nuestras características más populares, como nuestra integración de modelos, búsqueda de texto completo y búsqueda híbrida. Sus implementaciones han proporcionado información valiosa sobre los requisitos de búsqueda vectorial en el mundo real.</p>
<p>A medida que evolucionan las tecnologías de IA, sus casos de uso son cada vez más sofisticados: desde la búsqueda vectorial básica hasta aplicaciones multimodales complejas que abarcan agentes inteligentes, sistemas autónomos e IA incorporada. Estos desafíos técnicos están informando nuestra hoja de ruta a medida que continuamos desarrollando Milvus para satisfacer sus necesidades.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Dos grandes lanzamientos en 2025: Milvus 2.6 y Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, lanzaremos dos versiones principales: Milvus 2.6 (a mediados de CY25) y Milvus 3.0 (a finales de 2025).</p>
<p><strong>Milvus 2.6</strong> se centra en las mejoras de la arquitectura central que ha estado pidiendo:</p>
<ul>
<li><p>Despliegue más sencillo con menos dependencias (¡adiós a los quebraderos de cabeza del despliegue!)</p></li>
<li><p>Canalizaciones de ingestión de datos más rápidas</p></li>
<li><p>Menores costes de almacenamiento (escuchamos sus preocupaciones sobre los costes de producción)</p></li>
<li><p>Mejor gestión de las operaciones de datos a gran escala (eliminación/modificación)</p></li>
<li><p>Búsqueda escalar y de texto completo más eficaz</p></li>
<li><p>Compatibilidad con los últimos modelos de incrustación con los que trabaja</p></li>
</ul>
<p><strong>Milvus 3.0</strong> es nuestra mayor evolución arquitectónica, introduciendo un sistema de lago de datos vectorial para:</p>
<ul>
<li><p>Integración perfecta de servicios de IA</p></li>
<li><p>Capacidades de búsqueda de siguiente nivel</p></li>
<li><p>Gestión de datos más sólida</p></li>
<li><p>Mejor gestión de los conjuntos de datos masivos sin conexión con los que trabaja</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Características técnicas que estamos planificando: necesitamos sus comentarios<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación se indican las características técnicas clave que tenemos previsto añadir a Milvus.</p>
<table>
<thead>
<tr><th><strong>Área de características clave</strong></th><th><strong>Características técnicas</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Procesamiento de datos no estructurados basado en IA</strong></td><td>- Entrada/salida de datos: Integración nativa con los principales servicios de modelos para la ingestión de texto sin procesar<br>- Tratamiento de datos originales: Soporte de referencia de texto/URL para el procesamiento de datos sin procesar<br>- Soporte tensorial: Implementación de listas vectoriales (para escenarios ColBERT/CoPali/Video)<br>- Tipos de datos ampliados: DateTime, Map, soporte GIS basado en requisitos<br>- Búsqueda iterativa: Perfeccionamiento del vector de consulta a través de los comentarios del usuario</td></tr>
<tr><td><strong>Mejoras en la calidad y el rendimiento de la búsqueda</strong></td><td>- Concordancia avanzada: capacidades phrase_match y multi_match<br>- Actualización del analizador: mejora del analizador con mayor compatibilidad con tokenizadores y mejor capacidad de observación.<br>- Optimización de JSON: Filtrado más rápido gracias a una indexación mejorada<br>- Ordenación de la ejecución: Ordenación de resultados basada en campos escalares<br>- Reranker avanzado: Reranking basado en modelos y funciones de puntuación personalizadas<br>- Búsqueda iterativa: Perfeccionamiento del vector de consulta a través de los comentarios del usuario</td></tr>
<tr><td><strong>Flexibilidad en la gestión de datos</strong></td><td>- Cambio de esquema: Añadir/eliminar campo, modificar longitud varchar<br>- Agregaciones escalares: operaciones count/distinct/min/max<br>- Soporte UDF: Soporte de funciones definidas por el usuario<br>- Versionado de datos: Sistema de reversión basado en instantáneas<br>- Agrupación de datos: Co-ubicación mediante configuración<br>- Muestreo de datos: Obtención rápida de resultados basados en datos de muestreo</td></tr>
<tr><td><strong>Mejoras arquitectónicas</strong></td><td>- Nodo de flujo: Ingesta de datos incremental simplificada<br>- MixCoord: Arquitectura de coordinador unificada<br>- Independencia de Logstore: Reducción de dependencias externas como pulsar<br>- Deduplicación PK: Deduplicación global de claves primarias</td></tr>
<tr><td><strong>Eficiencia de costes y mejoras en la arquitectura</strong></td><td>- Almacenamiento por niveles: Separación de datos calientes/fríos para reducir el coste de almacenamiento<br>- Política de desalojo de datos: Los usuarios pueden definir su propia política de desalojo de datos<br>- Actualizaciones masivas: Admite modificaciones de valores de campos específicos, ETL, etc.<br>- Large TopK: Devuelve conjuntos de datos masivos<br>- VTS GA: Conecta con distintas fuentes de datos<br>- Cuantización avanzada: Optimice el consumo de memoria y el rendimiento basándose en técnicas de cuantificación<br>- Elasticidad de recursos: Escalado dinámico de los recursos para adaptarse a las distintas cargas de escritura, lectura y tareas en segundo plano.</td></tr>
</tbody>
</table>
<p>A medida que vayamos implementando esta hoja de ruta, agradeceremos sus opiniones y comentarios sobre lo siguiente:</p>
<ol>
<li><p><strong>Prioridades de las funciones:</strong> ¿Qué funciones de nuestra hoja de ruta tendrían mayor impacto en su trabajo?</p></li>
<li><p><strong>Ideas de aplicación:</strong> ¿Qué enfoques específicos cree que funcionarían bien para estas funciones?</p></li>
<li><p><strong>Alineación con los casos de uso:</strong> ¿Cómo se alinean estas funciones previstas con sus casos de uso actuales y futuros?</p></li>
<li><p><strong>Consideraciones sobre el rendimiento:</strong> ¿Algún aspecto de rendimiento en el que deberíamos centrarnos para sus necesidades específicas?</p></li>
</ol>
<p><strong>Su opinión nos ayuda a mejorar Milvus para todos. No dude en compartir sus opiniones en nuestro<a href="https://github.com/milvus-io/milvus/discussions/40263"> Foro de Debate de Milvus</a> o en nuestro <a href="https://discord.com/invite/8uyFbECzPX">Canal Discord</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Bienvenido a contribuir a Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Como proyecto de código abierto, Milvus siempre da la bienvenida a sus contribuciones:</p>
<ul>
<li><p><strong>Comparta sus comentarios:</strong> Informe de problemas o sugiera características a través de nuestra <a href="https://github.com/milvus-io/milvus/issues">página de problemas de GitHub</a></p></li>
<li><p><strong>Contribuciones al código:</strong> Envíe pull requests (consulte nuestra <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Guía del colaborador</a>)</p></li>
<li><p><strong>Corra la voz:</strong> Comparta sus experiencias con Milvus y <a href="https://github.com/milvus-io/milvus">ponga una estrella en nuestro repositorio de GitHub</a>.</p></li>
</ul>
<p>Estamos entusiasmados de construir este próximo capítulo de Milvus con usted. Su código, ideas y comentarios hacen avanzar este proyecto.</p>
<p>- El equipo de Milvus</p>
