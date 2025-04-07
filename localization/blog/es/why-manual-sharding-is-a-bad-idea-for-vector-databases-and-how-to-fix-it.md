---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Por qué la fragmentación manual es una mala idea para las bases de datos
  vectoriales y cómo solucionarlo
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Descubra por qué la fragmentación manual de bases de datos vectoriales crea
  cuellos de botella y cómo el escalado automatizado de Milvus elimina la
  sobrecarga de ingeniería para un crecimiento sin problemas.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p><em>"Inicialmente construimos nuestra búsqueda semántica en pgvector en lugar de Milvus porque todos nuestros datos relacionales ya estaban en PostgreSQL",</em> recuerda Alex, CTO de una startup SaaS de IA empresarial. <em>"Pero tan pronto como llegamos al ajuste producto-mercado, nuestro crecimiento se topó con serios obstáculos en el lado de la ingeniería. Pronto quedó claro que pgvector no estaba diseñado para la escalabilidad. Tareas sencillas como desplegar actualizaciones de esquemas en varios shards se convirtieron en procesos tediosos y propensos a errores que consumían días de esfuerzo de ingeniería. Cuando alcanzamos los 100 millones de incrustaciones vectoriales, la latencia de las consultas se disparó a más de un segundo, algo mucho más allá de lo que nuestros clientes tolerarían. Después de pasar a Milvus, la fragmentación manual era como volver a la edad de piedra. No es divertido hacer malabarismos con los servidores de fragmentación como si fueran artefactos frágiles. Ninguna empresa debería tener que soportar eso".</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Un desafío común para las empresas de IA<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>La experiencia de Alex no es única para los usuarios de pgvector. Tanto si utiliza pgvector, Qdrant, Weaviate o cualquier otra base de datos vectorial que dependa de la fragmentación manual, los retos de escalado siguen siendo los mismos. Lo que comienza como una solución manejable se convierte rápidamente en una deuda tecnológica a medida que crecen los volúmenes de datos.</p>
<p>Para las startups de hoy en día, <strong>la escalabilidad no es opcional, es una misión crítica</strong>. Esto es especialmente cierto en el caso de los productos de IA basados en grandes modelos lingüísticos (LLM) y bases de datos vectoriales, en los que el salto de la adopción inicial al crecimiento exponencial puede producirse de la noche a la mañana. Alcanzar la adecuación entre el producto y el mercado a menudo desencadena un aumento del número de usuarios, una afluencia de datos abrumadora y un incremento vertiginoso de las demandas de consulta. Pero si la infraestructura de la base de datos no puede seguir el ritmo, la lentitud de las consultas y las ineficiencias operativas pueden frenar el impulso y obstaculizar el éxito de la empresa.</p>
<p>Una decisión técnica a corto plazo podría provocar un cuello de botella a largo plazo, obligando a los equipos de ingeniería a abordar constantemente problemas urgentes de rendimiento, caídas de la base de datos y fallos del sistema en lugar de centrarse en la innovación. ¿El peor escenario posible? Una costosa y lenta reestructuración de la base de datos, precisamente cuando la empresa debería estar escalando.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">¿No es la fragmentación una solución natural a la escalabilidad?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>La escalabilidad puede abordarse de varias maneras. El enfoque más sencillo, la <strong>ampliación</strong>, consiste en mejorar los recursos de una sola máquina añadiendo más CPU, memoria o almacenamiento para dar cabida a volúmenes de datos cada vez mayores. Aunque sencillo, este método tiene claras limitaciones. En un entorno Kubernetes, por ejemplo, los pods de gran tamaño son ineficientes, y depender de un único nodo aumenta el riesgo de fallo, lo que puede provocar un tiempo de inactividad significativo.</p>
<p>Cuando el Scaling Up deja de ser viable, las empresas recurren naturalmente <strong>al Scaling Out</strong>, distribuyendo los datos entre varios servidores. A primera vista, la <strong>fragmentación</strong> parece una solución sencilla: dividir una base de datos en bases de datos más pequeñas e independientes para aumentar la capacidad y permitir varios nodos primarios con capacidad de escritura.</p>
<p>Sin embargo, aunque conceptualmente es sencillo, la fragmentación se convierte rápidamente en un reto complejo en la práctica. La mayoría de las aplicaciones se diseñan inicialmente para trabajar con una única base de datos unificada. En el momento en que una base de datos vectorial se divide en múltiples shards, cada parte de la aplicación que interactúa con los datos debe modificarse o reescribirse por completo, lo que introduce una importante sobrecarga de desarrollo. El diseño de una estrategia de fragmentación eficaz resulta crucial, al igual que la implementación de la lógica de enrutamiento para garantizar que los datos se dirigen al fragmento correcto. La gestión de transacciones atómicas en varios fragmentos a menudo requiere reestructurar las aplicaciones para evitar operaciones entre fragmentos. Además, las situaciones de fallo deben gestionarse con elegancia para evitar interrupciones cuando algunos fragmentos no están disponibles.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Por qué la fragmentación manual se convierte en una carga<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p>&quot;<em>En un principio, calculamos que la implementación de la fragmentación manual de nuestra base de datos pgvector llevaría unos seis meses a dos ingenieros&quot;,</em> recuerda Alex, <em>&quot;pero no nos dimos cuenta de que</em> <strong><em>siempre</em></strong> <em>necesitaríamos a</em> <em> esos ingenieros</em> <em>. Cada cambio de esquema, operación de reequilibrio de datos o decisión de escalado requería sus conocimientos especializados. En esencia, nos estábamos comprometiendo con un &quot;equipo de fragmentación&quot; permanente solo para mantener nuestra base de datos en funcionamiento.&quot;</em></p>
<p>Entre los retos del mundo real con las bases de datos vectoriales fragmentadas se incluyen:</p>
<ol>
<li><p><strong>Desequilibrio en la distribución de datos (Hotspots)</strong>: En los casos de uso multiusuario, la distribución de datos puede oscilar entre cientos y miles de millones de vectores por usuario. Este desequilibrio crea puntos calientes en los que algunos fragmentos se sobrecargan mientras otros permanecen inactivos.</p></li>
<li><p><strong>El dolor de cabeza de la reorganización</strong>: Elegir el número correcto de fragmentos es casi imposible. Demasiado pocos conduce a frecuentes y costosas operaciones de resharding. Demasiados genera una sobrecarga innecesaria de metadatos, aumentando la complejidad y reduciendo el rendimiento.</p></li>
<li><p><strong>Complejidad del cambio de esquema</strong>: Muchas bases de datos vectoriales implementan la fragmentación mediante la gestión de múltiples bases de datos subyacentes. Esto hace que la sincronización de los cambios de esquema entre los fragmentos sea engorrosa y propensa a errores, lo que ralentiza los ciclos de desarrollo.</p></li>
<li><p><strong>Desperdicio de recursos</strong>: En las bases de datos acopladas de almacenamiento-ordenador, hay que asignar meticulosamente los recursos a cada nodo y anticiparse al crecimiento futuro. Normalmente, cuando la utilización de recursos alcanza el 60-70%, hay que empezar a planificar la reorganización.</p></li>
</ol>
<p>En pocas palabras, <strong>gestionar los fragmentos manualmente es perjudicial para su empresa</strong>. En lugar de encerrar a su equipo de ingeniería en una gestión constante de fragmentos, considere invertir en una base de datos vectorial diseñada para escalar automáticamente, sin la carga operativa.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Cómo resuelve Milvus el problema de la escalabilidad<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchos desarrolladores, desde nuevas empresas hasta compañías, han reconocido la importante sobrecarga asociada a la fragmentación manual de bases de datos. Milvus adopta un enfoque fundamentalmente diferente, permitiendo un escalado sin fisuras de millones a miles de millones de vectores sin la complejidad.</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">Escalado automatizado sin deuda técnica</h3><p>Milvus aprovecha Kubernetes y una arquitectura de almacenamiento-computación desagregada para soportar una expansión sin fisuras. Este diseño permite:</p>
<ul>
<li><p>Escalado rápido en respuesta a demandas cambiantes</p></li>
<li><p>Equilibrio automático de la carga en todos los nodos disponibles</p></li>
<li><p>Asignación independiente de recursos, lo que le permite ajustar la computación, la memoria y el almacenamiento por separado</p></li>
<li><p>Alto rendimiento constante, incluso durante periodos de rápido crecimiento</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">Arquitectura distribuida diseñada desde cero</h3><p>Milvus logra sus capacidades de escalado a través de dos innovaciones clave:</p>
<p><strong>Arquitectura basada en segmentos:</strong> En su núcleo, Milvus organiza los datos en &quot;segmentos&quot;, las unidades más pequeñas de gestión de datos:</p>
<ul>
<li><p>Los segmentos crecientes residen en StreamNodes, optimizando la frescura de los datos para las consultas en tiempo real.</p></li>
<li><p>Los segmentos sellados son gestionados por QueryNodes, que utilizan potentes índices para acelerar la búsqueda.</p></li>
<li><p>Estos segmentos se distribuyen uniformemente entre los nodos para optimizar el procesamiento paralelo</p></li>
</ul>
<p><strong>Enrutamiento de dos capas</strong>: A diferencia de las bases de datos tradicionales, en las que cada fragmento vive en una sola máquina, Milvus distribuye los datos de un fragmento dinámicamente entre varios nodos:</p>
<ul>
<li><p>Cada fragmento puede almacenar más de mil millones de puntos de datos.</p></li>
<li><p>Los segmentos de cada fragmento se equilibran automáticamente entre las máquinas.</p></li>
<li><p>Ampliar las colecciones es tan sencillo como aumentar el número de fragmentos.</p></li>
<li><p>La próxima versión Milvus 3.0 introducirá la división dinámica de fragmentos, eliminando incluso este mínimo paso manual.</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Procesamiento de consultas a escala</h3><p>Al ejecutar una consulta, Milvus sigue un proceso eficiente:</p>
<ol>
<li><p>El proxy identifica los fragmentos relevantes para la colección solicitada.</p></li>
<li><p>El proxy recopila datos tanto de los StreamNodes como de los QueryNodes.</p></li>
<li><p>Los StreamNodes gestionan los datos en tiempo real, mientras que los QueryNodes procesan los datos históricos simultáneamente.</p></li>
<li><p>Los resultados se agregan y se devuelven al usuario</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Una experiencia de ingeniería diferente<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>"<em>Cuando la escalabilidad está integrada en la propia base de datos, todos esos quebraderos de cabeza... desaparecen",</em> dice Alex, reflexionando sobre la transición de su equipo a Milvus. <em>"Mis ingenieros están de vuelta para construir características que los clientes aman en lugar de cuidar fragmentos de bases de datos".</em></p>
<p>Si está lidiando con la carga de ingeniería de la fragmentación manual, los cuellos de botella de rendimiento a escala o la desalentadora perspectiva de las migraciones de bases de datos, es hora de replantearse su enfoque. Visite nuestra <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">página de documentación</a> para obtener más información sobre la arquitectura de Milvus, o experimente de primera mano la escalabilidad sin esfuerzo con Milvus totalmente gestionado en <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Con la base de datos vectorial adecuada, su innovación no tiene límites.</p>
