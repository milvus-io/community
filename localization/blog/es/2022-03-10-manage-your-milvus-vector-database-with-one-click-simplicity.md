---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Gestione su base de datos vectorial Milvus con un solo clic.
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - una herramienta GUI para Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog Imagen de portada</span> </span></p>
<p>Borrador de <a href="https://github.com/czhen-zilliz">Zhen Chen</a> y transcreación de <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Haga clic <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">aquí</a> para consultar el post original.</p> 
<p>Ante el rápido crecimiento de la demanda de procesamiento de datos no estructurados, Milvus 2.0 destaca. Se trata de un sistema de base de datos vectorial orientado a la IA y diseñado para escenarios de producción masiva. Aparte de todos estos SDK de Milvus y de Milvus CLI, una interfaz de línea de comandos para Milvus, ¿existe alguna herramienta que permita a los usuarios manejar Milvus de forma más intuitiva? La respuesta es SÍ. Zilliz ha anunciado una interfaz gráfica de usuario - Attu - específica para Milvus. En este artículo, nos gustaría mostrarle paso a paso cómo realizar una búsqueda de similitud vectorial con Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>La isla Attu</span> </span></p>
<p>En comparación con Milvus CLI, que aporta la máxima simplicidad de uso, Attu ofrece más:</p>
<ul>
<li>Instaladores para los sistemas operativos Windows, macOS y Linux;</li>
<li>GUI intuitiva para facilitar el uso de Milvus;</li>
<li>Cobertura de las principales funcionalidades de Milvus;</li>
<li>Plugins para ampliar las funcionalidades personalizadas;</li>
<li>Información completa sobre la topología del sistema para facilitar la comprensión y la administración de la instancia de Milvus.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Instalación<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Puede encontrar la versión más reciente de Attu en <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu ofrece instaladores ejecutables para diferentes sistemas operativos. Es un proyecto de código abierto y acepta contribuciones de todo el mundo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Instalación</span> </span></p>
<p>También puedes instalar Attu a través de Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> es la dirección IP del entorno donde se ejecuta Attu, y <code translate="no">milvus server IP</code> es la dirección IP del entorno donde se ejecuta Milvus.</p>
<p>Una vez instalado Attu correctamente, puede introducir la IP y el puerto de Milvus en la interfaz para iniciar Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Conectar Milvus con Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Resumen de características<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Página general</span> </span></p>
<p>La interfaz de Attu se compone de la página de <strong>Visión General</strong>, la página de <strong>Colecciones</strong>, la página de <strong>Búsqueda de Vectores</strong> y la página de <strong>Vista del Sistema</strong>, que corresponden a los cuatro iconos del panel de navegación de la izquierda respectivamente.</p>
<p>La página <strong>Descripción general</strong> muestra las colecciones cargadas. Mientras que la página <strong>Colección</strong> enumera todas las colecciones e indica si están cargadas o liberadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Página de colecciones</span> </span></p>
<p>Las páginas <strong>Búsqueda vectorial</strong> y <strong>Vista del sistema</strong> son plugins de Attu. Los conceptos y el uso de los plugins se introducirán en la parte final del blog.</p>
<p>Puede realizar una búsqueda de similitudes vectoriales en la página <strong>Búsqueda</strong> vectorial.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Página de búsqueda de vectores</span> </span></p>
<p>En la página <strong>System View</strong>, puede comprobar la estructura topológica de Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Página Vista del sistema</span> </span></p>
<p>También puede comprobar la información detallada de cada nodo haciendo clic en el nodo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Vista de nodos</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Demostración<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Exploremos Attu con un conjunto de datos de prueba.</p>
<p>Consulte nuestro <a href="https://github.com/zilliztech/attu/tree/main/examples">repositorio de GitHub</a> para obtener el conjunto de datos utilizado en la siguiente prueba.</p>
<p>En primer lugar, cree una colección llamada test con los siguientes cuatro campos:</p>
<ul>
<li>Nombre de campo: id, campo de clave primaria</li>
<li>Nombre de campo: vector, campo vectorial, vector flotante, Dimensión: 128</li>
<li>Nombre del campo: brand, campo escalar, Int64</li>
<li>Nombre de campo: color, campo escalar, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Crear una colección</span> </span></p>
<p>Cargue la colección para la búsqueda después de que se haya creado correctamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Cargar la colección</span> </span></p>
<p>Ahora puede comprobar la colección recién creada en la página <strong>Descripción general</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Comprobar la colección</span> </span></p>
<p>Importe el conjunto de datos de prueba a Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar datos</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar datos</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar datos</span> </span></p>
<p>Haga clic en el nombre de la colección en la página Descripción general o Colección para acceder a la interfaz de consulta y comprobar los datos importados.</p>
<p>Añada un filtro, especifique la expresión <code translate="no">id != 0</code>, haga clic en <strong>Aplicar filtro</strong> y haga clic en <strong>Consulta</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Consultar datos</span> </span></p>
<p>Encontrará que las cincuenta entradas de entidades se han importado correctamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Resultado de la consulta</span> </span></p>
<p>Probemos la búsqueda por similitud vectorial.</p>
<p>Copie un vector de <code translate="no">search_vectors.csv</code> y péguelo en el campo <strong>Valor del vector</strong>. Elija la colección y el campo. Haga clic en <strong>Buscar</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Buscar datos</span> </span></p>
<p>A continuación, puede comprobar el resultado de la búsqueda. Sin compilar ningún script, puede buscar con Milvus fácilmente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Resultado de la búsqueda</span> </span></p>
<p>Por último, comprobemos la página <strong>Vista del sistema</strong>.</p>
<p>Con la API de métricas encapsulada en Milvus Node.js SDK, puede comprobar el estado del sistema, las relaciones entre nodos y el estado de los nodos.</p>
<p>Como característica exclusiva de Attu, la página Vista del sistema incluye un gráfico topológico completo del sistema. Haciendo clic en cada nodo, puede comprobar su estado (actualización cada 10 segundos).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Gráfico topológico de nodos Milvus</span> </span></p>
<p>Haga clic en cada nodo para acceder a la <strong>vista de lista de nodos</strong>. Puede comprobar todos los nodos hijos de un nodo coord. Clasificando, puede identificar rápidamente los nodos con alto uso de CPU o memoria, y localizar el problema del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Lista de nodos Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">Y más<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se ha mencionado anteriormente, las páginas <strong>Búsqueda vectorial</strong> y <strong>Vista del sistema</strong> son plugins de Attu. Animamos a los usuarios a desarrollar sus propios plugins en Attu para adaptarse a sus escenarios de aplicación. En el código fuente, hay una carpeta creada específicamente para los códigos de los plugins.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Plugins</span> </span></p>
<p>Puede consultar cualquiera de los plugins para aprender a crear un plugin. Estableciendo el siguiente archivo de configuración, puede añadir el plugin a Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Añadir plugins a Attu</span> </span></p>
<p>Puede consultar <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> y <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus Technical Document</a> para obtener instrucciones detalladas.</p>
<p>Attu es un proyecto de código abierto. Todas las contribuciones son bienvenidas. También puede <a href="https://github.com/zilliztech/attu/issues">enviar una incidencia</a> si tiene algún problema con Attu.</p>
<p>Esperamos sinceramente que Attu pueda ofrecerle una mejor experiencia de usuario con Milvus. Y si te gusta Attu, o tienes alguna opinión sobre el uso, puedes completar esta <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Encuesta de Usuario Attu</a> para ayudarnos a optimizar Attu para una mejor experiencia de usuario.</p>
