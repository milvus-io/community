---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Presentamos Milvus Lite: la versión ligera de Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Experimente la velocidad y eficacia de Milvus Lite, la variante ligera de la
  renombrada base de datos vectorial Milvus para una búsqueda de similitudes a
  la velocidad del rayo.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Nota importante</em></strong></p>
<p><em>Actualizamos Milvus Lite en junio de 2024, lo que permite a los desarrolladores de IA crear aplicaciones más rápido al tiempo que garantiza una experiencia coherente en varias opciones de implementación, incluidos Milvus en Kurbernetes, Docker y servicios gestionados en la nube. Milvus Lite también se integra con varios marcos y tecnologías de IA, agilizando el desarrollo de aplicaciones de IA con capacidades de búsqueda vectorial. Para obtener más información, consulte las siguientes referencias:</em></p>
<ul>
<li><p><em>Blog de lanzamiento de Milvus Lite: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Documentación de Milvus Lite: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Repositorio GitHub de Milvus Lite: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> es una base de datos vectorial de código abierto creada específicamente para indexar, almacenar y consultar vectores de incrustación generados por redes neuronales profundas y otros modelos de aprendizaje automático (ML) a miles de millones de escalas. Se ha convertido en una opción popular para muchas empresas, investigadores y desarrolladores que deben realizar búsquedas de similitud en conjuntos de datos a gran escala.</p>
<p>Sin embargo, algunos usuarios pueden encontrar la versión completa de Milvus demasiado pesada o compleja. Para solucionar este problema, <a href="https://github.com/matrixji">Bin Ji</a>, uno de los colaboradores más activos de la comunidad Milvus, creó <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, una versión ligera de Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">¿Qué es Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se ha mencionado anteriormente, Milvus <a href="https://github.com/milvus-io/milvus-lite">Lite</a> es una alternativa simplificada a Milvus que ofrece muchas ventajas y beneficios.</p>
<ul>
<li>Puede integrarlo en su aplicación Python sin añadir peso adicional.</li>
<li>Es autónomo y no requiere otras dependencias, gracias a la capacidad de Milvus independiente para trabajar con Etcd embebidos y almacenamiento local.</li>
<li>Puede importarlo como una biblioteca de Python y utilizarlo como un servidor independiente basado en una interfaz de línea de comandos (CLI).</li>
<li>Funciona sin problemas con Google Colab y Jupyter Notebook.</li>
<li>Puede migrar con seguridad su trabajo y escribir código en otras instancias de Milvus (versiones independientes, en clúster y totalmente gestionadas) sin riesgo de perder datos.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">¿Cuándo debería utilizar Milvus Lite?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>En concreto, Milvus Lite es más útil en las siguientes situaciones:</p>
<ul>
<li>Cuando prefiere utilizar Milvus sin técnicas y herramientas de contenedores como <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> o <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Cuando no necesita máquinas virtuales o contenedores para utilizar Milvus.</li>
<li>Cuando desea incorporar características de Milvus en sus aplicaciones Python.</li>
<li>Cuando quiera poner en marcha una instancia de Milvus en Colab o Notebook para un experimento rápido.</li>
</ul>
<p><strong>Nota</strong>: No recomendamos utilizar Milvus Lite en ningún entorno de producción o si necesita alto rendimiento, fuerte disponibilidad o alta escalabilidad. En su lugar, considere el uso de <a href="https://github.com/milvus-io/milvus">clusters Milvus</a> o <a href="https://zilliz.com/cloud">Milvus totalmente gestionado en Zilliz Cloud</a> para producción.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">¿Cómo empezar con Milvus Lite?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora, echemos un vistazo a cómo instalar, configurar y utilizar Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><p>Para utilizar Milvus Lite, asegúrese de haber cumplido los siguientes requisitos:</p>
<ul>
<li>Instalado Python 3.7 o una versión posterior.</li>
<li>Utilizar uno de los sistemas operativos verificados que se enumeran a continuación:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Notas</strong>:</p>
<ol>
<li>Milvus Lite utiliza <code translate="no">manylinux2014</code> como imagen base, por lo que es compatible con la mayoría de las distribuciones de Linux para usuarios de Linux.</li>
<li>También es posible ejecutar Milvus Lite en Windows, aunque aún no se ha verificado completamente.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Instalar Milvus Lite</h3><p>Milvus Lite está disponible en PyPI por lo que puede instalarlo a través de <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>También puede instalarlo con PyMilvus de la siguiente manera:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Utilice e inicie Milvus Lite</h3><p>Descargue el <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">cuaderno de ejemplo</a> de la carpeta de ejemplos de nuestro repositorio de proyectos. Tiene dos opciones para utilizar Milvus Lite: importarlo como una biblioteca de Python o ejecutarlo como un servidor independiente en su máquina utilizando la CLI.</p>
<ul>
<li>Para iniciar Milvus Lite como un módulo Python, ejecute los siguientes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para suspender o detener Milvus Lite, utilice la sentencia <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para iniciar Milvus Lite como un servidor autónomo basado en CLI, ejecute el siguiente comando:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Después de iniciar Milvus Lite, puede utilizar PyMilvus u otras herramientas que prefiera para conectarse al servidor autónomo.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Iniciar Milvus Lite en modo de depuración</h3><ul>
<li>Para ejecutar Milvus Lite en un modo de depuración como un Módulo Python, ejecute los siguientes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para ejecutar el servidor independiente en modo de depuración, ejecute el siguiente comando:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Persistir datos y registros</h3><ul>
<li>Para crear un directorio local para Milvus Lite que contendrá todos los datos y registros relevantes, ejecute los siguientes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para persistir todos los datos y registros generados por el servidor autónomo en su unidad local, ejecute el siguiente comando:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Configurar Milvus Lite</h3><p>Configurar Milvus Lite es similar a configurar instancias de Milvus utilizando las API de Python o la CLI.</p>
<ul>
<li>Para configurar Milvus Lite utilizando las API de Python, utilice la API <code translate="no">config.set</code> de una instancia <code translate="no">MilvusServer</code> tanto para la configuración básica como para la adicional:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para configurar Milvus Lite utilizando CLI, ejecute el siguiente comando para las configuraciones básicas:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>O, ejecute lo siguiente para configuraciones extra.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Todos los elementos configurables se encuentran en la plantilla <code translate="no">config.yaml</code> enviada con el paquete Milvus.</p>
<p>Para más detalles técnicos sobre cómo instalar y configurar Milvus Lite, consulte nuestra <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">documentación</a>.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite es una excelente opción para aquellos que buscan las capacidades de Milvus en un formato compacto. Si usted es un investigador, desarrollador o científico de datos, vale la pena explorar esta opción.</p>
<p>Milvus Lite es también una hermosa adición a la comunidad de código abierto, mostrando el extraordinario trabajo de sus colaboradores. Gracias a los esfuerzos de Bin Ji, Milvus está ahora disponible para más usuarios. Estamos impacientes por ver las ideas innovadoras que Bin Ji y otros miembros de la comunidad Milvus aportarán en el futuro.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">¡Sigamos en contacto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tiene problemas para instalar o utilizar Milvus Lite, puede <a href="https://github.com/milvus-io/milvus-lite/issues/new">presentar una incidencia aquí</a> o ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También puede unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar con nuestros ingenieros y con toda la comunidad, o consultar <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">nuestro horario de oficina de los martes</a>.</p>
