---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Comprender el nivel de coherencia en la base de datos de vectores Milvus
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Conozca los cuatro niveles de consistencia - fuerte, estancamiento limitado,
  sesión y eventual - soportados en la base de datos vectorial Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagen_de_portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/JackLCL">Chenglong Li</a> y transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>¿Te has preguntado alguna vez por qué a veces los datos que has borrado de la base de datos vectorial de Mlivus siguen apareciendo en los resultados de búsqueda?</p>
<p>Una razón muy probable es que no haya configurado el nivel de consistencia adecuado para su aplicación. El nivel de consistencia en una base de datos vectorial distribuida es crítico, ya que determina en qué momento una escritura de datos concreta puede ser leída por el sistema.</p>
<p>Por lo tanto, este artículo pretende desmitificar el concepto de consistencia y profundizar en los niveles de consistencia soportados por la base de datos vectorial Milvus.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#What-is-consistency">Qué es la consistencia</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Cuatro niveles de consistencia en la base de datos vectorial Milvus</a><ul>
<li><a href="#Strong">Fuerte</a></li>
<li><a href="#Bounded-staleness">Estancamiento limitado</a></li>
<li><a href="#Session">Sesión</a></li>
<li><a href="#Eventual">Eventual</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">Qué es la consistencia<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de empezar, es necesario aclarar la connotación de consistencia en este artículo, ya que la palabra "consistencia" es un término sobrecargado en la industria informática. La consistencia en una base de datos distribuida se refiere específicamente a la propiedad que asegura que cada nodo o réplica tiene la misma visión de los datos cuando escribe o lee datos en un momento dado. Por tanto, aquí hablamos de consistencia como en el <a href="https://en.wikipedia.org/wiki/CAP_theorem">teorema CAP</a>.</p>
<p>Para dar servicio a las grandes empresas en línea del mundo moderno, se suelen adoptar múltiples réplicas. Por ejemplo, el gigante del comercio electrónico Amazon replica los datos de sus pedidos o SKU en varios centros de datos, zonas o incluso países para garantizar una alta disponibilidad del sistema en caso de caída o fallo del mismo. Esto plantea un reto al sistema: la coherencia de los datos en las múltiples réplicas. Sin consistencia, es muy probable que el artículo eliminado de su cesta de Amazon reaparezca, lo que causaría una muy mala experiencia al usuario.</p>
<p>De ahí que necesitemos distintos niveles de coherencia de datos para distintas aplicaciones. Y por suerte, Milvus, una base de datos para IA, ofrece flexibilidad en el nivel de consistencia y puede establecer el nivel de consistencia que mejor se adapte a su aplicación.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Consistencia en la base de datos vectorial Milvus</h3><p>El concepto de nivel de consistencia se introdujo por primera vez con el lanzamiento de Milvus 2.0. La versión 1.0 de Milvus no era una base de datos vectorial distribuida, por lo que entonces no incluíamos niveles ajustables de consistencia. Milvus 1.0 vacía los datos cada segundo, lo que significa que los nuevos datos son visibles casi inmediatamente después de su inserción y Milvus lee la vista de datos más actualizada en el momento exacto en que llega una solicitud de búsqueda o consulta de similitud vectorial.</p>
<p>Sin embargo, Milvus fue refactorizado en su versión 2.0 y <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 es una base de datos vectorial distribuida</a> basada en un mecanismo pub-sub. El teorema <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> señala que un sistema distribuido debe establecer un equilibrio entre consistencia, disponibilidad y latencia. Además, diferentes niveles de consistencia sirven para diferentes escenarios. Por lo tanto, el concepto de consistencia se introdujo en <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> y admite el ajuste de los niveles de consistencia.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Cuatro niveles de consistencia en la base de datos vectorial Milvus<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus admite cuatro niveles de consistencia: fuerte, estancamiento limitado, sesión y eventual. Y un usuario de Milvus puede especificar el nivel de consistencia cuando <a href="https://milvus.io/docs/v2.1.x/create_collection.md">crea una colección</a> o realiza una <a href="https://milvus.io/docs/v2.1.x/search.md">búsqueda</a> o <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a> <a href="https://milvus.io/docs/v2.1.x/search.md">de similitud vectorial</a>. Esta sección continuará explicando en qué se diferencian estos cuatro niveles de consistencia y para qué escenario son los más adecuados.</p>
<h3 id="Strong" class="common-anchor-header">Fuerte</h3><p>Fuerte es el nivel de coherencia más alto y estricto. Garantiza que los usuarios puedan leer la última versión de los datos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Fuerte</span> </span></p>
<p>Según el teorema PACELC, si el nivel de consistencia se establece en fuerte, la latencia aumentará. Por lo tanto, recomendamos elegir un nivel de consistencia fuerte durante las pruebas funcionales para garantizar la precisión de los resultados de las pruebas. Y la consistencia fuerte también es la más adecuada para aplicaciones que tienen una demanda estricta de consistencia de datos a costa de la velocidad de búsqueda. Un ejemplo puede ser un sistema financiero en línea que se ocupe del pago y la facturación de pedidos.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Estancamiento limitado</h3><p>El estancamiento limitado, como su nombre indica, permite la inconsistencia de los datos durante un cierto periodo de tiempo. Sin embargo, por lo general, los datos siempre son globalmente coherentes fuera de ese periodo de tiempo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Estancamiento_limitado</span> </span></p>
<p>El estancamiento limitado es adecuado para escenarios que necesitan controlar la latencia de la búsqueda y pueden aceptar la invisibilidad esporádica de los datos. Por ejemplo, en sistemas de recomendación como los motores de recomendación de vídeo, la invisibilidad de datos de vez en cuando tiene un impacto realmente pequeño en la tasa de recuperación general, pero puede aumentar significativamente el rendimiento del sistema de recomendación. Un ejemplo puede ser una aplicación para seguir el estado de tus pedidos online.</p>
<h3 id="Session" class="common-anchor-header">Sesión</h3><p>La sesión garantiza que todas las escrituras de datos puedan percibirse inmediatamente en lecturas durante la misma sesión. En otras palabras, cuando se escriben datos a través de un cliente, los datos recién insertados se convierten instantáneamente en lecturas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Sesión</span> </span></p>
<p>Recomendamos elegir sesión como nivel de consistencia para aquellos escenarios en los que la demanda de consistencia de datos en la misma sesión es alta. Un ejemplo puede ser la eliminación de los datos de una entrada de libro del sistema de la biblioteca, y después de confirmar la eliminación y actualizar la página (una sesión diferente), el libro ya no debería ser visible en los resultados de búsqueda.</p>
<h3 id="Eventual" class="common-anchor-header">Eventual</h3><p>No hay un orden garantizado de lecturas y escrituras, y las réplicas convergen eventualmente al mismo estado dado que no se realizan más operaciones de escritura. Bajo consistencia eventual, las réplicas comienzan a trabajar en las peticiones de lectura con los últimos valores actualizados. La consistencia eventual es el nivel más débil de los cuatro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Eventual</span> </span></p>
<p>Sin embargo, según el teorema PACELC, la latencia de búsqueda puede reducirse enormemente si se sacrifica la consistencia. Por lo tanto, la consistencia eventual es la más adecuada para situaciones en las que no hay una gran demanda de consistencia de datos, pero se requiere un rendimiento de búsqueda rapidísimo. Un ejemplo puede ser la recuperación de reseñas y valoraciones de productos de Amazon con consistencia eventual.</p>
<h2 id="Endnote" class="common-anchor-header">Nota final<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Volviendo a la pregunta planteada al principio de este artículo, los datos borrados siguen apareciendo como resultados de búsqueda porque el usuario no ha elegido el nivel de consistencia adecuado. El valor por defecto para el nivel de consistencia es "bounded staleness" (<code translate="no">Bounded</code>) en la base de datos vectorial Milvus. Por lo tanto, la lectura de datos podría retrasarse y Milvus podría leer la vista de datos antes de que usted realizara operaciones de borrado durante una búsqueda o consulta de similitud. Sin embargo, este problema es sencillo de resolver. Todo lo que tiene que hacer es <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">ajustar el nivel de coherencia</a> al crear una colección o realizar una búsqueda o consulta de similitud vectorial. Muy sencillo.</p>
<p>En la próxima entrada, desvelaremos el mecanismo que hay detrás y explicaremos cómo la base de datos vectorial Milvus alcanza diferentes niveles de consistencia. Permanezca atento.</p>
<h2 id="Whats-next" class="common-anchor-header">Lo que viene a continuación<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
