---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Elección de una base de datos vectorial para la búsqueda de RNA en Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  Este post describe el proceso que utilizó el equipo de Reddit para seleccionar
  su base de datos vectorial más adecuada y por qué eligieron Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Este artículo ha sido escrito por Chris Fournie, ingeniero de software de Reddit, y publicado originalmente en</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>.</p>
<p>En 2024, los equipos de Reddit utilizaron diversas soluciones para realizar búsquedas vectoriales por aproximación al vecino más cercano (RNA). Desde la <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">búsqueda vectorial de IA Vertex</a> de Google y experimentando con el uso de <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">la búsqueda vectorial de RNA de Apache Solr</a> para algunos conjuntos de datos más grandes, hasta la <a href="https://github.com/facebookresearch/faiss">biblioteca FAISS</a> de Facebook para conjuntos de datos más pequeños (alojados en carros laterales escalados verticalmente). Cada vez más equipos de Reddit querían una solución de búsqueda vectorial de RNA ampliamente compatible que fuera rentable, tuviera las características de búsqueda que deseaban y pudiera escalar a datos del tamaño de Reddit. Para responder a esta necesidad, en 2025 buscamos la base de datos vectorial ideal para los equipos de Reddit.</p>
<p>Este post describe el proceso que utilizamos para seleccionar la mejor base de datos vectorial para las necesidades actuales de Reddit. No describe la mejor base de datos vectorial en general, ni el conjunto más esencial de requisitos funcionales y no funcionales para todas las situaciones. Describe lo que Reddit y su cultura de ingeniería valoraron y priorizaron al seleccionar una base de datos vectorial. Este post puede servir de inspiración para su propia recopilación y evaluación de requisitos, pero cada organización tiene su propia cultura, valores y necesidades.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Proceso de evaluación<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>En general, los pasos de selección fueron</p>
<p>1. 1. Recopilar el contexto de los equipos</p>
<p>2. Evaluar cualitativamente las soluciones</p>
<p>3. 3. Evaluar cuantitativamente a los principales contendientes</p>
<p>4. Selección final</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Recopilación del contexto de los equipos</h3><p>Se recopilaron tres elementos de contexto de los equipos interesados en realizar búsquedas vectoriales de RNA:</p>
<ul>
<li><p>Requisitos funcionales (por ejemplo, ¿búsqueda vectorial y léxica híbrida? ¿Consultas de búsqueda por rango? ¿Filtrado por atributos no vectoriales?)</p></li>
<li><p>Requisitos no funcionales (por ejemplo, ¿puede admitir vectores 1B? ¿puede alcanzar una latencia P99 &lt;100 ms?).</p></li>
<li><p>Las bases de datos vectoriales ya interesaban a los equipos</p></li>
</ul>
<p>Entrevistar a los equipos en busca de requisitos no es trivial. Muchos describirán sus necesidades en términos de cómo están resolviendo actualmente un problema, y su reto es comprender y eliminar ese sesgo.</p>
<p>Por ejemplo, un equipo ya utilizaba FAISS para la búsqueda vectorial de RNA y afirmó que la nueva solución debía devolver de forma eficiente 10.000 resultados por llamada de búsqueda. Tras una discusión más profunda, la razón de los 10.000 resultados era que necesitaban realizar un filtrado post-hoc, y FAISS no ofrece filtrado de resultados de RNA en el momento de la consulta. Su problema real era que necesitaban filtrar, por lo que cualquier solución que ofreciera un filtrado eficaz sería suficiente, y devolver 10.000 resultados era simplemente una solución provisional necesaria para mejorar la recuperación. Lo ideal sería prefiltrar toda la colección antes de encontrar los vecinos más próximos.</p>
<p>Preguntar por las bases de datos vectoriales que los equipos ya utilizaban o en las que estaban interesados también fue valioso. Si al menos un equipo tenía una opinión positiva de su solución actual, es señal de que la base de datos vectorial podría ser una solución útil para compartir en toda la empresa. Si los equipos sólo tenían opiniones negativas de una solución, entonces no deberíamos incluirla como opción. Aceptar soluciones en las que los equipos estaban interesados también era una forma de asegurarnos de que los equipos se sentían incluidos en el proceso y nos ayudó a formar una lista inicial de los principales contendientes a evaluar; hay demasiadas soluciones de búsqueda vectorial de RNA en bases de datos nuevas y existentes como para probarlas todas exhaustivamente.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Evaluar cualitativamente las soluciones</h3><p>Partiendo de la lista de soluciones en las que estaban interesados los equipos, para evaluar cualitativamente qué solución de búsqueda vectorial de RNA se ajustaba mejor a nuestras necesidades:</p>
<ul>
<li><p>Investigamos cada solución y puntuamos lo bien que cumplía cada requisito frente a la importancia ponderada de dicho requisito.</p></li>
<li><p>Eliminamos soluciones basándonos en criterios cualitativos y en el debate.</p></li>
<li><p>Seleccionamos las N mejores soluciones para probarlas cuantitativamente.</p></li>
</ul>
<p>Nuestra lista inicial de soluciones de búsqueda vectorial de RNA incluía:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Búsqueda abierta</p></li>
<li><p>Pgvector (ya utiliza Postgres como RDBMS)</p></li>
<li><p>Redis (ya se utiliza como almacén y caché de KV)</p></li>
<li><p>Cassandra (ya se utiliza para la búsqueda noANN)</p></li>
<li><p>Solr (ya se utiliza para la búsqueda léxica y se ha experimentado con la búsqueda vectorial)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (ya utilizado para la búsqueda vectorial RNA)</p></li>
</ul>
<p>A continuación, tomamos todos los requisitos funcionales y no funcionales que mencionaron los equipos, además de algunas restricciones más que representaban nuestros valores y objetivos de ingeniería, hicimos esas filas en una hoja de cálculo y ponderamos su importancia (de 1 a 3; se muestra en la tabla abreviada a continuación).</p>
<p>Para cada solución que comparábamos, evaluábamos (en una escala de 0 a 3) lo bien que cada sistema satisfacía ese requisito (como se muestra en la tabla siguiente). Esta forma de puntuar era un tanto subjetiva, por lo que elegimos un sistema y dimos ejemplos de puntuaciones con una justificación por escrito y pedimos a los revisores que se remitieran a esos ejemplos. También dimos la siguiente orientación para asignar cada valor de puntuación: asigne este valor si:</p>
<ul>
<li><p>0: No hay apoyo/evidencia de apoyo a los requisitos</p></li>
<li><p>1: Apoyo básico o inadecuado del requisito</p></li>
<li><p>2: Requisito razonablemente apoyado</p></li>
<li><p>3: Apoyo sólido a los requisitos que va más allá de soluciones comparables.</p></li>
</ul>
<p>A continuación, creamos una puntuación global para cada solución sumando el producto de la puntuación de un requisito de la solución y la importancia de ese requisito (por ejemplo, Qdrant puntuó 3 para la combinación de re-clasificación/puntuación, que tiene una importancia de 2, por lo que 3 x 2 = 6, se repite para todas las filas y se suman). Al final, tenemos una puntuación global que se puede utilizar como base para clasificar y discutir soluciones, y qué requisitos son más importantes (tenga en cuenta que la puntuación no se utiliza para tomar una decisión final, sino como una herramienta de discusión).</p>
<p><strong><em>Nota del editor:</em></strong> <em>Esta reseña se basó en Milvus 2.4. Desde entonces hemos lanzado Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>, y Milvus 3.0 está a la vuelta de la esquina, por lo que algunos números pueden estar desfasados. Aun así, la comparación sigue siendo muy útil.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Categoría</strong></td><td><strong>Importancia</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Tipo de búsqueda</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Búsqueda híbrida</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Búsqueda por palabra clave</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Búsqueda aproximada NN</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Alcance Búsqueda</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Reordenación/combinación de puntuaciones</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Método de indexación</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Admite varios métodos de indexación</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Cuantización</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Hashing sensible a la localidad (LSH)</td><td>1</td><td>0</td><td>0Nota: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 lo soporta. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Datos</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tipos de vector distintos de float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Atributos de metadatos en vectores (admite múltiples atributos, un gran tamaño de registro, etc.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Opciones de filtrado de metadatos (puede filtrar por metadatos, tiene filtrado previo y posterior)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Tipos de datos de atributos de metadatos (esquema sólido, por ejemplo, bool, int, string, json, arrays)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Límites de atributos de metadatos (consultas de rango, por ejemplo, 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversidad de resultados por atributo (por ejemplo, no obtener más de N resultados de cada subreddit en una respuesta)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Escala</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Índice vectorial de cientos de millones</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Índice vectorial de miles de millones</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Vectores soporte al menos 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Vectores soporte superiores a 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latencia 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latencia &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99,9% disponibilidad recuperación</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99,99% de disponibilidad indexación/almacenamiento</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operaciones de almacenamiento</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hospedable en AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-Región</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Actualizaciones sin tiempo de inactividad</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Nube múltiple</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>API/Bibliotecas</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>API RESTful</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Ir a la biblioteca</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Biblioteca Java</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Otros lenguajes (C++, Ruby, etc.)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operaciones en tiempo de ejecución</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Métricas de Prometheus</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Operaciones básicas de BD</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upserts</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Operador de Kubernetes</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Paginación de los resultados</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Incrustación de búsqueda por ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Devuelve Embeddings con ID de candidato y puntuaciones de candidato</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ID suministrado por el usuario</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Capaz de buscar en un contexto de lotes a gran escala</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Copias de seguridad / Instantáneas: permite crear copias de seguridad de toda la base de datos.</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Soporte eficiente de grandes índices (distinción entre almacenamiento en frío y en caliente)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Apoyo/Comunidad</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Neutralidad de los proveedores</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Sólido soporte api</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Apoyo a proveedores</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Velocidad comunitaria</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Base de usuarios de producción</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Sentimiento comunitario</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Estrellas de Github</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Configuración</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Manejo de secretos</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Fuente</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Fuente abierta</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Idioma</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Liberaciones</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pruebas previas</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Disponibilidad de documentación</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Coste</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Coste Efectivo</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Rendimiento</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Soporte para ajustar la utilización de recursos de CPU, memoria y disco</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Fragmentación multinodo (pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Capacidad de ajustar el sistema para equilibrar latencia y rendimiento</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Partición definida por el usuario (escrituras)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multiinquilino</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Partición</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replicación</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redundancia</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Conmutación automática por error</td><td>3</td><td>2</td><td>0 Nota: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 lo soporta. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Equilibrio de carga</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Soporte GPU</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Puntuación global de las soluciones</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Debatimos las puntuaciones generales y por requisitos de los distintos sistemas y tratamos de entender si habíamos ponderado adecuadamente la importancia de los requisitos y si algunos de ellos eran tan importantes que debían considerarse limitaciones básicas. Uno de los requisitos que identificamos fue si la solución era de código abierto o no, porque deseábamos una solución con la que pudiéramos involucrarnos, a la que pudiéramos contribuir y que solucionara rápidamente pequeños problemas si los experimentábamos a nuestra escala. Contribuir y utilizar software de código abierto es una parte importante de la cultura de ingeniería de Reddit. Esto eliminó las soluciones alojadas (Vertex AI, Pinecone) de nuestra consideración.</p>
<p>Durante las discusiones, nos dimos cuenta de que algunos otros requisitos clave eran de gran importancia para nosotros:</p>
<ul>
<li><p>Escala y fiabilidad: queríamos ver pruebas de otras empresas que utilizaran la solución con más de 100 millones de vectores o incluso 1.000 millones.</p></li>
<li><p>Comunidad: Queríamos una solución con una comunidad saludable con mucho ímpetu en este espacio de rápida maduración</p></li>
<li><p>Tipos de metadatos expresivos y filtrado para permitir más de nuestros casos de uso (filtrado por fecha, booleano, etc.)</p></li>
<li><p>Compatibilidad con múltiples tipos de índices (no sólo HNSW o DiskANN) para adaptar mejor el rendimiento a nuestros numerosos y exclusivos casos de uso.</p></li>
</ul>
<p>El resultado de nuestros debates y el perfeccionamiento de los requisitos clave nos llevaron a elegir probar (por orden) cuantitativamente:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa y</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Por desgracia, este tipo de decisiones requieren tiempo y recursos, y ninguna organización dispone de una cantidad ilimitada de ambos. Dado nuestro presupuesto, decidimos probar Qdrant y Milvus, y dejar las pruebas de Vespa y Weviate como objetivos a largo plazo.</p>
<p>Qdrant frente a Milvus fue también una prueba interesante de dos arquitecturas diferentes:</p>
<ul>
<li><p><strong>Qdrant:</strong> Tipos de nodos homogéneos que realizan todas las operaciones de la base de datos vectorial de RNA.</p></li>
<li><p><strong>Milvus</strong>: <a href="https://milvus.io/docs/architecture_overview.md">Tipos de nodos heterogéneos</a> (Milvus; uno para consultas, otro para indexación, otro para ingesta de datos, un proxy, etc.)</p></li>
</ul>
<p>¿Cuál fue fácil de configurar (una prueba de su documentación)? ¿Cuál era fácil de ejecutar (una prueba de sus características de resistencia y pulido)? ¿Y cuál funcionaba mejor para los casos de uso y la escala que nos interesaban? Estas son las preguntas que tratamos de responder al comparar cuantitativamente las soluciones.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Evaluar cuantitativamente a los principales contendientes</h3><p>Queríamos comprender mejor el grado de escalabilidad de cada solución y, de paso, experimentar cómo sería instalar, configurar, mantener y ejecutar cada una de ellas a gran escala. Para ello, recopilamos tres conjuntos de datos de documentos y vectores de consulta para tres casos de uso diferentes, configuramos cada solución con recursos similares dentro de Kubernetes, cargamos documentos en cada solución y enviamos cargas de consulta idénticas utilizando <a href="https://k6.io/">K6 de Grafana</a> con un ejecutor de tasa de llegada de rampa para calentar los sistemas antes de alcanzar un rendimiento objetivo (por ejemplo, 100 QPS).</p>
<p>Probamos el rendimiento, el punto de ruptura de cada solución, la relación entre rendimiento y latencia, y cómo reaccionan a la pérdida de nodos bajo carga (tasa de error, impacto de latencia, etc.). Lo más interesante fue el <strong>efecto del filtrado en la latencia</strong>. También realizamos pruebas simples de sí/no para verificar que una capacidad de la documentación funcionaba tal y como se describía (por ejemplo, upserts, delete, get by ID, administración de usuarios, etc.) y para experimentar la ergonomía de esas API.</p>
<p><strong>Las pruebas se realizaron en Milvus v2.4 y Qdrant v1.12.</strong> Debido a las limitaciones de tiempo, no ajustamos ni probamos exhaustivamente todos los tipos de configuraciones de índices; se utilizaron configuraciones similares con cada solución, con un sesgo hacia una alta recuperación de RNA, y las pruebas se centraron en el rendimiento de los índices HNSW. También se asignaron recursos de CPU y memoria similares a cada solución.</p>
<p>En nuestra experimentación, encontramos algunas diferencias interesantes entre las dos soluciones. En los siguientes experimentos, cada solución tenía aproximadamente 340M de postvectores Reddit de 384 dimensiones cada uno, para HNSW, M=16, y efConstruction=100.</p>
<p>En un experimento, descubrimos que para el mismo rendimiento de consulta (100 QPS sin ingestión al mismo tiempo), añadir filtrado afectaba más a la latencia de Milvus que a la de Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Puestos de latencia de consulta con filtrado</p>
<p>Por otro lado, observamos que la interacción entre la ingesta y la carga de consulta era mucho mayor en Qdrant que en Milvus (como se muestra a continuación con un rendimiento constante). Esto se debe probablemente a su arquitectura; Milvus divide gran parte de su ingesta en tipos de nodos separados de los que sirven al tráfico de consulta, mientras que Qdrant sirve tanto a la ingesta como al tráfico de consulta desde los mismos nodos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Puestos de latencia de consulta a 100 QPS durante la ingesta</p>
<p>Al probar la diversidad de resultados por atributo (por ejemplo, no obtener más de N resultados de cada subreddit en una respuesta), descubrimos que para el mismo rendimiento, Milvus tenía peor latencia que Qdrant (a 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latencia posterior a la consulta con diversidad de resultados</p>
<p>También queríamos ver la eficacia de cada solución cuando se añadían más réplicas de datos (es decir, el factor de replicación, RF, se incrementaba de 1 a 2). Inicialmente, con RF=1, Qdrant fue capaz de ofrecernos una latencia satisfactoria a cambio de un mayor rendimiento que Milvus (no se muestran los QPS más altos porque las pruebas no se completaron sin errores).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant presenta una latencia RF=1 para un rendimiento variable</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus registra una latencia RF=1 para un rendimiento variable.</p>
<p>Sin embargo, al aumentar el factor de replicación, la latencia p99 de Qdrant mejoró, pero Milvus fue capaz de mantener un mayor rendimiento que Qdrant, con una latencia aceptable (Qdrant 400 QPS no se muestra porque la prueba no se completó debido a la alta latencia y los errores).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus registra una latencia RF=2 para un rendimiento variable</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant registra una latencia RF=2 para un rendimiento variable.</p>
<p>Debido a las limitaciones de tiempo, no tuvimos tiempo suficiente para comparar la recuperación de la RNA entre soluciones en nuestros conjuntos de datos, pero sí tuvimos en cuenta las mediciones de recuperación de la RNA para soluciones proporcionadas por <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> en conjuntos de datos disponibles públicamente.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Selección final</h3><p><strong>En cuanto al rendimiento</strong>, sin mucho ajuste y utilizando únicamente HNSW, Qdrant parecía tener mejor latencia bruta en muchas pruebas que Milvus. Sin embargo, Milvus parecía escalar mejor con un aumento de la replicación y tenía un mejor aislamiento entre la carga de ingesta y la de consulta debido a su arquitectura de nodos múltiples.</p>
<p><strong>Desde el punto de vista operativo,</strong> a pesar de la complejidad de la arquitectura de Milvus (múltiples tipos de nodos, dependencia de un registro externo de escritura anticipada como Kafka y un almacén de metadatos como etcd), nos resultó más fácil depurar y reparar Milvus que Qdrant cuando cualquiera de las dos soluciones entraba en mal estado. Milvus también tiene un reequilibrio automático al aumentar el factor de replicación de una colección, mientras que en Qdrant de código abierto, se requiere la creación manual o la eliminación de fragmentos para aumentar el factor de replicación (una característica que habríamos tenido que construir nosotros mismos o utilizar la versión que no es de código abierto).</p>
<p>Milvus es una tecnología más "en forma de Reddit" que Qdrant; comparte más similitudes con el resto de nuestra pila tecnológica. Milvus está escrito en Golang, nuestro lenguaje de programación backend preferido, y por lo tanto es más fácil para nosotros contribuir que Qdrant, que está escrito en Rust. Milvus tiene una velocidad de proyecto excelente para su oferta de código abierto en comparación con Qdrant, y cumplía más de nuestros requisitos clave.</p>
<p>Al final, ambas soluciones cumplían la mayoría de nuestros requisitos y, en algunos casos, Qdrant tenía una ventaja de rendimiento, pero pensamos que podíamos escalar más Milvus, nos sentíamos más cómodos ejecutándolo y se adaptaba mejor a nuestra organización que Qdrant. Nos hubiera gustado disponer de más tiempo para probar Vespa y Weaviate, pero es posible que también los hubiéramos seleccionado por su adecuación a la organización (Vespa se basa en Java) y su arquitectura (Weaviate es de tipo nodo único, como Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Puntos clave<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Desafía los requisitos que te dan e intenta eliminar los prejuicios existentes sobre las soluciones.</p></li>
<li><p>Puntúa las soluciones candidatas y utilízalas para fundamentar el debate sobre los requisitos esenciales, no como una regla de oro.</p></li>
<li><p>Evalúe cuantitativamente las soluciones, pero a lo largo del proceso, tome nota de cómo es trabajar con la solución.</p></li>
<li><p>Elija la solución que mejor se adapte a su organización desde el punto de vista del mantenimiento, el coste, la facilidad de uso y el rendimiento, y no sólo porque sea la mejor.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Agradecimientos<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Este trabajo de evaluación ha sido realizado por Ben Kochie, Charles Njoroge, Amit Kumar y yo. Gracias también a otras personas que han contribuido a este trabajo, como Annie Yang, Konrad Reiche, Sabrina Kong y Andrew Johnson, por la investigación cualitativa de soluciones.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Notas del editor<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Queremos agradecer sinceramente al equipo de ingeniería de Reddit, no sólo por elegir Milvus para sus cargas de trabajo de búsqueda vectorial, sino por tomarse el tiempo de publicar una evaluación tan detallada y justa. Es raro ver este nivel de transparencia en la forma en que los equipos de ingeniería reales comparan las bases de datos, y su escrito será útil para cualquier persona en la comunidad Milvus (y más allá) que está tratando de dar sentido al creciente panorama de las bases de datos vectoriales.</p>
<p>Como Chris menciona en el post, no existe una única "mejor" base de datos vectorial. Lo que importa es si un sistema se adapta a tu carga de trabajo, limitaciones y filosofía operativa. La comparación de Reddit refleja bien esa realidad. Milvus no encabeza todas las categorías, y eso es totalmente esperable dadas las compensaciones entre los diferentes modelos de datos y objetivos de rendimiento.</p>
<p>Vale la pena aclarar una cosa: La evaluación de Reddit utilizó <strong>Milvus 2.4</strong>, que era la versión estable en ese momento. Algunas características - como LSH y varias optimizaciones de índice - no existían todavía o no estaban maduras en 2.4, por lo que algunas puntuaciones reflejan naturalmente esa línea de base más antigua. Desde entonces, hemos lanzado Milvus 2.5 y luego <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>, y es un sistema muy diferente en términos de rendimiento, eficiencia y flexibilidad. La respuesta de la comunidad ha sido fuerte y muchos equipos ya se han actualizado.</p>
<p><strong>He aquí un rápido vistazo a las novedades de Milvus 2.6:</strong></p>
<ul>
<li><p>Hasta <strong>un 72% menos de uso de memoria</strong> y <strong>consultas 4 veces más rápidas</strong> con la cuantización RaBitQ de 1 bit.</p></li>
<li><p><strong>Reducción de costes del 50%</strong> con almacenamiento inteligente por niveles</p></li>
<li><p><strong>Búsqueda de texto completo BM25 4 veces más rápida</strong> en comparación con Elasticsearch</p></li>
<li><p><strong>Filtrado JSON 100 veces más rápido</strong> con el nuevo Path Index</p></li>
<li><p>Una nueva arquitectura de disco cero para búsquedas más frescas a menor coste</p></li>
<li><p>Un flujo de trabajo "data-in, data-out" más sencillo para la integración de pipelines</p></li>
<li><p>Compatibilidad con <strong>más de 100.000 colecciones</strong> para gestionar grandes entornos multiusuario.</p></li>
</ul>
<p>Si desea conocer el desglose completo, aquí tiene un par de buenos artículos de seguimiento:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Notas de la versión de Milvus 2.6: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Benchmarking del mundo real para bases de datos vectoriales - Milvus Blog</a></p></li>
</ul>
<p>¿Tiene alguna pregunta o desea profundizar en alguna función? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
