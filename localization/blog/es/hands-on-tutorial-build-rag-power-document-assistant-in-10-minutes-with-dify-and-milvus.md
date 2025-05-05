---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Tutorial práctico: Construya un Asistente de Documentos potenciado por RAG en
  10 minutos con Dify y Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Aprenda a crear un asistente de documentos impulsado por IA utilizando
  Retrieval Augmented Generation (RAG) con Dify y Milvus en este rápido y
  práctico tutorial para desarrolladores.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¿Y si pudieras convertir toda tu biblioteca de documentación -miles de páginas de especificaciones técnicas, wikis internas y documentación de código- en un asistente inteligente de inteligencia artificial que respondiera al instante a preguntas concretas?</p>
<p>Mejor aún, ¿y si pudiera construirlo en menos tiempo del que se tarda en solucionar un conflicto de fusión?</p>
<p>Esa es la promesa de la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Generación Aumentada de Recuperación</a> (RAG) cuando se implementa de la manera correcta.</p>
<p>Si bien ChatGPT y otros LLM son impresionantes, alcanzan rápidamente sus límites cuando se les pregunta por la documentación, el código base o la base de conocimientos específicos de su empresa. La RAG salva esta brecha integrando los datos de su propiedad en la conversación, proporcionándole capacidades de IA que son directamente relevantes para su trabajo.</p>
<p>¿Cuál es el problema? La implementación tradicional de RAG se parece a esto</p>
<ul>
<li><p>Escribir pipelines personalizados de generación de incrustaciones</p></li>
<li><p>Configurar y desplegar una base de datos vectorial</p></li>
<li><p>Diseñar plantillas de avisos complejas</p></li>
<li><p>Construir la lógica de recuperación y los umbrales de similitud</p></li>
<li><p>Crear una interfaz utilizable</p></li>
</ul>
<p>Pero, ¿y si pudiera ir directamente a los resultados?</p>
<p>En este tutorial, crearemos una aplicación RAG sencilla utilizando dos herramientas orientadas al desarrollador:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Una plataforma de código abierto que maneja la orquestación RAG con una configuración mínima</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: Una rapidísima base de datos vectorial de código abierto diseñada especialmente para la búsqueda de similitudes y las búsquedas de IA.</p></li>
</ul>
<p>Al final de esta guía de 10 minutos, tendrás un asistente de IA funcional que puede responder preguntas detalladas sobre cualquier colección de documentos que le lances, sin necesidad de un título en aprendizaje automático.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Lo que construirás<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>En sólo unos minutos de trabajo activo, crearás:</p>
<ul>
<li><p>Un canal de procesamiento de documentos que convierte cualquier PDF en conocimiento consultable.</p></li>
<li><p>Un sistema de búsqueda vectorial que encuentra exactamente la información correcta</p></li>
<li><p>Una interfaz de chatbot que responde a preguntas técnicas con precisión milimétrica</p></li>
<li><p>Una solución desplegable que puede integrar con sus herramientas existentes</p></li>
</ul>
<p>¿Y lo mejor? La mayor parte se configura a través de una sencilla interfaz de usuario (UI) en lugar de código personalizado.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Qué necesitará<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Conocimientos básicos de Docker (sólo nivel <code translate="no">docker-compose up -d</code> )</p></li>
<li><p>Una clave de API de OpenAI</p></li>
<li><p>Un documento PDF con el que experimentar (usaremos un artículo de investigación)</p></li>
</ul>
<p>¿Listo para construir algo realmente útil en un tiempo récord? ¡Empecemos!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Construyendo tu aplicación RAG con Milvus y Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>En esta sección, construiremos una simple aplicación RAG con Dify, donde podremos hacer preguntas sobre la información contenida en un documento de investigación. Para el artículo de investigación, puedes utilizar cualquier artículo que desees; sin embargo, en este caso, utilizaremos el famoso artículo que nos introdujo a la arquitectura Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;.</p>
<p>Utilizaremos Milvus como almacenamiento de vectores, donde almacenaremos todos los contextos necesarios. Para el modelo de incrustación y el LLM, usaremos modelos de OpenAI. Por lo tanto, necesitamos configurar primero una clave API de OpenAI. Puedes aprender más sobre cómo configurarla<a href="https://platform.openai.com/docs/quickstart"> aquí</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Paso 1: Iniciando Dify y Milvus Containers</h3><p>En este ejemplo, vamos a auto-alojar Dify con Docker Compose. Por lo tanto, antes de empezar, asegúrese de que Docker está instalado en su máquina local. Si no lo tienes, instala Docker consultando<a href="https://docs.docker.com/desktop/"> su página de instalación</a>.</p>
<p>Una vez que tengamos Docker instalado, necesitamos clonar el código fuente de Dify en nuestra máquina local con el siguiente comando:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Después, ve al directorio <code translate="no">docker</code> dentro del código fuente que acabas de clonar. Ahí, necesitas copiar el archivo <code translate="no">.env</code> con el siguiente comando:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>En pocas palabras, el archivo <code translate="no">.env</code> contiene las configuraciones necesarias para poner en marcha tu aplicación Dify, tales como la selección de bases de datos de vectores, las credenciales necesarias para acceder a tu base de datos de vectores, la dirección de tu aplicación Dify, etc.</p>
<p>Ya que vamos a utilizar Milvus como nuestra base de datos de vectores, entonces necesitamos cambiar el valor de la variable <code translate="no">VECTOR_STORE</code> dentro del archivo <code translate="no">.env</code> a <code translate="no">milvus</code>. Además, tenemos que cambiar la variable <code translate="no">MILVUS_URI</code> a <code translate="no">http://host.docker.internal:19530</code> para asegurar que no hay ningún problema de comunicación entre los contenedores Docker más tarde después de la implementación.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ahora estamos listos para iniciar los contenedores Docker. Para ello, todo lo que tenemos que hacer es ejecutar el comando <code translate="no">docker compose up -d</code>. Después de que termine, verás una salida similar en tu terminal como la de abajo:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Podemos comprobar el estado de todos los contenedores y ver si están funcionando correctamente con el comando <code translate="no">docker compose ps</code>. Si todos están sanos, verás una salida como la siguiente:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Y finalmente, si nos dirigimos a<a href="http://localhost/install"> </a>http://localhost/install, verás una página de aterrizaje de Dify donde podemos registrarnos y comenzar a construir nuestra aplicación RAG en poco tiempo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez que te hayas registrado, sólo tienes que iniciar sesión en Dify con tus credenciales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Paso 2: Configurar la clave API de OpenAI</h3><p>Lo primero que tenemos que hacer después de registrarnos en Dify es configurar nuestras claves API que utilizaremos para llamar al modelo de incrustación, así como al LLM. Como vamos a utilizar modelos de OpenAI, necesitamos insertar nuestra clave API de OpenAI en nuestro perfil. Para ello, ve a "Configuración" pasando el cursor sobre tu perfil en la parte superior derecha de la interfaz de usuario, como puedes ver en la siguiente captura de pantalla:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A continuación, ve a "Proveedor de modelos", sitúa el cursor sobre OpenAI y haz clic en "Configurar". Verás una pantalla emergente en la que se te pedirá que introduzcas tu clave de API de OpenAI. Una vez hecho esto, estaremos listos para utilizar los modelos de OpenAI como modelo de incrustación y LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Paso 3: Inserción de documentos en la base de conocimientos</h3><p>Ahora vamos a almacenar la base de conocimientos para nuestra aplicación RAG. La base de conocimiento consiste en una colección de documentos o textos internos que pueden ser utilizados como contextos relevantes para ayudar al LLM a generar respuestas más precisas.</p>
<p>En nuestro caso de uso, nuestra base de conocimientos es esencialmente el documento "La atención es todo lo que necesitas". Sin embargo, no podemos almacenar el documento tal cual debido a múltiples razones. En primer lugar, el artículo es demasiado largo, y dar un contexto demasiado largo al LLM no ayudaría, ya que el contexto es demasiado amplio. En segundo lugar, no podemos realizar búsquedas de similitud para obtener el contexto más relevante si nuestra entrada es texto sin formato.</p>
<p>Por lo tanto, hay al menos dos pasos que debemos dar antes de almacenar nuestro artículo en la base de conocimientos. En primer lugar, hay que dividir el documento en fragmentos de texto y, a continuación, transformar cada fragmento en una incrustación mediante un modelo de incrustación. Por último, podemos almacenar estas incrustaciones en Milvus como nuestra base de datos vectorial.</p>
<p>Dify nos facilita la tarea de dividir los textos del artículo en fragmentos y convertirlos en incrustaciones. Todo lo que tenemos que hacer es cargar el archivo PDF del artículo, establecer la longitud del trozo y elegir el modelo de incrustación mediante un control deslizante. Para ello, ve a &quot;Conocimiento&quot; y haz clic en &quot;Crear conocimiento&quot;. A continuación, se le pedirá que cargue el archivo PDF desde su ordenador local. Por lo tanto, es mejor que descargues el artículo de ArXiv y lo guardes primero en tu ordenador.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez cargado el archivo, podemos establecer la longitud del fragmento, el método de indexación, el modelo de incrustación que deseamos utilizar y la configuración de recuperación.</p>
<p>En el área "Configuración de trozos", puedes elegir cualquier número como longitud máxima del trozo (en nuestro caso, lo fijaremos en 100). A continuación, en "Método de indexación", debemos elegir la opción "Alta calidad", ya que nos permitirá realizar búsquedas por similitud para encontrar contextos relevantes. Para "Modelo de incrustación", puedes elegir cualquier modelo de incrustación de OpenAI que desees, pero en este ejemplo, vamos a utilizar el modelo text-embedding-3-small. Por último, para "Retrieval Setting", tenemos que elegir "Vector Search", ya que queremos realizar búsquedas por similitud para encontrar los contextos más relevantes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora, si haces clic en "Guardar y procesar" y todo va bien, verás que aparece una marca verde como se muestra en la siguiente captura de pantalla:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Paso 4: Creación de la aplicación RAG</h3><p>Hasta este punto, hemos creado con éxito una base de conocimientos y la hemos almacenado dentro de nuestra base de datos Milvus. Ahora estamos listos para crear la aplicación RAG.</p>
<p>Crear la aplicación RAG con Dify es muy sencillo. Necesitamos ir a "Studio" en lugar de "Knowledge" como antes, y luego hacer click en "Create from Blank". Luego, elige "Chatbot" como el tipo de app y dale un nombre a tu App dentro del campo provisto. Una vez que hayas terminado, haz clic en "Crear". Ahora verás la siguiente página:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En el campo "Instrucción", podemos escribir una instrucción del sistema como "Responder a la consulta del usuario de forma concisa". A continuación, como "Contexto", tenemos que hacer clic en el símbolo "Añadir" y, a continuación, añadir la base de conocimientos que acabamos de crear. De esta forma, nuestra aplicación RAG obtendrá posibles contextos de esta base de conocimientos para responder a la consulta del usuario.</p>
<p>Ahora que hemos añadido la base de conocimiento a nuestra aplicación RAG, lo último que tenemos que hacer es elegir el LLM de OpenAI. Para ello, puedes hacer clic en la lista de modelos disponible en la esquina superior derecha, como puedes ver en la siguiente captura de pantalla:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¡Y ahora estamos listos para publicar nuestra aplicación RAG! En la esquina superior derecha, haz clic en "Publicar", y allí encontrarás muchas formas de publicar nuestra aplicación RAG: podemos simplemente ejecutarla en un navegador, incrustarla en nuestro sitio web o acceder a la aplicación a través de la API. En este ejemplo, simplemente ejecutaremos nuestra app en un navegador, así que podemos hacer clic en &quot;Run App&quot;.</p>
<p>Y ya está. Ahora puedes preguntar al LLM cualquier cosa relacionada con el documento "La atención es todo lo que necesitas" o con cualquier documento incluido en nuestra base de conocimientos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora has construido una aplicación RAG funcional utilizando Dify y Milvus, con un mínimo de código y configuración. Este enfoque hace que la compleja arquitectura RAG sea accesible a los desarrolladores sin requerir una profunda experiencia en bases de datos vectoriales o integración LLM. Puntos clave a tener en cuenta:</p>
<ol>
<li><strong>Baja sobrecarga de configuración</strong>: El uso de Docker Compose simplifica la implantación</li>
<li><strong>Orquestación sin código/con código reducido</strong>: Dify se encarga de la mayor parte del proceso RAG</li>
<li><strong>Base de datos vectorial lista para la producción</strong>: Milvus proporciona un almacenamiento y una recuperación de incrustaciones eficientes</li>
<li><strong>Arquitectura extensible</strong>: Fácil de añadir documentos o ajustar parámetros Para el despliegue de producción, considere:</li>
</ol>
<ul>
<li>Configurar la autenticación para su aplicación</li>
<li>Configurar el escalado adecuado para Milvus (especialmente para grandes colecciones de documentos)</li>
<li>Implementar la supervisión de sus instancias de Dify y Milvus</li>
<li>La combinación de Dify y Milvus permite el rápido desarrollo de aplicaciones RAG que pueden aprovechar eficazmente el conocimiento interno de su organización con grandes modelos lingüísticos modernos (LLM). ¡Feliz construcción!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Recursos adicionales<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Documentación de Dify</a></li>
<li><a href="https://milvus.io/docs">Documentación de Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Fundamentos de la base de datos vectorial</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Patrones de implementación de RAG</a></li>
</ul>
