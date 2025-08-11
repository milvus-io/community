---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  ¿Agentes o flujos de trabajo de IA? Por qué debería prescindir de los agentes
  en el 80% de las tareas de automatización
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  La integración de Refly y Milvus ofrece un enfoque pragmático de la
  automatización, que valora más la fiabilidad y la facilidad de uso que la
  complejidad innecesaria.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>Los agentes de inteligencia artificial están por todas partes, desde copilotos de codificación a robots de atención al cliente, y pueden ser asombrosamente buenos en el razonamiento complejo. Como a muchos de ustedes, me encantan. Pero después de construir tanto agentes como flujos de trabajo de automatización, he aprendido una verdad muy simple: <strong>los agentes no son la mejor solución para todos los problemas.</strong></p>
<p>Por ejemplo, cuando construí un sistema multiagente con CrewAI para decodificar ML, las cosas se complicaron rápidamente. Los agentes de investigación ignoraban los rastreadores web el 70% del tiempo. Los agentes de resumen dejaban caer las citas. La coordinación se vino abajo cuando las tareas no estaban claras.</p>
<p>Y no sólo en los experimentos. Muchos de nosotros ya estamos rebotando entre ChatGPT para la lluvia de ideas, Claude para la codificación y media docena de API para el procesamiento de datos, pensando en silencio: <em>tiene que haber una manera mejor de hacer que todo esto funcione junto.</em></p>
<p>A veces, la respuesta es un agente. Más a menudo, es un <strong>flujo de trabajo de IA bien diseñado</strong> que une las herramientas existentes en algo potente, sin la complejidad impredecible.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Creación de flujos de trabajo de IA más inteligentes con Refly y Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sé que algunos de ustedes ya están sacudiendo la cabeza: "¿Flujos de trabajo? Son rígidos. No son lo suficientemente inteligentes para una verdadera automatización de IA". Es cierto, la mayoría de los flujos de trabajo son rígidos porque se basan en el modelo de las cadenas de montaje de la vieja escuela: paso A → paso B → paso C, sin desviación permitida.</p>
<p>Pero el verdadero problema no es la <em>idea</em> de los flujos de trabajo, sino <em>su ejecución</em>. No tenemos por qué conformarnos con procesos lineales y frágiles. Podemos diseñar flujos de trabajo más inteligentes que se adapten al contexto, se flexibilicen con creatividad y sigan ofreciendo resultados predecibles.</p>
<p>En esta guía, construiremos un sistema completo de creación de contenidos utilizando Refly y Milvus para demostrar por qué los flujos de trabajo de IA pueden superar a las complejas arquitecturas multiagente, especialmente si se preocupa por la velocidad, la fiabilidad y la capacidad de mantenimiento.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Las herramientas que utilizamos</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Una plataforma de creación de contenidos nativa de IA y de código abierto construida en torno a un concepto de "lienzo libre".</p>
<ul>
<li><p><strong>Funciones principales:</strong> lienzo inteligente, gestión del conocimiento, diálogo multihilo y herramientas de creación profesional.</p></li>
<li><p><strong>Por qué es útil:</strong> La creación de flujos de trabajo mediante arrastrar y soltar le permite encadenar herramientas en secuencias de automatización cohesivas, sin encerrarle en una ejecución rígida de un solo camino.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: Una base de datos vectorial de código abierto que gestiona la capa de datos.</p>
<ul>
<li><p><strong>Por qué es importante:</strong> La creación de contenidos consiste principalmente en encontrar y recombinar información existente. Las bases de datos tradicionales manejan bien los datos estructurados, pero la mayor parte del trabajo creativo implica formatos no estructurados: documentos, imágenes, vídeos.</p></li>
<li><p><strong>Qué aporta:</strong> Milvus aprovecha los modelos de incrustación integrados para codificar datos no estructurados como vectores, lo que permite la búsqueda semántica para que sus flujos de trabajo puedan recuperar el contexto relevante con una latencia de milisegundos. A través de protocolos como MCP, se integra a la perfección con sus marcos de IA, permitiéndole consultar datos en lenguaje natural en lugar de luchar con la sintaxis de las bases de datos.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configuración del entorno</h3><p>Permítame guiarle a través de la configuración local de este flujo de trabajo.</p>
<p><strong>Lista de comprobación de configuración rápida:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (o Linux similar)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Una clave API de cualquier LLM que soporte llamadas a funciones. En esta guía, utilizaré el LLM de <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Requisitos del sistema</strong></p>
<ul>
<li><p>CPU: 8 núcleos mínimo (16 núcleos recomendado)</p></li>
<li><p>Memoria: 16GB mínimo (32GB recomendado)</p></li>
<li><p>Almacenamiento: 100 GB SSD mínimo (500 GB recomendados)</p></li>
<li><p>Red: Se requiere conexión estable a Internet</p></li>
</ul>
<p><strong>Dependencias de software</strong></p>
<ul>
<li><p>Sistema operativo: Linux (se recomienda Ubuntu 20.04+)</p></li>
<li><p>Contenedores: Docker + Docker Compose</p></li>
<li><p>Python: Versión 3.11 o superior</p></li>
<li><p>Modelo de lenguaje: Cualquier modelo que admita llamadas a funciones (tanto los servicios en línea como el despliegue fuera de línea de Ollama funcionan)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Paso 1: Despliegue de la base de datos vectorial Milvus</h3><p><strong>1.1 Descargar Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Inicie los servicios Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Paso 2: Despliegue de la plataforma Refly</h3><p><strong>2.1 Clonar el repositorio</strong></p>
<p>Puede utilizar los valores predeterminados para todas las variables de entorno a menos que tenga requisitos específicos:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Verificar el estado del servicio</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Paso 3: Configurar los servicios MCP</h3><p><strong>3.1 Descargue el servidor Milvus MCP</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Iniciar el servicio MCP</strong></p>
<p>Este ejemplo utiliza el modo SSE. Sustituya el URI por su punto final de servicio Milvus disponible:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Confirme que el servicio MCP se está ejecutando</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Paso 4: Configuración e instalación</h3><p>Ahora que su infraestructura está en funcionamiento, configuremos todo para que funcione a la perfección.</p>
<p><strong>4.1 Acceso a la plataforma Refly</strong></p>
<p>Acceda a su instancia local de Refly:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Cree su cuenta</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Configure su modelo de idioma</strong></p>
<p>Para esta guía, utilizaremos <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. En primer lugar, regístrese y obtenga su clave API.</p>
<p><strong>4.4 Añada su proveedor de modelos</strong></p>
<p>Introduce la clave API que has obtenido en el paso anterior:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Configurar el modelo LLM</strong></p>
<p>Asegúrese de seleccionar un modelo que admita capacidades de llamada a funciones, ya que esto es esencial para las integraciones de flujo de trabajo que construiremos:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Integrar el servicio Milvus-MCP</strong></p>
<p>Tenga en cuenta que la versión web no admite conexiones de tipo stdio, por lo que utilizaremos el punto final HTTP que configuramos anteriormente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¡Excelente! Con todo configurado, veamos este sistema en acción a través de algunos ejemplos prácticos.</p>
<p><strong>4.7 Ejemplo: Recuperación eficiente de vectores con MCP-Milvus-Server</strong></p>
<p>Este ejemplo muestra cómo el <strong>MCP-Milvus-Server</strong> funciona como middleware entre sus modelos de IA y las instancias de la base de datos vectorial de Milvus. Actúa como un traductor, aceptando peticiones en lenguaje natural de su modelo de IA, convirtiéndolas en las consultas correctas a la base de datos y devolviendo los resultados, de modo que sus modelos pueden trabajar con datos vectoriales sin conocer la sintaxis de la base de datos.</p>
<p><strong>4.7.1 Crear un nuevo lienzo</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Iniciar una conversación</strong></p>
<p>Abre la interfaz de diálogo, selecciona tu modelo, introduce tu pregunta y envía.</p>
<p><strong>4.7.3 Revisar los resultados</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lo que está sucediendo aquí es bastante notable: acabamos de mostrar el control mediante lenguaje natural de una base de datos vectorial Milvus utilizando <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> como capa de integración. No hay sintaxis de consulta compleja, simplemente dígale al sistema lo que necesita en un lenguaje sencillo y él se encargará de las operaciones de la base de datos por usted.</p>
<p><strong>4.8 Ejemplo 2: Creación de una guía de despliegue Refly con flujos de trabajo</strong></p>
<p>Este segundo ejemplo muestra la verdadera potencia de la orquestación de flujos de trabajo. Crearemos una guía de implantación completa combinando varias herramientas de IA y fuentes de datos en un proceso único y coherente.</p>
<p><strong>4.8.1 Reúna los materiales de origen</strong></p>
<p>La potencia de Refly reside en su flexibilidad a la hora de manejar distintos formatos de entrada. Puede importar recursos en múltiples formatos, ya sean documentos, imágenes o datos estructurados.</p>
<p><strong>4.8.2 Crear tareas y vincular tarjetas de recursos</strong></p>
<p>Ahora crearemos nuestro flujo de trabajo definiendo tareas y conectándolas a nuestros materiales de origen.</p>
<p><strong>4.8.3 Establecer tres tareas de procesamiento</strong></p>
<p>Aquí es donde realmente brilla el enfoque del flujo de trabajo. En lugar de tratar de manejar todo en un proceso complejo, dividimos el trabajo en tres tareas centradas que integran los materiales cargados y los perfeccionan sistemáticamente.</p>
<ul>
<li><p><strong>Tarea de integración de contenidos</strong>: Combina y estructura los materiales de origen.</p></li>
<li><p><strong>Tarea de perfeccionamiento</strong> del<strong>contenido</strong>: mejora la claridad y la fluidez.</p></li>
<li><p><strong>Compilación del borrador final</strong>: Creación de un resultado listo para su publicación</p></li>
</ul>
<p>Los resultados hablan por sí solos. Lo que habría llevado horas de coordinación manual entre varias herramientas ahora se realiza de forma automática, y cada paso se basa lógicamente en el anterior.</p>
<p><strong>Flujo de trabajo multimodal:</strong></p>
<ul>
<li><p><strong>Generación y procesamiento de imágenes</strong>: Integración con modelos de alta calidad como flux-schnell, flux-pro y SDXL.</p></li>
<li><p><strong>Generación y comprensión de vídeo</strong>: Compatibilidad con varios modelos de vídeo estilizado, como Seedance, Kling y Veo.</p></li>
<li><p><strong>Herramientas de generación de audio</strong>: Generación de música mediante modelos como Lyria-2 y síntesis de voz mediante modelos como Chatterbox</p></li>
<li><p><strong>Procesamiento integrado</strong>: Todos los resultados multimodales pueden referenciarse, analizarse y reprocesarse dentro del sistema.</p></li>
</ul>
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
    </button></h2><p>La integración de <strong>Refly</strong> y <strong>Milvus</strong> ofrece un enfoque pragmático de la automatización, que valora más la fiabilidad y la facilidad de uso que la complejidad innecesaria. Al combinar la orquestación del flujo de trabajo con el procesamiento multimodal, los equipos pueden pasar del concepto a la publicación con mayor rapidez, manteniendo el control total en cada etapa.</p>
<p>No se trata de descartar los agentes de IA. Son valiosos para abordar problemas realmente complejos e impredecibles. Pero para muchas necesidades de automatización, especialmente en la creación de contenidos y el procesamiento de datos, un flujo de trabajo bien diseñado puede ofrecer mejores resultados con menos gastos generales.</p>
<p>A medida que evoluciona la tecnología de IA, es probable que los sistemas más eficaces combinen ambas estrategias:</p>
<ul>
<li><p><strong>Flujos de trabajo</strong> en los que la previsibilidad, el mantenimiento y la reproducibilidad son fundamentales.</p></li>
<li><p><strong>Agentes</strong> en los que se requiere razonamiento real, adaptabilidad y resolución abierta de problemas.</p></li>
</ul>
<p>El objetivo no es construir la IA más llamativa, sino la más <em>útil</em>. Y a menudo, la solución más útil es también la más sencilla.</p>
