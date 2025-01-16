---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Comprender el nivel de coherencia en la base de datos Milvus Vector - Parte II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Anatomía del mecanismo que subyace a los niveles de coherencia ajustables en
  la base de datos vectorial Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagen_de_portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/longjiquan">Jiquan Long</a> y transcreado por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>En el <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">blog anterior</a> sobre consistencia, hemos explicado cuál es la connotación de la consistencia en una base de datos vectorial distribuida, hemos cubierto los cuatro niveles de consistencia - fuerte, estancamiento limitado, sesión y eventual - soportados en la base de datos vectorial Milvus, y hemos explicado el escenario de aplicación más adecuado para cada nivel de consistencia.</p>
<p>En este artículo, seguiremos examinando el mecanismo que permite a los usuarios de la base de datos vectorial Milvus elegir con flexibilidad el nivel de consistencia ideal para diversos escenarios de aplicación. También proporcionaremos un tutorial básico sobre cómo ajustar el nivel de consistencia en la base de datos vectorial Milvus.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">El mecanismo de marca de tiempo subyacente</a></li>
<li><a href="#Guarantee-timestamp">Marca de tiempo de garantía</a></li>
<li><a href="#Consistency-levels">Niveles de consistencia</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">¿Cómo ajustar el nivel de consistencia en Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">El mecanismo de marca de tiempo subyacente<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utiliza el mecanismo de marca de tiempo para garantizar diferentes niveles de consistencia cuando se realiza una búsqueda o consulta vectorial. Time Tick es la marca de agua de Milvus que actúa como un reloj en Milvus y significa en qué punto del tiempo se encuentra el sistema Milvus. Cada vez que se envía una solicitud de lenguaje de manipulación de datos (DML) a la base de datos vectorial Milvus, asigna una marca de tiempo a la solicitud. Como se muestra en la siguiente figura, cuando se insertan nuevos datos en la cola de mensajes, por ejemplo, Milvus no sólo marca una marca de tiempo en estos datos insertados, sino que también inserta marcas de tiempo a intervalos regulares.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>marca de tiempo</span> </span></p>
<p>Tomemos como ejemplo <code translate="no">syncTs1</code> en la figura anterior. Cuando los consumidores posteriores, como los nodos de consulta, ven <code translate="no">syncTs1</code>, los componentes consumidores entienden que todos los datos insertados antes de <code translate="no">syncTs1</code> se han consumido. En otras palabras, las solicitudes de inserción de datos cuyos valores de marca de tiempo sean inferiores a <code translate="no">syncTs1</code> dejarán de aparecer en la cola de mensajes.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Marca de tiempo de garantía<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se ha mencionado en la sección anterior, los componentes consumidores posteriores, como los nodos de consulta, obtienen continuamente mensajes de solicitudes de inserción de datos y marcas de tiempo de la cola de mensajes. Cada vez que se consume un tick de tiempo, el nodo de consulta marcará este tick de tiempo consumido como tiempo útil - <code translate="no">ServiceTime</code> y todos los datos insertados antes de <code translate="no">ServiceTime</code> son visibles para el nodo de consulta.</p>
<p>Además de <code translate="no">ServiceTime</code>, Milvus también adopta un tipo de marca de tiempo - marca de tiempo de garantía (<code translate="no">GuaranteeTS</code>) para satisfacer la necesidad de varios niveles de consistencia y disponibilidad por parte de diferentes usuarios. Esto significa que los usuarios de la base de datos vectorial Milvus pueden especificar <code translate="no">GuaranteeTs</code> para informar a los nodos de consulta de que todos los datos anteriores a <code translate="no">GuaranteeTs</code> deben ser visibles e intervenir cuando se realice una búsqueda o consulta.</p>
<p>Suele haber dos escenarios cuando el nodo de consulta ejecuta una petición de búsqueda en la base de datos vectorial Milvus.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Escenario 1: Ejecutar la petición de búsqueda inmediatamente</h3><p>Como se muestra en la siguiente figura, si <code translate="no">GuaranteeTs</code> es menor que <code translate="no">ServiceTime</code>, los nodos de consulta pueden ejecutar la petición de búsqueda inmediatamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>ejecutar_inmediatamente</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Escenario 2: Esperar hasta que "ServiceTime &gt; GuaranteeTs"</h3><p>Si <code translate="no">GuaranteeTs</code> es mayor que <code translate="no">ServiceTime</code>, los nodos de consulta deben seguir consumiendo time tick de la cola de mensajes. Las peticiones de búsqueda no pueden ejecutarse hasta que <code translate="no">ServiceTime</code> sea mayor que <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Niveles de coherencia<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Por lo tanto, el <code translate="no">GuaranteeTs</code> es configurable en la petición de búsqueda para alcanzar el nivel de consistencia especificado por usted. Un <code translate="no">GuaranteeTs</code> con un valor grande asegura <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">una fuerte consistencia</a> a costa de una alta latencia de búsqueda. Y un <code translate="no">GuaranteeTs</code> con un valor pequeño reduce la latencia de búsqueda pero la visibilidad de los datos se ve comprometida.</p>
<p><code translate="no">GuaranteeTs</code> en Milvus es un formato de marca de tiempo híbrido. Y el usuario no tiene ni idea del <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> dentro de Milvus. Por lo tanto, especificar el valor de<code translate="no">GuaranteeTs</code> es una tarea demasiado complicada para los usuarios. Para ahorrar problemas a los usuarios y proporcionarles una experiencia óptima, Milvus sólo requiere que los usuarios elijan el nivel de consistencia específico, y la base de datos vectorial de Milvus gestionará automáticamente el valor de <code translate="no">GuaranteeTs</code> para los usuarios. Es decir, el usuario de Milvus sólo tiene que elegir entre los cuatro niveles de consistencia: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, y <code translate="no">Eventually</code>. Y cada uno de los niveles de consistencia corresponde a un determinado valor <code translate="no">GuaranteeTs</code>.</p>
<p>La siguiente figura ilustra el <code translate="no">GuaranteeTs</code> para cada uno de los cuatro niveles de consistencia en la base de datos vectorial Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>garantía_ts</span> </span></p>
<p>La base de datos vectorial Milvus admite cuatro niveles de consistencia:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> se establece en el mismo valor que la última marca de tiempo del sistema, y los nodos de consulta esperan hasta que el tiempo de servicio proceda a la última marca de tiempo del sistema para procesar la solicitud de búsqueda o consulta.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>Para omitir la comprobación de coherencia: <code translate="no">GuaranteeTs</code> se establece en un valor insignificantemente inferior a la última marca de tiempo del sistema para omitir la comprobación de coherencia. Los nodos de consulta buscan inmediatamente en la vista de datos existente.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> se establece en un valor relativamente menor que la última marca de tiempo del sistema, y los nodos de consulta buscan en una vista de datos tolerablemente menos actualizada.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: El cliente utiliza la marca de tiempo de la última operación de escritura como <code translate="no">GuaranteeTs</code> para que cada cliente pueda al menos recuperar los datos insertados por sí mismo.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">¿Cómo ajustar el nivel de consistencia en Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus permite ajustar el nivel de consistencia cuando se <a href="https://milvus.io/docs/v2.1.x/create_collection.md">crea una colección</a> o se realiza una <a href="https://milvus.io/docs/v2.1.x/search.md">búsqueda</a> o <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Realizar una búsqueda de similitud vectorial</h3><p>Para realizar una búsqueda de similitud vectorial con el nivel de consistencia que desee, simplemente establezca el valor para el parámetro <code translate="no">consistency_level</code> como <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, o <code translate="no">Eventually</code>. Si no establece el valor para el parámetro <code translate="no">consistency_level</code>, el nivel de consistencia será <code translate="no">Bounded</code> por defecto. El ejemplo realiza una búsqueda de similitud vectorial con la consistencia <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Realizar una consulta vectorial</h3><p>De forma similar a la realización de una búsqueda de similitud vectorial, puede especificar el valor para el parámetro <code translate="no">consistency_level</code> al realizar una consulta vectorial. En el ejemplo se realiza una consulta vectorial con la coherencia <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Próximos pasos<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el lanzamiento oficial de Milvus 2.1, hemos preparado una serie de blogs presentando las nuevas características. Lea más en esta serie de blogs:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cómo utilizar datos de cadenas para potenciar sus aplicaciones de búsqueda por similitud</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Uso de Milvus integrado para instalar y ejecutar Milvus con Python de forma instantánea</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente el rendimiento de lectura de su base de datos vectorial con réplicas en memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprender el nivel de consistencia en la base de datos vectorial Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprender el nivel de consistencia en la base de datos vectorial de Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">¿Cómo Garantiza la Seguridad de los Datos la Base de Datos Vectorial de Milvus?</a></li>
</ul>
