---
id: building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
title: >-
  De los documentos al diálogo: Creación de un asistente de inteligencia
  artificial listo para la producción con Spring Boot y Milvus
author: Gong Yi
date: 2025-06-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/From_Docs_to_Dialogue_Building_an_AI_Assistant_with_Spring_and_Milvus_b8a470549a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Spring Boot'
meta_title: |
  Building a Production-Ready AI Assistant with Spring Boot and Milvus
desc: >-
  Mediante la combinación de Spring Boot, Milvus y Ollama, convertimos
  documentos empresariales estáticos en conversaciones dinámicas y conscientes
  del contexto, con capacidad de observación, memoria y seguridad integradas.
origin: >-
  https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
---
<p>Todas las empresas tienen el mismo problema: conocimientos valiosos atrapados en PDF, documentos de Word y archivos compartidos que nadie puede encontrar cuando los necesita. Los equipos de soporte responden a las mismas preguntas una y otra vez, mientras que los desarrolladores pierden horas buscando en documentación obsoleta.</p>
<p><strong>¿Y si sus documentos pudieran responder directamente a las preguntas?</strong></p>
<p>Este tutorial le muestra cómo crear un asistente de IA listo para la producción que:</p>
<ul>
<li><p>Transforma tus documentos estáticos en un sistema inteligente de preguntas y respuestas.</p></li>
<li><p>Mantiene el contexto y la memoria de la conversación</p></li>
<li><p>Escala para manejar cargas de trabajo empresariales</p></li>
<li><p>Incluye seguridad, supervisión y capacidad de observación desde el primer momento.</p></li>
</ul>
<h2 id="What-Well-Build" class="common-anchor-header">Qué construiremos<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Al final de este tutorial, usted tendrá:</p>
<ul>
<li><p>Un canal de ingesta de documentos que procesa PDF y documentos de Word</p></li>
<li><p>Un sistema de búsqueda vectorial impulsado por Milvus para la búsqueda semántica</p></li>
<li><p>Una API de chat con memoria y conocimiento del contexto</p></li>
<li><p>Seguridad y supervisión de nivel empresarial</p></li>
<li><p>Un ejemplo de trabajo completo que puede implementar</p></li>
</ul>
<h2 id="Key-Components-We’ll-Use" class="common-anchor-header">Componentes clave que utilizaremos<button data-href="#Key-Components-We’ll-Use" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/spring-projects/spring-boot"><strong>Spring Boot</strong></a> es un marco Java ampliamente utilizado para crear aplicaciones backend con una configuración mínima. Ofrece una gran productividad a los desarrolladores, una integración perfecta con herramientas modernas y compatibilidad integrada con API REST, capacidad de observación y seguridad.</p></li>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a> es una base de datos vectorial de código abierto, de alto rendimiento y nativa de la nube diseñada para la búsqueda semántica. Permite almacenar y buscar incrustaciones con una latencia de milisegundos, incluso en miles de millones de vectores.</p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>RAG</strong></a> es una arquitectura que combina recuperación y generación: obtiene fragmentos de conocimiento relevantes de una base de datos vectorial como Milvus y, a continuación, utiliza un modelo lingüístico para elaborar una respuesta fluida y contextual.</p></li>
<li><p><a href="https://ollama.com/"><strong>Ollama</strong></a>: Proveedor local de modelos de IA (compatible con OpenAI, totalmente gratuito)</p></li>
</ul>
<h2 id="Prerequisites" class="common-anchor-header">Requisitos previos<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de empezar, asegúrate de tener</p>
<ul>
<li><p>Java 17+ instalado</p></li>
<li><p>Docker, Docker Compose</p></li>
<li><p>Git para clonar el repositorio de ejemplo</p></li>
<li><p>Ollama instalado y ejecutándose localmente</p></li>
<li><p>Milvus (a través de Docker)</p></li>
<li><p>Spring Boot 3.5.0 + Spring AI 1.0.0</p></li>
<li><p>Micrometer, Testcontainers</p></li>
</ul>
<h2 id="Environment-Setup" class="common-anchor-header">Configuración del entorno<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Clone el Repositorio de Ejemplo/: <a href="https://github.com/topikachu/spring-ai-rag">https://github.com/topikachu/spring-ai-rag</a></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/spring-ai-rag
<span class="hljs-built_in">cd</span> spring-ai-rag
<button class="copy-code-btn"></button></code></pre>
<p>Verifique su entorno:</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Docker is running correctly</span>
docker version
docker ps

<span class="hljs-comment"># Verify Java version</span>
java -version

<span class="hljs-comment"># Verify Ollama installation</span>
ollama --version
<button class="copy-code-btn"></button></code></pre>
<p>Descargue Ollama Models:</p>
<pre><code translate="no"><span class="hljs-comment"># Pull required models for this project</span>
ollama pull mistral          <span class="hljs-comment"># Chat model</span>
ollama pull nomic-embed-text <span class="hljs-comment"># Embedding model</span>

<span class="hljs-comment"># Verify models are available</span>
ollama <span class="hljs-built_in">list</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuración de claves (application.properties)</p>
<pre><code translate="no"><span class="hljs-comment"># Ollama Configuration (OpenAI-compatible API)</span>
spring.ai.openai.base-url=http://localhost:<span class="hljs-number">11434</span>
spring.ai.openai.chat.options.model=mistral
spring.ai.openai.embedding.options.model=nomic-embed-text
spring.ai.openai.embedding.options.dimensions=<span class="hljs-number">768</span>

<span class="hljs-comment"># Vector Store Configuration - dimensions must match embedding model</span>
spring.ai.vectorstore.milvus.embedding-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Document-ETL-Structuring-Unstructured-Text" class="common-anchor-header">ETL de documentos: estructuración de texto no estructurado<button data-href="#Document-ETL-Structuring-Unstructured-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta sección recorre el corazón del sistema: la transformación de archivos no estructurados en respuestas inteligentes con capacidad de búsqueda utilizando incrustaciones vectoriales, indexación Milvus y canalización RAG de Spring AI.</p>
<p><strong>Resumen del flujo de trabajo:</strong></p>
<ul>
<li><p>Utilice <code translate="no">TikaDocReader</code> para leer archivos PDF y Word.</p></li>
<li><p>Uso de la división basada en tokens para fragmentar documentos conservando el contexto.</p></li>
<li><p>Generar incrustaciones utilizando el modelo de incrustación compatible con OpenAI.</p></li>
<li><p>Almacenar las incrustaciones en Milvus para búsquedas semánticas posteriores.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_7e9f990b18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ejemplo de implementación</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">Document</span>&gt; <span class="hljs-title function_">ingestionFlux</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> documentReader.<span class="hljs-title function_">getDocuments</span>()
          .<span class="hljs-title function_">flatMap</span>(<span class="hljs-variable language_">document</span> -&gt; {
            <span class="hljs-keyword">var</span> processChunks = <span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">fromRunnable</span>(() -&gt; {
              <span class="hljs-keyword">var</span> chunks = textSplitter.<span class="hljs-title function_">apply</span>(<span class="hljs-title class_">List</span>.<span class="hljs-title function_">of</span>(<span class="hljs-variable language_">document</span>));
              vectorStore.<span class="hljs-title function_">write</span>(chunks); <span class="hljs-comment">// expensive operation</span>
            }).<span class="hljs-title function_">subscribeOn</span>(<span class="hljs-title class_">Schedulers</span>.<span class="hljs-title function_">boundedElastic</span>());

            <span class="hljs-keyword">return</span> <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">concat</span>(
                    <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">just</span>(<span class="hljs-variable language_">document</span>),
                    processChunks.<span class="hljs-title function_">then</span>(<span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">empty</span>())
            );
          })
          .<span class="hljs-title function_">doOnComplete</span>(() -&gt; log.<span class="hljs-title function_">info</span>(<span class="hljs-string">&quot;RunIngestion() finished&quot;</span>))
          .<span class="hljs-title function_">doOnError</span>(e -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error during ingestion&quot;</span>, e));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="common-anchor-header">Almacenamiento vectorial: Búsqueda semántica a escala de milisegundos con Milvus<button data-href="#Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ejemplo de configuración:</p>
<pre><code translate="no">spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">initialize</span>-schema=<span class="hljs-literal">true</span>
spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">embedding</span>-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<p>📌 <strong>Ejemplo:</strong> Cuando un usuario pregunta &quot;¿Soporta Spring Boot programación reactiva con WebFlux?&quot;, Milvus devuelve segmentos de documentación relacionados, y el modelo de IA genera una respuesta en lenguaje natural con detalles específicos de implementación.</p>
<h2 id="Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="common-anchor-header">Creación de un chat habilitado para RAG: Preguntas y respuestas contextuales con integración de memoria<button data-href="#Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Flujo de trabajo principal:</p>
<ol>
<li><p>El usuario envía una pregunta</p></li>
<li><p>La búsqueda vectorial recupera los fragmentos de documentos más relevantes.</p></li>
<li><p>El sistema carga el contexto de conversaciones anteriores (a través de Redis)</p></li>
<li><p>El modelo de IA genera una respuesta que incluye tanto el contexto nuevo como el histórico.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_a_rag_chat_workflow_976dcd9aa2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ejemplo de integración de recuperación + chat de memoria:</p>
<pre><code translate="no">public <span class="hljs-title class_">ChatClient</span>.<span class="hljs-property">ChatClientRequestSpec</span> <span class="hljs-title function_">input</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
  <span class="hljs-keyword">return</span> chatClient.<span class="hljs-title function_">prompt</span>()
          .<span class="hljs-title function_">advisors</span>(
                  messageChatMemoryAdvisor,
                  retrievalAugmentationAdvisor
          )
          .<span class="hljs-title function_">advisors</span>(spec -&gt; spec.<span class="hljs-title function_">param</span>(<span class="hljs-variable constant_">CONVERSATION_ID</span>, conversationId))
          .<span class="hljs-title function_">user</span>(userInput);
}
<button class="copy-code-btn"></button></code></pre>
<p>Para una experiencia de frontend más fluida, utilice la API de flujo reactivo para devolver contenido de <code translate="no">Flux</code> a través de eventos enviados por el servidor (SSE), ideal para efectos de "tipeo":</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">stream</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">input</span>(userInput, conversationId)
            .<span class="hljs-title function_">stream</span>().<span class="hljs-title function_">content</span>();
}
<button class="copy-code-btn"></button></code></pre>
<p>Controlador de API REST:</p>
<pre><code translate="no">@<span class="hljs-title class_">PostMapping</span>(path = <span class="hljs-string">&quot;/chat&quot;</span>, produces = <span class="hljs-title class_">MediaType</span>.<span class="hljs-property">TEXT_EVENT_STREAM_VALUE</span>)
public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">chat</span>(<span class="hljs-params">@RequestBody ChatRequest chatRequest, @RequestParam() <span class="hljs-built_in">String</span> conversationId, Principal principal</span>) {
  <span class="hljs-keyword">var</span> conversationKey = <span class="hljs-title class_">String</span>.<span class="hljs-title function_">format</span>(<span class="hljs-string">&quot;%s:%s&quot;</span>, principal.<span class="hljs-title function_">getName</span>(), conversationId);
  <span class="hljs-keyword">return</span> chatService.<span class="hljs-title function_">stream</span>(chatRequest.<span class="hljs-property">userInput</span>, conversationKey)
          .<span class="hljs-title function_">doOnError</span>(exp -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error in chat&quot;</span>, exp));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enterprise-Grade-API-Security-and-System-Observability" class="common-anchor-header">Seguridad de API de nivel empresarial y observabilidad del sistema<button data-href="#Enterprise-Grade-API-Security-and-System-Observability" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta sección garantiza que su asistente de IA no sólo funcione, sino que se ejecute de forma segura, sea rastreable y funcione con cargas de trabajo reales.</p>
<h3 id="API-Security-Role-Based-Access-Control" class="common-anchor-header">Seguridad de la API: Control de acceso basado en roles</h3><p><strong>Ejemplo: Cómo proteger los puntos finales de administración</strong></p>
<pre><code translate="no"><span class="hljs-meta">@Override</span>
<span class="hljs-keyword">protected</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">configure</span><span class="hljs-params">(HttpSecurity http)</span> <span class="hljs-keyword">throws</span> Exception {
    http
        .httpBasic()
        .and()
        .authorizeRequests(authz -&gt; authz
            .antMatchers(<span class="hljs-string">&quot;/api/v1/index&quot;</span>).hasRole(<span class="hljs-string">&quot;ADMIN&quot;</span>)
            .anyRequest().authenticated()
        );
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Consejo de producción:</strong> Para despliegues en el mundo real, utilice OAuth2 o JWT para una autenticación escalable.</p>
<h3 id="Observability-Full-Stack-Tracing-and-Metrics" class="common-anchor-header">Observabilidad: Rastreo y métricas de toda la pila</h3><p><strong>Rastreo:</strong> Usaremos OpenTelemetry JavaAgent para rastrear los flujos de solicitud completos desde el chat del usuario hasta la búsqueda de Milvus y la respuesta de LLM, incluidos los tramos de gRPC:</p>
<pre><code translate="no">-javaagent:&lt;path/to/opentelemetry-javaagent.jar&gt; \
-Dotel.metrics.exporter=none \
-Dotel.logs.exporter=none
<button class="copy-code-btn"></button></code></pre>
<p><strong>Métricas:</strong> Micrometer expone automáticamente métricas compatibles con Prometheus:</p>
<ul>
<li>Tiempo de respuesta del modelo</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP gen_ai_client_operation_seconds  </span>
<span class="hljs-comment"># TYPE gen_ai_client_operation_seconds summary</span>
gen_ai_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Tiempo de recuperación de vectores</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP db_vector_client_operation_seconds</span>
<span class="hljs-comment"># TYPE db_vector_client_operation_seconds summary</span>
db_vector_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuración:</p>
<pre><code translate="no">management.endpoints.web.exposure.include=prometheus
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>Nota técnica:</strong> Spring Boot 3.2 introduce arrancadores OTEL, pero no cubren gRPC (utilizado por Milvus). Para garantizar la visibilidad de extremo a extremo, este proyecto utiliza el enfoque JavaAgent.</p>
<h2 id="Running-the-Project-End-to-End-Execution" class="common-anchor-header">Ejecución del proyecto: Ejecución de extremo a extremo<button data-href="#Running-the-Project-End-to-End-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Inicie el sistema completo</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> OPENAI_API_KEY=dummy
<span class="hljs-built_in">export</span> SPRING_PROFILES_ACTIVE=ollama-openai
ollama pull mistral            <span class="hljs-comment"># Pull chat model</span>
ollama pull nomic-embed-text   <span class="hljs-comment"># Pull embedding model</span>

mvn clean <span class="hljs-built_in">test</span> package
docker compose up -d
java -javaagent:target/otel/opentelemetry-javaagent.jar -Dotel.metrics.exporter=none -Dotel.logs.exporter=none  -Dinput.directory=<span class="hljs-variable">$PWD</span>/src/test/resources/corpus  -jar target/rag-0.0.1-SNAPSHOT.jar

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/index&#x27;</span> \
--user <span class="hljs-string">&quot;admin:password&quot;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--data <span class="hljs-string">&#x27;{}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support FLAT type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support HNSW type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl <span class="hljs-string">&quot;http://localhost:8080/actuator/prometheus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para ver la interfaz de usuario de seguimiento, abra<a href="http://localhost:16686/"> http://localhost:16686/</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/To_view_tracing_UI_686e8f54b9.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Ahora tienes un asistente de IA listo para producción que transforma documentos estáticos en conversaciones inteligentes. El sistema incluye:</p>
<p>✅ <strong>Procesamiento de documentos</strong>: Ingestión y vectorización automatizadas <strong>✅ Búsqueda semántica</strong>: Recuperación rápida y precisa con Milvus ✅ <strong>Memoria de conversaciones</strong>: Experiencias de chat conscientes del contexto ✅ <strong>Seguridad empresarial</strong>: Autenticación y control de acceso</p>
<p>✅ O <strong>bservabilidad</strong> completa: Monitorización, rastreo y métricas</p>
<p>Combinando Spring Boot, Milvus y Ollama, convertimos documentos empresariales estáticos en conversaciones dinámicas y conscientes del contexto, con plena observabilidad, memoria y seguridad integradas.</p>
<p>Tanto si está creando copilotos internos, asistentes específicos de dominio o bots de atención al cliente, esta arquitectura está diseñada para escalar su carga de trabajo y mantenerle en control de sus datos.</p>
<p>¿Tiene curiosidad por saber qué puede hacer Milvus por su pila de IA? Explore el<a href="https://milvus.io"> proyecto de código abierto Milvus</a>, pruebe<a href="https://zilliz.com"> Milvus gestionado (Zilliz Cloud</a>) para disfrutar de una experiencia sin complicaciones o únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> para obtener más guías prácticas como esta.</p>
