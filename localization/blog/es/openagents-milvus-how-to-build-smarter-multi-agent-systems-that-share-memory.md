---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: Cómo crear sistemas multiagente más inteligentes que
  comparten memoria
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Explore cómo OpenAgents permite la colaboración multiagente distribuida, por
  qué Milvus es esencial para añadir memoria escalable y cómo construir un
  sistema completo.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>La mayoría de los desarrolladores empiezan sus sistemas agénticos con un único agente y sólo más tarde se dan cuenta de que básicamente han construido un chatbot muy caro. Para tareas sencillas, un agente del estilo de ReAct funciona bien, pero enseguida se topa con sus límites: no puede ejecutar pasos en paralelo, pierde la pista de largas cadenas de razonamiento y tiende a venirse abajo en cuanto se añaden demasiadas herramientas a la mezcla. Las configuraciones multiagente prometen arreglar esto, pero traen sus propios problemas: sobrecarga de coordinación, traspasos frágiles y un contexto compartido cada vez mayor que erosiona silenciosamente la calidad del modelo.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> es un marco de código abierto para construir sistemas multiagente en los que los agentes de IA trabajan juntos, comparten recursos y abordan proyectos a largo plazo dentro de comunidades persistentes. En lugar de un único orquestador central, OpenAgents permite a los agentes colaborar de forma más distribuida: pueden descubrirse unos a otros, comunicarse y coordinarse en torno a objetivos compartidos.</p>
<p>Combinado con la base de datos vectorial <a href="https://milvus.io/">Milvus</a>, este canal adquiere una capa de memoria a largo plazo escalable y de alto rendimiento. Milvus potencia la memoria de los agentes con una búsqueda semántica rápida, opciones de indexación flexibles como HNSW e IVF, y un aislamiento limpio a través de la partición, para que los agentes puedan almacenar, recuperar y reutilizar el conocimiento sin ahogarse en el contexto o pisar los datos de los demás.</p>
<p>En este artículo, explicaremos cómo OpenAgents permite la colaboración multiagente distribuida, por qué Milvus es una base fundamental para una memoria de agente escalable y cómo montar un sistema de este tipo paso a paso.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Desafíos en la creación de sistemas de agentes del mundo real<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchos de los principales marcos de agentes actuales (LangChain, AutoGen, CrewAI y otros) se basan en un modelo <strong>centrado en tareas</strong>. Se crea un conjunto de agentes, se les asigna una tarea, tal vez se define un flujo de trabajo, y se les deja funcionar. Esto funciona bien para casos de uso limitados o de corta duración, pero en entornos de producción reales, expone tres limitaciones estructurales:</p>
<ul>
<li><p><strong>El conocimiento permanece aislado.</strong> La experiencia de un agente se limita a su propio despliegue. Un agente de revisión de código en ingeniería no comparte lo que aprende con un agente del equipo de producto que evalúa la viabilidad. Cada equipo acaba reconstruyendo sus conocimientos desde cero, lo que resulta ineficaz y frágil.</p></li>
<li><p><strong>La colaboración es rígida.</strong> Incluso en los marcos multiagente, la cooperación suele depender de flujos de trabajo definidos de antemano. Cuando la colaboración tiene que cambiar, estas reglas estáticas no pueden adaptarse, lo que resta flexibilidad a todo el sistema.</p></li>
<li><p><strong>Falta de un estado persistente.</strong> La mayoría de los agentes siguen un ciclo de vida simple: <em>iniciar → ejecutar → apagar.</em> Lo olvidan todo entre una ejecución y otra: el contexto, las relaciones, las decisiones tomadas y el historial de interacciones. Sin un estado persistente, los agentes no pueden construir una memoria a largo plazo ni evolucionar su comportamiento.</p></li>
</ul>
<p>Estos problemas estructurales provienen de tratar a los agentes como ejecutores aislados de tareas en lugar de como participantes en una red de colaboración más amplia.</p>
<p>El equipo de OpenAgents cree que los futuros sistemas de agentes necesitan algo más que un razonamiento más sólido: necesitan un mecanismo que permita a los agentes descubrirse unos a otros, establecer relaciones, compartir conocimientos y trabajar juntos de forma dinámica. Y, lo que es más importante, esto no debería depender de un único controlador central. Internet funciona porque está distribuido: ningún nodo lo dicta todo, y el sistema se hace más robusto y escalable a medida que crece. Los sistemas multiagente se benefician del mismo principio de diseño. Por eso, OpenAgents elimina la idea de un orquestador todopoderoso y, en su lugar, permite la cooperación descentralizada e impulsada por la red.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">¿Qué es OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents es un marco de código abierto para crear redes de agentes de IA que permite la colaboración abierta, en la que los agentes de IA trabajan juntos, comparten recursos y abordan proyectos a largo plazo. Proporciona la infraestructura para una Internet de agentes, en la que éstos colaboran abiertamente con millones de otros agentes en comunidades persistentes y en crecimiento. A nivel técnico, el sistema se estructura en torno a tres componentes básicos: <strong>Red de Agentes, Mods de Red y Transportes.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Red de Agentes: Un entorno compartido para la colaboración</h3><p>Una red de agentes es un entorno compartido en el que varios agentes pueden conectarse, comunicarse y trabajar juntos para resolver tareas complejas. Sus características principales son</p>
<ul>
<li><p><strong>Funcionamiento persistente:</strong> Una vez creada, la Red permanece en línea independientemente de cualquier tarea o flujo de trabajo.</p></li>
<li><p><strong>Agente dinámico:</strong> Los agentes pueden unirse en cualquier momento utilizando un ID de Red; no es necesario registrarse previamente.</p></li>
<li><p><strong>Soporte multiprotocolo:</strong> Una capa de abstracción unificada admite la comunicación a través de WebSocket, gRPC, HTTP y libp2p.</p></li>
<li><p><strong>Configuración autónoma:</strong> Cada red mantiene sus propios permisos, gobernanza y recursos.</p></li>
</ul>
<p>Con sólo una línea de código, se puede crear una Red, y cualquier agente puede unirse inmediatamente a través de interfaces estándar.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Modos de red: Extensiones enchufables para la colaboración</h3><p>Los Mods proporcionan una capa modular de características de colaboración que permanecen desacopladas del sistema central. Puede mezclar y combinar Mods en función de sus necesidades específicas, permitiendo patrones de colaboración adaptados a cada caso de uso.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Propósito</strong></th><th><strong>Casos de uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Mensajería en el espacio de trabajo</strong></td><td>Comunicación de mensajes en tiempo real</td><td>Respuestas en tiempo real, feedback instantáneo</td></tr>
<tr><td><strong>Foro</strong></td><td>Debate asíncrono</td><td>Revisión de propuestas, deliberación en varias rondas</td></tr>
<tr><td><strong>Wiki</strong></td><td>Base de conocimientos compartida</td><td>Consolidación de conocimientos, colaboración documental</td></tr>
<tr><td><strong>Social</strong></td><td>Gráfico de relaciones</td><td>Enrutamiento de expertos, redes de confianza</td></tr>
</tbody>
</table>
<p>Todos los Mods operan en un sistema de eventos unificado, lo que facilita la ampliación del marco o la introducción de comportamientos personalizados siempre que sea necesario.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transportes: Un canal de comunicación independiente del protocolo</h3><p>Los transportes son los protocolos de comunicación que permiten a agentes heterogéneos conectarse e intercambiar mensajes dentro de una red OpenAgents. OpenAgents soporta múltiples protocolos de transporte que pueden ejecutarse simultáneamente dentro de la misma red, incluyendo:</p>
<ul>
<li><p><strong>HTTP/REST</strong> para una integración amplia y multilingüe</p></li>
<li><p><strong>WebSocket</strong> para una comunicación bidireccional de baja latencia</p></li>
<li><p><strong>gRPC</strong> para RPC de alto rendimiento adaptado a clusters a gran escala</p></li>
<li><p><strong>libp2p</strong> para redes descentralizadas de igual a igual.</p></li>
<li><p><strong>A2A</strong>, un protocolo emergente diseñado específicamente para la comunicación entre agentes.</p></li>
</ul>
<p>Todos los transportes funcionan a través de un formato de mensaje unificado basado en eventos, lo que permite una traducción perfecta entre protocolos. No es necesario preocuparse por el protocolo que utiliza un agente de igual a igual: el marco de trabajo lo gestiona automáticamente. Los agentes creados en cualquier lenguaje o marco de trabajo pueden unirse a una red OpenAgents sin reescribir el código existente.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Integración de OpenAgents con Milvus para una memoria de agentes a largo plazo<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents resuelve el reto de cómo los agentes <strong>se comunican, se descubren unos a otros y colaboran, pero</strong>la colaboración por sí sola no es suficiente. Los agentes generan ideas, decisiones, historial de conversaciones, resultados de herramientas y conocimientos específicos del dominio. Sin una capa de memoria persistente, todo eso se evapora en el momento en que un agente se apaga.</p>
<p>Aquí es donde <strong>Milvus</strong> resulta esencial. Milvus proporciona el almacenamiento vectorial de alto rendimiento y la recuperación semántica necesarios para convertir las interacciones de los agentes en memoria duradera y reutilizable. Cuando se integra en la red OpenAgents, ofrece tres ventajas principales:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Búsqueda semántica</strong></h4><p>Milvus ofrece una búsqueda semántica rápida mediante algoritmos de indexación como HNSW e IVF_FLAT. Los agentes pueden recuperar los registros históricos más relevantes basándose en el significado y no en palabras clave, lo que les permite:</p>
<ul>
<li><p>Recordar decisiones o planes anteriores,</p></li>
<li><p>evitar la repetición de tareas,</p></li>
<li><p>mantener el contexto a largo plazo entre sesiones.</p></li>
</ul>
<p>Esta es la espina dorsal de la <em>memoria agéntica</em>: recuperación rápida, relevante y contextual.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Escalabilidad horizontal a escala de miles de millones</strong></h4><p>Las redes de agentes reales generan cantidades ingentes de datos. Milvus está construido para operar cómodamente a esta escala, ofreciendo:</p>
<ul>
<li><p>almacenamiento y búsqueda en miles de millones de vectores,</p></li>
<li><p>latencia &lt; 30 ms incluso con recuperación Top-K de alto rendimiento,</p></li>
<li><p>una arquitectura totalmente distribuida que escala linealmente a medida que crece la demanda.</p></li>
</ul>
<p>Tanto si tiene una docena de agentes como miles trabajando en paralelo, Milvus mantiene la recuperación rápida y consistente.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Aislamiento multiusuario</strong></h4><p>Milvus proporciona un aislamiento granular multiusuario a través de <strong>Partition Key</strong>, un mecanismo de partición ligero que segmenta la memoria dentro de una única colección. Esto permite</p>
<ul>
<li><p>que diferentes equipos, proyectos o comunidades de agentes mantengan espacios de memoria independientes,</p></li>
<li><p>reducir drásticamente la sobrecarga en comparación con el mantenimiento de múltiples colecciones,</p></li>
<li><p>recuperación opcional entre particiones cuando se necesitan conocimientos compartidos.</p></li>
</ul>
<p>Este aislamiento es crucial para grandes despliegues multiagente en los que deben respetarse los límites de los datos sin comprometer la velocidad de recuperación.</p>
<p>OpenAgents se conecta a Milvus a través de <strong>Mods personalizados</strong> que llaman directamente a las APIs de Milvus. Los mensajes de los agentes, las salidas de las herramientas y los registros de interacción se incrustan automáticamente en los vectores y se almacenan en Milvus. Los desarrolladores pueden personalizar</p>
<ul>
<li><p>el modelo de incrustación</p></li>
<li><p>el esquema de almacenamiento y los metadatos,</p></li>
<li><p>y las estrategias de recuperación (por ejemplo, búsqueda híbrida, búsqueda particionada).</p></li>
</ul>
<p>Esto proporciona a cada comunidad de agentes una capa de memoria escalable, persistente y optimizada para el razonamiento semántico.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Cómo construir un chatbot multiagente con OpenAgent y Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para concretar, veamos una demostración: crear una <strong>comunidad de asistencia a desarrolladores</strong> en la que varios agentes especializados (expertos en Python, expertos en bases de datos, ingenieros de DevOps, etc.) colaboren para responder a preguntas técnicas. En lugar de depender de un único agente generalista sobrecargado de trabajo, cada experto contribuye con un razonamiento específico del dominio, y el sistema dirige las consultas al agente más adecuado de forma automática.</p>
<p>Este ejemplo demuestra cómo integrar <strong>Milvus</strong> en un despliegue de OpenAgents para proporcionar memoria a largo plazo para preguntas y respuestas técnicas. Las conversaciones de los agentes, las soluciones anteriores, los registros de resolución de problemas y las consultas de los usuarios se convierten en incrustaciones vectoriales y se almacenan en Milvus, lo que proporciona a la red la capacidad de:</p>
<ul>
<li><p>recordar respuestas anteriores,</p></li>
<li><p>reutilizar explicaciones técnicas anteriores,</p></li>
<li><p>mantener la coherencia entre sesiones y</p></li>
<li><p>mejorar con el tiempo a medida que se acumulan más interacciones.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Requisitos previos</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Definir dependencias</h3><p>Definir los paquetes de Python necesarios para el proyecto:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Variables de entorno</h3><p>Aquí está la plantilla para la configuración de su entorno:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Configure su red OpenAgents</h3><p>Defina la estructura de su red de agentes y sus ajustes de comunicación:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Implementar la Colaboración Multi-Agente</h3><p>A continuación se muestran fragmentos de código básico (no la implementación completa).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Crear y activar un entorno virtual</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Instalación de dependencias</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurar claves API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Iniciar la red OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Iniciar el Servicio Multi-Agente</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Iniciar OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Acceder a Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Compruebe el estado de sus agentes y red:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>OpenAgents proporciona la capa de coordinación que permite a los agentes descubrirse unos a otros, comunicarse y colaborar, mientras que Milvus resuelve el problema igualmente crítico de cómo se almacena, comparte y reutiliza el conocimiento. Al ofrecer una capa de memoria vectorial de alto rendimiento, Milvus permite a los agentes crear un contexto persistente, recordar interacciones pasadas y acumular experiencia a lo largo del tiempo. Juntos, llevan a los sistemas de IA más allá de los límites de los modelos aislados y hacia el potencial de colaboración más profundo de una verdadera red multiagente.</p>
<p>Por supuesto, ninguna arquitectura multiagente está exenta de contrapartidas. Ejecutar agentes en paralelo puede aumentar el consumo de tokens, los errores pueden producirse en cascada entre los agentes y la toma simultánea de decisiones puede provocar conflictos ocasionales. Estas son áreas activas de investigación y mejora continua, pero no disminuyen el valor de la construcción de sistemas que pueden coordinar, recordar y evolucionar.</p>
<p>¿Listo para dotar a tus agentes de memoria a largo plazo?</p>
<p>Explora <a href="https://milvus.io/">Milvus</a> y prueba a integrarlo en tu propio flujo de trabajo.</p>
<p>Tienes preguntas o quieres una inmersión profunda en alguna característica? Únete a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presenta incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
