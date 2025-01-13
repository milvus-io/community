---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Empezar a utilizar Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: Este artículo presenta Milvus_CLI y le ayuda a completar tareas comunes.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>En la era de la explosión de la información, no dejamos de producir voz, imágenes, vídeos y otros datos no estructurados. ¿Cómo analizar eficazmente esta cantidad masiva de datos? La aparición de las redes neuronales permite incorporar datos no estructurados en forma de vectores, y la base de datos Milvus es un software básico de servicio de datos, que ayuda a completar el almacenamiento, la búsqueda y el análisis de datos vectoriales.</p>
<p>Pero, ¿cómo podemos utilizar rápidamente la base de datos vectorial Milvus?</p>
<p>Algunos usuarios se han quejado de que las API son difíciles de memorizar y esperan que pueda haber líneas de comandos sencillas para manejar la base de datos Milvus.</p>
<p>Estamos encantados de presentar Milvus_CLI, una herramienta de línea de comandos dedicada a la base de datos vectorial Milvus.</p>
<p>Milvus_CLI es una cómoda CLI de base de datos para Milvus, que soporta la conexión a la base de datos, la importación de datos, la exportación de datos y el cálculo de vectores utilizando comandos interactivos en shells. La última versión de Milvus_CLI tiene las siguientes características.</p>
<ul>
<li><p>Soporta todas las plataformas, incluyendo Windows, Mac y Linux</p></li>
<li><p>Soporta la instalación en línea y fuera de línea con pip</p></li>
<li><p>Portátil, puede utilizarse en cualquier lugar</p></li>
<li><p>Basado en el SDK de Milvus para Python</p></li>
<li><p>Documentos de ayuda incluidos</p></li>
<li><p>Soporte de autocompletado</p></li>
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
    </button></h2><p>Puede instalar Milvus_CLI en línea o fuera de línea.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Instalar Milvus_CLI en línea</h3><p>Ejecute el siguiente comando para instalar Milvus_CLI en línea con pip. Se requiere Python 3.8 o posterior.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Instalar Milvus_CLI sin conexión</h3><p>Para instalar Milvus_CLI offline, <a href="https://github.com/milvus-io/milvus_cli/releases">descargue</a> primero el último tarball de la página de lanzamiento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Una vez descargado el tarball, ejecute el siguiente comando para instalar Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Una vez instalado Milvus_CLI, ejecute <code translate="no">milvus_cli</code>. El prompt <code translate="no">milvus_cli &gt;</code> que aparece indica que la línea de comandos está lista.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Si está utilizando un Mac con el chip M1 o un PC sin un entorno Python, puede optar por utilizar una aplicación portátil en su lugar. Para ello, <a href="https://github.com/milvus-io/milvus_cli/releases">descarga</a> un archivo en la página de versiones correspondiente a tu sistema operativo, ejecuta <code translate="no">chmod +x</code> en el archivo para hacerlo ejecutable y ejecuta <code translate="no">./</code> en el archivo para ejecutarlo.</p>
<h4 id="Example" class="common-anchor-header"><strong>Ejemplo</strong></h4><p>El siguiente ejemplo convierte <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> en ejecutable y lo ejecuta.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Uso<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Conectarse a Milvus</h3><p>Antes de conectarse a Milvus, asegúrese de que Milvus está instalado en su servidor. Consulte <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Instalar Milvus Standalone</a> o <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Instalar Milvus Cluster</a> para más información.</p>
<p>Si Milvus está instalado en su localhost con el puerto por defecto, ejecute <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>De lo contrario, ejecute el siguiente comando con la dirección IP de su servidor Milvus. El siguiente ejemplo utiliza <code translate="no">172.16.20.3</code> como dirección IP y <code translate="no">19530</code> como número de puerto.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Crear una colección</h3><p>Esta sección presenta cómo crear una colección.</p>
<p>Una colección consta de entidades y es similar a una tabla en RDBMS. Consulte <a href="https://milvus.io/docs/v2.0.x/glossary.md">el Glosario</a> para obtener más información.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Ejemplo</h4><p>El siguiente ejemplo crea una colección llamada <code translate="no">car</code>. La colección <code translate="no">car</code> tiene cuatro campos que son <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code>, y <code translate="no">brand</code>. El campo de clave principal es <code translate="no">id</code>. Para obtener más información, consulte <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">Crear colección</a>.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Listar colecciones</h3><p>Ejecute el siguiente comando para listar todas las colecciones en esta instancia de Milvus.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Ejecute el siguiente comando para comprobar los detalles de la colección <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Calcular la distancia entre dos vectores</h3><p>Ejecute el siguiente comando para importar datos a la colección <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Ejecute <code translate="no">query</code> e introduzca <code translate="no">car</code> como nombre de la colección y <code translate="no">id&gt;0</code> como expresión de consulta cuando se le solicite. Los ID de las entidades que cumplen los criterios se devuelven como se muestra en la siguiente figura.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Ejecute <code translate="no">calc</code> e introduzca los valores apropiados cuando se le solicite para calcular las distancias entre matrices de vectores.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Borrar una colección</h3><p>Ejecute el siguiente comando para eliminar la colección <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Más<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI no se limita a las funciones anteriores. Ejecute <code translate="no">help</code> para ver todos los comandos que incluye Milvus_CLI y sus respectivas descripciones. Ejecute <code translate="no">&lt;command&gt; --help</code> para ver los detalles de un comando especificado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Véase también:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Referencia de comandos</a> de Milvus_CLI en Milvus Docs</p>
<p>Esperamos que Milvus_CLI pueda ayudarle a utilizar fácilmente la base de datos vectorial Milvus. Seguiremos optimizando Milvus_CLI y sus contribuciones son bienvenidas.</p>
<p>Si tiene alguna pregunta, no dude en <a href="https://github.com/zilliztech/milvus_cli/issues">presentar una incidencia</a> en GitHub.</p>
