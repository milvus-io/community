---
id: vector-graph-rag-without-graph-database.md
title: Construimos Graph RAG sin la base de datos Graph
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Vector Graph RAG de código abierto añade razonamiento multisalto a RAG
  utilizando sólo Milvus. 87,8% Recall@5, 2 llamadas LLM por consulta, sin
  necesidad de base de datos de grafos.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>¿Necesita realmente una base de datos de grafos para Graph RAG? No. Ponga entidades, relaciones y pasajes en Milvus. Utiliza la expansión de subgrafos en lugar del recorrido de grafos, y un LLM rerank en lugar de bucles de agentes de varias rondas. Eso es</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a><strong><em>,</em></strong> <em>y es lo que hemos construido. Este método alcanza un promedio de 87,8% de Recall@5 en tres pruebas de control de calidad multisalto y supera a HippoRAG 2 en una única instancia de Milvus.</em></p>
</blockquote>
<p>Las preguntas multisalto son el muro contra el que chocan la mayoría de los métodos de GAR. La respuesta está en el corpus, pero abarca varios pasajes conectados por entidades que la pregunta nunca nombra. La solución habitual es añadir una base de datos de grafos, lo que implica utilizar dos sistemas en lugar de uno.</p>
<p>Nosotros también nos topábamos con este problema y no queríamos utilizar dos bases de datos sólo para resolverlo. Así que construimos y pusimos en código abierto <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>, una biblioteca Python que aporta razonamiento multisalto a <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> utilizando sólo <a href="https://milvus.io/docs">Milvus</a>, la base de datos vectorial de código abierto más ampliamente adoptada. Proporciona la misma capacidad multisalto con una base de datos en lugar de dos.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Por qué las preguntas multisalto rompen el RAG estándar<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Las preguntas multisalto rompen la GAR estándar porque la respuesta depende de relaciones entre entidades que la búsqueda vectorial no puede ver. La entidad puente que conecta la pregunta con la respuesta a menudo no se encuentra en la propia pregunta.</p>
<p>Las preguntas sencillas funcionan bien. Se trocean los documentos, se incrustan, se recuperan las coincidencias más próximas y se introducen en un LLM. "¿Qué índices admite Milvus?" está en un pasaje, y la búsqueda vectorial lo encuentra.</p>
<p>Las preguntas multisalto no se ajustan a ese patrón. Tomemos una pregunta como <em>"¿Qué efectos secundarios debo tener en cuenta con los fármacos de primera línea para la diabetes?"</em> en una base de conocimientos médicos.</p>
<p>Para responderla hay que seguir dos pasos de razonamiento. En primer lugar, el sistema debe saber que la metformina es el fármaco de primera línea para la diabetes. Sólo entonces puede buscar los efectos secundarios de la metformina: control de la función renal, molestias gastrointestinales, déficit de vitamina B12.</p>
<p>"Metformina" es la entidad puente. Conecta la pregunta con la respuesta, pero la pregunta nunca la menciona.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahí es donde se detiene <a href="https://zilliz.com/learn/vector-similarity-search">la búsqueda de similitudes de Vector</a>. Recupera pasajes que se parecen a la pregunta, guías de tratamiento de la diabetes y listas de efectos secundarios de los medicamentos, pero no puede seguir las relaciones entre entidades que unen esos pasajes. Hechos como "la metformina es el fármaco de primera línea para la diabetes" viven en esas relaciones, no en el texto de un solo pasaje.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Por qué las bases de datos de grafos y la RAG agéntica no son la solución<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>Las formas estándar de resolver la RAG multisalto son las bases de datos de grafos y los bucles iterativos de agentes. Ambas funcionan. Ambas cuestan más de lo que la mayoría de los equipos quieren pagar por una única función.</p>
<p>Primero, opta por la base de datos de grafos. Se extraen las tripletas de los documentos, se almacenan en una base de datos de grafos y se recorren las aristas para encontrar conexiones multisalto. Esto significa ejecutar un segundo sistema junto a la <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a>, aprender Cypher o Gremlin, y mantener sincronizados los almacenes gráfico y vectorial.</p>
<p>Los bucles de agente iterativos son el otro enfoque. El LLM recupera un lote, razona sobre él, decide si tiene suficiente contexto y lo recupera de nuevo en caso contrario. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) realiza entre 3 y 5 llamadas al LLM por consulta. La RAG agenética puede superar las 10 porque el agente decide cuándo parar. El coste por consulta se vuelve impredecible, y la latencia P99 aumenta cada vez que el agente ejecuta rondas adicionales.</p>
<p>Ninguno de los dos se ajusta a los equipos que quieren razonamiento multisalto sin reconstruir su pila. Así que probamos otra cosa.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Qué es Vector Graph RAG, una estructura gráfica dentro de una base de datos vectorial<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> es una biblioteca Python de código abierto que lleva el razonamiento multisalto a <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> utilizando únicamente <a href="https://milvus.io/docs">Milvus</a>. Almacena la estructura del grafo como referencias ID a través de tres colecciones Milvus. El recorrido se convierte en una cadena de búsquedas de claves primarias en Milvus en lugar de consultas Cypher contra una base de datos de grafos. Un Milvus hace ambos trabajos.</p>
<p>Funciona porque las relaciones en un grafo de conocimiento son sólo texto. El triple <em>(que es metformina, el fármaco de primera línea para la diabetes de tipo 2)</em> es una arista dirigida en una base de datos gráfica. También es una frase: "La metformina es el fármaco de primera línea para la diabetes tipo 2". Puede incrustar esa frase como un vector y almacenarla en <a href="https://milvus.io/docs">Milvus</a>, igual que cualquier otro texto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Responder a una consulta multisalto significa seguir conexiones desde lo que menciona la consulta (como "diabetes") hasta lo que no menciona (como "metformina"). Eso sólo funciona si el almacenamiento conserva esas conexiones: qué entidad se conecta a qué a través de qué relación. El texto plano se puede buscar, pero no seguir.</p>
<p>Para que las conexiones puedan seguirse en Milvus, damos a cada entidad y a cada relación un ID único, y luego las almacenamos en colecciones separadas que se referencian entre sí por ID. Tres colecciones en total: <strong>entidades</strong> (los nodos), <strong>relaciones</strong> (las aristas) y <strong>pasajes</strong> (el texto fuente, que el LLM necesita para generar respuestas). Cada fila tiene una incrustación vectorial, por lo que podemos realizar búsquedas semánticas en cualquiera de las tres.</p>
<p>Las<strong>entidades</strong> almacenan entidades deduplicadas. Cada una tiene un identificador único, un <a href="https://zilliz.com/glossary/vector-embeddings">vector</a> de <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a> y una lista de identificadores de relaciones en las que participa.</p>
<table>
<thead>
<tr><th>id</th><th>nombre</th><th>incrustación</th><th>relación_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformina</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>diabetes tipo 2</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>función renal</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>Las relaciones</strong> almacenan tripletas de conocimiento. Cada una registra sus ID de entidad sujeto y objeto, los ID de pasaje de los que procede y una incrustación del texto completo de la relación.</p>
<table>
<thead>
<tr><th>id</th><th>subject_id</th><th>object_id</th><th>texto</th><th>incrustación</th><th>pasaje_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>La metformina es el fármaco de primera línea para la diabetes tipo 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Los pacientes que toman metformina deben tener controlada la función renal</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Los pasajes</strong> almacenan trozos de documentos originales, con referencias a las entidades y relaciones extraídas de ellos.</p>
<p>Las tres colecciones se relacionan entre sí a través de campos ID: las entidades llevan los ID de sus relaciones, las relaciones llevan los ID de sus entidades sujeto y objeto y de los pasajes fuente, y los pasajes llevan los ID de todo lo que se extrae de ellos. Esa red de referencias ID es el grafo.</p>
<p>Recorrerlo no es más que una cadena de búsquedas de ID. Se busca la entidad e01 para obtener su <code translate="no">relation_ids</code>, se buscan las relaciones r01 y r02 por esos ID, se lee el <code translate="no">object_id</code> de r01 para descubrir la entidad e02, y así sucesivamente. Cada salto es una <a href="https://milvus.io/docs/get-and-scalar-query.md">consulta</a> Milvus estándar <a href="https://milvus.io/docs/get-and-scalar-query.md">de clave primaria</a>. No se necesita Cypher.</p>
<p>Puede que te preguntes si los viajes de ida y vuelta adicionales a Milvus tienen sentido. No es así. La expansión del subgrafo cuesta 2-3 consultas basadas en ID con un total de 20-30ms. La llamada LLM tarda de 1 a 3 segundos, lo que hace que las búsquedas de ID sean invisibles a su lado.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Cómo responde la RAG a una consulta multisalto<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>El flujo de recuperación lleva una consulta multisalto a una respuesta fundamentada en cuatro pasos: <strong>recuperación de semillas → expansión de subgrafos → LLM rerank → generación de respuestas.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Examinaremos la pregunta sobre la diabetes: <em>"¿Qué efectos secundarios debo tener en cuenta con los fármacos de primera línea para la diabetes?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Paso 1: Recuperación de semillas</h3><p>Un LLM extrae entidades clave de la pregunta: "diabetes", "efectos secundarios", "fármaco de primera línea". La búsqueda vectorial en Milvus encuentra directamente las entidades y relaciones más relevantes.</p>
<p>Pero la metformina no está entre ellas. La pregunta no la menciona, por lo que la búsqueda vectorial no puede encontrarla.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Paso 2: Expansión de subgrafos</h3><p>Aquí es donde Vector Graph RAG diverge de la RAG estándar.</p>
<p>El sistema sigue las referencias ID de las entidades semilla un salto hacia fuera. Obtiene los ID de las entidades semilla, encuentra todas las relaciones que contienen esos ID y extrae los ID de las nuevas entidades en el subgrafo. Por defecto: un salto.</p>
<p><strong>Metformina, la entidad puente, entra en el subgrafo.</strong></p>
<p>"Diabetes" tiene una relación: <em>"La metformina es el fármaco de primera línea para la diabetes tipo 2".</em> Siguiendo esa arista entra la metformina. Una vez que la metformina está en el subgrafo, sus propias relaciones vienen con ella: <em>"Los pacientes que toman metformina deben tener controlada la función renal", "La metformina puede causar molestias gastrointestinales", "El uso prolongado de metformina puede provocar deficiencia de vitamina B12".</em></p>
<p>Dos hechos que vivían en pasajes separados están ahora conectados a través de un salto de expansión del gráfico. La entidad puente que la pregunta nunca mencionó es ahora descubrible.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Paso 3: LLM Rerank</h3><p>La expansión le deja con docenas de relaciones candidatas. La mayoría son ruido.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>El sistema envía estos candidatos y la pregunta original a un LLM: "¿Cuáles se relacionan con los efectos secundarios de los fármacos de primera línea para la diabetes?". Es una llamada sin iteración.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Las relaciones seleccionadas cubren la cadena completa: diabetes → metformina → monitorización renal / molestias GI / deficiencia de B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Paso 4: Generación de respuestas</h3><p>El sistema recupera los pasajes originales de las relaciones seleccionadas y los envía al LLM.</p>
<p>El LLM genera a partir del texto completo del pasaje, no de los triples recortados. Las triplas son resúmenes comprimidos. Carecen del contexto, las advertencias y los detalles que el LLM necesita para producir una respuesta fundamentada.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Vea Vector Graph RAG en acción</h3><p>También hemos creado una interfaz interactiva que visualiza cada paso. Haga clic en el panel de pasos de la izquierda y el gráfico se actualizará en tiempo real: naranja para los nodos semilla, azul para los nodos expandidos, verde para las relaciones seleccionadas. Esto hace que el flujo de recuperación sea concreto en lugar de abstracto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Por qué un cambio de clasificación es mejor que varias iteraciones<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestro proceso realiza dos llamadas LLM por consulta: una para la clasificación y otra para la generación. Los sistemas iterativos como IRCoT y Agentic RAG realizan de 3 a más de 10 llamadas porque realizan un bucle: recuperar, razonar, recuperar de nuevo. Nosotros nos saltamos el bucle porque la búsqueda vectorial y la expansión de subgrafos cubren tanto la similitud semántica como las conexiones estructurales en una sola pasada, lo que proporciona al LLM suficientes candidatos para terminar en un solo rerank.</p>
<table>
<thead>
<tr><th>Enfoque</th><th>Llamadas al LLM por consulta</th><th>Perfil de latencia</th><th>Coste relativo de la API</th></tr>
</thead>
<tbody>
<tr><td>Gráfico vectorial RAG</td><td>2 (rerank + generar)</td><td>Fijo, predecible</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variable</td><td>~2-3x</td></tr>
<tr><td>Agentic RAG</td><td>5-10+</td><td>Imprevisible</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>En producción, esto supone aproximadamente un 60% menos de coste de API, respuestas 2-3 veces más rápidas y latencia predecible. Sin picos sorpresa cuando un agente decide ejecutar rondas adicionales.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Resultados de las pruebas<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG obtiene una media del 87,8% de Recall@5 en tres pruebas de control de calidad multisalto estándar, igualando o superando a todos los métodos que probamos, incluido HippoRAG 2, con sólo Milvus y 2 llamadas LLM.</p>
<p>Evaluamos MuSiQue (2-4 saltos, el más difícil), HotpotQA (2 saltos, el más utilizado) y 2WikiMultiHopQA (2 saltos, razonamiento entre documentos). La métrica es Recall@5: si los pasajes de apoyo correctos aparecen en los 5 primeros resultados recuperados.</p>
<p>Utilizamos exactamente las mismas triplas pre-extraídas del <a href="https://github.com/OSU-NLP-Group/HippoRAG">repositorio HippoRAG</a> para una comparación justa. Sin reextracción ni preprocesamiento personalizado. La comparación aísla el propio algoritmo de recuperación.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Gráfico vectorial R</a> AG frente a RAG estándar (ingenuo)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG eleva el promedio de Recall@5 del 73,4% al 87,8%, lo que supone una mejora de 19,6 puntos porcentuales.</p>
<ul>
<li>MuSiQue: mayor aumento (+31,4 puntos porcentuales). La prueba de 3-4 saltos, las preguntas multisalto más difíciles y exactamente donde la expansión de subgrafos tiene el mayor impacto.</li>
<li>2WikiMultiHopQA: fuerte mejora (+27,7 puntos porcentuales). Razonamiento entre documentos, otro punto dulce para la expansión de subgrafos.</li>
<li>HotpotQA: mejora menor (+6,1 puntos), pero el RAG estándar ya obtiene una puntuación del 90,8% en este conjunto de datos. El techo es bajo.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">RAG de gráficos</a> vectoriales frente a los métodos más avanzados (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG obtiene la puntuación media más alta con un 87,8% frente a HippoRAG 2, IRCoT y NV-Embed-v2.</p>
<p>Comparativa por comparativa:</p>
<ul>
<li>HotpotQA: empata con HippoRAG 2 (ambos 96,3%)</li>
<li>2WikiMultiHopQA: gana por 3,7 puntos (94,1% frente a 90,4%)</li>
<li>MuSiQue (el más difícil): se queda atrás por 1,7 puntos (73,0% frente a 74,7%)</li>
</ul>
<p>Vector Graph RAG alcanza estas cifras con sólo 2 llamadas LLM por consulta, sin base de datos de grafos y sin ColBERTv2. Se ejecuta en la infraestructura más sencilla de la comparación y aún así obtiene la media más alta.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Comparación de <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> con otros enfoques de Graph RAG<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Diferentes enfoques Graph RAG optimizan para diferentes problemas. Vector Graph RAG está diseñado para la garantía de calidad multisalto en producción con un coste predecible y una infraestructura sencilla.</p>
<table>
<thead>
<tr><th></th><th>GraphRAG de Microsoft</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infraestructura</strong></td><td>Graph DB + vector DB</td><td>ColBERTv2 + gráfico en memoria</td><td>DB vectorial + agentes multirronda</td><td><strong>Sólo Milvus</strong></td></tr>
<tr><td><strong>Llamadas LLM por consulta</strong></td><td>Varía</td><td>Moderado</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Lo mejor para</strong></td><td>Resumen global de corpus</td><td>Recuperación académica detallada</td><td>Exploración compleja y abierta</td><td><strong>Control de calidad multisalto de producción</strong></td></tr>
<tr><td><strong>Problemas de escala</strong></td><td>Indexación LLM costosa</td><td>Gráfico completo en memoria</td><td>Latencia y coste impredecibles</td><td><strong>Escala con Milvus</strong></td></tr>
<tr><td><strong>Complejidad de configuración</strong></td><td>Alta</td><td>Media-alta</td><td>Media</td><td><strong>Baja (instalación pip)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> utiliza la agrupación jerárquica de comunidades para responder a preguntas de resumen global como "¿cuáles son los temas principales de este corpus? Es un problema distinto al de la GC multisalto&quot;.</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) utiliza recuperación de inspiración cognitiva con correspondencia a nivel de token ColBERTv2. Cargar el grafo completo en memoria limita la escalabilidad.</p>
<p>Los enfoques iterativos como <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> cambian la simplicidad de la infraestructura por el coste LLM y una latencia impredecible.</p>
<p>Vector Graph RAG se dirige a la garantía de calidad multisalto de producción: equipos que desean un coste y una latencia predecibles sin añadir una base de datos de grafos.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Cuándo utilizar Vector Graph RAG y casos de uso clave<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG está diseñado para cuatro tipos de cargas de trabajo:</p>
<table>
<thead>
<tr><th>Escenario</th><th>Por qué se adapta</th></tr>
</thead>
<tbody>
<tr><td><strong>Documentos densos en conocimiento</strong></td><td>Códigos legales con referencias cruzadas, literatura biomédica con cadenas fármaco-gen-enfermedad, archivos financieros con enlaces empresa-persona-acontecimiento, documentos técnicos con gráficos de dependencia API.</td></tr>
<tr><td><strong>Preguntas de 2-4 saltos</strong></td><td>Las preguntas de un salto funcionan bien con el GAR estándar. Cinco o más saltos pueden requerir métodos iterativos. El rango de 2-4 saltos es el punto óptimo para la expansión de subgrafos.</td></tr>
<tr><td><strong>Despliegue sencillo</strong></td><td>Una base de datos, <code translate="no">pip install</code>, sin infraestructura gráfica que aprender</td></tr>
<tr><td><strong>Sensibilidad al coste y la latencia</strong></td><td>Dos llamadas LLM por consulta, fijas y predecibles. Con miles de consultas diarias, la diferencia es considerable.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Introducción a Vector Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> sin argumentos utiliza por defecto <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Crea un archivo local <code translate="no">.db</code>, como SQLite. No hay que iniciar ningún servidor ni configurar nada.</p>
<p><code translate="no">add_texts()</code> Llama a un LLM para extraer triplas de su texto, las vectoriza y almacena todo en Milvus. <code translate="no">query()</code> ejecuta el flujo de recuperación completo de cuatro pasos: sembrar, expandir, reordenar, generar.</p>
<p>Para la producción, cambia un parámetro URI. El resto del código es el mismo:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Para importar PDF, páginas web o archivos de Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
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
    </button></h2><p>Graph RAG no necesita una base de datos de grafos. Vector Graph RAG almacena la estructura del grafo como referencias de ID en tres colecciones Milvus, lo que convierte el recorrido del grafo en búsquedas de clave primaria y mantiene cada consulta multisalto en dos llamadas LLM fijas.</p>
<p>De un vistazo:</p>
<ul>
<li>Biblioteca Python de código abierto. Razonamiento multisalto sólo en Milvus.</li>
<li>Tres colecciones vinculadas por ID. Entidades (nodos), relaciones (aristas), pasajes (texto fuente). La expansión de subgrafos sigue los ID para descubrir entidades puente que la consulta no menciona.</li>
<li>Dos llamadas LLM por consulta. Un reanálisis, una generación. Sin iteración.</li>
<li>87,8% Recall@5 de media en MuSiQue, HotpotQA y 2WikiMultiHopQA, igualando o superando a HippoRAG 2 en dos de tres.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Pruébalo:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> para el código</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Docs</a> para la API completa y ejemplos</li>
<li>Únete a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">en Discord</a> para hacer preguntas y compartir comentarios</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión de Milvus Office Hours</a> para analizar su caso de uso.</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> ofrece un nivel gratuito con Milvus gestionado si prefiere omitir la configuración de la infraestructura</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">PREGUNTAS FRECUENTES<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">¿Puedo hacer Graph RAG sólo con una base de datos vectorial?</h3><p>Sí. Vector Graph RAG almacena la estructura del grafo de conocimiento (entidades, relaciones y sus conexiones) dentro de tres colecciones Milvus vinculadas por referencias cruzadas de ID. En lugar de recorrer las aristas de una base de datos de grafos, encadena búsquedas de claves primarias en Milvus para expandir un subgrafo alrededor de las entidades semilla. De este modo, se consigue un promedio de 87,8% de Recall@5 en tres pruebas estándar multisalto sin ninguna infraestructura de base de datos de grafos.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">¿En qué se diferencia Vector Graph RAG de Microsoft GraphRAG?</h3><p>Resuelven problemas diferentes. Microsoft GraphRAG utiliza la agrupación jerárquica de comunidades para el resumen global de corpus ("¿Cuáles son los temas principales de estos documentos?"). Vector Graph RAG se centra en la respuesta a preguntas multisalto, donde el objetivo es encadenar hechos específicos a través de pasajes. Vector Graph RAG sólo necesita Milvus y dos llamadas LLM por consulta. Microsoft GraphRAG requiere una base de datos de grafos y conlleva mayores costes de indexación.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">¿Qué tipo de preguntas se benefician de la GAR multisalto?</h3><p>La RAG multisalto ayuda con las preguntas cuya respuesta depende de la conexión de información dispersa en varios pasajes, especialmente cuando una entidad clave nunca aparece en la pregunta. Algunos ejemplos son "¿Qué efectos secundarios tiene el fármaco de primera línea para la diabetes?". (requiere descubrir la metformina como puente), búsquedas de referencias cruzadas en textos legales o normativos, y rastreo de cadenas de dependencia en documentación técnica. La GAR estándar maneja bien las búsquedas de un solo dato. La RAG multisalto añade valor cuando la ruta de razonamiento tiene entre dos y cuatro pasos.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">¿Tengo que extraer manualmente las tripletas del grafo de conocimiento?</h3><p>No. <code translate="no">add_texts()</code> y <code translate="no">add_documents()</code> llaman automáticamente a un LLM para extraer entidades y relaciones, vectorizarlas y almacenarlas en Milvus. Puede importar documentos desde URLs, PDFs y archivos DOCX utilizando la herramienta integrada <code translate="no">DocumentImporter</code>. Para la evaluación comparativa o la migración, la biblioteca soporta la importación de tripletas pre-extraídas de otros marcos como HippoRAG.</p>
