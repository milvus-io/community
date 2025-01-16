---
id: embedded-milvus.md
title: >-
  Uso de Milvus embebido para instalar y ejecutar instantáneamente Milvus con
  Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Una versión de Milvus fácil de usar para Python que flexibiliza la
  instalación.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/soothing-rain/">Alex Gao</a> y <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Milvus es una base de datos vectorial de código abierto para aplicaciones de IA. Ofrece una variedad de métodos de instalación, incluyendo la construcción desde el código fuente y la instalación de Milvus con Docker Compose/Helm/APT/YUM/Ansible. Los usuarios pueden elegir uno de los métodos de instalación en función de sus sistemas operativos y preferencias. Sin embargo, hay muchos científicos de datos e ingenieros de IA en la comunidad Milvus que trabajan con Python y anhelan un método de instalación mucho más simple que los disponibles actualmente.</p>
<p>Por lo tanto, lanzamos Milvus embebido, una versión de Python fácil de usar, junto con Milvus 2.1 para empoderar a más desarrolladores de Python en nuestra comunidad. Este artículo presenta qué es Milvus embebido y proporciona instrucciones sobre cómo instalarlo y utilizarlo.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Una visión general de Milvus embebido</a><ul>
<li><a href="#When-to-use-embedded-Milvus">¿Cuándo utilizar Milvus incrustado?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Comparación de los distintos modos de Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Cómo instalar Milvus integrado</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Iniciar y detener Milvus integrado</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Visión general de Milvus integrado<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<a href="https://github.com/milvus-io/embd-milvus">incrustado</a> le permite instalar y utilizar rápidamente Milvus con Python. Puede crear rápidamente una instancia de Milvus y le permite iniciar y detener el servicio Milvus cuando lo desee. Todos los datos y registros se conservan incluso si detiene Milvus incrustado.</p>
<p>Milvus incrustado no tiene dependencias internas y no requiere preinstalar y ejecutar dependencias de terceros como etcd, MinIO, Pulsar, etc.</p>
<p>Todo lo que haga con Milvus embebido, y cada pieza de código que escriba para él se puede migrar con seguridad a otros modos de Milvus - independiente, clúster, versión en la nube, etc. Esto refleja una de las características más distintivas de Milvus embebido - <strong>"Escribir una vez, ejecutar en cualquier lugar".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">¿Cuándo utilizar Milvus embebido?</h3><p>Milvus embebido y <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> están construidos para diferentes propósitos. Puede considerar elegir Milvus embebido en los siguientes escenarios:</p>
<ul>
<li><p>Quiere usar Milvus sin instalar Milvus de ninguna de las formas que se proporcionan <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">aquí</a>.</p></li>
<li><p>Quiere utilizar Milvus sin mantener un proceso Milvus de larga duración en su máquina.</p></li>
<li><p>Quiere utilizar Milvus rápidamente sin iniciar un proceso Milvus separado y otros componentes necesarios como etcd, MinIO, Pulsar, etc.</p></li>
</ul>
<p>Se sugiere que <strong>NO</strong> utilice Milvus incrustado:</p>
<ul>
<li><p>En un entorno de producción.<em>(Para utilizar Milvus para producción, considere Milvus cluster o <a href="https://zilliz.com/cloud">Zilliz cloud</a>, un servicio Milvus totalmente gestionado</em>).</p></li>
<li><p>Si tiene una gran demanda de rendimiento.<em>(Comparativamente hablando, Milvus incrustado podría no proporcionar el mejor rendimiento</em>).</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Comparación de los distintos modos de Milvus</h3><p>La siguiente tabla compara varios modos de Milvus: independiente, clúster, Milvus integrado y la Nube de Zilliz, un servicio Milvus totalmente gestionado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>comparación</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">¿Cómo instalar Milvus integrado?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de instalar Milvus embebido, debe asegurarse de que tiene instalado Python 3.6 o posterior. Embedded Milvus es compatible con los siguientes sistemas operativos:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Si se cumplen los requisitos, puede ejecutar <code translate="no">$ python3 -m pip install milvus</code> para instalar Milvus embebido. También puede añadir la versión en el comando para instalar una versión específica de Milvus embebido. Por ejemplo, si desea instalar la versión 2.1.0, ejecute <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. Y más tarde, cuando se publique una nueva versión de Milvus embebido, también puede ejecutar <code translate="no">$ python3 -m pip install --upgrade milvus</code> para actualizar Milvus embebido a la última versión.</p>
<p>Si usted es un antiguo usuario de Milvus que ya ha instalado PyMilvus anteriormente y desea instalar Milvus embebido, puede ejecutar <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>Después de ejecutar el comando de instalación, necesita crear una carpeta de datos para Milvus embebido bajo <code translate="no">/var/bin/e-milvus</code> ejecutando el siguiente comando:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Iniciar y detener Milvus incrustado<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando la instalación se haya realizado correctamente, podrá iniciar el servicio.</p>
<p>Si es la primera vez que ejecuta Milvus incrustado, primero debe importar Milvus y configurar Milvus incrustado.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Si ha iniciado con éxito Milvus incrustado antes y vuelve a reiniciarlo, puede ejecutar directamente <code translate="no">milvus.start()</code> después de importar Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Verá la siguiente salida si ha iniciado correctamente el servicio Milvus incrustado.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Después de que se inicie el servicio, puede iniciar otra ventana de terminal y ejecutar el código de ejemplo de &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hola Milvus</a>&quot; para jugar con Milvus embebido.</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Cuando haya terminado de utilizar Milvus incrustado, le recomendamos que lo detenga y limpie las variables de entorno ejecutando el siguiente comando o pulsando Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
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
