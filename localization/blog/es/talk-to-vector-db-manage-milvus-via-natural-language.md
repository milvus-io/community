---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: >-
  Hable con su base de datos vectorial: Gestión de Milvus mediante lenguaje
  natural
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server conecta Milvus directamente con asistentes de codificación
  AI como Claude Code y Cursor a través de MCP. Puede gestionar Milvus mediante
  lenguaje natural.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>¿Alguna vez ha deseado poder decirle a su asistente de IA: <em>"Muéstreme todas las colecciones de mi base de datos de vectores"</em> o <em>"Encuentre documentos similares a este texto"</em> y que realmente funcione?</p>
<p>El <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Servidor MCP de Milvus</strong></a> lo hace posible conectando su base de datos vectorial Milvus directamente a los asistentes de codificación de IA como Claude Desktop y Cursor IDE a través del Protocolo de Contexto de Modelo (MCP). En lugar de escribir código <code translate="no">pymilvus</code>, puede gestionar todo su Milvus a través de conversaciones en lenguaje natural.</p>
<ul>
<li><p>Sin Milvus MCP Server: Escribiendo scripts Python con pymilvus SDK para buscar vectores</p></li>
<li><p>Con Milvus MCP Server: "Buscar documentos similares a este texto en mi colección".</p></li>
</ul>
<p>👉 <strong>Repositorio GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>Y si estás usando <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus gestionado), también te tenemos cubierto. Al final de este blog, también presentaremos <strong>Zilliz MCP Server</strong>, una opción gestionada que funciona perfectamente con Zilliz Cloud. Entremos en materia.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Qué obtendrá con Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server proporciona a su asistente de IA las siguientes capacidades:</p>
<ul>
<li><p><strong>Listar y explorar</strong> colecciones de vectores</p></li>
<li><p><strong>Buscar vectores</strong> utilizando similitud semántica</p></li>
<li><p><strong>Crear nuevas colecciones</strong> con esquemas personalizados</p></li>
<li><p><strong>Insertar y gestionar</strong> datos de vectores</p></li>
<li><p><strong>Ejecutar consultas complejas</strong> sin escribir código</p></li>
<li><p>Y mucho más</p></li>
</ul>
<p>Todo a través de una conversación natural, como si estuvieras hablando con un experto en bases de datos. Consulte <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">este repositorio</a> para ver la lista completa de funciones.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Guía de inicio rápido<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><p><strong>Requeridos:</strong></p>
<ul>
<li><p>Python 3.10 o superior</p></li>
<li><p>Una instancia Milvus en ejecución (local o remota)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">Gestor de paquetes uv</a> (recomendado)</p></li>
</ul>
<p><strong>Aplicaciones de IA compatibles:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>Cursor IDE</p></li>
<li><p>Cualquier aplicación compatible con MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Pila tecnológica que utilizaremos</h3><p>En este tutorial, utilizaremos la siguiente pila tecnológica:</p>
<ul>
<li><p><strong>Lenguaje Runtime:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Gestor de paquetes:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursor</p></li>
<li><p><strong>Servidor MCP:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Base de datos vectorial:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Paso 1: Instalar dependencias</h3><p>En primer lugar, instale el gestor de paquetes uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>O:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verifique la instalación:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Paso 2: Configurar Milvus</h3><p><a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto nativa para cargas de trabajo de IA, creada por <a href="https://zilliz.com/">Zilliz</a>. Diseñada para gestionar entre millones y miles de millones de registros vectoriales, cuenta con más de 36.000 estrellas en GitHub. Sobre esta base, Zilliz también ofrece <a href="https://zilliz.com/cloud">Zilliz Cloud, un</a>servicio totalmente gestionado de Milvus diseñado para ofrecer facilidad de uso, rentabilidad y seguridad con una arquitectura nativa en la nube.</p>
<p>Para conocer los requisitos de despliegue de Milvus, visite <a href="https://milvus.io/docs/prerequisite-docker.md">esta guía en el sitio doc.</a></p>
<p><strong>Requisitos mínimos:</strong></p>
<ul>
<li><p><strong>Software:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Disco:</strong> 100GB+</p></li>
</ul>
<p>Descargue el archivo YAML de despliegue:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Inicie Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Su instancia de Milvus estará disponible en <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Paso 3: Instalar el servidor MCP</h3><p>Clone y pruebe el servidor MCP:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Recomendamos instalar las dependencias y verificar localmente antes de registrar el servidor en Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si ves que el servidor se inicia correctamente, estás listo para configurar tu herramienta AI.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Paso 4: Configure su Asistente AI</h3><p><strong>Opción A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Instale Claude Desktop desde <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Abra el archivo de configuración:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Añada esta configuración:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Reiniciar Claude Desktop</li>
</ol>
<p><strong>Opción B: Cursor IDE</strong></p>
<ol>
<li><p>Abra Configuración de Cursor → Características → MCP.</p></li>
<li><p>Añada un nuevo servidor MCP global (esto crea <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>Añada esta configuración:</p></li>
</ol>
<p>Nota: Ajuste las rutas a su estructura de archivos real.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parámetros:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> es la ruta al ejecutable uv</li>
<li><code translate="no">--directory</code> es la ruta al proyecto clonado</li>
<li><code translate="no">--milvus-uri</code> es el punto final de su servidor Milvus</li>
</ul>
<ol start="4">
<li>Reinicie el Cursor o recargue la ventana</li>
</ol>
<p><strong>Consejo profesional:</strong> Encuentre su ruta <code translate="no">uv</code> con <code translate="no">which uv</code> en macOS/Linux o <code translate="no">where uv</code> en Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Paso 5: Véalo en acción</h3><p>Una vez configurado, pruebe estos comandos de lenguaje natural:</p>
<ul>
<li><p><strong>Explore su base de datos:</strong> "¿Qué colecciones tengo en mi base de datos Milvus?"</p></li>
<li><p><strong>Cree una nueva colección:</strong> "Crear una colección llamada 'artículos' con campos para título (cadena), contenido (cadena) y un campo vectorial de 768 dimensiones para incrustaciones".</p></li>
<li><p><strong>Buscar contenidos similares:</strong> "Buscar los cinco artículos más similares a 'aplicaciones de aprendizaje automático' en mi colección de artículos".</p></li>
<li><p><strong>Insertar datos:</strong> "Añadir un nuevo artículo con el título 'Tendencias de IA 2024' y el contenido 'La inteligencia artificial sigue evolucionando...' a la colección de artículos"</p></li>
</ul>
<p><strong>Lo que antes requería más de 30 minutos de codificación, ahora requiere segundos de conversación.</strong></p>
<p>Obtendrá control en tiempo real y acceso en lenguaje natural a Milvus, sin necesidad de escribir código o aprender la API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Solución de problemas<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Si las herramientas MCP no aparecen, reinicie completamente su aplicación AI, verifique la ruta UV con <code translate="no">which uv</code>, y pruebe el servidor manualmente con <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>En caso de errores de conexión, compruebe que Milvus se está ejecutando con <code translate="no">docker ps | grep milvus</code>, intente utilizar <code translate="no">127.0.0.1</code> en lugar de <code translate="no">localhost</code>, y verifique que el puerto 19530 es accesible.</p>
<p>Si encuentra problemas de autenticación, establezca la variable de entorno <code translate="no">MILVUS_TOKEN</code> si su Milvus requiere autenticación, y verifique sus permisos para las operaciones que está intentando.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Alternativa gestionada: Servidor MCP Zilliz<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>El <strong>Servidor MCP de Milvus</strong> de código abierto es una gran solución para despliegues locales o autoalojados de Milvus. Pero si está utilizando <a href="https://zilliz.com/cloud">Zilliz Cloud, el</a>servicio totalmente gestionado y de nivel empresarial creado por los creadores de Milvus, existe una alternativa especialmente diseñada: el <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Servidor MCP</strong></a> de <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> elimina la sobrecarga de gestionar su propia instancia de Milvus ofreciendo una base de datos vectorial nativa de la nube escalable, de alto rendimiento y segura. Zilliz <strong>MCP Server</strong> se integra directamente con Zilliz Cloud y expone sus capacidades como herramientas compatibles con MCP. Esto significa que su asistente de IA, ya sea en Claude, Cursor u otro entorno compatible con MCP, ahora puede consultar, gestionar y organizar su espacio de trabajo de Zilliz Cloud utilizando lenguaje natural.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sin código repetitivo. Sin cambiar de pestaña. Sin escribir manualmente llamadas REST o SDK. Solo di tu solicitud y deja que tu asistente se encargue del resto.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">Cómo empezar con Zilliz MCP Server</h3><p>Si estás listo para una infraestructura de vectores lista para producción con la facilidad del lenguaje natural, empezar solo lleva unos pocos pasos:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Regístrate en Zilliz Cloud</strong></a> - nivel gratuito disponible.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Instala Zilliz MCP Server</strong> desde </a>el repositorio de GitHub.</p></li>
<li><p><strong>Configura tu asistente compatible con MCP</strong> (Claude, Cursor, etc.) para conectarte a tu instancia de Zilliz Cloud.</p></li>
</ol>
<p>Esto le da lo mejor de ambos mundos: potente búsqueda vectorial con infraestructura de grado de producción, ahora accesible a través de un lenguaje sencillo.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Para terminar<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Y eso es todo - usted acaba de aprender cómo convertir Milvus en una base de datos vectorial amigable con el lenguaje natural <em>con la</em> que literalmente puede <em>hablar</em>. Ya no tendrá que rebuscar en los documentos del SDK ni escribir código repetitivo para crear una colección o ejecutar una búsqueda.</p>
<p>Tanto si ejecuta Milvus localmente como si utiliza Zilliz Cloud, el servidor MCP proporciona a su asistente de IA una caja de herramientas para gestionar sus datos vectoriales como un profesional. Sólo tienes que escribir lo que quieres hacer, y dejar que Claude o Cursor se encarguen del resto.</p>
<p>Así que adelante, encienda su herramienta de desarrollo de IA, pregunte "¿qué colecciones tengo?" y véalo en acción. Nunca querrás volver a escribir consultas vectoriales a mano.</p>
<ul>
<li><p>¿Instalación local? Utilice el<a href="https://github.com/zilliztech/mcp-server-milvus"> servidor de</a> código abierto<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP Server</a></p></li>
<li><p>¿Prefiere un servicio gestionado? Suscríbase a Zilliz Cloud y utilice el<a href="https://github.com/zilliztech/zilliz-mcp-server"> servidor Zilliz MCP</a>.</p></li>
</ul>
<p>Ya tienes las herramientas. Ahora deja que tu IA escriba.</p>
