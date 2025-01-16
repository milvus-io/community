---
id: deep-dive-2-milvus-sdk-and-api.md
title: Introducción a Milvus Python SDK y API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Aprenda cómo los SDK interactúan con Milvus y por qué la API de estilo ORM le
  ayuda a gestionar mejor Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<p>Por <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Fondo<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>La siguiente ilustración muestra la interacción entre los SDK y Milvus a través de gRPC. Imaginemos que Milvus es una caja negra. Los búferes de protocolo se utilizan para definir las interfaces del servidor y la estructura de la información que transportan. Por lo tanto, todas las operaciones en la caja negra Milvus están definidas por la API de Protocolo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interacción</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">API de protocolo de Milvus<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>La API de Protocolo Milvus consiste en <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, y <code translate="no">schema.proto</code>, que son archivos de Buffers de Protocolo con el sufijo <code translate="no">.proto</code>. Para garantizar un funcionamiento correcto, los SDKs deben interactuar con Milvus con estos archivos Protocol Buffers.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> es el componente vital de la API de protocolo de Milvus porque define <code translate="no">MilvusService</code>, que a su vez define todas las interfaces RPC de Milvus.</p>
<p>El siguiente ejemplo de código muestra la interfaz <code translate="no">CreatePartitionRequest</code>. Tiene dos parámetros principales de tipo cadena <code translate="no">collection_name</code> y <code translate="no">partition_name</code>, en base a los cuales puede iniciar una petición de creación de partición.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Comprueba un ejemplo de Protocolo en <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub Repository</a> en la línea 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Ejemplo</span> </span></p>
<p>Puedes encontrar la definición de <code translate="no">CreatePartitionRequest</code> aquí.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Definición</span> </span></p>
<p>Los contribuidores que deseen desarrollar una característica de Milvus o un SDK en un lenguaje de programación diferente son bienvenidos para encontrar todas las interfaces que Milvus ofrece vía RPC.</p>
<h3 id="commonproto" class="common-anchor-header">común.proto</h3><p><code translate="no">common.proto</code> define los tipos comunes de información, incluyendo <code translate="no">ErrorCode</code>, y <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> define el esquema en los parámetros. La siguiente muestra de código es un ejemplo de <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, y <code translate="no">schema.proto</code> juntos constituyen la API de Milvus, representando todas las operaciones que pueden ser llamadas vía RPC.</p>
<p>Si escarba en el código fuente y observa detenidamente, descubrirá que cuando se llama a interfaces como <code translate="no">create_index</code>, en realidad se llama a múltiples interfaces RPC como <code translate="no">describe_collection</code> y <code translate="no">describe_index</code>. Muchas de las interfaces externas de Milvus son una combinación de múltiples interfaces RPC.</p>
<p>Habiendo entendido los comportamientos de RPC, puede desarrollar nuevas características para Milvus a través de la combinación. Usted es más que bienvenido a usar su imaginación y creatividad y contribuir a la comunidad Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Mapeo objeto-relacional (ORM)</h3><p>Para decirlo en pocas palabras, el mapeo objeto-relacional (ORM) se refiere a que cuando se opera sobre un objeto local, tales operaciones afectarán al objeto correspondiente en el servidor. La API estilo ORM de PyMilvus presenta las siguientes características:</p>
<ol>
<li>Opera directamente sobre los objetos.</li>
<li>Aísla la lógica del servicio y los detalles de acceso a los datos.</li>
<li>Oculta la complejidad de la implementación, y puede ejecutar los mismos scripts a través de diferentes instancias Milvus independientemente de sus enfoques de despliegue o implementación.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API de estilo ORM</h3><p>Una de las esencias de la API de estilo ORM reside en el control de la conexión de Milvus. Por ejemplo, puede especificar alias para múltiples servidores Milvus, y conectarse o desconectarse de ellos simplemente con sus alias. Incluso puede eliminar la dirección del servidor local, y controlar ciertos objetos a través de una conexión específica precisamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Conexión de control</span> </span></p>
<p>Otra característica de la API de estilo ORM es que, tras la abstracción, todas las operaciones pueden realizarse directamente sobre los objetos, incluyendo la colección, la partición y el índice.</p>
<p>Puede abstraer un objeto de colección obteniendo uno existente o creando uno nuevo. También puede asignar una conexión Milvus a objetos específicos utilizando alias de conexión, de modo que pueda operar sobre estos objetos localmente.</p>
<p>Para crear un objeto partición, puede crearlo con su objeto colección padre, o puede hacerlo igual que cuando crea un objeto colección. Estos métodos también se pueden emplear en un objeto índice.</p>
<p>En el caso de que estos objetos partición o índice existan, puedes obtenerlos a través de su objeto colección padre.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, orquestamos esta serie de blogs Milvus Deep Dive para proporcionar una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
