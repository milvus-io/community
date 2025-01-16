---
id: dynamic-data-update-and-query-milvus.md
title: Preparación
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: La búsqueda de vectores es ahora más intuitiva y cómoda
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Cómo Milvus implementa la actualización y consulta dinámica de datos</custom-h1><p>En este artículo, describiremos principalmente cómo se registran los datos vectoriales en la memoria de Milvus, y cómo se mantienen estos registros.</p>
<p>A continuación se presentan nuestros principales objetivos de diseño:</p>
<ol>
<li>La eficiencia de la importación de datos debe ser alta.</li>
<li>Los datos pueden ser vistos tan pronto como sea posible después de la importación de datos.</li>
<li>Evitar la fragmentación de los archivos de datos.</li>
</ol>
<p>Por lo tanto, hemos establecido un búfer de memoria (búfer de inserción) para insertar datos con el fin de reducir el número de cambios de contexto de IO aleatorio en el disco y el sistema operativo para mejorar el rendimiento de la inserción de datos. La arquitectura de almacenamiento en memoria basada en MemTable y MemTableFile nos permite gestionar y serializar los datos de forma más cómoda. El estado de la memoria intermedia se divide en mutable e inmutable, lo que permite persistir los datos en el disco mientras se mantienen disponibles los servicios externos.</p>
<h2 id="Preparation" class="common-anchor-header">Preparación<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando el usuario está listo para insertar un vector en Milvus, primero necesita crear una Colección (* Milvus cambia el nombre de Tabla a Colección en la versión 0.7.0). La Colección es la unidad más básica para registrar y buscar vectores en Milvus.</p>
<p>Cada Colección tiene un nombre único y algunas propiedades que pueden establecerse, y los vectores se insertan o buscan basándose en el nombre de la Colección. Al crear una nueva Colección, Milvus registrará la información de esta Colección en los metadatos.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Inserción de datos<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando el usuario envía una solicitud para insertar datos, los datos se serializan y deserializan para llegar al servidor Milvus. A continuación, los datos se escriben en la memoria. La escritura en memoria se divide aproximadamente en los siguientes pasos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-insercion-datos-milvus.png</span> </span></p>
<ol>
<li>En MemManager, busque o cree una nueva MemTable correspondiente al nombre de la colección. Cada MemTable corresponde a una memoria intermedia de la colección.</li>
<li>Un MemTable contendrá uno o más MemTableFile. Cada vez que creemos un nuevo MemTableFile, grabaremos esta información en la Meta al mismo tiempo. Dividimos los MemTableFile en dos estados: Mutable e Inmutable. Cuando el tamaño de MemTableFile alcance el umbral, se convertirá en Inmutable. Cada MemTable sólo puede tener un MemTableFile Mutable para escribir en cualquier momento.</li>
<li>Los datos de cada MemTableFile se grabarán finalmente en la memoria en el formato del tipo de índice establecido. MemTableFile es la unidad más básica para la gestión de datos en memoria.</li>
<li>En cualquier momento, el uso de memoria de los datos insertados no superará el valor preestablecido (insert_buffer_size). Esto se debe a que cada vez que llega una petición de inserción de datos, el MemManager puede calcular fácilmente la memoria ocupada por el MemTableFile contenido en cada MemTable, y luego coordinar la petición de inserción de acuerdo con la memoria actual.</li>
</ol>
<p>Gracias a la arquitectura multinivel de MemManager, MemTable y MemTableFile, la inserción de datos puede gestionarse y mantenerse mejor. Por supuesto, pueden hacer mucho más que eso.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Consulta casi en tiempo real<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>En Milvus, sólo hay que esperar un segundo como máximo para que los datos insertados pasen de la memoria al disco. Todo este proceso puede resumirse a grandes rasgos en la siguiente imagen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-consulta-en-tiempo-casi-real-milvus.png</span> </span></p>
<p>En primer lugar, los datos insertados entrarán en un búfer de inserción en memoria. El búfer cambiará periódicamente del estado Mutable inicial al estado Inmutable en preparación para la serialización. Luego, estos búferes Inmutables serán serializados al disco periódicamente por el hilo de serialización en segundo plano. Una vez colocados los datos, la información del pedido se registrará en los metadatos. En este punto, ¡los datos pueden ser buscados!</p>
<p>Ahora describiremos en detalle los pasos de la imagen.</p>
<p>Ya conocemos el proceso de inserción de datos en el buffer mutable. El siguiente paso es pasar del buffer mutable al buffer inmutable:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-buffer-mutable-buffer-inmutable-milvus.png</span> </span></p>
<p>La cola inmutable proporcionará al hilo de serialización en segundo plano el estado inmutable y el MemTableFile listo para ser serializado. Cada MemTable gestiona su propia cola inmutable, y cuando el tamaño del único MemTableFile mutable de la MemTable alcanza el umbral, entrará en la cola inmutable. Un hilo en segundo plano responsable de ToImmutable extraerá periódicamente todos los MemTableFiles de la cola inmutable gestionada por MemTable y los enviará a la cola inmutable total. Debe tenerse en cuenta que las dos operaciones de escribir datos en la memoria y cambiar los datos en la memoria a un estado que no puede ser escrito no pueden ocurrir al mismo tiempo, y se requiere un bloqueo común. Sin embargo, la operación de ToImmutable es muy simple y casi no causa ningún retraso, por lo que el impacto en el rendimiento de los datos insertados es mínimo.</p>
<p>El siguiente paso es serializar el MemTableFile en la cola de serialización a disco. Esto se divide principalmente en tres pasos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>En primer lugar, el hilo de serialización en segundo plano extraerá periódicamente MemTableFile de la cola inmutable. A continuación, se serializan en archivos raw de tamaño fijo (Raw TableFiles). Por último, registraremos esta información en los metadatos. Cuando realicemos una búsqueda vectorial, consultaremos el TableFile correspondiente en los metadatos. A partir de aquí, se pueden realizar búsquedas en estos datos.</p>
<p>Además, de acuerdo con el conjunto index_file_size, después de que el hilo de serialización complete un ciclo de serialización, fusionará algunos TableFiles de tamaño fijo en un TableFile, y también registrará esta información en los metadatos. En este momento, el TableFile puede ser indexado. La creación de índices también es asíncrona. Otro subproceso en segundo plano responsable de la creación de índices leerá periódicamente el FicheroTabla en el estado ToIndex de los metadatos para realizar la correspondiente creación de índices.</p>
<h2 id="Vector-search" class="common-anchor-header">Búsqueda vectorial<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>De hecho, con la ayuda de TableFile y los metadatos, la búsqueda vectorial resulta más intuitiva y cómoda. En general, tenemos que obtener los ArchivosTabla correspondientes a la Colección consultada a partir de los metadatos, buscar en cada ArchivoTabla y, por último, fusionar. En este artículo, no profundizamos en la implementación específica de la búsqueda.</p>
<p>Si desea saber más, ¡le invitamos a leer nuestro código fuente, o a leer nuestros otros artículos técnicos sobre Milvus!</p>
