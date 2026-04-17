---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Cómo contribuir a Milvus: Inicio rápido para desarrolladores'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> es una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> de código abierto diseñada para gestionar datos vectoriales de alta dimensión. Tanto si está creando motores de búsqueda inteligentes, sistemas de recomendación o soluciones de IA de última generación como la generación aumentada de recuperación<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), Milvus es una potente herramienta al alcance de su mano.</p>
<p>Pero lo que realmente hace avanzar a Milvus no es sólo su avanzada tecnología, sino la vibrante y apasionada <a href="https://zilliz.com/community">comunidad de desarrolladores</a> que hay detrás. Como proyecto de código abierto, Milvus prospera y evoluciona gracias a las contribuciones de desarrolladores como usted. Cada corrección de errores, adición de funciones y mejora del rendimiento de la comunidad hace que Milvus sea más rápido, más escalable y más fiable.</p>
<p>Si le apasiona el código abierto, está deseoso de aprender o quiere tener un impacto duradero en la IA, Milvus es el lugar perfecto para contribuir. Esta guía le guiará a través del proceso, desde la configuración de su entorno de desarrollo hasta el envío de su primera pull request. También destacaremos los retos comunes a los que puede enfrentarse y le proporcionaremos soluciones para superarlos.</p>
<p>¿Listo para sumergirse? ¡Mejoremos Milvus juntos!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Configuración de su entorno de desarrollo de Milvus<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo primero es lo primero: configurar su entorno de desarrollo. Puede instalar Milvus en su máquina local o utilizar Docker; ambos métodos son sencillos, pero también necesitará instalar algunas dependencias de terceros para que todo funcione.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Construir Milvus localmente</h3><p>Si le gusta construir cosas desde cero, construir Milvus en su máquina local es una brisa. Milvus lo hace fácil agrupando todas las dependencias en el script <code translate="no">install_deps.sh</code>. Aquí está la configuración rápida:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Construyendo Milvus con Docker</h3><p>Si prefiere Docker, hay dos maneras de hacerlo: puede ejecutar comandos en un contenedor pre-construido o hacer girar un contenedor de desarrollo para un enfoque más práctico.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Notas sobre la plataforma:</strong> Si usted está en Linux, usted es bueno para ir-compilación problemas son bastante raros. Sin embargo, los usuarios de Mac, especialmente con chips M1, pueden encontrarse con algunos baches en el camino. No te preocupes, tenemos una guía que te ayudará a resolver los problemas más comunes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Configuración del sistema operativo</em></p>
<p>Para obtener la guía de configuración completa, consulte la <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Guía de desarrollo</a> oficial <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">de Milvus</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Problemas comunes y cómo solucionarlos</h3><p>A veces, la configuración de su entorno de desarrollo Milvus no va tan bien como estaba previsto. No se preocupe - aquí hay un rápido resumen de los problemas comunes que puede encontrar y cómo solucionarlos rápidamente.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Desconexión inesperada al leer un paquete de banda lateral</h4><p>Si estás usando Homebrew y ves un error como este:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Solución:</strong> Aumenta el tamaño de <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Si también te encuentras con <code translate="no">Brew: command not found</code> después de instalar Homebrew, puede que necesites configurar tu usuario Git:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: Error Getting Credentials</h4><p>Cuando trabajes con Docker, puede que veas esto:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Solución:</strong> Abre<code translate="no">~/.docker/config.json</code> y elimina el campo <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: No Module Named 'imp</h4><p>Si Python arroja este error, es porque Python 3.12 eliminó el módulo <code translate="no">imp</code>, que algunas dependencias antiguas todavía utilizan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Arreglar:</strong> Actualizar a Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Argumentos no reconocidos o comando no encontrado</h4><p><strong>Problema:</strong> Si ves <code translate="no">Unrecognized arguments: --install-folder conan</code>, es probable que estés usando una versión de Conan incompatible.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Solución:</strong> Actualiza a Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Problema:</strong> Si ves <code translate="no">Conan command not found</code>, significa que tu entorno Python no está configurado correctamente.</p>
<p><strong>Corrección:</strong> Añade el directorio bin de Python a tu <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Uso de identificador no declarado 'kSecFormatOpenSSL'.</h4><p>Este error suele significar que tus dependencias de LLVM no están actualizadas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Solución:</strong> Reinstala LLVM 15 y actualiza tus variables de entorno:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Consejos profesionales</strong></p>
<ul>
<li><p>Comprueba siempre las versiones y dependencias de tus herramientas.</p></li>
<li><p>Si algo sigue sin funcionar, la<a href="https://github.com/milvus-io/milvus/issues"> página Milvus GitHub Issues</a> es un gran lugar para encontrar respuestas o pedir ayuda.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Configuración de VS Code para la integración de C++ y Go</h3><p>Conseguir que C++ y Go trabajen juntos en VS Code es más fácil de lo que parece. Con la configuración correcta, puede agilizar su proceso de desarrollo para Milvus. Sólo tiene que modificar su archivo <code translate="no">user.settings</code> con la configuración siguiente:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Esto es lo que hace esta configuración</p>
<ul>
<li><p><strong>Variables de entorno:</strong> Establece rutas para <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, y <code translate="no">RPATH</code>, que son críticas para localizar bibliotecas durante las construcciones y pruebas.</p></li>
<li><p><strong>Integración de herramientas Go:</strong> Habilita el servidor de lenguaje Go (<code translate="no">gopls</code>) y configura herramientas como <code translate="no">gofumpt</code> para formateo y <code translate="no">golangci-lint</code> para linting.</p></li>
<li><p><strong>Configuración de pruebas:</strong> Añade <code translate="no">testTags</code> y aumenta el tiempo de espera para ejecutar pruebas a 10 minutos.</p></li>
</ul>
<p>Una vez añadida, esta configuración garantiza una integración perfecta entre los flujos de trabajo de C++ y Go. Es perfecta para construir y probar Milvus sin tener que ajustar constantemente el entorno.</p>
<p><strong>Consejo profesional</strong></p>
<p>Después de configurar esto, ejecute una construcción de prueba rápida para confirmar que todo funciona. Si algo no funciona, vuelva a comprobar las rutas y la versión de la extensión Go de VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Desplegando Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus soporta <a href="https://milvus.io/docs/install-overview.md">tres modos de despliegue: Lite</a><strong>, Standalone</strong> y <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> es una biblioteca Python y una versión ultraligera de Milvus. Es perfecto para la creación rápida de prototipos en Python o entornos de cuaderno y para experimentos locales a pequeña escala.</p></li>
<li><p><strong>Milvus Standalone</strong> es la opción de despliegue de un solo nodo para Milvus, utilizando un modelo cliente-servidor. Es el equivalente Milvus de MySQL, mientras que Milvus Lite es como SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> es el modo distribuido de Milvus, ideal para usuarios empresariales que construyen sistemas de bases de datos vectoriales a gran escala o plataformas de datos vectoriales.</p></li>
</ul>
<p>Todas estas implementaciones se basan en tres componentes principales:</p>
<ul>
<li><p><strong>Milvus:</strong> El motor de base de datos vectorial que dirige todas las operaciones.</p></li>
<li><p><strong>Etcd:</strong> El motor de metadatos que gestiona los metadatos internos de Milvus.</p></li>
<li><p><strong>MinIO</strong>: el motor de almacenamiento que garantiza la persistencia de los datos.</p></li>
</ul>
<p>Cuando se ejecuta en modo <strong>distribuido</strong>, Milvus también incorpora <strong>Pulsar</strong> para el procesamiento de mensajes distribuidos utilizando un mecanismo Pub/Sub, lo que lo hace escalable para entornos de alto rendimiento.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus autónomo</h3><p>El modo Standalone está diseñado para configuraciones de una sola instancia, por lo que es perfecto para pruebas y aplicaciones a pequeña escala. He aquí cómo empezar:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (anteriormente conocido como Milvus Cluster)</h3><p>Para conjuntos de datos más grandes y mayor tráfico, el modo Distribuido ofrece escalabilidad horizontal. Combina múltiples instancias de Milvus en un único sistema cohesivo. El despliegue se facilita con <strong>Milvus Operator</strong>, que se ejecuta en Kubernetes y gestiona toda la pila Milvus por usted.</p>
<p>¿Desea una guía paso a paso? Consulte la <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Guía de instalación de Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Ejecución de pruebas de extremo a extremo (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que su despliegue Milvus está en funcionamiento, probar su funcionalidad es muy fácil con las pruebas E2E. Estas pruebas cubren cada parte de su instalación para asegurar que todo funciona como se espera. A continuación se explica cómo ejecutarlas:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Para obtener instrucciones detalladas y consejos para la resolución de problemas, consulte la <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Guía de desarrollo de Milvus</a>.</p>
<p><strong>Consejo profesional</strong></p>
<p>Si es nuevo en Milvus, empiece con Milvus Lite o el modo Standalone para hacerse una idea de sus capacidades antes de escalar al modo Distributed para cargas de trabajo a nivel de producción.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Enviar su código<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>¡Enhorabuena! Ha superado todas las pruebas unitarias y E2E (o depurado y recompilado según sea necesario). Aunque la primera compilación puede llevar algún tiempo, las siguientes serán mucho más rápidas, así que no hay de qué preocuparse. Con todo aprobado, ¡está listo para enviar sus cambios y contribuir a Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Vincule su Pull Request (PR) a una incidencia</h3><p>Cada PR para Milvus necesita estar vinculado a un problema relevante. He aquí cómo hacerlo:</p>
<ul>
<li><p><strong>Busque problemas existentes:</strong> Revise el<a href="https://github.com/milvus-io/milvus/issues"> rastreador de problemas de</a> Milvus para ver si ya existe un problema relacionado con sus cambios.</p></li>
<li><p><strong>Cree una nueva incidencia:</strong> Si no existe ninguna incidencia relevante, abra una nueva y explique el problema que está resolviendo o la función que está añadiendo.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Envío del código</h3><ol>
<li><p><strong>Bifurque el repositorio:</strong> Comience por bifurcar el<a href="https://github.com/milvus-io/milvus"> repositorio de Milvus</a> en su cuenta de GitHub.</p></li>
<li><p><strong>Crea una rama:</strong> Clone su bifurcación localmente y cree una nueva rama para sus cambios.</p></li>
<li><p><strong>Confirme con la firma "Signed-off-by":</strong> Asegúrese de que sus confirmaciones incluyen una firma <code translate="no">Signed-off-by</code> para cumplir con la licencia de código abierto:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Este paso certifica que tu contribución se ajusta al Certificado de Origen para Desarrolladores (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Recursos útiles</strong></h4><p>Para conocer los pasos detallados y las mejores prácticas, consulte la<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Guía de contribución de Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Oportunidades para contribuir<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Felicitaciones-¡Ya tiene Milvus funcionando! Ha explorado sus modos de despliegue, ejecutado sus pruebas, y tal vez incluso profundizado en el código. Ahora es el momento de subir de nivel: contribuya a <a href="https://github.com/milvus-io/milvus">Milvus</a> y ayude a dar forma al futuro de la IA y <a href="https://zilliz.com/learn/introduction-to-unstructured-data">los datos no estructurados</a>.</p>
<p>Independientemente de sus habilidades, ¡hay un lugar para usted en la comunidad Milvus! Tanto si eres un desarrollador al que le encanta resolver retos complejos, un redactor técnico al que le encanta escribir documentación limpia o blogs de ingeniería, o un entusiasta de Kubernetes que busca mejorar los despliegues, hay una forma de que tengas un impacto.</p>
<p>Eche un vistazo a las oportunidades a continuación y encuentre su combinación perfecta. Cada contribución ayuda a Milvus a avanzar, ¿y quién sabe? Su próxima solicitud de extracción podría impulsar la próxima ola de innovación. Entonces, ¿a qué espera? ¡Pongámonos manos a la obra! 🚀</p>
<table>
<thead>
<tr><th>Proyectos</th><th>Adecuado para</th><th>Directrices</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Desarrolladores de Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Desarrolladores de CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-node, milvus-sdk-java</a></td><td>Desarrolladores interesados en otros lenguajes</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Contribuyendo a PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Entusiastas de Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Escritores técnicos</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Contribuir a milvus docs</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Desarrolladores web</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Unas palabras finales<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ofrece varios <a href="https://milvus.io/docs/install-pymilvus.md">SDKs-Python</a> (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a>, y <a href="https://milvus.io/docs/install-node.md">Node.js-que</a>hacen que sea sencillo empezar a construir. Contribuir a Milvus no se trata solo de código, se trata de unirse a una comunidad vibrante e innovadora.</p>
<p>🚀¡Bienvenido a la comunidad de desarrolladores de Milvus y feliz programación! Estamos impacientes por ver lo que vas a crear.</p>
<h2 id="Further-Reading" class="common-anchor-header">Más información<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Únete a la comunidad de desarrolladores de IA de Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">¿Qué son las bases de datos vectoriales y cómo funcionan?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Independiente vs. Distribuido: ¿Qué modo es el adecuado para usted? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Construya aplicaciones de IA con Milvus: tutoriales y cuadernos</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modelos de IA de alto rendimiento para sus aplicaciones GenAI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">¿Qué es RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centro de recursos de IA Generativa | Zilliz</a></p></li>
</ul>
